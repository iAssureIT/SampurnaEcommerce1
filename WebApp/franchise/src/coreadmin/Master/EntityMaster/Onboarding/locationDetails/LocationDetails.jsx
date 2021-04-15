import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/js/tab.js';
import S3FileUpload from 'react-s3';
import { withRouter } from 'react-router-dom';
import OneFieldForm             from '../../../OneFieldForm/OneFieldForm.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";



class LocationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'locationType': "",
			'addressLine1': "",
			'addressLine2': "",
			'country': "",
			'state': "",
			'district': "",
			'city': "",
			'area': "",
			'pincode': "",
			'stateCode':"",
			'countryCode':"",
			'latLng':"",
			'GSTIN': "",
			'GSTDocument': [],
			'PAN': "",
			'PANDocument': [],
			'indexOneValue': '',
			'uderscoreId': '',
			'locationTypeDisable': true,
			'stateArray': [],
			'districtArray': [],
			'pincodeExists': true,
			'openForm': false,
			openFormIcon : false,
			view : 'List',
			'pathname': this.props.entity,
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
			 "fields" : {
                placeholder     : "Enter location type..",
                title           : "Location Type",
                attributeName   : "locationType"
            },
            // "tableHeading": {
            //     locationType: "Location Type",
            //     actions: 'Action',
            // },
            // "tableObjects": {
            //     deleteMethod: 'delete',
            //     apiLink: '/api/locationtypemaster/',
            //     paginationApply: false,
            //     searchApply: false,
            //     editUrl: '/appCompany/location-details'
            // },
            RecordsTable:[],
			tableHeading:{
	            locationType:"Location Type",
	            address:"Address",
	            GSTIN:"GSTIN",
	            gstDoc:"GST Document",
	            PAN:"PAN",
	            panDoc:"PAN Document",
	            // actions:"Action"
	          },
	          tableObjects : {
	          paginationApply : false,
	          searchApply     : false,
	          editUrl         : '/' + this.props.entity + "/location-details/" + this.props.match.params.entityID,
	          deleteMethod    : 'delete',
        	  apiLink         : '/api/entitymaster/deleteLocation/' + this.props.entity ,
	          downloadApply   : true
	        },
	        startRange        : 0,
            limitRange        : 100000,
		
            "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            "IdToDelete" : "",

           
		};
		this.handleChange = this.handleChange.bind(this);
		// this.handleChangeCountry = this.handleChangeCountry.bind(this);
		// this.handleChangeState = this.handleChangeState.bind(this);
		// this.handleChangeDistrict = this.handleChangeDistrict.bind(this);
		// this.handleChangeBlock = this.handleChangeBlock.bind(this);
		this.camelCase = this.camelCase.bind(this)
	}
	componentDidMount() {
		this.getLocationType();
		this.locationDetails();
		this.getData();
		this.edit();
		window.scrollTo(0, 0);
		this.handleChange = this.handleChange.bind(this);
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
		this.setState({
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
		})

	}
	componentWillReceiveProps(nextProps) {
		this.edit();
		this.getData();
		this.setState({
			'entityID': nextProps.match.params ? nextProps.match.params.entityID : '',
			'locationID':nextProps.match.params ? nextProps.match.params.locationID : '',
		})
	}
	getData(){
		console.log('getData this.props.match.params.locationID: ',this.props.match.params.locationID)
		this.setState({
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
		})
		var formvalues = {
			startRange : this.state.startRange,
			limitRange : this.state.limitRange,
			entityID : this.props.match.params.entityID
		}
		
		axios.post('/api/entitymaster/getAllLocation',formvalues)
		.then((response)=>{
			var data = response.data.locations.reverse()
			var tableData = data.map((a, i)=>{
				var gstimage = a.GSTDocument.map((image,i)=>{return '<img src='+image+' class="img-responsive imgtab logoStyle" />'})
				var panimage = a.PANDocument.map((image,i)=>{return '<img src='+image+' class="img-responsive imgtab logoStyle" />'})
	        return{
	        	_id:a._id,
	            locationType:a.locationType,
	            address:a.addressLine1 ? a.addressLine1 : null +' '+a.addressLine2,
	            GSTIN:a.GSTIN ? a.GSTIN : 'NIL',
	            gstDoc:a.GSTDocument && a.GSTDocument.length > 0 ? gstimage:'No Image Found!',
	            PAN:a.PAN ? a.PAN : 'NIL',
	            panDoc:a.PANDocument && a.PANDocument.length > 0 ? panimage:'No Image Found!',
	            // action:""
	        }
	      })
          this.setState({RecordsTable:tableData})
			
		})
		.catch((error)=>{console.log('error: ',error)})

	}

	openForm() {		
		this.setState({
			openForm: this.state.openForm === false ? true : false,
			openFormIcon : this.state.openFormIcon === false ? true : false
		}, () => {
			if (this.state.openForm === true) {
				this.validations();
			}
		})

	}
	validations() {
		$.validator.addMethod("regxlocationType", function (value, element, arg) {
			return arg !== value;
		}, "Please select the location type");
		
		$.validator.addMethod("addressLineRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid address.");
		$.validator.addMethod("pincodeRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Pincode does not exist!");
		$.validator.addMethod("regxcountry", function (value, element, arg) {
			return arg !== value;
		}, "Please select the country");
		$.validator.addMethod("regxstate", function (value, element, arg) {
			return arg !== value;
		}, "Please select the state");
		$.validator.addMethod("regxdistrict", function (value, element, arg) {
			return arg !== value;
		}, "Please select the district");
		$.validator.addMethod("regxGSTIN", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid GSTIN.");
		$.validator.addMethod("regxPAN", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid PAN.");
		
		$.validator.addMethod("regxarea", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid area.");
		jQuery.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");
		

		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#locationsDetail").validate({
			rules: {
				locationType: {
					required: true,
					notEqual:""
				},
				addressLine1: {
					required: true,
				},
				// country: {
				// 	required: true,
				// 	regxcountry: "-- Select --"
				// },
				// states: {
				// 	required: true,
				// 	regxstate: "-- Select --"
				// },
				// district: {
				// 	required: true,
				// 	regxdistrict: "-- Select --"
				// },
				// pincode: {
				// 	required: true,
				// 	pincodeRegx: /^[0-9][0-9\-\s]/,
				// },
				// GSTIN: {
				// 	regxGSTIN: /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[A-Za-z1-9]{1}[z|Z]{1}[A-Za-z0-9]{1}$|^$/,
				// },
				// PAN: {
				// 	regxPAN: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$|^$/,
				// },
				// area: {
				// 	regxarea: /^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$|^$/,
				// },
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "locationType") {
					error.insertAfter("#locationType");
				}
				if (element.attr("name") === "addressLine1") {
					error.insertAfter("#addressLine1");
				}
				if (element.attr("name") === "country") {
					error.insertAfter("#country");
				}
				if (element.attr("name") === "states") {
					error.insertAfter("#states");
				}
				if (element.attr("name") === "district") {
					error.insertAfter("#district");
				}
				if (element.attr("name") === "pincode") {
					error.insertAfter("#pincode");
				}
				if (element.attr("name") === "GSTIN") {
					error.insertAfter("#GSTIN");
				}
				if (element.attr("name") === "PAN") {
					error.insertAfter("#PAN");
				}
				if (element.attr("name") === "area") {
					error.insertAfter("#area");
				}
			}
		})
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		this.setState({
			[name]: event.target.value
		});
		// console.log("toUpperCase",this.state.PAN.toUpperCase());

		// if (name === 'area') {
		// 	var currentVal = event.currentTarget.value;
		// 	if (currentVal.match('[a-zA-Z ]+')) {
		// 		this.setState({
		// 			[name]: event.target.value
		// 		});
		// 	} else {
		// 		this.setState({
		// 			[name]: ''
		// 		});
		// 	}
		// }
	}
	// handleChangeCountry(event) {
	// 	const target = event.target;
	// 	this.setState({
	// 		[event.target.name]: event.target.value
	// 	});
	// 	this.getStates(event.target.value.split('|')[0])
	// }
	// getStates(StateCode) {
	// 	axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
	// 		.then((response) => {
	// 			this.setState({
	// 				stateArray: response.data
	// 			})
	// 			$('#Statedata').val(this.state.states);
	// 		})
	// 		.catch((error) => {
	// 		})
	// }
	// handleChangeState(event) {
	// 	this.setState({
	// 		[event.target.name]: event.target.value
	// 	});
	// 	const target = event.target;
	// 	const stateCode = $(target).val();
	// 	const countryCode = $("#country").val();
	// 	var entityID = this.state.entityID;
	// 	axios.get('/api/entitymaster/get/one/' + entityID)
	// 	.then((response)=>{
	// 		console.log('loc', response.data.locations);
	// 		var locStateCode = response.data.locations.filter((a)=>a.stateCode === stateCode.split("|")[0]);
	// 		console.log('locStateCode', locStateCode, stateCode);
	// 		if(locStateCode.length > 0){
	// 			this.setState({
	// 				'GSTIN'			: locStateCode[0].GSTIN,
	// 				'GSTDocument'	: locStateCode[0].GSTDocument,
	// 				'PAN'			: locStateCode[0].PAN,
	// 				'PANDocument'	: locStateCode[0].PANDocument,
	// 			})
	// 		}else{
	// 			this.setState({
	// 				'GSTIN'			: "",
	// 				'GSTDocument'	: [],
	// 				'PAN'			: "",
	// 				'PANDocument'	: [],
	// 			})
	// 		}
	// 	})
	// 	.catch((error)=>{})
	// 	this.getDistrict(stateCode, countryCode);

	// }
	// getDistrict(stateCode, countryCode) {
	// 	axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
	// 		.then((response) => {
	// 			this.setState({
	// 				districtArray: response.data
	// 			})
	// 			$('#Citydata').val(this.state.city);
	// 		})
	// 		.catch((error) => {
	// 		})
	// }
	// handleChangeDistrict(event) {
	// 	this.setState({
	// 		[event.target.name]: event.target.value
	// 	});
	// 	// const target = event.target;
	// 	// const districtName = $(target).val();
	// 	// const stateCode = $('#Statedata').val();
	// 	// const countryCode = $("#country").val();
	// 	// this.getBlocks(districtName, stateCode, countryCode);
	// }
	// handleChangeBlock(event) {
	// 	this.setState({
	// 		[event.target.name]: event.target.value
	// 	});
	// 	const target = event.target;
	// 	const blockName = $(target).val();
	// 	const districtName = $('#Citydata').val();
	// 	const stateCode = $('#Statedata').val();
	// 	const countryCode = $("#country").val();
	// 	this.getAreas(blockName, districtName, stateCode, countryCode);
	// }
	// getBlocks(districtName, stateCode, countryCode) {
	// 	axios.get("http://locations2.iassureit.com/api/blocks/get/list/" + countryCode + '/' + stateCode + "/" + districtName)
	// 		.then((response) => {
	// 			this.setState({
	// 				blocksArray: response.data
	// 			})
	// 			$('#Blocksdata').val(this.state.block);
	// 		})
	// 		.catch((error) => {
	// 		})
	// }
	// getAreas(blockName, districtName, stateCode, countryCode) {
	// 	axios.get("http://locations2.iassureit.com/api/areas/get/list/" + countryCode + '/' + stateCode + "/" + districtName + '/' + blockName + '/Pune city')
	// 		.then((response) => {
	// 			this.setState({
	// 				areasArray: response.data
	// 			})
	// 			$('#Areasdata').val(this.state.area);
	// 		})
	// 		.catch((error) => {
	// 		})
	// }
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	locationdetailBack(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;

		if (this.state.locationType || this.state.addressLine1 || this.state.countryCode || this.state.stateCode || this.state.district || this.state.city || this.state.area || this.state.pincode || this.state.GSTIN || this.state.GSTDocument.length > 0 || this.state.PAN || this.state.PANDocument.length > 0) {
			swal({
				// title: 'abc',
				text: "It seems that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
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
					if (value) {
						if (entityID) {
							this.props.history.push("/" +this.state.pathname + "/basic-details/" + entityID);
						} else {
							this.props.history.push("/" + this.state.pathname + "/basic-details");
						}
					} else {
						this.props.history.push("/" +this.state.pathname + "/location-details/" + entityID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if (entityID && entityID != undefined) {
				this.props.history.push("/" +this.state.pathname+ "/basic-details/" + entityID);
			} else {
				this.props.history.push("/" +this.state.pathname+ "/basic-details");
			}
		}
	}
	locationdetailsAdd(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if ($('#locationsDetail').valid()) {
			var formValues = {
				'entityID': entityID,
				'locationDetails': {
					'locationType': this.state.locationType,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					// 'countryCode': this.state.country.split("|")[0],
					'countryCode': this.state.countryCode,
					// 'country': this.state.country.split("|")[1],
					'country': this.state.country,
					// 'stateCode': this.state.states.split("|")[0],
					'stateCode': this.state.stateCode,
					// 'state': this.state.states.split("|")[1],
					'state': this.state.states,
					'district': this.state.district,
					'city': this.state.city,
					'area': this.state.area,
					'pincode': this.state.pincode,
					'latitude':this.state.latLng.lat,
					'longitude':this.state.latLng.lng,
					'GSTDocument': this.state.GSTDocument,
					'GSTIN': this.state.GSTIN ? this.state.GSTIN.toUpperCase(): this.state.GSTIN,
					'PAN': this.state.PAN ? this.state.PAN.toUpperCase():this.state.PAN,
					'PANDocument': this.state.PANDocument,
				}
			}
			console.log('formValues=====>', formValues);
			axios.patch('/api/entitymaster/patch/addLocation', formValues)
				.then((response) => {
					$('.inputText').val('');
					this.setState({
						'openForm': false,
						'pincodeExists': true,
						'locationType': '',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
						'GSTIN': "",
						'GSTDocument': [],
						'PAN': "",
						'PANDocument': [],
					});
					this.locationDetails();
					$(".swal-text").css("font-family", "sans-serif");
					if(response.data.duplicated === true){
						swal('Location details already exist')
					}else{
						swal('Location details added successfully.');
					}
					// this.setState({			
					// 	openFormIcon : this.state.openFormIcon === false ? true : false
					// });
					$("#locationsDetail").validate().resetForm();
				})
				.catch((error) => {
					console.log('error adding location: ',error)
				})
		}else{
			$(event.target).parent().parent().parent().find('.errorinputText.error:first').focus();
		}
	}
	locationdetailBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.locationType || this.state.addressLine1 || this.state.countryCode || this.state.stateCode || this.state.district || this.state.city || this.state.area || this.state.pincode || this.state.GSTIN || this.state.GSTDocument.length > 0 || this.state.PAN || this.state.PANDocument.length > 0) {
			swal({
				// title: 'abc',
				text: "It seems that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
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
					if (value) {
						if(entityID === undefined){
						this.props.history.push("/" + this.state.pathname + "/contact-details" );
						}else{
						this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
						}
					} else {
						if(entityID === undefined){
						this.props.history.push("/" + this.state.pathname + "/location-details" );
						}else{
						this.props.history.push("/" + this.state.pathname + "/location-details/" + entityID);
						}
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if(entityID === undefined){
			this.props.history.push("/" + this.state.pathname + "/contact-details" );
			}else{
			this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
			}
		}
	}

	edit() {
		console.log('this.props.match.params: ',this.props.match.params)
		console.log('this.props.match.params.locationID: ',this.props.match.params.locationID)
		var entityID = this.state.entityID;
		var locationID = this.state.locationID;
		if (locationID) {
			axios.get('/api/entitymaster/get/one/' + entityID)
				.then((response) => {
					// console.log("response",response);
					var editData = response.data.locations.filter((a) => a._id === locationID);
					// this.getStates(editData[0].countryCode);
					// this.getDistrict(editData[0].stateCode, editData[0].countryCode);
					// this.getBlocks(editData[0].district, editData[0].stateCode, editData[0].countryCode);
					this.setState({
						'openForm': true,
						'locationType': editData[0].locationType,
						'addressLine1': editData[0].addressLine1,
						'addressLine2': editData[0].addressLine2,
						'country': editData[0].country,
						'countryCode': editData[0].countryCode,
						'states': editData[0].state,
						'stateCode': editData[0].stateCode,
						'district': editData[0].district,
						'branchCode': editData[0].branchCode,
						'latLng': {lat:editData[0].latitude, lng:editData[0].longitude},
						'city': editData[0].city,
						'area': editData[0].area,
						'pincode': editData[0].pincode,
						'GSTIN': editData[0].GSTIN,
						'GSTDocument': editData[0].GSTDocument,
						'PAN': editData[0].PAN,
						'PANDocument': editData[0].PANDocument,
					}, () => {
						if (this.state.openForm === true) {
							this.validations();
						}
					})
				})
				.catch((error) => {
				})
		}
	}

	// updateStateDoc(){
		
	// }

	locationDetails() {
		axios.get('/api/entitymaster/get/one/' + this.props.match.params.entityID)
			.then((response) => {
				this.setState({
					locationarray: response.data.locations.reverse()
				})
			})
			.catch((error) => {
			})
		return [];
	}

	deleteEntity(event){
		event.preventDefault();
		this.setState({IdToDelete: event.currentTarget.getAttribute('data-id')})
		$('#deleteEntityModal').show();
    }
    confirmDelete(event){
    	event.preventDefault();
    	var entityID = this.props.match.params.entityID;
    	var locationID = this.state.IdToDelete;
    	axios.delete('/api/entitymaster/deleteLocation/' + entityID + "/" + locationID)
            .then((response)=>{
           		if (response.data) {
					this.setState({
						'openForm': false,
						'locationID': "",
						'locationType': '--Select Location Type--',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
						'GSTIN': "",
						'GSTDocument': [],
						'PAN': "",
						'PANDocument': [],
					});
					this.props.history.push('/' + this.state.pathname + '/location-details/' + entityID);
					this.locationDetails();
           			swal({
	                    text : "Location deleted successfully.",
	                    // text : (this.state.entityType === "appCompany" ? "Organizational Settings" :this.state.entityType) +" is deleted successfully.",
					  });
					  $(".swal-text").css("text-transform", "capitalize");
           		}	else{
           			swal({
	                    text : "Sorry,Failed to delete.",
	                  });
           		}
           		$('#deleteEntityModal').hide();
	              this.props.getEntities();
	              this.props.hideForm();
                 

            })
            .catch((error)=>{
            })
    }
    closeModal(event){
    	event.preventDefault();
    	$('#deleteEntityModal').hide(); 
    }
	locationDelete(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var locationID = event.target.id;
		axios.delete('/api/entitymaster/deleteLocation/' + entityID + "/" + locationID)
			.then((response) => {
				this.setState({
					'openForm': false,
					'locationID': "",
					'locationType': '--Select Location Type--',
					'addressLine1': "",
					'addressLine2': "",
					'countryCode': "",
					'country': '',
					'stateCode': "",
					'states': '',
					'district': "",
					'city': "",
					'area': "",
					'pincode': "",
					'latLng':"",
					'GSTIN': "",
					'GSTDocument': [],
					'PAN': "",
					'PANDocument': [],
				});
				this.props.history.push('/' +this.state.pathname + '/location-details/' + entityID);
				this.locationDetails();
				$(".swal-text").css("font-family", "sans-serif");
				swal('Location deleted successfully.');
			})
			.catch((error) => {
			})
	}
	updateLocationDetails(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		var locationID = this.props.match.params.locationID;
		if ($('#locationsDetail').valid()) {
			var formValues = {
				'entityID': entityID,
				'locationID': locationID,
				'locationDetails': {
					'locationType': this.state.locationType,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					'branchCode'	: this.state.branchCode,
					'countryCode': this.state.countryCode,
					'country': this.state.country,
					'stateCode': this.state.stateCode,
					'state': this.state.states,
					'district': this.state.district,
					'city': this.state.city,
					'area': this.state.area,
					'latitude':this.state.latLng.lat,
					'longitude':this.state.latLng.lng,
					'pincode': this.state.pincode,
					'GSTDocument': this.state.GSTDocument,
					'PANDocument': this.state.PANDocument,
					'GSTIN': this.state.GSTIN ? this.state.GSTIN.toUpperCase(): this.state.GSTIN,
					'PAN': this.state.PAN ? this.state.PAN.toUpperCase():this.state.PAN,
					
				}
			}
			axios.patch('/api/entitymaster/patch/updateSingleLocation', formValues)
				.then((response) => {
					this.setState({
						'openForm': false,
						'pincodeExists': true,
						'locationID': "",
						'locationType': '',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
						'GSTIN': "",
						'GSTDocument': [],
						'PAN': "",
						'PANDocument': [],
					});
					this.props.history.push('/' +this.state.pathname+ '/location-details/' + entityID);
					this.locationDetails();
					$(".swal-text").css("font-family", "sans-serif");
					if(response.data.duplicated === true){
						swal('Location details already exist')
					}else{
						swal('Location details updated successfully.');
					}
					// swal('Location details updated successfully');					
					$("#locationsDetail").validate().resetForm();
					// this.setState({			
					// 	openFormIcon : this.state.openFormIcon === false ? true : false
					// });
				})
				.catch((error) => {

				})
		}else{
			$(event.target).parent().parent().parent().find('.errorinputText.error:first').focus();
		}
	}
	admin(event) {
		event.preventDefault();
		this.props.history.push('/adminDashboard');
	}
	getLocationType() {
		axios.get('/api/locationtypemaster/get/list')
			.then((response) => {
				this.setState({
					locationTypeArry: response.data
				})
			})
			.catch((error) => {

			})
	}
	// handlePincode(event) {
	// 	event.preventDefault();
	// 	this.setState({
	// 		[event.target.name]: event.target.value
	// 	})
	// 	console.log("event.target.name",event.target.value)
	// 	if (event.target.value !== '') {
	// 		axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
	// 			.then((response) => {
	// 				console.log("response",response)
	// 				if ($("[name='pincode']").valid()) {

	// 					if (response.data[0].Status === 'Success') {
	// 						this.setState({ pincodeExists: true })
	// 					} else {
	// 						this.setState({ pincodeExists: false })
	// 					}
	// 				} else {
	// 					this.setState({ pincodeExists: true })
	// 				}

	// 			})
	// 			.catch((error) => {
	// 				this.setState({ pincodeExists: "NotAvailable" })
	// 			})
	// 	} else {
	// 		this.setState({ pincodeExists: true })
	// 	}
	// }
	GSTINBrowse(event) {
		event.preventDefault();
		var GSTDocument = [];
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for (var i = 0; i < event.currentTarget.files.length; i++) {
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName = file.name;
					var fileSize = file.size;
					var ext = fileName.split('.').pop();
					if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
						if(fileSize > 1048576){
							swal("Allowed file size is 1MB");
						}else{
							if (file) {
								var objTitle = { fileInfo: file }
								GSTDocument.push(objTitle);
	
							} else {
								swal("File not uploaded");
							}//file
						}
					} else {
						swal("Allowed file formats are (jpg, png, jpeg, pdf)");
					}//file types
				}//file
			}//for 

			if (event.currentTarget.files) {
				main().then(formValues => {
					var GSTDocument = this.state.GSTDocument;
					for (var k = 0; k < formValues.length; k++) {
						GSTDocument.push(formValues[k].GSTDocument)
					}

					this.setState({
						GSTDocument: GSTDocument
					})
				});

				async function main() {
					var formValues = [];
					for (var j = 0; j < GSTDocument.length; j++) {
						var config = await getConfig();
						var s3url = await s3upload(GSTDocument[j].fileInfo, config, this);
						const formValue = {
							"GSTDocument": s3url,
							"status": "New"
						};
						formValues.push(formValue);
					}
					return Promise.resolve(formValues);
				}


				function s3upload(image, configuration) {

					return new Promise(function (resolve, reject) {
						S3FileUpload
							.uploadFile(image, configuration)
							.then((Data) => {
								resolve(Data.location);
							})
							.catch((error) => {
							})
					})
				}
				function getConfig() {
					return new Promise(function (resolve, reject) {
						axios
			              .post('/api/projectsettings/getS3Details/S3')
			              .then((response) => {
			                const config = {
			                  bucketName: response.data.bucket,
			                  dirName: process.env.REACT_APP_ENVIRONMENT,
			                  region: response.data.region,
			                  accessKeyId: response.data.key,
			                  secretAccessKey: response.data.secret,
			                }
			                resolve(config);
			              })
			              .catch(function (error) {
			              })

					})
				}
			}
		}
	}
	PANBrowse(event) {
		event.preventDefault();
		var PANDocument = [];
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for (var i = 0; i < event.currentTarget.files.length; i++) {
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName = file.name;
					var fileSize = file.size;
					var ext = fileName.split('.').pop();
					if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
						if(fileSize > 1048576){
							swal("Allowed file size is 1MB");
						}else{
							if (file) {
								var objTitle = { fileInfo: file }
								PANDocument.push(objTitle);

							} else {
								swal("File not uploaded");
							}//file
						}
					} else {
						swal("Allowed file formats are (jpg, png, jpeg, pdf)");
					}//file types
				}//file
			}//for 

			if (event.currentTarget.files) {
				main().then(formValues => {
					var PANDocument = this.state.PANDocument;
					for (var k = 0; k < formValues.length; k++) {
						PANDocument.push(formValues[k].PANDocument)
					}

					this.setState({
						PANDocument: PANDocument
					})
				});

				async function main() {
					var formValues = [];
					for (var j = 0; j < PANDocument.length; j++) {
						var config = await getConfig();
						var s3url = await s3upload(PANDocument[j].fileInfo, config, this);
						const formValue = {
							"PANDocument": s3url,
							"status": "New"
						};
						formValues.push(formValue);
					}
					return Promise.resolve(formValues);
				}


				function s3upload(image, configuration) {

					return new Promise(function (resolve, reject) {
						S3FileUpload
							.uploadFile(image, configuration)
							.then((Data) => {
								resolve(Data.location);
							})
							.catch((error) => {
							})
					})
				}
				function getConfig() {
					return new Promise(function (resolve, reject) {
						axios
			              .post('/api/projectsettings/getS3Details/S3')
			              .then((response) => {
			                const config = {
			                  bucketName: response.data.bucket,
			                  dirName: process.env.REACT_APP_ENVIRONMENT,
			                  region: response.data.region,
			                  accessKeyId: response.data.key,
			                  secretAccessKey: response.data.secret,
			                }
			                resolve(config);
			              })
			              .catch(function (error) {
			              })

					})
				}
			}
		}
	}
	deleteGSTIN(event) {
		event.preventDefault();
		var GSTDocument = this.state.GSTDocument;
		const index = GSTDocument.indexOf(event.target.id);
		if (index > -1) {
			GSTDocument.splice(index, 1);
		}
		this.setState({
			GSTDocument: GSTDocument
		})
	}
	deletePAN(event) {
		event.preventDefault();
		var PANDocument = this.state.PANDocument;
		const index = PANDocument.indexOf(event.target.id);
		if (index > -1) {
			PANDocument.splice(index, 1);
		}
		this.setState({
			PANDocument: PANDocument
		})
	}
	keyPressNumber = (e) => {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
			e.preventDefault();
		}
	}
	OpenModal(event){

	}

	handleChangePlaces = address => {
	    this.setState({ addressLine1 : address});
	};

	handleSelect = address => {

    geocodeByAddress(address)
     .then((results) =>{ 
      for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
              switch (results[0].address_components[i].types[b]) {
                  case 'sublocality_level_1':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'sublocality_level_2':
                      area = results[0].address_components[i].long_name;
                      break;
                  case 'locality':
                      var city = results[0].address_components[i].long_name;
                      break;
                  case 'administrative_area_level_1':
                      var state = results[0].address_components[i].long_name;
                      var stateCode = results[0].address_components[i].short_name;
                      break;
                  case 'administrative_area_level_2':
                      var district = results[0].address_components[i].long_name;
                      break;
                  case 'country':
                     var country = results[0].address_components[i].long_name;
                     var countryCode = results[0].address_components[i].short_name;
                      break; 
                  case 'postal_code':
                     var pincode = results[0].address_components[i].long_name;
                      break;
                  default :
                  		break;
              }
          }
      }

      this.setState({
        area : area,
        city : city,
        district : district,
        states: state,
        country:country,
        pincode: pincode,
        stateCode:stateCode,
        countryCode:countryCode
      })

       
        })
     
      .catch(error => console.error('Error', error));

      geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'latLng': latLng}))
      .catch(error => console.error('Error', error));
     
      this.setState({ addressLine1 : address});
  };

  hideModal(event){
    	event.preventDefault();
    	$("html,body").scrollTop(0);
    	var token = $(event.target).attr('token');
    	var idVar = '#exampleModal'+token
    	$(idVar).hide()
    	$(".modal-backdrop").remove();
    	window.location.reload();
    }
     showView(value,event){
		$('.viewBtn').removeClass('btnactive');
        $(event.target).addClass('btnactive');
    	this.setState({
    		view : value
    	})
    }

	render() {
		 const searchOptions = {
      // types: ['(cities)'],
      componentRestrictions: {country: "in"}
     }
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content OrgSettingFormWrapper">
							{/*<div className="modal" id="addLocationType" role="dialog">
                              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                        <button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
                                   </div>
                                  </div>
                                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                	 <OneFieldForm fields={this.state.fields}
		                              tableHeading={this.state.tableHeading}
		                              tableObjects={this.state.tableObjects}
		                              editId ={this.props.match.params.fieldID}
		                              history={this.props.history} />
		                        </div>
                                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" >CANCEL</button>
                                    </div>
                                </div>
                                </div>
                              </div>
                            </div>*/}
 
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									 {this.state.pathname !="appCompany" ?
					                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
					                  :
					                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Organizational Settings</h4>
					  
					                }
									<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
										{this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
									</div>
								</div>

								<div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<ul className="nav nav-pills vendorpills col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
										<li className=" col-lg-4 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne  NOpadding-left btn1 disabled">
											<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/basic-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/basic-details"} className="basic-info-pillss pills backcolor">
												<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
												Basic Info
											</a>
											<div className="triangleone " id="triangle-right"></div>
										</li>
										<li className="active col-lg-4 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls  pdclsOne btn2 ">
											<div className="triangletwo" id="triangle-right1"></div>
											<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/location-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/location-details" } className="basic-info-pillss backcolor">
												<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
												Location
											</a>
											<div className="trianglethree triangleones forActive" id="triangle-right"></div>
										</li>
										<li className="col-lg-4 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
											<div className="trianglesix" id="triangle-right2"></div>
											<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/contact-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/contact-details"} className="basic-info-pillss backcolor">
												<i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
												Contact
											</a>
										</li>
									</ul>
								</div>
								<section className="Content">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<form id="locationsDetail" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<h4 className="MasterBudgetTitle"><i className="fa fa-map-marker" aria-hidden="true"></i> Location Details</h4>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<div className="button4  pull-right" onClick={this.openForm.bind(this)}>
															{
																this.state.openForm === true ?
																<i className="fa fa-minus-circle" aria-hidden="true"></i>
																:
																<i className="fa fa-plus-circle" aria-hidden="true"></i>
															}   &nbsp;Add Location																
															
														</div>
														</div>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
													</div>
													{
														this.state.openForm === true ?
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup></label>
																		<div>
																		<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 errorinputText" value={this.state.locationType} ref="locationType" name="locationType" id="locationType" onChange={this.handleChange} required>
																			<option value="" disabled>--Select Location Type--</option>
																			{
																				this.state.locationTypeArry && this.state.locationTypeArry.length > 0 ?
																					this.state.locationTypeArry.map((locationtypedata, index) => {
																						return (
																							<option key={index} data-attribute={index}>{locationtypedata.locationType}</option>
																						);
																					})
																					:
																					null
																			}
																		</select>
																			{/* <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"  data-target="#addLocationType" onClick={this.OpenModal.bind(this)} title="Add Location Type" ><i className="fa fa-plus "></i></div>*/}

																	  </div>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Flat No/Block No</label>
																		<input id="Line2" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 2 <sup className="astrick">*</sup></label>
																		{/*<input id="addressLine1" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />*/}
																		 <PlacesAutocomplete
								                                        value={this.state.addressLine1}
								                                        onChange={this.handleChangePlaces}
								                                        onSelect={this.handleSelect}
								                                        searchOptions={searchOptions}
								                                      >
								                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
								                                          <div>
								                                            <input
								                                              {...getInputProps({
								                                                placeholder: 'Search Address ...',
								                                                className: 'location-search-input col-lg-12 form-control errorinputText',
								                                                id:"addressLine1",
								                                                name:"addressLine1"
								                                              })}
								                                            />
								                                            <div className="autocomplete-dropdown-container SearchListContainer">
								                                              {loading && <div>Loading...</div>}
								                                              {suggestions.map(suggestion => {
								                                                const className = suggestion.active
								                                                  ? 'suggestion-item--active'
								                                                  : 'suggestion-item';
								                                                // inline style for demonstration purpose
								                                                const style = suggestion.active
								                                                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
								                                                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
								                                                return (
								                                                  <div
								                                                    {...getSuggestionItemProps(suggestion, {
								                                                      className,
								                                                      style,
								                                                    })}
								                                                  >
								                                                    <span>{suggestion.description}</span>
								                                                  </div>
								                                                );
								                                              })}
								                                            </div>
								                                          </div>
								                                        )}
								                                      </PlacesAutocomplete>
																	</div>
																	
																</div>
																{/*<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Country <sup className="astrick">*</sup>
																		</label>
																		<select id="country" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="country" name="country" value={this.state.country} onChange={this.handleChangeCountry} >
																			<option selected={true}>-- Select --</option>
																			<option value="IN|India">India</option>
																		</select>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">State <sup className="astrick">*</sup> {this.props.typeOption === 'Local' ? <sup className="astrick">*</sup> : null}
																		</label>
																		<select id="states" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
																			<option selected={true}>-- Select --</option>
																			{
																				this.state.stateArray && this.state.stateArray.length > 0 ?
																					this.state.stateArray.map((stateData, index) => {
																						return (
																							<option key={index} value={stateData.stateCode + "|" + stateData.stateName}>{this.camelCase(stateData.stateName)}</option>
																						);
																					}
																					) : ''
																			}
																		</select>

																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">District <sup className="astrick">*</sup> {this.props.typeOption === 'Local' ? <sup className="astrick">*</sup> : null}
																		</label>
																		<select id="district" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="district" name="district" value={this.state.district} onChange={this.handleChangeDistrict} >
																			<option>-- Select --</option>
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
																</div>*/}
																{/*<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">City 
																		</label>
																		<input type="text" id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Area </label>
																		<input type="text" id="area" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Pincode <sup className="astrick">*</sup>
																		</label>
																		<input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" id="pincode" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} />
																		{this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This pincode does not exists!</label>}
																		{this.state.pincodeExists !== "NotAvailable" ? null : <label style={{ color: "red", fontWeight: "100" }}>Pincode can not be validated at this time. Please enter this value carefully</label>}
																	</div>
																</div>*/}
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN
																			<a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. 29ABCDE1234F1Z5" className="fa fa-question-circle"></i> </a>
																		</label>
																		<input type="text" id="GSTIN" placeholder="29ABCDE1234F1Z5" className="form-control uppercase col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.GSTIN} ref="GSTIN" name="GSTIN" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN Document (jpg, jpeg, png, pdf) (Max size 25KB)</label>
																		</div>
																		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="hide">
																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																					<div><i className="fa fa-upload"></i> <br /></div>
																					<input multiple onChange={this.GSTINBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="GSTDocument" />
																				</div>
																			</div>
																		</div>
																		{
																			this.state.GSTDocument && this.state.GSTDocument.length > 0 ?
																				this.state.GSTDocument.map((doc, i) => {
																					if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																						return (
																							<div key={i} className=" col-lg-2 col-md-2 col-sm-12 col-xs-12">
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																									<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deleteGSTIN.bind(this)}>x</label>
																									<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																										<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																									</div>
																								</div>
																							</div>
																						);
																					}else{
																						return (
																							<div key={i} className=" col-lg-2 col-md-2 col-sm-12 col-xs-12">
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																									<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deleteGSTIN.bind(this)}>x</label>
																									<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																										<img src={doc} className="img-responsive logoStyle" />
																									</div>
																								</div>
																							</div>
																						);
																					}
																				})
																				:
																				null
																		}
																	</div>
																	<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
																	<div className=" form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN
																			<a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. ABCDE1234E" className="fa fa-question-circle"></i> </a>
																		</label>
																		<input type="text" id="PAN" placeholder="ABCDE1234E" className="form-control uppercase col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.PAN} ref="PAN" name="PAN" onChange={this.handleChange} />
																	</div>


																	<div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN Document (jpg, jpeg, png, pdf) (Max size 25KB)</label>
																		</div>
																		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="hide">
																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																					<div><i className="fa fa-upload"></i> <br /></div>
																					<input multiple onChange={this.PANBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="PANDocument" />
																				</div>
																			</div>
																		</div>
																		{
																			this.state.PANDocument && this.state.PANDocument.length > 0 ?
																				this.state.PANDocument.map((doc, i) => {
																					if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																						return (
																							<div key={i} className=" col-lg-2 col-md-2 col-sm-12 col-xs-12">
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																									<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deletePAN.bind(this)}>x</label>
																									<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																										<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																									</div>
																								</div>
																							</div>
																						);
																					}else{
																						return (
																							<div key={i} className=" col-lg-2 col-md-2 col-sm-12 col-xs-12">
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																									<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deletePAN.bind(this)}>x</label>
																									<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																										<img src={doc} className="img-responsive logoStyle" />
																									</div>
																								</div>
																							</div>
																						);
																					}
																				})
																				:
																				null
																		}
																	</div>
																</div>
																<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  NOpadding pull-right">
																	{this.props.match.params.entityID ?
																		
																			this.state.locationID ?
																				<button className="button3  pull-right" onClick={this.updateLocationDetails.bind(this)}>&nbsp;Update Location</button>
																				:
																				<button className="button3 pull-right" onClick={this.locationdetailsAdd.bind(this)}>&nbsp;Submit</button>
																		
																		:
																		null
																	}
																</div>

															</div>
															:
															null
													}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
														<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Basic Info</button>
														<button className="button1 pull-right" onClick={this.locationdetailBtn.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
													</div>
												</div>
											</form>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 pull-right">
												<i className="fa fa-th fa-lg btn viewBtn" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'Grid')} onChange={this.handleChange} aria-hidden="true"></i>&nbsp;&nbsp;
												<i className="fa fa-th-list fa-lg btn viewBtn btnactive" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'List')} onChange={this.handleChange} aria-hidden="true"></i>
											</div>
										</div>

										{this.state.view === 'Grid' ?
										 <IAssureTable 
					                      tableHeading={this.state.tableHeading}
					                      dataCount={this.state.entityCount}
					                      tableData={this.state.RecordsTable}
					                      tableObjects={this.state.tableObjects}
					                      getData={this.getData.bind(this)}
					                      id={"id"}
					                      tableName={"Location"}
					                      />
										 :
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											{this.state.locationarray && this.state.locationarray.length > 0 ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
														<h4 className="MasterBudgetTitle">Location Details</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" style={{"display" : "block"}}>
														{this.state.locationarray && this.state.locationarray.length > 0 ?
															this.state.locationarray.map((Suppliersdata, index) => {
																return (
																	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " key={index}>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 box_style">
																			<div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
																				<div className="locationIcon col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
																					<i className="fa fa-map-marker" aria-hidden="true"></i>
																				</div>
																			</div>
																			<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																				<li>{Suppliersdata.locationType}</li>
																				<li>{Suppliersdata.addressLine1}</li>
																				{Suppliersdata.GSTIN || Suppliersdata.PAN ?
																					<li>
																					<button type="button" className="btn btn-link showMoreBtn" data-toggle="modal" data-target={"#exampleModal"+index}>
																					  Show More
																					</button>
																					</li> 
																				: null }
																				<div id={"exampleModal"+index} className="modal" role="dialog">
																				  <div className="modal-dialog">

																				    <div className="modal-content col-lg-12">
																				      <div className="modal-header">
																				        <button type="button" className="close" token={index} onClick={this.hideModal.bind(this)}>&times;</button>
																				      </div>
																				      <div className="modal-body">
																				
																				        {Suppliersdata.GSTIN ?
																						<div className="col-md-12">
																						<li className="gst">GSTIN : {Suppliersdata.GSTIN}</li>
																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																						{
																							Suppliersdata.GSTDocument && Suppliersdata.GSTDocument.length > 0 ?
																								Suppliersdata.GSTDocument.map((doc, i) => {
																									if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																													<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																														<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																													</div>
																												</div>
																											</div>
																										);
																									}else{
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																													<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																														<img src={doc} className="img-responsive logoStyle" />
																													</div>
																												</div>
																											</div>
																										);
																									}
																								})
																								:
																								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom">
																										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos">
																											<img src={"/images/noImagePreview.png"} className="img-responsive logoStyle" />
																										</div>
																									</div>
																								</div>
																						}
																						</div>
																						</div>
																						:
																						null
																						}
																						{Suppliersdata.PAN ?
																						<div className="col-md-12">
																						<li className="pan">PAN : {Suppliersdata.PAN}</li>
																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																						{
																							Suppliersdata.PANDocument && Suppliersdata.PANDocument.length > 0 ?
																								Suppliersdata.PANDocument.map((doc, i) => {
																									if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																													<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																														<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																													</div>
																												</div>
																											</div>
																										);
																									}else{
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																													<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																														<img src={doc} className="img-responsive logoStyle" />
																													</div>
																												</div>
																											</div>
																										);
																									}
																								})
																								:
																								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom">
																										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos">
																											<img src={"/images/noImagePreview.png"} className="img-responsive logoStyle" />
																										</div>
																									</div>
																								</div>
																						}
																						</div>
																						</div>
																						:
																						null
																						}
																				        </div>
																				     
																				    </div>
																				     
																				  </div>
																				</div>
																				
																			</ul>
																			<div className=" dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
																				<div className=" dotsContainerLD col-lg-8 col-md-8 col-sm-8 col-xs-8">
																					<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
																					<div className="dropdown-content dropdown-contentLocation">
																						<ul className="pdcls ulbtm">
																							<li name={index}>
																								<a href={'/' + this.state.pathname + "/location-details/" + this.props.match.params.entityID + "/" + Suppliersdata._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																							</li>
																							<li name={index} data-id={Suppliersdata._id} onClick={this.deleteEntity.bind(this)} >
																								{/*<span onClick={this.locationDelete.bind(this)} id={Suppliersdata._id}>*/}
																								<a><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</a>
																							</li>
																						</ul>
																					</div>
																				</div>
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
												:
												null
											}
										</div>
									 }
									</div>
								</section>

							</div>
						</section>
					</div>
				</div>

				{/*Confirm Delete modal*/}
				<div className="modal" id="deleteEntityModal" role="dialog">
		          <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
		            <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
		              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
		                	<button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
		                </div>
		              </div>
		            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      	<h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure, do you want to delete?</h4>
                    </div>
		            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        	<button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.closeModal.bind(this)}>CANCEL</button>
                        </div>
		                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
		                  <button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.confirmDelete.bind(this)} >DELETE</button>
		                </div>
		            </div>
		            </div>
		          </div>
		        </div>
			</div>
		);
	}
}
export default withRouter(LocationDetails);
