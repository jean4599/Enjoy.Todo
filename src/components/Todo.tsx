import React, { Component, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { updateTodo, moveTodo, showTodoModal } from '../store/actions/TodoActions';
import Checkbox from './Checkbox';
import * as types from '../store/types/todo';
import { Tag } from 'antd';

interface TodoProps{
	item: types.Todo,
	dataEntry: string,
	updateTodo: (updateObj:types.Todo)=>void,
	moveTodo: (newDate: types.Date, oldDate: types.Date, newEntry: string|null, oldEntry: string|null, todoId: string)=>void,
	showTodoModal: (todo: types.Todo)=>void
}
interface TodoState{
	isDragOver: boolean
}
class Todo extends Component<TodoProps,TodoState>{
	constructor(props:TodoProps){
		super(props);
		this.state={
			isDragOver:false
		}
		this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this);
		this.handleTodoDragStart = this.handleTodoDragStart.bind(this);
		this.handleTodoDragEnter = this.handleTodoDragEnter.bind(this);
		this.handleTodoDragLeave = this.handleTodoDragLeave.bind(this);
		this.handleTodoDrop = this.handleTodoDrop.bind(this);
		this.handleTodoClick = this.handleTodoClick.bind(this);
	}
	handleTodoCheckChange(e:React.MouseEvent){
		e.preventDefault();
		this.props.updateTodo( 
			{
				id: this.props.item.id,
				title: this.props.item.title,
				date: this.props.item.date,
				checked: !this.props.item.checked,
				category: this.props.item.category
			})
	}
	handleTodoDragStart(e:React.DragEvent){
		console.log("drag Start"+e.target)
		e.dataTransfer.clearData('date');
		e.dataTransfer.setData("text/plain", this.props.item.id);
		e.dataTransfer.setData("date", this.props.item.date);
		e.dataTransfer.setData("dataEntry", this.props.dataEntry);
		e.dataTransfer.dropEffect = "move";
	}
	handleTodoDragEnter(e:React.DragEvent){
		e.preventDefault();
		this.setState({
			isDragOver: true
		})
	}
	handleTodoDragLeave(e:React.DragEvent){
		e.preventDefault();
		this.setState({
			isDragOver: false
		})
	}
	handleTodoDragOver(e:React.DragEvent){
		e.preventDefault();
	}
	handleTodoDrop(e:React.DragEvent){
		e.preventDefault();
		let oldEntry = e.dataTransfer.getData("dataEntry");
		let oldDate = e.dataTransfer.getData("date");
		let myEntry = this.props.dataEntry;
		let myDate = this.props.item.date;
		let todoId = e.dataTransfer.getData("text/plain");
		console.log(`moveTodo(${myDate}, ${oldDate}, ${myEntry}, ${oldEntry}, ${todoId})`)
		this.props.moveTodo(myDate, oldDate, myEntry, oldEntry, todoId);
		this.setState({
			isDragOver: false
		})
	}
	handleTodoClick(e:React.MouseEvent){
		e.preventDefault();
		this.props.showTodoModal(this.props.item);
	}
	render(){
		return(
			<div id={this.props.item.id} 
				className="todo" 
				draggable={true} 
				onDragStart={this.handleTodoDragStart}
				onDragOver={this.handleTodoDragOver}
				onDragEnter={this.handleTodoDragEnter}
				onDragLeave={this.handleTodoDragLeave}
				onDrop={this.handleTodoDrop}
				onClick={this.handleTodoClick}
				data-isdragover={this.state.isDragOver}>
				<Checkbox 
					checked={this.props.item.checked}
					onClick={this.handleTodoCheckChange}></Checkbox>
				<span className="title">{this.props.item.title}</span>
				<Tag className="category-tag">{this.props.item.category}</Tag>
			</div>
		)
	}
}

export default connect(null, {updateTodo, moveTodo, showTodoModal})(Todo)