import { ActionType } from '../action-types'
import { Cell, CellTypes } from '../cell'




// define interface for each action
export type Direction = 'up' | 'down'
export interface MoveCellAction {
    type: ActionType.MOVE_CELL
    payload: {
        id: string
        direction: Direction
    }
}

export interface DeleteCellAction {
    type: ActionType.DELETE_CELL
    payload: string // just need id to delete
}

export interface InsertCellAfterAction {
    type: ActionType.INSERT_CELL_AFTER
    payload: {
        id: string | null
        type: CellTypes
    }
}

export interface UpdateCellAction {
    type: ActionType.UPDATE_CELL
    payload: {
        id: string
        content: string
    }
}

export interface BundleCreatedAction {
    type: ActionType.BUNDLE_CREATED,
    payload: {
        cellId: string
    }
}

export interface BundleCompleteAction {
    type: ActionType.BUNDLE_COMPLETE,
    payload: {
        cellId: string
        bundle: {
            code: string
            err: string
        }
   
    }
}

export interface FetchCellsAction {
    type: ActionType.FETCH_CELLS
}

export interface FetchCellsCompleteAction {
    type: ActionType.FETCH_CELLS_COMPLETE
    payload: Cell[]
}

export interface FetchCellsErrorAction {
    type: ActionType.FETCH_CELLS_ERROR
    payload: string
}

export interface SaveCellsErrorAction {
    type: ActionType.SAVE_CELLS_ERROR,
    payload: string
}

export type Action = 
    | MoveCellAction 
    | DeleteCellAction 
    | InsertCellAfterAction 
    | UpdateCellAction 
    | BundleCreatedAction
    | BundleCreatedAction
    | BundleCompleteAction
    | FetchCellsAction
    | FetchCellsCompleteAction
    | FetchCellsErrorAction
    | SaveCellsErrorAction