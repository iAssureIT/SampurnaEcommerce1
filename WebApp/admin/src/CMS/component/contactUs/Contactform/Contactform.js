import React from 'react';
import "./Contactform.css";
import axios from 'axios';
import swal from 'sweetalert2';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
    val.length>0 && (valid = false);
  })
  return valid;
}

const clientnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export default class ContactUsForm extends React.Component {

    constructor(props) {
    super(props);
        this.state={
          "name"          : "",
          "email"         : "",
          "subject"       : "",
          "message"       : "",
          "formerrors"    :{
                            clientName  : " ",
                            clientEmail : " ",       
                          },
          };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event){
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
            "name"         : this.refs.name.value,
            "email"        : this.refs.email.value,
            "subject"      : this.refs.subject.value,
            "message"      : this.refs.message.value,
        });
    }
    Submit(event){
        event.preventDefault();
        // var adminEmail = this.getAdminEmail();  //Get email id from company settings. Write API for that.
        var adminEmail = "ashish.chavan@iassureit.com";
        const formValues1 = {
            "email"         : this.state.email ,
            "subject"       : "Your Query/Feedback is sent successfully to www..com!",
            "message"       : "",
            "mail"          : 'Dear' + this.state.name + ', <br/><br/>'+
                             
                              "<b>Your Email: </b>"  + this.state.email + '<br/><br/>'+
                              "Your following message has been successfully delivered to the admin! We will get back to you shortly. <br/> <br/> " +
                              "===============================  <br/> <br/> " +
                              "<pre> " + this.state.message+ "</pre>" +
                              " <br/> <br/> =============================== " +
                              "<br/><br/> Thank You, <br/> Support Team, <br/> www..com " ,
        };
        console.log("notification",formValues1);
        axios
        .post('http://iogapi.iassureit.com/send-email',formValues1)
        .then((res)=>{
            if(res.status === 200){
                swal("Thank you for contacting us. We will get back to you shortly.")
                }
        })
        .catch((error)=>{
          console.log("error = ", error);
         
        })
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
        console.log("notification",formValues2);
     
        axios
        .post('http://iogapi.iassureit.com/send-email',formValues2)
        .then((res)=>{
            if(res.status === 200){
                console.log("Mail Sent TO ADMIN successfully!")
            }
        })
        .catch((error)=>{
          console.log("error = ", error);
        });
        this.refs.name.value  = "";
        this.refs.email.value = "";
        this.refs.subject.value = "";
        this.refs.message.value = "";
    }

    render() {
        const {formerrors} = this.state;
        return (
            <div className="cuformWall">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactHeader lightbluebg text-center">
                    <label ><b>Contact</b> Us</label>
                    <button type="button" className="close closeBtn" data-dismiss="modal">&times;</button>
                </div>
                <div className="contactpageform">
                    <form className="conatctform col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 bt30 ">
                            <p className="bt30 text-center col-lg-12 col-md-12 col-xs-12 col-sm-12 ">We're here to help! Email us through the secure form below, or log in to see our phone number.
                                When sending us a message, please share the email address  you use for<b> iOG Solutions</b>.</p>
                            <h4 className="text-center bt30 col-lg-12 col-md-12 col-xs-12 col-sm-12 "><b> Drop Us a Line</b></h4>
                        </div>
                        <div className="formcontent col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <label htmlFor="name">Name<span className="redFont">*</span></label>
                            <div className="input-group">
                              <span className="input-group-addon addonColor inputtextContent "><i className="fa fa-user" aria-hidden="true"></i></span>
                              <input className="form-control inputtextContent nameSpaceUpper" id="name" type="text" name="name"  ref="name" value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Enter Your Name"/>
                            </div>
                        </div>
                        <div className="formcontent col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <label htmlFor="email">Email<span className="redFont">*</span></label>
                          <div className="input-group">
                            <span className="input-group-addon addonColor inputtextContent "><i className="fa fa-envelope" aria-hidden="true"></i></span>
                            <input className="form-control inputtextContent" id="email" type="email" name="email" data-text="clientEmail" ref="email"  value={this.state.email} onChange={this.handleChange.bind(this)}   placeholder="Your@email.com" />
                          </div>
                            {this.state.formerrors.clientEmail &&(
                                    <span className="text-danger">{formerrors.clientEmail}</span>
                            )}
                        </div>
                        
                        <div className="formcontent col-lg-6 col-md-6 col-sm-12 col-xs-12">
                          <label htmlFor="subject">Subject<span className="redFont">*</span></label>
                          <div className="input-group">
                            <span className="input-group-addon addonColor inputtextContent "><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                            <input className="form-control inputtextContent nameSpaceUpper" id="subject" type="text" name="subject" value={this.state.subject} onChange={this.handleChange.bind(this)}  ref="subject" placeholder="Enter Subject"/>
                          </div>
                        </div>
                        <div className="commentBox col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <label htmlFor="subject">Note<span className="redFont"></span></label>
                            <textarea className="form-control inputtextContent padd10" name="message" placeholder="How can we help?" rows="4"ref="message" value={this.state.message} onChange={this.handleChange.bind(this)} ></textarea>
                        </div>
                        
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12  bt30">
                          <button type="button" className="btn sbtn cancelBtn contactformBtn col-lg-2" data-dismiss="modal">Cancel</button>
                          <button type="button" className="btn sbtn lightbluebg contactformBtn buttonhover col-lg-2 col-lg-offset-8" onClick={this.Submit.bind(this)}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}