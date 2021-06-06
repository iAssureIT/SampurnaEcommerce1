import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING,
    SET_CATEGORY_WISE_LIST,
    SET_CATEGORY_LIST,
    SET_ALL_PRODUCT_LIST,
    SET_SEARCH_PAYLOAD,
    STOP_SCROLL
} from './types';
import axios from 'axios';
import { Alert } from 'react-native';

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
            else if(productType==="view_all"){
                dispatch({
                    type        : SET_ALL_PRODUCT_LIST,
                    payload: {
                       allProductList : response.data
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
        payload.user_id         = store.userDetails.user_id;
        payload.userLatitude    = store.location?.coords?.latitude,
        payload.userLongitude   = store.location?.coords?.longitude,
        console.log("payload",payload);
        axios.get("/api/category/get/list/"+payload.sectionUrl+"/"+payload.vendorID)
        .then((category)=>{
            dispatch({
                type: SET_CATEGORY_LIST,
                payload: category.data,
            });
            if(!payload.categoryUrl){
                payload.categoryUrl = category?.data?.categoryList[0]?.categoryUrl;
                // payload.subCategoryUrl = category?.data[0]?.subCategory[0]?.subCategoryUrl;
            }
            axios.post("/api/products/get/list/lowestprice",payload)
            .then((response)=>{
                // console.log("response",response);
                if(payload.scroll && payload.scroll === true){
                    // console.log('store.productList.categoryWiseList',store.productList.categoryWiseList);
                    var newList = store.productList.categoryWiseList.concat(response.data);
                    // console.log("newList",newList);
                    dispatch({
                        type: SET_CATEGORY_WISE_LIST,
                        payload: newList,
                    });
                   
                }else{
                    dispatch({
                        type: SET_CATEGORY_WISE_LIST,
                        payload: response.data,
                    });
                    
                }
                dispatch({
                    type: SET_SEARCH_PAYLOAD,
                    payload: payload,
                  });
                dispatch({
                    type: SET_LOADING,
                    payload: false,
                });
                if(response.data < 10){
                    dispatch({
                        type: STOP_SCROLL,
                        payload: true,
                    });
                }
            })
            .catch((error)=>{
                console.log("error getList1",error);
            })
        })
        .catch((error)=>{
            console.log("error getList2",error);
        })
    };
};

