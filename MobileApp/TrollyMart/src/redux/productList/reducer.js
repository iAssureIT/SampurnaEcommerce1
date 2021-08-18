import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING,
    SET_CATEGORY_WISE_LIST,
    SET_CATEGORY_LIST,
    SET_ALL_PRODUCT_LIST,
    SET_SEARCH_PAYLOAD,
    STOP_SCROLL,
    SET_CART_COUNT
  } from './types';
  
  const initialUserState = {
    featuredList      : [],
    exclusiveList     : [],
    discountedList    : [],
    categoryWiseList  : [],
    categoryList      : [],
    allProductList    : [],
    searchPayload     : '',
    stop_scroll       : true,
    cartCount          : 0,
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
      case SET_CART_COUNT:
      return {
        ...state,
        cartCount : payload
      };
      case STOP_SCROLL:
      return {
        ...state,
        stop_scroll : payload
      };  
      case SET_CATEGORY_LIST:
      return {
        ...state,
        categoryList : payload
      };
      case SET_ALL_PRODUCT_LIST:
      return {
        ...state,
        allProductList : payload.allProductList
      };
      case SET_SEARCH_PAYLOAD:
      return {
        ...state,
        searchPayload : payload,
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