import React from 'react';
import axios        from 'axios';
import $                  from 'jquery';
import swal from 'sweetalert';
import Moment  from 'react-moment';
import Carousel from 'react-multi-carousel';
import '../../../node_modules/react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from './BlogCarousel.module.css';

// import title_lastest_from from "../../../sites/currentSite/images/title-lastest-from.png";

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  
export default class BlogCarousel extends React.Component {

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
          		{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ backgroundColor:"#fff"}}>	          		 */}
                    {/* <div className="container col-lg-12 col-md-12 col-sm-12 col-xs-12 ocWrap"> */}
                        { blogs && blogs.length > 0 ?
                        // <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                                
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blogWrapper" style={{"marginTop":'15px'}}>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ocTitle txt2c offeredTitle text-center">
                                    {/* <h2>FROM THE BLOG</h2>
                                    <div class={"line "+Style.line}><span></span></div> */}
                                    <div className={"title4 "+Style.title4}>
                                        <h2 className={"title_inner4 lang_trans globalMainTitle "+Style.title_inner4} data-trans="#blog_1554730795823_title">From The Blog</h2>
                                        <span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                                        <div className={"line "+Style.line}><span className={Style.span}></span></div></div>
                                </div>                                
                                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 courceblockDiv1 movemasterdiv">
                                <Carousel  
                                className={"owl-theme " +Style.customnNavButton +" " +Style.carouselNewWrapper}
                                swipeable={false}
                                draggable={false}
                                showDots={false}
                                responsive={responsive}
                                ssr={true} // means to render carousel on server-side.
                                infinite={true}
                                autoPlay={false}
                                autoPlaySpeed={3000}
                                keyBoardControl={true}
                                customTransition="all .20"
                                transitionDuration={500}
                                // containerClass="carousel-container"
                                removeArrowOnDeviceType={["tablet", "mobile"]}
                                deviceType={this.props.deviceType}
                                //dotListClass="custom-dot-list-style"
                                itemClass="carousel-item-padding-10-px">
                                    
                                {
                                    blogs && blogs.length > 0 ?
                                    blogs.map((blogs, index)=>{
                                            return(
                                            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 Allblog NoPadding "} key={index}>
                                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 courceblockDiv NOpadding "+Style.Border}>
                                                    <a href={"/blog-view/"+blogs.blogURL}>
                                                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 courceDiv NoPadding  globaleCommOverlayBg "+Style.courceDiv}> 
                                                            <img className={"img-responsive blockimg1 lazyload "+Style.hover_rotate_img} src={blogs.bannerImage.path} loading="lazy" alt="Bannerpng"/>
                                                            <div className={Style.bgOverlay}></div>
                                                        </div>
                                                        <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 BlogDetail NoPadding "+Style.BlogDetail}>
                                                            <div className={"date " +Style.blogDate}><Moment format="DD-MM-YYYY HH:mm">{blogs.createdAt}</Moment></div>
                                                            <p className={"blog_content "+Style.blog_detail_title}>{blogs.blogTitle}</p>
                                                            <h6 className={"blog_comment "+Style.h6}>{blogs.summary}</h6>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>	
                                                );
                                            })
                                        :
                                        null
                                    }
                                    </Carousel>
                                </div>	
                            </div>                            
                        // </div>
                        :null
                       } 					
                    {/* </div> 					
          		</div> */}
			</div>
		);
	}
}
