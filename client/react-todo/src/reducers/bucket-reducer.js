import {
    GET_BUCKET_LIST,
    GET_SINGLE_BUCKET,
    BUCKET_ID_CHANGED,
    BUCKET_TITLE_CHANGED,
    BUCKET_COLOR_CHANGED,
    BUCKET_VALIDATION_MESSAGE_CHANGED, 
    SAVE_BUCKET, 
    REMOVE_BUCKET, RESET_BUCKET_STATE
} from '../actions/types';

const INITIAL_STATE = {
    id: null,
    title: "",
    color: "",
    createddate: "",
    modifieddate: "",
    createdDateMessage: "",
    modifiedDateMesage: "",
    getSingleResponse: {},
    getListResponse: {},
    saveBucketResponse: {},
    removeBucketResponse: {},
    validationMessage: ""
};

const createModifiedDateMessage = (dateString) => {
    const date = new Date(dateString)
    return `Last Modified on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

const createCreationDateMessage = (dateString) => {
    const date = new Date(dateString);
    return `Created on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_BUCKET_STATE:
            return INITIAL_STATE;
        case GET_BUCKET_LIST:
            return {...state, getListResponse: action.payload};
        case GET_SINGLE_BUCKET:
            if (action.payload.status === 0 && action.payload.data) {
                return {
                    ...state,
                    getSingleResponse: action.payload,
                    id: action.payload.data[0].id,
                    title: action.payload.data[0].title,
                    color: action.payload.data[0].color,
                    createddate: action.payload.data[0].createddate,
                    modifieddate: action.payload.data[0].modifieddate,
                    createdDateMessage: createCreationDateMessage(action.payload.data[0].createddate),
                    modifiedDateMesage: createModifiedDateMessage(action.payload.data[0].modifieddate)
                };
            }
            return {...state, getSingleResponse: action.payload };
        case SAVE_BUCKET:
            return {...state, saveBucketResponse: action.payload };
        case REMOVE_BUCKET:
            return {...state, removeBucketResponse: action.payload };
        case BUCKET_ID_CHANGED:
            return {...state, id: action.payload };
        case BUCKET_TITLE_CHANGED:
            return {...state, title: action.payload };
        case BUCKET_COLOR_CHANGED:
            return {...state, color: action.payload };
        case BUCKET_VALIDATION_MESSAGE_CHANGED:
            return {...state, validationMessage: action.payload };
        default:
            return state;
    }
};