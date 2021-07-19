import {SET_NETWORK_CONNECTION} from './types';
  
  const initialUserState = {
    isConnected   : true,
  };
  export default (state = initialUserState, {type, payload}) => {
      console.log("type121212",type,"payload",payload);
    switch (type) {
      case SET_NETWORK_CONNECTION:
        return {
          ...state,
          isConnected       : payload,
        };
      default:
        return {...state};
    }
  };