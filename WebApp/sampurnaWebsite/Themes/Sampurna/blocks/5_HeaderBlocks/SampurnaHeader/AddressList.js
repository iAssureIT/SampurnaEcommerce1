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

  }  
   render() {
    //  console.log("User Address list =>",this.props.userAddress);
    return (
		<div className="col-12 NoPadding ">
        <div className="col-12 NoPadding addressTitle pb-2 ">Shipping Address List</div>
        {this.props.userAddress && this.props.userAddress.length>=0?
            this.props.userAddress.map((data,index)=>{
                return(
                    <div className="col-12 NoPadding mb-4 singleAddressBlock">
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
                        <span className="myAddress"><b>{data.addType.split('(')[0]} Address&nbsp;</b> <br />                       
                        {data.addressLine2}, {data.addressLine1},
                        </span>
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

