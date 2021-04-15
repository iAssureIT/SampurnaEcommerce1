import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Popup } from "react-leaflet";
import axios             from 'axios';


const Marker = ({ text }) =>{
  return (
     <div>
          <i className=
          "fa fa-map-marker" style={{fontSize: "x-large",color:'green'}} title={text} />
      </div>
  )
}

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 18.516726,
      lng: 73.856255
    },
    zoom: 11
  };

  
  componentDidMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        boxColor: nextProps.boxColor,
        title: nextProps.title,
        apiData : nextProps.api,
      },()=>{this.getData()})
    }
  }

  
  getData(){
    var data = {...this.state.data};

    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
        axios({
          method: Method,
          url: Path,
        })
        .then((response)=>{ 
         //console.log("response map",response.data);
          var piechartcolor = [];
          var totalEstimate = [];
          var locations = [];
         
         if(response.data && response.data.length >0){
            response.data.map((data,index)=>{ 
              if(data.locations.length > 0){
                if(data.locations[0].latitude){
                  var obj = {"_id":data._id,"name":data.companyName,"latitude":data.locations[0].latitude,"longitude":data.locations[0].longitude}
                  locations.push(obj);
                }
              }
            })
         } 
         
        
        this.setState({
          "data" : locations
        })
        //console.log("loct",this.state.data)
      })
      .catch((error)=>{  
        console.log('error=>',error)      
      });
    }
  }

 
  render() {
    let Location = this.state.data;
    //console.log("Location Data",Location);
    return (
      <div className="col-md-8">
      <div className={"box "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
              <div style={{ height: '250px' }}>
                <GoogleMapReact
                  bootstrapURLKeys="AIzaSyD1hOxDqrgk8V82oEYXU6W2p_U0-kvvu38"
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                >
                  {
                      this.state.data && this.state.data.length > 0 ?
                        this.state.data.map((data, i)=>{
                          return(
                            <Marker
                              lat={data.latitude}
                              lng={data.longitude}
                              onClick={this.onMarkerClick} 
                              text ={data.name}
                          ></Marker> 
                          );
                        })
                      :
                      null
                  }

                </GoogleMapReact>
              </div>
            </div>
        </div>
      </div>
    );
  }
}
 
export default SimpleMap;