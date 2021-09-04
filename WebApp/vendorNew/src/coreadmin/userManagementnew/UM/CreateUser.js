
import PhoneInput from 'react-phone-input-2';
import React, { Component } from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import './userManagement.css';
import PlacesAutocomplete, {geocodeByAddress,getLatLng} from "react-places-autocomplete";

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
      gmapsLoaded: false,
      firstname: "",
      lastname: "",
      signupEmail: "",
      mobile: "",
      companyName: "",
      role: "-- Select --",
      department: "-- Select --",
      designation: "-- Select --",
      cityName: "",
      states: "",
      employeeID: "",
      workLocation: "",
      corporate_Id: "",
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

  initMap = () => {
      this.setState({
        gmapsLoaded: true,
      })
  }
  getEntityLocation(companyId) {
    console.log("getEntityLocation",companyId)
    axios.get('/api/entitymaster/getCompany/' + companyId)
      .then((response) => {
        console.log("response.data[0]==>",response.data.locations)
        this.setState({
          corporateLocationArray: response.data.locations
        },()=>{
        })
      })
      .catch((error) => {

      })
  }
  handleChange(event) {
    const datatype = event.target.getAttribute('data-text');
    const target = event.target;
    const name   = target.name;
    const value  = target.value;
    if(name==='role'){
      var e = document.getElementById("role");
      var rolesentityname = e.options[e.selectedIndex].id;
      console.log("rolesentityname==>",rolesentityname);
      this.setState({
        rolesentityname: rolesentityname
      })
    }
    let formerrors = this.state.formerrors;
    this.setState({[name]:event.target.value},()=>{if(name=='companyID'){
      
      axios.post('/api/entitymaster/get/one/companyName' , {"companyID":this.state.companyID})
      .then((response) => {
        this.getEntityLocation(this.state.companyID)
        var companyName = response.data.companyName;
        if (companyName == null) {
          this.setState({
            companyName: "No Company Available"
          })
        } else {
          this.setState({
            companyName: companyName
          })
        }

      }).catch(function (error) { });
    }})
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

      case 'department':
        formerrors.department = value !== "--select--" ? "" : "Please select department";
        break;

      case 'designation':
        formerrors.designation = value !== "--select--" ? "" : "Please select designation";
        break;

      case 'city':
        formerrors.city = value !== "--select--" ? "" : "Please select city";
        break;

      case 'state':
        formerrors.state = value !== "--select--" ? "" : "Please select state";
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

    $.validator.addMethod("regxdesignation", function (value, element, arg) {
      return arg !== value;
    }, "Please select the Designation");


    $.validator.addMethod("regxdepartment", function (value, element, arg) {
      return arg !== value;
    }, "Please select the Department");


    $.validator.addMethod("regxcity", function (value, element, arg) {
      return arg !== value;
    }, "Please select the City");

    $.validator.addMethod("regxstate", function (value, element, arg) {
      return arg !== value;
    }, "Please select the state");


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
        department: {
          required: true,
          regxdepartment: "--Select--"
        },
        designation: {
          required: true,
          regxdesignation: "--Select--"
        },
        city: {
          required: true,
          regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
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
        if (element.attr("name") === "department") {
          error.insertAfter("#department");
        }
        if (element.attr("name") === "designation") {
          error.insertAfter("#designation");
        }
        if (element.attr("name") === "city") {
          error.insertAfter("#city");
        }
      }
    });
  }

  handleworklocationChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;

  
    // console.log("companyID..",compID);
    var vendorLocation = document.getElementById("workLocation");
    var locationID = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("locationID");
    var branchCode = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("branch-code");
    var district = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("district");
    var value = event.target.value;
    this.setState({
      [name]: event.target.value,
      workLocationId: locationID,
      branchCode: branchCode,
      workLocationDistrict: district,
     })

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
        role: {
          required: true,
          regxRole: "--Select--"
        }
       
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
      }
    });
  }
  changeMobile(event) {
    this.setState({
      mobile: event
    }, () => {
      if (this.state.mobile) {
        this.setState({
          companyPhoneAvailable: this.state.mobile === "+" || this.state.mobile.length<12 ? false : true
        },()=>{
        })
      }
    })
  }
  componentDidMount() {
    // console.log("inside create user")
    var companyID = localStorage.getItem('companyID')
    this.validation();
    this.getDepartment();
    this.getDesignation();
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
            "companyID": companyID,
          }
          this.props.getData(data);
        }
      )
      .catch((error) => {});
  }
  getDepartment() {
    axios.get("/api/departmentmaster/get/list")
      .then((response) => {
        // console.log("departmentArray==>",response.data[0])
        this.setState({
          departmentArray: response.data
        })
      })
      .catch((error) => {
        
      })
  }
  getDesignation() {
    axios.get("/api/designationmaster/get/list")
      .then((response) => {
        // console.log("designationArray==>",response.data)
        this.setState({
          designationArray: response.data
        })
      })
      .catch((error) => {
      })
  }
  createUser(event) {
    event.preventDefault();
    var companyID = localStorage.getItem('companyID')

    if (this.state.role === "user") {
        console.log('userid companyName==>>>', this.state.companyName)
        // console.log('userid companyName==>>>', this.state.companyID)
        axios.get('/api/entitymaster/get/companyName/' + this.state.companyID)
          .then((response) => {
            console.log("response.dataresponse.data",response.data);
            var companyName = response.data.companyName;
            this.setState({
              companyName: companyName,
              corporate_Id:response.data._id
            })
            this.setState(() => {
              if (this.state.companyName === "No Company Available") {
                swal({
                  title: "",
                  text: "Company ID " + this.state.companyID + " is not valid Company ID",
                });
              } else {
                console.log('this.state.role Post==>>>', this.state.role)
                const formValues = {
                  "username"    : "MOBILE",
                  "firstname": this.state.firstname,
                  "lastname": this.state.lastname,
                  "email": this.state.signupEmail,
                  "mobNumber": (this.state.mobile).replace("-", ""),
                  "pwd": "welcome123",
                  // "role": this.state.role !== "employee" ? ["  employee",this.state.role] : ["employee"],
                  "role"  : [this.state.role],

                  "department"      : this.state.department,
                  "designation"     : this.state.designation,
                  "cityName"        : this.state.cityName,
                  "states"          : this.state.states,
                  "companyID"       : "1",
                  "workLocation"    : this.state.workLocation,
                  "companyName"     : companyName,
                  "status"          : this.state.role ==="student" || this.state.role ==="admin"  ? "active" :"blocked",
                }
                console.log('userid Post==>>>', formValues)
                if (this.state.firstname !== "" && this.state.companyName !== "" && this.state.lastname !== "" && this.state.signupEmail && this.state.mobile ) {
                  axios.post('/api/auth/post/signup/user', formValues)
                    .then((res) => {
                      console.log('userid Post==>>>', res.data.ID)
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
                        var sendData = {
                          "event": "Event2", //Event Name
                          "toUser_id": res.data._id, //To user_id(ref:users)
                          "toUserRole":"student",
                          "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
                          "otherAdminRole":'corporateadmin',
                          "variables": {
                            'EmployeeName': this.state.firstname + ' ' + this.state.lastname,
                            'Password': "welcome123",
                            'mobileNo': this.state.mobile,
                            'email': this.state.signupEmail,
                          }
                        }
                        // console.log('sendData: ',sendData)
                        axios.post('/api/masternotifications/post/sendNotification', sendData)
                        .then((res) => {
                        console.log('sendDataToUser in result==>>>', res.data)
                        })
                        .catch((error) => { console.log('notification error: ',error)})
                          var contactDetailspersonmaster  = {
                              'firstName'       : this.state.firstname,
                              'lastName'        : this.state.lastname,
                              'contactNo'       : (this.state.mobile).replace("-", ""),
                              'phone'           : (this.state.mobile).replace("-", ""),
                              'email'           : this.state.signupEmail,
                              "departmentName"  : this.state.department,
                              "designationName" : this.state.designation,
                              "workLocation"  : this.state.workLocation,
                              "workLocationId"  : this.state.workLocationId,
                              "address"         : [{
                                                  "city"        : this.state.cityName,
                                                  "state"          : this.state.states,
                                                  addressLine1:  "",
                                                  addressLine2: "",
                                                  landmark:  "",
                                                  area: "",
                                                  district: "",
                                                  stateCode: "",
                                                  country: "",
                                                  countryCode: "",
                                                  latitude:  "",
                                                  longitude: "",
                                                  pincode: "",
                                                  }],
                              "companyID"       : "1",
                              // "company_Id"      : this.state.corporate_Id,
                              // "companyName"     : companyName,
                              "employeeId"      : this.state.employeeID,
                              // "type"            : this.state.rolesentityname === "corporate" ? 
                              //                     "employee": null ||
                              //                     this.state.rolesentityname === "vendor" ? 
                              //                     this.state.role ==="vendoradmin" ? "employee" : "driver"
                              //                     :null,
                              "entityType"      : this.state.rolesentityname,
                              "userId"          : res.data.ID,
                              "status"          : "Active",
                            }
                          
                          if(contactDetailspersonmaster.type == "driver" || "employee" || "guest"){
                            console.log('in contactDetailspersonmaster==>>>', contactDetailspersonmaster);

                            axios.post('/api/personmaster/post' ,contactDetailspersonmaster)
                            .then((response) => {
                              console.log('in result Res data==>>>', response.data);
                            })
                            .catch((error) => {
                              swal( "somme error occure ",error);
                            })
                          }
                          
                        swal( "User added successfully! \n Email Id: "+this.state.signupEmail+"\n Default Password: "+"welcome123");
                        var data = {
                          "startRange": this.state.startRange,
                          "limitRange": this.state.limitRange,
                          "companyID": this.props.companyID,
                        }
                        this.props.getData(data);
                        this.setState({
                          firstname: "",
                          lastname: "",
                          companyID: "",
                          signupEmail: "",
                          mobile: "",
                          role: "",
                          centerName: "",
                          department: "",
                          designation: "",
                          cityName: "",
                          states: "",
                          companyName: "",
                          show: false,
                          'buttonType': 'Register User'
                        }, () => {
                          var data = {
                            "startRange": this.state.startRange,
                            "limitRange": this.state.limitRange,
                            "companyID": this.props.companyID,
                          }
                          this.props.getData(data);
                          var modal = document.getElementById("CreateUserModal");
                          modal.style.display = "none";
                          $('.modal-backdrop').remove();
                          $("#CreateUserModal .close").click()
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
          }).catch(function (error) { });
    }else{
      
      // if ($('#userInfo').valid()) {
        console.log('userid companyName==>>>', companyID)
          // console.log('userid companyName==>>>', this.state.companyID)
          axios.get('/api/entitymaster/get/companyName/' + companyID)
            .then((response) => {
              console.log("response.dataresponse.data",response.data);
              var companyName = response.data.companyName;
              this.setState({
                companyName: companyName,
                corporate_Id:response.data._id
              })
              this.setState(() => {
                if (this.state.companyName === "No Company Available") {
                  swal({
                    title: "",
                    text: "Company ID " + companyID + " is not valid Company ID",
                  });
                } else {
                  console.log('this.state.role Post==>>>', this.state.role)
                  const formValues = {
                    "firstname": this.state.firstname,
                    "lastname": this.state.lastname,
                    "email": this.state.signupEmail,
                    "mobNumber": (this.state.mobile).replace("-", ""),
                    "pwd": "welcome123",
                    // "role": this.state.role !== "employee" ? ["  employee",this.state.role] : ["employee"],
                    "role"  : [this.state.role],

                    "department"      : this.state.department,
                    "designation"     : this.state.designation,
                    "cityName"        : this.state.cityName,
                    "states"          : this.state.states,
                    "companyID"       : "1",
                    "workLocation"    : this.state.workLocation,
                    "companyName"     : companyName,
                    "status"          : this.state.role ==="student" || this.state.role ==="admin"  ? "active" :"blocked",
                  }
                  console.log('userid Post==>>>', formValues)
                  if (this.state.firstname !== "" && this.state.companyName !== "" && this.state.lastname !== "" && this.state.signupEmail && this.state.mobile ) {
                    axios.post('/api/auth/post/signup/user', formValues)
                      .then((res) => {
                        console.log('userid Post==>>>', res.data.ID)
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
                          var sendData = {
                            "event": "Event2", //Event Name
                            "toUser_id": res.data._id, //To user_id(ref:users)
                            "toUserRole":"student",
                            "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
                            "otherAdminRole":'corporateadmin',
                            "variables": {
                              'EmployeeName': this.state.firstname + ' ' + this.state.lastname,
                              'Password': "welcome123",
                              'mobileNo': this.state.mobile,
                              'email': this.state.signupEmail,
                            }
                          }
                          // console.log('sendData: ',sendData)
                          axios.post('/api/masternotifications/post/sendNotification', sendData)
                          .then((res) => {
                          console.log('sendDataToUser in result==>>>', res.data)
                          })
                          .catch((error) => { console.log('notification error: ',error)})
                            var contactDetailspersonmaster 	= {
                                'firstName'       : this.state.firstname,
                                'lastName'        : this.state.lastname,
                                'contactNo'       : (this.state.mobile).replace("-", ""),
                                'phone'           : (this.state.mobile).replace("-", ""),
                                'email'           : this.state.signupEmail,
                                "departmentName"  : this.state.department,
                                "designationName" : this.state.designation,
                                "workLocation"  : this.state.workLocation,
                                "workLocationId"  : this.state.workLocationId,
                                "address"         : [{
                                                    "city"        : this.state.cityName,
                                                    "state"          : this.state.states,
                                                    addressLine1:  "",
                                                    addressLine2: "",
                                                    landmark:  "",
                                                    area: "",
                                                    district: "",
                                                    stateCode: "",
                                                    country: "",
                                                    countryCode: "",
                                                    latitude:  "",
                                                    longitude: "",
                                                    pincode: "",
                                                    }],
                                "companyID"       : "1",
                                // "company_Id"      : this.state.corporate_Id,
                                // "companyName"     : companyName,
                                "employeeId"      : this.state.employeeID,
                                // "type"            : this.state.rolesentityname === "corporate" ? 
                                //                     "employee": null ||
                                //                     this.state.rolesentityname === "vendor" ? 
                                //                     this.state.role ==="vendoradmin" ? "employee" : "driver"
                                //                     :null,
                                "entityType"      : this.state.rolesentityname,
                                "userId"          : res.data.ID,
                                "status"          : "Active",
                              }
                            
                            if(contactDetailspersonmaster.type == "driver" || "employee" || "guest"){
                              console.log('in contactDetailspersonmaster==>>>', contactDetailspersonmaster);

                              axios.post('/api/personmaster/post' ,contactDetailspersonmaster)
                              .then((response) => {
                                console.log('in result Res data==>>>', response.data);
                              })
                              .catch((error) => {
                                swal( "somme error occure ",error);
                              })
                            }
                            
                          swal( "User added successfully! \n Email Id: "+this.state.signupEmail+"\n Default Password: "+"welcome123");
                          var data = {
                            "startRange": this.state.startRange,
                            "limitRange": this.state.limitRange,
                            "companyID": this.props.companyID,
                          }
                          this.props.getData(data);
                          this.setState({
                            firstname: "",
                            lastname: "",
                            companyID: "",
                            signupEmail: "",
                            mobile: "",
                            role: "",
                            centerName: "",
                            department: "",
                            designation: "",
                            cityName: "",
                            states: "",
                            companyName: "",
                            show: false,
                            'buttonType': 'Register User'
                          }, () => {
                            var data = {
                              "startRange": this.state.startRange,
                              "limitRange": this.state.limitRange,
                              "companyID": this.props.companyID,
                            }
                            this.props.getData(data);
                            var modal = document.getElementById("CreateUserModal");
                            modal.style.display = "none";
                            $('.modal-backdrop').remove();
                            $("#CreateUserModal .close").click()
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
            }).catch(function (error) { });
      // }
          

    }

  }

  companynamewithid() {
    // console.log(" this.state.companyID==>>", this.state.companyID)
    axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
      .then((response) => {
        var companyName = response.data.companyName;
        this.setState({
          companyName: companyName
        })
      }).catch(function (error) { });
  }
  getRole() {
		axios.post('/api/roles/get/list')
		  .then((response) => {
        // console.log("response from role =>",response.data[0].rolesentity);
        // console.log("response from role =>",response);
        this.setState({
          adminRolesListData: response.data
        })
		  }).catch(function (error) {
		  });
	}
  handleChangePlaces = address => {
    var array = {
      cityName: address,
    }
    this.setState({ cityName: address, tripArray: array });
  };
  handleSelectLocation = address => {
    console.log(address)
    geocodeByAddress(address)
      .then((results) => {

        for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
            switch (results[0].address_components[i].types[b]) {
              case 'sublocality_level_1':
                var area = results[0].address_components[i].long_name;
                break;
              case 'sublocality_level_2':
                var area = results[0].address_components[i].long_name;
                break;
              case 'locality':
                var city = results[0].address_components[i].long_name;
                break;
              case 'administrative_area_level_1':
                var state = results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log("state===>>>>", state)
        this.setState({ states: state })
      })
      .catch(error => console.error('Error', error));
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ 'fromLatLng': latLng }))
      .catch(error => console.error('Error', error));
    var array = {
      cityName: address,
    }
    console.log("address===>>>>", address)
    this.setState({ 
      cityName: address ? address.split(",")[0] : "", 
      tripArray: array });
  };
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

    CreateUserModal(){
    console.log("inside Modal open")                                                                                                                                                                                                                                                                                                                                                                  
    window.$("#CreateUserModal").modal("show");
    console.log("Modal open")
  }

  render() {
    const searchOptions = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    }
    const { formerrors } = this.state;
    // console.log("open  modal inner page")
    return (
      <div>
        <div className="modal" id="CreateUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg " role="document">
            <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" onClick={this.close.bind(this)} className="close " data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title row userTitle" id="exampleModalLabel">Add New User </h4>
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
                            {/* <input type="number"  required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="formFloatingLabels form-control  newinputbox" ref="mobile" name="mobile" id="mobile" data-text="mobile" onChange={this.handleChange} value={this.state.mobile}
                              placeholder="Mobile Number" /> */}
                              <PhoneInput
                              country={'us'}
                                value={this.state.mobile}
                                  name="mobile"
                                  inputProps={{
                                    name: 'mobile',
                                    required: true
                                  }}
                                  onChange={this.changeMobile.bind(this)}
                                />
                                {this.state.companyPhoneAvailable === true ? null : <label className="error">Please enter valid number</label>}
                          </div>
                        </div>
                        <div className="valid_box">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <label >Role <span className="requiredsign">*</span></label>
                            <div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" >
                              <select ref="role" name="role"
                                      value={this.state.role}  id="role" onChange={this.handleChange.bind(this)}
                                       className="form-control">
                                        <option hidden>--Select--</option>
                                         {
                                          this.state.adminRolesListData && this.state.adminRolesListData.length > 0 ?
                                          this.state.adminRolesListData.map((roledata, index)=>{
                                            // console.log("roledata ==> " , roledata);
                                            return(      
                                                <option key={index} id={roledata.rolesentity} value={roledata.role}>{roledata.role}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                    </select>
                            </div>
                          </div>
                        {/*prince comment code started*/}

                         {this.state.role !== "-- Select --"  && this.state.role !== "driver" ?
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Employee ID <span className="requiredsign">*</span></label>
                              <input type="text" className="form-control UMname  has-content"
                                id="employeeID" ref="employeeID" name="employeeID" data-text="employeeID"
                                onChange={this.handleChange}
                                value={this.state.employeeID} placeholder="Employee ID" />
                          </div>
                          :
                          null
                          }
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company ID <span className="requiredsign">*</span></label>
                            <input type="text" className="form-control UMname  has-content"
                              id="companyID" ref="companyID" name="companyID" data-text="companyID" 
                              onChange={this.handleChange}
                              value={this.state.companyID} placeholder="Company ID" />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company Name <span className="requiredsign">*</span></label>
                            <input type="text"
                              className="form-control UMname  has-content"
                              id="companyName" ref="companyName"
                              name="companyName" data-text="companyName"
                              onChange={this.handleChange}
                               disabled
                              value={this.state.companyName} placeholder="Company Name"
                            />
                          </div>


                        {/*prince comment code ended*/}

                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company Location <span className="requiredsign">*</span></label>
                            <input type="text"
                              className="form-control UMname  has-content"
                              id="workLocation" ref="workLocation"
                              name="workLocation" data-text="workLocation"
                              onChange={this.handleChange}
                               disabled
                              value={this.state.workLocation} placeholder="Company Location"
                            />
                          </div> 
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <label >Company Location <span className="requiredsign">*</span></label>
                            <div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="workLocation">
                              <select className="form-control " value={this.state.workLocation} onChange={this.handleChange} ref="workLocation" id="workLocation" name="workLocation" data-text="workLocation">
                              <option selected={true} disabled={true}>--Select Office Location--</option>
                                {
                                  this.state.corporateLocationArray && 
                                    this.state.corporateLocationArray.map((data, i) => {
                                      // console.log("data",data)
                                      return (
                                        <option key={i} locationID={data._id} branch-code={data.branchCode} value={data.addressLine1}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
                                      );
                                    })
                                    // :
                                    // null
                                }
                              </select>
                            </div>
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
