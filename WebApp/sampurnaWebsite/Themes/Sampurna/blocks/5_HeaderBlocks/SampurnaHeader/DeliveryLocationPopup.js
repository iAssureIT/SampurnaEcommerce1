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
import Websitelogo            from './Websitelogo.js';

import {setDeliveryLocation,setSampurnaWebsiteDetails }    from '../../../../../redux/actions/index.js'; 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import Style                  from './location.module.css';

class DeliveryLocationPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
            address      : "",
            googleapiKey : "",
            detectCurrentLocation : false,
            userAddress  : [],
            country      : "",
		}; 
    }
    componentDidMount(){   
        var windowHeight  = window.innerHeight;
        // console.log("windowHeight=",windowHeight);
        var mapBlockheight        = windowHeight - 236;
        $('.locationBg').css({
            'height': (mapBlockheight)
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
            //  console.log("sampurnaWebsiteDetails=",sampurnaWebsiteDetails);
            if(sampurnaWebsiteDetails.deliveryLocation){
                var latLongDetails = {
                    lat : sampurnaWebsiteDetails.deliveryLocation.latitude,
                    lng : sampurnaWebsiteDetails.deliveryLocation.longitude
                }
                this.setState({
                    address : sampurnaWebsiteDetails.deliveryLocation.address,
                    latLong :latLongDetails
                },()=>{
                    // console.log("latLong===",this.state.latLong);
                })
            }
        }

    }
    getUserAddress(userId) {
        if(userId){
        axios.get("/api/ecommusers/" +userId)
            .then((response) => {
                // console.log('userData address res', response.data.deliveryAddress);
                if(response.data){
                    this.setState({
                        "userAddress"    : response.data.deliveryAddress,
                        "username"       : response.data.profile.fullName,
                        "mobileNumber"   : response.data.profile.mobile,
                        "email"          : response.data.profile.email
                    },()=>{
                        // console.log("userAddress=",this.state.userAddress);
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
                // console.log("google api key ===",that.state.googleapiKey);
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
                        // console.log("location response=>",response.results.results);
                            const address = response.results[0].formatted_address;
                           var latLongDetails = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                            if(latLongDetails){
                                that.setState({
                                    latLong   : latLongDetails,
                                    detectCurrentLocation : true
                                })
                            }
                            var details = response.results[0];
                            // console.log("details",details);
                            for (var i = 0; i < details.address_components.length; i++) {
                                for (var b = 0; b < details.address_components[i].types.length; b++) {
                                    switch (details.address_components[i].types[b]) {
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
                                "address"        : response.results[0].formatted_address,
                                "city"           : city,
                                "area"           : area,
                                "district"       : response.results[0].district,
                                "pincode"        : pincode,
                                "country"        : country,
                                "latitude"       : position.coords.latitude,
                                "longitude"      : position.coords.longitude,
                            }

                            if(deliveryLocation){
                                that.setState({
                                    "address"        : response.results[0].formatted_address,
                                    "city"           : city,
                                    "area"           : area,
                                    "district"       : response.results[0].district,
                                    "pincode"        : pincode,
                                    "country"        : country,
                                    "latitude"       : position.coords.latitude,
                                    "longitude"      : position.coords.longitude,
                                });
                                console.log("deliveryLocation.country===",deliveryLocation.country);
                                if(deliveryLocation.country === "United Arab Emirates"){
                                    if(that.props.sampurnaWebsiteDetails){
                                        // console.log("deliveryLocation=",deliveryLocation);
                                        var sampurnaWebsiteDetails = that.props.sampurnaWebsiteDetails;
                                        sampurnaWebsiteDetails = {...sampurnaWebsiteDetails, "deliveryLocation" : deliveryLocation};
                                        // that.setState({
                                        //     country : deliveryLocation.country
                                        // })
                                        // console.log("** sampurnaWebsiteDetails = ", sampurnaWebsiteDetails) ;
                                    }else{
                                        var sampurnaWebsiteDetails = { "deliveryLocation" : deliveryLocation }
                                    }

                                    localStorage.setItem('sampurnaWebsiteDetails',JSON.stringify(sampurnaWebsiteDetails)); 
                                    // console.log("localstorage sampurnaWebsiteDetails=>",localStorage.getItem('sampurnaWebsiteDetails'));          
                                    store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)); 
                                    
                                    // Router.push("/");
                                    // window.location.reload();
                                }else{
                                    swal("Sorry!! Delivery is not possible out of UAE");
                                }

                            }
                            that.setState({ address: deliveryLocation.address });                              
                        },
                        (error) => {
                            console.error(error);
                        }
                    );
                });
    }

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
        }
        console.log("this.state.country===",this.state.country);
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

                    // console.log("setstate on select:", this.state.address);

                   
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
                            latlong : latLongDetails,
                            latitude : lat,
                            longitude : lng
                        },()=>{
                            // console.log("getting latlong ====",this.state.latlong);
                        })
                    }
                })
            .catch(error => console.error('Error', error));
            }

        this.setState({ addressLine1: address });
    }; //end google api   
    
   render() {
       const ref = React.createRef();
    //    console.log("latlong=>",this.props.getLatlong);
       if(this.state.userDetails && this.state.userDetails.token && this.state.userAddress.length>0){
           var xlCol =  9;
           var offset = 0
           var xlForm = 12;
           var formOffset = 0;
       }else{
        var xlCol =  12;
        var offset = 0;
        var xlForm = 8;
        var formOffset = 2;
       }
       
    return (
            <div className={"row locationPage locationBg " +Style.locationBg +" " +Style.locationPage} >
                {
                    this.state.userDetails && this.state.userDetails.token && this.state.userAddress.length>0? 
                    <div className="col-3 AddressListWrapper">
                        <AddressList 
                        userAddress =  {this.state.userAddress}/>
                    </div>
                    :null
                }
                <div className={"col-"+xlCol +" offset-" +offset +" NoPadding "}>
                <div className="col-12 offset-0 mobileViewNoPadding">
                    <form className={"col-"+xlForm +" " +"offset-"+formOffset +" " +Style.deliveryForm}>
                        <div className="col-12 mt-5 ">
                            <div className="row">
                                <div className={"col-4 mt-5 NoPadding "}>
                                    <div className="col-12">
                                        <div className={"row " +Style.ma}>
                                            <div className=" col-9 NoPadding detectLocationBtn">
                                                <button type="button" className={"btn pull-center mt-1 " +Style.locationBTN}  onClick={this.takeCurrentLocation.bind(this)}>Deliver to my Current Location</button>
                                            </div>
                                            <div className={"text-center NoPadding orText1 col-3 mt-3 " +Style.tw +" "+Style.f12}><div className={"col-2 NoPadding " +Style.orline}></div><span className={"col-8 " +Style.MapOr}>OR</span><div className={"col-2 NoPadding " +Style.orline}></div></div>

                                            {/*<div className={"text-center NoPadding orText1 col-3 mt-3 " +Style.tw +" "+Style.f12}>
                                                <div className="col-1 " id="line"><hr /></div><span className={"col-8 " +Style.MapOr}>OR</span><div className="col-1 " id="line"><hr /></div></div>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className={" col-7 mt-5 NoPadding"}>
                                    <PlacesAutocomplete 
                                        value={this.state.address}
                                        onChange={this.handleChangePlaces}
                                        onSelect={this.handleSelect}
                                        highlightFirstSuggestion={true}>
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div className="col-12 NoPadding ">
                                                {/* <label className={" mt-2 searchAdrressLable " +Style.tw}> Search Location </label> */}
                                                <input
                                                    {...getInputProps({
                                                        placeholder: 'Search your Location',
                                                        className: 'location-search-input form-control',
                                                        id: "address",
                                                        name: "address",
                                                        required: true
                                                    })}
                                                />
                                                <span className={" " +Style.search}><i className="fa fa-search " aria-hidden="true"></i></span>
                                                <div className="autocomplete-dropdown-container SearchListContainer">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? 'suggestion-item--active'
                                                            : 'suggestion-item';
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
                                <div className="col-12 NoPadding">
                                    <div className="col-2 offset-9 mt-3 NoPadding ">
                                        <button type="button" className={" btn col-12 NoPadding  changelocationBtn pull-right " +Style.locationBTN } onClick={this.saveLocation.bind(this)}>Save & Close</button>
                                    </div>
                                </div>
                                
                            </div>
                            {/* <div className={"col-sm-12 col-xs-12 col-md-12 col-lg-8 mt-4 " +Style.ma}>
                                <div className="col-12">
                                        <button type="button" className={"btn col-4  changelocationBtn pull-right " +Style.locationBTN } onClick={this.saveLocation.bind(this)}>Save & Close</button>
                                    
                                </div>
                            </div> */}
                            <div className="col-12 pull-right mt-2 ">
                            </div>
                        </div>
                    </form>
                    {this.state.latLong?
                        < GoogleMap
                            googleapiKey = {this.state.googleapiKey}
                            latLongDetails = {this.state.latLong}
                        />
                    :null}

                </div>                                                     
            </div>
            </div>
        
    );
  }
}

const mapStateToProps = state => (
    {
        sampurnaWebsiteDetails : state.data.sampurnaWebsiteDetails,
        getLatlong             : state.data.getLatlong,
    });
  
    const mapDispatchToProps = {    
        setSampurnaWebsiteDetails : setSampurnaWebsiteDetails,    
    };
  
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryLocationPopup);

