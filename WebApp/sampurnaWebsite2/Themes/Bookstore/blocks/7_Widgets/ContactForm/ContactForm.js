import React, {Component} from 'react';
import axios              from 'axios';
// import Image              from 'next/image';
import swal               from 'sweetalert2';


import s from './ContactForm.module.css';
// import AddressBlock       from "./AddressBlock.js";


// const formValid = formerrors=>{
//     console.log("formerrors",formerrors);
//     let valid = true;
//     Object.values(formerrors).forEach(val=>{
//         val.length>0 && (valid = false);
//     })
//     return valid;
// }
// const clientnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


export default class ContactForm extends Component{

	constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>GET IN TOUCH</b>",
                "blockSubTitle"      : "",
                "blockDescription"   : "",
                "blockComponentName" : "",
                "blockType"          : "",
                "bgImage"            : "",
                "fgImage"            : "/images/001.png",
                "repeatedBlocks" : [
                    {
                        Title        : "Mail Us:", 
                        SubTitle     : "admin@kokilaeducation.com", 
                        FGImage1     : "images/CMSBlockType/7_Widgets/mail.png",
                        Link         : "",
                        Description  : ""
                    },
                    { 
                        Title        : "Phone Us:", 
                        SubTitle     : "9090909900 / 8008808800", 
                        FGImage1     : "images/CMSBlockType/7_Widgets/phone.png",
                        Link         : "",
                        Description  : ""
                    },
                   
                ],
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID   : "",
            block_id  : "",
            "name"    : "",
            "email"   : "",
            "Subject" : "",
            "message" : "",
            mobile    : ""
        };
    }

    componentDidMount(){
        console.log("==>",this.props.block_id);
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

	// constructor(props){
	// 	super(props);
	// 	this.state = {
	// 		"name"          : "",
	// 		"email"         : "",
	// 		"Subject"       : "",
	// 		"message"       : "",
	// 		formerrors : {
    //             clientName  : " ",
    //             clientEmail : " "
    //         },
    //     };
    //     this.handleChange = this.handleChange.bind(this);
	// }

	// handleChange(event){
	// 	event.preventDefault();
	// 	const datatype = event.target.getAttribute('data-text');
	// 	const {name,value} = event.target;
	// 	const formerrors = this.state.formerrors;
	// 	console.log("datatype",datatype);
	// 	switch (datatype){
    //         case 'clientName': formerrors.clientName = clientnameRegex.test(value)? '' : "Please enter valid name";
    //             break;
    //         case 'clientEmail': formerrors.clientEmail = emailRegex.test(value)? '' : "Please enter valid mail address";
    //             break;
    //         default:
    //             break;
	// 	}
	// 	this.setState({ 
	// 		formerrors,
	// 	    [name]:value,
    //             "name"     : this.refs.name.value,
	// 	        "email"    : this.refs.email.value,
	// 	        "Subject"  : this.refs.Subject.value,
    //             "message"  : this.refs.message.value
    //             "mobile"   : this.refs.mobile.value
	// 	});
    // }

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
			"email"    : this.state.email,
			"subject"  : "Your Query/Feedback is sent successfully to www..com!",
			"message"  : "",
			"mail"     : 'Dear ' + this.state.name + ', <br/><br/>'+
                            "<b>Your Email: </b>"  + this.state.email + '<br/><br/>'+
                            "Your following message has been successfully delivered to the admin! We will get back to you shortly. <br/> <br/> " +
                            "===============================  <br/> <br/> " +
                            "<pre> " + this.state.message+ "</pre>" +
                            " <br/> <br/> =============================== " +
                            "<br/><br/> Thank You, <br/> Support Team, <br/> www..com",
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
                "email"   : adminEmail ,
                "subject" : "New query/feedback arrived from Website!",
                "message" : "",
                "mail"    : 'Dear Admin, <br/>'+
                                "Following new query/feedback came from website! <br/> <br/> " +
                                "============================  <br/> <br/> " +
                                "<b>Client Name: </b>"   + this.state.name + '<br/>'+
                                "<b>Client Email: </b>"  + this.state.email + '<br/><br/>'+
                                "<pre> " + this.state.message + "</pre>" +
                                "<br/><br/> ============================ " +
                                "<br/><br/> This is a system generated email! ",
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
                this.state.name     = "";
                this.state.email    = "";
                this.state.Subject  = "";
                this.state.message  = "";
                this.state.mobile   = "";
    }

    // Submit(event){
    //     event.preventDefault();
    //         var dataArray={
    //         "name"     : this.refs.name.value,
    //         "email"    : this.refs.email.value,
    //         "Subject"  : this.refs.Subject.value,
    //         "message"  : this.refs.message.value,
    //     }
    //     console.log("dataArray =>",dataArray);
    // }

	render(){
		return(

            
            <div className={"col-12 contactFormWrapper "+s.contactFormWrapper}>
                <div className="row">
                    <div className={"col-12 col-lg-4  addressWrapper "+s.addressWrapper}>
                        <div className={" addressTitleWrapper "+s.addressTitleWrapper}>
                            <div className={"addressTitle globalBlockRepeatedTitleFontSize "+s.addressTitle} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
                        </div>
                        {
                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                            ?
                                this.state.blocks.repeatedBlocks.map((data, index)=>{
                                    return(
                                        <div className={" row locationPinNTextWrapper "+s.locationPinNTextWrapper} key={index}>
                                            <div className={" locationPinWrapper "+s.locationPinWrapper}>
                                                <img className={"locationPin "+s.locationPin} src={data.FGImage1} alt=""/>
                                            </div>
                                            <div className={" locationTextWrapper "+s.locationTextWrapper}>
                                                <div className={"locationText1 globalBlockRepeatedSubTitleFontSize "+s.locationText1} dangerouslySetInnerHTML={{ __html: data.Title } }></div>
                                                <div className={"locationText2 globalBlockRepeatedDescriptionFontSize "+s.locationText2} dangerouslySetInnerHTML={{ __html: data.SubTitle } }></div>
                                            </div>
                                        </div>
                                    );
                                })
                            :
                                null
                        }
                    </div>

                    <div className={"col-8 mx-auto formWrapper1 "+s.formWrapper1}>
                        <div className={"formImage1 "+s.formImage1}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel05_202010161194.png" className=" img-fluid  w-100" alt="Form Image1"/>
                        </div>
                        <div className={"formImage2 "+s.formImage2}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel01_2020101611641.png" className=" img-fluid  w-100" alt="Form Image2"/> 
                        </div>
                        <div className={"formImage3 "+s.formImage3}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel2_2020101611718.png" className=" img-fluid  w-100" alt="Form Image3"/>
                        </div>
                        <div className={"formImage4 "+s.formImage4}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel10_2020101611132.png" className=" img-fluid  w-100" alt="Form Image4"/>
                        </div>
                        <div className={"formImage5 "+s.formImage5}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel06_2020101611935.png" className=" img-fluid  w-100" alt="Form Image5"/>
                        </div>
                        <div className={"formImage6 "+s.formImage6}>
                            <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel08_20201016111232.png" className=" img-fluid  w-100" alt="Form Image6"/>
                        </div>
                        <div className={"col-12 col-lg-6 offset-lg-3 formWrapper2 "+s.formWrapper2}>
                            <div className={"formImage7 "+s.formImage7}>
                                <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel04_2020101611828.png" className=" img-fluid  w-100" alt="Form Image7"/>
                            </div>
                            <div className={"formImage8 "+s.formImage8}>
                                <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel03_2020101611751.png" className=" img-fluid  w-100" alt="Form Image8"/>
                            </div>
                            <div className={"formImage9 "+s.formImage9}>
                                <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel07_20201016111039.png" className=" img-fluid  w-100" alt="Form Image9"/>
                            </div>
                            <h1 className={"formTitle globalBlockRepeatedTitleFontSize "+s.formTitle}><b>Connect With Us</b></h1>
                            <form>
                                <div className={"col-12 formRow "+s.formRow}>
                                    <input
                                        className={"form-control inputField "+s.inputField}
                                        type="text"
                                        name="name"
                                        id="name"
                                        ref="name"
                                        placeholder="Your Name"
                                        value={this.state.name}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                </div>
                                <div className="row">
                                    <div className={"col-12  formRow "+s.formRow}>
                                        <div className="col-12 mb-3 col-md-6 ">
                                            <div className={"formImage10 "+s.formImage10}>
                                                <img src="https://unimandai.s3.amazonaws.com/CMS/cmodel09_20201016111957.png" className=" img-fluid  w-100" alt="Form Image10"></img>
                                            </div>
                                            <input
                                                className={"form-control inputField "+s.inputField}
                                                type="text"
                                                name="mobile"
                                                id="mobile"
                                                ref="mobile"
                                                placeholder="Mobile"
                                                value={this.state.mobile}
                                                onChange={this.handleChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6 ">
                                            <input
                                                className={"form-control inputField "+s.inputField}
                                                type="text"
                                                name="email"
                                                id="email"
                                                ref="email"
                                                placeholder="your@gmail.com"
                                                value={this.state.email}
                                                onChange={this.handleChange.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-12 formRow "+s.formRow}>
                                    <input
                                        className={"form-control inputField "+s.inputField}
                                        type="text"
                                        name="from"
                                        id="from"
                                        ref="subject"
                                        placeholder="Subject"
                                        value={this.state.Subject}
                                        onChange={this.handleChange.bind(this)}
                                    />
                                </div>
                                <div className={"col-12 formRow "+s.formRow}>
                                    <textarea
                                        className={"form-control inputField "+s.inputField}
                                        name="message"
                                        id="message"
                                        ref="message"
                                        placeholder="How can we help?"
                                        rows="4"
                                        value={this.state.message}
                                        onChange={this.handleChange.bind(this)}
                                    >
                                    </textarea>
                                </div>
                                <div className={"col-12 formRow "+s.formRow}>
                                    <button type="button" className={"btn btn-primary button1 "+s.button1} onClick={this.Submit.bind(this)}>Send Message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}