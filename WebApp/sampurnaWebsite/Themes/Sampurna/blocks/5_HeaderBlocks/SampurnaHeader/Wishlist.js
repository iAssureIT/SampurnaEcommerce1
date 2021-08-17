import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';
import $                    from 'jquery';

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
            <div className="col-12 NoPadding my-auto">
            {this.state.userID && this.state.authService !== "guest"?
                <li  className="d-block" onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                  <Link className="bottom" href="/my-account#v-pills-settings1-tab">
                     <a title="wishlistIcon " className="leftf ">
                        <Image
                        src={"/images/eCommerce/wishlist.png"}
                        className={" hidden-x " }
                        height ={25}
                        width={30}
                        layout={'intrinsic'}
                        />
                    </a>
                   </Link>
                </li>  
             :null
            //  <li  className="d-block" >
            //          <a href="" data-toggle="modal" data-target="#loginFormModal" data-backdrop="false" id="loginModal" title="Please Login">
            //             <Image
            //             src={"/images/eCommerce/wishlist.png"}
            //             className={" hidden-x " }
            //             height ={25}
            //             width={30}
            //             layout={'intrinsic'}
            //             />
            //         </a>
            //  </li> 
             }

            </div>
        );        
    }
} 
  export default Wishlist;