import axios from 'axios';

import {
    GET_SINGLE_TODO,
    GET_TODO_LIST, 
    REMOVE_TODO, 
    RESET_TODO_STATE, 
    SAVE_TODO, 
    TODO_BUCKETS_CHANGED, 
    TODO_COMPLETION_CHANGED, 
    TODO_CONTENT_CHANGED, 
    TODO_ID_CHANGED, 
    TODO_TITLE_CHANGED, 
    TODO_VALIDATION_MESSAGE_CHANGED,
} from './types';

export const idChanged = (text) => {
    return {
        type: TODO_ID_CHANGED,
        payload: text
    }
};

export const titleChanged = (text) => {
    return {
        type: TODO_TITLE_CHANGED,
        payload: text
    }
};

export const contentChanged = (text) => {
    return {
        type: TODO_CONTENT_CHANGED,
        payload: text
    }
};

export const completionChanged = (text) => {
    return {
        type: TODO_COMPLETION_CHANGED,
        payload: text
    }
};

export const bucketsChanged = (text) => {
    return {
        type: TODO_BUCKETS_CHANGED,
        payload: text
    }
};

export const validationMessageChanged = (text) => {
    return {
        type: TODO_VALIDATION_MESSAGE_CHANGED,
        payload: text
    }
};

export const getTodoList = () => async dispatch => {
    const response = await axios.post('/api/gettodos');

    dispatch({type: GET_TODO_LIST, payload: response.data});
};

export const getSingleTodo = (id) => async dispatch => {
    const response = await axios.post('/api/gettodos', { id });

    dispatch({type: GET_SINGLE_TODO, payload: response.data});
};

export const saveTodo = (id, title, content, isCompleted, buckets, isBucketChanged = true) => async dispatch => {
    const response = await axios.post(
        '/api/savetodo', 
        { id, title, content, isCompleted, buckets });

    dispatch({type: SAVE_TODO, payload: response.data});
};

export const removeTodo = (id) => async dispatch => {
    const response = await axios.post('/api/removetodo', { id });

    dispatch({type: REMOVE_TODO, payload: response.data});
};

export const resetTodo = () => {
    return {
        type: RESET_TODO_STATE
    };
};