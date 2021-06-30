const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var ObjectID = require('mongodb').ObjectID;
var request = require('request-promise');
const User = require('../userManagementnew/ModelUsers.js');
const Role = require('../rolesManagement/ModelRoles.js');
const globalVariable = require("../../../nodemon.js");
const GlobalMaster        = require('../projectSettings/ModelProjectSettings.js');
const nodeMailer            = require('nodemailer');
const moment 					= require('moment-timezone');
const lookup = require('country-code-lookup')
const sendNotification 			= require("../../coreAdmin/notificationManagement/SendNotification.js");

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.user_signup_user = (req, res, next) => {
	console.log("<><><><><><><><><><><>",req.body);
	var username = "EMAIL";
	if(req.body.username){
		if(req.body.username === "EMAIL"){
			username = "EMAIL";
		}else if(req.body.username === "MOBILE"){
			username = "MOBILE";
		}
	}
	if(username==="EMAIL"){
		if(req.body.email && req.body.pwd && req.body.role){
			var emailId  	= req.body.email;
			var role_lower 	= String(req.body.role).toLowerCase();
			console.log("role ", role_lower);

			if (role_lower && emailId) {
				Role.findOne({ role: role_lower })
					.exec()
					.then(role => {
						console.log("role",role);

						if (role && role !== null) {
							User.find({ "username": emailId.toLowerCase() })
								.exec()
								.then(user => {
									console.log("user => ",user)
									console.log("user length => ",user.length)
									if (user.length > 0) {
										return res.status(200).json({
											message: 'Email Id already exist.'
										});
									} else {
										bcrypt.hash(req.body.pwd, 10, (err, hash) => {
											if (err) {
												return res.status(500).json({
													message: "Failed to match the password",
													error: err
												});
											} else {
												const user = new User({
													_id: new mongoose.Types.ObjectId(),
													createdAt 		: new Date,
													services 		: {
														password	: {
															bcrypt 	: hash

														},
													},
													username: emailId.toLowerCase(),
													authService : req.body.authService,
													profile: {
														firstname: req.body.firstname,
														lastname: req.body.lastname,
														fullName: req.body.firstname + ' ' + req.body.lastname,
														email: emailId.toLowerCase(),
														mobile: req.body.mobNumber,
														companyID: req.body.companyID,
														company_id: req.body.company_ID,
														pincode: req.body.pincode,
														companyName: req.body.companyName,
														department	: req.body.department,
														designation	: req.body.designation,
														city: req.body.cityName,
														states: req.body.states,
														status: req.body.status ? req.body.status : "Block",
														createdBy: req.body.createdBy,
														createdAt: new Date(),
													},
													deliveryAddress : [],
													roles: [role_lower],
													recieveNotifications : req.body.recieveNotifications
												});
												if (!req.body.firstname) {
													user.profile.fullName = req.body.fullName;
												}
												user.save()
													.then(async(result) => {
														console.log("result => ",result)
														console.log("condition => ",user.roles.includes("admin"))
														if(!user.roles.includes("admin")){
															//send Notification, email, sms to customer
															var userNotificationValues = {
																"event"			: "Signup",
																"toUser_id"		: result._id,
																"toUserRole"	: role_lower,								
																"variables" 	: {
																					"userRole" 			: role_lower.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																					"firstName" 		: result.profile.firstName,
																					"lastName" 			: result.profile.lastName,
																					"fullName" 			: result.profile.fullName,
																					"emailId" 			: result.profile.email,
																					"mobileNumber"		: result.profile.mobile,
																					"loginID" 			: result.username,
																					"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																}
															}
															var send_notification_to_user = await sendNotification.send_notification_function(userNotificationValues);
															console.log("send_notification_to_user => ",send_notification_to_user)
															//send Notification, email, sms to admin
															var adminNotificationValues = {
																"event"			: "SignUp",
																// "toUser_id"		: req.body.user_ID,
																"toUserRole"	: "admin",								
																"variables" 	: {
																					"firstName" 		: result.profile.firstName,
																					"lastName" 			: result.profile.lastName,
																					"fullName" 			: result.profile.fullName,
																					"emailId" 			: result.profile.email,
																					"mobileNumber"		: result.profile.mobile,
																					"loginID" 			: result.username,
																					"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																}
															}
															var send_notification_to_admin = await sendNotification.send_notification_function(adminNotificationValues);
															console.log("send_notification_to_admin => ",send_notification_to_admin)
														}
														res.status(200).json({
															message : 'USER_CREATED',
															ID 		: result._id,
														})

													})
													.catch(err => {
														console.log(err);
														res.status(500).json({
															message: "Failed to save User Details",
															error: err
														});
													});
											}
										});
									}
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exist" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		}else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
	}else if(username==="MOBILE"){
		if(req.body.mobNumber && req.body.pwd && req.body.role) {
			var mobNumber = req.body.mobNumber;
			var role_lower = (req.body.role).toLowerCase();
			if (role_lower && mobNumber) {
				Role.findOne({ role: role_lower })
					.exec()
					.then(role => {
						if (role) {
							User.find({ "username": mobNumber })
								.exec()
								.then(user => {
									if (user.length > 0) {
										return res.status(200).json({
											message: 'Mobile number already exits.'
										});
									} else {
										bcrypt.hash(req.body.pwd, 10, (err, hash) => {
											if (err) {
												return res.status(500).json({
													message: "Failed to match the password",
													error: err
												});
											} else {
												const user = new User({
													_id: new mongoose.Types.ObjectId(),
													createdAt: new Date,
													services: {
														password: {
															bcrypt: hash

														},
													},
													username: req.body.mobNumber,
													authService : req.body.authService,
													profile:
													{
														firstname: req.body.firstname,
														lastname: req.body.lastname,
														fullName: req.body.firstname + ' ' + req.body.lastname,
														email: req.body.email,
														mobile: mobNumber,
														companyID: req.body.companyID,
														pincode: req.body.pincode,
														companyName: req.body.companyName,
														createdAt: new Date(),
														status: req.body.status ? req.body.status : "Block",
														createdBy: req.body.createdBy,
													},
													roles: [role_lower]
												});
												if (!req.body.firstname) {
													user.profile.fullName = req.body.fullName;
												}
												user.save()
												.then(async(result) => {
													if(result) {
														if(!user.roles.includes("admin")){
															//send Notification, email, sms to customer
															var userNotificationValues = {
																"event"			: "Signup",
																"toUser_id"		: result._id,
																"toUserRole"	: role_lower,								
																"variables" 	: {
																					"userRole" 			: role_lower.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																					"firstName" 		: result.profile.firstName,
																					"lastName" 			: result.profile.lastName,
																					"fullName" 			: result.profile.fullName,
																					"emailId" 			: result.profile.email,
																					"mobileNumber"		: result.profile.mobile,
																					"loginID" 			: result.username,
																					"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																}
															}
															var send_notification_to_user = await sendNotification.send_notification_function(userNotificationValues);
															// console.log("send_notification_to_user => ",send_notification_to_user)
															
															//send Notification, email, sms to admin
															var adminNotificationValues = {
																"event"			: "SignUp",
																// "toUser_id"		: req.body.user_ID,
																"toUserRole"	: "admin",								
																"variables" 	: {
																					"firstName" 		: result.profile.firstName,
																					"lastName" 			: result.profile.lastName,
																					"fullName" 			: result.profile.fullName,
																					"emailId" 			: result.profile.email,
																					"mobileNumber"		: result.profile.mobile,
																					"loginID" 			: result.username,
																					"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																}
															}
															var send_notification_to_admin = await sendNotification.send_notification_function(adminNotificationValues);
															// console.log("send_notification_to_admin => ",send_notification_to_admin)
														}
														res.status(200).json({ message: "USER_CREATED", ID: result._id })
													}else {
														res.status(200).json({ message: "USER_NOT_CREATED" })
													}
												})
												.catch(err => {
													console.log(err);
													res.status(500).json({
														message: "Failed to save User Details",
														error: err
													});
												});
											}
										});
									}
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exits" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		} else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
	}	
};

exports.user_signup_user_otp = (req, res, next) => {
	console.log("req body",req.body);
	var username = "EMAIL";
	if(req.body.username){
		if(req.body.username === "EMAIL"){
			username = "EMAIL";
		}else if(req.body.username === "MOBILE"){
			username = "MOBILE";
		}
	}
	if(username==="EMAIL"){
		if(req.body.email && req.body.pwd && req.body.role) {
			var emailId = req.body.email;
			var userRole = (req.body.role).toLowerCase();
			if (userRole && emailId) {
				Role.findOne({ role: userRole })
					.exec()
					.then(role => {
						if (role) {
							User.find({ "username": emailId.toLowerCase() })
								.exec()
								.then(user => {
									if (user.length > 0) {
										return res.status(200).json({
											message: 'Email Id already exits.'
										});
									} else {
										bcrypt.hash(req.body.pwd, 10, (err, hash) => {
											if (err) {
												return res.status(500).json({
													message: "Failed to match the password",
													error: err
												});
											} else {
												var emailOTP = getRandomInt(1000, 9999);
												if (emailOTP) {
													const user = new User({
														_id: new mongoose.Types.ObjectId(),
														createdAt: new Date,
														services: {
															password: {
																bcrypt: hash

															},
														},
														username: emailId.toLowerCase(),
														authService : req.body.authService,
														profile:
														{
															firstname: req.body.firstname,
															lastname: req.body.lastname,
															fullName: req.body.firstname + ' ' + req.body.lastname,
															email: emailId.toLowerCase(),
															companyID: req.body.companyID,
															pincode: req.body.pincode,
															companyName: req.body.companyName,
															mobile: req.body.mobNumber,
															createdAt: new Date(),
															otpEmail: emailOTP,
															countryCode : req.body.countryCode,
															mobileCode1 : req.body.mobileCode1,
															status: req.body.status ? req.body.status : "Inactive",
															createdBy: req.body.createdBy,
														},
														roles: [userRole]
													});
													if (!req.body.firstname) {
														user.profile.fullName = req.body.fullName;
													}
													user.save()
														.then(async(result) => {
															if (result && result !== null) {
																// request({
																// 	"method": "POST",
																// 	"url": "http://localhost:" + globalVariable.port + "/send-email",
																// 	"body": {
																// 		email: req.body.email,
																// 		subject: req.body.emailSubject,
																// 		text: req.body.emailContent + " Your OTP is " + emailOTP,
																// 	},
																// 	"json": true,
																// 	"headers": {
																// 		"User-Agent": "Test Agent"
																// 	}
																// })
																// .then(source => {

																	//send Notification, email, sms to customer																	
																	var userNotificationValues = {
																		"event"			: "SignUp",
																		"toUser_id"		: result._id,
																		"toUserRole"	: userRole,								
																		"variables" 	: {
																							"userType" 			: userRole.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																							"firstName" 		: result.profile.firstName,
																							"lastName" 			: result.profile.lastName,
																							"fullName" 			: result.profile.fullName,
																							"emailId" 			: result.profile.email,
																							"mobileNumber"		: result.profile.mobile,
																							"loginID" 			: result.username,
																							"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
																							"OTP" 				: result.otpEmail
																		}
																	}
																	var send_notification_to_user = await sendNotification.send_notification_function(userNotificationValues);
																	// console.log("send_notification_to_user => ",send_notification_to_user)
																	
																	//send Notification, email, sms to admin
																	var adminNotificationValues = {
																		"event"			: "SignUp",
																		// "toUser_id"		: req.body.user_ID,
																		"toUserRole"	: "admin",								
																		"variables" 	: {
																							"userType" 			: userRole.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																							"firstName" 		: result.profile.firstName,
																							"lastName" 			: result.profile.lastName,
																							"fullName" 			: result.profile.fullName,
																							"emailId" 			: result.profile.email,
																							"mobileNumber"		: result.profile.mobile,
																							"loginID" 			: result.username,
																							"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																		}
																	}
																	var send_notification_to_admin = await sendNotification.send_notification_function(adminNotificationValues);
																	
																	res.status(200).json({ message: "USER_CREATED", ID: result._id,result })
																// })
																// .catch(err => {
																// 	console.log(err);
																// 	res.status(500).json({
																// 		message: "Failed to Send Email",
																// 		error: err
																// 	});
																// });
															}else {
																res.status(200).json({ message: "USER_NOT_CREATED" })
															}
														})
														.catch(err => {
															console.log(err);
															res.status(500).json({
																message: "Failed to save User Details",
																error: err
															});
														});
												}
											}
										});
									}
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exits" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		} else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
	}else if(username==="MOBILE"){
		if(req.body.mobNumber && req.body.pwd && req.body.role) {
			var mobNumber = req.body.mobNumber;
			var userRole = (req.body.role).toLowerCase();
			if (userRole && mobNumber) {
				Role.findOne({ role: userRole })
					.exec()
					.then(role => {
						if (role) {
							User.find({ "username": mobNumber })
								.exec()
								.then(user => {
									if (user.length > 0) {
										return res.status(200).json({
											message: 'Mobile number already exits.'
										});
									} else {
										bcrypt.hash(req.body.pwd, 10, (err, hash) => {
											if (err) {
												return res.status(500).json({
													message: "Failed to match the password",
													error: err
												});
											} else {
												// var mobileOTP = getRandomInt(1000, 9999);
												var mobileOTP = 1234;
												if (mobileOTP) {
													const user = new User({
														_id: new mongoose.Types.ObjectId(),
														createdAt: new Date,
														services: {
															password: {
																bcrypt: hash

															},
														},
														username: req.body.mobNumber,
														authService : req.body.authService,
														profile:
														{
															firstname: req.body.firstname,
															lastname: req.body.lastname,
															fullName: req.body.firstname + ' ' + req.body.lastname,
															email: req.body.email,
															mobile: req.body.mobNumber,
															companyID: req.body.companyID,
															pincode: req.body.pincode,
															companyName: req.body.companyName,
															countryCode : req.body.countryCode,
															mobileCode1 : req.body.mobileCode1,
															createdAt: new Date(),
															otpMobile: mobileOTP,
															status: req.body.status ? req.body.status : "Inactive",
															createdBy: req.body.createdBy,
														},
														roles: [userRole]
													});
													if (!req.body.firstname) {
														user.profile.fullName = req.body.fullName;
													}
													user.save()
														.then(async(result) => {
															if(result) {
																//send Notification, email, sms to customer																	
																var userNotificationValues = {
																	"event"			: "Signup",
																	"toUser_id"		: result._id,
																	"toUserRole"	: userRole,								
																	"variables" 	: {
																						"userType" 			: userRole.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																						"firstName" 		: result.profile.firstName,
																						"lastName" 			: result.profile.lastName,
																						"fullName" 			: result.profile.fullName,
																						"emailId" 			: result.profile.email,
																						"mobileNumber"		: result.profile.mobile,
																						"loginID" 			: result.username,
																						"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
																						"OTP" 				: result.otpMobile
																	}
																}
																var send_notification_to_user = await sendNotification.send_notification_function(userNotificationValues);
																// console.log("send_notification_to_user => ",send_notification_to_user)
																
																//send Notification, email, sms to admin
																var adminNotificationValues = {
																	"event"			: "Signup",
																	// "toUser_id"		: req.body.user_ID,
																	"toUserRole"	: "admin",								
																	"variables" 	: {
																						"userType" 			: userRole.replace(/([a-z])([A-Z][a-z])/g, "$1 $2").charAt(0).toUpperCase(),
																						"firstName" 		: result.profile.firstName,
																						"lastName" 			: result.profile.lastName,
																						"fullName" 			: result.profile.fullName,
																						"emailId" 			: result.profile.email,
																						"mobileNumber"		: result.profile.mobile,
																						"loginID" 			: result.username,
																						"signupDate" 		: moment(result.createdAt).format('MMMM Do YYYY, h:mm:ss a')
																	}
																}
																var send_notification_to_admin = await sendNotification.send_notification_function(adminNotificationValues);

																res.status(200).json({ message: "USER_CREATED", ID: result._id, result:result })
															}else {
																res.status(200).json({ message: "USER_NOT_CREATED" })
															}
														})
														.catch(err => {
															console.log(err);
															res.status(500).json({
																message: "Failed to save User Details",
																error: err
															});
														});
												}
											}
										});
									}
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exits" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		} else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
	}		
};

exports.check_userID_EmailOTP = (req, res, next) => {
	console.log("req params",req.params)
	User.find({ _id: ObjectID(req.params.ID), "profile.otpEmail": req.params.emailotp })
		.exec()
		.then(data => {
			console.log("data",data);
			if (data.length > 0) {
				User.updateOne(
					{ _id: ObjectID(req.params.ID) },
					{
						$set: {
							"profile.otpEmail": 0,
							"profile.status": "active"
						}
					}
				)
					.exec()
					.then(data => {
						if (data.nModified === 1) {
							res.status(200).json({ message: "SUCCESS", userID: data._id });
						} else {
							res.status(200).json({ message: "SUCCESS_OTP_NOT_RESET" });
						}
					})
					.catch(err => {
						console.log('user error ', err);
						res.status(500).json({
							message: "Failed to update Email OTP",
							error: err
						});
					})
			} else {
				res.status(200).json({ message: "FAILED" });
			}
		})
		.catch(err => {
			console.log('user error ', err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};

exports.check_userID_MobileOTP = (req, res, next) => {
	User.findOne({ _id: ObjectID(req.params.ID), "profile.otpMobile": req.params.mobileotp })
		.exec()
		.then(user => {
			if (user) {
				User.updateOne(
					{ _id: ObjectID(req.params.ID) },
					{
						$set: {
							"profile.otpMobile": 0,
							"profile.status": "active"
						}
					}
				)
					.exec()
					.then(data => {
						if (data.nModified === 1) {
								const token = jwt.sign({
									mobile: user.profile.mobile,
									userId: user._id,
								}, globalVariable.JWT_KEY,
									{
										expiresIn: globalVariable.timeOutLimitSecs
									}
								);

							User.updateOne(
								{ "_id": ObjectID(user._id)},
								{
									$push: {
										"services.resume.loginTokens": {
											whenLogin: new Date(),
											loginTimeStamp: new Date(),
											hashedToken: token
										}
									}
								}
							)
								.exec()
								.then(updateUser => {
									if(updateUser.nModified == 1) {
										res.status(200).json({
											message: 'Login Auth Successful',
											token: token,
											roles: user.roles,
											ID: user._id,
											loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
											companyID: user.profile.companyID,
											authService:user.authService,
											userDetails: {
												firstName: user.profile.firstname,
												lastName: user.profile.lastname,
												email: user.profile.email,
												countryCode : user.profile.countryCode,
												phone: user.profile.phone,
												city: user.profile.city,
												deliveryAddress: user.deliveryAddress,
												pincode: user.profile.pincode,
												companyID: user.profile.companyID,
												company_id: user.profile.company_id,
												companyName: user.profile.companyName,
												locationID: user.profile.locationID,
												user_id: user._id,
												roles: user.roles,
												token: token,
											}
										});
									}
								})

								.catch(err => {
									console.log("500 err ", err);
									res.status(500).json({
										message: "Failed to save token",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "SUCCESS_OTP_NOT_RESET" });
						}
					})
					.catch(err => {
						console.log('user error ', err);
						res.status(500).json({
							message: "Failed to update Mobile OTP",
							error: err
						});
					})
			} else {
				res.status(200).json({ message: "FAILED" });
			}
		})
		.catch(err => {
			console.log('user error ', err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};

exports.check_username_EmailOTP = (req, res, next) => {
	// console.log("req.parmas", req.params);
	User.find({ username: req.params.username, "profile.otpEmail": req.params.emailotp })
		.exec()
		.then(data => {
			if (data.length > 0) {
				User.updateOne(
					{
						username: req.params.username
					},
					{
						$set: {
							"profile.otpEmail": 0,
							"profile.status": "active"
						}
					}
				)
					.exec()
					.then(data => {
						if (data.nModified === 1) {
							res.status(200).json({ message: "SUCCESS" });
						} else {
							res.status(200).json({ message: "SUCCESS_OTP_NOT_RESET" });
						}
					})
					.catch(err => {
						console.log('user error ', err);
						res.status(500).json({
							message: "Failed to update Email OTP",
							error: err
						});
					})
			} else {
				res.status(200).json({ message: "FAILED" });
			}
		})
		.catch(err => {
			console.log('user error ', err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};

exports.user_login_using_email = (req, res, next) => {
	// console.log("user_login_using_email req.body = ",req.body);
	// console.log("=================");
	var emailId = (req.body.email).toLowerCase(); 
	var role = (req.body.role).toLowerCase();
	User.findOne({
		"username": emailId,
		"roles": role,
	})
		.exec()
		.then(user => {
			// console.log("user",user)
			if (user) {
				if ((user.profile.status).toLowerCase() == "active") {
					var pwd = user.services.password.bcrypt;
					// console.log('pwd', pwd);
					if (pwd) {
						bcrypt.compare(req.body.password, pwd, (err, result) => {
							if (err) {
								return res.status(200).json({
									message: 'Auth failed'
								});
							}
							if (result) {
								const token = jwt.sign({
									email: req.body.email,
									userId: user._id,
								}, globalVariable.JWT_KEY,
									{
										// expiresIn: "365d"
										expiresIn: globalVariable.timeOutLimitSecs
									}
								);

								User.updateOne(
									{ "username": emailId.toLowerCase() },
									{
										$push: {
											"services.resume.loginTokens": {
												whenLogin: new Date(),
												loginTimeStamp: new Date(),
												hashedToken: token
											}
										}
									}
								)
									.exec()
									.then(updateUser => {
										// console.log("updateUser ==>",updateUser)
										if (updateUser.nModified == 1) {
											res.status(200).json({
												message: 'Login Auth Successful',
												token: token,
												roles: user.roles,
												ID: user._id,
												loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
												companyID: user.profile.companyID,
												userDetails: {
													firstName: user.profile.firstname,
													lastName: user.profile.lastname,
													email: user.profile.email,
													countryCode : user.profile.countryCode,
													phone: user.profile.phone,
													city: user.profile.city,
													deliveryAddress: user.deliveryAddress,
													pincode: user.profile.pincode,
													companyID: user.profile.companyID,
													company_id: user.profile.company_id,
													companyName: user.profile.companyName,
													locationID: user.profile.locationID,
													user_id: user._id,
													roles: user.roles,
													token: token,
												}
											});
										} else {
											return res.status(200).json({
												message: 'Auth failed'
											});
										}
									})

									.catch(err => {
										console.log("500 err ", err);
										res.status(500).json({
											message: "Failed to save token",
											error: err
										});
									});
							} else {
								return res.status(200).json({
									message: 'INVALID_PASSWORD'
								});
							}
						})
					} else {
						res.status(200).json({ message: "INVALID_PASSWORD" });
					}
				} else if ((user.profile.status).toLowerCase() == "blocked") {
					res.status(200).json({ message: "USER_BLOCK" });
				} else if ((user.profile.status).toLowerCase() == "unverified") {
					// res.status(200).json({ message: "USER_UNVERIFIED" });
					var emailOTP = getRandomInt(1000, 9999);
					// console.log("emailOTP ===>",emailOTP);
					User.updateOne(
						{ "username": emailId.toLowerCase() },
						{
							$set: {
								"profile.otpEmail": emailOTP,
							}
						}
					)
						.exec()
						.then(data => {
							// console.log("emailOTP  data===>",data);
							if (data.nModified === 1) {
								User.find({ "profile.email": emailId.toLowerCase() })
									.exec()
									.then(usersdata => {
										// console.log("emailOTP  data===>",usersdata[0].profile);
											res.status(200).json({
												message: 'USER_UNVERIFIED',
												userDetails: {
													firstName: usersdata[0].profile.fullName,
													email: usersdata[0].profile.email,
													otpEmail: usersdata[0].profile.otpEmail,
													phone: usersdata[0].profile.phone,
													user_id: usersdata[0]._id,
													roles: usersdata[0].roles,
												}
											});
									});
							} else {
								res.status(200).json({ message: "SUCCESS_OTP_NOT_RESET" });
							}
						})
						.catch(err => {
							console.log('user error ', err);
							res.status(500).json({
								message: "Failed to update Email OTP",
								error: err
							});
						})
					
				}
			} else {
				res.status(200).json({ message: "NOT_REGISTER" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};


exports.user_login_using_mobile = (req, res, next) => {
	var mobNumber = req.body.mobNumber;
	var role = (req.body.role).toLowerCase();
	// console.log('mobNumber & role', mobNumber,role);
	User.findOne({
		"profile.mobile": mobNumber,
		"roles": role,
	})
	.exec()
	.then(user => {
		if (user) {
			// console.log('user role', user);
			if ((user.profile.status).toLowerCase() == "active") {
				var pwd = user.services.password.bcrypt;
				
				if (pwd) {
					bcrypt.compare(req.body.password, pwd, (err, result) => {
						if (err) {
							return res.status(200).json({
								message: 'Auth failed'
							});
						}
						if (result) {
							const token = jwt.sign({
								mobile: req.body.mobNumber,
								userId: user._id,
							}, globalVariable.JWT_KEY,
								{
									expiresIn: "365d"
								}
							);

							User.updateOne(
								{ "profile.mobile": mobNumber },
								{
									$push: {
										"services.resume.loginTokens": {
											whenLogin: new Date(),
											hashedToken: token
										}
									}
								}
							)
								.exec()
								.then(updateUser => {
									if (updateUser.nModified == 1) {
										res.status(200).json({
											message: 'Login Auth Successful',
											token: token,
											roles: user.roles,
											ID: user._id,
											companyID: user.profile.companyID,
											userDetails: {
												firstName: user.profile.firstname,
												lastName: user.profile.lastname,
												email: user.profile.email,
												phone: user.profile.phone,
												city: user.profile.city,
												deliveryAddress: user.deliveryAddress,
												pincode: user.profile.pincode,
												companyID: user.profile.companyID,
												locationID: user.profile.locationID,
												user_id: user._id,
												roles: user.roles,
												token: token,
											}
										});
									} else {
										return res.status(200).json({
											message: 'Auth failed'
										});
									}
								})

								.catch(err => {
									console.log("500 err ", err);
									res.status(500).json({
										message: "Failed to save token",
										error: err
									});
								});
						} else {
							return res.status(200).json({
								message: 'INVALID_PASSWORD'
							});
						}
					})
				} else {
					res.status(200).json({ message: "INVALID_PASSWORD" });
				}
			} else if ((user.profile.status).toLowerCase() == "blocked") {
				res.status(200).json({ message: "USER_BLOCK" });
			} else if ((user.profile.status).toLowerCase() == "unverified") {
				res.status(200).json({ message: "USER_UNVERIFIED" });
			}
		} else {
			res.status(200).json({ message: "NOT_REGISTER" });
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: "Failed to find the User",
			error: err
		});
	});
};

exports.user_login_using_mobile_email = (req, res, next) => {
	var mobNumber = req.body.mobNumber;
	var role = (req.body.role).toLowerCase();
	User.findOne({
		"profile.mobile": mobNumber,
		"roles": role,
	})

	.exec()
	.then(user => {
		if (user) {
			if ((user.profile.status).toLowerCase() == "active") {
				var pwd = user.services.password.bcrypt;
				// console.log('pwd', pwd);
				if (pwd) {
					bcrypt.compare(req.body.password, pwd, (err, result) => {
						if (err) {
							return res.status(200).json({
								message: 'Auth failed'
							});
						}
						if (result) {
							const token = jwt.sign({
								mobile: req.body.mobNumber,
								userId: user._id,
							}, globalVariable.JWT_KEY,
								{
									expiresIn: "365d"
								}
							);

							User.updateOne(
								{ "username": mobNumber },
								{
									$push: {
										"services.resume.loginTokens": {
											whenLogin: new Date(),
											hashedToken: token
										}
									}
								}
							)
								.exec()
								.then(updateUser => {

									if (updateUser.nModified == 1) {
										res.status(200).json({
											message: 'Login Auth Successful',
											token: token,
											roles: user.roles,
											ID: user._id,
											companyID: user.profile.companyID,
											userDetails: {
												firstName: user.profile.firstname,
												lastName: user.profile.lastname,
												email: user.profile.email,
												phone: user.profile.phone,
												pincode: user.profile.pincode,
												city: user.profile.city,
												companyID: user.profile.companyID,
												locationID: user.profile.locationID,
												user_id: user._id,
												roles: user.roles,
												token: token,
											}
										});
									} else {
										return res.status(200).json({
											message: 'Auth failed'
										});
									}
								})

								.catch(err => {
									console.log("500 err ", err);
									res.status(500).json({
										message: "Failed to save token",
										error: err
									});
								});
						} else {
							return res.status(200).json({
								message: 'INVALID_PASSWORD'
							});
						}
					})
				} else {
					res.status(200).json({ message: "INVALID_PASSWORD" });
				}
			} else if ((user.profile.status).toLowerCase() == "blocked") {
				res.status(200).json({ message: "USER_BLOCK" });
			} else if ((user.profile.status).toLowerCase() == "unverified") {
				res.status(200).json({ message: "USER_UNVERIFIED" });
			}
		} else {
			res.status(200).json({ message: "NOT_REGISTER" });
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: "Failed to find the User",
			error: err
		});
	});
};

exports.user_login_with_companyID = (req, res, next) => {
	var emailId = (req.body.email).toLowerCase();
	var role = (req.body.role).toLowerCase();
	User.findOne({
		"username": emailId,
		"roles": role,
	})
		.exec()
		.then(user => {
			if (user) {
				var loginTokenscount = user.services.resume.loginTokens.length;
				if (user.profile.companyID != "") {
					if ((user.profile.status).toLowerCase() == "active") {
						var pwd = user.services.password.bcrypt;
						if (pwd) {
							bcrypt.compare(req.body.password, pwd, (err, result) => {
								if (err) {
									return res.status(200).json({
										message: 'Auth failed'
									});
								}
								if (result) {
									const token = jwt.sign({
										email: req.body.email,
										userId: user._id,
									}, globalVariable.JWT_KEY,
										{
											expiresIn: "365d"
										}
									);
									User.updateOne(
										{ "username": emailId.toLowerCase() },
										{
											$push: {
												"services.resume.loginTokens": {
													whenLogin: new Date(),
													loginTimeStamp: new Date(),
													hashedToken: token,
													logoutTimeStamp : null
												}
											}
										}
									)
										.exec()
										.then(updateUser => {
											if (updateUser.nModified == 1) {
												res.status(200).json({
													message: 'Login Auth Successful',
													token: token,
													roles: user.roles,
													ID: user._id,
													companyID: user.profile.companyID,
													loginTime: user.services.resume.loginTokens[loginTokenscount-1].logoutTimeStamp,
													logoutTime: user.services.resume.loginTokens[loginTokenscount-1].logoutTimeStamp,
													userDetails: {
														firstName: user.profile.firstname,
														lastName: user.profile.lastname,
														email: user.profile.email,
														phone: user.profile.phone,
														city: user.profile.city,
														companyID: user.profile.companyID,
														locationID: user.profile.locationID,
														user_id: user._id,
														roles: user.roles,
														token: token,
														loginTime: user.services.resume.loginTokens[loginTokenscount-1].logoutTimeStamp,
														logoutTime: user.services.resume.loginTokens[loginTokenscount-1].logoutTimeStamp,
													}
												});
											} else {
												return res.status(200).json({
													message: 'Auth failed'
												});
											}
										})
										.catch(err => {
											console.log("500 err ", err);
											res.status(500).json({
												message: "Failed to save token",
												error: err
											});
										});
								} else {
									return res.status(200).json({
										message: 'INVALID_PASSWORD'
									});
								}
							})
						} else {
							res.status(200).json({ message: "INVALID_PASSWORD" });
						}
					} else if ((user.profile.status).toLowerCase() == "blocked") {
						// console.log("user.USER_BLOCK IN ==>")
						res.status(200).json({ message: "USER_BLOCK" });
					} else if ((user.profile.status).toLowerCase() == "unverified") {
						res.status(200).json({ message: "USER_UNVERIFIED" });
					}
				} else if (user.profile.companyID == "") {
					res.status(200).json({ message: "NO_COMPANYID" });
				}
			} else {
				res.status(200).json({ message: "NOT_REGISTER" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};

exports.logouthistory = (req, res, next) => {
	// console.log("Logout Body",req.body);
	// var emailId = req.body.emailId;
	User.findOne({ _id: req.body.user_ID })
		.exec()
		.then(user => {
			// console.log("user",user);
				User.updateOne(
					{
						"username": req.body.emailId,
						"services.resume.loginTokens.hashedToken":req.body.token
					},
					{
						$set: {
							
								"services.resume.loginTokens.$.logoutTimeStamp": new Date(),
						}
					}
					).exec()
					.then(data => {
						// console.log("logout data => ", data);
						res.status(200).json({data})
					})
					.catch(err => {
						res.status(500).json({
							message: "Failed to update User",
							error: err
						});
					});
					
					})
		.catch(err => {
			// console.log('update user status error ',err);
			res.status(500).json({
				error: err
			});
		});
};
exports.user_update_password_withoutotp_ID = (req, res, next) => {
	User.findOne({ _id: req.params.ID })
		.exec()
		.then(user => {
			if (user) {
				bcrypt.hash(req.body.pwd, 10, (err, hash) => {
					User.updateOne(
						{ _id: req.params.ID },
						{
							$set: {
								services: {
									password: {
										bcrypt: hash
									},
								},
							}
						}
					)
						.exec()
						.then(data => {
							if (data.nModified == 1) {
								res.status(200).json("PASSWORD_RESET");
							} else {
								res.status(401).json("PASSWORD_NOT_RESET");
							}
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
				});
			} else {
				res.status(404).json("User Not Found");
			}
		})
		.catch(err => {
			// console.log('update user status error ',err);
			res.status(500).json({
				error: err
			});
		});
};

exports.user_update_password_withoutotp_username = (req, res, next) => {
	User.findOne({ username: req.params.username })
		.exec()
		.then(user => {
			// console.log("user ", user);
			if (user) {
				bcrypt.hash(req.body.pwd, 10, (err, hash) => {
					User.updateOne(
						{ username: req.params.username },
						{
							$set: {
								services: {
									password: {
										bcrypt: hash
									},
								},
							}
						}
					)
						.exec()
						.then(data => {
							if (data.nModified == 1) {
								res.status(200).json("PASSWORD_RESET");
							} else {
								res.status(401).json("PASSWORD_NOT_RESET");
							}
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
				});
			} else {
				res.status(404).json("User Not Found");
			}
		})
		.catch(err => {
			// console.log('update user status error ',err);
			res.status(500).json({
				error: err
			});
		});
};

exports.user_update_password_with_emailOTP_ID = (req, res, next) => {
	User.findOne({
		"_id": req.params.ID,
		"profile.otpEmail": req.body.emailOTP
	})
		.exec()
		.then(user => {
			if (user) {
				bcrypt.hash(req.body.pwd, 10, (err, hash) => {
					User.updateOne(
						{ _id: req.params.ID },
						{
							$set: {
								services: {
									password: {
										bcrypt: hash
									},
								},
							}
						}
					)
						.exec()
						.then(data => {
							if (data.nModified == 1) {
								res.status(200).json("PASSWORD_RESET");
							} else {
								res.status(401).json("PASSWORD_NOT_RESET");
							}
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
				});
			} else {
				res.status(404).json({ message: "User Not Found or Otp Didnt match" });
			}
		})
		.catch(err => {
			// console.log('update user status error ',err);
			res.status(500).json({
				error: err
			});
		});
};

exports.user_update_password_with_emailOTP_username = (req, res, next) => {
	User.findOne({
		"username": req.params.username,
		"profile.otpEmail": req.body.emailOTP
	})
		.exec()
		.then(user => {
			if (user) {
				bcrypt.hash(req.body.pwd, 10, (err, hash) => {
					User.updateOne(
						{ "username": req.params.username },
						{
							$set: {
								services: {
									password: {
										bcrypt: hash
									},
								},
							}
						}
					)
						.exec()
						.then(data => {
							if (data.nModified == 1) {
								res.status(200).json("PASSWORD_RESET");
							} else {
								res.status(401).json("PASSWORD_NOT_RESET");
							}
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
				});
			} else {
				res.status(404).json({ message: "User Not Found or Otp Didnt match" });
			}
		})
		.catch(err => {
			// console.log('update user status error ',err);
			res.status(500).json({
				error: err
			});
		});
};

exports.set_send_emailotp_usingID = (req, res, next) => {
	var otpEmail = getRandomInt(1000, 9999);
	User.updateOne(
		{ _id: req.params.ID },
		{
			$set: {
				"profile.otpEmail": otpEmail,
			},
		}
	)
		.exec()
		.then(data => {
			if (data.nModified === 1) {
				User.findOne({ _id: req.params.ID })
					.then(user => {
						if (user) {
							main();
							async function main(){ 
								var sendMail = await sendEmail(user.profile.email,req.body.emailSubject,req.body.emailContent + " Your OTP is " + otpEmail);
								res.status(200).json({ message: "OTP_UPDATED", ID: user._id })
							 }
						} else {
							res.status(200).json({ message: "User not found" });
						}
					})
					.catch(err => {
						// console.log('user error ', err);
						res.status(500).json({
							message: "Failed to find User",
							error: err
						});
					});
			} else {
				// console.log("data not modified");
				res.status(401).json({ message: "OTP_NOT_UPDATED" })
			}
		})
		.catch(err => {
			// console.log('user error ', err);
			res.status(500).json({
				message: "Failed to update User",
				error: err
			});
		});
};





exports.set_send_mobileotp_usingID = (req, res, next) => {
	User.findOne({ _id: req.params.ID})
	.then(user => {
		if(user){
			var optMobile = 1234;
			User.updateOne(
			{ _id: req.params.ID},
			{
				$set: {
					"profile.otpEmail": optMobile,
				},
			})
			.exec()
			.then(data => {
				// if (data.nModified === 1) {
					res.status(201).json({ message: "OTP_UPDATED", userID: user._id })
				// } else {
				// 	res.status(200).json({ message: "OTP_NOT_UPDATED" })
				// }
			})
			.catch(err => {
				res.status(500).json({
					message: "Failed to update User",
					error: err
				});
			});
		}else{
			res.status(200).json({ message: "NOT_REGISTER" })
		}
	})
	.catch(err => {
		res.status(500).json({
			message: "Failed to find User",
			error: err
		});
	});
};

function sendEmail(toEmail,subject,content){
   
    // async function main() { 
      GlobalMaster.findOne({type:'EMAIL'})
        .exec() 
        .then(data=>{
            const senderEmail = data.user;
            const senderEmailPwd = data.password;
            // create reusable transporter object using the default SMTP transport
              let transporter = nodeMailer.createTransport({
                host: data.emailHost,
                port: data.port,
                // secure: false, // true for 465, false for other ports
                auth: {
                  user: senderEmail, 
                  pass: senderEmailPwd 
                }
              });

              // send mail with defined transport object
              var mailOptions = {
                    from: data.projectName+' <' + senderEmail + '>', // sender address
                    to: toEmail, // list of receiver
                    subject: subject, // Subject line
                    html: "<pre>" + content + "</pre>", // html body
                };
               let info =  transporter.sendMail(mailOptions, (error, info) => {
                    // console.log("Message sent: %s", error,info);
                });
             
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // console.log("Message sent: %s", info.messageId);
              // Preview only available when sending through an Ethereal account
              // console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              
            

        })
        .catch(err =>{
            console.log('mail error=>',err)
        });
         // main().catch(err=>{console.log('mail error=>',err)});
      
   // }
   
}


exports.set_send_emailotp_usingEmail = (req, res, next) => {
	User.findOne({ "profile.email": req.params.emailId })
	.then(user => {
		if(user){
			// console.log('user status====',user.profile.status)
 			if ((user.profile.status).toLowerCase() === "active") {
 				var optEmail = getRandomInt(1000, 9999);
				// console.log("optEmail", optEmail, req.body);
				User.updateOne(
					{ "profile.email": req.params.emailId },
					{
						$set: {
							"profile.otpEmail": optEmail,
						},
					}
				)
				.exec()
				.then(data => {
					if (data.nModified === 1) {
						User.findOne({ "profile.email": req.params.emailId })
							.then(user => {
								if (user) {
									main();
									async function main(){ 
										var sendMail = await sendEmail(req.params.emailId,req.body.emailSubject,req.body.emailContent + " Please enter this otp " + optEmail+ " to reset your password");
										res.status(200).json({ message: "OTP_UPDATED", ID: user._id,profile:user.profile })
									 }
								} else {
									res.status(200).json({ message: "User not found" });
								}
							})
							.catch(err => {
								res.status(500).json({
									message: "Failed to find User",
									error: err
								});
							});
					} else {
						res.status(401).json({ message: "OTP_NOT_UPDATED" })
					}
				})
				.catch(err => {
					res.status(500).json({
						message: "Failed to update User",
						error: err
					});
				});
 			}else if ((user.profile.status).toLowerCase() == "blocked") {
				// console.log("user.USER_BLOCK IN ==>")
				res.status(200).json({ message: "USER_BLOCK" });
			} else if ((user.profile.status).toLowerCase() == "unverified") {
				res.status(200).json({ message: "USER_UNVERIFIED" });
			}
		}else{
			res.status(200).json({ message: "NOT_REGISTER" })
		}		
	})
	.catch(err => {
		res.status(500).json({
			message: "Failed to find User",
			error: err
		});
	});				
};


exports.set_send_mobileotp_usingMobile = (req, res, next) => {
	User.findOne({ "profile.mobile": req.params.mobileNo })
	.then(user => {
		if(user){
			var optMobile = 1234;
			User.updateOne(
			{ "profile.mobile": req.params.mobileNo },
			{
				$set: {
					"profile.otpEmail": optMobile,
				},
			})
			.exec()
			.then(data => {
				// if (data.nModified === 1) {
					res.status(201).json({ message: "OTP_UPDATED", userID: user._id })
				// } else {
				// 	res.status(200).json({ message: "OTP_NOT_UPDATED" })
				// }
			})
			.catch(err => {
				res.status(500).json({
					message: "Failed to update User",
					error: err
				});
			});
		}else{
			res.status(200).json({ message: "NOT_REGISTER" })
		}
	})
	.catch(err => {
		res.status(500).json({
			message: "Failed to find User",
			error: err
		});
	});	
};



exports.user_login_mob_email = (req, res, next) => {
	console.log("user_login_using_email req.body = ",req.body);
	// console.log("=================");
	var username = (req.body.username).toLowerCase(); 
	// if(username.includes(" ")){
	// 	username = username.split(" ")[1];
	// }
	var role = (req.body.role).toLowerCase();
	User.findOne({$or:[
			{"profile.mobile" : username},
			{$and:[
				{"profile.email"  :  username},
				{"profile.email"  :  {$ne:''}},
				{"authService"  :  {$eq:''}}
			]
			},
		],"roles": role}
	)
		.exec()
		.then(user => {
			console.log("user",user)
			if (user) {
				if ((user.profile.status).toLowerCase() == "active") {
					var pwd = user.services.password.bcrypt;
					// console.log('pwd', pwd);
					if (pwd) {
						bcrypt.compare(req.body.password, pwd, (err, result) => {
							if (err) {
								return res.status(200).json({
									message: 'INVALID_PASSWORD'
								});
							}
							if (result) {
								const token = jwt.sign({
									email: req.body.email,
									userId: user._id,
								}, globalVariable.JWT_KEY,
									{
										// expiresIn: "365d"
										expiresIn: globalVariable.timeOutLimitSecs
									}
								);

								User.updateOne(
									{ "_id": ObjectID(user._id)},
									{
										$push: {
											"services.resume.loginTokens": {
												whenLogin: new Date(),
												loginTimeStamp: new Date(),
												hashedToken: token
											}
										}
									}
								)
									.exec()
									.then(updateUser => {
										console.log("updateUser ==>",updateUser)
										if (updateUser.nModified == 1) {
											res.status(200).json({
												message: 'Login Auth Successful',
												token: token,
												roles: user.roles,
												ID: user._id,
												loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
												companyID: user.profile.companyID,
												authService:user.authService,
												userDetails: {
													firstName: user.profile.firstname,
													lastName: user.profile.lastname,
													email: user.profile.email,
													countryCode : user.profile.countryCode,
													phone: user.profile.phone,
													city: user.profile.city,
													deliveryAddress: user.deliveryAddress,
													pincode: user.profile.pincode,
													companyID: user.profile.companyID,
													company_id: user.profile.company_id,
													companyName: user.profile.companyName,
													locationID: user.profile.locationID,
													user_id: user._id,
													roles: user.roles,
													token: token,
												}
											});
										} else {
											return res.status(200).json({
												message: 'INVALID_PASSWORD'
											});
										}
									})

									.catch(err => {
										console.log("500 err ", err);
										res.status(500).json({
											message: "Failed to save token",
											error: err
										});
									});
							} else {
								return res.status(200).json({
									message: 'INVALID_PASSWORD'
								});
							}
						})
					} else {
						res.status(200).json({ message: "INVALID_PASSWORD" });
					}
				} else if ((user.profile.status).toLowerCase() == "blocked") {
					res.status(200).json({ message: "USER_BLOCK" });
				} else if ((user.profile.status).toLowerCase() == "unverified") {
					// res.status(200).json({ message: "USER_UNVERIFIED" });
					var emailOTP = getRandomInt(1000, 9999);
					// console.log("emailOTP ===>",emailOTP);
					User.updateOne(
						{ "username": emailId.toLowerCase() },
						{
							$set: {
								"profile.otpEmail": emailOTP,
							}
						}
					)
						.exec()
						.then(data => {
							// console.log("emailOTP  data===>",data);
							if (data.nModified === 1) {
								User.find({ "profile.email": emailId.toLowerCase() })
									.exec()
									.then(usersdata => {
										// console.log("emailOTP  data===>",usersdata[0].profile);
											res.status(200).json({
												message: 'USER_UNVERIFIED',
												userDetails: {
													firstName: usersdata[0].profile.fullName,
													email: usersdata[0].profile.email,
													otpEmail: usersdata[0].profile.otpEmail,
													phone: usersdata[0].profile.phone,
													user_id: usersdata[0]._id,
													roles: usersdata[0].roles,
												}
											});
									});
							} else {
								res.status(200).json({ message: "SUCCESS_OTP_NOT_RESET" });
							}
						})
						.catch(err => {
							console.log('user error ', err);
							res.status(500).json({
								message: "Failed to update Email OTP",
								error: err
							});
						})
					
				}
			} else {
				res.status(200).json({ message: "NOT_REGISTER" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				message: "Failed to find the User",
				error: err
			});
		});
};



exports.user_signup_social_media = (req, res, next) => {
	console.log("req body",req.body);
		if(req.body.pwd && req.body.role) {
			var userRole = (req.body.role).toLowerCase();
			if (userRole) {
				Role.findOne({ role: userRole })
					.exec()
					.then(role => {
						if (role) {
							User.findOne({
									$and:[
											{"profile.email"  :  req.body.email},
											{"profile.email"  :  {$ne:''}}
										]
									},
								)
								.exec()
								.then(async(user) => {
									var username = '';
									if(req.body.authService === "google"){
										username = req.body.email 
									}else if(req.body.authService === "facebook"){
										var users = await User.findOne({'authService':'facebook'}).sort({_id:-1}).limit(1) 
										username = users ? parseInt(users.username)+1 : 1;
									}
									if (user) {
										const token = jwt.sign({
											username: req.body.username,
											userId: user._id,
										}, globalVariable.JWT_KEY,
											{
												expiresIn: globalVariable.timeOutLimitSecs
											}
										);
										res.status(200).json({
											message: 'Login Auth Successful',
											token: token,
											roles: user.roles,
											ID: user._id,
											loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
											companyID: user.profile.companyID,
											authService:user.authService,
											userDetails: {
												firstName: user.profile.firstname,
												lastName: user.profile.lastname,
												email: user.profile.email,
												countryCode : user.profile.countryCode,
												phone: user.profile.phone,
												city: user.profile.city,
												deliveryAddress: user.deliveryAddress,
												pincode: user.profile.pincode,
												companyID: user.profile.companyID,
												company_id: user.profile.company_id,
												companyName: user.profile.companyName,
												locationID: user.profile.locationID,
												user_id: user._id,
												roles: user.roles,
												token: token,
											}
										});
									} else {
										
										// console.log("username",username)
										bcrypt.hash(username.toString(), 10, (err, hash) => {
											if (err) {
												console.log("err",err);
												return res.status(500).json({
													message: "Failed to match the password",
													error: err
												});
											} else {
												var emailOTP = getRandomInt(1000, 9999);
												if (emailOTP) {
													const user = new User({
														_id: new mongoose.Types.ObjectId(),
														createdAt: new Date,
														services: {
															password: {
																bcrypt: hash

															},
														},
														username: username ? username: '',
														authService : req.body.authService,
														profile:
														{
															firstname : req.body.firstname,
															lastname: req.body.lastname,
															fullName: req.body.firstname + ' ' + req.body.lastname,
															email: req.body.email ? req.body.email.toLowerCase() : '',
															companyID: req.body.companyID,
															pincode: req.body.pincode,
															companyName: req.body.companyName,
															mobile: req.body.mobNumber,
															createdAt: new Date(),
															otpEmail: 1234,
															countryCode : req.body.countryCode,
															status: req.body.status ? req.body.status : "Inactive",
															createdBy: req.body.createdBy,
														},
														roles: [userRole]
													});
													if (!req.body.firstname) {
														user.profile.fullName = req.body.fullName;
													}
													user.save()
														.then(result => {
															if (result) {
																const token = jwt.sign({
																	username: username,
																	userId: user._id,
																}, globalVariable.JWT_KEY,
																	{
																		expiresIn: globalVariable.timeOutLimitSecs
																	}
																);
								
															User.updateOne(
																{ "_id": ObjectID(result._id)},
																{
																	$push: {
																		"services.resume.loginTokens": {
																			whenLogin: new Date(),
																			loginTimeStamp: new Date(),
																			hashedToken: token
																		}
																	}
																}
															)
																.exec()
																.then(updateUser => {
																	if (updateUser.nModified == 1) {
																		res.status(200).json({
																			message: 'Login Auth Successful',
																			token: token,
																			roles: user.roles,
																			ID: user._id,
																			loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
																			companyID: user.profile.companyID,
																			authService:user.authService,
																			userDetails: {
																				firstName: user.profile.firstname,
																				lastName: user.profile.lastname,
																				email: user.profile.email,
																				countryCode : user.profile.countryCode,
																				phone: user.profile.phone,
																				city: user.profile.city,
																				deliveryAddress: user.deliveryAddress,
																				pincode: user.profile.pincode,
																				companyID: user.profile.companyID,
																				company_id: user.profile.company_id,
																				companyName: user.profile.companyName,
																				locationID: user.profile.locationID,
																				user_id: user._id,
																				roles: user.roles,
																				token: token,
																			}
																		});
																	} else {
																		return res.status(200).json({
																			message: 'INVALID_PASSWORD'
																		});
																	}
																})
							
																.catch(err => {
																	console.log("500 err ", err);
																	res.status(500).json({
																		message: "Failed to save token",
																		error: err
																	});
																});
															}else {
																res.status(200).json({ message: "USER_NOT_CREATED"})
															}
														})
														.catch(err => {
															console.log(err);
															res.status(500).json({
																message: "Failed to save User Details",
																error: err
															});
														});
												}
											}
										});
									}
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exits" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		} else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
};



exports.user_signup_guest_login = (req, res, next) => {
	console.log("req body",req.body);
		if(req.body.pwd && req.body.role) {
			var userRole = (req.body.role).toLowerCase();
			if (userRole) {
				Role.findOne({ role: userRole })
					.exec()
					.then(role => {
						if (role) {
							User.findOne({'authService':'guest'}).sort({_id:-1}).limit(1)
							.exec()
							.then(users => {
								console.log("users",users);
									bcrypt.hash(req.body.pwd, 10, (err, hash) => {
										if (err) {
											console.log("err",err);
											return res.status(500).json({
												message: "Failed to match the password",
												error: err
											});
										} else {
											var emailOTP = getRandomInt(1000, 9999);
											var username = users ? parseInt(users.username)+1 :1;
											if (emailOTP) {
												const user = new User({
													_id: new mongoose.Types.ObjectId(),
													createdAt: new Date,
													services: {
														password: {
															bcrypt: hash

														},
													},
													username: username,
													authService : req.body.authService,
													profile:
													{
														firstname : req.body.firstname,
														lastname: req.body.lastname,
														fullName: req.body.firstname + ' ' + req.body.lastname,
														email: req.body.email ? req.body.email.toLowerCase() : '',
														companyID: req.body.companyID,
														pincode: req.body.pincode,
														companyName: req.body.companyName,
														mobile: req.body.mobNumber,
														createdAt: new Date(),
														otpEmail: 1234,
														countryCode : req.body.countryCode,
														status: req.body.status ? req.body.status : "Inactive",
														createdBy: req.body.createdBy,
													},
													roles: [userRole]
												});
												if (!req.body.firstname) {
													user.profile.fullName = req.body.fullName;
												}
												user.save()
													.then(result => {
														if (result) {
															const token = jwt.sign({
																email: username,
																userId: user._id,
															}, globalVariable.JWT_KEY,
																{
																	// expiresIn: "365d"
																	expiresIn: globalVariable.timeOutLimitSecs
																}
															);
							
														User.updateOne(
															{ "_id": ObjectID(result._id)},
															{
																$push: {
																	"services.resume.loginTokens": {
																		whenLogin: new Date(),
																		loginTimeStamp: new Date(),
																		hashedToken: token
																	}
																}
															}
														)
															.exec()
															.then(updateUser => {
																if (updateUser.nModified == 1) {
																	res.status(200).json({
																		message: 'Login Auth Successful',
																		token: token,
																		roles: user.roles,
																		ID: user._id,
																		loginTokens: (user.services.resume.loginTokens).slice(-1)[0],
																		companyID: user.profile.companyID,
																		authService : user.authService,
																		userDetails: {
																			firstName: user.profile.firstname,
																			lastName: user.profile.lastname,
																			email: user.profile.email,
																			countryCode : user.profile.countryCode,
																			phone: user.profile.phone,
																			city: user.profile.city,
																			deliveryAddress: user.deliveryAddress,
																			pincode: user.profile.pincode,
																			companyID: user.profile.companyID,
																			company_id: user.profile.company_id,
																			companyName: user.profile.companyName,
																			locationID: user.profile.locationID,
																			user_id: user._id,
																			roles: user.roles,
																			token: token,
																		}
																	});
																} else {
																	return res.status(200).json({
																		message: 'INVALID_PASSWORD'
																	});
																}
															})
						
															.catch(err => {
																console.log("500 err ", err);
																res.status(500).json({
																	message: "Failed to save token",
																	error: err
																});
															});
														}else {
															res.status(200).json({ message: "USER_NOT_CREATED"})
														}
													})
													.catch(err => {
														console.log(err);
														res.status(500).json({
															message: "Failed to save User Details",
															error: err
														});
													});
											}
										}
									});
								})
								.catch(err => {
									console.log(err);
									res.status(500).json({
										message: "Failed which finding the User",
										error: err
									});
								});
						} else {
							res.status(200).json({ message: "Role does not exits" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							message: "Failed when trying to find Role",
							error: err
						});
					});
			}
		} else {
			res.status(200).json({ message: "Email, pwd and role are mandatory" });
		}
};



exports.set_send_otp = (req, res, next) => {
	console.log("re body",req.body);
	User.findOne({$or:[
		{"profile.mobile" : req.params.username},
		{$and:[
			{"profile.email"  :  req.params.username},
			{"profile.email"  :  {$ne:''}}
		]
		}]}
	)
	.then(user => {
		if(user){
			console.log('user status====',user)
 			if ((user.profile.status).toLowerCase() === "active") {
 				var optEmail = getRandomInt(1000, 9999);
				// console.log("optEmail", optEmail, req.body);
				User.updateOne(
					{ "_id": ObjectID(user._id)},
					{
						$set: {
							"profile.otpEmail": '1234',
						},
					}
				)
				.exec()
				.then(data => {
					console.log("data",data);
					if (data.nModified === 1) {
						res.status(200).json({ message: "OTP_UPDATED", ID: user._id,profile:user.profile })
					} else {
						res.status(200).json({ message: "OTP_NOT_UPDATED", ID: user._id,profile:user.profile })
					}
				})
				.catch(err => {
					res.status(500).json({
						message: "Failed to update User",
						error: err
					});
				});
 			}else if ((user.profile.status).toLowerCase() == "blocked") {
				// console.log("user.USER_BLOCK IN ==>")
				res.status(200).json({ message: "USER_BLOCK" });
			} else if ((user.profile.status).toLowerCase() == "unverified") {
				res.status(200).json({ message: "USER_UNVERIFIED" });
			}
		}else{
			res.status(200).json({ message: "NOT_REGISTER" })
		}		
	})
	.catch(err => {
		console.log("err",err)
		res.status(500).json({
			message: "Failed to find User",
			error: err
		});
	});				
};
