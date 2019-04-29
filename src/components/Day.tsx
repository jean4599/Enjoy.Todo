import React, {Component} from 'react';
import { Card } from 'antd';
import TodoInput from './TodoInput';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchTodo } from '../store/actions/TodoActions';
import Todo from './Todo'
import * as types from '../store/types/todo';
import {AppState} from '../store'
import { string } from 'prop-types';
interface TodoListProps{
    todos: Map<types.Id, types.Todo>
}
interface DayProps{
    date: string,
    dateOffset: number,
    isToday: boolean,
    isFetching: boolean,
    todos: Map<types.Id, types.Todo>,
    fetchTodo: (date: types.Date)=>void
}

function TodoList({todos}:TodoListProps){
    let ele:object[] = []
    todos.forEach((item, index)=>{
        ele.push(<Todo key={item.id} item={item}/>)
    })
    return(
        <div className="todo-container" >
            {ele}
        </div>
    )
}
class Day extends Component<DayProps, object>{
    componentDidMount(){
        this.props.fetchTodo(this.props.date)
    }
    render(){
        console.log(this.props.date, this.props)
        return(
            <Card
                title={this.props.isToday? "Today" : this.props.date}
                className='day-container'
                bordered={false}
                loading={this.props.isFetching}>
                <TodoList todos={this.props.todos}/>
                <TodoInput date={this.props.date}/>
            </Card>
        )
    }
}
const mapStateToProps = (state:AppState, ownProps:DayProps)=>{
    let thisDate = new Date()
    thisDate.setDate(state.date.activeDate.getDate() + ownProps.dateOffset)
    let todayInfoString = thisDate.toDateString();
    let isToday = (thisDate.toDateString() === state.date.today.toDateString());
    let todos = state.todo.todos[todayInfoString]? state.todo.todos[todayInfoString].data: new Map();
    let isFetching = state.todo.todos[todayInfoString]? state.todo.todos[todayInfoString].isFetching : false;
    return({
        date: todayInfoString,
        isToday: isToday,
        todos: todos || new Map<types.Id, types.Todo>(),
        isFetching: isFetching || false
    })
}
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, null, Action<types.TodoAction>>) => (
    {
        fetchTodo: async (date:string)=> await dispatch(fetchTodo(date))
    }
)
export default connect(mapStateToProps, mapDispatchToProps)(Day)