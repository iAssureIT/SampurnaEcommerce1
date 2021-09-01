import React             from 'react';
import axios             from 'axios';
import {connect}         from 'react-redux';
import dynamic           from 'next/dynamic'
import getConfig         from 'next/config';
import Head              from 'next/head';
import Router            from 'next/router';
import Link              from 'next/link';
import swal              from 'sweetalert';
import $                 from 'jquery';
import GoogleMap         from './Googlemap.js';
import store             from '../../../../../redux/store.js';
import AddressList       from './AddressList.js';
import Geocode           from "react-geocode"; 
import Websitelogo       from './Websitelogo.js';
import {setDeliveryLocation,setSampurnaWebsiteDetails,updateCartCount }    from '../../../../../redux/actions/index.js'; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Style                  from './location.module.css';

class DeliveryLocationPopup extends React.Component{
    constructor(props){
		super(props);
		this.state = { 
            address                 : "",
            googleapiKey            : "",
            detectCurrentLocation   : false,
            userAddress             : [],
            country                 : "",
            searchLocationError     : "",
            latLong                 : {},
		};
    }

    componentDidMount(){
        var windowHeight    = window.innerHeight;
        var mapBlockheight  = windowHeight - 150;
        // console.log("mapBlockheight = ",mapBlockheight);
        var formTopMargin = (mapBlockheight/2) * 0.8 ; 
        this.setState({
            mapBlockheight : mapBlockheight,
            formTopMargin : formTopMargin,
        });


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
    
            var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
            var user_details           =  JSON.parse(localStorage.getItem('userDetails'));
    
            if(user_details){
                this.setState({
                    userDetails : user_details
                },()=>{
                    this.getUserAddress(this.state.userDetails.user_id);
                })
            }
    
            if(sampurnaWebsiteDetails){
                if(sampurnaWebsiteDetails.deliveryLocation){
                    var latLongDetails = {
                        lat : sampurnaWebsiteDetails.deliveryLocation.latitude,
                        lng : sampurnaWebsiteDetails.deliveryLocation.longitude
                    }
                    this.setState({
                        address : sampurnaWebsiteDetails.deliveryLocation.address,
                        country : sampurnaWebsiteDetails.deliveryLocation.country,
                        latLong : latLongDetails
                    },()=>{

                    })
                }
            }
    }

    getUserAddress(userId){
        if(userId){
            axios.get("/api/ecommusers/" +userId)
                .then((response) => {
                    if(response.data){
                        this.setState({
                            "userAddress"    : response.data.deliveryAddress,
                            "username"       : response.data.profile.fullName,
                            "mobileNumber"   : response.data.profile.mobile,
                            "email"          : response.data.profile.email
                        },()=>{

                        });
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                }); 
        } 
    }

    takeCurrentLocation(){
        var that=this;
        Geocode.setApiKey(that.state.googleapiKey);
        Geocode.setLanguage('en');
        Geocode.setLocationType("ROOFTOP");
        Geocode.enableDebug();  
        navigator.geolocation.getCurrentPosition(function(position){
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
                    .then((response) => {
                        const address = response.results[0].formatted_address;
                        var latLongDetails = {
                            lat : position.coords.latitude,
                            lng : position.coords.longitude
                        }
                        if(latLongDetails){
                            that.setState({
                                latLong                 : latLongDetails,
                                detectCurrentLocation   : true
                            })
                        }
                        var details = response.results[0];
                        for(var i = 0; i < details.address_components.length; i++){
                            for(var b = 0; b < details.address_components[i].types.length; b++){
                                switch(details.address_components[i].types[b]){
                                    case 'sublocality_level_2':
                                        var detailAddress = details.address_components[i].long_name;
                                        break;
                                    case 'sublocality_level_1':
                                        var area = details.address_components[i].long_name;
                                        break;
                                    case 'locality':
                                        var city = details.address_components[i].long_name;
                                        break;
                                    case 'administrative_area_level_1':
                                        var state = details.address_components[i].long_name;
                                        break;
                                    case 'country':
                                        var country = details.address_components[i].long_name;
                                        break;
                                    case 'postal_code':
                                        var pincode = details.address_components[i].long_name;
                                        break;
                                }
                            }
                        }
                        var deliveryLocation = {
                            "address"   : country === "United Arab Emirates" ? response.results[0].formatted_address : that.state.address,
                            "city"      : city,
                            "area"      : area,
                            "district"  : response.results[0].district,
                            "pincode"   : pincode,
                            "country"   : country,
                            "latitude"  : position.coords.latitude,
                            "longitude" : position.coords.longitude,
                        }
                        if(deliveryLocation){
                            that.setState({
                                "address"    : country === "United Arab Emirates" ? response.results[0].formatted_address : that.state.address,
                                "city"       : city,
                                "area"       : area,
                                "district"   : response.results[0].district,
                                "pincode"    : pincode,
                                "country"    : country,
                                "latitude"   : position.coords.latitude,
                                "longitude"  : position.coords.longitude,
                            });
                            if(deliveryLocation.country === "United Arab Emirates"){
                                if(that.props.sampurnaWebsiteDetails){
                                    var sampurnaWebsiteDetails = that.props.sampurnaWebsiteDetails;
                                    sampurnaWebsiteDetails = {...sampurnaWebsiteDetails, "deliveryLocation" : deliveryLocation};
                                }else{
                                    var sampurnaWebsiteDetails = { "deliveryLocation" : deliveryLocation }
                                }
                                localStorage.setItem('sampurnaWebsiteDetails',JSON.stringify(sampurnaWebsiteDetails)); 
                                store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)); 
                            }else{
                                swal("Sorry!! Delivery is not possible out of UAE");
                            }
                        }
                            // that.setState({ address: deliveryLocation.address });                              
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        });
    }
    saveLocation(event){
        event.preventDefault();
        if(this.state.address){
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
            }

            if((this.state.country) === "United Arab Emirates"){     
                if(this.props.sampurnaWebsiteDetails){
                    var sampurnaWebsiteDetails = this.props.sampurnaWebsiteDetails;
                    sampurnaWebsiteDetails = {...sampurnaWebsiteDetails, "deliveryLocation" : deliveryLocation};
                }else{
                    var sampurnaWebsiteDetails = { "deliveryLocation" : deliveryLocation }
                }
                localStorage.setItem('sampurnaWebsiteDetails',JSON.stringify(sampurnaWebsiteDetails));   
                store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails));
                $('#locationModal').modal('hide'); 
                window.location.reload();
                Router.push('/');
            }else{
                swal("Sorry!! Delivery is not possible out of UAE");
            }
        }else{
            this.setState({
                "searchLocationError" : "Please search your location here."
            })
        }
    }

    handleChangePlaces = address => {
        this.setState({ address: address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
        .then((results) => {
            if(results){
                this.setState({
                    latLong : {}
                })
                for(var i = 0; i < results[0].address_components.length; i++){
                    for(var b = 0; b < results[0].address_components[i].types.length; b++){
                        switch(results[0].address_components[i].types[b]){
                            case 'sublocality_level_1':
                                var area = results[0].address_components[i].long_name;
                                break;
                            case 'sublocality_level_2':
                                area = results[0].address_components[i].long_name;
                                break;
                            case 'locality':
                                var city = results[0].address_components[i].long_name;
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
                    countryCode: countryCode,
                })
            }
        })
        if(address){
            geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                if(lat && lng){
                    var latLongDetails = {
                        lat: lat,
                        lng: lng
                    }
                    this.setState({
                        latLong : latLongDetails,
                        latitude : lat,
                        longitude : lng
                    },()=>{
                        // console.log("latlong===",this.state.latLong);
                    })
                }
            })
            .catch(error => console.error('Error', error));
        }
        this.setState({ addressLine1: address });
    };
    
    render(){
        const ref = React.createRef();
        if(this.state.userDetails && this.state.userDetails.token && this.state.userAddress.length>0){
            var xlCol =  9;
            var offset = 3
            var xlForm = 12;
            var formOffset = 0;
            var class1 = "zindex";
        }else{
            var xlCol =  12;
            var offset = 0;
            var xlForm = 10;
            var formOffset = 1;
            var class1 = "zindex1"
        }
        return(
            <section className={"col-12 locationPage locationBg " + Style.locationPageWrapper}>
                {
                    this.state.latLong.lat && this.state.latLong.lng
                    ?
                        <GoogleMap
                            googleapiKey    = {this.state.googleapiKey}
                            latLongDetails  = {this.state.latLong}
                        />
                    :
                        null
                }            
                <form className={"col-11 col-sm-11  col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 " + Style.locationSetBlock} >
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-3 col-lg-3">
                                <div className="row">
                                    <button type="button" className={"col-12 btn "+Style.deliveryLocationCurrentButton} onClick={this.takeCurrentLocation.bind(this)}>
                                        <img src="/images/eCommerce/location.svg" alt="ChangeLocationButton"></img>&nbsp; Current Location
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 col-sm-3 col-lg-2 mt-3 mt-lg-0">
                                <div className="ml-2">
                                    <div className={"col-3 "+Style.deliveryLocationORLine1}></div>
                                    <div className={"col-4 "+Style.deliveryLocationORTextWrapper}>
                                        <div className={"mx-auto "+Style.deliveryLocationORText}>OR</div>
                                    </div>
                                    <div className={"col-3 "+Style.deliveryLocationORLine2}></div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-7 mt-3 mt-lg-0">
                                <div className="row">
                                    <PlacesAutocomplete
                                        value                       = {this.state.address}
                                        onChange                    = {this.handleChangePlaces}
                                        onSelect                    = {this.handleSelect}
                                        highlightFirstSuggestion    = {true}>

                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div className={"col-12 "+Style.deliveryLocationSearchWrapper}>
                                                <div className={"deliveryLocationSearch "+Style.deliveryLocationSearch}>
                                                    <input type="text"
                                                        {...getInputProps({
                                                            placeholder : 'Search your Location',
                                                            className   : 'location-search-input form-control',
                                                            id          : "address",
                                                            name        : "address",
                                                            required    : true,
                                                            
                                                        })}
                                                    />
                                                        <i className="fas fa-search"></i>
                                                </div>
                                                <div className="autocomplete-dropdown-container">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                                        const style     = suggestion.active ? { backgroundColor: '#fafafa', cursor: 'pointer' } : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return(
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
                                                <div className="col-12 errormsg">{this.state.searchLocationError}</div>
                                            </div>
                                        )}
                                    </PlacesAutocomplete>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row pull-right">
                            <button type="button" className={"btn mt-3 mt-lg-3 mt-xl-2 "+Style.deliveryLocationSaveButton} onClick={this.saveLocation.bind(this)}>Save and Close</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
}

const mapStateToProps = state => (
{
    sampurnaWebsiteDetails : state.data.sampurnaWebsiteDetails,
    // getLatlong             : state.data.getLatlong,
    cartCount              : state.data.cartCount,

});
  
const mapDispatchToProps = {  
    updateCartCount  : updateCartCount,  
    setSampurnaWebsiteDetails : setSampurnaWebsiteDetails,    
};
  
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryLocationPopup);