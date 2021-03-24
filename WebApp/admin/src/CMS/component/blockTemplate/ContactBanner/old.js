import React from 'react';
import "./ContactBanner.css";
import axios from 'axios';

export default class ContactBanner extends React.Component {
              

	constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>CONTACT US</b>",
            
            "blockSubTitle": "We are passionate about our work",
            "blockDescription": "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages,<p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software </p>",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "/images/contactbanner.png",
            "fgImage": "/images/c01.png",
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
             if(this.props.block_id) {
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
			<div className="contacwrapp">
				<div className="cAwrapper" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contatcbannertext ">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 contactbannertitlewrapp ">
						 <div className="bText"dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div> 
							
					  </div>
					  <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 cbannerptext"> 
					  <img src={this.state.blocks.fgImage} alt="c01" className="contactimg img-responsive" />
					</div>
					</div> 

					
					
			</div>
				
			</div>
		);
	}
}
