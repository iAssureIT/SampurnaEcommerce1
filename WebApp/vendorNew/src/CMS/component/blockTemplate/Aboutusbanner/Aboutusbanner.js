import React, { Component } from 'react';
import "./Aboutusbanner.css";
// import Aboutus_Banner from '/images/About_us_Banner.png';
import axios from 'axios';

export default class Aboutusbanner extends Component {
    constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockComponentName"  : "Typecomponent1",
        "blockType"       : "simple",
        blockTitle : "ABOUT US",
        blockDescription : "This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        bgImage: "/images/About_us_Banner.png",
      },
      blockID:"",
      block_id:""
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
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<div className="row">
					<div className="aboutusbanner" style={{'background' : "url(" + this.state.blocks.bgImage+")"}}>{/* style={{'background' : "url(" + /images/About_us_Banner.png+")"}}*/}
						<p className="col-lg-12 aboutheading">{this.state.blocks.blockTitle}</p>
						<ul className="breadcrumb aboutbread">
						  <li><a href="/" title="GO TO HOME PAGE">HOME</a></li>
						  <li>{this.state.blocks.blockSubTitle}</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}