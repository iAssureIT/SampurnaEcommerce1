import {
    SET_FEATURE_LIST, 
    SET_EXCLUSIVE_LIST,
    SET_DISCOUNTED_LIST,
    SET_LOADING,
    SET_CATEGORY_WISE_LIST,
    SET_CATEGORY_LIST,
    SET_ALL_PRODUCT_LIST,
    SET_SEARCH_PAYLOAD,
    STOP_SCROLL,
    SET_CART_COUNT
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



export const getCartCount = (user_id) => {
    return async (dispatch, getState) => {
        const store = getState();
        axios.get("/api/carts/get/count/" + user_id)
        .then((response)=>{
            console.log("response",response);
            dispatch({
                type: SET_CART_COUNT,
                payload: response.data,
            });
        })
        .catch((error)=>{
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
        payload.userLatitude    = store.location?.address?.latlong?.lat;
        payload.userLongitude   = store.location?.address?.latlong?.lng;
        if(!payload.categoryUrl){
            var category =await axios.get("/api/category/get/list/"+payload.sectionUrl+"/"+payload.vendor_ID);
            dispatch({
                type: SET_CATEGORY_LIST,
                payload: category.data,
            });
            payload.categoryUrl = category?.data?.categoryList[0]?.categoryUrl;
            // if(category?.data?.categoryList[0].subCategory && category?.data?.categoryList[0].subCategory.length >0){
            //     payload.subCategoryUrl = category?.data?.categoryList[0].subCategory[0]?.subCategoryUrl;
            // }else{
            // payload.subCategoryUrl = []
            // }
        }
            axios.post("/api/products/get/list/lowestprice",payload)
            .then((response)=>{
                if(payload.scroll && payload.scroll === true){
                    var newList = store.productList.categoryWiseList.concat(response.data);
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
    };
};

