import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
import Style                  from './HeaderNew.module.css';
import { updateCartCount,setProductApiUrl,setSampurnaWebsiteDetails }   from '../../../../../redux/actions/index.js'; 

class MyCart extends React.Component { 
	constructor(props) {
		super(props);
		 this.state = {
            userID : '',
         }
    }    
    componentDidMount(){
        var userDetails    =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            this.setState({
                userID : userDetails.user_id
            },()=>{
                this.props.updateCartCount();
            })
        }
    }
   render(){
        return(  
            <div className="col-12 h-100">
                    {this.state.userID?
                        <div className={"row h-100 " + Style.cartIconWrapper}>  
                            <div className="col-8">
                                <a href="/cart" className="row">
                                    <img
                                    src={"/images/eCommerce/cart.png"}
                                    className={Style.cartLogo}
                                    layout={'intrinsic'}
                                    />
                                </a>
                                {this.props.cartCount> 0 &&
                                    <span className={Style.cartCountWrapper}>
                                        {this.props.cartCount>0? this.props.cartCount : 0 }
                                    </span>                               
                                }
                            </div>
                        </div>
                        :
                        <div className="row">
                             <div className="col-10">
                                <div className="row">
                                    <a href="" data-toggle="modal" data-target="#loginFormModal" 
                                       data-backdrop="false" id="loginModal" title="Please Login">
                                        <img
                                        src={"/images/eCommerce/cart.png"}
                                        className={Style.cartIcon}
                                        layout={'intrinsic'}
                                        />
                                    </a>
                                    {this.props.cartCount> 0 &&
                                        <span className={Style.cartCountWrapper}>
                                            {this.props.cartCount>0? this.props.cartCount : 0 }
                                        </span>                               
                                    }
                                </div>
                            </div>
                        </div>
                    }
            </div>
        );        
    }
} 

const mapStateToProps = state => (
    {
        cartCount          : state.data.cartCount,
    });
  
    const mapDispatchToProps = {
      updateCartCount  : updateCartCount,
    };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(MyCart);