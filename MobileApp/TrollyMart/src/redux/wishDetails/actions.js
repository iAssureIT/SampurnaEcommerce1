import {
    ADD_TO_CART, 
    REMOVE_FROM_CART,
    WISH_LIST,
    SET_LOADING
} from './types';
import {
    STOP_SCROLL 
} from '../productList/types';
import {
    STOP_SCROLL_SEARCH 
} from '../globalSearch/types';
import {Dispatch} from 'redux';
import axios from 'axios';
import {withCustomerToaster}  from '../../redux/AppState.js';

export const getWishList= (user_id) => {
    return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
    });
    dispatch({
        type: STOP_SCROLL,
        payload: true,
    });
    dispatch({
        type: STOP_SCROLL_SEARCH,
        payload: true,
    });
    const store = getState();
    var payload ={
        "user_ID"             : store.userDetails.user_id,
        "userLat"             : store.location?.address?.latlong?.lat, 
        "userLong"            : store.location?.address?.latlong?.lng
    }
    // console.log("payload",payload);
        axios.post('/api/wishlist/get/userwishlist',payload)
        .then((response)=>{
            console.log("response",response);
            dispatch({
                type    : WISH_LIST,
                payload : {
                    wishList : response.data
                },
            });
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
        })
        .catch((error)=>{
            dispatch({
                type: SET_LOADING,
                payload: false,
            });
            // console.log("error getWishList",error);
            // setToast({text: 'Something went wrong.', color: 'red'});
        })
    };
};

