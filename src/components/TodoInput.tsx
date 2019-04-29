import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Action, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { addTodo } from '../store/actions/TodoActions';
import * as types from '../store/types/todo';

interface TodoInputProps{
	addTodo: (date: types.Date, todo: types.Todo)=>void,
	date: types.Date
}
interface TodoInputStates{
	inputValue: string
}
class TodoInput extends Component<TodoInputProps, TodoInputStates>{
	constructor(props:TodoInputProps){
		super(props)
		this.state = {
			inputValue:''
		}
		this.handleInputValueChange = this.handleInputValueChange.bind(this)
		this.handleTodoInputAdd = this.handleTodoInputAdd.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}
	handleInputValueChange(e:any){
		this.setState({
			inputValue:e.target.value
		})
	}
	handleTodoInputAdd(e:any){
		e.preventDefault();
		this.props.addTodo(
			this.props.date,
			{
				id: 'new todo',
				title: this.state.inputValue,
				checked: false,
				date: this.props.date
			}
		)
		this.setState({
			inputValue:''
		})
	}
	handleKeyPress(e:any){
		if(e.key === 'Enter'){
			this.handleTodoInputAdd(e)
		}
	}
	render(){
		return(
			<Form className="input-form" layout="inline"
				onSubmit={this.handleTodoInputAdd}>
				<Form.Item>
				<Input type="text" value={this.state.inputValue} onChange={this.handleInputValueChange}/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">Add</Button>
				</Form.Item>
			</Form>
		)
	}
}
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, null, Action<string>>) =>(
	{
		addTodo: async (date: types.Date, item:types.Todo) => await dispatch(addTodo(date, item))
	}
)
export default connect(null, mapDispatchToProps)(TodoInput)