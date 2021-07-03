import React,{Component} 	from 'react';
import { render } 			from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                from 'axios';
import $ 					from "jquery";
import moment 				from "moment";
import AdminOrdersList 		from './AdminOrdersList.js';
import swal         		from 'sweetalert';
import IAssureTable           from "../ReturnProductTable/IAssureTable.jsx";
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
                "customerName"      : 'Customer Name',
                "reasonOfReturn"    : 'Reason of Return',
                "OrderDate"        	: 'Ordered on',
                "returnRequestedOn" : 'Return Requested on',
                // "approveOrReject"   : 'Approve/Reject',
                "status"            : 'Status'
            },
            tableObjects    : {
                paginationApply : true,
                searchApply     : true,
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

	/**=========== getData() ===========*/
	getData(startRange, limitRange){
		var formValues = {
            startRange : startRange,
            limitRange : limitRange
        }
		axios.post("/api/returnedproducts/get/list", formValues)
		.then((response)=>{
			console.log("response return products => ",response.data)
			var tableData = response.data.map((a, ind)=>{
				console.log("condition => ",(a.productDetails && a.productDetails.length > 0));
				if(a.productDetails && a.productDetails.length > 0){
					return{
						"_id"               : a._id,
						"orderID"           : a.orderID,
						"productImage"     : a.productDetails[0] && a.productDetails[0].productImage && a.productDetails[0].productImage.length > 0 
						? 
						"<div class='prodImg'> <img src='"+ a.productDetails[0].productImage + "' class='img-responsive' /></div>"
						: 
						"<div class='productImgDiv'> <img src='/images/notavailable.jpg' class='img-responsive' /> </div>",
						"productName"       : a.productDetails[0] && a.productDetails[0].productName ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
						"vendorName"        : a.vendorDetails[0] && a.vendorDetails[0].companyName ? a.vendorDetails[0].companyName : "",
						"customerName"      : a.userDetails[0] && a.userDetails[0].profile.fullName ? a.userDetails[0].profile.fullName : "-",
						"reasonOfReturn"    : a.reasonForReturn,
						"OrderDate"        	: moment(a.dateOfPurchase).format("DD MMMM YYYY, HH:mm a"),
						"returnRequestedOn" : moment(a.createdAt).format("DD MMMM YYYY, HH:mm a"),             
						// "productID"         : a.productID,
						// "approveOrReject"   : "<div class='publishOrReject'><i class='fa fa-times-circle reviewActionBtns padding-15-0 " + (a.returnStatus === 'Return Request Rejected' ? 'rejectedActive' : '') +  "'name='Rejected' id='Rejected' title='Reject Customer's Return Request' onclick=window.changeReviewStatus('"+ a._id + "-" + "Return Request Rejected" +"')></i>"+
						// 						"<i class='fa fa-check-circle reviewActionBtns padding-15-0 " + (a.returnStatus === 'Return Request Approved' ? 'publishedActive' : '') + "'name='Published' id='Published' title='Approve Customer's Return Request' onClick=window.changeReviewStatus('"+ a._id + "-" + "Return Request Approved" +"')></i></div>",
						"status"            : "<div class='reviewStatusSpan " + a.returnStatus.replace(/\s+/g, '_').toLowerCase() + "'>" + a.returnStatus + "</div>",
						
					};
				}
            })
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
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<IAssureTable 
									tableHeading    = {this.state.tableHeading}
									twoLevelHeader  = {this.state.twoLevelHeader} 
									dataCount       = {this.state.dataCount}
									tableData       = {this.state.tableData}
									getData         = {this.getData.bind(this)}
									tableObjects    = {this.state.tableObjects}
									// getSearchText   = {this.getSearchText.bind(this)}
								/>
							</div>				
						</div>
					</section>
				</div>
			</div>
		);
	}
}
