import React from 'react';
import axios from 'axios';
import $ 		 from 'jquery';
import Image from 'next/image';
import Link  from 'next/link';
import SwiperCore, { Navigation, Pagination, EffectFade,EffectFlip, EffectCoverflow, EffectCube, Parallax, Autoplay, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import Style from './Banner.module.css';
import getConfig from 'next/config';
// import HelpAndSupport from '../../StaticBlocks/HelpAndSupport/HelpAndSupport.js';
import CategoriesBlock from '../../StaticBlocks/CategoriesBlock/CategoriesBlock1.js';
const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;

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
            "bgImage": "",
            "fgImage": "",
            "repeatedBlocks": [],
            animationSettings : {
              showDots          : true,
              swipeable         : true,
              draggable         : true,
              infinite          : true,
              autoPlaySpeed     : 2000,
              showNextPrevArrow : "true",
              effect            : "flip",
              },
            "bgVideo"				      : "",
            "fgVideo"				      : "",
            "blockGroup"			    : "",
            "blockAppearOnPage"		: "",
            
          },
          additionalTransfrom : 0,
          blockID:"",
          block_id:"",
          projectName        : "",
          bannerLoading      : true,
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
      // this.swiper = new Swiper('.swiper-container', {        
      //   effect: 'flip',
      //   grabCursor: true,                       
      //   navigation: {
      //     nextEl: '.swiper-button-next',
      //     prevEl: '.swiper-button-prev',
      //   },        
      //   pagination: {
      //     el: '.swiper-pagination',
      //     clickable: true,
      //   },
      // });
    }

      $(document).ready(function(){		

            $("#cItemHBpage div:nth-child(1)").addClass("active");

        });
              if(this.props.block_id){              
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                          // console.log("Banner response.data============",response.data);
                          
                          this.setState({
                            blocks:response.data,
                            bannerLoading : false,
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
    // console.log("this.state.blocks.repeatedBlocks===",this.state.blocks.repeatedBlocks);
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
						<div className={"col-12 bannerContainerEcomm " +Style.bannerContainerEcomm}>
							<div className="row">                 
                  <div className={"swiper-container col-12 " +Style.swiperContainer}>    
                    <div className="swiper-wrapper col-12 NoPadding">                   
                         { 
                         !this.state.bannerLoading? 
                         this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.map((data,index)=>{  
                                         
                         return(                        
                              <div key={index} className={Style.item +" swiper-slide col-12 NoPadding"}>
                                {data.BgVideo?
                                  <div className={"col-12 " +Style.NOpadding +" " +Style.fullScreen_videoWrap}>
                                    <div className={"col-12 " +Style.NOpadding}>
                                      <video autoplay="true" muted loop="true" id="bannerVedio"
                                      src={data.BgVideo} type="video/mp4" width="100%" height="700px"/>
                                    </div> 
                                    <div className={"col-12 " +Style.video_overlay}></div>  
                                  </div>                                 
                                :null
                                }
                                {data.BgImage?
                                  <img loading="lazy" className={"img img-responsive lazyload "  +Style.BgImg} src={data.BgImage} alt="banner" />
                                  // <Image
                                  //     src={data.BgImage}
                                  //     className={Style.img}
                                  //     height ={500}
                                  //     width={1200}
                                  //     layout="responsive"
                                  //   />	
                                :null}
                                {data.FgImage !== null?
                                <div className={"col-12 "}>
                                  <div className={"col-10 col-sm-6 col-xs-12 " +Style.titleWrapper}>
                                    <div className={"col-12  " +Style.blockTitle}>{data.Title}</div>	
                                    <div className={"col-12 globalBannerTitle " +Style.blockSubTitle}>{data.SubTitle}</div>
                                  </div>                                  
                                  <div className={"col-6 col-xl-5 col-xs-12 pull-right " +Style.blockTitle}>                               
                                    {data.FgImage?
                                    <img className={"img img-responsive " +Style.FgImg} src={data.FgImage!==""?data.FgImage:null} alt="banner" />	
                                    :null
                                    }
                                    {/* <Image
                                      src={data.FgImage!==""?data.FgImage:null}
                                      className={"img img-responsive"+Style.FgImg}
                                      height ={300}
                                      width={300}
                                    />	 */}
                                  </div>	                                  
                                </div>	
                                :
                                <div className={"col-12 "}>
                                { index % 2?
                              
                                <div className={"col-10 col-xs-12 pull-right " +Style.titleWrapper +" " +Style.evenBlock}>
                                  <div className={"col-12 " +Style.blockTitle}>{data.Title}</div>	
                                  <div style={{marginBottom : '0px'}} className={"col-12 globalBannerTitle " +Style.blockSubTitle}>{data.SubTitle}</div>        
                                  {/* <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 "}>                         
                                      <a href={data.Link} className={"animated-button BannerBtn " +Style.BannerBtn }>Shop Now</a>
                                  </div>   */}
                                  <div className={"col-12"}>                         
                                    <div className="col-12">
                                        {/* <a href={data.Link} className="btn annimatedBtn btn1 BennerRightBtn">Shop Now</a> */}
                                        {/* <Link href={data.Link}>
                                          <a className="btn annimatedBtn btn1 BennerRightBtn">Shop Now</a>
                                        </Link> */}
                                    </div>   
                                  </div>                    
                                </div> 
                                :
                                <div className={"col-10 col-sm-11 col-xs-12 pull-left " +Style.titleWrapper +" " +Style.OddBlock}>
                                  <div className={"col-12 " +Style.blockTitle}>{data.Title}</div>	
                                  <div style={{marginBottom : '30px'}} className={"col-12 globalBannerTitle " +Style.blockSubTitle}>{data.SubTitle}</div>        
                                  {/* <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 middle"}>              
                                    <a href={data.Link} className={"animated-button BannerBtn " +Style.BannerBtn }>Shop Now</a>
                                  </div>  */}
                                  <div className={"col-12 pull-left"}>                         
                                    <div className="middle">
                                        {/* <a href={data.Link} className="btn annimatedBtn btn1">Shop Now</a> */}
                                        {/* <Link href={data.Link}>
                                          <a className="btn annimatedBtn btn1">Shop Now</a>
                                        </Link> */}
                                    </div>   
                                  </div>                              
                                </div>
                                }
                                </div>
                                }						    	
                              </div>  
                                                         
                          );
                        })
                        
                        :
                          <div className="col-2 offset-5 loading">
                              <img src="/images/eCommerce/loader.gif" className="col-12 lazyload" loading="lazy"></img>
                              {/* <Image
                                src={"/images/loader.gif"}                                
                                height ={400}
                                width={400}
                              />	 */}
                          </div> 
                      }                      
                    </div>
                    
                    {
                      this.state.blocks.animationSettings ?
                        this.state.blocks.animationSettings.showNextPrevArrow==="true"?
                        <div className={"nextPreArrows hidden-xs " +Style.nextPreArrows}>
                          <div className={"swiper-button-prev swiperPrevBtn " +Style.swiperPrevBtn}></div>
                          <div className="swiper-button-next"></div>
                        </div>
                        :null
                      :null
                    }

                    { this.state.blocks.animationSettings ?
                        this.state.blocks.animationSettings.showDots===true?
                          <div className="swiper-pagination"></div>
                        :null
                    : null
                    }
                    
                </div>
            </div>
            {/* < HelpAndSupport /> */}
            {/* <CategoriesBlock /> */}
          </div>
                      					
							
		);
	}
}	 