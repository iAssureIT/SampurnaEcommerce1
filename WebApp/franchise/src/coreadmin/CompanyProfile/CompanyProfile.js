import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  		  from 'react-router-dom';
import swal                   from 'sweetalert';
import IAssureTable           from '../IAssureTable/IAssureTable.jsx';
import ReactToPdf             from 'react-to-pdf';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import './CompanyProfile.css';

class CompanyProfile extends Component {
	
	constructor(props) {
      super(props);
    
      this.state = {
      	id : '',
      	//entityInfo : {},
      	entityInfo:false,
        loadMoreLoc: false,
        loadMoreContacts: false,
        startRange :0,
        limitRange:10,
        tableHeading      : {
	        locationType     	: "Location Type",
	        addressLine1        : "Address",
	        GSTIN           	: "GSTIN",
	        GSTINDocument       : "GSTIN Document ",
	        PAN           		: "PAN",
	        PANDocument         : "PAN Document",
	    },
	    tableHeadingContact     : {
	        contactDetail     	: "Employee Details",
	        officelocation      : "Office Location",
	        department          : "Department",
	        designation         : "Designation",
	        approvingauthority  : "Approving Authority ID's",
	    },
	    tableObjects      : {
		    deleteMethod    : 'delete',
		    apiLink         : '/api/packagemaster/',
		    paginationApply : false,
		    searchApply     : false,
		    editUrl         : '/package-master'
		  },
      };
      this.isLoaded = false
    }
    componentWillReceiveProps(nextProps){
    	console.log("nextProps",nextProps)

    	this.setState({
  			id : nextProps.id
  		},()=>{

  			axios.get("/api/entitymaster/get/one/"+this.state.id)
            .then((response)=>{
          	
              this.setState({
                  entityInfo : response.data,
                  entityType : response.data.entityType
              },()=>{
              	
              	
              });
            })
            .catch((error)=>{
            })
  		})
    }
	componentDidMount(){
		var company_Id = this.props.match.params.orgId;
		this.getData(this.state.startRange,this.state.limitRange)
		this.getContactsTable(this.state.startRange,this.state.limitRange)
				
		axios.get("/api/entitymaster/get/appCompany")
	      .then((response) => {
	        this.setState({
	          entityList   : response.data,
	          entityID     : response.data[0]._id
	        },()=>{
	          console.log("entityID",this.state.entityID,this.state.entityList)
	           if (this.state.entityList.length > 0 && this.state.entityList[0].entityType === "appCompany")
	           {
	           	axios.get("/api/entitymaster/get/one/"+this.state.entityID)
				.then((response) => {
					this.setState({
						corporateInfo   : response.data
					},()=>{
						console.log("corporateInfo",this.state.corporateInfo);
						this.getLocations();
	  					this.getContacts();
	            		//this.props.history.push('/appCompany/basic-details/' + this.state.entityID);
					})

				})
				.catch((error) => {
				})

	           }else{
	            		this.props.history.push('/appCompany/basic-details');
	           }
	        })
	       })
	      .catch((error) => {
	      })



  	}
  	getLocations(){
  		if(this.state.corporateInfo ){
  			
  			var location = this.state.corporateInfo.locations;
			if(location)
			{
				this.setState({locations : location },()=>{
					for (var i = 0; i < this.state.locations.length; i++) {
					}		
				},()=>{
					console.log("locations",this.state.locations);
				});
				
			}
		}
  	}
  	getContacts(){
  		if(this.state.corporateInfo ){
  			
  			var contacts = this.state.corporateInfo.contactPersons;
			if(contacts)
			{
				this.setState({contacts : contacts },()=>{
					for (var i = 0; i < this.state.contacts.length; i++) {
					}		
				},()=>{
					console.log("contacta",this.state.contacts);
				});
				
			}
		}
  	}
  	getContactsTable(startRange,limitRange){
		var formValue = {
	      startRange: startRange,
	      limitRange: limitRange
	    }
	    if(this.state.corporateInfo ){
  			var contacts = this.state.corporateInfo.contactPersons;
			if(contacts)
			{
			 var tableData = contacts.map((a, i)=>{
	          return {
	            _id             	: a._id,
	            contactDetail     	: a.firstName + " " + a.lastName+ " ("+a.employeeID+")" + " | " +a.email + " | "+a.phone,
	            officelocation      : a.branchName ? a.branchName : " - " ,
	            department      	: a.departmentName ? a.departmentName :" - ",
	            designation     	: a.designationName ? a.designationName :" - ",
	            approvingauthority  : a.bookingApprovalRequired == "Yes" ? a.approvingAuthorityId1 + " | " +a.approvingAuthorityId2 + " | " +a.approvingAuthorityId3 :" - ",
	          }
	        })
	        this.setState({
	          tableDataContact: tableData
	        })
	        console.log(this.state.tableDataContact)
				
				
			}
		}
  	}
  	getData(startRange, limitRange) {
	    var formValue = {
	      startRange: startRange,
	      limitRange: limitRange
	    }
	    if(this.state.corporateInfo ){
  			var location = this.state.corporateInfo.locations;
			if(location)
			{
			 var tableData = location.map((a, i)=>{
	          return {
	            _id             	: a._id,
	            locationType     	: a.locationType,
	            addressLine1        : a.addressLine2+ " " + a.addressLine1 ,
	            GSTIN      			: a.GSTIN ? a.GSTIN :" - ",
	            GSTINDocument      	: a.GSTDocument.length>0 ? a.GSTDocument.map((image,i)=>{return '<img src='+image+' class="img-responsive imgtabCP logoStyle" />'}) :" No Image Found ",
	            PAN     			: a.PAN ? a.PAN :" - ",
	            PANDocument     	: a.PANDocument.length>0 ? a.PANDocument.map((image,i)=>{return '<img src='+image+' class="img-responsive imgtabCP logoStyle" />'}) :" No Image Found ",
	          }
	        })
	        this.setState({
	          tableData: tableData
	        })
	        console.log(this.state.tableData)
				
				
			}
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
    	this.props.history.push("/"+this.state.corporateInfo.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
    }
    deleteEntity(event){
		event.preventDefault();
		console.log(event.currentTarget.getAttribute('data-id'))
		this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
		$('#deleteEntityModal').show();
    }
    confirmDelete(event){
    	event.preventDefault();
    	axios.delete("/api/entitymaster/delete/"+this.state.deleteID)
            .then((response)=>{
           		console.log(response.data.deleted) 
           		if (response.data.deleted) {
           			swal({
	                    text : this.state.entityType +" is deleted successfully.",
	                  });
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
    changeStatus(event){
    	event.preventDefault();
    	var entityID = localStorage.getItem("company_Id");

    	var formValues={
    		entityID : entityID,
    		status   : "Accepted by corporateadmin"
    	}
    	console.log("formValues",formValues);
    	axios.patch("/api/entitymaster/patch/profileStatus",formValues)
            .then((response)=>{
          	
              this.setState({
                  entityInfo : response.data,
              },()=>{
              	console.log("entityInfo",this.state.entityInfo);
              	swal("Profile Approved");
    			this.props.history.push("/dashboard");
              	
              });
        })
        .catch((error)=>{
        	console.log("error",error);
        })

    }
    printPrfile(event){
    	window.print();  
    }

	render() {
		const ref = React.createRef();


       	return (	
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">					   
		        {
		        	this.state.corporateInfo ?
		        
		    			<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
		    				<div>
						    {/*<div style={{width: 500, height: 500, background: 'blue'}} ref={ref}/>*/}
						    </div>
						    <div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " ref={ref}>					   
						       	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshadeOP ">					   
							       	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">					   
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails noPadding" data-child={this.state.corporateInfo._id} id={this.state.corporateInfo._id}>
											<div className="col-lg-1 col-lg-offset-11 noPadding">
												<div id={this.state.corporateInfo._id} className="btn customBtnCP col-lg-5" data-index data-id={this.state.corporateInfo._id} onClick={this.editBasicform.bind(this)}>	
											    	<i className="fa fa-pencil" title="Edit profile" aria-hidden="true" ></i>
											    </div>
											     <div className="" >	
												    <ReactToPdf targetRef={ref} filename="div-blue.pdf">
												        {({toPdf}) => (
												            <div className="btn customBtnCP col-lg-5" onClick={toPdf}><i className="fa fa-download" title="Print profile" aria-hidden="true" ></i></div>
												        )}
												    </ReactToPdf>
											    	
											    </div>
										    </div>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrgListTitle">
												<label>Basic Information</label>
											</div>
											<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
												<img src={this.state.corporateInfo.companyLogo && this.state.corporateInfo.companyLogo.length > 0?this.state.corporateInfo.companyLogo[0]:"/images/noImagePreview.png"} className="supplierLogoImage"></img>
											</div>
											<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
												<h5 className="titleprofileList">{this.state.corporateInfo.companyName}</h5>
														
												{/*<div className="dots dropdown1 col-lg-12 col-md-6 col-sm-6 col-xs-6">
								        			<div className="dropdown-content1 dropdown2-content2">
													</div>
												</div>*/}

												<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
													<li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;{this.state.corporateInfo.groupName}</li>
													<li><i className="fa fa-globe " aria-hidden="true"></i>&nbsp;{this.state.corporateInfo.website}</li>
													<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;{this.state.corporateInfo.companyEmail}</li>
													<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;{this.state.corporateInfo.companyPhone}</li>
												</ul>
												<div className="customPadding">
													{
								        				this.state.corporateInfo.COI && this.state.corporateInfo.COI.length>0 ? 
								        				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
															<label className="labelformCP col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding"> COI Documents :</label>
														</div>
								        				: null
								        			} 
								        			<div className="noPadding">
								        			{   this.state.corporateInfo.COI ?
								        				this.state.corporateInfo.COI.map((doc,ind)=>{
								        					return (
								        					<div key={ind} className=" col-lg-2 col-md-4 col-sm-6 col-xs-12">
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
								        				:
								        				null
								        			}
								        			</div>
							        			</div>
											</div>
										</div>
							        	{
							        	this.state.locations && this.state.locations.length>0 &&
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
								        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrgListTitle">
													<label>Location Details</label>
											</div>
											<IAssureTable
				                                tableHeading={this.state.tableHeading}
				                                tableData={this.state.tableData}
				                                tableObjects={this.state.tableObjects}

				                                getData={this.getData.bind(this)}
				                              />
							        	</div>
							        	}
							        	<br/>
							        	{
							        	this.state.contacts && this.state.contacts.length>0 &&
							        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop50 noPadding">
							        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrgListTitle">
													<label>Contact Details</label>
											</div>
							        		<IAssureTable
				                                tableHeading={this.state.tableHeadingContact}
				                                tableData={this.state.tableDataContact}
				                                tableObjects={this.state.tableObjects}
				                                getData={this.getContactsTable.bind(this)}
				                              />

										
							        	
							        	</div>
							            }						        
				                  	</div>
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

			            :
			            <div className="loadingImg">
			            	<img src="/images/loader.gif"/>
			            </div>
	            }

		           
	            </div>
	            
	    );
	} 
}
export default withRouter(CompanyProfile); 
