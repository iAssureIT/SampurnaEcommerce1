import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING
} from './types';
import {Dispatch} from 'redux';
import axios from 'axios';



export const getList = (productType1,user_id) => {
    return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
    });
        axios.get("/api/products/get/products/listbytype/"+productType1+"/"+user_id)
        .then((response)=>{
            if(productType1==="featured"){
                dispatch({
                    type        : SET_FEATURE_LIST,
                    payload: {
                       featureList : response.data
                    },
                });
            }else if(productType1==="exclusive"){
                dispatch({
                    type        : SET_EXCLUSIVE_LIST,
                    payload: {
                       exclusiveList : response.data
                    },
                });
            }else if(productType1==="discounted"){
                dispatch({
                    type        : SET_DISCOUNTED_LIST,
                    payload: {
                       discountedList : response.data
                    },
                });
            }
        })
        .catch((error)=>{
            console.log("error getList",error);
        })
    };
};
