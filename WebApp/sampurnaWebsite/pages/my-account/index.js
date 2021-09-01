import React, { Component } from 'react';
import $                    from 'jquery';
import Router               from 'next/router';
import axios                from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import Sidebar              from '../../Themes/Sampurna/blocks/StaticBlocks/Sidebar/Sidebar.js';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';
import UserAddress          from '../../Themes/Sampurna/blocks/StaticBlocks/UserAddress/UserAddress.js';

// import Account              from '../../pages/account/index.js';
import EditAccount          from '../../pages/edit-account/index.js'
import AddressBook          from  '../../pages/address-book/index.js'
import MyOrders             from '../../pages/my-orders/index.js'
import Wishlist             from  '../../pages/wishlist/index.js'
// import Productreview        from '../../pages/productreview/index.js'
import OrderDetails         from '../../pages/order-details/index.js';
import CreditPoints         from '../../pages/creditPoints/index.js';
import S                    from './index.module.css';

class MyAccount extends Component{
    constructor(props) {
        super(props);
        this.state={
            bannerData : {
                title : "ACCOUNT DASHBOARD",
                breadcrumb : 'Account Dashboard',
                backgroungImage : "/images/eCommerce/my_account.png",
            },
            addressId :'',
            order_id : '',
            url:"",
            url1:"",
        }
    }

    componentDidMount(){
        let defaultUrl=window.location.href.replace(/.*\/\/[^\/]*/, '');
        let dynamicUrl=window.location.hash;

        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            if(userDetails.user_id){
				this.setState({
                    url           :defaultUrl,
                    url1          :dynamicUrl,
					user_ID       :  userDetails.user_id,
					userLongitude : userDetails.userLatitude,
					userLongitude : userDetails.userLongitude,
                    authService   : userDetails.authService
				},()=>{
                    this.getUserData();
				})
               
            }
        }        
    }
   
    getUserData(){
        axios.get('/api/users/get/id/'+this.state.user_ID)
        .then( (res)=>{
            if(res){
                if(res){
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
  
    getOrderId(orderId){
        this.setState({order_id:orderId})
    }
    
    render(){
        let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
        );
        // console.log('Full document height, with scrolled out part: ' + scrollHeight);
        if (this.state.url1==="#v-pills-settings-tab"||this.state.url1==="#v-pills-settings1-tab"||this.state.url1==="#v-pills-settings3-tab") {
            window.scroll(0, 0);
          }

        return(
            // <!-- Demo header-->
            <section className="header ">
                <Header />
                <div className="container-fluid pb-5 MyaccountMainWrapper">
                    <div className="col-12 ml-xl-4 ml-lg-3">
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 col-12">
                                <header className="col-12 mt-4 mb-xl-4 pl-xl-3 mb-lg-4 pl-lg-2 text-left text-black">
                                    <span className={"mx-2 "+ S.myAccountTitleWrapper}>My Account</span>       
                                </header>
                                {/* <!-- Tabs nav --> */}
                                {this.state.authService !=="guest" &&
                                <div className={"nav flex-column nav-pills nav-pills-custom navPillsWrapper col-xl-12 "+S.navPillsWrapper+" "+S.myAccountMainDiv} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    {this.state.authService==="" &&
                                    <div className="col-12 NoPadding">
                                        {/* <a className={this.state.url==="/my-account"?"nav-link mb-4 p-3   active rounded":"nav-link mb-4 p-3  "}  id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="false">
                                            <i className="fa fa-user-circle mr-3"></i>
                                            <span className=" small ">Account Dashboard</span>
                                        </a> */}
                    
                                        {/* <a className={this.state.url==="/my-account"?"nav-link mb-4 p-3   active rounded":"nav-link mb-4 p-3  "} id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false"onClick={()=>{ $("#myOrderMainId").css("display", "none"); $("#creditPointMainId").css("display", "none");$("#accountInformationManiId").css("display", "block"); $("#WishlistMainId").css("display", "none")}}>
                                            <i className="fa fa-info-circle mr-3"></i>
                                            <span className=" small ">Account Information</span>
                                        </a> */}
                                        <a className=" nav-link mx-2 mb-xl-4 py-xl-4 mb-lg-3 py-lg-3 active" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false" onClick={()=>{ $("#myOrderMainId").css("display", "none"); $("#creditPointMainId").css("display", "none");$("#accountInformationManiId").css("display", "block"); $("#WishlistMainId").css("display", "none")}}>
                                            <i className={"fa fa-info-circle mr-3 " + S.sideBarTabNameAllignment}></i>
                                            <span className={S.sideBarTabNames}>My Profile</span>
                                        </a>
                                    </div>}
                                    <a className="nav-link mx-2 mb-xl-4 py-xl-4 mb-lg-3 py-lg-3" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false" onClick={()=>{ $("#myOrderMainId").css("display", "none");$("#creditPointMainId").css("display", "none");$("#accountInformationManiId").css("display", "none"); $("#WishlistMainId").css("display", "none")}}>
                                        <i className={"fas fa-map-marker-alt mr-3 " + S.sideBarTabNameAllignment}></i>
                                        {/* <img src="/images/eCommerce/locationHome.svg" className="mr-3" alt="ChangeLocationButton"></img> */}
                                        <span className={S.sideBarTabNames}>My Addresses</span></a>
                
                                    <a className={this.state.url1==="#v-pills-settings-tab" ? "nav-link mb-xl-4 py-xl-4 mb-lg-3 py-lg-3  active mx-2 ": "nav-link mb-xl-4 py-xl-4 mb-lg-3 py-lg-3 mx-2  "} id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false" onClick={()=>{$("#myOrderMainId").css("display", "block");$("#creditPointMainId").css("display", "none");$("#accountInformationManiId").css("display", "none"); $("#WishlistMainId").css("display", "none")}}>
                                        <i className={"fa fa-shopping-cart mr-3 " + S.sideBarTabNameAllignment}></i>
                                        <span className={S.sideBarTabNames}> My Orders</span></a>

                                    <a className={this.state.url1==="#v-pills-settings1-tab" ?"nav-link mb-xl-4 py-xl-4 mb-lg-3 py-lg-3 mx-2  active":"nav-link mx-2 mb-xl-4 py-xl-4 mb-lg-3 py-lg-3 "} id="v-pills-settings1-tab" data-toggle="pill" href="#v-pills-settings1" role="tab" aria-controls="v-pills-settings1" aria-selected="false" onClick={()=>{$("#myOrderMainId").css("display", "none");$("#creditPointMainId").css("display", "none"); $("#accountInformationManiId").css("display", "none");$("#WishlistMainId").css("display", "block")}}>
                                    <i className={"fa fa-heart mr-3 " + S.sideBarTabNameAllignment}></i>
                                    <span className={S.sideBarTabNames}> My Wishlist</span></a>

                                    <a className={this.state.url1==="#v-pills-settings3-tab"?"nav-link mb-xl-4 mx-2 py-xl-4 mb-lg-3 py-lg-3  active":"nav-link mx-2 mb-xl-4 py-xl-4 mb-lg-3 py-lg-3 "} id="v-pills-settings3-tab" data-toggle="pill" href="#v-pills-settings3" role="tab" aria-controls="v-pills-settings3" aria-selected="false" onClick={()=>{ $("#myOrderMainId").css("display", "none");$("#creditPointMainId").css("display", "block");$("#accountInformationManiId").css("display", "none"); $("#WishlistMainId").css("display", "none")}}>
                                    <i className={"fa fa-money-bill mr-3 " + S.sideBarTabNameAllignment}></i>
                                    <span className={S.sideBarTabNames}> Credit Points</span></a>

                                    {/* <a className="nav-link mb-5 p-3 " id="v-pills-settings2-tab" data-toggle="pill" href="#v-pills-settings2" role="tab" aria-controls="v-pills-settings2" aria-selected="false">
                                    <i className="fa fa-star mr-3"></i>
                                    <span className=" small ">My Product Reviews</span></a> */}
                                </div>
                                }
                                { this.state.authService==="guest"&&
                                    <div className={"nav flex-column nav-pills nav-pills-custom navPillsWrapper "+S.navPillsWrapper} id="v-pills-tab" role="tablist" aria-orientation="vertical">   
                                         <a className={this.state.url1==="#v-pills-settings-tab" ? "nav-link mb-xl-4 mx-2 p-3  active": "nav-link mx-2 mb-xl-4 p-3  "} id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                                        <i className=" mr-3"></i>
                                        <span className=" small  " > My Orders</span></a>
                                    </div>
                                }
                            </div>
                
                            <div className={"col-xl-9 col-lg-9 col-md-12 col-sm-12 col-xs-12 col-12 mt-5 "+S.myAccountSideWrapper}>
                                {/* <!-- Tabs content --> */}
                                <div className="tab-content" id="v-pills-tabContent">
                                    <div className={this.state.url==="/my-account"?"tab-pane fade  bg-white  pb-5 show active":"tab-pane fade  rounded bg-white  pb-5"} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                       {/* <Account/>                           */}
                                       <EditAccount/>
                                    </div>
                                    
                                    {/* <div className="tab-pane fade  bg-white pb-5" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                    <EditAccount/>
                                    </div> */}
                                    
                                    <div className="tab-pane    bg-white pb-5" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                                    {/*<AddressBook/>*/}
                                    </div>
                                    
                                    <div className={this.state.url1==="#v-pills-settings-tab"?"tab-pane bg-white  show active":"tab-pane bg-white "}id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                                        <MyOrders getOrderId={this.getOrderId.bind(this)}/>
                                    </div>

                                    <div className={this.state.url1==="#v-pills-settings1-tab"?"tab-pane  bg-white pb-5 show active":"tab-pane   bg-white pb-5"} id="v-pills-settings1" role="tabpanel" aria-labelledby="v-pills-settings1-tab">
                                        <Wishlist/>
                                    </div>
                                    <div className={this.state.url1==="#v-pills-settings3-tab"?"tab-pane  bg-white pb-5 show active":"tab-pane  bg-white pb-5"} id="v-pills-settings3" role="tabpanel" aria-labelledby="v-pills-settings3-tab">
                                        <CreditPoints />
                                    </div>
                                    <div className={this.state.url1==="#v-pills-settings2-tab"?"tab-pane  bg-white pb-5 show active":"tab-pane   bg-white pb-5"} id="v-pills-settings2" role="tabpanel" aria-labelledby="v-pills-settings2-tab">
                                        {this.state.order_id!==""&&<OrderDetails order_id={this.state.order_id} />}
                                        {/* <MyOrders getOrderId={this.getOrderId.bind(this)}/> */}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </section>
            
        )
    }
}

export default MyAccount;