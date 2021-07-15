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
    }
    

   render(){
        return(  
            <div className="col-12 NoPadding my-auto">
              <li  className="d-block" onClick={()=>{(this.state.currentUrl==="/my-account#v-pills-settings-tab"||this.state.currentUrl==="/my-account#v-pills-settings1-tab"||this.state.currentUrl==="/my-account#v-pills-settings3-tab"||this.state.currentUrl==="/my-account")? window.location.reload() :null }}>
                  <Link className="bottom" href="/my-account#v-pills-settings1-tab">
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
             </li>                               
            </div>
        );        
    }
} 
  export default Wishlist;