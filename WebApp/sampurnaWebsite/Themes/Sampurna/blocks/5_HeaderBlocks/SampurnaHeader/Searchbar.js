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

    searchProducts(event) {   
        // console.log("event.keycode",event.key);  
        // this.getRelatedSearches(event);
        if (event.key === "Enter") {
            this.getRelatedSearches1(event);
        }
      }

      getRelatedSearches(event){
        var searchText = this.refs.tableSearch.value.trim();
        if(searchText !== null){    
          var payload ={"searchText":searchText}
          if(payload){
            axios.post("/api/products/get/search/suggestion",payload)
            .then((searchResponse)=>{
                // console.log("searchResponse==",searchResponse);
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
      }

      getProducts(event){
          event.preventDefault();
        var formValues = {
            "searchstr"         : this.state.searchText,
            "user_id"           : this.state.user_ID,
            "limit"             : 10,
            "userLatitude"      : this.state.latitude,
            "userLongitude"     : this.state.longitude
        }
        console.log("formValues==",formValues);
        if(formValues){
            axios.post("/api/products/get/search/website",formValues)
            .then((searchProductRes)=>{
                if(searchProductRes){
                    console.log("searchProductRes===",searchProductRes);
                    Router.push('/search-product/'+this.state.searchText);
                    store.dispatch(setSearchDetails(searchProductRes)) ;
                }
            })
            .catch((error)=>{
                console.log("error while search api=",error);
            })
        }
      }
      getRelatedSearches1(event){
        var searchText = this.refs.tableSearch.value.trim();
        console.log("searchText==",searchText);
        if(searchText !== null){  
          console.log("searchText===",searchText);   
          var payload ={"searchText":searchText}
          console.log("payload==",payload);
          if(payload){
            axios.post("/api/products/get/search/suggestion",payload)
            .then((searchResponse)=>{
                console.log("searchResponse==",searchResponse);
                if(searchResponse){
                    console.log("searchResponse==",searchResponse.data);
                    this.setState({
                        "relatedSearches" : searchResponse.data,
                        "searchText"      : searchText,
                    },()=>{
                        
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
                                    console.log("searchProductRes===",searchProductRes);
                                    Router.push('/search-product/'+this.state.searchText);
                                    store.dispatch(setSearchDetails(searchProductRes)) ;
                                }
                            })
                            .catch((error)=>{
                                console.log("error while search api=",error);
                            })
                        }
                    })
                }
            })
            .catch((error)=>{
                console.log(" search result error=",error);
            })  
          }      
        }  
      } 

   render(){
        return(  
            <div className="col-12 col-sm-7 ">                                
                <div className="col-12 NoPadding">  
                    <div className="row mt3 tableSearchWrapper"> 
                        <input type="text" placeholder="Search the items" id="browsers"
                        list="datalist"
                        // onKeyPress={this.searchProducts.bind(this)} 
                        // onClick={this.searchProducts.bind(this)}
                        onChange={this.getRelatedSearches.bind(this)} 
                        className="form-control tableSearch col-12" ref="tableSearch" id="tableSearch" name="tableSearch" />
                        <div className="searchIcon" 
                            onClick={this.getProducts.bind(this)}
                        >
                            <i className="fas fa-search"></i>
                        </div>

                        <datalist id="datalist" className="col-12">
                            {Array.isArray(this.state.relatedSearches) && 
                                this.state.relatedSearches.map((data,index)=>{
                                // console.log("data",data);
                               return( <option value={data} onSelect={this.getProducts}>{data}</option>)
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
    {
    }
);
  
  const mapDispatchToProps = {
    setSearchDetails :setSearchDetails
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);