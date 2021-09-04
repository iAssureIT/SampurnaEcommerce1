import React from 'react';
import axios from 'axios';
import './WantStartProject.css';

export default class WantStartProject extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "WANT TO START A PROJECT ?",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "We collabrate and work  closely to deliver the perfect  combination of design and usablity.",
	        	fgImage 				: "/images/WantToStarFg.png",
	        	bgImage 				: "/images/WantToStartBg.png"
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
				<div className="WantStartProjectWrap col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
					
                  
                    <div className="col-lg-5 col-md-5  col-sm-12 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <img src={this.state.blocks.fgImage} alt="" className="wspbox_imga1" />
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-md-7 col-sm-12 col-xs-12">
                        <div className="col-lg-10 col-sm-12 col-xs-12 wantStartProjectTitle">
						<h1 className="" dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></h1>

                           
                            <div> 
                                <p  className="DescFontWSP" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                            </div>   
                        </div>
                    </div>
                </div>

			
		);
	}
}
