import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import Router                 from 'next/router'; 
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
import { setSearchDetails }     from '../../../../../redux/actions/index.js'; 

class Searchbar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
          
         }
    }    
    componentDidMount(){
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if( userDetails && userDetails.user_id){
            this.setState({user_ID : userDetails.user_id})
        }
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
                this.setState({
                    "latitude"  :sampurnaWebsiteDetails.deliveryLocation.latitude,
                    "longitude" : sampurnaWebsiteDetails.deliveryLocation.longitude
                })
            }
        }
    }
    searchProducts() {        
          var searchText = this.refs.tableSearch.value.trim();
          if(searchText){     
            var payload ={"searchText":searchText}
            axios.post("/api/products/get/search/suggestion",payload)
            .then((searchResponse)=>{
                if(searchResponse){
                    // console.log("searchResponse==",searchResponse.data);
                    this.setState({
                        "relatedSearches" : searchResponse.data,
                        "searchText"      : searchText,
                    },()=>{
                       
                    })
                }
            })
            .catch((error)=>{
                console.log(" search result error=",error);
            })

                      
          }    
      }
      getRelatedSearches(event){
        //   console.log("inside getRelatedSearches");
        event.preventDefault();
        var formValues = {
            "searchstr"         : this.state.searchText,
            "user_id"           : this.state.user_ID,
            "limit"             : 10,
            "userLatitude"      : this.state.latitude,
            "userLongitude"     : this.state.longitude

        }
        if(formValues){
            axios.post("/api/products/get/search/website",formValues)
            .then((searchProductRes)=>{
                if(searchProductRes){
                    store.dispatch(setSearchDetails(searchProductRes)) ;
                    Router.push('/search-product/'+this.state.searchText);
                }
            })
            .catch((error)=>{
                console.log("error while search api=",error);
            })
        }
      }

   render(){
        return(  
            <div className="col-12 col-sm-7 ">                                
                <div className="col-12 NoPadding">  
                    <div className="row mtm3"> 
                        <input type="text" placeholder="What are you looking for?" id="browsers"
                        list="datalist"
                        onChange={this.searchProducts.bind(this)} 
                        className="form-control tableSearch col-11" ref="tableSearch" id="tableSearch" name="tableSearch" />
                        <div className="searchIcon" onClick={this.getRelatedSearches.bind(this)}><i className="fa fa-search"></i></div>

                        <datalist id="datalist" className="col-12" onClick={this.getRelatedSearches.bind(this)}>
                            {Array.isArray(this.state.relatedSearches) && 
                            this.state.relatedSearches.map((data,index)=>{
                                // console.log("data",data);
                               return( <option value={data}>{data}</option>)
                            })
                            }
                        </datalist>
                    </div>                              
                </div>                       
            </div>
      
        );        
    }
}

const mapStateToProps = state => (
    // console.log("1. state in header====",state.data),
    {
    }
);
  
  const mapDispatchToProps = {
    setSearchDetails :setSearchDetails
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);