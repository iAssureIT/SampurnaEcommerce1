import React from 'react';
import Moment                   from 'react-moment';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import SingleBlogBanner          from "./SingleBlogBanner.js";
import BlogContent               from "./BlogContent.js";

class BlogView extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			"blogTitle"      	  : "",
		    "summary"   	      : "",
		    "typeOfBlog"   	    : "",
		    "blogContent"       : "",
            "bannerImage"       : {},
            "viewCount"         : "",
		};
    } 
    componentDidMount(){  
        var locationURL = window.location.pathname;
        let blogURL = locationURL ? locationURL.split('/') : "";
        // console.log("response blogs blogURL 1==",blogURL[2]);	
        // console.log("response blogs blogURL 3==",blogURL[3]);		
          axios.get('/api/blogs/get/'+blogURL[2])
            .then((response)=>{
                // console.log("response blogs 27==",response.data);
              this.setState({
                "blogTitle"		:response.data.blogTitle,
                "summary"		:response.data.summary,
                "typeOfBlog"	:response.data.typeOfBlog,
                "blogContent"	:response.data.blogContent,
                "bannerImage"   :response.data.bannerImage.path ,
                "selectedUrl"   : blogURL[3]         
              })
            })
            .catch(function(error){
              console.log(error);
                if(error.message === "Request failed with status code 401")
                    {
                         swal("Your session is expired! Please login again.","", "error");
                    }
            })
          }
      

    render() {
        // console.log(this.props.match.params);
            return (
                <div className="container-fluid" style={{padding:"0px"}}>
                    <SingleBlogBanner blogTitle={this.state.blogTitle} summary={this.state.summary} bannerImage={this.state.bannerImage} blogURL={this.state.selectedUrl}/>
                    <div className="mt40 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                       {/* <label className="blogDateSBP pull-right date"><b>Date :</b> <Moment format="DD-MM-YYYY HH:mm" ><span className="date">{blogs.createdAt}</span></Moment></label> */}
                    </div>
                    <BlogContent blogContent={this.state.blogContent}/>             
                </div>
            )
    }
}

export default BlogView;