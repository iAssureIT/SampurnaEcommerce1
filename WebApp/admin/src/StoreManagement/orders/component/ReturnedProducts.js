import React,{Component} 	from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                from 'axios';
import $, { data } 					from "jquery";
import moment 				from "moment";
import AdminOrdersList 		from './AdminOrdersList.js';
import swal         		from 'sweetalert';
import IAssureTable           from "../ReturnProductTable/IAssureTable.jsx";
import { CheckBoxSelection, 
    Inject, 
    MultiSelectComponent }  from '@syncfusion/ej2-react-dropdowns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';

export default class ReturnProducts extends Component{
	
	constructor(props) {
	 super(props);
		this.state = {
			"returnedProducts" : [],
			tableHeading    : {
				"orderID" 			: "Order Id",
				"productImage"      : "Product Image",
                "productName"       : "Product Name(Product Code)",
                "vendorName"        : 'Vendor Name',
                "section"        	: 'Section',
                "category"        	: 'Category',
                "customerName"      : 'Customer Name',
                "reasonOfReturn"    : 'Reason of Return',
                "OrderDate"        	: 'Ordered on',
                "returnRequestedOn" : 'Return Requested on',
                // "approveOrReject"   : 'Approve/Reject',
                "status"            : 'Status'
            },
            tableObjects    : {
                paginationApply : true,
                searchApply     : false,
                deleteMethod    : 'delete',
                apiLink         : '/api/returnedproducts',
            },
            startRange      : 0,
            limitRange      : 10
		}
		// this.getReturnedProducts = this.getReturnedProducts.bind(this);
	}
	 
	/**=========== componentDidMount() ===========*/
	componentDidMount(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
		var token       = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		this.getData(this.state.startRange, this.state.limitRange);
		this.getCount();
		this.getSectionData();
        // this.getCategoryData();
        this.getVendorList();
	}    

	productCountByStatus(){
        axios.get('/api/products/get/productCountByStatus')
            .then((response) => {

                this.setState({
                    productCountByStatus: response.data
                })

            })
            .catch((error) => {

            })
    }

	getVendorList() {
        // axios.get('/api/vendors/get/list')
        axios.get("/api/entitymaster/get/vendor")
		.then((response) => {
			this.setState({
				vendorArray : response.data,
				messageData : {}
			})
			// console.log("vendorArray",this.state.vendorArray);

		})
		.catch((error) => {
			console.log('error', error);
		})
    }

    getSectionData() {
        axios.get('/api/sections/get/all/list')
		.then((response) => {
			this.setState({
				sectionArray: response.data,
				messageData: {}
			})

		})
		.catch((error) => {
			console.log('error', error);
		})
    }

    getCategoryData(id) {
        axios.get('/api/category/get/'+id)
		.then((response) => {

			this.setState({
				categoryArray 	: response.data,
				messageData 	: {}
			})

		})
		.catch((error) => {
			console.log('error', error);
		})
    }
	/**=========== getCount() ===========*/
    getCount(){
        axios.get('/api/returnedproducts/get/count')
        .then((response)=>{
            console.log('dataCount', response.data.dataCount);
            this.setState({
                dataCount : response.data.dataCount
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }

	/**=========== getSearchText() ===========*/
	getSearchText(searchText) {
		console.log("searchText => ",searchText)
		this.setState({
			searchText : searchText
		},()=>{
			this.getData(this.state.startRange, this.state.limitRange);
		})
        // axios.get("/api/products/get/adminsearch/" + searchText)
		// .then((response) => {
		// 	this.setState({
		// 		tableData : response.data,
		// 		dataCount : response.data.length
		// 	});
		// })
		// .catch((error) => {
		// 	console.log('error', error);
		// })
    }

	/**=========== getData() ===========*/
	getData(startRange, limitRange){
		var formValues = {
            startRange 		: startRange,
            limitRange 		: limitRange,
			vendor 			: this.state.vendor,
			section 		: this.state.section,
			category 		: this.state.category,
			returnStatus 	: this.state.returnStatus
        }
		axios.post("/api/returnedproducts/get/list", formValues)
		.then((response)=>{
			console.log("response return products => ",response.data)
			var tableData = response.data.map((a, ind)=>{
				console.log("condition => ",(a.productDetails && a.productDetails.length > 0));
				// if(a.productDetails && a.productDetails.length > 0){
					console.log("a => ",a)
					return{
						"_id"               : a._id,
						"orderID"           : a.orderID,
						"productImage"     : a.productDetails[0] && a.productDetails[0].productImage && a.productDetails[0].productImage.length > 0 
											? 
												"<div class='productImgDiv'> <img src='"+ a.productDetails[0].productImage[0] + "' class='img-responsive' /></div>"
											: 
												"<div class='productImgDiv'> <img src='/images/notavailable.jpg' class='img-responsive' /> </div>",
						"productName"       : a.productDetails[0] && a.productDetails[0].productName ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
						"vendorName"        : a.vendorDetails[0] && a.vendorDetails[0].companyName ? a.vendorDetails[0].companyName : "",
						"section"        	: a.sectionDetails[0] && a.sectionDetails[0].section ? a.sectionDetails[0].section : "",
						"category"        	: a.categoryDetails[0] && a.categoryDetails[0].category ? a.categoryDetails[0].category : "",
						"customerName"      : a.userDetails[0] && a.userDetails[0].profile.fullName ? a.userDetails[0].profile.fullName : "-",
						"reasonOfReturn"    : a.reasonForReturn,
						"OrderDate"        	: moment(a.dateOfPurchase).format("DD MMMM YYYY, HH:mm a"),
						"returnRequestedOn" : moment(a.createdAt).format("DD MMMM YYYY, HH:mm a"),             
						// "productID"         : a.productID,
						// "approveOrReject"   : "<div class='publishOrReject'><i class='fa fa-times-circle reviewActionBtns padding-15-0 " + (a.returnStatus === 'Return Request Rejected' ? 'rejectedActive' : '') +  "'name='Rejected' id='Rejected' title='Reject Customer's Return Request' onclick=window.changeReviewStatus('"+ a._id + "-" + "Return Request Rejected" +"')></i>"+
						// 						"<i class='fa fa-check-circle reviewActionBtns padding-15-0 " + (a.returnStatus === 'Return Request Approved' ? 'publishedActive' : '') + "'name='Published' id='Published' title='Approve Customer's Return Request' onClick=window.changeReviewStatus('"+ a._id + "-" + "Return Request Approved" +"')></i></div>",
						"status"            : "<div class='reviewStatusSpan " + a.returnStatus.replace(/\s+/g, '_').toLowerCase() + "'>" + a.returnStatus + "</div>",
						
					};
				// }
            })
			console.log("tabledata => ",tableData)
            this.setState({
                tableData : tableData
            },()=>{
                console.log("tableData => ",this.state.tableData)
            })
		})
		.catch((error)=>{
			console.log('error', error);
			if(error.message === "Request failed with status code 401"){
				var userDetails =  localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
						title : "Your Session is expired.",                
						text : "You need to login again. Click OK to go to Login Page"
				})
				.then(okay => {
				if (okay) {
						window.location.href = "/login";
				}
				});
			}
		})
	}

	handleChangeFilter(event){	
		const name   = event.target.name;
		const value     = event.target.value;
		console.log("name => ",name);
		console.log("value => ",value);
		this.setState({
			[name]: event.target.value,
		},()=>{
			if(name === "section"){
				this.getCategoryData(value);
			}
			this.getData(this.state.startRange, this.state.limitRange);
		});		
	}
			
	/**=========== render() ===========*/
	render(){		
		return(
			<div className="">
				<div>
					<section className="content">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
							<div className="row">
								<div className="box">
									<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<h4 className="weighttitle NOpadding-right">Returned Products</h4>
									</div>
								</div>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt NoPadding">
								<div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NOPadding">
									
									{/* {console.log("this.state.preference----",this.state.websiteModel)} */}
									{/* {this.state.preference === "MarketPlace"  || this.state.websiteModel === "MarketPlace"
										?  */}
										<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
											<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Vendor</label>
											<select className="form-control selectRole" ref="vendor" name="vendor" id="vendor" 
												onChange={this.handleChangeFilter.bind(this)}>
												<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
												{
													this.state.vendorArray && this.state.vendorArray.length > 0 ?
														this.state.vendorArray.map((data, i)=>{
															return(                                                                    
																<option key={i} value={data._id}>{data.companyName}</option>
																// <option key={i} id={data.entityCode}>{data.entityCode}</option>
															);
														})
													:
													null
												}
												
											</select>
										</div>
										{/* :
										null 
									} */}

									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Section</label>
										<select className="form-control selectRole" ref="section" name="section" id="section" onChange={this.handleChangeFilter.bind(this)}>
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
											{this.state.sectionArray && this.state.sectionArray.length > 0 
											?
												this.state.sectionArray.map((data, i)=>{
													return(                                                                    
														<option key={i} value={data._id}>{data.section}</option>
														// <option key={i} id={data.entityCode}>{data.entityCode}</option>
													);
												})
											:
												null
											}											
										</select>
									</div>
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Category</label>
										<select className="form-control selectRole" ref="category" name="category" id="category" 
											onChange={this.handleChangeFilter.bind(this)}>
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
											{this.state.categoryArray && this.state.categoryArray.length > 0 
											?
												this.state.categoryArray.map((data, i)=>{
													return(                                                                    
														<option key={i} value={data._id}>{data.category}</option>
														// <option key={i} id={data.entityCode}>{data.entityCode}</option>
													);
												})
											:
												null
											}											
										</select>
									</div>
									<div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
										<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Status</label>
										<select className="form-control selectRole" ref="returnStatus" name="returnStatus" id="returnStatus"
											onChange={this.handleChangeFilter.bind(this)}>
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Return Requested">Return Requested</option>  									
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Return Request Approved">Return Request Approved</option> 									
											<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Return Request Rejected">Return Request Rejected</option>    
										</select>
									</div>
								
								</div>
							</div>                                     
							
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<IAssureTable 
									tableHeading    = {this.state.tableHeading}
									twoLevelHeader  = {this.state.twoLevelHeader} 
									dataCount       = {this.state.dataCount}
									tableData       = {this.state.tableData}
									getData         = {this.getData.bind(this)}
									tableObjects    = {this.state.tableObjects}
									getSearchText   = {this.getSearchText.bind(this)}
								/>
							</div>				
						</div>
					</section>
				</div>
			</div>
		);
	}
}
