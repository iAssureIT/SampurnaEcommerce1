import React, { Component } from 'react';
import $                    from 'jquery';
import Router               from 'next/router';
import axios                from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                  from './index.module.css';


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
                    this.getUserData();
				})
            }
        }
        
    }
    getUserData(){
        axios.get('/api/users/get/id/'+this.state.user_ID)
        .then( (res)=>{
            // $('.fullpageloader').hide();
            if(res){
                if(res){
                    // console.log("address response==",res);
                    this.setState({
                        firstName       : res.data.profile.firstname,
                        lastName        : res.data.profile.lastname,
                        fullName        : res.data.profile.fullName,
                        emailId         : res.data.profile.email,
                        mobileNumber    : res.data.profile.mobile,
                        name            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].name : "",
                        deliveryAddressID : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0]._id : "",
                        addressLine1    : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].addressLine1 : "",
                        addressLine2    : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].addressLine2 : "",
                        block           : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].block : "",
                        district        : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].district : "",
                        city            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].city : "",
                        pincode         : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].pincode : "",
                        state           : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].state : "",
                        country         : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].country : "",
                        type            : res.data.deliveryAddress.length > 0 ? res.data.deliveryAddress[0].type : "",
                        profileImage    : res.data.profile.profileImage
                    },()=>{
                        // console.log("this.state.addressLine1=",this.state.addressLine1);
                    })
                }
                
            }
        })
        .catch((error)=>{
          console.log("account page getuser error = ",error);
        });
    }
    render(){
        return(
            <div className={ "col-10 offset-1 NoPadding accountMainWrapper pb-4 "+Style.accountMainWrapper}> 
                <div className={"col-12 NoPadding mt-4"+Style.creditWrapper}>
                    <div className={"col-12 "+Style.creditHeader}>
                        <div className="row">
                                <div className="col-6 text-left">Total Points</div>
                                <div className="col-6 text-right">Total Points</div>
                        </div>
                    </div>
                    <div className={"col-12 pb-4 pt-4 " +Style.creditRow}>
                        <div className="row">
                            <div className="col-4">142543541</div>
                            <div className="col-4">AED 25</div>
                        </div>
                    </div>
               </div>
            </div>
        )
    }
}

export default CreditPoints;