import React, { Component } from 'react';
import axios from 'axios';
import _ from 'underscore';
import swal from 'sweetalert';
import $ from 'jquery';
import moment from 'moment';
import CreateUser from './CreateUser.js';
import Roles from '../Roles/Roles.js';
import DeletedUsers from './DeletedUsers.js';
// import Roles from '../Roles/Roles.js';
import IAssureTableUM from '../../IAssureTableUM/IAssureTable.jsx';
import UMDelRolRow from './UMDelRolRow.jsx';
import UMAddRolRow from './UMAddRolRow.jsx';
import UMSelectRoleUsers from './UMSelectRoleUsers.jsx';
import './userManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
class UMListOfUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allPosts: [],
			"twoLevelHeader": {
				apply: false,
			},
			"tableHeading": {
				fullName: 'User Details',
				// companyDetails: 'Franchise Details',
				status: 'Status',
				roles: 'Role',
				createdAt: 'Registered Since',
				lastLogin: "Last Login",
				actions: 'Actions',
			},
			"tableObjects": {
				paginationArray: true
			},
			"startRange": 0,
			"limitRange": 10,
			blockActive: "all",
			"listofRoles": "",
			adminRolesListData: [],
			checkedUser: [],
			activeswal: false,
			blockswal: false,
			confirmDel: false,
			unCheckedUser: false,
			isLoadingData:false,
			"tableName" : 'userDetails',
			completeDataCount : 100
		}
		this.handleChange = this.handleChange.bind(this);
		this.getData = this.getData.bind(this);

	}
	handleChange(event) {
		event.preventDefault();
		const target = event.target;
		const name = target.name;
	}
	componentDidMount() {
		

		const user_ID = localStorage.getItem("user_ID");
		var userDetails = (localStorage.getItem('userDetails'));
		var userData = JSON.parse(userDetails);
		// console.log("userData = ", userData);
		const companyID = parseInt(userData.companyID);
		var websiteModel = localStorage.getItem('websiteModel')
		this.setState({
			websiteModel : websiteModel,
			user_ID: user_ID,
			companyID: companyID
		}, () => {
			this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
			// console.log("In componentDidMount =>", data);
			this.getRole();
			this.getCompanies();
		})

	}

	getData(startRange, limitRange, companyID) {
		// console.log("data for getdata",data);
		// console.log("data in table",data);
		this.setState({isLoadingData : true})
		var formValues = {
			startRange : startRange,
			limitRange : limitRange,
			companyID  : this.state.companyID
		}
		console.log("formvalues => ",formValues)
		var tableData = [];
		axios.post('/api/users/post/list', formValues)
			.then((res) => {
				console.log("res.data in getdata==>", res.data);
				if (res.data.message == "COMPANYID_NOT_AVAILABLE") {
					swal({
						title: '',
						text: "Company Id not found.",
					});
				} else {
					// var tableData = res.data.filter((data, i) => {
					// 	return (data.status !== 'deleted-active' && data.status !== 'deleted-blocked' && data.status !== 'deleted');
					// });
					var data = res.data;
					tableData = data.map((a, i) => {
						// console.log('tableData A==>>>', a.createdAt);
						var mobileNumber = a.mobNumber ? a.mobNumber : 'NA'; 

						return {
							_id: a._id,
							fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
								'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + mobileNumber + '</p>',
							// companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
							status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
							roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
							createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
							lastLogin:
								a.lastLogin === null
									?
									// "User Not Yet Login"
									'<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'

									:
									moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'

							// moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.myfunc() data-target=#userDetails-'+a._id+
							// ' title="Show Booking">User Login Details</div>': "-",
						}

					})
				}
				this.setState({
					completeDataCount: 100,
					tableData : tableData,
					isLoadingData : false
				})
			})
			.catch((error) => {
			});
		
	}
	getSearchText(searchText, startRange, limitRange) {
		var data = {
			searchText: searchText,
			startRange: startRange,
			limitRange: limitRange
		}
		axios.post('/api/users/get/searchlist', data)
			.then((res) => {
				var tableData = res.data.filter((data, i) => {
					return (data.status !== 'deleted-active' && data.status !== 'deleted-blocked' && data.status !== 'deleted');
				});
				var tableData = tableData.map((a, i) => {
					return {
						_id: a._id,
						// fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +'<p><i class="fa fa-envelope"></i> &nbsp ' + a.email + '&nbsp <br /> <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
						fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
							'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
						// companyDetails: a.companyName + ' | ' + a.companyID,
						status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
						roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
						createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
						lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY") : "-",
					}
				})
				console.log('tableData', tableData);
				this.setState({
					completeDataCount: res.data.length,
					tableData: tableData,
				})
			})
			.catch((error) => {
			})
		this.setState({
			tableData: []
		});
	}
	activeSelected(checkedUsersList) {
		var username = this.state.username;
		function updateStatus(formValues) {
			return new Promise(function (resolve, reject) {
				axios
					.patch('/api/users/patch/status/' + formValues.selectedUser, formValues)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {
				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}

		mainActive().then(response => {
			if (response) {
				this.setState({
					activeswal: true,
					checkedUser: [],
					unCheckedUser: true
				}, () => {
					$('#userListDropdownId').removeAttr('disabled');
					this.refs.userListDropdown.value = '-'
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
					}
					// this.getData(data)
					checkedUsersList = [];
					if (this.state.activeswal == true) {
						swal(" ", "Account activated successfully");
						this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);

					}
				});
			}
		});
		async function mainActive() {
			var count = 0
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];

				var formValues = {
					selectedUser: selectedId,
					status: 'active',
					username: username,
				}
				var previousStatus = await getUserDetails(selectedId)
				if (previousStatus.data.status === 'active') {
					swal(" ", "Already Status is active");
					$('#userListDropdownId').removeAttr('disabled');
				} else {
					var response = await updateStatus(formValues)
					if (response) {
						var user = await getUserDetails(selectedId)
						if (user) {
							var currentUrl = window.location.hostname
							var url = currentUrl === 'localhost' ? 'http://localhost:3000/' : currentUrl === 'qaadmin-bookstore.iassureit.in/' ? 'http://qaadmin-bookstore.iassureit.in/' : 'http://uatadmin-bookstore.iassureit.in/'
							var msgvariable = {
								'[User]': user.data.firstname + ' ' + user.data.lastname,
								'[user_email_id]': user.data.email,
								'[center_application_URL]': url
							}
							var inputObj = {
								to: user.data.email,
								templateName: 'User - Login Account Activation',
								variables: msgvariable,
							}
							while ((checkedUsersList.length - 1) === i) {
								return Promise.resolve(true);
							}
				
						}
					}
				}
			}
		}
		// var data = {
		// 	"startRange": this.state.startRange,
		// 	"limitRange": this.state.limitRange,
		// 	"companyID": this.state.companyID
		// }
		// this.getData(data);

		//window.location.reload();

}
	blockSelected(checkedUsersList) {
		var username = this.state.username;
		// console.log('checkedUsersList', checkedUsersList);
		function updateStatus(formValues) {
			return new Promise(function (resolve, reject) {
				axios
					.patch('/api/users/patch/status/' + formValues.selectedUser, formValues)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {
				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function sendMail(inputObj) {
			return new Promise(function (resolve, reject) {
				axios
					.post('/api/masternotification/send-mail', inputObj)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		mainBlock().then(response => {
			console.log('res', response);
			if (response) {
				this.setState({
					blockswal: true,
					checkedUser: [],
					unCheckedUser: true
				}, () => {
					$('#userListDropdownId').removeAttr('disabled');
					this.refs.userListDropdown.value = '-'
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
					}
					// this.getData(data)
					checkedUsersList = []
					if (this.state.blockswal === true) {
						swal(" ", "Account blocked successfully");
						this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);

					}
				})
			}
			//here you can update your collection with axios call
		});
		async function mainBlock() {
			var count = 0
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				var formValues = {
					selectedUser: selectedId,
					status: 'blocked',
					username: username,
				}
				var previousStatus = await getUserDetails(selectedId)
				if (previousStatus.data.status === 'blocked') {
					swal(" ", "Already Status is blocked");
					$('#userListDropdownId').removeAttr('disabled');
				} else {
					var response = await updateStatus(formValues);
					if (response) {
						var user = await getUserDetails(selectedId);
						if (user) {
							var msgvariable = {
								'[User]': user.data.firstname + ' ' + user.data.lastname,
								'[user_email_id]': user.data.email
							}
							var inputObj = {
								to: user.data.email,
								templateName: 'User - Login Account Blocked',
								variables: msgvariable,
							}
							while ((checkedUsersList.length - 1) === i) {
								return Promise.resolve(true);
							}
						}

			
					}
				}
			}
		}

		//window.location.reload();
	}
	deleteStatusSelected(checkedUsersList) {
		console.log('checkedUsersList', checkedUsersList);
		var username = this.state.username;
		var status = this.state.status;
		function updateStatus(formValues) {
			return new Promise(function (resolve, reject) {
				axios
					.patch('/api/users/patch/deletestatus', formValues)
					.then((response) => {
						// console.log("response in delete status==>", response.data)
						//window.location.reload();
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {

				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						// console.log("response in delete user==>", response.data)
						resolve(response);
					})
					.catch(function (error) { })
			})
		}
		mainBlock().then(response => {
			// console.log('res', response);
			if (response) {
				this.setState({
					blockswal: true,
					checkedUser: [],
					unCheckedUser: true
				}, () => {
					$('#userListDropdownId').removeAttr('disabled');
					this.refs.userListDropdown.value = '-'
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
					}
					this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
					checkedUsersList = []
					if (this.state.blockswal === true) {
						swal(" ", "Account deleted successfully");
						var data = {
							"startRange": this.state.startRange,
							"limitRange": this.state.limitRange,
							"companyID": this.state.companyID
						}
						this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);

						// window.location.reload();
					}
				})
			}
			//here you can update your collection with axios call
		});
		async function mainBlock() {

			var count = 0
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				// console.log("selectedId sss===>", selectedId);
				var formValues = {
					user_id_tobedeleted: selectedId,
					username: username,
				}
				// console.log("formValues in delete===>", formValues);
				var previousStatus = await getUserDetails(selectedId)
				if (previousStatus.data.status === 'deleted') {
					swal(" ", "Already Status is deleted");
					$('#userListDropdownId').removeAttr('disabled');
				} else {
					var response = await updateStatus(formValues);
					if (response) {
						var user = await getUserDetails(selectedId);
						if (user) {
							var msgvariable = {
								'[User]': user.data.firstname + ' ' + user.data.lastname,
								'[user_email_id]': user.data.email
							}
							var inputObj = {
								to: user.data.email,
								templateName: 'User - Login Account Deleted',
								variables: msgvariable,
							}
							while ((checkedUsersList.length - 1) === i) {
								return Promise.resolve(true);
							}
						}
					}
				}
			}
		}
		//window.location.reload();

	}
	addRoleAssigned(checkedUsersList, selectedValue) {
		var role = selectedValue.split('$')[1];
		function addRole(formValues) {
			return new Promise(function (resolve, reject) {
				if (formValues) {
					axios
						.patch('/api/users/patch/role/assign/' + formValues.userID, formValues)
						.then(
							(res) => {
								resolve(res);
							}).catch((error) => {
							});
				}
			})
		}
		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {
				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function sendMail(inputObj) {
			return new Promise(function (resolve, reject) {
				axios
					.post('/api/masternotification/send-mail', inputObj)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		var changed = 0;
		mainBlock().then(response => {
			// console.log('res', response);
			if (response) {
				this.setState({
					checkedUser: [],
					unCheckedUser: true
				}, () => {

					$('#userListDropdownId').removeAttr('disabled')
					this.refs.userListDropdown.value = '-'
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
					}
					// this.getData(data)
					checkedUsersList = []
				})
			}
			//here you can update your collection with axios call
		});

		async function mainBlock() {
			var changed = 0;
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				var formValues = {
					userID: selectedId,
					role: role,
				}

				var previousStatus = await getUserDetails(selectedId);
				var previousrole = previousStatus.data.role.map((b, j) => b);
				if (previousrole.some(prole => prole === role)) {
					swal(" ", "Already role is assigned");
					$('#userListDropdownId').removeAttr('disabled');
				} else {
					var response = await addRole(formValues);
					if (response) {

						if (response.data && response.data === 'USER_ROLE_ASSIGNED') {
							changed++

							swal(" ", "Role Assigned to " + (changed > 1 ? "Users" : "User ") + "Successfully..");
							window.location.reload();
						}
						var user = await getUserDetails(selectedId);
						if (user) {
							var msgvariable = {
								'[User]': user.data.firstname + ' ' + user.data.lastname,
								'[user_email_id]': user.data.email
							}
							var inputObj = {
								to: user.data.email,
								templateName: 'Role Assigned',
								variables: msgvariable,
							}
							while ((checkedUsersList.length - 1) === i) {
								return Promise.resolve(true);
							}
						}
						$('#userListDropdownId').removeAttr('disabled')
					}

				}
			}
		}
	}
	removeRoleAssigned(checkedUsersList, selectedValue) {
		var role = selectedValue.split('$')[1];
		function removeRole(formValues) {
			return new Promise(function (resolve, reject) {
				if (formValues) {
					console.log('formValues', formValues);
					axios.patch('/api/users/patch/role/remove/' + formValues.userID, formValues)
						.then(
							(res) => {
								console.log('res====', res);
								resolve(res);
							}).catch((error) => {
							});
				}
			})
		}

		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {
				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						// console.log('responsegetUserDetails'.response);
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function sendMail(inputObj) {
			return new Promise(function (resolve, reject) {
				axios
					.post('/api/masternotification/send-mail', inputObj)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		var changed = 0;
		mainBlock().then(response => {
			console.log('res', response);
			if (response) {
				this.setState({
					checkedUser: [],
					unCheckedUser: true
				}, () => {

					$('#userListDropdownId').removeAttr('disabled');
					this.refs.userListDropdown.value = '-';
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
					}
					// this.getData(data)
					checkedUsersList = [];
				})
			}
			//here you can update your collection with axios call
		});

		async function mainBlock() {
			var changed = 0;
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				var formValues = {
					userID: selectedId,
					role: role,
				}

				var previousStatus = await getUserDetails(selectedId);
				var previousrole = previousStatus.data.role.map((b, j) => b);
				console.log('previousRole', previousrole, role);
				if (previousrole.some(prole => prole === role)) {
					var response = await removeRole(formValues);
					if (response) {
						if (response.data && response.data === 'USER_ROLE_REMOVED') {
							changed++
							console.log('changed', changed);
							swal(" ", changed + " Records(s) Updated Successfully");
						}
						var user = await getUserDetails(selectedId);
						if (user) {
							var msgvariable = {
								'[User]': user.data.firstname + ' ' + user.data.lastname,
								'[user_email_id]': user.data.email
							}
							var inputObj = {
								to: user.data.email,
								templateName: 'Role Removed',
								variables: msgvariable,
							}
							while ((checkedUsersList.length - 1) === i) {
								return Promise.resolve(true);
							}
						}
						$('#userListDropdownId').removeAttr('disabled')
					}
				} else {
					swal(" ", "Already role is assigned");
					$('#userListDropdownId').removeAttr('disabled');

				}
			}
		}

	}
	adminUserActions(event) {
		event.preventDefault();
		$('#userListDropdownId').attr('disabled', 'true')
		var checkedUsersList = this.state.checkedUser;
		console.log('checkedUsersList', checkedUsersList);
		if (checkedUsersList.length > 0) {
			var selectedValue = this.refs.userListDropdown.value;
			var keywordSelectedValue = selectedValue.split('$')[0];
			var role = selectedValue.split('$')[1];

			switch (keywordSelectedValue) {
				case '-':
					$('#userListDropdownId').removeAttr('disabled')
					break;
				case 'block_selected':
					this.blockSelected(checkedUsersList);
					// window.location.reload();
					break;
				case 'active_selected':
					this.activeSelected(checkedUsersList);
					// window.location.reload();
					break;
				case 'cancel_selected':
					swal({
						text: "Are you sure you want to delete selected users ?",
						icon: "warning",
						cancelButtonColor: "#DD6B55",
						confirmButtonColor: "red",
						buttons: true,
						buttons: ["Cancel", "Confirm"],
						dangerMode: true,
					})
						.then((success) => {
							if (success) {
								this.deleteStatusSelected(checkedUsersList)
							} else {
								swal("Your Data is safe!");
								// window.location.reload();
							}
						});

					break;

				case 'add':
					this.addRoleAssigned(checkedUsersList, selectedValue)
					break;
				case 'remove':
					this.removeRoleAssigned(checkedUsersList, selectedValue)
					break;
			}
		} else {
			this.refs.userListDropdown.value = '-'
			$('#userListDropdownId').removeAttr('disabled');
			window.reload();
			swal({
				title: ' ',
				text: "Please select atleast one user."
			});

		}
	}
selectedRole(event) {
		event.preventDefault();
		console.log("inside selectedRole");
		var selectedValue = this.refs.roleListDropdown.value;
		console.log("selectedValue-------",selectedValue)
		var keywordSelectedValue = selectedValue.split('$')[0];
		console.log("keywordSelectedValue----",keywordSelectedValue);
		var formValues = {
			searchText: selectedValue,
		}

		if (this.refs.roleListDropdown.value && (this.refs.blockActive.value && this.refs.blockActive.value != "-- Select --")) {
			this.selectedStatuswithrole();
		} else {
			if (selectedValue === "all") {
				this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
			}
            
			 else {
				this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
				var data = {
					"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.state.companyID
				}
				axios.post('/api/users/get/list/role/' + keywordSelectedValue, data)
					.then((res) => {
						var tableData = res.data.filter((data, i) => {
							console.log('tableData data.status==>>>', data);
							return (data.status !== '<span class="label label-default statusLabel">deleted-active</span>' 
								    && data.status !== '<span class="label label-default statusLabel">deleted-blocked</span>'
								    && data.role !== ["admin"] && data.status !== '<span class="label label-default statusLabel">Deleted-Active</span>'
								    && data.status !== '<span class="label label-default statusLabel">Deleted-Blocked</span>' && data.status !== 'deleted' && data.createdAt !== 'null');
						});
						console.log("tableData>>>>>>>>>",tableData);
						var tableData = tableData.map((a, i) => {
							// console.log('tableData A==>>>>><<<<', a);
							return {
								_id: a._id,
								fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
									'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
								// companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
								status: a.status,
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
								lastLogin:          
									a.lastLogin === null
										?
										// "User Not Yet Login"
										'<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'

										:
										moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'

								// moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.myfunc() data-target=#userDetails-'+a._id+
								// ' title="Show Booking">User Login Details</div>': "-",
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					}).catch((error) => {
						swal(" ", "Sorry there is no data of " + selectedValue, "");
					});
			}
		}
	}


	// deleteStatusSelected(event) {
	// 	console.log("===== Delete user ====")
	// 	var count = 0
	// 	var username = this.state.username;
	// 	var user_ID = this.state.user_ID;
	// 	var checkedUsersList = []
	// 	if (this.state.allid) {
	// 		checkedUsersList = this.state.allid
	// 	} else {
	// 		checkedUsersList.push(event.target.id)
	// 	}

	// 	mainBlock()
	// 		.then(response => {
	// 			if (response) {
	// 				this.setState({
	// 					blockswal: true,
	// 					checkedUser: [],
	// 					unCheckedUser: true
	// 				}, () => {
	// 					var data = {
	// 						"startRange": this.props.startRange,
	// 						"limitRange": this.props.limitRange,
	// 						"companyID" : this.props.companyID
	// 					}
	// 					this.props.getData(data)
	// 					checkedUsersList = [];
	// 					if (this.state.blockswal === true) {
	// 						swal(" ", "Account deleted successfully");
	// 					}
	// 				})
	// 			}
	// 		});

	// 	async function mainBlock() {
	// 		var count = 0;
	// 		for (var i = 0; i < checkedUsersList.length; i++) {
	// 			var selectedId = checkedUsersList[i];
	// 			var formValues = {
	// 				user_id_tobedeleted: selectedId,
	// 				updatedBy: user_ID,
	// 			}
	// 			console.log("formvalues main block==>", formValues);
	// 			var response = await updateStatus(formValues);
	// 			if (response) {
	// 				var user = await getUserDetails(selectedId);
	// 				if (user) {
	// 					var msgvariable = {
	// 						'[User]': user.data.firstname + ' ' + user.data.lastname,
	// 						'[user_email_id]': user.data.email
	// 					}
	// 					var inputObj = {
	// 						to: user.data.email,
	// 						templateName: 'User - Login Account Deleted',
	// 						variables: msgvariable,
	// 					}
	// 					while ((checkedUsersList.length - 1) === i) {
	// 						return Promise.resolve(true);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	function updateStatus(formValues) {
	// 		console.log('formValues updated status===>>>', formValues);
	// 		return new Promise(function (resolve, reject) {
	// 			axios
	// 				.patch('/api/users/patch/deletestatus', formValues)
	// 				.then((response) => {
	// 					console.log('responseStatus', response);
	// 					resolve(response);
	// 					var data = {
	// 						"startRange": this.props.startRange,
	// 						"limitRange": this.props.limitRange,
	// 						"companyID" : this.props.companyID
	// 					}
	// 					this.props.getData(data)
	// 				})
	// 				.catch(function (error) {
	// 				})
	// 		})
	// 	}
	// 	function getUserDetails(selectedId) {
	// 		return new Promise(function (resolve, reject) {
	// 			axios
	// 				.get('/api/users/get/' + selectedId)
	// 				.then((response) => {
	// 					// console.log('responsegetUserDetails====>'.response.data);
	// 					resolve(response);
	// 				})
	// 				.catch(function (error) {
	// 				})
	// 		})
	// 	}
	// 	function sendMail(inputObj) {
	// 		return new Promise(function (resolve, reject) {
	// 			axios
	// 				.post('/api/masternotification/send-mail', inputObj)
	// 				.then((response) => {
	// 					// console.log('responsesend-mail'.response);
	// 					resolve(response);
	// 				})
	// 				.catch(function (error) {
	// 				})
	// 		})
	// 	}
	// }
	selectedCompnay(event) {
		event.preventDefault();
		var selectedValue = this.refs.companyDropdown.value;
		var keywordSelectedValue = selectedValue.split('$')[0];
		var formValues = {
			searchText: selectedValue,
		}

		if (this.refs.companyDropdown.value && (this.refs.blockActive.value && this.refs.blockActive.value != "-- Select --")) {
			this.selectedStatuswithrole();
		} else {
			if (selectedValue === "all") {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.state.companyID
				}
				this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
			} else {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.state.companyID
				}
				axios.post('/api/users/get/list/companies/' + keywordSelectedValue, data)
					.then((res) => {
						var tableData = res.data.filter((data, i) => {
							// console.log('tableData data.status==>>>', data.company);
							return (data.status !== '<span class="label label-default statusLabel">deleted-active</span>' && data.status !== '<span class="label label-default statusLabel">deleted-blocked</span>' && data.role !== ["admin"] && data.status !== '<span class="label label-default statusLabel">Deleted-Active</span>' && data.status !== '<span class="label label-default statusLabel">Deleted-Blocked</span>' && data.status !== 'deleted');
						});
						var tableData = tableData.map((a, i) => {
							// console.log('tableData A==>>>', a);
							return {
								_id: a._id,
								fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
									'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
								// companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
								status: a.status,
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
								lastLogin:
									a.lastLogin === null
										?
										'<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'
										:
										moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					}).catch((error) => {
						swal(" ", "Sorry there is no data of " + selectedValue, "");
					});
			}
		}
	}


	selectedStatus(event) {
		event.preventDefault();
		var selectedValue = this.refs.blockActive.value;
		var keywordSelectedValue = selectedValue.split('$')[0];
		var formValues = {
			searchText: selectedValue,
		}
		// console.log("this.refs.roleListDropdown.value=>", this.refs.roleListDropdown.value)
		// console.log("this.refs.blockActive.value=>", this.refs.blockActive.value)
		if (this.refs.blockActive.value && (this.refs.roleListDropdown.value && this.refs.roleListDropdown.value != "-- Select --")) {
			this.selectedStatuswithrole();
		} else {
			if (selectedValue === "all") {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.state.companyID
				}
			} else {
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.state.companyID
				}
				// console.log("data in status==>", data);
				axios.post('/api/users/get/list/status/' + selectedValue, data)
					.then(
						(res) => {
							var tableData = res.data.filter((data, i) => {
								return (data.status !== '<span class="label label-default statusLabel">deleted-active</span>' && data.status !== '<span class="label label-default statusLabel">deleted-blocked</span>' && data.status !== '<span class="label label-default statusLabel">Deleted-Active</span>' && data.status !== '<span class="label label-default statusLabel">Deleted-Blocked</span>' && data.status !== 'deleted');
							});
							var tableData = tableData.map((a, i) => {
								// console.log('tableData A==>>>', a);
								return {
									_id: a._id,
									fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
										'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
									// companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
									status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
									roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
									createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
									lastLogin:
										a.lastLogin === null
											?
											'<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'

											:
											moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'

									// moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.myfunc() data-target=#userDetails-'+a._id+
									// ' title="Show Booking">User Login Details</div>': "-",
								}
							})
							this.setState({
								completeDataCount: res.data.length,
								tableData: tableData,
							})
						}).catch((error) => {
							swal(" ", "Sorry there is no data of " + selectedValue);
						});
			}
		}
	}

	selectedStatuswithrole() {
		var data = {
			"startRange": this.state.startRange,
			"limitRange": this.state.limitRange,
			"companyID": this.state.companyID
		}
		var role = this.refs.roleListDropdown.value
		var status = this.refs.blockActive.value
		if (role && status === "all") {
			var data = {
				"startRange": this.state.startRange,
				"limitRange": this.state.limitRange,
				"companyID": this.state.companyID
			}
			this.getData(this.state.startRange, this.state.limitRange, this.state.companyID);
		} else {
			axios.post('/api/users/get/list/statusrole/' + role + '/' + status, data)
				.then(
					(res) => {
						var tableData = res.data.filter((data, i) => {
							// console.log('tableData data.status==>>>', data.status);
							return (data.status !== '<span class="label label-default statusLabel">deleted-active</span>' && data.status !== '<span class="label label-default statusLabel">deleted-blocked</span>' && data.status !== '<span class="label label-default statusLabel">Deleted-Active</span>' && data.status !== '<span class="label label-default statusLabel">Deleted-Blocked</span>' && data.status !== 'deleted');
						});
						var tableData = tableData.map((a, i) => {
							// console.log('tableData A==>>>', a);
							return {
								_id: a._id,
								fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
									'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
								// companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
								status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
								lastLogin:
									a.lastLogin === null
										?
										'<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'

										:
										moment(a.lastLogin).format("lll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'

								// moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.myfunc() data-target=#userDetails-'+a._id+
								// ' title="Show Booking">User Login Details</div>': "-",
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					}).catch((error) => {
						swal(" ", "Sorry there is no data of " + role, status);
					});
		}
	}
	confirmDel(event) {
		// console.log("delete===>>>");
		this.setState({
			confirmDel: true,
		})
		window.location.reload();
	}
	setunCheckedUser(value) {
		this.setState({
			unCheckedUser: value,
		})
	}
	selectedUser(checkedUsersList) {
		this.setState({
			checkedUser: checkedUsersList,
		})
	}
	getRole() {
		var data = {
			"startRange": this.state.startRange,
			"limitRange": this.state.limitRange,
		}
		axios.post('/api/roles/get/list', data)
			.then((response) => {
				console.log('roles list response-------', response);
				this.setState({
					adminRolesListData: response.data
				}, () => {
				})
			}).catch(function (error) {
			});
	}
	getCompanies() {
		axios.get('/api/entitymaster/getAllcompany')
			.then((response) => {
				// console.log('response =====>', response);
				this.setState({
					compDetails: response.data
				}, () => {
				})
			}).catch(function (error) {});
	}
	redirectToDeleteUsers(event) {
		this.props.history.push("/DeletedUsers/")
	}
	redirectToRoles(event) {
		this.props.history.push("/umroleslist")
	}
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	close(event) {
		// event.preventDefault();
		var modal = document.getElementById("deleteModal");
		modal.style.display = "none";
		$('.modal-backdrop').remove();
	}
	render() {
		var adminRolesListDataList = this.state.adminRolesListData;
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				<div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding formWrapper">
						<section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent1">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
											User Management
                						</div>
										<hr className="hr-head container-fluid row" />
									</div>
									<div className="modal-bodyuser">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 " id="createmodalcl">
												<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12  addexamform clickforhideshow" data-toggle="modal" data-target="#CreateUserModal"><i className="fa fa-plus" aria-hidden="true"></i><b>&nbsp;&nbsp;&nbsp; Add User</b></button>
												{console.log("companyID",this.state.companyID)}

												{
												this.state.companyID > 0
													?
													<CreateUser
														companyID={this.state.companyID}
														getData={this.getData.bind(this)} />
													:
													null
												}

											</div>
											<div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 " id="rolemodalcl">
												<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform clickforhideshow"
													onClick={this.redirectToRoles.bind(this)}>
													<i className="fa fa-plus" aria-hidden="true"></i>
													<b>&nbsp;&nbsp;&nbsp; Add Role</b>
												</button>
											</div>
											<div className="col-lg-2 col-lg-offset-6 col-md-3 col-sm-12 col-xs-12 ">
												{/* <button type="button"
													className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-danger userbtn  clickforhideshow"
													data-toggle="modal"
													onClick={this.redirectToDeleteUsers.bind(this)}
													data-target="#DeletedUsersModal"><b>Deleted Users</b>
												</button> */}
												<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-danger deletBtn"
													onClick={this.redirectToDeleteUsers.bind(this)}>
													<i className="fa fa-minus" aria-hidden="true"></i>
													<b>&nbsp; Deleted Users</b>
												</button>
												{/* {this.state.companyID > 0
													?
													<DeletedUsers
														companyID={this.state.companyID}
														tableData={this.state.tableData}
														getuserData={this.getData.bind(this)}
													/>
													:
													null
												} */}
											</div>
										</div>
									</div>
									<form className="newTemplateForm">
										<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 usrmgnhead">
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-12" >
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12  NOpadding-left text-left labelform">Select Action</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control font12 mdb-select md-form" id="userListDropdownId" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
													<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption" disabled="disabled" selected="true">-- Select --</option>

													<optgroup className="col-lg-12 col-md-12 col-sm-12 col-xs-12  optgrpunderline" label="Active, Block, Delete">
														<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>
														<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
														<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Delete Selected Acccounts</option>
													</optgroup>
													<optgroup className="col-lg-12 col-md-12 col-sm-12 col-xs-12  optgrpunderline" label="Add Roles">
														{adminRolesListDataList.map((rolesData, index) => {
															return (<UMAddRolRow key={index} roleDataVales={rolesData.role} />);
														})
														}
													</optgroup>
													<optgroup className="col-lg-12 col-md-12 col-sm-12 col-xs-12  optgrpunderline" label="Remove Roles">
														{adminRolesListDataList.map((rolesData, index) => {
															return (<UMDelRolRow key={index} roleDataVales={rolesData.role} />);
														})
														}
													</optgroup>
												</select>
											</div>
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Role</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control font12" ref="roleListDropdown" name="roleListDropdown" onChange={this.selectedRole.bind(this)} >
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" name="roleListDDOption">Show All</option>

													{adminRolesListDataList.map((rolesData, index) => {
														return <UMSelectRoleUsers key={index} roleDataVales={rolesData.role} />
													})
													}
												</select>
											</div>
											<div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-12">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Status</label>
												<select className=" col-col-lg-12  col-md-12 col-sm-12 col-xs-12 noPadding  form-control font12 " ref="blockActive" name="blockActive" onChange={this.selectedStatus.bind(this)}>
													<option value="" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" >Show All</option>
													<option value="blocked">Blocked</option>
													<option value="active">Active </option>
													<option value="unverified">Unverified </option>
												</select>
											</div>
											{this.state.websiteModel === 'FranchiseModel' ? 
											<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Franchise</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control font12" ref="companyDropdown" name="companyDropdown" onChange={this.selectedCompnay.bind(this)} >
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" name="roleListDDOption">Show All</option>
													{
														this.state.compDetails && this.state.compDetails.length > 0 ?
															this.state.compDetails.map((data, index) => {
																return (
																	<option key={index} value={data.companyName}>{data.companyName}</option>
																);
															})
															:
															<option value='user'>User</option>
													}
												</select>
											</div>
											: null}
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<IAssureTableUM
												completeDataCount 	={this.state.completeDataCount}
												twoLevelHeader 		={this.state.twoLevelHeader}
												getData 					={this.getData.bind(this)}
												tableHeading 			={this.state.tableHeading}
												tableData 				={this.state.tableData}
												companyID 				={this.state.companyID}
												tableObjects={this.state.tableObjects}
												getSearchText={this.getSearchText.bind(this)}
												selectedUser={this.selectedUser.bind(this)}
												setunCheckedUser={this.setunCheckedUser.bind(this)}
												unCheckedUser={this.state.unCheckedUser}
												UsersTable={true}
												tableName ={this.state.tableName}
												isLoading = {this.state.isLoadingData}
											/>
										</div>
										{/* :
											null
										} */}
										<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
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
														<h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this User?</h4>
													</div>
													<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															<button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
															{/* <button  onClick={this.deleteUser.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button> */}
														</div>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>

		);
	}

}
export default UMListOfUsers;
