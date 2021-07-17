import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import jQuery               from 'jquery';
import swal                 from 'sweetalert';
import PhoneInput 			from 'react-phone-input-2';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
import Style                from './index.module.css';
import { connect }          from 'react-redux';
import  store               from '../../redux/store.js'; 
import {getAddressData}     from '../../redux/actions/index.js'; 


class UserAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:[],
            fields: {},
            errors: {},
            deliveryAddressID : "",
        }
    }
    componentDidMount(){  
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            this.setState({
                user_ID   : userDetails.user_id,
            },()=>{
                this.getUserDetails();
            })
        }
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
                this.setState({
                    address   : deliveryLocation.address,
                    city      : deliveryLocation.city,
                    country   : deliveryLocation.country,
                    area      : deliveryLocation.area,
                    pincode   : deliveryLocation.pincode,
                    latitude  : deliveryLocation.latitude,
                    longitude : deliveryLocation.longitude,
                })
            }
        }
    }
    getUserDetails() {
        if(this.state.user_ID){
        axios.get("/api/ecommusers/" +this.state.user_ID)
            .then((response) => {
            if(response){
                this.setState({
                    "deliveryAddress": response.data.deliveryAddress?response.data.deliveryAddress:null,
                    "fullname": response.data.profile.fullName,
                    "mobileNumber": response.data.profile.mobile,
                    "email": response.data.profile.email
                },()=>{
                    let fields = this.state.fields;
                    fields["fullname"] = response.data.profile.fullName;
                    fields["mobileNumber"] = response.data.profile.mobile;
                    this.setState({
                        fields
                    });
                });
            }
            })
            .catch((error) => {
                console.log('error', error);
            }); 
        } 
    }

    validateForm(){
		let fields = this.state.fields;
		let errors = {};
        let formIsValid = true;	
        if (!fields["fullname"]) {
            formIsValid = false;
            errors["fullname"] = "This field is required.";
          }
          if (typeof fields["fullname"] !== "undefined") {
            //regular expression for email validation
            var pattern = new RegExp(/^[a-zA-Z]{4,}(?: [a-zA-Z]+)?(?: [a-zA-Z]+)?$/)
            if (!pattern.test(fields["fullname"])) {
              formIsValid = false;
              errors["fullname"] = "Name should only contain letters.";
            }else{
              errors["fullname"] = "";
            }
        }
        if (!fields["mobileNumber"]) {
			formIsValid = false;
			errors["mobileNumber"] = "This field is required.";
		}
		if (typeof fields["mobileNumber"] !== "undefined") {
			//regular expression for email validation
			var pattern = new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/)
			if (!pattern.test(fields["mobileNumber"])) {
			  formIsValid = false;
			  errors["mobileNumber"] = "Please enter valid mobile number.";
			}
		}
       // for house no
        if (typeof fields["address1"] === "undefined") {           
            if (fields["address1"] === undefined) {
			  formIsValid = false;
			  errors["address1"] = "This feild is required";
			}
        }
        if (!fields["modaladdType"]) {
            formIsValid = false;
            errors["modaladdType"] = "Please select Address type.";
        }
        this.setState({
            errors: errors
          });
          return formIsValid;
        }
        saveAddress(event){
            event.preventDefault(); 
            var formValues = {
                "user_ID"           : this.state.user_ID,
                "name"              : this.state.fullname,
                "addressLine1"      : this.state.address1,
                "addressLine2"      : this.state.address,  
                "pincode"           : this.state.pincode,
                "district"          : "",
                "city"              : this.state.city,
                "area"              : this.state.area,
                "stateCode"         : this.state.stateCode,
                "state"             : this.state.state,
                "countryCode"       : this.state.countryCode,
                "country"           : this.state.country,
                "mobileNumber"      : this.state.mobileNumber,
                "addType"           : this.state.modaladdType,
                "latitude"          : this.state.latitude,
                "longitude"         : this.state.longitude,
            }
            // console.log("formValues =",formValues);
            if(this.state.deliveryAddressID){
                    if(this.validateForm()){
                    axios.patch('/api/ecommusers/updateuseraddress', formValues)
                    .then((response)=>{
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
                        swal({text:response.data}).then(function(){
                            this.props.fetchAddressData();
                        });
                    })
                    .catch((error)=>{
                        console.log('Address error===', error)
                    });
                }
            }else{ 
                if(this.validateForm()){
                    axios.patch('/api/ecommusers/patch/address', formValues)
                    .then((response)=>{
                    swal("Thank You!!! Address Save successfuly");
                    this.props.fetchAddressData();
                    })
                    .catch((error)=>{
                        console.log('error', error)
                    });  
                } 
            }
        }
        
    edit(deliveryAddressID){     
        if(this.state.userID){   
            axios.get('/api/ecommusers/'+this.state.userID)
            .then((response)=>{            
                var deliveryAddress = response.data.deliveryAddress.filter((a)=>{return a._id === deliveryAddressID});
               
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

    render() {  
        return (
            <div className="addressModal col-12 ">  
            <Message messageData={this.state.messageData} />
                <div className="row">
                    <form id="modalAddressForm" className="col-12 ">
                        <div className="col-12 NoPadding">
                            <div className="col-12 shippingInput mb-4">
                                <label className="col-12 NoPadding">Full Name <span className="required">*</span></label>
                                <input type="text" maxLength="40" ref="fullname" name="fullname"  value={this.state.fullname} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                <div className="errorMsg">{this.state.errors.fullname}</div>
                            </div> 
                            <div className="col-12 shippingInput mb-4">
                                <label className="col-12 NoPadding">Mobile Number <span className="required">*</span></label>
                                <input maxLength="10" placeholder="" type="text" ref="mobileNumber" name="mobileNumber"  value={this.state.mobileNumber} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                {/* <PhoneInput
                                    country={'ae'} 
                                    value={this.state.mobileNumber}
                                    inputProps={{
                                        name: 'mobileNumber',
                                        required: true
                                    }}
                                    // name = "Mobile"
                                    onChange={mobileNumber => { 
                                        this.setState({ mobileNumber })
                                            
                                            // this.setState({
                                            // 	mobNumber : this.state.mobNumber,
                                            // }); 
                                            // let fields = this.state.fields;
                                            // fields["mobNumber"] = this.state.mobNumber;
                                            // this.setState({
                                            // fields
                                            // });
                                    }} /> */}
                                <div className="errorMsg">{this.state.errors.mobileNumber}</div>
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">House No/Office No/Building Name <span className="required">*</span> </label>
                                <input type="text" ref="address1" name="address1" value={this.state.address1} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                <div className="errorMsg">{this.state.errors.address1}</div>
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">Area / Street Name</label>
                                <input type="text" ref="area" name="area" value={this.state.area} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">Address</label>
                                <input type="text" ref="address2" name="address2" value={this.state.address} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">City</label>
                                <input type="text" ref="city" name="city" value={this.state.city} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">Country</label>
                                <input type="text" ref="Country" name="Country"  value={this.state.country} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">Zip/Postal Code</label>
                                <input type="number" minLength="6" maxLength="6" ref="pincode" name="pincode" value={this.state.pincode}  className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                
                            </div>   
                            <div className="col-12 shippingInput mb-2">
                                <label className="col-12 NoPadding">Address type <span className="required">*</span></label>
                                <select name="modaladdType" ref="modaladdType" value={this.state.modaladdType} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1}>
                                    <option >-- Select Address Type --</option>
                                    <option value="Home">Home (All day delivery) </option>
                                    <option value="Office">Office/Commercial (10 AM - 5 PM Delivery)</option>
                                    <option value="Relative">Relative (All day delivery)</option>
                                    <option value="Friend">Friend (All day delivery)</option>
                                </select>
                                <div className="errorMsg">{this.state.errors.modaladdType}</div>
                            </div>
                            <div className=" checkoutAddressModal col-12 mt-2">
                                <div className={"col-8 mx-auto NoPadding " +Style.ma}>
                                    <button type="button" className={"btn globaleCommBtn align-center saveAddressBtn col-12 " +Style.saveBtn} onClick={this.saveAddress.bind(this)}>{this.props.addressId ? 'Update Address' :'Save Address'}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
      recentAddressData : state.data.recentAddressData,
    } 
);
const mapDispatchToProps = {
    fetchAddressData : getAddressData
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAddress);