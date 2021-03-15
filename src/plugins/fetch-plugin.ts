import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {

            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                }
            })

            build.onLoad({ filter: /.css$/ }, async (args: any) => {
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
        
                if (cachedResult) {
                    return cachedResult;
                }
                const { data, request } = await axios.get(args.path)
                const escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'")
                const contents = `
                    const style = document.createElement('style')
                    style.innerText = '${escaped}'
                    document.head.appendChild(style)
                `
        
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents,
                    // find directory of package
                    resolveDir: new URL('./', request.responseURL).pathname,
                }
                // store response in cache
                await fileCache.setItem(args.path, result)
        
                return result
            });

        
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                // check to see if we already fetched this file and if its in the cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path) // use type onLoadresult so typescript knows the type
        
                if (cachedResult) {
                    return cachedResult
                }
                
                // get data from url for test pkg
                const { data, request } = await axios.get(args.path)
        
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    // modules inputs
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                }
                await fileCache.setItem(args.path, result)
        
                return result
            })
        }
    }
}