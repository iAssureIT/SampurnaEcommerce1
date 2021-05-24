import React     from 'react';
import axios     from 'axios';
import {connect} from 'react-redux';
import dynamic   from 'next/dynamic'
import getConfig from 'next/config';
import Head      from 'next/head';
import Router    from 'next/router';
import Link      from 'next/link';
import swal      from 'sweetalert';
import $         from 'jquery'
import  store    from '../../../../../redux/store.js';
import {setDeliveryLocation,setSampurnaWebsiteDetails }     from '../../../../../redux/actions/index.js'; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Geocode   from "react-geocode"; 


class DeliveryLocationPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
            address : "",
            googleapiKey : "",
		}; 
    }
    componentDidMount(){   
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

        if(this.props.homeFirstVisit){
            $('#locationModal').modal('show');   
        }
    }

    takeCurrentLocation(){
        var that=this;
                console.log("google api key ===",that.state.googleapiKey);
                Geocode.setApiKey(that.state.googleapiKey);

                 // set response language. Defaults to english.
                Geocode.setLanguage('en');

                // set response region. Its optional.
                // A Geocoding request with region=es (Spain) will return the Spanish city.
                // Geocode.setRegion("es");

                // set location_type filter . Its optional.
                // google geocoder returns more that one address for given lat/lng.
                // In some case we need one address as response for which google itself provides a location_type filter.
                // So we can easily parse the result for fetching address components
                // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
                // And according to the below google docs in description, ROOFTOP param returns the most accurate result.
                Geocode.setLocationType("ROOFTOP");

                // Enable or disable logs. Its optional.
                Geocode.enableDebug();        

                navigator.geolocation.getCurrentPosition(function(position) {
                    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
                    .then((response) => {
                            const address = response.results[0].formatted_address;
                            var deliveryLocation = {
                                "address"        : response.results[0].formatted_address,
                                "city"           : response.results[0].city,
                                "area"           : response.results[0].area,
                                "district"       : response.results[0].district,
                                "pincode"        : response.results[0].pincode,
                                "country"        : response.results[0].country,
                                "stateCode"      : response.results[0].stateCode,
                                "countryCode"    : response.results[0].countryCode,
                                "latitude"       : position.coords.latitude,
                                "longitude"      : position.coords.longitude,
                                "homeFirstVisit" : false,
                            }
                            if(that.props.sampurnaWebsiteDetails){
                                var sampurnaWebsiteDetails = that.props.sampurnaWebsiteDetails;
                                sampurnaWebsiteDetails = {...sampurnaWebsiteDetails, "deliveryLocation" : deliveryLocation};
                                // console.log("** sampurnaWebsiteDetails = ", sampurnaWebsiteDetails) ;
                            }else{
                                var sampurnaWebsiteDetails = { "deliveryLocation" : deliveryLocation }
                            }

                            localStorage.setItem('sampurnaWebsiteDetails',JSON.stringify(sampurnaWebsiteDetails));           
                            store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)); 
                            that.setState({ address: deliveryLocation.address });                              
                        },
                        (error) => {
                            console.error(error);
                        }
                    );
                });
 
    }

    // closeModal(event){        
    //     $('#locationModal').modal('hide'); 
    // }

    saveLocation(event) {
        event.preventDefault();

        var deliveryLocation = {
            "address"        : this.state.address,
            "city"           : this.state.city,
            "area"           : this.state.area,
            "district"       : this.state.district,
            "pincode"        : this.state.pincode,
            "country"        : this.state.country,
            "stateCode"      : this.state.stateCode,
            "countryCode"    : this.state.countryCode,
            "latitude"       : this.state.latitude,
            "longitude"      : this.state.longitude,
            "homeFirstVisit" : false,
        }
        if(this.props.sampurnaWebsiteDetails){
            var sampurnaWebsiteDetails = this.props.sampurnaWebsiteDetails;
            sampurnaWebsiteDetails = {...sampurnaWebsiteDetails, "deliveryLocation" : deliveryLocation};
        }else{
            var sampurnaWebsiteDetails = { "deliveryLocation" : deliveryLocation }
        }
        
        localStorage.setItem('sampurnaWebsiteDetails',JSON.stringify(sampurnaWebsiteDetails));   
        store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails));
        
        $('#locationModal').modal('hide'); 
        
        console.log("** sampurnaWebsiteDetails = ", sampurnaWebsiteDetails) ;
    }

    handleChangePlaces = address => {
        this.setState({ address: address });
    };
    handleSelect = address => {
        geocodeByAddress(address)
            .then((results) => {
                if (results) {
                    // console.log("result ===",results);
                    for (var i = 0; i < results[0].address_components.length; i++) {
                        for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                            switch (results[0].address_components[i].types[b]) {
                                case 'sublocality_level_1':
                                    var area = results[0].address_components[i].long_name;
                                    // console.log("area===",area);
                                    break;
                                case 'sublocality_level_2':
                                    area = results[0].address_components[i].long_name;
                                    break;
                                case 'locality':
                                    var city = results[0].address_components[i].long_name;
                                    // console.log("area===",city);
                                    break;
                                case 'administrative_area_level_1':
                                    var state = results[0].address_components[i].long_name;
                                    var stateCode = results[0].address_components[i].short_name;
                                    break;
                                case 'administrative_area_level_2':
                                    var district = results[0].address_components[i].long_name;
                                    break;
                                case 'country':
                                    var country = results[0].address_components[i].long_name;
                                    var countryCode = results[0].address_components[i].short_name;
                                    break;
                                case 'postal_code':
                                    var pincode = results[0].address_components[i].long_name;
                                    // this.checkPincode(pincode);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    this.setState({
                        address :results[0].formatted_address,
                        area: area,
                        city: city,
                        district: district,
                        state: state,
                        country: country,
                        pincode: pincode,
                        stateCode: stateCode,
                        countryCode: countryCode
                    })
                    console.log("setstate on select:", this.state.address);
                }

            })
            .catch(error => console.error('Error', error));

        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                this.setState({ 'latitude': lat });
                this.setState({ 'longitude': lng });
                // console.log('Successfully got latitude and longitude', { lat, lng });
            });
        this.setState({ addressLine1: address });
    }; //end google api   
    
   render() {
       const ref = React.createRef();
    return (
		<div className="col-12 NoPadding DeliveryLocation ">
			<div id="locationModal" className="modal in"  data-keyboard="false" >
				<div className="modal-dialog" >                                        
					<div className="modal-content " style={{'background': '#fff'}}>                            
                        <div className="modal-body">  
                        <div className="modal-header">
                            <h6 className="modal-title">Your Delivery Location</h6>
                            {/* <button type="button" className="close pull-right" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button> */}
                        </div>                            
                        <div className="col-12 NoPadding loginForm mobileViewNoPadding">
                            <form className="deliveryForm">
                                <div className="col-12 NoPadding">
                                    <PlacesAutocomplete 
                                        value={this.state.address}
                                        onChange={this.handleChangePlaces}
                                        onSelect={this.handleSelect}
                                        highlightFirstSuggestion={true}>
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                                <label className=" mt-2 "> Search Location </label>
                                                <input
                                                    {...getInputProps({
                                                        placeholder: 'Start typing & select location from dropdown suggestions...',
                                                        className: 'location-search-input form-control col-12 locationSearch',
                                                        id: "address",
                                                        name: "address",
                                                        required: true
                                                    })}
                                                    
                                                />
                                                {/* <div className="errorMsg">{this.state.errors.address}</div> */}
                                                <div className="autocomplete-dropdown-container SearchListContainer">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? 'suggestion-item--active'
                                                            : 'suggestion-item';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                    style,
                                                                })}
                                                            >
                                                                <span>{suggestion.description}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            )}
                                    </PlacesAutocomplete>
                                </div>
                                {/* <div className="errorMsg">{this.state.errors.address}</div> */}
                                <div className="col-12 currentLocationBlock">
                                    <div className="text-center orText">OR</div>
                                    <div className="col-6 offset-3 detectLocationBtn">
                                        <button type="button" className="btn btn-outline-primary pull-center cangelocationBtn" onClick={this.takeCurrentLocation.bind(this)}>Deliver to my Current Location</button>
                                    </div>
                                </div>

                                <button type="button" className="btn btn-outline-primary pull-right cangelocationBtn" onClick={this.saveLocation.bind(this)}>Save & Close</button>

                            </form>

                        </div>                                                     
                        </div>
					</div>
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
  
  const mapDispatchToProps = {    
    setSampurnaWebsiteDetails : setSampurnaWebsiteDetails,    
  };
  
  
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryLocationPopup);

