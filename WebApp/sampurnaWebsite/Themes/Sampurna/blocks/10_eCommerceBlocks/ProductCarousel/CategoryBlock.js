import React,  { useState }   from 'react';
import Image                  from 'next/image';
import {useRouter}            from 'next/router';
import Carousel               from 'react-multi-carousel';
import Style                  from './categoryBlock.module.css';
import Message                from '../../StaticBlocks/Message/Message.js';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1023 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  ipadpro: {
    breakpoint: { max: 1024, min: 768 },
    items: 4,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 769, min: 464 },
    items: 3,
    slidesToSlide: 1 // optional, default to 1.
  },

  responsive: {
    breakpoint: { max: 548, min: 284 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const CategoryBlock = (props)=>{

  const router = useRouter();
  const [categoryurl, setCategoryurl] = useState(router.query.categoryurl);

  return (
    <div className={"container-fluid categoryCarousel " +Style.categoryCarousel}>
      <div className="col-12">
        <div className="col-12">
          <div className="col-12">
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
                // removeArrowOnDeviceType={["mobile"]}
                deviceType={props.deviceType}
                containerClass="carousel-container">
                  {props.categoryData && props.categoryData.map((categorydata, index) => {
                    var activeClass = "";
                    if(categoryurl){
                      if(categoryurl === categorydata.categoryUrl){
                        var activeClass = Style.activeCatg;
                      }else{
                        var activeClass = "";                          
                      }                          
                    }else{
                      if(index === 0){
                        var activeClass = Style.activeCatg;
                      }else{
                        var activeClass = "";
                      }
                    }                        
                    var url = "/products/"+props.vendor_ID+"/"+props.vendorlocation_ID +"/"+props.sectionUrl+"/"+categorydata.categoryUrl;
                    
                    return (
                    <div className={"col-12 productsCategoryBlock px-lg-0 px-xl-2"}  key={index}>
                      <div className={"productListCategoryBlock " + Style.productListCategoryBlock}> 
                          <a href={url} className ={"col-12 " + Style.categoryBlock}>
                            <div className={activeClass + " col-12 itemImg NoPadding category_"+index +" " +Style.categoryPhoto +" " +Style.itemImg +" " }>
                                <img  
                                  id="prodImg"                                       
                                  src={categorydata.categoryImage ? categorydata.categoryImage : "/images/eCommerce/notavailable.png"}
                                  alt="Category" 
                                  className={"img-fluid " +Style.NoAvailableImg +" " +Style.categoryBlockImg }
                                  layout={'intrinsic'}
                                />
                              <div className={"col-12 text-center mt-2 " +Style.categoryName} title={categorydata.category}>{categorydata.category}</div>
                            </div>
                          </a>
                        </div>  
                    </div>                            
                    );
                  })
                }
            </Carousel>
          </div>
        </div>
      </div>
     </div>
  ) 
}

export default CategoryBlock;
