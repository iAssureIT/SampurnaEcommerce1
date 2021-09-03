import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
// import Message                from '../Message/Message.js';
import Style                  from './SingleProduct.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import {updateCartCount,getCartData,getWishlist,getWishlistData}  from '../../../../../redux/actions/index.js'; 

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
              // this.props.getWishlistData();
              this.props.getWishlistDataLocationWise();
              this.props.fetchWishlist();
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
            this.props.getWishlistDataLocationWise();
            // this.props.getWishlistData();
            this.props.fetchWishlist();
            
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
      // console.log("Product ===",this.props);
      var categoryUrl = (this.props.data.category?this.props.data.category:"").replace(/\s+/g, '-').toLowerCase();                    
      var subCategoryUrl = (this.props.data.subCategory?this.props.data.subCategory:"-").replace(/\s+/g, '-').toLowerCase();                    

      console.log("Id=",this.props.data._id);
      console.log("single wishlist=",this.props.recentWishlist);
     
        var x = this.props.recentWishlist && this.props.recentWishlist.length> 0 ? this.props.recentWishlist.filter((wishlistItem) => wishlistItem._id === this.props.data._id) : [];                              
        console.log("x==",x);
        var heartImg = '/images/eCommerce/heartSolid.svg'
        var tooltipMsg = '';
        if (x && x.length > 0) {
          var heartImg = '/images/eCommerce/heart.svg'
          tooltipMsg = 'Remove from wishlist';
        } else {
          var heartImg = '/images/eCommerce/heartSolid.svg'
          tooltipMsg = 'Add To Wishlist';
        }      
      
        var categoryUrl = (this.props.data.category?this.props.data.category:"").replace(/\s+/g, '-').toLowerCase();;                    
        

      return (
        <div className="col-12">
          <div className="row">
            {/* <Message messageData={this.state.messageData} />  */}
            <div className={" col-12  NoPadding " +Style.mobileViewPadding +" "+Style.productWrapper} > 
                <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                <div className={"col-12 NoPadding"}>
                    <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                    <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                        {this.props.data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(this.props.data.discountPercent)}%<div className={" "+Style.offTxt}>off</div></div> : null}
                        {this.props.productSettings.displayWishlist === true?
                            this.state.user_ID && this.state.authService!=="guest"?
                            // <button type="submit" id={this.props.data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={this.props.data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                              this.props.data.isWish?
                                <button type="submit" id={this.props.data._id} title={tooltipMsg} className={"pull-right " +Style.wishIcon } onClick={this.addtowishlist.bind(this)}><img src={heartImg} id={this.props.data._id} className={" col-12  wishListIconColor "} /></button>
                                :
                                <button type="submit" id={this.props.data._id} title={tooltipMsg} className={"pull-right " +Style.wishIcon } onClick={this.addtowishlist.bind(this)}><img src={heartImg} id={this.props.data._id} className={" col-12  wishListIconColor "} /></button>
                            :
                            <button type="submit" id={this.props.data._id} title={tooltipMsg} className={ "pull-right " +Style.wishIcon } data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><img src={heartImg} id={this.props.data._id} className={" col-12  wishListIconColor "} /></button>
                        :null
                        }
                       
                    </div>
                    <div className={Style.ImgWrapper}>
                    <a href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+categoryUrl+"/"+subCategoryUrl+"/"+this.props.data._id} className={Style.product_item_photo }>
                        <img                                           
                          src={Array.isArray(this.props.data.productImage) && this.props.data.productImage.length > 0 && this.props.data.productImage[0] ? this.props.data.productImage[0] : "/images/eCommerce/notavailable.png"}
                          alt="ProductImg" 
                          className={"img-fluid " +Style.NoAvailableImg }
                          height={this.props.data.productImage[0] ? "140px" : '130px'} 
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
                            {/* <span style={{color: "red" , textDecoration:"line-through" }}>
                              <span style={{color: "black"}}>black with red strikethrough</span>
                            </span> */}
                                <span className={Style.price}><span className={Style.oldprice} style={{color: "red" , textDecoration:"line-through" }}>
                                {this.state.currency}&nbsp;{this.props.data.originalPrice} </span>&nbsp; {this.state.currency} {this.props.data.discountedPrice}</span>    
                            </div>   
                            :
                                <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                <span className={Style.price}>{this.state.currency} &nbsp;{this.props.data.originalPrice} {this.props.data.size? "/ " +this.props.data.size:null}&nbsp;<span className={Style.ProSize}>{this.props.data.size?this.props.data.unit:null}</span></span> &nbsp;                                       
                                </div>

                            :                                    
                            this.props.data.discountPercent ?
                            <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                              <span style={{color: "red" , textDecoration:"line-through" }}>
                              <span className={" "+Style.lineThroughPrice}>&nbsp;{this.state.currency} &nbsp;{this.props.data.originalPrice}</span>
                            </span>
                                <span className={Style.price}>&nbsp;
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
        </div>
     ) 
    }
}

const mapStateToProps = state => (
  {
    cartCount          : state.data.cartCount,
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlistData,
    recentWishlist     : state.data.recentWishlist,   
  } 
);

const mapDispatchToProps = {
  fetchCartData                : getCartData, 
  updateCartCount              : updateCartCount,
  fetchWishlist                : getWishlist,
  getWishlistDataLocationWise  : getWishlistData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
