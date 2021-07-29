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
import getConfig              from 'next/config';
import $, { post }            from 'jquery';
import jQuery                 from 'jquery';
import Style                  from './ProductCarousel.module.css';
import style                  from './categoryBlock.module.css';
import CategoryBlock          from './CategoryBlock.js';
import Product                from './Product.js';
import CategoryFilters        from './CategoryFilters.js';
import BrandFilters           from './BrandFilters.js';
import 'react-multi-carousel/lib/styles.css';
import {getCartData,getWishlistData, updateCartCount}  from '../../../../../redux/actions/index.js'; 

const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;
const productImgHeight = publicRuntimeConfig.IMGHeight;

  

const sortOptions = [
  { value: 'alphabeticallyAsc', label: 'Sort By A -> Z' },
  { value: 'alphabeticallyDsc', label: 'Sort By Z -> A' },
  { value: 'priceAsc', label: 'Price Low -> High' },
  { value: 'priceDsc', label:'Price High -> Low'},
];

const responsive = {
  desktop: {
    breakpoint: { max: 2000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

class ProductCarousel extends Component {
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
      productSettings    : {          
          displayAssurenceIcon: false,
          displayBrand: true,
          displayCategory: false,
          displayFeature: "size",
          displayRating: false,
          displaySection: false,
          displaySubCategory: false,
          displayWishlist: true,
      },
      blockSettings      : {
        blockTitle         : "Fruits",
        blockApi           : "/api/products/get/list/lowestprice",
        noOfProductPerLGRow: 4,
        noOfProductPerMDRow: 4,
        noOfProductPerSMRow: 4,
        noOfProductPerXSRow: 2,
        showCarousel       : true,
        totalProducts      : 12,
        leftSideFilters    : false
      }, 
      ProductsLoading    : false,
      loading            : true,
      blockTitle         : "Fruits",
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
      limitRange   : 10,
      vendor_ID    : "",
      categoryUrl  : "",
      brandArray   : [],
    };
  }

  componentDidUpdate(){
    if(this.state.categoryData.length < 1){
			$('.filterWrapper').hide();
			$('.ProductViewWrapper').removeClass('col-lg-9');
			$('.ProductViewWrapper').removeClass('col-md-9');			
			$('.ProductViewWrapper').addClass('col-lg-12');
			$('.ProductViewWrapper').addClass('col-md-12');
		}else{
      $('.filterWrapper').show();
			$('.ProductViewWrapper').addClass('col-lg-9');
			$('.ProductViewWrapper').addClass('col-md-9');
			$('.ProductViewWrapper').removeClass('col-lg-12');
			$('.ProductViewWrapper').removeClass('col-md-12');	
		}
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
        // console.log("sampurnaWebsiteDetails=>",sampurnaWebsiteDetails);
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
    // console.log("url===",url);
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
          // console.log("1.subCategoryUrl===",this.state.subCategoryUrl);
          // console.log("2.categoryUrl===",this.state.categoryUrl);
      })
    }
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      // console.log("userDetails===",userDetails);
      if(userDetails.user_id){     
      this.setState({
        user_ID : userDetails.user_id
      },()=>{
          // console.log("user_ID=>",this.state.user_ID);
          this.props.getWishlistData();
      });
    } 
  }
  if(this.props.block_id){
    axios.get('/api/blocks/get/'+this.props.block_id)    
    .then((response)=>{
      if(response.data){
      // console.log("1.blocks response data=>",response.data);                
      this.setState({
          blockSettings   : response.data.blockSettings,  
          productSetting  : response.data.productSettings,   
          blockTitle      : response.data.blockTitle, 
        
      },async ()=>{
        if(this.state.blockSettings.showCarousel === false){
          // console.log("this.state.sectionUrl===",this.state.sectionUrl,this.state.vendor_ID);
          await axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.state.vendor_ID)     
          .then((categoryResponse)=>{
            if(categoryResponse.data){     
              console.log("categoryResponse====",categoryResponse.data); 
                for(let i=0 ;i<categoryResponse.data.categoryList.length;i++){
                  // console.log("categoryResponse.data.categoryList[i].categoryUrl=",categoryResponse.data.categoryList[i].categoryUrl,"===",this.state.categoryUrl);
                    if(categoryResponse.data.categoryList[i].categoryUrl === this.state.categoryUrl){
                      // console.log("4.categoryUrl=",categoryResponse.data.categoryList[i].categoryUrl,this.state.categoryUrl);
                      // console.log("categoryResponse.data.categoryList[i].subCategory=",categoryResponse.data.categoryList[i].subCategory);
                      var subCategoryData = categoryResponse.data.categoryList[i].subCategory;
                      // console.log("if subCategoryData array=>",subCategoryData);
                      subcategoryArray = true;
                      noCategoryUrl = false;
                      // console.log("subcategoryArray=",subcategoryArray);
                      break;
                      
                     }
                }
                  if(subcategoryArray === false){
                    var subCategoryData = categoryResponse.data.categoryList[0].subCategory;
                      // console.log("else subCategoryData===",subCategoryData);
                      this.setState({
                        categoryUrl :  categoryResponse.data.categoryList[0].categoryUrl,
                      })
                      noCategoryUrl = false;
                  }

                  if(noCategoryUrl === true){
                    var subCategoryData = categoryResponse.data.categoryList[0].subCategory;
                      // console.log("else subCategoryData===",subCategoryData);
                      this.setState({
                        categoryUrl :  categoryResponse.data.categoryList[0].categoryUrl,
                      })
                  }

                  if(subCategoryData){
                    // console.log("my subCategoryData===",subCategoryData);
                        this.setState({
                          categoryData     : categoryResponse.data.categoryList,  
                          brandData        : categoryResponse.data.brandList, 
                          subCategoryData  : subCategoryData,     
                        },()=>{
                          // console.log("1.categoryData=",this.state.categoryData);
                          // console.log("1.brandData=",this.state.brandData);
                          // console.log("1.subCategoryData=",this.state.subCategoryData);
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
            "sectionUrl"        : this.state.blockSettings.section? (this.state.blockSettings.section.replace(/\s/g, '-').toLowerCase()):null,
            "categoryUrl"       : this.state.blockSettings.category === "all" ? "" : this.state.blockSettings.category.replace(/\s/g, '-').toLowerCase(),
            "subCategoryUrl"    : this.state.blockSettings.subCategory !== "all"?[this.state.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
            "userLatitude"      : this.state.userLatitude,
            "userLongitude"     : this.state.userLongitude,
            "startRange"        : this.state.startRange,
            "limitRange"        : this.state.limitRange,
            }
            // console.log("carousel formValues=>",formValues);
        }
        if(!this.state.blockSettings.showCarousel && this.state.filterSettings){
          var productApiUrl = this.props.productApiUrl;
          this.setState({
            productApiUrl : productApiUrl,
          })
        }else if(!this.state.blockSettings.showCarousel && !this.state.filterSettings){
          var productApiUrl = this.props.productApiUrl;
          this.setState({
            productApiUrl : productApiUrl,
          })
        }else{ 
            var productApiUrl = this.state.blockSettings.blockApi;
            this.setState({
              productApiUrl : productApiUrl,
            })
        }
        // console.log("getProductLIst formvalues===",this.state.productApiUrl,formValues);
        this.getProductList(productApiUrl,formValues);
       
      });
    }else{
      this.setState({          
        ProductsLoading : false
      });
    }
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }//end if blockid
}

showMoreProduct(event){
  event.preventDefault();
  var formValues = {
    "vendor_ID"      : this.state.vendor_ID,
    "sectionUrl"     : this.state.sectionUrl,
    "categoryUrl"    : this.state.categoryUrl,
    "subCategoryUrl" : this.state.blockSettings.subCategory !== "all"?[this.state.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
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
      // console.log("response.data===",response.data);
      this.setState({
        newProducts     : response.data,   
        // newProducts     : response.data.concat(this.state.newProducts),                         
      },()=>{
        // console.log("newProducts=>",this.state.newProducts.length);
        if(this.state.newProducts.length>0){
          this.setState({
            ProductsLoading : true,
            loading         : false
          });  
        }
      });
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
          this.props.getWishlistData();
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
      "vendor_ID"      : "",
      "sectionUrl"     : this.state.blockSettings.section? (this.state.blockSettings.section.replace(/\s/g, '-').toLowerCase()):null,
      "categoryUrl"    : this.state.blockSettings.category === "all" ? "" : this.state.blockSettings.category.replace(/\s/g, '-').toLowerCase(),
      "subCategoryUrl" : this.state.blockSettings.subCategory !== "all"?[this.state.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
      "userLatitude"   : this.state.userLatitude,
      "userLongitude"  : this.state.userLongitude,
      "startRange"     : this.state.startRange,
      "limitRange"     : this.state.limitRange,
      "sortProductBy"  : sortBy,
      "brand"          : '' 
    }
    if(this.state.productApiUrl && formValues){
      // conssole.log("getProductLIst formvalues===",this.state.productApiUrl,formValues);
      this.getProductList(this.state.productApiUrl,formValues);
      $("html, body").animate({ scrollTop: 200 }, 500);
    }//end productApiUrl
  };
  getBrandWiseData(event){
    // console.log("brand value ==",event.target.value);
    var brandArray = this.state.brandArray;
    if(event.target.value !== "undefined"){
      var brandValue = event.target.value;
      brandArray.push(brandValue);
    }
    this.setState({
      brandArray : brandArray
    },()=>{
      // console.log("brandArray => ",this.state.brandArray);
      var formValues = {
        "vendor_ID"      : this.state.vendor_ID, 
        "sectionUrl"     : this.state.sectionUrl,
        "categoryUrl"    : this.state.categoryUrl,
        "subCategoryUrl" : this.state.blockSettings.subCategory !== "all"?[this.state.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
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
    const { effect } = this.state;
    const { displayProducts } = this.state;

    var LGCol = 12/this.state.blockSettings.noOfProductPerLGRow;
    var MDCol = 12/this.state.blockSettings.noOfProductPerMDRow;
    var SMCol = 12/this.state.blockSettings.noOfProductPerSMRow;
    var XSCol = 12/this.state.blockSettings.noOfProductPerXSRow;
    
    return (
      !this.state.loading ?
      <div className={"col-12 " +Style.NoPadding}>        
          <Message messageData={this.state.messageData} />  
          {this.state.blockSettings.showTitle && this.state.newProducts && this.state.newProducts.length > 0 ?
            <div className="col-12">
              <div className={"col-12 " +Style.productcomponentheading +" " +Style.textCenter}>                
                <div className={ "col-12 mt-4 " +Style.title4}>
                    <h1 className={"col-12 globalMainTitle  title_inner4 lang_trans globalMainTitle " +Style.titleFont } data-trans="#blog_1554730795823_title">{this.state.blockTitle} <span className={"line " +Style.line}></span></h1>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                    {/*/<div className={"line "+Style.line}></div>*/}
                    {/*<div className={"line "+Style.line}><span className={Style.span}></span></div>*/}
			        	</div>
              </div>             
            </div>
          : null
          } 

        <div className={"col-12 NoPadding mb-5 "}>
          {this.state.newProducts && this.state.newProducts.length > 0 ?
            <div id="home" className={"col-12 " +Style.ecommerceTabContent}>
              <div className={"col-12 mt-50 mb-50 " +Style.carouselWraper}>
                <div className={"container-flex "}>                    
                  {this.state.ProductsLoading === false ?                     
                    <Loader type="carouselloader" productproductWrapperLoaderNo = {4}/>                    
                  :
                  <div className={"col-12 " +Style.rowPadding}>               
                  { this.state.blockSettings.showCarousel === true?
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
                            var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];
                            var wishClass = '';
                            var tooltipMsg = '';
                            if (x && x.length > 0) {
                              wishClass = '';
                              tooltipMsg = 'Remove from wishlist';
                            } else {
                              wishClass = 'r';
                              tooltipMsg = 'Add To Wishlist';
                            }   
                            var categoryUrl = data.category?(data.category).replace(/\s+/g, '-').toLowerCase():null;                  
                          return (
                              <div key={index} className={"col-12 " }>                          
                              <div className={"col-12 NoPadding " +Style.productCaroselBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                                <div className={"col-12 NoPadding"}>
                                  <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                                    
                                  {/* <div className={"col-lg-12 NoPadding " +Style.wishlistBtn}>
                                      {this.state.productSettings.displayWishlist === true?
                                          this.state.user_ID?
                                          <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +" fa-heart"+wishClass +" wishListIconColor "}></i></button>
                                          :
                                          <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                                      :null
                                      }
                                      {data.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null}
                                  </div> */}

                                    <div className= {"col-12 NoPadding " +Style.ImgWrapper}>
                                      {/* <Link href={`/productDetail/${encodeURIComponent(categoryUrl)}/${encodeURIComponent(data.productUrl)}/${encodeURIComponent(data._id)}`}> */}
                                      <Link href={"/home-to-vendorlist/"+data.section.replace(" ","-").toLowerCase()+"/" +data._id}>
                                      <a className={Style.product_item_photo } tabIndex="-1" >                                      
                                        <Image                                           
                                          src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"}
                                          alt="ProductImg" 
                                          className={"img-responsive " +Style.NoAvailableImg }
                                          height={200}
                                          width={265} 
                                          layout={'intrinsic'}
                                        />
                                      </a>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                                    <div className={"col-12 " +Style.innerDiv}>
                                      {this.state.productSettings.displayBrand === true ?
                                        data.brandNameRlang?
                                        // <div className={"col-12 globalProduct_brand RegionalFont"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                                        <div className={"col-12"}></div>
                                        :
                                          <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>

                                      :null
                                      }                                        
                                      
                                      {this.state.productSettings.displaySection === true ?
                                        <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                                      :null
                                      }
                                      {this.state.productSettings.displayCategory === true ?
                                        <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                                      :null
                                      }
                                      {data.productNameRlang?
                                      <div className={"col-12 globalProductItemName RegionalFont " } title={data.productNameRlang}>
                                        <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                                      </div>
                                      :
                                      <div className={"col-12 globalProductItemName  " } title={data.productName}>
                                      <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;</div>
                                      }
                                      <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                                        {
                                          localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                            data.discountPercent ?    
                                            <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                              <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice}</span>    
                                            </div>   
                                            :
                                              <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                                <span className={Style.price}>{this.state.currency}&nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                              </div>
        
                                          :                                    
                                            data.discountPercent ?
                                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                              <span className={Style.price}><span className={Style.oldprice }>&nbsp;
                                              {this.state.currency}&nbsp;{(data.originalPrice).toFixed(2)}&nbsp;</span>&nbsp;
                                              {this.state.currency}&nbsp;{(data.discountedPrice).toFixed(2)} 
                                              </span>
                                            </div>
                                            :  
                                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                              <span className={Style.price}>{this.state.currency}&nbsp;{data.originalPrice} </span> &nbsp;                                      
                                            </div> 
                                        }
                                      </div>
                                      {this.state.productSettings.displayRating === true ?
                                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.displayRating +Style.customePadding}>
                                            <span id="productRating" className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding " +Style.NoPadding} onMouseOver={this.showRatingBlock.bind(this)} >
                                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.showRating}> 4 <i className="fas fa-star"></i></div>                                        
                                            </span>                                  
                                            <span className={"col-5 " +Style.customePadding}>(&nbsp;162 &nbsp;)</span>
                                            {this.state.productSettings.displayAssuranceIcon === true ?
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
                          );
                        
                        })
                        :''
                    }
                  </Carousel>
                  : 
                  <div className={"row NoPadding " +Style.ProductListWrapper }>  
                   <div className={"col-12 NoPadding p-2 mt-2 " +Style.productDetailVendorName}> 
                   <div className="row">
                   <span className={"col-6 "+Style.vendorNameWrapper}> 
                       <b>vendor</b>- &nbsp;{this.state.vendorData? this.state.vendorData.companyName:null}
                    </span>
                    <span className={"col-6   "+Style.chaneVendorBtn }> 
                        <Link href={"/vendor-list/"+this.state.sectionUrl} className={"col-12 NoPadding t "+Style.changeVendorWrapper} >Change Vendor</Link>
                    </span>
                   </div>
                    
                  
                   </div>              
                  <div className={"col-12" }>

                   
                 
                  {this.state.blockSettings.showCarousel === false?
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
                  {this.state.blockSettings.leftSideFilters === true?
                  <div className={"row " +Style.NoPadding +" " +Style.productListWrapper}>  
                  <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-12 NoPadding  filterWrapper " +Style.filterBlockWrapper}>
                    {this.state.categoryData && this.state.categoryData.length>0?    
                    
                      < CategoryFilters 
                        categoryData       = {this.state.subCategoryData}
                        blockSettings      = {this.state.blockSettings}
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
                      // < BrandFilters 
                      //   blockSettings      = {this.state.blockSettings}
                      //   brandData          = {this.state.brandData}
                      //   vendor_ID          = {this.state.vendor_ID}
                      //   vendorlocation_ID  = {this.state.vendorlocation_ID}
                      //   sectionUrl         = {this.state.sectionUrl}
                      //   categoryUrl        = {this.state.categoryUrl}
                      //   userLatitude       = {this.state.userLatitude}
                      //   userLongitude      = {this.state.userLongitude}
                      //   startRange         = {this.state.startRange}
                      //   limitRange         = {this.state.limitRange}
                      // />   
                      <div className="panel-group" >     
                        {this.state.brandData.length && this.state.brandData[0].brand!=' '>0?                 
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
                                      <div className={"row panel-heading "+Style.panelHeading}>
                                          <div className={"NoPadding centreDetailContainerEcommerce "+Style.brandInput}>
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
                 </div>
                  <div className={"col-12 col-lg-9 col-xl-9 col-md-12 col-sm-12 col-xs-12 ProductViewWrapper "+Style.ProductViewWrapper}> 
                    <div className="row">
                      <div className={"col-12 " +Style.rightSidefilter}>
                        <div className ="row">
                        <div className={"col-12 "}>
                          <div className={"col-6 col-lg-2 col-xl-2 col-md-3 col-sm-4 col-xs-6 NoPadding  "+Style.sortPbWrapper}>     
                            <div className="form-group float -right">
                                <label className={"labelform col-12 NoPadding  " +Style.f14}>Sort Product By<span className="astrick"></span></label>
                                <Select
                                    value={effect}
                                    onChange={this.sortProducts}
                                    options={sortOptions}
                                    autoFocus = {false}
                                    className={" " +Style.labelCategory}
                                />
                                
                            </div> 
                          </div>
                        </div>                        
                        </div>
                      </div>
                    </div> 

                    <div className="col-12">
                        {this.state.newProducts.length>=1?
                          <Product newProducts={this.state.newProducts}
                                productSettings    = {this.state.productSettings}
                                blockSettings      = {this.state.blockSettings}
                                vendor_ID          = {this.state.vendor_ID}
                                vendorlocation_ID  = {this.state.vendorlocation_ID}
                                userLatitude       = {this.state.userLatitude}
                                userLongitude      = {this.state.userLongitude}
                          />
                        :
                        <div className="col-2 offset-5 ">   
                            loading....       
                            <img loading="lazy" src="/images/eCommerce/no-products-found1.png" className="lazyload"></img>
                        </div>
                        }
                        <div className="col-12">
                          <div className="row">
                            
                            <button className={"btn btn-secondary col-2 offset-5 pull-right "+Style.pcButtonwrapper} onClick={this.showMoreProduct.bind(this)}>See more</button>
                          </div>
                        </div>
                    </div>
                    
                    </div>                  
                  </div>                    
                  :
                  // if left side filters are not available in product block
                    <div >
                    {this.state.newProducts.length>=1?
                        <Product newProducts={this.state.newProducts}
                            productSettings = {this.state.productSettings}
                            blockSettings   = {this.state.blockSettings}
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
      :
      <div className="col-2 offset-5 loading">
        <img src="/images/eCommerce/loader.gif" className="col-12 lazyload" loading="lazy"></img>
      </div> 
    );
  }
}
const mapStateToProps = state => (
  
  {
    cartCount          : state.data.cartCount,
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlistData,
    productApiUrl      : state.data.productApiUrl 

  } 
);
const mapDispatchToProps = {
  fetchCartData    : getCartData,  
  updateCartCount  : updateCartCount,
  getWishlistData  : getWishlistData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCarousel);