import React, { Component } from 'react';

import CircleMenuBars from '../circlemenubars.js';
//import Selectpagedesign from '../selectpagedesign/selectpagedesign.js';ListOfPages
import ListOfPages from '../ListOfPages/ListOfPages.js';
import 'bootstrap/js/collapse.js';
class ViewPage1 extends Component {
   


    render() {
        return (
        		<div>	
					<div className="contentWrapper">
						<div className="">{/*pageContent*/}
							<div className="">
								
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bglightgclr">
									<CircleMenuBars />
								</div>
								
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgwhitclr">
									<ListOfPages/>
								</div>
							</div>
						</div>
					</div>
					
				</div>
            
        );
    }
}

export default ViewPage1;
