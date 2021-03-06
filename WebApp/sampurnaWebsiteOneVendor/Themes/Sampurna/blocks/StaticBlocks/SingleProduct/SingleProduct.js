import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Message                from '../../StaticBlocks/Message/Message.js';
import Style                  from './SingleProduct.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import {updateCartCount,getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 

class SingleProduct extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            newProducts : [],
            wishList    : [],
            blockSettings : [],
        }
    }

    componentDidMount(){
        // console.log("single productView props=",this.props);
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var user_ID                = userDetails.user_id; 
          var authService            = userDetails.authService;
        }
        
        if(sampurnaWebsiteDetails.deliveryLocation){
          this.setState({
            "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.latitude,
            "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
            "delLocation"   : sampurnaWebsiteDetails.deliveryLocation.address,
          })
        }

        if(sampurnaWebsiteDetails.preferences){
          this.setState({
            currency      : sampurnaWebsiteDetails.preferences.currency,
            showLoginAs   : sampurnaWebsiteDetails.preferences.websiteModel.showLoginAs,
            websiteModel  : sampurnaWebsiteDetails.preferences.websiteModel
          })
        }
       
        if(user_ID!==null){     
          this.setState({
            user_ID       : user_ID,
            authService   : authService,
          },()=>{
              this.props.getWishlistData();
          }); 
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
          "userLatitude"      : this.props.userLatitude,
          "userLongitude"     : this.props.userLongitude,
          "vendorLocation_id" : this.props.vendorlocation_ID,
          "vendorName"        : event.target.getAttribute('vendor_name'),
          "vendor_ID"         : this.props.vendor_ID,     
        }   
        console.log("formValues=",formValues);   

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
          "vendor_id"           : this.props.vendor_ID,
          "vendorLocation_id"   : this.props.vendorlocation_ID,
          "product_ID"          : id
      }
        
        // console.log("inside wishlist==",formValues);
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
            window.location.reload();
            
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
    
    getWishListData() {
      // console.log("inside wishlist");
    var formValues ={
      "user_ID"             : this.state.user_ID,
      "userLat"             : this.state.userLongitude, 
      "userLong"            : this.state.userLongitude
    }
      console.log("formValues=",formValues);
  
      axios.post('/api/wishlist/get/userwishlist', formValues)    
        .then((response) => {
          if(response){
            console.log('wishlist data', response.data);
            this.setState({
              wishlistData: response.data
            })
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    }

    render(){
      // console.log("single productView props=",this.props.data);
      { var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === this.props.data._id) : [];                              
        var wishClass = 'r';
        var tooltipMsg = '';
        if (x && x.length > 0) {
          wishClass = '';
          tooltipMsg = 'Remove from wishlist';
        } else {
          wishClass = 'r';
          // console.log("wishClass==",wishClass);
          tooltipMsg = 'Add To Wishlist';
        }   
        var categoryUrl = (this.props.data.category?this.props.data.category:"").replace(/\s+/g, '-').toLowerCase();;                    
        }

      return (
        <div className="row">
            <Message messageData={this.state.messageData} /> 
            <div className={" col-12  " +Style.mobileViewPadding +" "+Style.productWrapper} > 
                <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                <div className={"col-12 NoPadding"}>
                    <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                    <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                        {this.props.productSettings.displayWishlist === true?
                            this.state.user_ID && this.state.authService!=="guest"?
                            <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={this.props.data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                              // this.props.data.isWish?
                              //   <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={this.props.data._id} className={"fa fa-heart wishListIconColor "}></i></button>
                              //   :
                              //   <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={this.props.data._id} className={"far fa-heart wishListIconColor "}></i></button>
                            :
                            <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={this.props.data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                        :null
                        }
                        {this.props.data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(this.props.data.discountPercent)}%<br/>off</div> : null}
                    </div>
                    <div className={Style.ImgWrapper}>
                    {/* <a href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.data._id} className={Style.product_item_photo }> */}
                    <a href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.data._id} className={Style.product_item_photo }>
                        <img                                           
                          src={Array.isArray(this.props.data.productImage) && this.props.data.productImage > 0 && this.props.data.productImage[0] ? this.props.data.productImage[0] : "/images/eCommerce/notavailable.png"}
                          alt="ProductImg" 
                          className={"img-responsive " +Style.NoAvailableImg }
                          height={this.props.data.productImage[0] ? "140px" : '130px'} 
                          width={this.props.data.productImage[0] ? "150px" : '120px'} 
                          layout={'intrinsic'}
                        />
                    </a>
                    </div>
                    </div>
                    <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                    <div className={"col-12 " +Style.innerDiv}>
                        {this.props.productSettings.displayVendorName === true 
                        ?
                            <div className={"col-12 " +Style.ellipsis +" " +Style.globalProduct_vendor} title={this.props.data.vendorName}>{this.props.data.vendorName}</div>
                        :   null
                        }    
                        {/* {this.props.productSettings.displayBrand === true ?
                        this.props.data.brandNameRlang?
                        <div className={"col-12 globalProduct_brand RegionalFont1"} title={this.props.data.brandNameRlang}>{this.props.data.brandNameRlang}</div>
                        :
                            <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={this.props.data.brand}>{this.props.data.brand}</div>

                        :null
                        }  */}
                        {this.props.productSettings.displaySection === true ?
                        <div className={"col-12 globalProductItemName"} title={this.props.data.section}>{this.props.data.section}</div>
                        :null
                        }
                        {this.props.productSettings.displayCategory === true ?
                        <div className={"col-12 globalProduct_brand"} title={this.props.data.category}>{this.props.data.category}</div>
                        :null
                        }
                        {/* {this.props.data.productNameRlang?
                        <div className={"col-12 globalProductItemName  RegionalFont " } title={this.props.data.productNameRlang}>
                            <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{this.props.data.productNameRlang} </span>&nbsp;                                        
                        </div>:null
                        } */}

                        <div className={"col-12 globalProductItemName  " } title={this.props.data.productName}>
                          <span className={ Style.ellipsis +" " +Style.globalProdName}>{this.props.data.productName} </span>&nbsp;
                          <div className={"col-12  NoPadding "+Style.sizeUnitName}>{this.props.data.size && this.props.data.size}&nbsp;{this.props.data.unit && this.props.data.size && this.props.data.unit}</div>
                        </div>

                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                        {
                            this.state.websiteModel === "FranchiseModel"?                                  
                            this.props.data.discountPercent ?    
                            <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                <span className={Style.price}><span className={Style.oldprice}>
                                {this.state.currency}&nbsp;{this.props.data.originalPrice} </span>&nbsp; {this.state.currency} {this.props.data.discountedPrice}</span>    
                            </div>   
                            :
                                <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                <span className={Style.price}>{this.state.currency} &nbsp;{this.props.data.originalPrice} {this.props.data.size? "/ " +this.props.data.size:null}&nbsp;<span className={Style.ProSize}>{this.props.data.size?this.props.data.unit:null}</span></span> &nbsp;                                       
                                </div>

                            :                                    
                            this.props.data.discountPercent ?
                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                <span className={Style.price}><span className={Style.oldprice }>&nbsp;{this.state.currency} &nbsp;{this.props.data.originalPrice}&nbsp;</span>&nbsp;
                                {this.state.currency} &nbsp;{(this.props.data.discountedPrice).toFixed(2)} 
                                </span>
                            </div>
                            :  
                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                <span className={Style.price}>
                                {this.state.currency} &nbsp;{(this.props.data.originalPrice).toFixed(2)} </span> &nbsp;                                      
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
                            { this.props.data.availableQuantity > 0 ?
                                <div className={"col-12 " +Style.NoPadding}>
                                {this.state.user_ID?
                                  this.props.distance > this.props.maxDistanceRadius?
                                    <button type="submit" vendor_name={this.props.data.vendorName} vendor_id={this.props.data.vendor_ID} id={this.props.data._id} disabled className={"col-12  disableBtn globalAddToCartBtn "} color={this.props.data.color} productcode={this.props.data.productCode} availablequantity={this.props.data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                        &nbsp;Add To Cart
                                    </button>
                                  :
                                    <button type="submit" vendor_name={this.props.data.vendorName}  vendor_id={this.props.data.vendor_ID} id={this.props.data._id} className={"col-12  globalAddToCartBtn "} color={this.props.data.color} productcode={this.props.data.productCode} availablequantity={this.props.data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                        &nbsp;Add To Cart
                                    </button>
                                :
                                <button type="submit" id={this.props.data._id} vendor_name={this.props.data.vendorName} vendor_id={this.props.data.vendor_ID} className={"col-12  globalAddToCartBtn "} color={this.props.data.color} productcode={this.props.data.productCode} availablequantity={this.props.data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
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
     ) 
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
  getWishlistData: getWishlistData,

};
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
