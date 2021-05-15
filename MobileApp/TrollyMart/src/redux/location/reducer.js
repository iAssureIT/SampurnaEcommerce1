import {
    SET_USER_ADDRESS, 
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    address   : '',
    coords    : ''
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case SET_USER_ADDRESS:
        return {
          ...state,
          address   : payload.address,
          coords    : payload.coords    
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