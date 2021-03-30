import 'bulmaswatch/superhero/bulmaswatch.min.css'
import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/code-editor'
import Preview from './components/preview'

const App = () => {
    const ref = useRef<any>()
    const [code, setCode] = useState('')

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
 
    return (
        <div>
            <CodeEditor 
                initialValue="const a = 1"
                onChange={(value) => setInput(value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code}/>
        </div>
    )
}

ReactDOM.render(
    <App />, document.querySelector('#root')
)