import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Carousel               from 'react-multi-carousel';
import Style                  from './SubCategoryBlock.module.css';

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

class SubCategoryBlock extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            categoryData : [],
            vendor_ID    : ''
        }
    }
    render(){
      // console.log("Subcategory Blocks ====",this.props.subCategoryData);
      return (
        <div className={"col-12 " +Style.categoryCarousel}>
            <div className={"col-12 "}>
                <h5>{this.props.blocktitle}</h5>
            </div>
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
              containerClass="carousel-container"
            >

                    {this.props.subCategoryData && this.props.subCategoryData.map((categorydata, index) => {
                        var url = "/products/"+this.props.vendor_ID+"/"+this.props.vendorlocation_ID +"/"+this.props.sectionUrl+"/"+this.props.categoryUrl+"/"+categorydata.subCategoryUrl;
                        return (
                          <div className={"col-12 productsCategoryBlock " +Style.outerBox}  key={index}> 
                              <Link href={url} className ={"col-12 "}> 
                                <a className ={"col-12 " +Style.categoryBlock}>
                                  <div className={"itemImg col-12 NoPadding " +Style.categoryPhoto +" "+Style.itemImg}>
                                      <Image                                           
                                        src={categorydata.subCategoryImage ? categorydata.subCategoryImage : "/images/eCommerce/notavailable.png"}
                                        alt="ProductImg" 
                                        className={"img-responsive " +Style.itemImg }
                                        height={100}
                                        width={100} 
                                        layout={'intrinsic'}
                                      />
                                      <div className={"col-12 text-center " +Style.categoryName} title={categorydata.subCategoryTitle}>{categorydata.subCategoryTitle}</div>
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

export default SubCategoryBlock;
