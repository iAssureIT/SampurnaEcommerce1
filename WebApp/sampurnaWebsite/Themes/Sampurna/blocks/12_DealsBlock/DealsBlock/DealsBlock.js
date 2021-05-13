import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import './DealsBlock.css';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

var isServer = typeof window!==undefined;
var user_ID = '';
if(!isServer){
   user_ID = localStorage.getItem("user_ID");
}

class ShoppingVerticals extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType : props.type,
      itemList: [
        { 
          "_id": "5f523c318429470d0da77a3e",          
          itemImage: '',
          item: "Item1",
          itemUrl: "item1",
        },
        { 
          "_id": "5f523c318429470d0da77a3a",          
          itemImage: '',
          item: "Item2",
          itemUrl: "item2"
        },
        
      ],
      Productsloading    : true,
      blockTitle         : "Deals Of the day",      
      dealSettings : {
        blockApi 		          : '',
        section               : "Select section",
        category              : '', 
        subCategory           : '',
        
    }, 
    };
  }
  
  componentDidMount(){          
      if(this.props.block_id){
      axios.get('/api/blocks/get/'+this.props.block_id)    
      .then((blockresponse)=>{
        if(blockresponse.data){
        // console.log("groupsettings response data====",blockresponse.data);                
        this.setState({
           dealSettings    : blockresponse.data.dealsSettings,   
           blockTitle       : blockresponse.data.blockTitle,
        },()=>{
          // console.log("after setstate groupSettings===",this.state.groupSettings);
          axios.post(blockresponse.data.dealSettings.blockApi,this.state.dealSettings)      
          .then((blockApiResponse)=>{
            if(blockApiResponse.data){    
              console.log("SectionBlock list response data====", blockApiResponse.data,blockApiResponse.data.length);  
              var itemList = []; 
                for(var i=0;i<blockApiResponse.data.length;i++){ 
                      itemList.push({
                        "dealImg" : blockApiResponse.data[i].dealImg?blockApiResponse.data[i].dealImg:"",
                        // "dealUrl" : blockApiResponse.data[i].dealUrl,
                      })      
                } 

            this.setState({
              itemList     : itemList,
              Productsloading : false,              
            },()=>{
                console.log("itemList after filter===",this.state.itemList);
            });
          }
          })
          .catch((error)=>{
              console.log('error', error);
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
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    var XLcol = 12/this.state.itemList.length;
    return (
      <div className="col-12 mt20">
        <div className="row">          
          {/* {this.state.dealSettings.showTitle?

          <div className="col-12">
            <div className="col-12 productcomponentheading text-center">
              <div className="producttextclass  col-lg-12">
                <h3 className="row">
                  <b>{this.state.blockTitle}</b> 
                </h3> 
              </div>            
            </div>
          </div>
          :null}           */}

          <div className="col-12 tab-content customTabContent ">
            { Array.isArray(this.state.itemList) && this.state.itemList.length>4?
                <Carousel  
                  className="customnNavButton"
                  swipeable={false}
                  draggable={true}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={this.props.deviceType !== "mobile" ? true : false}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  customTransition="all .20"
                  transitionDuration={500}                      
                  removeArrowOnDeviceType={["mobile"]}
                  deviceType={this.props.deviceType}                      
                  itemClass="carousel-item-padding-10-px">
                  {
                    Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                      Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => {  
                        return (
                        <div className="col-12 sectionCategoryBlock"  key={index}> 
                            <div className="productImg col-12 NoPadding">
                              <a className="product photo product-item-photo collage" tabIndex="-1" href={data.itemUrl}>
                                <img src={data.dealImg ? data.dealImg : "/images/CMSImages/notavailable.jpg"} alt="dealImg" />
                              </a>
                            </div>
                            {/* <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div> */}
                        </div>                            
                        );
                      
                      })
                      : ''
                  }
                </Carousel>                    
                :
                <div className="row sectionCategoryBlock">                      
                  {
                    Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                      Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => {                      
                        return (
                          // 
                          <div className={"col-"+XLcol}>
                                <div className="productImg col-12 NoPadding">
                                  <a className="product photo product-item-photo collage" tabIndex="-1" href={data.itemUrl}>
                                    <img src={data.dealImg ? data.dealImg : "/images/CMSImages/notavailable.jpg"} alt="ProductImg" />
                                  </a>
                                </div>
                                {/* <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div> */}
                          </div>                            
                        );
                      
                      })
                      : ''
                  }	
                </div>    
            }
              
          </div>
        </div>
      </div>
    );
  }
}
export default ShoppingVerticals;