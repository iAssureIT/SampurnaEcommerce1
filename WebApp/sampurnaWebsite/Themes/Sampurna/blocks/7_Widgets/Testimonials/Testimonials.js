import React                from 'react';
import s                    from "./Testimonials.module.css";
import axios                from 'axios';
import $ 		                from 'jquery';


import StdBlockSeparatorBlue    from '../../8_Common/StdBlockSeparatorBlue/StdBlockSeparatorBlue.js';
import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';



// import Image from 'next/image';

export default class Testimonials extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle"        : "Client Testimonials",
            "blockSubTitle"     : "We are passionate about our work",
            "blockDescription"  : "Lorem Ipsum",
            "blockComponentName": "Testimonials",
            "blockType"         : "7_Widgets",
            "bgImage"           : "",
            "fgImage"           : "",

            "repeatedBlocks"    : [
                                
              { 
                  Title      : "Mr Paras Surana", 
                  SubTitle   : "Director - Prabandhan Management Consulting", 
                  Image      : "",
                  Link       : "", 
                  Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.",

              },

              { 
                  Title      : "Mr. Imran,", 
                  SubTitle   : "Director - Prabandhan Management Consulting", 
                  Image      : "",
                  Link       : "", 
                  Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.",
              },
                              
              { 
                  Title      : "Mr Mohd Imran,", 
                  SubTitle   : "Director - Prabandhan Management Consulting", 
                  Image      : "",
                  Link       : "", 
                  Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed sed risus pretium quam vulputate dignissim suspendisse.",

              }
																
                                ],

            "bgVideo"				      : "",
            "fgVideo"				      : "",
            "blockGroup"			    : "",
            "blockAppearOnPage"		: ""
          },

          blockID  :"",
          block_id :""
        };   
      }
    componentDidMount(){
    		$(document).ready(function(){
			  	$("#cItemHBpageTest div:nth-child(1)").addClass("active",{passive: true});
			});
              {
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                          this.setState({
                              blocks:response.data
                          });
                        }                  
                      })           
                    .catch(function(error){
                      console.log(error);
                  })
                }
          this.setState({
                    block_id:this.props.block_id
                  });
    }

	

	
	
	render() {
				return (
            <section className={"testimonialwrapper  col-12 "+s.testimonialwrapper}>
              <StdBlockSeparatorBlue />
              <StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
                <div className={ "col-12 col-lg-8 m-auto pb-5 testimonialBox "+s.testimonialBox}>
                  <div id="myCarouselT" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner" id="cItemHBpageTest"> 
                      { 
                       this.state.blocks.repeatedBlocks.map((result, index)=>
                       { 
                         return(
                            <div className={ "col-12  item  itemwrapp "+s.itemwrapp} key={index}>
                              <div className={ "carousel-caption "+s.carousel_caption}>
                                <div className={ "testContent "+s.testContent}>
                                  <p className={ "testContentDescription repeatedblockDescription "+s.testContentDescription} dangerouslySetInnerHTML={ { __html:result.Description}}></p>
                                </div>
                              </div>
                              <div className="col-12 m-auto pb-5 contWrapper">
                                <h3 className={ "testimonialWriter repeatedblockTitle "+s.testimonialWriter } dangerouslySetInnerHTML={ { __html:result.Title}}></h3>
                                <h4 className={ "writerDetails repeatedblockSubTitle "+s.writerDetails} dangerouslySetInnerHTML={ { __html:result.SubTitle}}></h4>
                                <div className={ "testimonialwrapper_img_area "+s.testimonialwrapper_img_area}> 
                                  <img loading="lazy" src={result.Image} alt="t1" className={ "img-fluid "+s.img_area_img } height={80}/> 
                                </div>
                              </div>
                            </div> 
                          ) 
                       }) 
                      } 
                    </div>
                    <div className={ "right carousel-control test_carousel_control_right "+s.carousel_control_right+ ' '+s.test_carousel_control_right} href="#myCarouselT" aria-label="right" data-slide="next">
                      <div className={ "arrow_rightWrapper "+s.arrow_rightWrapper}>
                        <div className={ "arrow_rightTest "+s.arrow_rightTest}></div>
                      </div> <span className="sr-only">Next</span> 
                    </div>
                  </div>
                </div>
                 <div className="col-12 col-lg-4 d-none d-xl-block m-auto pt-5">
                  <img loading="lazy" src={this.state.blocks.fgImage} className={"img-fluid imgTestimonial "+s.imgTestimonial} alt="Responsive image" height={150}/>
                </div>                  
            </section>	   
    );
	}
}
