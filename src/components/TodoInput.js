import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

export default class TodoInput extends Component{
	constructor(props){
		super(props)
		this.state = {
			inputValue:''
		}
		this.handleInputValueChange = this.handleInputValueChange.bind(this)
		this.handleTodoInputAdd = this.handleTodoInputAdd.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}
	handleInputValueChange(e){
		this.setState({
			inputValue:e.target.value
		})
	}
	handleTodoInputAdd(e){
		e.preventDefault();
		this.props.handleTodoAdd({
			title: this.state.inputValue,
			checked: false
		})
		this.setState({
			inputValue:''
		})
	}
	handleKeyPress(e){
		if(e.key === 'Enter'){
			this.handleTodoInputAdd()
		}
	}
	render(){
		return(
			<Form layout="inline" className={this.props.className} onSubmit={this.handleTodoInputAdd}>
				<Form.Item>
				<Input stype="text" value={this.state.inputValue} onChange={this.handleInputValueChange}/>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit">Add</Button>
				</Form.Item>
			</Form>
		)
	}
}