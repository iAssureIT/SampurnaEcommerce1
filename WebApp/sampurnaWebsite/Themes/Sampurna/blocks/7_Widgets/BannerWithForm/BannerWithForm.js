import React from 'react';
import axios from 'axios';
import s     from "./BannerWithForm.module.css";
// import Image from 'next/image';
import Swal  from 'sweetalert2';

export default class StaffBannerWithForm extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
        "name"         : "",
		"email"        : "",
		"message"      : "",
		"mobile"       : "",	
          blocks: {
		      	"blockTitle"        : "Lorem Ipsum",
		      	"blockSubTitle"     : "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	            "blockDescription"  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, Sed sed risus pretium quam vulputate dignissim suspendisse.",
	            "blockComponentName": "TemplateOverview",
	            "blockType"         : "7_Widgets",
				"bgImage"           : "/images/CMSImages/BlockBGImg.jpeg",
				"fgImage"           : "/images/CMSImages/BlockFGImg.png",
				
	            "repeatedBlocks"    : [
	                                
	                                { 
	                                    Title: "Sample 5", 
	                                    SubTitle: "", 
	                                    Image: "/images/4.png",
	                                    Link: "", 
	                                    Description: ""
	                                }
				],
				
	            "bgVideo"				: "",
	            "fgVideo"				: "",
	            "blockGroup"			: "",
	            "blockAppearOnPage"		: ""
          },
          blockID :"",
          fgImage1:"/images/CMSImages/SampleLogo.png",
          block_id:""
        };   
			  this.handleChange = this.handleChange.bind(this);

    }
    handleChange(event){
    	event.preventDefault();
		// var name = event.target.name;
		// console.log("this.refs.name.value,0",this.refs.name.value);
		this.setState({
		    [event.target.name]:event.target.value ,

		  
		},()=>{
		console.log("this.refs.name.value,0",this.state.name);
		console.log("this.refs.name.value,0",this.state.mobile);
		console.log("this.refs.name.value,0",this.state.email);
		console.log("this.refs.name.value,0",this.state.message);

		})

    }

    submit(event){
		event.preventDefault();
		console.log("inside submit===========");
		// var adminEmail = this.getAdminEmail();  //Get email id from company settings. Write API for that.
		var adminEmail = "iassureitmail@gmail.com";
		if (
   			( this.refs.name.value != "") &&
   			( this.refs.email.value != "" ) &&
   			
   			( this.refs.mobile.value != "" )

   		 ){
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
						 if(res){
						  Swal.fire(
						  	{
						  			icon: 'success',
								  title: "Thank you for contacting us. We will get back to you shortly.",
								  showConfirmButton: false,
								  timer: 1500
						  	})
						  }
					  })
					  .catch((error)=>{
						console.log("error = ", error);
						
					  });

					  const formValues2 = {
						"email"         : adminEmail ,
						"subject"       : "New query/feedback arrived from Website!",
						"message"       : "",
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
						  // Swal.fire("Thank you for contacting us. We will get back to you shortly.")

									this.setState({
												name     : "",
												email    : "",
												message  : "",
												mobile   : "",	  
											});
								  }
								})
						.catch((error)=>{
						  console.log("error = ", error);
						  
						});

		}else{
			   		Swal.fire(" please fill all fields correctly ");

		 }
					   
						  
	}
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
             if(this.props.block_id){
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


	render() {
		return (
			<section className="BannerWithFormWithFormWrapper">
				<div class={ "BannerWithFormImageWrapper row "+s.BannerWithFormImageWrapper} style={{backgroundImage: "url("+this.state.blocks.bgImage+ ")"}}>
					<div class="col-md col-sm"> <img src={this.state.blocks.fgImage} className={ "BannerWithFormImgSB img-responsive lazyload img-fluid "+s.BannerWithFormImgSB} alt="Responsive image"></img>
						<div className={ "TitleWrapper "+s.TitleWrapper}>
							<h1 className={ "bannerTitle Title1  "+s.Title1} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
							<br/>
							<h4 className={ "bannerDescription Title2 "+s.Title2} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></h4>
							<br/> </div>
					</div>
					<div class="col-md col-sm"> <img src={this.state.fgImage1} className={ "BannerWithFormIMGUSBrand img-responsive m-auto "+s.BannerWithFormIMGUSBrand } height={80}></img>
						<div className="row">
							<form className={ "formWrapper col-sm-8 offset-sm-2 col-md-8 offset-md-2  m-auto "+s.formWrapper}>
								<div className={ "col-md formWrapperTitle "+s.formWrapperTitle }>
									<h3 className={ "text-center formSubTitle1 formTitleFontSize "+s.formSubtitle1}>Request a free quote</h3>
									<h6 className={ "text-center formSubtitle2 formSubTitleFontSize "+s.formSubtitle2}>Guaranteed response within one business day!</h6> 
								</div>
								<div className="col-md">
									<div className={ "col-md mtop10 "+s.mtop10}>
										<div className="form-group"> <i className={ "fa fa-user-circle userWrapper "+s.userWrapper}></i>
											<input type="text" ref="name" id="name" value={this.state.name} name="name" placeholder="Name" className={ "InputBoxCustom col-md inputValid hinput30 form-control "+s.InputBoxCustom+ " "+s.hinput30+ " "+s.form_control } onChange={this.handleChange.bind(this)} /> </div>
									</div>
									<div className={ "col-md mtop10 "+s.mtop10}>
										<div className="form-group"> <i className={ "fa fa-mobile mobileWrapper "+s.fa+ " "+s.mobileWrapper}></i>
											<input type="phone" ref="mobile" id="mobile" value={this.state.mobile} name="mobile" placeholder="Mobile" className={ "InputBoxCustom col-md inputValid hinput30 form-control " +s.InputBoxCustom+ " "+s.hinput30+ " "+s.form_control } onChange={this.handleChange.bind(this)} /> </div>
									</div>
									<div className={ "col-md mtop10 "+s.mtop10}>
										<div className="form-group"> <i className={ "fa fa-envelope envelopeWrapper "+s.fa+ " "+s.envelopeWrapper}></i>
											<input type="email" ref="email" id="email" value={this.state.email} name="email" placeholder="Email" className={ "InputBoxCustom col-md inputValid hinput30 form-control " +s.InputBoxCustom+ " "+s.hinput30+ " "+s.form_control } onChange={this.handleChange.bind(this)} /> </div>
									</div>
									<div className={ "col-md mtop10 "+s.mtop10}>
										<div className="form-group"> <i className={ "fa fa-lock lockWrapper "+s.fa+ " "+s.lockWrapper}></i>
											<textarea className={ "form-control Bordertextarea "+s.mtopbtm5px + " "+s.Bordertextarea} rows="4" cols="50" id="message" name="message" refs="message" placeholder="Message" value={this.state.message} onChange={this.handleChange.bind(this)} /> </div>
									</div>
									<div className="col-md ">
										<button type="button" className={ "btn btn-default col-md submitButtonWrapper "+s.submitButtonWrapper} onClick={this.submit.bind(this)}>Submit</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>);
	}
}
