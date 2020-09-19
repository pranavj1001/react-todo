import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { getTodoList } from '../../actions/todo-actions';
import Tile from '../tile/tile';

import './todos-showcase.css';

class TodosShowcase extends Component {
    componentDidMount() {
        this.props.getTodoList();
    }

    renderTodoList() {
        if (this.props.todoData.status !== 0) {
            return (
                <div className="alert alert-danger todo-showcase--alert" role="alert">
                    Server might be under maintainence. Please try again later.
                </div>
            );
        }

        if (!this.props.todoData.data) {
            return (
                <div className="alert alert-info todo-showcase--primary" role="alert">
                    No Todo yet. Please add some Todo to be viewable here.
                </div>
            );
        }

        return this.props.todoData.data.map(todo => {
            if (todo.iscompleted) {
                todo.color = 'rgba(66, 103, 178, 0.8)';
            } else {
                todo.color = 'rgba(66, 103, 178, 1)';
            }
            todo.link = `/todo/addedit/${todo.id}`;
            return (
                <div key={todo.id} className="col-xl-6 todo-showcase--tile">
                    <Tile data={todo} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="todo-showcase--main-div">
                <Link to="/" className="todo-showcase--link">❮ Go Back to Home</Link>
                <div className="todo-showcase--tools">
                    <div className="row">
                        <div className="col-md-4">
                            <div class="input-group mb-3 todo-showcase--search-input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-default">Search Text:</span>
                                </div>
                                <input 
                                type="text" 
                                placeholder="Enter Search Text Here" 
                                className="form-control todo-showcase--input" 
                                aria-label="Search Text" 
                                aria-describedby="inputGroup-sizing-default"></input>
                            </div>
                        </div>
                        <div className="col-md-8 todo-showcase--tools-buttons">
                            <Link to="/todo/addedit/" className="btn btn-default todo-showcase--button">Add Todo</Link>
                            <Link to="/bucket/addedit/" className="btn btn-default todo-showcase--button">Add Category</Link>
                        </div>
                    </div>
                </div>
                <div className="row todo-showcase--row">
                    {this.renderTodoList()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ todoData }) => {
    return { todoData }
};

export default connect(mapStateToProps, { getTodoList })(TodosShowcase);