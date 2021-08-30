import React                  from 'react';
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
import Style                  from './Header.module.css';
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
        var wishlistCol;
        var systemSecurityMl;
        if(this.state.user_ID){
            colWithLogin = 2;
            wishlistCol = 2;
            systemSecurityMl = 4;

        }else{
          colWithLogin = 2;
          wishlistCol = 0;
          systemSecurityMl = 5;
        }
        return(   
            <div className={"col-12 " + Style.headerWrapper}>
                <header>
                    <div className="">
                        <nav className={"navbar navbar-expand-md "+ Style.megamenuWrapper}>
                        <div className="col-12">
                            <div className="row">
                                <div className={"col-12 col-lg-12 " + Style.megamenu}> 
                                    <div className="row h-100">
                                        <div className="col-lg-2 col-4  order-lg-1 order-1">
                                            <div className="col-lg-12 col-12">
                                                <Websitelogo />
                                            </div>
                                        </div>
                                        <div className="col-lg-8 col-12 h-100 order-lg-2 order-3">
                                            <div className="row">
                                                <SearchBar />
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-8 h-lg-100 h-50 order-lg-3 order-2">
                                            <div className="row h-100">
                                                <div className="col-6 h-100">
                                                    <SystemSecurityModal />
                                                </div>
                                                <div className="col-2 h-100">
                                                    < Wishlist /> 
                                                </div>
                                                <div className="col-4 h-100">
                                                    <div className="row h-100">
                                                        <MyCart />
                                                    </div>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className={"col-12 col-lg-12 "}>
                                    <div className="row h-100">
                                        <div className={"col-lg-12  navbar-header " + Style.navbarHeader}>
                                            <button className={"navbar-toggler "+  Style.collapseBtn} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                                <span className={"navbar-toggler-icon " + Style.navbarIcon}>
                                                    <i className={"fas fa-bars " + Style.navbarIcon2}></i>
                                                </span>
                                            </button>                             
                                        </div>
                                        <div id="collapsibleNavbar" className={"col-lg-12 col-12 collapse navbar-collapse " + Style.mainMenu + " " + Style.mainMenuWrapper}>
                                            <div className="col-12 h-100">
                                                <div className="row h-100">
                                                <div className={"col-lg-2 col-12 " + Style.allCategories}>
                                                    All Categories
                                                </div>
                                                <div className="col-lg-10 col-12">
                                                    <div className="row h-100">
                                                        <Megamenu />                                                </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-12 " + Style.locationHeaderwrapper}>
                                    <div className={"row " + Style.locationHeader}>
                                        <DisplayLocation />
                                    </div>
                                </div>
                            </div>
                        </div>

                                    {/**/}
                                    
                                    {/*<div className={"col-8 col-sm-5 col-md-4 col-lg-3"}> 
                                        <div className="row">   
                                            <div className={"col-5 ml-"+systemSecurityMl}>
                                                < SystemSecurityModal />
                                            </div>                             
                                            <div className={"col-"+wishlistCol}>                                                   
                                                < Wishlist />                                                
                                            </div>  
                                            <div className="col-3 col-sm-4 col-lg-3 col-xl-3">
                                                < MyCart />    
                                            </div>                                      
                                        </div>
                                    </div>*/}
                                
                                {/*<div className="col-12">
                                    <div className="d-block d-lg-none navbar-header">
                                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                            <span className="navbar-toggler-icon"></span>
                                        </button>                             
                                    </div>
                                    <div id="collapsibleNavbar" className="col-12 collapse navbar-collapse">
                                        <Megamenu />
                                    </div>
                                </div>*/}
                                
                        </nav>
                    </div>
                    {/*<DisplayLocation />*/}
                    
                    <div id="locationModal" className="col-12 modal in"  data-keyboard="false" >
                        <div className="modal-dialog modal-xl " >
                            <div className="modal-content ">                            
                                <div className="modal-body">                                          
                                    <div className="modal-header">
                                        <h6 className="modal-title">Your Delivery Location</h6>
                                    </div>
                                    <button type="button" className="close closeModalBtn"  data-dismiss="modal" >&times;</button>  
                                   
                                    <DeliveryLocationPopupAfterLogin/>
                                </div>
                            </div>
                        </div>  
                    </div>  
                </header>      
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