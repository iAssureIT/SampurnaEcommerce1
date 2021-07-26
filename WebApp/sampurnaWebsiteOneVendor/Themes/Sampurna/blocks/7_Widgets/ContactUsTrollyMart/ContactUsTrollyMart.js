import React, {Component}	      from 'react';
import axios				      from 'axios';
import $					      from 'jquery';
import jQuery				      from 'jquery';
import validate                   from "jquery-validation";
import Swal					      from 'sweetalert2';
import Link                   from 'next/link';



import S 					      from './ContactUsTrollyMart.module.css';


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
				"bgImage" 			  : "/images/CMSImages/Sampurna/GetInTouch.png",
				"blockContact"        : "9000900000 / 8000800000",
				"blockEmail"          : "admin@iassureit.com",

			},
			"blockID" 	: "",
			"block_id" 	: ""
		}; 
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount(){
	  	this.dynamicvalidation();





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

	dynamicvalidation(){

        $.validator.addMethod("regxName", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid name");
         $.validator.addMethod("regxEmail", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid email");
         $.validator.addMethod("regxMessage", function (value, element, regexpr) {
            return regexpr !== value;
        }, "Please enter appropriate message");



        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#ContactUs").validate({
            rules: {

                name: {
                	regxName:  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                    required: true
                },


                email: {
                    required: true,
                    regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
                },

                message: {
                	regxMessage:  /^[A-Za-z][A-Za-z0-9\-\s]/,
                    required: true
                },
				mobile: {
                	regxMessage: /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/,
                    required: true
                },

            },
            errorPlacement: function (error, element) {
                if (element.attr("name") === "name") {
                    error.insertAfter("#name");
                }
                if (element.attr("name") === "email") {
                    error.insertAfter("#email");
                }
				if (element.attr("name") === "mobile") {
                    error.insertAfter("#mobile");
                }
                if (element.attr("name") === "message") {
                    error.insertAfter("#message");
                }





            }
        });

    }

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
			    //   Swal("Thank you for contacting us. We will get back to you shortly.")
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: 'Great!!',
					text: 'Thank you for contacting us!!',
					footer: 'We will get back to you shortly!!',
					showConfirmButton: false,

				  })

			     }
			     else{
			    //   Swal.fire("Please fill the details!")
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
		// console.log("this.state.blocks.bgImage ===", response.data )

		return(
			<section className={ "col-12 pt-3 contactUsTrollyMainWrapper "+S.contactUsTrollyMainWrapper}>
				<div className="row">
					<div className={ "col-lg-12  contactUsTrollyBreadcumWrapper "+S.contactUsTrollyBreadcumWrapper} style={{backgroundImage: "url("+this.state.blocks.bgImage+ ")"}}></div>
					<div className={ "col-lg-8 offset-lg-2 contactusFormWrapperMain "+S.contactusFormWrapperMain}>
						<div className="row">
							<div className={ "col-lg-8 mb-4 mb-lg-0 contactusFormWrapperLeftSide "+S.contactusFormWrapperLeftSide}>
								<div className="row"> {/*
									<div className="col-lg-10 offset-lg-1 mt-5 pt-5" id="ContactUs"> */}
										<form className={ "col-lg-10 offset-lg-1 mt-5 pt-5 "} id="ContactUs">
											<div className="form-group">
												<label for="name" className={ "control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Your Name</label>
												<input className={ "form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="name" name="name" type="text" id="name" ref="name" required value={this.state.name} onChange={this.handleChange.bind(this)} /> </div>
											<div className="form-group mt-5">
												<label for="name" className={ "control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Email</label>
												<input className={ "form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="email" name="email" type="email" id="email" data-text="clientEmail" ref="email" required value={this.state.email} onChange={this.handleChange.bind(this)} /> </div>
											<div className="form-group mt-5">
												<label for="name" className={ "control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>Phone</label>
												<input className={ "form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="mobile" type="number" name="mobile" id="mobile" ref="mobile" required value={this.state.mobile} value={this.state.mobile} onChange={this.handleChange.bind(this)} /> </div>
											<div className="form-group mt-5">
												<label for="name" className={ "control-label contactusFormInputWrapper "+S.contactusFormInputWrapper}>How we can help you?</label>
												<input className={ "form-control contactusFormInputInsideWrapper "+S.contactusFormInputInsideWrapper} for="message" name="message" id="message" rows="4" ref="message" required value={this.state.message} onChange={this.handleChange.bind(this)} /> </div>
											<div className={ "col-lg-12 pb-lg-5 pb-0 "+S.getInTouchBtnMainWrapper}>
												<button type="button" className={ "btn btn-default float-right getInTouchBtnWrapper "+S.getInTouchBtnWrapper} id="myBtn" value=" Send " onClick={this.Submit.bind(this)}>Send&nbsp;<i className="far fa-paper-plane" aria-hidden="true"></i></button>
											</div>
										</form> {/* </div> */} </div>
							</div>
							<div className={ "col-lg-4  mt-5 mt-lg-0 contactusFormWrapperRightSide "+S.contactusFormWrapperRightSide}>
								<h3 className={ "col-lg-12 pt-lg-5 mt-lg-5  mt-4 pt-3 getInTouchSubTitle "+S.getInTouchSubTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></h3>
								<div className={ "col-lg-12 pt-lg-4 pt-4 phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}><i className={"fa fa-phone-alt"}></i>&nbsp;&nbsp;&nbsp;
									<label>+971 04 591 1186 </label>
								</div>
								<div className={ "col-lg-12 pt-lg-4 pt-4  phoneFontAwesomeWrapper "+S.phoneFontAwesomeWrapper}><i className={"fa fa-envelope"}></i>
									<label className={"col-12 "+S.emailWrapperContactUs}>support@knock-knockeshop.com</label>
								</div>
								<div className={ "hero "+S.hero}>
									<div className={ "social_links col-lg-12 pt-lg-4 pt-4 "+S.social_links}> <a href="https://www.instagram.com/knockknock_eshop/" target="_blank"><i className="fab fa-instagram"></i></a> <a href="https://www.facebook.com/Knock-Knock-103575731986682" target="_blank"><i className="fab fa-facebook-f"></i></a> <a href="https://www.youtube.com/knockknockeshop" target="_blank"><i className="fab fa-youtube" target="_blank"></i></a> <a href="https://www.linkedin.com/knockknockeshop" target="_blank"><i className="fab fa-linkedin"></i></a> <a href="https://twitter.com/knockknockeshop" target="_blank"><i className="fab fa-twitter"></i></a> </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>


		);
	}
} 