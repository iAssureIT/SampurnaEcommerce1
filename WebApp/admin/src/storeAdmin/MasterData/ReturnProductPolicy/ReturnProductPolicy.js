import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
// import  './OrderDeliveryPolicy.css';

class ReturnProductPolicy extends Component {
	constructor(props) {        
		super(props);
		this.state = {
			"editId"           			: "",
			"maxDaysToReturn" 			: "",
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
		// this.getAdminPreferences();
        this.getReturnPolicy();
	}

	//======= Admin Preferences ==========
	getAdminPreferences(){
		// axios.get("/api/adminpreference/get")
		// .then(preferences =>{
		// 	if(preferences.data){
		// 		// console.log("preferences.data[0] => ",preferences.data[0])
		// 		// var askpincodeToUser = preferences.data[0].askPincodeToUser;

		// 		this.setState({
		// 			'websiteModel'     	: preferences.data[0].websiteModel,
		// 			'askPincodeToUser' 	: preferences.data[0].askPincodeToUser,
		// 			'showLoginAs'      	: preferences.data[0].showLoginAs,
		// 			'showInventory'    	: preferences.data[0].showInventory,
		// 			'showDiscount'    	: preferences.data[0].showDiscount,
		// 			'showCoupenCode'    : preferences.data[0].showCoupenCode,
		// 			'showOrderStatus'   : preferences.data[0].showOrderStatus,
		// 			'currency' 			: preferences.data[0].currency,
		// 			'unitOfDistance' 	: preferences.data[0].unitOfDistance
		// 		})									
		// 	}
		// })
		// .catch(error=>{
		// 		console.log("Error in preferences = ", error);
		// 		if(error.message === "Request failed with status code 401"){
		// 			var userDetails =  localStorage.removeItem("userDetails");
		// 			localStorage.clear();
		// 			swal({  
		// 					title : "Your Session is expired.",                
		// 					text  : "You need to login again. Click OK to go to Login Page"
		// 			})
		// 			.then(okay => {
		// 			if (okay) {
		// 					window.location.href = "/login";
		// 			}
		// 			});
		// 		}
		// })
	}

	/**=========== validation() ===========*/
	validation(){		
		jQuery.validator.setDefaults({
			debug   : true,
			success : "valid"
		});
		$("#ReturnProductPolicyForm").validate({
			rules: {
				maxDaysToReturn: {
					required: true,
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "maxDaysToReturn") {
					error.insertAfter("#maxDaysToReturn");
					element.focus();
				}
			}
		});
	}

	/**=========== getReturnPolicy() ===========*/
	getReturnPolicy() {
		axios.get("/api/returnpolicy/get")
		.then(returnPolicy =>{
			if(returnPolicy.data){
				console.log("preferences.data=========",returnPolicy.data);
				this.setState({
					'editId'           			: returnPolicy.data._id,
					'maxDaysToReturn'     		: returnPolicy.data.maxDaysToReturn
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

	/**=========== submit() ===========*/
	submit(event){ 
		event.preventDefault();    
		var formValues = {
			'maxDaysToReturn'     		    : this.state.maxDaysToReturn,
		}		
		console.log('formValues', formValues);
		console.log("condition => ",($("#ReturnProductPolicyForm").valid()));
		if($("#ReturnProductPolicyForm").valid()){        
			axios.post('/api/returnpolicy/post', formValues)
			.then((response)=>{                
					console.log("response return policy ",response.data); 
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
												<h4 className="weighttitle NOpadding-right">Return Products Policy </h4>
											</div>
								
											<div className="col-lg-12 col-md-12 marginTopp NOpadding">
												<form id="ReturnProductPolicyForm" className="">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fieldWrapper">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">														 	
															<label>Maximum Allowable Days for Product Return <i className="redFont">*</i></label>
															<div className="input-group">
																<input className="form-control" placeholder="Maximum Allowable Days" ref="maxDaysToReturn"
																	type 		= "number"
																	name 		= "maxDaysToReturn" 
																	id 			= "maxDaysToReturn" 
																	value 		= {this.state.maxDaysToReturn} 
																	onChange 	= {this.handleChange.bind(this)} 
																/>
																<span class="input-group-addon addontext">Days</span>   
															</div>
														</div>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 subBtnDiv">
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
export default ReturnProductPolicy;

