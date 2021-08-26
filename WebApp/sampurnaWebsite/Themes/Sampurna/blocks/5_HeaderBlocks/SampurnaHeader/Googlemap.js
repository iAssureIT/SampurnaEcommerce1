import React                from 'react';
import axios                from 'axios';
import Router               from 'next/router'; 
import GoogleMapReact       from 'google-map-react';
import Marker               from './Marker.js';
import $, { post }          from 'jquery';
import jQuery               from 'jquery';


import Style                from './location.module.css';


const mapStyles = {
    width   : '100%',
    height  : '60%'
};


class GoogleMap extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            googleapiKey  : "",
            userDetails   : "",
            latLongValues : {},
            zoom          : 15,
            mapOpacity    : 0.5,
        }
    }  
    
    componentDidUpdate(prevProps, prevState){
        $('.locationPage').removeClass('locationBg');
        var latLongDetails = {
            lat : prevProps.latLongDetails.lat,
            lng : prevProps.latLongDetails.lng
        }
    }

    componentDidMount(){
        var windowHeight    = window.innerHeight;
        var mapBlockheight  = windowHeight - 150;
        this.setState({mapBlockheight : mapBlockheight});

        var user_details    = JSON.parse(localStorage.getItem('userDetails'));
        if(user_details){
            this.setState ({
                userDetails  : user_details,
            })
        }
    }  
    
    render(){
        return(  
            <div className={"col-12 mt-4 mb-4 NoPadding googlemap "+Style.height550+" "+Style.googleMap}>   
                {
                    this.props.latLongDetails
                    ?
                        <div style={{ height: this.state.mapBlockheight, width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys    = {{ key: this.props.googleapiKey }}
                                defaultCenter       = {this.props.latLongDetails}
                                defaultZoom         = {this.state.zoom}
                                getOpacity          = {this.state.mapOpacity}
                                style               = {mapStyles}
                            >
                                <Marker
                                    lat     = {this.props.latLongDetails.lat}
                                    lng     = {this.props.latLongDetails.lng}
                                    text    = "A"
                                />
                            </GoogleMapReact>
                        </div>
                    :
                        null
                }
            </div>  
        );        
    }
}

export default GoogleMap;