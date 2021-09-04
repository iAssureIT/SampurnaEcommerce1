import React, { Component }   from 'react';
import $                      from 'jquery';
// import { bindActionCreators } from 'redux';
// import { getCartData }        from '../../actions/index';
// import Loader                 from "../../common/loader/Loader.js";
import axios                  from 'axios';
import { connect }            from 'react-redux';
// import Message                from '../Message/Message.js';
// import AssuredImg             from '../../../sites/currentSite/images/assured.png';
// import notavailable           from '/images/notavailable.jpg';

import './FullPageBlock.css';
// import "../../../sites/currentSite/blocks/EcommerceProductCarousel.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/js/modal.js';
// import 'bootstrap/js/tab.js';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 4,
    slidesToSlide: 1 // optional, default to 1.
  }
};

var isServer = typeof window!==undefined;
var user_ID = '';
if(!isServer){
   user_ID = localStorage.getItem("user_ID");
}

class ProductCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 4
        },
        800:{
            items:5
        },
        1000: {
          items: 5
        }    
      },
      productType        : props.type,
      newProducts        : [
        {
          attributes: [],
          "_id": "5f523c318429470d0da77a3e",
          availableQuantity: 999999,
          availableSizes: [1, 2, 4],
          brand: "Unimandai",
          category: "Fruit Vegetables",
          category_ID: "5ede265a3b797336a09e120c",
          color: "",
          currency: "inr",
          discountPercent: 0,
          discountedPrice: 300,
          featureList: "",
          fileName: "Manual",
          itemCode: "123456",
          originalPrice: 300,
          productCode: "abcd",
          productDetails: "<p>Mango</p>↵",
          productImage: [],
          productName: "Mango",
          productUrl: "mango",
          productVideo: [],
          section: "Vegetables",
          section_ID: "5ede24153b797336a09e1208",
          shortDescription: "amba",
          size: "1",
          status: "Publish",
          subCategory: "Select Sub-Category",
          tags: [],
          taxInclude: true,
          unit: "Kg",
        },
        {
          attributes: [],
          "_id": "5f523c318429470d0da77a3e",
          availableQuantity: 999999,
          availableSizes:[1, 2, 4],
          brand: "Unimandai",
          category: "Fruit Vegetables",
          category_ID: "5ede265a3b797336a09e120c",
          color: "",  
          currency: "inr",
          discountPercent: 0,
          discountedPrice: 300,
          featureList: "",
          fileName: "Manual",
          itemCode: "123456",
          originalPrice: 300,
          productCode: "abcd",
          productDetails: "<p>Mango</p>↵",
          productImage: [],
          productName: "Mango",
          productUrl: "mango",
          productVideo: [],
          section: "Vegetables",
          section_ID: "5ede24153b797336a09e1208",
          shortDescription: "amba",
          size: "1",
          status: "Publish",
          subCategory: "Select Sub-Category",
          tags: [],
          taxInclude: true,
          unit: "Kg",
        },
        {
          attributes: [],
          "_id": "5f523c318429470d0da77a3e",
          availableQuantity: 999999,
          availableSizes:[1, 2, 4],
          brand: "Unimandai",
          category: "Fruit Vegetables",
          category_ID: "5ede265a3b797336a09e120c",
          color: "",  
          currency: "inr",
          discountPercent: 0,
          discountedPrice: 300,
          featureList: "",
          fileName: "Manual",
          itemCode: "123456",
          originalPrice: 300,
          productCode: "abcd",
          productDetails: "<p>Watermelon</p>↵",
          productImage: [],
          productName: "Watermelon",
          productUrl: "watermelon",
          productVideo: [],
          section: "Vegetables",
          section_ID: "5ede24153b797336a09e1208",
          shortDescription: "Kalingad",
          size: "1",
          status: "Publish",
          subCategory: "Select Sub-Category",
          tags: [],
          taxInclude: true,
          unit: "Kg",
        },
        {
          attributes: [],
          "_id": "5f523c318429470d0da77a3e",
          availableQuantity: 999999,
          availableSizes:[250, 500, 1000],
          brand: "Unimandai",
          category: "Fruit Vegetables",
          category_ID: "5ede265a3b797336a09e120c",
          color: "",  
          currency: "inr",
          discountPercent: 0,
          discountedPrice: 40,
          featureList: "",
          fileName: "Manual",
          itemCode: "123456",
          originalPrice: 40,
          productCode: "abcd",
          productDetails: "<p>Grapse</p>↵",
          productImage: [],
          productName: "Grapse",
          productUrl: "Grapse",
          productVideo: [],
          section: "Vegetables",
          section_ID: "5ede24153b797336a09e1208",
          shortDescription: "drakshe",
          size: "1",
          status: "Publish",
          subCategory: "Select Sub-Category",
          tags: [],
          taxInclude: true,
          unit: "GM",
        },
        {
          attributes: [],
          "_id": "5f523c318429470d0da77a3e",
          availableQuantity: 999999,
          availableSizes:[1, 2, 4],
          brand: "Unimandai",
          category: "Fruit Vegetables",
          category_ID: "5ede265a3b797336a09e120c",
          color: "",  
          currency: "inr",
          discountPercent: 0,
          discountedPrice: 60,
          featureList: "",
          fileName: "Manual",
          itemCode: "123456",
          originalPrice: 60,
          productCode: "abcd5",
          productDetails: "<p>Banana</p>↵",
          productImage: [],
          productName: "Banana",
          productUrl: "banana",
          productVideo: [],
          section: "Vegetables",
          section_ID: "5ede24153b797336a09e1208",
          shortDescription: "keli",
          size: "1",
          status: "Publish",
          subCategory: "Select Sub-Category",
          tags: [],
          taxInclude: true,
          unit: "Dozen",
        },
      ],
      products           : [],
      modalIDNew         : [],
      wishList           : [],
      sizeCollage        : false,
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
        blockTitle: "Fruits",
        blockApi  : "/api/products/get/listbysection/Fruits",
        noOfProductPerLGRow: 4,
        noOfProductPerMDRow: 4,
        noOfProductPerSMRow: 4,
        noOfProductPerXSRow: 2,
        showCarousel: true,
        totalProducts: 12,
      },     

      Productsloading    : true,
      blockTitle: "Fruits",
    };
  }
  
  async componentDidMount(){
    // console.log("inside full page block");
    user_ID = localStorage.getItem("user_ID");
    const websiteModel = localStorage.getItem("websiteModel");      
      const showLoginAs = localStorage.getItem("showLoginAs");      
      this.setState({showLoginAs: showLoginAs,websiteModel:websiteModel}); 
      console.log("newProducts====",this.state.newProducts); 
      console.log("Props====",this.props);       
      if(this.props.block_id){
      axios.get('/api/blocks/get/'+this.props.block_id)    
      .then((response)=>{
        if(response.data){
        // console.log("response data====",response.data);                
        this.setState({
           blockSettings   : response.data.blockSettings,  
           productSetting  : response.data.productSettings,   
           blockTitle      : response.data.blockTitle,   
          
        },()=>{
          // console.log("state.blockSettings.api===",this.state.blockSettings.blockApi);
          axios.get(this.state.blockSettings.blockApi)      
          .then((response)=>{
            if(response.data){     
              // console.log("response.data ===",response.data);       
            // if(localStorage.getItem('websiteModel')=== "FranchiseModel"){
              for(var i=0;i<response.data.length;i++){      
                  var availableSizes = [];         
                  if(response.data[i].size){              
                    availableSizes.push(response.data[i].size*1);
                    availableSizes.push(response.data[i].size*2);
                    availableSizes.push(response.data[i].size*4); 
                    response.data[i].availableSizes = availableSizes;           
                  }
              }
           // } 
            this.setState({
              newProducts     : response.data,
              Productsloading : false,              
            },()=>{
                // console.log("newProducts===",this.state.newProducts);
            });
          }
          })
          .catch((error)=>{
              console.log('error', error);
          })
        });
      }else{
        this.setState({          
          Productsloading : false
        });
      }
      })
      .catch((error)=>{
          console.log('error', error);
      })
    }//end if blockid
  }

  addCart(formValues, quantityAdded, availableQuantity) {
    if(localStorage.getItem('webSiteModel')==='FranchiseModel'){
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
          }, 3000);

          // console.log("changrCartCount:",response.data.cartCount);
          // this.props.changeCartCount(response.data.cartCount);

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
          this.props.fetchCartData();
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
          }, 3000);
          // console.log("changrCartCount:",response.data.cartCount);
          // this.props.changeCartCount(response.data.cartCount);

        })
        .catch((error) => {
          console.log('error', error);
        })
    }
  }//end else websiteModel
  }

  submitCart(event) { 
    const user_ID = localStorage.getItem('user_ID');
    if(user_ID){
      if(this.props.recentCartData[0] && this.props.recentCartData[0].cartItems.length>0){
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
                    "autoDismiss": true
                  }
                })
                setTimeout(() => {
                  this.setState({
                    messageData: {},
                  })
                }, 3000);
                break;
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
    if(localStorage.getItem('showLoginAs')==="modal"){
      $('#loginFormModal').show();
      $(".modal-backdrop").remove();
      $("#pageOpacity").show(); 
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
  addtowishlist(event) {
    event.preventDefault();
    if (user_ID) {
      var id = event.target.id;
      const userid = localStorage.getItem('user_ID');
      const formValues = {
        "user_ID": userid,
        "product_ID": id,
      }
      axios.post('/api/wishlist/post', formValues)
        .then((response) => {
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
          this.getWishData();
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
        $("#pageOpacity").show(); 
        }else{
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-exclamation-circle",
            "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
            // "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
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
  getWishData(){
    var user_ID = localStorage.getItem('user_ID');
    axios.get('/api/wishlist/get/userwishlist/'+user_ID)
    .then((response)=>{
      this.setState({
        wishList : response.data
      },()=>{
      })
    })
    .catch((error)=>{
      // console.log('error', error);
    })
  }
  showRatingBlock(event){
    event.preventDefault();
  }

  render() {
    var LGCol = 12/this.state.blockSettings.noOfProductPerLGRow;
    var MDCol = 12/this.state.blockSettings.noOfProductPerMDRow;
    var SMCol = 12/this.state.blockSettings.noOfProductPerSMRow;
    var XSCol = 12/this.state.blockSettings.noOfProductPerXSRow;
    
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
        <div className="row">
          {/* <Message messageData={this.state.messageData} /> */}
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productcomponentheading text-center">
              <div className="producttextclass  col-lg-2">
                <h3 className="row">
                  <b>{this.state.blockTitle}</b> 
                </h3>
              </div>            
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
          <div className="tab-content customTabContent">
            <div id="home" className="tab-pane fade in active ecommerceTabContent">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt50 mb50">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                    
                    {/* {this.state.Productsloading === true ? 
                    <div>Product loading ... {this.state.Productsloading}</div>
                      // <Loader type="carouselloader" productLoaderNo = {4}/>
                    :    */}
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">               
                    { this.state.blockSettings.showCarousel === true?
                    <Carousel  
                      className="owl-theme customnNavButton carouselNewWrapper"
                      swipeable={false}
                      draggable={false}
                      showDots={false}
                      responsive={responsive}
                      ssr={true} // means to render carousel on server-side.
                      infinite={true}
                      autoPlay={this.props.deviceType !== "mobile" ? true : false}
                      autoPlaySpeed={3000}
                      keyBoardControl={true}
                      customTransition="all .20"
                      transitionDuration={500}
                      // containerClass="carousel-container"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      deviceType={this.props.deviceType}
                      //dotListClass="custom-dot-list-style"
                      itemClass="carousel-item-padding-10-px">
                      {
                        Array.isArray(this.state.newProducts) && this.state.newProducts.length > 0 ?
                          Array.isArray(this.state.newProducts) && this.state.newProducts.map((data, index) => {  
                              var x = this.state.wishList && this.state.wishList.length > 0 ? this.state.wishList.filter((abc) => abc.product_ID === data._id) : [];
                              var wishClass = '';
                              var tooltipMsg = '';
                              if (x && x.length > 0) {
                                wishClass = '';
                                tooltipMsg = 'Remove from wishlist';
                              } else {
                                wishClass = '-o';
                                tooltipMsg = 'Add To Wishlist';
                              }   
                              // console.log("tooltipMsg==",tooltipMsg);                    
                            return (
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 customePadding"  key={index}>                           
                                <div className="productBlock col-lg-12 col-md-12 col-sm-12 col-xs-12 productInnerWrap NoPadding">
                                  <div className="item-top col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                    <div className="productImg col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                      {this.state.productSettings.displayWishlistIcon === true?
                                          <button type="submit" id={data._id} title={tooltipMsg} className={"wishIcon fa fa-heart" + wishClass} onClick={this.addtowishlist.bind(this)}></button>
                                      :null
                                      }
                                      {data.discountPercent ? <div className="btn-warning discounttag">{data.discountPercent} % </div> : null}
                                      <a className="product photo product-item-photo collage" tabIndex="-1" href={"/productdetails/" + data.productUrl + "/" + data._id}>
                                        <img src={data.productImage[0] ? data.productImage[0] : "/images/notavailable.jpg"} alt="ProductImg" />
                                      </a>
                                    </div>
                                    <div className="productDetails col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">                             
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerDiv">
                                        {this.state.productSettings.displayBrand === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-brand" title={data.brand}>{data.brand}</div>
                                        :null
                                        }
                                        {this.state.productSettings.displaySection === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-item-link" title={data.section}>{data.section}</div>
                                        :null
                                        }
                                        {this.state.productSettings.displayCategory === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-brand" title={data.category}>{data.category}</div>
                                        :null
                                        }
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding product-item-link" title={data.productName}>{data.productName} 
                                        {data.shortDescription ?                                                        
                                            <span className=" NoPadding marathiName"><span className="bracket">(</span> {data.shortDescription} <span className="bracket">)</span></span>                        
                                        :null
                                        }
                                        </div>
                                        <div className="col-lg-12 col-md-12 NoPadding">
                                          {
                                            localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                              data.discountPercent ?                                      
                                                <span className="price"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fa fa-inr "></i> {data.discountedPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span>       
                                              :
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                  <span className="price"><i className="fa fa-inr price"></i>&nbsp;{data.originalPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span> &nbsp;                                       
                                                </div>
          
                                            :                                    
                                              data.discountPercent ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                <span className="price"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{data.originalPrice} </span><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span>
                                              </div>
                                              :  
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                <span className="price"><i className="fa fa-inr price"></i>&nbsp;{data.originalPrice} /{data.size}&nbsp;<span className="ProSize">{data.unit}</span></span> &nbsp;                                      
                                              </div> 
                                          }
                                        </div>
                                        {this.state.productSettings.displayRating === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 displayRating customePadding">
                                              <span id="productRating" className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding" onMouseOver={this.showRatingBlock.bind(this)} >
                                                  <div className="showRating col-lg-12 col-md-12 col-sm-12 col-xs-12"> 4 <i className="fas fa-star"></i></div>                                        
                                              </span>  
                                              {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ratingBlock">
                                                  <RatingBlock />
                                              </div>                                   */}
                                              <span className="col-lg-5 col-md-5-col-sm-5 col-xs-5 customePadding">(&nbsp;162 &nbsp;)</span>
                                              {this.state.productSettings.displayAssuranceIcon === true ?
                                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 NoPadding assurenceIcon">
                                                  <img className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" src="/images/assured.png" alt="Assured Img" />                                      </span>
                                              :null
                                              }
                                          </div>
                                          :null
                                        }                              
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">                                  
                                            {
                                              localStorage.getItem("websiteModel")=== "FranchiseModel"?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btnWrap NoPadding">                                                                             
                                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 selectSizeBox NoPadding ">                                                                              
                                                  <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectdropdown valid availablesize NoPadding" currpro={data._id} id={data._id +"-size"} mainsize={data.size} unit={data.unit} name="size" aria-invalid="false">
                                                    { Array.isArray(data.availableSizes) && data.availableSizes.map((size, index) => {
                                                        return( 
                                                          // <option className="selectedSize" value={availablesize.productSize}>{availablesize.packSize} Pack</option>
                                                          
                                                            size === 1000?                                                  
                                                            <option className="" value={size} key={index}> 1 KG</option>
                                                            :
                                                            data.unit === "Box" || data.unit === "Wrap" || data.unit === "Pack" || data.unit==="pounch" ?                                                    
                                                              <option className="selectedSize" value={size} key={index}>{size} Pack</option>
                                                                :
                                                            <option className="selectedSize" value={size} key={index}>{size}&nbsp;{data.unit}</option>                                                        
                                                        )                                                        
                                                      })
                                                    }
                                                  </select>                                     
                                                </div>    
                                                <button type="submit" color={data.color} id={data._id} productcode={data.productCode} availablequantity={data.availableQuantity} currpro={data._id} mainsize={data.size} unit={data.unit}  onClick={this.submitCart.bind(this)} 
                                                  title="Add to Cart" className="col-lg-6 col-md-6 col-sm-6 col-xs-6 homeCart fa fa-shopping-cart">                                                                         
                                                  &nbsp;Add
                                                </button>                          
                                              </div>
                                              :
                                              data.availableQuantity > 0 ?
                                                <button type="submit" id={data._id} className="homeCart fa fa-shopping-cart pull-right" color={data.color} productcode={data.productCode} availableQuantity={data.availablequantity} onClick={this.addtocart.bind(this)} title="Add to Cart" >
                                                  &nbsp;Add To Cart
                                                </button>
                                                :
                                                <div className="outOfStock">Sold Out</div>
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
                          : ''
                      }
                    </Carousel>
                    : <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 BlockWrapper">                      
                        {
                        Array.isArray(this.state.newProducts) && this.state.newProducts.length > 0 ?
                          Array.isArray(this.state.newProducts) && this.state.newProducts.map((data, index) => {  
                              var x = this.state.wishList && this.state.wishList.length > 0 ? this.state.wishList.filter((abc) => abc.product_ID === data._id) : [];
                              var wishClass = '';
                              var tooltipMsg = '';
                              if (x && x.length > 0) {
                                wishClass = '';
                                tooltipMsg = 'Remove from wishlist';
                              } else {
                                wishClass = '-o';
                                tooltipMsg = 'Add To Wishlist';
                              }                       
                            return (                            
                              <div className={"col-lg-"+LGCol+" col-md-"+MDCol+" col-sm-"+SMCol+" col-xs-"+XSCol+" customePadding"}   key={index}> 
                              { this.state.blockSettings.totalProducts > index ?                         
                                <div className="productBlock col-lg-12 col-md-12 col-sm-12 col-xs-12 productInnerWrap NoPadding">
                                  <div className="item-top col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                    <div className="productImg col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                      {this.state.productSettings.displayWishlistIcon === true?
                                          <button type="submit" id={data._id} title={tooltipMsg} className={"wishIcon fa fa-heart" + wishClass} onClick={this.addtowishlist.bind(this)}></button>
                                      :null
                                      }
                                      {data.discountPercent ? <div className="btn-warning discounttag">{data.discountPercent} % </div> : null}
                                      <a className="product photo product-item-photo collage" tabIndex="-1" href={"/productdetails/" + data.productUrl + "/" + data._id}>
                                        <img src={data.productImage[0] ? data.productImage[0] : "/images/notavailable.jpg"} alt="ProductImg" />
                                      </a>
                                    </div>
                                    <div className="productDetails col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">                             
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerDiv">
                                        {this.state.productSettings.displayBrand === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-brand" title={data.brand}>{data.brand}</div>
                                        :null
                                        }
                                        {this.state.productSettings.displaySection === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-item-link" title={data.section}>{data.section}</div>
                                        :null
                                        }
                                        {this.state.productSettings.displayCategory === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 product-brand" title={data.category}>{data.category}</div>
                                        :null
                                        }
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding product-item-link" title={data.productName}>{data.productName} 
                                        {data.shortDescription ?                                                        
                                            <span className=" NoPadding marathiName"><span className="bracket">(</span> {data.shortDescription} <span className="bracket">)</span></span>                        
                                        :null
                                        }
                                        </div>
                                        <div className="col-lg-12 col-md-12 NoPadding">
                                          {
                                            localStorage.getItem("websiteModel")=== "FranchiseModel"?                                  
                                              data.discountPercent ?                                      
                                                <span className="price"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{data.originalPrice} </span>&nbsp; <i className="fa fa-inr "></i> {data.discountedPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span>       
                                              :
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                  <span className="price"><i className="fa fa-inr price"></i>&nbsp;{data.originalPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span> &nbsp;                                       
                                                </div>
          
                                            :                                    
                                              data.discountPercent ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                <span className="price"><span className="oldprice"><i className="fa fa-inr "></i>&nbsp;{data.originalPrice} </span><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice} / {data.size}&nbsp;<span className="ProSize">{data.unit}</span></span>
                                              </div>
                                              :  
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                                <span className="price"><i className="fa fa-inr price"></i>&nbsp;{data.originalPrice} /{data.size}&nbsp;<span className="ProSize">{data.unit}</span></span> &nbsp;                                      
                                              </div> 
                                          }
                                        </div>
                                        {this.state.productSettings.displayRating === true ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 displayRating customePadding">
                                              <span id="productRating" className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NoPadding" onMouseOver={this.showRatingBlock.bind(this)} >
                                                  <div className="showRating col-lg-12 col-md-12 col-sm-12 col-xs-12"> 4 <i className="fas fa-star"></i></div>                                        
                                              </span>  
                                              <span className="col-lg-5 col-md-5-col-sm-5 col-xs-5 customePadding">(&nbsp;162 &nbsp;)</span>
                                              {this.state.productSettings.displayAssuranceIcon === true ?
                                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 NoPadding assurenceIcon">
                                                  <img className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" src="/images/assured.png" alt="Assured Img" />                                      </span>
                                              :null
                                              }
                                          </div>
                                          :null
                                        }                              
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">                                  
                                            {
                                              localStorage.getItem("websiteModel")=== "FranchiseModel"?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btnWrap NoPadding">                                                                             
                                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 selectSizeBox NoPadding ">                                                                              
                                                  <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectdropdown valid availablesize NoPadding" currpro={data._id} id={data._id +"-size"} mainsize={data.size} unit={data.unit} name="size" aria-invalid="false">
                                                    { Array.isArray(data.availableSizes) && data.availableSizes.map((size, index) => {
                                                        return( 
                                                          // <option className="selectedSize" value={availablesize.productSize}>{availablesize.packSize} Pack</option>
                                                          
                                                            size === 1000?                                                  
                                                            <option className="" value={size}> 1 KG</option>
                                                            :
                                                            data.unit === "Box" || data.unit === "Wrap" || data.unit === "Pack" || data.unit==="pounch" ?                                                    
                                                              <option className="selectedSize" value={size}>{size} Pack</option>
                                                                :
                                                            <option className="selectedSize" value={size}>{size}&nbsp;{data.unit}</option>                                                        
                                                        )                                                        
                                                      })
                                                    }
                                                  </select>                                     
                                                </div>    
                                                <button type="submit" color={data.color} id={data._id} productcode={data.productCode} availablequantity={data.availableQuantity} currpro={data._id} mainsize={data.size} unit={data.unit}  onClick={this.submitCart.bind(this)} 
                                                  title="Add to Cart" className="col-lg-6 col-md-6 col-sm-6 col-xs-6 homeCart fa fa-shopping-cart">                                                                         
                                                  &nbsp;Add
                                                </button>                          
                                              </div>
                                              :
                                              data.availableQuantity > 0 ?
                                                <button type="submit" id={data._id} className="homeCart fa fa-shopping-cart pull-right" color={data.color} productcode={data.productCode} availableQuantity={data.availablequantity} onClick={this.addtocart.bind(this)} title="Add to Cart" >
                                                  &nbsp;Add To Cart
                                                </button>
                                                :
                                                <div className="outOfStock">Sold Out</div>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                :null} 
                            </div>   
                                                    
                            );                        
                          })
                          : ''
                      } 	
                    </div>
                     }
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductCarousel;