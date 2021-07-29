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
            <div className="col-12 NoPadding">
            {this.state.userID?
                <a href="/cart" className="row cartHeader">  
                        <div className="col-6 ml-4 topCart NoPadding">
                            <Image
                            src={"/images/eCommerce/cart.png"}
                            className={"rotateImg" }
                            height ={60}
                            width={100}
                            layout={'intrinsic'}
                        />
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            <div className="cartCountCircle">{this.props.cartCount>0? this.props.cartCount : 0 }</div>
                            &nbsp;                                
                        </div>
                </a>
                :
                <a href="" className="row cartHeader" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">
                        <div className="col-6 NoPadding ml-4">
                            <Image
                            src={"/images/eCommerce/cart.png"}
                            className={"rotateImg" }
                            height ={60}
                            width={100}
                            layout={'intrinsic'}
                        />
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            <div className="cartCountCircle ">{this.props.cartCount>0? this.props.cartCount : 0 }</div>
                            &nbsp;                                
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