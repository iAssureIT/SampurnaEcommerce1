import React from 'react';


import KeyFeatures from '../blockTemplate/KeyFeatures/KeyFeatures.js';
import TechnologyStack from '../blockTemplate/TechnologyStack/TechnologyStack.js';
import QualityPerformanceSecurity from '../blockTemplate/QualityPerformanceSecurity/QualityPerformanceSecurity.js';



export default class Homepage extends React.Component{

	constructor(props){
		super(props);
        this.state = {

        }
	}

	render(){
		return(
			<div className="container-fluid">
				<KeyFeatures/>
				<TechnologyStack/>
				<QualityPerformanceSecurity/>
			</div>
		);
	}
}