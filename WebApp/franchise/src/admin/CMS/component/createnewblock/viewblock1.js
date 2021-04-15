import React, { Component } from 'react';
import CircleBlockMenuBars from './circleblockmenubars.js';
import {Route, withRouter} from 'react-router-dom';
// import SelectBlockDesign from '../selectblockdesign/selectblockdesign.js';
import Staticblocks from './Staticblocks.js';

class ViewBlock_1 extends Component {
  
   /* constructor(props) {
        super(props);
    }*/

    render() {
        return (
				<div className="contentWrapper  padd1520">
					<div className="pageContent br20">
						<div className="row">
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								{<CircleBlockMenuBars />}
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<Staticblocks />
							</div>
						</div>
					</div>
				</div>
            
        );
    }
}

export default withRouter(ViewBlock_1);
