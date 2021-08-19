import React     from 'react';
import axios     from 'axios';
import {connect} from 'react-redux';
import dynamic   from 'next/dynamic'
import getConfig from 'next/config';
import Head      from 'next/head';
import Router    from 'next/router';
import Link      from 'next/link';
import swal      from 'sweetalert';
import store             from '../../../../../redux/store.js';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {updateCartCount,setSampurnaWebsiteDetails }    from '../../../../../redux/actions/index.js'; 

class DisplayLocation extends React.Component{

	constructor(props){
		super(props);
		this.state = { 
            "address" : "",
            "country" : ""
		}; 
	}

	async componentDidMount(){       
    	var sampurnaWebsiteDetails = "";

		if(this.props.sampurnaWebsiteDetails){
			if(this.props.sampurnaWebsiteDetails.deliveryLocation){
				sampurnaWebsiteDetails = await Promise.resolve(this.props.sampurnaWebsiteDetails);
			}else{
				sampurnaWebsiteDetails = await Promise.resolve(JSON.parse(localStorage.getItem("sampurnaWebsiteDetails")));
			}
	    }
	}
	checkCart(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
			if(userDetails){
				this.setState({
					user_id : userDetails.user_id
				})
				// console.log("userDetails==",userDetails);
			}
		if(this.props.cartCount !== 0){ 
			swal({
				title: "Are you sure?",
				text: "You have added products in cart. If you change the location, cart will get empty.Still you want to change the location?",
				icon: "warning",
				dangerMode: true,
				buttons: true,
			})
				.then(willDelete => {
					if (willDelete) {
						axios.delete('/api/carts/delete/'+this.state.user_id)
						.then(res=>{
							if(res){
								// this.props.updateCartCount();
								// this.props.cartCount;
								window.location.reload();
							}
						})
						.catch((error) => {
							console.log("error => ", error);
						})
					} else {
						swal("Your cart is safe!");
					}
				})
		}
	}

	render(){
		return(
			<div className="container-fluid DisplayLocation mobileNoPadding">
				<div className="col-12">
					<div className="row" >
            			{
							this.props.sampurnaWebsiteDetails
							?
								this.props.sampurnaWebsiteDetails.deliveryLocation
								?
									<div className="col-12 mobileNoPadding ">
										<div className="col-12 mobileNoPadding">
											<span className="col-12 col-sm-9 col-lg-10 col-xl-10 mt-1 deliveryAddress">
												<b>Your current location is - </b><span className="locationText ">{this.props.sampurnaWebsiteDetails.deliveryLocation.address}</span>
											</span>
											<div className="col-8 col-sm-3 col-lg-2 col-xl-2 pull-right changelocationBtn1Wrapper">
												<button type="button" onClick={this.checkCart.bind(this)} className="pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true">
													Change Location &nbsp;&nbsp;<i className="fas fa-map-marker-alt" aria-hidden="true"></i>
												</button>
											</div>
										</div>
									</div>
								:
								<div className="col-12 mobileNoPadding ">
								<div className="col-12 mobileNoPadding">
									<span className="col-12 col-sm-9 col-lg-10 col-xl-10 mt-1 deliveryAddress">
										<b>Your Delivery Location is not available - </b>
									</span>
									<div className="col-8 col-sm-3 col-lg-2 col-xl-2 pull-right changelocationBtn1Wrapper">
									        <button type="button" className="pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true">
												Change Location &nbsp;<img src="/images/eCommerce/locationHome.svg" alt="ChangeLocationButton"></img>
											</button>
									</div>
								</div>
							</div>
							:
							<div className="col-12 mobileNoPadding ">
							<div className="col-12 mobileNoPadding">
								<span className="col-12 col-sm-9 col-lg-10 col-xl-10 mt-1 deliveryAddress">
									<b>Your Delivery Location is not available - </b>
								</span>
								<div className="col-8 col-sm-3 col-lg-2 col-xl-2 pull-right changelocationBtn1Wrapper">
										<button type="button" className="pull-right changelocationBtn1" data-toggle="modal" data-target="#locationModal" data-backdrop="true">
											Change Location &nbsp;<img src="/images/eCommerce/locationHome.svg" alt="ChangeLocationButton"></img>
										</button>
								</div>
							</div>
						</div>
						}     
					</div>  
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
    sampurnaWebsiteDetails : state.data.sampurnaWebsiteDetails,
	cartCount              : state.data.cartCount,
});
const mapDispatchToProps = {    
	setSampurnaWebsiteDetails : setSampurnaWebsiteDetails,  
	updateCartCount  : updateCartCount,  
};

export default connect(mapStateToProps)(DisplayLocation);