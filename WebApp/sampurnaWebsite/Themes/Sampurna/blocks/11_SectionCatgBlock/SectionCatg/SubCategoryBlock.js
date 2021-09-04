import React, { Component }   from 'react';
import axios                  from 'axios';
import Link                   from 'next/link';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import Carousel               from 'react-multi-carousel';

import 'react-multi-carousel/lib/styles.css';
import CustomRightArrow       from '../../StaticBlocks/CustomArrows/CustomRightArrowSubCatg.js';
import CustomLeftArrow        from '../../StaticBlocks/CustomArrows/CustomLeftArrowSubCatg.js';

class SubCategoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      itemList                : [],
      Productsloading         : true,
    };
  }
  
  componentDidMount(){
    var itemList1 = []; 
      // console.log("this.props.groupSetting==",this.props.groupSettings);     
        axios.post(this.props.groupSettings.blockApi, this.props.groupSettings)      
        .then((blockApiResponse)=>{
          console.log("blockApiResponse = > ",blockApiResponse)
          if(blockApiResponse.data.length>0){   
            // console.log("blockApiResponse.data===",blockApiResponse.data); 
          for(var i=0;i<blockApiResponse.data.length;i++){ 
            itemList1.push({
                  "itemImg" : blockApiResponse.data[i].itemImg && blockApiResponse.data[i].itemImg,
                  "itemUrl" : this.props.groupSettings.showOnlySubCategory === true ?  blockApiResponse.data[i].itemUrl : this.props.groupSettings.section,
                  "item"    : blockApiResponse.data[i].itemName,
                })      
          } 
          if(itemList1.length>0){
            this.setState({
              itemList     : itemList1,
              Productsloading : false,              
            },()=>{
                // console.log("itemList after set state===",this.state.itemList);
            });
          }
        }
      })
      .catch((error)=>{
          console.log('error====>', error);
      })
}

  render() {
    var url = "";
    const CategoryResponsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 769, min: 366 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
      }
    };
    
  return (
      <div className="col-12">
          {this.props.groupSettings.showTitle?
            <div className="col-12">
              <div className="col-12 productcomponentheading text-center text-lg-left">
              <div className={ "col-12 " +Style.title4}>
                    <h1 className={"col-12 title_inner4 lang_trans " +Style.titleFont1 } data-trans="#title">{this.props.blockTitle} <span className={"line " +Style.line}></span></h1>
                    <span className={"hide "+Style.span} id="title"></span>
			        	</div>
              </div>
            </div>
          :
            null
          }  
          <div className="col-12 rowPadding">
            { this.props.groupSettings.showCarousel === true?
              Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
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
                containerClass="carousel-container"
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                >
                  {Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => {  
                    { if(this.props.groupSettings.showOnlyCategory){
                        url = "/vendor-list/"+data.itemUrl;
                      }else{
                        url = "/vendor-list/"+data.itemUrl;
                      }
                    }
                    return (
                    <div className="col-12 sectionCategoryBlock subCategoryBlock d-flex justify-content-center "  key={index}> 
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
                Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                  Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => { 
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
export default SubCategoryBlock;