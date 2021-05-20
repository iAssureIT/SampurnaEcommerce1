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

class DisplayLocation extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
            address : ""
		}; 
    }
    componentDidMount(){       
        // geolocation.getCurrentPosition();
       var SEuserData = JSON.parse(localStorage.getItem('SEuserData','SEuserData'));
    //    console.log("display SEuserData===",SEuserData);
       if(SEuserData){
        this.setState({
            "address"        : SEuserData.address,
            "country"        : SEuserData.country, 
        });
    } 
    }
    
   render() {
    return (
		<div className="container-fluid DisplayLocation ">
			<div  className="col-12" >
                <i className="fas fa-globe"></i>
                <span className="deliveryAddress">&nbsp; Your current location is - {this.state.address +", " +this.state.country}</span>  
                <button type="button" className="btn btn-outline-primary pull-right cangelocationBtn" data-toggle="modal" data-target="#locationModal" data-backdrop="true" >Change location</button>  
            </div>  
            <DeliveryLocationPopup/>          
        </div>
    );
  }
}


export default DisplayLocation;
