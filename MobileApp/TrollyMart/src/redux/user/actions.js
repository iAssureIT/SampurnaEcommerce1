import {
		SET_USER_DETAILS, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const setUserDetails = (payload) => {
  return {
    type: SET_USER_DETAILS,
    payload: payload,
  };
};

export const getUserDetails = (user_id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    Axios.get('/api/users/get/id/'+user_id) 
    .then(res => {
      dispatch({
        type: SET_USER_DETAILS,
        payload: {
          user_id     : res.data._id,
          firstName   : res.data.profile.firstname,
          lastName    : res.data.profile.lastname,
          email       : res.data.profile.email,
          mobile      : res.data.profile.mobile,
          countryCode : res.data.profile.countryCode,
          fullName    : res.data.profile.fullName,
          company_id  : res.data.profile.company_id,
          companyID   : res.data.profile.companyID,
          companyName : res.data.profile.companyName,
          status      : res.data.profile.status,
          role        : res.data.roles,
        },
      });
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      })
      .catch(err => {
        console.log('err', err);
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      });
  };
};