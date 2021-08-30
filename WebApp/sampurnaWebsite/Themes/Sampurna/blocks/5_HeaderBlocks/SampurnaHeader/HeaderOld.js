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
            <div className="col-12 headerWrapper NoPadding">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header NoPadding">
                                    <div className="col-12 logoWrap"> 
                                        <div className="row">
                                            <div className="col-4 col-lg-2 col-md-2 col-sm-2 col-xl-2">
                                                <Websitelogo />
                                            </div>

                                            <SearchBar />
                                            
                                            <div className={"col-8 col-sm-5 col-md-4 col-lg-3 " +"col-xl-"+colWithLogin+" mt-1 systemSecurity"}> 
                                                <div className="row">   
                                                    <div className={"col-5 NoPadding ml-"+systemSecurityMl+ " systemSecurityModal"}>
                                                        < SystemSecurityModal />
                                                    </div>                             
                                                    <div className={"col-"+wishlistCol +" NoPadding "}>                                                   
                                                        < Wishlist />                                                
                                                    </div>  
                                                    <div className="col-3 col-sm-4 col-lg-3 col-xl-3 NoPadding ">
                                                        < MyCart />    
                                                    </div>                                      
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div> 
                                <div className="col-12 NoPadding">
                                    <div className="d-block d-lg-none navbar-header">
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