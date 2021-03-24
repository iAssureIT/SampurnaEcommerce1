import React from 'react';
import Image from 'next/image';
import Style from './photo-gallery.module.css';
// import    UniImage  from '../../../sites/currentSite/images/about4.jpg';
import axios from 'axios';
import Header from '../../component/blockTemplate/Header/Header.js';
import Footer from '../../component/blockTemplate/Footer/Footer.js';
import BreadCrumbs from '../../component/CustomizeBlocks/BreadCrumbs/BreadCrumbs.js';

export default class Gallery extends React.Component {

    constructor(props) {
    super(props);
    this.state = {
		"PhotoList" : [],
	}
  }
componentDidMount(){
	axios.get("/api/gallery/get/")			
	.then((response) => {     	
			if(response.data){
				// console.log("gallery data:",response.data);
				this.setState({
					"galleryList" : response.data,
				})
				// console.log("gallery list ===",this.state.galleryList);
			}                  
			})           
		.catch(function(error){
			console.log(error);
			
	})           
	}
	
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NoPadding">
				<Header/>
				<BreadCrumbs />
				<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 cshoplistwrap galleryWrapper "+Style.galleryWrapper}>					
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					{
						Array.isArray(this.state.galleryList) && this.state.galleryList.length > 0
						    		? 
						    		this.state.galleryList.map((data, index)=>{										
									return(
									<div className="col-lg-3 col-md-4 col-sm-3 col-xs-12" key={index}>	
											<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "+Style.boxShadow}>
												<div id={"image_"+data._id} className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding galleryImg "+Style.galleryImg} data-toggle="modal" data-target={"#"+data._id} area-hidden ="true">
													{/* <img className={"img img-responsive mtop10a "+Style.img} src={data.galleryImage}/> */}
													<Image
														src={data.galleryImage}
														height ={300}
														width={300}
													/>													
												</div>
											</div> 
										<div id={data._id} className="modal in" data-backdrop="static" data-keyboard="false" >
											<div className="modal-dialog" >							
												<div className="modal-content loginModalContent col-lg-12  col-md-12  col-sm-12 col-xs-12">                            
													<div className="modal-body">   
														<button type="button" className="close"  data-dismiss="modal" aria-hidden="true" >&times;</button>                                                         
														<div>
															{/* <img className="img img-responsive mtop10a" src={data.galleryImage}/>	 */}
															<Image
																src={data.galleryImage}
																height ={550}
																width={450}
															/>													
														</div>															
													</div>
												</div>
											</div>
										</div>
									</div>
									)
								})
						    	:
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="wishlistNoProduct col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">
									<i className="fa fa-exclamation-triangle"></i>&nbsp;  There is no data available on this page .
									</div>
									<a href="/" className="pull-right mt15 wishBack">Back</a>
								</div>								

					}						
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}
