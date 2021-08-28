import React, { Component }   from 'react';
// import $                      from 'jquery';
import axios                  from 'axios';
import Link                   from 'next/link';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import Carousel               from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
class subCategory extends Component {
  constructor(props) {
    super(props);
    this.props = {      
      productType             : props.type,
      itemList                : [
      ],
      Productsloading         : true,
      blockTitle              : "Shopping Verticals",      
    
    };
  }
  
  componentDidMount(){
      
  }

  render() {
    var XLcol = 12/this.props.groupSettings.numOfItemPerRow;
    var LGCol = 12/this.props.groupSettings.noOfItemPerLGRow;
    var MDCol = 12/this.props.groupSettings.noOfItemPerMDRow;
    var SMCol = 12/this.props.groupSettings.noOfItemPerSMRow;
    var XSCol = 12/this.props.groupSettings.noOfItemPerXSRow;
    var url;

    const CategoryResponsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        item: XLcol,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 769, min: 366 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
      }
    };
    
    return (
      <div className="col-12 mt20">
          <div className="col-12 rowPadding mb-4">
            { this.props.groupSettings.showCarousel === true?
              this.props.itemList && this.props.itemList.length > 0 ?
              <div className="col-12 ">
              <Carousel 
                className=" sectionCarousel"
                swipeable={false}
                draggable={true}
                showDots={false}
                responsive={CategoryResponsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                customTransition="all .20"
                transitionDuration={500}               
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={this.props.deviceType}  
                containerClass="carousel-container">
                  {this.props.itemList.map((data, index) => {  
                    { if(this.props.groupSettings.showOnlyCategory){
                        url = "/vendor-list/"+data.itemUrl;
                      }else{
                        url = "/vendor-list/"+data.itemUrl;
                      }
                    }
                    return (
                    <div className="col-12 sectionCategoryBlock subCategoryBlock  "  key={index}> 
                        <a href={url} className ="text-decoration-none secCateblock1 categoryblock"> 
                          <div className="itemImg col-12 ">
                            <div className="text-decoration-none product photo product-item-photo collage" tabIndex="-1" href={url}>
                              <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.png"} alt="ItemImg" className={"subImg " } />
                            </div>
                          </div>
                          <div className="col-12 item_Name text-center text-capitalize" title={data.item}>{data.item}</div>
                        </a>                
                    </div>                            
                    );
                  })
                }
              </Carousel>
            </div>
            : 
              <div className="col-12">No Item Available</div>
          :
            <div className="row sectionCategoryBlock">                      
              {
                Array.isArray(this.props.itemList) && this.props.itemList.length > 0 ?
                  Array.isArray(this.props.itemList) && this.props.itemList.map((data, index) => { 
                    { if(this.props.groupSettings.showOnlySection){
                      url = "/vendor-list/"+data.itemUrl;
                    }else if(this.props.groupSettings.showOnlyCategory){
                      url = "/vendor-list/"+data.itemUrl;
                    }else{
                      url = "/vendor-list/"+data.itemUrl;
                    }
                    }                     
                    return (
                      <div className={"col-"+XLcol +" " +"NoPadding"} key={index}>
                        <a href={url} className ="secCateblock sectionCategoryBlock"> 
                            <div className="productImg col-12 ">
                              <a className="product photo product-item-photo collage" tabIndex="-1" href={url}>
                                <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.png"} alt="ProductImg" />
                              </a>
                            </div>
                            <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div>  
                        </a>                             
                      </div>                    
                    );
                  })
                  : null
              }	
            </div>    
          } 
          </div>
      </div>
    );
  }
}
export default subCategory;