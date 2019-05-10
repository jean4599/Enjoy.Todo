import React, { Component } from 'react';
import { Button, Modal, Tag } from 'antd';
import * as types from '../store/types/todo';
import { AppState } from '../store';
import { connect } from 'react-redux';
import { updateTodo, closeTodoModal, deleteTodo } from '../store/actions/TodoActions';
import { TitleInput, CategoryInput, MemoInput } from './TodoInput';
import Checkbox from './Checkbox';
interface TodoModalProps{
    todo?: types.Todo,
    visible: boolean,
    categories?: types.Category[],
    updateTodo: (todo: types.Todo) => void,
    closeTodoModal: ()=>void,
    deleteTodo: (todo: types.Todo) => void,
}
interface TodoModalState{
    mode: string, //'view' or 'edit',
    [propName: string]: any;
}
class TodoModal extends Component<TodoModalProps, TodoModalState>{
    constructor(props: TodoModalProps){
        super(props);
        this.state = { 
            mode: 'view',
            titleInput: '',
            categoryInput: '',
            memoInput: '',
         }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
        this.handleTodoCheckChange = this.handleTodoCheckChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    handleCancel(){
        this.props.closeTodoModal();
        this.setState({mode:'view'});
    }
    handleEdit(){
        this.setState({mode:'edit'});
    }
    handleSave(){
        this.props.updateTodo({
            id: this.props.todo!.id,
            title: this.state.titleInput,
            category: this.state.categoryInput,
            memo: this.state.memoInput,
            date: this.props.todo!.date,
            checked: this.props.todo!.checked,
        })
        this.setState({mode: 'view'});
    }
    handleInputValueChange(e:any){
        this.setState({[e.target.name]: e.target.value})
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
        return(
            <div>
            {(todo)?
                <Modal
                    className="todoModal"
                    visible={this.props.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="delete" type="danger" onClick={this.handleDelete}>Delete</Button>,
                        (this.state.mode=='view')?
                            <Button key="edit" onClick={this.handleEdit}>Edit</Button>:
                            <Button key="save" onClick={this.handleSave}>Save</Button>,
                    ]}
                    title={
                        (this.state.mode=='view')?
                            <div className="row">
                                <Checkbox checked={todo.checked} onClick={this.handleTodoCheckChange}/>
                                <span className="title">{todo.title}</span>
                            </div>:
                            <TitleInput defaultValue={this.props.todo!.title} onChange={this.handleInputValueChange}/>
                    }
                >
                    <div className="row">
                        {(this.state.mode=='view')?
                            <span>Category: <Tag className="category-tag">{todo.category}</Tag></span>:
                            <CategoryInput defaultValue={this.props.todo!.category} 
                                onChange={this.handleInputValueChange}
                                categories={this.props.categories} />
                        }
                    </div>
                    <div className="row">
                        {(this.state.mode=='view')?
                            <span>{todo.memo}</span>:
                            <MemoInput
                                onChange={this.handleInputValueChange} 
                                defaultValue={this.props.todo!.memo}/>
                        }
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
    visible: state.todo.todoModalVisible,
    categories: state.todo.categories
})
export default connect(mapStateToProps, {updateTodo, closeTodoModal, deleteTodo})(TodoModal);