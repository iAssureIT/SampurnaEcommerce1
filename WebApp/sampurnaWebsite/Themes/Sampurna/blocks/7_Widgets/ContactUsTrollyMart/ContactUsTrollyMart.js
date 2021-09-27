import React, {Component}		from 'react';
import axios					from 'axios';
import $						from 'jquery';
import jQuery					from 'jquery';
import Swal						from 'sweetalert2';
import S						from './ContactUsTrollyMart.module.css';
import swal from 'sweetalert';

export default class ContactUsTrollyMart extends Component{

	constructor(props){
		super(props);
		this.state = {
			"name"      	: "",
			"email"   		: "",
			"message"     	: "",
			"formerrors"  	: {
				clientName  : "",
				clientEmail : "",
			},
			fields: {},
			errors: {},
			blocks: {
				"blockType"       	  : "7_Widgets",
				"blockComponentName"  : "ContactUsTrollyMart",
				"blockTitle"  		  : "AltMed Center",
				"blockSubTitle"       : "Contact Us",
				"blockDescription"    : "Mauris lobortis ullamcorper sagittis. Mauris lobortis ullamcorper sagittis. Integer eleifend sagittis fringilla nam dapibus libero.",
				"bgImage" 			  : "",
				"blockContact"        : "",
				"blockEmail"          : "",
			},
			"blockID" 	: "",
			"block_id" 	: ""
		}; 
		this.handleChange = this.handleChange.bind(this);
	}
	
	validateForm(){ 
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["name"]) {
			formIsValid = false;
			errors["name"] = "This field is required.";
		}

		// if (typeof fields["name"] !== "undefined") {
		//   var pattern = new RegExp(/^[a-z]([-']?[a-z]+)*/)
		//   if (!pattern.test(fields["name"])) {
		// 	formIsValid = false;
		// 	errors["name"] = "Name should only contain letters.";
		//   }else{
		// 	errors["name"] = "";
		//   }
		// }
		
		if (!fields["message"]) {
			formIsValid = false;
			errors["message"] = "This field is required.";
		}

		// if (typeof fields["message"] !== "undefined") {
		// 	var pattern = new RegExp(/^[A-Za-z]*$/)
		// 	if (!pattern.test(fields["message"])) {
		// 	  formIsValid = false;
		// 	  errors["message"] = "Message should only contain letters.";
		// 	}
		// }
		 
		  if (!fields["email"]) {
			formIsValid = false;
			errors["email"] = "Please enter your email.";
		  }
		
		  if (typeof fields["email"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
			if (!pattern.test(fields["email"])) {
			  formIsValid = false;
			  errors["email"] = "Please enter valid email.";
			}
		  }

		if (!fields["mobile"]) {
			formIsValid = false;
			errors["mobile"] = "This field is required.";
		}
		if (typeof fields["mobile"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
			if (!pattern.test(fields["mobile"])) {
			  formIsValid = false;
			  errors["mobile"] = "Please enter valid mobile.";
			}
		  }

		this.setState({
		  errors: errors
		});
		return formIsValid;
	  }
	componentDidMount(){
		{
            axios.get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                	// console.log("res=-0-0",response.data);
                    if(response.data){
						this.setState({
							blocks:response.data,
							blockContact:response.data.blockContact ? response.data.blockContact : "9000900000 / 8000800000",
							blockEmail  : response.data.blockContact ? response.data.blockContact : "hello@trollymaet.com"
						});
                    }                  
				})           
                .catch(function(error){
					console.log(error);
                    if(error.message === "Request failed with status code 401"){
						// swal("Your session is expired! Please login again.","", "error");
					}
              	})
		}
		this.setState({
			block_id:this.props.block_id
		});
	}

	handleChange(event){
		event.preventDefault();
		const datatype 		= event.target.getAttribute('data-text');
		const {name,value} 	= event.target;
		this.setState({
			[event.target.name]: event.target.value,
		}); 
		let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
	}
	Submit(event){
	    event.preventDefault();
	    var adminEmail = this.state.blockEmail;
		// console.log("adminEmail===",adminEmail);
			if(this.validateForm()){
			const formValues = {
				"email" 	: adminEmail,
				"text"		: "",
				"mail"		: 'Dear Admin, <br/>'+
								"Following new query/feedback came from website! <br/> <br/>" +
								"============================  <br/> <br/>" + 
								"<b>Client Name: </b>"   + this.state.name + '<br/>'+
								"<b>Client Email: </b>"  + this.state.email + '<br/><br/>'+
								"<pre> " + this.state.message + "</pre>" + 
								"<br/><br/> ============================ " + 
								"<br/><br/> This is a system generated email! " ,
			};      
            axios
                .post('/send-email-mobile',formValues)
				.then((contactMailRes)=>{
					// console.log("response==",contactMailRes);
					swal('Thank you for contacting us!! We will get back to you shortly!!');
					this.setState({
						name    : "",
						email   : "",
						message : "",
						mobile  : ""
					});
				})
				.catch((err)=>{
					console.log("error while sending email==",err);
				})

				
		}
	}

	render(){
		return(
			<section className={"col-12 contactUsTrollyMainWrapper "+S.contactUsTrollyMainWrapper}>
				<div className="row">
					<div className={"col-12 contactUsTrollyBreadcumWrapper img-fluid "+S.contactUsTrollyBreadcumWrapper} style={{backgroundImage: "url("+this.state.blocks.bgImage+ ")"}}></div>
					<div className={"col-12 col-xl-8 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-2 contactusFormWrapperMain "+S.contactusFormWrapperMain}>
						<div className="row">
							<div className={"col-12 col-lg-7 mb-4 mb-lg-0 contactusFormWrapperLeftSide "+S.contactusFormWrapperLeftSide}>
								<div className="row">
									<form className="col-12 col-lg-10 offset-lg-1 mt-5 pt-1" id="ContactUs">
										<div className="form-group">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Your Name <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="name" name="name" id="name" ref="name" required value={this.state.name} onChange={this.handleChange.bind(this)} />
											<div className="errorMsg mt-1">{this.state.errors.name}</div>
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Email <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="email" name="email" type="email" id="email" ref="email" data-text="clientEmail" required value={this.state.email} onChange={this.handleChange.bind(this)} />
											<div className="errorMsg mt-1">{this.state.errors.email}</div>
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Phone <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="mobile" name="mobile" type="number" id="mobile" ref="mobile" required value={this.state.mobile} value={this.state.mobile} onChange={this.handleChange.bind(this)} />
											<div className="errorMsg mt-1">{this.state.errors.mobile}</div>
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>How we can help you? <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="message" name="message" id="message" rows="4" ref="message" required value={this.state.message} onChange={this.handleChange.bind(this)} />
											<div className="errorMsg mt-1">{this.state.errors.message}</div>
										</div>
										<div className={"col-lg-12 pb-lg-5 pb-0 mt-xl-3 "+S.getInTouchBtnMainWrapper}>
											<button type="button" className={"btn btn-default float-right getInTouchBtnWrapper "+S.getInTouchBtnWrapper} id="myBtn" value=" Send " onClick={this.Submit.bind(this)}>Send&nbsp;{/*<i className="far fa-paper-plane" aria-hidden="true"></i>*/}<img src="/images/eCommerce/send.png" className={S.getInTouchIcon} alt="get in touch image not found" /></button>
										</div>
									</form>
								</div>
							</div>
							<div className={"col-12 col-lg-5 mt-5 mt-lg-0 contactusFormWrapperRightSide "+S.contactusFormWrapperRightSide}>
								<div className="col-12">
									<h3 className={"pt-lg-5 mt-lg-5 mt-xl-1 mt-4 pt-3 getInTouchSubTitle "+S.getInTouchSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></h3>
								</div>
								<div className={"col-12 pt-lg-4 pt-4 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}>{/*<i className={"fa fa-phone"}></i>*/}<img src="/images/eCommerce/phone-call.png" className={S.contactUsPhoneIcon} alt="phone image not found" />&nbsp;&nbsp;&nbsp;
									<div className={S.contactUsPhoneNumber}>+971 45911186</div>
								</div>
								<div className={"col-12 pt-lg-4 pt-3 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}>{/*<i className={"fa fa-envelope"}></i>*/}<img src="/images/eCommerce/mail.png" className={S.contactUsMailIcon} alt="mail image not found" />

									<div className={S.emailWrapperContactUsOne}>support@knock-knockeshop.com</div>
									<div className={ "col-12 " +S.emailWrapperContactUsTwo}>info@trollymart.ae</div>
									
								</div>
								<div className={"col-12 pt-lg-4 pt-4 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}>{/*<i className={"fa fa-address-card"}></i>*/}{/*<img src="/images/eCommerce/01-home.png" alt="mail image not found" />*/}
									<div className={S.emailWrapperContactUs}>
										<span className={"col-12 " +S.contactAddress}>Head Office : Unit 201, Level – 1, Gate Avenue – South Zone DIFC, Dubai – UAE </span><br/>
										<span className={"col-12 " +S.contactAddress}>Branch Address : Palace Tower 1 Office Building, Office No:1405, S.P Oasis Street, Dubai Silicon Oasis, Dubai – UAE</span> <br/>
									</div>

								</div>
								<div className={"col-12 hero "+S.hero}>
									<div className={"social_links pt-lg-4 pt-4 pt-xl-2 "+S.social_links}>
										<a href="https://www.instagram.com/knockknock_eshop/" target="_blank">{/*<i className="fab fa-instagram"></i>*/}<img src="/images/eCommerce/MaskGroup5.png" className={S.socialMediaFooterIcons} alt="instagram image not found" /></a>
										<a href="https://www.facebook.com/Knock-Knock-103575731986682" target="_blank">{/*<i className="fab fa-facebook-f"></i>*/}<img src="/images/eCommerce/MaskGroup1.png" className={S.socialMediaFooterIcons} alt="facebook image not found" /></a>
										<a href="https://www.youtube.com/knockknockeshop" target="_blank">{/*<i className="fab fa-youtube" target="_blank"></i>*/}<img src="/images/eCommerce/MaskGroup6.png" className={S.socialMediaFooterIcons} alt="youtube image not found" /></a>
										<a href="https://www.linkedin.com/knockknockeshop" target="_blank">{/*<i className="fab fa-linkedin"></i>*/}<img src="/images/eCommerce/MaskGroup3.png" className={S.socialMediaFooterIcons} alt="linkedin image not found" /></a>
										<a href="https://twitter.com/knockknockeshop" target="_blank">{/*<i className="fab fa-twitter"></i>*/}<img src="/images/eCommerce/MaskGroup1.png" className={S.socialMediaFooterIcons} alt="twitter image not found" /></a>
									</div>
								</div>
								<div className="col-12">
									<img className={S.contactUsRightLogo} src="/images/eCommerce/HalfFace.svg" alt=""></img>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
