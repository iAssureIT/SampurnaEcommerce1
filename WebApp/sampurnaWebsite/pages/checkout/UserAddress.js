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
            addressId : ""
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.addressId) {
            // console.log("get derived props===",nextProps.addressId);
          return {
            addressId: nextProps.addressId
          };
        }
    
        // Return null to indicate no change to state.
        return null;
      }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.addressId !== prevProps.addressId) {
            this.getUserDetails();
        }
    }
    componentDidMount(){  
        // console.log("props==",this.props, this.state.addressId);
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(sampurnaWebsiteDetails && userDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
                this.setState({
                    user_ID   : userDetails.user_id,
                    address   : deliveryLocation.address,
                    city      : deliveryLocation.city,
                    country   : deliveryLocation.country,
                    area      : deliveryLocation.area,
                    pincode   : deliveryLocation.pincode,
                    latitude  : deliveryLocation.latitude,
                    longitude : deliveryLocation.longitude,
                },()=>{
                    this.getUserDetails();
                })
            }
        }
    }

    getUserDetails() {
        axios.get("/api/ecommusers/" +this.state.user_ID)
            .then((response) => {
            if(response){
                // console.log("user response ",response);
                if(this.state.addressId){
                    var deliveryAddress = response.data.deliveryAddress.filter((a) => String(a._id) === String(this.state.addressId));
                    if(deliveryAddress){
                        // console.log("DeliveryAddress==",deliveryAddress);
                        this.setState({
                            // "deliveryAddress": response.data.deliveryAddress?response.data.deliveryAddress:null,
                            "fullname"    : deliveryAddress[0].name,
                            "mobileNumber": "971" +deliveryAddress[0].mobileNumber,
                            "email"       : deliveryAddress[0].email,
                            "modaladdType": deliveryAddress[0].addType,
                            "city"        : deliveryAddress[0].city,
                            "area"        : deliveryAddress[0].area,
                            "address1"    : deliveryAddress[0].addressLine1,
                            "address"     : deliveryAddress[0].addressLine2,
                            "pincode"     : deliveryAddress[0].pincode,
                            "latitude"    : this.state.latitude,
                            "longitude"   : this.state.longitude,
                        },()=>{
                            let fields = this.state.fields;
                            fields["fullname"]     = deliveryAddress[0].name;
                            fields["mobileNumber"] = "971" +deliveryAddress[0].mobileNumber;
                            fields["address1"]     = deliveryAddress[0].addressLine1,
                            fields["modaladdType"] = deliveryAddress[0].addType,
                            this.setState({
                                fields
                            });
                        });
                    }
                }else{
                    this.setState({
                        "fullname"    : '',
                        "mobileNumber": '',
                        "email"       : '',
                        "modaladdType": '',
                        "city"        : this.state.city ? this.state.city : "",
                        "area"        : this.state.area,
                        "address1"    : '',
                        "address"     : this.state.address,
                        "pincode"     : this.state.pincode ? this.state.pincode:"",
                        "latitude"    : this.state.latitude,
                        "longitude"   : this.state.longitude,
                    },()=>{
                    });
                }
            }
            })
            .catch((error) => {
                console.log('error', error);
            }); 
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
		// if (typeof fields["mobileNumber"] !== "undefined") {
		// 	//regular expression for email validation
		// 	var pattern = new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/)
		// 	if (!pattern.test(fields["mobileNumber"])) {
		// 	  formIsValid = false;
		// 	  errors["mobileNumber"] = "Please enter valid mobile number.";
		// 	}
		// }

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
                "isdCode"           : "971",
                "mobileNumber"      : (this.state.mobileNumber).split("971")[1],
                "addType"           : this.state.modaladdType,
                "latitude"          : this.state.latitude,
                "longitude"         : this.state.longitude,
                "deliveryAddressID" :this.state.addressId?this.state.addressId: null
            }
            
                if(this.props.addressId){
                    if(this.validateForm()){
                        // console.log(" update address formValues =",formValues);
                    axios.patch('/api/ecommusers/updateuseraddress', formValues)
                    .then((response)=>{

                    swal("Thank You!!! Address is successfully updated");
                    this.setState({
                        "fullname"              : '',
                        "address1"              : '',
                        "pincode"               : '',
                        "modaladdType"          : '',
                        "addressId"             : '',
                    })
                    $("#checkoutAddressModal").modal('hide');
                    this.props.fetchAddressData();
                   
                    })
                    .catch((error)=>{
                        console.log('Address error===', error)
                    });
                }
            }else{ 
                if(this.validateForm()){
                    // console.log("add address formValues===",formValues);
                    axios.patch('/api/ecommusers/patch/address', formValues)
                    .then((response)=>{
                    swal("Thank You!!! Address is successfully saved");
                    $("#checkoutAddressModal").modal('hide');
                    this.props.fetchAddressData();
                    this.setState({
                        "fullname"              : '',
                        "address1"              : '',
                        "pincode"               : '',
                        "modaladdType"          : '',
                        "addressId"             : '',
                    })
                    })
                    .catch((error)=>{
                        console.log('error', error)
                    });  
                } 
            }
        }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        // if (event.target.name === 'pincode') {
        //     this.handlePincode(event.target.value);
        // }
        let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
    }

    render() {
        return (
            <div className={"addressModal col-12 " + Style.addressModal}>  
            <Message messageData={this.state.messageData} />
                <div className="row">
                    <form id="modalAddressForm" className="col-12 ">
                        <div className="col-12 NoPadding">
                            <div className="col-12 shippingInput mb-4">
                                <label className="col-12 NoPadding pb-0 mb-0">Full Name <span className="required">*</span></label>
                                <input type="text" maxLength="40" ref="fullname" name="fullname"  value={this.state.fullname} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                <div className="errorMsg">{this.state.errors.fullname}</div>
                            </div> 
                            <div className={"col-12 shippingInput  mb-2 "+Style.mobileInput}>
                                <label className="col-12 NoPadding pb-0 mb-0">Mobile Number <span className="required">*</span></label>
                                {/* <input maxLength="10" placeholder="" type="text" ref="mobileNumber" name="mobileNumber"  value={this.state.mobileNumber} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} /> */}
                                <PhoneInput
                                    country={'ae'} 
                                    value={this.state.mobileNumber}
                                    inputProps={{
                                        name: 'mobileNumber',
                                        required: true
                                    }}
                                    // name = "Mobile"
                                    onChange={mobileNumber => { 
                                        this.setState({ mobileNumber })
                                        // console.log("mobileNumber==",mobileNumber);
                                            // this.setState({
                                            // 	mobNumber : this.state.mobileNumber,
                                            // }); 
                                            let fields = this.state.fields;
                                            fields["mobileNumber"] = this.state.mobileNumber;
                                            this.setState({
                                            fields
                                            });
                                    }} />
                                <div className="errorMsg">{this.state.errors.mobileNumber}</div>
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">House No/Office No/Building Name/Street Name <span className="required">*</span> </label>
                                <input type="text" ref="address1" name="address1" value={this.state.address1} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                <div className="errorMsg">{this.state.errors.address1}</div>
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">Area</label>
                                <input type="text" ref="area" name="area" value={this.state.area} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">Address</label>
                                <input type="text" ref="address2" name="address2" value={this.state.address} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">City</label>
                                <input type="text" ref="city" name="city" value={this.state.city} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">Country</label>
                                <input type="text" ref="Country" name="Country"  value={this.state.country} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} disabled />
                            </div>
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">Zip/Postal Code</label>
                                <input type="number" minLength="6" maxLength="6" ref="pincode" name="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol1} />
                                
                            </div>   
                            <div className={"col-12 shippingInput mb-2 " +Style.houseNumberMargin}>
                                <label className="col-12 NoPadding pb-0 mb-0">Address type <span className="required">*</span></label>
                                <select name="modaladdType" ref="modaladdType" value={this.state.modaladdType} onChange={this.handleChange.bind(this)} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control " +Style.formcontrol12}>
                                    <option >-- Select Address Type --</option>
                                    <option value="Home">Home (All day delivery) </option>
                                    <option value="Office">Office/Commercial (10 AM - 5 PM Delivery)</option>
                                    <option value="Relative">Relative (All day delivery)</option>
                                    <option value="Friend">Friend (All day delivery)</option>
                                </select>
                                <div className="errorMsg">{this.state.errors.modaladdType}</div>
                            </div>
                            <div className=" checkoutAddressModal col-12 py-4">
                                <div className={"col-12 mx-auto NoPadding " +Style.ma + " " + Style.modalSaveBtn}>
                                    <button type="button" className={"btn globaleCommBtn align-center saveAddressBtn col-12 " +Style.saveBtn} onClick={this.saveAddress.bind(this)}>{this.state.addressId ? 'Update Address' :'Save Address'}</button>
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