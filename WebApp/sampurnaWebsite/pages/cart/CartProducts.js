import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import Router               from 'next/router'
import { connect }        from 'react-redux';
import {getCartData}          from '../../redux/actions/index.js'; 
import  store                 from '../../redux/store.js'; 
import Message from '../../component/CustomizeBlocks/Message/Message.js';
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
            // taxValue: 0,
            // cartTotal : 0,
            // totalIncludingTax : 0
        }
    }

    async componentDidMount(){
        var websiteModel = localStorage.getItem('websiteModel');
        this.setState({
            websiteModel : websiteModel,
        })
        await this.props.fetchCartData();
        // console.log("fetchCartData===",this.props.recentCartData);
        this.getdiscounteddata(this.state.startRange, this.state.limitRange);
        this.getshippingamount(this.state.startRange, this.state.limitRange);
        this.getTaxmasterData();
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
            console.log('error', error);
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
                console.log('error', error);
            });
    }
    getCartData(){
        const userid = localStorage.getItem('user_ID');
        axios.get("/api/carts/get/cartproductlist/"+userid)
          .then((response)=>{ 
            //   console.log('cartData', response.data);
            this.setState({
                cartData : response.data
            })
          })
          .catch((error)=>{
            console.log('error', error);
          })
    }
    getshippingamount(startRange, limitRange){
        axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
        .then((response) => {
        //   console.log('shippingamount = ', response.data[0].shippingcosting);
          this.setState({
            minvalueshipping: response.data[0].shippingcosting,
          })
        })
        .catch((error) => {
          console.log('error', error);
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
        console.log('error', error);
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
                    console.log('error', error);
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
                        console.log('error', error);
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
                    console.log('error', error);
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
                console.log('error', error);
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
                    console.log('error', error);
                })
            })
            .catch((error) => {
              console.log('error', error);
            })


        

    }
    render(){
        // console.log("this.props.recentCartData[0].cartItems===",this.props.recentCartData[0]);
        return(            
            <div className="container">
                {/* <div>cartdata</div> */}
            <div className="col-12 col-xl-12 cartHeight">
                {/* <Loader type="fullpageloader"/> */}
                <div className="row">
                    <Message messageData={this.state.messageData} />
                    {
                        
                        this.props.recentCartData[0] && this.props.recentCartData[0].cartItems.length>0? 
                        <div className="col-12 col-xl-12 NOpadding" style={{"marginBottom":"20px"}}>
                           <div className="row">  
                            <div className="col-xl-9 col-md-12 col-11 table-responsive cartProduct">
                                <table className="table cartProductTable">
                                    <thead>
                                        <tr>
                                            <th className="itemth">ITEMS</th>
                                            <th>PRICE</th>
                                            <th style={{"textAlign":"center"}}>QUANTITY</th>
                                            { this.state.websiteModel === 'FranchiseModel'? 
                                                <th>TOTAL WEIGHT</th>
                                            :
                                                <th style={{"textAlign":"center"}}>SIZE</th>
                                            }
                                            <th>TOTAL</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {                                            
                                            this.props.recentCartData[0].cartItems.map((data, index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td>
                                                            <div>
                                                               <div className="row">
                                                                <div className="col-12 col-xl-4 col-md-4">
                                                                    <a href={"/product-detail/" + data.productDetail.productUrl + "/" +data.product_ID} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                        <img className="img  cartProductImg col-lg-12 col-md-12 col-sm-12 col-xs-12" src={data.productDetail.productImage[0] ? data.productDetail.productImage[0] : "images/eCommerce/notavailable.jpg"} alt="ProductImg"/>
                                                                    </a>
                                                                </div>
                                                                <div className="col-12 col-xl-8 col-md-8 cartProductDetail">
                                                                    <a href={"/product-detail/" + data.productDetail.productUrl + "/" +data.product_ID}>
                                                                        {data.productDetail.productNameRlang?
                                                                            <h5 className="RegionalFont">{data.productDetail.productNameRlang}</h5>
                                                                        :
                                                                            <h5 className="">{data.productDetail.productName}</h5>
                                                                        }
                                                                    </a>
                                                                {
                                                                    data.productDetail.discountPercent  ?
                                                                        <div className="col-lg-12 col-md-12 NOpadding">
                                                                            <span className="cartOldprice"><i className="fa fa-inr cartOldprice"></i>{data.productDetail.originalPrice}</span> &nbsp; &nbsp;
                                                                            <span className="cartPrice"><i className="fa fa-inr"></i>{data.productDetail.discountedPrice}</span> &nbsp; &nbsp;
                                                                            <span className="cartDiscountPercent">( {Math.floor(data.productDetail.discountPercent)}% Off )</span>
                                                                        </div>
                                                                        :
                                                                        <span className="price"><i className="fa fa-inr"></i>{data.productDetail.originalPrice}</span>
                                                                }

                                                                {/* <div>
                                                                    {data.productDetail.color ? <span className="cartColor">Color : <span style={{backgroundColor : data.productDetail.color, padding: '0px 5px'}}>&nbsp;</span> {ntc.name(data.productDetail.color)[1]}, </span> : null}
                                                                    {data.productDetail.size ? <span className="cartColor">Size : {data.productDetail.size} &nbsp;<span className="CapsUnit">{data.productDetail.unit}</span></span>: null}
                                                                </div> */}
                                                                    <button productid={data.productDetail._id} id={data._id} onClick={this.moveWishlist.bind(this)} className="globalAddToCartBtn btn wishlistBtn">Move to Wishlist</button>
                                                                </div> 
                                                              </div>                                                                 
                                                            </div>
                                                        </td>
                                                        <td className="nowrap ">
                                                        {
                                                            data.productDetail.availableQuantity > 0 ?
                                                                <div >
                                                                    <span id="productPrize" className={"cartProductPrize fa fa-inr"}>&nbsp;{data.productDetail.discountedPrice}</span><br />
                                                                    {/* <span className ="productUnit" id={data.productDetail._id}>Per &nbsp;<span className="CapsUnit">{data.productDetail.size} {data.productDetail.unit}</span></span> */}
                                                                </div>
                                                            :
                                                            <span>-</span>
                                                        }
                                                        </td>
                                                        <td className="nowrap">                                                            
                                                            {
                                                                data.productDetail.availableQuantity > 0 ?
                                                                <div className="quantityWrapper">
                                                                    <span className="minusQuantity fa fa-minus" id={data.productDetail._id} size={data.productDetail.size} unit={data.productDetail.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : data.quantity} onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                    <span className="inputQuantity">{this.state['quantityAdded|'+data._id] ? this.state['quantityAdded|'+data._id] : data.quantity}</span>&nbsp;
                                                                    <span className="plusQuantity fa fa-plus" size={data.productDetail.size} unit={data.productDetail.unit} productid={data.product_ID} id={data.productDetail._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : data.quantity} availablequantity={data.productDetail.availableQuantity}  
                                                                        onClick={this.cartquantityincrease.bind(this)}></span><br/>   
                                                                    { this.state.websiteModel === 'FranchiseModel'?                                                                 
                                                                        <span className ="productUnit" id={data.productDetail._id}> Of {data.productDetail.size}&nbsp;<span className="CapsUnit">{data.productDetail.unit}</span></span>
                                                                    :null
                                                                    }
                                                                </div>
                                                                :
                                                                <span className="sold textAlignCenter">SOLD OUT</span>
                                                            }
                                                        </td>

                                                        <td className="proWeight">  
                                                            { this.state.websiteModel === 'FranchiseModel'? 
                                                               
                                                                <span className="col-lg-12 NoPadding productSize totalWeight">&nbsp;{data.totalWeight} &nbsp;</span> 
                                                            :
                                                                <span style={{"textAlign":"center"}} className="col-lg-12 NoPadding productSize">{data.productDetail.size} &nbsp; 
                                                                    {data.productDetail.size ?<span style={{"textAlign":"center"}} className="col-lg-12 NoPadding CapsUnit">{data.productDetail.unit}</span>:'-'}
                                                                </span>
                                                            }
                                                        </td>
                                                        <td className="nowrap">
                                                        {
                                                            data.productDetail.availableQuantity > 0 ?
                                                                <span className={"cartProductPrize fa fa-inr"}>&nbsp;{data.subTotal}</span>
                                                            :
                                                            <span>-</span>
                                                        }    
                                                        </td>
                                                        <td>
                                                            <span className="fa fa-trash trashIcon" id={data._id} onClick={this.Removefromcart.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                        </td>
                                                    </tr>
                                                );
                                            })                                            
                                        }
                                    </tbody>
                                </table>                                
                            </div>
                            
                            <div className="col-10 col-xl-3 col-md-8 NOpadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cartSummary">
                                    <strong className="cartSummaryTitle">Summary</strong>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="row">
                                            <table className="table table-responsive summaryTable">
                                                <tbody>
                                                    <tr>
                                                        <td>Cart Total</td>
                                                        <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {this.props.recentCartData[0].cartTotal > 0 ? parseInt(this.props.recentCartData[0].cartTotal) : 0.00} </td>
                                                    </tr>
                                                    
                                                    
                                                    <tr>
                                                        <td>Order Total</td>
                                                        <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {this.props.recentCartData[0].total > 0 ? parseInt(this.props.recentCartData[0].total) : 0.00} </td>
                                                    </tr>
                                                    <tr>
                                                        {/* {console.log("this.state.minvalueshipping==>",this.state.minvalueshipping)} */}
                                                     
                                                        <td>Delivery Charges</td>
                                                        
                                                        {/* <td className="textAlignRight saving">&nbsp;{this.state.shippingCharges > 0 ? (this.state.shippingCharges).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Free"} </td> */}
                                                        <td className="textAlignRight saving">&nbsp;{ 
                                                            this.state.minvalueshipping > this.props.recentCartData[0].total ?
                                                                // "This store requires minimum order of Rs."+this.state.minvalueshipping
                                                                // "Make minimum purchase of Rs."+this.state.minvalueshipping+" to checkout your order."
                                                                "No Delivery"
                                                            :  
                                                                "0.00"
                                                            }
                                                        </td>
                                                        
                                                        {/* <td className="textAlignRight saving">&nbsp;{ 
                                                            this.state.minvalueshipping >= this.props.recentCartData[0].total ?
                                                                "Make minimum purchase of Rs."+this.state.minvalueshipping+" to checkout your order."
                                                            :  
                                                                "Free"
                                                            }
                                                        </td> */}
                                                    </tr>
                                                    <tr>
                                                        <td>Discount {this.state.discountin === "Percent"?
                                                                      <span>  ({this.state.discountvalue > 1 ? this.state.discountvalue:null} %) </span>                                                                      
                                                                    :null
                                                                    } 
                                                        </td>                                                        
                                                        {/* <td className="textAlignRight saving">&nbsp; 
                                                            <span>{this.state.discountin === "Amount" ? <i className="fa fa-inr" /> : null} {this.state.discountvalue > 1 ? this.state.discountvalue : "0.00"} {this.state.discountin === "Percent" ? <i className="fa fa-percent" /> : null} </span>
                                                        </td> */}
                                                        <td className="textAlignRight saving">&nbsp; 
                                                        {this.state.discountvalue?
                                                            <span> - &nbsp;
                                                                {this.state.discountin === "Amount" ? 
                                                                    <span>
                                                                        <i className="fa fa-inr" /> 
                                                                        {this.state.discountvalue > 1 ? 
                                                                            this.state.discountvalue 
                                                                        :  Number("0.00")
                                                                        } 
                                                                    </span>
                                                                :   
                                                                    <span> 
                                                                        <i className="fa fa-inr" />                                                                       
                                                                        {this.state.discountvalue > 1 ? 
                                                                           <span> {Math.floor((this.props.recentCartData[0].total > 0 ? parseInt(this.props.recentCartData[0].total) : 0.00) * this.state.discountvalue/100) } </span>
                                                                        :  Number("0.00")
                                                                        } 
                                                                    </span>
                                                                }
                                                            </span>
                                                        :"0.00"}
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
                                                                            Math.round((parseInt(this.props.recentCartData[0].total) - (parseInt(this.props.recentCartData[0].total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                                            :Math.round((parseInt(this.props.recentCartData[0].total) - this.state.discountvalue)*this.state.taxrate/100)
                                                                        : Math.round(parseInt(this.props.recentCartData[0].total)*this.state.taxrate/100)
                                                                    : "0.00"
                                                                    }
                                                                    </span>
                                                                    :"0.00"
                                                                }
                                                                {/* <span>+&nbsp;<i className="fa fa-inr" />
                                                                {this.state.taxValue}
                                                                </span> */}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cartTotal">Grand Total</td>
                                                        {/* <td className="textAlignRight cartTotal">&nbsp; <i className={"fa fa-inr"}></i> {this.props.recentCartData[0].total > 0 ? parseInt(this.props.recentCartData[0].total) : 0.00}</td> */}
                                                        <td className="textAlignRight cartTotal">&nbsp; <i className={"fa fa-inr"}></i>
                                                        {/* {console.log("disscountData===",this.state.discountData)} */}
                                                        {
                                                            Math.round(
                                                                Number( this.props.recentCartData.length > 0 ?
                                                                    this.state.discountdata !== undefined ?
                                                                        this.state.discountin === "Percent" ?                                                                        
                                                                            parseInt(this.props.recentCartData[0].total) - (parseInt(this.props.recentCartData[0].total) * this.state.discountvalue / 100)
                                                                            : parseInt(this.props.recentCartData[0].total) - this.state.discountvalue
                                                                    : parseInt(this.props.recentCartData[0].total)
                                                                 : "0.00"
                                                                )                                                                
                                                                +
                                                                Number( this.state.taxrate>0?  
                                                                    this.props.recentCartData.length > 0 ?
                                                                        this.state.discountdata !== undefined ?
                                                                            this.state.discountin === "Percent" ?
                                                                                
                                                                                Math.round((parseInt(this.props.recentCartData[0].total) - (parseInt(this.props.recentCartData[0].total) * this.state.discountvalue / 100)) * this.state.taxrate/100)
                                                                            :
                                                                                this.state.discountvalue>0?
                                                                                    Math.round((parseInt(this.props.recentCartData[0].total) - this.state.discountvalue)*this.state.taxrate/100) 
                                                                                :"0.00"
                                                                        : 
                                                                            Math.round(parseInt(this.props.recentCartData[0].total)*this.state.taxrate/100) 
                                                                    : 
                                                                        "0.00"
                                                                :0.00
                                                                )
                                                            )
                                                            }                                                       

                                                        {/* {this.state.totalIncludingTax} */}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {
                                        this.state.minvalueshipping?
                                        <div>
                                           { this.state.minvalueshipping <= this.props.recentCartData[0].total  ?
                                            <button onClick={this.proceedToCheckout.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 globaleCommBtn btn cartCheckout">
                                                PROCEED TO CHECKOUT
                                            </button>
                                            :
                                            <button  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn globaleCommBtn blockcartCheckout" disabled>
                                                PROCEED TO CHECKOUT
                                            </button> 
                                            }
                                        </div>
                                        :
                                        <button  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn globaleCommBtn blockcartCheckout">
                                            PROCEED TO CHECKOUT
                                        </button> 

                                    }
                                     {this.state.minvalueshipping <= this.props.recentCartData[0].total  ?
                                        null
                                    :
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mg20">
                                        {/* <span className="minpurchase">Make minimum purchase of Rs.{this.state.minvalueshipping} to checkout your order.</span>&nbsp; */}
                                        <span className="minpurchase">Minimum order should be ₹  {this.state.minvalueshipping} to Checkout & Place Order. 
                                            Add more products worth ₹  {this.state.minvalueshipping - this.props.recentCartData[0].total} to proceed further.</span>
                                    </div>
                                    }
                                </div>
                                
                            </div>
                          </div>  
                        </div>
                        : 
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignCenter">
                          <img className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12" src={"/images/eCommerce/emptycart.png"} alt="" />                          
                        </div>  
                        
                    }
                    
                </div>
            </div>
            </div>
        );
    }
}
const mapStateToProps = state => (
    // console.log("state in cartProductsdata====",state.data),
    {
      recentCartData: state.data.recentCartData,
    } 
);

const mapDispatchToProps = {
    fetchCartData: getCartData, 
  };

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);