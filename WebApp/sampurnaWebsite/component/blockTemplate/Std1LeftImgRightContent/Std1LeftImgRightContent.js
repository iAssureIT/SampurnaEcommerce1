import React, { Component } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Style from './Std1LeftImgRightContent.module.css';

export default class Std1LeftImgRightContent extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "",
	        	blockSubTitle 			: "",
	        	blockDescription 		: "",
	        	fgImage 				: "",
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
	// console.log("==>",this.state.blocks);
		return (
			<div >	
				<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.stdBlockWrapper} style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					{/* {this.state.blocks.fgImage? */}
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <div className="abc">
                              	<img loading="lazy" src={this.state.blocks.fgImage} alt="" className="lazyload intro_img"  width="350" />
								  {/* <Image
								  	src={this.state.blocks.fgImage}
									alt=""
									className="lazyload intro_img"
									width="300"
									height="300"									
								  /> */}
                        	</div>
                        </div>
                    </div>
					
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.stdBlockTitledata}>
                            <h1 className="">{this.state.blocks.blockTitle}</h1>
                            <h3 className="">{this.state.blocks.blockSubTitle}</h3>
                            <div> 
                                <p dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                            </div>   
                        </div>
                    </div>
                    
                </div>
			</div>
		);
	}
}
