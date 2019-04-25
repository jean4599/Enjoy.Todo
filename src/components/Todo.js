import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTodoStatus } from '../actions/TodoActions';
import { Checkbox } from 'antd';

class Todo extends Component{
	constructor(props){
		super(props);
		this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this)
	}
	handleTodoCheckChange(e){
		const checked = e.target.checked;
		this.props.changeTodoStatus({id:this.props.id, status:checked})
	}
	render(){
		return(
			<div>
				<Checkbox checked={false} onChange={this.handleTodoCheckChange}></Checkbox>
				<span style={{textDecoration:false?'line-through':'none'}}>{this.props.title}</span>
			</div>
		)
	}
}

export default connect(null, {changeTodoStatus})(Todo)