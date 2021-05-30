import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Router                 from 'next/router'
import { connect }            from 'react-redux';
import {getCartData}          from '../../redux/actions/index.js'; 
import  store                 from '../../redux/store.js'; 
import Message                from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import OrderSummury           from './OrderSummury.js';
// import {ntc} from '../../ntc/ntc.js';
// import { size } from 'underscore';
// import Loader from "../../common/loader/Loader.js";
class CartProducts extends Component{
    constructor(props) {
        super(props);
        this.state={
            cart:[],
            totalCartPrice:'',
            productData:{},
            productCartData:[],
            vatPercent:0,
            companyInfo:"",
            cartProduct:"",
            shippingCharges:0,
            "startRange": 0,
            "limitRange": 10,
            quantityAdded: 0,
            totalIndPrice: 0,
            websiteModel: '',
            bannerData : {
                title : "MY SHOPPING CART",
                breadcrumb : 'My Shopping Cart',
                backgroungImage : '/images/cartBanner.png',
            },
            taxrate : 0,
            taxName : '',
            discountdata : '',
            discountin   : '',
            discountvalue: 0,
            discounttype : '',
            coupenPrice  : 0,
            // taxValue: 0,
            // cartTotal : 0,
            // totalIncludingTax : 0
        }
    }

    async componentDidMount(){
        var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var currency = sampurnaWebsiteDetails.preferences.currency;
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
        var token         = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
        var websiteModel = localStorage.getItem('websiteModel');
        this.setState({
            websiteModel : websiteModel,
            currency     : currency
        })
        await this.props.fetchCartData();
        this.getdiscounteddata(this.state.startRange, this.state.limitRange);
        this.getshippingamount(this.state.startRange, this.state.limitRange);
        this.getTaxmasterData();
        this.getCartTotal();
    }
    getCartTotal(){
        this.props.recentCartData.length
        for(let i =0;i<this.props.recentCartData.length;i++){
            var tax = this.props.recentCartData[i].cartTotal;
        }
    }

    getTaxmasterData(){
        axios.post('/api/expensetypemaster/get/list')
        .then((response) => {
            // console.log('TaxData tableData ==== ', response.data[0]);
            if(response.data[0]){
            this.setState({
                taxrate: response.data[0].GSTRate, 
                taxName: response.data[0].type             
            },()=>{
               
            })
        }
        })
        .catch((error) => {
            console.log("error => ",error);
            if(error.message === "Request failed with status code 401"){
                var userDetails =  localStorage.removeItem("userDetails");
                // localStorage.clear();
                swal({  
                    title : "Your Session is expired.",                
                    text  : "You need to login again. Click OK to go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }
    getdiscounteddata(startRange, limitRange) {
        axios.get('/api/discount/get/list-with-limits/' + startRange + '/' + limitRange)
            .then((response) => {
                // console.log('Disscount tableData ==== ', response.data[0]);
                if(response.data[0]){
                this.setState({
                    discountdata: response.data[0],
                    discounttype: response.data[0].discounttype,
                    discountin: response.data[0].discountin,
                    discountvalue: response.data[0].discountvalue,
                })
                }
            })
            .catch((error) => {
                console.log("error => ",error);
                if(error.message === "Request failed with status code 401"){
                    var userDetails =  localStorage.removeItem("userDetails");
                    localStorage.clear();
                    swal({  
                        title : "Your Session is expired.",                
                        text  : "You need to login again. Click OK to go to Login Page"
                    })
                    .then(okay => {
                        if (okay) {
                            window.location.href = "/login";
                        }
                    });
                }
            });
    }
    // getCartData(){
    //     const userid = localStorage.getItem('user_ID');
    //     axios.get("/api/carts/get/cartproductlist/"+userid)
    //       .then((response)=>{ 
    //         //   console.log('cartData', response.data);
    //         this.setState({
    //             cartData : response.data
    //         })
    //       })
    //       .catch((error)=>{
    //         console.log("error => ",error);
    //         if(error.message === "Request failed with status code 401"){
    //             var userDetails =  localStorage.removeItem("userDetails");
    //             localStorage.clear();
    //             swal({  
    //                 title : "Your Session is expired.",                
    //                 text  : "You need to login again. Click OK to go to Login Page"
    //             })
    //             .then(okay => {
    //                 if (okay) {
    //                     window.location.href = "/login";
    //                 }
    //             });
    //         }
    //       })
    // }
    getshippingamount(startRange, limitRange){
        axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
        //   console.log('shippingamount = ', response.data[0].shippingcosting);
          this.setState({
            minvalueshipping: response.data[0].shippingcosting,
          })
        })
        .catch((error) => {
          console.log("error => ",error);
            if(error.message === "Request failed with status code 401"){
                var userDetails =  localStorage.removeItem("userDetails");
                localStorage.clear();
                swal({  
                    title : "Your Session is expired.",                
                    text  : "You need to login again. Click OK to go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }
    Removefromcart(event){
        event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const formValues = { 
            "user_ID"    : userid,
            "cartItem_ID" : cartitemid,
        }
        axios.patch("/api/carts/remove" ,formValues)
        .then((response)=>{
            this.setState({
                messageData : {
                  "type" : "outpage",
                  "icon" : "fa fa-check-circle",
                  "message" : response.data.message,
                  "class": "success",
                  "autoDismiss" : true
                }
            })
            setTimeout(() => {
                this.setState({
                    messageData   : {},
                })
            }, 3000);
            this.props.fetchCartData();
        })
        .catch((error)=>{
            console.log("error => ",error);
            // if(error.message === "Request failed with status code 401"){
            //     var userDetails =  localStorage.removeItem("userDetails");
            //     localStorage.clear();
            //     swal({  
            //         title : "Your Session is expired.",                
            //         text  : "You need to login again. Click OK to go to Login Page"
            //     })
            //     .then(okay => {
            //         if (okay) {
            //             window.location.href = "/login";
            //         }
            //     });
            // }
        })
    }
    cartquantityincrease(event){
        event.preventDefault();
        const userid     = localStorage.getItem('user_ID');
        const product_ID = event.target.getAttribute('productid');   
        const vendor_id = event.target.getAttribute('vendor_id');     
        const quantity   = parseInt(event.target.getAttribute('dataquntity'));
        var availableQuantity = parseInt(event.target.getAttribute('availablequantity'));
        const quantityAdded   = parseInt(quantity+1);

        if(localStorage.getItem('websiteModel')==="FranchiseModel"){
            const size       = event.target.getAttribute('size');
            const unit       = event.target.getAttribute('unit');
            var totalWeight  = quantityAdded * size;             
            if(unit === "gm"){
                if(totalWeight >= 1000){
                    totalWeight = totalWeight/1000;
                    totalWeight = totalWeight+" KG";               
                }else{
                    totalWeight      = totalWeight+" GM";
                }
            }else{
                totalWeight      = totalWeight+" "+unit;
            }
            const formValues = { 
                "user_ID"     	: userid,
                "product_ID" 	: product_ID,
                "totalWeight"   : totalWeight,
                "vendor_ID"     : vendor_id ,
                "quantityAdded" : quantityAdded,
            }  
            console.log("formValues====",formValues);  
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                    this.props.fetchCartData();
            })
            .catch((error)=>{
                console.log("error => ",error);
                // if(error.message === "Request failed with status code 401"){
                //     var userDetails =  localStorage.removeItem("userDetails");
                //     localStorage.clear();
                //     swal({  
                //         title : "Your Session is expired.",                
                //         text  : "You need to login again. Click OK to go to Login Page"
                //     })
                //     .then(okay => {
                //         if (okay) {
                //             window.location.href = "/login";
                //         }
                //     });
                // }
            })
            
        }else{
            const formValues = { 
                "user_ID"     	: userid,
                "product_ID" 	: product_ID,
                "quantityAdded" : quantityAdded,
                "totalWeight"   : totalWeight,
                "vendor_ID"     : vendor_id ,
                "quantityAdded" : quantityAdded,
            }
            if(quantityAdded > availableQuantity){
                this.setState({
                    messageData : {
                        "type" : "outpage",
                        "icon" : "fa fa-check-circle",
                        "message" : "Last "+availableQuantity+" items taken by you",
                        "class": "success",
                        "autoDismiss" : true
                    }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            }
            else{
                console.log("formValues===",formValues);
                axios.patch("/api/carts/quantity" ,formValues)
                .then((response)=>{
                        this.props.fetchCartData();
                })
                .catch((error)=>{
                    console.log("error => ",error);
                    // if(error.message === "Request failed with status code 401"){
                    //     var userDetails =  localStorage.removeItem("userDetails");
                    //     localStorage.clear();
                    //     swal({  
                    //         title : "Your Session is expired.",                
                    //         text  : "You need to login again. Click OK to go to Login Page"
                    //     })
                    //     .then(okay => {
                    //         if (okay) {
                    //             window.location.href = "/login";
                    //         }
                    //     });
                    //}
                })
            }
        }        
        
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

    cartquantitydecrease(event){
    	event.preventDefault();
        const userid     = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id'); 
        const vendor_id  = event.target.getAttribute('vendor_id');
        const quantity   = parseInt(event.target.getAttribute('dataquntity'));
        const quantityAdded = parseInt(quantity-1) <= 0 ? 1 : parseInt(quantity-1);
       
        if(localStorage.getItem('websiteModel')==="FranchiseModel"){
            const size       = event.target.getAttribute('size');
            const unit       = event.target.getAttribute('unit');
            var totalWeight  = quantityAdded * size;

            if(unit === "gm"){
                if(totalWeight >= 1000){
                    totalWeight = totalWeight/1000;
                    totalWeight = totalWeight+" KG";              
                }
                else{
                    totalWeight      = totalWeight+" GM";
                }
            }else{
                totalWeight      = totalWeight+" "+unit;
            }
            const formValues = { 
                "user_ID"     	: userid,
                "product_ID" 	: cartitemid,
                "quantityAdded" : quantityAdded,
                "totalWeight"   : totalWeight,
                "vendor_ID"     : vendor_id, 
            }   
            console.log("formValues===",formValues);         
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                    this.props.fetchCartData();
            })
            .catch((error)=>{
                console.log("error => ",error);
                // if(error.message === "Request failed with status code 401"){
                //     var userDetails =  localStorage.removeItem("userDetails");
                //     localStorage.clear();
                //     swal({  
                //         title : "Your Session is expired.",                
                //         text  : "You need to login again. Click OK to go to Login Page"
                //     })
                //     .then(okay => {
                //         if (okay) {
                //             window.location.href = "/login";
                //         }
                //     });
                // }
            })
            
        }else{
            const formValues    = { 
                "user_ID"     	: userid,
                "product_ID" 	: cartitemid,
                "quantityAdded" : quantityAdded,     
                "vendor_ID"     : vendor_id,       
            }
            console.log("formValues===",formValues);
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                this.props.fetchCartData();
            })
            .catch((error)=>{
                console.log("error => ",error);
                // if(error.message === "Request failed with status code 401"){
                //     var userDetails =  localStorage.removeItem("userDetails");
                //     localStorage.clear();
                //     swal({  
                //         title : "Your Session is expired.",                
                //         text  : "You need to login again. Click OK to go to Login Page"
                //     })
                //     .then(okay => {
                //         if (okay) {
                //             window.location.href = "/login";
                //         }
                //     });
                // }
            })
        }
        
    }

    proceedToCheckout(event){
        event.preventDefault();
        for(let i =0 ; i< this.props.recentCartData.vendorOrders.length; i++){
            // console.log("this.props.recentCartData.vendorOrders[i].cartItems===",this.props.recentCartData.vendorOrders[i].cartItems);
            var soldProducts = this.props.recentCartData.vendorOrders[i].cartItems.filter((a, i)=>{
                return a.product_ID.availableQuantity <= 0;
            })
        }
        if(soldProducts.length > 0){
            this.setState({
                messageData : {
                  "type" : "outpage",
                  "icon" : "fa fa-exclamation-circle",
                  "message" : "&nbsp; Please remove sold out products from cart to proceed to checkout.",
                  "class": "warning",
                  "autoDismiss" : true
                }
              })
              setTimeout(() => {
                  this.setState({
                      messageData   : {},
                  })
              }, 6000);
        }else{
            // window.fbq('track', 'InitiateCheckout');
            Router.push('/checkout');            
        }
    }
    continueShopping(event){
        event.preventDefault();
        this.props.history.push('/');
    }
    updateShoppingCart(){
        window.location.reload();
    }
    moveWishlist(event){
        event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const productid = event.target.getAttribute('productid');
        const formValues = { 
            "user_ID"    : userid,
            "cartItem_ID" : cartitemid,
        }


          const wishValues = {
            "user_ID": userid,
            "product_ID": productid,
          }
          axios.post('/api/wishlist/post', wishValues)
            .then((response) => {
                axios.patch("/api/carts/remove" ,formValues)
                .then((response)=>{
                    this.setState({
                        messageData : {
                          "type" : "outpage",
                          "icon" : "fa fa-check-circle",
                          "message" : "Product moved to wishlist successfully.",
                          "class": "success",
                          "autoDismiss" : true
                        }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                    this.props.fetchCartData();
                    // window.location.reload();
                })
                .catch((error)=>{
                    console.log("error => ",error);
                    if(error.message === "Request failed with status code 401"){
                        var userDetails =  localStorage.removeItem("userDetails");
                        localStorage.clear();
                        swal({  
                            title : "Your Session is expired.",                
                            text  : "You need to login again. Click OK to go to Login Page"
                        })
                        .then(okay => {
                            if (okay) {
                                window.location.href = "/login";
                            }
                        });
                    }
                })
            })
            .catch((error) => {
                console.log("error => ",error);
                if(error.message === "Request failed with status code 401"){
                    var userDetails =  localStorage.removeItem("userDetails");
                    localStorage.clear();
                    swal({  
                        title : "Your Session is expired.",                
                        text  : "You need to login again. Click OK to go to Login Page"
                    })
                    .then(okay => {
                        if (okay) {
                            window.location.href = "/login";
                        }
                    });
                }
            })
    }

    render(){
        return(            
            <div className="container-fluid">
            <div className="col-12 cartHeight">
                {/* <Loader type="fullpageloader"/> */}
                <div className="row">
                    <Message messageData={this.state.messageData} />
                    {   
                    this.props.recentCartData.vendorOrders && this.props.recentCartData.vendorOrders.length>0? 
                    <div className="col-12 NOpadding" style={{"marginBottom":"20px"}}>
                        <div className="row">  
                            <div className="col-12 col-xl-12 col-md-12 table-responsive cartProduct">
                                <div className="table cartProductTable">                                   
                                    <div className="col-12">
                                    {    
                                        this.props.recentCartData.vendorOrders.length>0 && this.props.recentCartData.vendorOrders.map((vendorWiseCartData,index) =>{  
                                        // console.log("vendorWiseCartData==",vendorWiseCartData);
                                        return(  
                                            <div className="row" key={index}>
                                                <div className="col-9">
                                                    <div className="col-12 mt-2 mb-2 vendorName"><b>{vendorWiseCartData.vendorName}</b></div>
                                                    { vendorWiseCartData.cartItems.map((vendorData, index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-2 ForMobile">
                                                                        <a href={"/product-detail/" + vendorData.product_ID.productUrl + "/" +vendorData.product_ID}>
                                                                            <img className="img  cartProductImg col-12" src={vendorData.product_ID.productImage[0] ? vendorData.product_ID.productImage[0] : "images/eCommerce/notavailable.jpg"} alt="ProductImg"/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-4 cartProductDetail">
                                                                        <a href={"/product-detail/" + vendorData.product_ID.productUrl + "/" +vendorData.product_ID}>
                                                                            {vendorData.product_ID.productNameRlang?
                                                                                <h5 className="RegionalFont">{vendorData.product_ID.productNameRlang}</h5>
                                                                            :
                                                                                <h5 className="">{vendorData.product_ID.productName}</h5>
                                                                            }
                                                                        </a>
                                                                    {
                                                                        vendorData.product_ID.discountPercent  ?
                                                                            <div className="col-12 NoPadding">
                                                                                <span className="cartOldprice"><i className="fa fa-inr cartOldprice"></i>{vendorData.product_ID.originalPrice}</span> &nbsp; &nbsp;
                                                                                <span className="cartPrice"><i className="fa fa-inr"></i>{vendorData.product_ID.discountedPrice}</span> &nbsp; &nbsp;
                                                                                <span className="cartDiscountPercent">( {Math.floor(vendorData.product_ID.discountPercent)}% Off )</span>
                                                                            </div>
                                                                            :
                                                                            <div className="col-12 NoPadding">
                                                                                <span className="price">
                                                                                {this.state.currency}&nbsp;{vendorData.product_ID.originalPrice}</span>
                                                                            </div>
                                                                    }

                                                                    <div className=" NoPadding">
                                                                        <button productid={vendorData.product_ID._id} id={vendorData._id} onClick={this.moveWishlist.bind(this)} className=" btn wishlistBtn">Move To Wishlist</button>
                                                                    </div>
                                                                    </div> 

                                                                    <div className="nowrap col-2">                                                         
                                                                    {
                                                                        vendorData.product_ID.availableQuantity > 0 ?
                                                                        <div className="quantityWrapper">
                                                                            <span className="minusQuantity fa fa-minus" id={vendorData.product_ID._id} vendor_id={vendorWiseCartData.vendor_id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} 
                                                                                onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                            <span className="inputQuantity">{this.state['quantityAdded|'+vendorData._id] ? this.state['quantityAdded|'+vendorData._id] : vendorData.quantity}</span>&nbsp;
                                                                            <span className="plusQuantity fa fa-plus" vendor_id={vendorWiseCartData.vendor_id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} productid={vendorData.product_ID._id} id={vendorData.product_ID._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} availablequantity={vendorData.product_ID.availableQuantity}  
                                                                                onClick={this.cartquantityincrease.bind(this)}></span><br/>   
                                                                            { this.state.websiteModel === 'FranchiseModel'?                                                                 
                                                                                <span className ="productUnit" id={vendorData.product_ID._id}> Of {vendorData.product_ID.size}&nbsp;<span className="CapsUnit">{vendorData.product_ID.unit}</span></span>
                                                                            :null
                                                                            }
                                                                        </div>
                                                                        :
                                                                        <span className="sold textAlignCenter">SOLD OUT</span>
                                                                    }
                                                                    </div>  
                                                                    <div className="nowrap col-3">
                                                                    {
                                                                        vendorData.product_ID.availableQuantity > 0 ?
                                                                            <span className={"cartProductPrize "}> {this.state.currency}&nbsp;{vendorData.subTotal}</span>
                                                                        :
                                                                        <span>-</span>
                                                                    }    
                                                                    </div>
                                                                    <div className="col-1">
                                                                        <span className="fa fa-trash trashIcon" id={vendorData._id} onClick={this.Removefromcart.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                                    </div>
                                                                </div> 
                                                            </div>
                                                        </div>    
                                                    );
                                                    })
                                                }
                                                </div>
                                                <div className="col-3 vendorWiseSummury cartSummary ">
                                                <strong className="cartSummaryTitle ">{vendorWiseCartData.vendorName}&nbsp;Order Summary</strong>
                                                    {/* < OrderSummury  vendorWiseCartData= {vendorWiseCartData} /> */}                                            
                                                <table className="table table-responsive summaryTable">
                                                    <tbody>
                                                        <tr>
                                                            <td>Sub Total</td>
                                                            <td className="textAlignRight">&nbsp; 
                                                            {this.state.currency} &nbsp;{vendorWiseCartData.vendor_afterDiscountTotal > 0 ? vendorWiseCartData.vendor_afterDiscountTotal : 0.00} </td>
                                                        </tr>
                                                        <tr>
                                                            <td>You Saved</td>
                                                            <td className="textAlignRight">&nbsp; 
                                                            {this.state.currency} &nbsp;{vendorWiseCartData.vendor_discountAmount > 0 ? vendorWiseCartData.vendor_discountAmount : 0.00} </td>
                                                        </tr>
                                                        {/* <tr>
                                                            <td>Delivery Charges</td>
                                                            <td className="textAlignRight saving">&nbsp; { vendorWiseCartData.vendor_shippingCharges } </td>
                                                        </tr>                                                         */}
                                                        <tr>
                                                            <td>Tax</td>  
                                                            <td className="textAlignRight saving">&nbsp; 
                                                                <span> {this.state.currency} &nbsp; {vendorWiseCartData.vendor_taxAmount}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="cartTotal"> Totals </td>
                                                            <td className="textAlignRight cartTotal">&nbsp; 
                                                            {this.state.currency} &nbsp;{vendorWiseCartData.vendor_netPayableAmount}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </div>
                                            
                                            </div>
                                        ) //end return   
                                        })// end fechcartData map

                                    }
                                    </div>
                                    <div className="col-12 CouponCode">
                                        <div className="row ">
                                        <div className="col-9">
                                            <div className="col-4 offset-4 checkoutBtn">
                                            {
                                            this.state.minvalueshipping?
                                                <div className="col-12 NoPadding">
                                                { this.state.minvalueshipping <= this.props.recentCartData.paymentDetails.netPayableAmount  ?
                                                    <button onClick={this.proceedToCheckout.bind(this)} className="col-12 globaleCommBtn btn cartCheckout NoPadding">
                                                        PROCEED TO CHECKOUT
                                                    </button>
                                                    :
                                                    <button onClick={this.proceedToCheckout.bind(this)} className="col-12 btn globaleCommBtn blockcartCheckout" disable>
                                                        PROCEED TO CHECKOUT
                                                    </button> 
                                                }
                                                </div>
                                            :
                                                <button  className="col-12 btn globaleCommBtn blockcartCheckout" 
                                                onClick={this.proceedToCheckout.bind(this)}>
                                                    PROCEED TO CHECKOUT
                                                </button> 

                                            }
                                            </div>
                                            <div className="col-12 text-center couponMsg"> Proceed to checkout to apply discount coupon code </div>
                                        </div>
                                        <div className="col-3  cartSummary ">
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Final Total Amount</div>
                                                    <div className="col-4 textAlignRight">&nbsp;
                                                    {this.state.currency} &nbsp;{this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? parseInt(this.props.recentCartData.paymentDetails.netPayableAmount) : 0.00} </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Savings</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                        {this.state.currency} &nbsp;{ this.props.recentCartData.paymentDetails.discountAmount>0?this.props.recentCartData.paymentDetails.discountAmount : 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Tax</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                        {this.state.currency} &nbsp;{ this.props.recentCartData.paymentDetails.taxAmount>0 ? this.props.recentCartData.paymentDetails.taxAmount : 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Delivery Charges</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                        {this.state.currency} &nbsp;{ this.props.recentCartData.paymentDetails.shippingCharges>0 ? this.props.recentCartData.paymentDetails.shippingCharges : 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Grand Total</div>
                                                    <div className="col-4 textAlignRight">&nbsp;
                                                        {this.state.currency} {this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? this.props.recentCartData.paymentDetails.netPayableAmount  : 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>                              
                                    </div>
                                </div>                           
                            </div>  
                        </div>
                    </div>
                    :
                    <div className="col-12  textAlignCenter">
                        <img className="col-12 col-md-4 col-sm-6 " src={"/images/eCommerce/emptycart.png"} alt="" />                          
                    </div> 
                    }  
                </div>
            </div>
            </div>
        );
    }
}
const mapStateToProps = state => (
    console.log("state in cartProductsdata====",state.data.recentCartData),
    {
      recentCartData: state.data.recentCartData,
    } 
);

const mapDispatchToProps = {
    fetchCartData: getCartData, 
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);