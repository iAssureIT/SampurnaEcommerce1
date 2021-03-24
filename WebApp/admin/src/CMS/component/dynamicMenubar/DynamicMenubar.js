import React 		from 'react';
import axios 		from 'axios';
import $ 			from 'jquery';
import swal 		from 'sweetalert';
import MenuForm from './CreateMenubar/MenuForm.js';
// import './MenuForm.css';

export default class DynamicMenubar extends React.Component {
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
                    < MenuForm />
            </div>
        );
    }
}
// export default DynamicMenubar;