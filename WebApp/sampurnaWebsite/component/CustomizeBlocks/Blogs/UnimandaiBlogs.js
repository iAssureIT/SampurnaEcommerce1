import React from 'react';
import axios        from 'axios';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/carousel.js';	
import $                  from 'jquery';
import swal from 'sweetalert';
import Moment  from 'react-moment';

import title_lastest_from from "../../../sites/currentSite/images/title-lastest-from.png";


export default class UnimandaiBlogs extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

			"Blogs"		: [
							/*{
								blogDate:"March 7,2017",
								blogTitle:"Introducing the Website Wireframes Plugin for Uncode",
								blogPara:"I was surprised how many people spoke English...",
								blogwritter:"John Doe",
								buBlogger:"Blogger",
								bloggerImg:"/images/user1.png",
								blogImg:"/images/ceo.png"
							},*/

						  ]
	};
	}
deleteBlog(event){
	event.preventDefault();
	var URL= event.target.id;
	console.log("id delet",URL);
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
			     	this.getBlogData();
			       swal("Your Blog is deleted!");
			    })
			    .catch((error)=>{
			       console.log("error = ", error);              
			    });
       
            } else {
            swal("Your Blog is safe!");
          }
        }); 
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
			<div className="container-fluid AllBlogsBox hidden-xs" style={{padding:"0px"}}>
          		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ backgroundColor:"#fff"}}>	          		
                    <div className="container col-lg-12 col-md-12 col-sm-12 col-xs-12 ocWrap">
                        { blogs && blogs.length > 0 ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                                
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blogWrapper" style={{"marginBottom":'50px'}}>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ocTitle txt2c offeredTitle text-center">
                                    <h3>Unimandai Blogs</h3>
                                </div>                                
                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 courceblockDiv1 movemasterdiv">
                                <OwlCarousel
                                    className="owl-theme customnNavButtonEcommerceND col-md-12 col-lg-12 col-sm-12 col-xs-12 boxShadow"
                                        loop
                                        margin 			=  {20}
                                        items  			=  {3}
                                        nav    			=  {0}
                                        dots   			=  {0}
                                        responsiveClass =  {true}
                                        autoplay        =  {false}
                                    >
                                {
                                    blogs && blogs.length > 0 ?
                                    blogs.map((blogs, index)=>{
                                            return(
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Allblog " key={index}>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 courceblockDiv NOpadding">
                                                    <a href={"/blog-view/"+blogs.blogURL}>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 courceDiv NOpadding "> 
                                                            <img className="img-responsive blockimg1 zoom" src={blogs.bannerImage.path} alt="Bannerpng"/>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 All1blog1">
                                                            <div className="ohide">	
                                                            </div>
                                                            {/* <div className="date"><b>Date :</b> <Moment format="DD-MM-YYYY HH:mm">{blogs.createdAt}</Moment></div> */}
                                                            {/* <p className="date">{blogs.createdAt}</p> */}
                                                            <h4 className="blog_content">{blogs.blogTitle}</h4>
                                                            <p className="blog_comment">{blogs.summary}</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>	
                                                );
                                            })
                                        :
                                        null
                                    }
                                    </OwlCarousel>
                                </div>	
                            </div>                            
                        </div>
                        :null
                       } 					
                    </div> 					
          		</div>
			</div>
		);
	}
}
