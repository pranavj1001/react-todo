import { combineReducers } from 'redux';
import HomeReducer from './home-reducer';
import TodoReducer from './todo-reducer';
import BucketReducer from './bucket-reducer';

export default combineReducers({
    homeTileData: HomeReducer,
    todoData: TodoReducer,
    bucketData: BucketReducer
});
