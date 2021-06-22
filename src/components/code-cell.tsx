import './code-cell.css'
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
        // if no bundle then create one without setting timer
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell.content, cell.id, createBundle])

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
            { //ternary expression to check for bundle loading
                !bundle || bundle.loading ? (
                    <div className="prograss-cover">
                        <progress className="progress is-small is-primary" max="100">
                            Loading
                        </progress>
                    </div>
                ) : (
                    <div className="prograss-cover">
                        <progress className="progress is-small is-primary" max="100">
                            Loading
                        </progress>
                    </div>
                )}
        </div>
        </Resizable>
    )
}

export default CodeCell;
