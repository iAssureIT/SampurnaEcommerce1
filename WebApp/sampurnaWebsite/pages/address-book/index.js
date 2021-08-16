import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import UserAddress          from '../../pages/checkout/UserAddress.js';
import { connect }          from 'react-redux';
import store                from '../../redux/store.js';
import { getCartData, getAddressData } from '../../redux/actions/index.js';
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
                    // this.getUserAddresses();
                    this.props.fetchAddressData();
				})
            }
        }
    }
    // static getDerivedStateFromProps(props, state) {
    //     if (props.recentAddressData) {
    //         return {
    //             deliveryAddress: props.recentAddressData,

    //         };
    //     }
    //     return null;
    // }
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
            user_ID: this.state.user_ID,
            deliveryAddressID: deliveryAddressID
          }
          
        if(formValues){
            // console.log("Formvalues===",formValues);

            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to removed this address?",
                icon: "warning",
                dangerMode: true,
                buttons: true,
            })
                .then(willDelete => {
                    if (willDelete) {
                        axios.patch('/api/ecommusers/delete/address', formValues)
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
                                this.props.fetchAddressData();
                            })
                            .catch((error)=>{
                                console.log('error', error);
                            })
    
                    } else {
                        swal("Your address is safe!");
                    }
                })
        }
    }

    getAddressId(event){
        this.setState({
            addressId : event.target.id
        },()=>{
            // console.log("addressId===",this.state.addressId);
        })
    }
    opDone(){
        this.getUserData();
        this.getUserAddresses();
    }
    render(){
        return(      
            <div className="col-lg-10 col-12 "> 
            <div className=" col-12">
            <div className="modal  mt-4 mb-4 " id="checkoutAddressModal" role="dialog">  
                <div className={"col-5 mx-auto NoPadding "+Style.modalMainWrapper}>
                    <div className={"modal-content  pb-0 "+Style.modalContentM}>    
                    <div className={"modal-header globalBgColor col-12 " +Style.modalHeaderM}>
                        <div className={"modal-title col-12 modalheadingcont pb-3  underline " +Style.f14BM }><img className={" "+Style.modalLogoWrapperM} src="/images/eCommerce/TrollyLogo.png" style={{height:"40px"}} alt="T&C MODAL-LOGO"/><p>Shipping Address</p></div>
                        <button type="button" className={" close modalclosebut  "+Style.modalCloseButtonWrapperM} data-dismiss="modal">&times;</button>
                    </div>                      
                        <div className={"modal-body addressModalBody "+Style.modalBg}>
                            <UserAddress  addressId ={this.state.addressId}/>
                        </div>
                    </div>
                </div>
            </div>

            <Message messageData={this.state.messageData} /> </div>
            <h4 className={"font-weight-bold "+ Style.accountDashBoardMainTitle}>My Addresses</h4>
            <div className={ "container-flex "+Style.accountDashBoardInnerwrapper}>
            <div className={"col-12 "+Style.creditHeader}>
                        <div className="row">
                            <div className={"col-12 px-lg-5 text-lg-left text-center "+Style.CreditTotalPtTitle}>Default Address</div>
                        </div>
                        
            </div>
                {/* <div className="row"> */}
                    <div className="col-12 pt-4 ">
                        <div className="row">
                            <div className="col-12 col-lg-12 py-4">
                                <div className="col-12"> { this.state.addressLine1 ?
                                    <div className="col-12">
                                        <label className={" "+ Style.defaultBillingAddTitle}>Default Shipping / Billing Address</label>
                                        <p className={"text-justify "+Style.addressInnerDescWrapper} > {this.state.name}
                                            <br /> {this.state.addressLine2 ? this.state.addressLine2+", " : null} {this.state.addressLine1} - {this.state.pincode}.
                                            <br /> {/* {this.state.city},
                                            <br /> */} {/* {this.state.state}, {this.state.country} - {this.state.pincode}
                                            <br /> */} Contact Number: {this.state.mobileNumber}
                                        </p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" id={this.state.deliveryAddressID} onClick={this.getAddressId.bind(this)} className="btn globalCommonBtn ">Change Billing Address</div> {/* <i id={this.state.deliveryAddressID} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn anasBtn deleteAdd"></i> */} </div> :
                                    <div className="col-12">
                                        <label className={" "+ Style.defaultBillingAddTitle}>Default Billing Address</label>
                                        <p className={" "+Style.addressInnerDescWrapper}>You have not set a default billing address.</p>
                                        <div data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn mt-2  mt-0 float-lg-right float-md-right">Add Billing Address</div>
                                    </div> } </div>
                            </div>

                            <div className="col-12 col-lg-12 py-4">
                            <div className="col-12">
                               <div className="col-12">
                                   <label className={" "+ Style.defaultBillingAddTitle}>Additional Address Entries</label>
                               </div>
                               <div className="row">
                            {/* { this.state.deliveryAddresses && this.state.deliveryAddresses.length > 1 ? this.state.deliveryAddresses.map((address , index)=>{ if(index !== 0){ return( */}
                            { this.props.recentAddressData && this.props.recentAddressData.length > 1 ? this.props.recentAddressData.map((address , index)=>{ if(index !== 0){ 
                                // console.log("address==",address);
                                return(  
                                        <div key={ 'address'+index} className="col-12 col-lg-6 col-md-6  py-3">
                                            <div className="col-12 text-center">
                                                    <p className={"text-justify "+Style.addressInnerDescWrapper}> {address.name}
                                                        <br /> {this.state.addressLine2 ? this.state.addressLine2+", " : null} {address.addressLine1}
                                                         {/* {this.state.city},
                                                        <br /> */} {/* {address.state}, {address.country} - {address.pincode}
                                                        <br /> */}
                                                        {address.pincode &&
                                                            <span> <br />Pincode : {address.pincode +"."}</span>
                                                        }
                                                        <br /> Contact Number: {address.mobileNumber} </p>
                                                    <div className="col-12 pl-lg-0 pl-xl-0 pl-md-0 pl-sm-0 float-left">
                                                        
                                                        <button data-toggle="modal" data-target="#checkoutAddressModal" id={address._id} onClick={this.getAddressId.bind(this)} className=" col-lg-8 col-xl-8 col-8 mx-auto btn globalCommonBtn float-left">Edit Address</button> 
                                                            &nbsp; <i id={address._id} onClick={this.deleteAddress.bind(this)} className="fa fa-trash btn deleteAdd  " style={{ "fontSize": '14px' }}></i> 
                                                        </div>
                                                    </div>
                                            </div>
                                        
                                        
                                        ); } }) :
                                        <div className="col-12">
                                        <div className="col-12">
                                        <p className={"text-justify "+Style.addressInnerDescWrapper}>You have no other address entries in your address book.</p> 
                                        </div>
                                        </div>
                            }             <div className="col-12">
                                        <div className="col-12 NOpadding py-4 py-lg-0">
                                            <div data-toggle="modal" data-target="#checkoutAddressModal" id="" className={"btn globalCommonBtn addressSaveBtn float-lg-right float-md-right" }>Add New Address</div>
                                        </div>
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
const mapStateToProps = state => (
    {
        recentAddressData: state.data.recentAddressData,
    }
);
const mapDispatchToProps = {
    fetchAddressData: getAddressData
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBook);