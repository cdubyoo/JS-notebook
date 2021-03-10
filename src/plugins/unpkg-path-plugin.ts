import * as esbuild from 'esbuild-wasm';
import axios from 'axios'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
    name: 'filecache'
});

(async () => {
    await fileCache.setItem('color', 'red')

    const color = await fileCache.getItem('color')
 
    console.log(color)
})()

// override ESBuild to create bundle inside browser
export const unpkgPathPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // on resolve called whenever esbuild tries to find path for a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                if (args.path === "index.js") {
                    return { path: args.path, namespace: 'a' };
                }
                // generate url using path
                if (args.path.includes('./') || args.path.includes('../')) {
                    return {
                        namespace: 'a',
                        path: new URL(args.path, 'https://unpkg.com'+ args.resolveDir + '/').href
                    }
                }

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }
            });
            

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

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
        },
    };
};
