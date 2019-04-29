import React, { Component, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { todoUpdate } from '../store/actions/TodoActions';
import { Checkbox } from 'antd';
import * as types from '../store/types/todo';
import { ThunkDispatch } from 'redux-thunk';

interface TodoProps{
	item: types.Todo,
	todoUpdate: (date: types.Date, updateObj:types.Todo)=>void
}
class Todo extends Component<TodoProps,object>{
	constructor(props:TodoProps){
		super(props);
		this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this)
	}
	handleTodoCheckChange(e:any){
		const checked = e.target.checked;
		this.props.todoUpdate(this.props.item.date, 
			{
				id: this.props.item.id,
				title: this.props.item.title,
				date: this.props.item.date,
				checked: checked
			})
	}
	render(){
		return(
			<div className="todo">
				<Checkbox 
					className="complete-checkbox"
					checked={this.props.item.checked}
					onChange={this.handleTodoCheckChange}></Checkbox>
				<span className="title">{this.props.item.title}</span>
			</div>
		)
	}
}
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, null, types.TodoAction>) => ({
		todoUpdate: async (date: types.Date, updateObj: types.Todo)=> await dispatch(todoUpdate(date, updateObj))
})
export default connect(null, mapDispatchToProps)(Todo)