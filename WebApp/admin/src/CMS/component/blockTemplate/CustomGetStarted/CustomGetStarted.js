import React from 'react';
import axios from 'axios';
import './CustomGetStarted.css';

export default class CustomGetStarted extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "Ready To Get Started?",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "We smartly leverage the flexibility and dynamism of ReactJS for building interactive UI for large scale enterprise appli-cations. Our developers have 3+ years of an average experi-ence and handled over 2500+ global clients.",
	        	fgImage 				: "/images/StaffAgum7.png",
	        	bgImage 				: "/images/StaffAgum8.png"
	      	},
	      	blockID 		:"",
	      	block_id 		:""
	    }; 

    
	}
	componentDidMount(){
	/*console.log("==>",this.props.block_id);*/
	         if (this.props.block_id) {
	             axios
	                .get('/api/blocks/get/'+this.props.block_id)
	                .then((response)=>{
	                    if(response.data){
							// console.log("==.response.data.blocks>",response.data.bgImage);

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
	}

	render() {
		return (
			<div className="CustomGetStartedWrapMain">
				<div className="CustomGetStartedWrap col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 marginTop5per">
						<h1 className="" dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></h1>

                           
                            <div> 
                                <p  className="DescFontCGS" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                            </div>   
                        </div>
                    </div>
                    <div className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1  col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <img src={this.state.blocks.fgImage} alt="" className="spbox_imga1" />
                        </div>
                    </div>
                    
                </div>

		</div>

		
		);
	}
}
