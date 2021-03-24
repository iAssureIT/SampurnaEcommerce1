import React from 'react';
import "./eCommerceBanner.css";
import axios from 'axios';

export default class eCommerceBanner extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
          blocks: {
		      	"blockTitle": "eCommerce",
		      	"blockSubTitle": " <b>WEBSITE DEVELOPMENT </b>",
            "blockDescription": "You need eCommerce website thay is supeb beautiful, user friendly & that grows your business exponetially",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/contactbanner.png",
            "fgImage": "/images/ecom2.png",
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
				
						<div  className="ecbwrapper">
							<div className="ecombgimg" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
								 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
						              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 eocmbgwrapp">
							            <div className="h1Titlecom0"  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
								        <div className="h2Titlecom00" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
										 <div className="h3Titlecom0000" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div>
							         </div> 
							          <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 Imgwrapp">
							              <img className="bannerImgecom img-responsive" src={this.state.blocks.fgImage} alt="Bannerpng"/>
						           </div>  
							    </div> 
							</div>	 
						</div>
						
						
					
				
			
				
			);
	}
}
