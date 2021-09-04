import React, {Component} from 'react';
import { Link } from 'react-router-dom';
/*import Cmspage from '../../cmspage';*/
import "./sidebar.css";

/*import { Route } from 'react-router';
import Cmspage from '../../cmspage';*/

export default class Sidebar extends Component{
	constructor(props){
		super(props);
		this.state = {
			
		};		
	}

	render(){
		return (
			<div className="row">
				<div className="logocms">
				</div>
				<div className="upper">
					<ul className="navbar-primary-menu">
					    <li>
					       
					       <Link to="/cmspage" className="ptop65">Dashboard</Link>
					        <Link to="/viewpage1">Create New Page</Link>
					        <Link to="/static-block-list">Static Blocks</Link>
					        <Link to="/cmspage">List of Page</Link>
					        <Link to="/cmspage">List of block</Link>
					       
					       
					    </li>
					</ul>
				
				</div>
		
			</div>

		);
	};
}


