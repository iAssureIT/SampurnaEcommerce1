import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';

class RewardPointsPolicy extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           	    : "",
			"purchaseAmount" 	    : "",
			"rewardPoint"           : "",
			"rewardPointValue"      : ""
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
		$("#RewardPointsPolicyForm").validate({
			rules: {
				purchaseAmount: {
					required: true,
				},
				rewardPoint: {
					required: true,
				},
				rewardPointValue: {
					required: true,
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "purchaseAmount") {
					error.insertAfter("#purchaseAmount");
					element.focus();
				}
				if (element.attr("name") === "rewardPoint") {
					error.insertAfter("#rewardPoint");
					element.focus();
				}
				if (element.attr("name") === "rewardPointValue") {
					error.insertAfter("#rewardPointValue");
					element.focus();
				}
			}
		});
	}

	/**=========== componentWillMount() ===========*/
	componentWillMount() {
		axios.get("/api/rewardpointspolicy/get")
		.then(rewardPolicyData =>{
			if(rewardPolicyData.data){
				this.setState({
					'editId'            : rewardPolicyData.data[0]._id,
					'purchaseAmount'    : rewardPolicyData.data[0].purchaseAmount,
					'rewardPoint' 	    : rewardPolicyData.data[0].rewardPoint,
					'rewardPointValue'  : rewardPolicyData.data[0].rewardPointValue
				})        
			}
		})
		.catch(error=>{
			console.log("Error : While getting reward points policy => ",error);
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
			'purchaseAmount'    : this.state.purchaseAmount,
			'rewardPoint'       : this.state.rewardPoint,
			'rewardPointValue'  : this.state.rewardPointValue
		}
		
		// console.log('formValues', formValues);
		if($("#RewardPointsPolicyForm").valid()){        
			axios.post('/api/rewardpointspolicy/post', formValues)
			.then((response)=>{                
				// console.log("response post rewardpoints :",response.data.message); 
				swal({
					text : response.data.message
				}) 
			})
			.catch((error)=>{
				console.log("Error while adding reward point policy=> ",error);
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
												<h4 className="weighttitle NOpadding-right"> Reward Points Policy </h4>
											</div>								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="RewardPointsPolicyForm" className="">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Purchase Amount <i className="redFont">*</i></label>
															<div className="input-group">
																<input className="form-control" placeholder="Add purchase amount here..." ref="purchaseAmount"
																	type 		= "number"
																	name 		= "purchaseAmount" 
																	id 			= "purchaseAmount" 
																	value 		= {this.state.purchaseAmount} 
																	onChange 	= {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> {this.state.currency} </span>   
															</div>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Reward Point <i className="redFont">*</i></label>
															<div className="input-group">
																<input className = "form-control" placeholder = "Add reward points on purchase amount" ref = "rewardPoint"
																	type 		= "number" 
																	id 			= "rewardPoint" 
																	name 		= "rewardPoint"
																	value	 	= {this.state.rewardPoint} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> Point </span>   
															</div>
														</div>                            
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<label>Reward Point Value <i className="redFont">*</i></label>
															<div className="input-group">
																<input className = "form-control" ref = "rewardPoint" placeholder = "Add value of each reward point here.."
																	type 		= "number" 
																	id 			= "rewardPointValue" 
																	name 		= "rewardPointValue"
																	value	 	= {this.state.rewardPointValue} 
																	onChange    = {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext"> {this.state.currency} </span>   
															</div>
														</div>                            
													</div>
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
export default RewardPointsPolicy;

