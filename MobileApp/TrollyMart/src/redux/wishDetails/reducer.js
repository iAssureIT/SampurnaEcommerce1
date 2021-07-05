import {
    WISH_LIST,
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    wishList        : [],
    loading         : false
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case WISH_LIST:
        return {
          ...state,
          wishList : payload.wishList
        };
      case SET_LOADING :
        return {
          ...state,
          loading : payload
        };
      default:
        return {...state};
    }
  };