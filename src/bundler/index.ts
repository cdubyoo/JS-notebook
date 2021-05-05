import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin'
import { fetchPlugin } from '../plugins/fetch-plugin'

// bundle our code
let service: esbuild.Service
const bundle = async (rawCode: string) => {
    // check if service has been started, if not start it
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: 'http://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        })
    }

    try {
        const result = await service.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(), fetchPlugin(rawCode)
            ],
            
            // defines for bundling
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
        })
        return {
            code: result.outputFiles[0].text,
            err: ''
        }
    } catch (err) {
        return {
            code: '',
            err: err.message
        }
    }

    
}

export default bundle