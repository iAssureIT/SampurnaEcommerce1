import React from 'react';
import "./AboutBanner.css";
import axios from 'axios';


export default class AboutBanner extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
          blocks: {
		      	"blockTitle": "<b>ABOUT US </b>",
		      	"blockSubTitle": "We are passionate about our work",
            "blockDescription": "You need eCommerce website thay is supeb beautiful, user friendly & that grows your business exponetially",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/about1.png",
            "fgImage": "/images/us2.png",
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
			<div className="aboutbannerwrapp">
				<div className="ABOUTbanerheight" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
				   
					 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 aboutwannerwrpp">
						     <div className="h1Titleus" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div><br/>
							  <div className="h2Titleus" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
						 </div>
						 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 aboutfgwrapp">
							 <img src={this.state.blocks.fgImage} className="rightIMGUS img-responsive"></img>

						 </div>
					 </div>
			   </div> 
			</div>
		);
	}
}
					