import React, {Component} 		from 'react';
import $, { css } 				from 'jquery';


import StdBlockTitleBlack       from '../../8_Common/StdBlockTitleBlack/StdBlockTitleBlack.js';


import S     					from './AddressOnGoogleMap.module.css';


export default class AddressOnGoogleMap extends Component{

	constructor(props){
        super(props);
        this.state = {
			blocks: {
				"blockType"          : "7_Widgets",
				"blockComponentName" : "AddressOnGoogleMap",
				"blockTitle"         : "OUR LOCATION",
				"blockSubTitle"      : "",
				"blockDescription"   : "",
				"bgImage"            : "",
				"fgImage"            : "",
			},
			blockID  : "",
			block_id : ""
        };
	}

	componentDidMount(){
		$("#mapouter").show();
		$("#mapouterxs").show();
	}

	render(){
		return(
			<section className={"col-12 "+S.addressOnGoogleMapWrapper}>
				<div className="row">
					<StdBlockTitleBlack blockTitle={this.state.blocks.blockTitle} />
					<div className={"col-12 demogmap_canvas "+S.demogmap_canvas}>
						<div className={"mapouter "+S.mapouter} id="mapouter">
							<div className={"gmap_canvas "+S.gmap_canvas}>
								<iframe width="100%" height="480" id="gmap_canvas" title="gmap_canvas" src="https://maps.google.com/maps?q=iAssureIT%20hadapsar&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"> </iframe>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}