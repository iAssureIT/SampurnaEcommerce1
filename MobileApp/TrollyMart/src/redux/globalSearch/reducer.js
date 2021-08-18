import {
    SET_SERACH_LIST, 
    SET_LOADING,
    SET_SEARCH_TEXT,
    SET_SUGGETION_LIST,
    SET_SEARCH_CALL,
    STOP_SCROLL
  } from './types';
  
  const initialUserState = {
    searchList      : [],
    suggestionList  : [],
    searchText      : '',
    loading         : false,
    search          : false,
    stop_scroll_search     : true,
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
        case STOP_SCROLL:
          return {
            ...state,
            stop_scroll_search : payload
          }; 
      default:
        return {...state};
    }
  };