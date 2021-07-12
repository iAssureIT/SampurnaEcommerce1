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
		<div className="container-fluid DisplayLocation ">
      <div className="col-12 NoPadding">
			<div  className="col-12 NoPadding" >
          
          {
            this.props.sampurnaWebsiteDetails
            ?
              this.props.sampurnaWebsiteDetails.deliveryLocation
              ?
                <span className="row">
                  <span className="col-10 ml-2 mt-1 deliveryAddress"> 
                  <i className="fa fa-globe"></i> &nbsp; <b>
                  Your current location is - </b><span className="locationText ">{this.props.sampurnaWebsiteDetails.deliveryLocation.address}</span></span>  
                  <div className="col-2 changelocationBtn1Wrapper">
                    <button type="button" className="pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true" >Change Location &nbsp;&nbsp;<i className="fa fa-map-marker" aria-hidden="true"></i></button>
                  </div>
                </span>
              :
                <span className="row">
                  <span className=" col-10 deliveryAddress"> <i className="fa fa-globe"></i> &nbsp; Your Delivery Location is not available </span>  
                  <button type="button" className="col-2 pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true" >Select Your Delivery Location</button>  
                </span>
            :
              <span className="row">
                <span className=" col-10 deliveryAddress"> <i className="fa fa-globe"></i> &nbsp; Your Delivery Location is not available </span>  
                <button type="button" className="col-2 pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true" >Select Your Delivery Location</button>  
              </span>
          }     
      </div>  
    </div>
    </div>
    );
  }
}


const mapStateToProps = state => (
  // console.log("1. state in location====",state.data),
  {
    sampurnaWebsiteDetails : state.data.sampurnaWebsiteDetails
  });

export default connect(mapStateToProps)(DisplayLocation);

