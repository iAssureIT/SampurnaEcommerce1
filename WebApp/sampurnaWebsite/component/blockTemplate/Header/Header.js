import React 		  from 'react';
import axios 		  from 'axios';
import Link           from 'next/link';
// import $, { event }   from 'jquery';
import swal 		  from 'sweetalert';
import Image          from 'next/image';

import Router from 'next/router'; 

import { connect }         from 'react-redux';
import { getCartData,getWishlistData,setProductApiUrl }     from '../../../redux/actions/index.js'; 
import  store              from '../../../redux/store.js'; 
// import { changeCartCount } from '../../../redux/actions/index'; 

// import {withRouter} from 'react-router-dom'; 
import parse, { domToReact } from 'html-react-parser';
import Megamenu            from './Megamenu.js';
import LoginSignUp         from './SystemSecurityModal.js';
import SystemSecurityModal from './SystemSecurityModal.js';


class Header extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            multilevelMenuData : {},	
            multilevelMenuData : [],  
            userID             : "",   
         }
    }    
	 async componentDidMount(){
       await this.props.getCartData();
       await this.props.getWishlistData();
       var userId = localStorage.getItem('user_ID');
       this.setState({
           "userID": userId
       })
        // console.log("***this.props.recentCartData()===",this.props.recentCartData);
        // document.getElementById("tableSearch").focus();        
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headerWrapper NoPadding">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding multilevelType2MenuWrapper"> 
            <header>           
                <nav className="navbar navbar-inverse navbar-fixed-top1 megamenu">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 top-header">
                        <div className="container-fluid logoWrap">
                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-4 logoBlock NoPadding">
                            <Link href="/">
                                <a title="BookStore logo ">
                                    {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img>  */}
                                    <Image
                                        src="/images/eCommerce/multistoreLogo.png"
                                        className={"img-responsive logoImg hidden-x"}
                                        height ={50}
                                        width={200}
                                        layout="responsive"
                                    />
                                </a>
                            </Link>
                            </div>

                            <div className="rightNavbar col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-4 col-sm-offset-1 col-xs-12 NoPadding">                                
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">   
                                    <input type="text" placeholder="Search your book here.." 
                                    onChange={this.searchProducts.bind(this)} 
                                    className="form-control tableSearch col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="tableSearch" id="tableSearch" name="tableSearch" />
                                    <div className="searchIcon"><i className="fa fa-search"></i></div>                                    
                                </div>                                
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-4 col-xs-8 systemSecurity pull-right">                                
                                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-7 call_img NoPadding">                                    
                                    < SystemSecurityModal />
                                </div>
                                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-5 call_img NoPadding pull-right">
                                {this.state.userID?
                                    <Link href="/cart">
                                        <a className="col-lg-7 col-md-7 col-sm-10 col-xs-10 pull-right " title="Go to cart page" >
                                            {/* <img src="/images/cart.webp" className="rotateImg img-responsive" /> */}
                                            <Image
                                                src="/images/cart.png"
                                                className={"rotateImg"}
                                                height ={40}
                                                width={40}
                                                layout="responsive"
                                            />
                                            <span className="cart-count">
                                                {this.props.recentCartData.length>0? this.props.recentCartData[0].cartItems.length : 0}                                
                                            </span>
                                        </a>
                                    </Link>
                                    :                                    
                                    <a href="" className="col-lg-7 col-md-7 col-sm-7 col-xs-10 pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">
                                        {/* <img src="/images/cart.webp" className="rotateImg" /> */}
                                        <Image
                                            src="/images/cart.png"
                                            className={"rotateImg img-responsive"}
                                            height ={40}
                                            width={40}
                                            layout="responsive"
                                        />
                                        <span className="cart-count">
                                            {this.props.recentCartData.length>0? this.props.recentCartData[0].cartItems.length : 0}                                
                                        </span>
                                    </a>
                                    
                                }
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div className="container-fluid ">
                        
                        <div className="navbar-header">                 
                            <button className="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>                                
                        </div>
                        
                        <div className="collapse navbar-collapse navHeaderCollapse">
                            <Megamenu />
                        </div>
                        </div>                    
                </nav>
            </header>
            </div>
        </div>         
        );        
    }
}

const mapStateToProps = state => (
    // console.log("1. state in header====",state.data),
    {
        recentCartData :state.data.recentCartData,
        recentWishlistData: state.data.recentWishlistData  
    });
  
  const mapDispatchToProps = {
    getCartData: getCartData,
    getWishlistData:getWishlistData,
    setProductApiUrl : setProductApiUrl
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);