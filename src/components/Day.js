import React, {Component} from 'react';
import { Card } from 'antd';
import TodoInput from './TodoInput.js';
import { connect } from 'react-redux';
import { fetchTodo, addTodo } from '../actions/TodoActions';
import Todo from './Todo'


function TodoList({todos}){
    let ele = []
    todos.forEach((item, index)=>{
        ele.push(<Todo key={item.id} id={item.id} date={item.date} title={item.title} checked={item.checked}/>)
    })
    return(
        <div className="TodoList" >
            {ele}
        </div>
    )
}
class Day extends Component{
    constructor(props){
        super(props);
        this.handleTodoAdd = this.handleTodoAdd.bind(this)
    }
    componentDidMount(){
        this.props.fetchTodo(this.props.date)
    }
    handleTodoAdd(todo){
        this.props.addTodo(this.props.date, todo)
    }
    render(){
        console.log("render ", this.props.date)
        return(
            <Card
                title={this.props.isToday? "Today" : this.props.date}
                className='f-1 m-1 todo'
                bordered={false}
                loading={this.props.isFetching}>
                <TodoList todos={this.props.todos}/>
                <TodoInput handleTodoAdd={this.handleTodoAdd}/>
            </Card>
        )
    }
}
const mapStateToProps = (state, ownProps)=>{
    let thisDate = new Date()
    console.log(state)
    thisDate.setDate(state.date.activeDate.getDate() + ownProps.dateOffset)
    let todayInfoString = thisDate.toDateString();
    let isToday = (thisDate.toDateString() === state.date.today.toDateString());
    let todos = state.todo.todos[todayInfoString]? state.todo.todos[todayInfoString].data: [];
    let isFetching = state.todo.todos[todayInfoString]? state.todo.todos[todayInfoString].isFetching : false;
    console.log(todos)
    return({
        date: todayInfoString,
        isToday: isToday,
        todos: todos,
        isFetching: isFetching
    })
}
export default connect(mapStateToProps, {fetchTodo, addTodo})(Day)