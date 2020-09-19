import axios from 'axios';

import {
    GET_BUCKET_LIST,
    SAVE_BUCKET,
    REMOVE_BUCKET,
    GET_SINGLE_BUCKET,
    BUCKET_ID_CHANGED,
    BUCKET_TITLE_CHANGED,
    BUCKET_COLOR_CHANGED,
    BUCKET_VALIDATION_MESSAGE_CHANGED, 
    RESET_BUCKET_STATE
} from './types';

export const idChanged = (text) => {
    return {
        type: BUCKET_ID_CHANGED,
        payload: text
    }
};

export const titleChanged = (text) => {
    return {
        type: BUCKET_TITLE_CHANGED,
        payload: text
    }
};

export const colorChanged = (text) => {
    return {
        type: BUCKET_COLOR_CHANGED,
        payload: text
    }
};

export const validationMessageChanged = (text) => {
    return {
        type: BUCKET_VALIDATION_MESSAGE_CHANGED,
        payload: text
    }
};

export const getSingleBucket = (id) => async dispatch => {
    const response = await axios.post('/api/getbuckets', { id });

    dispatch({type: GET_SINGLE_BUCKET, payload: response.data});
};

export const getBucketList = (id) => async dispatch => {
    const response = await axios.post('/api/getbuckets');

    dispatch({type: GET_BUCKET_LIST, payload: response.data});
};

export const saveBucket = (id, title, color) => async dispatch => {
    const response = await axios.post('/api/saveBucket', { id, title, color });

    dispatch({type: SAVE_BUCKET, payload: response.data});
};

export const removeBucket = (id) => async dispatch => {
    const response = await axios.post('/api/removeBucket', { id });

    dispatch({type: REMOVE_BUCKET, payload: response.data});
};

export const resetBucketState = () => {
    return {
        type: RESET_BUCKET_STATE
    };
};