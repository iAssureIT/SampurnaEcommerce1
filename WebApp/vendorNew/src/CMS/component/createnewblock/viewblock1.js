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
				<div className="  ">
					<div className="br20">
						<div className="">
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bglightgclr">
								<CircleBlockMenuBars />
							</div>
							
							<div className=" ">
								<Staticblocks />
							</div>
						</div>
					</div>
				</div>
            
        );
    }
}

export default withRouter(ViewBlock_1);
