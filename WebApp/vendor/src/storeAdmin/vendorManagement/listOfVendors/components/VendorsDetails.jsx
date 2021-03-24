import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import {Route, withRouter}  from 'react-router-dom';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import '../css/ListOfVendors.css';
import '../css/ListOfVendorsFilter.css';
import '../css/ListOfAllVendors.css';

class VendorsDetails extends Component {
	
	constructor(props) {
      super(props);
    
      this.state = {
      	id : '',
      	vendorInfo : [],
        loadMore: false,
        loadless: false
      };
      // this.handleChange = this.handleChange.bind(this);
      this.isLoaded = false
    }
	componentDidMount(){
		console.log('nextProps',this.props);
		this.setState({
  			id : this.props.id
  		},()=>{

  			axios.get("/api/vendors/get/one/"+this.state.id)
            .then((response)=>{
          	
              this.setState({
                  vendorInfo : response.data
              },()=>{
              	
              	this.getLocations();
              	this.getContacts();
              });
            })
            .catch((error)=>{
                console.log('error', error);
            })
        })
		$("html,body").scrollTop(0);
  	}
  	componentWillReceiveProps(nextProps){
  		console.log('nextProps',nextProps.id);
  		this.setState({
  			id : nextProps.id
  		},()=>{

  			axios.get("/api/vendors/get/one/"+this.state.id)
            .then((response)=>{
          	
              this.setState({
                  vendorInfo : response.data
              },()=>{
              	
              	this.getLocations();
              	this.getContacts();
              });
            })
            .catch((error)=>{
                console.log('error', error);
            })
		//$("html,body").scrollTop(0);
  		})
  	}
  	getLocations(){
  		if(this.state.vendorInfo ){
  			console.log('kjdjkewj',this.state.vendorInfo.locationDetails)
  			var location = this.state.vendorInfo.locationDetails;
			
			this.setState({locations : location },()=>{
				for (var i = 0; i < this.state.locations.length; i++) {
					console.log(this.state.locations[i]);
				}		
			});
			
		}
  	}

  	getContacts(){
  		if(this.state.vendorInfo ){
  			var contacts = this.state.vendorInfo.contactDetails;
			
			this.setState({contacts : contacts },()=>{
				for (var i = 0; i < this.state.contacts.length; i++) {
					console.log(this.state.contacts[i]);
				}	
			});
			
		}
  	}
  	LocationEdit(event){
    	this.props.history.push('/location-details/'+this.props.id)
    }
    
    contactEdit(event){
    	this.props.history.push('/contact-details/'+this.props.id)
    }
	levelOneContact(props){
    	// var routerId   	 = this.props.id;
	    // var contactOne 	 = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
	    // var contactarray = [];
	    // var locationarr  = [];
	    // var uniqLocationarr  = [];
	   	// if (contactOne) {
		//     for (var i = 0; i < contactOne.contactDetails.length; i++) {
		//     	var Location = contactOne.contactDetails[i].Location;
		// 		var a =	<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead1">
		// 					<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 locationHeadingMargin">
		// 						<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
		// 							<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
		// 						</div>
		// 						<div className="col-lg-11 col-md-1 col-sm-12 col-xs-12">
		// 							<h4>Location Wise Contact Details</h4>
		// 						</div>
		// 					</div>
		// 					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		// 						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		// 							<div className="col-lg-6 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
		// 								<h5 className="locationName">{contactOne.contactDetails[i].Location}</h5>
		// 							</div>
		// 							<div className="dots dropdown1 col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
		// 								<i className="fa fa-ellipsis-h dropbtn2 locationdropbtn2" aria-hidden="true"></i>
		// 								<div className="dropdown-content1">
		// 									<ul className="pdcls ulbtm">
		// 										<li id={routerId} className="styleContactActbtn" onClick={this.LocationAddressEdit.bind(this)} data-Location={contactOne.contactDetails[i].Location}>	
		// 									    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
		// 									    </li>
		// 								    </ul>
		// 								</div>
		// 							</div>
		// 						</div>
		// 					</div>
		// 					<div  className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
		// 						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{contactOne.locationDetails[0].addressLineone} ,{contactOne.locationDetails[0].addressLinetwo}</div>
		// 						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{contactOne.locationDetails[0].city},{contactOne.locationDetails[0].states}, {contactOne.locationDetails[0].pincode}</div>
		// 					</div>
		// 				</div>;
		// 		contactarray.push({
		//     		'a'			  : a,
		//     	});
		//     	if (Location) {
				    
		// 		    let levelsArr = contactOne.contactDetails[i].LocationLevel;
		// 		    levelsArr = _.sortBy(levelsArr, 'ContactLevel');
		// 		    var arrow = 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 downarr">
		// 								<i className="fa fa-arrow-down" aria-hidden="true"></i>
		// 							</div>;
		//     		for (var j = 0; j <  levelsArr.length; j++) {
		//     			if (levelsArr[j].ContactLevel == 1) {
		//     				var bgColor = 'bglevel';

		//     			}else if (levelsArr[j].ContactLevel == 2) {
		//     				var bgColor = 'bglevel1';

		//     			}else if(levelsArr[j].ContactLevel == 3){
		//     				var bgColor = 'bglevel2';
		//     			}
		// 			   	var locationLevel =levelsArr[j].ContactLevel;
	    // 				var branchLevel = <div data={locationLevel} id={levelsArr[j].contact_id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	    // 							{ (j >=1) ? ((locationLevel > levelsArr[j-1].ContactLevel) ? arrow :  '') : ''}
		// 		    				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxul pdcls">
		// 								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls levelOneBox">
		// 								{/*<div className="col-lg-1 col-md-12 col-sm-12 col-xs-12 usericn pdcls">
		// 									<i className="fa fa-user-circle" aria-hidden="true"></i>
		// 								</div>*/}
		// 								<div className="col-lg-10 col-md-9 col-sm-12 col-xs-12 contactNameListFirst">
		// 									<ul className="col-lg-12 col-md-10 col-sm-10 col-xs-10 pdcls contactNameListSecond">
		// 									    <div className="nameContent col-lg-6 ">
		// 									    	<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 paddinf-left">
		// 										    	<i className="fa fa-user-o " aria-hidden="true"></i>
		// 										    </div>
		// 										    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 contactNameList">
		// 										    	{levelsArr[j].Name}
		// 										    </div>
		// 									    </div>
		// 									    <div className="nameContent col-lg-6 ">
		// 										    <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 no-Padding">
		// 										    	<i className="fa fa-envelope-o " aria-hidden="true"></i>
		// 										    </div>
		// 										    <div className="col-lg-10 col-md-11 col-sm-12 col-xs-12 no-Padding">
		// 										    	{levelsArr[j].Email}
		// 										    </div>
		// 									    </div>
		// 									</ul>
		// 									<ul className="col-lg-12 col-md-10 col-sm-10 col-xs-10 pdcls">
		// 										<div className="nameContent col-lg-6">
		// 										    <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 paddinf-left">
		// 										    	<i className="fa fa-address-card-o " aria-hidden="true"></i>
		// 										    </div>
		// 										    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
		// 										    	{levelsArr[j].Designation}
		// 										    </div>
		// 									    </div>
		// 									    <div className="nameContent col-lg-6 ">
		// 									    	<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 no-Padding">
		// 									    		<i className="fa fa-mobile  " aria-hidden="true"></i>
		// 									    	</div>
		// 									    	<div className="col-lg-10 col-md-11 col-sm-12 col-xs-12 no-Padding">
		// 									    		+91 {levelsArr[j].Phone}
		// 									    	</div>
		// 									    </div>
		// 									</ul>
		// 								</div>
		// 								<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 levelCss">
		// 									<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls "+ bgColor}>
		// 										<div className="dots dropdown1">
		// 											<i className="fa fa-ellipsis-h dropbtn1" aria-hidden="true"></i>
		// 										<div className="dropdown-content1">
												
		// 											<ul className="pdcls ulbtm">
		// 												<li id={levelsArr[j].contact_id} className="styleContactActbtn" data-index={i +"-"+ j} data-id={contactOne._id} data-locationtype={contactOne.contactDetails[i].Location} onClick={this.contactEdit.bind(this)}>	
		// 											    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
		// 											    </li>
		// 										    </ul>
		// 										</div>
		// 										</div>
		// 										<div className="level1 liheader3">
		// 										{
		// 											levelsArr[j].ContactLevel == 1 ? 'First level of contact' 
		// 												: 
		// 												levelsArr[j].ContactLevel == 2? 
		// 													'Second level of contact' 
		// 														: 'Third level of contact'}
		// 										</div>
		// 									</div>
		// 								</div>
		// 								</div>
		// 							</div>
									
		// 						</div>;
		// 						contactarray.push({
		//     						'headOfficce' : branchLevel
		//     					});
		//     		}//EOF loop
		    			
		//     	}//EOF haedoffice
		//     }
	    // }
		// return contactarray;
		return [];
    }
    
    LocationAddressEdit(event){
    	// var id = $(event.currentTarget).attr('id');
    	// var locaationName = $(event.currentTarget).attr('data-Location');

    	// var suppDetail = Suppliers.findOne({'_id':id});

    	// if (suppDetail) {

    	// 	var locationLength = suppDetail.locationDetails.length;
    	// 	for (var i = 0; i < locationLength; i++) {
    	// 		if(suppDetail.locationDetails[i].locationType == locaationName) {
    	// 			if(location.pathname == '/ListOfSupplierSTM'){
    	// 				FlowRouter.go("/LocationDetailsSTM/"+id+'-'+i);
    	// 			// }else if(location.pathname == '/LocationDetailsSTL'){
    	// 			// 	FlowRouter.go("/LocationDetails/"+id+'-'+i);
    	// 			}else if(location.pathname == '/ListOfSupplierSTL'){
		// 	    		FlowRouter.go("/SupplierOnboardingFormSTL/"+id+'-'+i);
		// 	    	}else{
    	// 				FlowRouter.go("/LocationDetails/"+id+'-'+i);
    	// 			}
    	// 			$(".addLocationForm").show();
    	// 		}else{
    	// 			// // console.log('locationDetails[i].locationType else:',suppDetail.locationDetails[i].locationType);

    	// 		}
    	// 	}
    	// }
    }
    editBasicform(event){
    	// var id = $(event.currentTarget).attr('data-id');
    	this.props.history.push('/vendor-onboarding/'+this.props.id)
    	// if(location.pathname == '/ListOfSupplierSTM'){
    	// 	FlowRouter.go("/SupplierOnboardingFormSTM/"+id);
    	// }else if(location.pathname == '/ListOfSupplierSTL'){
    	// 	FlowRouter.go("/SupplierOnboardingFormSTL/"+id);
    	// }else{
    	// 	FlowRouter.go("/SupplierOnboardingForm/"+id);
    	// }
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
	deleteVendor(event){
    	event.preventDefault();
    	axios.delete("/api/vendors/delete/"+this.props.id)
            .then((response)=>{
              swal({
                    title : response.data.message,
                  });
              window.location.reload();   
            })
            .catch((error)=>{
                console.log('error', error);
            })
        
    }
	render() {
		console.log('locations', this.state.locations);
       	return (	
		        <div>
		            <div className="row">	                   					  
					        <div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">					   
					        	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkinp boxshade">
					        			<img src={this.state.vendorInfo && this.state.vendorInfo.logo? this.state.vendorInfo.logo:'/images/imgNotFound.jpg'} className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoImage"></img>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h4 className="titleprofile1 col-lg-6 col-md-6 col-sm-6 col-xs-6">{this.state.vendorInfo && this.state.vendorInfo.companyname}</h4>
						        			<div className="dots dropdown1 col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
							        			<div className="dropdown-content1 dropdown2-content2">
												
													<ul className="pdcls ulbtm">
														<li id={this.state.vendorInfo ? this.props.id : ""} className="styleContactActbtn" data-index data-id={this.props.id} onClick={this.editBasicform.bind(this)} >	
													    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
													    </li>
													    <li id className="styleContactActbtn" data-id={this.props.id} onClick={this.deleteVendor.bind(this)}>
													    	<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
													    </li>
												    </ul>
												</div>
											</div>

						        			{/*<ul className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
						        				<li><i className="fa fa-address-card-o" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-microchip" aria-hidden="true"></i></li>
						        				<li><i className="fa fa-globe" aria-hidden="true"></i></li>
						        			</ul>*/}
						        			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        				<li title="PAN NO"><i className="fa fa-address-card-o col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.vendorInfo ? this.state.vendorInfo.pan : ""}</li>
						        				<li title="GST NO"><i className="fa fa-microchip col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.vendorInfo ? this.state.vendorInfo.gstno : ""}</li>
						        				<li title="Website"><i className="fa fa-globe col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.vendorInfo ? this.state.vendorInfo.website : ""}</li>
						        			</ul>				        		
						        		</div>
						        		{/*<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 ellipsispd">
					        			<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
					        			</div>	*/}
					        	</div>

					        	{
					        	this.state.locations && this.state.locations.length>0 &&
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade">
					        		{
										this.state.locations.map((locationArr,index)=>{
											return(

												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead1">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 locationHeadingMargin">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div className="dots dropdown1 col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
																<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
																<div className="dropdown-content1">
																	<ul className="pdcls ulbtm">
																		<li className="styleContactActbtn" onClick={this.LocationEdit.bind(this)}>	
																	    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
																	    </li>
																    </ul>
																</div>
															</div>
														</div>

														<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
															<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
														</div>
														<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
															<h4>Location Details</h4>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade" style={{heigth:'100px'}}>
														
														<div  className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{locationArr.addressLineone} ,{locationArr.addressLinetwo}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{locationArr.district},{locationArr.city}, {locationArr.area}, {locationArr.pincode}</div>
														</div>
													</div>
												</div>
												);
										})
									}
									
					        	</div>
					        	}
					        	{ /*contact Details*/ }
					        	{
					        		this.state.contacts && this.state.contacts.length>0 &&
					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade">
					        		{
										this.state.contacts.map((contactArr,index)=>{
											return(

												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead1">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 locationHeadingMargin">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div className="dots dropdown1 col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
																<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
																<div className="dropdown-content1">
																	<ul className="pdcls ulbtm">
																		<li className="styleContactActbtn" onClick={this.contactEdit.bind(this)}>	
																	    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
																	    </li>
																    </ul>
																</div>
															</div>
														</div>

														<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
															<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
														</div>
														<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
															<h4>Contact Details</h4>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade" style={{heigth:'100px'}}>
														
														<div  className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Mobile No. &nbsp;{contactArr.Phone}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Alt Mobile No. &nbsp;{contactArr.AltPhone}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Email: &nbsp; {contactArr.Email}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Office Landline No: &nbsp;{contactArr.Landing}</div>
															
														</div>
													</div>
												</div>
												);
										})
									}
									
					        	</div>
					        }
					        </div>
	                  	  </div>
	            </div>
	    );
	} 
}
export default withRouter(VendorsDetails); 


// = withTracker((props)=>{
// 	const id         = props.id;
// 	const index 	 = props.name;
//     const postHandle = Meteor.subscribe('supplierListByID',id);
//     const post       = Suppliers.findOne({'_id':id})||{};
//     const loading    = !postHandle.ready();
//     const productserviceArr = [];
//     if (post) {
//     	if (post.productsServices) {
// 		    var postThree = post.productsServices.length;
// 		    for (var i = 0; i < postThree; i++) {
// 		    	var postValue = post.productsServices[i].product;
// 		    	var Not = 'NA'
// 		    	if(postValue){

// 		   		 	productserviceArr.push(postValue);
// 		    	}else{
// 		   		 	productserviceArr.push(Not);
// 		    	}
// 		    } 

//     	}
//     }
//     return {
//       loading,
//       post,
//       id,
//       productserviceArr, 
//       postThree, 
//     };
// }) (ListOfAllSupplier);