import React                  from 'react';
import axios                  from 'axios';
import Link                   from 'next/link';
import swal                   from 'sweetalert';
import Image                  from 'next/image';
import Router                 from 'next/router'; 
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
import SearchBar              from './Searchbar.js';
import Megamenu               from './Megamenu.js';
import DeliveryLocationPopupAfterLogin  from './DeliveryLocationPopupAfterLogin.js';
import DisplayLocation        from './DisplayLocation.js';
import SystemSecurityModal    from './SystemSecurityModal.js';
import Websitelogo            from './Websitelogo.js';
import MyCart                 from './MyCart.js';
import Wishlist               from './Wishlist.js';
import {setSampurnaWebsiteDetails }     from '../../../../../redux/actions/index.js'; 

class Header extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
            multilevelMenuData : {},    
            multilevelMenuData : [],  
            userID             : "", 
            userLocation       : true,  
            address            : "",
            deliveryLocation   : "-"
         }
    }    
     async componentDidMount(){
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        if( userDetails && userDetails.user_id){
            this.setState({
                user_ID : userDetails.user_id,
                authService : userDetails.authService
            })
        }
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
            }
            store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)) ;
        }
    }

    render(){
        var colWithLogin;
        if(this.state.user_ID){
            colWithLogin = 3;
        }else{
          colWithLogin = 2;
        }
        return(   
            <div className="col-12 headerWrapper NoPadding">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header">
                                    <div className="row logoWrap"> 
                                        <div className="col-2">
                                            <Websitelogo />
                                        </div>

                                        <SearchBar />
                                        
                                        <div className={"col-8 col-lg-"+colWithLogin+" col-sm-"+colWithLogin +" mt-1 systemSecurity"}> 

                                        {/*<div className="col-8 col-lg-3 col-sm-2 systemSecurity NoPadding"> */}

                                            <div className="row">   
                                                <div className="col-6 ">
                                                    < SystemSecurityModal />
                                                </div>   
                                                 {this.state.user_ID && this.state.authService!=="guest"?                            
                                                    <div className="col-2 NoPadding ">                                                   
                                                        < Wishlist />                                                
                                                    </div>   
                                                   
                                                :null}
                                                <div className="col-4 NoPadding ">
                                                    < MyCart />    
                                                </div>                                               
                                                                                            
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <div className="col-12 NoPadding">
                                    <div className="navbar-header">
                                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                            <span className="navbar-toggler-icon"></span>
                                        </button>                             
                                    </div>
                                    <div id="collapsibleNavbar" className="col-12 collapse navbar-collapse navHeaderCollapse ">
                                        <Megamenu />
                                    </div>
                                </div>                    
                            </div>
                        </nav>
                        <DisplayLocation />
                        
                        <div id="locationModal" className="col-12 modal in"  data-keyboard="false" >
                            <div className="modal-dialog modal-xl " >
                                <div className="modal-content ">                            
                                    <div className="modal-body">                                          
                                        <div className="modal-header">
                                            <h6 className="modal-title">Your Delivery Location</h6>
                                        </div>
                                        <button type="button" className="close closeModalBtn"  data-dismiss="modal" >&times;</button>  
                                        {/* <DeliveryLocationPopup/> */}
                                        <DeliveryLocationPopupAfterLogin/>
                                    </div>
                                </div>
                            </div>  
                        </div>  
                    </header>
                </div>
            </div>         
        );        
    }
}

const mapStateToProps = state => (
    {
        // recentCartData   :  state.data.recentCartData,
    });
  
  const mapDispatchToProps = {
    setSampurnaWebsiteDetails   : setSampurnaWebsiteDetails
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);