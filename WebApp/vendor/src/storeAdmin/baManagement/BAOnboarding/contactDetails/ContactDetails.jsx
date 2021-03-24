import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter}  from 'meteor/ostrio:flow-router-extra';
import { Random } from 'meteor/random';
import { Location } from '/imports/admin/masterData/manageLocation/components/location/component/Location.js';
import InputMask from 'react-input-mask';
import swal           from 'sweetalert';

class ContactDetails extends Component {
	constructor(props) {
      super(props);
    
      this.state = {
        'Location'     		: '--Select Location Type--',
        'Designation'       : '',
        'ContactLevel'      : '--Select Contact Level--',
        'Phone'             : '',
        'Email'          	: '',
        'Name'            	: '',
        'Reportinmanager'   : '',
        'AltPhone'          : '',
        'Landing'           : '',
        'contactValue'		: '',
        'contactIndex'      : '',
		'levelIndex'        : '',
      };
      this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
    	/*if(nextProps.post2.contactDetails && nextProps.post2.contactDetails.length > 0){ 
	  		$('.addContactForm').show();
	    	var routerIdSupplier  = FlowRouter.getParam("id");
			var route = routerIdSupplier.split('-');
			
			if (route[1] && route[2]) {
				var routerId 			= route[0];
				var contactDetailIndex  = route[1];
				var locationLevelIndex  = route[2];
		      	this.setState({ 
		      		'Location'      	: nextProps.post2.contactDetails[contactDetailIndex].Location,
		            'Designation'       : nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Designation,
		            'ContactLevel'      : parseInt(nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].ContactLevel),
		            'Phone'             : nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Phone,
		            'Email'          	: nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Email,
		            'Name'            	: nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Name,
		            'Reportinmanager'   : nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Reportinmanager,
		            'AltPhone'          : nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].AltPhone,
		            'Landing'           : nextProps.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Landing,
					'contactIndex'      : contactDetailIndex,
					'levelIndex'        : locationLevelIndex,
					'updateButton' 		: true,       
		      	});   
			}
	    }
	   
    	var contact = nextProps.post2.productsServices;
    	if (contact.length > 0) {

	    	for (var i = 0; i < contact.length; i++) {
	    		var countContactDetail = i;
	    	}
    	}
    	if (i == 0) {
    		$('.backgroundPro').removeClass('activeTab');
      		$('.backgroundPro').addClass('inActiveTab');
    	}else{
    		$('.backgroundPro').addClass('activeTab');
      		$('.backgroundPro').removeClass('inActiveTab');
    	}*/
	    this.handleChange = this.handleChange.bind(this);  
    }
    componentDidMount() {
    	window.scrollTo(0, 0);
    	if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
          $("body").append(adminLte);
    	}
    	$.validator.addMethod("regxA1", function(value, element, regexpr) {          
			return regexpr.test(value);
		}, "Please enter valid phone number.");
		$.validator.addMethod("regxA2", function(value, element, regexpr) {          
			return regexpr.test(value);
		}, "Please enter valid email id.");
		$.validator.addMethod("notEqual", function(value, element, param) {
	      return this.optional(element) || value != param;
	    }, "Please specify a different value");
		  
		$.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#ContactDetail").validate({
			rules: {
				Location: {
				  required: true,
				},
				Designation: {
				  required: true,
				},
				ContactLevel: {
				  required: true,
				},
				Phones: {
					// regxA1:/^[0-9+]{10}$|^$/,
				  	required: true,
				},
				Email: {
					regxA2:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
				  	required: true,
				},
				Name: {
				  required: true,
				},
				// Reportinmanager: {
				//   required: true,
				// },
				AltPhone: {
				  notEqual: $('input[name="Phones"]').val(),
				//   regxA1:/^[0-9+]{10}*$/,					
				  required: false,
				},
				Landings: {
				//   regxA3:/^[0-9+]{11}*$/,		
				  maxlength: 13,
				  required: false,
				},
			},
			errorPlacement: function(error, element) {
			    if (element.attr("name") == "Location"){
			      error.insertAfter("#headoffice");
			    }
			    if (element.attr("name") == "Designation"){
			      error.insertAfter("#Designations");
			    }
			    if (element.attr("name") == "ContactLevel"){
			      error.insertAfter("#ContactLevel");
			    }
			    if (element.attr("name") == "Phone"){
			      error.insertAfter("#Phones");
			    }
			    if (element.attr("name") == "Email"){
			      error.insertAfter("#Emails");
			    }
			    if (element.attr("name") == "Name"){
			      error.insertAfter("#Names");
			    }
			    // if (element.attr("name") == "Reportinmanager"){
			    //   error.insertAfter("#Reportinmanagers");
			    // }
			    if (element.attr("name") == "AltPhone"){
			      error.insertAfter("#AltPhones");
			    }
			    if (element.attr("name") == "Landing"){
			      error.insertAfter("#Landings");
			    }
		  	}
		});
		$(document).ready(function(){
		  var $contenta = $(".addContactForm").hide();
		  $(".button4").on("click", function(e){
		    $contenta.slideToggle();
		  });
		});

		// -----------------new code ----------------- //
		/*if (!this.props.loading6) { 
			if(this.props.post2.contactDetails && this.props.post2.contactDetails.length > 0){ 
		  		$('.addContactForm').show();
		    	var routerIdSupplier  = FlowRouter.getParam("id");
				var route = routerIdSupplier.split('-');
				if (route[1] && route[2]) {
					$('.button2').attr('disabled',true);
	     			$('.button1').attr('disabled',true);
					var routerId 			= route[0];
					var contactDetailIndex  = route[1];
					var locationLevelIndex  = route[2];
			      	this.setState({ 
			      		'Location'      	: this.props.post2.contactDetails[contactDetailIndex].Location,
			            'Designation'       : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Designation,
			            'ContactLevel'      : parseInt(this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].ContactLevel),
			            'Phone'             : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Phone,
			            'Email'          	: this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Email,
			            'Name'            	: this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Name,
			            'Reportinmanager'   : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Reportinmanager,
			            'AltPhone'          : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].AltPhone,
			            'Landing'           : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Landing,
						'contactIndex'      : contactDetailIndex,
						'levelIndex'        : locationLevelIndex,
						'updateButton' 		: true,       
			      	});   
				}

			}
		    this.handleChange = this.handleChange.bind(this);
		}*/
    }

    componentWillUnmount()
    {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    keyPress = (e) => {
	    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
	         // Allow: Ctrl+A, Command+A
	        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
	        (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
	        (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
	         // Allow: home, end, left, right, down, up
	        (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
	             // let it happen, don't do anything
	             return;
	    }
	    // Ensure that it is a number and stop the keypress
	    if (((e.keyCode < 65 || e.keyCode > 91)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46)) {
	        e.preventDefault();
	    }
	}
    /* ========== only number ========*/
    keyPressNumber = (e) => {
	    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
	         // Allow: Ctrl+A, Command+A
	        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
	        (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
	        (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
	         // Allow: home, end, left, right, down, up
	        (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
	             // let it happen, don't do anything
	             return;
	    }
	    // Ensure that it is a number and stop the keypress
	    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46)) {
	        e.preventDefault();
	    }
	}
    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        }); 

        if(name == 'AltPhone' || name == 'Phone'){
        	var currentVal = event.currentTarget.value;
        	if(name == 'AltPhone'){
        		var phoneVal = $(event.currentTarget).parent().parent().find('input[name="Phone"]').val();
        	}else{
        		var phoneVal = $(event.currentTarget).parent().parent().find('input[name="AltPhone"]').val();
        	}
        	if(currentVal == phoneVal){
				this.setState({
		            [name]: ''
		        });        		
        	}else{
				this.setState({
		            [name]: event.target.value
		        });
        	}
        }  
    }
	locationdetailBack(event){
		event.preventDefault();
		var routerId   = FlowRouter.getParam("id");
		if(location.pathname == '/ContactDetails/'+routerId){
			FlowRouter.go("/LocationDetails/"+routerId);
		}else if(location.pathname == '/ContactDetailsSTL/'+routerId){
			FlowRouter.go("/LocationDetailsSTL/"+routerId);
		}else{
			FlowRouter.go("/LocationDetailsSTM/"+routerId);
		}
	}   
    contactdetailBtn(event){
        event.preventDefault();
        if(this.state.Location != "--Select Location Type--" || this.state.Designation != '' || this.state.Phone != '' || this.state.Email != '' || this.state.Name != '' || this.state.Reportinmanager != '' || this.state.AltPhone != '' || this.state.Landing != ''){
			swal({
				title: "abc",
				text: "It seem that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page.But you may lose values allready entered in the location form",
				// type: "warning",
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
					if(location.pathname == '/ContactDetails/'+routerId){
	            		FlowRouter.go("/Product_Services/"+routerId);
	            	}else if(location.pathname == '/ContactDetailsSTL/'+routerId){
	            		FlowRouter.go("/Product_ServicesSTL/"+routerId);
	            	}else{
	            		FlowRouter.go("/Product_ServicesSTM/"+routerId);
	            	}
				}else{
	            	FlowRouter.go("/ContactDetails/"+routerId);
				}
			})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		}else{
        	var routerId   = FlowRouter.getParam("id");
			if (routerId) {

            	if(location.pathname == '/ContactDetails/'+routerId){
	            		FlowRouter.go("/Product_Services/"+routerId);
            	}else if(location.pathname == '/ContactDetailsSTL/'+routerId){
            		FlowRouter.go("/Product_ServicesSTL/"+routerId);
            	}else{
            		FlowRouter.go("/Product_ServicesSTM/"+routerId);
	            }
			}else{

            	// FlowRouter.go("/Product_Services/");
            	if(location.pathname == '/ContactDetails/'+routerId){
	            		FlowRouter.go("/Product_Services/"+routerId);
            	}else if(location.pathname == '/ContactDetailsSTL/'+routerId){
            		FlowRouter.go("/Product_ServicesSTL/"+routerId);
            	}else{
            		FlowRouter.go("/Product_ServicesSTM/"+routerId);
	            }
			}
		}
  
    }  
    contactdetailAddBtn(event){
        event.preventDefault();
        var contact_id = Random.id();
	    var id   = FlowRouter.getParam("id");
	    if(/[-]/.test(id)){
		    var routerId = id.split('-')[0];
		}else{
		    var routerId = id;
		}
	    var userId	   = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
	    var supplierId = userId._id;
	    var locationOffice = this.refs.Location.value;
		if($('#ContactDetail').valid()){
	        var formValues = {
	            'Location'      	: this.refs.Location.value,
	            'Designation'       : this.refs.Designation.value,
	            'ContactLevel'      : parseInt(this.refs.ContactLevel.value),
	            'Phone'             : this.refs.Phone.value,
	            'Email'          	: this.refs.Email.value,
	            'Name'            	: this.refs.Name.value,
	            'Reportinmanager'   : this.refs.Reportinmanager.value,
	            'AltPhone'          : this.refs.AltPhone.value,
	            'Landing'           : this.refs.Landing.value,
	        }
	        Meteor.call('updatesuppliers',formValues,supplierId,locationOffice,contact_id,
	          	(error,result)=>{
	            if(error){
	              // console.log(error.reason);
	            }else{
	              $('.inputText').val('');
	              swal({
	              	title:"Contact Details added successfully.",
	              });
	              $("#ContactDetail").validate().resetForm();
	              this.setState({
	              	'Location'     		: '--Select Location Type--',
			        'Designation'       : '',
			        'ContactLevel'      : '--Select Contact Level--',
			        'Phone'             : '',
			        'Email'          	: '',
			        'Name'            	: '',
			        'Reportinmanager'   : '',
			        'AltPhone'          : '',
			        'Landing'           : '',
			        'updateButton' 		: false,
	              })
	            }
	        });

        }else{
        	$(event.target).parent().parent().find('.inputText.error:first').focus();
        }
    }

    updatecontactdetailAddBtn(event){
    	event.preventDefault();
    	var contactId = $(event.currentTarget).attr('data-id');
		var idRoute   = FlowRouter.getParam("id");
		var route = idRoute.split('-');
		if (route[1]) {
			var routerId = route[0];
		}else{
			var routerId = idRoute;
		}
		if($('#ContactDetail').valid()){
    	var formValues={
			'Location'      	: this.state.Location,
            'Designation'       : this.state.Designation,
            'ContactLevel'      : parseInt(this.state.ContactLevel),
            'Phone'             : this.state.Phone,
            'Email'          	: this.state.Email,
            'Name'            	: this.state.Name,
            'Reportinmanager'   : this.state.Reportinmanager,
            'AltPhone'          : this.state.AltPhone,
            'Landing'           : this.state.Landing,
            '_id'				: routerId,
		    'levelId'			: contactId,
		    'contactIndex'      : this.state.contactIndex,
			'levelIndex'        : this.state.levelIndex
		}
		Meteor.call('editUpdatecontactDetails',formValues,
              (error,result)=>{
                if(error){
                  // console.log(error.reason);
                }else{
		            this.setState({
		            	'_id'				: '',
		            	'levelId'			: '',
		             	'Location'     		: '--Select Location Type--',
				        'Designation'       : '',
				        'ContactLevel'      : '--Select Contact Level--',
				        'Phone'             : '',
				        'Email'          	: '',
				        'Name'            	: '',
				        'Reportinmanager'   : '',
				        'AltPhone'          : '',
				        'Landing'           : '',
				        'contactValue'		: '',
				        'contactIndex'      : '',
						'levelIndex'        : '',
				        'updateButton' 		: false,
		            })
		            $('.button2').attr('disabled',false);
	     			$('.button1').attr('disabled',false);
              		swal({
              			title:'Contact details updated successfully.'
              		});

              		if(location.pathname == '/ContactDetailsSTM/'+idRoute){
              			FlowRouter.go("/ContactDetailsSTM/"+idRoute);
              		}else if(location.pathname == '/ContactDetailsSTL/'+idRoute){
              			FlowRouter.go("/ContactDetailsSTL/"+idRoute);
              		}else{
              			FlowRouter.go("/ContactDetails/"+routerId);
              		}

                  
                }
            });
		}
    }

    levelOneContact(props){
    	var routerIdSupplier  = FlowRouter.getParam("id");
		var route = routerIdSupplier.split('-');
		if (route[1] && route[2]) {
			var routerId = route[0];
		}else{
			var routerId = route[0];
		}
	    var contactOne 	 = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
	    var contactarray = [];
	    var locationarr  = [];
	    var uniqLocationarr  = [];
	   	if (contactOne) {
		    for (var i = 0; i < contactOne.contactDetails.length; i++) {
		    	var Location = contactOne.contactDetails[i].Location;
		    	if (contactOne.contactDetails[i].LocationLevel.length > 0) {

		    	var a =	<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead">

								<h4><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;{contactOne.contactDetails[i].Location}</h4>
							</div>;
		    	}
							// // console.log('{contactOne.contactDetails[i].Location}',contactOne.contactDetails[i].LocationLevel.length)
				contactarray.push({
		    		'a'			  : a,
		    	});
		    	if (Location) {
				    
				    let levelsArr = contactOne.contactDetails[i].LocationLevel;
				    // // console.log('levelsArr==>',levelsArr.length);
				    levelsArr = _.sortBy(levelsArr, 'ContactLevel');
				    var arrow = 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 downarr">
										<i className="fa fa-arrow-down" aria-hidden="true"></i>
									</div>;
		    		for (var j = 0; j <  levelsArr.length; j++) {
		    			if (levelsArr[j].ContactLevel == 1) {
		    				var bgColor = 'bglevel';

		    			}else if (levelsArr[j].ContactLevel == 2) {
		    				var bgColor = 'bglevel1';

		    			}else if(levelsArr[j].ContactLevel == 3){
		    				var bgColor = 'bglevel2';
		    			}
					   	var locationLevel =levelsArr[j].ContactLevel;
	    				var branchLevel = <div data={locationLevel} id={levelsArr[j].contact_id}>
	    							{ (j >=1) ? ((locationLevel > levelsArr[j-1].ContactLevel) ? arrow :  '') : ''}
				    				<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12 boxul pdcls">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls levelOneBox">
										<div className="col-lg-1 col-md-12 col-sm-12 col-xs-12 usericn pdcls">
{/*											<i className="fa fa-user-circle" aria-hidden="true"></i>
*/}										</div>
										<ul className="col-lg-4 col-md-10 col-sm-10 col-xs-10 pdcls">
										    <li className="liheader"><i className="fa fa-user-o iconpd" aria-hidden="true"></i>{levelsArr[j].Name}</li>
										    <li><i className="fa fa-address-card-o iconpd" aria-hidden="true"></i>{levelsArr[j].Designation}</li>
										</ul>
										<ul className="col-lg-4 col-md-10 col-sm-10 col-xs-10 pdcls">
										    <li className="whitesp lisubheader"><i className="fa fa-envelope-o iconpd" aria-hidden="true"></i>{levelsArr[j].Email}</li>
										    <li><i className="fa fa-mobile iconpd" aria-hidden="true"></i>+91 {levelsArr[j].Phone}</li>
										</ul>
										<div className={"col-lg-3 col-md-12 col-sm-12 col-xs-12 pdcls "+ bgColor}>
											<div className="dots dropdown1">
											<i className="fa fa-ellipsis-h dropbtn1" aria-hidden="true"></i>
											<div className="dropdown-content1">
											
												<ul className="pdcls ulbtm">
													<li id={levelsArr[j].contact_id} className="styleContactActbtn" data-index={i +"-"+ j} data-id={contactOne._id} data-locationtype={contactOne.contactDetails[i].Location} onClick={this.contactEditUpdate.bind(this)}>	
												    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
												    </li>
												    <li id={levelsArr[j].contact_id} className="styleContactActbtn" data-id={contactOne._id} data-index={i +"-"+ j} onClick={this.removeLevel.bind(this)}>
												    	<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
												    </li>
											    </ul>
											</div>
											</div>
											<div className="level1">
											{
												levelsArr[j].ContactLevel == 1 ? 'First level of contact' 
													: 
													levelsArr[j].ContactLevel == 2? 
														'Second level of contact' 
															: 'Third level of contact'}
											</div>
										</div>
										</div>
									</div>
									
								</div>;
								contactarray.push({
		    						'headOfficce' : branchLevel
		    					});
		    		}//EOF loop
		    			
		    	}//EOF haedoffice
		    }
	    }else{
	    	

	    }
	    return contactarray;
	 
    }

    contactEditUpdate(event){
    	event.preventDefault();
    	$(".addContactForm").show();
    	var levelId 	  = $(event.currentTarget).attr('id');
    	var contactId 	  = $(event.currentTarget).attr('data-id');
    	var locationtypes = $(event.currentTarget).attr('data-locationtype');
    	var dataIndex     = $(event.currentTarget).attr('data-index');
    	var splitIndex    = dataIndex.split('-');
    	var contactIndex  = splitIndex[0];
    	var levelIndex    = splitIndex[1];
 
    	var suppliers  = Suppliers.findOne({'_id':contactId});
    	var suppContact = suppliers.contactDetails.length;
    	for (var i = 0; i < suppContact; i++) {
    		if (suppliers.contactDetails[i].Location == locationtypes) {
    			for (var j = 0; j < suppliers.contactDetails[i].LocationLevel.length; j++) {
    				if (suppliers.contactDetails[i].LocationLevel[j].contact_id == levelId) {
    					this.setState({
    						'Location'     		: suppliers.contactDetails[i].Location,
					        'Designation'       : suppliers.contactDetails[i].LocationLevel[j].Designation,
					        'ContactLevel'      : suppliers.contactDetails[i].LocationLevel[j].ContactLevel,
					        'Phone'             : suppliers.contactDetails[i].LocationLevel[j].Phone,
					        'Email'          	: suppliers.contactDetails[i].LocationLevel[j].Email,
					        'Name'            	: suppliers.contactDetails[i].LocationLevel[j].Name,
					        'Reportinmanager'   : suppliers.contactDetails[i].LocationLevel[j].Reportinmanager,
					        'AltPhone'          : suppliers.contactDetails[i].LocationLevel[j].AltPhone,
					        'Landing'           : suppliers.contactDetails[i].LocationLevel[j].Landing,
					        'contactValue'		: suppliers.contactDetails[i].LocationLevel[j].contact_id,
					        'contactIndex'      : contactIndex,
					        'levelIndex'        : levelIndex
    					});
    					window.scrollTo(0, 0);
	    				if(suppliers.contactDetails[i].LocationLevel[j].contact_id == levelId){     
					    	this.setState({
					    		'updateButton' 		: true,
					    	});
					    }else{ 
					    	this.setState({
					    		'updateButton' 		: false,
					    	});     
					    }
    				}
    				
    			}

    		}
    	}
    }

	removeLevel(event){
	    event.preventDefault();
	    var id = $(event.currentTarget).attr('data-id');
	    var idlevele = $(event.currentTarget).attr('id');
	    var dataIndex     = $(event.currentTarget).attr('data-index');
    	var splitIndex    = dataIndex.split('-');
    	var contactIndex  = splitIndex[0];
    	var levelIndex    = splitIndex[1];

	    Meteor.call('removelevel',id,contactIndex,levelIndex,idlevele,
	        function(error,result){
	          if(error){
	            // console.log(error.reason);
	          }else{
	            swal({
	            	title:'Contact Details deleted successfully!'
	        	});
	          }
	      });
	}
	

	render() {
    	var router   = FlowRouter.getParam("id");
    	var routerId   = router.split("-");
		var locationTypeArry = [];
		var locationTypeSelect 	 =  Suppliers.findOne({"_id" : routerId[0]});

		if (locationTypeSelect) {
			for (var i = 0; i < locationTypeSelect.locationDetails.length; i++) {
				locationTypeArry.push({value:locationTypeSelect.locationDetails[i].locationType});
			}
		}

		var locationtypeArry  = _.pluck(locationTypeArry,"value");
		var uniquelocationtypeArry = _.uniq(locationtypeArry)
		var uniquelocationtype     = [];
		
		for(var k=0;k<uniquelocationtypeArry.length;k++){
			var uniqueloca = uniquelocationtypeArry[k];
			if (uniqueloca) {
				uniquelocationtype.push({value:uniqueloca});
			}else{
				uniquelocationtype.push({value:"No Data Found"});
			}
		}
    return (
       	<div>
	        <div className="">
	        <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
		        <section className="content viewContent">
		            <div className="row">
		              	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			              	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxtop">
			                	<div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
				                    <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
			                          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
			                            <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Onboarding Form</h4>
			                            <div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
			                              {this.props.vendorData && this.props.vendorData.OwnerId == Meteor.userId() ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
			                            </div>
			                          </div>
			                        </div>
							        <div id="parkingreport" className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<ul className="nav nav-pills ">
											<li className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
												<a href="" className="basic-info-pillss pillsHover">
												<i className="fa fa-info-circle" aria-hidden="true"></i>
												Basic Info 
												</a>
												<div className="triangleone" id="triangle-right"></div>
											</li>
											<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
												<div className="triangletwo" id="triangle-right1"></div>
												<a href="" className="basic-info-pillss pillsHover">
												<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i>
												Location
												</a>
												<div className="trianglethree" id="triangle-right"></div>
											</li>
											<li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn3">
												<div className="trianglefour" id="triangle-right2"></div>
												<a href="" className="basic-info-pillss pillsHover">
												<i className="fa fa-phone phoneIcon" aria-hidden="true"></i>
												Contact
												</a>
												<div className="trianglefive triangle5" id="triangle-right"></div>
											</li>
											<li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn4 disabled">
												<div className="trianglesix" id="triangle-right3"></div>
													<a href="" className="basic-info-pillss pillsHover backgroundPro">
												<i className="fa fa-cube" aria-hidden="true"></i>
												Product
												</a>
											</li>
										</ul>
									</div>
							       	<section className="Content">
										<div className="row">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
														<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
															 <h4 className="MasterBudgetTitle"><i className="fa fa-phone" aria-hidden="true"></i> Contact Details</h4>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 ">
															 <h4 className="noteSupplier">Note: Please start adding contacts from 1st point of contact to higher authority.</h4>
														</div>
														<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
															<div className="button4  pull-right">
																<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Contact
															</div>
														</div>	
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div> 	
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addContactForm">
														<form id="ContactDetail">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactForm">
															<div  className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup> 
					                                            </label>
																<select id="headoffice" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Location} ref="Location" name="Location" onChange={this.handleChange}>
											                        <option selected="true" disabled="true">--Select Location Type--</option>
											                        {
																		uniquelocationtype.map((locationtypedata, index)=>{
																			return(      
																					<option key={index}>{locationtypedata.value}</option>
																				);
																			}
																		)
																	}
											                    </select>
															</div>

										                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12  margin-bottomOne" > 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Designation <sup className="astrick">*</sup> 
						                                        </label>
																<input id="Designations" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Designation} ref="Designation" name="Designation" onChange={this.handleChange} />
															</div>
															<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12  margin-bottomOne" > 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Contact Level <sup className="astrick">*</sup> 
						                                        </label>
																<select id="ContactLevel" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.ContactLevel} ref="ContactLevel" name="ContactLevel" onChange={this.handleChange}>
											                        <option selected="true" disabled="true">--Select Contact Level--</option>
											                        <option value="1">First level of contact</option>
											                        <option value="2">Second level of contact</option>
											                        <option value="3">Third level of contact</option>
											                    </select>
															</div>
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 "> 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Mobile Number <sup className="astrick">*</sup> 
						                                        </label>
																<InputMask mask="9999999999" maskChar=" " id="Phones" name="phones" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Phone} ref="Phone" name="Phone" onChange={this.handleChange} pattern="[0-9]+" required/>
															</div>
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  margin-bottomOne" > 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Email <sup className="astrick">*</sup> 
						                                       	</label>
																<input id="Emails" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Email} ref="Email" name="Email" onChange={this.handleChange} />
															</div>
														
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " > 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Name <sup className="astrick">*</sup> 
						                                        </label>
																<input id="Names" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Name} ref="Name" name="Name" onChange={this.handleChange} />
															</div>
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12  margin-bottomOne" > 
																<label className="labelform whitesp col-lg-12 col-md-12 col-sm-12 col-xs-12">Reporting Manager
						                                        </label>
																<input id="Reportinmanagers" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo"  value={this.state.Reportinmanager} ref="Reportinmanager" name="Reportinmanager" onChange={this.handleChange} />
															</div>
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " > 
																<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Alt. Mobile Number 
						                                        </label>
																<InputMask mask="9999999999" maskChar=" " id="AltPhones" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.AltPhone} ref="AltPhone" name="AltPhone" onChange={this.handleChange} pattern="[0-9]+" />
															</div>
															<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " > 
																<label className="labelform whitesp col-lg-12 col-md-12 col-sm-12 col-xs-12">Office Landline No. 
						                                        </label>

																<input id="Landings" name="Landings" type="text" onKeyDown={this.keyPressNumber} className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" minLength="6" maxLength="13" value={this.state.Landing} ref="Landing" name="Landing" onChange={this.handleChange} />
															</div>
															</div>
															
															<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 contactSubmit">
																{	
																	this.state.updateButton ?
																		<button className="button3 btn-primary pull-right" onClick={this.updatecontactdetailAddBtn.bind(this)} data-id={this.state.contactValue}>Update Contact</button>
																			:
																		<button className="button3 btn-primary pull-right" onClick={this.contactdetailAddBtn.bind(this)}>Submit</button>
																}
															</div>
														</form>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Location Details</button>
														<button className="button1 pull-right" onClick={this.contactdetailBtn.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
													</div>
												</div> 
											</div>
											
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
														 <h4 className="MasterBudgetTitle">Contacts</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bxht pdcls">
														{this.levelOneContact() && this.levelOneContact().length?
															this.levelOneContact().map((contactArr,index)=>{
																return(
																	<div key={index}>
																		{contactArr.a}
																		{contactArr.headOfficce}
																	</div>
																	);
															})
															:
															<div className="textAlign">Contact Details will be shown here.</div>	
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
	        </div>
	    </div>
	    );

	} 

}

export default ContactDetails;