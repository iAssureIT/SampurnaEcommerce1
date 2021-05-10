import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Message                from '../../StaticBlocks/Message/Message.js';
import Style                  from './ProductCarousel.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import {getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 

class Product extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            newProducts : [],
            wishList    : [],
            blockSettings : [],

        }
        // console.log("1. Inside constructor");
    }

    componentDidMount(){
        // console.log("2. Inside product ComponentDidMount");
        var user_ID = localStorage.getItem("user_ID"); 
        const websiteModel = localStorage.getItem("websiteModel");      
        const showLoginAs = localStorage.getItem("showLoginAs"); 
        if(user_ID!==null){     
          this.setState({
            user_ID:user_ID,
            showLoginAs: showLoginAs,
            websiteModel:websiteModel
          },()=>{
              this.getWishlistData();
          }); 
        }

    }
    componentDidUpdate(prevState, nextState){
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      // console.log("1.Inside product getDerivedStateFromProps nextProps",nextProps);
      // console.log("2.Inside product getDerivedStateFromProps prevState",prevState);
      if (nextProps.newProducts) {
        return ({ 
          newProducts: nextProps.newProducts,
          blockSettings   : nextProps.blockSettings,
          productSettings : nextProps.productSettings
        }) // <- this is setState equivalent
      }
      return null
    }

    addCart(formValues, quantityAdded, availableQuantity) {
      if(localStorage.getItem('webSiteModel')==='FranchiseModel'){
        axios.post('/api/carts/post', formValues)
          .then((response) => {
            // store.dispatch(fetchCartData());
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
            }, 3000);
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
        }, 3000);
      } else {
        axios.post('/api/carts/post', formValues)
          .then((response) => {
            console.log("this.props.fetchCartData();",this.props.fetchCartData());
            console.log("cart response;",response.data);
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
            }, 3000);
            this.props.fetchCartData();
  
          })
          .catch((error) => {
            console.log('error', error);
          })
      }
    }//end else websiteModel
    }
  
    submitCart(event) { 
      const user_ID = localStorage.getItem('user_ID');
      console.log("userId===",user_ID);
      if(user_ID){
        // console.log("recentCartData===",this.props.recentCartData);
        if(this.props.recentCartData.length>0 && this.props.recentCartData[0].cartItems.length>0){
            var cartLength = this.props.recentCartData[0].cartItems.length;
            var productId = event.target.id;
            for(let i=0;i<cartLength;i++){
                if(this.props.recentCartData[0].cartItems[i].product_ID === productId){
                  this.setState({
                    messageData: {
                      "type": "outpage",
                      "icon": "fa fa-exclamation-circle",
                      "message": "This product is already in your cart",       
                      "class": "success",
                      "autoDismiss": false
                    }
                  })
                  setTimeout(() => {
                    this.setState({
                      messageData: {},
                    })
                  }, 3000);
                  break;
                  // console.log("submitCart userId===",this.state);
  
                }//end if
            }//end for loop
        }
        // console.log("this.props.recentCartData[0].cartItems:",this.props.recentCartData[0].cartItems);
      var id = event.target.id;
      if(localStorage.getItem("websiteModel")=== "FranchiseModel"){
        var selectedSize = $('#'+id+"-size").val();      
        var size = event.target.getAttribute('mainsize');      
        var unit = event.target.getAttribute('unit');      
      }    
      const userid = localStorage.getItem('user_ID');
      var availableQuantity = event.target.getAttribute('availablequantity');
      // console.log("AvailableQuantity=======",$('.xyz'));
      var currProId = event.target.getAttribute('currpro');
      var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
      var productCartData = recentCartData.filter((a) => a.product_ID === id);
      var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;
      var formValues ={};
      if(localStorage.getItem("websiteModel")=== "FranchiseModel"){
        if(selectedSize === size){
           var quantity = 1;
           var totalWeight = selectedSize +" "+unit
           formValues = {
            "user_ID": userid,
            "product_ID": event.target.id,
            "quantity": 1,  
            "selectedSize" : selectedSize,
            "size"         : size,
            "totalWeight"  : totalWeight,      
          }
        }else{
          quantity    = selectedSize/size;
          totalWeight = size*quantity +" "+unit;
          formValues = {
            "user_ID"      : userid,
            "product_ID"   : event.target.id,
            "quantity"     : quantity,
            "selectedSize" : selectedSize,
            "size"         : size,
            "totalWeight"  : totalWeight,
          }
        }
  
      }else{      
        formValues = {
          "user_ID": userid,
          "product_ID": event.target.id,
          "quantity": 1,        
        }      
      }
  
      this.addCart(formValues, quantityAdded, availableQuantity);
      this.setState({
        ['sizeCollage' + currProId]: false
      })
    }else{
      // console.log("showLogin as====",localStorage.getItem('showLoginAs'));
      if(localStorage.getItem('showLoginAs')==="modal"){
        $('#loginFormModal').show();       
        }else{
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-exclamation-circle",
            "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
            // "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
            
            "class": "danger",
            "autoDismiss": true
          }
        })
        setTimeout(() => {
          this.setState({
            messageData: {},
          })
        }, 3000);
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
      // console.log("recentWishlistData===",this.props.recentWishlistData);
      if (this.state.user_ID) {
        var id = event.target.id;
        // const userid = localStorage.getItem('user_ID');
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
            }, 3000);
            this.getWishlistData();
            // this.props.getWishlistData();
          })
          .catch((error) => {
            console.log('error', error);
          })
      }
      else {
        var previousUrl = window.location.href;
        localStorage.setItem("previousUrl",previousUrl);
        if(localStorage.getItem('showLoginAs')==="modal"){
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
          }, 3000);
        }
      }
    }
  

    render(){
      console.log("1. newProducts----",this.state.newProducts);

      var LGCol = 12/this.state.blockSettings.noOfProductPerLGRow;
      var MDCol = 12/this.state.blockSettings.noOfProductPerMDRow;
      var SMCol = 12/this.state.blockSettings.noOfProductPerSMRow;
      var XSCol = 12/this.state.blockSettings.noOfProductPerXSRow;
      // console.log("XSCol==",XSCol);
      return (
        <div className="col-12">
          <div className="row">
          <Message messageData={this.state.messageData} /> 
          {      
            Array.isArray(this.state.newProducts) && this.state.newProducts.length > 0 ?
            Array.isArray(this.state.newProducts) && this.state.newProducts.map((data, index) => {  
                var x = this.state.wishList && this.state.wishList.length > 0 ? this.state.wishList.filter((abc) => abc.product_ID === data._id) : [];
                // var x = this.props.recentWishlistData && this.props.recentWishlistData.length> 0 ? this.props.recentWishlistData.filter((wishlistItem) => wishlistItem.product_ID === data._id) : [];                              
                var wishClass = 'r';
                var tooltipMsg = '';
                // console.log("this.state.wishList===",this.state.wishList);
                if (x && x.length > 0) {
                  wishClass = '';
                  tooltipMsg = 'Remove from wishlist';
                  // console.log("wishclassName=",wishClass);
                } else {
                  wishClass = 'r';
                  // console.log("wishclassName=",wishClass);
                  tooltipMsg = 'Add To Wishlist';
                }   
                var categoryUrl = (data.category?data.category:"").replace(/\s+/g, '-').toLowerCase();
                // console.log("data product=====",(data.category).replace(/\s+/g, '-').toLowerCase());                    
              return (
                <div className={" col-sm-"+LGCol+" col-"+XSCol +" " +Style.mobileViewPadding }   key={index}> 
                  {/* <div key={index} className={"col-lg-3 " +Style.singleProduct}>                           */}
                  <div className={"col-12 NoPadding " +Style.productBlock +" " +Style.productInnerWrap +" " +Style.NoPadding}>                                 
                    <div className={"col-12 NoPadding"}>
                      <div className={"col-12 NoPadding " +Style.NoPadding +" " +Style.productImg}>
                      <div className={"col-12 NoPadding " +Style.wishlistBtn}>
                          {this.state.productSettings.displayWishlist === true?
                              this.state.user_ID?
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)}><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                              :
                              <button type="submit" id={data._id} title={tooltipMsg} className={Style.wishIcon } onClick={this.addtowishlist.bind(this)} data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal"><i id={data._id} className={"fa" +wishClass +" fa-heart wishListIconColor "}></i></button>
                          :null
                          }
                          {data.discountPercent ? <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 "  +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null}
                        </div>
                        <div className={styleMedia.ImgWrapper}>
                        <Link href={`/productDetail/${encodeURIComponent(categoryUrl)}/${encodeURIComponent(data.productUrl)}/${encodeURIComponent(data._id)}`}>
                        <a className={Style.product_item_photo } tabIndex="-1" >
                          {/* <img loading="lazy" src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"} alt="ProductImg" className={Style.noAvailableImg +" " +Style.productImg +"lazyload img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"}/> */}
                          <Image                                           
                            src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"}
                            alt="ProductImg" 
                            className={"img-responsive " +Style.NoAvailableImg }
                            height={260}
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
                            <div className={"col-12 globalProduct_brand RegionalFont"} title={data.brandNameRlang}>{data.brandNameRlang}</div>
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
                          <div className={"col-12 globalProductItemName NoPadding RegionalFont "+Style.NoPadding } title={data.productNameRlang}>
                            <span className={"RegionalFont " +Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                          </div>
                          :
                          <div className={"col-12 globalProductItemName NoPadding "+Style.NoPadding } title={data.productName}>
                          <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;</div>
                          }
                          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "  +Style.NoPadding}>
                            {
                              localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                data.discountPercent ?    
                                <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>  
                                  {/* <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice} { data.size? "/ " +data.size +" "+data.unit:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span>                                  */}
                                  <span className={Style.price}><span className={Style.oldprice}><i className="fas fa-rupee-sign "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fas fa-rupee-sign"></i> {data.discountedPrice}</span>    
                                </div>   
                                :
                                  <div className={"col-12  " +Style.priceWrapper +" " +Style.NoPadding}>
                                    <span className={Style.price}><i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice} {data.size? "/ " +data.size:null}&nbsp;<span className={Style.ProSize}>{data.size?data.unit:null}</span></span> &nbsp;                                       
                                  </div>

                              :                                    
                                data.discountPercent ?
                                <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                  <span className={Style.price}><span className={Style.oldprice }>&nbsp;<i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice}&nbsp;</span>&nbsp;
                                  <i className="fa fa-inr"></i>&nbsp;{data.discountedPrice+".00"} 
                                  </span>
                                </div>
                                :  
                                <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                  <span className={Style.price}><i className="fas fa-rupee-sign"></i>&nbsp;{data.originalPrice} </span> &nbsp;                                      
                                </div> 
                            }
                          </div>
                          {this.state.productSettings.displayRating === true ?
                            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.displayRating +Style.customePadding}>
                                <span id="productRating" className={"col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding " +Style.NoPadding} onMouseOver={this.showRatingBlock.bind(this)} >
                                    <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.showRating}> 4 <i className="fas fa-star"></i></div>                                        
                                </span>  
                                {/* <div className="col-12 NoPadding ratingBlock">
                                    <RatingBlock />
                                </div>                                   */}
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
                                localStorage.getItem("websiteModel")=== "FranchiseModel"?
                                <div className={"col-12 NoPadding " +Style.btnWrap +" " +Style.NoPadding}>                                                                             
                                    <div className={"col--6 NoPadding " +Style.selectSizeBox +" " +Style.NoPadding}>                                                                              
                                    <select className={"col-12 " +Style.selectdropdown +" " +Style.valid +" " +Style.availablesize +" " +Style.NoPadding} currpro={data._id} id={data._id +"-size"} mainsize={data.size} unit={data.unit} name="size" aria-invalid="false">
                                      { Array.isArray(data.availableSizes) && data.availableSizes.map((size, index) => {
                                          return( 
                                            // <option className="selectedSize" value={availablesize.productSize}>{availablesize.packSize} Pack</option>
                                            
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
                                  <button type="submit" color={data.color} id={data._id} productcode={data.productCode} availablequantity={data.availableQuantity} currpro={data._id} mainsize={data.size} unit={data.unit}  onClick={this.submitCart.bind(this)} 
                                    title="Add to Cart" className={"col-6 fa fa-shopping-cart "  }>                                                                         
                                    &nbsp;Add
                                  </button>                          
                                </div>
                                :
                                data.availableQuantity > 0 ?
                                  // <button type="submit" id={data._id} className={"fa fa-shopping-cart pull-right" } color={data.color} productcode={data.productCode} availableQuantity={data.availablequantity} onClick={this.addtocart.bind(this)} title="Add to Cart" >
                                  <div>
                                  {this.state.user_ID?
                                  <button type="submit" id={data._id} className={data.availableQuantity +" fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" >
                                      &nbsp;Add To Cart
                                  </button>
                                  :
                                  <button type="submit" id={data._id} className={data.availableQuantity +" fa fa-shopping-cart globalAddToCartBtn "} color={data.color} productcode={data.productCode} availablequantity={data.availableQuantity} onClick={this.submitCart.bind(this)} title="Add to Cart" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" >
                                      &nbsp;Add To Cart
                                  </button>
                                  }     
                                  </div>                                           
                                  :
                                  <div className={Style.outOfStock}>Sold Out</div>
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
            :<div>No products available</div>
            // <Loader type="carouselloader" productLoaderNo = {4}/>
        }
        </div>
       </div>
     
     ) 
    }
}

const mapStateToProps = state => (
  // console.log("state in productCarousel====",state.data),
  {
    recentCartData     : state.data.recentCartData,
    recentWishlistData : state.data.recentWishlistData,
    productApiUrl      : state.data.productApiUrl
    
  } 
);

const mapDispatchToProps = {
  fetchCartData    : getCartData, 
  getWishlistData: getWishlistData,

};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
