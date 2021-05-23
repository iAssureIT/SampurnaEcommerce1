import {
    SET_SECTIONS, 
    SET_LOADING
} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const getSectionList = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true,
        });
        Axios.get("/api/sections/get/get_megamenu_list")
        .then(res => {
             dispatch({
                type: SET_SECTIONS,
                payload: res.data
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