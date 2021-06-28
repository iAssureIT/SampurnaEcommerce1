import {
    SET_SECTIONS, 
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    sections   : [],
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case SET_SECTIONS:
        return {
          ...state,
          sections       : payload,
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