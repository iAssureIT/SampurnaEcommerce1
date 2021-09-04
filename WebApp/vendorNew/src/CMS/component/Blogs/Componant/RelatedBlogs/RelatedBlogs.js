import React from 'react';
import "./RelatedBlogs.css";

export default class RelatedBlogs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

			"Blogs"		: [

							{
								blogDate:"March 7,2017",
								blogTitle:"Real Time Design Tool",
								blogPara:"I was surprised how many people spoke English...",
								blogwritter:"John Doe",
								buBlogger:"Blogger",
								bloggerImg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user1.png",
								blogImg:"/images/ceo.png"
							},
							{
								blogDate:"March 7,2017",
								blogTitle:"Real Time Design Tool",
								blogPara:"I was surprised how many people spoke English...",
								blogwritter:"John Doe",
								buBlogger:"Blogger",
								bloggerImg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user.png",
								blogImg:"/images/blog1.jpeg"
							},
							{
								blogDate:"March 7,2017",
								blogTitle:"Real Time Design Tool",
								blogPara:"I was surprised how many people spoke English...",
								blogwritter:"John Doe",
								buBlogger:"Blogger",
								bloggerImg:"https://wealthyvia.s3.ap-south-1.amazonaws.com/website/user1.png",
								blogImg:"/images/help.jpg"
							},
						  ]
	};
}

	render() {
		var data = this.state.Blogs;
		return (
          	<div className="container-fluid RelatedBlogsBox" style={{padding:"0px"}}>
          		<div className="col-lg-12 mtop75">
	          		<div className="col-lg-12">
	          			<h5 className="text-center" style={{marginBottom:"27px"}}> RELATED POSTS</h5>
	          		</div>
	          		<div className="col-lg-12">
	          		{
		                		data && data.length > 0 ?
				      				data.map((data, index=1)=>{
		                					return(
							          			<div className="col-lg-4">
							          				<div className="col-lg-12 rblog">
							          					<div className="r1blog1">
															<img className="img-responsive blogImgB" src={data.blogImg} alt="Bannerpng"/>
															<p className="blogDate p10 mtop20 graycolor">{data.blogDate}</p>
															<h4 className="blogTitle p10"><b>{data.blogTitle}</b></h4>
															<p className="blogPara p10 graycolor">{data.blogPara}</p>
															<hr/>
															{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop10">
																<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
																	<img className="img-responsive imgRoundrb" src={data.bloggerImg}  alt="Bannerpng"/>
																</div>
																<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 row">
																	<p><b>{data.blogwritter}</b></p>
																	<p className="graycolor">{data.buBlogger}</p>
																</div>
															</div>*/}
														</div>
							          				</div>
							          			</div>
							          			);
	                					})
	                				:
	                				null
		                		}				
	          		
	          		</div>
          		</div>
			</div>
		);
	}
}
