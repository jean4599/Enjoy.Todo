import React, {Component} from 'react';
import {connect} from 'react-redux';
import Todo from './Todo';
import { moveTodo } from '../store/actions/TodoActions';
import * as types from '../store/types/todo';

interface TodoListProps{
    date: types.Date,
    todos: Map<types.Id, types.Todo>,
    moveTodo: (newDate: types.Date, oldDate: types.Date, todoId: types.Id) => void
}
class TodoList extends Component<TodoListProps, object>{
    constructor(props:TodoListProps){
        super(props);
        this.handleTodoDrop = this.handleTodoDrop.bind(this)
    }
    handleTodoDrop(e:React.DragEvent){
        e.preventDefault();
        console.log("drag End")
        console.log(e.dataTransfer.items[0])
        let id = e.dataTransfer.getData("text/plain");
        let oldDate = e.dataTransfer.getData("date");
        this.props.moveTodo(this.props.date, oldDate, id);
    }
    handleTodoDragOver(e:React.DragEvent){
        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
    }
    render(){
        let ele:object[] = []
        this.props.todos.forEach((item, index)=>{
            ele.push(<Todo key={item.id} item={item}/>)
        })
        return(
            <div className="todo-container" onDragOver={this.handleTodoDragOver} onDrop={this.handleTodoDrop}>
                {ele}
            </div>
        )
    }
}
export default connect(null, {moveTodo})(TodoList)