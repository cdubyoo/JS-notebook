import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

const App = () => {
    const ref = useRef<any>()
    const [input, setInput] = useState('')
    const [code, setCode] = useState('')

    const startService = async () => {
        // assign startservice to ref.current to be used outside
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: 'http://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        })
    }

    // run startservice once every time app renders
    useEffect(() => {
        startService()
    }, [])

    const onClick = async () => {
        // check to make sure service is initialized 
        if (!ref.current) {
            return
        }
        // transpile user input
        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(), fetchPlugin(input)
            ],
            
            // defines for bundling
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            },
        })
        // transpiled and bundled code
        setCode(result.outputFiles[0].text)
    }

    const html = `
        <script>
            ${code}
        </script>
    `

    return (
        <div>
            <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
            <iframe sandbox="allow-scripts" srcDoc={html} />
        </div>
    )
}

ReactDOM.render(
    <App />, document.querySelector('#root')
)