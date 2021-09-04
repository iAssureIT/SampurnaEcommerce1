import React 		from 'react';
import axios 		from 'axios';
import $ 			from 'jquery';
import swal 		from 'sweetalert';
import BannerView from './BannerView.js';
import './Banner.css';
import CmsBlocks from '../../createnewblock/Cmsblock.js';

export default class Banner extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
		 		formTitle 	    : "",
				
		 }
	}
	componentDidMount(){

    }
    render(){
        return(
            <div className="container ">
                    < BannerView />
                    
            </div>
        );
    }
}