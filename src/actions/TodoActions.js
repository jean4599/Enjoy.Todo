import { CHANGE_TODO_STATUS, ADD_TODO } from './types';
import Firebase from '../components/Firebase/firebase';

export const REQUEST_TODO = "REQUESTION_TODO";
export const requestTodo = (date)=>{
	console.log("action: request todo", date)
	return{
		type: REQUEST_TODO,
		payload: date
	}
}
export const RECEIVE_TODO = "RECEIVE_TODO";
export const receiveTodo = (date, categories, todolist)=>{
	return{
		type: RECEIVE_TODO,
		payload:{
			date: date,
			categories: categories,
			todos: todolist
		}
	}
}
export const FETCH_TODO = "FETCH_TODO";
var todoListRef;
var todoDocRef;
export const fetchTodo = (date) => (dispatch) => {
	dispatch(requestTodo(date))
	// Step 1: get TodoListRef (type: document reference) from 
	// path: User (collection) >> default (document) >> TodoListRef (feild)
	Firebase.collection('User').doc('default').get().then(
		(queryUserDocSnapshot)=>{
			if(queryUserDocSnapshot.data() && queryUserDocSnapshot.data().TodoListRef){
				todoListRef = queryUserDocSnapshot.data().TodoListRef
				// Step 2: get categories (type: string[]) from 
				// path: TodoList document using TodoListRef (document reference) >> Categoty (feild)
				todoListRef.get().then(
					queryTodoListDocSnapshot => {
						let categories = queryTodoListDocSnapshot.data().Category
						// Step 3: get todos (type: object[]) 
						// 3-1: get todos document from the sub-collection (someday's Todo) of TodoList (document)
						todoDocRef = queryTodoListDocSnapshot.ref
						todoDocRef.collection(date).get().then(
							queryTodosSnapshot => { //queryTodosSnapshot contains zero or more DocumentSnapshot
								let todos = [];
								queryTodosSnapshot.forEach((todoSnapShot)=>{ //traverse through each DocumentSnapshot
									let todo = todoSnapShot.data()
									todo.id = todoSnapShot.id
									todos.push(todo)
								})
								dispatch(receiveTodo(date, categories, todos))
							}
						)
					}
				)
			}
		}
	)
}
export const addTodo = (date, item) => dispatch =>{
	todoDocRef.collection(date).add(item).then(function(newDocRef){
		dispatch({
			type: ADD_TODO,
			payload: {
				date: date,
				todo: {
					id: newDocRef.id,
					title: item.title
				}
			}
		})
	})
}
export const changeTodoStatus = (payload) => (
	{
		type: CHANGE_TODO_STATUS,
		payload: {index: payload.id, status:payload.status}
	}
)