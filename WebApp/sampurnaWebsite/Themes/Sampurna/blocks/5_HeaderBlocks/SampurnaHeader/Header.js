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
        this.getCartCount();
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
                // console.log("deliveryLocation = ",deliveryLocation);
            }
            store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)) ;


            //======= Get User Data ===========
            if(userDetails){
                var user_id = userDetails.user_id;       
                if(user_id !== null){
                    this.setState({
                        "userID": user_id,
                    },()=>{
                        this.props.updateCartCount();
                        // this.props.getWishlistData();
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
    getCartCount() {
        if(this.state.userID){
            axios.get("/api/carts/get/count/" + this.state.userID)
            .then((response) => {
            //   console.log("cartcount--",response.data);
            store.dispatch(updateCartCount(response.data));
            })
            .catch((error) => {
            console.log("error",error);
            })
        }
      }

   render(){
        return(   
            <div className="col-12 headerWrapper NoPadding">
            <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
            <header>
                <nav className="navbar navbar-expand-md navbar-dark megamenu">
                    <div className="col-12">
                        <div className="col-12 top-header">
                            <div className="row logoWrap"> 
                                                           
                                <Websitelogo />

                                <Searchbar />

                                <div className="col-8 col-sm-3 ml-4 systemSecurity"> 
                                    <div className="row">

                                    <div className="col-8 col-sm-6  NoPadding">                                    
                                        < SystemSecurityModal />
                                    </div>
                                      
                                    {this.state.userID?
                                    <a href="/cart" className="col-4 col-sm-6 cartHeader NoPadding">        
                                        <div className="row">
                                            <div className="col-3 p-2 cartImg">
                                                <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                                            </div>
                                            <div className="col-8 text-center NoPadding">
                                                <div className="col-12 cartText pt-1 text-uppercase NoPadding">Shopping Cart</div>
                                                <div className="col-12 cartCount NoPadding">
                                                    {this.props.cartCount>0? this.props.cartCount : 0 }
                                                    &nbsp;item(s)                                
                                                </div>
                                            </div>  
                                        </div>
                                    </a>
                                    :
                                    <a href="" className="abc col-4 col-sm-6 cartHeader NoPadding" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">        
                                        <div className="row">
                                            <div className="col-3 p-2 cartImg">
                                                <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                                            </div>
                                            <div className="col-8 text-center NoPadding">
                                                <div className="col-12 cartText pt-1 text-uppercase NoPadding">Shopping Cart</div>
                                                <div className="col-12 cartCount NoPadding">
                                                    {this.props.cartCount>0? this.props.cartCount : 0 }
                                                    &nbsp;item(s)                                
                                                </div>
                                            </div>  
                                        </div>
                                    </a>
                                    }
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
                            <div id="collapsibleNavbar" className="collapse navbar-collapse navHeaderCollapse mt-2">
                                <Megamenu />
                            </div>
                        </div>                    
                    </div>
                </nav>
                
                <DisplayLocation />
                
                {!this.state.loading&&<DeliveryLocationPopup  homeFirstVisit={this.state.homeFirstVisit}/>}
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
        cartCount        :  state.data.cartCount,
    });
  
  const mapDispatchToProps = {
    updateCartCount             : updateCartCount,
    setProductApiUrl            : setProductApiUrl,
    setSampurnaWebsiteDetails   : setSampurnaWebsiteDetails
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);