import React, { Component } from 'react';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../actions/index';
import Loadable from 'react-loadable';
import axios from 'axios';
import { connect } from 'react-redux';
import "../../../sites/currentSite/blocks/EcommerceProductCarousel.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductDetailsHomeView from "../../pages/ProductDetailsEcommerce/ProductDetailsHomeView.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import Message from '../Message/Message.js';
const OwlCarousel = Loadable({
  loader: () => import('react-owl-carousel'),
  loading() {
    return <div className="col-sm-12 col-xs-12 col-lg-2 col-lg-offset-5 col-md-12 loadingImg"><img src="../images/loadersglms.gif" className="img-responsive" alt="loading" /></div>
  }
});

const user_ID = localStorage.getItem("user_ID");
class EcommerceProductCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 5
        }
      },
      responsive2: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 4
        }
      },
      productType: props.type,
      newProducts: [],
      modalIDNew: [],
      sizeCollage: false,
      relatedProductArray: []
    };
  }

  componentDidMount() {

  }
  
  addtocart(event) {
    event.preventDefault();
    var productCode = event.target.getAttribute('productCode');
    var clr = event.target.getAttribute('color');

    if (user_ID) {
      var id = event.target.id;
      const userid = localStorage.getItem('user_ID');
      var availableQuantity = event.target.getAttribute('availableQuantity');
      var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
      var productCartData = recentCartData.filter((a) => a.product_ID === id);
      var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;

      const formValues = {
        "user_ID": userid,
        "product_ID": event.target.id,
        "quantity": 1,
      }
      // this.getProductData(productCode, clr);
      axios.get("/api/products/get/productcode/" + productCode)
        .then((response) => {
          console.log('getProductData', response.data);
          let mymap = new Map();
          var colorFilter = response.data.filter(x => {
            return x.color === clr && x.availableQuantity > 0
          });
          var unique = colorFilter.filter(el => {
            const val = mymap.get(el.size);
            if (val) {
              if (el._id < val) {
                mymap.delete(el.size);
                mymap.set(el.size, el._id);
                return true;
              } else {
                return false;
              }
            }
            mymap.set(el.size, el._id);
            return true;
          });
          this.setState({
            ['relatedProductArray' + id]: unique
          })
          console.log('unique', unique);
          if (unique.length > 0) {
            if (unique.length === 1) {
              if (unique[0].size) {
                this.setState({
                  ['sizeCollage' + id]: true
                })
              } else {
                this.addCart(formValues, quantityAdded, availableQuantity);
              }
            } else if (unique.length > 1) {
              this.setState({
                ['sizeCollage' + id]: true
              })
            } else {
              this.addCart(formValues, quantityAdded, availableQuantity);
            }
          } else {
            this.addCart(formValues, quantityAdded, availableQuantity);
          }
        })
        .catch((error) => {
          console.log('error', error);
        })
    } else {
      this.setState({
        messageData: {
          "type": "outpage",
          "icon": "fa fa-exclamation-circle",
          "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "class": "danger",
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
      }, 3000);
    } else {
      axios.post('/api/carts/post', formValues)
        .then((response) => {
          this.props.fetchCartData();
          this.setState({
            messageData:{
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
          this.props.changeCartCount(response.data.cartCount);

        })
        .catch((error) => {
          console.log('error', error);
        })
    }
  }
  submitCart(event) {
    var id = event.target.id;
    const userid = localStorage.getItem('user_ID');
    var availableQuantity = event.target.getAttribute('availableQuantity');
    var currProId = event.target.getAttribute('currPro');
    var recentCartData = this.props.recentCartData.length > 0 ? this.props.recentCartData[0].cartItems : [];
    var productCartData = recentCartData.filter((a) => a.product_ID === id);
    var quantityAdded = productCartData.length > 0 ? productCartData[0].quantity : 0;

    const formValues = {
      "user_ID": userid,
      "product_ID": event.target.id,
      "quantity": 1,
    }
    this.addCart(formValues, quantityAdded, availableQuantity);
    this.setState({
      ['sizeCollage' + currProId]: false
    })
  }
  closeSize(event) {
    var id = event.target.id;
    this.setState({
      ['sizeCollage' + id]: false
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      newProducts: nextProps.newProducts,
      type: nextProps.type
    })
  }

  addtowishlist(event) {
    event.preventDefault();
    if (user_ID) {
      
      var id = event.target.id;
      const userid = localStorage.getItem('user_ID');
      const formValues =
      {
        "user_ID": userid,
        "product_ID": id,
      }
      axios.post('/api/wishlist/post', formValues)
        .then((response) => {
          // console.log('res', response.data.message);
          this.setState({
            messageData : {
              "type" : "outpage",
              "icon" : "fa fa-check-circle",
              "message" : "&nbsp; "+response.data.message,
              "class": "success",
              "autoDismiss" : true
            }
          })
          setTimeout(() => {
            this.setState({
                messageData   : {},
            })
        }, 3000);
        this.props.getWishData();
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      this.setState({
        messageData : {
          "type" : "outpage",
          "icon" : "fa fa-exclamation-circle",
          "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "class": "warning",
          "autoDismiss" : true
        }
      })
      setTimeout(() => {
        this.setState({
            messageData   : {},
        })
    }, 3000);
    }
  }
  getCategoryID(event) {
    event.preventDefault();
    // var id = event.target.id;
  }
  openModal(event) {
    event.preventDefault();
    var modalID = event.target.id;
    this.setState({
      modalIDNew: { productID: modalID, productType: this.state.productType }
    })
  }
  Closepagealert(event) {
    event.preventDefault();
    $(".toast-error").html('');
    $(".toast-success").html('');
    $(".toast-info").html('');
    $(".toast-warning").html('');
    $(".toast-error").removeClass('toast');
    $(".toast-success").removeClass('toast');
    $(".toast-info").removeClass('toast');
    $(".toast-warning").removeClass('toast');

  }
  render() {
    // const token = localStorage.getItem("user_ID");
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20" id="flashsalediv">
        <div className="row">
          <Message messageData={this.state.messageData} />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productcomponentheading text-center">
              <div className="producttextclass  col-lg-2">
                <h3 className="row">
                  <b>{this.props.title}</b>
                </h3>
              </div>
              
              {/* <div className="col-lg-5 producttimer producttimerposition">
                <OwlCarousel
                  className="owl-theme customnNavButtoncaro1"
                  margin={0}
                  nav={true}
                  responsive={this.state.responsive2}
                  autoplay={true}
                  autoplayHoverPause={true}
                >
                  {
                    this.props.categories && this.props.categories.length > 0 ?
                      this.props.categories.map((data, index) => {
                        return (
                          <div className="item" key={index}>
                            <span className="col-lg-12 row  productcarotext1" id={data._id} onClick={this.getCategoryID.bind(this)}>{data.category}</span>//
                          </div>
                        );
                      })
                      :
                      null
                  }
                </OwlCarousel>
              </div> */}
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
          <div className="tab-content customTabContent">
            <div id="home" className="tab-pane fade in active ecommerceTabContent">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt50">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <OwlCarousel
                    className="owl-theme customnNavButton"
                    margin={0}
                    nav={true}
                    responsive={this.state.responsive}
                    autoplay={true}
                    autoplayHoverPause={true}
                  >
                    {
                      this.state.newProducts && this.state.newProducts.length > 0 ?
                        this.state.newProducts.map((data, index) => {
                          var x = this.props.wishList && this.props.wishList.length > 0 ? this.props.wishList.filter((abc) => abc.product_ID === data._id) : [];
                           var wishClass = '';
                            var tooltipMsg = '';
                          if(x && x.length > 0){
                             wishClass = '';
                             tooltipMsg = 'Remove from wishlist';
                          }else{
                             wishClass = '-o';
                             tooltipMsg = 'Add To Wishlist';
                          }
                          return (
                            <div className="item col-lg-12 col-md-12 col-sm-12 col-xs-12" key={index}>
                              <a href="">
                                <div className="">
                                  <div className="card">
                                    <div className="item-top">
                                      <div className="productImg">
                                        <button type="submit" id={data._id} title={tooltipMsg} className={"wishIcon fa fa-heart"+wishClass} onClick={this.addtowishlist.bind(this)}></button>
                                        {data.discountPercent ? <div className=" discounttag">{data.discountPercent} % </div> : null} 
                                        <a href={"/productdetails/"+data.productUrl+"/" + data._id} className="product photo product-item-photo" tabIndex="-1">
                                          <img src={data.productImage[0] ? data.productImage[0] : '/images/notavailable.jpg'} />
                                        </a>
                                      </div>
                                      <div className="productDetails">
                                      {
                                        this.state['sizeCollage' + data._id] === true ?
                                          <div className="sizeCollage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <i className="fa fa-times pull-right" id={data._id} onClick={this.closeSize.bind(this)}></i>
                                            {
                                              this.state['relatedProductArray' + data._id] && this.state['relatedProductArray' + data._id].length > 0 ?
                                                this.state['relatedProductArray' + data._id].map((a, i) => {
                                                  if (a.size) {
                                                    return (
                                                      <span>
                                                        <label className="collageSize">
                                                          <input title="Please select size first." currPro={data._id} availableQuantity={a.availableQuantity} onClick={this.submitCart.bind(this)} value={a.size} name="size" type="radio" id={a._id} />
                                                          <span title={a.size} className="collageCheck">{a.size}</span>
                                                        </label> &nbsp;
                                                      </span>
                                                    );
                                                  }
                                                })
                                                :
                                                null
                                            }
                                          </div>
                                          :
                                          null
                                      }
                                        <div className="innerDiv">
                                        <a href={"/productdetails/"+data.productUrl+"/" + data._id}><div className="product-brand" title={data.brand}>{data.brand}</div></a>
                                          <a href={"/productdetails/"+data.productUrl+"/" + data._id}><div className="product-item-link" title={data.productName}>{data.productName}</div></a>
                                          
                                          <a href={"/productdetails/"+data.productUrl+"/" + data._id}><div className="col-lg-12 col-md-12 NOpadding">
                                            {
                                              data.discountPercent ?
                                                <div className="col-lg-12 col-md-12 NOpadding">
                                                  
                                                  <span className="oldprice"><i className="fa fa-inr oldprice"></i>&nbsp;{data.originalPrice}</span>  &nbsp; 
                                                  <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span>
                                                </div>
                                                :
                                                <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.originalPrice}</span>
                                            }
                                          </div></a>
                                          {/* <div className="product-reviews-summary">
                                            <div className="col-lg-3 col-md-3 product-reviews-summary ratebox">4.4 &nbsp;<i class="fa fa-star"></i></div>
                                          </div> */}
                                          <div >
                                          </div>
                                          {
                                              data.availableQuantity > 0 ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                  <button type="submit" color={data.color} productCode={data.productCode} id={data._id} availableQuantity={data.availableQuantity} 
                                                      onClick={this.addtocart.bind(this)} title="Add to Cart"
                                                      className="homeCart fa fa-shopping-cart">
                                                      &nbsp;Add To Cart
                                                  </button>
                                                </div>
                                              </div>
                                              :
                                              
                                              <div className="outOfStock col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Sold Out</div>
                                            }
                                            
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                          );
                        })
                        : ''
                    }
                  </OwlCarousel>
                </div>
                <div className="modal " id={"productviewmodal" + this.state.productType} role="dialog">
                  <div className="modal-dialog modal-lg dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <img src="/images/Icon.png" alt="" />
                        <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title modalheadingcont"> </h4>
                      </div>
                      <div className="modal-body">
                        <ProductDetailsHomeView productInfo={this.state.modalIDNew} />
                      </div>
                      <div className="modal-footer">
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
  }
}
const mapStateToProps = (state) => {
  return {
    recentCartData :  state.recentCartData
  }
}
const mapDispachToProps = (dispatch) => {
  return  bindActionCreators({ fetchCartData: getCartData }, dispatch)
}
export default connect(mapStateToProps, mapDispachToProps)(EcommerceProductCarousel);