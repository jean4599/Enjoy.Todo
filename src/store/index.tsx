import { combineReducers } from 'redux';
import TodoReducer from './reducers/TodoReducer';
import DateReducer from './reducers/DateReducer';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'

const rootReducer = combineReducers({
	todo: TodoReducer,
	date: DateReducer
})
export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, {}, applyMiddleware(reduxThunk))
export default store
