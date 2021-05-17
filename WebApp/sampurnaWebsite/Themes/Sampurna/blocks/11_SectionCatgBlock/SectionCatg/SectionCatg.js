import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class ShoppingVerticals extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      productType        : props.type,
      itemList           : [
        
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
        // console.log("groupsettings response data====",blockresponse.data);                
        this.setState({
           groupSettings    : blockresponse.data.groupSettings,   
           blockTitle       : blockresponse.data.blockTitle,
        },()=>{
          // console.log("after setstate groupSettings===",this.state.groupSettings.blockApi);
          axios.post(this.state.groupSettings.blockApi, this.state.groupSettings)      
          .then((blockApiResponse)=>{
            // console.log("blockApiResponse = > ",blockApiResponse)
            if(blockApiResponse.data){   
              // console.log("blockApiResponse.data===",blockApiResponse.data); 
            for(var i=0;i<blockApiResponse.data.length;i++){ 
                  itemList.push({
                    "itemImg" : blockApiResponse.data[i].itemImg?blockApiResponse.data[i].itemImg:"",
                    "itemUrl" : blockApiResponse.data[i].itemUrl,
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
        items: 4,
        item: XLcol,
        slidesToSlide: 1 // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: XSCol,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    // console.log("inside rendor this.state.itemList===",this.state.itemList);
    // console.log("this.state.groupSettings.noOfItem",this.state.groupSettings.showCarousel);
    

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
           this.state.itemList && this.state.itemList.length > 0 ?
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
              containerClass="carousel-container">
                {this.state.itemList.map((data, index) => {  
                  { if(this.state.groupSettings.showOnlySection){
                    url = "/section/"+data.itemUrl;
                   }else if(this.state.groupSettings.showOnlyCategory){
                    url = "/category/"+data.itemUrl;
                   }else{
                    url = "/subcategory/"+data.itemUrl;
                   }
                  }
                  return (
                  <div className="col-12 sectionCategoryBlock"  key={index}> 
                      <a href={url} className ="secCateblock"> 
                        <div className="itemImg col-12 NoPadding">
                          <a className="product photo product-item-photo collage" tabIndex="-1" href={url}>
                            <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.jpg"} alt="ItemImg" />
                          </a>
                        </div>
                        <div className="col-12 item_Name text-center" title={data.item}>{data.itemUrl}</div>
                      </a>
                  </div>                            
                  );
                })
              }
          </Carousel>
          : ''
        :
          <div className="row sectionCategoryBlock">                      
            {
              Array.isArray(this.state.itemList) && this.state.itemList.length > 0 ?
                Array.isArray(this.state.itemList) && this.state.itemList.map((data, index) => { 
                  { if(this.state.groupSettings.showOnlySection){
                    url = "/section/"+data.itemUrl;
                   }else if(this.state.groupSettings.showOnlyCategory){
                    url = "/category/"+data.itemUrl;
                   }else{
                    url = "/subcategory/"+data.itemUrl;
                   }
                  }                     
                  return (
                    <div className={"col-"+XLcol} key={index}>
                      <a href={url} className ="secCateblock"> 
                          <div className="productImg col-12 ">
                            <a className="product photo product-item-photo collage" tabIndex="-1" href={url}>
                              <img src={data.itemImg ? data.itemImg : "/images/eCommerce/notavailable.jpg"} alt="ProductImg" />
                            </a>
                          </div>
                          <div className="col-12 item_Name text-center" title={data.item}>{data.item}</div>  
                      </a>                             
                    </div>                    
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