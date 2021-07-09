import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from '../state'
// used to understand the type of data that is in the store when accessing state
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector