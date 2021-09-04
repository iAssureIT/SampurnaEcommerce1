import React from 'react';
import "./SingleBlogBanner.css";
import axios        from 'axios';
import swal from 'sweetalert';

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
	console.log("url delet",URL);
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
		{console.log(" img path ===>",encodeURI(this.props.bannerImage))}
		console.log(" img path ===>",this.props.blogURL);
		return (
			<div className="col-lg-12 nopadding sbbannerWall" style={{backgroundImage:'url('+encodeURI(this.props.bannerImage)+')'}}>
				<div className="middle">									    
			    {/*	<a href={"/cms/blogs-form/"+this.props.blogURL} className="hoverbk"><i className="fa fa-pencil wclr"></i></a>
			    	<i className="fa fa-trash rclr hoverbbk" url={this.props.blogURL} onClick={this.deleteBlog.bind(this)}></i>
			 	*/}
			 	</div>
				<div className="col-lg-12 sbcentered">
					<div className="col-lg-12 sbbtextcentered">
						<h1 className="fs72">{this.props.blogTitle}</h1>
						<p className="col-lg-8 col-lg-offset-2 fs24"> {/*When you are alone for days or weeks at a time, you eventually become
							drawn to people. Talking to randos is the norm. After a long time I could
							witness the sunrise. I could feel the sun rays falling on my body.*/}{this.props.summary}</p>

					</div>
					

				</div>
			</div>
		);
	}
}
