import React,{Component}                           from 'react';
import { render }                                  from 'react-dom';
import $                                           from "jquery";
import { BrowserRouter, Route, Switch,Link  } 		from 'react-router-dom';
import axios                  							from 'axios';
import swal 													from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; 
import './Leftsidebar.css';
import './dashboard.css';


export default class AdminDashboard extends Component{

	constructor(props){
		super(props);
		this.state = {
			menuValues : {
				vendorData             : false,
				supplierData           : false,
				corporateData          : false,
				contractmanagement     : false,
				masterData             : false,
				baData                 : false,
				bussinessData          : false
			}
		};

		this.closeIcon   	= 'fa-angle-left';
		this.openIcon    	= 'fa-angle-down';
		this.activeMenu 	= this.activeMenu.bind(this)
	}

	componentDidMount(){
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token       	= userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		this.getAllorderStatus();
		
		axios.get("/api/adminpreference/get")
		.then(preferences =>{
			if(preferences.data){
				var askpincodeToUser = preferences.data[0].askPincodeToUser;
				this.setState({
					'websiteModel'     	: preferences.data[0].websiteModel,
					'askPincodeToUser' 	: preferences.data[0].askPincodeToUser,
					'showLoginAs'      	: preferences.data[0].showLoginAs,
					'showInventory'    	: preferences.data[0].showInventory,
					'showDiscount'    	: preferences.data[0].showDiscount,
					'showCoupenCode'    	: preferences.data[0].showCoupenCode,
					'showOrderStatus'    : preferences.data[0].showOrderStatus
				},()=>{})
			}
		})
		.catch(error=>{
			console.log("Error in preferences = ", error);
			if(error.message === "Request failed with status code 401"){
				var userDetails =  localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is expired.",                
					text  : "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})

		if (!$('body').hasClass('adminLte')) {
			var adminLte 	= document.createElement("script");
			adminLte.type 	= "text/javascript";
			adminLte.src 	= "/js/adminLte.js";
			$("body").append(adminLte);
		}

		$("html,body").scrollTop(0);
		var getCurrentUrl = window.location.pathname;
		// console.log("getCurrentUrl",getCurrentUrl);

		$(".sidebar-menu .singleTreeview a").filter(function(a, b){
			if($(this).attr('href') === getCurrentUrl){
				$(b).addClass('active');
				// console.log("b",b);
				// console.log($(this).attr('href') === getCurrentUrl);
				// console.log(b);
			}
		})

		$(".sidebar-menu .treeview li a").filter(function(a, b){
			if($(this).attr('href') === getCurrentUrl){
				$(b).addClass('active');
				$($($(b).parent()).parent()).parent().addClass('menu-open');
				($($(b).parent()).parent()).css("display", "block");
				// $($($($($($($(b).parent()).parent()).children('menu-open')).children("pull-right-container")).children("i"))).addClass("fa-angle-down");
			}
		})
	}

	getAllorderStatus(){
		axios.get('/api/orderstatus/get/list')
		.then((response) => {
			// console.log("getAllorderStatus 402 response ==>",response)
			this.setState({
				"orderStatusData": response.data,
			},()=>{
				// console.log("getAllorderStatus response ==>",response)
			})
		})
		.catch((error) => {
			console.log("Error in orderstatus = ", error);
			if(error.message === "Request failed with status code 401"){
				localStorage.clear();
				swal({  
					title : "Your Session is expired.",                
					text  : "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})
	}

	componentWillUnmount(){		
		$("script[src='/js/adminLte.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}

	activeMenu(event){
		event.preventDefault();
		var a 				= event.currentTarget
		var pathname 		= event.currentTarget.getAttribute("data-id"); 
		window.location 	= pathname
		
		$(".sidebar-menu .treeview-menu li a").removeClass("active-submenu");
		$(event.currentTarget).addClass("active-submenu");
	}

	openMenu = (key) => {
		let {menuValues} = this.state;
		Object.keys(menuValues).map((data) => {
			menuValues[data] = (data === key) ? !menuValues[key] : false;
		});
		this.setState({menuValues});
		$('.singleTreeview').removeClass('active')
	}

	eventclk1(event){
		$(event.currentTarget).children(".menuContent").children(".rotate").toggleClass("down");
		
		var currentEvent 		=  event.currentTarget
		var getCurrentUrl 	= window.location.pathname;

		localStorage.setItem("currentURL",getCurrentUrl)
		localStorage.setItem("currentEvent",currentEvent)
	} 

	clickDashboard(event){
		$('.treeview').not(event.currentTarget).removeClass('menu-open')
		$('.treeview-menu').css({'display':'none'})
		$(event.currentTarget).addClass('active')
	}

	render(){

		let {dashboard, productmanagement, productreviewmanagement, returnedproductmanagement, inventorymanagement, dealsmanagement, vendorData,supplierData,corporateData,contractmanagement,masterData,baData,bussinessData, ordermanagement, reportsmanagement} = this.state.menuValues;

		return(
			<aside className="main-sidebar control-sidebar sidebarWrapper scrollBox">
				<section className="sidebar noPadLR sidebar-menu-wrapper">
					<ul className="sidebar-menu" data-widget="tree">

						{/*Dashboard*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/dashboard"  title="Dashboard" onClick={()=>this.openMenu("dashboard")}>
								<i className="fa fa-dashboard" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Dashboard</span>
							</a>
						</li>

						{/*Product Management*/}
						<li className="treeview" >
							<a href="#" onClick={()=>this.openMenu("productmanagement")} title="Product Management">
								<i className="fa fa-product-hunt" aria-hidden="true"></i>
								<span className="smsidenames sidebarMenuTitle">Product Management</span>
								<span className="pull-right-container">
									<i className={"fa pull-right menu-icon-toggle "+(productmanagement?this.openIcon:this.closeIcon)} />
								</span>
							</a>
							<ul className="treeview-menu" >                    
								<li className="noPadLR"> 
									<a href="/add-product" data-id="/add-product" onClick={this.activeMenu.bind(this)} title="Add New Product">
										<i className="fa fa-circle-o dashr" />Add New Product
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/product-upload" data-id="/product-upload" title="Product Bulk Upload" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Bulk Product Upload
									</a> 
								</li>  
								{/* <li className="noPadLR"> 
									<a href="/product-bulk-update" data-id="/product-bulk-update" title="Product Bulk Update" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Bulk Update
									</a> 
								</li>   */}
								<li className="noPadLR"> 
									<a href="/product-image-bulk-upload" data-id="/product-image-bulk-upload" title="Product Bulk Upload" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Bulk Image Upload
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/product-list" data-id="/product-list" title="Product List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Product List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/file-wise-product-list" data-id="/file-wise-product-list" title="Product Bulk Upload" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />File Wise Product List
									</a> 
								</li>	  	 						
							</ul>
						</li>

						{/*Inventory Management*/}

						<li className="treeview" >
							<a href="JavaScript:void(0);" onClick={()=>this.openMenu("inventorymanagement")} title="Inventory Management">
								<i className="fa fa-tasks" aria-hidden="true"></i>
								<span className="smsidenames sidebarMenuTitle">Inventory Management</span>
								<span className="pull-right-container">
									<i className={"fa pull-right menu-icon-toggle "+(inventorymanagement?this.openIcon:this.closeIcon)} />
								</span>
							</a>
							<ul className="treeview-menu" >                    
								<li className="noPadLR"> 
									<a href="/product-inventory-update" data-id="/product-inventory-update" onClick={this.activeMenu.bind(this)} title="Product Inventory Update">
										<i className="fa fa-circle-o dashr" />Product Inventory
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/product-inventory-list" data-id="/product-inventory-list" title="Product inventory List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Product Inventory List
									</a> 
								</li>	  	 						
							</ul>
						</li>



						{/*Order Management*/}
						<li className="treeview" >
							<a href="#" onClick={()=>this.openMenu("ordermanagement")} title="Order Management">
								<i className="fa fa-shopping-cart" aria-hidden="true"></i>
								<span className="smsidenames sidebarMenuTitle">Order Management</span>
								<span className="pull-right-container">
									<i className={"fa pull-right menu-icon-toggle "+(ordermanagement?this.openIcon:this.closeIcon)} />
								</span>
							</a>
							<ul className="treeview-menu" > 
							<li className="noPadLR"> 
								<a href="/orders-list/all" data-id="/orders-list/all" onClick={this.activeMenu.bind(this)} title="All Orders">
									<i className="fa fa-circle-o dashr" />All Orders
								</a> 
							</li> 
							{Array.isArray(this.state.orderStatusData) && this.state.orderStatusData.map( (data,index)=>{
								var status = (data.orderStatus).replace(/\s+/g, '-').toLowerCase();
								return(
									<li className="noPadLR" key={index}> 
										<a href={"/orders-list/"+status} data-id={"/orders-list/"+status} title={data.orderStatus + " Orders"} onClick={this.activeMenu.bind(this)}>
											<i className="fa fa-circle-o dashr" />{data.orderStatus + " Orders"}
										</a> 
									</li>  
								)
							})} 
							<li className="noPadLR"> 
								<a href="/orders-list/Cancelled" data-id="/orders-list/Cancelled" onClick={this.activeMenu.bind(this)} title="Cancelled Orders">
									<i className="fa fa-circle-o dashr" />Cancelled Orders
								</a> 
							</li>              
								{/* <li className="noPadLR"> 
									<a href="/allorders" data-id="/allorders" onClick={this.activeMenu.bind(this)} title="All Orders">
										<i className="fa fa-circle-o dashr" />All Orders
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/new-orders-list" data-id="/new-orders-list" title="New Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />New Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/verified-orders-list" data-id="/verified-orders-list" title="Verified Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Verified Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/packed-orders-list" data-id="/packed-orders-list" title="Packed Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Packed Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/inspected-orders-list" data-id="/inspected-orders-list" title="Inspected Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Inspected Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/approved-orders-list" data-id="/approved-orders-list" title="Approved Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Approved Order List
									</a> 
								</li>  

								<li className="noPadLR"> 
									<a href="/dispatched-orders-list" data-id="/dispatched-orders-list" title="Dispatched Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Dispatched Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/delivery-initiated-orders" data-id="/delivery-initiated-orders" title="Delivery Initiated Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Delivery Initiated Order List
									</a> 
								</li>  
								<li className="noPadLR"> 
									<a href="/delivered-orders-list" data-id="/delivered-orders-list" title="Delivered & Paid Order List" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Delivered & Paid Order List
									</a> 
								</li>   */}

							</ul>
						</li>

						{/*Order Dispatch Center*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/order-dispatch-center" title="Order Dispatch Center" onClick={()=>this.openMenu("orderdispatchcenter")}>
								<i className="fa fa-truck" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Order Dispatch Center</span>
							</a>
						</li>

						{/*Reports Management*/}
						<li className="treeview" >
							<a href="#" onClick={()=>this.openMenu("reportsmanagement")} title="Reports Management">
								<i className="fa fa-file-excel-o" aria-hidden="true"></i>
								<span className="smsidenames sidebarMenuTitle">Reports Management</span>
								<span className="pull-right-container">
									<i className={"fa pull-right menu-icon-toggle "+(reportsmanagement ? this.openIcon : this.closeIcon)} />
								</span>
							</a>
							<ul className="treeview-menu" >                    
								<li className="noPadLR"> 
									<a href="/revenue-report" data-id="/revenue-report" title="Revenue Report" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Revenue Report
									</a> 
								</li>                     
								<li className="noPadLR"> 
									<a href="/delivery-drivers-report" data-id="/delivery-drivers-report" title="Delivery Drivers Report" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Delivery Drivers Report
									</a> 
								</li>                     
								<li className="noPadLR"> 
									<a href="/vendor-sales-report" data-id="/vendor-sales-report" title="Vendor Sales Report" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />Vendor Sales Report
									</a> 
								</li>                     
								{/*<li className="noPadLR"> 
									<a href="/user-report" data-id="/user-report" title="User Report" onClick={this.activeMenu.bind(this)}>
										<i className="fa fa-circle-o dashr" />User Report
									</a> 
								</li> */} 
								{this.state.websiteModel === 'FranchiseMaster' 
								?
									<li className="noPadLR"> 
										<a href="/raw-material-stock-report" data-id="/raw-material-stock-report" title="Raw Material Stock Report" onClick={this.activeMenu.bind(this)}>
											<i className="fa fa-circle-o dashr" />Raw Material Stock Report
										</a> 
									</li>  
								: 
									null
								}								
							</ul>
						</li>





						{/*Deals Management*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/add-deals"  title="Deals Management" onClick={()=>this.openMenu("dealsmanagement")}>
								<i className="fa fa-money" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Deals Management</span>
							</a>
						</li>

						{/*Coupon Management*/}
						{this.state.showCoupenCode !== 'No'
						?
							<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
								<a href="/coupon-management" title="Coupon Management" onClick={()=>this.openMenu("couponmanagement")}>
									<i className="fa fa-gift" aria-hidden="true"></i>
									<span className="sidebarMenuTitle">Coupon Management</span>
								</a>
							</li>
						: 
							null
						}  

						{/*Product Review Management*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/product-reviews-&-ratings"  title="Product Review Management" onClick={()=>this.openMenu("productreviewmanagement")}>
								<i className="fa fa-comments" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Product Reviews</span>
							</a>
						</li>

						{/*Returned Product Management*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/returned-products"  title="Returned Product Management" onClick={()=>this.openMenu("returnedproductmanagement")}>
								<i className="fa fa-undo" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Returned Products</span>
							</a>
						</li>



						{/*Vendor Management*/}
						{this.state.websiteModel === "MarketPlace" ||this.state.websiteModel === "SingleOwner" 
						?
							<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
								<a href="/vendor/list" title="Vendor Management" onClick={()=>this.openMenu("vendormanagement")}>
									<i className="fa fa-users" aria-hidden="true"></i>
									<span className="sidebarMenuTitle">Vendor Management</span>
								</a>
							</li>
						:
							null
						}

						{/*Master Data*/}
						<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
							<a href="/project-master-data" title="Master Data" onClick={()=>this.openMenu("masterdata")}>
								<i className="fa fa-th-large" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">Master Data</span>
							</a>
						</li>



						{/*{this.state.websiteModel !== 'SingleOwner' 
						?
							this.state.showInventory === 'Yes' 							
							?*/}	
								
							{/*:
								null
						:
							null
						}*/}
							{/*<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
								<a href="/product-inventory-update" title="Inventory Management" onClick={()=>this.openMenu("inventorymanagement")}>
									<i className="fa fa-th-large" aria-hidden="true"></i>
									<span className="sidebarMenuTitle">Inventory Management</span>
								</a>
							</li>					
								// <li className="treeview" >
								// 	<a href="#" onClick={()=>this.openMenu("corporateData")} title="Corporate Master">
								// 		<i className="fa fa-users" aria-hidden="true"></i>
								// 		<span className="smsidenames sidebarMenuTitle">Inventory Management </span>
								// 		<span className="pull-right-container">
								// 			<i className={"fa pull-right menu-icon-toggle "+(corporateData?this.openIcon:this.closeIcon)} />
								// 		</span>
								// 	</a>
								// 	{this.state.websiteModel === 'MarketPlace' 
								// 	?
								// 		null
								// 		// <ul className="treeview-menu" >                    
								// 		// 	<li className="noPadLR"> 
								// 		// 		<a href="/product-bulk-update" data-id="/product-bulk-update" title="Product Bulk Update" onClick={this.activeMenu.bind(this)}>
								// 		// 			<i className="fa fa-circle-o dashr" />Product Bulk Update
								// 		// 		</a> 
								// 		// 	</li>
								// 		// </ul>
								// 	:
								// 		<ul className="treeview-menu" >                    
								// 			<li className="noPadLR"> 
								// 				<a href="/purchase-management" data-id="/purchase-management" title="Raw Material Inward" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Raw Material
								// 				</a> 
								// 			</li>  
								// 			<li className="noPadLR"> 
								// 				<a href="/finished-goods" data-id="/finished-goods" title="Finished Goods Inward" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Finished Goods
								// 				</a> 
								// 			</li>  
								// 			<li className="noPadLR"> 
								// 				<a href="/franchise-shopping-list" data-id="/franchise-shopping-list" title="Franchise Purchase Order" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Franchise Purchase Order
								// 				</a> 
								// 			</li>  
								// 			<li className="noPadLR"> 
								// 				<a href="/admin-shopping-list" data-id="/admin-shopping-list" title="Consolidate Purchase Orders" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Consolidate Purchase Orders
								// 				</a> 
								// 			</li>  
								// 			<li className="noPadLR"> 
								// 				<a href="/franchise-order-summary" data-id="/franchise-order-summary" title="Franchise Order Summary" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Franchise Order Summary
								// 				</a> 
								// 			</li>  
								// 			<li className="noPadLR">
								// 				<a href="/franchise-product-stock" data-id="/franchise-product-stock" title="Franchise Order Summary" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" aria-hidden="true"></i>
								// 					<span className="sidebarMenuTitle">Franchise Product Stock</span>
								// 				</a>
								// 			</li>
								// 			<li className="noPadLR"> 
								// 				<a href="/franchise-allowable-pincode" data-id="/franchise-allowable-pincode" title="Finished Goods Inward" onClick={this.activeMenu.bind(this)}>
								// 					<i className="fa fa-circle-o dashr" />Allowable Pincode
								// 				</a> 
								// 			</li>  
								// 		</ul>							
								// 	}
								// </li>	
							:
								null									
						:
							null
						}*/}

				 
						{this.state.websiteModel === 'FranchiseModel'
						 ?
							<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
								<a href="/franchise/list" title="Franchise Master" onClick={()=>this.openMenu("dashboard")}>
									<i className="fa fa-money" aria-hidden="true"></i>
									<span className="sidebarMenuTitle">Franchise Master</span>
								</a>
							</li>
						: 
							null 
						}
						{/* {this.state.showDiscount !== 'No'
						 ?
								<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
									<a href="/discount-management" title="Discount Management" onClick={()=>this.openMenu("dashboard")}>
										<i className="fa fa-th-large" aria-hidden="true"></i>
										<span className="sidebarMenuTitle">Discount Management</span>
									</a>
								</li>
						 :
						 null
						 }    */}
							
						
					

						{/* <li className="singleTreeview" onClick={this.clickDashboard.bind(this)} style={{display:'none'}}>
							<a href="/cms/dashboard" title="cms" onClick={()=>this.openMenu("dashboard")}>
								<i className="fa fa-object-group" aria-hidden="true"></i>
								<span className="sidebarMenuTitle">CMS</span>
							</a>
						</li> */}
						
						 {//
						// this.state.websiteModel === "MarketPlace" ?
						// <li className="treeview" >
						//   <a href="#" onClick={()=>this.openMenu("baData")} title="Contract Management">
						//     <i className="fa fa-file" aria-hidden="true"></i>
						//     <span className="smsidenames sidebarMenuTitle">Business Associate</span>
						//     <span className="pull-right-container">
						//       <i className={"fa pull-right menu-icon-toggle "+(baData?this.openIcon:this.closeIcon)} />
						//     </span>
						//   </a>
						//   <ul className="treeview-menu" >                    
						//     <li className="noPadLR"> 
						//     <a href="/addNewBA" data-id="/addNewBA" title="Add Business Associate" onClick={this.activeMenu.bind(this)}>
						//           <i className="fa fa-circle-o dashr" />Add Business Associate
						//         </a> 
						//     </li>  
						//     <li className="noPadLR"> 
						//        <a href="/ba-list" data-id="/ba-list" title="Business Associates List" onClick={this.activeMenu.bind(this)}>
						//           <i className="fa fa-circle-o dashr" />Business Associates List
						//         </a> 
						//     </li>  
						//   </ul>
						// </li>
						// : null 
					}


					 
					
						{/* {
							this.state.websiteModel === "MarketPlace" ?
							// console.log("data===",this.state.websiteModel)
									<li className="treeview" >
										<a href="#" onClick={()=>this.openMenu("bussinessData")} title="BA Master">
											<i className="fa fa-book" aria-hidden="true"></i>
											<span className="smsidenames sidebarMenuTitle">BA Master</span>
											<span className="pull-right-container">
												<i className={"fa pull-right menu-icon-toggle "+(bussinessData?this.openIcon:this.closeIcon)} />
											</span>
										</a>
										<ul className="treeview-menu" >                    
											<li className="noPadLR"> 
												<a href="/ba/basic-details" data-id="/ba/basic-details" title="Create BA " onClick={this.activeMenu.bind(this)}>
													<i className="fa fa-circle-o dashr" />BA Details
												</a> 
											</li>  
										 
											<li className="noPadLR"> 
												<a href="/ba/list" data-id="/ba/list" title="BA List" onClick={this.activeMenu.bind(this)}>
													<i className="fa fa-circle-o dashr" />BA List
												</a> 
											</li>  
									 
											{/* <li className="noPadLR" > 
												<a href="/ba-list" data-id="/ba-list" title="Category Wise Sales Report" onClick={this.activeMenu.bind(this)}>
													<i className="fa fa-circle-o dashr" />Category Wise Sales Report
												</a> 
											</li>     */}
										{/*</ul>
									</li>
							 : null
						} */}
					</ul>
				</section>
			</aside>
		);
	}
}