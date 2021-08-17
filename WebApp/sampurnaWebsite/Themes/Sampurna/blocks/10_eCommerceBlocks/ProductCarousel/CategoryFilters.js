import React, { Component }   from 'react';
import {useRouter}            from 'next/router';
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

const CategoryFilters = (props)=>{

      const router = useRouter();

      return (
        <section>
          <div className="panel-group d-none d-lg-block d-xl-block" id="accordion">    
            {props.categoryData && props.categoryData.length>0
              ?                  
                <div className={Style.categoryFilterTitle}> Sub Categories </div>  
              : null
            }
            {
              props.categoryData && props.categoryData.map((subcategory,index)=>{
              var i = index+1;

              if(props.subCategoryUrl){
                if(props.subCategoryUrl === subcategory.subCategoryUrl){
                  var activeClass = Style.activeSubCategory;
                }else{
                  var activeClass = "";
                }                
              }else{
                if(index === 0){
                  var activeClass = Style.activeSubCategory;
                }else{
                  var activeClass = "";
                }                
              }

              return(
                <div key={index} className="panelCategory paneldefault ">
                      <div className={"panel-heading panel-title_"+index +" " +Style.panelHeading+" "+activeClass}>
                          <h4  className={"panel-title panel-title_"+index} > 
                             <a href={"/products/"+props.vendor_ID+"/"+props.vendorlocation_ID+"/"+props.sectionUrl+"/"+props.categoryUrl+"/"+subcategory.subCategoryUrl}> 
                                {subcategory.subCategoryTitle}
                            </a>
                          </h4>
                      </div>                  
                </div>
              )
              })                 
            }  
          </div> 

          
          <nav className="navbar navbar-expand-lg navbar-light bg-light d-block d-lg-none d-xl-none">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
              &nbsp; &nbsp;&nbsp;Sub Categories
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <div className="panel-group" id="accordion">    
                        {
                          props.categoryData && props.categoryData.map((subcategory,index)=>{
                          var i = index+1;
                          if(props.subCategoryUrl === subcategory.subCategoryUrl){
                            var activeClass = Style.activeSubCategory;
                          }else{
                            var activeClass = "";
                          }

                          return(
                            <div key={index} className="panelCategory paneldefault ">
                                <div className={"panel-heading panel-title_"+index +" " +Style.panelHeading}>
                                    <h4  className={"panel-title panel-title_"+index} > 
                                      <a href={"/products/"+props.vendor_ID+"/"+props.vendorlocation_ID+"/"+props.sectionUrl+"/"+props.categoryUrl+"/"+subcategory.subCategoryUrl}> 
                                          {subcategory.subCategoryTitle}
                                      </a>
                                    </h4>
                                </div>
                            </div>
                          )
                          })                 
                        }  
              </div>  
            </div>
          </nav>
        </section>
      )

}

export default CategoryFilters;


