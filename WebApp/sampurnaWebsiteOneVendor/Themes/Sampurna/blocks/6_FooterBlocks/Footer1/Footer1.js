import React, {Component} from 'react';


import S from './Footer1.module.css';


export default class Footer1 extends Component{

	constructor(props){
		super(props);
		this.state = {

		}
	}

	render(){
		return(
			<div className={"col-12 "+S.footer1Wrapper}>
				<div className="row">

					<div className={"col-12 col-lg-4 col-xl-1 "+S.menuWrapper}>
						<ul>
							<li><b>Menu</b></li>
							<li className={S.menuWrapperDash}></li>
							<li><a href="/">Home</a></li>
							<li><a href="/about-us">About Us</a></li>
							<li><a href="/contact-us">Contact Us</a></li>
						</ul>
					</div>

					<div className={"col-12 col-lg-4 col-xl-2 "+S.servicesWrapper}>
						<ul>
							<li><b>Services</b></li>
							<li className={S.servicesWrapperDash}></li>
							<li><a href="/web-app-development">	  Web Application	 </a></li>
							<li><a href="/mobile-app-development">Mobile App		 </a></li> 
							<li><a href="/ecommerce">		  	  eCommerce Portal	 </a></li> 
							<li><a href="/website-development">	  Website Development</a></li>  
							<li><a href="/staff-augmentation"> 	  Staff Augmentation </a></li>  
							<li><a href="/ui-ux-design">		  UI/UX Design		 </a></li>
						</ul>
					</div>

					<div className={"col-12 col-lg-4 col-xl-2 "+S.addressWrapper}>
						<ul>
							<li><b>Address</b></li>
							<li className={S.addressWrapperDash}></li>
							<li><i className="fa fa-map-marker-alt"></i>&nbsp; #323, Amanora Chambers,<br/>Amanora Town Center<br/>Pune, Maharashtra 411028</li>
							<li><i className="fa fa-whatsapp"></i>&nbsp; +91 99233 93733<br/>(WhatsApp-Only)</li>
							<li><i className="fa fa-envelope"></i>&nbsp; info@iassureit.com</li>   
						</ul>
					</div>

					<div className={"col-12 col-lg-8 col-xl-5 "+S.ourAwardsWrapper}>
						<div className="row">
							<ul className={"col-12 "+S.ourAwardsTitle}>
								<li><b>Our Awards</b></li>
								<li className={S.ourAwardsWrapperDash}></li>
							</ul>
							<ul className={"col-12 "+S.ourAwards}>
								<li className={"col-6 col-lg-3 "+S.award1}>
									<p className="">TOP<br/>BRAND<br/>OF<br/>FUTURE</p>
								</li>
								<li className={"col-6 col-lg-3 "+S.award2}>
									<p className="">COMPANY<br/>OF THE<br/>YEAR<br/>2018</p>
								</li>
								<li className={"col-6 col-lg-3 "+S.award3}>
									<p className="">THE MOST<br/>PROMISING<br/>COMPANY OF<br/>2018</p>
								</li>
								<li className={"col-6 col-lg-3 "+S.award4}>
									<p className="">THE MOST<br/>INNOVATIVE<br/>IT COMPANY<br/>2019</p>
								</li>
							</ul>
						</div>
					</div>

					<div className={"col-12 col-lg-4 col-xl-2 "+S.logoSocialIconNButtonWrapper}>
						<div className={"col-12 "+S.footerLogoWrapper}>
							<img src="/images/iAssureIT.svg" className={S.footer1Logo} alt="iAssureITLogo"/>
						</div>
						<div className="row">
							<div className={"col-12 "+S.socialIconWrapper}>
								<div className="row">
									<ul>
										<li>
											<a className={S.social_button+" "+S.facebook} href="https://www.facebook.com/iAssureIT" target="_blank">
												<i className={"fa fa-facebook-f facebookiconWrapper "+S.facebookiconWrapper}></i>
											</a>
										</li>
										<li>
											<a className={S.social_button+" "+S.twitter}  href="https://www.twitter.com/" target="_blank">
												<i className={"fa fa-twitter twitterIconWrapper "+S.twitterIconWrapper}></i>
											</a>
										</li>
										<li>
											<a className={S.social_button+" "+S.linkedin} href="https://www.linkedin.com/company/iassure-international-technologies-pvt-ltd/?viewAsMember=true" target="_blank">
												<i className={"fa fa-linkedin linkediniconWrapper "+S.linkediniconWrapper}></i>
											</a>
										</li>
										<li>
											<a className={S.social_button+" "+S.youtube}  href="https://api.WhatsApp.com/send?phone=+919923393733" target="_blank">
												<i className={"fa fa-whatsapp whatsappiconWrapper "+S.whatsappiconWrapper}></i>
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className={"col-12 "+S.footerButtonWrapper}>
							<button className={S.button_two}><span><a href="/contact-us">CLICK TO CONTACT</a></span></button>
						</div>
					</div>

					<div className={"col-12 "+S.footerBottomWrapper}>
						<ul>
							<li>
								<span className={S.footerCopyright +"hhggfg"}>Copyright &copy; 2021</span> &nbsp; &nbsp;
								<span className={S.footerCompanyName}>iAssure International Technologies Pvt. Ltd.</span> &nbsp; &nbsp;
								<span className={S.footerAllRightsReserved}>All Rights Reserved.</span>
							</li>
							<li>Privacy Policy</li>
							<li>Terms of Use</li>
							<li>Site Map</li>
						</ul>
					</div>

				</div>
			</div>
		);
	}
}