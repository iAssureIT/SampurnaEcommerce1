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
      blockTitle         : "Fruits",
      blockApi           : "/api/products/get/list/lowestprice",
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
  render(){
      console.log("serach props===",this.props);
      console.log("searchData=",this.props.searchData);
      console.log("data searchData=",this.props.searchData.data);
      return (
        <div className="row">
          < Header />
          {/* <Message messageData={this.state.messageData} />  */}
          <div className={" container " +Style.mobileViewPadding +" "+Style.productWrapper}> 
            <div className="row">
              { Array.isArray(this.props.searchData.data) && this.props.searchData.data.length > 0 ?
                Array.isArray(this.props.searchData.data) && this.props.searchData.data.map((data, index) => { 
                  console.log("data===",data);               
                  return (
                    <div className={" col-3 " +Style.mobileViewPadding }  key={index}> 
                      {data
                      ?
                        < SingleProduct 
                          data = {data} 
                          productSettings = {this.state.productSettings}
                        />
                      :
                        null
                      }
                    </div>                            
                  );
                })
                :<div className ="text-center">Opps... Sorry... No Products Available</div>
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
