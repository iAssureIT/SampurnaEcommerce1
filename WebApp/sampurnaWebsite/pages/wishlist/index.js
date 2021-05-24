import React, { Component } from 'react';
import axios    from 'axios';
import Image    from 'next/image';
import $        from 'jquery';
import { connect }          from 'react-redux';

import {getCartData}        from '../../redux/actions/index.js'; 
import  store               from '../../redux/store.js'; 

import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import Style                from '../../Themes/Sampurna/blocks/10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';


class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: {
        title: "MY WISHLIST",
        breadcrumb: 'My Wishlist',
        backgroungImage: '/images/eCommerce/cartBanner.png',
      },
      wishlist: [],
      products: [],
      abc: [],
      quantity: 1
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  async componentDidMount() {
    const websiteModel = localStorage.getItem("websiteModel");
    const showLoginAs = localStorage.getItem("showLoginAs");
    this.setState({
         showLoginAs: showLoginAs, 
         websiteModel: websiteModel,
         user_ID     : localStorage.getItem("user_ID")
     },()=>{
        this.getData();
     });
    await this.props.fetchCartData();
  }

  getData() {
    $('.fullpageloader').show();
    axios.get('/api/wishlist/get/userwishlist/' + this.state.user_ID)    
      .then((response) => {
        $('.fullpageloader').hide();
        // console.log('wishlist', response);
        this.setState({
          products: response.data
        },()=>{
              // console.log("Wislist products===",this.state.products);
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  addtocart(event) {
    event.preventDefault();
    $('.fullpageloader').show();
    // const user_ID = localStorage.getItem("user_ID");
    var wishlist_ID = event.target.getAttribute('wishid');

    if (this.state.user_ID) {

      var id = event.target.getAttribute('id');
      // console.log('id', id);
      axios.get('/api/products/get/one/' + id)
        .then((response) => {
          var totalForQantity = parseInt(1 * response.data.discountedPrice);
        //   const userid = localStorage.getItem('user_ID');

          const formValues = {
            "user_ID": this.state.user_ID,
            "product_ID": response.data._id,
            "currency": response.data.currency,
            "productCode": response.data.productCode,
            "productName": response.data.productName,
            "section_ID": response.data.section_ID,
            "section": response.data.section,
            "category_ID": response.data.category_ID,
            "category": response.data.category,
            "subCategory_ID": response.data.subCategory_ID,
            "subCategory": response.data.subCategory,
            "productImage": response.data.productImage,
            "quantity": 1,
            "discountedPrice": parseInt(response.data.discountedPrice),
            "originalPrice": parseInt(response.data.originalPrice),
            "discountPercent": parseInt(response.data.discountPercent),
            "totalForQantity": totalForQantity,

          }
          axios.post('/api/carts/post', formValues)
            .then((response) => {
              this.props.fetchCartData();
              $('.fullpageloader').hide();
              this.setState({
                messageData: {
                  "type": "outpage",
                  "icon": "fa fa-check-circle",
                  "message": response.data.message,
                  "class": "success",
                  "autoDismiss": true
                }
              })
              setTimeout(() => {
                this.setState({
                  messageData: {},
                })
              }, 3000);

              axios.delete('/api/wishlist/delete/' + wishlist_ID)
                .then((response) => {
                  this.setState({
                    products: []
                  })
                  this.getData();
                })
                .catch((error) => {
                  console.log('error', error);
                })


            })
            .catch((error) => {
              console.log('error', error);
            })
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      this.setState({
        messageData: {
          "type": "outpage",
          "icon": "fa fa-times-circle",
          // "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "message": this.state.showLoginAs === "modal" ? "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First." : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
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

  removefromwishlist(event) {
    event.preventDefault();
    var id = event.target.id;
    console.log("id", id);
    axios.delete('/api/wishlist/delete/' + id)
      .then((response) => {
        window.scrollTo(0, 0);
        console.log('response', response);
        this.setState({
          products: []
        })
        this.getData();
        this.setState({
          messageData: {
            "type": "outpage",
            "icon": "fa fa-check-circle",
            "message": response.data.message,
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

    return (
      <div>
        <Header />      
      <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding abc" +Style.wishlistProduct}>
        <Message messageData={this.state.messageData} />
        <SmallBanner bannerData={this.state.bannerData} />

        <div className="container">
          <br />
          <div className="row">
          <div className={"col-12 col-lg-3"}>
            <div className="row">
              <Sidebar />
            </div>
          </div>
          <div className={"col-12 col-sm-9 NOpadding"}>
            <br />
            <br />
            <div className="col-12 row">
            {
              this.state.products && this.state.products.length > 0 ?
                this.state.products.map((data, index) => {
                  return (
                      <div className={"col-12 col-lg-4"} key={index}>
                      <div className={Style.item +" "+Style.productBlock +" " +Style.productInnerWrap +"  col-lg-12 col-md-12 col-sm-12 col-xs-12"}>
                        <div className="">
                          <div className="card card1">
                          <div className={" col-12 NoPadding "}>
                          <div className={"col-12 NoPadding " +Style.productImg +" " +Style.NoPadding}>
                               <div className="col-12 NoPadding wishlistBtnWrap">
                                  <span title="Delete" id={data.wishlist_ID} onClick={this.removefromwishlist.bind(this)} className={"wishRemove fa fa-trash"}></span>
                                  {data.discountPercent ? <div className={"col-3 " +Style.discounttag}>{Math.floor(data.discountPercent)} % </div> : null} 
                                </div>
                                <a className={Style.product_item_photo +" " +Style.noAvailableImg} tabIndex="-1" href={"/product-detail/" + data.productUrl + "/" + data.product_ID}>                                  
                                  <Image                                          
                                    src={data.productImage[0] ? data.productImage[0] : "/images/eCommerce/notavailable.jpg"}
                                    alt="ProductImg" 
                                    className={"img-responsive" +Style.NoAvailableImg }
                                    height={150}
                                    width={130} 
                                  />
                                </a>
                              </div>
                              <div className={Style.productDetails +" col-12 NoPadding " +Style.NoPadding}>   
                              <div className={"col-12 " +Style.innerDiv}>
                              {data.brandNameRlang?
                                <div className={"col-12 globalProduct_brand RegionalFont "} title={data.brandNameRlang}>{data.brandNameRlang}</div>
                                :
                                  <div className={"col-12 globalProduct_brand"} title={data.brand}>{data.brand}</div>
                              }
                              {data.productNameRlang?
                                <div className={"col-12 globalProductItemName NoPadding RegionalFont "+Style.NoPadding } title={data.productNameRlang}>
                                  <span className={"RegionalFont "+ Style.ellipsis +" " +Style.globalProdName}>{data.productNameRlang} </span>&nbsp;                                        
                                </div>
                                :
                                <div className={"col-12 globalProductItemName NoPadding "+Style.NoPadding } title={data.productName}>
                                <span className={ Style.ellipsis +" " +Style.globalProdName}>{data.productName} </span>&nbsp;</div>
                              }
                              <div className={"col-12 globalProduct_brand" +Style.product_brand} title={data.brand}></div>
                              <div className="col-12 NOpadding">
                                {
                                  data.discountPercent ?
                                    <div className="col-12 NOpadding">
                                      <span className={Style.oldprice}><i className="fa fa-inr oldprice"></i>&nbsp;{data.originalPrice}</span> &nbsp;
                                      <span className={Style.price}><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span>
                                    </div>
                                    :
                                    <span className={Style.price}><i className="fa fa-inr"></i>&nbsp;{data.originalPrice}</span>
                                }
                              </div>
                              
                                  {
                                    data.availableQuantity > 0 ?
                                      <div className="col-12 NOpadding">
                                        <div className="col-12 col-md-6 offset-md-3 col-lg-8 offset-lg-2 NOpadding">
                                          <button type="submit" id={data.product_ID} wishid={data.wishlist_ID} onClick={this.addtocart.bind(this)} title="Move to Cart" className="homeCart globalAddToCartBtn fa fa-shopping-cart col-12">
                                            &nbsp;Move to Cart
                                          </button>
                                        </div>
                                      </div>
                                      :
                                      <div className="col-12 NOpadding">
                                        <div className="col-12 NOpadding">
                                          <div className="outOfStock">Sold Out</div>
                                        </div>
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
                })
                :
                <div className="col-12">
                  <div className="alert alert-warning textAlignCenter col-12 mt25">
                    <i className="fa fa-exclamation-circle"></i>&nbsp;  You have no items in your wish list.
                  </div>
                  <a href="/" className="pull-right mt15 wishBack">Back</a>
                </div>
            }
            </div>

          </div>          
          </div>
        </div>
      </div>
    <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => (
    // console.log("state in wishlist====",state.data),
    {
      recentCartData: state.data.recentCartData,
    } 
);
const mapDispatchToProps = {
    fetchCartData: getCartData, 
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
