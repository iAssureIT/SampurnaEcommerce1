import React from 'react';
import CircleBlockMenuBars from './circleblockmenubars.js';
import CmsBlock from "../createnewblock/Cmsblock.js"

export default class ViewBlock_2 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="contentWrapper">
					<div className="box-body">
						<div className="row">
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<CircleBlockMenuBars />
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<CmsBlock />
							</div>
						</div>
					</div>
				</div>
		);
	}
}
