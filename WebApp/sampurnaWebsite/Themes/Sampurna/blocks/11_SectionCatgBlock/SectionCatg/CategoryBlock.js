import React, { Component }   from 'react';
import axios                  from 'axios';
import Link                   from 'next/link';
import Style                  from '../../10_eCommerceBlocks/ProductCarousel/ProductCarousel.module.css';
import Carousel               from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

class CategoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType             : props.type,
      itemList                : [
      ],
      Productsloading         : true,  
    };
  }

  componentDidMount(){
      var itemList = []; 
        // console.log("this.props.groupSetting==",this.props.groupSettings);     
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
    // console.log("this.props.groupSettings=",this.props.groupSettings);
    // console.log("this.state.itemList==",this.state.itemList);
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
      <div className={"col-12 "}>
          {this.props.groupSettings.showTitle?
            <div className="col-12">
              <div className="col-12 productcomponentheading text-center text-lg-left">
              <div className={ "col-12 " +Style.title4}>
                    <h1 className={"col-12 title_inner4 lang_trans " +Style.titleFont1 } data-trans="#blog_1554730795823_title">{this.props.blockTitle} <span className={"line " +Style.line}></span></h1>
                    <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
			        	</div>
              </div>
            </div>
          :
            null
          }   
          <div className={"col-12 rowPadding " + Style.categoryBlockWrapper}>
            { this.props.groupSettings.showCarousel === true?
              this.state.itemList && this.state.itemList.length > 0 ?
              <div className="">             
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
                    { if(this.props.groupSettings.showOnlyCategory){
                        url = "/vendor-list/"+data.itemUrl;
                      }else{
                        url = "/vendor-list/"+data.itemUrl;
                      }
                    }
                    return (
                    <div className="col-12 sectionCategoryBlock d-flex justify-content-center "  key={index}> 
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
                    { if(this.state.groupSettings.showOnlySection){
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
export default CategoryBlock;