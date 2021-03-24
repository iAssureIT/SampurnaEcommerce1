import React from 'react';
// import './AppDevMain.css';
import axios from 'axios';
import $ 			from 'jquery';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};


var isServer = typeof window!==undefined;
var user_ID = '';
if(!isServer){
   user_ID = localStorage.getItem("user_ID");
}




export default class BannerView extends React.Component {
		constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": " ", 
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "https://unimandai.s3.amazonaws.com/CMS/b1background_20201016144728.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "APPLICATION", 
                                    SubTitle: "DEVELOPMENT &MAINTENANCE", 
                                    Image: "/images/Fruits1.png",
                                    Link: "", 
                                    Description: "Highly Professional,Reliable & Affordable Cost."
								},
								{ 
                                    Title: " MOBILE", 
                                    SubTitle: "SOLUTIONS", 
                                    Image: "/images/Delivery banner2.png",
                                    Link: "", 
                                    Description: "We Build Robust & Scalable Mobile Applications."
								},
								{ 
                                    Title: "STAFF", 
                                    SubTitle: "AUGMENTATAION", 
                                    Image: "/images/Fruits1.png",
                                    Link: "", 
                                    Description: ""
								},
								{ 
                                    Title: "CUSTOMISED ECOMMERCE ", 
                                    SubTitle: "SOLUTIONS", 
                                    Image: "/images/Banner3.png",
                                    Link: "", 
                                    Description: ""
                                }
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          blockID:"",
          block_id:"",

          responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:1 
            }
		  },
		  display:false
        };   
      }
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
      $(document).ready(function(){			

            $("#cItemHBpage div:nth-child(1)").addClass("active");

        });

              if(this.props.block_id){              
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                             console.log("ListofServices =",response.data);
                          this.setState({
                              blocks:response.data
                          });
                        }                  
                      })           
                    .catch(function(error){
                      console.log(error);
                  })
                  this.setState({
                    block_id:this.props.block_id
                  });
                }
          
    }

	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite  marginTop180 bannerWrapper">
				<div className="row">
					<div className="">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bannerContainerEcomm">
							<div className="row">
							<Carousel
								swipeable={false}
								draggable={false}
								showDots={true}
								responsive={responsive}
								ssr={true} // means to render carousel on server-side.
								infinite={true}
								autoPlay={this.props.deviceType !== "mobile" ? true : false}
								autoPlaySpeed={3000}
								keyBoardControl={true}
								customTransition="all .20"
								transitionDuration={500}
								containerClass="carousel-container"
								removeArrowOnDeviceType={["desktop","tablet", "mobile"]}
								deviceType={this.props.deviceType}
								//dotListClass="custom-dot-list-style"
								itemClass="carousel-item-padding-40-px">  
                                { Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((data,index)=>{
                                    return(
                                        <div className="item">
										    <img className="img img-responsive" src={data.Image} alt="banner" />									    	
									    </div>
                                    );
                                })                                                                  
									
                                }
							</Carousel> 
							</div> 
						</div>
					</div>	
				</div>
			</div>			
		);
	}
}	 

