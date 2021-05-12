export type CellTypes = 'code' | 'test'

export interface Cell {
    id: string
    type: CellTypes
    content: string

} 