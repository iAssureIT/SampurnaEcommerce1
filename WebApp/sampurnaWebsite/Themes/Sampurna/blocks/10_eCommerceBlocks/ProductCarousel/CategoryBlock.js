import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Carousel               from 'react-multi-carousel';
import Style                  from './categoryBlock.module.css';
import Message                from '../../StaticBlocks/Message/Message.js';
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

class CategoryBlock extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            categoryData : [],
            vendor_ID    : ''
            
        }
    }

    //static getDerivedStateFromProps(nextProps, prevState) {
      // console.log("props--",nextProps);
      //if (nextProps.newProducts) {
        // return ({ 
        //   categoryData: nextProps.categoryData,
        //   vendor_ID   : nextProps.vendor_ID,
        // }) // <- this is setState equivalent
      //}
      //return null
    //}

    render(){
      // console.log("props category ====",this.props.categoryData);
      return (
        <div className={"container NoPadding " +Style.categoryCarousel}>
            <Carousel 
              className=""
                  swipeable={true}
                  draggable={true}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={false}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  customTransition="all .20"
                  transitionDuration={500}                      
                  removeArrowOnDeviceType={["mobile"]}
                  deviceType={this.props.deviceType}  
                  containerClass="carousel-container">
                    {this.props.categoryData && this.props.categoryData.map((categorydata, index) => {
                      var url = "/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID +"/"+this.props.sectionUrl+"/"+categorydata.categoryUrl;
                      return (
                      <div className="col-12 productsCategoryBlock "  key={index}> 
                          <Link href={url} className ={"col-12 "}> 
                            <a className ={"col-12 " +Style.categoryBlock}>
                              <div className={"itemImg col-12 NoPadding " +Style.categoryPhoto +" "+Style.itemImg}>
                                  <Image                                           
                                    src={categorydata.categoryImage ? categorydata.categoryImage : "/images/eCommerce/notavailable.jpg"}
                                    alt="ProductImg" 
                                    className={"img-responsive " +Style.NoAvailableImg }
                                    height={90}
                                    width={100} 
                                    layout={'intrinsic'}
                                  />
                              <div className={"col-12 text-center mt-2 " +Style.categoryName} title={categorydata.category}>{categorydata.category}</div>

                              </div>
                            </a>
                          </Link>
                      </div>                            
                      );
                    })
                  }
              </Carousel>
          </div>
     ) 
    }
}

export default CategoryBlock;
