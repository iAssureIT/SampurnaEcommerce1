import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';

class LocationDetails extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'locationType': '--Select Location Type--',
			'addressLineone': '',
			'city': '',
			'states': '',
			'district' 			: '',
			'area': '',
			'addressLinetwo': '',
			'pincode': '',
			'country': '-- Select --',
			'indexOneValue': '',
			'uderscoreId': '',
			'locationTypeDisable': true,
			'stateArray': [],
			'districtArray': [],
			'pincodeExists':true,
			'openForm' : false,
			'vendor_ID': this.props.match.params ? this.props.match.params.vendor_ID : '',
			'location_ID': this.props.match.params ? this.props.match.params.location_ID : ''
			
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeCountry = this.handleChangeCountry.bind(this);
		this.handleChangeState = this.handleChangeState.bind(this);
		this.handleChangeDistrict = this.handleChangeDistrict.bind(this);
		this.handleChangeBlock = this.handleChangeBlock.bind(this);
		this.camelCase = this.camelCase.bind(this)
	}

	componentDidMount() {
		this.getLocationType();
		this.locationDetails();
		this.edit();
		
		window.scrollTo(0, 0);
		$.validator.addMethod("regxlocationType", function (value, element, arg) {
			return arg !== value;
		  }, "Please select the location type");
		$.validator.addMethod("regxAlphaNum", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Name should only contain letters.");
		$.validator.addMethod("regxcountry", function (value, element, arg) {
			return arg !== value;
		}, "Please select the country");
		$.validator.addMethod("regxstate", function (value, element, arg) {
			return arg !== value;
		}, "Please select the state");
		$.validator.addMethod("regxdistrict", function (value, element, arg) {
			return arg !== value;
		}, "Please select the district");
		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#locationsDetail").validate({
			rules: {
				locationType: {
					required: true,
					regxlocationType: "--Select Location Type--"
				},
				addressLineone : {
					required :true
				},
				country: {
					required: true,
					regxcountry: "--Select--"
				},
				states: {
					required: true,
					regxstate: "--Select--"
				},
				district: {
					required: true,
					regxdistrict: "--Select--"
				},
				area: {
					required: true,
					regxAlphaNum: /^[a-zA-Z/\s,.'-/]*$|^$/,
				},
				pincode : {
					required : true
				}

			},
			errorPlacement: function(error, element) {
				if (element.attr("name") == "locationType"){
				  error.insertAfter("#locationType");
				}
				if (element.attr("name") == "addressLineone"){
					error.insertAfter("#addressLineone");
				}
				if (element.attr("name") == "country"){
					error.insertAfter("#country");
				}
				if (element.attr("name") == "states"){
					error.insertAfter("#states");
				}
				if (element.attr("name") == "district"){
					error.insertAfter("#district");
				}
				if (element.attr("name") == "pincode"){
					error.insertAfter("#pincode");
				}
			}
		})
		this.handleChange = this.handleChange.bind(this);
	}
	openForm(){
		this.setState({
			openForm : this.state.openForm == false ? true : false
		})
	}

	handleChange(event) {
		const target = event.target;
		const name = target.name;
		this.setState({
			[name]: event.target.value
		});

		if (name == 'area') {
			var currentVal = event.currentTarget.value;
			if (currentVal.match('[a-zA-Z ]+')) {
				this.setState({
					[name]: event.target.value
				});
			} else {
				this.setState({
					[name]: ''
				});
			}
		}
	}

	handleChangeCountry(event) {
		const target = event.target;
		this.setState({
			[event.target.name]: event.target.value
		});
		this.getStates($(target).val())
	}
	getStates(StateCode) {
		axios.get("http://locationapi.iassureit.com/api/states/get/list/" + StateCode)
			.then((response) => {

				this.setState({
					stateArray: response.data
				})
				$('#Statedata').val(this.state.states);
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
	handleChangeState(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		const target = event.target;
		const stateCode = $(target).val();
		const countryCode = $("#country").val();

		this.getDistrict(stateCode, countryCode);

	}
	getDistrict(stateCode, countryCode) {
		axios.get("http://locationapi.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
			.then((response) => {
				this.setState({
					districtArray: response.data
				})
				$('#Citydata').val(this.state.city);
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
	handleChangeDistrict(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		const target = event.target;
		const districtName = $(target).val();
		const stateCode = $('#Statedata').val();
		const countryCode = $("#country").val();
		this.getBlocks(districtName, stateCode, countryCode);
	}

	handleChangeBlock(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		const target = event.target;
		const blockName = $(target).val();
		const districtName = $('#Citydata').val();
		const stateCode = $('#Statedata').val();
		const countryCode = $("#country").val();
		this.getAreas(blockName, districtName, stateCode, countryCode);
	}

	getBlocks(districtName, stateCode, countryCode) {
		axios.get("http://locationapi.iassureit.com/api/blocks/get/list/" + countryCode + '/' + stateCode + "/" + districtName)
			.then((response) => {
				this.setState({
					blocksArray: response.data
				})
				$('#Blocksdata').val(this.state.block);
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
	getAreas(blockName, districtName, stateCode, countryCode) {
		axios.get("http://locationapi.iassureit.com/api/areas/get/list/" + countryCode + '/' + stateCode + "/" + districtName + '/' + blockName + '/Pune city')
			.then((response) => {
				this.setState({
					areasArray: response.data
				})
				$('#Areasdata').val(this.state.area);
			})
			.catch((error) => {
				console.log('error', error);
			})
	}
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	locationdetailBack(event) {
		event.preventDefault();
		var id = this.props.match.params.vendor_ID;
		if (window.location.pathname == '/LocationDetails/' + id) {
			this.props.history.push("/SupplierOnboardingForm/" + id);
		} else if (window.location.pathname == '/LocationDetailsSTL/' + id) {
			this.props.history.push("/SupplierOnboardingFormSTL/" + id);
		} else {
			this.props.history.push("/vendor-onboarding/" + id);
		}
	}
	locationdetailsAdd(event) {
		event.preventDefault();
		var vendor_ID = this.props.match.params.vendor_ID;
		console.log('ghgh', $('#locationsDetail').valid());
		if($('#locationsDetail').valid() && this.state.pincodeExists){
			var formValues = {
				'locationType' 			: this.refs.locationType.value,
				'addressLineone' 		: this.refs.addressLineone.value,
				'city' 					: this.refs.city.value,
				'district' 				: this.refs.district.value,
				'states' 				: this.refs.states.value,
				'area' 					: this.refs.area.value,
				'addressLinetwo' 		: this.refs.addressLinetwo.value,
				'pincode' 				: this.refs.pincode.value,
				'country' 				: this.refs.country.value,
			}
			axios.patch('/api/vendors/insert/location/'+vendor_ID, formValues)
			.then((response) => {
				$('.inputText').val('');
				this.setState({
					'locationType': '--Select Location Type--',
					'addressLineone': '',
					'city': '',
					'states': '-- Select --',
					'area': '',
					'addressLinetwo': '',
					'pincode': '',
					'country': '-- Select --',
				});
				this.locationDetails();
				swal(response.data.message);
				$("#locationsDetail").validate().resetForm();
			})
			.catch((error) => {

			})
		}
	}

	locationdetailBtn(event) {
		event.preventDefault();
		if (this.state.locationType != "--Select Location Type--" || this.state.addressLineone != '' || this.state.city != '-- Select --' || this.state.states != '-- Select --' || this.state.area != '-- Select --' || this.state.addressLinetwo != '' || this.state.pincode != '' || this.state.country != '-- Select --') {
			swal({
				title: 'abc',
				text: "It seem that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page.But you may lose values if already entered in the location form",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
				.then((value) => {
					var router = this.props.match.params.vendor_ID;
					var routeIdSplit = router.split('-');
					if (routeIdSplit[1]) {
						var routerId = router;
					} else {
						var routerId = router;
					}
					if (routerId && value === true) {
						// var id = this.props.match.params.vendor_ID;

						if (window.location.pathname == '/LocationDetails/' + routerId) {
							this.props.history.push("/ContactDetails/" + routerId);
						} else if (window.location.pathname == '/LocationDetailsSTL/' + routerId) {
							this.props.history.push("/ContactDetailsSTL/" + routerId);
						} else if (window.location.pathname == '/LocationDetailsSTM/' + routerId) {
							this.props.history.push("/contact-details/" + routerId);
						} else {
							this.props.history.push("/contact-details/" + routerId);
						}
					} else {
						this.props.history.push("/LocationDetails/" + routerId);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			var routerId = this.props.match.params.vendor_ID;

			if (routerId) {
				if (window.location.pathname == '/LocationDetails/' + routerId) {
					this.props.history.push("/ContactDetails/" + routerId);
				} else if (window.location.pathname == '/LocationDetailsSTL/' + routerId) {
					this.props.history.push("/ContactDetailsSTL/" + routerId);
				} else if (window.location.pathname == '/LocationDetailsSTM/' + routerId) {
					this.props.history.push("/contact-details/" + routerId);
				} else {
					this.props.history.push("/contact-details/" + routerId);
				}
				// this.props.history.push("/ContactDetails/"+routerId);
			} else {
				if (window.location.pathname == '/LocationDetails/') {
					this.props.history.push("/ContactDetails/");
				} else if (window.location.pathname == '/LocationDetailsSTL/') {
					this.props.history.push("/ContactDetailsSTL/");
				} else {
					this.props.history.push("/contact-details/");
				}
				// this.props.history.push("/ContactDetails/");
			}
		}
	}
	componentWillReceiveProps(props) {
		this.edit();
	}
	edit() {
		var vendorID = this.state.vendor_ID;
		var locationID = this.state.location_ID;
		console.log('lo', locationID);
		if(locationID){
			axios.get('/api/vendors/get/one/'+vendorID)
			.then((response)=>{
				var editData = response.data.locationDetails.filter((a)=> a._id == locationID );
				this.getStates(editData[0].country);
				this.getDistrict(editData[0].states, editData[0].country);
				this.getBlocks(editData[0].district, editData[0].states, editData[0].country);
				this.setState({
					'openForm' 			: true,
					'locationType' 		: editData[0].locationType,
					'addressLineone' 	: editData[0].addressLineone,
					'city' 				: editData[0].city,
					'states' 			: editData[0].states,
					'district' 			: editData[0].district,
					'area' 				: editData[0].area,
					'addressLinetwo' 	: editData[0].addressLinetwo,
					'pincode' 			: editData[0].pincode,
					'country' 			: editData[0].country,
				})
			})
			.catch((error)=>{
				console.log('error', error);
			})
		}
	}
	locationDetails() {
		var route = this.props.match.params.vendor_ID;
		axios.get('/api/vendors/get/one/' + this.props.match.params.vendor_ID)
			.then((response) => {
				this.setState({
					locationarray: response.data.locationDetails
				})
			})
			.catch((error) => {
				console.log('error', error);
			})
		return [];
	}
	locationDelete(event) {
		event.preventDefault();
		var vendorID = this.state.vendor_ID;
		var locationID = event.target.id;
		console.log('loca', locationID);
		var formValues = {
			vendor_ID   : vendorID,
			location_ID : locationID
		}
		axios.patch('/api/vendors/delete/location/'+vendorID+"/"+locationID, formValues)
		.then((response)=>{
			this.locationDetails();
			swal(response.data.message);
		})
		.catch((error)=>{
			console.log('error', error);
		})
	}
	updateLocationDetails(event) {
		event.preventDefault();
		var vendor_ID = this.props.match.params.vendor_ID;
		var location_ID = this.props.match.params.location_ID;
		if ($('#locationsDetail').valid() && this.state.pincodeExists) {
			var formValues = {
				'locationType': this.refs.locationType.value,
				'addressLineone': this.refs.addressLineone.value,
				'city': this.refs.city.value,
				'district' 			: this.refs.district.value,
				'states': this.refs.states.value,
				'area': this.refs.area.value,
				'addressLinetwo': this.refs.addressLinetwo.value,
				'pincode': this.refs.pincode.value,
				'country': this.refs.country.value,
			}
			axios.patch('/api/vendors/update/location/'+vendor_ID+"/"+location_ID, formValues)
			.then((response) => {
				this.setState({
					'locationType': '--Select Location Type--',
					'addressLineone': '',
					'city': '',
					'states': '-- Select --',
					'area': '',
					'addressLinetwo': '',
					'pincode': '',
					'country': '-- Select --',
					'openForm' : false,
					'location_ID' : ""
				});
				this.props.history.push('/location-details/'+vendor_ID);
				this.locationDetails();
				swal(response.data.message);
				$("#locationsDetail").validate().resetForm();
			})
			.catch((error) => {

			})

		} 
	}
	admin(event) {
		event.preventDefault();
		this.props.history.push('/adminDashboard');
	}
	getLocationType() {
		axios.get('/api/vendorLocationType/get/list')
		.then((response) => {
			this.setState({
				locationTypeArry: response.data
			})
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
	handlePincode(event){
		console.log(event.target.value);
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value != '') {
            axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
            .then((response) => {
                // console.log('valid', $("[name='modalpincode']").valid())
                // console.log('pincodeExists', this.state.pincodeExists);

                if ($("[name='pincode']").valid()) {

                    if (response.data[0].Status == 'Success' ) {
                        this.setState({pincodeExists : true})
                    }else{
                        this.setState({pincodeExists : false})
                    }
                }else{
                    this.setState({pincodeExists : true})
                }
                
            })
            .catch((error) => {
                console.log('error', error);
            })
        }else{
            this.setState({pincodeExists : true})
        }
    }
	render(){
		return (
			<div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div className="row">
					{
						<section className="content">
							<div className="">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
									<div className="row">
										<div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
												<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
													<h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Vendor Management</h4>
													<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
														
													</div>
												</div>
											</div>
											<div id="parkingreport" className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<ul className="nav nav-pills">
													<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
														<a href="" className="basic-info-pillss backcolor">
															<i className="fa fa-info-circle" aria-hidden="true"></i>
															Basic Info
														</a>
														<div className="triangleone" id="triangle-right"></div>

													</li>
													<li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2">
														<div className="triangletwo" id="triangle-right1"></div>

														<a href="" className="basic-info-pillss">
															<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i>
															Location
														</a>
														<div className="trianglethree triangle3" id="triangle-right"></div>

													</li>
													<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn4 disabled">
														<div className="trianglesix" id="triangle-right2"></div>

														<a href="" className="basic-info-pillss backcolorAct backgroundPro">
															<i className="fa fa-cube phoneIcon" aria-hidden="true"></i>
															Contact
														</a>

													</li>

												</ul>
											</div>
											<section className="Content">
												<div className="row">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<form id="locationsDetail" className="todaysParkingReport" >
															<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
																		<h4 className="MasterBudgetTitle"><i className="fa fa-map-marker" aria-hidden="true"></i> Location Details</h4>
																	</div>
																	<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
																		<div className="button4  pull-right" onClick={this.openForm.bind(this)}>
																			<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Location
																		</div>
																	</div>
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
																</div>
																{
																	this.state.openForm == true ? 
																
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addLocationForm" >
																		
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationSupplierForm">
																				<div  className="col-lg-6 col-md-6 col-sm-6 col-xs-12" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup>
																					</label>
																					<select id="locationType" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.locationType} ref="locationType" name="locationType" onChange={this.handleChange}>
																						<option disabled>--Select Location Type--</option>
																						{this.state.locationTypeArry && this.state.locationTypeArry.length > 0 ?
																							this.state.locationTypeArry.map((locationtypedata, index) => {
																								
																								return (
																									<option key={index}>{locationtypedata.locationType}</option>
																								);
																							}
																							)
																							:
																							null
																						}
																					</select>
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 1 <sup className="astrick">*</sup>
																						<a data-tip data-for='happyFace' className="pull-right"> <i className="fa fa-question-circle"></i> </a>
																					
																					</label>
																					<input id="addressLineone" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.addressLineone} ref="addressLineone" name="addressLineone" onChange={this.handleChange} />
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 2</label>
																					<input id="Line2" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.addressLinetwo} ref="addressLinetwo" name="addressLinetwo" onChange={this.handleChange} />
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Country <sup className="astrick">*</sup>
																					</label>
																					<select id="country" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12"
																						ref="country" name="country" value={this.state.country} onChange={this.handleChangeCountry} >
																						<option selected={true} disabled={true}>-- Select --</option>
																						<option value="IN">India</option>
																						{
																							/* this.props.postCountry.map((Countrydata, index)=>{
																							return(      
																							<option  key={index}>{Countrydata.countryName}</option>
																							);
																							}
																							)*/
																						}
																					</select>
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">State <sup className="astrick">*</sup> {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																					</label>
																					<select id="states" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12"
																						ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
																						<option selected={true} disabled={true}>-- Select --</option>
																						{
																							this.state.stateArray && this.state.stateArray.length > 0 ?
																								this.state.stateArray.map((stateData, index) => {
																									return (
																										<option key={index} value={stateData.stateCode}>{this.camelCase(stateData.stateName)}</option>
																									);
																								}
																								) : ''
																						}
																					</select>

																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">District <sup className="astrick">*</sup> {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																					</label>
																					<select id="district" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12"
																						ref="district" name="district" value={this.state.district} onChange={this.handleChangeDistrict} >
																						<option selected={true} disabled={true}>-- Select --</option>
																						{
																							this.state.districtArray && this.state.districtArray.length > 0 ?
																								this.state.districtArray.map((districtdata, index) => {
																									return (
																										<option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
																									);
																								}
																								) : ''
																						}
																					</select>
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">City {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																					</label>
																					<input type="text" id="city" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} />
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Area {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																					</label>
																					<input type="text" id="area" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
																				</div>
																				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" >
																					<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Pincode <sup className="astrick">*</sup>
																					</label>
																					<input maxLength="6" onChange={this.handlePincode.bind(this)}  type="text" id="pincode" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" />
																					{this.state.pincodeExists ? null : <label style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}
																				</div>
																			</div>
																			<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  marginsB">

																				{
																					this.state.location_ID ?
																						<button className="button3 btn-primary pull-right" onClick={this.updateLocationDetails.bind(this)}>&nbsp;Update Location</button>
																						:
																						<button className="button3 btn-primary pull-right" onClick={this.locationdetailsAdd.bind(this)}>&nbsp;Submit</button>
																				}
																			</div>
																		
																	</div>
																	:
																	null
																}
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  marginsB">
																	<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Basic Info</button>
																	<button className="button1 pull-right" onClick={this.locationdetailBtn.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
																</div>
															</div>

														</form>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
																<h4 className="MasterBudgetTitle">Location Details</h4>
															</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																{this.state.locationarray && this.state.locationarray.length > 0 ?
																	this.state.locationarray.map((Suppliersdata, index) => {
																		return (
																			<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1" key={index}>
																				<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																					<i className="fa fa-map-marker" aria-hidden="true"></i>
																				</div>
																				<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																					<li>{Suppliersdata.locationType}</li>
																					<li>{Suppliersdata.addressLineone} , {Suppliersdata.addressLinetwo}</li>
																					<li>{Suppliersdata.city},{Suppliersdata.states} {Suppliersdata.pincode}</li>
																				</ul>
																				<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																					<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																					<div className="dropdown-content dropdown-contentLocation">
																						<ul className="pdcls ulbtm">
																							<li  name={index}>
																								<a href={"/location-details/"+this.props.match.params.vendor_ID+"/"+Suppliersdata._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																							</li>
																							<li  name={index}>
																								<span onClick={this.locationDelete.bind(this)} id={Suppliersdata._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																							</li>
																						</ul>
																					</div>
																				</div>
																			</div>
																		);
																	})
																	:
																	<div className="textAlign">Locations will be shown here.</div>
																}
															</div>
														</div>
													</div>
												</div>
											</section>
										</div>
									</div>
								</div>
							</div>
						</section>
					}
				</div>
			</div>
		);
	}
}
export default LocationDetails;
