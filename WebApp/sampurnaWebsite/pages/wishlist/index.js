import React, { Component } from 'react';
import axios                from 'axios';
import Image                from 'next/image';
import $, { data }          from 'jquery';
import { connect }          from 'react-redux';
import {getCartData, getWishlist,getWishlistData}        from '../../redux/actions/index.js'; 
import  store               from '../../redux/store.js'; 
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import ProductListView      from '../../Themes/Sampurna/blocks/StaticBlocks/ProductListView/ProductListView.js';
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
    // $(window).scrollTop(0);
    window.scroll(0,0);
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
    if(sampurnaWebsiteDetails.deliveryLocation){
      this.setState({
          userLongitude : sampurnaWebsiteDetails.deliveryLocation.latitude,
          userLongitude : sampurnaWebsiteDetails.deliveryLocation.longitude,
      },()=>{
        // console.log("userLongitude=",this.state.userLongitude);
        // console.log("userLongitude=",this.state.userLongitude);
      })
    }  

    var userDetails     =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
          if(userDetails.user_id){
            this.setState({
              user_ID :  userDetails.user_id,
            },()=>{
                  this.props.getWishlistData();
                  this.props.fetchWishlist();
            })
          }
        }
    // await this.props.fetchCartData();
  }

  render() {
    // console.log("recentWishlistData==",this.props.recentWishlistData);
    return (
      <div className="col-12 pt-4 mt-lg-3 pl-lg-3 mt-xl-0 pl-xl-3 pl-0">
      <div className={"col-12 px-xl-0 px-lg-0 px-md-0 px-0 " +Style.wishlistProduct} id="WishlistMainId">
        <Message messageData={this.state.messageData} />
          <div className="row">
            <div className={"col-12 NoPadding"}>
              <div className="col-12 table-caption">
                  <div className="col-12 pl-lg-0 pl-md-0">
                    <span className="table-caption wishListMainTitle pb-xl-3 pl-xl-0 pb-md-2 pb-lg-2 pb-3"> My Wishlist</span>
                  </div>
              </div>
              {
                Array.isArray(this.props.recentWishlistData) && this.props.recentWishlistData.length > 0 ?
                this.props.recentWishlistData.map((areaWiseWishlist, index) => {  
                   return(
                      <div className="col-12 mb-4" key={index}> 
                          <div className="col-12 areaName mt-lg-1 mt-4 pb-3 pb-xl-2 pl-lg-0 mt-md-0"><i className="fas fa-map-marker-alt" aria-hidden="true"></i>    &nbsp;&nbsp;{areaWiseWishlist.areaName}</div>

                          <div className={"col-12 pt-4 "+Style.wishlistBlockBorder}>

                                {areaWiseWishlist && areaWiseWishlist.products && areaWiseWishlist.products.length > 0
                                ?
                                  <ProductListView 
                                      newProducts       = {areaWiseWishlist.products}
                                      distance          = {areaWiseWishlist.distance}
                                      maxDistanceRadius = {areaWiseWishlist.maxDistanceRadius}
                                  />
                                :
                                  null
                                }
                          </div>
                      </div>
                   )
                 })
                 :
                 <div className="col-5 mt-2 mx-auto textAlignCenter"> 
                        <img                                           
                          src={"/images/eCommerce/EmptyWishlist.png"}
                          alt="ProductImg" 
                          className={"col-12 img-fluid "}
                          layout={'intrinsic'}
                        />
                 </div>
              }
            </div>          
          </div>
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
    {
      recentCartData      : state.data.recentCartData,
      recentWishlistData  : state.data.recentWishlistData,
      recentWishlist      : state.data.recentWishlist,
    } 
);
const mapDispatchToProps = {
    fetchCartData: getCartData, 
    fetchWishlist: getWishlist,
    getWishlistData: getWishlistData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
