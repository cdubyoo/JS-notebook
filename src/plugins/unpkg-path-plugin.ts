import * as esbuild from 'esbuild-wasm';
import axios from 'axios'

// override ESBuild to create bundle inside browser
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // on resolve called whenever esbuild tries to find path for a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                if (args.path === "index.js") {
                    return { path: args.path, namespace: 'a' };
                }
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }
                //  else if (args.path === "tiny-test-pkg") {
                //     return { path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js", namespace: 'a' }
                // }
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            const message = require('medium-test-pkg');
                            console.log(message);
                        `,
                    };
                } 
                // get data from url for test pkg
                const { data } = await axios.get(args.path)
                return {
                    loader: 'jsx',
                    contents: data
                }
            });
        },
    };
};
