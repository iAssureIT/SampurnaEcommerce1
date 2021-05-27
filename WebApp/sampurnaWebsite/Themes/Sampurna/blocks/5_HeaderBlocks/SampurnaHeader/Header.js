import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import Router                 from 'next/router'; 

import { connect }            from 'react-redux';
import { getCartData,updateCartCount,setProductApiUrl,setSampurnaWebsiteDetails }     from '../../../../../redux/actions/index.js'; 
import  store                 from '../../../../../redux/store.js';
import parse, { domToReact }  from 'html-react-parser';
import Searchbar              from './Searchbar.js';
import Megamenu               from './Megamenu.js';
import DeliveryLocationPopup  from './DeliveryLocationPopup.js';
import DisplayLocation        from './DisplayLocation.js';
import SystemSecurityModal    from './SystemSecurityModal.js';


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
        var deliveryLocation = false;
        this.getCartCount();
        if(sampurnaWebsiteDetails){
            if(sampurnaWebsiteDetails.deliveryLocation){
                var deliveryLocation =  sampurnaWebsiteDetails.deliveryLocation;
                // console.log("deliveryLocation = ",deliveryLocation);
            }
            store.dispatch(setSampurnaWebsiteDetails(sampurnaWebsiteDetails)) ;


            //======= Get User Data ===========
            var user_id = sampurnaWebsiteDetails.user_id;       
            if(user_id === null){
                this.setState({
                    "userID": user_id,
                },()=>{
                    this.props.getCartData();
                    this.props.getWishlistData();
                })     
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
        // console.log("inside cart count");
        const userid = localStorage.getItem('user_ID');
        axios.get("/api/carts/get/count/" + userid)
          .then((response) => {
            //   console.log("cartcount--",response.data);
            store.dispatch(updateCartCount(response.data));
          })
          .catch((error) => {
            console.log("error",error);
          })
      }
    
    searchProducts() {        
          var searchstr = this.refs.tableSearch.value.trim();
          if(searchstr){          
            var productApi = "/api/products/get/search/" + searchstr;
            store.dispatch(setProductApiUrl(productApi));
            Router.push('/search-product');          
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
                                <div className="col-4 col-sm-2 mr-4 logoBlock NoPadding">
                                <Link href="/">
                                    <a title="navbar-brand Sitelogo ">
                                        <Image
                                            src="/images/eCommerce/multistoreLogo.png"
                                            className={"img-responsive logoImg hidden-x"}
                                            height ={30}
                                            width={120}
                                            layout="responsive"
                                        />
                                    </a>
                                </Link>
                                </div>

                                <Searchbar />

                                <div className="col-8 col-sm-3 ml-4 systemSecurity"> 
                                    <div className="row">
                                    <div className="col-8 col-sm-6  NoPadding">                                    
                                        < SystemSecurityModal />
                                    </div>
                                    <div className="col-4 col-sm-6 cartHeader NoPadding">                                      
                                        <div className="col-12" >
                                            <div className="row">
                                                <div className="col-3 p-2 cartImg">  
                                                {this.state.userID?
                                                    <Link >
                                                        <a href="/cart">
                                                           <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                                                        </a>
                                                    </Link>
                                                :
                                                    <Link href="/cart" className="cartIcon">
                                                        <a href="/cart">
                                                            <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img> 
                                                        </a>
                                                    </Link>
                                                }
                                                </div>
                                                <div className="col-8 text-center NoPadding">
                                                    <div className="col-12 cartText pt-1 text-uppercase NoPadding">Shopping Cart</div>
                                                    <div className="col-12 cartCount NoPadding">
                                                        {this.props.cartCount>0? this.props.cartCount : 0 }
                                                        &nbsp;item(s)                                
                                                    </div>
                                                </div>  
                                            </div>
                                        </div> 
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
    updateCartCount                : updateCartCount,
    setProductApiUrl            : setProductApiUrl,
    setSampurnaWebsiteDetails   : setSampurnaWebsiteDetails
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);