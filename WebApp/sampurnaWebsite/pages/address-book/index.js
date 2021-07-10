import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import UserAddress          from '../../pages/checkout/UserAddress.js';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import Style                from './index.module.css';

class AddressBook extends Component{
    constructor(props) {
        super(props);
        this.state={
            deliveryAddresses : []
        }
    }
    componentDidMount(){
        $(window).scrollTop(0);
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            if(userDetails.user_id){
				this.setState({
					user_ID :  userDetails.user_id,
					userLongitude : userDetails.userLatitude,
					userLongitude : userDetails.userLongitude,
				},()=>{
                    this.getUserData();
                    this.getUserAddresses();
				})
            }
        }
        
    }
    getUserData(){
        // $('.fullpageloader').show();        
        axios.get('/api/users/get/id/'+this.state.user_ID)
        .then( (res)=>{
            $('.fullpageloader').hide();
            this.setState({
                name              : res.data.deliveryAddress ? res.data.deliveryAddress[0].name : "",
                email              : res.data.deliveryAddress ? res.data.deliveryAddress[0].email : "",
                mobileNumber              : res.data.deliveryAddress ? res.data.deliveryAddress[0].mobileNumber : "",
                deliveryAddressID : res.data.deliveryAddress ? res.data.deliveryAddress[0]._id : "",
                addressLine1    : res.data.deliveryAddress ? res.data.deliveryAddress[0].addressLine1 : "",
                addressLine2    : res.data.deliveryAddress ? res.data.deliveryAddress[0].addressLine2 : "",
                block           : res.data.deliveryAddress ? res.data.deliveryAddress[0].block : "",
                city            : res.data.deliveryAddress ? res.data.deliveryAddress[0].city : "",
                pincode         : res.data.deliveryAddress ? res.data.deliveryAddress[0].pincode : "",
                state           : res.data.deliveryAddress ? res.data.deliveryAddress[0].state : "",
                country         : res.data.deliveryAddress ? res.data.deliveryAddress[0].country : "",
                type            : res.data.deliveryAddress ? res.data.deliveryAddress[0].type : "",
            })
        })
        .catch((error)=>{
          console.log("error = ",error);
          // alert("Something went wrong! Please check Get URL.");
        });
    }
    getUserAddresses(){
        axios.get('/api/users/get/id/'+ this.state.user_ID)
        .then( (res)=>{
            this.setState({
                deliveryAddresses : res.data.deliveryAddress
            })
        })
        .catch((error)=>{
          console.log("error = ",error);
          // alert("Something went wrong! Please check Get URL.");
        });   
    }
    deleteAddress(event){
        event.preventDefault();
        // $('.fullpageloader').show();        
        var deliveryAddressID = event.target.id; 
        var formValues = {
            user_ID : this.state.user_ID,
            deliveryAddressID : deliveryAddressID
        }
        axios.patch('/api/users/delete/address', formValues)
        .then((response)=>{
            $('.fullpageloader').hide();
            // console.log('response', response);
            this.getUserAddresses();
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
        })
        .catch((error)=>{
            console.log('error', error);
        })
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
    getAddressId(event){
        this.setState({
            addressId : event.target.id
        })
    }
    opDone(){
        this.getUserData();
        this.getUserAddresses();
    }
    render(){
        return(      
            <div className="container-flex "> 
            <div className=" col-12">
            <div className="modal col-4 offset-4 " id="checkoutAddressModal" role="dialog">
                <div className="modal-content-center  loginModalContent " style={{ 'background': '#fff'}}>
                    <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                        <div className="col-4">
                            < WebsiteLogo /> </div>
                        <div className="col-7 text-center">
                            <h6 className="modal-title modalheadingcont">SHIPPING ADDRESS</h6> </div>
                        <div className="col-1 text-center">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                    </div>
                    <div className="modal-body  addressModalBody">
                        <UserAddress /> 
                    </div>
                </div>
            </div>
            <Message messageData={this.state.messageData} /> </div>
            <h5 className="font-weight-bold">Default Addresses</h5>
            <div className={ "col-12   "+Style.accountDashBoardInnerwrapper}>
                <div className="row">
                    <div className="col-12 pt-4 ">
                        <div className="row">
                            <div className="col-12 col-lg-6 py-4">
                                <div className="col-12"> { this.state.addressLine1 ?
                                    <div className="row">
                                        <label className="font-weight-bold">Default Shipping / Billing Address</label>
                                        <p> {this.state.name}
                                            <br /> {this.state.addressLine2 ? this.state.addressLine2+", " : null} {this.state.addressLine1} - {this.state.pincode}.
                                            <br /> {/* {this.state.city},
                                            <br /> */} {/* {this.state.state}, {this.state.country} - {this.state.pincode}
                                            <br /> */} Contact Number: {this.state.mobileNumber} </p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" id={this.state.deliveryAddressID} onClick={this.getAddressId.bind(this)} className="btn globalCommonBtn ">Change Billing Address</div> {/* <i id={this.state.deliveryAddressID} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn anasBtn deleteAdd"></i> */} </div> :
                                    <div className="col-12">
                                        <label>Default Billing Address</label>
                                        <p>You have not set a default billing address.</p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn mt-2">Add Billing Address</div>
                                    </div> } </div>
                            </div>
                            <div className="col-12 NOpaddingRight ">
                            <label className="text-center font-weight-bold">Additional Address Entries</label>
                                <div className="row">
                                 { this.state.deliveryAddresses && this.state.deliveryAddresses.length > 1 ? this.state.deliveryAddresses.map((address , index)=>{ if(index !== 0){ return(
                                
                                <div key={ 'address'+index} className="col-12 col-md-6 mx-auto py-3">
                                <div className="row">
                                    <div className="col-12 ">
                                        
                                            <p> {address.name}
                                                <br /> {this.state.addressLine2 ? this.state.addressLine2+", " : null} {address.addressLine1}
                                                <br /> {/* {this.state.city},
                                                <br /> */} {/* {address.state}, {address.country} - {address.pincode}
                                                <br /> */} Pincode : {address.pincode +"."}
                                                <br /> Contact Number: {address.mobileNumber} </p>
                                                
                                            <div data-toggle="modal" data-target="#checkoutAddressModal" id={address._id} onClick={this.getAddressId.bind(this)} className="btn globalCommonBtn">Edit Address</div> 
                                                &nbsp; <i id={address._id} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn globalCommonBtn deleteAdd" style={{ "fontSize": '15px' }}></i> 
                                            </div>
                                    </div>
                                </div>
                                
                                 ); } }) :
                                <p className="text-justify">You have no other address entries in your address book.</p> }
                                <div className="col-12 NOpadding py-4">
                                    <div data-toggle="modal" data-target="#checkoutAddressModal" id="" className={"btn globalCommonBtn addressSaveBtn " }>Add New Address</div>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
       
        )
    }
}

export default AddressBook;