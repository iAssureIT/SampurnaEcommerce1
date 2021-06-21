import React, { Component } from 'react';
import $                    from 'jquery';
import Router               from 'next/router';
import axios                from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                from './index.module.css';
import moment               from "moment";


class CreditPoints extends Component{
    
    constructor(props) {
        super(props);
        this.state={
            addressId :'',
        }
    }

    componentDidMount(){
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            if(userDetails.user_id){
				this.setState({
					user_ID :  userDetails.user_id,
					userLongitude : userDetails.userLatitude,
					userLongitude : userDetails.userLongitude,
				},()=>{
                    this.getCreditData();
				})
            }
        }
        
    }
    getCreditData(){
        axios.get('/api/creditpoints/get/'+this.state.user_ID)
        .then( (creditRes)=>{
            if(creditRes){
                console.log("credit response==",creditRes);
                this.setState({
                    creditdata : creditRes.data
                },()=>{
                    console.log("creditdata=",this.state.creditdata);
                })
            }
        })
        .catch((error)=>{
          console.log("account page getCredit error = ",error);
        });
    }
    render(){
        return(
            <div className={ "col-10 offset-1 NoPadding accountMainWrapper pb-4 "+Style.accountMainWrapper}> 
                <div className={"col-12 NoPadding mt-4"+Style.creditWrapper}>
                    <div className={"col-12 "+Style.creditHeader}>
                        <div className="row">
                            <div className="col-6 text-left">Total Points</div>
                            <div className="col-6 text-right">{this.state.currency}&nbsp;{this.state.creditdata&&this.state.creditdata.totalPoints}</div>
                        </div>
                    </div>
                    {this.state.creditdata && this.state.creditdata.transactions.length>0
                    ?
                    <div className="col-12">
                    <table className="table table-borderless orderTable">
                        <thead>
                            <tr>
                                <th className="">Order ID</th>
                                <th className="">Start Date</th>
                                <th className="">End Date</th>
                                <th className="">Credit Points</th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.creditdata.transactions.map((data,index)=>{
                                return(
                                    <tr>
                                        {/* <div className={"col-12 pb-4 pt-4 " +Style.creditRow}>
                                            <div className="row">
                                                <div className="col-4">{data.orderID}</div>
                                                <div className="col-4">{data.earnedPoints}</div>
                                            </div>
                                        </div> */}
                                        <td className="">{data.orderID}</td>
                                        <td className="">{moment(data.orderDate).format('MM/DD/YYYY')}</td>
                                        <td className="">{moment(data.orderDate).format('MM/DD/YYYY')}</td>
                                        <td className="">{data.earnedPoints}</td>
                                    </tr>
                                )}
                                )
                            }
                        </tbody>
                    </table>
                    </div>
                    :
                    <div className="col-12">Your Wallet is empty</div>
                 }
                    
               </div>
            </div>
        )
    }
}

export default CreditPoints;