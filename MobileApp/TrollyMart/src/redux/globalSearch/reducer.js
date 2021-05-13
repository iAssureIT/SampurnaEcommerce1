import {
    SET_SERACH_LIST, 
    SET_LOADING,
    SET_SEARCH_TEXT,
    SET_SUGGETION_LIST,
    SET_SEARCH_CALL
  } from './types';
  
  const initialUserState = {
    searchList      : [],
    suggestionList  : [],
    searchText      : '',
    loading         : false,
    search          : false
  };
  export default (state = initialUserState, {type, payload}) => {
    switch (type) {
      case SET_SERACH_LIST:
        return {
          ...state,
          searchList : payload
        };
        case SET_SEARCH_TEXT:
        return {
            ...state,
            searchText : payload
        };
        case SET_SUGGETION_LIST:
          return {
              ...state,
              suggestionList : payload
          };
      case SET_LOADING:
        return {
          ...state,
          loading: payload,
      };  
      case SET_SEARCH_CALL :
        return {
          ...state,
          search : payload
        };
      default:
        return {...state};
    }
  };