import React 		  from 'react';
import axios 		  from 'axios';
import Link           from 'next/link';
// import $, { event }   from 'jquery';
import swal 		  from 'sweetalert';
import Image          from 'next/image';
import Router from 'next/router'; 

import { connect }         from 'react-redux';
import { getCartData,getWishlistData,setProductApiUrl }     from '../../../../../redux/actions/index.js'; 
import  store              from '../../../../../redux/store.js'; 

// import {withRouter} from 'react-router-dom'; 
import parse, { domToReact } from 'html-react-parser';
import Megamenu            from './Megamenu.js';
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
            <div className="col-12 headerWrapper NoPadding">
            <div className="col-12 NoPadding multilevelType2MenuWrapper"> 
            <header>
                <nav className="navbar navbar-expand-md navbar-dark megamenu">
                    <div className="col-12 top-header">
                        <div className="container-fluid logoWrap">
                            <div className="col-xl-2 col-sm-3 col-xs-6 logoBlock NoPadding">
                            <Link href="/">
                                <a title="navbar-brand BookStore logo ">
                                    {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img>  */}
                                    <Image
                                        src="/images/eCommerce/multistoreLogo.png"
                                        className={"img-responsive logoImg hidden-x"}
                                        height ={20}
                                        width={80}
                                        layout="responsive"
                                    />
                                </a>
                            </Link>
                            </div>

                            <div className="rightNavbar col-xl-5 col-sm-5 col-xs-12 NoPadding">                                
                                <div className="col-12 NoPadding">   
                                    <input type="text" placeholder="Search your book here.." 
                                    onChange={this.searchProducts.bind(this)} 
                                    className="form-control tableSearch col-12" ref="tableSearch" id="tableSearch" name="tableSearch" />
                                    <div className="searchIcon"><i className="fa fa-search"></i></div>                                    
                                </div>                                
                            </div>

                            <div className="col-xl-3 col-sm-4 col-xs-8 systemSecurity pull-right">                                
                                <div className="col-xl-7 col-sm-8 col-xs-8 call_img NoPadding">                                    
                                    < SystemSecurityModal />
                                </div>
                                <div className="col-xl-5 col-sm-4 col-xs-4 call_img NoPadding pull-right">
                                {this.state.userID?
                                    <Link href="/cart">
                                        <a className="col-xl-7 col-sm-10 col-xs-10 pull-right " title="Go to cart page" >
                                            {/* <img src="/images/cart.webp" className="rotateImg img-responsive" /> */}
                                            <Image
                                                src="/images/eCommerce/cart.png"
                                                className={"rotateImg"}
                                                height ={20}
                                                width={20}
                                                layout="responsive"
                                            />
                                            <span className="cart-count">
                                                {this.props.recentCartData.length>0? this.props.recentCartData[0].cartItems.length : 0}                                
                                            </span>
                                        </a>
                                    </Link>
                                    :                                    
                                    <a href="" className="col-xl-7 col-sm-10 col-xs-10 pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">
                                        {/* <img src="/images/cart.webp" className="rotateImg" /> */}
                                        <Image
                                            src="/images/eCommerce/cart.png"
                                            className={"rotateImg img-responsive"}
                                            height ={20}
                                            width={20}
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
                    <div className="col-12 ">
                        <div className="navbar-header">                 
                            {/* <button className="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>    */}
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                <span class="navbar-toggler-icon"></span>
                            </button>                             
                        </div>
                        
                        {/* <div id="collapsibleNavbar" className="collapse navbar-collapse navHeaderCollapse">
                            <Megamenu />
                        </div> */}
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