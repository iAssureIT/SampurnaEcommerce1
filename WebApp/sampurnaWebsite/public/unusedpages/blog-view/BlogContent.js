import React from 'react';

export default class BlogContent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			"user": [
						{
							userimg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user1.png",
							userName:"Joan Doe",
							UserDes:"Based in New York, Uncode is a blog by John Doe. His posts explore modern web design and development through photos and quotes by influential architects, engineers, and creatives."
						}
					]
		};
	}

	render() {
		// console.log("dat a in chaild comp",this.props.blogContent)
		return (
          	<div className="container-fluid" style={{padding:"0px"}}>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
					<div  className="col-lg-10 col-md-10 col-sm-12 col-xs-12 col-lg-offset-1 blogBox">
    					<div dangerouslySetInnerHTML={ { __html: this.props.blogContent } }></div>
					</div>
				</div>					
			</div>
		);
	}
}

