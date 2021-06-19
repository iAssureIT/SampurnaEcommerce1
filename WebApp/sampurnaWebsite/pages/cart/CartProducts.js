import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Router                 from 'next/router';
import Link                   from 'next/link';
import { connect }            from 'react-redux';
import {getCartData}          from '../../redux/actions/index.js'; 
import  store                 from '../../redux/store.js'; 
import Message                from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import OrderSummury           from './OrderSummury.js';
import Style                  from './CartProducts.module.css';

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
            CheckoutBtn : true,
        }
    }

    async componentDidMount(){
        var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
       if(userDetails){
        this.setState({
            user_ID      : userDetails.user_id,
        })
       }
        if(sampurnaWebsiteDetails){
            this.setState({
                websiteModel : sampurnaWebsiteDetails.preferences.websiteModel,
                currency     : sampurnaWebsiteDetails.preferences.currency
            })
        }
        await this.props.fetchCartData();
        if(this.props.recentCartData && this.props.recentCartData.vendorOrders){
            for(let i=0;i<this.props.recentCartData.vendorOrders.length;i++){
                if(this.props.recentCartData.vendorOrders[i].vendor_netPayableAmount < this.props.recentCartData.minOrderAmount ){
                    this.setState({
                        CheckoutBtn : false
                    },()=>{
                        console.log("CheckoutBtn===",this.state.CheckoutBtn)
                    })
                }
                break;
            }
        }
    }

    Removefromcart(event){
        event.preventDefault();
        const cartitemid = event.target.getAttribute('id');
        const vendorid = event.target.getAttribute('vendorid');
        const formValues = { 
            "user_ID"     : this.state.user_ID,
            "cartItem_ID" : cartitemid,
            vendor_ID     : vendorid,
        }
        console.log("Removefromcart===",formValues);
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
            }, 1500);
            this.props.fetchCartData();
            
        })
        .catch((error)=>{
            console.log("error => ",error);
        })
    }
    cartquantityincrease(event){
        event.preventDefault();
        const product_ID = event.target.getAttribute('productid');   
        const vendor_id = event.target.getAttribute('vendor_id');     
        const quantity   = parseInt(event.target.getAttribute('dataquntity'));
        var availableQuantity = parseInt(event.target.getAttribute('availablequantity'));
        const quantityAdded   = parseInt(quantity+1);

        if(this.state.websiteModel ==="FranchiseModel"){
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
                "user_ID"     	: this.state.user_ID,
                "product_ID" 	: product_ID,
                "totalWeight"   : totalWeight,
                "vendor_ID"     : vendor_id ,
                "quantityAdded" : quantityAdded,
            }  
            // console.log("formValues====",formValues);  
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                    this.props.fetchCartData();
            })
            .catch((error)=>{
                console.log("error => ",error);
            })
            
        }else{
            const formValues = { 
                "user_ID"     	: this.state.user_ID,
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
                }, 1500);
            }
            else{
                // console.log("formValues===",formValues);
                axios.patch("/api/carts/quantity" ,formValues)
                .then((response)=>{
                        // console.log("increament response=>",response.data);
                        this.props.fetchCartData();
                })
                .catch((error)=>{
                    console.log("error => ",error);
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
        const cartitemid = event.target.getAttribute('id'); 
        const vendor_id  = event.target.getAttribute('vendor_id');
        const quantity   = parseInt(event.target.getAttribute('dataquntity'));
        const quantityAdded = parseInt(quantity-1) <= 0 ? 1 : parseInt(quantity-1);
       
            const formValues    = { 
                "user_ID"     	: this.state.user_ID,
                "product_ID" 	: cartitemid,
                "quantityAdded" : quantityAdded,     
                "vendor_ID"     : vendor_id,       
            }
            // console.log("formValues===",formValues);
            axios.patch("/api/carts/quantity" ,formValues)
            .then((response)=>{
                this.props.fetchCartData();
            })
            .catch((error)=>{
                console.log("error => ",error);
            })
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
   
    moveWishlist(event){
        event.preventDefault();        
        const cartitemid = event.target.getAttribute('id');
        const productid = event.target.getAttribute('productid');
        const formValues = { 
            "user_ID"    : this.state.user_ID,
            "cartItem_ID" : cartitemid,
        }
          const wishValues = {
            "user_ID": this.state.user_ID,
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
                    }, 1500);
                    this.props.fetchCartData();
                })
                .catch((error)=>{
                    console.log("error => ",error);
                })
            })
            .catch((error) => {
                console.log("error => ",error);
            })
    }

    render(){
        console.log("this.props.recentCartData===",this.props.recentCartData.cartBtnDisabled);
        return(            
            <div className="container-fluid">
            <div className="col-12 cartHeight">
                {/* <Loader type="fullpageloader"/> */}
                <div className="row">
                    <Message messageData={this.state.messageData} />
                    {   
                    this.props.recentCartData && this.props.recentCartData.vendorOrders && this.props.recentCartData.vendorOrders.length>0? 
                    <div className="col-12 pl-0" style={{"marginBottom":"20px"}}>
                        <div className="col-12">  
                            <div className="col-12 col-xl-12 col-md-12 table-responsive cartProduct">
                                <div className="table">                                   
                                    <div className="col-12">
                                    {    
                                        this.props.recentCartData.vendorOrders.length>0 && this.props.recentCartData.vendorOrders.map((vendorWiseCartData,index) =>{  
                                        console.log("vendorWiseCartData==",vendorWiseCartData);
                                        return(  
                                            <div className={"row " +Style.singleRow} key={index}>
                                                <div className="col-12 col-sm-12 col-sx-12 col-md-12 col-lg-8 col-xl-8 ">
                                                    <div className={"col-12 " +Style.singleVendorBox}>
                                                    <div className="col-12 mt-2 mb-2 vendorName"><b>{vendorWiseCartData.vendor_id.companyName}</b></div>
                                                    { vendorWiseCartData.cartItems.map((vendorData, index)=>{
                                                        // console.log("vendorData=>",vendorData);
                                                    return(
                                                        <div key={index}>
                                                            <div className="col-12">
                                                                <div className={"row mb-4 " +Style.bbBox}>
                                                                    <div className="col-12 col-sm-12 col-sx-12 col-md-6 col-lg-2 col-xl-2 ForMobile">
                                                                        <a href={"/product-detail/" + vendorData.product_ID.productUrl + "/" +vendorData.product_ID}>
                                                                            <img className="img  cartProductImg col-12" src={vendorData.product_ID.productImage[0] ? vendorData.product_ID.productImage[0] : "images/eCommerce/notavailable.jpg"} alt="ProductImg"/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-12 col-sm-12 col-sx-12 col-md-6 col-lg-4 col-xl-4 cartProductDetail">
                                                                        <a href={"/product-detail/" + vendorData.product_ID.productUrl + "/" +vendorData.product_ID}>
                                                                            {vendorData.product_ID.productNameRlang?
                                                                                <h6 className="RegionalFont">{vendorData.product_ID.productNameRlang}></h6>
                                                                            :
                                                                                <h6 className="">{vendorData.product_ID.productName}</h6>
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

                                                                    <div className="nowrap col-12 col-sm-12 col-sx-12 col-md-4 col-lg-3 col-xl-2 mb-3 ">                                                         
                                                                    {
                                                                        vendorData.product_ID.availableQuantity > 0 ?
                                                                        <div className="quantityWrapper">
                                                                            <span className="minusQuantity fa fa-minus" id={vendorData.product_ID._id} vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} 
                                                                                onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                            <span className="inputQuantity">{this.state['quantityAdded|'+vendorData._id] ? this.state['quantityAdded|'+vendorData._id] : vendorData.quantity}</span>&nbsp;
                                                                            <span className="plusQuantity fa fa-plus" vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} productid={vendorData.product_ID._id} id={vendorData.product_ID._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} availablequantity={vendorData.product_ID.availableQuantity}  
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
                                                                    <div className="nowrap col-6 col-sm-12 col-sx-12 col-md-4 col-lg-2 col-xl-3">
                                                                    {
                                                                        vendorData.product_ID.availableQuantity > 0 ?
                                                                            <span className={"cartProductPrize "}> {this.state.currency}&nbsp;{vendorData.product_ID.discountPercent>0?vendorData.product_ID.discountedPrice * vendorData.quantity :vendorData.product_ID.originalPrice * vendorData.quantity}</span>
                                                                        :
                                                                        <span>-</span>
                                                                    }    
                                                                    </div>
                                                                    <div className="col-6 col-sm-12 col-sx-12 col-md-4 col-lg-1 col-xl-1 text-right  ">
                                                                        <span className="fa fa-trash trashIcon" id={vendorData._id} vendorid={vendorWiseCartData.vendor_id._id} onClick={this.Removefromcart.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                                    </div>
                                                                </div> 
                                                            </div>
                                                        </div>    
                                                    );
                                                    })
                                                }
                                                </div>
                                                {
                                                   vendorWiseCartData.vendor_netPayableAmount < this.props.recentCartData.minOrderAmount ?
                                                        <div className="col-12"> 
                                                            <div className="col-12 vendorWarning">Order total amount should be greater than AED&nbsp; {this.props.recentCartData.minOrderAmount}. Please add some more products.</div>
                                                            <div className="col-12 text-center">
                                                                <a href={"/products/"+vendorWiseCartData.vendor_id._id+"/"+vendorWiseCartData.vendorLocation_id+"/supermarket"} className="vendorShoppinglink">To continue shopping click here</a>
                                                            </div>
                                                        </div>
                                                    :null
                                                }
                                                </div>
                                                
                                                <div className={"col-12 col-sm-12 col-sx-12 offset-md-2 col-md-8 offset-lg-1 col-lg-3 offset-xl-1 col-xl-3 vendorWiseSummury pull-right " +Style.summaryClass +" " +vendorWiseCartData.invalidOrder}>
                                                    <strong className="cartSummaryTitle ">{vendorWiseCartData.vendor_id.companyName}&nbsp;Order Summary</strong>
                                                        {/* < OrderSummury  vendorWiseCartData= {vendorWiseCartData} /> */}                                            
                                                    <table className="table table-responsive summaryTable">
                                                        <tbody>
                                                            <tr>
                                                                <td>Sub Total</td>
                                                                <td className="textAlignRight">&nbsp; 
                                                                <b>{this.state.currency} &nbsp;{vendorWiseCartData.vendor_afterDiscountTotal > 0 ? vendorWiseCartData.vendor_afterDiscountTotal : 0.00}</b> </td>
                                                            </tr>
                                                            <tr>
                                                                <td>You Saved</td>
                                                                <td className="textAlignRight">&nbsp; 
                                                                <b>{this.state.currency} &nbsp;{vendorWiseCartData.vendor_discountAmount > 0 ? vendorWiseCartData.vendor_discountAmount : 0.00}</b> </td>
                                                            </tr>                                                        
                                                            <tr>
                                                                <td>Tax</td>  
                                                                <td className="textAlignRight saving">&nbsp; 
                                                                    <span> <b>{this.state.currency} &nbsp; {vendorWiseCartData.vendor_taxAmount}</b></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="cartTotal"> <b>Totals</b> </td>
                                                                <td className="textAlignRight cartTotal">&nbsp; 
                                                                <b>{this.state.currency} &nbsp;{vendorWiseCartData.vendor_netPayableAmount}</b>
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
                                            <div className="col-12 col-sm-12 col-sx-12 col-md-12 col-lg-8 col-xl-8  mt-1 mb-3 text-center">
                                                <div className="col-12">
                                                    <Link href="/">
                                                        <a className={"shoppingLink " +Style.shopping}>Contiune Shopping</a>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-sx-12 offset-md-2 col-md-8 offset-lg-1 col-lg-3 offset-xl-1 col-xl-3 NoPadding">
                                                <div className={"col-12  " +Style.cartSummary1}>
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
                                                            <div className="col-8">Total Delivery Charges 
                                                            
                                                            {/* <a tabindex="0" class="" data-toggle="popover" data-trigger="focus" title="Dismissible popover" data-content="Delivery charge details">
                                                                <i className="fa fa-info-circle infoCircle"></i>
                                                            </a> */}
                                                            </div>
                                                            <div className="col-4 textAlignRight">&nbsp; 
                                                                {this.state.currency} &nbsp;{ this.props.recentCartData.paymentDetails.shippingCharges>0 ? this.props.recentCartData.paymentDetails.shippingCharges : 0.00} 
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 totalAmounts mb-2 pull-right">
                                                        <div className="row">
                                                            <div className="col-7">Grand Total</div>
                                                            <div className="col-5 textAlignRight">&nbsp;
                                                                {this.state.currency} {this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? this.props.recentCartData.paymentDetails.netPayableAmount  : 0.00} 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                <div className="col-12 NoPadding checkoutBtn">
                                                {
                                                    this.props.recentCartData.cartBtnDisabled?
                                                    <div className="col-12 NoPadding">
                                                        <button onClick={this.proceedToCheckout.bind(this)} className="col-12 btn globaleCommBtn blockcartCheckout disableBtn" disabled>
                                                            PROCEED TO CHECKOUT
                                                        </button>
                                                    </div>
                                                :
                                                    <div className="col-12 NoPadding">
                                                        <button  className="col-12 btn globaleCommBtn blockcartCheckout" 
                                                            onClick={this.proceedToCheckout.bind(this)}>
                                                            PROCEED TO CHECKOUT
                                                        </button> 
                                                    </div>
                                                }
                                                </div>
                                                <div className="col-12 text-center couponMsg"> Proceed to checkout to apply discount coupon code </div>
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
    // console.log("state in cartProductsdata====",state.data.recentCartData),
    {
      recentCartData: state.data.recentCartData,
    } 
);

const mapDispatchToProps = {
    fetchCartData: getCartData, 
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);