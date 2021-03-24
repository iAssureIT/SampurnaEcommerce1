import React from 'react';
import axios from 'axios';
import $ 			from 'jquery';

import SwiperCore, { Navigation, Pagination, EffectFade,EffectFlip, EffectCoverflow, EffectCube, Parallax, Autoplay, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper-bundle.min.js';
import './Banner.css';

SwiperCore.use([Navigation,Pagination,EffectFade, EffectFlip, EffectCube, EffectCoverflow, Parallax, Autoplay]);

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
              autoPlaySpeed     : 2000,
              showNextPrevArrow : "true",
              effect    : "flip",
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
      if(this.state.blocks.animationSettings.effect === "flip"){
      this.swiper = new Swiper('.swiper-container', {        
        effect: 'flip',
        grabCursor: true,                       
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },        
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }

      $(document).ready(function(){		

            $("#cItemHBpage div:nth-child(1)").addClass("active");

        });

              if(this.props.block_id){              
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                          // console.log("response.data============",response.data);
                          
                          this.setState({
                            blocks:response.data
                          },()=>{
                            // console.log("Blocks data after setstate======",this.state.blocks);
                             if (response.data.animationSettings) {
                                if(response.data.animationSettings.effect === "coverflow"){
                                  this.swiper = new Swiper('.swiper-container', 
                                  {

                                    spaceBetween: 30,
                                    effect: 'coverflow',
                                    grabCursor: true,
                                    centeredSlides: true,
                                    slidesPerView: 'auto',
                                    coverflowEffect: {
                                          rotate: 50,
                                          stretch: 0,
                                          depth: 100,
                                          modifier: 1,
                                          slideShadows : true,
                                      },                                
                                    grabCursor: true,
                                    
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                      },        
                                    pagination: {
                                        el: '.swiper-pagination',
                                        clickable: true,
                                      },
                                    });
                                }else if(response.data.animationSettings.effect === "flip"){
                                  
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    effect: 'flip',
                                    grabCursor: true,                       
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },        
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                  });
                                }else if(response.data.animationSettings.effect === "fade"){
                                  
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    spaceBetween: 30,
                                    effect: 'fade',                               
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },
                                  });
                                }else if(response.data.animationSettings.effect === "autoplay"){
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    effect: 'autoplay',
                                    autoplay: {
                                      delay: 3000,
                                      disableOnInteraction: false,
                                    },
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },        
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                  });
                                }else if(response.data.animationSettings.effect === "cube"){
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    effect: 'cube',
                                    grabCursor: true,
                                    cubeEffect: {
                                      shadow: true,
                                      slideShadows: true,
                                      shadowOffset: 20,
                                      shadowScale: 0.94,
                                    },                                                               
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },        
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                    
                                  });
                                }else if(response.data.animationSettings.effect === "Keyboard Control"){
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    slidesPerView: 1,
                                    spaceBetween: 30,
                                    keyboard: {
                                      enabled: true,
                                    },
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },
                                  });
                                }else if(response.data.animationSettings.effect === "lazy"){
                                  this.swiper = new Swiper('.swiper-container', {                                
                                    effect: 'lazy',
                                    lazy: true,
                                    navigation: {
                                      nextEl: '.swiper-button-next',
                                      prevEl: '.swiper-button-prev',
                                    },        
                                    pagination: {
                                      el: '.swiper-pagination',
                                      clickable: true,
                                    },
                                    
                                  });
                                }
                              }

                          })
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
        
      } else {
        video.pause();
      }
    }

		return (
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bannerContainerEcomm">
							<div className="row">
                 <swiper 
                    //effect="fade"
                    // spaceBetween={50}
                    // slidesPerView={3}
                    //navigation
                    //pagination={{ clickable: true }}
                    //scrollbar={{ draggable: true }}
                    //onSwiper={(swiper) => console.log(swiper)}
                    //onSlideChange={() => console.log('slide change')}
                 >
                  <div className="swiper-container swiperContainer">    
                    <div className="swiper-wrapper">                   
                         { this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.map((data,index)=>{
                        return(                                
                              <div key={index} className="item swiper-slide">
                                {data.BgVideo?
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding fullScreen-videoWrap">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  NOpadding">
                                      <video autoplay="true" muted loop="true" id="bannerVedio"
                                      src={data.BgVideo} type="video/mp4" width="100%" height="700px"/>
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
                          );
                        })
                      }                      
                    </div>
                    { this.state.blocks.animationSettings ?
                        this.state.blocks.animationSettings.showDots===true?
                          <div className="swiper-pagination"></div>
                        :null
                    : null
                    }
                    {
                      this.state.blocks.animationSettings ?
                        this.state.blocks.animationSettings.showNextPrevArrow==="true"?
                        <div>
                          <div className="swiper-button-prev"></div>
                          <div className="swiper-button-next"></div>
                        </div>
                        :null
                      :null
                    }
                    
                </div> 
              </swiper>               
            </div>
          </div>
                      					
							
		);
	}
}	 
