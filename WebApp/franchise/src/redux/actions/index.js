import axios from 'axios';

export function updateForm(formValue) {
  // console.log("In Action updateForm value ===",formValue);
  return {
    type: "MODAL_DATA",
    formToShow: formValue
  }
}

export function getCartData() {
	return dispatch =>{

	// $('.fullpageloader').show();

	const userid = localStorage.getItem('user_ID');
  
    if (userid) {
      return axios.get("/api/carts/get/cartproductlist/"+userid)
        .then((response)=>{
            // console.log("2.redux action cart response.data===",response.data);
            dispatch(fetchcartdata(response.data));
            // console.log("fetchCartData:",fetchcartdata);
        })
        .catch((error)=>{
              console.log('error', error);
        })
    }else{
      dispatch(fetchcartdata([]));
    }
  }  
}

export const fetchcartdata = cartdata => ({
    type: 'FETCH_CART_DATA',
    cartData: cartdata
  });

export const searchProductAction = (searchCriteria, searchResult )=> ({
      type: 'SEARCH_PRODUCT',
      searchCriteria: searchCriteria,
      searchResult: searchResult
});

export const storeCustData = CustData => ({
    type: 'STORE_CUST_DATA',
    CustData: CustData
});

export const fetchCustomerData = CustData => ({
  type: 'FETCH_CUST_DATA',
  CustData: CustData
});


export const getForm = formToShow => ({
  type: 'MODAL_DATA',
  formToShow: formToShow
});

export const showCustomerForm = form => ({
  type: 'SHOW_CUST_FORM',
  customerForm: form
});

