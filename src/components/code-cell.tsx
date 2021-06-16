import { useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Resizable from './resizable'
import { Cell } from '../state'
import { useActions } from '../hooks/use-actions'
import { useTypedSelector } from '../hooks/use-typed-selector'

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const { updateCell, createBundle } = useActions()
    const bundle = useTypedSelector((state) => state.bundles[cell.id])

    useEffect(() => {
        // if there is bundle, will continue onto debouncing
        if (!bundle) {
            createBundle(cell.id, cell.content)
            return
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cell.content)
        }, 750)

        return () => {
            clearTimeout(timer)
        }
    }, [cell.content, cell.id, createBundle]) // if user changes cell content, run useEffect

    return (
        <Resizable direction="vertical">
        <div
            style={{
            height: 'calc(100% - 10px)',
            display: 'flex',
            flexDirection: 'row',
            }}
        >
            <Resizable direction="horizontal">
            <CodeEditor
                initialValue={cell.content}
                onChange={(value) => updateCell(cell.id, value)}
            />
            </Resizable>
            {bundle && <Preview code={bundle.code} err={bundle.err} />}
        </div>
        </Resizable>
    )
}

export default CodeCell;
