import React, { Component } from 'react';
import $            from 'jquery';
import axios        from 'axios';
import Router       from 'next/router';
import Link         from 'next/link';
import { connect }  from 'react-redux';
import ReactTooltip from 'react-tooltip';

import { getCartData, updateCartCount } from '../../../../../redux/actions/index.js';
import store        from '../../../../../redux/store.js';
import Message      from '../Message/Message.js'
import OrderSummury from './OrderSummury.js';
import Style        from './CartProducts.module.css';
import Loader       from '../loader/Loader.js';

class CartProducts extends Component {
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
            "startRange": 0,
            "limitRange": 10,
            quantityAdded: 0,
            totalIndPrice: 0,
            websiteModel: '',
            bannerData: {
                title: "MY SHOPPING CART",
                breadcrumb: 'My Shopping Cart',
                backgroungImage: '/images/cartBanner.png',
            },
            CheckoutBtn: true,
        }
    }

    async componentDidMount() {
        var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
        var userDetails = JSON.parse(localStorage.getItem("userDetails"));
        if (userDetails) {
            this.setState({
                user_ID           : userDetails.user_id,
                authService       : userDetails.authService
            })
        }
        if (sampurnaWebsiteDetails) {
            this.setState({
                websiteModel: sampurnaWebsiteDetails.preferences.websiteModel,
                currency: sampurnaWebsiteDetails.preferences.currency
            })
        }
        if(sampurnaWebsiteDetails.deliveryLocation){
            this.setState({
              "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.latitude,
              "userLongitude" : sampurnaWebsiteDetails.deliveryLocation.longitude,
              "delLocation"   : sampurnaWebsiteDetails.deliveryLocation.address,
            })
          }
       
        await this.props.fetchCartData();

        if (this.props.recentCartData && this.props.recentCartData.vendorOrders) {
            console.log("this.props.recentCartData => ",this.props.recentCartData );
            
            for (let i = 0; i < this.props.recentCartData.vendorOrders.length; i++) {
                if (this.props.recentCartData.vendorOrders[i].vendor_netPayableAmount < this.props.recentCartData.minOrderAmount) {
                    this.setState({
                        CheckoutBtn: false
                    }, () => {
                        // console.log("CheckoutBtn===",this.state.CheckoutBtn)
                    })
                }
                break;
            }
        }
    }

    Removefromcart(event) {
        event.preventDefault();
        const cartitemid = event.target.getAttribute('id');
        const vendorid = event.target.getAttribute('vendorid');
        const formValues = {
            "user_ID": this.state.user_ID,
            "cartItem_ID": cartitemid,
            vendor_ID: vendorid,
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
                    axios.patch("/api/carts/remove", formValues)
                        .then((response) => {
                            if (response) {
                                this.setState({
                                    messageData: {
                                        "type": "outpage",
                                        "icon": "fa fa-check-circle",
                                        "message": response.data.message,
                                        "class": "success",
                                        "autoDismiss": true
                                    }
                                })
                                setTimeout(() => {
                                    this.setState({
                                        messageData: {},
                                    })
                                }, 1500);
                                // this.props.fetchCartData();
                                this.props.updateCartCount();
                            }
                        })
                        .catch((error) => {
                            console.log("error => ", error);
                        })

                } else {
                    swal("Your product is safe!");
                }
            })
    }

    cartquantityincrease(event) {
        event.preventDefault();
        const product_ID = event.target.getAttribute('productid');
        const vendor_id = event.target.getAttribute('vendor_id');
        const quantity = parseInt(event.target.getAttribute('dataquntity'));
        var availableQuantity = parseInt(event.target.getAttribute('availablequantity'));
        const quantityAdded = parseInt(quantity + 1);

        if (this.state.websiteModel === "FranchiseModel") {
            const size = event.target.getAttribute('size');
            const unit = event.target.getAttribute('unit');
            var totalWeight = quantityAdded * size;
            if (unit === "gm") {
                if (totalWeight >= 1000) {
                    totalWeight = totalWeight / 1000;
                    totalWeight = totalWeight + " KG";
                } else {
                    totalWeight = totalWeight + " GM";
                }
            } else {
                totalWeight = totalWeight + " " + unit;
            }
            const formValues = {
                "user_ID": this.state.user_ID,
                "product_ID": product_ID,
                "totalWeight": totalWeight,
                "vendor_ID": vendor_id,
                "quantityAdded": quantityAdded,
            }
            // console.log("formValues====",formValues);  
            axios.patch("/api/carts/quantity", formValues)
                .then((response) => {
                    this.props.fetchCartData();
                })
                .catch((error) => {
                    console.log("error => ", error);
                })

        } else {
            const formValues = {
                "user_ID": this.state.user_ID,
                "product_ID": product_ID,
                "quantityAdded": quantityAdded,
                "totalWeight": totalWeight,
                "vendor_ID": vendor_id,
                "quantityAdded": quantityAdded,
            }
            if (quantityAdded > availableQuantity) {
                this.setState({
                    messageData: {
                        "type": "outpage",
                        "icon": "fa fa-check-circle",
                        "message": "Last " + availableQuantity + " items taken by you",
                        "class": "success",
                        "autoDismiss": true
                    }
                })
                setTimeout(() => {
                    this.setState({
                        messageData: {},
                    })
                }, 1500);
            }
            else {
                // console.log("formValues===",formValues);
                axios.patch("/api/carts/quantity", formValues)
                    .then((response) => {
                        // console.log("increament response=>",response.data);
                        // this.props.fetchCartData();
                    })
                    .catch((error) => {
                        console.log("error => ", error);
                    })
            }
        }
    }

    cartquantitydecrease(event) {
        event.preventDefault();
        const cartitemid = event.target.getAttribute('id');
        const vendor_id = event.target.getAttribute('vendor_id');
        const quantity = parseInt(event.target.getAttribute('dataquntity'));
        const quantityAdded = parseInt(quantity - 1) <= 0 ? 1 : parseInt(quantity - 1);

        const formValues = {
            "user_ID": this.state.user_ID,
            "product_ID": cartitemid,
            "quantityAdded": quantityAdded,
            "vendor_ID": vendor_id,
        }
        // console.log("formValues===",formValues);
        axios.patch("/api/carts/quantity", formValues)
            .then((response) => {
                this.props.fetchCartData();
            })
            .catch((error) => {
                console.log("error => ", error);
            })
    }

    proceedToCheckout(event) {
        event.preventDefault();
        for (let i = 0; i < this.props.recentCartData.vendorOrders.length; i++) {
            // console.log("this.props.recentCartData.vendorOrders[i].cartItems===",this.props.recentCartData.vendorOrders[i].cartItems);
            var soldProducts = this.props.recentCartData.vendorOrders[i].cartItems.filter((a, i) => {
                return a.product_ID.availableQuantity <= 0;
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
            // window.fbq('track', 'InitiateCheckout');
            Router.push('/checkout');
        }
    }

    moveWishlist(event) {
        event.preventDefault();
        const cartitemid = event.target.getAttribute('id');
        const productid = event.target.getAttribute('productid');
        const formValues = {
            "user_ID": this.state.user_ID,
            "cartItem_ID": cartitemid,
        }
        const wishValues = {
            "user_ID": this.state.user_ID,
            "product_ID": productid,
        }
        axios.post('/api/wishlist/post', wishValues)
            .then((response) => {
                axios.patch("/api/carts/remove", formValues)
                    .then((response) => {
                        this.setState({
                            messageData: {
                                "type": "outpage",
                                "icon": "fa fa-check-circle",
                                "message": "Product moved to wishlist successfully.",
                                "class": "success",
                                "autoDismiss": true
                            }
                        })
                        setTimeout(() => {
                            this.setState({
                                messageData: {},
                            })
                        }, 1500);
                        // this.props.fetchCartData();
                    })
                    .catch((error) => {
                        console.log("error => ", error);
                    })
            })
            .catch((error) => {
                console.log("error => ", error);
            })
    }
    addtowishlist(event) {
        event.preventDefault();
        if (this.state.user_ID) {
          var id = event.target.id;
          console.log("vendorId",event.target.getAttribute('vendorid'));
          console.log("vendorLocationId",event.target.getAttribute('vendorLocation_id'));
          var formValues = {
            "user_ID"             : this.state.user_ID,
            "userDelLocation"     : {
                                        "lat"             : this.state.userLongitude, 
                                        "long"            : this.state.userLongitude,
                                        "delLocation"     : this.state.delLocation,
                                    },
            "vendor_id"           : event.target.getAttribute('vendorid'),
            "vendorLocation_id"   : event.target.getAttribute('vendorLocation_id'),
            "product_ID"          : id
        }
          
        //   console.log("inside wishlist==",formValues);
          axios.post('/api/wishlist/post', formValues)
            .then((response) => {
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
              }, 2000);
            //   this.props.fetchCartData();
            })
            .catch((error) => {
              console.log('error', error);
            })
        }
        else {
            this.setState({
              messageData: {
                "type": "outpage",
                "icon": "fa fa-exclamation-circle",
                // "message": "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
                "message" : "Need To Sign In, Please <a data-toggle=modal data-target=#loginFormModal>Sign In</a> First.",          
                "class": "warning",
                "autoDismiss": true
              }
            })
            setTimeout(() => {
              this.setState({
                messageData: {},
              })
            }, 2000);
        }
      }
    
    render() {
        console.log("this.props.recentCartData===",this.props.recentCartData);
        return (
            <div className={"col-12 "+Style.cartHeightWrapper}>
                <div className="col-12  ">
                    <div className="col-12  pl-0">
                        <div className="col-12 cartHeight">
                            <Loader type="fullpageloader" />
                            {/* {this.props.loading 
                            ?
                                <Loader type="fullpageloader" />
                            : */}
                            <div className="row">                                    
                                    <Message messageData={this.state.messageData} />
                                    {
                                        this.props.recentCartData && this.props.recentCartData.vendorOrders && this.props.recentCartData.vendorOrders.length > 0 ?
                                            <div className="col-12 pr-0 " style={{ "marginBottom": "20px" }}>
                                                <div className="col-12">
                                                    <div className="col-12 col-xl-12 col-md-12 table-responsive cartProduct">
                                                        <div className="table">
                                                            <div className="col-12">
                                                                {
                                                                    this.props.recentCartData.vendorOrders.length > 0 && this.props.recentCartData.vendorOrders.map((vendorWiseCartData, index) => {
                                                                        return (
                                                                            <div className={"row " + Style.singleRow} key={index}>
                                                                                <div className={"col-10 offset-1 "+Style.vendorTitle}>
                                                                                    {vendorWiseCartData.vendor_id.companyName}
                                                                                </div>

                                                                                <div className="col-md-12 col-lg-8 col-xl-8 ">
                                                                                    {
                                                                                        vendorWiseCartData.vendor_netPayableAmount < this.props.recentCartData.minOrderAmount 
                                                                                        ?
                                                                                            <div className="col-12 d-none d-lg-block d-xl-block">
                                                                                                <div className={"col-10 mx-5 mb-2 "+Style.vendorWarning}>
                                                                                                    {vendorWiseCartData.vendor_id.companyName},Minimum shopping amount is&nbsp; {this.props.recentCartData.minOrderAmount}
                                                                                                </div>
                                                                                                {/* <div className="col-12 text-center">
                                                                                                    <a href={"/products/" + vendorWiseCartData.vendor_id._id + "/" + vendorWiseCartData.vendorLocation_id + "/supermarket"} className="vendorShoppinglink">To continue shopping click here</a>
                                                                                                </div> */}
                                                                                            </div>
                                                                                        : 
                                                                                            null
                                                                                    }
                                                                                    <div className={"col-12 col-xl-9 " + Style.singleVendorBox}>
                                                                                        <div className="row ">
                                                                                            <div className={"col-6 "+Style.tableHeading}>Product</div>
                                                                                            <div className={"col-3 "+Style.tableHeading}>Quantity</div>
                                                                                            <div className={"col-3 "+Style.tableHeading}>Total Price</div>
                                                                                        </div>

                                                                                        <div className={"col-12 " + Style.cardHeadingWrapper}></div>

                                                                                            {vendorWiseCartData.cartItems.map((vendorData, index) => {
                                                                                            var categoryUrl = (vendorData.product_ID.category ? vendorData.product_ID.category:"").replace(/\s+/g, '-').toLowerCase();                    
                                                                                            var subCategoryUrl = (vendorData.product_ID.subCategory ? vendorData.product_ID.subCategory:"-").replace(/\s+/g, '-').toLowerCase();
                                                                                            return (
                                                                                                <div key={index}>
                                                                                                    <div className="col-12 mt-4">
                                                                                                        <div className={"row mb-4"}>
                                                                                                            <div className="col-6 col-sm-6 col-md-6 col-lg-2 col-xl-2 pl-0">
                                                                                                                <div className="row">
                                                                                                                    <a href={"/product-detail/" + vendorWiseCartData.vendor_id._id + "/" + vendorWiseCartData.vendorLocation_id + "/"+categoryUrl+"/"+subCategoryUrl+"/" + vendorData.product_ID._id}>
                                                                                                                        <img className={"img mt-1 col-12 "+Style.cartProductImg} src={vendorData.product_ID.productImage[0] ? vendorData.product_ID.productImage[0] : "images/eCommerce/notavailable.png"} alt="ProductImg" />
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className={"col-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 cartProductDetail my-3 "+ Style.productDetails}>
                                                                                                                <div className="row">
                                                                                                                    {
                                                                                                                        vendorData.product_ID.brand
                                                                                                                        ?
                                                                                                                            <div className={"col-12 pl-0 pr-0 "+Style.productBrand}>
                                                                                                                                {vendorData.product_ID.brand}
                                                                                                                            </div>           
                                                                                                                        :
                                                                                                                            null
                                                                                                                    }
                                                                                                                    <a href={"/product-detail/" + vendorWiseCartData.vendor_id._id + "/" + vendorWiseCartData.vendorLocation_id + "/"+categoryUrl+"/"+subCategoryUrl+"/" + vendorData.product_ID._id}>
                                                                                                                        {vendorData.product_ID.productNameRlang 
                                                                                                                            ?
                                                                                                                                <div className={"RegionalFont  font-weight-bold" + Style.productName}>
                                                                                                                                    {vendorData.product_ID.productNameRlang}
                                                                                                                                </div>
                                                                                                                            :
                                                                                                                                <div className={" " + Style.productName}>
                                                                                                                                    {vendorData.product_ID.productName}
                                                                                                                                </div>
                                                                                                                        }
                                                                                                                    </a>

                                                                                                                   
                                                                                                                    {/* {
                                                                                                                        vendorData.product_ID.discountPercent ?
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
                                                                                                                    } */}

                                                                                                                    {/* <div className=" NoPadding">
                                                                                                                        <button productid={vendorData.product_ID._id} id={vendorData._id} onClick={this.moveWishlist.bind(this)} className=" btn wishlistBtn">Move To Wishlist</button>
                                                                                                                    </div> */}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="nowrap col-12 col-sm- col-sx-12 col-md-4 col-lg-3 col-xl-2 mb-3 pr-0 ">
                                                                                                                {
                                                                                                                    vendorData.product_ID.availableQuantity > 0 
                                                                                                                    ?
                                                                                                                        <div className={"my-3 pt-1 text-left mx-2 "+Style.quantityWrapper}>
                                                                                                                            <span className=" pr-2 fa fa-minus cartPrice cursor-pointer" id={vendorData.product_ID._id} vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity}
                                                                                                                                onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                                                                                            <span className="">{this.state['quantityAdded|' + vendorData._id] ? this.state['quantityAdded|' + vendorData._id] : vendorData.quantity}</span>&nbsp;
                                                                                                                            <span className={" pr-2 pl-2 fa fa-plus cartPrice "} vendor_id={vendorWiseCartData.vendor_id._id} size={vendorData.product_ID.size} unit={vendorData.product_ID.unit} productid={vendorData.product_ID._id} id={vendorData.product_ID._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : vendorData.quantity} availablequantity={vendorData.product_ID.availableQuantity}
                                                                                                                                onClick={this.cartquantityincrease.bind(this)}></span><br />
                                                                                                                            {this.state.websiteModel === 'FranchiseModel' ?
                                                                                                                                <span className="productUnit" id={vendorData.product_ID._id}> Of {vendorData.product_ID.size}&nbsp;<span className="CapsUnit">{vendorData.product_ID.unit}</span></span>
                                                                                                                                : null
                                                                                                                            }
                                                                                                                        </div>
                                                                                                                    :
                                                                                                                        <span className="sold textAlignCenter">SOLD OUT</span>
                                                                                                                }
                                                                                                            </div>
                                                                                                            <div className="nowrap col-6 col-sm-12 col-sx-12 col-md-4 col-lg-2 col-xl-3 my-3 text-right pl-0 pr-0">
                                                                                                                {
                                                                                                                    vendorData.product_ID.availableQuantity > 0 ?                                                                                                                        
                                                                                                                        <div className="col-12 pl-0 pr-0">
                                                                                                                        {vendorData.product_ID.discountPercent > 0?
                                                                                                                            <div className={"col-12 "+Style.cartProductPrize}> 
                                                                                                                                <span>{this.state.currency}&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                                <span className={Style.oldprice}>
                                                                                                                                    {(vendorData.product_ID.originalPrice.toFixed(2) * vendorData.quantity).toFixed(2)}
                                                                                                                                </span>
                                                                                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                                                <span>
                                                                                                                                    {(vendorData.product_ID.discountedPrice.toFixed(2) * vendorData.quantity).toFixed(2) }
                                                                                                                                </span>

                                                                                                                                {/* <div className={"col-12 NoPadding " +Style.priceWrapper +" " +Style.NoPadding}>
                                                                                                                                    <span className={Style.price}><span className={Style.oldprice }>&nbsp;{this.state.currency} &nbsp;{data.originalPrice}&nbsp;</span>&nbsp;
                                                                                                                                    {this.state.currency} &nbsp;{(data.discountedPrice).toFixed(2)} 
                                                                                                                                    </span>
                                                                                                                                </div> */}
                                                                                                                            </div>
                                                                                                                        :
                                                                                                                            <div className={"col-12 "+Style.cartProductPrize}> 
                                                                                                                                {this.state.currency} &nbsp;&nbsp; { (vendorData.product_ID.originalPrice.toFixed(2) * vendorData.quantity).toFixed(2)}
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                        </div>
                                                                                                                        
                                                                                                                        :
                                                                                                                        <span>-</span>
                                                                                                                }
                                                                                                            </div>
                                                                                                            <div className="col-6 col-sm-12 col-xs-12 col-md-4 col-lg-1 col-xl-1 text-center my-3 ">
                                                                                                                {vendorData.product_ID.isWish===true?
                                                                                                                    <span className={"fa fa-heart "+Style.cartWishlistRed}
                                                                                                                          id={vendorData.product_ID._id}
                                                                                                                          vendorid={vendorWiseCartData.vendor_id._id} 
                                                                                                                          vendorLocation_id={vendorWiseCartData.vendorLocation_id} 
                                                                                                                          onClick={this.addtowishlist.bind(this)}>
                                                                                                                    </span>
                                                                                                                :
                                                                                                                    <span className={"far fa-heart "+Style.cartWishlist}
                                                                                                                          id={vendorData.product_ID._id} 
                                                                                                                          vendorid={vendorWiseCartData.vendor_id._id} 
                                                                                                                          vendorLocation_id={vendorWiseCartData.vendorLocation_id} 
                                                                                                                          onClick={this.addtowishlist.bind(this)}>
                                                                                                                    </span>
                                                                                                                }
                                                                                                                <br/><br/>
                                                                                                                <span className={"fa fa-trash "+Style.trashIcon} 
                                                                                                                      id={vendorData._id} 
                                                                                                                      vendorid={vendorWiseCartData.vendor_id._id} 
                                                                                                                      onClick={this.Removefromcart.bind(this)}>
                                                                                                                        <a href="/" style={{ color: "#337ab7" }} > </a>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                        }
                                                                                        <div className="col-12">
                                                                                            <Link href={"/products/" + vendorWiseCartData.vendor_id._id + "/" + vendorWiseCartData.vendorLocation_id + "/supermarket"}>
                                                                                                <a className={"shoppingLink " + Style.shopping}><i className="fa fa-arrow-left"></i>&nbsp;Continue Shopping</a>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </div>                                                                                   
                                                                                </div>

                                                                                <div className="col-lg-4 col-xl-4 pull-right">
                                                                                    <div className={"col-12 "+ Style.summaryClass + " " + vendorWiseCartData.invalidOrder}>
                                                                                        <table className="table table-responsive summaryTable">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td className={"col-7 "+ Style.vendorWiseinnerTitle}>Sub Total</td>
                                                                                                    <td className={"col-5 "+Style.tdCartWrapper}>
                                                                                                        <div className={Style.currency}><b>{this.state.currency}</b></div>  
                                                                                                        <div className={Style.amount}>
                                                                                                            <b> {
                                                                                                                    vendorWiseCartData.vendor_afterDiscountTotal > 0 
                                                                                                                    ? vendorWiseCartData.vendor_afterDiscountTotal.toFixed(2) 
                                                                                                                    : "00.00"
                                                                                                                } 
                                                                                                            </b>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td className={"col-7 "+ Style.vendorWiseinnerTitle}>You Saved</td>
                                                                                                    <td className={"col-5 "+Style.tdCartWrapper}>
                                                                                                    <div className={Style.currency+" "+Style.savingaMTcOLOR}><b>{this.state.currency}</b></div>
                                                                                                    <div className={Style.amount+" "+Style.savingaMTcOLOR}>
                                                                                                        <b> 
                                                                                                            {vendorWiseCartData.vendor_discountAmount > 0 
                                                                                                             ? 
                                                                                                                vendorWiseCartData.vendor_discountAmount < 10
                                                                                                                ?
                                                                                                                    "0" + vendorWiseCartData.vendor_discountAmount.toFixed(2) 
                                                                                                                : 
                                                                                                                    vendorWiseCartData.vendor_discountAmount.toFixed(2)
                                                                                                             : 
                                                                                                                "00.00"
                                                                                                            }
                                                                                                        </b>
                                                                                                    </div>
                                                                                                    </td>
                                                                                                </tr>                                                        
                                                                                                <tr>
                                                                                                    <td className={"col-7 "+ Style.vendorWiseinnerTitle}>VAT</td>  
                                                                                                    <td className={"col-5 "+Style.tdCartWrapper}>
                                                                                                    <div className={Style.currency}><b>{this.state.currency}</b></div> 
                                                                                                    <div className={Style.amount}><b> {vendorWiseCartData.vendor_taxAmount>0 ? vendorWiseCartData.vendor_taxAmount.toFixed(2) : "00.00"}</b></div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr >
                                                                                                    <span className={"col-12 "+ Style.cartTotalLineWrapper}></span>
                                                                                                    
                                                                                                </tr>
                                                                                                <tr>
                                                                                                <td className="cartTotal"> <b>Totals</b> </td>
                                                                                                    <td className={"col-5 "+Style.tdCartWrapper}>
                                                                                                    <div className={Style.currency}><b>{this.state.currency}</b></div> 
                                                                                                    <div className={Style.amount}><b> {vendorWiseCartData.vendor_netPayableAmount.toFixed(2)}</b></div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
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
                                                                    <div className="col-12 col-sm-8 mx-auto col-sx-12 offset-md-2 col-md-8 offset-lg-1 col-lg-4 col-xl-4 NoPadding">
                                                                        <div className={"col-12  " + Style.cartSummary1}>
                                                                            <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                                                <div className="row">
                                                                                    <div className={"col-8 " + Style.cartInnerTitleWrapper}>Total Amount</div>
                                                                                    <div className={"col-4  " + Style.cartInnerTitleWrapper1}>
                                                                                        <div className={Style.summeryCurrency}>{this.state.currency}</div> 
                                                                                        <div className={Style.summeryAmount}>{this.props.recentCartData.paymentDetails.afterDiscountTotal > 0 ? this.props.recentCartData.paymentDetails.afterDiscountTotal.toFixed(2) : "0.00"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                                                <div className="row">
                                                                                    <div className={"col-8 " + Style.cartInnerTitleWrapper}>Total Saved</div>
                                                                                    <div className={"col-4  " + Style.cartInnerTitleWrapper1}>
                                                                                        <div className={Style.summeryCurrency+" "+Style.savingaMTcOLOR}>{this.state.currency}</div> 
                                                                                        <div className={Style.summeryAmount+" "+Style.savingaMTcOLOR}>{this.props.recentCartData.paymentDetails.discountAmount > 0 ? this.props.recentCartData.paymentDetails.discountAmount.toFixed(2) : "0.00"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                                                <div className="row">
                                                                                    <div className={"col-8 " + Style.cartInnerTitleWrapper}>Total VAT</div>
                                                                                    <div className={"col-4  " + Style.cartInnerTitleWrapper1}>
                                                                                        <div className={Style.summeryCurrency}>{this.state.currency}</div> 
                                                                                        <div className={Style.summeryAmount}>{this.props.recentCartData.paymentDetails.taxAmount > 0 ? this.props.recentCartData.paymentDetails.taxAmount.toFixed(2) : "0.00"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 totalAmounts mb-2 pull-right font-weight-bold">
                                                                                <div className="row">
                                                                                    <div className={"col-8 " + Style.cartInnerTitleWrapper}>Total Delivery Charges
                                                                                    </div>
                                                                                    <div className={"col-4  " + Style.cartInnerTitleWrapper1}>
                                                                                        <div className={Style.summeryCurrency}>{this.state.currency}</div>
                                                                                        <div className={Style.summeryAmount}>
                                                                                            {this.props.recentCartData.paymentDetails.shippingCharges > 0 ? this.props.recentCartData.paymentDetails.shippingCharges.toFixed(2) : "0.00"}
                                                                                        </div>
                                                                                        <a data-tip data-for="vendorTooltip">
                                                                                            <i className={"fa fa-info-circle  " + Style.infoCircle}></i>
                                                                                        </a>
                                                                                    </div>
                                                                                        {/* <a data-tip data-for="vendorTooltip">
                                                                                            <i className={"fa fa-info-circle  " + Style.infoCircle}></i>
                                                                                        </a> */}
                                                                                        <ReactTooltip id="vendorTooltip" className={"pb-2 pt-2 " + Style.tooltipWrapper} place="left" effect="solid">
                                                                                            {this.props.recentCartData.vendorOrders.length > 0 && this.props.recentCartData.vendorOrders.map((vendorWiseCartData, index) => {
                                                                                                // console.log("this.props.recentCartData.vendorOrders.length===",this.props.recentCartData.vendorOrders.length);
                                                                                                return (
                                                                                                    <div className={"row mb-2 text-left  container pt-4  " + Style.tooltipVendorCharges} key={index}>
                                                                                                        <div className={"col-12 text-left " + Style.vendorNameTooltip}><h5 className={"font-weight-bold "+ Style.vendorNameTooltipAlign}>{vendorWiseCartData.vendorName}</h5></div>
                                                                                                        <div className="container">
                                                                                                            <div className="row">
                                                                                                                <div className="col-6 text-left">Delivery Charges&nbsp; :</div>
                                                                                                                {vendorWiseCartData.vendor_shippingChargesAfterDiscount === vendorWiseCartData.vendor_shippingCharges?
                                                                                                                    <div className="col-6 text-right NoPadding font-weight-bold "> &nbsp;{vendorWiseCartData.vendor_shippingCharges} &nbsp;{this.state.currency}</div>
                                                                                                                :
                                                                                                                <div className="col-6 text-right NoPadding font-weight-bold "> &nbsp;<span className={Style.regularShippingCharge}>{vendorWiseCartData.vendor_shippingCharges}&nbsp;{this.state.currency}</span>&nbsp;<span>{vendorWiseCartData.vendor_shippingChargesAfterDiscount}</span> &nbsp;{this.state.currency}</div>
                                                                                                                }
                                                                                                            </div>
                                                                                                            <div className="row">
                                                                                                                <div className={"col-6 text-left " + Style.cartInnerTitleWrapper4}>Total Delivery Charges :</div>
                                                                                                                <div className={"col-6 text-right NoPadding font-weight-bold "+ Style.cartInnerTitleWrapperHidden1 }>{this.props.recentCartData.paymentDetails.shippingCharges}&nbsp; {this.state.currency}</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                            }
                                                                                           
                                                                                        </ReactTooltip>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 pull-right">
                                                                                <div className="row">
                                                                                    <div className={"col-7 " + Style.cartInnerTitleWrapperOfGrandTotal}>
                                                                                        Grand Total
                                                                                    </div>
                                                                                    <div className={"col-5 " + Style.cartInnerCurrencyWrapper1}>
                                                                                        <div className={Style.summeryTotCurrency}>{this.state.currency}</div>
                                                                                        <div className={Style.summeryTotAmount}>{this.props.recentCartData.paymentDetails.netPayableAmount > 0 ? this.props.recentCartData.paymentDetails.netPayableAmount.toFixed(2) : "0.00"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="container-flex">
                                                                            <div className={"col-12 NoPadding"}>
                                                                                {
                                                                                    this.props.recentCartData.cartBtnDisabled 
                                                                                    ?
                                                                                        <div className="col-12 NoPadding">
                                                                                            <button onClick={this.proceedToCheckout.bind(this)} className={"col-12 btn  blockcartCheckout disableBtn " + Style.checkoutBtn} disabled>
                                                                                                PROCEED TO CHECKOUT
                                                                                            </button>
                                                                                        </div>
                                                                                    :

                                                                                        <div className="col-12 NoPadding">
                                                                                            <button className={"col-12 btn checkoutBtn blockcartCheckout " + Style.checkoutBtn}
                                                                                                onClick={this.proceedToCheckout.bind(this)}>
                                                                                                Proceed to Checkout
                                                                                            </button>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                            <div className="row"><div className={"col-12 text-center mx-2 my-2 " + Style.discMsgColor}> Proceed to checkout to add discount coupon</div></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="col-12  textAlignCenter my-5 my-lg-0">
                                                {/* <img className={"col-12 col-md-4 col-sm-6 "} src={"/images/eCommerce/emptycart.png"} alt="" /> */}
                                                <img                                           
                                                src={"/images/eCommerce/emptycart.png"}
                                                alt="ProductImg" 
                                                className={"img-responsive  "+Style.emptycartImageWrapper}
                                               
                                                
                                                layout={'intrinsic'}
                                                />
                                                <h2 className={Style.cartEmptyTitle}>Your cart is empty!</h2>
                                                <a href="/" className={Style.cartEmptySubTitle}>
                                                    <span><img src={"/images/eCommerce/back.svg"} className={Style.cartEmptyBackIcon}/></span>
                                                    Continue shopping
                                                </a>
                                            </div>
                                    }


                                </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
const mapStateToProps = state => (
    // console.log("state in cartProductsdata====", state.data),
    {
        recentCartData: state.data.recentCartData,
        loading: state.data.loading
    }
);

const mapDispatchToProps = {
    fetchCartData: getCartData,
    updateCartCount: updateCartCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartProducts);