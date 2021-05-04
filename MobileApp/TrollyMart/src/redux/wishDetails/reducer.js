import {
    ADD_TO_CART, 
    REMOVE_FROM_CART,
    WISH_LIST,
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    wishList        : [],
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case WISH_LIST:
        return {
          ...state,
          wishList : payload.wishList
        };
      default:
        return {...state};
    }
  };