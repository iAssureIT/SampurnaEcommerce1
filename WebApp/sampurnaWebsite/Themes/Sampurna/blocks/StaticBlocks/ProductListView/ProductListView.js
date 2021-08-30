import React, { Component }   from 'react';
import Image                  from 'next/image';
import Link                   from 'next/link';
import axios                  from 'axios';
import Carousel               from 'react-multi-carousel';
import { connect }            from 'react-redux';
import $, { post }            from 'jquery';
import store                  from '../../../../../redux/store.js'; 
import Message                from '../../StaticBlocks/Message/Message.js';
import Select                 from 'react-select';
import getConfig              from 'next/config';
import SingleProduct          from '../../StaticBlocks/SingleProduct/SingleProduct.js';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import 'react-multi-carousel/lib/styles.css';
import {getCartData,getWishlistData, updateCartCount}  from '../../../../../redux/actions/index.js'; 

const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;

class ProductListView extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType        : props.type,
      newProducts        : [],  
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
      limitRange   : 28,
      vendor_ID    : "",
      categoryUrl  : "",
      brandArray   : [],
    };
  }

  componentDidUpdate(){
    
  }
  async componentDidMount(){

    var formValues = {};
    var subcategoryArray = false;
    var noCategoryUrl   = true;
    
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails){
      this.setState({
        user_ID : userDetails.user_id
      });
    }

    if(sampurnaWebsiteDetails){
        // console.log("sampurnaWebsiteDetails=>",sampurnaWebsiteDetails);
      if(sampurnaWebsiteDetails.deliveryLocation){
        this.setState({
            "userLatitude"  : sampurnaWebsiteDetails.deliveryLocation.latitude,
            "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
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
      },()=>{});
    }
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
    
  this.addCart(formValues, quantityAdded, availableQuantity);   
  }else{
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
        }, 4000);
      }
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
        }, 4000);
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
    const formValues = {
      "user_ID": this.state.user_ID,
      "product_ID": id,
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
        }, 10000);
        this.props.getWishlistData();
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
      }, 10000);
    }
  }
}

render() {
      // console.log("ProductCarouselView this.props.newProducts==",this.props)
    return (
        <div className={"col-12" }>        
            <Message messageData={this.state.messageData} />  
            {/* <div className="col-12 ">
                <h5>{this.props.blockTitle && this.props.blockTitle}</h5>
            </div> */}
                    <div className="col-12">
                      <div className="row">
                      { 
                          Array.isArray(this.props.newProducts) && this.props.newProducts.length > 0 ?
                              Array.isArray(this.props.newProducts) && this.props.newProducts.map((data, index) => { 
                                  var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];
                                //  console.log("data===",data);
                                  var wishClass = 'o';
                                  var tooltipMsg = '';
                                  if (x && x.length > 0) {
                                  wishClass = '';
                                  tooltipMsg = 'Remove from wishlist';
                                  } else {
                                  wishClass = 'o';
                                  tooltipMsg = 'Add To Wishlist';
                                  }   
                                  var categoryUrl = data.category?(data.category).replace(/\s+/g, '-').toLowerCase():null;                  
                              return (
                                <div className={"col-12 col-lg-4 col-sm-6 col-md-4 col-xl-3 " +Style.mobileViewPadding }  key={index}> 
                                  {data
                                  ?
                                    < SingleProduct 
                                      data               = {data} 
                                      distance           = {this.props.distance}
                                      maxDistanceRadius  = {this.props.maxDistanceRadius}
                                      productSettings    = {this.state.productSettings}
                                      blockSettings      = {this.state.blockSettings}
                                      userLatitude       = {this.state.userLatitude}
                                      userLongitude      = {this.state.userLongitude}
                                      user_ID            = {this.state.user_ID}
                                      // vendor_ID          = {this.props.vendor_ID}
                                      // vendorlocation_ID  = {this.props.vendorlocation_ID}
                                      vendor_ID          = {data.vendor_id}
                                      vendorlocation_ID  = {data.vendorLocation_id}
                                    />
                                  :
                                    null
                                  } 
                                {/*</div> 
                                  <div key={index} className={"col-12 " }>                          
                                  <div className={"col-12 NoPadding " +Style.productCaroselBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                                      <div className={"col-12 NoPadding"}>
                                      <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                                      <div className={"col-lg-12 NoPadding " +Style.wishlistBtn}>
                                            {  this.state.user_ID?
                                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa fa-heart" +wishClass +" wishListIconColor "}></i></button>
                                              :
                                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa fa-heart-" +wishClass +" ishListIconColor "}></i></button>
                                            }
                                          {data.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null}
                                          </div>
                                          <div className= {"col-12 NoPadding " +Style.ImgWrapper}>
                                          <Link href={"/product-detail/" +data.vendor_ID+"/"+this.props.vendorlocation_ID&&this.props.vendorlocation_ID+"/"+data._id}>
                                          <a className={Style.product_item_photo } tabIndex="-1" >                                      
                                              <Image                                           
                                              src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.png"}
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
                                              <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>
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
                                          <div className={"col-12 NoPadding " +Style.NoPadding}>
                                              <div className={"col-12 NoPadding " +Style.NoPadding}>                                  
                                              {
                                                  data.availableQuantity > 0 ?
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
                                          </div>
                                          </div>
                                      </div>
                                    
                                      </div>
                                  </div>
                              </div>                             */}
                            </div>
                            );
                          })
                      :null
                      }
                      </div>
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
    productApiUrl      : state.data.productApiUrl 

  } 
);
const mapDispatchToProps = {
  fetchCartData    : getCartData,  
  updateCartCount  : updateCartCount,
  getWishlistData  : getWishlistData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView);