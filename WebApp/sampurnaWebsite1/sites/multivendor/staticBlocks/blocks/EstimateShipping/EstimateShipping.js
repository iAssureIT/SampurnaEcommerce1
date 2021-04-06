import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import "../../../sites/currentSite/blocks/EstimateShipping.css";

class EstimateShipping extends Component{
    render(){
        return(
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpaddingRight">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 estimate">
                    <h5>ESTIMATE SHIPPING AND TAX</h5>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 border"></div>
                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Country</label>
                    <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <option>United State</option>
                        <option>India</option>
                        <option>Turkey</option>
                    </select>
                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">State/Province</label>
                    <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <option>Maharashtra</option>
                        <option>India</option>
                        <option>Turkey</option>
                    </select>
                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">State/Province</label>
                    <input type="text" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" />
                    <input type="radio" name="rate" value="Fixed $0.00"/> &nbsp;
                    <label>Flat Rate</label>
                    <br/>
                    <input type="radio" name="rate" value="Table Rate $0.00"/> &nbsp;   
                    <label>Best Way</label>    
                            
                </div>
            </div>
        );
    }
}
export default EstimateShipping;