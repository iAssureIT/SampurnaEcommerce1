import React, { Component } from 'react';
import axios    from 'axios';
import Image    from 'next/image';
import $, { data }        from 'jquery';
import { connect }          from 'react-redux';
import {getCartData}        from '../../redux/actions/index.js'; 
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
                  this.getWishData();
            })
          }
        }
    // await this.props.fetchCartData();
  }

  getWishData() {
    // console.log("inside wishlist");
  var formValues ={
    "user_ID"             : this.state.user_ID,
    "userLat"             : this.state.userLongitude, 
    "userLong"            : this.state.userLongitude
  }
    // console.log("formValues=",formValues);

    axios.post('/api/wishlist/get/userwishlist', formValues)    
      .then((response) => {
        if(response){
          // console.log('wishlist data', response.data);
          this.setState({
            wishlistData: response.data
          })
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }

  // removefromwishlist(event) {
  //   event.preventDefault();
  //   var id = event.target.id;
  //   console.log("id", id);
  //   axios.delete('/api/wishlist/delete/' + id)
  //     .then((response) => {
  //       window.scrollTo(0, 0);
  //       console.log('response', response);
  //       this.setState({
  //         products: []
  //       })
  //       this.getData();
  //       this.setState({
  //         messageData: {
  //           "type": "outpage",
  //           "icon": "fa fa-check-circle",
  //           "message": response.data.message,
  //           "class": "success",
  //           "autoDismiss": true
  //         }
  //       })
  //       setTimeout(() => {
  //         this.setState({
  //           messageData: {},
  //         })
  //       }, 3000);
  //     })
  //     .catch((error) => {
  //       console.log('error', error);
  //     })
  // }

  render() {
    return (
      <div>
      <div className={"col-12 " +Style.wishlistProduct}>
        <Message messageData={this.state.messageData} />
          <div className="row">
            <div className={"col-12"}>
              {
                Array.isArray(this.state.wishlistData) && this.state.wishlistData.length > 0 ?
                 this.state.wishlistData.map((areaWiseWishlist, index) => {  
                   return(
                      <div className="col-12" key={index}> 
                          <div className="col-12 areaName mt-4 pb-4">{areaWiseWishlist.areaName}</div>
                          <div className="col-12">
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
                 <div className="col-12 mt15 textAlignCenter"> Wishlist is empty </div>
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
      recentCartData: state.data.recentCartData,
      userWishlistData  : state.data.userWishlistData,
    } 
);
const mapDispatchToProps = {
    fetchCartData: getCartData, 
    // fetchWishlist: getWishlist,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
