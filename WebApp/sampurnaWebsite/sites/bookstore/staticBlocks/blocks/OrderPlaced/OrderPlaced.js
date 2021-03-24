import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import "../../../sites/currentSite/blocks/OrderPlaced.css";
import axios from 'axios';

class OrderPlaced extends Component{
    constructor(props) {
        super(props);
        this.state={
            bannerData : {
                title : "ORDER PLACED SUCCESSFULLY",
                breadcrumb : 'My Shopping Cart',
                backgroungImage : '/images/cartBanner.png',
            },
            orderDetails: {}
        }
    }
    componentDidMount(){
        this.getOrderDetail();
    }
    getOrderDetail(){
        var orderID = this.props.match.params.order_ID;
        console.log('orderID', orderID);
        axios.get("/api/orders/get/one/"+orderID )
        .then((response)=>{
            this.setState({
                orderDetails : response.data
            },()=>{
                console.log('orderDetails', this.state.orderDetails)
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    render(){
        return(
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 mt25 mb25">
                <p>Your order number is: {this.state.orderDetails.orderID}</p>
                <p>We'll email you an order confirmation with details and tracking info</p>
                <a href="/" className="btn btn-warning cs CSBTn">Continue Shopping</a>
            </div>
        )
    }
}

export default withRouter(OrderPlaced);