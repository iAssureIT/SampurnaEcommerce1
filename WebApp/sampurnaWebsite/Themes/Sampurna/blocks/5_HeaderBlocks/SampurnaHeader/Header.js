import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import Router                 from 'next/router'; 
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
import parse, { domToReact }  from 'html-react-parser';
import Searchbar              from './Searchbar.js';
import Megamenu               from './Megamenu.js';
import DeliveryLocationPopup  from './DeliveryLocationPopup.js';
import DisplayLocation        from './DisplayLocation.js';
import SystemSecurityModal    from './SystemSecurityModal.js';
import Websitelogo            from './Websitelogo.js';
import MyCart                 from './MyCart.js';
import { updateCartCount,setProductApiUrl,setSampurnaWebsiteDetails }     from '../../../../../redux/actions/index.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

class Header extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            multilevelMenuData : {},	
            multilevelMenuData : [],  
            userID             : "", 
            userLocation       : true,  
            address            : "",
            homeFirstVisit     : false,
            loading            : true,
            deliveryLocation   : "-"
         }
    }    
	 async componentDidMount(){
        var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
        var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
        var deliveryLocation = false;
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
            }
            store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)) ;
            if(userDetails){
                var user_id = userDetails.user_id;       
                if(user_id !== null){
                    this.setState({
                        "userID": user_id,
                    },()=>{
                    })     
                }
            }
        }

        if(!deliveryLocation){
            this.setState({
                "homeFirstVisit" : true,
                "address"        : "",
                loading          : false
            });
        }else{
            this.setState({
                deliveryLocation : deliveryLocation,
            });
        }
    }

    render(){
        return(   
            <div className="col-12 headerWrapper NoPadding">
                <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
                    <header>
                        <nav className="navbar navbar-expand-md navbar-dark megamenu">
                            <div className="col-12 NoPadding ">
                                <div className="col-12 top-header">
                                    <div className="row logoWrap"> 
                                                                
                                        <Websitelogo />

                                        <Searchbar />

                                        <div className="col-8 col-sm-2 ml-4 systemSecurity"> 
                                            <div className="row">                                  
                                                < SystemSecurityModal />
                                                < MyCart />
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
                                <div className="modal-content " style={{'background': '#fff'}}>                            
                                    <div className="modal-body">  
                                        <div className="modal-header">
                                            <h6 className="modal-title">Your Delivery Location</h6>
                                        </div>
                                        <DeliveryLocationPopup/>
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
    // console.log("1. state in header====",state.data),
    {
        recentCartData   :  state.data.recentCartData,
    });
  
  const mapDispatchToProps = {
    setProductApiUrl            : setProductApiUrl,
    setSampurnaWebsiteDetails   : setSampurnaWebsiteDetails
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);