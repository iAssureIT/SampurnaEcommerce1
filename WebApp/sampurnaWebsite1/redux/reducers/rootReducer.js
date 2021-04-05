import reducer from './index.js';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    data : reducer
});

export default rootReducer;
