import React, { Component } from 'react';
import "./Aboutusclient.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';	
import Loadable                   from 'react-loadable';
import axios from 'axios';

const OwlCarousel = Loadable({
  loader: () => import('react-owl-carousel'),
  loading() {
    return <div className="col-sm-12 col-xs-12 col-lg-2 col-lg-offset-5 col-md-12 loadingImg"><img src="../images/loadersglms.gif" className="img-responsive" alt="loading"/></div>
  }
});

export default class Aboutusclient extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    blocks: {
		        "blockComponentName"  : "Typecomponent1",
		        "blockType"       : "simple",
		        blockTitle : "This is Block Title",
		        blockDescription : "This is a Description. Some text goes here. You can replace the text as per your choice.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		        fgImage: "/images/bgimage1.jpg",
      		},
      blockID:"",
      block_id:"",
	    responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:7 
            }
          }

	    	
	    };
  	 

    
  }
componentDidMount(){
/*console.log("==>",this.props.block_id);*/
          {
             axios
                .get('http://iogapi.iassureit.com/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
                      this.setState({
                          blocks:response.data
                      });
                    }                  
                  })           
                .catch(function(error){
                  console.log(error);
                    if(error.message === "Request failed with status code 401")
                      {
                          // swal("Your session is expired! Please login again.","", "error");
                      }
              })
            }
      this.setState({
                block_id:this.props.block_id
              });
}
  render() {
		return (
			<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 text-center aboutclientmb">
				<div className="row">
				<div className="aboutclient">
					<OwlCarousel
                            className="owl-theme aboutclientcaro"
                            margin={0}
                            nav={true}
                            responsive={this.state.responsive} 
                            autoplay={true}
                            autoplayHoverPause={true}
                        >
                          <div className="item aboutclientborder">
                            <i className="fa fa-futbol-o" aria-hidden="true"></i><br/>
                            <span>SPORT</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-television" aria-hidden="true"></i><br/>
                            <span>TELEVISION</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-laptop" aria-hidden="true"></i><br/>
                            <span>LAPTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-desktop" aria-hidden="true"></i><br/>
                            <span>DESKTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-cutlery" aria-hidden="true"></i><br/>
                            <span>FOOD</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-camera" aria-hidden="true"></i><br/>
                            <span>ELECTRONIC</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-television" aria-hidden="true"></i><br/>
                            <span>TELEVISION</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-futbol-o" aria-hidden="true"></i><br/>
                            <span>SPORT</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-desktop" aria-hidden="true"></i><br/>
                            <span>DESKTOP</span>
                          </div>
                          <div className="item aboutclientborder">
                            <i className="fa fa-camera" aria-hidden="true"></i><br/>
                            <span>ELECTRONIC</span>
                          </div>
                    </OwlCarousel>
                    </div>
                    <div className="col-lg-12 mt50">
	                    <div className="row">
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand1.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand2.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand3.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand4.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand5.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
		                    <div className="col-lg-2">
			                    <div className="">
			                    	<div className="aboutusclientcontainer">
									  <img src="/images/brand6.jpg" alt="Avatar" className="image2" />
									  <div className="overlay">
									  </div>
									</div>
			                    </div>
		                    </div>
	                    </div>
                    </div>
				</div>
			</div>
		);
	}
}