import React, { Component, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { updateTodo } from '../store/actions/TodoActions';
import { Checkbox } from 'antd';
import * as types from '../store/types/todo';
import { ThunkDispatch } from 'redux-thunk';

interface TodoProps{
	item: types.Todo,
	updateTodo: (date: types.Date, updateObj:types.Todo)=>void
}
class Todo extends Component<TodoProps,object>{
	constructor(props:TodoProps){
		super(props);
		this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this)
		this.handleTodoDragStart = this.handleTodoDragStart.bind(this);
	}
	handleTodoCheckChange(e:any){
		const checked = e.target.checked;
		this.props.updateTodo(this.props.item.date, 
			{
				id: this.props.item.id,
				title: this.props.item.title,
				date: this.props.item.date,
				checked: checked
			})
	}
	handleTodoDragStart(e:React.DragEvent){
		console.log("drag Start"+e.target)
		e.dataTransfer.clearData('date');
		e.dataTransfer.setData("text/plain", this.props.item.id);
		e.dataTransfer.setData("date", this.props.item.date);
		e.dataTransfer.dropEffect = "move";
	}
	render(){
		return(
			<div id={this.props.item.id} className="todo" draggable={true} onDragStart={this.handleTodoDragStart}>
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
		updateTodo: async (date: types.Date, updateObj: types.Todo)=> await dispatch(updateTodo(date, updateObj))
})
export default connect(null, mapDispatchToProps)(Todo)