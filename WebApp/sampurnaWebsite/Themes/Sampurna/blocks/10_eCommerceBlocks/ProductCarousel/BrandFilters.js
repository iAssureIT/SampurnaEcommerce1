import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Carousel               from 'react-multi-carousel';
import Message                from '../../StaticBlocks/Message/Message.js';
import Style                  from './ProductCarousel.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import {getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

class BrandFilters extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            categoryData : [],
            vendor_ID    : ''
            
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      // console.log("props--",nextProps);
      if (nextProps.newProducts) {
        // return ({ 
        //   categoryData: nextProps.categoryData,
        //   vendor_ID   : nextProps.vendor_ID,
        // }) // <- this is setState equivalent
      }
      return null
    }
    onSelectedItemsChange = effect => {
        this.setState({ effect });
        var brand = effect.value;   
        var formValues = {
          "vendor_ID"      : "",
          "sectionUrl"     : this.props.blockSettings.section? (this.props.blockSettings.section.replace(/\s/g, '-').toLowerCase()):null,
          "categoryUrl"    : this.props.blockSettings.category === "all" ? "" : this.props.blockSettings.category.replace(/\s/g, '-').toLowerCase(),
          "subCategoryUrl" : this.props.blockSettings.subCategory !== "all"?[this.props.blockSettings.subCategory.replace(/\s/g, '-').toLowerCase()]:[],
          "userLatitude"   : this.props.userLatitude,
          "userLongitude"  : this.props.userLongitude,
          "startRange"     : this.props.startRange,
          "limitRange"     : this.props.limitRange,
          "sortProductBy"  : '',
          "brand"          : brand, 
        }
        if(!this.props.blockSettings.showCarousel && this.state.filterSettings){
          var productApiUrl = this.props.productApiUrl;
          // console.log("productlist productApiUrl===",productApiUrl);
        }else if(!this.props.blockSettings.showCarousel && !this.state.filterSettings){
          var productApiUrl = this.props.productApiUrl;
          // console.log("productApiUrl===",productApiUrl);
        }else{ 
            var productApiUrl = this.props.blockSettings.blockApi;
            // console.log("productApiUrl===",productApiUrl);
        }
        if(formValues){
          this.getProductList(productApiUrl,formValues);
        }
      };

      getProductList(productApiUrl,formValues){
        // console.log("productApiUrl=>",productApiUrl);
        axios.post(productApiUrl,formValues)     
        .then((response)=>{
          if(response.data){     
          // console.log("response.data in product carousel===",response.data);       
          if(this.state.websiteModel === "FranchiseModel"){
            for(var i=0;i<response.data.length;i++){       
                var availableSizes = [];         
                if(response.data[i].size){              
                  availableSizes.push(response.data[i].size*1);
                  availableSizes.push(response.data[i].size*2);
                  availableSizes.push(response.data[i].size*4); 
                  response.data[i].availableSizes = availableSizes;           
                }
            }
          } 
          this.setState({
            newProducts     : response.data,                          
          },()=>{
            // console.log("newProducts=>",this.state.newProducts);
            if(this.state.newProducts.length>0){
              this.setState({
                ProductsLoading : true,
                loading         : false
              });  
            }
          });
        }
        })
        .catch((error)=>{
            console.log('error', error);
        })
      }
    
    render(){
      // console.log("this.props.categoryData===",this.props.brandData);
      return (
        <div className="panel-group" id="accordion">                      
            <div className={Style.categoryFilterTitle}> Brand </div>  
            {
            this.props.brandData && this.props.brandData.length > 0?
            this.props.brandData.map((brand,index)=>{
            var i = index+1;
            return(
                <div className="col-12 noPadding panelCategory paneldefault" key={index}>
                    <div className={"row panel-heading "+Style.panelHeading}>
                        <div className=" col-1 NoPadding centreDetailContainerEcommerce">
                        <input className=" " type="checkbox" name="brands[]" onChange={this.onSelectedItemsChange.bind(this)} value={brand} />
                        </div>
                        <span className="col-11 centreDetaillistItemEcommerce">{brand}</span>
                    </div>                              
                </div>
            )
            })   
            :''
            }
        </div>  
     ) 
    }
}

export default BrandFilters;
