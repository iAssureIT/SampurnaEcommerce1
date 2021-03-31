import React, { Component } 		from 'react';
// import 'bootstrap/js/collapse.js';

import "./ReturnPolicy.module.css";
import axios from 'axios';

export default class LegalNotice extends Component { 
	constructor(props) {
	    super(props);
	    this.state = {
	      blocks: {
	        "blockComponentName"  : "Typecomponent1",
	        "blockType"       : "simple",
	        blockTitle : "Legal Noticey",
	        blockDescription : "<p className=''>Unimandai grants you a limited right to access and use of this site. Do not modify it or any portion of it. Any downloading or copying of account information for the benefit of another merchant; or any use of data mining or similar data gathering and extraction tools. This site may not be reproduced, duplicated, copied, sold visited without written consent of unimandai. You can not use any trademark, logo, or other proprietary information (including images, text, page layout, or form) of the Site.Any unauthorized use terminates the permission or license granted by Unimandai.</p><div className='pageSubtitle'>Accounts</div><p>You have to register and login for placing orders on the Site. You have to keep your account and registration details current and correct for communications related to your purchases from the site. By agreeing to the terms and conditions, the shopper agrees to receive promotional communication and newsletters upon registration. The customer can opt out either by unsubscribing in 'My Account' or by contacting the customer service.</p><div className='pageSubtitle'>Pricing</div><p>All the products listed on the Site will be sold at MRP unless otherwise specified. The prices mentioned at the time of ordering will be the prices charged on the date of the delivery. Although prices of most of the products do not fluctuate on a daily basis but some of the commodities and fresh food prices do change on a daily basis. In case the prices are higher or lower on the date of delivery not additional charges will be collected or refunded as the case may be at the time of the delivery of the order.</p>",
	        fgImage: "/images/bgimage1.jpg",
	      },
	      blockID:"",
	      block_id:""
	    };   
	}
	componentDidMount(){
  
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
				<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 backColorEF marginTop180 returnPolicyWrapper">
					<div className="row">						
						<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
							
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mt20  ">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">										
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 returnPolicy ">
											<div className="pageTitle">{this.state.blocks.blockTitle}</div>
											<p className=""  dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
											               

										</div>	
									</div>
							</div>
						</div>
					</div>
				</div>
		);
	}
}
