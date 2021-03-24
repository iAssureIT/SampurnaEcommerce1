import React, { Component } from 'react';
import $                    from 'jquery';
import Router               from 'next/router';
import Address              from '../../component/CustomizeBlocks/Address/Address.js';
import axios                from 'axios';
import SmallBanner          from '../../component/CustomizeBlocks/SmallBanner/SmallBanner.js';
import Sidebar              from '../../component/CustomizeBlocks/Sidebar/Sidebar.js';
import Loader               from "../../component/CustomizeBlocks/Loader/Loader.js";
import Header               from '../../component/blockTemplate/Header/Header.js';
import Footer               from '../../component/blockTemplate/Footer/Footer.js';
// import "../../../sites/currentSite/pages/Account.css";
// import AccImg from '../../../sites/currentSite/images/my_account.png';

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
        
    }
    getUserData(){
        // $('.fullpageloader').show();
        // var userid = localStorage.getItem("user_ID");
        axios.get('/api/users/'+this.state.user_ID)
        .then( (res)=>{
            $('.fullpageloader').hide();
            // console.log("Account response:",res);
            // console.log("firstname:",res.data.profile.firstname);
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
            })
           // console.log("firstname:",this.state.firstName); 
        })
        .catch((error)=>{
          console.log("error = ",error);
          // alert("Something went wrong! Please check Get URL.");
        });
    }
    editUser(event){
        event.preventDefault();
        Router.push('/edit-account');
    }
    addAddress(event){
        event.preventDefault();
        this.props.history.push('/address');
    }
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
            <Header />
            {<Loader type="fullpageloader" />}
                <SmallBanner bannerData={this.state.bannerData}/>  
                <Address addressId={this.state.addressId} opDone={this.opDone.bind(this)}/>
                <div className="container">
                    <br/> 
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                        <Sidebar />
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 NOpadding mt25">
                        <h4 className="accountTitle">Account Dashboard</h4>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15 mb15 mobileViewNoPadding">
                            <p><label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Hello {this.state.firstName}</label></p>                            

                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt15 mb15 mobileViewNoPadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 accountBox">
                                    <div className="row">
                                        <div className="accountDivHeader">Contact Information</div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textwrap">{this.state.fullName}</p>
                                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">{this.state.emailId}</p>
                                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">{this.state.mobileNumber}</p>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <button className="btn globalCommonBtn col-lg-6 col-md-6 col-sm-6 col-xs-12" onClick={this.editUser.bind(this)}><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button> &nbsp; &nbsp;
                                            {/*<button className="btn btn-warning">CHANGE PASSWORD</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt15 mb15 mobileViewNoPadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 accountBox">
                                    <div className="row">
                                        <div className="accountDivHeader">Newsletters</div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12">You don't subscribe to our newsletter.</p>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt45">
                                                <button className="btn globalCommonBtn col-lg-6 col-md-6 col-sm-6 col-xs-12"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15 mb15 row">Address Book</label> 
                            </div>
                            
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt15 mobileViewNoPadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 accountBox">
                                    <div className="row">
                                        <div className="accountDivHeader">Default Billing Address</div>
                                        { this.state.addressLine1 ?
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                                                <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.state.name}</p>
                                                <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                {this.state.addressLine2} - &nbsp;
                                                {this.state.addressLine1} - &nbsp;
                                                {this.state.pincode},<br />                                                
                                                {/* {this.state.city},<br />
                                                {this.state.state}, {this.state.country} - {this.state.pincode}<br /> */}
                                                Contact Number: {this.state.mobileNumber}
                                                </p>
                                                
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                                </div>
                                            </div>
                                            :
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">
                                                <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12">You have not set a default billing address.</p>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">
                                                    <button data-toggle="modal" data-target="#checkoutAddressModal"
                                                     className="btn globalCommonBtn col-lg-6 col-md-6 col-sm-6 col-xs-12"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mt15 mb15 mobileViewNoPadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 accountBox">
                                    <div className="row">
                                        <div className="accountDivHeader">Default Shipping Address</div>
                                        { this.state.addressLine1 ?
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb25">

                                                <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                {this.state.addressLine2 ? this.state.addressLine2+"-" : null} &nbsp;
                                                {this.state.addressLine1}- &nbsp;
                                                {this.state.pincode}<br />                                                
                                                Email: {this.state.emailId}<br />
                                                Contact Number: {this.state.mobileNumber} 
                                                </p>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <div data-toggle="modal" data-target="#checkoutAddressModal" onClick={this.getAddressId.bind(this)} id={this.state.deliveryAddressID} className="btn globalCommonBtn"><i className="fa fa-pencil-square-o"></i> &nbsp; EDIT ADDRESS</div>
                                                </div>
                                            </div>
                                            :
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 mb15">
                                                <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{wordBreak : "break-word"}}>You have not set a default shipping/billing address.</p>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
                                                    <button data-toggle="modal" data-target="#checkoutAddressModal" className="btn globalCommonBtn col-lg-6 col-md-6 col-sm-6 col-xs-12"><i className="fa fa-pencil-square-o"></i> &nbsp; ADD ADDRESS</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Account;