import React from 'react';
import  '../../../sites/currentSite/pages/PhotoGallery.css';
import    UniImage  from '../../../sites/currentSite/images/about4.jpg';
import axios from 'axios';


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
						console.log("gallery data:",response.data);
						this.setState({
							"galleryList" : response.data,
						})
						console.log("gallery list ===",this.state.galleryList);
                    }                  
                  })           
                .catch(function(error){
                  console.log(error);
                    
              })            

	}
	
	render() {
		return (
			<div className="">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cshoplistwrap galleryWrapper">					
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					{
						Array.isArray(this.state.galleryList) && this.state.galleryList.length > 0
						    		? 
						    		this.state.galleryList.map((data, index)=>{										
									return(
									<div>	
										<div className="col-lg-3 col-md-4 col-sm-3 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxOfShop">
												<div id={"image_"+data._id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding galleryImg " data-toggle="modal" data-target={"#"+data._id} area-hidden ="true">
													<img className=" img img-responsive mtop10a" src={data.galleryImage}/>													
												</div>
											</div> 
										</div>
										<div id={data._id} className="modal in" data-backdrop="static" data-keyboard="false" >
											<div className="modal-dialog" >							
												<div className="modal-content loginModalContent col-lg-12  col-md-12  col-sm-12 col-xs-12">                            
													<div className="modal-body">   
														<button type="button" className="close"  data-dismiss="modal" aria-hidden="true" >&times;</button>                                                         
														<div>
															<img className=" img img-responsive mtop10a" src={data.galleryImage}/>													
														</div>															
													</div>
												</div>
											</div>
										</div>
									</div>
									)
								})
						    	:""
					}
                    
											
					</div>
				</div>
			</div>
		);
	}
}
