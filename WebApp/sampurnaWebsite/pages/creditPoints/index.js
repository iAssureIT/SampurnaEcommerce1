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
            <div className={ "col-lg-9 float-lg-left col-12 NoPadding accountMainWrapper pb-4 mt-4 "+Style.accountMainWrapper}> 
              <div className="col-12">
                      <h4 className={"table-caption mb-2 "+Style.creditPointTitleWrapper}>My Credit Points</h4>
                  </div>
                <div className={"col-12  pt-5  "+Style.creditWrapper}>
                    <div className={"col-12 "+Style.creditHeader}>
                        <div className="row">
                            <div className={"col-4 px-lg-5 text-lg-left text-center "+Style.CreditTotalPtTitle}>Total Points</div>
                            <div className="col-4 text-left"></div>

                            <div className={"col-4 px-lg-5 text-lg-right text-center "+Style.CreditDataPtTitle}>{this.state.creditdata&&this.state.creditdata.totalPoints} Points</div>
                        </div>
                        <div className="row">
                            <div className={"col-4 px-lg-5 text-lg-left text-center "+Style.CreditCurrentBalTitle}>Current Balance</div>
                            <div className="col-4 text-left"></div>
                            <div className={"col-4 px-lg-5 text-lg-right text-center "+Style.CreditTotalBalTitle}>{this.state.currency}&nbsp;{this.state.creditdata && this.state.creditdata.totalPointsValue}&nbsp;</div>
                        </div>
                    </div>
                    {this.state.creditdata && this.state.creditdata.transactions && this.state.creditdata.transactions.length>0
                    ?
                    <div className={"col-12 pl-0 pr-0 "+Style.creditHeaderBottom}>
                    <table className="table table-borderless orderTable">
                        <thead className="d-none">
                            <tr>
                                <th className="text-center">Transaction Date</th>
                                <th className="text-center">Transaction Details</th>
                                <th className="text-center">Credit Points</th>
                            </tr>
                        </thead>
                        <div className="container-flex">
                            {this.state.creditdata.transactions && this.state.creditdata.transactions.length>0 && this.state.creditdata.transactions.map((data,index)=>{
                                // console.log("credit data===",this.state.creditdata.transactions);
                                return(
                                    data &&
                                    <div className={"col-12 mt-4 py-2 "+ Style.CreditPointInnerBox}key={index}>
                                        <div className="row">
                                        <div className={"col-4 px-lg-5 my-auto text-lg-left text-center "+Style.CreditCurrentBalTitle1}>{data.transactionDate ? moment(data.transactionDate).format('MM/DD/YYYY'):null}</div>
                                        <div className="col-4 px-lg-5 text-lg-left text-center">
                                            
                                            <div className={" "+Style.CreditCurrentBalTitle1}><b>{data.typeOfTransaction}</b></div>
                                            <div className={" "+Style.CreditCurrentBalTitle2}>[Order ID - {data.orderID}]</div>
                                            <div className={" "+Style.CreditCurrentBalTitle2}>[Expiry Date]  [{moment(data.expiryDate).format('MM/DD/YYYY')}]</div>
                                        </div>
                                        
                                        <div className={"col-4 my-auto px-lg-5 text-lg-right text-center "+Style.CreditEarnedBalTitle1}>+{data.earnedPoints}</div>
                                    </div>
                                    </div> 
                                )}
                                )
                            }
                        </div>
                    </table>
                    </div>
                    :
                    <div className="col-12 text-center my-auto">Your Wallet is empty</div>
                 }
                    
               </div>
            </div>
        )
    }
}

export default CreditPoints;