import React from 'react';
import SingleBlogBanner     from "./SingleBlogBanner.js";
import BlogContent          from "./BlogContent.js";
import Moment               from 'react-moment';
import axios                from 'axios';
import swal                 from 'sweetalert';
import getConfig            from 'next/config';
import Header               from '../../component/blockTemplate/Header/Header.js';
import Footer               from '../../component/blockTemplate/Footer/Footer.js';

const { publicRuntimeConfig } = getConfig();
var projectName = publicRuntimeConfig.CURRENT_SITE;
// import "../../static/bookstore/blocks/Blogview.css";

class Blog extends React.Component {

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
  // console.log("response blogs mani blogURL 2==",blogURL[2]);	
  // console.log("response blogs mani==",blogURL[3]);		
    axios.get('/api/blogs/get/'+blogURL[2])
      .then((response)=>{
      	// console.log("response blogs 38==",response.data);
        this.setState({
          "blogTitle"		:response.data.blogTitle,
          "summary"		  :response.data.summary,
          "typeOfBlog"	:response.data.typeOfBlog,
          "blogContent"	:response.data.blogContent,
          "bannerImage" :response.data.bannerImage.path          
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
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
        <Header/>
        <div className="container-fluid" style={{padding:"0px"}}>
          		<SingleBlogBanner blogTitle={this.state.blogTitle} summary={this.state.summary} bannerImage={this.state.bannerImage} blogURL={this.state.blogURL}/>
          	  <div className="mt40 col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <label className="blogDateSBP pull-right"><b>Date :</b> <Moment format="DD-MM-YYYY HH:mm">{this.props.createdAt}</Moment>
                </label>
              </div>
             <BlogContent blogContent={this.state.blogContent}/>             
		    </div>
        <Footer/>
      </div>
		);
	}
}

const getServerSideProps = async ({query}) => {
  // your data fetching logic
  const urlParam = query.blogId
  const res = await axios.get("/api/blogs/get/"+urlParam)
  const blogData = await res.data;
  return {
    props:{
      "blogTitle"		:blogData.blogTitle,
      "summary"		:blogData.summary,
      "typeOfBlog"	:blogData.typeOfBlog,
      "blogContent"	:blogData.blogContent,
      "bannerImage"   :blogData.bannerImage.path,
      "blogURL"       : urlParam   
    }
  }
}


// export async function getServerSideProps({query}){
//     //console.log("query",query)
//     const urlParam = query.blogId
//     const res = await axios.get("/api/blogs/get/"+urlParam)
//     const blogData = await res.data;
//     return {
//       props:{
//         "blogTitle"		:blogData.blogTitle,
//         "summary"		:blogData.summary,
//         "typeOfBlog"	:blogData.typeOfBlog,
//         "blogContent"	:blogData.blogContent,
//         "bannerImage"   :blogData.bannerImage.path,
//         "blogURL"       : urlParam   
//       }
//     }
//   }
  

export default Blog;