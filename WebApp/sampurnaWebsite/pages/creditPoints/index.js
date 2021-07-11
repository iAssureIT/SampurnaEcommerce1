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
                    currency      : sampurnaWebsiteDetails.preferences.currency,
				},()=>{
                    this.getCreditData();
				})
            }
        }
        
    }
    getCreditData(){
        // console.log("this.state.user_ID=",this.state.user_ID);
        axios.get('/api/creditpoints/get/'+this.state.user_ID)
        .then( (creditRes)=>{
            // console.log("credit response==",creditRes);
            if(creditRes){
                // console.log("credit response==",creditRes);
                this.setState({
                    creditdata : creditRes.data
                },()=>{
                    // console.log("creditdata=",this.state.creditdata);
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
                <div className={"col-12 NoPadding pt-5 "+Style.creditWrapper}>
                    <div className={"col-12 "+Style.creditHeader}>
                        <div className="row">
                            <div className="col-6 text-left">Total Points</div>
                            <div className="col-6 text-right">{this.state.creditdata&&this.state.creditdata.totalPoints}&nbsp; points</div>
                        </div>
                        <div className="row">
                            <div className="col-6 text-left">Currunt Balance</div>
                            <div className="col-6 text-right">{this.state.currency}&nbsp;{this.state.creditdata&&this.state.creditdata.totalPoinsValue}&nbsp;</div>
                        </div>
                    </div>
                    {this.state.creditdata && this.state.creditdata.transactions && this.state.creditdata.transactions.length>0
                    ?
                    <div className={"col-12 "+Style.creditHeaderBottom}>
                    <table className="table table-borderless orderTable">
                        <thead>
                            <tr>
                                <th className="text-center">Transaction Date</th>
                                <th className="text-center">Transaction Details</th>
                                <th className="text-center">Credit Points</th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.creditdata.transactions && this.state.creditdata.transactions.length>0 && this.state.creditdata.transactions.map((data,index)=>{
                                // console.log("credit data===",this.state.creditdata.transactions);
                                return(
                                    data &&
                                    <tr key={index}>
                                        <td className="text-center">{data.transactionDate ? moment(data.transactionDate).format('MM/DD/YYYY'):null}</td>
                                        <td className="text-center">
                                            
                                            <div ><b>{data.typeOfTransaction}</b></div>
                                            <div >Order ID - {data.orderID}</div>
                                            <div >Expiry Date - {moment(data.expiryDate).format('MM/DD/YYYY')}</div>
                                        </td>
                                        
                                        <td className="text-center">{data.earnedPoints}</td>
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