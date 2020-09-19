import axios from 'axios';

import {
    GET_TODO_LIST,
} from './types';

export const getTodoList = () => async dispatch => {
    const response = await axios.post('/api/gettodos');

    dispatch({type: GET_TODO_LIST, payload: response.data});
};