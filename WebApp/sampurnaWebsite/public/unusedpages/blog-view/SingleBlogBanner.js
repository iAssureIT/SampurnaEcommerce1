import React from 'react';
import axios        from 'axios';
import swal from 'sweetalert';
import { isMoment } from 'moment';
import Style from './blog-view.module.css';
export default class SingleBlogBanner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"blogTitle":"",
		};
	}
	componentDidMount(){
		this.setState({
			/*"blogTitle":  this.props.blogTitle*/
		})
	}
	deleteBlog(event){
	event.preventDefault();
	var URL= this.props.blogURL;
	// console.log("url delet",URL);
	 swal({
          title: "Are you sure you want to delete this Blog?",
          text: "Once deleted, you will not be able to recover this Blog!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
            	axios
			    .delete("/api/blogs/delete/url/"+URL)
			    .then((response)=>{
			     	/*this.getBlogData();*/

			       swal("Your Blog is deleted!");
			       window.location.assign("/allblogs");
/*			       this.props.history.push("/allblogs");
*/			    })
			    .catch((error)=>{
			       console.log("error = ", error);              
			    });
            
              
            } else {
            swal("Your Blog is safe!");
          }
        }); 
}
	render() {
		// {console.log(" img path ===>",encodeURI(this.props.bannerImage))}
		// console.log(" img path ===>",this.props.blogURL);
		return (
			<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding sbbannerWall "+Style.sbbannerWall} style={{backgroundImage:'url('+encodeURI(this.props.bannerImage)+')'}}>
				<div className={"middle col-lg-12 col-md-12 col-sm-12 col-xs-12 "+Style.middle}>
				</div>
				<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 sbcentered "+Style.sbcentered}>
					<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 sbbtextcentered "+Style.sbbtextcentered}>
						<h1 className={"fs72 "+Style.fs72}>{this.props.blogTitle}</h1>
						{/* <h4 className="fs72 hidden-lg hidden-md ">{this.props.blogTitle}</h4> */}
						<p className={"col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 fs24 "+Style.fs24}>{this.props.summary}</p>
					</div>
				</div>
			</div>
		);
	}
}


