import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import S3FileUpload           from 'react-s3';
import { Alert } from 'bootstrap';
import Compressor from 'compressorjs';

class BulkProductImageUpload extends Component{
	constructor(props){
			super(props);
			this.state = {
				notuploadedImages : [],
				allshopproductimages : [],
				productImageArray : [],
				progressLength : 0,
				itemCodeNotExist :''
			}

	}

	componentDidMount() {
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

		this.getData();
	}
	getData(){
		axios.get('/api/products/get/list')
		.then((response)=>{
				console.log('response = ', response.data)
				this.setState({
					allshopproductimages : response.data
				})
		})
		.catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
										title : "Your Session is expired.",                
										text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
										if (okay) {
												window.location.href = "/login";
										}
								});
						}
		})
}


	componentWillReceiveProps(nextProps){
		this.setState({
			'allshopproductimages':nextProps.productData,
		});
	}
	
	bulkuplodaProductImages(event){
		var itemCodeNotExist 	= '';
		var itemCodeNotExistArr = [];

		event.preventDefault();
		var productImage = [];

		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for(var i=0; i<event.currentTarget.files.length; i++){
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName  		= file.name; 
					// var productCode 	= file.name.split('-')[0];
					var itemCode 		= file.name.split('-')[1];
					var ext 			= fileName.split('.').pop();  

					if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="webp" || ext==="JPG" || ext==="PNG" || ext==="JPEG" || ext==="WEBP"){
						if (file) {
							var objTitle = { 
								fileInfo 	: file,
								// productCode : productCode,
								itemCode 	: itemCode
							}
							// if(itemCode && productCode){
							if(itemCode){
								checkItemCode();
								async function checkItemCode(){
									// const res = await axios.get('api/products/check-item-code-exits/'+itemCode);
									// const { data } = await res;
									// // console.log("data",data) ;
									// if(!data.exists){
									//   itemCodeNotExist = data.message;
									//   itemCodeNotExistArr.push({"message" :data.message});
									//   // console.log("itemCodeNotExistArr push",itemCodeNotExistArr);
									// }else{
										productImage.push(objTitle);
									// }
								}
							}											
						}else{          
							swal("Images are not uploaded");  
						}//file
					}else{ 
						swal("Your "+fileName+" image has format of "+ext+". Allowed images formats are (jpg,png,jpeg)");
					}//file types
				}//file
				// this.setState({
				//   itemCodeNotExist : itemCodeNotExistArr.length
				// })
			}//for 

			if(i >= event.currentTarget.files.length){
				this.setState({
					productImage : productImage,
					// itemCodeNotExist : itemCodeNotExistArr
				},()=>{
					// console.log("itemCodeNotExistArr",itemCodeNotExistArr)
				});  
					
				const main = async ()=>{
					var config = await getConfig();
					
					if(config){                    
						var s3urlArray 	= [];
						var imageLength = 100;
						var z 			= 0;

						for (var i = 0; i<productImage.length; i++) {
							var compressed_image 	= await handleCompressedUpload(productImage[i].fileInfo);
							compressed_image.name 	= compressed_image.name.split(".")[0]+"_small_iamge."+compressed_image.name.split(".")[1];

							var productSmallImage 	= await s3upload(compressed_image, config, this);
							var s3url 				= await s3upload(productImage[i].fileInfo, config, this);
							var x 					= i + 1;
							var progressLength 		= (x/productImage.length) * 100;
							
							this.setState({
								progressLength : parseInt(progressLength)
							})

							s3urlArray.push({
								productImage 		: s3url,
								productSmallImage  	: productSmallImage,
								itemCode 			: productImage[i].itemCode
							});
						}
						const formValues = {
							"product_ID"        : "",
							"productImage"      : s3urlArray,
							"status"            : "New"
						};
						return Promise.resolve(formValues);
					}
				}
				main().then(formValues=>{
					var newImages = this.state.productImageArray;
					
					newImages.push(formValues.productImage);
					this.setState({
							productImageArray : _.flatten(newImages)
					})
				});

				function handleCompressedUpload (e)  {
					return new Promise(function(resolve,reject){
						new Compressor(e,{
							quality 	: 0.8, // 0.6 can also be used, but its not recommended to go below.
							height  	: 300,
							width 		: 220,

							success: async (compressedResult) => {
								resolve(compressedResult);
							},
						});
					});
				};

				function s3upload(image,configuration){
					return new Promise(function(resolve,reject){
						S3FileUpload
						.uploadFile(image,configuration)
						.then((Data)=>{
							resolve(Data.location);
						})
						.catch((error)=>{
							console.log(error);
							if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
										title : "Your Session is expired.",                
										text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
									if (okay) {
										window.location.href = "/login";
									}
								});
							}
						})
					})
				}   

				function getConfig(){
					return new Promise(function(resolve,reject){                      
						axios.get('/api/projectSettings/get/S3')
						.then((response)=>{
							if(response.data){
								const config = {
									bucketName      : response.data.bucket,
									dirName         : 'propertiesImages',
									region          : response.data.region,
									accessKeyId     : response.data.key,
									secretAccessKey : response.data.secret,
								}
								resolve(config);                               
							}																 
						})
						.catch(function(error){
							console.log(error);
							if(error.message === "Request failed with status code 401"){
								var userDetails =  localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
									title : "Your Session is expired.",                
									text  : "You need to login again. Click OK to go to Login Page"
								})
								.then(okay => {
									if (okay) {
										window.location.href = "/login";
									}
								});
							}
						})				
					})
				}        
			}
		}		
	}

	saveImages(event){
		event.preventDefault();
		for(var i=0; i<this.state.productImageArray.length; i++){
			var formValue = {
				productImage        : this.state.productImageArray[i].productImage,
				productSmallImage   : this.state.productImageArray[i].productSmallImage,
				itemCode      		: this.state.productImageArray[i].itemCode
			}
			axios.patch('/api/products/patch/bulkimages/', formValue)
			.then((response)=>{
				// console.log('itemCodeNotExist', this.state.itemCodeNotExist);
				this.getData();
				// if(this.state.itemCodeNotExist !== ''){
				//   swal(response.data.message+" some images not uploaded because item code does not exist");
				// }else{
				swal(response.data.message);

				//}
				$(':input').val('');
			})
			.catch((error)=>{
				console.log('error', error);
				if(error.message === "Request failed with status code 401"){
					var userDetails =  localStorage.removeItem("userDetails");
					localStorage.clear();
					swal({  
						title : "Your Session is expired.",                
						text  : "You need to login again. Click OK to go to Login Page"
					})
					.then(okay => {
						if (okay) {
							window.location.href = "/login";
						}
					});
				}
			})
		}
		this.setState({
			productImageArray : [],
			itemCode : []
		})
	}
	
	getUploadBulUSPercentage(){
	}

	deleteproductImages(event){
		event.preventDefault(); 
		var id = event.target.getAttribute('data-productid');
		var image = event.target.getAttribute('data-image');
		var formValues = {
			product_ID    : id,
			imageLik      : image
		}

		swal({
					title: "Are you sure you want to delete this image?",
					text: "Once deleted, you will not be able to recover this image!",
					icon: "warning",
					buttons: true,
					dangerMode: true,
				})
				.then((success) => {
						if (success) {
							swal("Your image is deleted!");
							
								axios.patch('/api/products/remove/image', formValues)
								.then((res)=>{
									this.getData();
								})
								.catch((error)=>{
									console.log('errro', error);
								})
						
						} else {
						swal("Your image is safe!");
					}
				});

 
	}
	showItemCodeError(e){
		e.preventDefault();
		swal("Itemcode of selected images not exists.")
	}
		
	render(){
		return( 

			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
								<div className="row">
										<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
													<h4 className="weighttitle NOpadding-right">  </h4>
										</div>
										 
										<form className="addRolesInWrap newTemplateForm">
											<div className="">
												<div className="col-lg-4 col-lg-offset-3  col-md-4 col-md-offset-3 col-sm-12 col-xs-12 marginTopp">
													<div className="form-group">
														<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">
															Upload Product Images 
														</label>
														<input type="file" className="form-control bulkuplodaProductImagesInp" multiple onChange ={this.bulkuplodaProductImages.bind(this)}/>
														<div>{this.getUploadBulUSPercentage()}</div>
													</div>
												</div>
												{/* {console.log("itemCodeNotExist",this.state.itemCodeNotExist)} */}
												
													{this.state.progressLength === 100 ?
													<div className="col-lg-4  col-md-4 col-sm-12 col-xs-12 marginTopp">
														<div className="form-group">
															<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">&nbsp; </label>
															<button className="btn btn-primary" onClick={this.saveImages.bind(this)}>Save Images</button>
														</div>
													</div>
													: null
													 }
												{/* :
												// this.state.itemCodeNotExist ? 
												<div className="col-lg-4  col-md-4 col-sm-12 col-xs-12 marginTopp">
														<div className="form-group">
														<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category imageuploadtitle">&nbsp; </label>
															<button className="btn btn-primary" onClick={this.showItemCodeError.bind(this)}>Save Images</button>
														</div>
												</div>
												:'' */}
											
												
											</div>
										</form>
										 

										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xs-12 col-sm-12 upldImgTextColor">
												Image name must be saved in format <span className="upldImgTextColor1">Your Item Code</span> - <span className="upldImgTextColor2">Image Number for that product. </span>
												eg. ItemCode-01, ItemCode-02, ItemCode-03, ... etc.
											</div>
											{
												this.state.progressLength === 0 || this.state.progressLength === 100 ?
												null
												:
												<div className="progress img-progress col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xs-12 col-sm-12 NOpadding">
													<div className="progress-bar col-lg-12 col-md-12 col-xs-12 col-sm-12" role="progressbar" style={{width:""+this.state.progressLength+"%" }}>
														<span className="img-percent" style={{background:"#337ab7"}}>{this.state.progressLength}% Complete</span>
													</div>
												</div>
											}
											
											<div className="col-lg-12">
												{
													this.state.notuploadedImages.length > 0 ?

														<div className="notBlkUplImgListOuter">
															<div className="notBlkUplImgListTitle">
																Images not Uploaded
															</div>
															{
																this.state.notuploadedImages.map((data, index)=>{
																	return (
																		<div className="notBlkUplImgList" key={index}> 
																			{data}
																		</div>
																	);
																})
															}
														</div>
													:

													""
												} 
											</div>
										</div>
										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div>
													<div className="HRMSWrapper col-lg-12">
														<table className="table iAssureITtable-bordered table-striped table-hover">
															<thead className="tempTableHeader">
																<tr >
																	<th className="col-lg-1 umDynamicHeader srpadd">Sr no.</th>
																	<th className="col-lg-2 umDynamicHeader srpadd">Item Code</th>
																	<th className="col-lg-2 umDynamicHeader srpadd">Product Name</th>
																	<th className="col-lg-7 umDynamicHeader srpadd">Images</th>
																</tr>
															</thead>
															<tbody>
																{  
																	this.state.allshopproductimages.map((data,index)=>{
																		
																		return(
																			<tr key ={index}>
																				<td> {index+1}     </td>
																				<td> {data.itemCode}    </td>
																				<td> {data.productName}    </td>
																				<td>
																				{
																					data.productImage.length > 0 ? 
																						<div className="deleteimagewrapper bulkimagebg">  
																							{  
																								data.productImage.map((imgdata,index)=>{
																									return(
																										<div className="col-lg-3 deleteImgBlkUpldCol-lg-3" key={index}>
																											imgdata
																											<i className="fa fa-times deleteImgBlkUpld" aria-hidden="true" data-image={imgdata} data-productid={data._id}   onClick={this.deleteproductImages.bind(this)}></i>
																											<img src={imgdata} className="img-thumbnail"/>
																										</div>
																									);
																								})
																							}
																						</div>
																					:
																					<div className="bulkImgUpldNotShown">
																						No Images Available
																					</div>
																				}
																				</td>
																			</tr> 
																		)
																	})
																}   
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>

								</div>
							</div>
						</section>
						</div>
					</div>
				</div>
			</div>           
		);
	}
}
export default BulkProductImageUpload ;