import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';
import InputMask      		from 'react-input-mask';
import axios from 'axios';


const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const accountnumberRegex  = RegExp(/^[0-9]{9,18}$|^$/);
const companyAddressRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
const ifsccodeRegex = RegExp(/^([ a-zA-Z0-9&/\(\)\.'-]+)$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);


class CompanyBankDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
          accHolderName  : this.props.accHolderName,
          accNickName    : this.props.accNickName,
          accType        : this.props.accType,
          bankName       : this.props.bankName,
          branchName     : this.props.branchName,
          accNumber      : this.props.accNumber,
          ifscCode       : this.props.ifscCode,
          submitVal      : true,
          formerrors :{
            accountholdername : "",
            bankname : " ",
            accountnumber  : " ",
            branchname : " ",
            ifsccode : " ",
    
    
    
    
          },
          subscription : {
           
          }
        };
    this.handleChange = this.handleChange.bind(this);
       
      }
 componentDidMount(){
   
  }
  submitBankDetail(event){
    event.preventDefault();
  
      var companyBankDetailsFormValue ={
        companyId      : 2,
        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode

      }//close array
      console.log(this.state.accHolderName);
      // var companyBankDetailsFormValue ={

      //   accHolderName  : $(".accHolderName").val(),
      //   accNickName    : $(".accNickName").val(),
      //   accType        : $(".accType").val(),
      //   bankName       : $(".bankName").val(),
      //   branchName     : $(".branchName").val(),
      //   accNumber      : $(".accNumber").val(),
      //   ifscCode       : $(".ifscCode").val(),

      // }//close array

    //   axios.patch('/api/companysettings/bank/edit/',{companyBankDetailsFormValue})
    // .then(function (response) {
    //   // handle success
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   // handle error
    //   console.log(error);
    // })
    // .finally(function () {
    //   // always executed
    // });
    if(formValid(this.state.formerrors)){
      
  
      axios.patch('/api/companysettings/bank/add',companyBankDetailsFormValue)
      .then(function (response) {
        // handle success
        console.log("this is response===>>>",response);
        swal("Good job!", "Bank Details Added Successfully!", "success")
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        swal("", "Bank Details Added Successfully!!", "Danger")
  
      })
      .finally(function () {
        // always executed
      });
  
    }else{
      swal("Please enter mandatory fields", "", "warning");
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
}
// handleChange(event){
//   const target = event.target;
//   const name   = target.name;
//   this.setState({
//     [name]: event.target.value,
//   });
// }

handleChange(event){
  // const target = event.target;
  // const {name , value}   = event.target;
  const datatype = event.target.getAttribute('data-text');
  const {name,value} = event.target;
  let formerrors = this.state.formerrors;
  
  console.log("datatype",datatype);
  switch (datatype){
   
    case 'accountholdername' : 
     formerrors.accountholdername = companynameRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
    break;

    case 'bankname' : 
     formerrors.bankname = companynameRegex.test(value)   && value.length>0? '' : "Please Enter Valid Name";
    break;

    case 'accountnumber' : 
     formerrors.accountnumber = accountnumberRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Account Number";
    break;

    case 'branchname' : 
     formerrors.branchname = companynameRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
    break;

    case 'ifsccode' : 
     formerrors.ifsccode = ifsccodeRegex.test(value)   && value.length>0? '' : "Please Enter Valid Name";
    break;

    
     default :
     break;

    //  case 'companyName' : 
    //  formerrors.companyName = value.length < 1 && value.lenght > 0 ? 'Minimum 1 Character required' : "";
    //  break;

  }
  // this.setState({formerrors,})
  this.setState({ formerrors,
    [name]:value
  } );
}


 

  
  render(){
    
    return(
      <div className="">
          <section className="NotificationContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
                <div className="">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">Bank Details</h4>
                  </div>
                  <hr className="compySettingHr" />
                    <div className="tablebdy">
                      <form id="bankDetailForm" className="bankDetailForm">

                           <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <div className="form-group">
                                  <label className="control-label statelabel locationlabel" >Enter Account Holder Name</label><span className="astrick">*</span>
                                  <input id="accHolderName" value={this.state.accHolderName}  data-text="accountholdername" onChange={this.handleChange.bind(this)} type="text" name="accHolderName" ref="accHolderName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                  {this.state.formerrors.accountholdername &&(
                                    <span className="text-danger">{this.state.formerrors.accountholdername}</span> 
                                  )}
          
                              </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Nick Name</label><span className="astrick"></span>
                                <input id="accNickName" value={this.state.accNickName} onChange={this.handleChange.bind(this)} type="text" name="accNickName" ref="accNickName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Type</label><span className="astrick"></span>
                                <input id="accType" value={this.state.accType} onChange={this.handleChange.bind(this)} type="text" name="accType" ref="accType" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                 {/* <select value={this.state.accType} onChange={this.handleChange} className="form-control accType inputValid required" name="accType">
                                  <option value="0" selected="true" disabled="disabled">Enter Account Type</option>
                                  <option value="Current">Current</option>
                                  <option value="Saving">Saving</option>
                                </select>    */}
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Bank Name</label><span className="astrick">*</span>
                                <input id="bankName" value={this.state.bankName}  data-text="bankname" onChange={this.handleChange.bind(this)} type="text" name="bankName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                {this.state.formerrors.bankname &&(
                                    <span className="text-danger">{this.state.formerrors.bankname}</span> 
                                  )}
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Account Number</label><span className="astrick">*</span>
                                <input id="accNumber" value={this.state.accNumber} data-text="accountnumber" onChange={this.handleChange.bind(this)} type="text" name="accNumber" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                {this.state.formerrors.accountnumber &&(
                                    <span className="text-danger">{this.state.formerrors.accountnumber}</span> 
                                )}
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter Branch Name</label><span className="astrick">*</span>
                                <input id="branchName" value={this.state.branchName} data-text="branchname" onChange={this.handleChange.bind(this)} type="text" name="branchName" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                {this.state.formerrors.branchname &&(
                                    <span className="text-danger">{this.state.formerrors.branchname}</span> 
                                )}
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="control-label statelabel locationlabel" >Enter IFSC Code</label><span className="astrick">*</span>
                                <input id="ifscCode" value={this.state.ifscCode} data-text="ifsccode" onChange={this.handleChange.bind(this)} type="text" name="ifscCode" className="form-control areaStaes" title="Please enter alphanumeric only" />
                                {this.state.formerrors.ifsccode &&(
                                    <span className="text-danger">{this.state.formerrors.ifsccode}</span> 
                                )}
                            </div>  
                          </div>
                          
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          {/* <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12  btn btn-primary btnSubmit pull-right bankDetails" onClick={this.submitBankDetail.bind(this)}>Submit</button> */}

                          <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck"  onClick={this.submitBankDetail.bind(this)}>
                            {this.state.submitVal
                              ?
                                "Submit"
                              : 
                                "Update"
                            }  
                          </button>
                        </div>
                      </form>
                     
                    </div>
                  </div>
                </div>
              </div>
            </section>
              
        </div>


      );
  }

 }

export default CompanyBankDetails;
