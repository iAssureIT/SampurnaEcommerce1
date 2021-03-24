import React from 'react';
import "./BlogContent.css";


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
		//console.log("dat a in chaild comp",this.props.blogContent)
		return (
          	<div className="container-fluid" style={{padding:"0px"}}>

				<div className="col-lg-12">
					<div  className="col-lg-8 col-lg-offset-2 blogBox">
    					<div dangerouslySetInnerHTML={ { __html: this.props.blogContent } }></div>
					</div>
				</div>

				{/*<div className="col-lg-8 col-lg-offset-2">
				<hr/>
					<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
						<img className="img-responsive userImgB" src={this.state.user[0].userimg} alt="Bannerpng"/>
					</div>
					<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 NOpadding">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
							<div className="row">
								<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 ">
									<h5><b>{this.state.user[0].userName}</b></h5>
									<h6 className="graycolor">{this.state.user[0].date}</h6>
								</div>
								
							</div>
							<p className="graycolor">{this.state.user[0].UserDes}</p>
							<div className="userbtn">All Author Post</div>

						</div>

					</div>
				</div>*/}
					
			</div>
		);
	}
}
