import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import $                      from 'jquery';
import Style                  from './Header.module.css';

class Wishlist extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            currentUrl:''
         }
    }    
    componentDidMount(){
        let defaultUrl=window.location.href.replace(/.*\/\/[^\/]*/, '');
        this.setState({
            currentUrl:defaultUrl,
        })
        var userDetails    =  JSON.parse(localStorage.getItem('userDetails'));
        if(userDetails){
            this.setState({
                userID : userDetails.user_id,
                authService : userDetails.authService
            },()=>{
            })
        }
    }  

   render(){
        return(  
            <div className="row">
            {this.state.userID && this.state.authService !== "guest"?
                <div  className={"d-block " + Style.wishListIconWrapper} 
                     onClick={()=>{
                            (   this.state.currentUrl==="/my-account#v-pills-settings-tab"
                                ||this.state.currentUrl==="/my-account#v-pills-settings1-tab"
                                ||this.state.currentUrl==="/my-account#v-pills-settings3-tab"
                                ||this.state.currentUrl==="/my-account")
                                    ? 
                                        window.location.reload() 
                                    :   null 
                                }
                            }>
                  <Link className="" href="/my-account#v-pills-settings1-tab">
                     <a title="wishlistIcon " className="leftf ">
                        <img
                        src={"/images/eCommerce/wishlist.png"}
                        className={Style.wishListIcon}
                        layout={'intrinsic'}
                        />
                    </a>
                   </Link>
                </div>  
             :
                null
            }  
            </div>
        );        
    }
} 
  export default Wishlist;