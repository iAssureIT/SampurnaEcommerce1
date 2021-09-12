import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
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
      itemList: [],
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
          // console.log("after setstate dealSettings===",this.props.dealSettings.blockApi);
          axios.post(this.props.dealSettings.blockApi,this.props.dealSettings)      
          .then((blockApiResponse)=>{
            if(blockApiResponse.data){    
              // console.log("DealBlock list response data====", blockApiResponse.data,blockApiResponse.data.length);  
              var itemList = []; 
                for(var i=0;i<blockApiResponse.data.length;i++){ 
                    itemList.push({
                      "dealImg" : blockApiResponse.data[i].dealImg?blockApiResponse.data[i].dealImg:"",
                      "dealUrl" : blockApiResponse.data[i].section.replace(/\s+/g, '-').toLowerCase()
                    })      
                } 

            this.setState({
              itemList     : itemList,
              Productsloading : false,              
            },()=>{
                // console.log("itemList after filter===",this.state.itemList);
            });
          }
          })
          .catch((error)=>{
              console.log('error', error);
          })
  }

  render() {
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
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
      this.state.itemList.length>0?
      <div className="col-12 mobileNoPadding">
        <div className="row">          
          <div className={"col-12 NoPadding crouserDealsWrapper" }>
            { Array.isArray(this.state.itemList) && this.state.itemList.length>1?
                <Carousel  
                  className=""
                  swipeable={false}
                  draggable={true}
                  showDots={true}
                  arrows ={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={this.props.deviceType !== "mobile" ? true : false}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  customTransition="all .20"
                  transitionDuration={1000}                      
                  removeArrowOnDeviceType={["mobile"]}
                  deviceType={this.props.deviceType}                      
                  itemClass="carousel-item-padding-10-px">
                  {
                    Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                      Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => {  
                        return (
                        <div className="  dealsBlock"  key={index}> 
                            <div className={"productImg col-12 mobileNoPadding"}>
                            <div className="col-12 ">
                              <a className="product photo product-item-photo collage" tabIndex="-1" href={data.dealUrl}>
                                <img src={data.dealImg ? data.dealImg : "/images/CMSImages/notavailable.png"} alt="dealImg" />
                              </a>
                            </div>
                            </div>
                        </div>                            
                        );
                      })
                      : ''
                  }
                </Carousel>                    
                :
                <div className="col-12 dealsBlock ">   
                <div className="row">                  
                  {
                    Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                      this.state.itemList.map((data, index) => {   
                        // console.log("deals data=",data);                   
                        return (
                          <div className={"col-"+XLcol} key={index}>
                            <div className="row"> 
                              <div className="col-12 NoPadding">
                                <div className="productImg col-12 NoPadding">
                                  <a className="product photo product-item-photo collage" tabIndex="-1" href={"/vendor-list/"+data.dealUrl}>
                                    <img src={data.dealImg ? data.dealImg : "/images/eCommerce/notavailable.png"} alt="ProductImg" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>                            
                        );
                      })
                      : ''
                  }	
                </div>    
                </div>    
            } 
          </div>
        </div>
      </div>
      :null
    );
  }
}
export default ShoppingVerticals;