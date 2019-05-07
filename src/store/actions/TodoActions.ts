import Firebase from '../../components/Firebase/firebase';
import update from 'immutability-helper';
import { Action, Dispatch, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import * as types from '../types/todo';

export function requestTodo(date: string): types.TodoAction{
	console.log("action: request todo", date)
	return{
		type: types.REQUEST_TODO,
		payload: {
			date
		}
	}
}

export function receiveTodo(date: types.Date, categories: types.Category[], todolist: Map<types.Date, types.Todo>):types.TodoAction{
	return{
		type: types.RECEIVE_TODO,
		payload: {
			date: date,
			categories: categories,
			todos: todolist
		}
	}
}


var todoDocRef: firebase.firestore.DocumentReference;
async function readTodoListDoc(date: types.Date, queryTodoListDocSnapshot:firebase.firestore.QueryDocumentSnapshot):
	Promise<{categories: types.Category[], todos: Map<string,types.Todo>}>{
			console.log("action: readTodoListDoc, ", date)
			todoDocRef = queryTodoListDocSnapshot.ref
			return todoDocRef.collection(date).get().then(
				(queryTodosSnapshot:firebase. firestore. QuerySnapshot) => { //queryTodosSnapshot contains zero or more DocumentSnapshot
					let todos = new Map<types.Id, types.Todo>(); //use Map type to store todos!
					queryTodosSnapshot.forEach((todoSnapShot)=>{ //traverse through each DocumentSnapshot
						let todo = todoSnapShot.data()
						todos.set(todoSnapShot.id, 
							{
								id: todoSnapShot.id,
								title: todo.title,
								date: todo.date,
								checked: todo.checked,
								category: todo.category
							})
					})
					return {
						todos: todos,
						categories: queryTodoListDocSnapshot.get('Category')
					}
				}
			)
	}
async function readUserDoc(date: types.Date, queryUserDocSnapshot: firebase.firestore.DocumentSnapshot):
		Promise<firebase.firestore.QueryDocumentSnapshot>{
			let TodoListRef;
			console.log("action: readUserDoc, ", date)
			if(queryUserDocSnapshot.exists){
				TodoListRef = queryUserDocSnapshot.get('TodoListRef');
			}
			else{
				Firebase.collection('TodoList').add({}).then((documentRef)=>{
					queryUserDocSnapshot.ref.set({'TodoListRef':documentRef});
					TodoListRef = documentRef
				});
			}
			return TodoListRef.get().then((queryTodoListDocSnapshot:firebase.firestore.QueryDocumentSnapshot)=>{
				return queryTodoListDocSnapshot
			})
	}
export const fetchTodo = (date:string): 
ThunkAction<void, {}, null, Action<types.TodoAction>> => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
	dispatch(requestTodo(date))
	Firebase.collection('User').doc('default').get().then(
		async (queryUserDocSnapshot: firebase.firestore.DocumentSnapshot)=>{
			let queryTodoListDocSnapshot = await readUserDoc(date, queryUserDocSnapshot);
			let todoData = await readTodoListDoc(date, queryTodoListDocSnapshot)
			dispatch(receiveTodo(date, todoData.categories, todoData.todos))
		}
	)
}


export const addTodo = (date:types.Date, item:types.Todo):
ThunkAction<void, {}, null, Action<types.TodoAction>> => 
(dispatch: ThunkDispatch<{}, {}, AnyAction>) =>{
	console.log("action: add Todo, ", date)
	let newitem = update(item, {date:{$set: date}})
	todoDocRef.collection(date).add(newitem).then(function(newDocRef){
		dispatch({
			type: types.ADD_TODO,
			payload: {
				date: date,
				todo: update(newitem, {id:{$set: newDocRef.id}})
			}
		})
	})
}

export const updateTodo = (date: types.Date, updateObj: types.Todo):ThunkAction<void, {}, null, Action<types.TodoAction>> => 
(dispatch: ThunkDispatch<{},{},AnyAction>)=>{
		console.log("action: update Todo, ", date, updateObj)
		todoDocRef.collection(date).doc(updateObj.id).update(updateObj);
		dispatch({
			type: types.UPDATE_TODO,
			payload: {
				date: date,
				updateObj: updateObj
			}
		})
}

export const moveTodo = (newDate: types.Date, oldDate: types.Date, newEntry:string|null, oldEntry:string|null, todoId: types.Id):ThunkAction<void, {}, null, Action<types.TodoAction>> =>
(dispatch: ThunkDispatch<{}, {}, AnyAction>)=>{
	dispatch({
		type: types.MOVE_TODO,
		payload:{
			newDate: newDate,
			oldDate: oldDate,
			newEntry: newEntry,
			oldEntry: oldEntry,
			todoId: todoId
		}
	})
}