import React 		          from 'react';
import axios 		          from 'axios';
import Router                 from 'next/router'; 
import GoogleMapReact         from 'google-map-react';
import Marker                 from './Marker.js';

class GoogleMap extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            googleapiKey  : "",
            userDetails   : "",
            latLongValues : {},
            zoom          : 15
         }
    }  
    componentDidUpdate(prevProps, prevState) {
        // console.log("prevProps===",prevProps);
        var latLongDetails = {
            lat: prevProps.latLongDetails.lat,
            lng: prevProps.latLongDetails.lng
        }
        // this.setState({
        //     latLongValues: latLongDetails
        // })
    }
    componentDidMount(){
        var user_details           =  JSON.parse(localStorage.getItem('userDetails'));
        if(user_details){
            this.setState ({
                userDetails  : user_details,
            })
        }
    }  
   render(){
    //    console.log("latlong props=",this.props);
    //    console.log("latlong=",this.state.latLong.lng);
    //    console.log("apikey=",this.props.googleapiKey);

        return(  
            <div className=" col-12 googleMap mt-4 mb-4 ">   
                {this.props.latLongDetails ? 
                <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: this.props.googleapiKey }}
                    defaultCenter={this.props.latLongDetails}
                    defaultZoom={this.state.zoom}
                    >
                    <Marker
                        lat={this.props.latLongDetails.lat}
                        lng={this.props.latLongDetails.lng}
                        text="A"
                    />
                    </GoogleMapReact>
                </div>
                :null}
            </div>  
        );        
    }
}

export default  GoogleMap;