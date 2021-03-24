import React from 'react';
// import './AppDevMain.css';
import axios from 'axios';
import $ 			from 'jquery';
import Carousel from 'react-multi-carousel';
import Swiper from 'react-id-swiper';
// import 'swiper/css/swiper.css'
// import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
// import { Swiper, Navigation, Pagination } from 'swiper/js/swiper.esm';
import 'react-multi-carousel/lib/styles.css';
import './Banner.css';

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


  const params = {
    effect: 'flip',
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination'
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }
  

var isServer = typeof window!==undefined;
var user_ID = '';
if(!isServer){
   user_ID = localStorage.getItem("user_ID");
}




export default class Banner extends React.Component {
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
                                    Title: "", 
                                    SubTitle: "", 
                                    BgImage: "/images/Fruits1.png",
                                    FgImage: "/images/saleimage.png",
                                    Link: "", 
                                    Description: "Highly Professional,Reliable & Affordable Cost."
								},
								{ 
                                    Title: "", 
                                    SubTitle: "", 
                                    BgImage: "/images/Delivery banner2.png",
                                    FgImage: "/images/saleimage.png",
                                    Link: "", 
                                    Description: "We Build Robust & Scalable Mobile Applications."
								},
								{ 
                                    Title: "", 
                                    SubTitle: "", 
                                    BgImage: "/images/Fruits1.png",
                                    FgImage: "/images/saleimage.png",
                                    Link: "", 
                                    Description: ""
								},
								{ 
                                    Title: "", 
                                    SubTitle: "", 
                                    BgImage: "/images/Banner3.png",
                                    FgImage: "/images/saleimage.png",
                                    Link: "", 
                                    Description: ""
                }
            ],
            animationSettings : {
              showDots          : true,
              swipeable         : true,
              draggable         : true,
              infinite          : true,
              autoPlaySpeed     : 1000,
              showNextPrevArrow : true,
              },
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          additionalTransfrom : 0,
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

    var video = document.getElementById("bannerVideo");
    var btn = document.getElementById("myBtn");

    function myFunction() {
      if (video.paused) {
        video.play();
        // btn.innerHTML = "Pause";
      } else {
        video.pause();
        // btn.innerHTML = "Play";
      }
}

		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite  marginTop180 bannerWrapper">
				<div className="row">
					<div className="">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bannerContainerEcomm">
							<div className="row">
							<Carousel
								swipeable={this.state.blocks.animationSettings.swipeable}
								draggable={this.state.blocks.animationSettings.draggable}
								showDots={this.state.blocks.animationSettings.showDots}
                responsive={responsive}
								ssr={true} // means to render carousel on server-side.
								infinite={this.state.blocks.animationSettings.infinite}
								autoPlay={this.props.deviceType !== "mobile" ? true : false}
								autoPlaySpeed={this.state.blocks.animationSettings.autoPlaySpeed}
								keyBoardControl={this.state.blocks.animationSettings.keyBoardControl}
								customTransition="all .4"
								transitionDuration={1000}
								containerClass="carousel-container"
								// removeArrowOnDeviceType={["desktop","tablet", "mobile"]}
								deviceType={this.props.deviceType}
								//dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                additionalTransfrom={-this.state.additionalTransfrom}
                beforeChange={() => this.setState({ isMoving: true })}
                afterChange={() => this.setState({ isMoving: false })}
                >                           
                      { this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.map((data,index)=>{
                        return(
                              // <Swiper {...params}>
                              <div className="item">
                                {data.BgVideo?
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fullScreen-videoWrap NOpadding">
                                      <video autoplay="true" muted loop="true" id="bannerVedio"
                                      src={data.BgVideo} type="video/mp4" width="100%" height="600"/>
                                    </div> 
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 video-overlay"></div>  
                                  </div>                                 
                                :null
                                }
                                {data.BgImage?
                                  <img className="img img-responsive BgImg" src={data.BgImage} alt="banner" />
                                :null}
                                {data.FgImage?
                                <div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 blockTitle">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockTitle">{data.Title}</div>	
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockSubTitle">{data.SubTitle}</div>
                                  </div> 
                                  <div className="col-lg-5 col-md-6 col-sm-6 col-xs-12 pull-right blockTitle">                               
                                    <img className="img img-responsive FgImg" src={data.FgImage!==""?data.FgImage:null} alt="banner" />	
                                  </div>	
                                </div>	
                                :
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockTitle">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockTitle">{data.Title}</div>	
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockSubTitle">{data.SubTitle}</div>
                                </div> 
                                }						    	
                              </div>
                              // </Swiper>
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

