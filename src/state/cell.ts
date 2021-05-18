export type CellTypes = 'code' | 'test'
// this is what a cell is
export interface Cell {
    id: string
    type: CellTypes
    content: string

} 