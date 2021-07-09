import * as esbuild from 'esbuild-wasm';

// override ESBuild to create bundle inside browser
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // handle root entry file of index.js
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return {path:'index.js', namespace: 'a' }
            })
            // handle relative paths in a module
            build.onResolve({ filter: /^\.+\// }, (args:any) => {
                return {
                    namespace: 'a',
                    path: new URL(args.path, 'https://unpkg.com'+ args.resolveDir + '/').href
                }
            })

            // on resolve called whenever esbuild tries to find path for a module
            // handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                // generate url using path
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }
            });
        },
    };
};
