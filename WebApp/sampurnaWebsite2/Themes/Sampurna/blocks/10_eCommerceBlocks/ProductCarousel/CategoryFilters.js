import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Carousel               from 'react-multi-carousel';
import style                  from './categoryBlock.module.css';
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

class CategoryFilters extends Component{
    constructor(props) {
        super(props);
        this.props = { 
            categoryData : [],
            // vendor_ID    : ''
            
        }
    }

    componentDidMount(){
      var url = window.location.href.split('/');
      console.log("url[8]===",url[8]);
      if(url[8] === undefined){
        console.log("sucategory===",url[8]);
        $('.panel-title_0').addClass('activeSubCategory');
      }
    }
  componentDidUpdate(prevProps, prevState) {
    // if(this.props.subCategoryUrl){
    //   $('.panel-title').addClass('activeSubCategory');
    // }
  }

    // static getDerivedStateFromProps(nextProps, prevState) {
      // console.log("props--",nextProps);
      // if (nextProps.newProducts) {
        // return ({ 
        //   categoryData: nextProps.categoryData,
        //   vendor_ID   : nextProps.vendor_ID,
        // }) // <- this is setState equivalent
      // }
      // return null
    // }

    render(){
      // console.log("this.props.categoryData===",this.props.categoryData);
      return (
          <div className="panel-group" id="accordion">    
            {this.props.categoryData && this.props.categoryData.length>0?                  
              <div className={Style.categoryFilterTitle}> Sub Categories </div>  
              :null
            }
            {
            this.props.categoryData && this.props.categoryData.map((subcategory,index)=>{
              var i = index+1;
              return(
                <div key={index} className="panelCategory paneldefault ">
                  {this.props.subCategoryUrl === subcategory.subCategoryUrl?
                    <div className={"panel-heading panel-title_"+index +" " +Style.panelHeading}>
                        <h4  className={"panel-title panel-title_"+index} > 
                          <Link href={"/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.sectionUrl+"/"+this.props.categoryUrl+"/"+subcategory.subCategoryUrl}> 
                              <a >{subcategory.subCategoryTitle}</a>
                          </Link>
                        </h4>
                    </div>
                  :
                  <div className={"panel-heading panel-title_"+index +" "+Style.panelHeading}>
                      <h4  className={"panel-title "}> 
                        <Link href={"/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.sectionUrl+"/"+this.props.categoryUrl+"/"+subcategory.subCategoryUrl}> 
                            <a >{subcategory.subCategoryTitle}</a>
                        </Link>
                      </h4>
                  </div>
                  }
                </div>
              )
              })                 
            }  
          </div> 
     ) 
    }
}

export default CategoryFilters;


