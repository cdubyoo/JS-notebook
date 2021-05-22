import { useTypedSelector } from '../hooks/use-typed-selector'

const CellListItem: React.FC = () => {
    useTypedSelector((state) => state)

    return <div>Cell List Item</div>
}

export default CellListItem