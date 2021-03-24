import React, { Component } from 'react';
import $       from 'jquery';
import axios   from 'axios';
import jQuery  from 'jquery';
import Message from '../../CustomizeBlocks/Message/Message.js';
// import 'jquery-validation';
// import "../../../sites/currentSite/pages/Address.css";

import PlacesAutocomplete, { geocodeByAddress,getLatLng } from "react-places-autocomplete";

// import ModaalHeaderImg from 'images/eCommerce/bookLogo.webp';
import swal from 'sweetalert';
class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateArray:[],
            pincodeExists:true,
            deliveryAddress: [],
            addressLine1 : "",
            modaladdType : "",
            modalname    : "",
            fields: {},
            errors: {},
        }
        this.camelCase = this.camelCase.bind(this)
        
    }
    componentDidMount(){        
        this.setState({
            "userID"       : localStorage.getItem('user_ID'),
            "websiteModel" : localStorage.getItem('websiteModel')
        },()=>{
            
        });
        // this.modalvalidation();
        // this.edit(this.props.addressId);
    }
    validateForm() {
		let fields = this.state.fields;
		let errors = {};
        let formIsValid = true;	
        	
		if (!fields["modalname"]) {
            formIsValid = false;
            errors["modalname"] = "This field is required.";
        }
        if (typeof fields["modalname"] !== "undefined") {			
        //regular expression for modalname validation
        var pattern = new RegExp(/^[A-za-z']+( [A-Za-z']+)*$/)
        if (!pattern.test(fields["modalname"])) {
            formIsValid = false;
            errors["modalname"] = "Name should only contain letters.";
        }else{
            errors["modalname"] = "";
        }
        }

        if (!fields["modalemail"]) {
			formIsValid = false;
			errors["modalemail"] = "Please enter your modalemail.";
		  }
		  if (typeof fields["modalemail"] !== "undefined") {
			//regular expression for modalemail validation
			var pattern = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
			if (!pattern.test(fields["modalemail"])) {
			  formIsValid = false;
			  errors["modalemail"] = "Please enter valid modalemail.";
			}
		  }
	  
		if (!fields["modalmobileNumber"]) {
			formIsValid = false;
			errors["modalmobileNumber"] = "This field is required.";
		}
		if (typeof fields["modalmobileNumber"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([7-9][0-9]{9})$/)
			if (!pattern.test(fields["modalmobileNumber"])) {
			  formIsValid = false;
			  errors["modalmobileNumber"] = "Please enter valid mobile number.";
			}
        }
        
       // for house no
        if (typeof fields["modaladdressLine2"] === "undefined") {           
            if (fields["modaladdressLine2"] === undefined) {
			  formIsValid = false;
			  errors["modaladdressLine2"] = "This feild is required";
			}
        }

        // if (typeof fields["addressLine1"] === "undefined") {
        //     console.log("addressLine1",fields["addressLine1"])
        //     if (fields["addressLine1"] === undefined) {
		// 	  formIsValid = false;
		// 	  errors["addressLine1"] = "This feild is required";
		// 	}
        // }

        // if (fields["pincode"]==="") {
		// 	formIsValid = false;
		// 	errors["pincode"] = "This field is required.";
		// }
		// if (typeof fields["pincode"] !== "undefined") {
        //     var pattern = new RegExp(/^[1-9][0-9]{5}$/);
        //     console.log("pattern.test(fields)==",pattern.test(fields["pincode"]));
        //     console.log("pattern.test(fields)==", fields["pincode"]);
		// 	if (pattern.test(fields["pincode"])) {
		// 	  formIsValid = false;
		// 	  errors["pincode"] = "Please enter 6 digit pincode.";
		// 	}
        // }

        if (!fields["modaladdType"]) {
            formIsValid = false;
            errors["modaladdType"] = "Please select Address type.";
        }
        this.setState({
            errors: errors
          });
          return formIsValid;
        }
    // modalvalidation() {
    //     $.validator.addMethod("modalregxname", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Name should only contain letters & number.");
    //     $.validator.addMethod("modalregxmobileNumber", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid mobile number.");
    //     $.validator.addMethod("regxmodalemail", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid email address.");
    //     $.validator.addMethod("regexmodaladdressLine", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid address.");
    //     $.validator.addMethod("modalregxpincode", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid pincode");
    //     // $.validator.addMethod("modalregxblock", function (value, element, regexpr) {
    //     //     return regexpr.test(value);
    //     // }, "Please enter valid block");
    //     $.validator.addMethod("modalregxdistrict", function (value, element, arg) {
    //         return arg !== value;
    //     }, "Please select the district");
    //     $.validator.addMethod("modalregxcity", function (value, element, regexpr) {
    //         return regexpr.test(value);
    //     }, "Please enter valid city");
    //     $.validator.addMethod("modalregxstate", function (value, element, arg) {
    //         return arg !== value;
    //     }, "Please select the state");
    //     $.validator.addMethod("modalregxcountry", function (value, element, arg) {
    //         return arg !== value;
    //     }, "Please select the country");
    //     $.validator.addMethod("modalregxaddType", function (value, element, arg) {
    //         return arg !== value;
    //     }, "Please select the address type");

    //     jQuery.validator.setDefaults({
    //         debug: true,
    //         success: "valid"
    //     });

    //     $("#modalAddressForm").validate({
    //         rules: {
    //             modalname: {
    //                 required: true,
    //                 modalregxname : /^[A-Za-z][A-Za-z0-9\-\s]*$/,
    //             },
    //             modalmobileNumber: {
    //                 required: true,
    //                 modalregxmobileNumber: /^([7-9][0-9]{9})$/,
    //             },
    //             modalemail: {
    //                 required: true,
    //                 regxmodalemail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    //             },
    //             modaladdressLine1: {
    //                 required: true,
    //                 regexmodaladdressLine : /^[A-Za-z0-9_@./#&+-]/,
    //             },
    //             // modaladdressLine2: {
    //             //     required: true,
    //             //     regexmodaladdressLine : /^[A-Za-z0-9_@./#&+-]/,
    //             // },
    //             modalpincode: {
    //                 required: true,
    //                 modalregxpincode : /^[1-9][0-9]{5}$/,
    //             },
    //             // modalblock: {
    //             //     required: true,
    //             //     modalregxblock : /^[A-Za-z][A-Za-z\-\s]*$/,
    //             // },
    //             modalcity: {
    //                 required: true,
    //                 modalregxcity : /^[A-Za-z][A-Za-z\-\s]*$/,
    //             },
    //             modaldistrict: {
    //                 required: true,
    //                 modalregxdistrict: "Select District"
    //             },
    //             modalstate: {
    //                 required: true,
    //                 modalregxstate: "Select State"
    //             },
    //             modalcountry: {
    //                 required: true,
    //                 modalregxcountry: "Select Country"
    //             },
    //             modaladdType: {
    //                 required: true,
    //                 modalregxaddType: "Select Type"
    //             },
    //         },
    //         errorPlacement: function (error, element) {
    //             if (element.attr("name") === "modalname") {
    //                 error.insertAfter("#modalname");
    //             }
    //             if (element.attr("name") === "modalmobileNumber") {
    //                 error.insertAfter("#modalmobileNumber");
    //             }
    //             if (element.attr("name") === "modalemail") {
    //                 error.insertAfter("#modalemail");
    //             }
    //             if (element.attr("name") === "modaladdressLine1") {
    //                 error.insertAfter("#modaladdressLine1");
    //             }
    //             // if (element.attr("name") == "modaladdressLine2") {
    //             //     error.insertAfter("#modaladdressLine2");
    //             // }
    //             if (element.attr("name") === "modalpincode") {
    //                 error.insertAfter("#modalpincode");
    //             }
    //             // if (element.attr("name") == "modalblock") {
    //             //     error.insertAfter("#modalblock");
    //             // }
    //             if (element.attr("name") === "modaldistrict") {
    //                 error.insertAfter("#modaldistrict");
    //             }
    //             if (element.attr("name") === "modalcity") {
    //                 error.insertAfter("#modalcity");
    //             }
    //             if (element.attr("name") === "modalstateCode") {
    //                 error.insertAfter("#modalstate");
    //             }
    //             if (element.attr("name") === "modalcountryCode") {
    //                 error.insertAfter("#modalcountry");
    //             }
    //             if (element.attr("name") === "modaladdType") {
    //                 error.insertAfter("#modaladdType");
    //             }
    //         }
    //     });
    // }
    edit(deliveryAddressID){        
        // var deliveryAddressID = this.props.match.params.deliveryAddressID;
        // console.log('deliveryAddressID', deliveryAddressID);
        if(this.state.userID){  
            axios.get('/api/ecommusers/'+this.state.userID)
            .then((response)=>{            
                var deliveryAddress = response.data.deliveryAddress.filter((a)=>{return a._id === deliveryAddressID});
                // console.log("deliveryAddress:====" ,response.data.deliveryAddress[0]);

                // this.getStates(deliveryAddress[0].countryCode);            
                // this.getDistrict(deliveryAddress[0].stateCode,deliveryAddress[0].countryCode)
                if(deliveryAddress[0]){
                    this.setState({
                        "modalname"            : deliveryAddress[0].name,
                        "modalemail"           : deliveryAddress[0].email,
                        "addressLine1"         : deliveryAddress[0].addressLine1,
                        "modaladdressLine2"    : deliveryAddress[0].addressLine2,  
                        "modalPincode"         : deliveryAddress[0].pincode,
                        "modalarea"            : deliveryAddress[0].block,
                        "modaldistrict"        : deliveryAddress[0].district,
                        "modalcity"            : deliveryAddress[0].city,
                        "modalstateCode"       : deliveryAddress[0].stateCode,
                        "modalstate"           : deliveryAddress[0].state,
                        "modalcountryCode"     : deliveryAddress[0].countryCode,
                        "modalcountry"         : deliveryAddress[0].country,
                        "modalmobileNumber"    : deliveryAddress[0].mobileNumber,
                        "modaladdType"         : deliveryAddress[0].addType,
                        "latitude"             : deliveryAddress[0].latitude,
                        "longitude"            : deliveryAddress[0].longitude,
                        
                    })
                }
            })
            .catch((error)=>{
                console.log('error', error);
            });
        }
    }
    // static getDerivedStateFromProps(nextProps, state) {
    //     console.log("nextProps====",nextProps,state);
    //     console.log("nextProps====",nextProps.addressId);
    //     // if(nextProps.addressId){
    //     //       edit(nextProps.addressId);            
    //     // }
    //     return null;
    // }
    componentWillReceiveProps(nextProps){
        // console.log("nextProps===",nextProps);
        this.edit(nextProps.addressId);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'modalPincode') {
            this.handlePincode(event.target.value);
        }
        let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
    }
    handlePincode(pincode){        
        if (pincode !== '') {
            axios.get("https://api.postalpincode.in/pincode/" +pincode)
            .then((response) => {
                // console.log('valid', $("[name='modalpincode']").valid())
                // console.log('pincodeExists', this.state.pincodeExists);

                if ($("[name='modalPincode']").valid()) {

                    if (response.data[0].Status === 'Success' ) {
                        this.setState({pincodeExists : true})
                    }else{
                        this.setState({pincodeExists : false})
                    }
                }else{
                    this.setState({pincodeExists : true})
                }
                
            })
            .catch((error) => {
                console.log('error', error);
            })
        }else{
            this.setState({pincodeExists : true})
        }
    }

     //google API 
     handleChangePlaces = address => {
        this.setState({ addressLine1 : address});
    };
    
    handleSelect = address => {    
        geocodeByAddress(address)
         .then((results) =>{
            //  console.log("Google API Address=====",results);
          for (var i = 0; i < results[0].address_components.length; i++) {
              for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                  switch (results[0].address_components[i].types[b]) {
                      case 'sublocality_level_1':
                          var area = results[0].address_components[i].long_name;
                          break;
                      case 'sublocality_level_2':
                          area = results[0].address_components[i].long_name;
                          break;
                      case 'locality':
                          var city = results[0].address_components[i].long_name;
                          break;
                      case 'administrative_area_level_1':
                          var state = results[0].address_components[i].long_name;
                          var stateCode = results[0].address_components[i].short_name;
                          break;
                      case 'administrative_area_level_2':
                          var district = results[0].address_components[i].long_name;
                          break;
                      case 'country':
                         var country = results[0].address_components[i].long_name;
                         var countryCode = results[0].address_components[i].short_name;
                          break;
                      case 'postal_code':
                         var pincode = results[0].address_components[i].long_name;
                         console.log("Pincode:",pincode);
                          break;
                      default :
                      break;
                  }
              }
          }
    
            this.setState({
                modalarea       : area,
                modalcity       : city,
                modaldistrict   : district,
                modalstate      : state,
                modalcountry    : country,
                modalPincode    : pincode,
                stateCode       :stateCode,
                modalcountryCode:countryCode,
            
            })
        })
        .catch(error => console.error('Error', error));
    
        geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) =>{            
            this.setState({'latitude' : lat});
            this.setState({'longitude' : lng});
            console.log('Successfully got latitude and longitude', { lat, lng });
        });  

        this.setState({ addressLine1 : address});        
      }; //end google api
   
    saveAddress(event){
        event.preventDefault();        
        // console.log("address id :",id);
        var deliveryAddressID = this.props.addressId;
        // console.log("deliveryAddressID :",deliveryAddressID);
        // console.log("pincode:",this.state.modalPincode);
        var formValues = {
            "user_ID"           : this.state.userID,
            "deliveryAddressID" : deliveryAddressID,
            "name"              : this.state.modalname,
            "email"             : this.state.modalemail,
            "addressLine1"      : this.state.addressLine1,
            "addressLine2"      : this.state.modaladdressLine2,  
            "pincode"           : this.state.modalPincode,
            "district"          : this.state.modaldistrict,
            "city"              : this.state.modalcity,
            "area"              : this.state.modalarea,
            "stateCode"         : this.state.modalstateCode,
            "state"             : this.state.modalstate,
            "countryCode"       : this.state.modalcountryCode,
            "country"           : this.state.modalcountry,
            "mobileNumber"      : this.state.modalmobileNumber,
            "addType"           : this.state.modaladdType,
            "latitude"          : this.state.latitude,
            "longitude"         : this.state.longitude,
        }
        // console.log("formValues:",formValues);
        if(deliveryAddressID){
           // if($("#modalAddressForm").valid() && this.state.pincodeExists){
                if(this.validateForm()){
                // console.log('if form deliveryAddressID', formValues);
                axios.patch('/api/ecommusers/updateuseraddress', formValues)
                .then((response)=>{
                    // console.log("response after update:",response.data.message);
                this.setState({
                  messageData : {
                    "type" : "outpage",
                    "icon" : "fa fa-check-circle",
                    "message" : "&nbsp; "+response.data.message,
                    "class": "success",
                    "autoDismiss" : true
                  }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
                    swal(response.data);
                    this.props.opDone();
                    // $(".checkoutAddressModal").hide();                    
                    // $(".checkoutAddressModal").css({display: 'none'});                    
                    // $(".modal-backdrop").hide();
                    window.location.reload();
                })
                .catch((error)=>{
                    console.log('Address error===', error)
                });
            }
        }else{ 
            //if($("#modalAddressForm").valid() && this.state.pincodeExists){
                if(this.validateForm()){
                // console.log('else form deliveryAddressID', formValues);
                if(this.state.websiteModel === "FranchiseModel"){
                axios.get("/api/allowablepincode/checkpincode/" + formValues.pincode)
                .then((response) => {
                    if (response) {
                        if (response.data.message !== "Delivery Available") {
                            // console.log("Delevery not possible on this address");
                            swal({
                                text : "Delivery is not possible on this address"
                            })                            // $('#' + id).show();
                            // $(".placeOrder").attr("disabled", true);

                        }else{
                            axios.patch('/api/ecommusers/patch/address', formValues)
                            .then((response)=>{
                                // console.log(response.data.message);
                            this.setState({
                            messageData : {
                                "type" : "outpage",
                                "icon" : "fa fa-check-circle",
                                "message" : "&nbsp; "+response.data.message,
                                "class": "success",
                                "autoDismiss" : true
                            }
                            })
                            setTimeout(() => {
                                this.setState({
                                    messageData   : {},
                                })
                            }, 3000);
                                // swal(response.data.message);
                                this.props.opDone();
                                $(".checkoutAddressModal").hide();
                                // $(".checkoutAddressModal").show();                                
                                // $(".checkoutAddressModal").css({display: 'none'});
                                $(".modal-header").css({display: 'block'});
                                $(".modal-body").css({display: 'block'});
                                $(".modal-footer").css({display: 'block'});
                                // $(".checkoutAddressModal").removeClass("in");
                                $(".modal-backdrop").hide();
                                // window.location.reload();
                            })
                            .catch((error)=>{
                                console.log('error', error)
                            });                               
                        }
                    }
                 }); 
                }else{
                    axios.patch('/api/ecommusers/patch/address', formValues)
                            .then((response)=>{
                                // console.log(response.data.message);
                            this.setState({
                            messageData : {
                                "type" : "outpage",
                                "icon" : "fa fa-check-circle",
                                "message" : "&nbsp; "+response.data.message,
                                "class": "success",
                                "autoDismiss" : true
                            }
                            })
                            setTimeout(() => {
                                this.setState({
                                    messageData   : {},
                                })
                            }, 3000);
                                // swal(response.data.message);
                                this.props.opDone();
                                $(".checkoutAddressModal").hide();
                                // $(".checkoutAddressModal").show();                                
                                // $(".checkoutAddressModal").css({display: 'none'});
                                $(".modal-header").css({display: 'block'});
                                $(".modal-body").css({display: 'block'});
                                $(".modal-footer").css({display: 'block'});
                                // $(".checkoutAddressModal").removeClass("in");
                                $(".modal-backdrop").hide();
                                // window.location.reload();
                            })
                            .catch((error)=>{
                                console.log('error', error)
                            });  
                }   
                
            }
        }
        
    }
    camelCase(str){
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    }
    Closepagealert(event){
        event.preventDefault();
        $(".toast-error").html('');
        $(".toast-success").html('');
        $(".toast-info").html('');
        $(".toast-warning").html('');
        $(".toast-error").removeClass('toast');
        $(".toast-success").removeClass('toast');
        $(".toast-info").removeClass('toast');
        $(".toast-warning").removeClass('toast');
    }
    cancel(){
        this.setState({
            "modalname"            : '',
            "modalemail"           : '',
            "addressLine1"         : '',
            "modaladdressLine2"    : '',
            "modalpincode"         : '',
            "modalblock"           : '',
            "modaldistrict"        : '',
            "modalcity"            : '',
            "modalstate"           : '',
            "modalcountry"         : '',
            "modalmobileNumber"    : '',
            "modaladdType"         : '',
        });
        // $("#modalAddressForm").validate().resetForm();
    }
    render() {  
        // console.log("On address Page===");     
        return (
            <div>
            <Message messageData={this.state.messageData} />   
{/* 
            <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
                
                <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Modal Header</h4>
                </div>
                <div className="modal-body">
                    <p>Some text in the modal.</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
                </div>

            </div>
            </div> */}

            <div className="modal addressModal col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 checkoutAddressModal NOpadding" id="checkoutAddressModal" role="dialog">                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"> 
                    <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                        <div className="modal-header checkoutAddressModal globalBgColor1 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {/* <img src="../../../sites/currentSite/images/Icon.png" /> */}
                            <img src={'images/eCommerce/kokilaLogo.svg'} />
                            <button type="button" className="close modalclosebut" onClick={this.cancel.bind(this)} data-dismiss="modal">&times;</button>
                            <h4 className="modal-title modalheadingcont">ADDRESS</h4>
                        </div>
                        <div className="modal-body addressModalBody col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <form id="modalAddressForm">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 shippingInput">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Full Name <span className="required">*</span></label>
                                    <input type="text" maxLength="40" ref="modalname" name="modalname" id="modalname" value={this.state.modalname} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                    <div className="errorMsg">{this.state.errors.modalname}</div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 shippingInput">
                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Mobile Number <span className="required">*</span></label>
                                        <input maxLength="10" placeholder="Eg. 9876543210" type="text" ref="modalmobileNumber" name="modalmobileNumber" id="modalmobileNumber" value={this.state.modalmobileNumber} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                        <div className="errorMsg">{this.state.errors.modalmobileNumber}</div>
                                        {/* <span className="col-lg-2 col-md-2 col-sm-1 col-xs-1  orderConfirmation fa fa-question-circle-o NOpadding" title="For delivery questions."></span> */}
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 shippingInput">
                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Email <span className="required">*</span></label>
                                        <input type="email" ref="modalemail" name="modalemail" id="modalemail" value={this.state.modalemail} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                        <div className="errorMsg">{this.state.errors.modalemail}</div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 shippingInput">
                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">House No/Office No </label>
                                        <input type="text" ref="modaladdressLine2" name="modaladdressLine2" id="modaladdressLine2" value={this.state.modaladdressLine2} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                        <div className="errorMsg">{this.state.errors.modaladdressLine2}</div>
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 shippingInput" >                                            
                                    <PlacesAutocomplete value= {this.state.addressLine1}
                                        onChange={this.handleChangePlaces}
                                        onSelect={this.handleSelect}
                                        >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Search your address here <span className="required">*</span></label>    
                                            <input
                                                {...getInputProps({
                                                placeholder : 'Search Address ...',
                                                className   : 'location-search-input col-lg-12 form-control errorinputText',
                                                id          :"addressLine1",
                                                name        :"addressLine1",
                                                valueprop   : this.state.addressLine1,                                                
                                                
                                                })}
                                            />
                                            <div className="errorMsg">{this.state.errors.addressLine1}</div>
                                            <div className="autocomplete-dropdown-container SearchListContainer">
                                                {loading && <div>Loading...</div>}
                                                {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                    >
                                                    <span>{suggestion.description}</span>
                                                    </div>
                                                    );
                                                    })}
                                                </div>
                                                </div>
                                        )}
                                    </PlacesAutocomplete>
                                </div>
                                
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 shippingInput">
                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Zip/Postal Code <span className="required">*</span></label>
                                        <input type="number" minLength="6" maxLength="6" ref="modalPincode" name="modalPincode" id="modalPincode" value={this.state.modalPincode}  onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                        {this.state.pincodeExists ? null : <label className="error" style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}
                                        <div className="errorMsg">{this.state.errors.modalPincode}</div>
                                    </div>                                    

                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 shippingInput">
                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Address type <span className="required">*</span></label>
                                        <select id="modaladdType" name="modaladdType" ref="modaladdType" value={this.state.modaladdType} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control">
                                            <option value="Home">Home (All day delivery) </option>
                                            <option value="Office">Office/Commercial (10 AM - 5 PM Delivery)</option>
                                            <option value="Relative">Relative (All day delivery)</option>
                                            <option value="Friend">Friend (All day delivery)</option>
                                        </select>
                                        <div className="errorMsg">{this.state.errors.modaladdType}</div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer checkoutAddressModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <button type="button" className="btn globaleCommBtn" data-dismiss="modal" onClick={this.cancel.bind(this)}>Cancel</button>
                                <button type="button" className="btn globaleCommBtn" onClick={this.saveAddress.bind(this)}>{this.props.addressId ? 'Update Address' :'Save Address'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Address;