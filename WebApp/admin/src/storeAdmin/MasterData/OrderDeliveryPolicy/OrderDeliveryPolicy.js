import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import  './OrderDeliveryPolicy.css';

class OrderDeliveryPolicy extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           			: "",
			"maxRadius" 				: "",
			"minOrderValue"      		: "",
			"maxServiceCharges" 		: "", 		
			"serviseChargesByDistance" 	: [{
				minDistance 	: 0,
				maxDistance 	: 0,
			}],
			isServiceByDistanceValid 	: false
		};
	}

	/**=========== componentDidMount() ===========*/
	componentDidMount(){        
		// console.log("2.inside component didmount");
		// console.log("adminPreferences => ",adminPreferences);
		var userDetails   		= JSON.parse(localStorage.getItem("userDetails"));
		var token         		= userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		
		this.validation();
		this.getAdminPreferences();
	}

	//======= Admin Preferences ==========
	getAdminPreferences(){
		axios.get("/api/adminpreference/get")
		.then(preferences =>{
			if(preferences.data){
				// console.log("preferences.data[0] => ",preferences.data[0])
				// var askpincodeToUser = preferences.data[0].askPincodeToUser;

				this.setState({
					'websiteModel'     	: preferences.data[0].websiteModel,
					'askPincodeToUser' 	: preferences.data[0].askPincodeToUser,
					'showLoginAs'      	: preferences.data[0].showLoginAs,
					'showInventory'    	: preferences.data[0].showInventory,
					'showDiscount'    	: preferences.data[0].showDiscount,
					'showCoupenCode'    : preferences.data[0].showCoupenCode,
					'showOrderStatus'   : preferences.data[0].showOrderStatus,
					'currency' 			: preferences.data[0].currency,
					'unitOfDistance' 	: preferences.data[0].unitOfDistance
				})									
			}
		})
		.catch(error=>{
			console.log("Error in preferences = ", error);
			if(error.message === "Request failed with status code 401"){
				// var userDetails =  localStorage.removeItem("userDetails");
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

	/**=========== validation() ===========*/
	validation(){		
		jQuery.validator.setDefaults({
			debug   : true,
			success : "valid"
		});
		$("#OrderDeliveryPolicyForm").validate({
			rules: {
				maxRadius: {
					required : true,
					min     	: 1
				},
				minOrderValue: {
					required : true,
					min 		: 1
				},
				maxServiceCharges: {
					required : true,
					min 		: 0
				},
				maxNumberOfVendors: {
					required : true,
					min 		: 1
				}
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
				if (element.attr("name") === "maxServiceCharges") {
					error.insertAfter("#maxServiceCharges");
					element.focus();
				}
				if (element.attr("name") === "maxNumberOfVendors") {
					error.insertAfter("#maxNumberOfVendors");
					element.focus();
				}
			}
		});
	}

	/**=========== componentWillMount() ===========*/
	componentWillMount() {
		axios.get("/api/storepreference/get")
		.then(storepreference =>{
			if(storepreference.data){
				console.log("preferences.data=========",storepreference.data[0].maxServiceCharges);
				this.setState({
					'editId'           			: storepreference.data[0]._id,
					'maxRadius'     			: storepreference.data[0].maxRadius,
					'minOrderValue' 			: storepreference.data[0].minOrderValue,
					'maxServiceCharges' 		: storepreference.data[0].maxServiceCharges,
					'maxNumberOfVendors' 		: storepreference.data[0].maxNumberOfVendors,
					'serviseChargesByDistance' 	: storepreference.data[0].serviseChargesByDistance,
				})        
			}
		})
		.catch(error=>{
			console.log("error => ",error);
			if(error.message === "Request failed with status code 401"){
			    localStorage.removeItem("userDetails");
			    localStorage.clear();
			    swal({  
			        title : "Your Session is Expired.",                
			        text  : "You Need to Login Again. Click OK to Go to Login Page"
			    })
			    .then(okay => {
			        if (okay) {
			            window.location.href = "/login";
			        }
			    });
			}
		})
	}  
	 
	/**=========== handleChange() ===========*/
	handleChange(event) {
		//event.preventDefault();
		const target 	= event.target;
		const name 		= target.name;


        var value  = event.target.value;
        var min   = parseInt(event.target.min);
        console.log("name => ",name);

        // document.getElementById(name + "-error").style.display = 'none';
        
		  var error = "";
		  if (value < min){
		    var error = "Value should be greater than or equal to " + min;
		  }
		
		this.setState({
			[name] 				: event.target.value,
			["error-"+name] 	: error 
		});  	
	}

	/**=========== addNewDistanceRange() ===========*/
	addNewDistanceRange(event){
		let arrLength = this.state.serviseChargesByDistance ? this.state.serviseChargesByDistance : [];
		arrLength.push({
			minDistance 		: 0,
			maxDistance 		: 0,
			serviceCharges 	: 0,
		});
		this.setState({
			serviseChargesByDistance : arrLength,
		},()=>{
			console.log('distanceRangeArray',this.state.serviseChargesByDistance);
		}); 
	}

	/**=========== handleChangeDistanceRange() ===========*/
	handleChangeDistanceRange(event){
        event.preventDefault();
        var index = 0;
        var inputname  = event.target.name;
        var name  = event.target.name;
        var value  = event.target.value;
        var min   = parseInt(event.target.min);
        var max   = parseInt(event.target.max);
        if(name.search("-") > -1){
            var nameArr = name.split("-");
            name        = nameArr[0];
            index       = nameArr[1];
        }
		  
		  	// event.target.classList.add('valid')
		  	if (value < min){
		  		document.getElementById("error-"+inputname).classList.remove('valid');
		  		var error = "Value should be greater than or equal to " + min;
		  	}else if (value > max){
		  		document.getElementById("error-"+inputname).classList.remove('valid');
		    	var error = "Value should be less than or equal to " + max;
		 	}else{
		 		document.getElementById("error-"+inputname).classList.add('valid')
		 	}

        var serviseChargesByDistance 	= this.state.serviseChargesByDistance; 
        var distanceObj           		= serviseChargesByDistance[index];
        distanceObj[name]         		= event.target.value;
        console.log("name => ",name);
        if (event.target.value === "") {
            event.target.focus();
        }
        this.setState({
            serviseChargesByDistance 			: serviseChargesByDistance,  
            "error-serviseChargesByDistance" : "",
				["error-"+inputname]  				: error
        },()=>{
        	console.log(" error => ",this.state["error-"+name])
		});
	}

	/**=========== deleteDistanceRange() ===========*/
	deleteDistanceRange(event){
		event.preventDefault();
		var id = event.target.id;
		console.log('subCategory Id',id);
		// console.log("serviseChargesByDistance before => ",this.state.serviseChargesByDistance);
		let arrLength 	= this.state.serviseChargesByDistance ? this.state.serviseChargesByDistance : null;
		console.log("arrLength => ",arrLength)
		var index 		= id.split("-")[1];
		console.log('index =>',index);
		// swal({  
		// 	title : "Are You Sure ?",                
		// 	text  : "You want to delete..",
		// 	buttons: ["Cancel", "Delete"],
		// })
		// .then(Stop => {
		// 	console.log("Stop => ",Stop)
		// 	if (Stop) {
				arrLength.splice(index, 1);
				this.setState({
					serviseChargesByDistance : arrLength
				},()=>{
					console.log("serviseChargesByDistance after => ",this.state.serviseChargesByDistance);
				});
			// 	swal({  
			// 		text : "Deleted !",
			// 	})
			// }else{
			// 	swal({  
			// 		// title : "Don't worry !",
			// 		text  : "Distance range is safe"
			// 	})
			// }			
		// });
	}

	/**=========== submit() ===========*/
	submit(event){ 
		document.getElementById('error-serviseChargesByDistance').classList.add("valid")
		this.setState({
			"error-serviseChargesByDistance" : ""
		 },()=>{})
		event.preventDefault();    
		var formValues = {
			'maxRadius'     				: this.state.maxRadius,
			'minOrderValue' 				: this.state.minOrderValue,
			'maxServiceCharges' 			: this.state.maxServiceCharges,
			'maxNumberOfVendors' 			: this.state.maxNumberOfVendors,
			'serviseChargesByDistance' 		: this.state.serviseChargesByDistance
		}
		
		console.log('formValues', formValues);
		console.log("condition => ",(this.state.serviseChargesByDistance && this.state.serviseChargesByDistance.length > 0));
		if(this.state.serviseChargesByDistance && this.state.serviseChargesByDistance.length > 0){
			for (var i = 0; i < this.state.serviseChargesByDistance.length; i++) {
				var elementMinDist_name				= document.getElementById("minDistance-"+i).name;
				var elementMinDist_min				= document.getElementById("minDistance-"+i).min;
				var elementMinDist_max				= document.getElementById("minDistance-"+i).max;
				var elementMinDist_error 			= "";
				if (this.state.serviseChargesByDistance[i].minDistance < elementMinDist_min){
		  			document.getElementById("error-minDistance-"+i).classList.remove('valid')
		    		var elementMinDist_error = "Value should be greater than or equal to " + elementMinDist_min;
		  		}else if (this.state.serviseChargesByDistance[i].minDistance > elementMinDist_max){
		  			document.getElementById("error-minDistance-"+i).classList.remove('valid')
		    		var elementMinDist_error = "Value should be less than or equal to " + elementMinDist_max;
		 		}else{
		 			document.getElementById("error-minDistance-"+i).classList.add('valid')
		 		}
				
				var elementMaxDist_name 			= document.getElementById("maxDistance-"+i).name;
				var elementMaxDist_min 				= document.getElementById("maxDistance-"+i).min;
				var elementMaxDist_max 				= document.getElementById("maxDistance-"+i).max;
				var elementMaxDist_error 			= "";
				if (this.state.serviseChargesByDistance[i].maxDistance < elementMaxDist_min){
		  			document.getElementById("error-maxDistance-"+i).classList.remove('valid')
		    		var elementMaxDist_error = "Value should be greater than or equal to " + elementMaxDist_min;
		  		}else if (this.state.serviseChargesByDistance[i].maxDistance > elementMaxDist_max){
		  			document.getElementById("error-maxDistance-"+i).classList.remove('valid')
		    		var elementMaxDist_error = "Value should be less than or equal to " + elementMaxDist_max;
		 		}else{
		 			document.getElementById("error-maxDistance-"+i).classList.add('valid')
		 		}

				var elementServiceCharges_name 	= document.getElementById("serviceCharges-"+i).name;
				var elementServiceCharges_min 	= document.getElementById("serviceCharges-"+i).min;
				var elementServiceCharges_max 	= document.getElementById("serviceCharges-"+i).max;
				var elementServiceCharges_error = "";
				if (this.state.serviseChargesByDistance[i].serviceCharges < elementServiceCharges_min){
		  			document.getElementById("error-serviceCharges-"+i).classList.remove('valid')
		    		var elementServiceCharges_error = "Value should be greater than or equal to " + elementServiceCharges_min;
		  		}else if (this.state.serviseChargesByDistance[i].serviceCharges > elementServiceCharges_max){
		  			document.getElementById("error-serviceCharges-"+i).classList.remove('valid')
		    		var elementServiceCharges_error = "Value should be less than or equal to " + elementServiceCharges_max;
		 		}else{
		 			document.getElementById("error-serviceCharges-"+i).classList.add('valid')
		 		}

		 		this.setState({
		 			["error-minDistance-"+i] 		: elementMinDist_error,
		 			["error-maxDistance-"+i] 		: elementMaxDist_error,
		 			["error-serviceCharges-"+i] 	: elementServiceCharges_error
		 		})
			}
			if(i >= this.state.serviseChargesByDistance.length){
				var arrLength = this.state.serviseChargesByDistance.length;
				if(parseInt(this.state.serviseChargesByDistance[arrLength - 1].maxDistance) >= this.state.maxRadius){
					var conditionValid = $("#OrderDeliveryPolicyForm").valid();
					console.log("1 ======> ",conditionValid)
					console.log("2 ======> ",(conditionValid && conditionValid !== false))
					if(conditionValid && conditionValid !== false){   

						axios.post('/api/storepreference/post', formValues)
						.then((response)=>{                
								console.log("response after insert webapp:",response.data.message); 
								swal({
									text : response.data.message
								}) 
													
						// window.location.reload();
						})
						.catch((error)=>{
							console.log("error => ",error);
							if(error.message === "Request failed with status code 401"){
								
								localStorage.removeItem("userDetails");
								localStorage.clear();
								swal({  
									title : "Your Session is Expired.",                
									text  : "You need to Login Again. Click OK to Go to Login Page"
								})
								.then(okay => {
									if (okay) {
										window.location.href = "/login";
									}
								});
							}					 
						})
					}
				}else{
					document.getElementById('error-serviseChargesByDistance').classList.remove("valid")
					this.setState({
						"error-serviseChargesByDistance" : "Please add different distance ranges upto " + this.state.maxRadius + " " + this.state.unitOfDistance
				 	},()=>{
					 	console.log("=> ",this.state["error-serviseChargesByDistance"])
				 	})
				}  
			}
		}else{
			document.getElementById('error-serviseChargesByDistance').classList.remove("valid")
			this.setState({
				"error-serviseChargesByDistance" : "Please add different distance ranges upto " + this.state.maxRadius + " " + this.state.unitOfDistance
			 },()=>{
				 console.log("=> ",this.state["error-serviseChargesByDistance"])
			 })
		}      
	}
	
	/**=========== render() ===========*/
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
												<h4 className="weighttitle NOpadding-right">Order Delivery Policy </h4>
											</div>
								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="OrderDeliveryPolicyForm" className="">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">														 	
															<label>Maximum Distance Radius to Show Vendors <i className="redFont">*</i></label>
															<div className="input-group" id = "maxRadius">
																<input className="form-control" placeholder="Maximum Radius in Kms" ref="maxRadius"
																	type 		= "number"
																	name 		= "maxRadius" 
																	value 		= {this.state.maxRadius} 
																	onChange 	= {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext">{this.state.unitOfDistance}</span>
															</div>
															{/*<label className="error" value={this.state['error-maxRadius']}>{this.state['error-maxRadius']}</label>*/}
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Minimum order amount per vendor to place order <i className="redFont">*</i></label>
															<div className="input-group" id= "minOrderValue"> 	
																<input className = "form-control" placeholder = "Minimum Order Value" ref = "minOrderValue"
																	type 		= "number" 
																	name 		= "minOrderValue"
																	value	 	= {this.state.minOrderValue} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext">{this.state.currency}</span> 
															</div>
															{/*<label className="error" value={this.state['error-minOrderValue']}>{this.state['error-minOrderValue']}</label>															*/}
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Maximum service charges applicable <i className="redFont">*</i></label>
															<div className="input-group" id= "maxServiceCharges"> 	
																<input className = "form-control" placeholder = "Default Service Charges" ref = "maxServiceCharges"
																	type 		= "number" 																	 
																	name 		= "maxServiceCharges"
																	value	 	= {this.state.maxServiceCharges} 
																	onChange = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext">{this.state.currency}</span> 
															</div>
															{/*<label className="error" value={this.state['error-maxServiceCharges']}>{this.state['error-maxServiceCharges']}</label>*/}
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Maximum number of vendors allowed in cart <i className="redFont">*</i></label>
															<div className="input-group" id = "maxNumberOfVendors" > 															
																<input className = "form-control" placeholder = "Maximum Number of Vendors Allowed in Cart" ref = "maxNumberOfVendors"
																	type 		= "number" 																
																	name 		= "maxNumberOfVendors"																
																	value	 	= {this.state.maxNumberOfVendors} 
																	onChange = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"><i className="fa fa-user"></i></span>														
															</div>  
														</div>  
													</div>
													{/*<label className="error" value={this.state['error-maxNumberOfVendors']}>{this.state['error-maxNumberOfVendors']}</label>*/}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<label className="col-lg-12 col-md-12 com-sm-12 col-xs-12 headLabel">Distance wise service charges <i className="redFont">*</i></label>
														<label className="col-lg-12 col-md-12 com-sm-12 col-xs-12 error " id="error-serviseChargesByDistance" >{this.state["error-serviseChargesByDistance"]}</label>
														{this.state.serviseChargesByDistance 
														?
															this.state.serviseChargesByDistance.map((dataRowArray, index)=>{
																return(
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}>    
																	{/*{console.log("index => ",index)} */}
																		{index === 0
																			?
																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding distanceRangeArray">   
																					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">   
																						<label>Minimum Distance<i className="redFont">*</i></label>
																					</div>
																					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">  
																						<label>Maximum Distance<i className="redFont">*</i></label> 
																					</div>
																					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
																						<label>Service Charges<i className="redFont">*</i></label>  
																					</div>
																				</div>  
																			:
																				null 
																		}                                                                          
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding distanceRangeArray">   
																			<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">   
																				<div className="input-group"> 
																					<input type="number" className={"form-control minDistance"+index} placeholder="Enter Minimum Distance" aria-label="Minimum Distance" aria-describedby="basic-addon1" ref={"minDistance-"+index}
																						id 			= {"minDistance-"+index} 
																						value 		= {dataRowArray.minDistance} 
																						name 			= {'minDistance-'+index} 
																						onChange 	= {this.handleChangeDistanceRange.bind(this)} 
																						min 			= {index > 0 ? (parseInt(this.state.serviseChargesByDistance[index-1].maxDistance) + 1) : 0}
																						max 			= {index > 0 ? (parseInt(this.state.maxRadius) - 1) : 0}
																						required
																					/>
																					<span class="input-group-addon addontext">{this.state.unitOfDistance + (dataRowArray.minDistance > 1 ? "s" : "")}</span>   
																				</div>  
																				<label className="error " id={'error-minDistance-'+index} value={this.state['error-minDistance-'+index]}>{this.state['error-minDistance-'+index]}</label>
																			</div>
																			<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">            
																				<div className="input-group"> 
																					<input type="number" className={"form-control maxDistance"+index} placeholder="Enter Maximum Distance" aria-label="Maximum Distance" aria-describedby="basic-addon1" ref={"maxDistance-"+index}
																						id 			= {"maxDistance-"+index} 
																						value 		= {dataRowArray.maxDistance} 
																						name 			= {"maxDistance-"+index} 
																						onChange 	= {this.handleChangeDistanceRange.bind(this)}
																						min 			= {index > 0 ? parseInt(dataRowArray.minDistance) + 1 : 1}
																						max 			= {this.state.maxRadius} 
																						required
																					/>
																					<span class="input-group-addon addontext">{this.state.unitOfDistance + (dataRowArray.maxDistance > 1 ? "s" : "")}</span>   
																				</div> 
																				<label className="error " id={'error-maxDistance-'+index} value={this.state['error-maxDistance-'+index]}>{this.state['error-maxDistance-'+index]}</label>
																			</div>
																			<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12"> 
																				<div className="input-group">            
																					<input type="number" className={"form-control serviceCharges"+index} placeholder="Enter Service Charges" aria-label="Service Charges" aria-describedby="basic-addon1" ref={"serviceCharges-"+index}
																						id 			= {"serviceCharges-"+index} 
																						value 		= {dataRowArray.serviceCharges} 
																						name 			= {"serviceCharges-"+index} 
																						onChange 	= {this.handleChangeDistanceRange.bind(this)} 
																						min 			= {0}
																						max 			= {this.state.maxServiceCharges} 
																						required
																					/>
																					<span class="input-group-addon addontext">{this.state.currency}</span>   
																				</div>
																				<label className="error " id={'error-serviceCharges-'+index} value={this.state['error-serviceCharges-'+index]}>{this.state['error-serviceCharges-'+index]}</label> 
																			</div>
																			<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 deleteDistanceRange fa fa-trash" id={"distance-"+index} onClick={this.deleteDistanceRange.bind(this)}>
																			</div>
																		</div>
{/*																		<div className="error col-lg-12 col-md-12 col-sm-12 col-xs-12" name={"distanceError"+index} id={"distanceError"+index}>{this.state["distanceError"+index]}</div>*/}
																	</div>
																);
															})
														:
															null
														}
														
													</div>												
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div onClick={this.addNewDistanceRange.bind(this)}  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn btn categoryBtn button3">Add New Distance Range</div>
														</div>
													</div>
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
export default OrderDeliveryPolicy;

