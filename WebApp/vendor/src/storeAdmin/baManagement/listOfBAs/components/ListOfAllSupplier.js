import React, { Component } from 'react';
import { render } 			from 'react-dom';
import $ 					from 'jquery';
import axios                from 'axios'; 
import {Route, withRouter}  from 'react-router-dom';
import ListOfSupplier       from '../css/ListOfSupplier.css';
import swal  				from 'sweetalert';

class ListOfAllSupplier extends Component {
	
	constructor(props) {
      super(props);
    
      this.state = {
        loadMore: false,
        loadless: false,
        baInfo : [],
        locations : [],
        contacts : []
      };
      // this.handleChange = this.handleChange.bind(this);
      this.isLoaded = false
    }
	componentDidMount(){
		console.log('props',this.props.BaId);
		this.setState({
  			BaId : this.props.BaId
  		},()=>{
		axios.get("/api/businessassociates/get/one/"+this.state.BaId)
            .then((response)=>{
          	
              this.setState({
                  baInfo : response.data
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
  	componentWillReceiveProps(nextProps){
  		this.setState({
  			BaId : nextProps.BaId
  		},()=>{
  			console.log('WillReceiveProps',this.state.BaId);

  			axios.get("/api/businessassociates/get/one/"+this.state.BaId)
            .then((response)=>{
          	
              this.setState({
                  baInfo : response.data
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
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

  	getLocations(){
  		if(this.state.baInfo.length ){
  			var location = this.state.baInfo[0].locationDetails;
			
			this.setState({locations : location });
			for (var i = 0; i < this.state.locations.length; i++) {
				console.log(this.state.locations[i]);
			}	
		}
  	}

  	getContacts(){
  		if(this.state.baInfo.length ){
  			var contacts = this.state.baInfo[0].contactDetails;
			
			this.setState({contacts : contacts });
			for (var i = 0; i < this.state.contacts.length; i++) {
				console.log(this.state.contacts[i]);
			}	
		}
  	}

	levelOneContact(props){
		
		

    	var routerId   	 = this.props.id;
	    var contactOne 	 = '';
	    var contactarray = [];
	    var locationarr  = [];
	    var uniqLocationarr  = [];


	   	if (contactOne) {
		    for (var i = 0; i < contactOne.contactDetails.length; i++) {
		    	var Location = contactOne.contactDetails[i].Location;
		    	
		    
		    	if (Location) {
				    
				    let levelsArr = contactOne.contactDetails[i].LocationLevel;
				    levelsArr = [];
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
    	
    } 
    LocationEdit(event){
    	this.props.history.push('/BA/locationDetails/1/'+this.props.BaId)
    }
    
    contactEdit(event){
    	this.props.history.push('/BA/contactDetails/1/'+this.props.BaId)
    }
    LocationAddressEdit(event){
    	var id = $(event.currentTarget).attr('id');
    	var locaationName = $(event.currentTarget).attr('data-Location');

    	var suppDetail = [];

    	if (suppDetail) {

    		var locationLength = suppDetail.locationDetails.length;
    		for (var i = 0; i < locationLength; i++) {
    			if(suppDetail.locationDetails[i].locationType == locaationName) {
    				
    				$(".addLocationForm").show();
    			}else{
    				// // console.log('locationDetails[i].locationType else:',suppDetail.locationDetails[i].locationType);

    			}
    		}
    	}
    }
    editBasicform(event){ 
    
    	this.props.history.push('/editBA/'+this.props.BaId)
    	
    }
    deleteBA(event){
    	event.preventDefault();
    	axios.delete("/api/businessassociates/delete/"+this.props.BaId)
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
					        			<img src={this.state.baInfo[0] && this.state.baInfo[0].logo  ? this.state.baInfo[0].logo : "images/noimage.png"} className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoImage"></img>
						        		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
						        			<h4 className="titleprofile1 col-lg-6 col-md-6 col-sm-6 col-xs-6">{this.state.baInfo[0] && this.state.baInfo[0].companyName}</h4>
						        			<div className="dots dropdown1 col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
							        			<div className="dropdown-content1 dropdown2-content2">
							
													<ul className="pdcls ulbtm">
														<li className="styleContactActbtn"  onClick={this.editBasicform.bind(this)} >	
													    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
													    </li>
													    <li id className="styleContactActbtn"  onClick={this.deleteBA.bind(this)}>
													    	<a><i className="fa fa-trash-o" aria-hidden="true"  ></i>&nbsp;Delete</a>
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
						        				<li><i className="fa fa-address-card-o col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.baInfo[0] && this.state.baInfo[0].pan}</li>
						        				<li><i className="fa fa-microchip col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.baInfo[0] && this.state.baInfo[0].gstno}</li>
						        				<li><i className="fa fa-globe col-lg-1 noPadding" aria-hidden="true"></i>&nbsp;{this.state.baInfo[0] && this.state.baInfo[0].website}</li>
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
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">{locationArr.addressLine1} ,{locationArr.addressLine2}</div>
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
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Mobile No. &nbsp;{contactArr.mobileNo}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Alt Mobile No. &nbsp;{contactArr.altMobileno}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Email: &nbsp; {contactArr.email}</div>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">Office Landline No: &nbsp;{contactArr.officeLandlineNo}</div>
															
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
export default withRouter(ListOfAllSupplier);