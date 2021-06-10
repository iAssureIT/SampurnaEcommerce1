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
            brandArray   : [],
            vendor_ID    : ''
            
        }
    }
    
    getBrandWiseData(event){
      console.log("brand value ==",event.target.value);
      var brandArray = this.state.brandArray;
      if(event.target.value !== "undefined"){
        var brandValue = event.target.value;
        brandArray.push(brandValue);
      }
      this.setState({
        brandArray : brandArray
      },()=>{
        console.log("brandArray => ",this.state.brandArray)
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
                          <input className=" " type="checkbox" name="brands[]" onChange={this.getBrandWiseData.bind(this)} value={brand} />
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
