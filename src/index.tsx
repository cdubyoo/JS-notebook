import 'bulmaswatch/superhero/bulmaswatch.min.css'
import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/code-editor'

const App = () => {
    const ref = useRef<any>()
    const iframe = useRef<any>()
    const [input, setInput] = useState('')

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

        iframe.current.srcdoc = html

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
        // setCode(result.outputFiles[0].text)
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
    }

    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message', (event) => {
                        try{
                            eval(event.data)
                        } catch (err) {
                            const root = document.querySelector('#root')
                            root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>'
                            console.error(err)
                        }
                    }, false)
                </script>
            </body>
        </html>
    `

    return (
        <div>
            <CodeEditor 
                initialValue="const a = 1"
                onChange={(value) => setInput(value)}
            />
            <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <iframe title ="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
        </div>
    )
}

ReactDOM.render(
    <App />, document.querySelector('#root')
)