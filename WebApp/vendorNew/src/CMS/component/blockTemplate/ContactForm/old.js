import React from 'react';
import "./ContactForm.css";
// import AddressBlock         from "./AddressBlock.js";
import swal from 'sweetalert2';


import axios 				from 'axios';
// import swal                 from 'sweetalert2';


    // const formValid = formerrors=>{
	// 	console.log("formerrors",formerrors);
	// 	let valid = true;
	// 	Object.values(formerrors).forEach(val=>{
	// 	val.length>0 && (valid = false);
	// 	})
	// 	return valid;
	// }
	// const clientnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
    // const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);



export default class ContactForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
          blocks: {
            "blockTitle": "<b>OUR LOCATIONS</b>",
            
            "blockSubTitle": "",
            "blockDescription": "",
            "blockComponentName": "TemplateOverview",
            "blockType": "",
            "bgImage": "",
            "fgImage": "/images/001.png",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "Delhi (INDIA)", 
                                    SubTitle: "#323, Amanora Chambers <br/> Magarpatta,  Pune,<br/> Maharastra 411228", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/ctlocation_2020101611220.png",
                                    Link: "", 
									Description: ""
									
									
								},

								{ 
                                    Title: "Mumbai (INDIA)", 
                                    SubTitle: "#323, Amanora Chambers <br/> Magarpatta,  Pune,<br/> Maharastra 411228", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/ctlocation_2020101611220.png",
                                    Link: "", 
									Description: ""
									
									
								},
								{ 
                                    Title: "Bengaluru (INDIA)", 
                                    SubTitle: "#323, Amanora Chambers <br/> Magarpatta,  Pune,<br/> Maharastra 411228", 
                                    Image: "https://unimandai.s3.amazonaws.com/CMS/ctlocation_2020101611220.png",
                                    Link: "", 
									Description: ""
									
									
								},
								
								
																
								
								
								
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          blockID:"",
          block_id:"",
          "name"      	: "",
		  "email"      	: "",
		  "Subject"   	: "",
		  "message"       : "",
		  mobile  	: ""
        };   
      }
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
              {
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                            // console.log("ListofServices =",response.data);
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







	// constructor(props) {
	// 	super(props);
	// 	this.state={
	// 		"name"      	: "",
	// 		"email"      	: "",
	// 		"Subject"   	: "",
	// 		"message"       : "",
	// 		formerrors   :{
	// 			          clientName  : " ",
	// 			           clientEmail : " "
				
			  
	// 		  },
	// 		};
	// 		  this.handleChange = this.handleChange.bind(this);
		  
	// }
/*	handleChange(event){
		event.preventDefault();
		const datatype = event.target.getAttribute('data-text');
		const {name,value} = event.target;
		const formerrors = this.state.formerrors;
		console.log("datatype",datatype);
		switch (datatype){
  
  
		case 'clientName' : 
			 formerrors.clientName = clientnameRegex.test(value)? '' : "Please enter valid name";
			 break;
  
		case 'clientEmail' : 
			formerrors.clientEmail = emailRegex.test(value)? '' : "Please enter valid mail address";
			break;
  
		
			  
		default :
		break;
  
		}
		this.setState({ 
			formerrors,
		    [name]:value,
		       "name"               : this.refs.name.value,
		        "email"             : this.refs.email.value,
		        "Subject"           : this.refs.Subject.value,
		         "message"          : this.refs.message.value
		         "mobile"          : this.refs.mobile.value
		} );
	  }*/

	  handleChange(event){
		event.preventDefault();
		this.setState({
		  "name"         : this.refs.name.value,
		  "email"        : this.refs.email.value,
		  "Subject"      : this.refs.subject.value,
		  "message"      : this.refs.message.value,
		  "mobile"       : this.refs.mobile.value

	  
		  
		  
		})
	}


	Submit(event){
		event.preventDefault();
		// var adminEmail = this.getAdminEmail(); // Get email id from company settings. Write API for that.
		var adminEmail = "iassureitmail@gmail.com";
	
		const formValues1 = {
			"email"         : this.state.email ,
			"subject"       : "Your Query/Feedback is sent successfully to www..com!",
			"message"          : "", 
			"mail"          : 'Dear ' + this.state.name + ', <br/><br/>'+
							  
							  "<b>Your Email: </b>"  + this.state.email + '<br/><br/>'+
							  "Your following message has been successfully delivered to the admin! We will get back to you shortly. <br/> <br/> " + 
							  "===============================  <br/> <br/> " + 
							  "<pre> " + this.state.message+ "</pre>" + 
							  " <br/> <br/> =============================== " + 
							  "<br/><br/> Thank You, <br/> Support Team, <br/> www..com " ,
	
		  };
		  console.log("notification",formValues1); 

		   
      
		  axios
		  .post('/send-email',formValues1)
		  .then((res)=>{
					 if(res.status === 200){
					  swal("Thank you for contacting us. We will get back to you shortly.")
					  }
				  })
				  .catch((error)=>{
					console.log("error = ", error);
					
				  });

				  const formValues2 = {
					"email"         : adminEmail ,
					"subject"       : "New query/feedback arrived from Website!",
					"message"          : "",
					"mail"          : 'Dear Admin, <br/>'+
									  "Following new query/feedback came from website! <br/> <br/> " + 
									  "============================  <br/> <br/> " + 
									  "<b>Client Name: </b>"   + this.state.name + '<br/>'+
									  
									  "<b>Client Email: </b>"  + this.state.email + '<br/><br/>'+
			
									  "<pre> " + this.state.message + "</pre>" + 
									  "<br/><br/> ============================ " + 
									  "<br/><br/> This is a system generated email! " ,
			
				  };
				  console.log("notification",formValues2); 
				  
					axios
					.post('/send-email',formValues2)
					.then((res)=>{
							  if(res.status === 200){
								console.log("Mail Sent TO ADMIN successfully!")
							  }
							})
							.catch((error)=>{
							  console.log("error = ", error);
							  
							});
					   
						   this.state.name  = "";
							this.state.email = "";
							this.state.Subject = "";
							this.state.message = "";
							this.state.mobile = "";
				}
/*	Submit(event){
				event.preventDefault();
			   
				 
				  var dataArray={
				  "name"         : this.refs.name.value,
				  "email"        : this.refs.email.value,
				  "Subject"      : this.refs.Subject.value,
				  "message"      : this.refs.message.value,
			
				 
				}
				console.log("dataArray =>",dataArray);
						
		} */
	  
	render() {
		return (
			
				<div className="contactformBgwrapp">
					
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactmainwrapp">
							<div className="row">
							<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 addresswrapp">
							   <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop30cf">
								   <div className="text-center">
									   <div className="locationstext"dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
								   </div>
								</div>

								{
										this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
										this.state.blocks.repeatedBlocks.map((data, index)=>{
										return(
									
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 bt020" key={index}>
									
									
								   <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12  rect-block">
										<img src={data.Image} alt="ctlocation"/>
									</div>	
								   <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 bttitle20">
									  <div className="locationtitle1" dangerouslySetInnerHTML={{ __html: data.Title } }></div>
									  <div className="locationtitle2" dangerouslySetInnerHTML={{ __html: data.SubTitle } }></div>  
								  </div>
								</div>

								   	);
								})
							:
							null
								}

						</div>
							
						<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 contactformwrapp">
						     <div className="cformbgimage1">
					            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel05_202010161194.png" alt="cmodel05" className="img-responsive"/>
				             </div>
							  <div className="cformbgimage2">
						         <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel01_2020101611641.png" alt="cmodel04" className="img-responsive"/> 
					         </div>
							 <div className="cformbgimage4">
						         <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel2_2020101611718.png" alt="cmodel2" className="img-responsive"/>
				            </div>
							<div className="cformbgimage5">
						        <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel10_2020101611132.png" alt="cmodel10" className="img-responsive"/>
				           </div> 
						   <div className="cformbgimage7">
						        <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel06_2020101611935.png" alt="cmodel06" className="img-responsive"/>
				          </div>
						  <div className="cformbgimage8">
						      <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel08_20201016111232.png" alt="cmodel08" className="img-responsive"/>
				          </div>
						  <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 contactformwrapp2">
						     <div className="cformbgimage3">
							    <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel04_2020101611828.png" alt="cmodel04" className="img-responsive"/>
						     </div>
							 <div className="cformbgimage6">
						       <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel03_2020101611751.png" alt="cmodel03" className="img-responsive"/>
					         </div>
							 <div className="cformbgimage10">
						        <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel07_20201016111039.png" alt="cmodel07" className="img-responsive"/>
					         </div>
							
							  <h1 className="h1connecttitle">Connect With Us</h1>
							  <form>
							     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgdiv2">
								 <input className="form-control bg0color0" name="name" type="text" ref="name" value={this.state.name} placeholder="Your name"  onChange={this.handleChange.bind(this)}/>

							     </div>
								 <div className="row">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgdiv1">
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div className="cformbgimage9">
							                <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel09_20201016111957.png" alt="cmodel03" className="img-responsive"></img>
					                    </div>
											<input className="form-control bg0color0" name="mobile" type="text" ref="mobile" value={this.state.mobile} placeholder="Mobile"  onChange={this.handleChange.bind(this)}/>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<input className="form-control bg0color0" name="email" type="text" ref="email" value={this.state.email} placeholder="@gmail.com"  onChange={this.handleChange.bind(this)}/>
										</div>
								    </div>
							    </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgdiv1">
							      <input className="form-control bg0color0" name="from" type="text" ref="subject" value={this.state.Subject} placeholder="Subject"  onChange={this.handleChange.bind(this)}/>
						        </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  bgdiv1">
								  <textarea className="form-control bg0color0" name="message" ref="message" value={this.state.message} placeholder="How can we help?"  onChange={this.handleChange.bind(this)} rows="4"></textarea>
							    </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
								   <button type="button" className="btn col-lg-5 col-md-7 col-xs-12 col-sm-12 button2" onClick = {this.Submit.bind(this)}>Send A Message</button>
							    </div>
							 </form>
						</div>
					</div>
				</div>
			</div>
		</div>
	
		);
	}
}

							