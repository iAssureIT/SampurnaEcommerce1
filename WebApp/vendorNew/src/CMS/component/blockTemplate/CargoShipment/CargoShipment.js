import React from 'react';
import axios from 'axios';
import "./CargoShipment.css";

export default class CargoShipment extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        	blockComponentName  	: "Std1LeftImgRightContent",
	        	blockType		       	: "simple",
	        	blockTitle 				: "ABOUT CARGO SHIPMENT",
	        	blockSubTitle 			: "SAFE & AFFORDABLE CARGO",
	        	blockDescription 		: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nasce culus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cum sociis natoq atibus et magnis dis parturient montes, nascetur ridiculus mus.",
	        	fgImage 				: "/images/2.png",
	        	bgImage 				: "/images/header3.jpg"
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
	// console.log("==this.state.blocks>",this.state.blocks);

		return (
			<div>	
				<div className="cargoWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
					
                    <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div className="ShipMainBlk col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h6 className="shipSubTitle">{this.state.blocks.blockSubTitle}</h6>
                            <h1 className="shipTitle">{this.state.blocks.blockTitle}</h1>
                            
                            <div className="shipDescrp"> 
                                <p dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
                            </div>
                            <div className="NumBox col-lg-6">
                            <i className="fa fa-bus"></i>
                            <span className="num">1500000</span>
                            <div className="numDetail">Parcels Shipped Safely</div>
                            </div> 
                            <div className="NumBox col-lg-6">
                             <i className="fa fa-building"></i>
                            <span className="num">1200</span>
                            <div className="numDetail" >Cities Served Worldwide</div>
                            </div> 
                            <button className="btn btn-primary unldBtn col-lg-4">
                            <i className="fa fa-plane"></i>
                            ABOUT UNLOAD
                            </button>  
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                        <div className="imgBox col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <img src={this.state.blocks.fgImage} alt="" className="intro_img"  width="450" />
                        </div>
                    </div>
                    
                </div>
			</div>
		);
	}
}
