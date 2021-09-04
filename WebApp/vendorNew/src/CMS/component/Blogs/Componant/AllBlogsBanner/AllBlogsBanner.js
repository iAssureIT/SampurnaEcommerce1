import React from 'react';
import "./AllBlogsBanner.css";


export default class AllBlogsBanner extends React.Component {
	constructor(props) {
		super(props);
	}

	
render() {
		return (
			<div className="col-lg-12 nopadding AllBlogsbannerWall">
				<div className="col-lg-12 AllBlogscentered">
					<div className="col-lg-12 AllBlogstextcentered">
						<h1 className="fs72">Blogs</h1>
{/*						<button type="button" className="sbtn col-lg-2 col-lg-offset-5">Read More</button>
*/}						

					</div>
					

				</div>
			</div>
		);
	}
}

