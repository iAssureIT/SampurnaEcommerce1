import React from 'react';
import axios from 'axios';


export default class Typecomponent5 extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      blocks:"",
      blockID:"",
      block_id:""

    };    
  }
componentDidMount(){
// console.log("==>",this.props.block_id);
          {
             axios
                .get('http://iogapi.iassureit.com/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                /*var blocks = this.state.blocks;
                blocks.push(response.data);*/
                this.setState({
                  blocks:response.data
                  });
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
			<div>
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              	{/*<div class="container">
	                	<div class="moduletable">           
			                <ul class="breadcrumb">
			                    <li class="active">&nbsp;</li>
			                    <li>
			                    	<a href="/" class="pathway">Home</a>
			                    	<span class="divider">
			                    	<img src="/media/system/images/arrow.png" alt=""/></span>
			                    </li>
			                    <li>
			                    <a href="/about-us" class="pathway">About Us</a>
			                    	<span class="divider"><img src="/media/system/images/arrow.png" alt=""/></span>
			                    </li>
			                    <li class="active"><span>Management Team</span>
			                    </li>
			                </ul>
	                    </div>
	                </div>*/}
	            </div> 
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              <div className="row">
	                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden-sm hidden-xs">
	                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 img1">
	                      <img src={this.state.blocks.bgImage} alt="" className="plane" />
	                 </div>
	                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 blck blck1height b1width">
	                              <h2 className="line_subhead textcolorblue vision_align1">{this.state.blocks.repeatedBlocks.Title}</h2>
	                              <p className="text-justify vision_align">
		                              <b dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks.Description } }>
		                              {/*To be a global market leader in Intelligent Support
		                              Systems for Oil and Gas Industry.*/}
                      					

		                              </b>
	                               </p>
	                               </div>
	                               <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 blck blck2height b2width">
	                               <h2 className="line_subhead textcolorblue mission_align">{this.state.blocks.repeatedBlocks.Title}</h2>
	                               <p className="text-justify">
	                                  <b dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks.Description } }>
	                                  {/*Nurture a talented team of professionals to provide
	                                  best-in-class consulting and implementation servic-
	                                  es improving the profitability of our valued clients
	                                  across the globe.*/}
	                                  </b>
	                               </p>
	                               </div>                                    
	                          </div>
	                      </div>
	                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden-md hidden-lg">
	                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 img1">
	                      <img src="/images/visionabout.png" alt="" className="plane" />
	                 </div>
	                      <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 blck1 blck1height1 b1width">
	                              <h2 className="line_subhead textcolorblue vision_align1">{this.state.blocks.repeatedBlocks.Title}</h2>
	                              <p className="text-justify vision_align">
	                              <b dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks.Description } }>
		                            {/*  To be a global market leader in Intelligent Support
		                              Systems for Oil and Gas Industry.*/}
	                              	</b>
	                               </p>
	                               </div>
	                               <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 blck1 blck2height1 b2width">
	                               <h2 className="line_subhead textcolorblue mission_align">{this.state.blocks.repeatedBlocks.Title}</h2>
	                               <p className="text-justify">
	                                  <b dangerouslySetInnerHTML={ { __html: this.state.blocks.repeatedBlocks.Description } }>
	                                  {/*Nurture a talented team of professionals to provide
	                                  best-in-class consulting and implementation servic-
	                                  es improving the profitability of our valued clients
	                                  across the globe.*/}
	                                  </b>
	                               </p>
	                               </div>                                    
	                          </div>
	                      </div>  
	                </div>
	            </div>
           </div> 
		);
	}
}
