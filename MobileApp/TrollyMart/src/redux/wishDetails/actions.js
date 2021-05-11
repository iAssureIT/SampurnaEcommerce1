import {
    ADD_TO_CART, 
    REMOVE_FROM_CART,
    WISH_LIST,
    SET_LOADING
} from './types';
import {Dispatch} from 'redux';
import axios from 'axios';
import {withCustomerToaster}  from '../../redux/AppState.js';

export const getWishList= (user_id) => {
    return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
    });
        axios.get('/api/wishlist/get/userwishlist/'+user_id)
        .then((response)=>{
            dispatch({
                type    : WISH_LIST,
                payload : {
                    wishList : response.data
                },
            });
        })
        .catch((error)=>{
            console.log("error getWishList",error);
            // setToast({text: 'Something went wrong.', color: 'red'});
        })
    };
};

