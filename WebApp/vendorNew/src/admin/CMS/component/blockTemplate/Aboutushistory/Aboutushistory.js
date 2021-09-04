import React, { Component } from 'react';
import "./Aboutushistory.css";
import axios from 'axios';

export default class Aboutushistory extends Component {
    constructor(props) {
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
      block_id:""
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
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center mt50">
				<div className="row">
					<div className="container-time col-lg-10 col-lg-offset-1">
					<div className="page-header-time">
					<h1 id="timeline">Our history</h1>
					</div>
					<ul className="timeline">
					<li className="timeline-year-li">
					<div className="timeline-year">2014</div>
					</li>
					<li className="count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel animation-element banner-nb-bottom in-view">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-01.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					<li className="timeline-inverted count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel  animation-element banner-nb-bottom">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-02.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					<li className="timeline-year-li">
					<div className="timeline-year">2015</div>
					</li>
					<li className="count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel  animation-element banner-nb-bottom">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-03.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					<li className="timeline-inverted count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel  animation-element banner-nb-bottom">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-04.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					<li className="count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel  animation-element banner-nb-bottom">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-05.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					<li className="timeline-year-li">
					<div className="timeline-year">2016</div>
					</li>
					<li className="timeline-inverted count-li">
					<div className="timeline-badge"></div>
					<div className="timeline-panel  animation-element banner-nb-bottom">
					<div className="img-text"><img src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media/multistore/banner/Untitled-1-06.png" alt=""/></div>
					<div className="timeline-body">
					<h4 className="timeline-title">Mussum ipsum cacilds</h4>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
					</div>
					</div>
					</li>
					</ul>
					</div>				
				</div>
			</div>
		);
	}
}