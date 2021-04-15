

const initialState = {
	cartCount	 	: 0,
	cartData	 	: [],
	cartTotal 		: 0,
	recentCartData  : [],
	wishlistCount 	: 0,
	featuredProductData : {},
	exclusiveProductsData : [],
	newProductsData : [],
	bestSellerData : [],
	searchResult:[],
	searchCriteria: [],
	categoryDetails:[],
	formToShow :"login",
	recentCustomerData   : [],
	showCustomerForm : 'add'
}
const reducer = (state = initialState,action) =>{

	const newState = {...state}; 
	if(action.type === "CART_COUNT_INITIALLY"){
		newState.cartCount 	= action.cartCount;
	}
	if(action.type === "CART_DATA"){
		newState.cartData 		= action.cartData;
		newState.cartTotal 		= action.cartTotal;
	}
	if(action.type === "FETCH_CART_DATA"){
		newState.recentCartData = action.cartData;
	}
	if(action.type === "CART_COUNT"){
		newState.cartCount 		= action.cartCount;
	}
	if(action.type === "WISHLIST_COUNT_INITIALLY"){
		newState.wishlistCount 		= action.wishlistCount;
	}
	if(action.type === "WISHLIST_COUNT"){
		newState.wishlistCount 		= action.wishlistCount;
	}
	if(action.type === "FEATURED_PRODUCT_DATA"){
		newState.featuredProductData 		= action.featuredProductData;
	}
	if(action.type === "SEARCH_PRODUCT"){
		newState.searchResult 		= action.searchResult;
		newState.searchCriteria 	= action.searchCriteria;
	}
	if(action.type === "GET_CATEGORY_DETAILS"){
		newState.categoryDetails 		= action.categoryDetails;
	}	
	if(action.type === "MODAL_DATA"){
		newState.formToShow  = action.formToShow;
		// console.log("FormtoShow:===",newState.formToShow);
	}
	if(action.type === "STORE_CUST_DATA"){
		newState.recentCustomerData  = action.CustData;
		// console.log("FormtoShow:===",newState.formToShow);
	}
	if(action.type === "FETCH_CUST_DATA"){
		newState.recentCustomerData= action.CustData;
	}
	if(action.type === "SHOW_CUST_FORM"){
		newState.showCustomerForm= action.customerForm;
	}

	
	
	return newState;
}

export default reducer;