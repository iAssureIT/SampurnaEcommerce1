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
        console.log("single productView props=",this.props);
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var user_ID                = userDetails.user_id; 
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
          },()=>{
              this.props.getWishlistData();
          }); 
        }
    }

    addCart(formValues, quantityAdded, availableQuantity) {
      if(this.state.webSiteModel === 'FranchiseModel'){
        axios.post('/api/carts/post', formValues)
          .then((response) => {
            this.props.fetchCartData();
            this.setState({
              messageData: {
                "type": "outpage",
                "icon": "fa fa-check-circle",
                "message": "&nbsp; " + response.this.props.data.message,
                "class": "success",
                "autoDismiss": true
              }
            })
            setTimeout(() => {
              this.setState({
                messageData: {},
              })
            }, 2000);
          })
          .catch((error) => {
            console.log('error', error);
          })
      }else{
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
      } else {
        axios.post('/api/carts/post', formValues)
          .then((response) => {
            this.setState({
              messageData: {
                "type": "outpage",
                "icon": "fa fa-check-circle",
                "message": "&nbsp; " + response.this.props.data.message,
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
    }//end else websiteModel
    }
  
    submitCart(event) {
      console.log("lat long",this.props.userLongitude,this.props.userLatitude,this.props.vendorlocation_ID);
      if(this.state.user_ID){
        var id = event.target.id;
        var availableQuantity = event.target.getAttribute('availablequantity');
        var currProId = event.target.getAttribute('currpro');
        var quantityAdded=0;
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
    getWishlistData() {
      axios.get('/api/wishlist/get/wishlistdata/' + this.state.user_ID)    
        .then((response) => {
          if(response){
            // console.log("wislist response====",response.data);
            this.setState({
              wishList: response.data
            },()=>{
                  // console.log("2.My Wislist products ====",this.state.wishList);
            })
          }        
        })
        .catch((error) => {
          console.log('error', error);
        })
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
                "message": "&nbsp; " + response.this.props.data.message,
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
  

    render(){
    //   console.log("single productView props=",this.props.data);
      { var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === this.props.data._id) : [];                              
        var wishClass = 'r';
        var tooltipMsg = '';
        if (x && x.length > 0) {
          wishClass = '';
          tooltipMsg = 'Remove from wishlist';
        } else {
          wishClass = 'r';
          tooltipMsg = 'Add To Wishlist';
        }   
        var categoryUrl = (this.props.data.category?this.props.data.category:"").replace(/\s+/g, '-').toLowerCase();;                    
        }

      return (
        <div className="row">
            <div className={" col-12 " +Style.mobileViewPadding +" "+Style.productWrapper} > 
                <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                <div className={"col-12 NoPadding"}>
                    <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                    <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                        {this.props.productSettings.displayWishlist === true?
                            this.state.user_ID?
                            <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={this.props.data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                            :
                            <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={this.props.data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                        :null
                        }
                        {this.props.data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(this.props.data.discountPercent)} % </div> : null}
                    </div>
                    <div className={styleMedia.ImgWrapper}>
                    <Link href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.data._id}>
                    <a className={Style.product_item_photo } tabIndex="-1" >
                        <img                                           
                        src={this.props.data.productImage[0] ? this.props.data.productImage[0] : "/images/eCommerce/notavailable.jpg"}
                        src={this.props.data.productSmallImage && this.props.data.productSmallImage.length>0 ? this.props.data.productSmallImage[0] : "/images/eCommerce/notavailable.jpg"}
                        alt="ProductImg" 
                        className={"img-responsive " +Style.NoAvailableImg }
                        height={150}
                        width={180} 
                        layout={'intrinsic'}
                        />
                    </a>
                    </Link>
                    </div>
                    </div>
                    <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                    <div className={"col-12 " +Style.innerDiv}>
                        {this.props.productSettings.displayVendorName === true 
                        ?
                            <div className={"col-12 " +Style.ellipsis +" " +Style.globalProduct_vendor} title={this.props.data.vendorName}>{this.props.data.vendorName}</div>
                        :   null
                        }    
                        {this.props.productSettings.displayBrand === true ?
                        this.props.data.brandNameRlang?
                        <div className={"col-12 globalProduct_brand RegionalFont1"} title={this.props.data.brandNameRlang}>{this.props.data.brandNameRlang}</div>
                        :
                            <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={this.props.data.brand}>{this.props.data.brand}</div>

                        :null
                        } 
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
                                <button type="submit" vendor_name={this.props.data.vendorName} vendor_id={this.props.data.vendor_ID} id={this.props.data._id} className={"col-12 fa fa-shopping-cart globalAddToCartBtn "} color={this.props.data.color} productcode={this.props.data.productCode} availablequantity={this.props.data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                    &nbsp;Add To Cart
                                </button>
                                :
                                <button type="submit" id={this.props.data._id} vendor_name={this.props.data.vendorName} vendor_id={this.props.data.vendor_ID} className={"col-12 fa fa-shopping-cart globalAddToCartBtn "} color={this.props.data.color} productcode={this.props.data.productCode} availablequantity={this.props.data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
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
