import React from 'react';
import Style from "./AddressOnGoogleMap.module.css";

 import $, { css } from "jquery";  //for next js

export default class AddressOnGoogleMap extends React.Component {


	constructor(props) {
		super(props);
	}
	componentDidMount(){
		// document.getElementById('mapouter').show();
		// document.getElementById('mapouterxs').show()

		  $("#mapouter").show();
		  $("#mapouterxs").show();
		  

	}
	render() {
		return (
			<div className={"gmapwrapper "+Style.gmapwrapper}>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className={"text-center Glocationmap "+Style.Glocationmap}>
					<div className={"title4 "+Style.title4}>
                      <h2 className={"row globalMainTitle  title_inner4 lang_trans globalMainTitle "+Style.textAlign} data-trans="#blog_1554730795823_title">Our Location</h2>
                      <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                      <div className={"line "+Style.line}><span className={Style.span}></span></div>
				   </div>
				</div>
				</div>
				<div className={"demogmap_canvas col-md-12 col-lg-12 col-sm-12 col-xs-12 "+Style.demogmap_canvas}>
					<div className={"mapouter "+Style.mapouter} id="mapouter">
						<div className={"gmap_canvas "+Style.gmap_canvas} >
							<iframe width="100%" height="480" id="gmap_canvas" title="gmap_canvas" src="https://maps.google.com/maps?q=iAssureIT%20hadapsar&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0">
							</iframe>
							
						</div>
					</div>
					
				</div>

				</div>
		);
	}
}




				
				


