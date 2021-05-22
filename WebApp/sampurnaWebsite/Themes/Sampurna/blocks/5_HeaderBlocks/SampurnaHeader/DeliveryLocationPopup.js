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
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Geocode   from "react-geocode"; 
class DeliveryLocationPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
            address : "",
		}; 
    }
    componentDidMount(){   
        console.log("homeFirstVist",this.props.homeFirstVisit)
        if(this.props.homeFirstVisit){
            $('#locationModal').modal('show');   
        }
        var locationData = JSON.parse(localStorage.getItem('SEuserData',locationData));  
        if(locationData){
            this.setState({
                "address" : locationData.address,
            });
        }
    }

    takeCurrentLocation(){
        var that =this;
        Geocode.setApiKey("AIzaSyC2Ubr7BFRt1rjOU9XajVBNRUV5w8VLe0k");
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                (response) => {
                    const address = response.results[0].formatted_address;
                    console.log(address);
                    that.setAddress(address);
                },
                (error) => {
                  console.error(error);
                }
            );
        });
    }

    setAddress(address){
        this.setState({
            address : address
        });
    }

    saveLocation(event) {
        event.preventDefault();
       var SEuserData = {
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
        // console.log("SEuserData===",SEuserData);
        localStorage.setItem("SEuserData", JSON.stringify(SEuserData));

        var locationData = JSON.parse(localStorage.getItem('SEuserData',locationData));  
        this.setState({
            "address" : locationData.address,
        });
        $('#locationModal').modal('hide').fadeOut(3000); 

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
                    // console.log("setstate:", this.state.latLng);
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
                            <h6 className="modal-title">Search your current location</h6>
                            <button type="button" className="close pull-right" data-dismiss="modal">&times;</button>
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
                                                <input
                                                    {...getInputProps({
                                                        placeholder: 'Start typing ...',
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
                                    <button type="button" className="btn btn-outline-primary pull-right cangelocationBtn" onClick={this.saveLocation.bind(this)}>save location</button>
                                </div>
                            </form>
                            <div className="col-12 currentLocationBlock">
                                <div className="text-center orText">OR</div>
                                <div className="col-6 offset-3 detectLocationBtn">
                                    <button type="button" className="btn btn-outline-primary pull-center cangelocationBtn" onClick={this.takeCurrentLocation.bind(this)}>Take My Current Location</button>
                                </div>
                            </div>
                        </div>                                                     
                        </div>
					</div>
                </div>
            </div>            
        </div>
    );
  }
}


export default DeliveryLocationPopup;
