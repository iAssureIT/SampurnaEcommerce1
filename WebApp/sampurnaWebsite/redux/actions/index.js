import axios from 'axios';

export const setBlockData = (data) => ({
    type: 'SET_BLOCKS_DATA',
    payload : data
})

export const getBlockData = (data) => ({
    type: 'GET_BLOCKS_DATA',
    payload : datapageData
})

export function updatePin(pincode,status) {
  // console.log("In Action updatePin value ===",pincode);
  // console.log("In Action updatestatus value ===",status);
  return {
    type: "PINCODE_DATA",
    deliveryPincode: pincode,
    pincodeStatus  : status
  }
}
export const fetchcartdata = cartdata => ({
  type: 'FETCH_CART_DATA',
  cartData: cartdata
});

export const fetchcategorydata = categorydata => ({
  type: 'FETCH_CATEGORY_DATA',
  categoryData: categorydata
});

export const setWishlistData = wishlistdata => ({
  type: 'FETCH_WISHLIST_DATA',
  wishlistData: wishlistdata
});

export const setProductApiUrl = pageUrl => ({
  type: 'SET_PRODUCT-APIURL',
  pageUrl: pageUrl
});

export function updateForm(formValue) {
  // console.log("In Action updateForm value ===",formValue);
  return {
    type: "MODAL_DATA",
    formToShow: formValue
  }
}

export function getCartData() {
	return dispatch =>{
	const userid = localStorage.getItem('user_ID');  
    if (userid) {
      return axios.get("/api/carts/get/cartproductlist/"+userid)
        .then((response)=>{ 
          if(response){   
            // console.log("inside acion  fetchCartData:",response.data);  
            dispatch(fetchcartdata(response.data));
          }
        })
        .catch((error)=>{ 
              console.log('error', error);
        })
    }else{
      dispatch(fetchcartdata([]));
    }
  }  
}

export function getWishlistData() {
	return dispatch =>{
	const userid = localStorage.getItem('user_ID');
    if (userid) {      
      // return axios.get('/api/wishlist/get/userwishlist/'+userid)
      axios.get('/api/wishlist/get/wishlistdata/'+userid) 
      .then((response)=>{
        if(response){
          // console.log("action wishlist response===",response.data);
          // dispatch(setWishlistData(response.data));
        }       
      })
      .catch((error)=>{
        console.log('error', error);
      })

    }else{
      dispatch(setWishlistData([]));
    }
  }  
}

export function getCategoryData() {
	return dispatch =>{
      return axios.get("/api/category/get/list/")
        .then((response)=>{
            // console.log("category redux action response.data===",response.data);
            dispatch(fetchcategorydata(response.data));            
        })
        .catch((error)=>{ 
              console.log('error', error);
        })
  }  
}

export const searchProductAction = (searchCriteria, searchResult )=> ({
      type: 'SEARCH_PRODUCT',
      searchCriteria: searchCriteria,
      searchResult: searchResult
});

export const getForm = formToShow => ({
  type: 'MODAL_DATA',
  formToShow: formToShow
});

export const getPincode = deliveryPincode => ({
  type            : 'PINCODE_DATA',
  deliveryPincode : deliveryPincode
});