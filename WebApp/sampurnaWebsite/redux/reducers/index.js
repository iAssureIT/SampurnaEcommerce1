

const initialState = {
	cartCount	 	   : 0,
	cartData	 	   : [],
	cartTotal 		   : 0,
    recentCartData     : [],
    recentWishlistData :[],
    recentCategoryData:[],
	wishlistCount 	   : 0,
	featuredProductData: {},
	exclusiveProductsData : [],
	newProductsData    : [],
	bestSellerData     : [],
	searchResult       :[],
	searchCriteria     : [],
	categoryDetails    :[],
	formToShow         :"login",
	deliveryPincode    : '',
    pincodeStatus      : '',
    value              : 0,
    pageData           : [],
    productApiUrl      :''

}
const reducer = (state = initialState,action) =>{
    switch (action.type) {
        case  'INCREMENT_COUNTER':
            return {...state, value: state.value + 1};
        case  'DECREMENT_COUNTER':
            return {...state, value: state.value - 1};
        case  'SET_BLOCKS_DATA':
            // console.log(" set block data===",action.payload);
            return {...state, pageData: action.payload};
        case  'SET_CURRENCY_DATA':
            console.log(" set CURRENCY data===",action.payload);
            return {...state, pageData: action.payload};
        case  'CART_COUNT_INITIALLY' :
            return {...state, cartCount: action.cartCount};
        case "FETCH_CATEGORY_DATA" :
            // console.log(" inside reducer action.categoryData===",action.categoryData);
            return {...state, recentCategoryData: action.categoryData};
        case "FETCH_CART_DATA" :
            // console.log("reducer action.cartData===",action.cartData);
            return {...state, recentCartData: action.cartData};
        case "FETCH_WISHLIST_DATA" :
            // console.log("reducer.wishlistData===",action.wishlistData);
            return {...state, recentWishlistData: action.wishlistData};
        case "WISHLIST_COUNT_INITIALLY" :
            return {...state, wishlistCount: action.wishlistCount}
        case "WISHLIST_COUNT" : 
            return {...state, wishlistCount: action.wishlistCount}        
        case "FEATURED_PRODUCT_DATA" : 
            return {...state, featuredProductData: action.featuredProductData}        
        case "SEARCH_PRODUCT" :
            return {...state, searchResult: action.searchResult,searchCriteria:action.searchCriteria}        
        case "GET_CATEGORY_DETAILS" : 
            return {...state, categoryDetails: action.categoryDetails}        
        case "MODAL_DATA" :
            return {...state, formToShow: action.formToShow}        
        case "PINCODE_DATA" : 
            return {...state, deliveryPincode: action.deliveryPincode,pincodeStatus:action.pincodeStatus}     
        case "SET_PRODUCT-APIURL" : 
            return {...state, productApiUrl: action.pageUrl} 

        case "CART_COUNT" : 
            return {...state, cartCount: action.cartCount}

        case "SET_SAMPURNA-WEBSITE-DETAILS" : 
            // console.log("action.sampurnaWebsiteDetails====",action.sampurnaWebsiteDetails);
            return {...state, sampurnaWebsiteDetails: action.sampurnaWebsiteDetails} 
           
            
        default:
            return {...state};
    }
}
export default reducer;