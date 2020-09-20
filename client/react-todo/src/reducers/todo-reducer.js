import {
    GET_BUCKET_LIST,
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
} from '../actions/types';

const INITIAL_STATE = {
    id: null,
    title: "",
    content: "",
    isCompleted: false,
    buckets: [],
    isBucketChanged: true,
    createddate: "",
    modifieddate: "",
    createdDateMessage: "",
    modifiedDateMesage: "",
    getSingleResponse: {},
    getListResponse: {},
    getBucketListResponse: {},
    saveResponse: {},
    removeResponse: {},
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
        case RESET_TODO_STATE:
            return INITIAL_STATE;
        case GET_BUCKET_LIST:
            return {...state, getBucketListResponse: action.payload};
        case GET_TODO_LIST:
            return {...state, getListResponse: action.payload};
        case GET_SINGLE_TODO:
            if (action.payload.status === 0 && action.payload.data) {
                return {
                    ...state,
                    getSingleResponse: action.payload,
                    id: action.payload.data[0].id,
                    title: action.payload.data[0].title,
                    content: action.payload.data[0].content,
                    isCompleted: action.payload.data[0].iscompleted,
                    buckets: action.payload.data[0].buckets,
                    createddate: action.payload.data[0].createddate,
                    modifieddate: action.payload.data[0].modifieddate,
                    createdDateMessage: createCreationDateMessage(action.payload.data[0].createddate),
                    modifiedDateMesage: createModifiedDateMessage(action.payload.data[0].modifieddate)
                };
            }
            return {...state, getSingleResponse: action.payload };
        case SAVE_TODO:
            return {...state, saveResponse: action.payload };
        case REMOVE_TODO:
            return {...state, removeResponse: action.payload };
        case TODO_ID_CHANGED:
            return {...state, id: action.payload };
        case TODO_TITLE_CHANGED:
            return {...state, title: action.payload };
        case TODO_CONTENT_CHANGED:
            return {...state, content: action.payload };
        case TODO_COMPLETION_CHANGED:
            return {...state, isCompleted: action.payload };
        case TODO_BUCKETS_CHANGED:
            return {...state, buckets: action.payload }; 
        case TODO_VALIDATION_MESSAGE_CHANGED:
            return {...state, validationMessage: action.payload };
        default:
            return state;
    }
};