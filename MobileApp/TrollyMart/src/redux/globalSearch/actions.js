import {
    SET_SERACH_LIST, 
    SET_LOADING,
    SET_SEARCH_TEXT,
    SET_SUGGETION_LIST
} from './types';
import {dispatch} from 'redux';
import axios from 'axios';

export const getSearchResult = (searchText,user_id) => {
    console.log("searchText",searchText);
    return async (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true,
        });
        dispatch({
            type: SET_SEARCH_TEXT,
            payload: searchText,
        });
        axios.get("/api/products/get/search/website/" + searchText+"/"+user_id)
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
    console.log("payload",payload);
    return async (dispatch, getState) => {
        axios.post("/api/products/get/search/suggestion",payload)
        .then((response) => {
            console.log("response getSuggestion",response);
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

