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
       this.getCategoriesData();
       var userId = localStorage.getItem('user_ID');
       this.setState({
           "userID": userId
       })
        // console.log("***this.props.recentCartData()===",this.props.recentCartData);
        // document.getElementById("tableSearch").focus();        
    }
    getCategoriesData(){
        axios.get('/api/category/get/list')
        .then((response)=>{
            // console.log("categorydata == ",response.data);
            this.setState({
                categorydata:response.data
                });
        })
        .catch(function(error){
          console.log(error);            
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
                                        {/* <img src="/images/eCommerce/kokilaLogo.png" className="responsive logoImg"></img>  */}
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

                                <div className="rightNavbar ml-4 mr-4 col-12 col-sm-6 NoPadding">                                
                                    <div className="col-12 NoPadding">  
                                        <div className="row"> 
                                            <select name="category_product" className=" col-3 category-selection">
                                                <option value="">All Category</option>
                                                {Array.isArray(this.state.categorydata) && this.state.categorydata.map((category,index)=>{
                                                        return(
                                                            <option value="uncategorized" key={index}>{category.category}</option>                                         
                                                        )
                                                    }) 
                                                }
                                                
                                            </select>
                                            <input type="text" placeholder="What are you looking for?" 
                                            onChange={this.searchProducts.bind(this)} 
                                            className="form-control tableSearch col-8" ref="tableSearch" id="tableSearch" name="tableSearch" />
                                        </div>
                                        <div className="searchIcon"><i className="fa fa-search"></i></div>                                    
                                    </div>                                
                                </div>

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
                                                    <Link href="/cart">
                                                        <a className=" " title="Go to cart page" >
                                                            <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                                                        </a>
                                                    </Link>
                                                :
                                                <Link href="/cart">
                                                    <a className=" " title="Go to cart page" >
                                                        <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                                                    </a>
                                                </Link>
                                                }
                                                </div>
                                                <div className="col-8 text-center NoPadding">
                                                    <div className="col-12 cartText pt-1 text-uppercase NoPadding">Shopping Cart</div>
                                                    <div className="col-12 cartCount NoPadding">
                                                        {this.props.recentCartData.length>0? this.props.recentCartData[0].cartItems.length : 0 }
                                                        &nbsp;item(s)                                
                                                    </div>
                                                </div>  
                                            </div>
                                        </div>                                      
                                     
                                    {/* {this.state.userID?                                        
                                        <Link href="/cart">
                                            <a className=" " title="Go to cart page" >
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
                                        <a href="" className=" " data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">
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
                                    } */}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div className="col-12 NoPadding">
                        <div className="navbar-header">                 
                            {/* <button className="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>    */}
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