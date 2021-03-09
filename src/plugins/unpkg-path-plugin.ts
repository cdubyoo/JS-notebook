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
                        contents: `
                            const React, { useState } = require('react');
                            console.log(React, reactDOM);
                        `,
                    };
                } 
                // get data from url for test pkg
                const { data, request } = await axios.get(args.path)
                console.log(request)
                return {
                    loader: 'jsx',
                    contents: data,
                    // find directory of package
                    resolveDir: new URL('./', request.responseURL).pathname
                }
            });
        },
    };
};
