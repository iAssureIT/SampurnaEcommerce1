import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Router                 from 'next/router';
import Link                   from 'next/link';
import { connect }            from 'react-redux';
import {getCartData,updateCartCount}          from '../../redux/actions/index.js'; 
import  store                 from '../../redux/store.js'; 
import Message                from '../../Themes/Sampurna/blocks/StaticBlocks/Message/Message.js'
import OrderSummury           from './OrderSummury.js';
import Style                  from './CartProducts.module.css';
import ReactTooltip           from 'react-tooltip';

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
                        // console.log("CheckoutBtn===",this.state.CheckoutBtn)
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
        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to removed this product?",
            icon: "warning",
            dangerMode: true,
            buttons: true,
          })
          .then(willDelete => {
            if (willDelete) {
                axios.patch("/api/carts/remove" ,formValues)
                .then((response)=>{
                    if(response){
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
                        this.props.updateCartCount();
                    }
                })
                .catch((error)=>{
                    console.log("error => ",error);
                })
      
            }else{
              swal("Your product is safe!");
            }
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
        // console.log("this.props.recentCartData===",this.props.recentCartData);
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
                                        // console.log("vendorWiseCartData==",vendorWiseCartData);
                                            return( 
                                                <div className={"row " +Style.singleRow} key={index}>
                                                    <div className="col-12 mt-2 mb-3 mx-2"><b>{vendorWiseCartData.vendor_id.companyName}</b></div>

                                                    <div className="col-12 col-sm-12 col-sx-12 col-md-12 col-lg-8 col-xl-8 ">
                                                        <div className={"col-12 " +Style.singleVendorBox}>
                                                            <div className="row ">
                                                                <div className="col-6 font-weight-bold text-left">Product</div>
                                                                <div className="col-2 font-weight-bold">Quantity</div>
                                                                <div className="col-3 font-weight-bold text-center">Total Price</div>
                                                            </div>
                                                            <div className={"col-12 pt-1 "+Style.cardHeadingWrapper}></div>

                               
                                                           
                                                        { vendorWiseCartData.cartItems.map((vendorData, index)=>{
                                                        return(
                                                            <div key={index}>
                                                                <div className="col-12">
                                                                    
                                                                    <div className={"row mb-4 "}>
                                                                        <div className="col-12 col-sm-12 col-sx-12 col-md-6 col-lg-2 col-xl-2 ForMobile">
                                                                            <div className="row">
                                                                            <a href={"/product-detail/" + vendorWiseCartData.vendor_id._id + "/"+vendorWiseCartData.vendorLocation_id +"/" +vendorData.product_ID._id}>
                                                                                <img className="img mt-1 cartProductImg col-12" src={vendorData.product_ID.productImage[0] ? vendorData.product_ID.productImage[0] : "images/eCommerce/notavailable.jpg"} alt="ProductImg"/>
                                                                            </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-12 col-sx-12 col-md-6 col-lg-4 col-xl-4 cartProductDetail my-4">
                                                                        <div className="row">
                                                                            <a href={"/product-detail/" + vendorWiseCartData.vendor_id._id + "/"+vendorWiseCartData.vendorLocation_id +"/" +vendorData.product_ID._id}>
                                                                                {vendorData.product_ID.productNameRlang?
                                                                                    <div className={"RegionalFont  font-weight-bold" +Style.productName}>{vendorData.product_ID.productNameRlang}</div>
                                                                                :
                                                                                    <div className={" " +Style.productName }>{vendorData.product_ID.productName}</div>
                                                                                }
                                                                            </a>
                                                                        {
                                                                            vendorData.product_ID.discountPercent  ?
                                                                                <div className="col-12 NoPadding">
                                                                                    <span className="cartOldprice">{this.state.currency}&nbsp;{vendorData.product_ID.originalPrice.toFixed(2)}</span> &nbsp; &nbsp;
                                                                                    <span className="cartPrice">{this.state.currency}&nbsp;{vendorData.product_ID.discountedPrice.toFixed(2)}</span> &nbsp; &nbsp;
                                                                                    <span className="cartDiscountPercent">( {Math.floor(vendorData.product_ID.discountPercent)}% Off )</span>
                                                                                </div>
                                                                                :
                                                                                <div className="col-12 NoPadding">
                                                                                    <span className="price">
                                                                                    {this.state.currency}&nbsp;{vendorData.product_ID.originalPrice.toFixed(2)}</span>
                                                                                </div>
                                                                            }

                                                                            {/* <div className=" NoPadding">
                                                                                <button productid={vendorData.product_ID._id} id={vendorData._id} onClick={this.moveWishlist.bind(this)} className=" btn wishlistBtn">Move To Wishlist</button>
                                                                            </div> */}
                                                                            </div>
                                                                        </div> 

                                                                        <div className="nowrap col-12 col-sm-12 col-sx-12 col-md-4 col-lg-3 col-xl-2 mb-3 ">                                                         
                                                                        {
                                                                            vendorData.product_ID.availableQuantity > 0 ?
                                                                            <div className="quantityWrapper my-4 pt-1 text-left mx-2">
                                                                                <span className=" pr-2 fa fa-minus cartPrice cursor-pointer" id={vendorData.product_ID._id} vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} 
                                                                                    onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                                <span className="">{this.state['quantityAdded|'+vendorData._id] ? this.state['quantityAdded|'+vendorData._id] : vendorData.quantity}</span>&nbsp;
                                                                                <span className={" pr-2 pl-2 fa fa-plus cartPrice "} vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} productid={vendorData.product_ID._id} id={vendorData.product_ID._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} availablequantity={vendorData.product_ID.availableQuantity}  
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
                                                                        <div className="nowrap col-6 col-sm-12 col-sx-12 col-md-4 col-lg-2 col-xl-3 my-4 text-center ">
                                                                        {
                                                                            vendorData.product_ID.availableQuantity > 0 ?
                                                                                <span className={"cartProductPrize "}> {this.state.currency}&nbsp;{vendorData.product_ID.discountPercent>0?vendorData.product_ID.discountedPrice.toFixed(2) * vendorData.quantity :vendorData.product_ID.originalPrice.toFixed(2) * vendorData.quantity}</span>
                                                                            :
                                                                            <span>-</span>
                                                                        }    
                                                                        </div>
                                                                        <div className="col-6 col-sm-12 col-sx-12 col-md-4 col-lg-1 col-xl-1 text-center my-4 ">
                                                                            <span className="fa fa-trash trashIcon" id={vendorData._id} vendorid={vendorWiseCartData.vendor_id._id} onClick={this.Removefromcart.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                                        </div>
                                                                    </div> 
                                                                </div>
                                                      
                                                            </div>  
                                                        );
                                                        })
                                                    }
                                                <div className="col-12">
                                                    <Link href={"/products/"+vendorWiseCartData.vendor_id._id+"/"+vendorWiseCartData.vendorLocation_id+"/supermarket"}>
                                                        <a className={"shoppingLink " +Style.shopping}><i class="fa fa-arrow-left"></i>&nbsp;Continue Shopping</a>
                                                    </Link>
                                                </div>
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
                                                        {/* <strong className="cartSummaryTitle ">{vendorWiseCartData.vendor_id.companyName}&nbsp;Order Summary</strong> */}
                                                            {/* < OrderSummury  vendorWiseCartData= {vendorWiseCartData} /> */}                                            
                                                        <table className="table table-responsive summaryTable">
                                                            <tbody>
                                                                <tr>
                                                                    <td>Sub Total</td>
                                                                    <td className={"col-6 "+Style.tdCartWrapper}>
                                                                    <span className="col-3 pr-0"><b>{this.state.currency}</b></span><span className="col-3 pl-0"><b> {vendorWiseCartData.vendor_afterDiscountTotal > 0 ? vendorWiseCartData.vendor_afterDiscountTotal : "0.00"} </b></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>You Saved</td>
                                                                    {/* <td className="textAlignRight saving">&nbsp; 
                                                                    <b>{this.state.currency}  {vendorWiseCartData.vendor_discountAmount > 0 ? vendorWiseCartData.vendor_discountAmount.toFixed(2) : 0.00}</b> </td> */}
                                                                    <td className={"col-6 "+Style.tdCartWrapper}>
                                                                    <span className="col-3 pr-0"><b>{this.state.currency}</b></span><span className={"col-3 pl-0 "+Style.savingaMTcOLOR}><b> {vendorWiseCartData.vendor_discountAmount > 0 ? vendorWiseCartData.vendor_discountAmount.toFixed(2) : "0.00"}</b></span>
                                                                    </td>
                                                                </tr>                                                        
                                                                <tr>
                                                                    <td>Tax</td>  
                                                                    {/* <td className="textAlignRight ">&nbsp; 
                                                                        <span> <b>{this.state.currency}  {vendorWiseCartData.vendor_taxAmount}</b></span>
                                                                    </td> */}
                                                                    <td className={"col-6 "+Style.tdCartWrapper}>
                                                                    <span className="col-3 pr-0"><b>{this.state.currency}</b></span><span className="col-3 pl-0"><b> {vendorWiseCartData.vendor_taxAmount>0 ? vendorWiseCartData.vendor_taxAmount.toFixed(2) : "0.00"}</b></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="cartTotal"> <b>Totals</b> </td>
                                                                    {/* <td className="textAlignRight cartTotal">&nbsp; 
                                                                    <b>{this.state.currency}  {vendorWiseCartData.vendor_netPayableAmount}</b>
                                                                    </td> */}
                                                                    <td className={"col-6 "+Style.tdCartWrapper}>
                                                                    <span className="col-3 pr-0"><b>{this.state.currency}</b></span><span className="col-3 pl-0"><b> {vendorWiseCartData.vendor_netPayableAmount}</b></span>
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
                                              
                                            </div>
                                            <div className="col-12 col-sm-12 col-sx-12 offset-md-2 col-md-8 offset-lg-1 col-lg-3 offset-xl-1 col-xl-3 NoPadding">
                                                <div className={"col-12  " +Style.cartSummary1}>
                                                    <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                        <div className="row">
                                                            <div className={"col-7 "+Style.cartInnerTitleWrapper}>Final Total Amount</div>
                                                            <div className={"col-5 "+Style.cartInnerTitleWrapper1}>
                                                            <span className="col-1 px-1">{this.state.currency}</span><span className="col-3 p-0">{this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? parseInt(this.props.recentCartData.paymentDetails.netPayableAmount) : "0.00"}</span>  </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                        <div className="row">
                                                            <div className={"col-7 "+Style.cartInnerTitleWrapper}>Total Savings</div>
                                                            <div className={"col-5 "+Style.cartInnerTitleWrapper1}>
                                                            <span className="col-1 px-1">{this.state.currency}</span><span className="col-3 p-0">{ this.props.recentCartData.paymentDetails.discountAmount>0?this.props.recentCartData.paymentDetails.discountAmount : "0.00"}</span> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                        <div className="row">
                                                            <div className={"col-7 "+Style.cartInnerTitleWrapper}>Total Tax</div>
                                                            <div className={"col-5 "+Style.cartInnerTitleWrapper1}> 
                                                            <span className="col-1 px-1">{this.state.currency}</span><span className="col-3 p-0">{ this.props.recentCartData.paymentDetails.taxAmount>0 ? this.props.recentCartData.paymentDetails.taxAmount : "0.00"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                        <div className="row">
                                                            <div className={"col-7 "+Style.cartInnerTitleWrapper}>Total Delivery Charges 
                                                            </div>
                                                            <div className={"col-5 "+Style.cartInnerTitleWrapper1}> 
                                                            <span className="col-1 px-1">{this.state.currency}</span><span className="col-3 p-0">{ this.props.recentCartData.paymentDetails.shippingCharges>0 ? (this.props.recentCartData.paymentDetails.shippingCharges).toFixed(2) : "0.00"}</span> 
                                                                
                                                                <a data-tip data-for="vendorTooltip">
                                                                    <i className={"fa fa-info-circle  "+Style.infoCircle}></i>
                                                                </a>
                                                                <ReactTooltip id="vendorTooltip" className={"pb-2 pt-2 " +Style.tooltipWrapper} place="left" effect="solid">
                                                                {this.props.recentCartData.vendorOrders.length>0 && this.props.recentCartData.vendorOrders.map((vendorWiseCartData,index) =>{ 
                                                                    // console.log("this.props.recentCartData.vendorOrders.length===",this.props.recentCartData.vendorOrders.length);
                                                                        return(
                                                                            <div className={"row mb-2 text-left font-weight-bold container pt-4  " +Style.tooltipVendorCharges} key={index}>
                                                                                <div className={"col-12 text-left " +Style.vendorNameTooltip}><h5 className="font-weight-bold">{vendorWiseCartData.vendorName}</h5></div>
                                                                                {/* <div className="col-12 ">
                                                                                    <span className="col-5 text-left NoPadding">Delivery Charges </span> 
                                                                                    <span className="col-1">:</span>
                                                                                    <span className="col-6 text-right NoPadding"> {vendorWiseCartData.vendor_shippingCharges} &nbsp;{this.state.currency}</span>
                                                                                </div> */}
                                                                                <div className="container">
                                                                                    <div className="row">
                                                                                    <div className="col-6 text-left">Delivery Charges&nbsp; :</div>
                                                                                    <div className="col-6 text-right NoPadding font-weight-bold "> &nbsp;{vendorWiseCartData.vendor_shippingCharges} &nbsp;{this.state.currency}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                        })
                                                                    }
                                                                    
                                                                        <div className="container pb-4">
                                                                        <div className="row">
                                                                          <div className={"col-6 text-left "+Style.cartInnerTitleWrapper4}>Total Delivery Charges&nbsp; :</div>&nbsp;&nbsp;
                                                                          <div className="col-5 text-right NoPadding font-weight-bold ">&nbsp;&nbsp;&nbsp;{this.props.recentCartData.paymentDetails.shippingCharges} &nbsp;{this.state.currency}</div>
                                                                        </div>
                                                                       </div>
                                                                    
                                                                </ReactTooltip>
                                                                <div>
                                                                

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 totalAmountsG mb-3 mt-2 pull-right">
                                                        <div className="row font-weight-bold">
                                                        <div className={"col-7 "+Style.cartInnerTitleWrapper}><h5 className="font-weight-bold"><strong>Grand Total</strong></h5></div>
                                                            <div className={"col-5 pl-0"}> 
                                                            <span className="col-1 px-1">{this.state.currency}</span><span className="col-3 p-0">{this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? this.props.recentCartData.paymentDetails.netPayableAmount  : "0.00"}</span> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                <div className="col-12 NoPadding mx-2    checkoutBtn">
                                                {
                                                    this.props.recentCartData.cartBtnDisabled?
                                                    <div className="col-12 NoPadding">
                                                        <button onClick={this.proceedToCheckout.bind(this)} className={"col-12 btn  blockcartCheckout disableBtn " +Style.checkoutBtn} disabled>
                                                            PROCEED TO CHECKOUT
                                                        </button>
                                                    </div>
                                                :
                                                    <div className="row">
                                                        <button  className={"col-12 btn checkoutBtn blockcartCheckout " +Style.checkoutBtn}
                                                            onClick={this.proceedToCheckout.bind(this)}>
                                                            PROCEED TO CHECKOUT
                                                        </button> 
                                                    </div>
                                                }
                                                </div>
                                               <div className="row"><div className={"col-12 text-center mx-2 my-2 "+Style.discMsgColor}> Proceed to checkout to add discount coupon</div></div> 
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
    updateCartCount  : updateCartCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);