import React, { Component } 		from 'react';
// import EcommerceBreadcumb 			from "../../blocks/common/Breadcumb/EcommerceBreadcumb.js";
// import EcommerceHeader 				from "../../blocks/common/EcommerceHeader/EcommerceHeader.js";

// import EcommerceFooter    			from "../../blocks/common/EcommerceFooter/EcommerceFooter.js";
import 'bootstrap/js/collapse.js';
import axios from 'axios';


import "./PrivacyPolicy.css";

export default class PrivacyPolicy extends Component {
constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockComponentName"  : "Typecomponent1",
        "blockType"       : "simple",
        blockTitle : "Privacy Policy",
        blockDescription : "We value the trust you place in us. That's why we insist upon the highest standards for secure transactions and customer information privacy. Please read the following statement to learn about our information gathering and dissemination practices</p><span className='mt20 ruleHead'>1. Collection of Personally Identifiable Information and other Information</span><p className='mt20  paddingBottom20'>When you use our Website, we collect and store your personal information which is provided by you from time to time. Our primary goal in doing so is to provide you a safe, efficient, smooth and customized experience. This allows us to provide services and features that most likely meet your needs, and to customize our Website to make your experience safer and easier. More importantly, while doing so we collect personal information from you that we consider necessary for achieving this purpose.In general, you can browse the Website without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information by choosing not to use a particular service or feature on the Website. We may automatically track certain information about you based upon your behaviour on our Website. We use this information to do internal research on our users' demographics, interests, and behaviour to better understand, protect and serve our users. This information is compiled and analysed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our Website or not), which URL you next go to (whether this URL is on our Website or not), your computer browser information, and your IP address.We use data collection devices such as 'cookies' on certain pages of the Website to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. 'Cookies' are small files placed on your hard drive that assist us in providing our services. We offer certain features that are only available through the use of a 'cookie'. We also use cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are 'session cookies,'' meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline our cookies if your browser permits, although in that case you may not be able to use certain features on the Website and you may be required to re-enter your password more frequently during a session.Additionally, you may encounter 'cookies' or other similar devices on certain pages of the Website that are placed by third parties. We do not control the use of cookies by third parties.If you choose to buy on the Website, we collect information about your buying behaviour.<br/>If you transact with us, we collect some additional information, such as a billing address, a credit / debit card number and a credit / debit card expiration date and/ or other payment instrument details and tracking information from cheques or money orders.If you choose to post messages on our message boards, chat rooms or other message areas or leave feedback or if you use voice commands to shop on the Website, we will collect that information you provide to us. We retain this information as necessary to resolve disputes, provide customer support and troubleshoot problems as permitted by law.If you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the Website, we may collect such information into a file specific to you.We collect personally identifiable information (email address, name, phone number, credit card / debit card / other payment instrument details, etc.) from you when you set up a free account with us. While you can browse some sections of our Website without being a registered member, certain activities (such as placing an order) do require registration. We do use your contact information to send you offers based on your previous orders and your interests</p><span className='mt20 ruleHead'>2. Use of Demographic / Profile Data / Your Information</span><p className='mt20  paddingBottom20'>We use personal information to provide the services you request. To the extent we use your personal information to market to you, we will provide you the ability to opt-out of such uses. We use your personal information to assist sellers in handling and fulfilling orders, enhancing customer experience, resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services, inform you about online and offline offers, products, services, and updates; customize and enhance your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection.With your consent, we will have access to your SMS, contacts in your directory, location and device information and we may request you to provide your PAN and Aadhaar details to check your eligibility for certain products/services including but not limited to providing credit) being offered by us, our affiliates or our lending partners. We may share this data with our affiliates or our lending partners for the same purposes as mentioned above, however, we will not store any Aadhaar data ourselves. In the event that consent to this such use of data is withdrawn in the future, we will stop collection of such data but continue to store the data (save for Aadhaar data) and use it for internal purposes to further improve our services.In our efforts to continually improve our product and service offerings, we collect and analyse demographic and profile data about our users' activity on our Website.<br/>We identify and use your IP address to help diagnose problems with our server, and to administer our Website. Your IP address is also used to help identify you and to gather broad demographic information.We will occasionally ask you to complete optional online surveys. These surveys may ask you for contact information and demographic information (like zip code, age, or income level). We use this data to tailor your experience at our Website, providing you with content that we think you might be interested in and to display content according to your preferences.</p><span className='mt20 ruleHead'>3. Sharing of personal information</span><p className='mt20  paddingBottom20'>We may share personal information with our other corporate entities and affiliates. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.We may disclose personal information to third parties. This disclosure may be required for us to provide you access to our Services, for fulfillment of your orders, or for enhancing your experience, or to comply with our legal obligations, to enforce our User Agreement, to facilitate our marketing and advertising activities, or to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our Services. We do not disclose your personal information to third parties for their marketing and advertising purposes without your explicit consent.We may disclose personal information if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal information to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.We and our affiliates will share / sell some or all of your personal information with another business entity should we (or our assets) plan to merge with, or be acquired by that business entity, or re-organization, amalgamation, restructuring of business. Should such a transaction occur that other business entity (or the new combined entity) will be required to follow this privacy policy with respect to your personal information</p><span className='mt20 ruleHead'>4. Links to Other Sites</span><p className='mt20  paddingBottom20'>Our Website links to other websites that may collect personally identifiable information about you. GangaExpress.com is not responsible for the privacy practices or the content of those linked websites.</p><span className='mt20 ruleHead'>5. Security Precautions</span><p className='mt20  paddingBottom20'>Our Website has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession we adhere to strict security guidelines, protecting it against unauthorized access.</p><span className='mt20 ruleHead'>6. Choice/Opt-Out</span><p className='mt20  paddingBottom20'>We provide all users with the opportunity to opt-out of receiving non-essential (promotional, marketing-related) communications from us on behalf of our partners, and from us in general, after setting up an account.If you want to remove your contact information from all GangaExpress.com lists and newsletters, please visit unsubscribe</p><span className='mt20 ruleHead'>7. Advertisements on GnagaExpress.com</span><p className='mt20  paddingBottom20'>We use third-party advertising companies to serve ads when you visit our Website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p><span className='mt20 ruleHead'>8. Your consent</span><p className='mt20  paddingBottom20'>By using the Website and/ or by providing your information, you consent to the collection and use of the information you disclose on the Website in accordance with this Privacy Policy, including but not limited to Your consent for sharing your information as per this privacy policy.If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.</p><span className='mt20 ruleHead'>9. Grievance Officer</span><p className='mt20  paddingBottom20'>In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:</p><span className='mt20 ruleHead'>10. Questions?</span><p className='mt20  paddingBottom20'>Please contact us regarding any questions regarding this statement.</p>",
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
				<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 backColorEF marginTop180">
					<div className="row">
						{/*<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 marginTop180 storeInfo">
							<div className="row">
								<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 backColorWhite storeInfo ">
									<label className="onHover"><span>STORE INFORMATION</span></label><br/>
										<ul className="productList1">
											<li className="onHover"><i className="fa fa-map-marker-alt" aria-hidden="true"></i>&nbsp;&nbsp;123 Sky Tower, West 21th Street, Suite, NY</li>
											<li className="onHover"><i className="fa fa-phone" aria-hidden="true"></i>&nbsp;&nbsp;01923-456-789</li>
											<li className="onHover"><i className="fa fa-envelope" aria-hidden="true"></i>&nbsp;&nbsp;info@domain.com</li>
										</ul>
								</div>
								
							</div>
						</div>
						<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12  linkToOtherPage">
							<div className="row">
								<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 backColorWhite linkToOtherPage ">
									<label className="onHover"><span><a href="/PrivacyPolicy">Privacy Policy</a></span></label><br/>
									<label className="onHover"><span><a href="/termsandcondition">Terms And Conditions</a> </span></label><br/>
									<label className="onHover"><span><a href="/about-us">About Us</a> </span></label><br/>
									<label className="onHover"><span><a href="/contact-us">Contact Us</a> </span></label><br/>

								</div>
								
							</div>
						</div>
*/}
						<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
							
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mt20  ">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
										
									
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 termsAndConditionsContainer backColorWhite ">
											<label className="">{this.state.blocks.blockTitle}</label><br/><br/>
											<p className="paddingBottom20" dangerouslySetInnerHTML={ { __html: this.state.blocks.blockDescription } }>
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
