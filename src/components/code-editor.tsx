import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'

interface CodeEditorProps {
    initialValue: string
    // function with arg of value that returns nothing
    onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
    // work around for onChange to display value
    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue())
        })
    }

    return <MonacoEditor 
                editorDidMount={onEditorDidMount}
                value={initialValue}
                theme="dark" 
                language="javascript"  
                height="500px" 
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
                />
}

export default CodeEditor