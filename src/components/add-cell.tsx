import './add-cell.css'
import { useActions } from '../hooks/use-actions'

interface AddCellProps {
    nextCellId: string | null
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId }) => {
    const { insertCellBefore } = useActions()

    return <div>
        <button onClick={() => insertCellBefore(nextCellId, 'code')}>Code</button>
        <button onClick={() => insertCellBefore(nextCellId, 'text')}>Text</button>
        <div className="divider"></div>
    </div>
}
export default AddCell

