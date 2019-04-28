import React, { Component, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { todoUpdate } from '../store/actions/TodoActions';
import { Checkbox } from 'antd';
import * as types from '../store/types/todo';

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
			<div>
				<Checkbox checked={this.props.item.checked} onChange={this.handleTodoCheckChange}></Checkbox>
				<span style={{textDecoration:false?'line-through':'none'}}>{this.props.item.title}</span>
			</div>
		)
	}
}
const mapDispatchToProps = (dispatch: Dispatch<types.TodoAction>) => ({
		todoUpdate: (date: types.Date, updateObj: types.Todo)=>dispatch(todoUpdate(date, updateObj))
})
export default connect(null, mapDispatchToProps)(Todo)