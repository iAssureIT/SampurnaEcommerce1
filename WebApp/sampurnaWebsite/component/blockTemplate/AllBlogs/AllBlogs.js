import React, { Component } from 'react';
import axios        from 'axios';
import swal from 'sweetalert';
import Style from "./AllBlogs.module.css";

export default class AllBlogs extends Component {
	constructor(props){
    super(props);
	    this.state = {
			"Blogs"		: []
	    };
	}
	
	getBlogData(){
		axios
		  .get('/api/blogs/get/all/list')
		  .then((response)=>{
		//    console.log("===>",response.data);
			  this.setState({
					  Blogs:response.data
				  });
		  })
		  .catch(function(error){
			console.log(error);
			  if(error.message === "Request failed with status code 401")
				  {
					   swal("Your session is expired! Please login again.","", "error");
					   /*this.props.history.push("/");*/
				  }
		  })
	}
	componentDidMount(){
		var Blogs =[];
		this.getBlogData();
	}
	
  render() {
	var blogs = this.state.Blogs;
	// console.log("blogs url",blogs);
	return (
		<div className={"container-fluid AllBlogsBox "+Style.AllBlogsBox} style={{padding:"0px"}}>
			  <div className="col-lg-12">
				  {
					  
					blogs && blogs.length > 0 ?
						  blogs.map((data, index)=>{
								return(
									  <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 Allblog" key={index}>					          				
										  <div className={"All1blog1 z50 "+Style.All1blog1+" "+Style.z50}>
											  {   
												  data.typeOfBlog == "Premium" ?
												  <div className={"premiumBlogIndicate "+Style.premiumBlogIndicate}>Premium</div>
												:
												null
											}
											<img className={"img-responsive AllblogImgB "+Style.AllblogImgB} src={data.bannerImage?data.bannerImage.path:" "} alt="Bannerpng"/>
											<div className={"middle "+Style.middle}></div>
											<a className={Style.a+" "+Style.r1blog1 } href={"/blog-view/"+data.blogURL}>
												<p className={"blogDate p10 mtop20 graycolor "+Style.p10+" "+Style.mtop20}> {data.createdAt}</p><hr/>
												<h4 className={"blogTitle p10 "+Style.blogTitle}><b> {data.blogTitle}</b></h4>
												<p className={"blogPara p10 graycolor "+Style.blogPara+" "+Style.graycolor}>{data.summary}</p>
											</a>
										</div>
										  
									  </div>
									  );
							})
						:
						<img className={"img-responsive middlPageImage "+Style.middlPageImage} src="/images/loader.gif" alt="Bannerpng"/>
						
				}				
				  
				  
			  </div>
		</div>
	);
  }
}



