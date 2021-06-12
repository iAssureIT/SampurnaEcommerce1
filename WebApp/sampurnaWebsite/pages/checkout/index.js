import React, { Component } from 'react';
import $, { post }          from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import Router               from 'next/router';
import Loaderspinner        from 'react-loader-spinner';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import Message              from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js';
// import Address              from '../../Themes/Sampurna/blocks/StaticBlocks/Address/Address.js';
import UserAddress          from './UserAddress.js';
import Loader               from '../../Themes/Sampurna/blocks/StaticBlocks/loader/Loader.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';
import { connect }          from 'react-redux';
import {getCartData}        from '../../redux/actions/index.js'; 
import  store               from '../../redux/store.js'; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment               from 'moment';
import swal                 from 'sweetalert';
import WebsiteLogo          from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Websitelogo.js';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            totalCartPrice: '',
            productData: {},
            productCartData: [],
            vatPercent: 0,
            companyInfo: "",
            cartProduct: "",
            shippingCharges: 0,
            quantityAdded: 0,
            totalIndPrice: 0,
            addressId: "",
            bannerData: {
                title: "CHECKOUT",
                breadcrumb: 'Checkout',
                backgroungImage: 'images/eCommerce/checkout.png',
            },
            deliveryAddress: [],
            pincodeExists: true,
            paymentmethods: "cod",
            paymethods: false,
            addressLine1: "",
            addType     : '',
            startRange  : 0,
            limitRange  : 10,
            isChecked   : false,
            isCheckedError: [],
            pinValid      :false,
            user_ID       :'',
            email         : '',
            fullName      : '',
            fields: {},
            errors: {},
            websiteModel:'',
            taxrate : 0,
            taxName : '',
            couponAmount : 0.00,

        }
        this.camelCase = this.camelCase.bind(this)
    }
    async componentDidMount() {
        await this.props.fetchCartData();
        var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        if(sampurnaWebsiteDetails && sampurnaWebsiteDetails.deliveryLocation){
            this.setState({
                latitude   : sampurnaWebsiteDetails.deliveryLocation.latitude,
                longitude  : sampurnaWebsiteDetails.deliveryLocation.longitude
            })
        }
        var currency = sampurnaWebsiteDetails.preferences.currency;
        var userDetails  = JSON.parse(localStorage.getItem('userDetails'));
        this.setState({
            user_ID : userDetails.user_id,
            email   : userDetails.email,
            fullName: userDetails.firstName +" "+userDetails.lastName ,
            websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
            currency     : currency,
        },()=>{
            // this.getUserAddress();
            this.getAddressWithDistanceLimit();
            // console.log("currency=",this.state.currency);
        })
        // this.getCartData();
        this.gettimes(this.state.startRange, this.state.limitRange);        
        axios.get('/api/users/get/' + this.state.user_ID)
            .then(result => {
                this.setState({
                    mobile: result.data.mobile,
                    email: result.data.email,
                })
            })
            .catch(err => {
                console.log('Errr', err);
            })
    }
    getAddressWithDistanceLimit(){

        var formValues = {
            "user_id"       : this.state.user_ID,
            "latitude"      : this.state.latitude,
            "longitude"     : this.state.longitude,
        }
        // console.log("formValues=>",formValues);
        axios.post('/api/ecommusers/myaddresses',formValues)
        .then(response => {
            if(response){
                // console.log("distanceResponse=>",response);
                this.setState({
                    "deliveryAddress": response.data.deliveryAddress,
                    // "username": response.data.profile.fullName,
                    // "mobileNumber": response.data.profile.mobile,
                    // "email": response.data.profile.email
                },()=>{
                    let fields = this.state.fields;
                    // fields["username"] = response.data.profile.fullName;
                    // fields["mobileNumber"] = response.data.profile.mobile;
                    // fields["email"] = response.data.profile.email;   
                    // fields["addressLine2 "] = response.data.deliveryAddress[0] ? response.data.deliveryAddress[0].addressLine2 :  null;   
                                    
                    // fields["pincode"] = response.data.profile.pincode;
                    // fields["addType"] = response.data.deliveryAddress[0] ? response.data.deliveryAddress[0].addType : null ;
                    // fields["paymentmethods"] = 'cod';
                    this.setState({
                        fields
                    });
                });
            }
        })
        .catch({

        })

    }
    
    validateForm() {
		let fields = this.state.fields;
		let errors = {};
        let formIsValid = true;	
        
        if (!fields["addType"]) {
            formIsValid = false;
            errors["addType"] = "Please select Address type.";
        }
        
        if (!fields["termsNconditions"]) {
            var pattern = this.state.isChecked
            console.log("condition---",fields["termsNconditions"]);
			if (pattern === false) {
			  formIsValid = false;
			  errors["termsNconditions"] = "Please check terms and conditions";
			}
        }
        if (!fields["paymentmethods"]) {
            formIsValid = false;
            errors["paymentmethods"] = "Please select payment method.";
        }
        this.setState({
            errors: errors
          });
        //   return formIsValid;
        return true;
        }
        
    getUserAddress() {
        if(this.state.user_ID){
        axios.get("/api/ecommusers/" +this.state.user_ID)
            .then((response) => {
                // console.log('userData res', response.data.deliveryAddress);
                
                this.setState({
                    "deliveryAddress": response.data.deliveryAddress,
                    "username": response.data.profile.fullName,
                    "mobileNumber": response.data.profile.mobile,
                    "email": response.data.profile.email
                },()=>{
                    let fields = this.state.fields;
                    fields["username"] = response.data.profile.fullName;
                    fields["mobileNumber"] = response.data.profile.mobile;
                    fields["email"] = response.data.profile.email;   
                    fields["addressLine2 "] = response.data.deliveryAddress[0] ? response.data.deliveryAddress[0].addressLine2 :  null;   
                                    
                    fields["pincode"] = response.data.profile.pincode;
                    fields["addType"] = response.data.deliveryAddress[0] ? response.data.deliveryAddress[0].addType : null ;
                    fields["paymentmethods"] = 'cod';
                    this.setState({
                        fields
                    });
                });
            })
            .catch((error) => {
                console.log('error', error);
            }); 
        } 
    }

    checkboxClick(event) {
        let isChecked = !this.state.isChecked;
        // console.log("isChecked:", isChecked);
        this.setState({ isChecked }, () => {
            // if (isChecked) {
            //     this.setState({
            //         isCheckedError: []
            //     });
            // } else {
            //     this.setState({
            //         isCheckedError: ["Please accept the terms & conditions."]
            //     });
            //     console.log("isCheckedError==", this.state.isCheckedError);
            // }
        });

        let fields = this.state.fields;
        // console.log("event.target.value===",isChecked);
		fields[event.target.name] = isChecked;
		this.setState({
		  fields
		});

    }

    checkPincode(pincode) {
        if (this.state.websiteModel === "FranchiseModel") {
            axios.get("/api/allowablepincode/checkpincode/" + pincode)
                .then((response) => {
                    if (response) {
                        if (response.data.message !== "Delivery Available") {
                            console.log("Delevery not possible on this address");
                            $('.DeliveryNotPoss').show();
                            $(".placeOrder").attr("disabled", true);
                        } else {
                            $('.DeliveryNotPoss').hide();
                            $(".placeOrder").attr("disabled", false);
                        }
                    }
                });
        }
    }

    gettimes(startRange, limitRange) {
        axios.get('/api/time/get/list-with-limits/' + startRange + '/' + limitRange)
            .then((response) => {
                this.setState({
                    gettimes: response.data
                })
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'pincode') {
            this.handlePincode(event.target.value);
            this.checkPincode(event.target.value);
        }
        let fields = this.state.fields;
		fields[event.target.name] = event.target.value;
		this.setState({
		  fields
		});
    }
    handlePincode(pincode) {
        if (pincode !== '') {
            axios.get("https://api.postalpincode.in/pincode/" + pincode)
                .then((response) => {

                    if ($("[name='pincode']").valid()) {
                        if (response.data[0].Status === 'Success') {
                            this.setState({ pincodeExists: true })
                        } else {
                            this.setState({ pincodeExists: false })
                        }
                    } else {
                        this.setState({ pincodeExists: true })
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                })
        } else {
            this.setState({ pincodeExists: true })
        }
    }

    placeOrder(event) {
        event.preventDefault();        
        var addressValues = {};
        var vendorOrders = this.props.recentCartData.vendorOrders;
        // console.log("this.props.recentCartData.vendorOrders==",this.props.recentCartData.vendorOrders);
        for(var i = 0; i<vendorOrders.length;i++){ 
            vendorOrders[i].products =[];
            if(vendorOrders[i].cartItems){
              for(var j = 0; j < vendorOrders[i].cartItems.length;j++){
                vendorOrders[i].products[j] = {...vendorOrders[i].cartItems[j].product_ID} ;
                vendorOrders[i].products[j].quantity =vendorOrders[i].cartItems[j].quantity ;
                vendorOrders[i].deliveryStatus =[];
                  vendorOrders[i].deliveryStatus.push({
                    "status"          : "New Order",
                    "timestamp"       : new Date(),
                    "statusUpdatedBy" : this.state.user_ID,
                    "expDeliveryDate" : new Date(),
                }) 
                vendorOrders[i].orderStatus =  "New Order";
              } 
             delete vendorOrders[i].cartItems;
            }
          }
        //   console.log("vendorOrders====",vendorOrders);

        var paymentMethod = $("input[name='paymentmethods']:checked").val();
        // console.log("paymentMethod====",paymentMethod);
        var checkoutAddess = $("input[name='checkoutAddess']:checked").val();
        var formValues = {
            "paymentMethod": paymentMethod,
            "user_ID"  : this.state.user_ID,
            "email"    : this.state.email,
            "fullName" : this.state.fullName
        }
        // console.log("Formvalues===",formValues);
        for(var i=0;i<this.props.recentCartData.vendorOrders.length;i++){
            var soldProducts = this.props.recentCartData.vendorOrders[i].products.filter((a, i) => {
                return a.availableQuantity <= 0;
            })
        }
        if (soldProducts.length > 0) {
            this.setState({
                messageData: {
                    "type": "outpage",
                    "icon": "fa fa-exclamation-circle",
                    "message": "&nbsp; Please remove sold out products from cart to proceed to checkout.",
                    "class": "warning",
                    "autoDismiss": true
                }
            })
            setTimeout(() => {
                this.setState({
                    messageData: {},
                })
            }, 6000);
        } else {
            if(this.validateForm()){
                // console.log("validation true");
            if (this.state.deliveryAddress && this.state.deliveryAddress.length > 0) {
                var deliveryAddress = this.state.deliveryAddress.filter((a, i) => {
                    return a._id === checkoutAddess
                })
                addressValues = {
                    "user_ID": this.state.user_ID,
                    "name": deliveryAddress.length > 0 ? deliveryAddress[0].name : "",
                    "email": deliveryAddress.length > 0 ? deliveryAddress[0].email : "",
                    "mobileNumber": deliveryAddress.length > 0 ? deliveryAddress[0].mobileNumber : "",
                    "addType": deliveryAddress.length > 0 ? deliveryAddress[0].addType : "",
                    "addressLine1": deliveryAddress.length > 0 ? deliveryAddress[0].addressLine1 : "",
                    "addressLine2": deliveryAddress.length > 0 ? deliveryAddress[0].addressLine2 : "",
                    "pincode": deliveryAddress.length > 0 ? deliveryAddress[0].pincode : "",
                    "area": deliveryAddress.length > 0 ? deliveryAddress[0].area : "",
                    "city": deliveryAddress.length > 0 ? deliveryAddress[0].city : "",
                    "district": deliveryAddress.length > 0 ? deliveryAddress[0].district : "",
                    "stateCode": deliveryAddress.length > 0 ? deliveryAddress[0].stateCode : "",
                    "state": deliveryAddress.length > 0 ? deliveryAddress[0].state : "",
                    "countryCode": deliveryAddress.length > 0 ? deliveryAddress[0].countryCode : "",
                    "country": deliveryAddress.length > 0 ? deliveryAddress[0].country : "",
                    "latitude": deliveryAddress.length > 0 ? deliveryAddress[0].latitude : "",
                    "longitude": deliveryAddress.length > 0 ? deliveryAddress[0].longitude : "",
                }
                console.log("inside if address values====",addressValues);               
            } else {
                console.log("inside else new address");
                addressValues = {
                    "user_ID": this.state.user_ID,
                    "name": this.state.username,
                    "email": this.state.email,
                    "addressLine1": this.state.addressLine1,
                    "addressLine2": this.state.addressLine2,
                    "pincode": this.state.pincode,
                    "area": this.state.area,
                    "district": this.state.district,
                    "city": this.state.city,
                    "stateCode": this.state.stateCode,
                    "state": this.state.state,
                    "countryCode": this.state.countryCode,
                    "country": this.state.country,
                    "mobileNumber": this.state.mobileNumber,
                    "addType": this.state.addType,
                    "latitude": this.state.latitude,
                    "longitude": this.state.longitude,
                }
                    $('.fullpageloader').show();
                    console.log("addressValues:===",addressValues);
                    axios.patch('/api/ecommusers/patch/address', addressValues)
                        .then((response) => {
                            $('.fullpageloader').hide();
                            this.setState({
                                messageData: {
                                    "type": "outpage",
                                    "icon": "fa fa-check-circle",
                                    "message": "&nbsp; " + response.data.message,
                                    "class": "success",
                                    "autoDismiss": true
                                }
                            })
                            setTimeout(() => {
                                this.setState({
                                    messageData: {},
                                })
                            }, 3000);
                            this.getUserAddress();
                        })
                        .catch((error) => {
                            console.log('error', error);
                        });
               // }
            }

                axios.patch('/api/carts/address', addressValues)
                    .then(async (response) => {
                        console.log("Response After inserting address to cart===",response);
                        // await this.props.fetchCartData();
                        for(i=0;i<this.props.recentCartData.vendorOrders.length;i++){
                        var cartItems = this.props.recentCartData.vendorOrders[i].products.map((a, i) => {
                            return {
                                "product_ID": a._id,
                                "productName": a.productName,
                                "productNameRlang": a.productNameRlang,
                                "discountPercent": a.discountPercent,
                                "discountedPrice": a.discountedPrice,
                                "originalPrice": a.originalPrice,
                                "color": a.color,
                                "size": a.size,
                                "currency": a.currency,
                                "quantity": a.quantity,
                                "itemAmountTotal": a.subTotal,
                                "savedAmount": a.saving,
                                "productImage": a.productImage,
                                "section_ID": a.section_ID,
                                "section": a.section,
                                "category_ID": a.category_ID,
                                "category": a.category,
                                "subCategory_ID": a.subCategory_ID,
                                "subCategory": a.subCategory,
                                "vendor_ID": a.vendor_ID
                            }
                            })
                        }
                        // console.log("cartItems",cartItems);
                        // console.log("cartData==",this.props.recentCartData);

                        var orderData = {
                            user_ID                   : this.state.user_ID,
                            email                     : this.state.email,
                            userFullName 		      : this.state.fullName,                            
                            currency                  : this.state.currency,	
                            payment_status            : this.state.paymentmethods === 'online' ? "Paid" : "UnPaid",  // paid, unpaid
                            paymentMethod             : this.state.paymentmethods,
                            customerShippingTime      : this.state.shippingtime,
                            order_numberOfProducts    : this.props.recentCartData.order_numberOfProducts,
                            order_quantityOfProducts  : this.props.recentCartData.order_quantityOfProducts, //Sum of total quantity of items in each vendor
                            vendorOrders              : vendorOrders,
                            paymentDetails            : this.props.recentCartData.paymentDetails,
                            deliveryAddress           : addressValues,
                           
                        }
                        // console.log("OrdersData===",orderData);

                        if (this.state.isChecked) {                            
                            axios.post('/api/orders/post', orderData)
                                .then((result) => {
                                    if(result.data.order_id){
                                        console.log("Order response ===",result.data);
                                        if (this.state.paymentmethods === 'cod') {
                                            this.setState({paymethods : true})
                                            $('.fullpageloader').show();
                                            this.props.fetchCartData();
                                            this.setState({
                                                messageData: {
                                                    "type": "outpage",
                                                    "icon": "fa fa-check-circle",
                                                    "message": "Order Placed Successfully ",
                                                    "class": "success",
                                                    "autoDismiss": true
                                                }
                                            })
                                            setTimeout(() => {
                                                this.setState({
                                                    messageData: {},
                                                    paymethods : false,
                                                })
                                            }, 3000);

                                            Router.push('/payment/' + result.data.order_id);
                                        }
                                    } else {
                                        this.setState({paymethods : true})
                                        var paymentdetails = {
                                            MERCHANT_ID: this.state.partnerid,
                                            MERCHANT_ACCESS_CODE: this.state.secretkey,
                                            REFERENCE_NO: result.data.order_ID,
                                            AMOUNT: this.state.amountofgrandtotal*100,
                                            CUSTOMER_MOBILE_NO: this.state.mobile,
                                            CUSTOMER_EMAIL_ID: this.state.email,
                                            PRODUCT_CODE: "testing",
                                        }
                                        axios.post('/api/orders/pgcall/post', paymentdetails)
                                            .then((payurl) => {
                                                if(payurl.data.result.RESPONSE_MESSAGE  === 'SUCCESS'){
                                                    window.location.replace(payurl.data.result.PAYMENT_URL);
                                                }
                                                this.setState({paymethods : false})
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                                this.setState({paymethods : false})
                                            })
                                    }
                                    axios.get('/api/orders/get/one/' + result.data.order_ID)
                                        .then((res) => {
                                            // =================== Order place Notification  ==================
                                            if (res) {
                                                // console.log("Order details====",res);
                                                // window.fbq('track', 'Purchase', {value: res.data.total, currency: 'Rs'});
                                                var sendData = {
                                                    "event": "Order Confirm",
                                                    "toUser_id": res.data.user_ID,
                                                    "toUserRole": "user",
                                                    "variables": {
                                                        "Username": res.data.userFullName,
                                                        "amount"  : res.data.total,                                                        
                                                        "total": res.data.total,
                                                        "orderid": res.data.orderID,
                                                        "shippingtime": res.data.shippingtime?res.data.shippingtime:"Any time",
                                                    }
                                                }
                                                // console.log("sendData---",sendData);
                                                axios.post('/api/masternotifications/post/sendNotification', sendData)
                                                    .then((res) => {
                                                        if (res) { 
                                                            // console.log('sendDataToUser in result==>>>', res.data)
                                                        }

                                                    })
                                                    .catch((error) => { console.log('notification error: ', error) })
                                                // =================== Notification ==================
                                            }
                                        })
                                })

                                .catch((error) => {
                                    // console.log("return to checkout");
                                    console.log(error);
                                })
                        } else {
                            this.setState({
                                isCheckedError: ["Please accept the terms & conditions."]
                            });
                        }//end isChecked     

                    })
                    .catch((error) => {
                        console.log('cart address update error', error);
                    })
            //}
        }
        }
   
    }

    selectedTimings(event) {
        var selectedValue = event.target.value;
        var keywordSelectedValue = selectedValue.split('$')[0];
        console.log("keywordSelectedValue==>",keywordSelectedValue);
        axios.get('/api/time/get/one/' + keywordSelectedValue)
            .then((response) => {
                var shippingtime = response.data.fromtime + "-" + response.data.totime;
                //   console.log('shippingtiming ===> ', shippingtime);
                this.setState({ shippingtime: shippingtime });
            })
            .catch((error) => {
                console.log('error', error);
            });

    }
    handleSelect = address => {
        geocodeByAddress(address)
            .then((results) => {
                if (results) {
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                            switch (results[0].address_components[i].types[b]) {
                                case 'sublocality_level_1':
                                    var area = results[0].address_components[i].long_name;
                                    // console.log("area===",area);
                                    break;
                                case 'sublocality_level_2':
                                    area = results[0].address_components[i].long_name;
                                    break;
                                case 'locality':
                                    var city = results[0].address_components[i].long_name;
                                    // console.log("area===",city);
                                    break;
                                case 'administrative_area_level_1':
                                    var state = results[0].address_components[i].long_name;
                                    var stateCode = results[0].address_components[i].short_name;
                                    break;
                                case 'administrative_area_level_2':
                                    var district = results[0].address_components[i].long_name;
                                    break;
                                case 'country':
                                    var country = results[0].address_components[i].long_name;
                                    var countryCode = results[0].address_components[i].short_name;
                                    break;
                                case 'postal_code':
                                    var pincode = results[0].address_components[i].long_name;
                                    this.checkPincode(pincode);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    this.setState({
                        area: area,
                        city: city,
                        district: district,
                        state: state,
                        country: country,
                        pincode: pincode,
                        stateCode: stateCode,
                        countryCode: countryCode
                    })
                    // console.log("setstate:", this.state.latLng);
                }

            })
            .catch(error => console.error('Error', error));

        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                this.setState({ 'latitude': lat });
                this.setState({ 'longitude': lng });
                // console.log('Successfully got latitude and longitude', { lat, lng });
            });
        this.setState({ addressLine1: address });
    }; //end google api   

    camelCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    applyCoupon(event){
        event.preventDefault();
        var couponCode = this.refs.couponCode.value;
        // console.log("couponCode===",couponCode);
        var userDetails = JSON.parse(localStorage.getItem('userDetails'));
        var userId = userDetails.user_id;
            var payload={
                "user_ID"     : userId,
                "couponCode"  : couponCode
            }
            axios.patch('/api/carts/put/coupon',payload)
            .then(couponResponse=>{
                if(couponResponse.data){
                    console.log("couponResponse=>",couponResponse.data);
                    this.props.fetchCartData();
                    this.setState({
                        couponAmount : this.props.recentCartData.paymentDetails.afterDiscountCouponAmount,
                    })
                    swal({text: couponResponse.data.message, color:res.data.message === "Coupon Applied Successfully...!" ? 'green':colors.warning});
                }
            })
            .catch(err=>{
                this.setState({coupenCode  : ''})
                console.log("err",err);
            }) 
    }

    render() {
        return (
            <div className="col-12 NoPadding">
            < Header/>
            <div className="col-12 checkoutWrapper" style={{ backgroundColor: "#ffffff" }}>
                <Message messageData={this.state.messageData} />
                <div className="row">
                    {/* <Loader type="fullpageloader" /> */}
                    {/* <div className ="fullpageloader">
                        <div className="col-lg-6 col-lg-offset-3 col-md-4 col-md-offset-4  col-sm-4 col-sm-offset-4 col-xs-12 loading abc">
                            <img src="/images/loader.gif" className=""></img>
                        </div> 
                    </div>                     */}
                    {/* <Address opDone={this.opDones.bind(this)} /> */}
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
                    <SmallBanner bannerData={this.state.bannerData} />
                    {this.props.recentCartData && this.props.recentCartData.vendorOrders && this.props.recentCartData.vendorOrders.length>0?
                    <div className="container-fluid">
                        <form className="col-12 " id="checkout">
                           <div className="row">
                            <div className="col-12 col-xl-4 col-lg-4 col-sm-12">
                                <div className="col-12 NoPadding">
                                    <div className="col-12 paymentMethod NoPadding">
                                        <div className="col-12 eCommTitle paymentMethodTitle">PAYMENT METHOD <span className="required">*</span></div>

                                        <div className="col-12 paymentInput">
                                            {/* <input name="payMethod" ref="payMethod" type="radio" value={this.state.payMethod} className="col-lg-1 col-md-1 col-sm-2 col-xs-2 codRadio" checked="true" /> */}
                                            <input name="paymentmethods" type="radio" value="cod" className="webModelInput col-2 col-md-1"
                                                checked={this.state.paymentmethods === "cod"} onClick={this.handleChange.bind(this)} />
                                            <span className="col-12 col-md-11 col-sm-10 col-xs-10">Cash On Delivery</span>
                                        </div>
                                        <div className="col-12 paymentInput">
                                            {/* <input value={this.state.payMethod} onChange={this.creditndebit}  name="payMethod" type="radio" value="Credit Card Direct Post" className="col-lg-1 col-md-1 col-sm-2 col-xs-2 codRadio" /> */}
                                            <input name="paymentmethods" type="radio" value="crdbt" className="webModelInput col-2 col-md-1" checked={this.state.paymentmethods === "crdbt"} onClick={this.handleChange.bind(this)} />
                                            <span className="col-12 col-md-11 col-sm-10 col-xs-10">Credit / Debit Card</span>
                                        </div>
                                        <div className="errorMsg col-11 ml-2">{this.state.errors.paymentmethods}</div>
                                        {/*  <button className="btn anasBtn col-lg-3 col-lg-offset-9 col-md-2 col-md-offset-10 col-sm-12 col-xs-12 placeOrder" onClick={this.placeOrder.bind(this)}>Place Order</button> */}
                                        <div className="col-12 mt15">
                                            <div id="payMethod"></div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.deliveryAddress && this.state.deliveryAddress.length > 0 ?
                                        <div className="col-12 shippingAddress NoPadding">
                                            <div className="col-12 eCommTitle shippingAddressTitle">SHIPPING ADDRESS <span className="required">*</span></div>
                                            <div className="col-12 addressWrapper pt-4">
                                                
                                                {this.state.deliveryAddress && this.state.deliveryAddress.length > 0 ?
                                                    this.state.deliveryAddress.map((data, index) => {
                                                        // console.log("address data ==", data);
                                                        return (
                                                            <div key={'check' + index} className="col-12 NoPadding">
                                                                <div className="row " >
                                                                <div className="form-check col-1">
                                                                    <input type="radio" className="form-check-input" disabled={data.distance <=1 ?false: true} name="selectAddress" id={"address"+index} value={data._id} 
                                                                    onChange={(e)=>{
                                                                        this.setState({
                                                                            "addressId": e.target.value,
                                                                        },()=>{
                                                                            // console.log("e.target.value===",e.target.value);
                                                                            // console.log("addressId===",this.state.addressId);
                                                                        })
                                                                    }}
                                                                    name="checkoutAddess" pincode={data.pincode}  required className="codRadio"/>
                                                                </div>
                                                                <div className="checkoutADDCss col-10"><b>{data.addType} Address&nbsp;</b> <br />
                                                                    <span className="checkoutADDCss">Name : {data.name}.</span> <br />
                                                                    {data.addressLine2}, {data.addressLine1},
                                                                    Mobile: {data.mobileNumber}</div>
                                                                </div>
                                                                { data.distance >=1?
                                                                    <div className="errorMsg col-12">
                                                                        <div className="errorMsg col-12">This address is out of delivery.</div>
                                                                    </div>
                                                                 :null
                                                                 } 
                                                            </div>
                                                        );
                                                    })
                                                    :
                                                    null
                                                }
                                            </div>
                                            <div className="col-12 mt2">
                                                <div className="btn globaleCommBtn col-12" data-toggle="modal" data-target="#checkoutAddressModal">Add New Address</div>
                                            </div>
                                        </div>
                                        :
                                        <div className="col-12 shippingAddress NoPadding">
                                            <div className="col-12 eCommTitle shippingAddressTitle">SHIPPING ADDRESS</div>
                                                <UserAddress />
                                        </div>
                                }
                            </div>
                            <div className="col-12 col-md-12 col-lg-8 col-sm-12">
                                <div className="col-12 orderReviews NoPadding table-responsive">
                                    <div className="col-12 eCommTitle orderReviewsTitle">ORDER REVIEWS</div>
                                    <div className="col-12 orderReviewsWrapper">
                                        <table className="table table-borderless orderTable">
                                            <thead>
                                                <tr>
                                                    <th>Products Image</th>
                                                    <th>Products Name</th>
                                                    <th className="textAlignRight">Price</th>
                                                    <th className="textAlignRight">Quantity</th>
                                                    <th className="textAlignRight">SubTotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                   this.props.recentCartData && this.props.recentCartData.vendorOrders && this.props.recentCartData.vendorOrders.length > 0 ?
                                                        this.props.recentCartData.vendorOrders.map((vendorWiseData, index) => {
                                                            return (
                                                                <div className="col-12 tableRowWrapper" key={'cartData' + index}>
                                                                <tr  className="col-12">
                                                                    <td colspan="5">
                                                                        <table className="table ">
                                                                        <thead>
                                                                            <tr>
                                                                                <th colSpan="5">{vendorWiseData.vendor_id.companyName}</th>
                                                                            </tr>
                                                                        </thead>

                                                                        {vendorWiseData.cartItems && vendorWiseData.cartItems.map((cartdata, index) => {
                                                                            return(
                                                                                <tr>
                                                                                    <td><img className="img orderImg" src={cartdata.product_ID.productImage[0] ? cartdata.product_ID.productImage[0] : "images/eCommerce/notavailable.jpg"} /></td>
                                                                                    <td>
                                                                                        <a href={"/productdetails/" + cartdata.product_ID}>
                                                                                        {cartdata.product_ID.productNameRlang?
                                                                                            <h5 className="RegionalFont">{cartdata.product_ID.productNameRlang}</h5>
                                                                                        :
                                                                                            <h5 className="productName">{cartdata.product_ID.productName}</h5>
                                                                                        }
                                                                                        </a>

                                                                                        {cartdata.product_ID.discountPercent ?
                                                                                            <div className="col-12 NoPadding">
                                                                                                <span className="cartOldprice">{this.state.currency} &nbsp;{cartdata.product_ID.originalPrice}</span>&nbsp;
                                                                                            <span className="cartPrice">{this.state.currency}&nbsp;{cartdata.product_ID.discountedPrice}</span> &nbsp; &nbsp;
                                                                                            <span className="cartDiscountPercent">( {Math.floor(cartdata.product_ID.discountPercent)}% Off ) </span>
                                                                                            </div>
                                                                                            :
                                                                                            <span className="price">{this.state.currency}&nbsp;{cartdata.product_ID.originalPrice}</span>
                                                                                        }
                                                                                        <div>
                                                                                            {cartdata.product_ID.color ? <span className="cartColor">Color : <span style={{ backgroundColor: cartdata.product_ID.color, padding: '0px 5px' }}>&nbsp;</span> {ntc.name(cartdata.product_ID.color)[1]}, </span> : null}
                                                                                            {cartdata.product_ID.size ? <span className="cartColor">Size : {cartdata.product_ID.size} &nbsp; {cartdata.product_ID.unit}</span> : null}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="textAlignLeft">
                                                                                        {
                                                                                            cartdata.product_ID.availableQuantity > 0 ?
                                                                                                // <span className="productPrize textAlignRight"><i className={"fa fa-" + cartdata.product_ID.currency}></i> &nbsp;{parseInt(cartdata.product_ID.discountedPrice).toFixed(2)}</span>
                                                                                                <span className="productPrize textAlignRight">{this.state.currency}&nbsp;{parseInt(cartdata.product_ID.discountedPrice).toFixed(2)}</span>
                                                                                                :
                                                                                                <span>-</span>
                                                                                        }
                                                                                    </td>
                                                                                    <td className="textAlignCenter">
                                                                                        {
                                                                                            cartdata.product_ID.availableQuantity > 0 ?
                                                                                                <span className=" textAlignRight">{cartdata.quantity}</span>
                                                                                                :
                                                                                                <span className="textAlignCenter sold">SOLD OUT</span>
                                                                                        }
                                                                                    </td>
                                                                                    <td className="textAlignRight">
                                                                                        {
                                                                                            cartdata.product_ID.availableQuantity > 0 ?
                                                                                                <span className="productPrize textAlignRight">
                                                                                                    {this.state.currency}
                                                                                                    {/* {cartdata.product_ID.currency} */}
                                                                                                    &nbsp;{cartdata.product_ID.discountedPrice}</span>
                                                                                                :
                                                                                                <span>-</span>
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                        }
                                                                    </table>
                                                                    </td>
                                                                </tr>
                                                                <tr className=" col-12 tableRow">
                                                                    <td colSpan="5"> 
                                                                        <div className="col-6 offset-3">
                                                                            <span className="col-8 title">{vendorWiseData.vendorName}&nbsp; Total</span>
                                                                            <span className="col-4 textAlignRight title NoPadding">&nbsp; 
                                                                                {this.state.currency} &nbsp;{vendorWiseData.vendor_beforeDiscountTotal > 0 ? (vendorWiseData.vendor_netPayableAmount).toFixed(2) : 0.00} 
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-6 offset-3">
                                                                            <span className="col-8 title">You Saved&nbsp;</span>
                                                                            <span className="col-4 textAlignRight title NoPadding">&nbsp; 
                                                                                {this.state.currency} &nbsp;{vendorWiseData.total > 0 ? vendorWiseData.vendor_discountAmount : 0.00} 
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-6 offset-3">
                                                                            <span className="col-8 title">Tax &nbsp;</span>
                                                                            <span className="col-4 textAlignRight title NoPadding">&nbsp; 
                                                                                {this.state.currency} &nbsp;{vendorWiseData.vendor_taxAmount > 0 ? vendorWiseData.vendor_taxAmount : 0.00} 
                                                                            </span>
                                                                        </div>                                                                        
                                                                    </td>
                                                                </tr>
                                                                
                                                            </div>
                                                                
                                                                
                                                            );
                                                        })
                                                        :
                                                        null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12  checkOutTerms">
                                        <div className="row">
                                        {this.props.recentCartData?
                                        <div className="col-12">
                                            <div className="col-12">
                                                <div className="row">
                                                    <span className="col-md-6 col-12">Final Total Amount :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentCartData.paymentDetails? (this.props.recentCartData.paymentDetails.afterDiscountTotal).toFixed(2) : 0.00 }</span>
                                                    <span className="col-md-6 col-12">Total Saving Amount :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentCartData.paymentDetails.discountAmount>0 ? this.props.recentCartData.paymentDetails.discountAmount : "0.00"}</span>
                                                    <span className="col-md-6 col-12">Total Delivery Charges :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentCartData.paymentDetails? (this.props.recentCartData.paymentDetails.shippingCharges).toFixed(2) : 0.00 }</span>
                                                    <span className="col-md-6 col-12">Total Tax :</span><span className="col-md-6 col-12 textAlignRight">{this.state.currency} &nbsp; {this.props.recentCartData.paymentDetails.taxAmount>0 ? this.props.recentCartData.paymentDetails.taxAmount : "0.00"}</span>
                                                    
                                                    
                                                    <div className="col-12 mb-2 mt-2">
                                                        <div className="row">
                                                            <div className="form-group col-7">
                                                                <input type="text" className="form-control couponCode" ref="couponCode" id="couponCode" name="couponCode" placeholder="Enter Discount Coupon Here..." />
                                                            </div>
                                                            <div className="col-2">
                                                                <button type="button" className="col-12 btn btn-primary pull-right cuponBtn" onClick={this.applyCoupon.bind(this)}>Apply</button>
                                                            </div>
                                                            <div className="col-3 text-right"> {this.state.currency}&nbsp; {this.state.couponAmount>0? this.state.couponAmount : 0.00}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mt15">
                                                        <div className="col-12 checkoutBorder"></div>
                                                    </div>
                                                    <div className="col-12 grandTotal mt-4 mb-2">
                                                        <div className="row">
                                                            <span className="col-6 orderTotalText">Grand Total</span>
                                                            <span className="col-6 textAlignRight orderTotalPrize globalTotalPrice">{this.state.currency} &nbsp;
                                                                {(this.props.recentCartData.paymentDetails.netPayableAmount).toFixed(2) }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        :null
                                        } 

                                        <div className="col-12">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-md-7 col-xl-7 col-12 shippingtimes">
                                                        <div className="row">
                                                            <input type="checkbox" name="termsNconditions" isChecked={this.state.isChecked} title="Please Read and Accept Terms & Conditions" onClick={this.checkboxClick.bind(this)} className="acceptTerms col-1" />  &nbsp;
                                                            <div className="col-12 col-xl-10 col-md-10 termsWrapper">
                                                                <span className="termsNconditionsmodal globalTermsAndCondition" data-toggle="modal" data-target="#termsNconditionsmodal">I agree, to the Terms & Conditions</span> <span className="required">*</span>
                                                            </div>
                                                            <div className="col-11">
                                                                <div className="errorMsg termConditionErrorMsg col-12 ">{this.state.errors.termsNconditions}</div>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div className="col-12 col-xl-5 col-md-5">
                                                        <span className="col-12 col-xl-12 nopadding">Select Shipping Time<span className="required"></span></span>
                                                        <select onChange={this.selectedTimings.bind(this)} className="col-12  noPadding  form-control" ref="shippingtime" name="shippingtime" >
                                                            <option name="shippingtime" disabled="disabled" selected="true">-- Select --</option>
                                                            {
                                                                this.state.gettimes && this.state.gettimes.length > 0 ?
                                                                    this.state.gettimes.map((data, index) => {
                                                                        return (
                                                                            <option key={index} value={data._id}>{data.fromtime}-{data.totime}</option>
                                                                        );
                                                                    })
                                                                    :
                                                                    <option value='user'>No Timings available</option>
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal col-12 col-sm-6 offset-3 checkoutAddressModal" id="termsNconditionsmodal" role="dialog">
                                            <div className="col-12">
                                                <div className="modal-content  col-12 NoPadding">
                                                    <div className="modal-header globalBgColor checkoutAddressModal col-12">
                                                        <img src="/images/eCommerce/multistoreLogo.png" className="col-3" />
                                                        <h6 className="modal-title col-8 modalheadingcont text-center">TERMS AND CONDITIONS</h6>
                                                        <button type="button" className="col-1 close modalclosebut " data-dismiss="modal">&times;</button>
                                                    </div>
                                                    <div className="modal-body col-12 checkoutAddressModal">
                                                        <ul className="listStyle">
                                                            <li>The price of products is as quoted on the site from time to time.</li>
                                                            <li>Price and delivery costs are liable to change at any time, but changes will not affect orders in respect of which we have already sent you a Despatch Confirmation.</li>
                                                            <li>Products marked as 'non-returnable' on the product detail page cannot be returned.</li>
                                                            <li>Products may not be eligible for return in some cases, including cases of buyer's remorse such as incorrect model or color of product ordered or incorrect product ordered.</li>
                                                        </ul>
                                                    </div>
                                                    <div className="modal-footer checkoutAddressModal col-12">
                                                        <button type="button" className="btn globaleCommBtn" data-dismiss="modal">Cancel</button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>  
                                    </div>

                                    <div className="col-12">
                                    {
                                        !this.state.paymentMethods ?
                                        <button className=" globaleCommBtn eCommTitle col-xl-3 offset-xl-9 col-md-2 offset-md-10 col-12" onClick={this.placeOrder.bind(this)}>Place Order</button>
                                        :
                                        <div className="col-xl-3 offset-xl-9 col-md-2 offset-md-10 col-12" >
                                                <Loaderspinner
                                                type="ThreeDots"
                                                color="#80b435"
                                                height={40}
                                                width={40}
                                                // timeout={5000} //3 secs
                                            />
                                        </div>
                                    }
                                        
                                    </div>
                                </div>
                            </div>
                          </div>  
                        </form>
                    </div>
                    :
                    <div className="col-12  textAlignCenter">
                        <img className="col-12 col-md-4 col-sm-6 " src={"/images/eCommerce/emptycart.png"} alt="" />                          
                    </div> 
                    }
                </div>
            </div>
            <Footer />
            </div>
        );
    }
}
const mapStateToProps = state => (
    // console.log("state in checkout====",state.data.recentCartData),
    {
      recentCartData: state.data.recentCartData,
    } 
);
const mapDispatchToProps = {
    fetchCartData: getCartData, 
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);