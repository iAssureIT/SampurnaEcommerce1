import React from 'react';
import axios from 'axios';

export default class Std4RightVideoLeftContent extends React.Component {
		constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "This is Block Title",
	        	blockSubTitle 			: "This is Block sub Title",
	        	blockDescription 		: "This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
	        	fgVideo 				: "https://testtruusmiles.s3.ap-south-1.amazonaws.com/InShot_12.mp4",
	        	fgImage 				: "/images/imgIcon.png",
	        	bgImage 				: "/images/header3.jpg",
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
					
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 className="">{this.state.blocks.blockTitle}</h1>
                            
                            <h3 className="">{this.state.blocks.blockSubTitle}</h3>
                            
                            <div> 
                                <p dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                            </div>   
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
						<video width="100%"  controls  className=""  src={this.state.blocks.fgVideo} type="video/mp4" alt="video" />
                    </div>
                    
                </div>
			</div>
		);
	}
}
