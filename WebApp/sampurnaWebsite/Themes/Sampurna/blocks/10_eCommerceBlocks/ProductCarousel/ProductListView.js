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

class ProductListView extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      messageData        : {},
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
        blockTitle         : " ",
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
      filterSettings     : [],
      categoryData       : [],
      brandData          : [],
      subCategoryData    : [],
     
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

  componentDidMount(){
    var formValues = {};
    var subcategoryArray = false;
    var noCategoryUrl   = true;
    
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      this.setState({
        user_ID : userDetails.user_id
      },()=>{
        this.props.fetchWishlist();
      });
    }

    if(sampurnaWebsiteDetails){
      if(sampurnaWebsiteDetails.deliveryLocation && sampurnaWebsiteDetails.preferences){
        this.setState({ 
            "userLatitude"  : sampurnaWebsiteDetails.deliveryLocation.latitude,
            "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
            "delLocation"   : sampurnaWebsiteDetails.deliveryLocation.address,
            "currency"      :  sampurnaWebsiteDetails.preferences.currency,
            "showLoginAs"   :  sampurnaWebsiteDetails.preferences.showLoginAs,
            "websiteModel"  :  sampurnaWebsiteDetails.preferences.websiteModel
        });
      }
      var url = window.location.href.split('/');
      if(url[4] !== "undefined"){
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

          this.setAllData();

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
    } 
  }

  setAllData(){
      var formValues = {};
      var subcategoryArray = false;
      var noCategoryUrl   = true;
      axios.get("/api/category/get/list/"+this.state.sectionUrl+"/" +this.state.vendor_ID)     
      .then((categoryResponse)=>{
        if(categoryResponse.data){     
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
                      subCategoryData  : subCategoryData,     
                    },()=>{
                      // console.log("categoryData==",this.state.categoryData);
                      // console.log("brandData==",this.state.brandData);
                      // console.log("subCategoryData==",this.state.subCategoryData);
                      formValues = {
                        "vendor_ID"         : this.state.vendor_ID,
                        "vendorLocation_id" : this.state.vendorlocation_ID,
                        "sectionUrl"        : this.state.sectionUrl,
                        "categoryUrl"       : this.state.categoryUrl===""?categoryResponse.data.categoryList.categoryUrl:this.state.categoryUrl,
                        "subCategoryUrl"    : [this.state.subCategoryUrl],
                        "userLatitude"      : this.state.userLatitude,
                        "userLongitude"     : this.state.userLongitude,
                        "startRange"        : this.state.startRange,
                        "limitRange"        : this.state.limitRange,
                      }
                      // console.log("getProductLIst productApiUrl===",this.props.blockSettings.blockApi,"Formvalues==",formValues);
                      this.getProductList(this.props.blockSettings.blockApi,formValues);

                    });
              }
        }
      })
      .catch((error)=>{
          console.log('error', error);
      })
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
    this.getProductList(this.props.blockSettings.blockApi,formValues);
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
          console.log('error while getting product data', error);
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
            "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",   
            "class": "danger",
            "autoDismiss": true
          }
        })
        setTimeout(() => {
          this.setState({
            messageData: {},
          })
        }, 6000);
      }
  }
    
  addCart(formValues, quantityAdded, availableQuantity) {
      axios.post('/api/carts/post', formValues)
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
          this.props.fetchCartData();
          this.props.updateCartCount();
        })
        .catch((error) => {
          console.log('cart post error', error);
        })
  }
    
  addtowishlist(event) {
    event.preventDefault();
    console.log("Inside add to wishlist function");
    
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
              "message": response.data.message,
              "class": "success",
              "autoDismiss": true
            }
          },()=>{
            console.log("state messagedata set => ", this.state.messageData);
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 6000);
          // this.props.getWishlistData();
          this.props.fetchWishlist();
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      if(this.state.showLoginAs ==="modal"){
        $('#loginFormModal').show();        
        }else{
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-exclamation-circle",
            "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
            "class": "warning",
            "autoDismiss": true
          }
        })
        setTimeout(() => {
          this.setState({
            messageData: {},
          })
        }, 6000);
      }
    }
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

    if(this.props.blockSettings.blockApi && formValues){
      // console.log("getProductLIst formvalues===",this.props.blockSettings.blockApi,formValues);
      this.getProductList(this.props.blockSettings.blockApi,formValues);
      $("html, body").animate({ scrollTop: 200 }, 500);
    }
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
      // console.log("formValues=",formValues);
      if(formValues){
        this.getProductList(this.props.blockSettings.blockApi,formValues);
        $("html, body").animate({ scrollTop: 0 }, 800);
      }
    })
  }

  showRatingBlock(event){
    event.preventDefault();
  }
  
  close(event){
    event.preventDefault();
    this.setState({ messageData:{} });
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
      <div className={"col-12 " +Style.NoPadding + " " + Style.productDetailsWrapper}>        
          {/*<Message messageData={this.state.messageData} />*/} 

          <div className="row ml-auto pull-right outpageMessage"
              style={this.state.messageData.message ? {display:"block"}: {display: "none"}}>
              <div className="alert-group">
                  <div className={this.state.messageData.class 
                                  ? "alert alert-"+this.state.messageData.class+" alert-dismissable " +Style.alertMessage
                                  : "alert alert-dismissable " + Style.alertMessage}>
                      <button type="button" className="close" onClick={this.close.bind(this)}>×</button>
                      <div className={this.state.messageData.icon? this.state.messageData.icon+" inpagemessage" : "inpagemessage" } >
                         &nbsp;&nbsp; {this.state.messageData.message ? this.state.messageData.message : ""}
                      </div>
                  </div>
              </div>
          </div>


          <div className="row ml-auto pull-right outpageMessage"
              style={this.state.messageData.message ? {display:"block"}: {display: "none"}}>
              <div className="alert-group">
                  <div className={this.state.messageData.class 
                                  ? "alert alert-"+this.state.messageData.class+" alert-dismissable " +Style.alertMessage
                                  : "alert alert-dismissable " + Style.alertMessage}>
                      <button type="button" className="close" onClick={this.close.bind(this)}>×</button>
                      <div className={this.state.messageData.icon? this.state.messageData.icon+" inpagemessage" : "inpagemessage" } >
                         &nbsp;&nbsp; {this.state.messageData.message ? this.state.messageData.message : ""}
                      </div>
                  </div>
              </div>
          </div>


          <div className={"col-12 NoPadding "}>
          {this.state.newProducts && this.state.newProducts.length > 0 ?
            <div id="home" className={"col-12 " +Style.ecommerceTabContent}>
              <div className={"col-12 mt-50 mb-50 " +Style.carouselWraper}>
                <div className={"container-flex "}>                    
                  {this.state.ProductsLoading === false ?                     
                    <Loader type="carouselloader" productproductWrapperLoaderNo = {4}/>                    
                  :
                  <div className={"col-12 " +Style.rowPadding}>  
                    <div className={"row " +Style.ProductListWrapper }>  

                      <div className={"col-12 mobileNoPadding " +Style.productDetailVendorName}> 
                        <div className="col-12 mobileNoPadding ">
                          <div className="col-12">
                            <div className="row">
                                <span className={"col-8 col-lg-9 col-sm-9 col-xl-9 pb-2 pt-2 "+Style.vendorNameWrapper}> 
                                  <span className={Style.venderName}>Vendor - </span>
                                  <span className={Style.venderName2}>
                                     {this.state.vendorData? this.state.vendorData.companyName:null}
                                  </span>
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
                      <div className="col-12">
                        <div className={" " +Style.rightSidefilter}>
                            <div className={"col-12 "}>
                              <div className={"col-6 col-lg-2 col-xl-2 col-md-3 col-sm-4 NoPadding offset-6 offset-sm-8 offset-md-9 offset-lg-10 "+Style.sortPbWrapper}>     
                                <div className="form-group">
                                    <label className={"labelform d-block d-lg-block d-xl-block d-sm-block col-12 NoPadding "+Style.f14}>
                                      Sort By<span className="astrick"></span>
                                    </label>
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

                      <div className="col-12">
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
                    </div>                    
                    :
                    // if left side filters are not available in product block
                      <div className="col-12">
                        <div className="row">
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
                      </div>
                    }  
                    </div>                 
                  </div>
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
      <div className="col-12">
        <div className="col-2 offset-5 loading">
          <img src="/images/eCommerce/loader.gif" className="col-12 lazyload" loading="lazy"></img>
        </div> 
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView);