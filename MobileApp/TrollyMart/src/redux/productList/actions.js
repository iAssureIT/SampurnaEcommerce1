import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING
} from './types';
import {Dispatch} from 'redux';
import axios from 'axios';



export const getList = (productType1) => {
    return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
    });
        axios.get("/api/products/get/products/listbytype/"+productType1)
        .then((response)=>{
            console.log("response getList")
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
            navigation.navigate('App')
            setToast({text: 'Something went wrong.', color: 'red'});
        })
    };
};
