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

class CategorySubCategoryFilters extends Component{
    constructor(props) {
        super(props);
        this.props = { 
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

    render(){
      // console.log("this.props.categoryData===",this.props.categoryData);
      return (
          <div className="panel-group" id="accordion">                      
            <div className={Style.categoryFilterTitle}> Sub Categories </div>  
            {
            this.props.categoryData && this.props.categoryData.map((category,index)=>{
              var i = index+1;
              return(
                <div key={index} className="panelCategory paneldefault">
                  <div className={"panel-heading "+Style.panelHeading}>
                  {category.subCategory && category.subCategory.length?
                    <h4 data-toggle="collapse" data-parent="#accordion" href={"#collapse"+i} className="panel-title expand">
                      <div className="right-arrow pull-right">+</div> 
                      <Link href={"/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.sectionUrl+"/"+category.categoryUrl}>
                        <a >{category.category}</a>
                      </Link>
                    </h4>
                    :
                    <h4  className="panel-title expand"> 
                      <Link href={"/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.sectionUrl+"/"+category.categoryUrl}> 
                          <a >{category.category}</a>
                      </Link>
                    </h4>
                    }
                  </div>
                  {category.subCategory?
                  <div id={"collapse"+i} className="panel-collapse collapse">
                    <div className="panel-body">
                      <ul className={Style.categoryUl}>
                          {category.subCategory && category.subCategory.map((subcategory,index)=>{   
                          return(
                            <li key={index} className={Style.subcategoryLi}>  
                              <Link href={"/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID+"/"+this.props.sectionUrl+"/"+category.categoryUrl+"/"+subcategory.subCategoryUrl}>
                                <a className={"subCategorylia "+Style.subCategorylia}>{subcategory.subCategoryTitle}</a>
                              </Link> 
                            </li>
                          )
                          })
                          }
                        </ul>
                    </div>                                
                  </div>
                  :null
                  }
              </div>
              )
              })                 
            }  
          </div> 
     ) 
    }
}

export default CategorySubCategoryFilters;
