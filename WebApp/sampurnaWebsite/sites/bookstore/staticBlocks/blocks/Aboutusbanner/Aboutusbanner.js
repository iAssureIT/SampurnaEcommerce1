import React, { Component } from 'react';
import "./Aboutusbanner.css";

export default class Aboutusbanner extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	
	    };
  	}  
  render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<div className="row">
					<div className="aboutusbanner">
						<p className="col-lg-12 aboutheading">ABOUT US</p>
						<ul className="breadcrumb aboutbread">
						  <li><a href="/" title="GO TO HOME PAGE">HOME</a></li>
						  <li>ABOUT US</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}