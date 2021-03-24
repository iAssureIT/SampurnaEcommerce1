import React from 'react';
import './WebSiteNextLevel.css';
import axios from 'axios';


export default class WebSiteNextLevel extends React.Component {

constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "Take Website to Next Level!",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "With a thorough discovery, we understand more about you, your company's vision, your brand, your unique business strategy & asipiration to portray your business in market. Strategy & planning is everything. We outline your project, create milestones, and agree on priorities. We have the experience and knowledge needed to create a smart strategy for your business to solve your digital problems.",
	        	fgVideo 				: "https://testtruusmiles.s3.ap-south-1.amazonaws.com/InShot_12.mp4",
	        	fgImage 				: "/images/Webdev14.png",
	        	bgImage 				: "/images/Webdev13.png",
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
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 webWrapper" >
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-10 col-lg-offset-1 col-md-10 col-sm-12 col-xs-12 webBox " style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}> 
                        	<h1 className="text-center">{this.state.blocks.blockTitle}</h1>
                   			<img src={this.state.blocks.fgImage} alt="awardn" className=" img-responsive"/>
                        </div>
                    </div>
                      
                </div>
			</div>
		);
	}
}
