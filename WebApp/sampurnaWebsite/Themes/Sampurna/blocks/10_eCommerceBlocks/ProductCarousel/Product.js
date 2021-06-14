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
import {updateCartCount,getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 

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
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          var user_ID                = userDetails.user_id; 
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
        }, 10000);
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
            }, 10000);
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
      var vendor_id
      if(this.state.websiteModel === "FranchiseModel"){
        var selectedSize = $('#'+id+"-size").val();      
        var size = event.target.getAttribute('mainsize');      
        var unit = event.target.getAttribute('unit');      
      }    
      var availableQuantity = event.target.getAttribute('availablequantity');
      var currProId = event.target.getAttribute('currpro');
      // if(this.props.recentCartData && this.props.recentCartData.vendorOrders){
      //   for(let i=0;i<this.props.recentCartData.vendorOrders.length;i++){
      //     var recentCartData = this.props.recentCartData.vendorOrders.length > 0 ? this.props.recentCartData.vendorOrders[i].cartItems : [];
      //     var productCartData = recentCartData.filter((a) => a.product_ID === id);
      //     var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;
      //   }
      // }
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
        }, 10000);
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
        const formValues = {
          "user_ID": this.state.user_ID,
          "product_ID": id,
        }
        // console.log("inside wishlist==",formValues);
        axios.post('/api/wishlist/post', formValues)
          .then((response) => {
            // console.log("wishlist ressponse===",response.data);
            var previousUrl = window.location.href;
            localStorage.setItem("previousUrl", previousUrl);
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
        var previousUrl = window.location.href;
        localStorage.setItem("previousUrl",previousUrl);
        if(this.state.showLoginAs === "modal" ==="modal"){
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
  

    render(){
      // console.log("1.recentWishlistData newProducts----",this.props.recentWishlistData);

      var LGCol = 12/this.props.blockSettings.noOfProductPerLGRow;
      var MDCol = 12/this.props.blockSettings.noOfProductPerMDRow;
      var SMCol = 12/this.props.blockSettings.noOfProductPerSMRow;
      var XSCol = 12/this.props.blockSettings.noOfProductPerXSRow;
      // console.log("XSCol==",XSCol);
      return (
        <div className="row">
          <Message messageData={this.state.messageData} /> 
           { Array.isArray(this.props.newProducts) && this.props.newProducts.length > 0 ?
            Array.isArray(this.props.newProducts) && this.props.newProducts.map((data, index) => { 
              // console.log("data._id=",data._id) 
                // var x = this.props.wishList && this.props.wishList.length > 0 ? this.props.wishList.filter((abc) => abc.product_ID === data._id) : [];
                var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];                              
                var wishClass = 'r';
                var tooltipMsg = '';
                if (x && x.length > 0) {
                  wishClass = '';
                  tooltipMsg = 'Remove from wishlist';
                } else {
                  wishClass = 'r';
                  tooltipMsg = 'Add To Wishlist';
                }   
                var categoryUrl = (data.category?data.category:"").replace(/\s+/g, '-').toLowerCase();;                    
              return (
                <div className={" col-sm-"+LGCol+" col-"+XSCol +" " +Style.mobileViewPadding +" "+Style.productWrapper}   key={index}> 
                  <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                    <div className={"col-12 NoPadding"}>
                      <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                      <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                          {this.props.productSettings.displayWishlist === true?
                              this.state.user_ID?
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                              :
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                          :null
                          }
                          {data.discountPercent ? <div className={"col-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null}
                        </div>
                        <div className={styleMedia.ImgWrapper}>
                        <Link href={`/productDetail/${encodeURIComponent(categoryUrl)}/${encodeURIComponent(data.productUrl)}/${encodeURIComponent(data._id)}`}>
                        <a className={Style.product_item_photo } tabIndex="-1" >
                          <Image                                           
                            src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"}
                            alt="ProductImg" 
                            className={"img-responsive " +Style.NoAvailableImg }
                            height={200}
                            width={260} 
                            layout={'intrinsic'}
                          />
                        </a>
                        </Link>
                        </div>
                      </div>
                      <div className={Style.productDetails +" " +"col-12 NoPadding " +Style.NoPadding}>                             
                        <div className={"col-12 " +Style.innerDiv}>
                          {this.props.productSettings.displayBrand === true ?
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
                          {/* {data.productNameRlang?
                            <div className={"col-12 globalProductItemName  RegionalFont " } title={data.productNameRlang}>
                                <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                            </div>:null
                          } */}

                          <div className={"col-12 globalProductItemName  " } title={data.productName}>
                            <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;
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
                                  {/* <i className="fa fa-inr"></i> */}
                                  {this.state.currency} &nbsp;{(data.discountedPrice).toFixed(2)} 
                                  </span>
                                </div>
                                :  
                                <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                  <span className={Style.price}>
                                    {/* <i className="fas fa-rupee-sign"></i> */}
                                    {this.state.currency} &nbsp;{(data.originalPrice).toFixed(2)} </span> &nbsp;                                      
                                </div> 
                            }
                          </div>
                          {this.props.productSettings.displayRating === true ?
                            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.displayRating +Style.customePadding}>
                                <span id="productRating" className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding " +Style.NoPadding} onMouseOver={this.showRatingBlock.bind(this)} >
                                    <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.showRating}> 4 <i className="fas fa-star"></i></div>                                        
                                </span>  
                                {/* <div className="col-12 NoPadding ratingBlock">
                                    <RatingBlock />
                                </div>                                   */}
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
                                this.state.websiteModel === "FranchiseModel"?
                                <div className={"col-12 NoPadding " +Style.btnWrap +" " +Style.NoPadding}>                                                                             
                                    <div className={"col--6 NoPadding " +Style.selectSizeBox +" " +Style.NoPadding}>                                                                              
                                    <select className={"col-12 " +Style.selectdropdown +" " +Style.valid +" " +Style.availablesize +" " +Style.NoPadding} currpro={data._id} id={data._id +"-size"} mainsize={data.size} unit={data.unit} name="size" aria-invalid="false">
                                      { Array.isArray(data.availableSizes) && data.availableSizes.map((size, index) => {
                                          return( 
                                              size === 1000?                                                  
                                              <option className="" value={size} key={index}> 1 KG</option>
                                              :
                                              data.unit === "Box" || data.unit === "Wrap" || data.unit === "Pack" || data.unit==="pounch" ?                                                    
                                                <option className={Style.selectedSize} value={size} key={index}>{size} Pack</option>
                                                  :
                                              <option className={Style.selectedSize} value={size} key={index}>{size}&nbsp;{data.unit}</option>                                                        
                                          )                                                        
                                        })
                                      }
                                    </select>                                     
                                  </div>    
                                  <button type="submit" color={data.color} id={data._id} vendor_name={data.vendorName} vendor_id={data.vendor_ID} productcode={data.productCode} availablequantity={data.availableQuantity} currpro={data._id} mainsize={data.size} unit={data.unit}  onClick={this.submitCart.bind(this)} 
                                    title="Add to Cart" className={"col-6 fa fa-shopping-cart "  }>                                                                         
                                    &nbsp;Add
                                  </button>                          
                                </div>
                                :
                                data.availableQuantity > 0 ?
                                  <div className={"col-12 " +Style.NoPadding}>
                                  {this.state.user_ID?
                                  <button type="submit" vendor_name={data.vendorName} vendor_id={data.vendor_ID} id={data._id} className={"col-12 fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                      &nbsp;Add To Cart
                                  </button>
                                  :
                                  <button type="submit" id={data._id} vendor_name={data.vendorName} vendor_id={data.vendor_ID} className={"col-12 fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
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
    productApiUrl      : state.data.productApiUrl
    
  } 
);

const mapDispatchToProps = {
  fetchCartData    : getCartData, 
  updateCartCount  : updateCartCount,
  getWishlistData: getWishlistData,

};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
