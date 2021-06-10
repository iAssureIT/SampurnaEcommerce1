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
  getAddress(event){
      event.preventDefault();
      this.setState({
          latitude  : event.target.getAttribute('latitude'),
          longitude : event.target.getAttribute('longitude'),
      })
  }
   render() {
    //  console.log("User Address list =>",this.props.userAddress);
    return (
		<div className="col-12 NoPadding ">
        <div className="col-12 NoPadding addressTitle pb-2 ">Shipping Address List</div>
        {this.props.userAddress && this.props.userAddress.length>=0?
            this.props.userAddress.map((data,index)=>{
                // console.log("address data==",data);
                return(
                    <div className="col-12 NoPadding mb-4 singleAddressBlock" key={index}>
                        <input type="radio" checked={data._id} value={data._id} 
                            onChange={()=>{
                                this.setState({
                                    latitude : data.latitude,
                                    longitude : data.longitude
                                })
                            }}
                            latitude={data.latitude} longitude={data.longitude}
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

