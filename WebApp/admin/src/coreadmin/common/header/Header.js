import React, { Component } from 'react';
import { render } 			from 'react-dom';
import { withRouter } 		from 'react-router-dom';
import $ 					from "jquery";
import axios 				from 'axios';
import swal 				from 'sweetalert';
import Rightsidebar 		from '../rightSidebar/Rightsidebar.js';
import { BrowserRouter, Route, Switch, Link, location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Header.css';

class Header2 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			showNotification: false,
			inAppNotifications: [],
			inAppNotificationsCount: 0

		}
	}
	// componentDidMount(){
	//   if ( !$('body').hasClass('adminLte')) {
	//     var adminLte = document.createElement("script");
	//     adminLte.type="text/javascript";
	//     adminLte.src = "/js/adminLte.js";
	//     $("body").append(adminLte);
	//   }
	//   $("html,body").scrollTop(0);

	//   //======= User Details ==========
	//   var userDetails = JSON.parse(localStorage.getItem("userDetails")) ;
	//   const Token     = userDetails.token;

	//   // console.log("userDetails = ", userDetails);

	//   if(Token){
	//     axios.get('/api/entitymaster/get/one/companyName/1')
	//         .then(companyDetails=>{
	//             // console.log("companyDetails = ", companyDetails.data);
	//             this.setState({
	//                 user_ID       : userDetails.user_id,
	//                 email         : userDetails.email,
	//                 profileImage  : userDetails.image,
	//                 fullname      : userDetails.firstName+' '+userDetails.lastName,
	//                 companyID     : userDetails.companyID,
	//                 companyName   : companyDetails.data.companyName,
	//               },()=>{
	//                 // console.log("this.state.fullname = ",this.state.fullname);
	//               });

	//         //======= Notification Unread Count ==========
	//         axios.get('/api/notifications/get/list/Unread/'+userDetails.user_id)
	//             .then(notifications => {

	//             this.setState({
	//                 inAppNotifications: notifications.data ,
	//                 inAppNotificationsCount    : notifications.data.length
	//               });

	//             })
	//             .catch(error => {
	//               console.log("Error in /api/notifications/get/list/Unread/ = ",error);
	//             })

	//         })
	//         .catch(error => {
	//           console.log("Error in /api/notifications/get/list/Unread/ = ",error);
	//         });

	//   }else{
	//     this.props.history.push("/login");
	//   }


	// }
	// 
	componentDidMount() {
		if (!$('body').hasClass('adminLte')) {
			var adminLte = document.createElement("script");
			adminLte.type = "text/javascript";
			adminLte.src = "/js/adminLte.js";
			$("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
		// const userDetails = localStorage.getItem("userDetails");
		// const parsedData =  JSON.parse(userDetails);

		var userDetails 	= JSON.parse(localStorage.getItem("userDetails"));
		var token  			= userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
		

		axios.get('/api/users/get/' + userDetails.user_id)
		.then((res) => {
			this.setState({
				userImage: res.data.image
			});
		})
		.catch((error) => {
			console.log("error => ",error);
		})
		this.userdata();

		axios.get("/api/entitymaster/get/appCompany")
		.then((response) => {
			console.log("/api/entitymaster/get/appCompany response.data = ", response.data);
			if (response.data.length > 0) {
				
				this.setState({
					entityList: response.data,
					entityID: response.data[0]._id
				}, () => {
					this.getCompanyData(this.state.entityID)
				})
			} else {
				this.props.history.push('/appCompany/basic-details');
			}
		})
		.catch((error) => {
			console.log("Error in /api/entitymaster/get/appCompany = ", error);
			// console.log("error => ",error);
			if (error.message === "Request failed with status code 401") {
				var userDetails = localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({
					title 	: "Your Session is expired.",
					text 	: "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})
		//======= Notification Unread Count ==========
		console.log('notifications/get /list userdetail id ==>', userDetails)
		axios.get('/api/notifications/get/list/Unread/' + userDetails.user_id)
		.then(notifications => {
			console.log('notifications', notifications)
			this.setState({
				inAppNotifications 		: notifications.data,
				inAppNotificationsCount : notifications.data.length
			},()=>{
				console.log("inAppNotifications => ",this.state.inAppNotifications)
				console.log("inAppNotificationsCount => ",this.state.inAppNotificationsCount)
			});
		})
		.catch(error => {
			console.locationog("Error in /api/notifications/get/list/Unread/ = ", error);
		})
		.catch(error => {
			console.log("Error in /api/notifications/get/list/Unread/ = ", error);
		});
		
	}

	getCompanyData(entityID) {
		axios.get("/api/entitymaster/get/one/" + entityID)
			.then((response) => {
				console.log(" /api/entitymaster/get/one/ response.data = ", response.data);
				this.setState({
					corporateInfo: response.data[0],
					locations: response.data[0].locations,
					contacts: response.data[0].contactData,
				})
			})
			.catch((error) => {
				console.log("Error in /api/entitymaster/get/one/ = ", error);
				// console.log("error => ",error);
				if (error.message === "Request failed with status code 401") {
					var userDetails = localStorage.removeItem("userDetails");
					localStorage.clear();
					swal({
						title: "Your Session is expired.",
						text: "You need to login again. Click OK to go to Login Page"
					})
						.then(okay => {
							if (okay) {
								window.location.href = "/login";
							}
						});
				}
			})
	}

	userdata() {
		//======= User Details ==========
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var Token = userDetails.token;
		console.log("userDetails => ",userDetails);

		if (Token) {
			// var comapanyID = parseInt(1)

			console.log("userData.userDetails===>",userDetails.companyID)

			axios.get('/api/entitymaster/get/companyName/1')
				.then(companyDetails => {
					console.log("companyDetails = ", companyDetails.data);
					this.setState({
						user_ID 		: userDetails.user_id,
						email 			: userDetails.email,
						profileImage 	: userDetails.image,
						fullname 		: userDetails.firstName + ' ' + userDetails.lastName,
						companyID 		: userDetails.companyID,
						companyName 	: companyDetails.data.companyName,
					}, () => {
						console.log("this.state.fullname = ", this.state.fullname);
					});

					// ======= Notification Unread Count ==========
					// axios.get('/api/notifications/get/list/Unread/'+userDetails.user_id)
					axios.get('/api/notifications/get/list/Unread/' + userDetails.user_id)
						.then(notifications => {

							this.setState({
								inAppNotifications 		: notifications.data,
								inAppNotificationsCount : notifications.data.length
							}, () => {
								console.log("inAppNotificationsCount ==>", this.state.inAppNotificationsCount)
							});

						})
						.catch(error => {
							console.log("Error in /api/notifications/get/list/Unread/ = ", error);
						})

				})
				.catch(error => {
					console.log("Error  = ", error);
					// console.log("error => ",error);
					if (error.message === "Request failed with status code 401") {
						var userDetails = localStorage.removeItem("userDetails");
						localStorage.clear();
						swal({
							title: "Your Session is expired.",
							text: "You need to login again. Click OK to go to Login Page"
						})
							.then(okay => {
								if (okay) {
									window.location.href = "/login";
								}
							});
					}
				});

		} else {
			this.props.history.push("/login");
		}
	}
	componentWillReceiveProps(nextProps) {
		this.userdata();
		const user_ID = localStorage.getItem("user_ID");
		axios.get('/api/notifications/get/list/Unread/' + user_ID)
			.then(notifications => {
				console.log("notifications ==> ", notifications)
				this.setState({
					inAppNotifications: notifications.data,
					inAppNotificationsCount: notifications.data.length
				})
			})
			.catch(error => {
			})
	}
	componentWillUnmount() {
		$("script[src='/js/adminLte.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}

	openNav() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}

	toggleLeftNav(event) {
		event.preventDefault()
		$('#sidebar').toggleClass('active')
		$('#headerid').toggleClass('headereffect');
		$('#dashbordid').toggleClass('dashboardeffect')
		var sideBar = $("#sidebar").hasClass("active")
		localStorage.setItem('sideBar', sideBar);

	}

	toggleNav(event) {
		event.preventDefault()
		var currentWidth = document.getElementById("mySidenav").style.width;
		if (currentWidth == "230px") {
			document.getElementById("mySidenav").style.width = "0";
		} else {
			document.getElementById("mySidenav").style.width = "230px";
		}
	}

	logout(event) {
		event.preventDefault();
		console.log("in Logout function");

		$("script[src='/js/adminLte.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
		// var token = localStorage.getItem("token");
		// var usersData = localStorage.getItem('userDetails');
		// var UserDetail = JSON.parse(usersData);

		var userDetails = JSON.parse(localStorage.getItem("userDetails"));

		var loginTokensLastID = localStorage.getItem('loginTokensLastID');
		axios.post('/api/users/post/logout', { "emailId": userDetails.email, "token": userDetails.token, user_ID: userDetails.user_id })
			.then(notifications => {
				console.log(" Logout response => ",notifications.data);
				if (userDetails.token !== null) {
					this.setState({
						loggedIn: false
					}, () => {
						localStorage.clear();
						window.location = "/login";
					})
				}
			})
			.catch(error => {
				console.log('logout error: ==> ', error)
			})

	}
	LogoutSectionHover(event) {
		$(".colorboxbefore").toggleClass("colorbox");
		$('.showme').toggle();
	}

	bellNotification(event) {
		$('.bellnotification').toggle();
		const user_ID = localStorage.getItem("user_ID");
		console.log('user_ID   => ', user_ID)
		axios.get('/api/notifications/get/list/Unread/' + user_ID)
			.then(notifications => {
				console.log('notifications: ==> ', notifications)
				this.setState({ 
					inAppNotifications 		: notifications.data, 
					inAppNotificationsCount : notifications.data.length 
				})
			})
			.catch(error => {
				console.log('notifications error: ==> ', error)
			})
	}
	viewAll(id, event) {
		console.log("inside view all ", id)
		$('.bellnotification').toggle();
		axios.put('/api/notifications/put/' + id)
			.then((res) => {
				this.props.history.push("/ViewAllNotification");
			})
			.catch((err) => {
				console.log(err)
			})
	}
	showDropdown(event) {
		$("#showhide").addClass("showhim");
		$("#showhidearrow").addClass("showhim");
	}
	hideDropdown(event) {
		$("#showhide").removeClass("showhim");
		$("#showhidearrow").removeClass("showhim");
	}

	render() {
		return (
			<div className="">
				<header className="main-header newMain-header">
					<a href="javascript:void(0)" className="logo logoOne">
						<span className="logo-mini">
							<a href="/">
								{/*console.log("corporateInfo",this.state.corporateInfo)*/}
								{this.state.corporateInfo ?
									<img className="shortlogo strong" src={this.state.corporateInfo.companyLogo && this.state.corporateInfo.companyLogo.length > 0 ? this.state.corporateInfo.companyLogo[0] : "/images/noImagePreview.png"} ></img>
									:
									<img src="/images/noImagePreview.png" className="shortlogo strong" />
								}
							</a>
						</span>
						<span className="logo-lg">
							<label className="headerImage"><a href='/'><span className="companyName">{this.state.companyName}</span></a></label>
						</span>
					</a>
					<nav className="navbar navbar-static-top" role="navigation">
						<div className="col-lg-3 col-md-4 col-sm-4 col-xs-4 padd0">
							<a href="javascript:void(0)" className="sidebar-toggle marginTop11 marginLeft12" data-toggle="push-menu" role="button">
								<span className="sr-only">
									Toggle navigation
                  </span>
							</a>
						</div>
						<div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 padd0 pull-right">
							<div onClick={this.toggleNav.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right nopadding textAlignCenter onHoverEffect hover">
								<i className="fa fa-cogs headicon "></i>
							</div>
							<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 pull-right padd0">
								<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 pull-right">
									<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 bell_Icon">
										<i className="fa fa-bell btn mt15px" onClick={this.bellNotification.bind(this)} aria-hidden="true"></i>
										<h1><span class="label label-default badgeClass">{this.state.inAppNotificationsCount}</span></h1>
										<div className="col-lg-12 col-md-12  bellnotification">
											{/* <p>You have {this.state.inAppNotificationsCount} notifications</p> */}
											<div className="msgnotification col-lg-12 col-md-12 " >
												<div className="user-notification col-lg-11 col-md-6" >
													Notifications
                            </div>
												<div className="user-closernoti col-lg-1 col-md-6" >
													<p className="text-center closeMr" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)} title="Close">
														X
                              </p>
												</div>
											</div>
											<div className="profiledetails">
												{this.state.inAppNotifications && this.state.inAppNotifications.length > 0 ?
													this.state.inAppNotifications.map((data, index) => {
														// console.log("notifications data ==> ",data)
														return (
															<div className="msgborderbtm" key={index} id={data._id} onClick={this.viewAll.bind(this, data._id)}>
																<div dangerouslySetInnerHTML={{ __html: data.notifBody }} />
															</div>
														)
													})
													:
													<div >
														<div>
															<p>You have no notifications</p>
														</div>

													</div>
												}
											</div>
										</div>
									</div>
									{/* <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 pull-right bellicon hover" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)}>
                        <div className="notification">
                          { 
                            this.state.inAppNotificationsCount > 0 ?
                              this.state.inAppNotificationsCount < 9 ?
                                <span className="badge"> 
                                  {this.state.inAppNotificationsCount}
                                </span>
                              :
                                <span className="badge"> 
                                  9
                                <i className="fa fa-plus font-size: 3px font-weight:lighter"  aria-hidden="true"></i>
                                </span>
                              :
                              null  
                          }
                          <img src="../images/bell-2.png" className="img" />
                        </div>
                      </div> 
                       <div className="arrow-up bellnotification"></div>
                      <div className="col-lg-12 col-md-12  bellnotification">
                        <div className="msgnotification col-lg-12 col-md-12 " >
                             <div className="user-notification col-lg-11 col-md-6" >
                              Notifications
                            </div>
                            <div className="user-closernoti col-lg-1 col-md-6" >
                              <p className="text-center" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)} title="Close">
                                X
                              </p>
                            </div>
                        </div>
                        <div className="profiledetails user-footer">
                        {/* {
                          this.state.inAppNotifications ?
                          this.state.inAppNotifications.length > 0 ?
                            this.state.inAppNotifications.map((data, index) => {
                              
                               return (
                                  <div className="msgborderbtm" key={index}>
                                      <div dangerouslySetInnerHTML={{__html: data.notifMessage}} />
                                  </div>
                               )
                            })
                            
                            :
                            <div >
                                <div>
                                    <p>You have no notifications</p>
                                </div>

                            </div>
                        :
                          null
                          }    
                        </div>
                      </div> */}
									<div className="col-lg-9 col-md-7 col-sm-9 col-xs-12  hover logoutAct pull-right">
										<div className="row hover" onClick={this.LogoutSectionHover.bind(this)}>
											<span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText onHoverEffect ">
												<span className="col-lg-11 nopadding ">
													{/*console.log("userImage 366",this.state.userImage)*/}

													<img src={this.state.userImage ? this.state.userImage : "/images/person.png"} className="userIcon" />
													<label className="mailtext">&nbsp;&nbsp;&nbsp;{this.state.fullname ? this.state.fullname : "No User"}</label>													
												</span>
												<span className="textAlignCenter" style={{ "marginTop": "4px" }}>
												</span>
											</span>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 user-footer showme NOpadding">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding " >

												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  headerImageContainer padd0 ">
													<p className="pull-right fntC1" style={{ "cursor": "pointer" }} title="Close" onClick={this.LogoutSectionHover.bind(this)}>X</p><br />
													<div className=" marLeft " style={{ "backgroundImage": `url(` + (this.state.userImage ? this.state.userImage : "/images/person.png") + `)`, "height": "40%", "backgroundSize": "41% 100%", "background-repeat": "no-repeat" }}></div>
													<div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 marTop pull-right  padd0 ">
														<h5 className="nomargin dropmailtext">
															{this.state.fullname ? this.state.fullname : ""}
														</h5>
														<h6 className=" dropmailtext"> {this.state.email ? this.state.email : ""}</h6>
													</div>
												</div>
											</div>
											<div className="btnDiv col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<span className="">
													<a className="profileTitle btnpadd" href={"/profile/" + this.state.user_ID}>
														<button type="button" className="profilebtn">Profile</button>
													</a>
												</span> &nbsp;
                        						<span className="pull-right">
													<a className="profileTitle btnpadd" href="/login">
														<button type="button" className="logoutbtn" onClick={this.logout.bind(this)}>Sign Out</button>
													</a>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</nav>
				</header>
				<div id="mySidenav" className="sidenav">
					<Rightsidebar />
				</div>
			</div>
		);
	}
}


export default withRouter(Header2);