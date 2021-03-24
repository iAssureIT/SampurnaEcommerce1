import React from 'react';
import axios from 'axios';


export default class Strategy extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "SYSTEMATIC STRATEGY & PLANNING",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "With a thorough discovery, we understand more about you, your company's vision, your brand, your unique business strategy & asipiration to portray your business in market. Strategy & planning is everything. We outline your project, create milestones, and agree on priorities. We have the experience and knowledge needed to create a smart strategy for your business to solve your digital problems.",
	        	fgVideo 				: "https://testtruusmiles.s3.ap-south-1.amazonaws.com/InShot_12.mp4",
	        	fgImage 				: "/images/Flow.png",
	        	bgImage 				: "",
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
			<div>	
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-sm-12 col-xs-12"> 
                            	<h1 className="text-center">{this.state.blocks.blockTitle}</h1>
                                <p className="text-center" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
	                   			<img src={this.state.blocks.fgImage} alt="awardn" className=" img-responsive"/>
                            </div>

                        </div>
                    </div>     
                </div>
			</div>
		);
	}
}
