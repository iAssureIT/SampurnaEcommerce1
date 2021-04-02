import React from 'react';
import Style from './ContactUsform.module.css';
import axios from 'axios';
import Image from 'next/image';
import $                           from 'jquery';
import jQuery                      from 'jquery';
import Swal from 'sweetalert';
export default class CUform extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
    	"name"      	: "",
        "email"   		: "",
        "subject"   	: "",
        "message"     	: "",
        "formerrors"  	:{
              clientName  : " ",
              clientEmail : " ",
          	},
	    blocks: {
	        "blockComponentName"  : "Typecomponent1",
	        "blockType"       	  : "simple",
			"blockTitle"  		  : "Get in Touch",
			"blockSubTitle"       : "DROP US A LINE",
	        "blockDescription"  	  : "This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
	        "fgImage"          	  : "/images/bgimage1.jpg",
			"bgImage" 			  : "/images/header3.jpg",
			"blockContact"        : "9000900000 / 8000800000",
			"blockEmail"          : "admin@bookstore.com",
	        "repeatedBlocks" 		  : [
		        						
		        						{
								        	Title :"Mail Us:",
											Image :"/images/loader.gif",
											blockSubTitle : "9000900000 / 8000800000",								  
										},
										{
								        	Title :"Call Us:",
											Image :"/images/loader.gif",
											blockSubTitle  : "admin@bookstore.com",
								  
								        }
								       
							    	],
		  },
	      "blockID":"",
		  "block_id":"",
		  fields: {},
		  errors: {}
	    }; 
        this.handleChange = this.handleChange.bind(this);

    
  }
componentDidMount(){
          {
             axios
                .get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                	console.log("res=-0-0",response.data);
                    if(response.data){

                      this.setState({
						  blocks:response.data,
						  blockContact:response.data.blockContact ? response.data.blockContact : "9000900000 / 8000800000",
						  blockEmail  : response.data.blockContact ? response.data.blockContact : "admin@bookstore.com"

                      });
                    }                  
                  })           
                .catch(function(error){
                  console.log(error);
                    if(error.message === "Request failed with status code 401")
                      {
                          // swal("Your session is expired! Please login again.","", "error");
                      }
              })
            }
      this.setState({
                block_id:this.props.block_id
              });

	}


	validateForm() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		if (!fields["name"]) {
		  formIsValid = false;
		  errors["name"] = "This field is required.";
		}
		if (typeof fields["name"] !== "undefined") {
		  //regular expression for email validation
		  var pattern = new RegExp(/^[A-Za-z]*$/)
		  if (!pattern.test(fields["name"])) {
			formIsValid = false;
			errors["name"] = "Name should only contain letters.";
		  }else{
			errors["name"] = "";

		  }
		}
		
		if (!fields["subject"]) {
			formIsValid = false;
			errors["subject"] = "This field is required.";
		}
		if (typeof fields["subject"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^[A-Za-z]*$/)
			if (!pattern.test(fields["subject"])) {
			  formIsValid = false;
			  errors["subject"] = "Subject should only contain letters.";
			}
		}

		if (!fields["message"]) {
			formIsValid = false;
			errors["message"] = "This field is required.";
		}

		if (!fields["email"]) {
			formIsValid = false;
			errors["email"] = "This field is required.";
		  }
		  if (typeof fields["email"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
			if (!pattern.test(fields["email"])) {
			  formIsValid = false;
			  errors["email"] = "Please enter valid email.";
			}
		  }
	  
	
		this.setState({
		  errors: errors
		});
		return formIsValid;
	  }

	handleChange(event){
      event.preventDefault();
      const datatype = event.target.getAttribute('data-text');
      const {name,value} = event.target;
	  const formerrors = this.state.formerrors;
	  let fields = this.state.fields;
	  fields[event.target.name] = event.target.value;

      this.setState({ 
      	formerrors,
		[name]:value,
		fields
	  });
	  
    }
	Submit(event){
	    event.preventDefault();
		if(this.validateForm()){
			//code to submit

	    // var adminEmail = this.getAdminEmail();  //Get email id from company settings. Write API for that.
	    var adminEmail = "admin@bookstore.com";
	             
	       const formValues2 = {
	        "email"         : adminEmail ,
	        "subject"       : "New query/feedback arrived from Website!",
	        "text"          : "",
	        "mail"          : 'Dear Admin, <br/>'+
	                          "Following new query/feedback came from website! <br/> <br/> " + 
	                          "============================  <br/> <br/> " + 
	                          "<b>Client Name: </b>"   + this.state.name + '<br/>'+
	                          
	                          "<b>Client Email: </b>"  + this.state.email + '<br/><br/>'+

	                          "<pre> " + this.state.message + "</pre>" + 
	                          "<br/><br/> ============================ " + 
	                          "<br/><br/> This is a system generated email! " ,

		  };
	      
	        axios
	        .post('/send-email',formValues2)
	        .then((res)=>{
	        //   console.log("re==",res);
				if(res.status === 200){
				Swal("Thank you for contacting us. We will get back to you shortly.")
				}
			})
			.catch((error)=>{
				console.log("error = ", error);
				
			});
	        this.setState({
				name    : "",
				email   : "",
				subject : "",
				message : ""
            });
		} 
	}

	render() {
			return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 containerCon">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right">
							<div className="col-lg-10  col-md-12 col-sm-12 col-xs-12">
							<form className="conatctform" id="ContactUsForm">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
									<h3 className="text-center">{this.state.blocks.blockSubTitle}</h3>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 bt30">
									
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<input className="form-control formControl" name="name" type="text" ref="name" placeholder="Your name" value={this.state.name} onChange={this.handleChange.bind(this)}/>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  errorMsg ">{this.state.errors.name}</div>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<input className="form-control formControl" name="email" type="email" data-text="clientEmail" placeholder="Your@email.com" ref="email" value={this.state.email} onChange={this.handleChange.bind(this)}/>
									</div>
							 		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  errorMsg ">{this.state.errors.email}</div>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										  <input className="form-control formControl" name="subject" type="text" placeholder="subject" ref="subject" value={this.state.subject} onChange={this.handleChange.bind(this)} />
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  errorMsg ">{this.state.errors.subject}</div>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
								          <textarea className="form-control formControl" name="message" placeholder="How can we help?" rows="4"  value={this.state.message} onChange={this.handleChange.bind(this)}></textarea>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  errorMsg ">{this.state.errors.message}</div>

								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<button type="button" className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 sbtn bt30 globaleCommBtn" onClick={this.Submit.bind(this)}>Send Message</button>
									</div>
								</div>
							</form>
							</div>
						</div>{/* 1 st half*/}
						
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-left">
							<div className="xsheight col-lg-10 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12">
								<div className="gettopLine mtop30cf hidden-xs"><span  className="gettopLine1"></span><span className="gettopLine2"></span></div>
								<div className=" col-lg-10 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12">
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
										<h1 className="headone globalMainTitle ">{this.state.blocks.blockTitle}</h1>
									</div>
									{
				                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 
				                            ?
				                              this.state.blocks.repeatedBlocks.map((data, index)=>{
				                              return(
													<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 bt20" key={index}>
														<div className="col-lg-2 col-md-2 col-xs-12 col-sm-12">
															<img className="rotateImg" src={data.Image} height="40px"/>
															{/* <Image
																src={data.Image}
																className={"rotateImg"}
																height ={40}
																width={40}
															/> */}
														</div>
												        <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12">
													        <label className={Style.label}><b>{data.Title}</b> </label><br/>
													        <p className={Style.para}>{data.SubTitle}</p>
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
				</div>
			);
		}
	}
