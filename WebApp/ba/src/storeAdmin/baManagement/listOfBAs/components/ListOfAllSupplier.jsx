import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';;
import {Suppliers} from '/imports/StoreManagement/SupplierManagement/supplierOnboarding/api/apiSupplierOnboardingForm.js';
import { FlowRouter}  from 'meteor/ostrio:flow-router-extra';
import '/imports/StoreManagement/SupplierManagement/supplierOnboarding/locationDetails/LocationDetails';

class ListOfAllSupplier extends TrackerReact(Component) {
	
	constructor(props) {
      super(props);
    
      this.state = {
        loadMore: false,
        loadless: false
      };
      // this.handleChange = this.handleChange.bind(this);
      this.isLoaded = false
    }
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
  	}
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
	levelOneContact(props){
    	var routerId   	 = this.props.id;
	    var contactOne 	 = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
	    var contactarray = [];
	    var locationarr  = [];
	    var uniqLocationarr  = [];
	   	if (contactOne) {
		    for (var i = 0; i < contactOne.contactDetails.length; i++) {
		    	var Location = contactOne.contactDetails[i].Location;
		    	// var addressLineone = contactOne.locationDetails[0].addressLineone;
		    	// var addressLinetwo = contactOne.locationDetails[0].addressLinetwo;
		    	// var pincode  	   = contactOne.locationDetails[0].pincode;
		    	// var country 	   = contactOne.locationDetails[0].country;
		    	// var area     	   = contactOne.locationDetails[0].area;
		    	// var states   	   = contactOne.locationDetails[0].states;
		    	// var city 	 	   = contactOne.locationDetails[0].city;
		    	
		    	// // console.log("Location",Location);
				var a =	<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead1">
							<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 locationHeadingMargin">
								<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
									<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
								</div>
								<div className="col-lg-11 col-md-1 col-sm-12 col-xs-12">
									<h4>Location Wise Contact Details</h4>
								</div>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="col-lg-6 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
										<h5 className="locationName">{contactOne.contactDetails[i].Location}</h5>
									</div>
									<div className="dots dropdown1 col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
										<i className="fa fa-ellipsis-h dropbtn2 locationdropbtn2" aria-hidden="true"></i>
										<div className="dropdown-content1">
											<ul className="pdcls ulbtm">
												<li id={routerId} className="styleContactActbtn" onClick={this.LocationAddressEdit.bind(this)} data-Location={contactOne.contactDetails[i].Location}>	
											    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
											    </li>
										    </ul>
										</div>
									</div>
								</div>
							</div>
							<div  className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{contactOne.locationDetails[0].addressLineone} ,{contactOne.locationDetails[0].addressLinetwo}</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{contactOne.locationDetails[0].city},{contactOne.locationDetails[0].states}, {contactOne.locationDetails[0].pincode}</div>
							</div>
						</div>;
				contactarray.push({
		    		'a'			  : a,
		    	});
		    	if (Location) {
				    
				    let levelsArr = contactOne.contactDetails[i].LocationLevel;
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
	    				var branchLevel = <div data={locationLevel} id={levelsArr[j].contact_id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	    							{ (j >=1) ? ((locationLevel > levelsArr[j-1].ContactLevel) ? arrow :  '') : ''}
				    				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxul pdcls">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls levelOneBox">
										{/*<div className="col-lg-1 col-md-12 col-sm-12 col-xs-12 usericn pdcls">
											<i className="fa fa-user-circle" aria-hidden="true"></i>
										</div>*/}
										<div className="col-lg-10 col-md-9 col-sm-12 col-xs-12 contactNameListFirst">
											<ul className="col-lg-12 col-md-10 col-sm-10 col-xs-10 pdcls contactNameListSecond">
											    <div className="nameContent col-lg-6 ">
											    	<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 paddinf-left">
												    	<i className="fa fa-user-o " aria-hidden="true"></i>
												    </div>
												    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 contactNameList">
												    	{levelsArr[j].Name}
												    </div>
											    </div>
											    <div className="nameContent col-lg-6 ">
												    <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 no-Padding">
												    	<i className="fa fa-envelope-o " aria-hidden="true"></i>
												    </div>
												    <div className="col-lg-10 col-md-11 col-sm-12 col-xs-12 no-Padding">
												    	{levelsArr[j].Email}
												    </div>
											    </div>
											</ul>
											<ul className="col-lg-12 col-md-10 col-sm-10 col-xs-10 pdcls">
												<div className="nameContent col-lg-6">
												    <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 paddinf-left">
												    	<i className="fa fa-address-card-o " aria-hidden="true"></i>
												    </div>
												    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
												    	{levelsArr[j].Designation}
												    </div>
											    </div>
											    <div className="nameContent col-lg-6 ">
											    	<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 no-Padding">
											    		<i className="fa fa-mobile  " aria-hidden="true"></i>
											    	</div>
											    	<div className="col-lg-10 col-md-11 col-sm-12 col-xs-12 no-Padding">
											    		+91 {levelsArr[j].Phone}
											    	</div>
											    </div>
											</ul>
										</div>
										<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 levelCss">
											<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls "+ bgColor}>
												<div className="dots dropdown1">
													<i className="fa fa-ellipsis-h dropbtn1" aria-hidden="true"></i>
												<div className="dropdown-content1">
												
													<ul className="pdcls ulbtm">
														<li id={levelsArr[j].contact_id} className="styleContactActbtn" data-index={i +"-"+ j} data-id={contactOne._id} data-locationtype={contactOne.contactDetails[i].Location} onClick={this.contactEdit.bind(this)}>	
													    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
													    </li>
												    </ul>
												</div>
												</div>
												<div className="level1 liheader3">
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
									</div>
									
								</div>;
								contactarray.push({
		    						'headOfficce' : branchLevel
		    					});
		    		}//EOF loop
		    			
		    	}//EOF haedoffice
		    }
	    }
	    return contactarray;
    }
    contactEdit(event){
    	var id = $(event.currentTarget).attr('data-id');
    	var index = $(event.currentTarget).attr('data-index');
    	// // console.log('id',id);
    	if(location.pathname == '/ListOfSupplierSTM'){
    		FlowRouter.go("/ContactDetailsSTM/"+id+'-'+index);
    	}else if(location.pathname == '/ListOfSupplierSTL'){
    		FlowRouter.go("/SupplierOnboardingFormSTL/"+id+'-'+index);
    	}else{
    		FlowRouter.go("/ContactDetails/"+id+'-'+index);
    	}
    } 
    LocationAddressEdit(event){
    	var id = $(event.currentTarget).attr('id');
    	var locaationName = $(event.currentTarget).attr('data-Location');

    	var suppDetail = Suppliers.findOne({'_id':id});

    	if (suppDetail) {

    		var locationLength = suppDetail.locationDetails.length;
    		for (var i = 0; i < locationLength; i++) {
    			if(suppDetail.locationDetails[i].locationType == locaationName) {
    				if(location.pathname == '/ListOfSupplierSTM'){
    					FlowRouter.go("/LocationDetailsSTM/"+id+'-'+i);
    				// }else if(location.pathname == '/LocationDetailsSTL'){
    				// 	FlowRouter.go("/LocationDetails/"+id+'-'+i);
    				}else if(location.pathname == '/ListOfSupplierSTL'){
			    		FlowRouter.go("/SupplierOnboardingFormSTL/"+id+'-'+i);
			    	}else{
    					FlowRouter.go("/LocationDetails/"+id+'-'+i);
    				}
    				$(".addLocationForm").show();
    			}else{
    				// // console.log('locationDetails[i].locationType else:',suppDetail.locationDetails[i].locationType);

    			}
    		}
    	}
    }
    editBasicform(event){
    	var id = $(event.currentTarget).attr('data-id');
    	if(location.pathname == '/ListOfSupplierSTM'){
    		FlowRouter.go("/SupplierOnboardingFormSTM/"+id);
    	}else if(location.pathname == '/ListOfSupplierSTL'){
    		FlowRouter.go("/SupplierOnboardingFormSTL/"+id);
    	}else{
    		FlowRouter.go("/SupplierOnboardingForm/"+id);
    	}
    }
    showMore(event) {
		$('.listProduct').addClass('showList');
		$('.listProduct').removeClass('hide');
		this.setState({
			'loadless':true,
		})
	}
	showLess(event) {
		$('.listProduct').addClass('hide');
		$('.listProduct').removeClass('showList');
		this.setState({
			'loadless':false,
		})
	}
	render() {
       	return (	
		        <div>
		            <div className="row">	                   					  
					        <div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">					   
					        	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkinp boxshade">
					        			<img src={this.props.post.logo? this.props.post.logo:'/images/imgNotFound.jpg'} className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoImage"></img>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h4 className="titleprofile1 col-lg-6 col-md-6 col-sm-6 col-xs-6">{this.props.post.companyname}</h4>
						        			<div className="dots dropdown1 col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
							        			<div className="dropdown-content1 dropdown2-content2">
												
													<ul className="pdcls ulbtm">
														<li id={this.props.post._id} className="styleContactActbtn" data-index data-id={this.props.post._id} onClick={this.editBasicform.bind(this)} data-locationtype>	
													    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
													    </li>
													    {/*<li id className="styleContactActbtn" data-id>
													    	<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
													    </li>*/}
												    </ul>
												</div>
											</div>

						        			{/*<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-address-card-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-microchip" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>*/}
						        			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        				<li><i className="fa fa-address-card-o col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.props.post.pan}</li>
						        				<li><i className="fa fa-microchip col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.props.post.gstno}</li>
						        				<li><i className="fa fa-globe col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.props.post.website}</li>
						        			</ul>				        		
						        		</div>
						        		{/*<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 ellipsispd">
					        			<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
					        			</div>	*/}
					        	</div>

					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkinp boxshade">
					        		  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 producticon">
					        		  	<i className="fa fa-cube" aria-hidden="true"></i>
					        		  </div>
					        		  <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listprofile">
					        			<h4 className="titleproduct">Product/Services</h4>
					        			{/*<h5 className="subtitle">Product</h5>*/}
					        			{
					        				this.props.productserviceArr.map((data,index)=>{
					        					return(
								        			<div className="" key={index}>
								        			{
								        				index < 4 ?
								        				<div className="showList col-lg-6">
								        					{index+1})	{data}							
								        				</div>
								        				:
								        				null
								        			}
								        			{
								        				index > 4 ?
								        				<div className="showList hide listProduct col-lg-6" id="showMore">
								        					{index+1})	{data}							
								        				</div>
								        				:

								        				null
								        			}
								        			</div>
								        		
					        					);
					        				})
					        			}
								       </div>
					        			{/*<div className="col-lg-2 spanpd">
					        				2) Lorem ipsum							
					        			</div> 
					        			<div className="col-lg-2 spanpd">
					        				3) Lorem ipsum							
					        			</div>*/}

					        			{/*<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 ellipsispd">
						        			<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
						        		</div>*/}
									{this.props.productserviceArr && this.props.productserviceArr.length > 0 ?
										this.props.productserviceArr.length > 4 ?

						        		this.state.loadless == false?
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        		<div  className="show" onClick={this.showMore.bind(this)}>Show More<span className="showicon"><i className="fa fa-angle-down" aria-hidden="true"></i></span></div>
							        	</div>
							        	:
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        		<div  className="show" onClick={this.showLess.bind(this)}>Show Less<span className="showicon"><i className="fa fa-angle-up" aria-hidden="true"></i></span></div>
							        	</div>
										:
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
											<h5></h5>
										</div>
										:
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
							        		<h5>No Data Found</h5>
							        	</div>
						        	}
					        	</div>

					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls boxshade">
					        		{
										this.levelOneContact().map((contactArr,index)=>{
											return(
												<div key={index}>
													{contactArr.a}
													{contactArr.headOfficce}
												</div>
												);
										})
									}
									
					        	</div>
					        </div>
	                  	  </div>
	            </div>
	    );
	} 
}
export default EditListOfAllSupplier = withTracker((props)=>{
	const id         = props.id;
	const index 	 = props.name;
    const postHandle = Meteor.subscribe('supplierListByID',id);
    const post       = Suppliers.findOne({'_id':id})||{};
    const loading    = !postHandle.ready();
    const productserviceArr = [];
    if (post) {
    	if (post.productsServices) {
		    var postThree = post.productsServices.length;
		    for (var i = 0; i < postThree; i++) {
		    	var postValue = post.productsServices[i].product;
		    	var Not = 'NA'
		    	if(postValue){

		   		 	productserviceArr.push(postValue);
		    	}else{
		   		 	productserviceArr.push(Not);
		    	}
		    } 

    	}
    }
    return {
      loading,
      post,
      id,
      productserviceArr, 
      postThree, 
    };
}) (ListOfAllSupplier);