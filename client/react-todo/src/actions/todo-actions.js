import axios from 'axios';

import {
    GET_BUCKET_LIST,
    GET_SINGLE_TODO,
    GET_TODO_LIST, 
    REMOVE_TODO, 
    RESET_TODO_STATE, 
    SAVE_TODO, 
    TODO_BUCKETS_CHANGED, 
    TODO_BUCKETS_RENDER_LIST_CHANGED, 
    TODO_BUCKET_DROPDOWN_TOGGLED, 
    TODO_BUCKET_INPUT_STRING_CHANGED, 
    TODO_COMPLETION_CHANGED, 
    TODO_CONTENT_CHANGED, 
    TODO_ID_CHANGED, 
    TODO_TITLE_CHANGED, 
    TODO_VALIDATION_MESSAGE_CHANGED,
} from './types';

export const idChanged = (update) => {
    return {
        type: TODO_ID_CHANGED,
        payload: update
    }
};

export const titleChanged = (update) => {
    return {
        type: TODO_TITLE_CHANGED,
        payload: update
    }
};

export const contentChanged = (update) => {
    return {
        type: TODO_CONTENT_CHANGED,
        payload: update
    }
};

export const completionChanged = (update) => {
    return {
        type: TODO_COMPLETION_CHANGED,
        payload: update
    }
};

export const bucketsChanged = (update) => {
    return {
        type: TODO_BUCKETS_CHANGED,
        payload: update
    }
};

export const validationMessageChanged = (update) => {
    return {
        type: TODO_VALIDATION_MESSAGE_CHANGED,
        payload: update
    }
};

export const bucketDropdownToggled = (update) => {
    return {
        type: TODO_BUCKET_DROPDOWN_TOGGLED,
        payload: update
    }
};

export const bucketRenderListChanged = (update) => {
    return {
        type: TODO_BUCKETS_RENDER_LIST_CHANGED,
        payload: update
    }
};

export const bucketInputStringChanged = (update) => {
    return {
        type: TODO_BUCKET_INPUT_STRING_CHANGED,
        payload: update
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

export const saveTodo = (id, title, content, isCompleted, buckets = [], callback) => async dispatch => {
    const bucketArray = [];
    if (buckets) {
        for (const bucket of buckets) {
            if (bucket.checked) {
                bucketArray.push(bucket.id);
            }
        }
    }
    buckets = bucketArray;
    const response = await axios.post(
        '/api/savetodo', 
        { id, title, content, isCompleted, buckets, isBucketChanged: true });

    dispatch({type: SAVE_TODO, payload: response.data});
    callback(response.data);
};

export const removeTodo = (id, callback) => async dispatch => {
    const response = await axios.post('/api/removetodo', { id });

    dispatch({type: REMOVE_TODO, payload: response.data});
    callback(response.data);
};

export const resetTodo = () => {
    return {
        type: RESET_TODO_STATE
    };
};

export const getBucketList = () => async dispatch => {
    const response = await axios.post('/api/getbuckets');

    dispatch({type: GET_BUCKET_LIST, payload: response.data});
};