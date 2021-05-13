import {
    SET_SERACH_LIST, 
    SET_LOADING,
    SET_SEARCH_TEXT,
    SET_SUGGETION_LIST
} from './types';
import {dispatch} from 'redux';
import axios from 'axios';

export const getSearchResult = (searchText,user_id,limit) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true,
        });
        axios.get("/api/products/get/search/website/" + searchText+"/"+user_id+"/"+limit)
        .then((response) => {
            dispatch({
                type: SET_SERACH_LIST,
                payload: response.data,
            });
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
        })
        .catch((error) => {
            console.log("error",error);
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
            // setToast({text: 'Something went wrong.', color: 'red'});
        })
    };
};

export const getSuggestion = (payload) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_SEARCH_TEXT,
            payload: payload.searchText,
        });
        axios.post("/api/products/get/search/suggestion",payload)
        .then((response) => {
            dispatch({
                type: SET_SUGGETION_LIST,
                payload: response.data,
            });
        })
        .catch((error) => {
            console.log("error",error);
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
            // setToast({text: 'Something went wrong.', color: 'red'});
        })
    };
};

