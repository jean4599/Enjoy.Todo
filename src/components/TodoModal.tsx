import React, { Component } from 'react';
import { Button, Modal, Tag } from 'antd';
import * as types from '../store/types/todo';
import { AppState } from '../store';
import { connect } from 'react-redux';
import { updateTodo, closeTodoModal, deleteTodo } from '../store/actions/TodoActions';
import Checkbox from './Checkbox';
interface TodoModalProps{
    todo?: types.Todo,
    visible: boolean,
    updateTodo: (todo: types.Todo) => void,
    closeTodoModal: ()=>void,
    deleteTodo: (todo: types.Todo) => void,
}
interface TodoModalState{
    visible: boolean
}
class TodoModal extends Component<TodoModalProps, TodoModalState>{
    constructor(props: TodoModalProps){
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleCancel(){
        this.props.closeTodoModal();
    }
    handleTodoCheckChange(e:React.MouseEvent){
        e.preventDefault();
        if(this.props.todo){
            this.props.updateTodo(
                {
                    id: this.props.todo.id,
                    title: this.props.todo.title,
                    date: this.props.todo.date,
                    checked: !this.props.todo.checked,
                    category: this.props.todo.category
                })
        }
    }
    handleDelete(e:React.MouseEvent){
        this.props.deleteTodo(this.props.todo!);
        this.handleCancel();
    }
    render(){
        let todo = this.props.todo;
        console.log("render")
        return(
            <div>
            {(todo)?
                <Modal
                    className="todoModal"
                    visible={this.props.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="delete" type="danger" onClick={this.handleDelete}>Delete</Button>,
                        <Button key="back" onClick={this.handleCancel}>Close</Button>,
                    ]}
                    title={
                    <div className="row">
                        <Checkbox checked={todo.checked} onClick={this.handleTodoCheckChange}/>
                        <span className="title">{todo.title}</span>
                    </div>}
                >
                    <div className="row">
                        <span>Category: <Tag className="category-tag">{todo.category}</Tag></span>
                    </div>
                    <div className="row">
                        <span>{todo.memo}</span>
                    </div>
                </Modal>
                : null
            }
            </div>
        )
    }
}
const mapStateToProps = (state:AppState, props:TodoModalProps) =>({
    todo: state.todo.selectedTodo,
    visible: state.todo.todoModalVisible
})
export default connect(mapStateToProps, {updateTodo, closeTodoModal, deleteTodo})(TodoModal);