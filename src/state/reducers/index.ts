import { combineReducers } from 'redux'
import cellsReducer from './cellsReducer'

const reducers = combineReducers({
    cells: cellsReducer
})

export default reducers
// applying types to redux
export type RootState = ReturnType<typeof reducers>