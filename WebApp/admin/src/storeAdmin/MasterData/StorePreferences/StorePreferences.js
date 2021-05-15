import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
// import  './WebsiteModel.css';

class StorePreferences extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           			: "",
			"maxRadius" 					: "",
			"minOrderValue"      		: "",
			"defaultServiceCharges" 	: "", 		
			"serviseChargesByDistance" : [],
		};
	}

	componentDidMount(){        
		// console.log("2.inside component didmount");
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token         = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		this.validation();
		// console.log("userDetails = > ",userDetails);
		// console.log("Bearer = > ",(axios.defaults.headers.common['Authorization'] = 'Bearer '+ token));
		
				
	}

	validation(){		
			jQuery.validator.setDefaults({
				 debug   : true,
				 success : "valid"
			});
			$("#StorePreferencesForm").validate({
				 rules: {
					maxRadius: {
							required: true,
					  },
					  minOrderValue: {
							required: true,
					  },
					  defaultServiceCharges: {
							required: true,
					  },
				 },
				 errorPlacement: function (error, element) {
					  if (element.attr("name") === "maxRadius") {
							error.insertAfter("#maxRadius");
							element.focus();
					  }
					  if (element.attr("name") === "minOrderValue") {
							error.insertAfter("#minOrderValue");
							element.focus();
					  }
					  if (element.attr("name") === "defaultServiceCharges") {
							error.insertAfter("#defaultServiceCharges");
							element.focus();
					  }
				 }
			});
	  	}


	componentWillMount() {
		axios.get("/api/storepreference/get")
		.then(storepreference =>{
			if(storepreference.data){
				console.log("preferences.data=========",storepreference.data);
				this.setState({
					'editId'           			: storepreference.data[0]._id,
					'maxRadius'     				: storepreference.data[0].maxRadius,
					'minOrderValue' 				: storepreference.data[0].minOrderValue,
					'serviseChargesByDistance' : storepreference.data[0].serviseChargesByDistance,
				})        
			}
		})
		.catch(error=>{
			console.log("error => ",error);
			// if(error.message === "Request failed with status code 401"){
			//     var userDetails =  localStorage.removeItem("userDetails");
			//     localStorage.clear();
			//     swal({  
			//         title : "Your Session is expired.",                
			//         text  : "You need to login again. Click OK to go to Login Page"
			//     })
			//     .then(okay => {
			//         if (okay) {
			//             window.location.href = "/login";
			//         }
			//     });
			// }
		})
	}  
	 
	handleChange(event) {
		//event.preventDefault();
		const target 	= event.target;
		const name 		= target.name;
		console.log("target => ",target);
		console.log("name => ",name);
		console.log("VALUE => ",event.target.value);
		this.setState({
			[name] : event.target.value
		});  	
	}

	addNewSubCatArray(event){
		let arrLength = this.state.distanceRangeArray ? this.state.distanceRangeArray : [];
		arrLength.push({
			minDistance 	: 0,
			maxDistance 	: 0,
		});
		this.setState({
			distanceRangeArray : arrLength,
		},()=>{
			console.log('distanceRangeArray',this.state.distanceRangeArray);
		}); 
	}

	addNewRow(index){
		return(
			<div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
				<div className="col-lg-11 col-md-11 NOpadding">             
					<input type="text" id={index} value={this.state['subCategoryTitle'+index]} name={"subCategoryTitle"+index} onChange={this.handleChange.bind(this)} className={"form-control newSubCatg"+index} placeholder="Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
				</div>
				<div className="col-lg-1 col-md-1 deleteSubCategory fa fa-trash" id={index} onClick={this.deleteSubCategory.bind(this)}>		
				</div>
			</div>
		);
	}

	createSubCategoryUrl(event){
		const target = event.target;
		const name   = target.name;
		console.log("target => ", target);
		console.log("name => ", name);
		console.log("event.target.value => ", event.target.value);

		this.setState({
			 [name] 									: event.target.value,
			 [name+"Error"+event.target.id] 	: event.target.value ? "" : "This field is required."
		});
	}

	deleteSubCategory(event){
		event.preventDefault();
		var id = event.target.id;
		// console.log('subCategory Id',id);

		let arrLength 	= this.state.subcatgArr ? this.state.subcatgArr : null;
		// var index 		= arrLength.indexOf(id);
		
		arrLength.splice(arrLength.findIndex(v => v.subCategoryCode === id), 1);
		this.setState({
			subcatgArr : arrLength
		},()=>{});
	}

	submit(event){ 
		event.preventDefault();    
		var formValues = {
			'maxRadius'     				: this.state.maxRadius,
			'minOrderValue' 				: this.state.minOrderValue,
			'defaultServiceCharges' 	: this.state.defaultServiceCharges,
			'serviseChargesByDistance' : this.state.serviseChargesByDistance
		}
		
		console.log('formValues', formValues);
			console.log("condition => ",($("#StorePreferencesForm").valid()));
		  	if($("#StorePreferencesForm").valid()){        
				axios.post('/api/storepreference/post', formValues)
				.then((response)=>{                
					 console.log("response after insert webapp:",response.data.message); 
					 swal({
						  text : response.data.message
					 }) 
										  
				window.location.reload();
				})
				.catch((error)=>{
					 console.log("error => ",error);
					 // if(error.message === "Request failed with status code 401"){
					 //     var userDetails =  localStorage.removeItem("userDetails");
					 //     localStorage.clear();
					 //     swal({  
					 //         title : "Your Session is expired.",                
					 //         text  : "You need to login again. Click OK to go to Login Page"
					 //     })
					 //     .then(okay => {
					 //         if (okay) {
					 //             window.location.href = "/login";
					 //         }
					 //     });
					 // }					 
				})
		  }        
	 }
		  
	render() {        
		return (
			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
						<div className="formWrapper">
							<section className="content">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
									<div className="row">
										<div className="">
											<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
												<h4 className="weighttitle NOpadding-right">Store Prefereces </h4>
											</div>
								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="StorePreferencesForm" className="">
													<div className="col-lg-5 fieldWrapper">
														<div className="col-lg-12">
															<label>Maximum Radius to Show Vendors <i className="redFont">*</i></label>
															<input className="form-control" placeholder="Maximum Radius in Kms" ref="maxRadius"
															 	type 		= "number"
																name 		= "maxRadius" 
																id 		= "maxRadius" 
																value 	= {this.state.maxRadius} 
																onChange = {this.handleChange.bind(this)} 
															/>
														</div>
													</div>
													<div className="col-lg-5 fieldWrapper">
														<div className="col-lg-12">
															<label>Minimum Order Value Per Vendor <i className="redFont">*</i></label>
															<input className = "form-control" placeholder = "Minimum Order Value" ref = "minOrderValue"
																type 		= "text" 
																id 		= "minOrderValue" 
																name 		= "minOrderValue"
																value	 	= {this.state.minOrderValue} 
																onChange = {this.handleChange.bind(this)} 
															/>
														</div>                            
													</div>
													<div className="col-lg-5 fieldWrapper">
														<div className="col-lg-12">
															<label>Default Service Charges <i className="redFont">*</i></label>
															<input className = "form-control" placeholder = "Default Service Charges" ref = "defaultServiceCharges"
																type 		= "text" 
																id 		= "defaultServiceCharges" 
																name 		= "defaultServiceCharges"
																value	 	= {this.state.defaultServiceCharges} 
																onChange = {this.handleChange.bind(this)} 
															/>
														</div>                            
													</div>
													{/* <div className="col-lg-12 subCatAddLabel">
														<label>Add Service Charges For Particular Distance </label>
														{this.state.distanceRangeArray 
														?
															this.state.distanceRangeArray.map((dataRowArray, index)=>{
																return(
																	<div className="col-lg-12 col-md-12 NOpadding" key={index}>                                                                                  
																		<div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
																			<div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 NOpadding">             
																				<input type="number" id={dataRowArray.minDistance} value={this.state['distance'+dataRowArray.minDistance]} name={"minDistance"+index} onChange={this.createSubCategoryUrl.bind(this)} className={"form-control minDistance"+index} placeholder="Enter Minimum Distance" aria-label="Minimum Distance" aria-describedby="basic-addon1" ref={"minDistance"+index} />
																			</div>
																			<div className="col-lg-5 col-md-5 col-sm-5 col-xs-12 NOpadding">             
																				<input type="number" id={dataRowArray.maxDistance} value={this.state['distance'+dataRowArray.maxDistance]} name={"maxDistance"+index} onChange={this.createSubCategoryUrl.bind(this)} className={"form-control maxDistance"+index} placeholder="Enter Maximum Distance" aria-label="Maximum Distance" aria-describedby="basic-addon1" ref={"maxDistance"+index} />
																			</div>
																			<div className="col-lg-2 col-md-2 col-sm-2 col-xs-12 deleteSubCategory fa fa-trash" id={"distance"+index} onClick={this.deleteSubCategory.bind(this)}>
																			</div>
																		</div>
																		<div className="error" name={"distanceError"+index} id={"distanceError"+index}>{this.state["distanceError"+index]}</div>
																	</div>
																);
															})
														:
															null
														}
													</div>												
													<div className="col-lg-6 col-md-6">
														<div onClick={this.addNewSubCatArray.bind(this)}  className="submitBtn btn categoryBtn button3 col-lg-12">Add New Subcategory</div>
													</div> */}
													<div className="form-margin col-lg-6 col-lg-offset-6 col-md-6 col-sm-12 col-xs-12">
														<div className="col-lg-4 btnWrapper pull-right">
															<label>&nbsp;</label>
															{this.state.editId 
																?
																	<button onClick={this.submit.bind(this)} className="btn button3 pull-right">Update</button>
																:
																	<button onClick={this.submit.bind(this)} className="btn button3 pull-right">Submit</button>
															}
														</div>
													</div>											
												</form>
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
export default StorePreferences;

