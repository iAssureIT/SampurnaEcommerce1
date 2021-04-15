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
			      <div className={"container-fluid " +Style.categoryWrapper} style={{padding:"0px"}}>
              { blocks && blocks.length > 0 ?
                <div className="col-12 ">
                    <div className="col-12 ocTitle txt2c offeredTitle text-center">
									    <div className={"title4 "+Style.title4}>
                     		<h2 className={"row globalMainTitle  title_inner4 lang_trans globalMainTitle "+Style.textAlign} data-trans="#blog_1554730795823_title">Shop By Category</h2>
                     			<span className={"hide "+Style.span} id="blog_1554730795823_title"></span>
                     		<div className={"line "+Style.line}><span className={Style.span}></span></div>
 								      </div>
                    </div>                                
                    <div className=" col-12 courceblockDiv1 movemasterdiv">
                      <div className="row">
                        {
                          this.state.blocks && this.state.blocks.length > 0 ?
                          this.state.blocks.map((data, index)=>{
                          return(
                            index<8?
                                <div className={"col-12 col-xl-3 col-sm-3 NoPadding "} key={index}>
                                <div className={"col-12 NoPadding pageWrapper "+Style.pageWrapper}>
                                <Link href={`/category/${encodeURIComponent(data.categoryUrl)}`}>
                                  <a>
                                    <div className={"col-12  "+Style.box1+" "+Style.boxWrapper}>
                                      <div className={"col-12 "+Style.categoryBlockImg}>
                                        {data.categoryImage ? 
                                        // <img src={data.categoryImage} alt="" className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryBlockImg img-responsive lazyload"} loading="lazy" height="200" width="100"/>
                                        <Image
                                            src={data.categoryImage!==""?data.categoryImage:null}
                                            className={"img categoryBlockImg img-responsive lazyload"}
                                            height ={260}
                                            width={260}
                                        />
                                        : 
                                        // <img src="/images/demobook.png" alt="" loading="lazy" className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryBlockImg lazyload "} height="200" width="100"/>
                                        <Image
                                            src="/images/eCommerce/notavailable.jpg"
                                            className={"categoryBlockImg"}
                                            height ={260}
                                            width={260}
                                        />
                                        }
                                      </div>
                                      <div className={"col-12  "+Style.textAlign} title={data.category}>
                                        <div  className={"col-12 categoryTitle "+Style.categoryTitle +" " +Style.ellipsis}>
                                            <b>{data.category}</b>                                            
                                        </div>                                        
                                      </div>
                                    </div>
                                  </a>
                                  </Link>
                                </div>
                              </div>	
                              :null
                          );
                        })
                        :null}
                      </div>
                  </div>	
                </div> :null } 					
		      	</div>
		);
	}
}
