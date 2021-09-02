import React, {Component}		from 'react';
import axios					from 'axios';
import $						from 'jquery';
import jQuery					from 'jquery';
import Swal						from 'sweetalert2';
import S						from './ContactUsTrollyMart.module.css';

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

	componentDidMount(){

		// this.dynamicvalidation();

		{
            axios.get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                	console.log("res=-0-0",response.data);
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

	// dynamicvalidation(){

    //     $.validator.addMethod("regxName", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid name");
    //      $.validator.addMethod("regxEmail", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid email");
    //      $.validator.addMethod("regxMessage", function (value, element, regexpr) {
    //         return regexpr !== value;
    //     }, "Please enter appropriate message");

    //     jQuery.validator.setDefaults({
    //         debug: true,
    //         success: "valid"
    //     });

	// 	$("#ContactUs").validate({
    //         rules: {
    //             name: {
    //             	regxName: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
    //                 required: true
    //             },
    //             email: {
	// 				regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
    //                 required: true,
    //             },
    //             message: {
    //             	regxMessage:  /^[A-Za-z][A-Za-z0-9\-\s]/,
    //                 required: true
    //             },
	// 			mobile: {
    //             	regxMessage: /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/,
    //                 required: true
    //             },
    //         },
    //         errorPlacement: function (error, element) {
    //             if (element.attr("name") === "name") {
    //                 error.insertAfter("#name");
    //             }
    //             if (element.attr("name") === "email") {
    //                 error.insertAfter("#email");
    //             }
	// 			if (element.attr("name") === "mobile") {
    //                 error.insertAfter("#mobile");
    //             }
    //             if (element.attr("name") === "message") {
    //                 error.insertAfter("#message");
    //             }
    //         }
    //     });
    // }

	handleChange(event){
		event.preventDefault();
		const datatype 		= event.target.getAttribute('data-text');
		const {name,value} 	= event.target;
		const formerrors 	= this.state.formerrors;
		this.setState({
      		formerrors,
        	[name] : value,
      	});
    }

	Submit(event){
	    event.preventDefault();
	    console.log("i'm in submit event" );
	    var adminEmail = this.state.blockEmail;
		const formValues2 = {
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

		console.log("formValues2" , formValues2);

		if ($('#ContactUs').valid()){
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Great!!',
				text: 'Thank you for contacting us!!',
				footer: 'We will get back to you shortly!!',
				showConfirmButton: false,
			})
		}else{
			Swal.fire({
				position: 'center',
				icon: 'error',
				title: 'Oops!!',
				text: 'Please fill the details!',
				// footer: 'We will get back to you shortly!!',
				showConfirmButton: false,
			})
		}

		this.setState({
			name    : "",
			email   : "",
			message : "",
			mobile  : ""
		});
	}

	render(){

		console.log("state ===", this.state.name,  + " |" + this.state.email  + "|" + this.state.message )

		return(
			<section className={"col-12 contactUsTrollyMainWrapper "+S.contactUsTrollyMainWrapper}>
				<div className="row">
					<div className={"col-12 contactUsTrollyBreadcumWrapper img-fluid "+S.contactUsTrollyBreadcumWrapper} style={{backgroundImage: "url("+this.state.blocks.bgImage+ ")"}}></div>
					<div className={"col-12 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 contactusFormWrapperMain "+S.contactusFormWrapperMain}>
						<div className="row">
							<div className={"col-12 col-lg-7 mb-4 mb-lg-0 contactusFormWrapperLeftSide "+S.contactusFormWrapperLeftSide}>
								<div className="row">
									<form className="col-12 col-lg-10 offset-lg-1 mt-5 pt-1" id="ContactUs">
										<div className="form-group">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Your Name <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="name" name="name" id="name" ref="name" required value={this.state.name} onChange={this.handleChange.bind(this)} />
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Email <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="email" name="email" type="email" id="email" ref="email" data-text="clientEmail" required value={this.state.email} onChange={this.handleChange.bind(this)} />
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Phone <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="mobile" name="mobile" type="number" id="mobile" ref="mobile" required value={this.state.mobile} value={this.state.mobile} onChange={this.handleChange.bind(this)} />
										</div>
										<div className="form-group mt-5 mt-xl-3">
											<label for="name" className={"control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>How we can help you? <span className="required">*</span></label>
											<input className={"form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="message" name="message" id="message" rows="4" ref="message" required value={this.state.message} onChange={this.handleChange.bind(this)} />
										</div>
										<div className={"col-lg-12 pb-lg-5 pb-0 mt-xl-3 "+S.getInTouchBtnMainWrapper}>
											<button type="button" className={"btn btn-default float-right getInTouchBtnWrapper "+S.getInTouchBtnWrapper} id="myBtn" value=" Send " onClick={this.Submit.bind(this)}>Send&nbsp;<i className="far fa-paper-plane" aria-hidden="true"></i></button>
										</div>
									</form>
								</div>
							</div>
							<div className={"col-12 col-lg-5 mt-5 mt-lg-0 contactusFormWrapperRightSide "+S.contactusFormWrapperRightSide}>
								<div className="col-12">
									<h3 className={"pt-lg-5 mt-lg-5 mt-xl-1 mt-4 pt-3 getInTouchSubTitle "+S.getInTouchSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></h3>
								</div>
								<div className={"col-12 pt-lg-4 pt-4 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}><i className={"fa fa-phone"}></i>&nbsp;&nbsp;&nbsp;
									<div className={S.contactUsPhoneNumber}>+971 45911186</div>
								</div>
								<div className={"col-12 pt-lg-4 pt-3 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}><i className={"fa fa-envelope"}></i>

									<div className={S.emailWrapperContactUsOne}>support@knock-knockeshop.com</div>
									<div className={ "col-12 " +S.emailWrapperContactUsTwo}>info@trollymart.ae</div>
									
								</div>
								<div className={"col-12 pt-lg-4 pt-4 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}><i className={"fa fa-address-card"}></i>
									<div className={S.emailWrapperContactUs}>
										<span className={"col-12 " +S.contactAddress}>Head Office : Unit 201, Level – 1, Gate Avenue – South Zone DIFC, Dubai – UAE </span><br/>
										<span className={"col-12 " +S.contactAddress}>Branch Address : Palace Tower 1 Office Building, Office No:1405, S.P Oasis Street, Dubai Silicon Oasis, Dubai – UAE</span> <br/>
										
									</div>

								</div>
								<div className={"col-12 hero "+S.hero}>
									<div className={"social_links pt-lg-4 pt-4 pt-xl-2 "+S.social_links}>
										<a href="https://www.instagram.com/knockknock_eshop/" target="_blank"><i className="fab fa-instagram"></i></a>
										<a href="https://www.facebook.com/Knock-Knock-103575731986682" target="_blank"><i className="fab fa-facebook-f"></i></a>
										<a href="https://www.youtube.com/knockknockeshop" target="_blank"><i className="fab fa-youtube" target="_blank"></i></a>
										<a href="https://www.linkedin.com/knockknockeshop" target="_blank"><i className="fab fa-linkedin"></i></a>
										<a href="https://twitter.com/knockknockeshop" target="_blank"><i className="fab fa-twitter"></i></a>
									</div>
								</div>
								{/*<div className={"col-12 "+S.contactUscontent}>
										Head Office: Unit 201, Level – 1, Gate Avenue – South Zone DIFC, Dubai – UAE Branch Address: Palace Tower 1 Office Building, Office No:1405, S.P Oasis Street, Dubai Silicon Oasis, Dubai – UAE Email ID: info@trollymart.ae support@knock-knockeshop.com Phone Number: +971 45911186
								</div>*/}
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