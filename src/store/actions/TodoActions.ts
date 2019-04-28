import Firebase from '../../components/Firebase/firebase';
import update from 'immutability-helper';
import { Action, Dispatch, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import * as types from '../types/todo';
import { Todo } from '../types/todo';

export function requestTodo(date: string): types.TodoAction{
	console.log("action: request todo", date)
	return{
		type: types.REQUEST_TODO,
		payload: {
			date
		}
	}
}

export function receiveTodo(date: string, categories: string[], todolist: Map<string, Todo>):types.TodoAction{
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
			return await todoDocRef.collection(date).get().then(
				(queryTodosSnapshot:firebase. firestore. QuerySnapshot) => { //queryTodosSnapshot contains zero or more DocumentSnapshot
					let todos = new Map<types.Id, types.Todo>(); //use Map type to store todos!
					queryTodosSnapshot.forEach((todoSnapShot)=>{ //traverse through each DocumentSnapshot
						let todo = todoSnapShot.data()
						todos.set(todoSnapShot.id, 
							{
								id: todoSnapShot.id,
								title: todo.title,
								date: todo.date,
								checked: todo.checked
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
			return await TodoListRef.get().then((queryTodoListDocSnapshot:firebase.firestore.QueryDocumentSnapshot)=>{
				return queryTodoListDocSnapshot
			})
	}
export const fetchTodo = (date:string): 
ThunkAction<void, {}, null, Action<types.TodoAction>> => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
	dispatch(requestTodo(date))
	// Step 1: get TodoListRef (type: document reference) from 
	// path: User (collection) >> default (document) >> TodoListRef (feild)
	Firebase.collection('User').doc('default').get().then(
		async (queryUserDocSnapshot: firebase.firestore.DocumentSnapshot)=>{
			let queryTodoListDocSnapshot = await readUserDoc(date, queryUserDocSnapshot);
			let todoData = await readTodoListDoc(date, queryTodoListDocSnapshot)
			dispatch(receiveTodo(date, todoData.categories, todoData.todos))
			// if(queryUserDocSnapshot.exists){
			// 	todoListRef = queryUserDocSnapshot.data()!.TodoListRef
			// 	// Step 2: get categories (type: string[]) from 
			// 	// path: TodoList document using TodoListRef (document reference) >> Categoty (feild)
			// 	todoListRef.get().then(
			// 		(queryTodoListDocSnapshot:firebase.firestore.QueryDocumentSnapshot) => {
			// 			let categories = queryTodoListDocSnapshot!.data().Category
			// 			// Step 3: get todos (type: object[]) 
			// 			// 3-1: get todos document from the sub-collection (someday's Todo) of TodoList (document)
			// 			todoDocRef = queryTodoListDocSnapshot.ref
			// 			todoDocRef.collection(date).get().then(
			// 				(queryTodosSnapshot:firebase. firestore. QuerySnapshot) => { //queryTodosSnapshot contains zero or more DocumentSnapshot
			// 					let todos = new Map(); //use Map type to store todos!
			// 					queryTodosSnapshot.forEach((todoSnapShot)=>{ //traverse through each DocumentSnapshot
			// 						let todo = todoSnapShot.data()
			// 						todo.id = todoSnapShot.id
			// 						todos.set(todo.id, todo)
			// 					})
			// 					dispatch(receiveTodo(date, categories, todos))
			// 				}
			// 			)
			// 		}
			// 	)
			// }
		}
	)
}


export const addTodo = (date:types.Date, item:Todo):
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

export const todoUpdate = (date: types.Date, updateObj: Todo):types.TodoAction => (
	{
		type: types.UPDATE_TODO,
		payload: {
			date: date,
			updateObj: updateObj
		}
	}
)