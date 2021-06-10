import React 		          from 'react';
import axios 		          from 'axios';
import Link                   from 'next/link';
import swal 		          from 'sweetalert';
import Image                  from 'next/image';

class Wishlist extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
             
         }
    }    
    componentDidMount(){

    }

   render(){
        return(  
            <div className="col-2 NoPadding">
                <Link href="/wishlist">
                    <a title="wishlistIcon ">
                        <Image
                            src={"/images/eCommerce/wishlist.png"}
                            className={"logoImg hidden-x"}
                            height ={30}
                            width={50}
                            layout={'intrinsic'}
                        />
                    </a>
                </Link>
            </div>
        );        
    }
} 
  export default Wishlist;