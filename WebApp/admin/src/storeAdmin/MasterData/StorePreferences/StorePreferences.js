import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import  './StorePreferences.css';

class StorePreferences extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           			: "",
			"maxRadius" 				: "",
			"minOrderValue"      		: "",
			"defaultServiceCharges" 	: "", 		
			"serviseChargesByDistance" 	: [{
				minDistance 	: 0,
				maxDistance 	: 0,
			}],
		};
	}

	/**=========== componentDidMount() ===========*/
	componentDidMount(){        
		// console.log("2.inside component didmount");
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token         = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		this.validation();
	}

	/**=========== validation() ===========*/
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

	/**=========== componentWillMount() ===========*/
	componentWillMount() {
		axios.get("/api/storepreference/get")
		.then(storepreference =>{
			if(storepreference.data){
				console.log("preferences.data=========",storepreference.data[0].defaultServiceCharges);
				this.setState({
					'editId'           			: storepreference.data[0]._id,
					'maxRadius'     			: storepreference.data[0].maxRadius,
					'minOrderValue' 			: storepreference.data[0].minOrderValue,
					'defaultServiceCharges' 	: storepreference.data[0].defaultServiceCharges,
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
		console.log("target => ",target);
		console.log("name => ",name);
		console.log("VALUE => ",event.target.value);
		this.setState({
			[name] : event.target.value
		});  	
	}

	/**=========== addNewDistanceRange() ===========*/
	addNewDistanceRange(event){
		let arrLength = this.state.serviseChargesByDistance ? this.state.serviseChargesByDistance : [];
		arrLength.push({
			minDistance 	: 0,
			maxDistance 	: 0,
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
        var name  = event.target.name;

        if(name.search("-") > -1){
            var nameArr = name.split("-");
            name        = nameArr[0];
            index       = nameArr[1];
        }

        var serviseChargesByDistance 	= this.state.serviseChargesByDistance; 
        var distanceObj           		= serviseChargesByDistance[index];
        distanceObj[name]         		= event.target.value;

        if (event.target.value === "") {
            event.target.focus();
        }
        this.setState({
            serviseChargesByDistance : serviseChargesByDistance,  
        },()=>{});
	}

	/**=========== deleteDistanceRange() ===========*/
	deleteDistanceRange(event){
		event.preventDefault();
		var id = event.target.id;
		console.log('subCategory Id',id);
		// console.log("serviseChargesByDistance before => ",this.state.serviseChargesByDistance);
		let arrLength 	= this.state.serviseChargesByDistance ? this.state.serviseChargesByDistance : null;
		var index 		= id.split("-")[1];
		console.log('index =>',index);
		
		arrLength.splice(index, 1);
		this.setState({
			serviseChargesByDistance : arrLength
		},()=>{
			console.log("serviseChargesByDistance after => ",this.state.serviseChargesByDistance);
		});
	}

	/**=========== submit() ===========*/
	submit(event){ 
		event.preventDefault();    
		var formValues = {
			'maxRadius'     				: this.state.maxRadius,
			'minOrderValue' 				: this.state.minOrderValue,
			'defaultServiceCharges' 		: this.state.defaultServiceCharges,
			'serviseChargesByDistance' 		: this.state.serviseChargesByDistance
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
												<h4 className="weighttitle NOpadding-right">Store Prefereces </h4>
											</div>
								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="StorePreferencesForm" className="">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Maximum Distance Radius to Show Vendors <i className="redFont">*</i></label>
															<input className="form-control" placeholder="Maximum Radius in Kms" ref="maxRadius"
															 	type 		= "number"
																name 		= "maxRadius" 
																id 			= "maxRadius" 
																value 		= {this.state.maxRadius} 
																onChange 	= {this.handleChange.bind(this)} 
															/>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Minimum order amount per vendor to place order<i className="redFont">*</i></label>
															<input className = "form-control" placeholder = "Minimum Order Value" ref = "minOrderValue"
																type 		= "text" 
																id 			= "minOrderValue" 
																name 		= "minOrderValue"
																value	 	= {this.state.minOrderValue} 
																onChange    = {this.handleChange.bind(this)} 
															/>
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Maximum service charges applicable<i className="redFont">*</i></label>
															<input className = "form-control" placeholder = "Default Service Charges" ref = "defaultServiceCharges"
																type 		= "text" 
																id 			= "defaultServiceCharges" 
																name 		= "defaultServiceCharges"
																value	 	= {this.state.defaultServiceCharges} 
																onChange = {this.handleChange.bind(this)} 
															/>
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<label className="col-lg-12 col-md-12 com-sm-12 col-xs-12 headLabel">Distance wise service charges</label>
														{this.state.serviseChargesByDistance 
														?
															this.state.serviseChargesByDistance.map((dataRowArray, index)=>{
																return(
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}>    
																	{console.log("index => ",index)} 
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
																				<input type="number" className={"form-control minDistance"+index} placeholder="Enter Minimum Distance" aria-label="Minimum Distance" aria-describedby="basic-addon1" ref={"minDistance-"+index}
																					id 			= {"minDistance-"+index} 
																					value 		= {dataRowArray.minDistance} 
																					name 		= {'minDistance-'+index} 
																					onChange 	= {this.handleChangeDistanceRange.bind(this)} 
																					required
																				/>
																				{/* <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>       */}
																			</div>
																			<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">            
																				<input type="number" className={"form-control maxDistance"+index} placeholder="Enter Maximum Distance" aria-label="Maximum Distance" aria-describedby="basic-addon1" ref={"maxDistance-"+index}
																					id 			= {"minDistance-"+index} 
																					value 		= {dataRowArray.maxDistance} 
																					name 		= {"maxDistance-"+index} 
																					onChange 	= {this.handleChangeDistanceRange.bind(this)} 
																					required
																				/>
																			</div>
																			<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">            
																				<input type="number" className={"form-control serviceCharges"+index} placeholder="Enter Service Charges" aria-label="Service Charges" aria-describedby="basic-addon1" ref={"serviceCharges-"+index}
																					id 			= {"serviceCharges-"+index} 
																					value 		= {dataRowArray.serviceCharges} 
																					name 		= {"serviceCharges-"+index} 
																					onChange 	= {this.handleChangeDistanceRange.bind(this)} 
																					required
																				/>
																			</div>
																			<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 deleteDistanceRange fa fa-trash" id={"distance-"+index} onClick={this.deleteDistanceRange.bind(this)}>
																			</div>
																		</div>
																		<div className="error col-lg-12 col-md-12 col-sm-12 col-xs-12" name={"distanceError"+index} id={"distanceError"+index}>{this.state["distanceError"+index]}</div>
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
export default StorePreferences;

