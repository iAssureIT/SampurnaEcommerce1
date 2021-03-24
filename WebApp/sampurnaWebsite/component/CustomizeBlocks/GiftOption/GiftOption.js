import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import "../../../sites/currentSite/blocks/GiftOption.css";

class GiftOption extends Component{
    constructor(props){
        super(props);
        this.state = {
            showForm : false 
        }
    }
    giftForm(event){
        event.preventDefault();
        this.setState({
            showForm : this.state.showForm==false ? true : false
        })
    }
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 giftOption">
                                <h5 onClick={this.giftForm.bind(this)}>Gift Options <i className={"fa fa-"+(this.state.showForm == true ? "angle-up" : "angle-down")}></i></h5>
                                {
                                    this.state.showForm == true ? 
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label>Gift Message (optional)</label>
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding giftOptionForm">
                                                <label className="col-lg-4 col-md-4 col-sm-12 col-xs-12">To:</label>
                                                <input type="text" className="col-lg-8 col-md-8 col-sm-12 col-xs-12" />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding giftOptionForm">
                                                <label className="col-lg-4 col-md-4 col-sm-12 col-xs-12">From:</label>
                                                <input type="text" className="col-lg-8 col-md-8 col-sm-12 col-xs-12" />
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding giftOptionForm">
                                                <label className="col-lg-4 col-md-4 col-sm-12 col-xs-12">Message:</label>
                                                <textarea rows="4" cols="50" className="col-lg-8 col-md-8 col-sm-12 col-xs-12"></textarea>
                                            </div>
                                            <div className="col-lg-2 col-lg-offset-8 col-md-2 col-md-offset-8 col-sm-6 col-xs-6">
                                                <button className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-warning gitOptionBtn">Cancel</button>
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 NOpaddingRight">
                                                <button className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-warning gitOptionBtn">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default GiftOption;