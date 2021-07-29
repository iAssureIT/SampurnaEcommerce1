import React from 'react';
import axios        from 'axios';
import $            from 'jquery';
import Image        from 'next/image';
import Link         from 'next/link';
import swal from 'sweetalert';
import Moment  from 'react-moment';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Style from "./CategoriesBlock.module.css";

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
	  slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  
export default class CategoriesBlock extends React.Component {
	  constructor(props) {
		  super(props);
		  this.state = {
			  "Blocks"		: []
	    };
	  }

    getCategoriesData(){
	  axios.get('/api/category/get/list')
      .then((response)=>{
      	this.setState({
      			blocks:response.data
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
	this.getCategoriesData();
}
	render() {
		var blocks = this.state.blocks;
		return (
			      <div className={"container-fluid AllBlogsBox " +Style.AllBlogsBox} style={{padding:"0px"}}>
              { blocks && blocks.length > 0 ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blogWrapper">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ocTitle txt2c offeredTitle text-center">
									    <div className={"title4 "+Style.title4}>
                     		<h2 className={"row globalMainTitle  title_inner4 lang_trans globalMainTitle "+Style.textAlign} data-trans="#blog_1554730795823_title">Shop By Category</h2>
                     			<span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                     		<div className={"line "+Style.line}><span className={Style.span}></span></div>
 								      </div>
                    </div>                                
                    <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 courceblockDiv1 movemasterdiv">
                      <Carousel  
                        className={"owl-theme "}
                        swipeable={false}
                        draggable={false}
                        showDots={false}
								        responsive={responsive}
								        rows= {2}
                        ssr={true} // means to render carousel on server-side.
                        infinite={true}
                        autoPlay={false}
                        autoPlaySpeed={3000}
                        keyBoardControl={true}
                        customTransition="all .2"
                        transitionDuration={500}
                        // containerClass="carousel-container"
                        // removeArrowOnDeviceType={["tablet", "mobile"]}
                        deviceType={this.props.deviceType}
                        //dotListClass="custom-dot-list-style"
                        itemClass="carousel-item-padding-10-px">
                        {
                          this.state.blocks && this.state.blocks.length > 0 ?
                          this.state.blocks.map((data, index)=>{
                          return(
                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "} key={index}>
                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding pageWrapper "+Style.pageWrapper}>
                                <Link href={`/category/${encodeURIComponent(data.categoryUrl)}`}>
                                  <a>
                                    <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 box bounceEffect  "+Style.box+" "+Style.boxWrapper +" "+Style.bounceEffect }>
                                      <div className={"col-lg-8 col-lg-offset-2 col-md-8 col-lg-offset-2 col-sm-12 col-xs-12 "+Style.categoryBlockImg}>
                                        {data.categoryImage ? 
                                        // <img src={data.categoryImage} alt="" className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryBlockImg img-responsive lazyload"} loading="lazy" height="200" width="100"/>
                                        <Image
                                            src={data.categoryImage!==""?data.categoryImage:null}
                                            className={"img categoryBlockImg img-responsive lazyload"}
                                            height ={250}
                                            width={230}
                                        />
                                        : 
                                        // <img src="/images/demobook.png" alt="" loading="lazy" className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryBlockImg lazyload "} height="200" width="100"/>
                                        <Image
                                            src="/images/notavailable.jpg"
                                            className={"categoryBlockImg"}
                                            height ={250}
                                            width={230}
                                        />
                                        }
                                      </div>
                                      <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12  "+Style.textAlign} title={data.category}>
                                        <div  className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTitle "+Style.categoryTitle +" " +Style.ellipsis}>
                                            <b>{data.category}</b>
                                            {/* <p className={"textRotate  "+Style.textRotate}>
                                                <b>{data.category}</b>
                                            </p>	 */}
                                        </div>                                        
                                      </div>
                                    </div>
                                  </a>
                                  </Link>
                                </div>
                              </div>	
                          );
                        })
                        :null}
                      </Carousel>
                  </div>	
                </div> :null } 					
		      	</div>
		);
	}
}
