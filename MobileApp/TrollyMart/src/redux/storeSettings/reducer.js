import {
    SET_PREFERENCES, 
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    preferences : '',
  };
  export default (state = initialUserState, {type, payload}) => {
      console.log("type",type,"payload",payload)
    switch (type) {
      case SET_PREFERENCES:
        return {
          ...state,
          preferences  : payload,
        };
      case SET_LOADING:
        return {
          ...state,
          loading: payload,
      };  
      default:
        return {...state};
    }
  };