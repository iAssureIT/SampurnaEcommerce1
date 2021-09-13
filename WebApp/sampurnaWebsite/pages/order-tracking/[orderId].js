import React, { Component } from 'react';
import axios                from 'axios';
import GoogleMapReact       from 'google-map-react';
import Marker               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Marker.js';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
// import Style                from './index.module.css';
import Style                from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/location.module.css';

const mapStyles = {
    width   : '100%',
    height  : '60%'
};

class OrderTracking extends Component{
	constructor(props){
    	super(props);
		this.state = {
			"orderData"		: {},
			googleapiKey  : "",
            userDetails   : "",
            latLongValues : {},
            zoom          : 15,
            mapOpacity    : 0.5,
			latLongDetails: {
				lat: 25.1169625,
				lng : 55.3911833,
			}
		};
	}

	componentDidMount(){
    	var pageUrl 	= window.location.pathname;
    	let a 			= pageUrl ? pageUrl.split('/') : "";
    	const urlParam 	= a[2];

		axios.get("/api/projectSettings/get/GOOGLE",)
		.then((response) => {
			if(response.data){         
				this.setState({
					"googleapiKey" : response.data.googleapikey,
				})
			}
		})
		.catch((error) =>{
			console.log(error)
		})  

		if(urlParam){
			this.setState({
				orderID : urlParam
			},async()=>{
				if(this.state.orderID){
					await axios.get("/api/orders/get/one/" + this.state.orderID)
								.then((response) => {
									this.setState({
										orderData: response.data,
									})
								})
								.catch((error) => {
									console.log('order id error', error);
								})
				}
			})
		}
	}
	
	render(){
		return(
			<div className="col-12">
        		<div className="row">
        			<Header />
					<div className={"col-12 mt-4 mb-4 NoPadding googlemap "+Style.height550+" "+Style.googleMap}>   
						{
							this.state.latLongDetails
							?
								<div className={Style.heightGoogleMap}>
									<GoogleMapReact
										bootstrapURLKeys    = {{ key: this.state.googleapiKey }}
										defaultCenter       = {this.state.latLongDetails}
										defaultZoom         = {this.state.zoom}
										getOpacity          = {this.state.mapOpacity}
										style               = {mapStyles}
									>
										<Marker
											lat     = {this.state.latLongDetails.lat}
											lng     = {this.state.latLongDetails.lng}
											text    = "A"
										/>
									</GoogleMapReact>
								</div>
							:
								null
						}
					</div> 
        			<Footer />
		        </div>
        	</div>
    	);
  	}
}

export default OrderTracking;