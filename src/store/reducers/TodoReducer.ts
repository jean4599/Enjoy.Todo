import update from 'immutability-helper';
import {TodoState, TodoAction, Id, Todo, REQUEST_TODO, RECEIVE_TODO, ADD_TODO, UPDATE_TODO, MOVE_TODO} from '../types/todo';

const initialState:TodoState = {
	todos: {},
	categories: []
}

export default (state=initialState, action: TodoAction) =>{
	switch (action.type){
		case REQUEST_TODO:
			return {
				...state,
				todos:update(state.todos, { 
					[action.payload.date]: (day)=>update( day || {}, 
						{isFetching:{$set:true}}
					)
				}),
			}
		case RECEIVE_TODO:
			// let todos = Object.assign({},state.todos)
			// todos[action.payload.date] = action.payload
			// return {todos: todos}
			return {
				...state,
				todos: update(state.todos, 
					{[action.payload.date]: (date)=>update( date || {}, 
						{$set:{
									data: action.payload.todos,
									isFetching: false
							},
						})
					}),
				categories: action.payload.categories
			}
		case ADD_TODO:
			return{
				...state,
				todos: update(state.todos, {
						[action.payload.date]: date => 
							update(date || {}, {
								data: (data: Map<Id,Todo>) => update( data || new Map(), {$add:[[action.payload.todo.id, action.payload.todo]]} )
							})
						})
			}
			// if(action.payload.date in state.todos){
			// 	return {
			// 		...state,
			// 		todos: update(state.todos, {[action.payload.date]: {data: { $add: [[action.payload.todo.id, action.payload.todo]]}}})
			// 	}
			// }else{
			// 	return {
			// 		...state,
			// 		todos: update(state.todos, {$merge:{[action.payload.date]: {data: [action.payload.todo]}}})
			// 	}
			// }
		case UPDATE_TODO:
			let updateObj = action.payload.updateObj;
			return {
				...state,
				todos: update(state.todos, {
					[action.payload.date]: date => 
						update(date, {
							data: (data: Map<Id,Todo>) => update( data, {
								$add:[[updateObj.id, updateObj]]
							})
						})
					})
				//https://www.reddit.com/r/typescript/comments/5pt6v2/react_immutable_updates_and_typescript/
			}
		case MOVE_TODO:
			let newDate = action.payload.newDate;
			let oldDate = action.payload.oldDate;
			let todoId = action.payload.todoId;
			let todo = Object.assign({}, state.todos[oldDate].data!.get(todoId)) as Todo;
			todo.date = newDate;
			let todosState = update(state.todos, 
										{ [oldDate]: date=>
											update(date, {
												data: (data:Map<Id,Todo>) => 
													update( data, { $remove: [todoId]})
											})
										})
			return{
				...state,
				todos:	update(todosState, 
								{[newDate]: date => 
									update(date, {
										data: (data: Map<Id,Todo>) => 
											update( data, {$add:[[todoId, todo]]})
											})
								})
			}
		default:
			return state
	}
}