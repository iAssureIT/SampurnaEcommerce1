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
import Style                  from '../../StaticBlocks/SingleProduct/SingleProduct.module.css';
import 'react-multi-carousel/lib/styles.css';
import {getCartData,getWishlist, updateCartCount}  from '../../../../../redux/actions/index.js'; 
import CustomRightArrow       from '../../StaticBlocks/CustomArrows/CustomRightArrow2.js';
import CustomLeftArrow        from '../../StaticBlocks/CustomArrows/CustomLeftArrow2.js';


const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

class ProductCarouselView extends Component {
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

    this.props.getWishlist();
    
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

addCart(formValues, quantityAdded, availableQuantity) {
  if (quantityAdded >= availableQuantity) {
    this.setState({
      messageData: {
        "type": "outpage",
        "icon": "fa fa-check-circle",
        "message": "Last " + availableQuantity + " items taken by you",
        "class": "success",
        "autoDismiss": true
      }
    })
    setTimeout(() => {
      this.setState({
        messageData: {},
      })
    }, 2000);
  }else{
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
        console.log('error', error);
      })
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
    // console.log("quantityAdded===",quantityAdded,availableQuantity);
    // var quantityAdded=1;
    var formValues = {
      "user_ID"           : this.state.user_ID,
      "product_ID"        : event.target.id,
      "quantity"          : 1,   
      "userLatitude"      : this.state.userLatitude,
      "userLongitude"     : this.state.userLongitude,
      "vendorLocation_id" : this.state.vendorlocation_ID,
      "vendorName"        : event.target.getAttribute('vendor_name'),
      "vendor_ID"         : this.state.vendor_ID,     
    }   
    // console.log("formValues=",formValues);   

  this.addCart(formValues, quantityAdded, availableQuantity);
  
}else{
  if(this.state.showLoginAs === "modal"){
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
    }, 2000);
  }//end else
}
}

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
      "vendor_id"           : this.state.vendor_ID,
      "vendorLocation_id"   : this.state.vendorlocation_ID,
      "product_ID"          : id
  }
    
    console.log("inside wishlist==",formValues);
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
        this.props.getWishlist();
        
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  else {
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
      }, 2000);
  }
}

render() {
      // console.log("ProductCarouselView this.props.newProducts==",this.props)
    return (
        <div className={"col-12 " }>        
            <Message messageData={this.state.messageData} />  
            <div className="col-12 ">
                <h5>{this.props.blockTitle && this.props.blockTitle}</h5>
            </div>
            <div className="col-12">
              <div className="col-12">
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
                deviceType={this.props.deviceType}
                itemclassName="carousel-item-padding-10-px"
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                >
                        { 
                        Array.isArray(this.props.newProducts) && this.props.newProducts.length > 0 ?
                            Array.isArray(this.props.newProducts) && this.props.newProducts.map((data, index) => { 
                                var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];
                              //  console.log("wishlist===",this.props.recentWishlistData);
                              //  console.log("data===",data);

                                var tooltipMsg = '';
                                var heartImg = '/images/eCommerce/heartSolid.svg'
                                var tooltipMsg = '';
                                if (x && x.length > 0) {
                                  var heartImg = '/images/eCommerce/heart.svg'
                                  tooltipMsg = 'Remove from wishlist';
                                } else {
                                  var heartImg = '/images/eCommerce/heartSolid.svg'
                                  tooltipMsg = 'Add To Wishlist';
                                }   
                                var categoryUrl = (data.category?data.category:"").replace(/\s+/g, '-').toLowerCase();                    
                                var subCategoryUrl = (data.subCategory?data.subCategory:"-").replace(/\s+/g, '-').toLowerCase(); 
                                               
                            return (
                              // <div className={" col-12 " +Style.mobileViewPadding }  key={index}> 
                              //   {data
                              //   ?
                              //     < SingleProduct 
                              //       data               = {data} 
                              //       distance           = {this.props.distance}
                              //       maxDistanceRadius  = {this.props.maxDistanceRadius}
                              //       productSettings    = {this.state.productSettings}
                              //       blockSettings      = {this.state.blockSettings}
                              //       userLatitude       = {this.state.userLatitude}
                              //       userLongitude      = {this.state.userLongitude}
                              //       user_ID            = {this.state.user_ID}
                              //       vendor_ID          = {data.vendor_ID}
                              //       vendorlocation_ID  = {data.vendorLocation_id}
                              //     />
                              //   :
                              //     null
                              //   }
                              // </div>  
                                <div className="col-12">
                                    {/* <Message messageData={this.state.messageData} />  */}
                                    <div className={" col-12  NoPadding " +Style.mobileViewPadding +" "+Style.productWrapper} > 
                                        <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                                        <div className={"col-12 NoPadding"}>
                                            <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                                            <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                                                {data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)}%<div className={" "+Style.offTxt}>off</div></div> : null}
                                                {this.state.productSettings.displayWishlist === true?
                                                    this.state.user_ID && this.state.authService!=="guest"?
                                                    // <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                                                      data.isWish?
                                                        <button type="submit" id={data._id} title={tooltipMsg} className={"pull-right " +Style.wishIcon } onClick={this.addtowishlist.bind(this)}><img src={heartImg} id={data._id} className={" col-12  wishListIconColor "} /></button>
                                                        :
                                                        <button type="submit" vendorlocation_ID ={data.vendorLocation_id} id={data._id} title={tooltipMsg} className={"pull-right " +Style.wishIcon } onClick={this.addtowishlist.bind(this)}><img src={heartImg} id={data._id} className={" col-12  wishListIconColor "} /></button>
                                                    :
                                                    <button type="submit" id={data._id} title={tooltipMsg} className={ "pull-right " +Style.wishIcon } data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><img src={heartImg} id={data._id} className={" col-12  wishListIconColor "} /></button>
                                                :null
                                                }
                                              
                                            </div>
                                            <div className={Style.ImgWrapper}>
                                            <a href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+categoryUrl+"/"+subCategoryUrl+"/"+data._id} className={Style.product_item_photo }>
                                                <img                                           
                                                  src={Array.isArray(data.productImage) && data.productImage.length > 0 && data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.png"}
                                                  alt="ProductImg" 
                                                  className={"img-fluid " +Style.NoAvailableImg }
                                                  height={data.productImage[0] ? "140px" : '130px'} 
                                                  layout={'intrinsic'}
                                                />
                                            </a>
                                            </div>
                                            </div>
                                            <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                                            <div className={"col-12 " +Style.innerDiv}>
                                                {this.state.productSettings.displayVendorName === true 
                                                ?
                                                    <div className={"col-12 " +Style.ellipsis +" " +Style.globalProduct_vendor} title={data.vendorName}>{data.vendorName}</div>
                                                :   null
                                                }    
                                                {/* {this.state.productSettings.displayBrand === true ?
                                                data.brandNameRlang?
                                                <div className={"col-12 globalProduct_brand RegionalFont1"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                                                :
                                                    <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>

                                                :null
                                                }  */}
                                                {this.state.productSettings.displaySection === true ?
                                                <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                                                :null
                                                }
                                                {this.state.productSettings.displayCategory === true ?
                                                <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                                                :null
                                                }
                                                {/* {data.productNameRlang?
                                                <div className={"col-12 globalProductItemName  RegionalFont " } title={data.productNameRlang}>
                                                    <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                                                </div>:null
                                                } */}

                                                <div className={"col-12 globalProductItemName  " } title={data.productName}>
                                                  <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;
                                                  <div className={"col-12  NoPadding "+Style.sizeUnitName}>{data.size && data.size}&nbsp;{data.unit && data.size && data.unit}</div>
                                                </div>

                                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                                                {
                                                    this.state.websiteModel === "FranchiseModel"?                                  
                                                    data.discountPercent ?    
                                                    <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                                    {/* <span style={{color: "red" , textDecoration:"line-through" }}>
                                                      <span style={{color: "black"}}>black with red strikethrough</span>
                                                    </span> */}
                                                        <span className={Style.price}><span className={Style.oldprice} style={{color: "red" , textDecoration:"line-through" }}>
                                                        {this.state.currency}&nbsp;{data.originalPrice} </span>&nbsp; {this.state.currency} {data.discountedPrice}</span>    
                                                    </div>   
                                                    :
                                                        <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                                        <span className={Style.price}>{this.state.currency} &nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                                        </div>

                                                    :                                    
                                                    data.discountPercent ?
                                                    <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                                      <span style={{color: "red" , textDecoration:"line-through" }}>
                                                      <span className={" "+Style.lineThroughPrice}>&nbsp;{this.state.currency} &nbsp;{data.originalPrice}</span>
                                                    </span>
                                                        <span className={Style.price}>&nbsp;
                                                        {this.state.currency} &nbsp;{(data.discountedPrice).toFixed(2)} 
                                                        </span>
                                                    </div>
                                                    :  
                                                    <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                                        <span className={Style.price}>
                                                        {this.state.currency} &nbsp;{(data.originalPrice).toFixed(2)} </span> &nbsp;                                      
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
                                                    { data.availableQuantity > 0 ?
                                                        <div className={"col-12 " +Style.NoPadding}>
                                                        {this.state.user_ID?
                                                          this.props.distance > this.props.maxDistanceRadius?
                                                            <button type="submit" vendor_name={data.vendorName} vendor_id={data.vendor_ID} id={data._id} disabled className={"col-12  disableBtn globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                                                &nbsp;Add To Cart
                                                            </button>
                                                          :
                                                            <button type="submit" vendor_name={data.vendorName}  vendor_id={data.vendor_ID} id={data._id} className={"col-12  globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                                                &nbsp;Add To Cart
                                                            </button>
                                                        :
                                                        <button type="submit" id={data._id} vendor_name={data.vendorName} vendor_id={data.vendor_ID} className={"col-12  globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
                                                            &nbsp;Add To Cart
                                                        </button>
                                                        }     
                                                        </div>                                           
                                                        :
                                                        <div className={"col-12 globalAddToCartBtn " +Style.outOfStock}>Sold Out</div>
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
    recentWishlistData : state.data.recentWishlist,
    productApiUrl      : state.data.productApiUrl 

  } 
);
const mapDispatchToProps = {
  fetchCartData    : getCartData,  
  updateCartCount  : updateCartCount,
  getWishlist      : getWishlist,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCarouselView);