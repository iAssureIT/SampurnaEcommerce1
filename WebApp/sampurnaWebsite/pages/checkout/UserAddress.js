import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import jQuery               from 'jquery';
import swal                 from 'sweetalert';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';

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
            console.log("userDetails=>",userDetails.user_id);
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
                    "deliveryAddress": response.data.deliveryAddress,
                    "fullname": response.data.profile.fullName,
                    "mobileNumber": response.data.profile.mobile,
                    "email": response.data.profile.email
                });
            }
            })
        
            .catch((error) => {
                console.log('error', error);
            }); 
        } 
    }
    validateForm() {
		let fields = this.state.fields;
		let errors = {};
        let formIsValid = true;	
        
       // for house no
        if (typeof fields["address2"] === "undefined") {           
            if (fields["address2"] === undefined) {
			  formIsValid = false;
			  errors["address2"] = "This feild is required";
			}
        }

        if (!fields["addType"]) {
            formIsValid = false;
            errors["addType"] = "Please select Address type.";
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
            console.log("formValues =",formValues);
            if(this.state.deliveryAddressID){
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
                // if(this.validateForm()){
                    axios.patch('/api/ecommusers/patch/address', formValues)
                            .then((response)=>{
                            // this.setState({
                            // messageData : {
                            //     "type" : "outpage",
                            //     "icon" : "fa fa-check-circle",
                            //     "message" : "&nbsp; "+response.data.message,
                            //     "class": "success",
                            //     "autoDismiss" : true
                            // }
                            // })
                            // setTimeout(() => {
                            //     this.setState({
                            //         messageData   : {},
                            //     })
                            // }, 3000);
                            swal("Thank You!!! Address Save successfuly");
                            window.location.reload();
                            
                            })
                            .catch((error)=>{
                                console.log('error', error)
                            });  
                //} 
            }
        }
        
    edit(deliveryAddressID){        
        // var deliveryAddressID = this.props.match.params.deliveryAddressID;
        // console.log('deliveryAddressID', deliveryAddressID);
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

    // static getDerivedStateFromProps(nextProps, state) {
    //     console.log("nextProps====",nextProps,state);
    //     console.log("nextProps====",nextProps.addressId);
    //     // if(nextProps.addressId){
    //     //       edit(nextProps.addressId);            
    //     // }
    //     return null;
    // }
    

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
    
    camelCase(str){
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    }
    cancel(){
        this.setState({
            "fullname"            : '',
            "addressLine1"         : '',
            "addressLine2"    : '',
            "pincode"         : '',
            "district"        : '',
            "city"            : '',
            "state"           : '',
            "country"         : '',
            "mobileNumber"    : '',
            "addType"         : '',
        });
    }
    render() {  
        return (
            <div className="addressModal col-12 checkoutAddressModal">  
            <Message messageData={this.state.messageData} />
                <div className="row">
                    <form id="modalAddressForm">
                        <div className="col-12 NOpadding">
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Full Name <span className="required">*</span></label>
                                <input type="text" maxLength="40" ref="fullname" name="fullname" id="fullname" value={this.state.fullname} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                <div className="errorMsg">{this.state.errors.modalname}</div>
                            </div> 
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Mobile Number <span className="required">*</span></label>
                                <input maxLength="10" placeholder="" type="text" ref="mobileNumber" name="mobileNumber" id="mobileNumber" value={this.state.mobileNumber} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                <div className="errorMsg">{this.state.errors.modalmobileNumber}</div>
                            </div>
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">House No/Office No </label>
                                <input type="text" ref="address1" name="address1" id="address1" value={this.state.address1} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" />
                                <div className="errorMsg">{this.state.errors.modaladdressLine2}</div>
                            </div>
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Area / Street Name</label>
                                <input type="text" ref="area" name="area" id="area" value={this.state.area} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div>
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Address</label>
                                <input type="text" ref="address2" name="address2" id="address2" value={this.state.address} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div>
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">City</label>
                                <input type="text" ref="city" name="city" id="modaladdressLine2" value={this.state.city} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div>
                            {/* <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Emirate</label>
                                <input type="text" ref="state" name="state" id="state" value={this.state.state} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div> */}
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Country</label>
                                <input type="text" ref="Country" name="Country" id="Country" value={this.state.country} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div>
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Zip/Postal Code <span className="required">*</span></label>
                                <input type="number" minLength="6" maxLength="6" ref="pincode" name="pincode" id="pincode" value={this.state.pincode}  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" disabled />
                            </div>   
                            <div className="col-12 shippingInput">
                                <label className="col-12 NoPadding">Address type <span className="required">*</span></label>
                                <select id="modaladdType" name="modaladdType" ref="modaladdType" value={this.state.modaladdType} onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control">
                                    <option >-- Select Address Type --</option>
                                    <option value="Home">Home (All day delivery) </option>
                                    <option value="Office">Office/Commercial (10 AM - 5 PM Delivery)</option>
                                    <option value="Relative">Relative (All day delivery)</option>
                                    <option value="Friend">Friend (All day delivery)</option>
                                </select>
                            </div>
                            <div className=" checkoutAddressModal col-12 mt-4">
                                <div className="col-12">
                                    <button type="button" className="btn globaleCommBtn saveAddressBtn col-12" onClick={this.saveAddress.bind(this)}>{this.props.addressId ? 'Update Address' :'Save Address'}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default UserAddress;