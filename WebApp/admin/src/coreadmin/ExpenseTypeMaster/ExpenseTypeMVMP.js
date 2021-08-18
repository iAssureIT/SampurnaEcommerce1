import React, { Component } from 'react';
// import { render }           from 'react-dom';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import IAssureTable         from  '../../coreadmin/IAssureTable/IAssureTable.jsx';

import './ExpenseTypeMaster.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';

class ExpenseTypeMaster extends Component{
	constructor(props) {
	 	super(props);
	 	this.state = {
			id            	: '',
			type          	: '',
			taxRate       	: '',
			VAT      		: '',
			otherTax      	: '',
			defaultPercent : 0,
			submitVal     	: true,
			startRange    	: 0,
			limitRange    	: 10,
			tableName     	: 'Tax-master',
			expenseData   	: [],
			tableHeading  	: {
									type          : "Product Tax Type",
									taxRate       : "Tax Rate",
									VAT           : "VAT",
									otherTax      : "Other",
									actions       : "Action"
								},
			tableObjects   : {
								  	deleteMethod    : 'delete',
								  	apiLink         : '/api/expensetypemaster/',
								  	paginationApply : false,
								  	searchApply     : false,
								  	editUrl         : '/global-masters',
			},
		};
		this.handleChange = this.handleChange.bind(this);
	}
  	
  	/*======= componentWillReceiveProps() =======*/
  	componentWillReceiveProps(nextProps){
	 	console.log("editId",this.state.editId);
	 	if (nextProps.editId !== this.state.editId) {
			this.setState({
			 	id : nextProps.editId
			},()=>{
			 	if(this.state.id){
					axios.get("/api/expensetypemaster/getSingleData/"+this.state.id)
					.then((response)=>{
						this.setState({
						  	id          : response.data[0]._id,
						  	type        : response.data[0].type,
						  	taxRate     : response.data[0].taxRate,
						  	VAT     		: response.data[0].VAT,
						  	otherTax    : response.data[0].otherTax,
						  	submitVal   : false,
						},()=>{});
					})
					.catch((error)=>{
						console.log("Error Get Single Expense Type Data = ",error);
					})
			 	}
			})
	 	}
  	}
  	
  	/*======= componentDidMount() =======*/
  	componentDidMount(props) {
	 	this.getExpenseTypeTable(this.state.startRange,this.state.limitRange);
	 
	 	$.validator.addMethod("regxtax", function (value, element, regexpr) {
			return regexpr.test(value);
	 	}, "Please enter valid tax rate.");

	 	jQuery.validator.setDefaults({
			debug 	: true,
			success 	: "valid"
	 	});

	 	$("#ExpenseTypeMasterForm").validate({
			rules : {
			  		type  	: {
				 	required : true,
			  	},
			  	taxRate : {
					required  : true,
				 	regxtax   : /^[0-9]\d*(\.\d+)?$/
			  	},
			  	VAT : {
				 	required  : true,
				 	regxtax   : /^[0-9]\d*(\.\d+)?$/
			  	},
			  	otherTax : {
				 	required  : true,
				 	regxtax   : /^[0-9]\d*(\.\d+)?$/
			  	},
			},

			errorPlacement: function (error, element) {
			  	if (element.attr("name") === "type") {
					error.insertAfter("#type");
			  	}
			  	if (element.attr("name") === "taxRate") {
					error.insertAfter("#taxRate");
			  	}
			  	if (element.attr("name") === "VAT") {
					error.insertAfter("#VAT");
			  	}
			  	if (element.attr("name") === "otherTax") {
					error.insertAfter("#otherTax");
			  	}
			} 
		}); 
  	}
  
  	/*======= getExpenseTypeTable() =======*/
  	getExpenseTypeTable(startRange,limitRange){
	 	var data = {
			startRange: startRange,
			limitRange: limitRange
	 	}
	 	
	 	axios.post(this.state.tableObjects.apiLink+'get/list', data)
		.then((response) => {
			if (response.data) {
			  	var tableData = response.data.map((a, i)=>{
				 	return {
						_id          	: a._id,
						type         	: a.type ? a.type : " - ",
						taxRate      	: a.taxRate ? a.taxRate + "%" : this.state.defaultPercent + "%",
						VAT     			: a.VAT ? a.VAT + "%" : this.state.defaultPercent + "%",
						otherTax     	: a.otherTax ? a.otherTax + "%" : this.state.defaultPercent + "%", 
				 	}
			  	})
			  	this.setState({
				 	expenseTableData : tableData
			  	})              
			}
		})
		.catch((error) => {   
			console.log("Error getExpenseTypeTable() = ",error);       
		});
  	}

  	/*======= submitData() =======*/
  	submitData(event){
	 	event.preventDefault();
	 
	 	var formValues = {
			type           : this.state.type,
			taxRate        : this.state.taxRate,
			VAT        		: this.state.VAT,
			otherTax       : this.state.otherTax,
	 	}

	 	var updateFormValues = {
			id          : this.state.id,
			type        : this.state.type,
			taxRate     : this.state.taxRate,
			VAT     		: this.state.VAT,
			otherTax    : this.state.otherTax,
	 	}

	 	// console.log('formValues = ',formValues);
	 	// console.log('updateFormValues = ',updateFormValues);

	 	if($("#ExpenseTypeMasterForm").valid()){
			if (this.state.submitVal) {
		  		// console.log("this.state.submitVal",this.state.submitVal);
		  		
		  		axios.post('/api/expensetypemaster/insertExpenseType',formValues)
				.then((response)=> {          
				  	if(response.data.duplicated === true){
					 	swal("", "Product Tax Type Already Exist");
				  	}else{
					 	this.getExpenseTypeTable(this.state.startRange,this.state.limitRange);
					 	swal({
							title   : "",
							text    : "Tax Details Added Successfully!",
					 	});
					 	this.setState({
							type        : '',
							taxRate    	: '',
							VAT   		: '',
							otherTax   	: '',
							submitVal  	: true
					 	})
				  	}   
				})
				.catch(function (error) {
				  	swal({
					 	title: " ",
					 	text : "Failed to Add Product Tax Type Details!",
				  	});
				})
			}else{
				// console.log('formValues = ',formValues);
			  	
			  	axios.patch('/api/expensetypemaster/updateExpenseType',updateFormValues)
				.then((response)=>{
					// console.log("response.data.updated == ", response.data.updated);
					
					if(response.data.updated === true){
						// console.log("response.data.updated == ");
						//this.props.history.push("/global-masters");
						swal({
						  	title : " ",
						  	text  : "Tax details updated successfully!",
						});  
							
						this.setState({
							id         	: '',
							type       	: '',
							taxRate    	: '',
							VAT   		: '',
							otherTax   	: '',
							submitVal  	: true,
						},()=>{ 
							this.getExpenseTypeTable(this.state.startRange,this.state.limitRange);  
						}); 
					}
					
					this.setState({
						id           	: "",
						type         	: "",
						taxRate      	: "",
						VAT           	: "",
						otherTax     	: "",
						submitVal    	: true,
					})               
				})
				.catch(function (error) {
				  	swal({
						title : " ",
						text  : "Failed to Update Product Tax Type details!",
					});
				})
			}  
		}
	}

	/*======= handleChange() =======*/
  	handleChange(event){
	 	const {name,value} = event.target;
	 	this.setState({ 
			[name] : value
	 	});
  	}
  	
  	/*======= delete() =======*/
  	delete(event){
	 	event.preventDefault();
	 	// console.log(event.currentTarget.getAttribute('data-id'))
	 	
	 	this.setState({
	 		id : event.currentTarget.getAttribute('data-id')
	 	})
	 	$('#deleteModal').show();
	}

	/*======= delexpence() =======*/
	delexpence(event){
		event.preventDefault();
		// console.log('id',this.state.id);
		
		axios.delete('/api/expensetypemaster/delete/'+this.state.id)
		.then((response)=>{
		  	if (response.data) {
			 	$('#deleteModal').hide();   
			
			 	this.expenseType();
			 	swal({
					title : " ",
					text  : "Record is deleted successfully.",
				});
			  	window.location.reload();
		  	} else{
			 	swal({
					title : " ",
					text  : "Failed to delete.",
				});
		  	}
		})
		.catch((error)=>{
		  	swal(error)
		})
  	}

  	/*======= closeModal() =======*/
  	closeModal(event){
	 	event.preventDefault();
	 	$('#deleteModal').hide(); 
  	}
  	
  	/*======= render() =======*/
  	render(){
	 	return(
		  	<div className="container-fluid">
			 	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					  	<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
							<h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Tax Master</h4>
					  	</div>
				  		<form id="ExpenseTypeMasterForm"  >
					 		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
						  			<div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
									 	<div className="form-group">
										  	<label className="labelform" >Product Tax Type</label><span className="astrick">*</span>
										  	<input id="type" data-text="type" type="text" name="type" ref="type" className="form-control areaStaes" 
											 	onChange = {this.handleChange.bind(this)}
											 	value    = {this.state.type}  
										  	/>
							 			</div>  
						  			</div>
									<div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
										<div className="form-group">
											<label className="labelform" >Tax Rate</label><span className="astrick">*</span>
											<div className="input-group" id="taxRate">
												<input data-text="taxRate" type="number" max="100" name="taxRate" ref="taxRate" className="form-control areaStaes" minLength="1" maxLength="4" min="0"
													onChange  = {this.handleChange.bind(this)}
													value     = {this.state.taxRate}  
													onKeyDown = {(event)=>(event.target.value > 100 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
												/>
												<span className="input-group-addon inputIcon addOn">%</span>
											</div>
										</div>
						  			</div>
						  			<div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
							 			<div className="form-group">
								  			<label className="labelform" >VAT</label><span className="astrick">*</span>
								  			<div className="input-group" id="VAT">
												<input type="number" max="100" name="VAT" ref="VAT" className="form-control areaStaes" minLength="1" maxLength="4" min="0"
													value     = {this.state.VAT} data-text="VAT" 
													onChange  = {this.handleChange.bind(this)} 
													onKeyDown = {(event)=>(event.target.value > 100 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
											 	/>
									 			<span className="input-group-addon inputIcon addOn">%</span>
								  			</div>
							 			</div>  
						  			</div>
						  			<div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
							 			<div className="form-group">
								  			<label className="labelform" >Other</label><span className="astrick">*</span>
								  			<div className="input-group" id="otherTax">
												<input data-text="otherTax" max="100" type="number" name="otherTax" ref="otherTax" className="form-control areaStaes" minLength="1" maxLength="4" min="0"
													onChange  = {this.handleChange.bind(this)}
													value     = {this.state.otherTax} 
													onKeyDown = {(event)=>(event.target.value > 100 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
												/>
									 			<span className="input-group-addon inputIcon addOn">%</span>
								  			</div>
							 			</div>  
						  			</div>
								</div> 
					 		</div>
					 		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
								<button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" 
						  			onClick={this.submitData.bind(this)} >
						  			{ this.state.submitVal ? "Submit" : "Update" }  
								</button>
					 		</div>
				  		</form>
					  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"marginBottom": "30px"}}>
						 	<IAssureTable
								tableHeading 	= {this.state.tableHeading}
								tableData    	= {this.state.expenseTableData}
								tableObjects 	= {this.state.tableObjects}
								getData      	= {this.getExpenseTypeTable.bind(this)}
								tableName 		= {this.state.tableName}
								currentView 	= {"Tax-master"}
						 	/>
					  	</div>
					</div>
			 	</div>
		  	</div>
		);
  	}
}

 export default ExpenseTypeMaster;