import React from 'react';

import BlogsForm      from "../Componant/BlogsForm/BlogsForm.js";


export default class BlogsFormPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
        		<div className="container-fluid" style={{padding:"0px"}}>
        			<div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 pageblockheading">
			            <div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 pageblockheadingbox">
			                <h2 className="text-center">Create Blog </h2>
			            </div>
			          </div>
        			<BlogsForm/>
				</div>
		);
	}
}
