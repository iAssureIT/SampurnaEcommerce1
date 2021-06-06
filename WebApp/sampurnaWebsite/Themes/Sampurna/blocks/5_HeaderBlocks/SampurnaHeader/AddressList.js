import React     from 'react';
import axios     from 'axios';
import {connect} from 'react-redux';
import dynamic   from 'next/dynamic'
import getConfig from 'next/config';
import Head      from 'next/head';
import Router    from 'next/router';
import Link      from 'next/link';
import swal      from 'sweetalert';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import DeliveryLocationPopup from './DeliveryLocationPopup.js';

class AddresssList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
            "address" : "",
            "country" : ""
		}; 
  }

  async componentDidMount(){       
    //======  Check if you already have delivery location stored in localstorage  ======
    var sampurnaWebsiteDetails = "";

    if(this.props.sampurnaWebsiteDetails){
      if(this.props.sampurnaWebsiteDetails.deliveryLocation){
        sampurnaWebsiteDetails = await Promise.resolve(this.props.sampurnaWebsiteDetails);
      }else{
        sampurnaWebsiteDetails = await Promise.resolve(JSON.parse(localStorage.getItem("sampurnaWebsiteDetails")));
      }
      // console.log("1. DisplayLoc - LSsampurnaWebsiteDetails = ", this.props.sampurnaWebsiteDetails.deliveryLocation);  
    }

  }
    
   render() {
    return (
		<div className="row">
        Address list
        {this.state.userAddress && this.state.userAddress.length>=0?
            this.state.userAddress.map((data,index)=>{
                return(
                    <div className="col-12">
                        <input type="radio" checked={this.state.addressId === data._id} value={data._id} 
                            onChange={(e)=>{
                            this.setState({ 
                                "addressId": e.target.value,
                            },()=>{
                                console.log("e.target.value===",e.target.value);
                                console.log("addressId===",this.state.addressId);
                            })
                            }}
                            name="checkoutAddess" pincode={data.pincode}  required className="codRadio"/>
                        <span className="checkoutADDCss"><b>{data.addType} Address&nbsp;</b> <br />
                        <span className="checkoutADDCss">Name : {data.name}.</span> <br />
                        {data.addressLine2}, {data.addressLine1},
                        Pincode - {data.pincode}. <br />
                        Email: {data.email} <br />Mobile: {data.mobileNumber} <br /><br /></span>
                    </div>
                )
            })
            :null
        }
        <div></div>
    </div>
    );
  }
}


const mapStateToProps = state => (
  {
    sampurnaWebsiteDetails : state.data.sampurnaWebsiteDetails
  });

export default connect(mapStateToProps)(AddresssList);

