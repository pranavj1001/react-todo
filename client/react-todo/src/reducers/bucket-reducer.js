import {
    GET_BUCKET_LIST,
} from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case GET_BUCKET_LIST:
            return action.payload;
        default:
            return state;
    }
};