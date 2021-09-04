import React, { Component } from 'react';
import {connect}            from 'react-redux';
import store                from '../../redux/store.js';
import {getCartData,getWishlist, updateCartCount}  from '../../redux/actions/index.js';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                from '../../Themes/Sampurna/blocks/StaticBlocks/SingleProduct/SingleProduct.module.css';

class SearchProduct extends Component {
  constructor(props){
    super(props);
    this.state={
      productSettings       : {          
        displayAssurenceIcon: false,
        displayBrand        : true,
        displayCategory     : false,
        displayFeature      : "size",
        displayRating       : false,
        displayVendorName   : true,
        displaySection      : false,
        displaySubCategory  : false,
        displayWishlist     : true,
    },
    deliveryLocation     : {}, 
    }
  }
  componentDidMount(){
      var url = window.location.href.split('/');
      if(url){
        this.setState({"searchProduct": url[4]},()=>{
        })
      }
      this.props.getWishlist();
    
      var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
      var userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if(userDetails){
        this.setState({
          user_ID : userDetails.user_id,
          "authService"   :  userDetails.authService
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
  render(){
    // console.log("this.props.searchData.data==",this.props.searchData.data.length);
      return (
        <div className="row">
          < Header />
          <div className={" container mt-5 "+Style.searchProductWrapper}> 
              <div className="col-12">
                {this.props.searchData.data ?
                  <div className="row">
                    {/* <div className="col-12 text-center mb-5">{ this.props.searchData.data?this.props.searchData.data.length:0 +" Results found "}</div> */}
                    { 
                    this.props.searchData.data && this.props.searchData.data.map((data, index) => {    
                        var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];
                        console.log("wishlist===",this.props.recentWishlistData);
                         var tooltipMsg = '';
                         var heartImg = '/images/eCommerce/heart.svg'
                         var tooltipMsg = '';
                         if (x && x.length > 0) {
                           var heartImg = '/images/eCommerce/heartSolid.svg'
                           tooltipMsg = 'Remove from wishlist';
                         } else {
                           var heartImg = '/images/eCommerce/heart.svg'
                           tooltipMsg = 'Add To Wishlist';
                         }   
                         var categoryUrl = (data.category?data.category:"").replace(/\s+/g, '-').toLowerCase();                    
                         var subCategoryUrl = (data.subCategory?data.subCategory:"-").replace(/\s+/g, '-').toLowerCase(); 
                               
                        return (
                          <div className={" col-3 "}  key={index}> 
                              <div className="col-12">
                              <div className={" col-12  NoPadding " +Style.mobileViewPadding +" "+Style.productWrapper} > 
                                  <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                                  <div className={"col-12 NoPadding"}>
                                      <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                                      <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                                          {data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)}%<div className={" "+Style.offTxt}>off</div></div> : null}
                                          {this.state.productSettings.displayWishlist === true?
                                              this.state.user_ID && this.state.authService!=="guest"?
                                                <button type="submit" id={data._id} title={tooltipMsg} className={" abc pull-right " +Style.wishIcon } onClick={this.addtowishlist.bind(this)}><img src={heartImg} id={data._id} className={" col-12  wishListIconColor "} /></button>
                                              :
                                                <button type="submit" id={data._id} title={tooltipMsg} className={ " pull-right " +Style.wishIcon } data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><img src={heartImg} id={data._id} className={" col-12  wishListIconColor "} /></button>
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
                                          {this.state.productSettings.displaySection === true ?
                                          <div className={"col-12 globalProductItemName"} title={data.section}>{data.section}</div>
                                          :null
                                          }
                                          {this.state.productSettings.displayCategory === true ?
                                          <div className={"col-12 globalProduct_brand"} title={data.category}>{data.category}</div>
                                          :null
                                          }
                                          <div className={"col-12 globalProductItemName  " } title={data.productName}>
                                            <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;
                                            <div className={"col-12  NoPadding "+Style.sizeUnitName}>{data.size && data.size}&nbsp;{data.unit && data.size && data.unit}</div>
                                          </div>

                                          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                                          {
                                              this.state.websiteModel === "FranchiseModel"?                                  
                                              data.discountPercent ?    
                                              <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                              
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
                           
                          </div>                            
                        );
                      })
                    }
                  </div>
                :
                  <div className =" col-12 mb-5 text-center">
                      <h6>Opps... Sorry... No Products Available. Please search your product</h6>
                  </div>
                }
              </div>
          </div>
          <Footer />
        </div>
     ) 
    }
}

const mapStateToProps = state => (
  {
    searchData : state.data.searchProducts,
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlist,
  }
);

const mapDispatchToProps = {
  fetchCartData    : getCartData,  
  updateCartCount  : updateCartCount,
  getWishlist      : getWishlist,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchProduct);