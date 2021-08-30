import React, { Component }   from 'react';
import axios                  from 'axios';
import Link                   from 'next/link';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import Carousel               from 'react-multi-carousel';
import SubCategory            from '../SubCategory/SubCategory.js';
import 'react-multi-carousel/lib/styles.css';

class ShoppingVerticals extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType             : props.type,
      itemList                : [
      ],
      Productsloading         : true,
      blockTitle              : "Shopping Verticals",      
      groupSettings : {
        blockApi 		          : '',
        showCarousel          : true, 
        displayItemInCarousel : 6,  
        totalProducts 	      : 12,
        showTitle             : true,
        section               : "Select section",
        category              : '', 
        subCategory           : '',
        showOnlySection       : true,
        showOnlyCategory      : false,
        showOnlyBrand         : false,
        showOnlySubCategory   : false,
        numOfRows             : 2,    
        numOfItemPerRow       : 4,      
        noOfItemPerLGRow      : 3,
        noOfItemPerMDRow      : 3,
        noOfItemPerSMRow      : 4,
        noOfItemPerXSRow      : 2,
    }, 
    };
  }

  componentDidMount(){
      var itemList = [];      
      if(this.props.block_id){
      axios.get('/api/blocks/get/'+this.props.block_id)    
      .then((blockresponse)=>{
        if(blockresponse.data){
        /*console.log("groupsettings response data====",blockresponse.data);*/                
        this.setState({
           blockResponse    : blockresponse.data,
           groupSettings    : blockresponse.data.groupSettings,   
           blockTitle       : blockresponse.data.blockTitle,
        },()=>{
           console.log("after setstate groupSettings===",this.state.groupSettings);
          axios.post(this.state.groupSettings.blockApi, this.state.groupSettings)      
          .then((blockApiResponse)=>{
            console.log("blockApiResponse = > ",blockApiResponse)
            if(blockApiResponse.data){   
              /*console.log("blockApiResponse.data===",blockApiResponse.data); */
            for(var i=0;i<blockApiResponse.data.length;i++){ 
                  itemList.push({
                    "itemImg" : blockApiResponse.data[i].itemImg && blockApiResponse.data[i].itemImg,
                    // "itemUrl" : blockApiResponse.data[i].itemUrl,
                    "itemUrl" : blockresponse.data.groupSettings.showOnlySection === true ?  blockApiResponse.data[i].itemUrl : blockresponse.data.groupSettings.sectionUrl,
                    "item"    : blockApiResponse.data[i].itemName,
                  })      
            } 
            this.setState({
              itemList     : itemList,
              Productsloading : false,              
            },()=>{
                // console.log("itemList after set state===",this.state.itemList);
            });
          }
          })
          .catch((error)=>{
              console.log('error====>', error);
          })
        });
      }
      })
      .catch((error)=>{
          console.log('error', error);
      })
    }//end if blockid
  }

  render() {
    var XLcol = 12/this.state.groupSettings.numOfItemPerRow;
    var LGCol = 12/this.state.groupSettings.noOfItemPerLGRow;
    var MDCol = 12/this.state.groupSettings.noOfItemPerMDRow;
    var SMCol = 12/this.state.groupSettings.noOfItemPerSMRow;
    var XSCol = 12/this.state.groupSettings.noOfItemPerXSRow;
    var url;

    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: this.state.groupSettings.displayItemInCarousel,
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
          {this.state.groupSettings.showTitle?
            <div className="col-12">
              <div className="col-12 productcomponentheading text-center text-lg-left">
              <div className={ "col-12 mt-4 " +Style.title4}>
                    <h1 className={"col-12 globalMainTitle  title_inner4 lang_trans globalMainTitle " +Style.titleFont1 } data-trans="#blog_1554730795823_title">{this.state.blockTitle} <span className={"line " +Style.line}></span></h1>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                    {/*/<div className={"line "+Style.line}></div>*/}
                    {/*<div className={"line "+Style.line}><span className={Style.span}></span></div>*/}
			        	</div>
              </div>
            </div>
          :
            null
          }   
          <div className="col-12 rowPadding ">
            { this.state.groupSettings.showCarousel === true?
              this.state.itemList && this.state.itemList.length > 0 ?
              <div className="col-12 ">
                
              {this.state.groupSettings.showOnlySection === true &&
              <Carousel 
                  className=" sectionCarousel"
                  swipeable={false}
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
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  itemClass="carousel-item-padding-40-px"
                  deviceType={this.props.deviceType}  
                  containerClass="carousel-container">
                    {this.state.itemList.map((data, index) => {
                      { if(this.state.groupSettings.showOnlySection){
                          url = "/vendor-list/"+data.itemUrl;
                        }else if(this.state.groupSettings.showOnlyCategory){
                          url = "/vendor-list/"+data.itemUrl;
                        }else{
                          url = "/vendor-list/"+data.itemUrl;
                        }
                      }
                      return (
                      <div className="col-12 sectionCategoryBlock  "  key={index}> 
                          {this.state.groupSettings.showOnlySection === true &&
                          <a href={url} className ="secCateblock"> 
                            <div className="itemImg col-12 NoPadding">
                              <div className="product photo product-item-photo collage">
                                <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.png"} alt="ItemImg" className={"subImg " } />
                              </div>
                            </div>
                            <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div>
                          </a>
                          }                         
                      </div>                            
                      );
                    })
                  }
              </Carousel>
              }

              {this.state.groupSettings.showOnlyCategory === true &&
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
                  {this.state.itemList.map((data, index) => {  
                    { if(this.state.groupSettings.showOnlyCategory){
                        url = "/vendor-list/"+data.itemUrl;
                      }else{
                        url = "/vendor-list/"+data.itemUrl;
                      }
                    }
                    return (
                    <div className="col-12 sectionCategoryBlock  "  key={index}> 
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
              }

              {this.state.groupSettings.showOnlySubCategory === true &&
                <SubCategory 
                  groupSettings = {this.state.groupSettings}
                  itemList      = {this.state.itemList}
                />
                
              }
            </div>
            : 
              <div className="col-12">No Item Available</div>
          :
            <div className="row sectionCategoryBlock">                      
              {
                Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                  Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => { 
                    { if(this.state.groupSettings.showOnlySection){
                      url = "/vendor-list/"+data.itemUrl;
                    }else if(this.state.groupSettings.showOnlyCategory){
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
export default ShoppingVerticals;