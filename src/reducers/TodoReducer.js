import { REQUEST_TODO, RECEIVE_TODO, ADD_TODO, UPDATE_TODO } from '../actions/TodoActions';
import update from 'immutability-helper';

const initialState = {
	todos:{}
}

export default (state=initialState, action) =>{
	switch (action.type){
		case REQUEST_TODO:
			return update(state, {todos: {[action.payload.date]: {$set: {isFetching: true}}}})
		case RECEIVE_TODO:
			// let todos = Object.assign({},state.todos)
			// todos[action.payload.date] = action.payload
			// return {todos: todos}
			return update(state, {
				todos: {[action.payload.date]: {
							data: {$set: action.payload.todos},
							isFetching: {$set:false}
							}
						},
				categories: {$set: action.payload.categories}
			})
		case ADD_TODO:
			if(action.payload.date in state.todos){
				return Object.assign({},update(state, {todos: {[action.payload.date]: {data: { $add: [[action.payload.todo.id, action.payload.todo]]}}}}))
			}else{
				return update(state, {todos: {[action.payload.date]: {data: {$set: [action.payload.todo]}}}})
			}
		case UPDATE_TODO:
			let updateObj = action.payload.updateObj;
			console.log(updateObj)
			console.log(state)
			return update(state, {todos: {[action.payload.date]: {data: {[updateObj.id]:{$merge:updateObj}}}}})
		default:
			return state
	}
}