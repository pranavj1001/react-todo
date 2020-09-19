import axios from 'axios';

import {
    GET_BUCKET_LIST,
} from './types';

export const getBucketList = () => async dispatch => {
    const response = await axios.post('/api/getbuckets');

    dispatch({type: GET_BUCKET_LIST, payload: response.data});
};