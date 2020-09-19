import {
    GET_TODO_LIST,
} from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case GET_TODO_LIST:
            return action.payload;
        default:
            return state;
    }
};