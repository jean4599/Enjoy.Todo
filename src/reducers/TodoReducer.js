import { CHANGE_TODO_STATUS, ADD_TODO } from '../actions/types';
import { REQUEST_TODO, RECEIVE_TODO } from '../actions/TodoActions';
import update from 'immutability-helper';

const initialState = {
	data:{},
	isFetching: true
}

export default (state=initialState, action) =>{
	switch (action.type){
		case REQUEST_TODO:
			return{
				...state,
				isFetching: true
			}
		case RECEIVE_TODO:
			console.log(state)
			return update(state, {data: {[action.payload.date]: {$set: action.payload}}})
		case ADD_TODO:
			if(action.payload.date in state.data){
				return Object.assign({},update(state, {data: {[action.payload.date]: {todos: { $push: [action.payload.todo]}}}}))
			}else{
				return update(state, {data: {[action.payload.date]: {todos: {$set: [action.payload.todo]}}}})
			}
		// case CHANGE_TODO_STATUS:
		// 	items = state.items;
		//     items[action.payload.index] = {
		//     	name: items[action.payload.index].name,
		//     	done: action.payload.status
		//     }
		//     return{
		//     	items: items
		//     }
		default:
			return state
	}
}