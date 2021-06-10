import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
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
            <div className="col-3 NoPadding">
            {this.state.userID?
                <a href="/cart" className="col-12 cartHeader">        
                    <div className="row mtm3">
                        <div className="col-5 p-2 ml-4">
                            <img className=" cartImg rotateImg" src="/images/eCommerce/cart.png"></img>
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            <div className="cartCountCircle">{this.props.cartCount>0? this.props.cartCount : 0 }</div>
                            &nbsp;                                
                        </div>
                    </div>
                </a>
                :
                <a href="" className="abc col-12 cartHeader" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">   
                    <div className="row">
                        <div className="col-5 p-2 ml-4">
                            <img className="cartImg rotateImg" src="/images/eCommerce/cart.png"></img>
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            <div className="cartCountCircle ">{this.props.cartCount>0? this.props.cartCount : 0 }</div>
                            &nbsp;                                
                        </div>
                    </div>
                </a>
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