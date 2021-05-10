import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import Carousel from 'react-responsive-carousel';
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
      productType        : props.type,
      itemList        : [
        { 
          "_id": "5f523c318429470d0da77a3e",          
          itemImage: '',
          item: "Women",
          itemUrl: "women",
        },
        { 
          "_id": "5f523c318429470d0da77a3a",          
          itemImage: '',
          item: "Men",
          itemUrl: "men"
        },
        { 
          "_id": "5f523c318429470d0da77a3b",          
          itemImage: '',
          item: "Home Decor",
          itemUrl: "home-decor"
        },
        { 
          "_id": "5f523c318429470d0da77a3c",          
          itemImage: '',
          item: "Electronics",
          itemUrl: "electronics"
        },
        {
          "_id": "5f523c318429470d0da77a3e",          
          itemImage: '',
          item: "Vegetables",
          itemUrl: "vegetales"
        }
      ],
      Productsloading    : true,
      blockTitle         : "Shopping Verticals",      
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
        noOfItemPerLGRow      : 6,
        noOfItemPerMDRow      : 4,
        noOfItemPerSMRow      : 3,
        noOfItemPerXSRow      : 2,
    }, 
    };
  }
  
  componentDidMount(){
    // console.log("inside componentdidmount");
      user_ID = localStorage.getItem("user_ID");
      const websiteModel = localStorage.getItem("websiteModel");      
      const showLoginAs = localStorage.getItem("showLoginAs");      
      this.setState({showLoginAs: showLoginAs,websiteModel:websiteModel}); 
      // console.log("itemList====",this.state.itemList); 
      // console.log("Props====",this.props);       
      if(this.props.block_id){
      axios.get('/api/blocks/get/'+this.props.block_id)    
      .then((blockresponse)=>{
        if(blockresponse.data){
        // console.log("groupsettings response data====",response.data);                
        this.setState({
           groupSettings    : blockresponse.data.groupSettings,   
           blockTitle       : blockresponse.data.blockTitle,
        },()=>{
          // console.log("after setstate groupSettings===",this.state.groupSettings);
          axios.get(blockresponse.data.groupSettings.blockApi)      
          .then((blockApiResponse)=>{
            if(blockApiResponse.data){    
            var itemList = []; 
            var itemList = []; 
            for(var i=0;i<blockApiResponse.data.length;i++){ 
                  itemList.push({
                    "itemImg" : blockApiResponse.data[i].itemImg?blockApiResponse.data[i].itemImg:"",
                    "itemUrl" : blockApiResponse.data[i].itemUrl,
                    "item"    : blockApiResponse.data[i].itemName,
                  })      
            } 
            this.setState({
              itemList     : itemList,
              // itemList        : blockApiResponse.data,
              Productsloading : false,              
            },()=>{
                // console.log("itemList===",this.state.itemList);
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
        // items: this.state.groupSettings.displayItemInCarousel,
        item:6,
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

    // console.log("inside rendor this.state.itemList===",this.state.itemList);
    // console.log("this.state.groupSettings.showCarousel",this.state.groupSettings.showCarousel);
    var XLcol = 12/this.state.groupSettings.numOfItemPerRow;
    var LGCol = 12/this.state.groupSettings.noOfItemPerLGRow;
    var MDCol = 12/this.state.groupSettings.noOfItemPerMDRow;
    var SMCol = 12/this.state.groupSettings.noOfItemPerSMRow;
    var XSCol = 12/this.state.groupSettings.noOfItemPerXSRow;

    return (
      <div className="col-12 mt20">
          {this.state.groupSettings.showTitle?
          <div className="col-12">
            <div className="col-12 productcomponentheading text-center">
              <div className="producttextclass  col-12">
                <h4 className="row">
                  <b>{this.state.blockTitle}</b> 
                </h4> 
              </div>            
            </div>
          </div>
          :null}   
          <div className="col-12 tab-content customTabContent ">
            { this.state.groupSettings.showCarousel === true?
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
                        <div className="col-12 sectionCategoryBlock NoPadding"  key={index}> 
                            <div className="itemImg col-12 NoPadding">
                              <a className="product photo product-item-photo collage" tabIndex="-1" href={"/section/"+data.itemUrl}>
                                <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.jpg"} alt="ItemImg" />
                              </a>
                            </div>
                            <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div>
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
                          index<8?
                          <div className={"col-"+XLcol}>
                                <div className="productImg col-12 NoPadding">
                                  <a className="product photo product-item-photo collage" tabIndex="-1" href={data.itemUrl}>
                                    <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.jpg"} alt="ProductImg" />
                                  </a>
                                </div>
                                <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div>
                              
                              {/* <sectionItem itemList   = {this.state.itemList} 
                                          blockSettings = {this.state.blockSettings}
                                          productSetting= {this.state.productSetting}
                                          filterSettings= {this.state.filterSettings}
                                />   */}
                          </div> 
                          :''                           
                        );
                      
                      })
                      : ''
                  }	
                </div>    
            } 
          </div>
      </div>
    );
  }
}
export default ShoppingVerticals;