import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import { connect }            from 'react-redux';
import  store                 from '../../../../../redux/store.js';
import { updateCartCount,setProductApiUrl,setSampurnaWebsiteDetails }     from '../../../../../redux/actions/index.js'; 

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
                userID : userDetails.userid
            })
            // axios.get("/api/entitymaster/getCompany/1")
            //     .then((response) => {
            //         if(response.data){
            //             console.log("CompanySettings--",response.data);
            //             this.setState({
            //                 CompanyLogo : response.data.companyLogo[0]
            //             },()=>{
            //                 console.log("CompanyLogo==",this.state.CompanyLogo);
            //             });
            //         }
            //     })
            //     .catch((error) => {
            //     console.log("error1",error);
            //     })
        }

    }
    getCartCount() {
        // console.log("inside cart count");
        const userid = localStorage.getItem('user_ID');
        if(userid){
            axios.get("/api/carts/get/count/" + userid)
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
            <div className="col-4 NoPadding">
            {this.state.userID?
                <a href="/cart" className="col-12 col-sm-6 cartHeader NoPadding">        
                    <div className="row">
                        <div className="col-3 p-2 cartImg">
                            <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            {this.props.cartCount>0? this.props.cartCount : 0 }
                            &nbsp;                                
                        </div>
                    </div>
                </a>
                :
                <a href="" className="abc col-12 col-sm-6 cartHeader NoPadding" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">   
                    <div className="row">
                        <div className="col-3 p-2 cartImg">
                            <img className="img-responsive rotateImg" src="/images/eCommerce/cart.png"></img>
                        </div>
                        <div className="col-2 cartCount NoPadding">
                            {this.props.cartCount>0? this.props.cartCount : 0 }
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
    // console.log("1. state in header====",state.data),
    {
        cartCount        :  state.data.cartCount,
    });
  
  const mapDispatchToProps = {
    updateCartCount             : updateCartCount,
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(MyCart);