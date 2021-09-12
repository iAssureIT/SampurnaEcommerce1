import React, { Component }   from 'react';
import axios                  from 'axios';
import Link                   from 'next/link';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import Carousel               from 'react-multi-carousel';
import SubCategory            from '../SubCategory/SubCategory.js';
import 'react-multi-carousel/lib/styles.css';
import CustomRightArrow       from '../../StaticBlocks/CustomArrows/CustomRightArrowSection.js';
import CustomLeftArrow        from '../../StaticBlocks/CustomArrows/CustomLeftArrowSection.js';

class SectionBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType             : props.type,
      itemList                : [],
      Productsloading         : true,
    };
  }

  componentDidMount(){
      var itemList = [];      
          axios.post(this.props.groupSettings.blockApi, this.props.groupSettings)      
          .then((blockApiResponse)=>{
            // console.log("blockApiResponse = > ",blockApiResponse)
            if(blockApiResponse.data){   
              // console.log("blockApiResponse.data===",blockApiResponse.data); 
            for(var i=0;i<blockApiResponse.data.length;i++){ 
                  itemList.push({
                    "itemImg" : blockApiResponse.data[i].itemImg && blockApiResponse.data[i].itemImg,
                    // "itemUrl" : blockApiResponse.data[i].itemUrl,
                    "itemUrl" : this.props.groupSettings.showOnlySection === true ?  blockApiResponse.data[i].itemUrl : this.props.groupSettings.sectionUrl,
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
  }

  render() {
    // console.log("this.props.groupSettings==",this.props.groupSettings);
    var XLcol = 12/this.props.groupSettings.numOfItemPerRow;
    var LGCol = 12/this.props.groupSettings.noOfItemPerLGRow;
    var MDCol = 12/this.props.groupSettings.noOfItemPerMDRow;
    var SMCol = 12/this.props.groupSettings.noOfItemPerSMRow;
    var XSCol = 12/this.props.groupSettings.noOfItemPerXSRow;
    var url;

    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: this.props.groupSettings.displayItemInCarousel,
        item: XLcol,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 667 },
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 666, min: 366 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    return (
      <div className={"col-12 " + Style.secssionMargin}>
          {this.props.groupSettings.showTitle?
            <div className="col-12">
              <div className="col-12 productcomponentheading text-left">
                <div className={ "col-12 " +Style.title4}>
                    <h4 className={"col-12 " + Style.newDealTitle}>New deal in</h4>
                    <h1 className={"col-12 globalMainTitle  title_inner4 lang_trans globalMainTitle " +Style.titleFont1 } data-trans="#blog_1554730795823_title"><span className={Style.lineBackground}>{this.state.blockTitle}</span> <span className={"line " +Style.line}></span></h1>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
			        	</div>
              </div>
            </div>
          :
            null
          }   
          <div className="col-12 rowPadding ">
            { this.props.groupSettings.showCarousel === true?
              this.state.itemList && this.state.itemList.length > 0 ?
              <div className="col-12 ">
              {this.props.groupSettings.showOnlySection === true &&
                <Carousel 
                  className=" sectionCarousel"
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
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  itemClass="carousel-item-padding-40-px"
                  deviceType={this.props.deviceType}  
                  containerClass="carousel-container"
                  customRightArrow={<CustomRightArrow />}
                  customLeftArrow={<CustomLeftArrow />}
                  >
                    {this.state.itemList.map((data, index) => {
                      { if(this.props.groupSettings.showOnlySection){
                          url = "/vendor-list/"+data.itemUrl;
                        }else if(this.props.groupSettings.showOnlyCategory){
                          url = "/vendor-list/"+data.itemUrl;
                        }else{
                          url = "/vendor-list/"+data.itemUrl;
                        }
                      }
                      return (
                      <div className="col-12 sectionCategoryBlock"  key={index}> 
                          {this.props.groupSettings.showOnlySection === true &&
                            <a href={url} className ="secCateblock"> 
                              <div className="itemImg col-12 NoPadding d-flex justify-content-center">
                                <div className="product photo product-item-photo collage">
                                  <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.png"} alt="ItemImg" className={"subImg"} />
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
              
            </div>
            : 
              null
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
                      <div className={"col-"+XLcol +" " +"NoPadding"} key={"item-"+index}>
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
export default SectionBlock;