import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING,
    SET_CATEGORY_WISE_LIST,
  } from './types';
  
  const initialUserState = {
    featuredList       : [],
    exclusiveList     : [],
    discountedList    : [],
    categoryWiseList  : []
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case SET_FEATURE_LIST:
      return {
        ...state,
        featuredList : payload.featuredList
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
      case SET_CATEGORY_WISE_LIST:
        return {
          ...state,
          categoryWiseList : payload
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