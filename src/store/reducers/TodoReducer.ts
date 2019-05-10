import update from 'immutability-helper';
import {TodoState, TodoAction, Id, Todo, REQUEST_TODO, RECEIVE_TODO, ADD_TODO, UPDATE_TODO, MOVE_TODO, SHOW_TODO_MODAL, CLOSE_TODO_MODAL, DELETE_TODO} from '../types/todo';

const initialState:TodoState = {
	todos: {},
	categories: [],
	todoModalVisible: false,
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
		case DELETE_TODO:
			return{
				...state,
				todos: update(state.todos,{
					[action.payload.todo.date]: date =>
						update(date,{
							data: {$remove:[action.payload.todo.id]}
						})
				})
			}
		case UPDATE_TODO:
			let updateObj = action.payload.updateObj;
			let selectedTodo = (state.selectedTodo && state.selectedTodo.id===updateObj.id)?
				updateObj : state.selectedTodo
			return {
				...state,
				todos: update(state.todos, {
					[action.payload.date]: date => 
						update(date, {
							data: (data: Map<Id,Todo>) => update( data, {
								$add:[[updateObj.id, updateObj]]
							})
						})
					}),
				selectedTodo: selectedTodo
				//https://www.reddit.com/r/typescript/comments/5pt6v2/react_immutable_updates_and_typescript/
			}
		case MOVE_TODO:
			let newDate = action.payload.newDate;
			let oldDate = action.payload.oldDate;
			let newEntry = action.payload.newEntry;
			let oldEntry = action.payload.oldEntry;
			let todoId = action.payload.todoId;

			let todo = Object.assign({}, state.todos[oldDate].data!.get(todoId)) as Todo;
			todo.date = newDate;
			
			var todosState = state.todos;
			if(newDate !== oldDate){
				todosState = update(todosState, 
										{ [oldDate]: date=>
											update(date, {
												data: (data) => 
													update( data, { $remove: [todoId]})
											})
										})
				if(newEntry){
					let todoEntries = Array.from(todosState[newDate].data!);
					todoEntries.splice(parseInt(newEntry),0,[todoId, todo]);
					todosState = update(todosState, 
										{[newDate]: {
											data:{$set: new Map(todoEntries)}
										}}
								)
				}else{
					todosState = update(todosState, 
								{[newDate]: date => 
									update(date, {
										data: (data) => 
											update( data, {$add:[[todoId, todo]]})
											})
								})
				}
			}else if(newEntry && oldEntry && newEntry !== oldEntry){
					let todoEntries = Array.from(todosState[newDate].data!);
					todoEntries.splice(parseInt(newEntry), 0, [todoId, todo]);
					if(parseInt(newEntry) < parseInt(oldEntry)){
						todoEntries.splice(parseInt(oldEntry)+1, 1);
					}else{
						todoEntries.splice(parseInt(oldEntry), 1);
					}
					todosState = update(todosState, {
											[newDate]:  {
													data: {$set: new Map(todoEntries)}
											}
										})
			}
			return{
				...state,
				todos: todosState
			}
		case SHOW_TODO_MODAL:
			return{
				...state,
				selectedTodo: action.payload.todo,
				todoModalVisible: true,
			}
		case CLOSE_TODO_MODAL:
			return{
				...state,
				todoModalVisible: false,
			}
		default:
			return state
	}
}