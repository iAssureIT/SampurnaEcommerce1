import React from 'react';
import "./ContactUsForm.module.css";

 import $ 		from 'jquery';
 import jQuery 	from 'jquery';
 import validate from "jquery-validation";

export default class Std7ContactUs extends React.Component {
  constructor(props){
        super(props)
        this.state = {
            Submit :true,
            FullName :"",
            email    :"",
            pnumber  :"",
            subject  :"",
            message  :""


        }
    }

    
    handleChange(event){
        var name = event.currentTarget.name;
        this.setState({[name] : event.currentTarget.value});


    }
    componentDidMount(){
        $.validator.addMethod("reglx",function(value,element,regexpr){
            return regexpr.test(value);
        }, "This field is required");
        $("#validateApplication").validate({
            rules: {
                FullName:{
                required:true,
                reglx:/^[A-Za-z]+$/

                },
                email:{
                    required:true,
                     reglx:/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
                     },
                pnumber:{
                        required:true,
                            reglx:/^[0-9]+$/
                     },
                subject:{
                        required:true,
                        reglx:/^[A-Za-z]+$/
        
                        },
                message:{
                            required:true,
                            reglx:/^[A-Za-z]+$/
            
                            }
            },
            errorPlacement : function(error, element)
             {
			 	if(element.attr("Name") === "FullName"){
					error.insertAfter("#erroralert")
                }
                if(element.attr("Name") ==="email"){
					error.insertAfter("#erroralert1")
                }
                if(element.attr("Name") ==="pnumber"){
					error.insertAfter("#erroralert2")
                }
                if(element.attr("Name") ==="subject"){
					error.insertAfter("#erroralert3")
                }
                if(element.attr("Name") ==="message"){
					error.insertAfter("#erroralert4")
                }
            },
           
           
           
           
            
            
        })
    }
    handleSubmit(event){
        event.preventDefault();
        // console.log("event")
          var Submit =true;
        //   if(submit && this.state.submit){
            var formValues = {
                "FullName"  	            : this.state.FullName,
                "email"  	            : this.state.email,
                "pnumber"  	            : this.state.pnumber,
                "subject"  	            : this.state.subject,
                "message"  	            : this.state.message,
            }
        //   }
            console.log("form values==>",formValues)
    }
    // if($("#validateApplication").valid()){}
   

    


    render(){
        return(
            <div className=" col-lg-10 col-lg-offset-1 col-md-12 contactuswrap">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h1 className="headingtitle">Contact Us</h1>
                </div>
                <form  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="validateApplication">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div className="form-group" id="erroralert">
                            <label htmlfor="fullname" className="fName">Full Name<span className="asterik">*</span></label>
                                <input type="text" className="form-control" placeholder="Full Name" name="FullName"
                                defaultValue ={this.state.FullName}
                                onChange    = {this.handleChange.bind(this)}
                                />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div className="form-group" id="erroralert1">
                            <label htmlfor="email" className="fName">Email<span className="asterik">*</span></label>
                                <input type="email" className="form-control" placeholder="Email" name="email"
                                 defaultValue ={this.state.email}
                                 onChange    = {this.handleChange.bind(this)}
                                />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div className="form-group" id="erroralert2">
                            <label htmlfor="phonenumber" className="fName">Phone Number<span className="asterik">*</span></label>
                                <input type="text" className="form-control" placeholder="Phone Number" name="pnumber"
                                  defaultValue ={this.state.number}
                                  onChange    = {this.handleChange.bind(this)}
                                />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                         <div className="form-group" id="erroralert3">
                            <label htmlfor="subject" className="fName">Subject<span className="asterik">*</span></label>
                                <input type="text" className="form-control" placeholder="Subject" name="subject"
                                  defaultValue ={this.state.subject}
                                  onChange    = {this.handleChange.bind(this)}
                                />
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group" id="erroralert4">
                            <label htmlFor="message" className="htmlfor">Message <span className="asterik">*</span></label>
                             <textarea  className="form-control"rows="3" cols="50" name="message" placeholder="Message"
                                 defaultValue ={this.state.message}
                                 onChange    = {this.handleChange.bind(this)}
                             />
                        </div>
                    </div>

				<button className="btn btn-primary col-lg-2 subButton" onClick={this.handleSubmit.bind(this)}>Submit</button>

                </form>
            </div>
        )
    }
}