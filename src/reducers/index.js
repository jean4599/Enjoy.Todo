import { combineReducers } from 'redux';
import TodoReducer from './TodoReducer';
import DateReducer from './DateReducer';
export default combineReducers({
	todo: TodoReducer,
	date: DateReducer
})