import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';

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
    }

   render(){
        return(  
            <div className="col-12 NoPadding my-auto">
              {/* <li  onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}> */}
                  <Link href="/my-account#v-pills-settings1-tab"onClick={()=>{this.state.currentUrl==="/"? null : window.location.reload()}}>
                     <a title="wishlistIcon " className="leftf ">
                        <Image
                        src={"/images/eCommerce/wishlist.png"}
                        className={" hidden-x rotateImg " }
                        height ={25}
                        width={30}
                        layout={'intrinsic'}
                        />
                    </a>
                   </Link>
             {/* </li>                                */}
            </div>
        );        
    }
} 
  export default Wishlist;