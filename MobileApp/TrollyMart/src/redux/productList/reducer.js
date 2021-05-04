import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING
  } from './types';
  
  const initialUserState = {
    featureList   : [],
    exclusiveList : [],
    discountedList : [],
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case SET_FEATURE_LIST:
        return {
          ...state,
          featureList : payload.featureList
        };
        case SET_EXCLUSIVE_LIST:
        return {
          ...state,
          exclusiveList : payload.exclusiveList
        };
        case SET_DISCOUNTED_LIST:
        return {
          ...state,
          discountedList : payload.discountedList
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