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
import UserAddress          from '../../pages/checkout/UserAddress.js';
import Account              from '../../pages/account/index.js';
import EditAccount          from '../../pages/edit-account/index.js'
import AddressBook          from  '../../pages/address-book/index.js'
import MyOrders             from '../../pages/my-orders/index.js'
import Wishlist             from  '../../pages/wishlist/index.js'
import Productreview        from '../../pages/productreview/index.js'
import OrderDetails         from '../../pages/order-details/index.js';
import CreditPoints         from '../../pages/creditPoints/index.js';
import S                from './index.module.css';



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
            order_id : ''
        }
    }
    componentDidMount(){
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
                    // console.log("address response==",res);
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
    editUser(event){
        event.preventDefault();
        Router.push('/edit-account');
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

    getOrderId(orderId){
        this.setState({order_id:orderId})
    }

    render(){
        return(
            // <!-- Demo header-->
            <section class="header ">
                <Header />
                <div class="container-fluid pb-5 ">
                    <header class=" py-4  text-left text-black">
                        <h2 class="font-weight-bold  ">MY ACCOUNT</h2>     
                    </header>
                    <div className="col-12">
                        <div class="row">
                            <div class="col-md-3">
                                {/* <!-- Tabs nav --> */}
                                <div class={"nav flex-column nav-pills nav-pills-custom navPillsWrapper "+S.navPillsWrapper} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <a class="nav-link mb-5 p-3  shadow active rounded"  id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                        <i class="fa fa-user-circle mr-3"></i>
                                        <span class=" small text-uppercase">Account Dashboard</span></a>
                
                                    <a class="nav-link mb-5 p-3 shadow" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                                        <i class="fa fa-info-circle mr-3"></i>
                                        <span class=" small text-uppercase">Account Information</span></a>
                
                                    <a class="nav-link mb-5 p-3 shadow " id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                                        <i class="fa fa-address-card mr-3"></i>
                                        <span class=" small text-uppercase">Address Book</span></a>
                
                                    <a class="nav-link mb-5 p-3 shadow" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                                        <i class="fa fa-shopping-cart mr-3"></i>
                                        <span class=" small text-uppercase"> My Orders</span></a>

                                    <a class="nav-link mb-5 p-3 shadow" id="v-pills-settings1-tab" data-toggle="pill" href="#v-pills-settings1" role="tab" aria-controls="v-pills-settings1" aria-selected="false">
                                    <i class="fa fa-heart mr-3"></i>
                                    <span class=" small text-uppercase"> My Wishlist</span></a>

                                    <a class="nav-link mb-5 p-3 shadow" id="v-pills-settings3-tab" data-toggle="pill" href="#v-pills-settings3" role="tab" aria-controls="v-pills-settings3" aria-selected="false">
                                    <i class="fa fa-money mr-3"></i>
                                    <span class=" small text-uppercase"> Credit Points</span></a>

                                    {/* <a class="nav-link mb-5 p-3 shadow" id="v-pills-settings2-tab" data-toggle="pill" href="#v-pills-settings2" role="tab" aria-controls="v-pills-settings2" aria-selected="false">
                                    <i class="fa fa-star mr-3"></i>
                                    <span class=" small text-uppercase">My Product Reviews</span></a> */}

                                </div>
                            </div>
                
                            <div class={"col-md-9 myAccountSideWrapper "+S.myAccountSideWrapper}>
                                {/* <!-- Tabs content --> */}
                                <div class="tab-content" id="v-pills-tabContent">
                                    <div class="tab-pane fade shadow rounded bg-white show active pb-5" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                <Account/>                          
                                    </div>
                                    
                                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                    <EditAccount/>
                                    </div>
                                    
                                    <div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                                    <AddressBook/>
                                    </div>
                                    
                                    <div class="tab-pane fade shadow rounded bg-white p-3" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                                        <MyOrders getOrderId={this.getOrderId.bind(this)}/>
                                    </div>

                                    <div class="tab-pane fade shadow rounded bg-white pb-5" id="v-pills-settings1" role="tabpanel" aria-labelledby="v-pills-settings1-tab">
                                        <Wishlist/>
                                    </div>
                                    <div class="tab-pane fade shadow rounded bg-white pb-5" id="v-pills-settings3" role="tabpanel" aria-labelledby="v-pills-settings3-tab">
                                        <CreditPoints />
                                    </div>
                                    <div class="tab-pane fade shadow rounded bg-white pb-5" id="v-pills-settings2" role="tabpanel" aria-labelledby="v-pills-settings2-tab">
                                        {this.state.order_id!==""&&<OrderDetails order_id={this.state.order_id} />}
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