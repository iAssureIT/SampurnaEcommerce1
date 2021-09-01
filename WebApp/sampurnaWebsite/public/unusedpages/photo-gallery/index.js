import React 	   from 'react';
import Image 	   from 'next/image';
import Style 	   from './photo-gallery.module.css';
import axios 	   from 'axios';
import Header      from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer      from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
// import Header from '../../component/blockTemplate/Header/Header.js';
// import Footer from '../../component/blockTemplate/Footer/Footer.js';
// import BreadCrumbs from '../../component/CustomizeBlocks/BreadCrumbs/BreadCrumbs.js';

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
				this.setState({
					"galleryList" : response.data,
				})
			}                  
			})           
		.catch(function(error){
			console.log(error);
			
	})           
	}
	
	render() {
		return (
			<div className="col-12 NoPadding">
				<Header/>
				<BreadCrumbs />
				<div className={"col-12 cshoplistwrap galleryWrapper "+Style.galleryWrapper}>					
					<div className="col-12">
						<div className="row">
						{
							Array.isArray(this.state.galleryList) && this.state.galleryList.length > 0
							    		? 
							    		this.state.galleryList.map((data, index)=>{										
										return(
											<div className="col-xl-3 col-md-3 col-sm-6 col-xs-12" key={index}>	
													<div className={"col-12 NoPadding "+Style.boxShadow}>
														<div id={"image_"+data._id} className={"col-12 NoPadding galleryImg "+Style.galleryImg} data-toggle="modal" data-target={"#"+data._id} area-hidden ="true">
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
														<div className="modal-content loginModalContent col-12">                            
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
									<div className="col-12">
										<div className="wishlistNoProduct col-12 mt-25">
										<i className="fa fa-exclamation-triangle"></i>&nbsp;  There is no data available on this page .
										</div>
										<a href="/" className="pull-right mt-15 wishBack">Back</a>
									</div>								

						}						
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}

