import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING,
    SET_CATEGORY_WISE_LIST,
    SET_CATEGORY_LIST
} from './types';
import axios from 'axios';

export const getList = (productType,user_id,limit) => {
    return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
    });
        axios.get("/api/products/get/products/listbytype/"+productType+"/"+user_id+"/"+limit)
        .then((response)=>{
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
            if(productType==="featured"){
                dispatch({
                    type        : SET_FEATURE_LIST,
                    payload: {
                       featuredList : response.data
                    },
                });
            }else if(productType==="exclusive"){
                dispatch({
                    type        : SET_EXCLUSIVE_LIST,
                    payload: {
                       exclusiveList : response.data
                    },
                });
            }else if(productType==="discounted"){
                dispatch({
                    type        : SET_DISCOUNTED_LIST,
                    payload: {
                       discountedList : response.data
                    },
                });
            }
        })
        .catch((error)=>{
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
            console.log("error getList",error);
        })
    };
};



export const getCategoryWiseList = (payload) => {
    return async (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true,
        });
        const store = getState();
        payload.user_id = store.userDetails.user_id;
        payload.userLatitude    = store.location?.coords?.latitude,
        payload.userLongitude   = store.location?.coords?.userLongitude,
        console.log("payload",payload);
        axios.get("/api/category/get/list/"+payload.sectionUrl+"/"+payload.vendorID)
        .then((category)=>{
            dispatch({
                type: SET_CATEGORY_LIST,
                payload: category.data,
            });
            axios.post("/api/products/get/list/lowestprice",payload)
            .then((response)=>{
                dispatch({
                    type: SET_CATEGORY_WISE_LIST,
                    payload: response.data,
                });
                dispatch({
                    type: SET_LOADING,
                    payload: false,
                });
            })
            .catch((error)=>{
                console.log("error getList",error);
            })
        })
        .catch((error)=>{
            console.log("error getList",error);
        })
    };
};

