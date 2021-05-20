import {
    SET_PREFERENCES, 
    SET_LOADING
} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const getPreferences = () => {
return async (dispatch, getState) => {
dispatch({
  type: SET_LOADING,
  payload: true,
});
Axios.get('/api/adminpreference/get') 
.then(response => {
  dispatch({
    type: SET_PREFERENCES,
    payload:response.data[0]
  });
  dispatch({
    type: SET_LOADING,
    payload: false,
  });
  })
  .catch(err => {
    console.log('err1', err);
    dispatch({
      type: SET_LOADING,
      payload: false,
    });
  });
};
};