import axios from 'axios';

export const setBlockData = (data) => ({
    type: 'SET_BLOCKS_DATA',
    payload : data
})
export const setCurrency = (data) => ({
  type: 'SET_CURRENCY_DATA',
  payload : data
})

export const getBlockData = (data) => ({
    type: 'GET_BLOCKS_DATA',
    payload : datapageData
})

export function updatePin(pincode,status) {
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

export const fetchaddressdata = addressdata => ({
  type: 'FETCH_ADDRESS_DATA',
  addressData: addressdata
});

export const cartCount = count => ({
  type: 'CART_COUNT',
  cartCount: count
});

export const fetchcategorydata = categorydata => ({
  type: 'FETCH_CATEGORY_DATA',
  categoryData: categorydata
});

export const setWishlistData = wishlistdata => ({
  type: 'FETCH_WISHLIST_DATA',
  wishlistData: wishlistdata
});

//set productAPI for productlist page
export const setProductApiUrl = pageUrl => ({
  type   : 'SET_PRODUCT-APIURL',
  pageUrl: pageUrl
});
 
export const setSampurnaWebsiteDetails = sampurnaWebsiteDetails => ({
  type                  : 'SET_SAMPURNA-WEBSITE-DETAILS',
  sampurnaWebsiteDetails: sampurnaWebsiteDetails
});

export const setSearchDetails = setSearchDetails =>({
  type             : "SET_SEARCH_DETAILS",
  setSearchDetails : setSearchDetails
})

export function updateForm(formValue) {
  return {
    type: "MODAL_DATA",
    formToShow: formValue
  }
}
export function updateCartCount() {
    return dispatch =>{
      var userDetails = JSON.parse(localStorage.getItem('userDetails'));
      var userid = userDetails.user_id;
      if (userid) {
        axios.get("/api/carts/get/count/" + userid)
        .then((response) => {
          // console.log("cartcount = ",response);
          dispatch(cartCount(response.data));
        })
        .catch((error) => {
          console.log("error",error);
        })
      }else{
        dispatch(cartCount([]));
      }
    }  
}

export function getCartData() {
	return dispatch =>{
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      var userid = userDetails.user_id;
      if (userid) {
        dispatch({
          type: 'SET_LOADING',
          loading: true
        });
        return axios.get("/api/carts/get/cartproductlist/"+userid)
          .then((response)=>{ 
            if(response){   
              // console.log("my cart response =",response.data);
              for(let i=0;i<response.data.vendorOrders.length;i++){
                  if(response.data.vendorOrders[i].vendor_netPayableAmount < response.data.minOrderAmount){
                    
                    var cartBtnDisabled = true;
                    response.data.vendorOrders[i].invalidOrder = "cartWarning";
                    response.data.vendorOrders[i].cartBtnDisabled = true;
                    
                  }
              }
              if(cartBtnDisabled){
                response.data.cartBtnDisabled = true;
              }
              // console.log("cart response =",response.data);
              dispatch(fetchcartdata(response.data));
              dispatch({
                type: 'SET_LOADING',
                loading: false
              });
            }
          })
          .catch((error)=>{ 
              console.log('fetchcartdata error 1', error);
          })
      }else{
        dispatch(fetchcartdata([]));
      }
  }
  }  
}

export function getAddressData(){
  return dispatch =>{
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      var userid = userDetails.user_id;
    }
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails')); 
      if(sampurnaWebsiteDetails){
        if(sampurnaWebsiteDetails.deliveryLocation){
          var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
            var  latitude  = deliveryLocation.latitude;
            var longitude = deliveryLocation.longitude;
        }
      }
    if(userDetails && deliveryLocation){
    var formValues = {
        "user_id"       : userid,
        "latitude"      : latitude,
        "longitude"     : longitude,
    }
    console.log("formValues=>",formValues);
    axios.post('/api/ecommusers/myaddresses',formValues)
      .then(response => {
          console.log("address response===",response);
          if(response){
             dispatch(fetchaddressdata(response.data.deliveryAddress));
          }
      })
      .catch((error)=>{
          console.log("Error while getting getAddressWithDistanceLimit:",error);
          dispatch(fetchaddressdata([]));
      })
    }
  }
}

//getWishlist new
// export function getWishlist(data){
//   axios.post('/api/wishlist/get/userwishlist', formValues)    
//   .then((response) => {
//     if(response){
//       console.log('wishlist data', response.data);
//       dispatch(setWishlistData(response.data));
//     }
//   })
//   .catch((error) => {
//     console.log('error', error);
//   })
// }

// export function setCartData(data) {
// 	return dispatch =>{
//     dispatch(fetchcartdata(data));
//   }  
// }


export function getWishlistData() {
	return dispatch =>{
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      var userid = userDetails.user_id;
      if (userid) {      
        axios.get('/api/wishlist/get/wishlistdata/'+userid) 
        .then((response)=>{
          if(response){
            // console.log("Wishlist Data-",response.data);
            dispatch(setWishlistData(response.data));
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
export const getForm = formToShow => ({
  type: 'MODAL_DATA',
  formToShow: formToShow
});

// export const searchProductAction = (searchCriteria, searchResult )=> ({
//   type: 'SEARCH_PRODUCT',
//   searchCriteria: searchCriteria,
//   searchResult: searchResult
// });
// export const getPincode = deliveryPincode => ({
//   type            : 'PINCODE_DATA',
//   deliveryPincode : deliveryPincode
// });