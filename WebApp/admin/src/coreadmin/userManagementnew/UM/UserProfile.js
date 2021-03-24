import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";
import { withRouter, Link } from 'react-router-dom';
import S3FileUpload from 'react-s3';
import "./userManagement.css";
class EditUserProfile extends Component {


	constructor(props) {
		super(props);
		var UserId = this.props.match.params.id;

		this.state = {
			UserId: UserId,
			adminpathname: this.props.match.params.id,
			fullname: "",
			username: "",
			mobNumber: "",
			profileImage: "",
			firstName: "",
			lastName: "",
			centerName: "",
			modalState: true,
		}
		this.handleChange = this.handleChange.bind(this);
	}

	isNumberKey(event) {
		var charCode = (event.which) ? event.which : event.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)) {
			event.preventDefault();
			return false;
		}
		else {
			return true;
		}
	}
	changeMobile(event) {
		this.setState({
			mobNumber: event
		}, () => {
		  if (this.state.mobNumber) {
			this.setState({
			  companyPhoneAvailable: this.state.mobNumber === "+" || this.state.mobNumber.length<12 ? false : true
			},()=>{
			})
		  }
		})
	  }

	handleSubmit(event) {
		event.preventDefault();
		if ($('#editUser').valid()) {
			var userid = this.state.UserId;
			var formvalues = {
				"firstname": this.refs.firstName.value,
				"lastname": this.refs.lastName.value,
				"mobNumber": this.state.mobNumber,
				"image": this.state.profileImage,
				// "companyID" :"1"
				"role": [this.state.role],
				"email": this.state.username,
			}
			var fullname = this.refs.firstName.value + ' ' + this.refs.lastName.value
			var profileImg = this.state.profileImage

			localStorage.setItem("fullname", fullname);
			localStorage.setItem("profileImg", profileImg);

			console.log("image formvalues==>", formvalues)
			axios.patch('/api/users/patch/profile/' + userid, formvalues)
				.then((response) => {
					console.log('response', response);
					if (response.data = "USER_UPDATED") {
						swal({
							title: " ",
							text: "User updated successfully",
						});
						if (window.location.pathname === '/editadminprofile/'+this.state.adminpathname) {
							this.props.history.push('/umlistofusers');
						} else {
							this.props.history.push('/dashboard');
						}
						// window.location.reload();
					} else {
						// updated : false
						swal({
							title: " ",
							text: "User not modified",
						});

					}
				})
				.catch((error) => { });
		}
	}
	handleChange(event) {
		const target = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: target,
		}, () => {
		})
	}
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	verifyresetpwdornot() {
		var emailOTP = this.getRandomInt(1000, 9999);
		var sendData = {
			"event": "Event37", //Event Name
			"toUserId": this.state.UserId, //To user_id(ref:users)
			"company_id": localStorage.getItem("corporate_ID"),
			"variables": {
				"UserName"	: this.state.fullName,
				"OTP"		: emailOTP,
			}
		}
		console.log('verifyresetpwdornot in result==>>>', sendData)
		axios.post('/api/masternotifications/post/sendNotification', sendData)
			.then((res) => {
				console.log('sendDataToUser in result==>>>', res.data)
			})
			.catch((error) => { console.log('notification error: ', error) })
		this.props.history.push("/otpemailverification", emailOTP = emailOTP);
		this.props.history.push({
			pathname: '/otpemailverification',
			emailOTP: emailOTP,
		});
	}
	componentDidMount() {
		var userid = this.state.UserId;
		axios.get('/api/users/get/id/' + userid)
			.then((res) => {
				// console.log("res.data.image==>", res.data);
				this.setState({
					firstName: res.data.profile.firstname,
					lastName: res.data.profile.lastname,
					fullName: res.data.profile.firstname + (" ") + res.data.profile.lastname,
					username: res.data.profile.email,
					mobNumber: res.data.profile.mobile,
					profileImage: res.data.profile.image,
					companyID: res.data.profile.companyID
				})
			})
			.catch((error) => {
			});
	}
	imgBrowse(event) {
		event.preventDefault();
		var profileImage = "";
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			var file = event.currentTarget.files[0];
			console.log("file==>", file);
			if (file) {
				var fileName = file.name;
				console.log("fileName==>", fileName);
				var ext = fileName.split('.').pop();
				if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
					if (file) {
						var objTitle = { fileInfo: file }
						profileImage = objTitle;

					} else {
						console.log("not==>");
						swal("Images not uploaded");
					}//file
				} else {
					console.log("format==>");
					swal("Allowed images formats are (jpg,png,jpeg)");
				}//file types
			}//file
			if (event.currentTarget.files) {
				main().then(formValues => {
					var profileImage = this.state.profileImage;
					//   for(var k = 0; k < formValues.length; k++){
					profileImage = formValues.profileImage
					//   }

					this.setState({
						profileImage: profileImage
					})
				});
				async function main() {
					var formValues = [];
					// for(var j = 0; j < profileImage.length; j++){
					var config = await getConfig();
					var s3url = await s3upload(profileImage.fileInfo, config, this);
					const formValue = {
						"profileImage": s3url,
						"status": "New"
					};
					formValues = formValue;
					// }
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
							.get('/api/projectsettings/get/S3')
							.then((response) => {
								const config = {
									bucketName: response.data.bucket,
									dirName: 'propertiesImages',
									region: response.data.region,
									accessKeyId: response.data.key,
									secretAccessKey: response.data.secret,
								}
								resolve(config);
							})
							.catch(function (error) { })
					})
				}
			}
		}
	}
	render() {
		var url = window.location.pathname;
		console.log("window.location.pathname==>",url);
		
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
									<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
										My Profile
									</div>
									
									{
										url !== '/editadminprofile/'+this.state.adminpathname?
											<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
												<div className="pull-right" data-toggle="modal" aria-labelledby="verifyresetpwdornot" data-target="#verifyresetpwdornot" aria-hidden="true">
													<p className="btn btnhvr btn-primary ">Reset Password</p>
												</div>
											</div>
											:
											null
									}

								</div>
								<hr className="hr-head container-fluid row" />
								<div className="box-body">
									<div className="row">
										<form id="editUser">
											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
											{
												url !== '/editadminprofile/'+this.state.adminpathname?
													<div className="col-lg-2 col-sm-2 col-xs-12 col-md-12 form-margin">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Profile Photo <label className="requiredsign">&nbsp;</label></label>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profilelogos" id="ProfileImageUpOne">
																<img className="profileimg" src={this.state.profileImage ? this.state.profileImage : "/images/person.png"} ></img>
																<input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Upload/Change Image for SuperAdmin profile picture." name="profileImage" />
															</div>
														</div>
													</div>
												:
													null
											}
												<div className="col-lg-9 col-sm-9 col-xs-12 col-md-12 NOpadding">
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
																<input type="text" style={{ textTransform: 'capitalize' }}
																	className="form-control"
																	id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" required />
															</div>
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
																<input type="text" className="form-control"
																	id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" required />
															</div>
														</div>
													</div>
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Username/Email <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="usernameErr">
																<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="form-control" ref="username" name="username" required />
															</div>
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
															<label >Mobile Number <span className="requiredsign">*</span></label>
															{/* <input type="tel" minlength="10" maxlength="11" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onKeyDown={this.isNumberKey.bind(this)} className="formFloatingLabels form-control  newinputbox" ref="mobNumber" name="mobNumber" id="mobNumber" data-text="mobNumber" onChange={this.handleChange} value={this.state.mobNumber}
																placeholder="Mobile Number" /> */}
															<PhoneInput
																country={'in'}
																value={this.state.mobNumber}
																name="mobNumber"
																inputProps={{
																	name: 'mobNumber',
																	required: true
																}}
																onChange={this.changeMobile.bind(this)}
															/>
															{this.state.companyPhoneAvailable === true ? null : <label className="error">Please enter valid number</label>}
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
															<label>Company ID <span className="requiredsign">*</span></label>
															<input type="text" disabled className="formFloatingLabels form-control  newinputbox" ref="companyID" name="companyID" id="companyID" data-text="companyID" onChange={this.handleChange} value={this.state.companyID}
																placeholder="Company ID" />
														</div>
													</div>
												</div>
												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</section>

						<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id="verifyresetpwdornot" role="dialog">
							<div className=" modal-dialog adminModal adminModal-dialog">
								<div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
									<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
										<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
											<button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
									</div>
									<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to Reset Password?</h4>
									</div>
									<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<button type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<button onClick={this.verifyresetpwdornot.bind(this)} type="button" className="btn btn-primary col-lg-6 col-lg-offset-5 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">Yes, Reset Pwd</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* <div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id="resetpwdornot" role="dialog">
							<div className=" modal-dialog adminModal adminModal-dialog">
								<div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
									<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
										<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
											<button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
									</div>
									<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Your Verification Code Please.</h4>
									</div>
									<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
															<label >Mobile Number <span className="requiredsign">*</span></label>
															<input type="tel" minlength="10" maxlength="11" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onKeyDown={this.isNumberKey.bind(this)} className="formFloatingLabels form-control  newinputbox" ref="mobNumber" name="mobNumber" id="mobNumber" data-text="mobNumber" onChange={this.handleChange} value={this.state.mobNumber}
																placeholder="Mobile Number" />
														</div>
									<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
										
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<button onClick={this.resetpwdornot()} type="button" className="btn btn-primary col-lg-6 col-lg-offset-5 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">Yes, Reset Pwd</button>
										</div>
									</div>
								</div>
							</div>
						</div> */}

					</div>
				</div>
			</div>
		);
	}
}

export default EditUserProfile;


