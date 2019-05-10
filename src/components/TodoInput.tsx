import React, { Component, FocusEvent, FormEvent } from 'react';
import { Form, Input, Button} from 'antd';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { addTodo } from '../store/actions/TodoActions';
import * as types from '../store/types/todo';
import { AppState } from '../store';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';

interface TodoInputProps{
	addTodo: (date: types.Date, todo: types.Todo)=>void,
	date: types.Date,
	categories: types.Category[]
}
interface TodoInputStates{
	focus: boolean;
	[propName: string]: any;
}
export function TitleInput(props:any){
	return(
		<Input type="text" 
			name="titleInput"
			placeholder="Add a todo..."
			autoComplete="off"
			{...props}
			/>
	)
}
export function CategoryInput(props:any){
	return(
		<RadioGroup name="categoryInput" {...props}>
			{props.categories.map(
				(c: string, idx: string)=>(
					<RadioButton key={idx} value={c}>{c}</RadioButton>
				)
			)}
		</RadioGroup>
	)
}
export function MemoInput(props:any){
	return(
		<Input.TextArea autosize 
			placeholder="Some memo about this todo..."
			name="memoInput" {...props}></Input.TextArea>
	)
}
class TodoInput extends Component<TodoInputProps, TodoInputStates>{
	constructor(props:TodoInputProps){
		super(props)
		this.state = {
			titleInput:'',
			memoInput:'',
			categoryInput: this.props.categories[0],
			focus: false
		}
		this.handleInputValueChange = this.handleInputValueChange.bind(this)
		this.handleTodoInputAdd = this.handleTodoInputAdd.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.handleInputFocus = this.handleInputFocus.bind(this);
	}
	handleInputValueChange(e:any){
		this.setState({
			[e.target.name]:e.target.value
		})
	}
	handleTodoInputAdd(e:any){
		e.preventDefault();
		if(this.state.titleInput){
			this.props.addTodo(
				this.props.date,
				{
					id: 'new todo',
					title: this.state.titleInput,
					checked: false,
					date: this.props.date,
					category: this.state.categoryInput,
					memo: this.state.memoInput
				}
			)
			this.setState({
				titleInput:'',
				memoInput: '',
				focus: false
			})
		}
	}
	handleKeyPress(e:any){
		if(e.key === 'Enter'){
			this.handleTodoInputAdd(e)
		}
	}
	handleInputFocus(e:FocusEvent){
		e.preventDefault();
		this.setState({focus: true})
	}
	handleInputBlur(e: FocusEvent){
		e.preventDefault();
		this.setState({focus: false})
	}
	render(){
		const classes = ["form-container"];
		classes.push(this.state.focus? 'focused' : 'unfocused');
		return(
			<div className={classes.join(' ')}
			onBlur={this.handleInputBlur}
			onFocus={this.handleInputFocus}
			tabIndex={0}>
				<Form layout="vertical"
					onSubmit={this.handleTodoInputAdd}
					className="input-form"
					labelAlign="left"
					colon={false}
					>
					<Form.Item>
						<TitleInput value={this.state.titleInput} 
							onChange={this.handleInputValueChange} />
					</Form.Item>
					<Form.Item label="Category">
						<CategoryInput 
							onChange={this.handleInputValueChange}
							value={this.state.categoryInput}
							categories={this.props.categories}>
						</CategoryInput>
					</Form.Item>
					<Form.Item>
						<MemoInput 
							onChange={this.handleInputValueChange}
							value={this.state.memoInput} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>Add</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}
}
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, null, Action<string>>) =>(
	{
		addTodo: async (date: types.Date, item:types.Todo) => await dispatch(addTodo(date, item))
	}
)
const mapStateToProps = (state:AppState)=>({
	categories: state.todo.categories || []
})
export default connect(mapStateToProps, mapDispatchToProps)(TodoInput)