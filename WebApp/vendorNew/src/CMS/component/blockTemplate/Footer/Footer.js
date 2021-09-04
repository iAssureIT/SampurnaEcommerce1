import React from 'react';
import './Footer.css'
export default class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="footerBlock container-fluid">
				{/* <img src="/images/footer.png" alt="Footer"/> */}

			<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 footerTop">
			
				<div className="col-lg-1 col-md-2 col-sm-2 col-xs-6 wrap1">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp1">
					<ul className="footer1">
						<li className="menubartitle1"><b>Menu</b></li>
						<li className="AddressDashLineMenu"></li>
						<a href="/"><li className="footertitle1">Home</li></a>
						<a href="/about-us"><li className="footertitle1">About Us</li></a>
						<a href="/contact-us"><li className="footertitle1">Contact Us</li></a> 
						
							   
						</ul>
					</div>
				</div>
				 <div className="col-lg-2 col-md-2 col-sm-2 col-xs-6 wrap2">
				    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp2">
						<ul className="footer2">
							<li className="menubartitle2"><b>Services</b></li>
							<li className="AddressDashLine"></li>
							<li className="footertitle2">Web Application</li>
							<li className="footertitle2">Mobile Application</li> 
							<li className="footertitle2">eCommerce Portals</li> 
							<li className="footertitle2">Enterprise Application</li>  
							<li className="footertitle2">Business Portals</li>
							<li className="footertitle2">Staff Augumentation</li>  
						</ul>
					</div> 

				 </div> 
				 
				 <div className="col-lg-2 col-md-2 col-sm-2 col-xs-6 wrap3">
				    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp3">
				      <ul className="footer3">
					    <li className="menubartitle3"><b>Address</b></li>
						<li className="AddressDashLine"></li>
					    <li className="footertitle3"><i className="fa fa-map-marker-alt"></i>&nbsp;&nbsp;#323, Amanora Chambers,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Amanora Town Center,Pune,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Maharashtra 411028</li>
						<li className="footertitle4"><i className="fa fa-whatsapp"></i>&nbsp;(Whatsapp-Only)<br/> &nbsp;&nbsp; &nbsp;+91 99233 93733</li>
						<li className="footertitle3"><i className="fa fa-envelope"></i>&nbsp;info@iassureit.com </li>   
				      </ul>
				   </div>
				</div> 

				<div className="col-lg-3  col-md-3 col-sm-3 col-xs-6 wrap5">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subwrapp3">
				      <ul className="footer3">
					    <li className="menubartitle3"><b>Our Awards</b></li>
						<li className="ourAwardDashLine"></li>
					    {/* <li className="footertitle3"><i className="fa fa-map-marker-alt"></i> &nbsp;&nbsp;#323 Amanora Chambers Magarpatta Pune Maharastra 411028</li>
						<li className="footertitle4"><i className="fa fa-mobile"></i> &nbsp;+91 99233 93733</li><a href="https://api.WhatsApp.com/send?phone=+919923393733" title="Click To Chat"><img className="whstsappImgWrapper" src="/images/whatsapp-button.png" alt="whstsappImg"/></a>
						<li className="footertitle3"><i className="fa fa-envelope"></i> &nbsp;&nbsp;info@iassureit.com </li>    */}
				      </ul>
					  <ul className="awardMainWrapper col-lg-12">
						<li className="award1Wrapper col-lg-3"><p>&nbsp;&nbsp;TOP BRAND<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OF<br/>&nbsp;&nbsp;&nbsp;&nbsp;FUTURE<img src="/images/award2.png" className="award1image"  alt="award1image"/></p></li>
						<li className="award2Wrapper col-lg-3"><p>COMPANY<br/>&nbsp;&nbsp;&nbsp;OF THE<br/>YEAR 2018<img src="/images/award2.png" className="award2image"  alt="award1image"/></p></li>
						<li className="award3Wrapper col-lg-3"><p>THE MOST<br/>PROMISING<br/>&nbsp;COMPANY<br/>&nbsp;&nbsp;OF 2018<img src="/images/award2.png" className="award3image"  alt="award1image"/></p></li>
						<li className="award4Wrapper col-lg-3"><p>&nbsp;&nbsp;THE MOST<br/>&nbsp;INNOVATIVE<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IT<br/>&nbsp;&nbsp;COMPANY <img src="/images/award2.png" className="award4image"  alt="award1image"/></p></li>
					  </ul>
					 
					  
				   </div>
				</div>

				 <div className="col-lg-2 col-md-2 col-sm-2 col-xs-6 wrap4">
				 <img src="/images/Logo.png" className="iAssureLogo"  alt="iAssureLogo"/>
					<footer>
						<div class="rounded-social-buttons">
							<a class="social-button facebook" href="https://www.facebook.com/iAssureIT" target="_blank"><i class="fa fa-facebook-f"></i></a>
							<a class="social-button twitter" href="https://www.twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>
							<a class="social-button linkedin" href="https://www.linkedin.com/company/iassure-international-technologies-pvt-ltd/?viewAsMember=true" target="_blank" target="_blank"><i class="fa fa-linkedin"></i></a>
							<a class="social-button youtube" href="https://api.WhatsApp.com/send?phone=+919923393733" target="_blank"><i class="fa fa-whatsapp"></i></a>
							{/* <li className=""><button  className="contactBtn">Click To Contact</button></li>   */}
							<div class="sub-main">
                               <button class="button-two"  ><span><a href="/contact-us">CLICK TO CONTACT</a></span></button>
                           </div>
						  
						</div>
					</footer>
			</div>
		  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerBottom"> 
			 <div className="col-lg-12 col-md-7 col-sm-7 col-xs-7">
				 <ul className="mtop10">
					<li className="copyright col-lg-7">Copyright &copy; 2019 iAssure International Technologies Pvt.Ltd, All rights reserved</li>
					<li className="col-lg-2 privacyPolicyWrapper" >Privacy Policy</li>	
					<li className="col-lg-2 termOfUseWrapper">Terms Of Use</li>	
					<li className="col-lg-1 SiteMapWrapper">Site Map</li>	
				 </ul>
			</div>
		</div>  
		
	</div>
	</div>
	);
}
}		


				
				
					









































			