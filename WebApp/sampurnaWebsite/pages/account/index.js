import React, { Component } from 'react';
import $                    from 'jquery';
import Router               from 'next/router';
import axios                from 'axios';

import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
// import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
// import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import UserAddress              from '../../pages/checkout/UserAddress.js';
import Style                  from './index.module.css';


class Account extends Component{
    
    constructor(props) {
        super(props);
        this.state={
            bannerData : {
                title : "ACCOUNT DASHBOARD",
                breadcrumb : 'Account Dashboard',
                backgroungImage : "/images/eCommerce/my_account.png",
            },
            addressId :'',
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
				})
            }
        }
        
    }
    getUserData(){
        axios.get('/api/users/get/id/'+this.state.user_ID)
        .then( (res)=>{
            // $('.fullpageloader').hide();
            if(res){
                if(res){
                    console.log("address response==",res);
                    this.setState({
                        firstName       : res.data.profile.firstname,
                        lastName        : res.data.profile.lastname,
                        fullName        : res.data.profile.fullName,
                        emailId         : res.data.profile.email,
                        mobileNumber    : res.data.profile.mobile,
                        name            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].name : "",
                        deliveryAddressID : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0]._id : "",
                        addressLine1    : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].addressLine1 : "",
                        addressLine2    : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].addressLine2 : "",
                        block           : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].block : "",
                        district        : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].district : "",
                        city            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].city : "",
                        pincode         : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].pincode : "",
                        state           : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].state : "",
                        country         : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].country : "",
                        type            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].type : "",
                        profileImage    : res.data.profile.profileImage
                    },()=>{
                        // console.log("this.state.addressLine1=",this.state.addressLine1);
                    })
                }
                
            }
        })
        .catch((error)=>{
          console.log("account page getuser error = ",error);
        });
    }
    // editUser(event){
    //     event.preventDefault();
    //     Router.push('/edit-account');
    // }
    
    getAddressId(event){
        // event.preventDefault();
        this.setState({
            addressId : event.target.id            
        },()=>{
            console.log("addressId:",this.state.addressId);
        });
        
    }
    opDone(){
        this.getUserData();
    }
    render(){
        return(
            <div className={ "col-12 NoPadding accountMainWrapper "+Style.accountMainWrapper}> 
                <div className="modal  mt-4 mb-4 " id="checkoutAddressModal" role="dialog">  
                    <div className={"col-5 mx-auto NoPadding "+Style.modalMainWrapper}>

                        <div className={"modal-content  pb-0 "+Style.modalContentM}>    
                        <div className={"modal-header globalBgColor col-12 " +Style.modalHeaderM}>
                            <div className={"modal-title col-12 modalheadingcont pb-3  underline " +Style.f14BM }><img className={" "+Style.modalLogoWrapperM} src="/images/eCommerce/TrollyLogo.png" alt="T&C MODAL-LOGO"/><p>Shipping Address</p></div>
                            <button type="button" className={" close modalclosebut  "+Style.modalCloseButtonWrapperM} data-dismiss="modal">&times;</button>
                        </div>                      
                            <div className={"modal-body addressModalBody "+Style.modalBg}>
                                <UserAddress />
                            </div>
                        </div>
                        </div>
                    </div>
                <div className="col-12">
                    <div className={ "col-12 accountDashBoardwrapper py-3 "+Style.accountDashBoardwrapper}>
                        <h4 className="font-weight-bold">Account Dashboard</h4>
                        <div className={ "col-12 accountDashBoardInnerwrapper "+Style.accountDashBoardInnerwrapper}>
                            <p>
                                <label className="col-12 mt-3"><b>Hello {this.state.firstName}</b></label>
                            </p>
                            <div className="row">
                                <div className="col-12 col-lg-12 offset-1 col-md-12">
                                <div className="row">
                                    <div className="col-12"><b>Contact Information</b></div>
                                    <div className="col-12 mt-3 ">
                                        <div className={ "col-12 "+Style.accUserDetails}>
                                            <h6 className="col-12 textwrap">{this.state.fullName}</h6>
                                            <h6 className="col-12 ">{this.state.emailId}</h6>
                                            <h6 className="col-12 ">{this.state.mobileNumber}</h6> </div>
                                        <div className="col-5 py-4 float-right">
                                            <button className="btn globalCommonBtn mx-5 col-12 col-sm-7  " id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button> &nbsp; &nbsp; </div>
                                    </div>
                                    </div>
                                </div>
                                {/* <div className="col-12 col-lg-6 col-md-12">
                                    <div className="col-12 accountDivHeader">Newsletters</div>
                                    <div className="col-12 mt-3">
                                        <div className={ "col-12  "+Style.accUserDetails}>
                                            <h6 className="col-12">You don't subscribe to our newsletter.</h6> </div>
                                        <div className="col-12  mt-5 pt-3">
                                            <button className="btn globalCommonBtn col-12 col-sm-7 "><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className={ "col-12 addressBookMainWrapper container "+Style.addressBookMainWrapper}>
                        <h6 className="font-weight-bold">Address Book</h6>
                        <div className="row">
                            {/* <div className="col-12 col-lg-6">
                                <div className={ "box "+Style.box}> 
                                    <div className="col-12 pt-2">
                                        <div className="col-12 container font-weight-bold pb-2">Default Billing Address</div>
                                    </div> { this.state.addressLine1 ?
                                    <div className="col-12 ">
                                        <div className={ "col-12  "+Style.accUserDetails}>
                                            <p className="col-12 my-0">{this.state.name}</p>
                                            <p className="col-12"> {this.state.addressLine2} - &nbsp; {this.state.addressLine1} - &nbsp; {this.state.pincode}
                                            <br /> Email: {this.state.emailId}
                                                <br /> Contact Number: {this.state.mobileNumber} </p>
                                        </div>
                                        <div className="col-12">
                                           
                                                <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn float-right"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                          
                                        </div>
                                    </div> :
                                    <div className="col-12 ">
                                        <p className="col-12">You have not set a default billing address.</p>
                                        <div className="col-12 ">
                                            <button data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn col-12 col-sm-7 float-right"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                        </div>
                                    </div> } 
                                </div>
                            </div> */}
                            <div className="col-12 col-lg-12">
                                <div className={ "box  "+Style.box}> {/*
                                    <p>className="col-xs-12 col-sm-6"</P> */}
                                    <div className="col-12 pt-2">
                                        <div className="col-12 font-weight-bold pb-2">Default Shipping Address</div>
                                    </div> { this.state.addressLine1 ?
                                    <div className="col-12">
                                        <div className={ "col-12   "+Style.accUserDetails}>
                                        <p className="col-12 my-0">{this.state.name}</p>
                                            <p className="col-12"> {this.state.addressLine2 ? this.state.addressLine2+"-" : null} &nbsp; {this.state.addressLine1} {this.state.pincode && <span>- &nbsp; {this.state.pincode}</span>}
                                                {this.state.emailId && <span>Email: {this.state.emailId}</span>}
                                                <br /> Contact Number: {this.state.mobileNumber} 
                                            </p>
                                        </div>
                                        <div className="col-12  ">
                                            <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn float-right"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                        </div>
                                    </div> :
                                    <div className="col-12 float-right ">
                                        <p className="col-12" style={{wordBreak : "break-word"}}>You have not set a default shipping/billing address.</p>
                                        <div className="col-12 float-right">
                                            <button data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn col-12 col-sm-7 float-right"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                        </div>
                                    </div> } </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;