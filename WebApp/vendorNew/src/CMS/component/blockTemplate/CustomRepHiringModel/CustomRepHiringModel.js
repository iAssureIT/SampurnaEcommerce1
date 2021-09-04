import React from 'react';
import axios from 'axios';

import './CustomRepHiringModel.css';
export default class CustomRepHiringModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "OUR HIRING <b> MODELS </b>",
            
            "blockSubTitle": "Mobile App Development",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "https://unimandai.s3.amazonaws.com/CMS/costadvantage_20201015191543.png",
            "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                                
                               { 
									Title: "Dedicated Team", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
									Description: "Dedicated team basically means that the whole team will be made available to the client. You have the whole charge for the whole"
								},
								{ 
									Title: "Project Based Model", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
									Description: "In this model you hire a team for a specific project or timeline. This is quite a user friendly model and is easy comparatively quite easy on"
								},
								{ 
									Title: "Hourly Based Model", 
									SubTitle: "", 
									Link: "", 
									Image: "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
									Description: "This type for model is basically pre-ferred by startup companies or project in which development time required is quite low. So, for a"
								}
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          blockID:"",
          block_id:""
        };   
    }

    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
              if(this.props.block_id){
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
                  })
                }
          this.setState({
                    block_id:this.props.block_id
                  });
    }
    
	render() {
		return (
			<div className="CustomRepHiringModelWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12 dashboxwrapper">
                        <ul className="dashBox">
          					<li className="dash1"></li>
          			    	<li className="dash2"></li>
          				    <li className="dash3"></li> 
          			    </ul>
                    </div>
                </div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="text-center margin20">
                        <h1 className="" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
                    </div>
				</div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding1">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding1">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding RepboxT1 RepboxT1BxShadow">
								<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12"> 
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 iconCircleCRHM">
									   <img src={this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Image : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"} alt="enteprice" className="innerCircleCRHM img-responsive" /> 
								    </div> 
								    </div> 
									<div className="sptextBox1CRHM col-lg-12 col-md-12  col-sm-12 col-xs-12">
									    <b><h2 className="text-center" dangerouslySetInnerHTML={{ __html: this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Title : "" } }></h2></b>
										<div className="col-lg-12 col-md-12">
										   <p className="paragraph"  dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks[0] ? this.state.blocks.repeatedBlocks[0].Description :"" } }></p>
									    </div>
												   {/* <p className="pull-right rmore"><u>Read More >></u></p>     */}
									</div>   
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding RepboxT1 RepboxT1Active">
								<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12"> 
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 iconCircleCRHMMiddle">
									   <img src={this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Image : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"} alt="enteprice" className="innerCircleCRHMMiddle img-responsive" /> 
								    </div> 
								    </div> 
									<div className="sptextBox1CRHM col-lg-12 col-md-12  col-sm-12 col-xs-12">
									    <b><h2 className="text-center" dangerouslySetInnerHTML={{ __html: this.state.blocks.repeatedBlocks[1] ?  this.state.blocks.repeatedBlocks[1].Title : "" } }></h2></b>
										<div className="col-lg-12 col-md-12">
										   <p className="paragraph"  dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks[1] ? this.state.blocks.repeatedBlocks[1].Description : "" } }></p>
									    </div>
												   {/* <p className="pull-right rmore"><u>Read More >></u></p>     */}
									</div>   
								</div>
							</div>
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding RepboxT2 RepboxT2BxShadow">
								<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12"> 
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 iconCircleCRHM">
									   <img src={this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Image : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png"} alt="enteprice" className="innerCircleCRHM img-responsive" /> 
								    </div> 
								    </div> 
									<div className="sptextBox1CRHM col-lg-12 col-md-12  col-sm-12 col-xs-12">
									    <b><h2 className="text-center" dangerouslySetInnerHTML={{ __html: this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Title : "" } }></h2></b>
										<div className="col-lg-12 col-md-12">
										   <p className="paragraph"  dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks[2] ? this.state.blocks.repeatedBlocks[2].Description : "" } }></p>
									    </div>
												    {/* <p className="pull-right rmore"><u>Read More >></u></p>    */}
									</div>   
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
