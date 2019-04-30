import { string } from "prop-types";

// Define Todo Objects
export type Date = string;
export type Checked = boolean;
export type Title = string;
export type Id = string;
export interface Todo{
    id: Id,
    date: Date,
    checked: Checked,
    title: Title
}

// Define Category Objects
export type Category = string;

// Define State
export interface TodoState {
	todos: {
		[date: string]:{
			data?: Map<Id,Todo>
			isFetching?: boolean
		}
	},
	categories?: Category[]
}
// Define Constants for Reducers and Actions
export const REQUEST_TODO = "REQUESTION_TODO";
export type REQUESTION_TODO = typeof REQUEST_TODO;

export const RECEIVE_TODO = "RECEIVE_TODO";
export type RECEIVE_TODO = typeof RECEIVE_TODO;

export const FETCH_TODO = "FETCH_TODO";
export type FETCH_TODO = typeof FETCH_TODO;

export const ADD_TODO = "ADD_TODO";
export type ADD_TODO = typeof ADD_TODO;

export const UPDATE_TODO = "UPDATE_TODO";
export type UPDATE_TODO = typeof UPDATE_TODO;

export const MOVE_TODO = "MOVE_TODO";
export type MOVE_TODO = typeof MOVE_TODO;

// Define Action Functions
export interface requestTodo{
	type: REQUESTION_TODO,
	payload: {date: Date}
}

export interface receiveTodo{
	type: RECEIVE_TODO,
	payload:{
		date: Date,
		categories: Category[],
		todos: Map<Id, Todo>
	}
}
export interface addTodo{
	type: ADD_TODO,
	payload:{
		date: Date,
		todo: Todo
	}
}
export interface updateTodo{
	type:UPDATE_TODO,
	payload:{
		date: Date,
		updateObj: Todo
	}
}

export interface moveTodo{
	type:MOVE_TODO,
	payload:{
		newDate: Date,
		oldDate: Date,
		todoId: Id
	}
}
export type TodoAction = requestTodo|receiveTodo|addTodo|updateTodo|moveTodo
