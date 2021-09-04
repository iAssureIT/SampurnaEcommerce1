import React from 'react';
import axios from 'axios';
import $    from 'jquery';
import "./CompanyProjects.css";


export default class CompanyProjects extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		  blocks: {
			"blockTitle"        : "<b>COMPANY PROJECTS</b>",
			"blockSubTitle"     : "WHAT WE PROVIDE FOR CLIENTS",
			"blockDescription"  : '',
			"blockComponentName": "",
			"blockType"         : "",
			"bgImage"           : "/images/1.png",
            "fgImage"           : "/images/37.png",

            "repeatedBlocks"    : [
								{ 
									Title: "<b>Etiam Commodo Ante Sed Nunc Porta<b/>", 
									SubTitle: "Delivery 3 Day", 
									Link: "", 
									Image: "/images/cp1.png",
									Description: "We have indepth expertise in developing large scale Enterprise grade web & mobile apps."
                                },
                                
								{ 
									Title: "<b>Etiam Commodo Ante Sed Nunc Porta</b> World", 
									SubTitle: "Delivery 3 Day", 
									Link: "", 
									Image: "/images/cp2.png",
									Description: "Specially made plans for Startups that are highly cost effective & value added services. Our quotations are absolutely unbeatable in the IT Industry."
                                },
                                
								{ 
									Title: "<b>Etiam Commodo Ante Sed Nunc Porta</b>", 
									SubTitle: "Delivery 3 Day", 
									Link: "", 
									Image: "/images/cp3.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
                                },

                                { 
									Title: "<b>Etiam Commodo Ante Sed Nunc Porta</b>", 
									SubTitle: "Delivery 3 Day", 
									Link: "", 
									Image: "/images/cp4.png",
									Description: "Boost Your eCommerce business with our Flexible, Scalable & Robust eCommerce Platform AutoPilot with the blazing fast performance and SEO Friendly Online Stores"
								}
			],
	
		  
			"bgVideo"			: "",
			"fgVideo"			: "",
			"blockGroup"		: "",
			"blockAppearOnPage"	: ""
          },
          
			blockID             :"",
			block_id            :""
        }; 
        
      }
      
	componentDidMount(){
	/*console.log("==>",this.props.block_id);*/
			 
				 if (this.props.block_id) {
				 axios
					.get('/api/blocks/get/'+this.props.block_id)
					.then((response)=>{
						if(response.data){
							// console.log("ListofServices =",response.data);
						  this.setState({
							  blocks:response.data
						  });
						}                  
					  })           
					.catch(function(error){
					  console.log(error);
						if(error.message === "Request failed with status code 401")
						  {
							  // swal("Your session is expired! Please login again.","", "error");
						  }
				  })
				}
		  this.setState({
					block_id:this.props.block_id
				  });

			$(document).ready(function ($) {
            $("#PAD12").addClass("loaded");
            var l = $("#PAD12 > ul li").length;
            for (var i = 0; i <= l; i++) {
            var room_list = $("#PAD12 > ul li").eq(i);

            $(room_list).find(".company-project > img").css({
            "width": "100%"
            });
            }
            $("#PAD12 > ul li.start").addClass("active");
            $("#PAD12 > ul li").on("mouseenter", function () {
            $("#PAD12 > ul li").removeClass("active");
            $(this).addClass("active");
			});
		});

	}


	

	render() {

		return (
            <section className="companyProjWrapper col-lg-12">
              <div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 specialityheading">
					<div className="text-center TitleWrapper">
						<span className="h2subTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></span>
						<h2 className="h2title" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h2>
					</div>
				 </div>
                 
				 <div className="row">
					<div className="company-projects col-lg-12">
					<div className="company-projects-list loaded col-lg-12" id="PAD12">
                    <ul className="col-lg-12">
				 {
                		this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
						this.state.blocks.repeatedBlocks.map((data, index)=>{
                					return(
					
										
								<li className="col-lg-3"key={index}>
									<div className="row">
									<div className="company-project">
										<img  src={data.Image} className="" alt="" />                                    
										<div className="project-detail">
											<span>
												<i dangerouslySetInnerHTML={{ __html: data.SubTitle } }></i>
											</span>
											 <h4>
												<a dangerouslySetInnerHTML={{ __html: data.Title } }></a>
											 </h4>
										</div>
									</div>
									</div>
								</li>
								
					
					 		);
						})
					:
					null
				}
					  </ul>
					</div>
				 </div>
			  </div>
              </div>
			</section>
        )
			 
	

    }
}