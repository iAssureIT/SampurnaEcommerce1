import React from 'react';

import '../../../sites/currentSite/blocks/WhychooseUs.css';
import icon_choose_1 	from '../../../sites/currentSite/images/icon-choose-1.png';
import icon_choose_2 	from '../../../sites/currentSite/images/icon-choose-2.png';
import icon_choose_3 	from '../../../sites/currentSite/images/icon-choose-3.png';
import icon_choose_4 	from '../../../sites/currentSite/images/icon-choose-4.png';
import icon_choose_5 	from '../../../sites/currentSite/images/icon-choose-5.png';
import icon_choose_6 	from '../../../sites/currentSite/images/icon-choose-6.png';
// import images_choose 	from "../../../sites/currentSite/images/images-choose.jpg";
import images_choose 	from "../../../sites/currentSite/images/Why_Choose_us.png";

import one 						from '../../../sites/currentSite/images/1.jpg';

export default class OurCources extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"OurCources"		: [
								{
									blogDate:"DEC 17,2016",
									blogTitle:"100% Fresh ",
									blogPara:"Fruits and vegetables are an important part of a healthy diet. That’s why we always provide Fresh products. We believe in “Good Quality” of products.", 
									bloggerImg:one,
									blogsubimg:icon_choose_1,
								},
								{
									blogDate:"DEC 17,2016",
									blogTitle:"Sanitized",
									blogPara:"We ensure you with sanitized fruits and vegetables, which are sanitized with ozone wash. It removes pesticides, fungus and bacteria over it.",								
									blogsubimg:icon_choose_2,
								},
								{
									blogDate:"DEC 17,2016",
									blogTitle:"Doorstep Services ",
									blogPara:"We know the importance of time, with just a click you will get everything at your doorstep. Faster than you can imagine. ",								
									blogsubimg:icon_choose_3,
								},
								{
									blogDate:"DEC 17,2016",
									blogTitle:"Free Delivery  ",
									blogPara:"We deliver you all products by taking no delivery charges. You don’t have to pay any additional charges for it. ",								
									blogsubimg:icon_choose_3,
								},
						],

		    "OurCourcesmaster" : [
							{
								blogDate:"DEC 17,2016",
								blogTitle:"Expanded Booking Cost ",
								blogPara:"You never have to wait for opening of booking slots. Our booking slots are 24 hours available. If your booking is done before 9 pm, you will get the delivery by next day evening. ",
								bloggerImg:one,
								blogsubimg:icon_choose_4,
							},
							{
								blogDate:"DEC 17,2016",
								blogTitle:"Ready To Cook Veggies  ",
								blogPara:"Our products which are provided to you are sanitized, neatly graded and chopped which you can directly cook. ",								
								blogsubimg:icon_choose_5,
							},
							{
								blogDate:"DEC 17,2016",
								blogTitle:"Affordability",
								blogPara:"Despite of sanitizing ,grading ,chopping and packaging in food grade containers, we deliver it to you in the same price of market. There is no extra cost for it. ",								
								blogsubimg:icon_choose_6,
							},
							{
								blogDate:"DEC 17,2016",
								blogTitle:"Fast Response ",
								blogPara:"If you order a product from us we will deliver it to your doorstep as soon as possible also",								
								blogsubimg:icon_choose_6,
							},
						]				  
	};
	}

	render() {
		var data = this.state.OurCources;
		var data1=this.state.OurCourcesmaster;
		return (
				<div className="col-lg-12 col-md-12 hidden-xs hidden-sm ocWrap WCUWrap " style={{marginbottom:"100px"}}>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
					 <div className="ocTitle txt2c offeredTitle text-center"><h3>Why Choose Us</h3></div>
					  <div className="col-lg-12 col-md-12 ">
						<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 text-center whyusText">
							<p>
								There are various motivations to work with Consumer Fresh Produce. We give the freshest, most 
								excellent Fruits and Vegetables. Our absolute duty towards the customers, our imaginative utilization 
								of maturing and arranging innovation, our rigid consistence to sanitation, our effective coordination 
								and our unmatched customer care.
								We don't want to push our ideas on to customers, we simply want to make what they want. We 
								believe in the power of recognition and empowerment leading to great employee engagement. Our 
								guidelines are “Happy Customer” and “Satisfied Customer”. 
							</p>							

						</div>
					  </div> 
					  {/* <div className="col-lg-12 whyUsDiv" style={{background: "url("+why_choose_BgImg +")"}}> */}
					  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 whyUsDiv">
							<div className="col-lg-3 col-md-3 col-sm-3 col-md-offset-1 col-sm-offset-1 col-xs-12 courceblockDiv1 courceblockDiv12">
							{
		                		data && data.length > 0 ?
				      				data.map((data, index)=>{
	                					return(
						          			<div className="col-lg-12 Allblog whyUsSubDiv" key={index}>
						          			 <div className="col-lg-12">
                                               <div className="col-lg-2">
                                                <img src={data.blogsubimg} alt="BlogImage" />
                                               </div>
                                               <div className= "col-lg-10">
                                                <p className="subtext_choose">{data.blogTitle}</p>
                                               </div>
                                              </div>
                                              <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                               <p className="choosepara text-left">{data.blogPara}</p>
                                              </div>
						          		</div>	
						          			);
	                					})
	                				:
	                				null
		                		}
		                	</div>
							<div className="col-lg-4 col-md-4 col-sm-4 whychooseUsImg">
								<img src={images_choose} className="WhyChooseUsImg" alt="WhyChooseUsImage" />
							</div>
                            <div className="col-lg-offset-1 col-lg-3 col-md-3 col-md-offset-1  courceblockDiv1 movemasterdiv">
                           {/*  <div className=" col-md-2"></div>*/}
							{
		                		data1 && data1.length > 0 ?
				      				data1.map((data1, index)=>{
	                					return(
						          		<div className="col-lg-12 col-md-12 col-sm-12 Allblog whyUsSubDiv" key={index}>
						          			 <div className="col-lg-12 col-md-12 col-sm-12">
												<div className= "col-lg-10 col-md-10 col-sm-10">
													<p className="subtext_choose">{data1.blogTitle}</p>
												</div>
												<div className="col-lg-2 col-md-2 col-sm-2">
													<img src={data1.blogsubimg} alt="BlogImage" />
												</div>
                                              </div>
                                              <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                               <p className="choosepara text-right">{data1.blogPara}</p>
                                              </div>
						          		</div>	
						          			);
	                					})
	                				:
	                				null
		                		}
		                	</div>	
						</div>
						
					</div>					
				</div>
		);
	}
}
