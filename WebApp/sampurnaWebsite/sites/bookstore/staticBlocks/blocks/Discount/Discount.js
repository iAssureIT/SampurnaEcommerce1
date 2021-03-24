import React, { Component } from 'react';
// import $                    from 'jquery';
// import axios                from 'axios';
import "../../../sites/currentSite/blocks/Discount.css";

class Discount extends Component{
    render(){
        return(
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpaddingLeft">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 discount">
                    <h5>DISCOUNT CODE</h5>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border"></div>
                    <input placeholder="Enter your coupon code..." type="text" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 discountInput" />
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border"></div>
                    <button className="btn btn-warning applyBtn">APPLY COUPON</button>
                </div>
            </div>
        );
    }
}
export default Discount;