import React, {Component} from 'react';
import { Card } from 'antd';
import TodoInput from './TodoInput.js';
import { connect } from 'react-redux';
import { fetchTodo, addTodo } from '../actions/TodoActions';
import Todo from './Todo'


function TodoList({todos}){
    return(
        <div className="TodoList" >
            {todos.map((item, index)=>(
                <Todo key={item.id} title={item.title}/>
            ))}
        </div>
    )
}
class Day extends Component{
    constructor(props){
        super(props);
        this.handleAddTodo = this.handleAddTodo.bind(this)
    }
    componentDidMount(){
        this.props.fetchTodo(this.props.date)
    }
    handleAddTodo(todo){
        this.props.addTodo(this.props.date, todo)
    }
    render(){
        return(
            <Card
                title={this.props.isToday? "Today" : this.props.date}
                className='f-1 m-1'>
                <TodoList todos={this.props.todos}/>
                <TodoInput handleAddTodo={this.handleAddTodo}/>
            </Card>
        )
    }
}
const mapStateToProps = (state, ownProps)=>{
    let thisDate = new Date()
    thisDate.setDate(state.date.activeDate.getDate() + ownProps.dateOffset)
    let todayInfoString = thisDate.toDateString();
    let isToday = (thisDate.toDateString() === state.date.today.toDateString())
    let todos = state.todo.data[todayInfoString]?state.todo.data[todayInfoString].todos: []
    return({
        date: todayInfoString,
        isToday: isToday,
        todos: todos
    })
}
export default connect(mapStateToProps, {fetchTodo, addTodo})(Day)