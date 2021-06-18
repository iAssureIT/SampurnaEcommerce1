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
        var userid = localStorage.getItem('user_ID');
        this.setState({
            user_ID : userid,
            websiteModel : localStorage.getItem('websiteModel')
        },()=>{
            this.getUserData();
        })

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
                        console.log("this.state.addressLine1=",this.state.addressLine1);
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
            <div className="col-12 NoPadding">
            {/* <Header /> */}
            {/* {<Loader type="fullpageloader" />} */}
                {/* <SmallBanner bannerData={this.state.bannerData}/>   */}
                <div className="modal col-4 offset-4 checkoutAddressModal NOpadding" id="checkoutAddressModal" role="dialog">  
                    <div className="modal-content loginModalContent " style={{'background': '#fff'}}>    
                        <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                            <div className="col-4">
                                < WebsiteLogo />
                            </div>
                            <div className="col-7 text-center">
                                <h6 className="modal-title modalheadingcont">SHIPPING ADDRESS</h6>
                            </div>
                            <div className="col-1 text-center">
                                <button type="button" className="close"  data-dismiss="modal">&times;</button> 
                            </div>
                        </div>                        
                        <div className="modal-body addressModalBody">
                            <UserAddress />
                        </div>
                    </div>
                </div>
                <div className="container">
                    <br/> 
                    <div className="col-12">
                       
                        <div className="col-12 col-lg-12 mt25">
                            <h5 className="accountTitle">Account Dashboard</h5>
                            <p><label className="col-12">Hello {this.state.firstName}</label></p>
                            <div className="col-12 row mt15 mb15 mx-auto mobileViewNoPadding">

                                <div className="col-12 col-lg-6 mt15 mb15 mobileViewNoPadding">
                                    <div className="col-12 accountBox">
                                        <div className="row">
                                            <div className="col-12 accountDivHeader">Contact Information</div>
                                            <div className="col-12 mt25 mb25">
                                                <div className={"col-12 NoPadding accUserDetails "+Style.accUserDetails}>
                                                    <h6 className="col-12 textwrap">{this.state.fullName}</h6>
                                                    <h6 className="col-12 ">{this.state.emailId}</h6>
                                                    <h6 className="col-12 ">{this.state.mobileNumber}</h6>
                                                </div>
                                                <div className="col-12 mt100">
                                                    <button className="btn globalCommonBtn col-12 col-sm-7 " id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false" ><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button> &nbsp; &nbsp;
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6 mt15 mb15 mobileViewNoPadding">
                                    <div className="col-12 accountBox">
                                        <div className="row">
                                            <div className="col-12 accountDivHeader">Newsletters</div>
                                            <div className="col-12 mt25 mb25">
                                                <div className={"col-12 NoPadding accUserDetails "+Style.accUserDetails}>
                                                    <h6 className="col-12">You don't subscribe to our newsletter.</h6>
                                                </div>
                                                <div className="col-12 mt45">
                                                    <button className="btn globalCommonBtn col-12 col-sm-7 "><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <h5 className="col-12 mt-4">Address Book</h5> 
                                    {/* <hr className="w-25 pull-left"/> */}
                                </div>
                                
                                <div className="col-12 col-lg-6 mt15 mobileViewNoPadding">
                                    <div className="col-12 accountBox">
                                        <div className="row">
                                            <div className="col-12 accountDivHeader">Default Billing Address</div>
                                            { this.state.addressLine1 ?
                                                <div className="col-12 mt25 mb25">
                                                    <div className={"col-12 NoPadding accUserDetails "+Style.accUserDetails}>
                                                        <p className="col-12">{this.state.name}</p>
                                                        <p className="col-12">
                                                        {this.state.addressLine2} - &nbsp;
                                                        {this.state.addressLine1} - &nbsp;
                                                        {this.state.pincode},<br />                                                
                                                        {/* {this.state.city},<br />
                                                        {this.state.state}, {this.state.country} - {this.state.pincode}<br /> */}
                                                        Contact Number: {this.state.mobileNumber}
                                                        </p>
                                                    </div>
                                                    <div className="col-12">
                                                        <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="col-12 mt25 mb25">
                                                    <p className="col-12">You have not set a default billing address.</p>
                                                    <div className="col-12 mt25">
                                                        <button data-toggle="modal" data-target="#checkoutAddressModal"
                                                         className="btn globalCommonBtn col-12 col-sm-7"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-12 col-lg-6 mt15 mb15 mobileViewNoPadding">
                                    <div className="col-12 accountBox">
                                        <div className="row">
                                            <div className="col-12 accountDivHeader">Default Shipping Address</div>
                                            { this.state.addressLine1 ?
                                                <div className="col-12 mt25 mb25">
                                                <div className={"col-12 NoPadding accUserDetails "+Style.accUserDetails}>
                                                    <p className="col-12">
                                                    {this.state.addressLine2 ? this.state.addressLine2+"-" : null} &nbsp;
                                                    {this.state.addressLine1}- &nbsp;
                                                    {this.state.pincode}<br />                                                
                                                    Email: {this.state.emailId}<br />
                                                    Contact Number: {this.state.mobileNumber} 
                                                    </p>
                                                </div>
                                                    <div className="col-12">
                                                        <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="col-12 mt25 mb15">
                                                    <p className="col-12" style={{wordBreak : "break-word"}}>You have not set a default shipping/billing address.</p>
                                                    <div className="col-12 mt15">
                                                        <button data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn col-12 col-sm-7"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
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

export default Account;