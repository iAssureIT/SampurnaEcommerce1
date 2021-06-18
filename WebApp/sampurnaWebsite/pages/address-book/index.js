import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';

// import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
// import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
// import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
// import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import Address              from '../../Themes/Sampurna/blocks/StaticBlocks/Address/Address.js';
// import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';

class AddressBook extends Component{
    constructor(props) {
        super(props);
        this.state={
            deliveryAddresses : []
        }
    }
    componentDidMount(){
        var userid = localStorage.getItem('user_ID');
        this.setState({
            user_ID : userid,
            websiteModel : localStorage.getItem('websiteModel')
        },()=>{
            this.getUserData();
            this.getUserAddresses();
        })
        
    }
    getUserData(){
        // $('.fullpageloader').show();        
        axios.get('/api/users/'+this.state.user_ID)
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
        axios.get('/api/users/'+ this.state.user_ID)
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
        <div>
        {/* <Header />   */}
        {/* <BreadCrumbs /> */}
        <div className="container">
            {/* <Loader type="fullpageloader" /> */}
            <Address addressId={this.state.addressId} opDone={this.opDone.bind(this)}/>
            <div className="pagealertnone col-12">
              <Message messageData={this.state.messageData} />
            </div>
                <div className="col-12 NoPadding">
                   
                  <div className="row">  
                    
                    <div className="col-12 col-xl-12 col-md-12 col-sm-7 NOpadding mt25">
                        <h5 className="addTitle">Default Addresses</h5>
                        <div className="col-12 col-md-6 mt-2 mb-4">
                            <div className="col-12">
                                {
                                    this.state.addressLine1 ? 
                                    <div className="row">
                                        <label>Default Shipping / Billing Address</label>
                                        <p>
                                            {this.state.name} <br />
                                            {this.state.addressLine2 ? this.state.addressLine2+",  " : null}
                                            {this.state.addressLine1} - {this.state.pincode}. <br />                                            
                                            {/* {this.state.city},<br /> */}
                                            {/* {this.state.state}, {this.state.country} - {this.state.pincode}<br /> */}
                                            Contact Number: {this.state.mobileNumber}
                                        </p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" id={this.state.deliveryAddressID} onClick={this.getAddressId.bind(this)} className="btn globalCommonBtn mt-2">Change Billing Address</div>
                                        {/* <i id={this.state.deliveryAddressID} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn anasBtn deleteAdd"></i> */}
                                    </div>
                                    :
                                    <div className="col-12">
                                        <label>Default Billing Address</label>
                                        <p>You have not set a default billing address.</p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn mt-2">Add Billing Address</div>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                        /*<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 mb25 NOpaddingRight">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.state.addressLine1 ?
                                    <div className="row">
                                        <label>Default Shipping Address</label>
                                        <p>
                                            {this.state.name} <br />
                                            {this.state.addressLine1} <br />
                                            {this.state.addressLine2} <br />
                                            {this.state.block}, {this.state.city},<br />
                                            {this.state.state}, {this.state.country} - {this.state.pincode}<br />
                                            T: {this.state.mobileNumber}
                                        </p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" id={this.state.deliveryAddressID} onClick={this.getAddressId.bind(this)} className="btn btn-warning mt-2">Change Shipping Address</div>
                                    </div>
                                    :
                                    <div className="row">
                                        <label>Default Shipping Address</label>
                                        <p>You have not set a default shipping address.</p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" id={'/address'} className="btn btn-warning mt-2">Add Shipping Address</div>
                                    </div>
                                }
                                
                            </div>
                        </div>*/
                        }
                       
                        <div className="col-12 mt-2 mb25 NOpaddingRight ">
                        <h5 className="addTitle">Additional Address Entries</h5>
                            
                        
                        {
                            this.state.deliveryAddresses && this.state.deliveryAddresses.length > 1 ?
                            this.state.deliveryAddresses.map((address , index)=>{
                                if(index !== 0){
                                    return(
                                        <div key={'address'+index} className="col-12 col-md-6 mb-2 NOpaddingLeft addressHeight">
                                            <div className="col-12 ">
                                                <div className="row">
                                                    <p>
                                                        {address.name} <br />
                                                        {this.state.addressLine2 ? this.state.addressLine2+",  " : null}
                                                        {address.addressLine1} <br />                                                        
                                                        {/* {this.state.city},<br /> */}
                                                        {/* {address.state}, {address.country} - {address.pincode}<br /> */}
                                                        Pincode : {address.pincode +"."} <br />
                                                        Contact Number: {address.mobileNumber}
                                                    </p>
                                                    <div  data-toggle="modal" data-target="#checkoutAddressModal" id={address._id} onClick={this.getAddressId.bind(this)} className="btn globalCommonBtn">Edit Address</div> &nbsp;
                                                    <i id={address._id} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn globalCommonBtn deleteAdd" style={{"fontSize":'15px' }}></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                            :
                            <p>You have no other address entries in your address book.</p>
                        }
                        <div className="col-12 NOpadding mt25">
                        <div data-toggle="modal" data-target="#checkoutAddressModal" id="" className="btn globaleCommBtn addressSaveBtn">Add New Address</div>
                        </div>
                    </div>
                    </div>
                  </div>  
                </div>            
        </div>
        {/* <Footer /> */}
        </div>
        )
    }
}

export default AddressBook;