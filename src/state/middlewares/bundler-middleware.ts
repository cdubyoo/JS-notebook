import { Middleware } from './middleware'
import { ActionType } from '../action-types'

let timer: any
export const bundlerMiddleware: Middleware = ({ getState }) => (next) => (
action) => {
    next(action)

    if (action.type !== ActionType.UPDATE_CELL) {
        return
    }
    const { cells: { data: cellData } } = getState()
    const cell = cellData[action.payload.id]

    if (cell.type === 'text') {
        return
    }    
    clearTimeout(timer)
    timer = setTimeout(() => {
        console.log('timer expired')
    }, 750)
}
