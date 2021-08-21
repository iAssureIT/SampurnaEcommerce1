import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Message                from '../../StaticBlocks/Message/Message.js';
import Style                  from './ProductCarousel.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import useRouter              from 'next/router';
import SingleProduct          from '../../StaticBlocks/SingleProduct/SingleProduct.js';
import {updateCartCount,getCartData,getWishlistData,getWishlist}  from '../../../../../redux/actions/index.js'; 

class Product extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            newProducts : [],
            wishList    : [],
            blockSettings : [],
        }
    }

    componentDidMount(){
        // console.log("productView props=",this.props);
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
              this.props.fetchWishlist();
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
    }//end else websiteModel
    }
  
    submitCart(event) {
      console.log("lat long",this.props.userLongitude,this.props.userLatitude,this.props.vendorlocation_ID);
      if(this.state.user_ID){
      var id = event.target.id;
      var availableQuantity = event.target.getAttribute('availablequantity');
      var currProId = event.target.getAttribute('currpro');
      var quantityAdded=0;
      var formValues ={};
      if(this.state.websiteModel === "FranchiseModel"){
        if(selectedSize === size){
           var quantity = 1;
           var totalWeight = selectedSize +" "+unit
           formValues = {
            "user_ID": this.state.user_ID,
            "product_ID": event.target.id,
            "quantity": 1,  
            "selectedSize" : selectedSize,
            "size"         : size,
            "totalWeight"  : totalWeight,  
            "vendorName" : event.target.getAttribute('vendor_name'),
            "vendor_ID"  : event.target.getAttribute('vendor_id'),      
          }
        }else{
          quantity    = selectedSize/size;
          totalWeight = size*quantity +" "+unit;
          formValues = {
            "user_ID"           : this.state.user_ID,
            "product_ID"        : event.target.id,
            "vendor_ID"         : "",
            "quantity"          : quantity,
            "selectedSize"      : selectedSize,
            "size"              : size,
            "totalWeight"       : totalWeight,
          }
        }
      }else{      
        formValues = {
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
      }
  
      this.addCart(formValues, quantityAdded, availableQuantity);
      this.setState({
        ['sizeCollage' + currProId]: false
      })
    }else{
      if(this.state.showLoginAs === "modal"){
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
      }//end else
    }
    }
    // getWishlistData() {
    //   axios.get('/api/wishlist/get/wishlistdata/' + this.state.user_ID)    
    //     .then((response) => {
    //       if(response){
    //         // console.log("wislist response====",response.data);
    //         this.setState({
    //           wishList: response.data
    //         },()=>{
    //               // console.log("2.My Wislist products ====",this.state.wishList);
    //         })
    //       }        
    //     })
    //     .catch((error) => {
    //       console.log('error', error);
    //     })
    // }
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
  
    render(){

      var LGCol = 12/this.props.blockSettings.noOfProductPerLGRow;
      var MDCol = 12/this.props.blockSettings.noOfProductPerMDRow;
      var SMCol = 12/this.props.blockSettings.noOfProductPerSMRow;
      var XSCol = 12/this.props.blockSettings.noOfProductPerXSRow;
      console.log("this.props.recentWishlist===",this.props.recentWishlist);
      return (
        <div className="row">
          <Message messageData={this.state.messageData} /> 
           { Array.isArray(this.props.newProducts) && this.props.newProducts.length > 0 ?
            Array.isArray(this.props.newProducts) && this.props.newProducts.map((data, index) => { 
                  
                // console.log("data in map  ===> ",data);
             
                var x = this.props.recentWishlist && this.props.recentWishlist.length> 0 ? this.props.recentWishlist.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];                              
                var wishClass = 'r';
                var tooltipMsg = '';
                if (x && x.length > 0) {
                  wishClass = '';
                  tooltipMsg = 'Remove from wishlist';
                } else {
                  wishClass = 'r';
                  tooltipMsg = 'Add To Wishlist';
                }   
                var categoryUrl = (data.category?data.category:"").replace(/\s+/g, '-').toLowerCase();                    
                var subCategoryUrl = (data.subCategory?data.subCategory:"-").replace(/\s+/g, '-').toLowerCase();                    
              return (
                <div className={" col-sm-6 col-12  col-lg-3 col-xl-3  " +Style.mobileViewPadding +" "+Style.productWrapper}   key={index}> 
                  <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                    <div className={"col-12 NoPadding"}>
                      <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                        <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                          {this.props.productSettings.displayWishlist === true?
                              this.state.user_ID && this.state.authService!=="guest"?
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                              :
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                          :null
                          }
                          {data.discountPercent ? <div className={"col-3 pt-1 "  +Style.discounttag}>{Math.floor(data.discountPercent)}%<div className={Style.offTxt}>off</div> </div> : null}
                        </div>
                        <div className={Style.ImgWrapper}>
                        <Link href={"/product-detail/" +this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+categoryUrl+"/"+subCategoryUrl+"/"+data._id}>
                        <a className={Style.product_item_photo } tabIndex="-1" >
                          <img 
                            src={data.productSmallImage && data.productSmallImage.length>0 ? data.productSmallImage[0] : "/images/eCommerce/notavailable.png"}
                            alt="ProductImg" 
                            className={"img-responsive " +Style.NoAvailableImg }
                            height={data.productImage[0] ? "163px" : '140px'}
                            // width={data.productImage[0] ? "180px" : '160px'} 
                            layout={'intrinsic'}
                          />
                        </a>
                        </Link>
                        </div>
                      </div>
                      <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                        <div className={"col-12 " +Style.innerDiv}>
                          {this.props.productSettings.displayBrand === false?
                            data.brandNameRlang?
                            <div className={"col-12 globalProduct_brand RegionalFont1"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                            :
                              <div className={"col-12 globalProduct_brand " +Style.ellipsis} title={data.brand}>{data.brand}</div>

                          :null
                          }                                        
                          
                          {this.props.productSettings.displaySection === true ?
                            <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                          :null
                          }
                          {this.props.productSettings.displayCategory === true ?
                            <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                          :null
                          }
                          <div className={"col-12 globalProductItemName  " } title={data.productName}>
                            <span className={ Style.ellipsis +" mt-2 " +Style.globalProdName}>{data.productName} &nbsp;
                            </span>&nbsp;
                            <span className={"col-12 mt-2 NoPadding "+Style.sizeUnitName}>{data.size && data.size}&nbsp;{data.unit && data.size && data.unit}</span>
                          </div>

                          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                            {
                              this.state.websiteModel === "FranchiseModel"?                                  
                                data.discountPercent ?    
                                <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                  <span className={Style.price}><span className={Style.oldprice}>
                                  {this.state.currency}&nbsp;{data.originalPrice} </span>&nbsp; {this.state.currency} {data.discountedPrice}</span>    
                                </div>   
                                :
                                  <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                    <span className={Style.price}>{this.state.currency} &nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                  </div>

                              :                                    
                                data.discountPercent ?
                                <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                  <span className={Style.price}><span className={Style.oldprice }>&nbsp;{this.state.currency} &nbsp;{data.originalPrice}&nbsp;</span>&nbsp;
                                  {this.state.currency} &nbsp;{(data.discountedPrice).toFixed(2)} 
                                  </span>
                                </div>
                                :  
                                <div className={"col-12 NoPadding pb-2 gcf" +Style.priceWrapper +" " +Style.NoPadding}>
                                  <span className={Style.price}>
                                    {this.state.currency} &nbsp;{(data.originalPrice).toFixed(2)} </span> &nbsp;                                      
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
                                data.availableQuantity > 0 ?
                                  <div className={"col-12 " +Style.NoPadding}>
                                  {this.state.user_ID?
                                  <button type="submit" vendor_name={data.vendorName} vendor_id={data.vendor_ID} id={data._id} className={"col-12  globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                      &nbsp;Add To Cart
                                  </button>
                                  :
                                  <button type="submit" id={data._id} vendor_name={data.vendorName} vendor_id={data.vendor_ID} className={"col-12  globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
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
              );
            })
            :<div className ="text-center">Opps... Sorry... No Products Available</div>
            // <Loader type="carouselloader" productLoaderNo = {4}/>
          }
        </div>
      //  </div>
     
     ) 
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
export default connect(mapStateToProps, mapDispatchToProps)(Product);
