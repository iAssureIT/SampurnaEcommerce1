import React from 'react';
import "./ServicesBanner.css";
import axios from 'axios';
export default class ServicesBanner extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "OUR",
            "blockSubTitle": "<b>SERVICES</b>",
            "blockDescription": "With Cutting Edge Technology Expertise, <br/> Innovation & Creativity",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/27.png",
            "fgImage": "/images/28.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "Sample 5", 
                                    SubTitle: "", 
                                    Image: "/images/4.png",
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
          block_id:""
        };   
      }
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
              {
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
			
				<div className="banerpageheight">
				   	<div className="banerSBheight" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
						   
					    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					    	 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 "> 
							      <div className="mtop100SB"> 
                      <div className="h1TitleSB" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div><br/>
                      <div className="h2TitleSB" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div><br/>
                      <div className="h3TitleSB" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div>
							    </div>	  
					    	 </div> 
					  	  <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 row">
							 <img className="bannerImgSB img-responsive" src={this.state.blocks.fgImage} alt="Bannerpng"/>
						  </div>  
						</div>  

					</div>
					
						
				</div>
								
			
				

);
}
}
				