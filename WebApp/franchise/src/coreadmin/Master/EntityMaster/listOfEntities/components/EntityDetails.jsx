import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  from 'react-router-dom';
import swal                   from 'sweetalert';

import 'bootstrap/js/tab.js';
import '../css/ListOfEntity.css';
import '../css/ListOfEntityFilter.css';
import '../css/ListOfAllEntity.css';

class VendorsDetails extends Component {
	
	constructor(props) {
      super(props);
    
      this.state = {
      	id : '',

      	//entityInfo : {},
        loadMoreLoc: false,
        loadMoreContacts: false
      };
      // this.handleChange = this.handleChange.bind(this);
      this.isLoaded = false
    }
    componentWillReceiveProps(nextProps){
    			$("html,body").scrollTop(0);

    	this.setState({
  			id : nextProps.id
  		},()=>{

  			axios.get("/api/entitymaster/get/one/"+this.state.id)
            .then((response)=>{

          	
              this.setState({
                  entityInfo : response.data,
                  entityType : response.data.entityType
              },()=>{
              	
              	this.getLocations();
              	this.getContacts();
              });
            })
            .catch((error)=>{
            })
  		})
    }
	componentDidMount(){
		$("html,body").scrollTop(0);

		this.setState({
  			id : this.props.id
  		},()=>{

  			axios.get("/api/entitymaster/get/one/"+this.state.id)
            .then((response)=>{
              this.setState({
                  entityInfo : response.data,
                  entityType : response.data.entityType
              },()=>{
              	
              	this.getLocations();
              	this.getContacts();
              });
            })
            .catch((error)=>{
            })
  		})
  	}
  	
  	getLocations(){
  		if(this.state.entityInfo ){
  			
  			var location = this.state.entityInfo.locations.reverse();
			
			this.setState({locations : location },()=>{
				for (var i = 0; i < this.state.locations.length; i++) {
				}		
			});
			
		}
  	}

  	getContacts(){
  		if(this.state.entityInfo ){

  			var contacts = this.state.entityInfo.contactPersons.reverse();
			this.setState({contacts : contacts },()=>{
				for (var i = 0; i < this.state.contacts.length; i++) {
					
				}	
			});
			
		}
  	}
  	LocationEdit(event){
    	this.props.history.push("/"+this.state.entityType+'/location-details/'+event.currentTarget.getAttribute('data-entityID'))
    	
    }
    
    contactEdit(event){
    	this.props.history.push("/"+this.state.entityType+'/contact-details/'+event.currentTarget.getAttribute('data-entityID'))
    }

    showMore(event) { 
		// $('.listProduct').addClass('showList');
		// $('.listProduct').removeClass('hide');
		this.setState({
			'loadMoreLoc':true,
		})
	}
	showMoreContacts(event){
		this.setState({
			'loadMoreContacts':true,
		})
	}
	showLess(event) {
		// $('.listProduct').addClass('hide');
		// $('.listProduct').removeClass('showList');
		this.setState({
			'loadMoreLoc':false,
		})
	}
	showLessContacts(event) {
		this.setState({
			'loadMoreContacts':false,
		})
	}
	editBasicform(event){
    	this.props.history.push("/"+this.state.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
    }
    deleteEntity(event){
		event.preventDefault();
		this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
		$('#deleteEntityModal').show();
    }
    confirmDelete(event){
    	event.preventDefault();
    	axios.delete("/api/entitymaster/delete/"+this.state.deleteID)
            .then((response)=>{
           		if (response.data.deleted) {
					
           			swal({
	                    text : (this.state.entityType === "appCompany" ? "Organizational Settings" :this.state.entityType) +" is deleted successfully.",
					  });
					  $(".swal-text").css("text-transform", "capitalize");
           		}	else{
           			swal({
	                    text : "Failed to delete.",
	                  });
           		}
              this.props.getEntities();
              this.props.hideForm();
              $('#deleteEntityModal').hide();   

            })
            .catch((error)=>{
            })
    }
    closeModal(event){
    	event.preventDefault();
    	$('#deleteEntityModal').hide(); 
    }
	render() {
       	return (	
       			this.state.entityInfo ? 

		        <div>
		            <div className="row">	                   					  
					        <div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade">					   
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails" data-child={this.state.entityInfo._id} id={this.state.entityInfo._id}>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
									  <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
										<button type="button" className="reset">
											 Company ID &nbsp; :&nbsp;&nbsp; {this.state.entityInfo.companyID} 
										</button>
									</div>
									</div>
									<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
										<img src={this.state.entityInfo.companyLogo.length > 0?this.state.entityInfo.companyLogo[0]:"/images/noImagePreview.png"} 
												 className="supplierLogoImage" 
												 alt="companyLogo"
										/>
									</div>
									<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
										<h5 className="titleprofileList">{this.state.entityInfo.companyName}</h5>
										<div className="dots dropdown1 col-lg-12 col-md-6 col-sm-6 col-xs-6">
											<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
						        			<div className="dropdown-content1 dropdown2-content2">
												<ul className="pdcls ulbtm">
													<li id={this.state.entityInfo._id} className="styleContactActbtn" data-index data-id={this.state.entityInfo._id} onClick={this.editBasicform.bind(this)}>	
												    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
												    </li>
												    <li id className="styleContactActbtn" data-id={this.state.entityInfo._id} onClick={this.deleteEntity.bind(this)}>
												    	<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
												    </li>
											    </ul>
											</div>
										</div>
										<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
											<li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;{this.state.entityInfo.groupName}</li>
											<li><i className="fa fa-globe " aria-hidden="true"></i>&nbsp;{this.state.entityInfo.website}</li>
											<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;{this.state.entityInfo.companyEmail}</li>
											<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;{this.state.entityInfo.companyPhone}</li>
										</ul>

										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 docsAlign">
										{
					        				this.state.entityInfo.COI.length>0 ? 
					        				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12"> COI Document</label>
											</div>
					        				: null
					        			}
					        			{
					        				this.state.entityInfo.COI.map((doc,ind)=>{
					        					return (
					        						<div key={ind} className=" col-lg-4 col-md-4 col-sm-6 col-xs-12">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
															  {
															  (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
	                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="LogoImageUpOne">
	                                                              <a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
	                                                          </div>
	                                                          :
	                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																<a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
															 </div>
	                                                         }
														</div>
													</div>
					        					);
					        				})
					        			}
					        			</div>

									</div>
								</div>
					        	{
					        	this.state.locations && this.state.locations.length>0 &&
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationMainContainer">
					        		<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
										<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
									</div>
									<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
										<h4>Location Details</h4>
										<h5 class="locationHeading">List of Locations</h5>
									</div>
									<div className="dots dropdown1 col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
										<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 removeTop" aria-hidden="true"></i>
										<div className="dropdown-content2">
											<ul className="pdcls ulbtm">
												<li className="styleContactActbtn" onClick={this.LocationEdit.bind(this)} data-entityID={this.state.entityInfo._id} /*data-locationID={locationArr._id}*/>	
											    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
											    </li>
										    </ul>
										</div>
									</div>
					        		{
										this.state.locations.map((locationArr,index)=>{
											return(
												<div>												
												{ this.state.loadMoreLoc ? 
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding" key={index}>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{heigth:'100px'}}>
															<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationUL">
										        				<li title="address"><b>{locationArr.district}</b></li>
										        				<li title="address"> {locationArr.locationType},</li>
										        				<li title="address">#&nbsp;{locationArr.addressLine1 + ", "+ locationArr.addressLine2} ,</li>
										        				<li title="address">&nbsp; {locationArr.area ? locationArr.area + ", " : locationArr.area} {locationArr.city + ", "+ locationArr.district},</li>
										        				<li title="address">&nbsp;{ locationArr.state+", "+  locationArr.country},</li>
										        				<li title="address">&nbsp;{ locationArr.pincode}</li>
										        				{ locationArr.GSTIN ?
										        					<li title="GSTIN Number">&nbsp;GSTIN &nbsp; : &nbsp;{ locationArr.GSTIN}</li>
										        					:null
										        				}
										        				{/*<li title="GSTIN Number">&nbsp;GSTIN Number &nbsp; : &nbsp;{ locationArr.GSTIN}</li>*/}
										        				<li title="PAN Number">&nbsp;PAN &nbsp; : &nbsp;{ locationArr.PAN}</li>

										        			</ul>
										        			
										        			{
										        				locationArr.GSTDocument.length>0 ? 
										        				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN Document</label>
																</div>
										        				: null
										        			}
										        			
										        			{
										        				locationArr.GSTDocument.map((doc,ind)=>{
										        					return (
										        						<div key={ind} className=" col-lg-3 col-md-3 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																				{
						                                                          (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
						                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="LogoImageUpOne">
	                                                              					<a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
						                                                          </div>
						                                                          :
						                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																					<a href={doc} target="_blank"  className="imageOuterContainer" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																				 </div>
						                                                         }

																			</div>
																		</div>
										        					);
										        				})
										        			}
										        			{
										        				locationArr.PANDocument.length>0	? 	
											        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN Document</label>
																</div> : null
															}
															{
										        				locationArr.PANDocument.map((doc,ind)=>{
										        					return (
										        						<div key={ind} className=" col-lg-3 col-md-3 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																				{
						                                                          (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
						                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
	                                                              					<a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
						                                                          </div>
						                                                          :
						                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																					 <a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																				 </div>
						                                                         }
																			</div>
																		</div>
										        					);
										        				})
										        			}		
															</div>
														</div>
												</div>
												:
													index === 0 ?
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding" key={index}>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{heigth:'100px'}}>
															<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationUL">
										        				<li title="address"><b>{locationArr.district}</b></li>
										        				<li title="address"> {locationArr.locationType},</li>
										        				<li title="address">#&nbsp;{locationArr.addressLine1 + " "+ locationArr.addressLine2},</li>
										        				<li title="address">&nbsp; {locationArr.area ? locationArr.area + ", " : locationArr.area} {locationArr.city + ", "+ locationArr.district},</li>
										        				<li title="address">&nbsp;{ locationArr.state+", "+  locationArr.country},</li>
										        				<li title="address">&nbsp;{ locationArr.pincode}</li>
										        				{ locationArr.GSTIN ?
										        					<li title="GSTIN Number">&nbsp;GSTIN &nbsp; : &nbsp;{ locationArr.GSTIN}</li>
										        					:null
										        				}
										        				{ locationArr.PAN ?
										        					<li title="PAN Number">&nbsp;PAN &nbsp; : &nbsp;{ locationArr.PAN}</li>
										        					:null
										        				}
										        				
										        			</ul>
										        			{
										        				locationArr.GSTDocument.length > 0 ? 
										        				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN Document</label>
																</div>
																: null
										        			}	
										        			
										        			{
										        				locationArr.GSTDocument.map((doc,ind)=>{
										        					return (
										        						<div key={ind} className=" col-lg-3 col-md-3 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																				{
						                                                          (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
						                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
	                                                              						<a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
						                                                          </div>
						                                                          :
						                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																					<a href={doc} target="_blank"  className="imageOuterContainer" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																				 </div>
						                                                         }
																			</div>
																		</div>
										        					);
										        				})
										        			}
										        			{
										        				locationArr.PANDocument.length>0 ? 
											        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN Document</label>
																</div> : null
															}

															{
										        				locationArr.PANDocument.map((doc,ind)=>{
										        					return (
										        						<div key={ind} className=" col-lg-3 col-md-3 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																				
																				{
						                                                          (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
						                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
	                                                             					 <a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
						                                                          </div>
						                                                          :
						                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																					<a href={doc} target="_blank" className="imageOuterContainer" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																				 </div>
						                                                         }
																			</div>
																		</div>
										        					);
										        				})
										        			}
															</div>
														</div>
														{
															this.state.locations.length > 1?
															<div className="col-lg-12 textAlignCenter showMoreLess" onClick={this.showMore.bind(this)}>
																<label>Show More</label>
															</div>
															:
															null
														}
													</div>													

													:
														null
												}
												</div>
												);
										})										
										
									}
									{
										this.state.loadMoreLoc ? 
										<div className="col-lg-12 textAlignCenter showMoreLess" onClick={this.showLess.bind(this)}>
											<label>Show Less</label>
										</div> : null
									}
					        	</div>
					        	}
					        	<br/>
					        	{ /*contact Details*/ }
					        	{
					        		this.state.entityInfo.contactPersons && this.state.entityInfo.contactPersons.length>0 ?
					        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationMainContainer marginTop50">
					        		<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
										<i className="fa fa-address-book contactIcon" aria-hidden="true"></i>
									</div>
									<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
										<h4>Contact Details</h4>
									</div>
									<div className="dots dropdown1 col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right locationDropdown">
										<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 removeTop" aria-hidden="true"></i>
										<div className="dropdown-content2">
											<ul className="pdcls ulbtm">
												<li className="styleContactActbtn" onClick={this.contactEdit.bind(this)} data-entityID={this.state.entityInfo._id} /*data-locationID={contact._id}*/>	
											    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
											    </li>
										    </ul>
										</div>
									</div>
					        		{this.state.contacts && this.state.contacts.length>0?
										this.state.contacts.map((contact,index)=>{
											return(
												<div>
												{ this.state.loadMoreContacts ? 
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{heigth:'100px'}}>
															<div  className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
																<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationUL">
											        				{/* <li title="Department"><b>{contact.department}</b></li> */}
											        				<li title="Contact Person">{contact.firstName+" "+contact.lastName}</li>
																	<li>{"Mobile : "+contact.phone}</li>
											        				<li>{"Email Id  : "+contact.email}</li>
											        				<li>{"Branch Code : "+contact.branchCode}</li>
											        				{
											        					contact.bookingApprovalRequired === 'Yes'?
																		<li>Booking Approval Required: Yes</li>	
																	:
																	null
																	}
											        				{
											        					contact.approvingAuthorityId1 ?
											        					<li>Approving Authority Employee ID : {contact.approvingAuthorityId1}</li>
											        					:
											        					null
											        				}
											        				{
											        					contact.preApprovedParameterValue ?
											        					<li>{contact.preApprovedParameter === "Amount" ?
											        							<span> {contact.preApprovedParameter} &nbsp;: &nbsp;&#8377; {contact.preApprovedParameterValue}</span>
											        						:
											        							<span> {contact.preApprovedParameter} &nbsp;: &nbsp; {contact.preApprovedParameterValue}</span>
											        							
											        						}
											        					</li>
											        					:
											        					null
											        				}										        				
											        				
											        			</ul>	
															</div>
														</div>
													</div> 
													:
													index === 0 ?
														<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{heigth:'100px'}}>
															<div  className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 locationAddress">
																<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationUL">
											        				{/* <li title="Department"><b>{contact.department}</b></li> */}
											        				<li title="Contact Person">{contact.firstName+" "+contact.lastName}</li>
																	<li>{"Mobile : "+contact.phone}</li>
											        				<li>{"Email Id  : "+contact.email}</li>
											        				<li>{"Branch Code : "+contact.branchCode}</li>
											        				{
											        					contact.bookingApprovalRequired === 'Yes'?
																		<li>Booking Approval Required: Yes</li>	
																	:
																	null
																	}
											        				{
											        					contact.approvingAuthorityId1 ?
											        					<li>Approving Authority Employee ID : {contact.approvingAuthorityId1}</li>
											        					:
											        					null
											        				}
											        				{
											        					contact.preApprovedParameterValue ?
											        					<li>{contact.preApprovedParameter === "Amount" ?
											        							<span> {contact.preApprovedParameter} &nbsp;: &nbsp;&#8377; {contact.preApprovedParameterValue}</span>
											        						:
											        							<span> {contact.preApprovedParameter} &nbsp;: &nbsp; {contact.preApprovedParameterValue}</span>
											        							
											        						}
											        					</li>
											        					:
											        					null
											        				}										        				
											        				
											        			</ul>	
															</div>
														</div>
														{
															this.state.contacts.length > 1?
															<div className="col-lg-12 textAlignCenter showMoreLess" onClick={this.showMoreContacts.bind(this)}>
																<label>Show More</label>
															</div>
															:
															null
														}
													</div>
														
														:
														null
												}
												
												</div>
											);
										})	
										:
										 null
																			
									}									

									{
										this.state.loadMoreContacts ? 
										<div className="col-lg-12 textAlignCenter showMoreLess" onClick={this.showLessContacts.bind(this)}>
											<label>Show Less</label>
										</div> : null
									}
					        	</div>	
					        	:null		            
					        }
					        
					        </div>
	                  	  </div>
	                  	
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
	            : null
	    );
	} 
}
export default withRouter(VendorsDetails); 
