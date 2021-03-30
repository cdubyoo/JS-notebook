import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import CodeEditor from './components/code-editor'
import Preview from './components/preview'
import bundle from './bundler'

const App = () => {
    const [code, setCode] = useState('')
    const [input, setInput] = useState('')

    const onClick = async () => {
        const output = await bundle(input)
        // transpiled and bundled code
        setCode(output)

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