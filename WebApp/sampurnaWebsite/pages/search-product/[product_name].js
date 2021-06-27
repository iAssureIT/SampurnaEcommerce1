import React, { Component } from 'react';
import Head                 from 'next/head';
import axios                from 'axios';
import {connect}            from 'react-redux';
import store                from '../../redux/store.js';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import SingleProduct        from '../../Themes/Sampurna/blocks/StaticBlocks/SingleProduct/SingleProduct.js';
import Style                from './index.module.css';
import getConfig            from 'next/config';
const { publicRuntimeConfig } = getConfig();

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
    blockSettings        : {
      blockTitle         : "",
      blockApi           : "",
      noOfProductPerLGRow: 4,
      noOfProductPerMDRow: 4,
      noOfProductPerSMRow: 4,
      noOfProductPerXSRow: 2,
      showCarousel       : true,
      totalProducts      : 12,
      leftSideFilters    : false
    }, 
    }
  }
  componentDidMount(){
    var url = window.location.href.split('/');
    // console.log("url==",url[4]);
    if(url){
        this.setState({"searchProduct": url[4]},()=>{
          console.log("searchProduct=",this.state.searchProduct);
        })
    }
    var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails        =  JSON.parse(localStorage.getItem('userDetails'));
        if( userDetails && userDetails.user_id){
            this.setState({user_ID : userDetails.user_id})
        }
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
            }
        }
  }
  render(){
      // console.log("serach props===",this.props);
      // console.log("searchData=",this.props.searchData);
      // console.log("data searchData=",this.props.searchData.data);
      return (
        <div className="row">
          < Header />
          {/* <Message messageData={this.state.messageData} />  */}
          <div className={" container mt-5 "+Style.searchProductWrapper}> 
            <div className="row">
              {this.props.searchData.data ?
                <div className="row">
                  <div className="col-12 text-center mb-5">{ this.props.searchData.data.length +" Results for " +"'"+this.state.searchProduct +"'"}</div>
                  { Array.isArray(this.props.searchData.data) && this.props.searchData.data.length > 0 ?
                    Array.isArray(this.props.searchData.data) && this.props.searchData.data.map((data, index) => {            
                      return (
                        <div className={" col-3 "}  key={index}> 
                          {data
                          ?
                            < SingleProduct 
                              data = {data} 
                              productSettings = {this.state.productSettings}
                              userLatitude    = {this.state.latitude}
                              userLongitude   = {this.state.longitude}
                              user_ID         = {this.state.user_ID}
                              // vendorlocation_ID = ''
                            />
                          :
                            null
                          }
                        </div>                            
                      );
                    })
                  :null}
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
    searchData : state.data.searchProducts
  }
);

const mapDispatchToProps = {
  // setBlockData: setBlockData,
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchProduct);
