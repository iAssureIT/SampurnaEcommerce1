import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';

class CreditPointsPolicy extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           	    : "",
			"purchaseAmount" 	    : "",
			"creditPoint"           : "",
			"creditPointValue"      : "",
			"expiryLimitInDays" 	: ""
		};
	}

	/**=========== componentDidMount() ===========*/
	componentDidMount(){        
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

	/**=========== validation() ===========*/
	validation(){		
		jQuery.validator.setDefaults({
			debug   : true,
			success : "valid"
		});
		$("#CreditPointsPolicyForm").validate({
			rules: {
				purchaseAmount: {
					required: true,
				},
				creditPoint: {
					required: true,
				},
				creditPointValue: {
					required: true,
				},
				expiryLimitInDays: {
					required: true,
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "purchaseAmount") {
					error.insertAfter("#purchaseAmount");
					element.focus();
				}
				if (element.attr("name") === "creditPoint") {
					error.insertAfter("#creditPoint");
					element.focus();
				}
				if (element.attr("name") === "creditPointValue") {
					error.insertAfter("#creditPointValue");
					element.focus();
				}
				if (element.attr("name") === "expiryLimitInDays") {
					error.insertAfter("#expiryLimitInDays");
					element.focus();
				}
			}
		});
	}

	/**=========== componentWillMount() ===========*/
	componentWillMount() {
		axios.get("/api/creditpointspolicy/get")
		.then(creditPolicyData =>{
			if(creditPolicyData.data){
				this.setState({
					'editId'            : creditPolicyData.data[0]._id,
					'purchaseAmount'    : creditPolicyData.data[0].purchaseAmount,
					'creditPoint' 	    : creditPolicyData.data[0].creditPoint,
					'creditPointValue'  : creditPolicyData.data[0].creditPointValue,
					'expiryLimitInDays' : creditPolicyData.data[0].expiryLimitInDays
				})        
			}
		})
		.catch(error=>{
			console.log("Error : While getting credit points policy => ",error);
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
		
		this.setState({
			[name] : event.target.value
		});  	
	}

	/**=========== submit() ===========*/
	submit(event){ 
		event.preventDefault();    
		var formValues = {
			'purchaseAmount'    	: this.state.purchaseAmount,
			'creditPoint'       	: this.state.creditPoint,
			'creditPointValue'  	: this.state.creditPointValue,
			'expiryLimitInDays'  	: this.state.expiryLimitInDays
		}
		this.validation();
		// console.log('formValues', formValues);
		// console.log('condition', ($("#CreditPointsPolicyForm").valid()));
		if($("#CreditPointsPolicyForm").valid()){        
			axios.post('/api/creditpointspolicy/post', formValues)
			.then((response)=>{                
				// console.log("response post creditpoints :",response.data.message); 
				swal({
					text : response.data.message
				}) 
			})
			.catch((error)=>{
				console.log("Error while adding credit point policy=> ",error);
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
												<h4 className="weighttitle NOpadding-right"> Credit Points Policy </h4>
											</div>								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="CreditPointsPolicyForm">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Purchase Amount <i className="redFont">*</i></label>
															<div className="input-group" id = "purchaseAmount" >
																<input className="form-control" placeholder="Add purchase amount here..." ref="purchaseAmount"
																	type 		= "number"
																	name 		= "purchaseAmount" 
																	value 		= {this.state.purchaseAmount} 
																	onChange 	= {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> {this.state.currency} </span>   
															</div>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Credit Point <i className="redFont">*</i></label>
															<div className="input-group" id = "creditPoint" >
																<input className = "form-control" placeholder = "Add credit points on purchase amount" ref = "creditPoint"
																	type 		= "number"
																	name 		= "creditPoint"
																	value	 	= {this.state.creditPoint} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> Point </span>   
															</div>
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Redemption value of credit point <i className="redFont">*</i></label>
															<div className="input-group" id = "creditPointValue" >
																<input className = "form-control" ref = "creditPointValue" placeholder = "Add value of each credit point here.."
																	type 		= "number" 
																	name 		= "creditPointValue"
																	value	 	= {this.state.creditPointValue} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> {this.state.currency} </span>   
															</div>
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Credit points expires in <i className="redFont">*</i></label>
															<div className="input-group" id = "expiryLimitInDays">
																<input className = "form-control" ref = "expiryLimitInDays" placeholder = "Add number of days in which credit points will expire.."
																	type 		= "number"  
																	name 		= "expiryLimitInDays"
																	value	 	= {this.state.expiryLimitInDays} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> days </span>   
															</div>
														</div>                            
													</div>
												</form>
													<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-12 orderCancellationBtn">
															<label>&nbsp;</label>
															{this.state.editId 
																?
																	<button onClick={this.submit.bind(this)} className="btn button3">Update</button>
																:
																	<button onClick={this.submit.bind(this)} className="btn button3">Submit</button>
															}
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
export default CreditPointsPolicy;

