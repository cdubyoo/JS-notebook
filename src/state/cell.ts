export type CellTypes = 'code' | 'text'
// this is what a cell is
export interface Cell {
    id: string
    type: CellTypes
    content: string

} 