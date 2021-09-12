import React, { Component }   from 'react';
import Image                  from 'next/image';
import Link                   from 'next/link';
import axios                  from 'axios';
import Carousel               from 'react-multi-carousel';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import Loader                 from "../../StaticBlocks/loader/Loader.js";
import Message                from '../../StaticBlocks/Message/Message.js';
import Select                 from 'react-select';
import $, { post }            from 'jquery';
import jQuery                 from 'jquery';
import Style                  from './ProductCarousel.module.css';
import style                  from './categoryBlock.module.css';
import CategoryBlock          from './CategoryBlock.js';
import Product                from './Product.js';
import CategoryFilters        from './CategoryFilters.js';
import BrandFilters           from './BrandFilters.js';
import 'react-multi-carousel/lib/styles.css';
import {getCartData,getWishlistData, updateCartCount, getWishlist}  from '../../../../../redux/actions/index.js'; 

const sortOptions = [
  { value: 'alphabeticallyAsc', label: 'Sort By A -> Z' },
  { value: 'alphabeticallyDsc', label: 'Sort By Z -> A' },
  { value: 'priceAsc', label: 'Price Low -> High' },
  { value: 'priceDsc', label:'Price High -> Low'},
];

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 3000, min: 1440 },
    items: 6,
    slidesToSlide: 1
  },
  desktop: {
    breakpoint: { max: 1439, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1 // optional, default to 1.
  }
};

class ProductCarouselBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType        : props.type,
      newProducts        : [],      
      products           : [],
      modalIDNew         : [],
      wishList           : [],
      relatedProductArray: [],
      discountedProducts : [],
      ProductsLoading    : false,
      loading            : true,
      filterSettings     : [],
      categoryData       : [],
      brandData          : [],
      subCategoryData    : [],
      selector           :{
                    limit:20
      },
      user_ID : '',
      userLatitude : "",
      userLatitude : "",
      startRange   : 0,
      limitRange   : 28,
      vendor_ID    : "",
      categoryUrl  : "",
      brandArray   : [],
    };
  }

  async componentDidMount(){
    var formValues = {};
    var subcategoryArray = false;
    var noCategoryUrl   = true;
    
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      this.setState({
        userID : userDetails.user_id
      });
    }

    if(sampurnaWebsiteDetails){
      if(sampurnaWebsiteDetails.deliveryLocation){
        this.setState({ 
            "userLatitude"  : sampurnaWebsiteDetails.deliveryLocation.latitude,
            "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
            "delLocation"   : sampurnaWebsiteDetails.deliveryLocation.address,
        });
      }
      if(sampurnaWebsiteDetails.preferences){
        this.setState({
            "currency"      :  sampurnaWebsiteDetails.preferences.currency,
            "showLoginAs"   :  sampurnaWebsiteDetails.preferences.showLoginAs,
            "websiteModel"  :  sampurnaWebsiteDetails.preferences.websiteModel
        });
      }
    }

    var url = window.location.href.split('/');
    if(url[3]===undefined){
      var addToCart = true
      this.setState({
        addToCart :true,
      })
    }
    
    if(url[4] !== "undefined"){
      // console.log("inside if",url[3]);
      var vendor_ID              = url[4];
      var vendorlocation_ID      = url[5];
      var sectionUrl             = url[6];
      var categoryUrl            = url[7];
      var subCategoryUrl         = url[8];
      this.setState({
        "vendor_ID"         : vendor_ID,
        "vendorlocation_ID" : vendorlocation_ID,
        "sectionUrl"        : sectionUrl,
        "categoryUrl"       : categoryUrl?categoryUrl:"",
        "subCategoryUrl"    : subCategoryUrl!==undefined?subCategoryUrl:""
      },()=>{
        if(this.state.vendor_ID){
        axios.get('/api/entitymaster/get/one/'+this.state.vendor_ID)    
        .then((vendorResponse)=>{
            if(vendorResponse){
                this.setState({
                    vendorData : vendorResponse.data[0],
                })
            }
        })
        .catch((error) =>{
          console.log("error in get vendor=",error);
        })
      }
      })
    }
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      if(userDetails.user_id){     
      this.setState({
        user_ID : userDetails.user_id
      },()=>{
          // this.props.getWishlistData();
          this.props.fetchWishlist();
      });
    } 
  }
      // console.log("1.blocks response data=>",response.data);                
      this.setState({
          blockSettings   : this.props.blockSettings,  
          productSetting  : this.props.productSettings,   
          blockTitle      : this.props.blockTitle, 
        
      },async ()=>{
        if(this.props.blockSettings.showCarousel === false){
          // console.log("this.state.sectionUrl===",this.state.sectionUrl,this.state.vendor_ID);
          await axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.state.vendor_ID)     
          .then((categoryResponse)=>{
            if(categoryResponse.data){     
              // console.log("categoryResponse====",categoryResponse.data); 
                for(let i=0 ;i<categoryResponse.data.categoryList.length;i++){
                  // console.log("categoryResponse.data.categoryList[i].categoryUrl=",categoryResponse.data.categoryList[i].categoryUrl,"===",this.state.categoryUrl);
                    if(categoryResponse.data.categoryList[i].categoryUrl === this.state.categoryUrl){
                      this.setState({
                        brandList : categoryResponse.data.categoryList[i].brandList
                      })
                      var subCategoryData = categoryResponse.data.categoryList[i].subCategory;
                      subcategoryArray = true;
                      noCategoryUrl = false;
                      break;
                     }
                }
                  if(subcategoryArray === false){
                    var subCategoryData = categoryResponse.data.categoryList[0].subCategory;
                      // console.log("else subCategoryData===",subCategoryData);
                      this.setState({
                        categoryUrl :  categoryResponse.data.categoryList[0].categoryUrl,
                        brandList : categoryResponse.data.categoryList[0].brandList
                      })
                      noCategoryUrl = false;
                  }

                  if(noCategoryUrl === true){
                    var subCategoryData = categoryResponse.data.categoryList[0].subCategory;
                      // console.log("else subCategoryData===",subCategoryData);
                      this.setState({
                        categoryUrl :  categoryResponse.data.categoryList[0].categoryUrl,
                        brandList : categoryResponse.data.categoryList[0].brandList
                      })
                  }

                  if(subCategoryData){
                        this.setState({
                          categoryData     : categoryResponse.data.categoryList,  
                          brandData        : this.state.brandList,
                          // brandData        : categoryResponse.data.categoryList[0].brandList, 
                          subCategoryData  : subCategoryData,     
                        },()=>{
                          formValues = {
                            "vendor_ID"         : vendor_ID,
                            "vendorLocation_id" : this.state.vendorlocation_ID,
                            "sectionUrl"        : this.state.sectionUrl,
                            "categoryUrl"       : this.state.categoryUrl===""?categoryResponse.data.categoryList.categoryUrl:this.state.categoryUrl,
                            "subCategoryUrl"    : [this.state.subCategoryUrl],
                            "userLatitude"      : this.state.userLatitude,
                            "userLongitude"     : this.state.userLongitude,
                            "startRange"        : this.state.startRange,
                            "limitRange"        : this.state.limitRange,
                          }
                        });
                  }
            }
          })
          .catch((error)=>{
              console.log('error', error);
          })
          
        }else{
          formValues = {
            "vendor_ID"         : "",
            "vendorLocation_id" : "",
            "sectionUrl"        : this.props.blockSettings.section? (this.props.blockSettings.section.replace(/\s/g, '-').toLowerCase()):null,
            "categoryUrl"       : this.props.blockSettings.category === "all" ? "" : this.props.blockSettings.category.replace(/\s/g, '-').toLowerCase(),
            "subCategoryUrl"    : this.props.blockSettings.subCategory !== "all"?[this.props.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
            "userLatitude"      : this.state.userLatitude,
            "userLongitude"     : this.state.userLongitude,
            "startRange"        : this.state.startRange,
            "limitRange"        : this.state.limitRange,
            }
            // console.log("carousel formValues=>",formValues);
        }
        // console.log("getProductLIst productApiUrl===",this.props.blockSettings.blockApi,"Formvalues==",formValues,"BrandsData==",this.state.brandData,"csubategoryData==",this.state.subcategoryArray);
        this.getProductList(this.props.blockSettings.blockApi,formValues);
      });
    // }else{
    //   this.setState({          
    //     ProductsLoading : false
    //   });
    // }
    
}

showMoreProduct(event){
  event.preventDefault();
  this.setState({
    "seeMore" : true
  })
  var formValues = {
    "vendor_ID"      : this.state.vendor_ID,
    "sectionUrl"     : this.state.sectionUrl,
    "categoryUrl"    : this.state.categoryUrl,
    "subCategoryUrl" : this.props.blockSettings.subCategory !== "all"?[this.props.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
    "userLatitude"   : this.state.userLatitude,
    "userLongitude"  : this.state.userLongitude,
    "startRange"     : this.state.startRange,
    "limitRange"     : this.state.limitRange + 28,
  }
  const productApiUrl = this.state.productApiUrl;
  // console.log("showMore formValues===",formValues,productApiUrl)
  this.getProductList(productApiUrl,formValues);
}
getProductList(productApiUrl,formValues){
    // console.log("getProductList productApiUrl=>",productApiUrl ,formValues);
    axios.post(productApiUrl,formValues)     
    .then((response)=>{
      if(response.data){  
        if(this.state.seeMore){
          this.setState({
            newProducts    : this.state.newProducts.concat(response.data),                         
          },()=>{
            // console.log("newProducts=>",this.state.newProducts.length);
            if(this.state.newProducts.length>0){
              this.setState({
                ProductsLoading : true,
                loading         : false
              });  
            } 
            if(this.state.newProducts.length <= this.state.limitRange){
                $('.seeMoreBtnWrapper').hide();
            }
        });
        }else{
          this.setState({
            newProducts    : response.data,                         
          },()=>{
            // console.log("newProducts=>",this.state.newProducts.length);
            if(this.state.newProducts.length>0){
              this.setState({
                ProductsLoading : true,
                loading         : false
              });  
            } 
          })
        }
      }
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }

submitCart(event) { 
    if(this.state.user_ID){
    var id = event.target.id;
    var availableQuantity = event.target.getAttribute('availablequantity');
    var currProId = event.target.getAttribute('currpro');
    var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
    var productCartData = recentCartData.filter((a) => a.product_ID === id);
    var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;
    var formValues ={};  
      formValues = {
        "user_ID"    : this.state.user_ID,
        "product_ID" : event.target.id,
        "quantity"   : 1,   
        "vendorName" : event.target.getAttribute('vendor_name'),
        "vendor_ID"  : event.target.getAttribute('vendor_id'),       
      }      
    }
    this.addCart(formValues, quantityAdded, availableQuantity);

    if(this.state.showLoginAs==="modal"){
      $('#loginFormModal').show();       
    }else{
      this.setState({
        messageData: {
          "type": "outpage",
          "icon": "fa fa-exclamation-circle",
          // "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",   
          "class": "danger",
          "autoDismiss": true
        }
      })
      setTimeout(() => {
        this.setState({
          messageData: {},
        })
      }, 2000);
    }
  }
  
  addCart(formValues, quantityAdded, availableQuantity) {
      // console.log("formValues==",formValues);
      axios.post('/api/carts/post', formValues)
        .then((response) => {
          // console.log("this.props.fetchCartData();",this.props.fetchCartData());
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-check-circle",
              "message": "&nbsp; " + response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 2000);
          this.props.fetchCartData();
          this.props.updateCartCount();
        })
        .catch((error) => {
          console.log('cart post error', error);
        })
  }//end else websiteModel
  
  addtowishlist(event) {
    event.preventDefault();
    if (this.state.user_ID) {
      var id = event.target.id;
         var formValues = {
            "user_ID"             : this.state.user_ID,
            "userDelLocation"     : {
                                        "lat"             : this.state.userLongitude, 
                                        "long"            : this.state.userLongitude,
                                        "delLocation"     : this.state.delLocation,
                                    },
            "vendor_id"           : this.state.vendor_id,
            "vendorLocation_id"   : this.state.vendorLocation_id,
            "product_ID"          : id
          }
        
      axios.post('/api/wishlist/post', formValues)
        .then((response) => {
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-check-circle",
              "message": "&nbsp; " + response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 2000);
          // this.props.getWishlistData();
          this.props.fetchWishlist();
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      if(this.state/showLoginAs ==="modal"){
        $('#loginFormModal').show();        
        }else{
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-exclamation-circle",
            // "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
            "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
            "class": "warning",
            "autoDismiss": true
          }
        })
        setTimeout(() => {
          this.setState({
            messageData: {},
          })
        }, 2000);
      }
    }
  }

  showRatingBlock(event){
    event.preventDefault();
  }
  sortProducts = effect => {
    this.setState({ effect });
    var sortBy = effect.value;   
    if (sortBy === "alphabeticallyAsc") {
			let field = 'productName';
      sortBy = 'AZ';	
		}else if (sortBy === "alphabeticallyDsc") {
			let field = 'productName';
      sortBy = 'ZA';
		}else if (sortBy === "priceAsc") {
			let field = 'discountedPrice';
      sortBy = 'PL';
		}else if (sortBy === "priceDsc") {
			let field = 'discountedPrice';
      sortBy = 'PH';
		} 

    var formValues = {
      "vendor_ID"      : this.state.vendor_ID,
      "sectionUrl"     : this.state.sectionUrl,
      "categoryUrl"    : this.state.categoryUrl,
      "subCategoryUrl" : this.state.subCategoryUrl,
      "userLatitude"   : this.state.userLatitude,
      "userLongitude"  : this.state.userLongitude,
      "startRange"     : this.state.startRange,
      "limitRange"     : this.state.limitRange,
      "sortProductBy"  : sortBy,
      "brand"          : '' 
    }

    if(this.state.productApiUrl && formValues){
      console.log("getProductLIst formvalues===",this.state.productApiUrl,formValues);
      this.getProductList(this.state.productApiUrl,formValues);
      $("html, body").animate({ scrollTop: 200 }, 500);
    }//end productApiUrl
  };

  getBrandWiseData(event){
    console.log("brand value ==",event.target.value);
    var brandArray = this.state.brandArray;
    if(event.target.value !== "undefined"){
      var brandValue = event.target.value;
      console.log("brandValue=",brandValue);
      var matchingBrand = brandArray.filter((a) => a === brandValue);
      console.log("matchingBrand=",matchingBrand);
      if(matchingBrand.length>=1){
        brandArray.pop(brandValue);
      }else{
        brandArray.push(brandValue);
      }
      
    }
    this.setState({
      brandArray : brandArray
    },()=>{
      // console.log("brandArray => ",this.state.brandArray);
      //   brandWiseFilter : true,
      // })
      var formValues = {
        "vendor_ID"      : this.state.vendor_ID, 
        "sectionUrl"     : this.state.sectionUrl,
        "categoryUrl"    : this.state.categoryUrl,
        "subCategoryUrl" : this.props.blockSettings.subCategory !== "all"?[this.props.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
        "userLatitude"   : this.state.userLatitude,
        "userLongitude"  : this.state.userLongitude,
        "startRange"     : 0,
        "limitRange"     : 28,
        "sortProductBy"  : '',
        "brand"          : this.state.brandArray 
      }  
      console.log("formValues=",formValues);
        $("html, body").animate({ scrollTop: 0 }, 800);
        this.getProductList(this.state.productApiUrl,formValues);
    })
  }

  render() {
    // console.log("brand ===",this.state.brandData);
    const { effect } = this.state;
    const { displayProducts } = this.state;

    var LGCol = 12/this.props.blockSettings.noOfProductPerLGRow;
    var MDCol = 12/this.props.blockSettings.noOfProductPerMDRow;
    var SMCol = 12/this.props.blockSettings.noOfProductPerSMRow;
    var XSCol = 12/this.props.blockSettings.noOfProductPerXSRow;
    
    return (
      !this.state.loading ?
      <div className={"col-12 " +  Style.mobileNoPadding}>        
          <Message messageData={this.state.messageData} />  
          {this.props.blockSettings.showTitle && this.state.newProducts && this.state.newProducts.length > 0 ?
            <div className={"col-12 "+ Style.mobileNoPadding}>
              <div className={"col-12 " +Style.productcomponentheading +" " +Style.textCenter + " "+  Style.mobileNoPadding}>                
                <div className={ "col-12 " +Style.title4 + " " +  Style.mobileNoPadding}>
                  <div className="">
                    <h4 className={"col-12 " + Style.newDealTitle}>New deal in</h4>
                    <h1 className={"col-12 title_inner4 lang_trans " +Style.titleFont } data-trans="#blog_1554730795823_title">
                      <span className={Style.lineBackground}>
                        {this.state.blockTitle} 
                      </span>
                      <span className={"line " +Style.line}></span>
                    </h1>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                  </div>
                    {/*/<div className={"line "+Style.line}></div>*/}
                    {/*<div className={"line "+Style.line}><span className={Style.span}></span></div>*/}
			        	</div>
              </div>             
            </div>
          : null
          } 

        <div className={"col-12  " }>
          <div className={"col-12 " }>
            {this.state.newProducts && this.state.newProducts.length > 0 ?
              <div id="home" className={"col-12 " +Style.ecommerceTabContent }>
                <div className={"col-12 mt-50 mb-50 " +Style.carouselWraper}>
                  <div className={"container-flex "}>                    
                    {this.state.ProductsLoading === false ?                     
                      <Loader type="carouselloader" productproductWrapperLoaderNo = {4}/>                    
                    :
                    <div className={"" +Style.rowPadding}>               
                    { this.props.blockSettings.showCarousel === true
                      ?
                    <Carousel  
                      className={Style.customnNavButton +" " +Style.carouselNewWrapper}
                      swipeable={true}
                      draggable={true}
                      showDots={false}
                      responsive={responsive}
                      ssr={true} // means to render carousel on server-side.
                      infinite={false}
                      autoPlay= {false}
                      autoPlaySpeed={1000}
                      keyBoardControl={true}
                      customTransition="all .20"
                      transitionDuration={500}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      deviceType={this.props.devproductWrappericeType}
                      itemclassName="carousel-item-padding-10-px">
                      { 
                        Array.isArray(this.state.newProducts) && this.state.newProducts.length > 0 ?
                          Array.isArray(this.state.newProducts) && this.state.newProducts.map((data, index) => { 
                              // var x = this.state.wishList && this.state.wishList.length > 0 ? this.state.wishList.filter((abc) => abc.product_ID === data._id) : [];
                              var x = this.props.recentWishlist && this.props.recentWishlist.length> 0 ? this.props.recentWishlist.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];
                              var wishClass = '';
                              var tooltipMsg = '';
                              if (x && x.length > 0) {
                                wishClass = '';
                                tooltipMsg = 'Remove from wishlist';
                              } else {
                                wishClass = 'r';
                                tooltipMsg = 'Add To Wishlist';
                              }   
                              var sectionUrl     = data.section?(data.section).replace(/\s+/g, '-').toLowerCase():null;  
                              var categoryUrl    = data.category?(data.category).replace(/\s+/g, '-').toLowerCase():null;  
                              var subCategoryUrl = data.subCategory?(data.subCategory).replace(/\s+/g, '-').toLowerCase():null;                   
                            return (
                                <div key={index} className={"col-12 d-flex justify-content-center " }>                          
                                <div className={"col-12  d-flex justify-content-center" }>                                 
                                <div className={"col-12  d-flex justify-content-center" }>                                 
                                  <div className={Style.productCaroselBlock +" " +Style.productInnerWrap}>
                                    <div className={"col-12  " +Style.productImg}>
                                      
                                      {/* <div className={"col-lg-12 NoPadding " +Style.wishlistBtn}>
                                        {this.props.productSettings.displayWishlist === true?
                                            this.state.user_ID?
                                            <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +" fa-heart"+wishClass +" wishListIconColor "}></i></button>
                                            :
                                            <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                                        :null
                                        }*/}
                                        { data.discountPercent?  
                                          <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discounttag}>
                                              {Math.floor(data.discountPercent)}%<br/>off
                                          </div>:null
                                        }

                                      <div className= {"col-12 NoPadding " +Style.ImgWrapper}>
                                        {/* <Link href={`/productDetail/${encodeURIComponent(categoryUrl)}/${encodeURIComponent(data.productUrl)}/${encodeURIComponent(data._id)}`}> */}
                                        <Link href={"/home-to-vendorlist/"+sectionUrl+"/" +categoryUrl+"/"+subCategoryUrl+"/"+data._id}>
                                        <a className={Style.product_item_photo } tabIndex="-1" >                                      
                                          <img                                           
                                            src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.png"}
                                            alt="ProductImg" 
                                            className={"img-responsive " +Style.NoAvailableImg }
                                            height ={ data.productImage[0] ? "163px" : '130px'}
                                            layout={'intrinsic'}
                                          />
                                        </a>
                                        </Link>
                                      </div>
                                    </div>
                                    <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                                      <div className={"col-12 " +Style.innerDiv}>
                                        {/* {this.props.productSettings.displayBrand === true ?
                                          data.brandNameRlang?
                                          // <div className={"col-12 globalProduct_brand RegionalFont"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                                          <div className={"col-12"}></div>
                                          :
                                            <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>

                                          :null
                                        }                                         */}
                                        
                                        {this.props.productSettings.displaySection === true ?
                                          <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                                        :null
                                        }
                                        {this.props.productSettings.displayCategory === true ?
                                          <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                                        :null
                                        }
                                        {data.productNameRlang?
                                        <div className={"col-12 globalProductItemName RegionalFont " } title={data.productNameRlang}>
                                          <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>                                       
                                        </div>
                                        :
                                        <div className={"col-12 globalProductItemName  " } title={data.productName}>
                                        <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span></div>
                                        }
                                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                                          {
                                            localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                              data.discountPercent ?    
                                              <div className={"col-12 mt-2  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                                <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice}</span>    
                                              </div>   
                                              :
                                                <div className={"col-12 mt-2  " +Style.priceWrapper +" " +Style.NoPadding}>
                                                  <span className={Style.price}>{this.state.currency}&nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                                </div>
                                            :                                    
                                              data.discountPercent ?
                                              <div className={"col-12 mt-2 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                                <span className={Style.price}><span className={Style.oldprice }>&nbsp;
                                                {this.state.currency}&nbsp;{(data.originalPrice).toFixed(2)}&nbsp;</span>&nbsp;
                                                {this.state.currency}&nbsp;{(data.discountedPrice).toFixed(2)} 
                                                </span>
                                              </div>
                                              :  
                                              <div className={"col-12 mt-2 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                                <span className={Style.price}>{this.state.currency}&nbsp;{data.originalPrice} </span> &nbsp;                                      
                                              </div> 
                                          }
                                        </div>
                                        {this.props.productSettings.displayRating === true ?
                                          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.displayRating +Style.customePadding}>
                                              <span id="productRating" className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding " +Style.NoPadding} onMouseOver={this.showRatingBlock.bind(this)} >
                                                  <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.showRating}> 4 <i className="fas fa-star"></i></div>                                        
                                              </span>                                  
                                              <span className={"col-5 " +Style.customePadding}>(&nbsp;162 &nbsp;)</span>
                                              {this.props.productSettings.displayAssuranceIcon === true ?
                                                <span className={"col-4 NoPadding " +Style.NoPadding +" " +Style.assurenceIcon}>
                                                  <img loading="lazy" className={"col-12 NoPadding " +Style.NoPadding} src="/images/assured.png" alt="Assured Img" />                                      </span>
                                              :null
                                              }
                                          </div>
                                          :null
                                        }                              
                                        <div className={"col-12 NoPadding " +Style.NoPadding}>
                                          <div className={"col-12 NoPadding " +Style.NoPadding}>                                  
                                            { 
                                              this.state.addToCart &&
                                              <div className="col-12 NoPadding">
                                                {data.availableQuantity > 0 ?
                                                  <div className="col-12 NoPadding">
                                                    {this.state.user_ID?
                                                    <button type="submit" id={data._id} vendor_name={data.vendor_name} vendor_id={data.vendor_ID} className={"col-12 NoPadding   globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                                        &nbsp;Add To Cart
                                                    </button>
                                                    :
                                                    <button type="submit" id={data._id} vendor_name={data.vendor_name} vendor_id={data.vendor_ID} className={"col-12  globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
                                                        &nbsp;Add To Cart
                                                    </button>
                                                    }     
                                                  </div>                                           
                                                :
                                                  <div className={"col-12 " +Style.outOfStock}>Sold Out</div>
                                                }             
                                              </div>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                </div>
                            </div>                            
                            );
                          
                          })
                          :''
                      }
                    </Carousel>
                    : 
                    <div className={"row " +Style.ProductListWrapper }>  
                      <div className={"col-12 mobileNoPadding " +Style.productDetailVendorName}> 
                        <div className="col-12 mobileNoPadding ">
                          <div className="col-12">
                            <div className="row">
                                <span className={"col-8 col-lg-9 col-sm-9 col-xl-9 pb-2 pt-2 "+Style.vendorNameWrapper}> 
                                  <b>Vendor</b>- &nbsp;{this.state.vendorData? this.state.vendorData.companyName:null}
                                </span>
                                <span className={"col-4 col-lg-3 col-sm-3 col-xl-3 text-right pt-1   "+Style.chaneVendorBtn }> 
                                    <Link href={"/vendor-list/"+this.state.sectionUrl} className={"col-12 NoPadding t "+Style.changeVendorWrapper} >Change Vendor</Link>
                                </span>
                            </div>
                          </div>
                        </div>
                      </div>   

                      <div className={"col-12" }>
                      {this.props.blockSettings.showCarousel === false?
                          < CategoryBlock 
                            categoryData       = {this.state.categoryData}
                            vendor_ID          = {this.state.vendor_ID}
                            vendorlocation_ID  = {this.state.vendorlocation_ID}
                            userLatitude       = {this.state.userLongitude}
                            userLongitude      = {this.state.userLongitude}
                            sectionUrl         = {this.state.sectionUrl}
                            subCategoryUrl     = {this.state.subCategoryUrl}
                            categoryUrl        = {this.state.categoryUrl}
                          />
                      :null
                      }   
                      {/* Fitters code */}
                      {this.props.blockSettings.leftSideFilters === true?
                      <div className={"row " +Style.NoPadding +" " +Style.productListWrapper}>  
                      <div className={"col-xs-12 col-lg-2 col-xl-2 NoPadding  filterWrapper " +Style.filterBlockWrapper}>

                        {this.state.categoryData && this.state.categoryData.length>0?   
                          < CategoryFilters 
                            categoryData       = {this.state.subCategoryData}
                            blockSettings      = {this.props.blockSettings}
                            vendor_ID          = {this.state.vendor_ID}
                            vendorlocation_ID  = {this.state.vendorlocation_ID}
                            sectionUrl         = {this.state.sectionUrl}
                            subCategoryUrl     = {this.state.subCategoryUrl}
                            categoryUrl        = {this.state.categoryUrl}
                            userLatitude       = {this.state.userLatitude}
                            userLongitude      = {this.state.userLongitude}
                            startRange         = {this.state.startRange}
                            limitRange         = {this.state.limitRange}
                          />
                        
                        :' '

                        }
                        {this.state.brandData && this.state.brandData.length>0?  
                        
                          <div className="panel-group d-none d-lg-block d-xl-block" >   
                            
                            {this.state.brandData.length > 0  && this.state.brandData[0].brand!==''?                 
                              <div className={Style.categoryFilterTitle}> Brands </div>  
                            :null}
                            {
                              this.state.brandData && this.state.brandData.length > 0
                              ?
                                  this.state.brandData.map((brand,index)=>{
                                  var i = index+1;
                                  if(brand === ""){
                                    return true;
                                  }else{
                                    return(
                                      <div className="col-12 noPadding panelCategory paneldefault" key={index}>
                                          <div className={"panel-heading row "+Style.panelHeading}>
                                              <div className={"col-1 NoPadding  centreDetailContainerEcommerce "+Style.brandInput}>
                                                <input className="" type="checkbox" name="brands[]" className={Style.brandFilterInput} onChange={this.getBrandWiseData.bind(this)} value={brand} />
                                              </div>
                                              <span className="col-11 centreDetaillistItemEcommerce">{brand}</span>
                                          </div>                              
                                      </div>
                                    )
                                  }
                                })   
                              :
                                null
                            }
                        </div>  
                        :' '
                        }

                        {this.state.brandData && this.state.brandData.length>0?  
                          <nav className="navbar navbar-expand-lg navbar-light bg-light d-block d-lg-none d-xl-none">
                          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                              &nbsp; &nbsp;&nbsp;Brands
                          </button>
                          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                          <div className="panel-group" >   
                            
                            {/* {this.state.brandData.length > 0  && this.state.brandData[0].brand!==''?                 
                              <div className={Style.categoryFilterTitle}> Brands </div>  
                            :null} */}
                            {
                              this.state.brandData && this.state.brandData.length > 0
                              ?
                                  this.state.brandData.map((brand,index)=>{
                                  var i = index+1;
                                  if(brand === ""){
                                    return true;
                                  }else{
                                    return(
                                      <div className="col-12 noPadding panelCategory paneldefault" key={index}>
                                          <div className={"panel-heading row "+Style.panelHeading}>
                                              <div className={"col-1 NoPadding  centreDetailContainerEcommerce "+Style.brandInput}>
                                                <input className="" type="checkbox" name="brands[]" className={Style.brandFilterInput} onChange={this.getBrandWiseData.bind(this)} value={brand} />
                                              </div>
                                              <span className="col-11 centreDetaillistItemEcommerce">{brand}</span>
                                          </div>                              
                                      </div>
                                    )
                                  }
                                })   
                              :
                                null
                            }
                        </div> 
                        </div>
                        </nav> 
                        :' '
                        }


                    </div>
                      <div className={"col-lg-10 col-xl-10 col-12 ProductViewWrapper "+Style.ProductViewWrapper}> 
                        <div className="row">
                          <div className={"col-12 " +Style.rightSidefilter}>
                            {/* <div className ="row"> */}
                              <div className={"col-12 "}>
                                <div className={"col-6 float-right col-lg-2 col-xl-2 col-md-3 col-sm-4 col-xs-6 NoPadding  "+Style.sortPbWrapper}>     
                                  <div className="form-group">
                                      <label className={"labelform d-block d-lg-block d-xl-block d-sm-block col-12 NoPadding "+Style.f14}>Sort By<span className="astrick"></span></label>
                                      {/* <label className={"labelform col-3 NoPadding mr-2 "+Style.f14}>Sort By<span className="astrick"></span></label>
                                      <select className={"" +Style.labelCategory}  onChange={this.sortProducts}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                      </select> */}
                                      <Select
                                          value={effect}
                                          onChange={this.sortProducts}
                                          options={sortOptions}
                                          autoFocus = {false}
                                          className={" " +Style.labelCategory}
                                      />
                                  </div> 
                                {/* </div> */}
                              </div>                        
                            </div>
                          </div>
                        </div> 

                        <div className="col-12">
                            {this.state.newProducts.length>=1?
                              <Product newProducts={this.state.newProducts}
                                    productSettings    = {this.props.productSettings}
                                    blockSettings      = {this.props.blockSettings}
                                    vendor_ID          = {this.state.vendor_ID}
                                    vendorlocation_ID  = {this.state.vendorlocation_ID}
                                    userLatitude       = {this.state.userLatitude}
                                    userLongitude      = {this.state.userLongitude}
                              />
                            :
                            <div className="col-2 mx-auto ">  
                                <img loading="lazy" src="/images/eCommerce/no-products-found1.png" className="lazyload"></img>
                            </div>
                            }
                            {this.state.newProducts.length>=28 &&
                              <div className="col-12 seeMoreBtnWrapper pb-2">
                                <div className="row">
                                  <button className={"btn btn-secondary col-lg-2 col-xl-1 col-sm-2 col-3 mx-auto pull-right "+Style.pcButtonwrapper} onClick={this.showMoreProduct.bind(this)}>See more</button>
                                </div>
                              </div>
                            }
                        </div>
                        </div>                  
                      </div>                    
                      :
                      // if left side filters are not available in product block
                        <div >
                        {this.state.newProducts.length>=1?
                            <Product newProducts={this.state.newProducts}
                                productSettings = {this.props.productSettings}
                                blockSettings   = {this.props.blockSettings}
                            />
                        :
                            <div className="col-2 offset-5 ">          
                                <img loading="lazy" src="/images/eCommerce/no-products-found1.png" className="lazyload"></img>
                            </div>
                        }
                        </div>
                      }  
                      </div>
                   
                    </div>
                  }           
                  </div>
                  } 
                  </div>
                </div>
              </div>
            :null
            }
          </div>
        </div>
      </div>
      :
      <div className="col-12">
        <div className="col-2 offset-5 loading">
          <img src="/images/eCommerce/loader.gif" className="col-12 lazyload" loading="lazy"></img>
        </div> 
        {/* <div className="col-5 mx-auto"><h6>Sorry !!! Products are comming soon for this vertical</h6></div> */}
      </div>
    );
  }
}
const mapStateToProps = state => (
  
  {
    cartCount          : state.data.cartCount,
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlistData,
    recentWishlist     : state.data.recentWishlist,
    productApiUrl      : state.data.productApiUrl 

  } 
);
const mapDispatchToProps = {
  fetchCartData    : getCartData,  
  updateCartCount  : updateCartCount,
  getWishlistData  : getWishlistData,
  fetchWishlist    : getWishlist,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCarouselBlock);