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
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
        var token         = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
        var websiteModel = localStorage.getItem('websiteModel');
        this.setState({
            websiteModel : websiteModel,
        })
        await this.props.fetchCartData();
        this.getdiscounteddata(this.state.startRange, this.state.limitRange);
        this.getshippingamount(this.state.startRange, this.state.limitRange);
        this.getTaxmasterData();
        this.getCartTotal();
    }
    getCartTotal(){
        this.props.recentCartData.length
        console.log("this.props.recentCartData",this.props.recentCartData);
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
    cartquantityincrease(event){
        event.preventDefault();
        const userid     = localStorage.getItem('user_ID');
        const product_ID = event.target.getAttribute('productid');        
        const quantity   = parseInt(event.target.getAttribute('dataquntity'));
        
        var availableQuantity = parseInt(event.target.getAttribute('availablequantity'));
        const quantityAdded   = parseInt(quantity+1);

        if(localStorage.getItem('websiteModel')==="FranchiseModel"){
            const size       = event.target.getAttribute('size');
            const unit       = event.target.getAttribute('unit');
            var totalWeight  = quantityAdded * size;             
            if(unit === "gm"){
                if(totalWeight >= 1000){
                    // console.log("set unit kg");
                    //if weight is greater than 1000 gram then convert it to kg
                    totalWeight = totalWeight/1000;
                    totalWeight = totalWeight+" KG";
                    // console.log("document.getElementById(product_ID)===",document.getElementById("totalWeight-"+product_ID));
                    // document.getElementById("totalWeight-"+product_ID).innerHTML= totalWeight+"KG";                
                }else{
                    totalWeight      = totalWeight+" GM";
                }
            }else{
                totalWeight      = totalWeight+" "+unit;
            }
            const formValues = { 
                "user_ID"     	: userid,
                "product_ID" 	: product_ID,
                "quantityAdded" : quantityAdded,
                "totalWeight"   : totalWeight,
            }            
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                    this.props.fetchCartData();
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
            
        }else{
            const formValues = { 
                "user_ID"     	: userid,
                "product_ID" 	: product_ID,
                "quantityAdded" : quantityAdded,
                "totalWeight"   : totalWeight,
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
                axios.patch("/api/carts/quantity" ,formValues)
                .then((response)=>{
                        this.props.fetchCartData();
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
        // const size       = event.target.getAttribute('size');
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
                    
                    // document.getElementById("totalWeight-"+cartitemid).innerHTML= totalWeight+"KG";                
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
            }            
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                    this.props.fetchCartData();
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
            
        }else{
            const formValues    = { 
                "user_ID"     	: userid,
                "product_ID" 	: cartitemid,
                "quantityAdded" : quantityAdded,            
            }
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                this.props.fetchCartData();
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
        }
        
    }

    proceedToCheckout(event){
        event.preventDefault();
        
        var soldProducts = this.props.recentCartData[0].cartItems.filter((a, i)=>{
            return a.productDetail.availableQuantity <= 0;
        })
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
                    window.location.reload();
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
    applyCoupon(event){
        event.preventDefault();
        var totalPrice = 50;
        var couponCode = this.refs.couponCode.value;
        // console.log("couponCode===",couponCode);
        var userDetails = JSON.parse(localStorage.getItem('userDetails'));
        // console.log("userDetails====",userDetails);
        // console.log("user_ID===",this.state.coupenPrice);
        var userId = userDetails.user_id;
        if(this.state.coupenPrice === 0){
            axios.get('/api/coupon/get/one_by_couponcode/'+couponCode+"/"+userId)
            .then(res=>{
            // console.log("res=>",res);
            if(res.data.message){
                swal({text: res.data.message});
            }else{
                if(totalPrice > res.data.minPurchaseAmount){
                    if(res.data.coupenin === 'Percent'){
                    // console.log("res.data.coupenvaluE",res.data.coupenvalue);
                    // console.log("totalPrice",totalPrice);
                    var discount = ((res.data.coupenvalue/100) * totalPrice).toFixed(2);
                    // console.log("discount",discount);
                    this.setState({
                        coupenPrice : res.data.coupenvalue,
                        totalPrice  : discount,
                        coupenCode  : '',

                    })
                    swal({text: "Coupen Applied"});
                    }else{
                    var discount = totalPrice - res.data.coupenvalue;
                    this.setState({
                        coupenPrice : res.data.coupenvalue,
                        totalPrice  : discount,
                        coupenCode  : '',

                    })
                    swal({text: "Coupen Applied"});
                    console.log("discount",this.state.discount);
                    }
                }else{
                    swal({text: "Your order total should be greater than AED " + res.data.minPurchaseAmount, color:'red'});
                }
            }
            })
            .catch(err=>{
                this.setState({coupenCode  : ''})
                console.log("err",err);
            })
        }else{
            this.setState({coupenCode  : ''})
            swal({text: "Coupen already applied"});
        }  
    }
    render(){
        return(            
            <div className="container-fluid">
            <div className="col-12 cartHeight">
                {/* <Loader type="fullpageloader"/> */}
                <div className="row">
                    <Message messageData={this.state.messageData} />
                    {   
                    this.props.recentCartData && this.props.recentCartData.length>0? 
                    <div className="col-12 NOpadding" style={{"marginBottom":"20px"}}>
                        <div className="row">  
                            <div className="col-12 col-xl-12 col-md-12 table-responsive cartProduct">
                                <div className="table cartProductTable">                                   
                                    <div className="col-12">
                                    {    
                                        this.props.recentCartData.length>0 && this.props.recentCartData.map((vendorWiseCartData,index) =>{  
                                        // console.log("vendorWiseCartData==",vendorWiseCartData);
                                        return(  
                                            <div className="row">
                                                <div className="col-9">
                                                    <div className="col-12 mt-2 mb-2 vendorName"><b>{vendorWiseCartData.vendorName}</b></div>
                                                    { vendorWiseCartData.cartItems.map((vendorData, index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-2 ForMobile">
                                                                        <a href={"/product-detail/" + vendorData.productDetail.productUrl + "/" +vendorData.product_ID}>
                                                                            <img className="img  cartProductImg col-12" src={vendorData.productDetail.productImage[0] ? vendorData.productDetail.productImage[0] : "images/eCommerce/notavailable.jpg"} alt="ProductImg"/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-4 cartProductDetail">
                                                                        <a href={"/product-detail/" + vendorData.productDetail.productUrl + "/" +vendorData.product_ID}>
                                                                            {vendorData.productDetail.productNameRlang?
                                                                                <h5 className="RegionalFont">{vendorData.productDetail.productNameRlang}</h5>
                                                                            :
                                                                                <h5 className="">{vendorData.productDetail.productName}</h5>
                                                                            }
                                                                        </a>
                                                                    {
                                                                        vendorData.productDetail.discountPercent  ?
                                                                            <div className="col-12 NoPadding">
                                                                                <span className="cartOldprice"><i className="fa fa-inr cartOldprice"></i>{vendorData.productDetail.originalPrice}</span> &nbsp; &nbsp;
                                                                                <span className="cartPrice"><i className="fa fa-inr"></i>{vendorData.productDetail.discountedPrice}</span> &nbsp; &nbsp;
                                                                                <span className="cartDiscountPercent">( {Math.floor(vendorData.productDetail.discountPercent)}% Off )</span>
                                                                            </div>
                                                                            :
                                                                            <div className="col-12 NoPadding">
                                                                                <span className="price">
                                                                                {/* <i className="fa fa-inr"></i> */}
                                                                                AED&nbsp;{vendorData.productDetail.originalPrice}</span>
                                                                            </div>
                                                                    }

                                                                    <div className=" NoPadding">
                                                                        <button productid={vendorData.productDetail._id} id={vendorData._id} onClick={this.moveWishlist.bind(this)} className=" btn wishlistBtn">Move To Wishlist</button>
                                                                    </div>
                                                                    </div> 

                                                                    <div className="nowrap col-2">                                                         
                                                                    {
                                                                        vendorData.productDetail.availableQuantity > 0 ?
                                                                        <div className="quantityWrapper">
                                                                            <span className="minusQuantity fa fa-minus" id={vendorData.productDetail._id} size={vendorData.productDetail.size} unit={vendorData.productDetail.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                            <span className="inputQuantity">{this.state['quantityAdded|'+vendorData._id] ? this.state['quantityAdded|'+vendorData._id] : vendorData.quantity}</span>&nbsp;
                                                                            <span className="plusQuantity fa fa-plus" size={vendorData.productDetail.size} unit={vendorData.productDetail.unit} productid={vendorData.product_ID} id={vendorData.productDetail._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} availablequantity={vendorData.productDetail.availableQuantity}  
                                                                                onClick={this.cartquantityincrease.bind(this)}></span><br/>   
                                                                            { this.state.websiteModel === 'FranchiseModel'?                                                                 
                                                                                <span className ="productUnit" id={vendorData.productDetail._id}> Of {vendorData.productDetail.size}&nbsp;<span className="CapsUnit">{vendorData.productDetail.unit}</span></span>
                                                                            :null
                                                                            }
                                                                        </div>
                                                                        :
                                                                        <span className="sold textAlignCenter">SOLD OUT</span>
                                                                    }
                                                                    </div>  
                                                                    <div className="nowrap col-3">
                                                                    {
                                                                        vendorData.productDetail.availableQuantity > 0 ?
                                                                            <span className={"cartProductPrize "}> AED&nbsp;{vendorData.subTotal}</span>
                                                                        :
                                                                        <span>-</span>
                                                                    }    
                                                                    </div>
                                                                    <div className="col-1">
                                                                        <span className="fa fa-trash trashIcon" id={vendorData._id} onClick={this.Removefromcart.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                                    </div>


                                                                </div> 
                                                                
                                                            </div>
                                                            {/* <td className="nowrap ">
                                                            {
                                                                vendorData.productDetail.availableQuantity > 0 ?
                                                                    <div >
                                                                        <span id="productPrize" className={"cartProductPrize fa fa-inr"}>&nbsp;{vendorData.productDetail.discountedPrice}</span><br />
                                                                    </div>
                                                                :
                                                                <span>-</span>
                                                            }
                                                            </td> */}
                                                            

                                                            {/* <td className="proWeight">  
                                                                { this.state.websiteModel === 'FranchiseModel'? 
                                                                
                                                                    <span className="col-12 NoPadding productSize totalWeight">&nbsp;{vendorData.totalWeight} &nbsp;</span> 
                                                                :
                                                                    <span style={{"textAlign":"center"}} className="col-xl-12 NoPadding productSize">{vendorData.productDetail.size} &nbsp; 
                                                                        {vendorData.productDetail.size ?<span style={{"textAlign":"center"}} className="col-xl-12 NoPadding CapsUnit">{vendorData.productDetail.unit}</span>:'-'}
                                                                    </span>
                                                                }
                                                            </td> */}
                                                            
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
                                                            {/* <i className={"fa fa-inr"}></i>  */}
                                                            AED &nbsp;{vendorWiseCartData.total > 0 ? parseInt(vendorWiseCartData.total) : 0.00} </td>
                                                        </tr>
                                                        <tr>
                                                            <td>You Saved</td>
                                                            <td className="textAlignRight">&nbsp; 
                                                            {/* <i className={"fa fa-inr"}></i>  */}
                                                            AED &nbsp;{vendorWiseCartData.total > 0 ? parseInt(vendorWiseCartData.discount) : 0.00} </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Delivery Charges</td>
                                                            <td className="textAlignRight saving">&nbsp;{ 
                                                                this.state.minvalueshipping > vendorWiseCartData.total ?
                                                                    // "This store requires minimum order of Rs."+this.state.minvalueshipping
                                                                    // "Make minimum purchase of Rs."+this.state.minvalueshipping+" to checkout your order."
                                                                    "No Delivery"
                                                                :  
                                                                    "0.00"
                                                                }
                                                            </td>
                                                        </tr>
                                                        
                                                        <tr>
                                                            <td>Tax</td>  
                                                            <td className="textAlignRight saving">&nbsp; 
                                                                <span>
                                                                    {this.state.taxrate>0? 
                                                                        <span>+&nbsp;<i className="fa fa-inr" />
                                                                        {this.props.recentCartData.length > 0 ?
                                                                        this.state.discountdata !== undefined ?
                                                                            this.props.recentCartData.length > 0 && this.state.discountin === "Percent" ?
                                                                                Math.round((parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                                                :Math.round((parseInt(vendorWiseCartData.total) - this.state.discountvalue)*this.state.taxrate/100)
                                                                            : Math.round(parseInt(vendorWiseCartData.total)*this.state.taxrate/100)
                                                                        : "0.00"
                                                                        }
                                                                        </span>
                                                                        :"0.00"
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="cartTotal"> Totals </td>
                                                            <td className="textAlignRight cartTotal">&nbsp; 
                                                            {/* <i className={"fa fa-inr"}></i> */}
                                                            AED &nbsp;{vendorWiseCartData.total}
                                                            {/* {
                                                                Math.round(
                                                                    Number( this.props.recentCartData.length > 0 ?
                                                                        this.state.discountdata !== undefined ?
                                                                            this.state.discountin === "Percent" ?                                                                        
                                                                                parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)
                                                                                : parseInt(vendorWiseCartData.total) - this.state.discountvalue
                                                                        : parseInt(vendorWiseCartData.total)
                                                                    : "0.00"
                                                                    )                                                                
                                                                    +
                                                                    Number( this.state.taxrate>0?  
                                                                        this.props.recentCartData.length > 0 ?
                                                                            this.state.discountdata !== undefined ?
                                                                                this.state.discountin === "Percent" ?
                                                                                    
                                                                                    Math.round((parseInt(vendorWiseCartData.total) - (parseInt(vendorWiseCartData.total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                                                :
                                                                                    this.state.discountvalue>0?
                                                                                        Math.round((parseInt(vendorWiseCartData.total) - this.state.discountvalue)*this.state.taxrate/100) 
                                                                                    :"0.00"
                                                                            : 
                                                                                Math.round(parseInt(vendorWiseCartData.total)*this.state.taxrate/100) 
                                                                        : 
                                                                            "0.00"
                                                                    :0.00
                                                                    )
                                                                )
                                                                }                                  */}
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
                                        <div className="col-6  ">
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Amount</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                    {/* <i className={"fa fa-inr"}></i>  */}
                                                    AED &nbsp;{this.props.recentCartData[0].cartTotal > 0 ? parseInt(this.props.recentCartData[0].cartTotal) : 0.00} </div>
                                                </div>
                                            </div>
                                            <div className="col-12 mb-2">
                                                <input type="text" placeholder="Enter Discount Coupon Here..."
                                                     
                                                    className="couponCode col-8" ref="couponCode" id="couponCode" name="couponCode" />
                                                <button className="btn-primary" onClick={this.applyCoupon.bind(this)}>Apply</button>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Tax</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                        {/* <i className={"fa fa-inr"}></i>  */}
                                                        {/* AED &nbsp;{this.props.recentCartData[0].cartTotal > 0 ? parseInt(this.props.recentCartData[0].cartTotal) : 0.00}  */}
                                                        AED &nbsp;{ 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Total Delivery Charges</div>
                                                    <div className="col-4 textAlignRight">&nbsp; 
                                                        {/* <i className={"fa fa-inr"}></i>  */}
                                                        AED &nbsp;{ 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 totalAmounts mb-2 pull-right">
                                                <div className="row">
                                                    <div className="col-8">Grand Total</div>
                                                    <div className="col-4 textAlignRight">&nbsp;
                                                        {/* <i className={"fa fa-inr"}></i> */}
                                                        AED {this.props.recentCartData[0].cartTotal > 0 ? parseInt(this.props.recentCartData[0].cartTotal) : 0.00} 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-3 offset-3">
                                        {
                                        this.state.minvalueshipping?
                                            <div className="col-12 NoPadding">
                                            { this.state.minvalueshipping <= this.props.recentCartData[0].total  ?
                                                <button onClick={this.proceedToCheckout.bind(this)} className="col-12 globaleCommBtn btn cartCheckout NoPadding">
                                                    PROCEED TO CHECKOUT
                                                </button>
                                                :
                                                <button  className="col-12 btn globaleCommBtn blockcartCheckout" disabled>
                                                    PROCEED TO CHECKOUT
                                                </button> 
                                                }
                                            </div>
                                        :
                                            <button  className="col-12 btn globaleCommBtn blockcartCheckout">
                                                PROCEED TO CHECKOUT
                                            </button> 

                                        }
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
    // console.log("state in cartProductsdata====",state.data.recentCartData),
    {
      recentCartData: state.data.recentCartData,
    } 
);

const mapDispatchToProps = {
    fetchCartData: getCartData, 
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);