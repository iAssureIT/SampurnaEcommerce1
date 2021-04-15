
import PhoneInput from 'react-phone-input-2';
import React, { Component } from 'react';
import $ from "jquery";
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import './userManagement.css';
const Swal = require('sweetalert2')

const formValid = formerrors => {
  let valid = true;
  Object.values(formerrors).forEach(val => {
    val.length > 0 && (valid = false);
  })
  return valid;
}

const nameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const mobileRegex = RegExp(/^[0-9][0-9]{9}$/);
const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
class CreateUser extends Component {


  constructor(props) {
    super(props);
    this.state = {
      show: true,
      office: null,
      allPosts: null,
      firstname: "",
      role: "-- Select --",
      lastname: "",
      signupEmail: "",
      mobile: "",
      companyName: "",
      formValues: "",
      adminRolesListData: [],

      formerrors: {
        firstname: "",
        companyID: "",
        lastname: "",
        signupEmail: "",
        mobile: "",
        role: "",
      },
      'buttonType': 'Register User'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const datatype = event.target.getAttribute('data-text');
    const { name, value } = event.target;
    let formerrors = this.state.formerrors;

    switch (datatype) {
      case 'firstname':
        formerrors.firstname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
        break;

      case 'lastname':
        formerrors.lastname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
        break;

      case 'mobile':
        formerrors.mobile = mobileRegex.test(value) && value.length > 0 ? '' : "Please enter a valid Contact Number";
        break;

      case 'signupEmail':
        formerrors.signupEmail = emailRegex.test(value) && value.length > 0 ? "" : "Please enter a valid Email ID";
        break;

      case 'role':
        formerrors.role = value !== "--select--" ? "" : "Please select role";
        break;

      case 'centerName':
        formerrors.role = value !== "--select--" ? "" : "Please select Center";
        break;

      default:
        break;

    }

    this.setState({
      formerrors,
      [name]: value
    });
  }
  validation() {
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid first name");
    $.validator.addMethod("regxA2", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid last name");
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid email ID");
   
    $.validator.addMethod("regxmobile", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid mobile number");

    $.validator.addMethod("regxcompanyID", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid company ID");
   
    $.validator.addMethod("regxRole", function (value, element, arg) {
      return arg !== value;
    }, "Please select the role");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#userInfo").validate({
      rules: {
        firstname: {
          required: true,
          regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        lastname: {
          required: true,
          regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        signupEmail: {
          required: true,
          regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        },
        mobile: {
          required: true,
          regxmobile: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
        },
       
        companyID: {
          required: true,
          regxcompanyID: /[a-zA-Z0-9]/,
        },
        role: {
          required: true,
          regxRole: "--Select--"
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "firstname") {
          error.insertAfter("#firstname");
        }
        if (element.attr("name") === "lastname") {
          error.insertAfter("#lastname");
        }
        if (element.attr("name") === "signupEmail") {
          error.insertAfter("#signupEmail");
        }
        if (element.attr("name") === "mobile") {
          error.insertAfter("#mobile");
        }
        if (element.attr("name") === "companyID") {
          error.insertAfter("#companyID");
        }
        if (element.attr("name") === "role") {
          error.insertAfter("#role");
        }
      }
    });
  }
  componentDidMount() {
    this.validation();
    this.getRole();
    axios.get('/api/companysettings/list')
      .then(
        (res) => {
          const postsdata = res.data;
          this.setState({
            allPosts: postsdata,
          });
          let locationArray = [];
          if (this.state.allPosts !== null) {
            locationArray = this.state.allPosts.map(function (item) { return item.companyLocationsInfo });
          } else {
            locationArray = "no data";
          }
          this.setState({
            office: locationArray,
          });

          // here for list
          var data = {
            "startRange": this.state.startRange,
            "limitRange": this.state.limitRange,
            "companyID" : this.props.companyID,
          }
          this.props.getData(data);
          // axios.post('/api/users/userslist', data)
          // axios.post('/api/users/post/list', data)
          //   .then((res) => {
          //     var tableData = res.data.map((a, i) => {
          //       return {
          //         _id: a._id,
          //         fullName: a.fullName,
          //         emailId: a.emailId,
          //         companyName: a.companyName,
          //         companyID: a.companyID,
          //         mobile: a.mobile,
          //         status: a.status,
          //         roles: a.roles,
          //       }
          //     })
          //     this.setState({
          //       completeDataCount: res.data.length,
          //       tableData: tableData,
          //     }, () => {
          //     })
          //   })
          //   .catch((error) => {
          //   });


        }
      )
      .catch((error) => {

      });

  }

  createUser(event,companyName) {
    event.preventDefault();
    // this.companynamewithid();
    if ($('#userInfo').valid()) {
      console.log(" this.state.companyID==>>",this.state.companyID)
    axios.get('/api/entitymaster/get/companyName/'+this.state.companyID)
      .then((response) => {

        var companyName = response.data.companyName;
        console.log(" companynamewithid ComapnyName==>>",companyName)
        this.setState({
          companyName : companyName
        })
      this.setState(() => {
        if(companyName === "undefined" ||  "No Company Available"){
          swal({
            title: "",
            text: "Company ID "+this.state.companyID+" is not valid Company ID",
          });
        }else{
        const formValues = {
          "firstname": this.state.firstname,
          "lastname": this.state.lastname,
          "email": this.state.signupEmail,
          "mobNumber": (this.state.mobile).replace("-", ""),
          "pwd": this.state.firstname+"123",
          "status": "active",
          "role": this.state.role,
          "companyID": this.state.companyID,
          "companyName": companyName,
        }
       
        console.log("formValues==>>",formValues)
        if (this.state.firstname !== "" && this.state.companyName !== "" && this.state.lastname !== "" && this.state.signupEmail && this.state.mobile && this.state.role !== "--select--") {
          axios.post('/api/auth/post/signup/user', formValues)
            .then((res) => {
              if (res.data.message === 'Email Id already exits.') {
                swal({
                  title: "Please enter mandatory fields",
                  text: res.data.message,
                });
                this.setState({
                  show: false,
                  'buttonType': 'Register User'
                })
              } else {
                console.log("res.data._id======>>>>>>",res.data);
                var sendData = {
                  "event": "Contact Created", //Event Name
                  "toUserId": res.data.ID, //To user_id(ref:users)
                  // "company": this.props.match.params.entityID, //company_id(ref:entitymaster)
                  "variables": {
                   'EmployeeName': this.state.firstname+' '+this.state.lastname,
                   'Password': this.state.firstname+"123",
                   'mobileNo': this.state.mobile,
                   'email': this.state.signupEmail
                    }
                  }
                  console.log('sendDataToUser Before Post==>>>', sendData)
                  axios.post('/api/masternotifications/post/sendNotification', sendData)
                  .then((res) => {
                  console.log('sendDataToUser in result==>>>', res.data)
                  })
                  .catch((error) => { console.log('notification error: ',error)})
                swal(" ", "User added successfully").then((success) => {
                  if (success) {
                     window.location.reload();
                  }
                });
                this.setState({
                  firstname: "",
                  lastname: "",
                  companyID: "",
                  signupEmail: "",
                  mobile: "",
                  role: "",
                  centerName: "",
                  show: false,
                  'buttonType': 'Register User'
                }, () => {
                  var data = {
                    "startRange": this.state.startRange,
                    "limitRange": this.state.limitRange,
                  }
                  this.props.getData(0, 10);
                  var modal = document.getElementById("CreateUserModal");
                  modal.style.display = "none";
                  $('.modal-backdrop').remove();
                  // window.location.reload();

                })
              }
            })
            .catch((error) => {
              this.setState({ show: false })
            });
          
        } else {
          swal({
            title: "Please enter mandatory fields",
            text: "Please enter mandatory fields",
          });
        }
      }
      })
    }).catch(function (error) {});
    }
  }
  myFunction(){
    
    console.log(" this.state.companyID==>>",this.state.companyID)
    axios.get('/api/entitymaster/get/companyName/'+this.state.companyID)
      .then((response) => {

        var companyName = response.data.companyName;
        console.log(" companynamewithid ComapnyName==>>",companyName)
        // this.createUser(companyName);
        if(companyName == null){
          this.setState({
            companyName : "No Company Available"
          })
        }else{
          this.setState({
            companyName : companyName
          })
        }
        
      }).catch(function (error) {});
  }
  // companynamewithid(){
  //   console.log(" this.state.companyID==>>",this.state.companyID)
  //   axios.get('/api/entitymaster/get/companyName/'+this.state.companyID)
  //     .then((response) => {

  //       var companyName = response.data.companyName;
  //       console.log(" companynamewithid ComapnyName==>>",companyName)
  //       // this.createUser(companyName);
  //       this.setState({
  //         companyName : companyName
  //       })
  //     }).catch(function (error) {});
  // }
  getRole() {
    var data = {
      "startRange": this.state.starFtRange,
      "limitRange": this.state.limitRange,
    }
    axios.post('/api/roles/get/list', data)
      .then((response) => {
        this.setState({
          adminRolesListData: response.data
        }, () => {
        })
      }).catch(function (error) {
      });
  }

  camelCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  close(event) {
    this.setState({
      firstname: "",
      lastname: "",
      signupEmail: "",
      mobile: "",
      role: "",
    });
    var modal = document.getElementById("CreateUserModal");
    modal.style.display = "none";
    $('.modal-backdrop').remove();
    $("#userInfo").validate().resetForm();

  }
  render() {
    const { formerrors } = this.state;
    return (
      <div>
        <div className="modal" id="CreateUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg " role="document">
            <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" onClick={this.close.bind(this)} className="close " data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title row userTitle" id="exampleModalLabel">Add New User</h4>
              </div>
              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="hideModal">
                  <div className="userBox-body">
                    <div className="">
                      <form id="userInfo">
                        <div className="">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                            <label>First Name <span className="requiredsign">*</span></label>
                            <input type="text" style={{ textTransform: 'capitalize' }}
                              className="form-control UMname has-content"
                              id="firstname" ref="firstname" name="firstname" data-text="firstname" placeholder="First Name" onChange={this.handleChange}
                              value={this.state.firstname} />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Last Name <span className="requiredsign">*</span></label>
                            <input type="text" className="form-control UMname  has-content"
                              id="lastname" ref="lastname" name="lastname" data-text="lastname" onChange={this.handleChange}
                              value={this.state.lastname} placeholder="Last Name" />
                          </div>
                        </div>
                        <div className="valid_box">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label >Email ID <span className="requiredsign">*</span></label>
                            <input type="text" className="formFloatingLabels form-control  newinputbox" ref="signupEmail" name="signupEmail" id="signupEmail" data-text="signupEmail" onChange={this.handleChange} value={this.state.signupEmail}
                              placeholder="Email" />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label >Mobile Number <span className="requiredsign">*</span></label>
                            <input  type="tel" minlength="10" maxlength="11" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="formFloatingLabels form-control  newinputbox" ref="mobile" name="mobile" id="mobile" data-text="mobile" onChange={this.handleChange} value={this.state.mobile}
                              placeholder="Mobile Number" />
                            {/* <PhoneInput
                              country = {'in'}
                              value   = {this.state.mobile}
                              name    = "mobile"
                              ref     = "mobile"
                              inputProps={{
                                name    : 'mobile',
                                required: true
                              }}
                              onChange={mobile => { this.setState({ mobile }) }}
                            /> */}
                          </div>
                        </div>
                        <div className="valid_box">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <label >Role <span className="requiredsign">*</span></label>
                            <div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="role">
                              <select className="form-control " value={this.state.role} onChange={this.handleChange} ref="role" id="role" name="role" data-text="role">
                                <option hidden> --Select-- </option>
                                {
                                  this.state.adminRolesListData && this.state.adminRolesListData.length > 0 ?
                                    this.state.adminRolesListData.map((data, index) => {
                                      // if (data.role != 'corporate' && data.role != 'vendor' && data.role != 'employee' && data.role != 'driver' && data.role != 'guest') {
                                        return (
                                          <option key={index} value={data.role}>{data.role}</option>
                                        );
                                      // }
                                    })
                                    :
                                    <option value='user'>User</option>
                                }
                              </select>
                            </div>
                          </div>
                        <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company ID <span className="requiredsign">*</span></label>
                            <input type="text" className="form-control UMname  has-content"
                              id="companyID" ref="companyID" name="companyID" data-text="companyID" onChange={this.handleChange}
                              value={this.state.companyID} placeholder="company ID" />
                          </div>
                        <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company Name <span className="requiredsign">*</span></label>
                            <input type="text" 
                              className="form-control UMname  has-content"
                              onFocus={ this.myFunction()}
                              // onBlur={this.myFunction()}
                              id="companyName" ref="companyName" 
                              name="companyName" data-text="companyName" 
                              onChange={this.handleChange} disabled
                              value={this.state.companyName} placeholder="company ID" 
                            />
                          </div>
                        </div>
                       
                        <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.createUser.bind(this)} id="CreateUserModal">{this.state.buttonType}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateUser;
