import React,  { useState }   from 'react';
import Image                  from 'next/image';
import {useRouter}            from 'next/router';
import Carousel               from 'react-multi-carousel';
import Style                  from './categoryBlock.module.css';
import Message                from '../../StaticBlocks/Message/Message.js';

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

const CategoryBlock = (props)=>{

  const router = useRouter();
  const [categoryurl, setCategoryurl] = useState(router.query.categoryurl);

  return (
    <div className={"container-fluid NoPadding categoryCarousel " +Style.categoryCarousel}>
      <div className="col-12">
        <div className="col-12 NoPadding">
          <div className="col-12 NoPadding">
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
                    <div className={"col-12 productsCategoryBlock "}  key={index}> 
                          <a href={url} className ={"col-12 " +Style.categoryBlock}>
                            <div className={activeClass + " col-12 itemImg NoPadding category_"+index +" " +Style.categoryPhoto +" " +Style.itemImg +" " }>
                                <Image    
                                  id="prodImg"                                       
                                  src={categorydata.categoryImage ? categorydata.categoryImage : "/images/eCommerce/notavailable.png"}
                                  alt="Category" 
                                  className={"img-responsive " +Style.NoAvailableImg +" " +Style.categoryBlockImg }
                                  height={90}
                                  width={90} 
                                  layout={'intrinsic'}
                                />
                              <div className={"col-12 text-center mt-2 " +Style.categoryName} title={categorydata.category}>{categorydata.category}</div>
                            </div>
                          </a>
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
