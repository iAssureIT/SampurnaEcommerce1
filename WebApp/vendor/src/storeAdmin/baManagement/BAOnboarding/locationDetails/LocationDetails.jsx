import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Suppliers } from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/api/apiSupplierOnboardingForm.js';
import { Location } from '/imports/admin/masterData/manageLocation/components/location/component/Location.js';
import { Countries } from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import { State } from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import { District } from '/imports/admin/masterData/manageLocation/components/District/component/District.js';
import { MasterData } from '/imports/admin/masterData/masterDataEntry/apimasterDataEntry.js';
import { FlowRouter}  from 'meteor/ostrio:flow-router-extra';
import swal           from 'sweetalert';

class LocationDetails extends TrackerReact(Component) {
	constructor(props) {
      super(props);
    
      this.state = {
        'locationType'     : '--Select Location Type--',
        'addressLineone'   : '',
        'city'             : '-- Select --',
        'states'           : '',
        'area'             : '',
        'addressLinetwo'   : '',
        'pincode'          : '',
        'country'          : '-- Select --',
        'indexOneValue'	   : '',
        'uderscoreId'	   : '',
        'locationTypeDisable'	   : true,
        'stateArray'       : [],
        'districtArray'       : []
        // 'attachedDocuments'	: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeCountry = this.handleChangeCountry.bind(this);
      this.handleChangeState = this.handleChangeState.bind(this);
    }
    
    componentDidMount() {
    	window.scrollTo(0, 0);
    	
    	// ---------admin lte --------- // 
    	
    	if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
          $("body").append(adminLte);
    	}

    	// -------------- validation ------------ //
  //   	if(this.props.typeOption == 'Local'){
	    	$.validator.addMethod("regxAlphaNum", function(value, element, regexpr) {          
				return regexpr.test(value);
			}, "Name should only contain letters.");

			jQuery.validator.setDefaults({
				debug: true,
				success: "valid"
			});
			$("#LocationsDetail").validate({
				rules: {
					
					area: {
					  required: true,
					  regxAlphaNum: /^[a-zA-Z/\s,.'-/]*$|^$/,
					},
					
				},
			})
		// 		errorPlacement: function(error, element) {
		// 		    if (element.attr("name") == "locationType"){
		// 		      error.insertAfter("#Incoterms");
		// 		    }
		// 		    if (element.attr("name") == "addressLineone"){
		// 		      error.insertAfter("#Line1");
		// 		    }
		// 		    if (element.attr("name") == "addressLinetwo"){
		// 		      error.insertAfter("#Line2");
		// 		    }
		// 		    if (element.attr("name") == "country"){
		// 		      error.insertAfter("#datacountry");
		// 		    }
		// 		    if (element.attr("name") == "states"){
		// 		      error.insertAfter("#Statedata");
		// 		    }
		// 		    if (element.attr("name") == "city"){
		// 		      error.insertAfter("#Citydata");
		// 		    }
		// 		    if (element.attr("name") == "area"){
		// 		      error.insertAfter("#Areadata");
		// 		    }
		// 		    if (element.attr("name") == "pincode"){
		// 		      error.insertAfter("#Pincodedata");
		// 		    }
		// 	  	}
		// 	});
		// }else{
		// 	$.validator.addMethod("regxA1", function(value, element, regexpr) {          
		// 		return regexpr.test(value);
		// 	}, "Name should only contain letters & number.");

		// 	jQuery.validator.setDefaults({
		// 		debug: true,
		// 		success: "valid"
		// 	});
		// 		$("#LocationsDetail").validate({
		// 		rules: {
		// 			locationType: {
		// 			  required: true,
		// 			},
		// 			addressLineone: {
		// 			  required: true,
		// 			},
		// 			country: {
		// 			  required: true,
		// 			},
		// 			// states: {
		// 			//   required: true,
		// 			// },
		// 			// city: {
		// 			//   required: true,
		// 			// },
		// 			// area: {
		// 			//   required: true,
		// 			// },
		// 			// pincode: {
		// 			//   required: true,
		// 			// },
		// 		},
		// 		errorPlacement: function(error, element) {
		// 		    if (element.attr("name") == "locationType"){
		// 		      error.insertAfter("#Incoterms");
		// 		    }
		// 		    if (element.attr("name") == "addressLineone"){
		// 		      error.insertAfter("#Line1");
		// 		    }
		// 		    if (element.attr("name") == "addressLinetwo"){
		// 		      error.insertAfter("#Line2");
		// 		    }
		// 		    if (element.attr("name") == "country"){
		// 		      error.insertAfter("#datacountry");
		// 		    }
		// 		    // if (element.attr("name") == "states"){
		// 		    //   error.insertAfter("#Statedata");
		// 		    // }
		// 		    // if (element.attr("name") == "city"){
		// 		    //   error.insertAfter("#Citydata");
		// 		    // }
		// 		    // if (element.attr("name") == "area"){
		// 		    //   error.insertAfter("#Areadata");
		// 		    // }
		// 		    // if (element.attr("name") == "pincode"){
		// 		    //   error.insertAfter("#Pincodedata");
		// 		    // }
		// 	  	}
		// 	});
		// }
		$(document).ready(function(){
		  var $contenta = $(".addLocationForm").hide();
		  $(".button4").on("click", function(e){
		    $contenta.slideToggle();
		  });
		});

		// -------------- disable button --------------------- //

		var route   = FlowRouter.getParam("id");
        if(/[-]/.test(route)){      
	    	// var id = route.split('-')[0];
	    	$('.button2').attr('disabled','true');
	    	$('.button1').attr('disabled','true');
		}else{      
			var id = route;
			$('.button2').attr('disabled',false);
	    	$('.button1').attr('disabled',false);
		}	
        if (indexValue) {
        	// console.log('index');
        	
        }else{
        	// console.log('not index ');

        	
        }

		//----------------------- new code -------------------//
		// // console.log('this.props.post5 did',this.props.post5);
    	if (!this.props.loading6) {
	    	if(this.props.post5.locationDetails && this.props.post5.locationDetails.length > 0){ 
	    		$(".addLocationForm").show();
	    		var route   = FlowRouter.getParam("id");
		        var routerId   = route.split('-');
		        var indexValue = routerId[1];
		        var RouterId = routerId[0];
	    		if (indexValue) {
	    			
				    	this.setState({
				    		'locationType' 		: this.props.post5.locationDetails[indexValue].locationType,
				    		'addressLineone'	: this.props.post5.locationDetails[indexValue].addressLineone,
				    		'city'				: this.props.post5.locationDetails[indexValue].city,
				    		'states'			: this.props.post5.locationDetails[indexValue].states,
				    		'area'				: this.props.post5.locationDetails[indexValue].area,
				    		'addressLinetwo'	: this.props.post5.locationDetails[indexValue].addressLinetwo,
				    		'pincode'			: this.props.post5.locationDetails[indexValue].pincode,
				    		'country'			: this.props.post5.locationDetails[indexValue].country,
				    		'indexOneValue'		: indexValue,
				    		'uderscoreId'		: RouterId,
				    		'updateButton' 		: true,
				    	});
		    	}
		    }else{
		    	// // console.log('this is else');
		    }
    	}
	    this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount()
    {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });   

        if(name=='area'){
        	var currentVal = event.currentTarget.value;
        	if(currentVal.match('[a-zA-Z ]+')){
	        	this.setState({
		            [name]: event.target.value
		        }); 
        	}else{
        		this.setState({
		            [name]: ''
		        }); 
        	}
        }
    }

    handleChangeCountry(event){
    	const target = event.target;
        const name = target.name;
        var stateData = State.find({"countryName":event.target.value}).fetch();
        this.setState({
            stateArray: stateData,
            country: event.target.value
        });
    }
    handleChangeState(event){
    	const target = event.target;
        const name = target.name;
        var districtData = District.find({"stateName":event.target.value}).fetch();
        this.setState({
            districtArray: districtData,
            states: event.target.value
        });
    }

    locationdetailBack(event){
    	event.preventDefault();
    	var id = FlowRouter.getParam('id');
    	if(location.pathname == '/LocationDetails/'+id){
      		FlowRouter.go("/SupplierOnboardingForm/"+id);
      	}else if(location.pathname == '/LocationDetailsSTL/'+id){
      		FlowRouter.go("/SupplierOnboardingFormSTL/"+id);
      	}else{
      		FlowRouter.go("/SupplierOnboardingFormSTM/"+id);
      	}
    }
    locationdetailsAdd(event){
        event.preventDefault();
		var routerId   = FlowRouter.getParam("id");
		console.log('routerId',routerId);
		var userId	   = Suppliers.findOne({'_id':routerId});
		var supplierId = userId._id;
        if($('#LocationsDetail').valid()){
            var formValues = {
                'locationType'     	: this.refs.locationType.value,
                'addressLineone'    : this.refs.addressLineone.value,
                'city'             	: this.refs.city.value,
                'states'          	: this.refs.states.value,
                'area'            	: this.refs.area.value,
                'addressLinetwo'   	: this.refs.addressLinetwo.value,
                'pincode'          	: this.refs.pincode.value,
                'country'           : this.refs.country.value,
            }
            Meteor.call('updatelocationDetails',formValues,supplierId,
            	(error,result)=>{
                if(error){
                  // console.log(error.reason);
                }else{
                  $('.inputText').val('');
                  this.setState({
						'locationType'     : '--Select Location Type--',
				        'addressLineone'   : '',
				        'city'             : '-- Select --',
				        'states'           : '-- Select --',
				        'area'             : '',
				        'addressLinetwo'   : '',
				        'pincode'          : '',
				        'country'          : '-- Select --',
                  })
					$("#LocationsDetail").validate().resetForm();
					
					swal({
						
						title:'Location Details added successfully.'
					});
                }
            });
        }else{
        	$(event.target).parent().parent().find('.inputText.error:first').focus();
        	
        }
    }

    locationdetailBtn(event){
        event.preventDefault();
        if(this.state.locationType != "--Select Location Type--" || this.state.addressLineone != '' || this.state.city != '-- Select --' || this.state.states != '-- Select --' || this.state.area != '-- Select --' || this.state.addressLinetwo != '' || this.state.pincode != '' || this.state.country != '-- Select --'){
			
			swal({
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
			  	var router   = FlowRouter.getParam("id");
			  	var routeIdSplit = router.split('-');
			  	if (routeIdSplit[1]) {
			  		var routerId = router;
			  	}else{
			  		var routerId = router;
			  	}
				if (routerId && value === true) {
					// var id = FlowRouter.getParam('id');

					if(location.pathname == '/LocationDetails/'+routerId){
	            		FlowRouter.go("/ContactDetails/"+routerId);
	            	}else if(location.pathname == '/LocationDetailsSTL/'+routerId){
	            		FlowRouter.go("/ContactDetailsSTL/"+routerId);
	            	}else if(location.pathname == '/LocationDetailsSTM/'+routerId){
		        		FlowRouter.go("/ContactDetailsSTM/"+routerId);
		        	}else{
	            		FlowRouter.go("/ContactDetailsSTM/"+routerId);
	            	}
				}else{
	            	FlowRouter.go("/LocationDetails/"+routerId);
				}
			})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		}else{
        	var routerId   = FlowRouter.getParam("id");
        	
			if (routerId) {
				if(location.pathname == '/LocationDetails/'+routerId){
        			FlowRouter.go("/ContactDetails/"+routerId);
	        	}else if(location.pathname == '/LocationDetailsSTL/'+routerId){
	        		FlowRouter.go("/ContactDetailsSTL/"+routerId);
	        	}else if(location.pathname == '/LocationDetailsSTM/'+routerId){
	        		FlowRouter.go("/ContactDetailsSTM/"+routerId);
	        	}else{
	        		FlowRouter.go("/ContactDetailsSTM/"+routerId);
	        	}
            	// FlowRouter.go("/ContactDetails/"+routerId);
			}else{
				if(location.pathname == '/LocationDetails/'){
	        		FlowRouter.go("/ContactDetails/");
	        	}else if(location.pathname == '/LocationDetailsSTL/'){
	        		FlowRouter.go("/ContactDetailsSTL/");
	        	}else{
	        		FlowRouter.go("/ContactDetailsSTM/");
	        	}
            	// FlowRouter.go("/ContactDetails/");
			}
		}
    }
    componentWillReceiveProps(props){
    	// // console.log('props recive',props)
    	if (!props.loadingState) {
	    	this.setState({
	    		stateArray: props.postState
	    	})
	    }
	    if (!props.loadingDistrict) {
	    	this.setState({
	    		districtArray: props.postDistrict
	    	})
	    }
    	if(props.typeOption == 'Local'){
    		$.validator.addMethod("regxA1", function(value, element, regexpr) {          
				return regexpr.test(value);
			}, "Name should only contain letters & number.");
			$.validator.addMethod("regxAlphaNum", function(value, element, regexpr) {          
	        	return regexpr.test(value);
		    }, "Please enter alphabets and numbers only.");

			jQuery.validator.setDefaults({
				debug: true,
				success: "valid"
			});
    		$("#LocationsDetail").validate({
			rules: {
				locationType: {
				  required: true,
				},
				addressLineone: {
				  required: true,
				},
				country: {
				  required: true,
				},
				states: {
				  required: true,
				},
				city: {
				  required: true,
				},
				area: {
				  required: true,
				  regxAlphaNum: /^[a-zA-Z0-9/\s,.'-/]*$|^$/,
				},
				pincode: {
				  required: true,
				},
			},
			errorPlacement: function(error, element) {
			    if (element.attr("name") == "locationType"){
			      error.insertAfter("#Incoterms");
			    }
			    if (element.attr("name") == "addressLineone"){
			      error.insertAfter("#Line1");
			    }
			    if (element.attr("name") == "addressLinetwo"){
			      error.insertAfter("#Line2");
			    }
			    if (element.attr("name") == "country"){
			      error.insertAfter("#datacountry");
			    }
			    if (element.attr("name") == "states"){
			      error.insertAfter("#Statedata");
			    }
			    if (element.attr("name") == "city"){
			      error.insertAfter("#city");
			    }
			    if (element.attr("name") == "area"){
			      error.insertAfter("#area");
			    }
			    if (element.attr("name") == "pincode"){
			      error.insertAfter("#Pincodedata");
			    }
		  	}
			});
    	}else{
    		$.validator.addMethod("regxA1", function(value, element, regexpr) {          
				return regexpr.test(value);
			}, "Name should only contain letters & number.");

			jQuery.validator.setDefaults({
				debug: true,
				success: "valid"
			});
    		$("#LocationsDetail").validate({
			rules: {
				locationType: {
				  required: true,
				},
				addressLineone: {
				  required: true,
				},
				country: {
				  required: true,
				},
				
			},
			errorPlacement: function(error, element) {
			    if (element.attr("name") == "locationType"){
			      error.insertAfter("#Incoterms");
			    }
			    if (element.attr("name") == "addressLineone"){
			      error.insertAfter("#Line1");
			    }
			    if (element.attr("name") == "addressLinetwo"){
			      error.insertAfter("#Line2");
			    }
			    if (element.attr("name") == "country"){
			      error.insertAfter("#datacountry");
			    }
			    
		  	}
			});
    	}
    	if (!props.loading6) {
	    	if(props.post5.locationDetails && props.post5.locationDetails.length > 0){ 
	    		$(".addLocationForm").show();
	    		var route   = FlowRouter.getParam("id");
		        var routerId   = route.split('-');
		        var indexValue = routerId[1];
		        var RouterId = routerId[0];
	    		if (indexValue) {
	    			// $('buttons2').attr('disabled','disabled');
	    			// $('buttons1').attr('disabled','disabled');
			    	this.setState({
			    		'locationType' 		: props.post5.locationDetails[indexValue].locationType,
			    		'addressLineone'	: props.post5.locationDetails[indexValue].addressLineone,
			    		'city'				: props.post5.locationDetails[indexValue].city,
			    		'states'			: props.post5.locationDetails[indexValue].states,
			    		'area'				: props.post5.locationDetails[indexValue].area,
			    		'addressLinetwo'	: props.post5.locationDetails[indexValue].addressLinetwo,
			    		'pincode'			: props.post5.locationDetails[indexValue].pincode,
			    		'country'			: props.post5.locationDetails[indexValue].country,
			    		'indexOneValue'		: indexValue,
			    		'uderscoreId'		: RouterId,
			    		'updateButton' 		: true,
			    	});
		    		
		    	}
		    }else{
		    	// // console.log('this is else');
		    }
    	}

    	var contact = props.post5 && props.post5.contactDetails ? props.post5.contactDetails : [];
    	for (var i = 0; i < contact.length; i++) {
    		var countContactDetail = i;
    	}
    	if (i == 0) {
    		$('.backcolorAct').removeClass('activeTab');
      		$('.backcolorAct').addClass('inActiveTab');

      		$('.forActive').addClass('inActiveTabTra');
      		$('.forActive').removeClass('activeTabTra');
    	}else{
    		$('.backcolorAct').addClass('activeTab');
      		$('.backcolorAct').removeClass('inActiveTab');

      		$('.forActive').removeClass('inActiveTabTra');
      		$('.forActive').addClass('activeTabTra');
    	}

    	var contact = props.post5 && props.post5.productsServices ? props.post5.productsServices : [];
    	for (var i = 0; i < contact.length; i++) {
    		var countContactDetail = i;
    	}
    	if (i == 0) {
    		$('.backgroundPro').removeClass('activeTab');
      		$('.backgroundPro').addClass('inActiveTab');
    	}else{
    		$('.backgroundPro').addClass('activeTab');
      		$('.backgroundPro').removeClass('inActiveTab');
    	}

    	// var countLocations = this.props.post.productsServices.length;
    	// if (countLocations == 0) {
    	// 	$('.backcolor').css('background-color','#ebebeb')
    	// }else{
    	// 	$('.backcolor').css('background-color','#fff')

    	// }
    	// // console.log('countLocation',countLocation);
    	// // console.log('productsServices',productsServices);
	    this.handleChange = this.handleChange.bind(this);  
    }
    locationDetails(props){
        var route   = FlowRouter.getParam("id");
        var routerUser   = route.split('-');
        if (routerUser[1]) {
        	var routerId = routerUser[0];
        }else{
        	var routerId = route;
        }
        var paramID = FlowRouter.getParam("id");    

        if(/[-]/.test(paramID)){      
        	var id = paramID.split('-')[0];    
        }else{      
        	var id = paramID;    
        }
    	var locaDetail = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
    	var locationarray = [];
	  	if(locaDetail){
	  		if(locaDetail.locationDetails){
	  			for(let i=0;i<locaDetail.locationDetails.length;i++){
	  				locationarray.push({
	  						'location' : locaDetail.locationDetails[i],
	  						'id'	   : locaDetail._id,
	  					});
	  			}//i
	  		}
	  	}//companyData
  		return locationarray;
    }
    locationDelete(event){
    	var idOne = $(event.currentTarget).attr('id');
    	var indexValue = $(event.currentTarget).attr('name')
    	Meteor.call('removeLocationList',idOne,indexValue,
	        function(error,result){
			if(error){
				// console.log(error.reason);
			}else{
				swal({
					
					title:'Location deleted successfully.'
				});
			}
	    });
    }
   
    locationEditUpdate(event){
    	$(".addLocationForm").show();
    	var idOne = $(event.currentTarget).attr('id');
    	var indexValue = $(event.currentTarget).attr('name');
    	var suppliers = Suppliers.findOne({'_id':idOne});
    	var locationvalue = suppliers.locationDetails[indexValue];
    	this.setState({
    		'locationType' 		: suppliers.locationDetails[indexValue].locationType,
    		'addressLineone'	: suppliers.locationDetails[indexValue].addressLineone,
    		'city'				: suppliers.locationDetails[indexValue].city,
    		'states'			: suppliers.locationDetails[indexValue].states,
    		'area'				: suppliers.locationDetails[indexValue].area,
    		'addressLinetwo'	: suppliers.locationDetails[indexValue].addressLinetwo,
    		'pincode'			: suppliers.locationDetails[indexValue].pincode,
    		'country'			: suppliers.locationDetails[indexValue].country,
    		'indexOneValue'		: indexValue,
    		'uderscoreId'		: idOne,
    	});
    	var suppliers = Suppliers.findOne({'_id':idOne});
	    if(suppliers && suppliers.locationDetails[indexValue]){     
	    	this.setState({
	    		'updateButton' 		: true,
	    	});
	    }else{ 
	    	this.setState({
	    		'updateButton' 		: false,
	    	});     
	    }
    }
	updateLocationDetails(event){
		var routerIdSupplier  = FlowRouter.getParam("id");
		var route = routerIdSupplier.split('-');
		if(/[-]/.test(routerIdSupplier)){
		    var routerId = routerIdSupplier.split('-')[0];
		}else{
		    var routerId = routerIdSupplier;
		}
		// if (route[1]) {
		// 	var routerId = route[0];
		// }else{
		// 	var routerId = route[0];
		// }
		var formValues={
			'locationType'     	: this.state.locationType,
			'addressLineone'    : this.state.addressLineone,
			'city'             	: this.state.city,
			'states'          	: this.state.states,
			'area'            	: this.state.area,
			'addressLinetwo'   	: this.state.addressLinetwo,
			'pincode'          	: this.state.pincode,
			'country'           : this.state.country,
			'indexOneValue'		: this.state.indexOneValue,
			'uderscoreId'		: this.state.uderscoreId,
		}
		Meteor.call('editUpdatelocationDetails',formValues,
              (error,result)=>{
                if(error){
                  // console.log(error.reason);
                }else{
                 this.setState({
                 	'locationType'     : '--Select Location Type--',
			        'addressLineone'   : '',
			        'city'             : '-- Select --',
			        'states'           : '-- Select --',
			        'area'             : '',
			        'addressLinetwo'   : '',
			        'pincode'          : '',
			        'country'          : '-- Select --',
                 	indexOneValue 				: '',
                 	uderscoreId 				: '',
 					'locationTypeDisable' 		: false,
                 	'updateButton' 				: false,

                 });
                 	// // console.log('in update');
					$('.button2').attr('disabled',false);
	     			$('.button1').attr('disabled',false);
                  swal({
                  
                  	title:'Updated added location details.'
                  });

                  if(location.pathname == '/LocationDetails/'+routerId){
        			FlowRouter.go("/LocationDetails/"+routerId);
	        	  }else if(location.pathname == '/LocationDetails/'+routerIdSupplier){
        			FlowRouter.go("/LocationDetails/"+routerIdSupplier);
	        	  }else if(location.pathname == '/LocationDetailsSTL/'+routerId){
	        		FlowRouter.go("/LocationDetailsSTL/"+routerId);
	        	  }else if(location.pathname == '/LocationDetailsSTL/'+routerIdSupplier){
	        		FlowRouter.go("/LocationDetailsSTL/"+routerIdSupplier);
	        	  }else if(location.pathname == '/LocationDetailsSTM/'+routerId){
	        		FlowRouter.go("/LocationDetailsSTM/"+routerId);
	        	  }else if(location.pathname == '/LocationDetailsSTM/'+routerIdSupplier){
	        		FlowRouter.go("/LocationDetailsSTM/"+routerIdSupplier);
	        	  }else{
	        		FlowRouter.go("/LocationDetails/"+routerId);
	        	  }
                }
            });
	}
	admin(event){
      event.preventDefault();
      FlowRouter.go('/adminDashboard');  
  	}
	render() {
		
		var locationDataList 	 =  this.props.post2;
		var locationTypeSelect 	 =  this.props.post3;

		var locationTypeArry = [];
		var currentCountry 	 = [];
		var currentState     = [];
		var currentCity      = [];
		var currentArea      = [];
		// var currentPincode   = [];

		var currentCountryVal 	= (this.state.country );
		var currentStateVal		= (this.state.states );
		var currentCityVal 		= (this.state.city );
		var currentAreaVal 		= (this.state.area );
		
		for (var i = 0; i < locationTypeSelect.length; i++) {
			locationTypeArry.push({value:locationTypeSelect[i].value});
		}

		for(var k=0;k<locationDataList.length;k++){
			currentCountry.push({value:locationDataList[k].countryName});
			
			if(currentCountryVal == locationDataList[k].countryName){
				currentState.push({value:locationDataList[k].stateName});
			
				if(currentStateVal == locationDataList[k].stateName){
					currentCity.push({value:locationDataList[k].districtName});

					if(currentCityVal == locationDataList[k].districtName){
						currentArea.push({value:locationDataList[k].cityloctn});
						
						// if(currentAreaVal == locationDataList[k].cityloctn){
						// 	currentPincode.push({value:locationDataList[k].pincodeloctn});
						// }
					}
				}
			}
		}

		currentCountry = currentCountry.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		currentState = currentState.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		currentCity = currentCity.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		currentArea = currentArea.filter((obj,index,array)=>{
			return index === array.findIndex((t)=>(
				t.value === obj.value
			));
		});
		// currentPincode = currentPincode.filter((obj,index,array)=>{
		// 	return index === array.findIndex((t)=>(
		// 		t.value === obj.value
		// 	));
		// });
		

	return (
		<div>
	        <div className="">
	        <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
               {
			        <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
				                <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
				                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
			                          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
			                            <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Onboarding Form</h4>
			                            <div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
			                              {this.props.vendorData && this.props.vendorData.OwnerId == Meteor.userId() ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
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
											<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn3 disabled">
												<div className="trianglefour" id="triangle-right2"></div>
												
												<a href="" className="basic-info-pillss backcolorAct">
												<i className="fa fa-phone phoneIcon" aria-hidden="true"></i>
												Contact
												</a>
												<div className="trianglefive forActive" id="triangle-right"></div>

											</li>
											<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn4 disabled">
												<div className="trianglesix" id="triangle-right3"></div>
												
												<a href="" className="basic-info-pillss backcolorAct backgroundPro">
												<i className="fa fa-cube" aria-hidden="true"></i>
												Product
												</a>
											</li>
										</ul>
									</div>
							       	<section className="Content">
										<div className="row">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<form  className="todaysParkingReport" >
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
														
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
																	 <h4 className="MasterBudgetTitle"><i className="fa fa-map-marker" aria-hidden="true"></i> Location Details</h4>
																</div>	
																<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
																	<div className="button4  pull-right">
																		<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Location
																	</div>
																
																</div>	
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div> 	
															</div>		
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addLocationForm" >
															<form id="LocationsDetail" >	
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationSupplierForm">
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup>
																	</label>
																	<select id="Incoterms" placeholder="Incoterms" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo"  value={this.state.locationType} ref="locationType" name="locationType" onChange={this.handleChange}>
												                        <option disabled>--Select Location Type--</option>
												                        {
																			locationTypeArry.map((locationtypedata, index)=>{
																				return(      
																						<option key={index}>{locationtypedata.value}</option>
																					);
																				}
																			)
																		}
												                    </select>
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 1 <sup className="astrick">*</sup>
							                                            <a data-tip data-for='happyFace' className="pull-right"> <i className="fa fa-question-circle"></i> </a>
							                                            <ReactTooltip id='happyFace' type='error'>
							                                              <span>Enter alphanumeric only..</span>
							                                            </ReactTooltip>
																	</label>
																	<input id="Line1" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo"  value={this.state.addressLineone} ref="addressLineone" name="addressLineone" onChange={this.handleChange} />
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 2</label>
																	<input id="Line2" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.addressLinetwo} ref="addressLinetwo" name="addressLinetwo" onChange={this.handleChange} />
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Country <sup className="astrick">*</sup>
							                                       	</label>
																	<select id="datacountry" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.country}  ref="country" name="country" onChange={this.handleChangeCountry} >
																		<option selected="true" disabled="true">-- Select --</option>
																		{
																			this.props.postCountry.map((Countrydata, index)=>{
																				return(      
																						<option  key={index}>{Countrydata.countryName}</option>
																					);
																				}
																			)
																		}
																    </select>
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">State {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null }
																	</label>
																	<select id="Statedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.states}  ref="states" name="states" onChange={this.handleChangeState} >
																		<option selected="true" disabled="true">-- Select --</option>
																		{
																			this.state.stateArray.map((Statedata, index)=>{
																				return(      
																						<option  key={index}>{Statedata.stateName}</option>
																					);
																				}
																			)
																		}
																    </select>
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">District {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null }
																	</label>
																	<select id="Citydata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city}  ref="city" name="city" onChange={this.handleChange} >
																		<option selected="true" disabled="true">-- Select --</option>
																		{
																			this.state.districtArray.map((Citydata, index)=>{
																				return(      
																						<option  key={index}>{Citydata.districtName}</option>
																					);
																				}
																			)
																		}
																    </select>
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">City {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null }
																	</label>
																	<input type="text" id="area" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area}  ref="area" name="area" onChange={this.handleChange} />
																		{/*<select id="Areadata"  className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} >
																																				<option selected="true" disabled="true">-- Select --</option>
																																				{
																																					currentArea.map((Areadata, index)=>{
																																						return(      
																																								<option  key={index}>{Areadata.value}</option>
																																							);
																																						}
																																					)
																																				}
																																		    </select>*/}
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  marginsB" > 
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Pincode {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null } 
																	</label>
																	<input type="text" id="Pincodedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode}  ref="pincode" name="pincode" onChange={this.handleChange} />

																	{/*<select id="Pincodedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode}  ref="pincode" name="pincode" onChange={this.handleChange} >
																		<option value="">-- Select --</option>
																		{
																			currentPincode.map((Pincodedata, index)=>{
																				return(      
																						<option  key={index}>{Pincodedata.value}</option>
																					);
																				}
																			)
																		}
																    </select>*/}
																</div>
																</div>
																<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7  marginsB">
																
																	{	
																		this.state.updateButton ?
																		<button className="button3 btn-primary pull-right" onClick={this.updateLocationDetails.bind(this)}>&nbsp;Update Location</button>
																		:
																		<button className="button3 btn-primary pull-right" onClick={this.locationdetailsAdd.bind(this)}>&nbsp;Submit</button>
																	}
																</div>
															</form>
															</div>
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
														{this.locationDetails() && this.locationDetails().length>0 ?
															this.locationDetails().map((Suppliersdata,index)=>{
																return(
																	<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1" key={index}>
																		<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			<i className="fa fa-map-marker" aria-hidden="true"></i>
																		</div>
																		<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																			<li>{Suppliersdata.location.locationType}</li>
																			<li>{Suppliersdata.location.addressLineone} , {Suppliersdata.location.addressLinetwo}</li>
																			<li>{Suppliersdata.location.city},{Suppliersdata.location.states} {Suppliersdata.location.pincode}</li>
																		</ul>
																		<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																			<div className="dropdown-content dropdown-contentLocation">
																				<ul className="pdcls ulbtm">
																					<li onClick={this.locationEditUpdate.bind(this)} id={Suppliersdata.id} name={index}>	
																				    	<a href="#"><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																				    </li>
																				    <li onClick={this.locationDelete.bind(this)} id={Suppliersdata.id} name={index}>
																				    	<a href="#"><i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</a>
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
export default EditLocationDetails = withTracker((props)=>{

    const postHandle = Meteor.subscribe('supplierList');
    const post       = Suppliers.findOne({'createdBy':Meteor.userId()})||{};
    const loading    = !postHandle.ready();
  
	const postHandle2 = Meteor.subscribe('locationdata');
	const postHandleCountry = Meteor.subscribe('countriesdata');
	const postHandleState = Meteor.subscribe('statedata');
	const postHandleDistrict = Meteor.subscribe('districtdata');
	const post2       = Location.find({}).fetch()||[];
	const postCountry     = Countries.find({}).fetch()||[];
	const postState       = State.find({}).fetch()||[];
	const postDistrict    = District.find({}).fetch()||[];
	const loading2    = !postHandle2.ready();
	const loadingCountry    = !postHandleCountry.ready();
	const loadingState    = !postHandleState.ready();
	const loadingDistrict    = !postHandleDistrict.ready();
	
	const postHandle3 = Meteor.subscribe('MasterDataSupplierLocationType');
	const post3       = MasterData.find({'type':'Supplier Location Type'}).fetch()||[];
	console.log('post3',post3);
	const loading3    = !postHandle3.ready();

	var route   = FlowRouter.getParam("id");
	
    if(/[-]/.test(route)){      
    	var id = route.split('-')[0];
	}else{      
		var id = route;
	}
	const demoSub    = Meteor.subscribe('supplierListByID',id);
	const loading6   = !demoSub.ready();
	const post5      = Suppliers.findOne({"_id":id})||{};
	const typeOption = post5.typeOptions;

	var OwnerId = Meteor.userId();
    const vendorData  = Suppliers.findOne({"OwnerId":OwnerId});
    console.log('vendorDataId',vendorData, OwnerId, Meteor.userId());

    return {
      loading,
      post,

      loading2,
      post2, 
          
      loading3,
      post3, 

      id,
      demoSub,
      post5,
      loading6,
      typeOption,
      loadingCountry,
      postCountry,
      loadingState,
      postState,
      loadingDistrict,
      postDistrict,
      vendorData
    };
}) (LocationDetails);