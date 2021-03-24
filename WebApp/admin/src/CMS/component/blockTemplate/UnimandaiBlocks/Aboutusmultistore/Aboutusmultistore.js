import React, { Component } from 'react';
import "./Aboutusmultistore.css";
import axios from 'axios';

export default class Aboutusmultistore extends Component {
    constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockComponentName"  : "Typecomponent1",
        "blockType"       : "simple",
        blockTitle : "Unicorn Fresh",
        blockSubTitle : "	We often take care of our loved ones, family and friends. Always asks them to avoid junk food and street food. But ever we noticed, when we buy vegetables or fruits, they are on open carts, unhygienic mandi or on polluted streets.Thinking on that, we have launched sanitized, hygienic and packed vegetables and fruits for you.Our products are washed with ozonised water which removes fungus, bacteria, chemicals and colours over it. Then they are packed with proper hygienic ways. There is no human interference after packing till you unpack at your kitchen.So stop consuming poison, eat sanitized.Unimandai has raised the bar even higher for others emulate. It is one of the leading fruits and vegetables supplier chain in Pune. The difference lies in the sheer scale of operations at Unimandai.All the standard sanitizing and packaging procedures are in line with the Total Quality Management principles and conform to the quality standards set by us.At any given point in time Team Unimandai can handle customers  ensuring its flawless service.",
        blockDescription : "<h3 className='mb50'>The Unimandai Promise</h3><p className='textparaabout1'>We promise that buying fruits and vegetables from us; will be an exceptional experience.We promise that, wherever humanely possible, we will meet and exceed all customer needs & expectations.We promise that, in the unfortunate occasions when problems occur, we will own them and solve them with the least inconvenience to our customers.We promise that all our people will develop and maintain habits of excellence in all that they do.</p><h3 className='mb50'>Message from Founders</h3><p className='textparaabout'> We are nothing without our customers. We are priceless because they choose to invest their faith in us.Their continued patronage and complete conviction in our services inspires us to seek better solutions every day.  This commitment is the corner stone of our Quality Policy and we strive to achieve it by putting into place a Quality System which adheres to the Industry Standard. Every employee at Unimandai is continually involved in achieving the company’s core objectives. we do not have Impossible word in our dictionary. What we have is the vision, the commitment and the expertise to become a leader. We are not competing with anyone. Our competition is with us only. We are stand alone.    Our motto is to use our in-depth and profound knowledge of the market to ensure a fair products. To provide personalized service, on-schedule deliveries and reliable quality at competitive prices at all times through our expertise while making it a working pleasure for our staff, vendors and our customers. Our long-term success requires a total commitment to exceptional standards of performance and productivity, to working together effectively, and to a willingness to embrace new ideas and learn continuously.To succeed also requires, we believe, the highest standards of corporate behavior towards everyone we work with, the communities we touch, and the environment on which we have an impact. This is our road to sustainable, profitable growth, creating long-term Success and Prosperity.<br/></p>",
        "repeatedBlocks"    : [
                      {
                        	"Title"         : "200+",
                          	"SubTitle"    : "Products"
                      }, 
                      {
                        	"Title"         : "300+",
                          	"SubTitle"    : "Sellers"
                      },
                      {
                        	"Title"         : "Pune",
                          	"SubTitle"    : "City"
                      }
                    ],
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
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<div className="row">
					<div className="col-lg-12">
						<h2 className="col-lg-12 mt50">{this.state.blocks.blockTitle}</h2>
						<div className="col-lg-10 col-lg-offset-1">
							<p className="col-lg-12 mt20 "  dangerouslySetInnerHTML={ { __html: this.state.blocks.blockSubTitle } }></p>
						</div>
					</div>
					<div className="col-lg-10 col-lg-offset-1 mt50">
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-inbox multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>{this.state.blocks.repeatedBlocks[0].Title}</b></h3>
						  <h4>{this.state.blocks.repeatedBlocks[0].SubTitle}</h4>
						  </div>
						</div>
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-shopping-cart multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>{this.state.blocks.repeatedBlocks[1].Title}</b></h3>
						  <h4>{this.state.blocks.repeatedBlocks[1].SubTitle}</h4>
						  </div>
						</div>
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-globe multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>{this.state.blocks.repeatedBlocks[2].Title}</b></h3>
						  <h4>{this.state.blocks.repeatedBlocks[2].SubTitle}</h4>
						  </div>
						</div>
					</div>
					
					<div className="col-lg-10 col-lg-offset-1">
							<p  dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }></p>
							<p className="pull-right mt50 mb50">
								Thank You <br/>
								Mandar Pawar <br/>
								Founder, Unimandai 
							</p>
							
					</div>
					
				</div>
			</div>
		);
	}
}