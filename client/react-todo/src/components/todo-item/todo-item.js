import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import {
    getBucketList,
    getSingleTodo,
    idChanged,
    titleChanged,
    contentChanged,
    bucketsChanged,
    completionChanged,
    validationMessageChanged,
    saveTodo,
    removeTodo
} from '../../actions/todo-actions';

import './todo-item.css';

class TodoItem extends Component {
    componentDidMount() {
        const { todoId } = this.props.match.params;
        if (todoId) {
            this.props.getSingleTodo(todoId);
        }
        this.props.getBucketList();
    }

    onTitleChange = (event) => {
        this.props.titleChanged(event.target.value);
    }

    onContentChange = (event) => {
        this.props.contentChanged(event.target.value);
    }

    onCompletionChange = (event) => {
        this.props.completionChanged(event.target.checked);
    }

    onBucketsChange = (newBuckets) => {
        this.props.bucketsChanged(newBuckets);
    }

    showTodoAdditonalInfo = () => {
        if (this.props.modifiedDateMesage &&
            this.props.createdDateMessage) {
                return (
                    <React.Fragment>
                        <div className="alert alert-info todo-item--alert" role="alert">
                            {this.props.modifiedDateMesage}
                        </div>
                        <div className="alert alert-info todo-item--alert" role="alert">
                            {this.props.createdDateMessage}
                        </div>
                    </React.Fragment>
                );  
            }
    }

    redirectOnANewItem = (response) => {
        if (response.status === 0) {
            if (!this.props.id) {
                this.props.history.push('/todos');
            }
        }
    }

    redirectOnSuccessfulDelete = (response) => {
        if (response.status === 0) {
            this.props.history.push('/todos');
        }
    }

    showAlertOnSuccessfulSave = () => {
        if (this.props.saveResponse.status !== undefined &&
            this.props.saveResponse.status === 0) {
                return (
                    <div className="alert alert-success todo-item--alert" role="alert">
                        Changes were saved successfully.
                    </div>
                );
            }
    }

    showAlertOnRequestFailure = () => {
        if ((this.props.getSingleResponse.status !== undefined &&
            this.props.getSingleResponse.status !== 0) ||
            (this.props.saveResponse.status !== undefined &&
            this.props.saveResponse.status !== 0) || 
            (this.props.removeResponse.status !== undefined &&
                this.props.removeResponse.status !== 0)) {
            return (
                <div className="alert alert-danger todo-item--alert" role="alert">
                    Some Error occurred. Please try again later.
                </div>
            );
        }
    };

    showAlertOnValidationFailure = () => {
        if (this.props.validationMessage !== '') {
            return (
                <div className="alert alert-warning todo-item--alert" role="alert">
                    {this.props.validationMessage}
                </div>
            );
        }
    }

    showDeleteButton = () => {
        if (this.props.id) {
            return (
                <button className="btn btn-danger todo-item--button" onClick={this.removeTodo}>Delete</button>
            );
        }
    }

    saveTodo = () => {
        let validationMessage = this.validateInputs();
        if (validationMessage === '') {
            this.props.saveTodo(
                this.props.id,
                this.props.title,
                this.props.content,
                this.props.isCompleted,
                this.props.buckets,
                this.redirectOnANewItem
            );
        }
    }

    removeTodo = () => {
        if (window.confirm('Are you sure you want to delete?')) {
            this.props.removeTodo(this.props.id, this.redirectOnSuccessfulDelete);
        }
    }

    validateInputs = () => {
        let validationMessage = '';
        if (this.props.title === '') {
            validationMessage += 'Please enter todo title. \n';
        }
        if (this.props.title.length > 256) {
            validationMessage += 'Todo title length cannot be greater than 256. \n';
        }
        if (this.props.content === '') {
            validationMessage += 'Please enter todo content. \n';
        } 
        if (this.props.title.length > 1024) {
            validationMessage += 'Todo content length cannot be greater than 1024. \n';
        }
        this.props.validationMessageChanged(validationMessage);
        return validationMessage;
    }

    render() {
        return (
            <div className="todo-item--main-div">
                <Link to="/todos" className="todo-item--link">❮ Go Back to Todo List</Link>

                {this.showAlertOnSuccessfulSave()}
                {this.showAlertOnRequestFailure()}
                {this.showAlertOnValidationFailure()}

                <div className="todo-item--form">
                    <div className="row">
                        <div className="col-md-10">
                            <div className="input-group mb-3 todo-item--search-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text todo-item--input-text" id="inputGroup-sizing-default">Title:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter todo title here" 
                                className="form-control todo-item--input" 
                                aria-label="Todo Title Text" 
                                aria-describedby="inputGroup-sizing-default"
                                onChange={this.onTitleChange}
                                defaultValue={this.props.title}
                                maxLength="256"
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="input-group mb-3 todo-item--search-input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text todo-item--input-text" id="inputGroup-sizing-default">Content:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter todo content here" 
                                className="form-control todo-item--input" 
                                aria-label="Todo Content Text" 
                                aria-describedby="inputGroup-sizing-default"
                                onChange={this.onContentChange}
                                defaultValue={this.props.content}
                                maxLength="1024"
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <div className="input-group mb-3 todo-item--search-input-group">
                                <label htmlFor="todoIsCompleted" className="form-check-label">IsCompleted: {this.props.isCompleted.toString()}</label>
                                <input 
                                type="checkbox" 
                                placeholder="Enter todo content here" 
                                id="todoIsCompleted"
                                className="form-check-input todo-item--input todo-item--input-checkbox" 
                                aria-label="Todo Completion Status"
                                onChange={this.onCompletionChange}
                                checked={this.props.isCompleted}
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>

                {this.showTodoAdditonalInfo()}

                <button className="btn btn-success todo-item--button" onSubmit={this.saveTodo} onClick={this.saveTodo}>Save</button>
                {this.showDeleteButton()}
            </div>
        );
    }
}

const mapStateToProps = ({ todoData }) => {
    const { 
        id, 
        title, 
        content,
        isCompleted,
        buckets,
        createdDateMessage, 
        modifiedDateMesage, 
        validationMessage, 
        getSingleResponse,
        saveResponse,
        removeResponse
    } = todoData;
    return { 
        id, 
        title, 
        content,
        isCompleted,
        buckets,
        createdDateMessage, 
        modifiedDateMesage, 
        validationMessage, 
        getSingleResponse,
        saveResponse,
        removeResponse
    };
};

export default 
connect(mapStateToProps, {
    getBucketList,
    getSingleTodo, 
    idChanged, 
    titleChanged, 
    contentChanged,
    bucketsChanged,
    completionChanged,
    validationMessageChanged,
    saveTodo,
    removeTodo
})(TodoItem);