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
            
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            if (args.path === 'index.js') {
                return {
                    loader: 'jsx',
                    // modules inputs
                    contents: inputCode
                };
            } 

            // check to see if we already fetched this file and if its in the cache
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path) // use type onLoadresult so typescript knows the type
            // if it is, return it
            if (cachedResult) {
                return cachedResult
            }

            // get data from url for test pkg
            const { data, request } = await axios.get(args.path)
            
            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents: data,
                // find directory of package
                resolveDir: new URL('./', request.responseURL).pathname
            }
            // store response in cache
            await fileCache.setItem(args.path, result)

            return result
        });
        }
    }
}