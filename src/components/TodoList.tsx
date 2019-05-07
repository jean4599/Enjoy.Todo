import React, {Component} from 'react';
import {connect} from 'react-redux';
import Todo from './Todo';
import { moveTodo } from '../store/actions/TodoActions';
import * as types from '../store/types/todo';

interface TodoListProps{
    date: types.Date,
    todos: Map<types.Id, types.Todo>,
    moveTodo: (newDate: types.Date, oldDate: types.Date, newEntry:string|null, oldEntry:string|null, todoId: types.Id) => void
}
class TodoList extends Component<TodoListProps, object>{
    constructor(props:TodoListProps){
        super(props);
        this.handleTodoDrop = this.handleTodoDrop.bind(this)
    }
    handleTodoDrop(e:React.DragEvent){
        e.preventDefault();
        let targetElement = e.target as HTMLElement;
        if(targetElement.className!=="todo"){
            let id = e.dataTransfer.getData("text/plain");
            let oldDate = e.dataTransfer.getData("date");
            let newEntry = (this.props.todos.size).toString();
            let oldEntry = e.dataTransfer.getData("dataEntry");
            
            this.props.moveTodo(this.props.date, oldDate, newEntry, oldEntry, id);
        }
        
    }
    handleTodoDragOver(e:React.DragEvent){
        e.preventDefault();
    }
    handleTodoDragEnter(e:React.DragEvent){
        e.preventDefault();
    }
    handleTodoDragLeave(e:React.DragEvent){
        e.preventDefault();
    }
    render(){
        let ele:object[] = []
        let i = 0;
        this.props.todos.forEach((item, index)=>{
            ele.push(<Todo key={item.id} item={item} dataEntry={(i++).toString()}/>)
        })
        return(
            <div className="todo-container" 
                onDragOver={this.handleTodoDragOver} 
                onDrop={this.handleTodoDrop}
                onDragEnter={this.handleTodoDragEnter}
                onDragLeave={this.handleTodoDragLeave}>
                {ele}
            </div>
        )
    }
}
export default connect(null, {moveTodo})(TodoList)