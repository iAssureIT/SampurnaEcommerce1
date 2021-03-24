import React from 'react';
import css from "./Footer.module.css";

export default class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={"footerBlock  "+css.footerBlock}>
			<div className={"col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 footerTop "+css.footerTop}>
				<div className={"col-lg-3 col-md-3 col-sm-3 col-xs-6 wrap1 "+css.wrap1}>
					<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp1 "+css.subwrapp1}>
					<ul  className={"footer1 "+css.footer1}>
						<li className={"menubartitle1 "+css.menubartitle1}><b>Menu</b></li>
						<li className={"footertitle1 "+css.footertitle1}><a href="/" aria-label="link">Home</a></li>
						<li className={"footertitle1 "+css.footertitle1}><a href="/about-us" aria-label="about-us">About Us</a></li>
						<li className={"footertitle1 "+css.footertitle1}><a href="/contact-us" aria-label="contact-us">Contact Us</a></li> 
						
							   
						</ul>
					</div>
				</div>
				 <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-6 wrap2 "+css.wrap2}>
				    <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp2 "+css.subwrapp2}>
						<ul className={"footer2 "+css.footer2}>
							<li className={"menubartitle2 "+css.menubartitle2}><b>Services</b></li>
							<li className={"footertitle2 "+css.footertitle2}>Web Application</li>
							<li className={"footertitle2 "+css.footertitle2}>Mobile Application</li> 
							<li className={"footertitle2 "+css.footertitle2}>eCommerce Portals</li> 
							<li className={"footertitle2 "+css.footertitle2}>Enterprise Application</li>  
							<li className={"footertitle2 "+css.footertitle2}>Business Portals</li>
							<li className={"footertitle2 "+css.footertitle2}>Staff Augumentation</li>  
						</ul>
					</div> 

				 </div> 
				 <div className={"col-lg-3 col-md-3 col-sm-3 col-xs-6 wrap3 "+css.wrap3}>
				    <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp3 "+css.subwrapp3}>
				      <ul className={"footer3 "+css.footer3}>
					    <li className={"menubartitle3 "+css.menubartitle3}><b>Address</b></li>
					    <li className={"footertitle3 "+css.footertitle3}><i className="fas fa-map-marker-alt"></i> 323 Amanora Chambers Magarpatta Pune Maharastra 411028</li>
						<li className={"footertitle3 "+css.footertitle3}><i className="fas fa-mobile"></i> +91 99233 93733 <small className="h1titlephone" styles={css.h1titlephone}>     ( Whatsapp only )</small> </li> 
						<li className={"footertitle3 "+css.footertitle3}><i className="fas fa-envelope"></i> info@iassureit.com </li>   
				      </ul>
				   </div>
				</div> 
				 <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6 wrap4" styles={css.wrap4}>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp4" styles={css.subwrapp4}>
				<ul className={"footer4 "+css.footer4}>
					 <li className={"menubartitle4 "+css.menubartitle4}><b>Connect with us</b>
					    <div className={"linkedinwrap "+css.linkedinwrap}><a aria-label="linkedin" rel="noreferrer" href="https://www.linkedin.com/company/iassure-international-technologies-pvt-ltd/?viewAsMember=true" target="_blank"><i className={"fab fa-linkedin-in linkedinicon "+css.linkedinicon}></i></a></div>
					    <div className={"facebookwrap "+css.facebookwrap}><a aria-label="iAssureIT" rel="noreferrer" href="https://www.facebook.com/iAssureIT" target="_blank"><i className={"fab fa-facebook-f facebookicon "+css.facebookicon}></i> </a></div>
					    <div className={"youttubewrap "+css.youttubewrap}><i aria-label="youtube" className={"fab fa-youtube youtubeicon "+css.youtubeicon}></i></div>  
					</li>	    
							  
					<li className=""><button  className={"contactBtn "+css.contactBtn}>Click To Contact</button></li>  
				</ul>
				  </div>
				</div>  
			</div>
		 <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 footerBottom "+css.footerBottom}> 
			 <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
				 <ul className={"mtop10 "+css.mtop10}>
					<li className={"copyright "+css.copyright}>Copyright &copy; 2019 iAssure International Technologies Pvt. Ltd All rights reserved</li>	
				 </ul>
			</div>	
		</div> 
	</div>
	);
}
}		


				
				
					


{/* <i class="fab fa-linkedin-in linkedinicon"></i> */}






































			