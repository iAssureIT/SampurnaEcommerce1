import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import moment from 'moment';
class PersonDetails extends Component {

	constructor(props) {
		super(props);

		this.state = {
			id: '',
			loadMore: false,
			loadless: false
		};
		// this.handleChange = this.handleChange.bind(this);
		this.isLoaded = false
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.id
		}, () => {
			axios.get("/api/personmaster/get/one/" + this.state.id)
				.then((response) => {
					this.setState({
						personInfo: response.data,
						type: response.data.type
					}, () => {

						this.getAddress();
						this.getDocDetails();
					});
				})
				.catch((error) => {
				})
		})
	}
	getData() {

	}
	componentDidMount() {

		this.setState({
			id: this.props.id
		}, () => {

			axios.get('/api/personmaster/get/one/' + this.state.id)
				.then((response) => {
					this.setState({
						personInfo: response.data,
						type: response.data.type
					}, () => {
						this.getAddress();
						this.getDocDetails();
					});
				})
				.catch((error) => {
				})
		})
	}
	getAddress() {
		if (this.state.personInfo && this.state.personInfo.address) {
			this.setState({ address: this.state.personInfo.address })
		}
	}
	getDocDetails() {
		if (this.state.personInfo && this.state.personInfo.Documentarray) {
			this.setState({ Documentarray: this.state.personInfo.Documentarray })
		}
	}

	LocationEdit(event) {
		this.props.history.push("/" + this.state.type + '/' + event.currentTarget.getAttribute('data-locationID'))

	}


	showMore(event) {
		$('.listProduct').addClass('showList');
		$('.listProduct').removeClass('hide');
		this.setState({
			'loadless': true,
		})
	}
	showLess(event) {
		$('.listProduct').addClass('hide');
		$('.listProduct').removeClass('showList');
		this.setState({
			'loadless': false,
		})
	}
	editBasicform(event) {
		this.props.history.push("/" + this.props.type + '/master/' + event.currentTarget.getAttribute('data-id'))
	}

	deleteEntity(event) {
		event.preventDefault();
		this.setState({ deleteID: event.currentTarget.getAttribute('data-id') })
		//for deletedStatus of DRIVER only--------------------------
		if (this.props.type === "driver") {
			$('#deleteStatusOfDriverModal').show();
		} else {
			//for deleting entity directly
			$('#deleteModal').show();
		}
	}
	confirmDelete(event) {
		var username = this.state.username
		event.preventDefault();
		axios.get("/api/personmaster/get/one/" + this.state.deleteID)
			.then((response) => {
				this.setState({
					"personID_tobedeleted": response.data.userId,
					"username": response.data.firstName + " " + response.data.lastName,
				}, () => {
					var formValues = {
						personID_tobedeleted: this.state.deleteID,
						updatedBy: username,
					}
					//  axios.patch("/api/personmaster/patch/changeStatus",formValues)
					axios.patch("/api/personmaster/patch/deletestatus", formValues)
						.then((response) => {
							var formValues = {
								user_id_tobedeleted: this.state.personID_tobedeleted,
								username: this.state.username,
							}
							axios
								.patch('/api/users/patch/deletestatus/', formValues)
								.then((response) => {
									// this.props.getPersons();
									window.location.reload();
									this.props.hideForm();
									$('#deleteVehicleModal').hide();
								})
								.catch(function (error) {
								})
						})
						.catch((error) => {
						})
				});
			})
			.catch((error) => {
			})
	}

	deleteStatusOfDriver(event) {
		event.preventDefault();
		axios.get("/api/personmaster/get/one/" + this.state.deleteID)
			.then((response) => {
				this.setState({
					"personID": response.data.userId,
					"username": response.data.firstName + " " + response.data.lastName,
				}, () => {
					var details = {
						driverID: this.state.deleteID,
						updatedBy: localStorage.getItem("user_ID")
					}
					axios.patch("/api/personmaster/patch/temp_delete_driver", details)
						.then((response) => {
							if (response.data) {
								this.props.getPersons();
								this.props.hideForm();
								$('#deleteStatusOfDriverModal').hide();
								var formValues = {
									user_id_tobedeleted: this.state.personID,
									username: this.state.username,
								}
								axios
									.patch('/api/users/patch/deletestatus/', formValues)
									.then((response) => {
										swal({
											title: " ",
											text: "Record is deleted successfully.",
										});
									})
									.catch(function (error) {
									})
							} else {
								swal({
									title: " ",
									text: "Failed to delete.",
								});
							}
						})
						.catch((error) => {
						})
					// console.log("this.state.personI",this.state.personID)
				});
			})
			.catch((error) => {
			})
	}
	closeModal(event) {
		event.preventDefault();
		$('#deleteModal').hide();
		$('#deleteStatusOfDriverModal').hide();
	}
	render() {
		return (
			this.state.personInfo ?
				<div>
					<div className="row">
						<div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails" data-child={this.state.personInfo._id} id={this.state.personInfo._id}>
								<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
									<img src={this.state.personInfo.profilePhoto ? this.state.personInfo.profilePhoto : "/images/noImagePreview.png"} className="supplierLogoImage"></img>
								</div>
								<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
									<h5 className="titleprofile">{this.state.personInfo.firstName + " " + this.state.personInfo.middleName + " " + this.state.personInfo.lastName + (this.state.personInfo.employeeId ? " (EmpID : " + this.state.personInfo.employeeId + ") " : "")}</h5>
									<div className="dots dropdown1 col-lg-12 col-md-6 col-sm-6 col-xs-6">
										<i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
										<div className="dropdown-content1 dropdown2-content2">
											<ul className="pdcls ulbtm">
												<li id={this.state.personInfo._id} className="styleContactActbtn" data-index data-id={this.state.personInfo._id} onClick={this.editBasicform.bind(this)}>
													<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
												</li>
												<li id className="styleContactActbtn" data-id={this.state.personInfo._id} onClick={this.deleteEntity.bind(this)}>
													<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
												</li>
											</ul>
										</div>
									</div>
									<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
										{this.state.personInfo.department[0] ? <li><i className="fa fa-briefcase " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.department[0].department + ", " + this.state.personInfo.designation[0].designation + ", (" + this.state.personInfo.type + ")"}</li> : <li></li>}
										<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.contactNo ? this.state.personInfo.contactNo : " - "}</li>
										{this.props.type == "guest" ?
											// <li><i className="fa fa-user " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.employeeId ? this.state.personInfo.employeeId : " - "}</li>
											<li><i className="fa fa-user " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.gender ? this.state.personInfo.gender : " - "}</li>
											:
											null
										}
										{this.props.type == "guest" ? null
											:
											<li><i className="fa fa-whatsapp" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.whatsappNo ? this.state.personInfo.whatsappNo : " - "}</li>
										}
										{this.state.personInfo.alternateNumber != null ?
											<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.alternateNumber ? this.state.personInfo.alternateNumber : " - "}</li>
											:
											null
										}
										<li><i className="fa fa-id-badge" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.companyID ? this.state.personInfo.companyName + " ( " + this.state.personInfo.companyID + " )" : " - "}</li>
										<li><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.workLocation ? this.state.personInfo.workLocation : " - "}</li>

										<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.email ? this.state.personInfo.email : " - "}</li>
									</ul>
								</div>
							</div>
							{
								this.props.type !== "guest" && this.state.address && this.state.address.length > 0 &&
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationMainContainer">
									<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
										<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
									</div>
									<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
										<h5 className="locationHeading">Address</h5>
									</div>
									{
										this.state.address.map((addressA, index) => {
											return (
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding" key={index}>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ heigth: '100px' }}>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">

															<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<li title="address"><b>{addressA.district}</b></li>
																<li title="address"> {addressA.locationType}</li>
																<li title="address">#&nbsp;{addressA.addressLine1 + ", " + addressA.landmark + ", " + addressA.addressLine2 + ", " + addressA.city}</li>
																<li title="address">&nbsp;{addressA.area}</li>
																<li title="address">&nbsp;{addressA.state + " " + addressA.country}</li>
																<li title="address">&nbsp;{addressA.pincode}</li>
															</ul>
														</div>
													</div>
													<br />
												</div>
											);
										})
									}
								</div>
							}
							{
								this.props.type !== "guest" && this.state.Documentarray && this.state.Documentarray.length > 0 &&
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationMainContainer addMarginTopPM">
									<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
										<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
									</div>
									<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
										<h5 className="locationHeading">Document List</h5>
									</div>
									{
										this.state.Documentarray.map((docdata, index) => {
											return (
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding" key={index}>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ heigth: '100px' }}>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<li title="document"><b>{docdata.documentName}</b>: {docdata.documentNumber}</li>
																<li title="document"><b>Document Valid From : </b>{moment(docdata.documentValidFrom).format("DD-MMM-YY")}</li>
																<li title="document"><b>Document Valid To :</b> {moment(docdata.documentValidTo).format("DD-MMM-YY")}</li>
																
															</ul>
														</div>
													</div>
													<br />
												</div>
											);
										})
									}
								</div>

							}
							{/* {
				        	 this.props.type === "driver"?
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding marginTopModal ">
					        		{  
					        			this.state.personInfo?
					        		 	<div>
											{
												this.state.personInfo.drivingLicense.licenseProof.length>0  && this.state.personInfo.aadhar.aadharProof.length>0 &&  this.state.personInfo.identityProof.length>0 && this.state.personInfo.verificationProof.length>0
												? 
							        		 		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding locationMainContainer">
										        		<br/>

										        		<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
															<i className="fa fa-file addressIcon" aria-hidden="true"></i>
														</div>
															<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
																<h5 className="locationHeading">Document Details</h5>
															</div>
														
														{
															this.state.personInfo.drivingLicense.licenseProof && this.state.personInfo.drivingLicense.licenseProof.length>0  ?
															<div className="col-lg-12 noPadding">
																<label className="col-lg-12 marginTopModal">License Proof</label>
																{	
																	this.state.personInfo.drivingLicense.licenseProof.map((image,index)=>{
																		return(
																			<div className="col-lg-3 col-md-12 col-sm-12 col-sm-12 imgContainerDoc" key={index}>
																																						{console.log("image",image)}

																				<img src = {image.imgUrl}/>
																				<span className="col-lg-12 noPadding">{(image ? image.imgUrl.split('/').pop() : "")}</span>
																			</div>
																			);
																	})
																	
																}
															</div>
															:
															null
													    }
													    {
															this.state.personInfo.aadhar.aadharProof && this.state.personInfo.aadhar.aadharProof.length>0  ?
															<div className="col-lg-12 noPadding">
																<label className="col-lg-12 marginTopModal">Aadhar Proof</label>
																{	
																	this.state.personInfo.aadhar.aadharProof.map((image,index)=>{
																		return(
																			<div className="col-lg-3 col-md-12 col-sm-12 col-sm-12 imgContainerDoc" key={index}>
																				{console.log("image",image)}
																				<img src = {image.imgUrl}/>
																				<span className="col-lg-12 noPadding">{(image ? image.imgUrl.split('/').pop() : "")}</span>
																			</div>
																			);
																	})
																	
																}
															</div>
															:
															null
													    }
													    {
															this.state.personInfo.identityProof && this.state.personInfo.identityProof.length>0  ?
															<div className="col-lg-12 noPadding">
																<label className="col-lg-12 marginTopModal">Identity Proof</label>
																{	
																	this.state.personInfo.identityProof.map((image,index)=>{
																		return(
																			<div className="col-lg-3 col-md-12 col-sm-12 col-sm-12 imgContainerDoc" key={index}>
																				<img src = {image.imgUrl}/>
																				<span className="col-lg-12 noPadding">{(image ? image.imgUrl.split('/').pop() : "")}</span>
																			</div>
																			);
																	})
																	
																}
															</div>
															:
															null
													    }
														{
															this.state.personInfo.verificationProof &&  this.state.personInfo.verificationProof.length>0 ?
															<div className="col-lg-12 noPadding">
																<label className="col-lg-12 marginTopModal">Verification Proof</label>
																{	
																	this.state.personInfo.verificationProof.map((image,index)=>{
																		return(
																			<div className="col-lg-3 col-md-12 col-sm-12 col-sm-12 imgContainerDoc" key={index}>
																				<img src = {image.imgUrl}/>
																				<span className="col-lg-12 noPadding">{(image ? image.imgUrl.split('/').pop() : "")}</span>
																			</div>
																			);
																	})
																}
															</div>
															:
															null
													    }
													</div>
												: null
											}
								        </div>
							        	:
							        	null
						        	 }
					        	</div>
					        	:
					        	null
				        	} */}
							<br />
						</div>
					</div>
					<div className="modal" id="deleteModal" role="dialog">
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
					<div className="modal" id="deleteStatusOfDriverModal" role="dialog">
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
										<button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.deleteStatusOfDriver.bind(this)} >DELETE</button>
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
export default withRouter(PersonDetails); 
