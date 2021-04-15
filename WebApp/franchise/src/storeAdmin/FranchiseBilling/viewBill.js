import React from 'react';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import Barcode from 'react-barcode' ;
import './bill.css';
import './print.css';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import jQuery, { isNumeric, data } from 'jquery';
import $ from 'jquery';
import { countBy } from 'underscore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../redux/actions/index';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class printBill extends React.Component {
	constructor(props) {
		super(props);
		  this.state = {
				serchByDate           : moment(new Date()).format("YYYY-MM-DD"), 
				categoriesData        : [], 
				SectionsData          : [],
				SectionCategoriesData : [],
				ProductList           : [],
				section_ID            : 0,
				searchText            : '',
				completeProductName   : '',
				franchiseLocation     : '',
				cartItems             : [],
				cartData              : [],
				totalAmt              : 0,
				billNumber            : 0,
                orderData             : [],
				pos                   : '',
				showFullScreen        : false,
				showReturnProductDiv  : false,
				getBillNumbers        :'',
				billDate              : '',
				paymentMethod         : 'cash',
				disableReturnBtn      : false
          };
	}
	
	componentDidMount() {
		$('.leftsidebarbackgroundcolor').hide();
		$('#headerid').hide();
		$('#dashbordid').css('top',0);
		$('#dashbordid').removeClass('col-lg-10 col-lg-offset-2').addClass('col-lg-12');
		$('#dashbordid').removeClass('dashboardeffect');
		this.getFranchiseDetails();
		if(this.props.match.params.orderId){
			this.getOrder(this.props.match.params.orderId);
		}else{
			this.getOrder(this.props.match.params.billNo);
			this.setState({
				showReturnProductDiv : true
			})
		}

		$.validator.addMethod("noSpace", function(value, element) { 
			return value == '' || value.trim().length != 0;
		}, "No space please and don't leave it empty");

		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
	  
		  $("#returnForm").validate({
			rules: {
			  quantity: {
				required: true,
				noSpace: true
			  },
			  rate: {
				required: true,
				noSpace: true
			  },
			  discountPercent: {
				required: true,	
				noSpace: true,
			  },
			  discountedPrice:{
				required: true,
				noSpace: true
			  },
			},
			errorPlacement: function (error, element) {
			  if (element.attr("name") === "quantity") {
				error.insertAfter("#quantityDiv");
			  }
			  if (element.attr("name") === "rate") {
				error.insertAfter("#originalPriceDiv");
			  }
			  if (element.attr("name") === "discountPercent") {
				error.insertAfter("#disPercentDiv");
			  }
			  
			  if (element.attr("name") === "discountedPrice") {
				error.insertAfter("#disRateDiv");
			  }
			  if(element.attr("name") === "reasonForReturn"){
				error.insertAfter("#reasonForReturnDiv");
			  }
			}
		  });
    }

    getFranchiseDetails(){
        var userDetails = JSON.parse(localStorage.getItem('userDetails'));
		axios.get('/api/entitymaster/getCompany/'+userDetails.companyID)
        .then((response) => {
		   var franchiseLocation = '';
		   var franchiseId = '';
		   var gstNo = '';
		   var city = '';
		   var state = '';
		   var country = '';
		   var addressLine1 = '';
		   var franchiseName = '';
		 
		   response.data.locations.map(function(val,ind){
			   gstNo             = val.GSTIN;
			   city              = val.city;
			   state             = val.state;
			   country           = val.country;
			   addressLine1      = val.addressLine1;
		   })
		   this.setState({
			   "franchise_id"      : response.data._id,
			   "gstNo"             : gstNo,
			   "deliveryLocation"  : franchiseLocation,
			   "franchiseLocation" : addressLine1,
			   "franchiseName"     : response.data.companyName
			   
		   },()=>{
			   this.getBillNumbers();
		  })
          
	      })
	      .catch((error) => {
			console.log("Error in franchiseDetail = ", error);
	      })
    }
    
    printTable(){
        const w=window.open();
        w.document.write($('.viewBillDiv').html());
        w.print();
		w.close();
		
	//    const input = $('.viewBillDiv')[0];
	//    $(input).css('background','white');
    //    html2canvas(input)
    //   .then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png');
	// 	const pdf = new jsPDF({
	// 		format :[700,330]
	// 	});
	// 	console.log("image",imgData);
	// 	// options = {format:"PNG", background:"#418423"}

	// 	pdf.addImage(imgData, 'JPEG', 0, 0);
    //     pdf.output('save', 'bill.pdf'); //Try to save PDF as a file (not works on ie before 10, and some mobile devices)
	// 	pdf.output('datauristring');        //returns the data uri string
	// 	pdf.output('datauri');              //opens the data uri in current window
    //  });
	}
	
	editOrder(id,editorderInput){
		var showDiscount = false;
		var editorderInputv = editorderInput ? editorderInput : false; 

		this.state.orderData.products.map((data,index)=>{
			if(data._id == id){
				if(data.rate == 0){
					showDiscount = true;
				}
				this.setState({
					product_ID        : data.product_ID,
					// itemCode : data.productDetail.itemCode,
					quantity           : data.quantity,
					discountPercent    :data.discountPercent,
					discountedPrice    : data.discountedPrice,	
					rate               : data.originalPrice,
					showDiscount       : showDiscount,
					showEditorderInput : editorderInput,
					productToReturn    : data
				},()=>{
					
				})
			}
		});
	}

	
	openFullscreen() {
		this.setState({
			showFullScreen :true
		});
		$('#headerid').hide();
		$('#dashbordid').css('top',0);
		var elem = document.documentElement;
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
		  elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
		  elem.msRequestFullscreen();
		}
	}

	closeFullscreen() {
		$('#headerid').show();
		$('#dashbordid').css('top','');
		this.setState({
			showFullScreen :false
		})
		if (document.exitFullscreen) {
		  document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
		  document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
		  document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
		  document.msExitFullscreen();
		}
	}

	onClickReturnProducts(event){
		event.preventDefault();
		this.setState({
			showReturnProductDiv : true
		})
		window.location.href = "/return-bill/"+this.props.match.params.orderId; 
	}

	getBillNumbers(){
        axios.get('/api/billingmaster/get/billnumberlist/'+this.state.franchise_id)
		.then((response) => {
			this.setState({
				billNumbersArray: response.data
			})
		})
		.catch((error) => {
			
		})
	}

	onSearchBillNumber(event){
		event.preventDefault();
		var id = 0
		this.state.billNumbersArray.map((data, i)=>{
			if(event.target.value == data.billNumber){
				id = data._id
				window.location.href = "/return-bill/"+data._id; 
			}
		});

		this.getOrder(id);
	}

	getOrder(id){
		let returnedOrderTotal = 0;
		let returnTotal = 0;
		let returnCGSTAmt = 0;
		let returnSGSTAmt = 0;
		let returnDiscount = 0;
		let returnSubtotal = 0;
		axios.get("/api/orders/get/one/" + id)
		.then((response) => {
			response.data.returnedProduct.map((data, index) => {
				let discountedPrice = 0
				if(data.discountPercent > 0){
					returnDiscount = returnDiscount + data.discountedPrice;
					discountedPrice = data.discountedPrice;
					
				}else{
					returnDiscount = returnDiscount + 0;
					discountedPrice = 0
				}

				let totalQty = data.originalPrice * data.quantity;
				returnSubtotal = returnSubtotal + ( totalQty - discountedPrice );				
				returnedOrderTotal = returnedOrderTotal + (data.discountedPrice * data.quantity);
				returnTotal = returnTotal + (data.originalPrice * data.quantity);
				returnCGSTAmt = returnCGSTAmt +  data.CGSTAmt;
				returnSGSTAmt = returnSGSTAmt + data.SGSTAmt;

			}) 


			this.setState({
				orderData      : response.data,
				billNumber     : response.data.billNumber,
				billDate       : response.data.createdAt,
				orderID        : id,
				customerDetail : response.data.franchiseCustId,
				returnTotal    : returnTotal,
				returnDiscount : returnDiscount,
				returnSubtotal : returnSubtotal,
				returnGstTax   : returnCGSTAmt + returnSGSTAmt,
				returnAmountPayable : returnCGSTAmt + returnSGSTAmt + returnSubtotal
			},()=>{
				// console.log("returnedOrderTotal",returnedOrderTotal);
			})
		 
		})
		.catch((error) => {
		  console.log('error', error);
		})
	}

	discountedPrice(event) {
		event.preventDefault();
		this.setState({
		  [event.target.name]: event.target.value
		})

		if (event.target.value > 100) {
		  this.setState({
			discountPercentError: "Discount Percent should be less than 100."
		  })
		} else if (event.target.value < 0) {
		  this.setState({
			discountPercentError: "Discount Percent should be greater than 0.",
			discountedPrice: 0
		  })
		} else {
		  this.setState({
			discountPercentError: ""
		  })
		}
		var originalPrice = parseFloat(this.refs.originalPrice.value).toFixed(2);
	
		if (originalPrice !== "NaN") {
			var discountedPrice = event.target.value * parseFloat(originalPrice)/100;
			this.setState({
			discountedPrice: discountedPrice < 0 ? 0 : parseFloat(discountedPrice).toFixed(2)
		  })
		}
	  }
	  discountPercent(event) {
		event.preventDefault();
		this.setState({
		  [event.target.name]: event.target.value
		})
	
		var originalPrice = parseFloat(this.refs.originalPrice.value).toFixed(2);
		if (originalPrice !== "NaN") {
			var discountPercent = parseFloat(((originalPrice - event.target.value) / originalPrice) * 100).toFixed(2);
			this.setState({
			discountPercent: parseFloat(discountPercent).toFixed(2)
		  })
		}
	  }

	  percentAndPrice(event) {
		event.preventDefault();
		this.setState({
		  [event.target.name]: event.target.value,
	
		});
		if (event.target.value !== 0) {
		  this.setState({
			showDiscount: false,
			discountedPrice : event.target.value,
			discountPercent : 0
		  })
		} else {
		  this.setState({
			showDiscount: true,
			discountPercent: "",
			discountedPrice: "",
		  })
		}
	  }

	returnProductAction(event) {
		event.preventDefault();
		var id = $(event.target).data('id');
		var altorderid = $(event.target).data('altorderid');
		this.setState({
			orderID : id
		});

		var productToReturnObj = this.state.productToReturn;
		productToReturnObj.discountPercent = this.state.discountPercent;
		productToReturnObj.discountedPrice = this.state.discountedPrice
		productToReturnObj.subtotal        = this.state.discountedPrice;
		productToReturnObj.quantity        = this.state.quantity;

		var formValues = {
		  "orderID": id,
		  "altorderid"         : altorderid,
		  "productID"          : this.state.product_ID,
		  "reasonForReturn"    : this.state.reasonForReturn,
		  "returnProductArray" : this.state.productToReturn,
		  "franchise_id"       : this.state.franchise_id,
		  "paymentMethod"      : this.state.paymentMethod
		}
		
	
		if ($('#returnForm').valid()) {
		   this.setState({
				disableReturnBtn : true
			})
		  axios.patch('/api/billingmaster/returnProducts', formValues)
			.then((response) => {
			  swal("Product Returned Successfully..!");
			  $('.close').click();
			  $('.fullpageloader').hide();
			  this.getOrder(id);
			  var modal = document.getElementById('returnProductModal');
			  $('#returnProductModal').css('display','none');	
			  $('.modal-backdrop').remove();
			})
	
			.catch((error) => {
				swal("Failed to return product.");
			     console.log('error', error);
			})
		}
	  }


	onChangeEditVal(event){
		event.preventDefault();
		const {name,value} = event.target;
		this.setState({
			[name] : value 
		})
	}

	onChangeReturnReason(event){
		event.preventDefault();
		const {name,value} = event.target;
		this.setState({
			[name] : value 
		})
	}
 
	onChangePaymentMethod(paymentMethod){
		this.setState({
			"paymentMethod" : paymentMethod
		},()=>{
			// console.log("paymentMethod",this.state.paymentMethod);
		})
	}

   


	render() {
		const cartItems = this.props.recentCartData;
		let total    = 0
		 if(this.props.recentCartData.length > 0){
			total = this.props.recentCartData[0].cartItems.reduce((prev,next) => prev + next.subTotal,0);
		 }else{
			total = 0;
		 }
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding pmpageContent'>
					{this.state.showReturnProductDiv === true  ? 
						<div className="row">
						<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-offset-4 col-sm-6 col-xs-12 NOpadding paddingTop">
							    <input list="selectBillNumber" type="search" refs="selectBillNumber" className="form-control" placeholder="Search by Bill Number..." onChange={this.onSearchBillNumber.bind(this)} name="selectBillNumber" autoComplete="off"/> 
								<datalist id="selectBillNumber" name="selectBillNumber" className="billDatalist">
										{
											this.state.billNumbersArray && this.state.billNumbersArray.length > 0 ?
												this.state.billNumbersArray.map((data, i)=>{
													return(
														<option key={i} value={data.billNumber} data-id={data._id} data-orderid={data.orderId}>{data.billNumber}</option>
													);
												})
											:
											<option>No Bills available</option>
										}
								</datalist>
                                <button className="input-group button_add button button top30" type="button"><i className="fa fa-plus"></i></button>
						</div>
						</div>
						: null}
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding billPage">
							<div className="col-lg-2 col-md-2 col-sm-4 col-xs-6 billButtons">
								<a className="btn btn-info printbtn viewBillBtns fa fa-home" href="/dashboard" title="Go to Homepage"></a>
								{this.state.showFullScreen === false ? 
								<button className="btn btn-info printbtn viewBillBtns fa fa-arrows-alt" title="Open Fullscreen" onClick={this.openFullscreen.bind(this)}></button>
								: <button className="btn btn-info printbtn viewBillBtns fa fa-window-close" title="Close Fullscreen"  onClick={this.closeFullscreen.bind(this)}></button>
								}
								<a className="btn btn-info viewBillBtns" href="/franchise-billing" title="Create New Bill">New Bill</a>
								<button className="btn btn-info printbtn viewBillBtns fa fa-print" title="Print Bill" onClick={this.printTable.bind(this)}></button>
							
								{this.state.showReturnProductDiv ? '' :
								<a className="btn btn-info reTurnBill viewBillBtns" onClick={this.onClickReturnProducts.bind(this)} title="return Products">Return Bill</a> 
							   }
							</div>
						    {/* View bill div start */}
							{this.state.showReturnProductDiv === false ? 
							<div className="col-lg-4 col-lg-offset-2 col-md-6 col-sm-6 col-xs-12 viewBillDiv">
								<div className="row paddingTop10 paddingBottom">
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
									   <img className="logoImg" src="../../images/logoUnimandai.png"/>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<span>{this.state.franchiseName}</span><br/>
									    <span>{this.state.franchiseLocation}</span><br/>
										<small>GST: {this.state.gstNo}</small><br/>
									</div>
								</div>
								<div className="row">
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 billNumber">Bill No: <span className="barcode billNumber">{this.state.billNumber}</span><br/><small style={{fontSize:'small'}}>Date: {moment(this.state.billDate).format("DD MMM YYYY hh:mm a")}</small></div>
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 billNumber pullleft">
									{this.state.billNumber !== undefined ? 
									<Barcode value={this.state.billNumber}/> 
									: null
									}
								   </div>
								</div>
							    {this.state.customerDetail ?
                                Object.keys(this.state.customerDetail).length > 0 ?
								<div className="row">
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pullleft"><i className="fa fa-user bill-cust-info"></i>  {this.state.customerDetail.customerName}</div>
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pullright"><i className="fa fa-phone bill-cust-info"></i>  {this.state.customerDetail.mobile}</div>
								</div>
                                : null
                                :null}
								
								<div className="row" style={{"padding": "15px"}}> 
									<form className="productsEditForm" id="productsEditForm">
									<div className="table-responsive billTable marginBottom50">
										<table className="table table-borderless commontable billTable">
											<thead>
												<tr>
												<th scope="col">ITEM</th>
												<th scope="col">QTY <br/>CGST</th>
												<th scope="col">RATE<br/>SGST</th>
												<th scope="col">DISCOUNT</th>
												<th scope="col" className="pull-right">AMOUNT</th>
												</tr>
											</thead>
											<tbody>
											{
												this.state.orderData ?
                                                this.state.orderData.products && this.state.orderData.products.length > 0 ?
                                                    this.state.orderData.products.map((data, index) => {
													data.subTotal = (data.originalPrice * data.quantity) - data.discountedPrice;
													return(
														<tr>
															<td>{data.productName}</td>
															<td> 
													              <small>{data.quantity} {data.unit}</small>
																  <br/>
													              <small>{data.CGST}<i className="fa fa-percent"></i> {parseFloat(data.CGSTAmt).toFixed(2)}</small>
															</td>
															<td>
																{data.originalPrice}
															    <br/>
													            <small>{data.SGST}<i className="fa fa-percent"></i> {parseFloat(data.SGSTAmt).toFixed(2)}</small>
															</td>
															<td>{data.discountPercent}<i class="fa fa-percent"></i>&nbsp;&nbsp;&nbsp;&nbsp;{data.discountedPrice}</td>
															<td className="pull-right">{data.subTotal}</td>
													    </tr>
													)
												   
												})
												:
												null
											: null
											} 
											</tbody>
											<tfoot>
												<tr>
													{this.state.orderData.cartQuantity > 0  ?
														<td colSpan="3">Items/Qty {this.state.orderData.cartQuantity}</td>
														:
														<td colSpan="3">Items/Qty 0</td>
													}
													<td colSpan="3">Total Amount: <span className="pull-right"><i className="fa fa-inr"></i> { parseFloat(this.state.orderData.total).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="3"></td>
												   <td className="" colSpan="3">Discount: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.discount).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="3"></td>
												   <td className="" colSpan="3">Subtotal: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.subTotal).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="3"></td>
												   <td className="" colSpan="3">GST TAX: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.gstTax).toFixed(2)}</span></td>
												</tr>
												<tr className="totalNetAmount" colSpan="4">
												   <td colSpan="3"></td>
												   <td className="totalNetAmount" colSpan="3">Amount Paid : <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.amountPayable).toFixed(2)}</span></td>
												</tr>
											</tfoot>
											</table>
										</div>
										<div className="row" style={{"padding": "15px"}}>
												<span>Payment Method : {this.state.orderData.paymentMethod}</span>
										</div>
										<div className="row">
											{/* <ul className="declaration"><b>Declaration</b>
												<li>  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
											</ul> */}
											<h5 style={{textAlign:'center',fontSize:"medium",fontWeight: 600}}>!!! Thank You !!! Visit Again !!!</h5>
										</div>
										
									</form>
								</div>
							</div> 
							: 
							/* View Bill div end */
							/* Return product div start */
							Object.keys(this.state.orderData).length > 0 ? 
							<div className="">
							<div className="col-lg-4 col-lg-offset-2 col-md-6 col-sm-6 col-xs-12 viewBillDiv">
								<div className="row paddingTop10 paddingBottom">
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
									   <img className="logoImg" src="../../images/logoUnimandai.png"/>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<span>{this.state.franchiseName}</span><br/>
									    <span>{this.state.franchiseLocation}</span><br/>
										<small>GST: {this.state.gstNo}</small><br/>
									</div>
								</div>
								<div className="row">
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 billNumber">Bill No: <span className="barcode billNumber">{this.state.billNumber}</span><br/><small style={{fontSize:'small'}}>Date: {moment(this.state.billDate).format("DD MMM YYYY hh:mm a")}</small></div>
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 billNumber pullleft">
									{this.state.billNumber !== undefined ? 
									<Barcode value={this.state.billNumber}/> 
									: null
									}
								   </div>
								</div>
							    {this.state.customerDetail ?
                                Object.keys(this.state.customerDetail).length > 0 ?
								<div className="row">
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pullleft"><i className="fa fa-user bill-cust-info"></i>  {this.state.customerDetail.customerName}</div>
								   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12"><i className="fa fa-phone bill-cust-info"></i>   {this.state.customerDetail.mobile}</div>
								</div>
                                : null
                                :null}
								<div className="row" style={{"padding": "15px"}}> 
									<form className="productsViewForm" id="productsViewForm">
									<div className="table-responsive billTable">
										<table className="table table-borderless commontable viewBillTable">
											<thead>
												<tr>
												<th scope="col">ITEM</th>
												<th scope="col">QTY <br/>CGST</th>
												<th scope="col">RATE<br/>SGST</th>
												<th scope="col">DISCOUNT</th>
												<th scope="col">AMOUNT</th>
												<th scope="col"></th>
												</tr>
											</thead>
											<tbody>
											{
                                                this.state.orderData.products && this.state.orderData.products.length > 0 ?
                                                    this.state.orderData.products.map((data, index) => {
													data.subTotal = (data.originalPrice * data.quantity) - data.discountedPrice;

													var status = data.status ? data.status : '';
													return(
														<tr>
															<td>{data.productName}</td>
															<td> 
													              <small>{data.quantity} {data.unit}</small>
																  <br/>
													              <small>{data.CGST}<i className="fa fa-percent"></i> {parseFloat(data.CGSTAmt).toFixed(2)}</small>
															</td>
															<td>
																{data.originalPrice}
															    <br/>
													            <small>{data.SGST}<i className="fa fa-percent"></i> {parseFloat(data.SGSTAmt).toFixed(2)}</small>
															</td>
															<td>{data.discountPercent}<i className="fa fa-percent"></i>&nbsp;&nbsp;&nbsp;&nbsp;{data.discountedPrice}</td>
															<td>{data.subTotal}</td>
															{data.status !== 'Returned' ?
															<td>
																<span className="fa fa-pencil" data-toggle="modal" title="Partial Return" onClick={this.editOrder.bind(this,data._id)} data-target={"#editorder"+ data._id} id={data._id}></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																{/* onClick={this.openproductApproval.bind(this)} */}
																<span className="fa fa-undo" data-toggle="modal" title="Partial Return" onClick={this.editOrder.bind(this,data._id,false)} data-target={"#editorder"+ data._id} id={data._id}></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

																{/* <span className="fa fa-undo" title="Return Product"  data-toggle="modal"  onClick={this.editOrder.bind(this,data._id,false)}  data-target={"#editorder"+ data._id} id={data._id} aria-hidden="true"></span> */}
																<div className="modal fade" id={"editorder"+ data._id} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
																<div className="modal-dialog modal-dialog-centered" role="document">
																	<div className="modal-content">
																	<div className="modal-header">
																	    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
																			<span aria-hidden="true">&times;</span>
																		</button>
																		<h3 className="modal-title" id="exampleModalLongTitle">Return Purchase Item</h3>
																	</div>
																	<div className="modal-body">
																		<form id="returnForm">
																		<h4>{data.productName}</h4>
																		{this.state.showEditorderInput ?
																		<div>
																		<div className="row textAlignCenter">
																			<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 ">
																				<label className="control-label statelabel locationlabel" >Quantity <i className="redFont">*</i></label>
																				<div className="input-group inputBox-main  new_inputbx quantityDiv" >
																					<div className="input-group-addon inputIcon">
																					    <small>{data.unit}</small>
																					</div> 
																					<input type="number" placeholder="" className="form-control new_inputbx1" value={this.state.quantity} prevvalue={data.quantity} name="quantity" refs="quantity" onChange={this.onChangeEditVal.bind(this)} id="quantity" min={data.quantity} size={data.size} unit={data.unit} productid={data.product_ID} id={data._id} dataquntity={this.state.quantityAdded !== 0 ? this.state.quantityAdded : data.quantity} availablequantity={data.availableQuantity} required/>
																				</div>     
																			</div>  
																			<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 ">
																				<label className="control-label statelabel locationlabel" >Rate <i className="redFont">*</i></label>
																				<div className="input-group inputBox-main  new_inputbx originalPriceDiv" >
																					<div className="input-group-addon inputIcon">
																					<i className="fa fa-rupee"></i>
																					</div> 
																					<input type="number" placeholder="" className="form-control new_inputbx1" value={this.state.rate} name="rate" refs="rate" onChange={this.onChangeEditVal.bind(this)} productid={data.product_ID} id="rate" min="1" ref="originalPrice" discountpercent={data.discountPercent} discountedprice={data.discountedPrice} required/>
																				</div>     
																			</div>  
																			<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 disPercentDiv">
																				<label className="control-label statelabel locationlabel" >Discount <i className="redFont">*</i></label>
																				<div className="input-group inputBox-main  new_inputbx" >
																					<input max={100} disabled={this.state.showDiscount} value={this.state.discountPercent} onChange={this.discountedPrice.bind(this)} placeholder="Discount Percent" id="discountPercent" name="discountPercent" type="number" className="form-control  availableQuantityNew" aria-describedby="basic-addon1" ref="discountPercent" min="0"/>
																					<div className="input-group-addon inputIcon discountInput">
																						<i className="fa fa-percent"></i>
																					</div> 
																				</div>     
																			</div>  
																			<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 disRateDiv">
																				<label className="control-label statelabel locationlabel" >Discount Rate <i className="redFont">*</i></label>
																				<div className="input-group inputBox-main  new_inputbx" >
																					<div className="input-group-addon inputIcon">
																					<i className="fa fa-rupee"></i>
																					</div> 
																					<input max={this.state.rate} disabled={this.state.showDiscount} onChange={this.discountPercent.bind(this)} value={this.state.discountedPrice} id="discountedPrice" name="discountedPrice" type="number" className="form-control  selectdropdown" placeholder="Discounted Price" aria-describedby="basic-addon1" ref="discountedPrice"  max={this.state.rate} min="0"/>

																				</div>     
																			</div>  
																		</div>
																		<br/>
																		
																		<div className="row textAlignCenter">
																		   <h4 className="retrunBillSubtotal">Subtotal : <i className="fa fa-rupee"></i> {(this.state.rate) * (this.state.quantity) - (this.state.discountedPrice)}</h4>
																		</div>
																		<br/>
																		</div>
																		: null }
																		
																		<div className="row" id="reasonForReturnDiv">
																		    <label className="reasonForReturnlabel">Reason for Return <i className="redFont">*</i></label>
																			<textarea rows="3" cols="110" className="reasonForReturn" name="reasonForReturn" value={this.state.reasonForReturn} onChange={this.onChangeReturnReason.bind(this)} required></textarea>
																		</div>
																		<div className="row textAlignLeft" style={{"padding": "15px"}}>
																				<b>Payment Method :</b> <div class="btn-group btn-group-toggle" data-toggle="buttons">
																						<label class="btn btn-secondary active" onClick={this.onChangePaymentMethod.bind(this,"cash")}>
																							<input type="radio" name="paymentmethod" id="option1" autocomplete="off" value={this.state.paymentMethod}  checked={this.state.paymentMethod == 'cash'}/> Cash
																						</label>
																						<label class="btn btn-secondary" onClick={this.onChangePaymentMethod.bind(this,"UPI")}>
																							<input type="radio" name="paymentmethod" id="option2" autocomplete="off" value={this.state.paymentMethod} checked={this.state.paymentMethod == 'UPI'}/> UPI
																						</label>
																				</div>
																		</div>
																		</form>
																	</div>
																	<div className="modal-footer">
																		<button type="button" className="btn btn-primary" data-id={this.state.orderData._id} data-altorderid={this.state.orderData.orderID}  onClick={this.returnProductAction.bind(this)} disabled={this.state.disableReturnBtn}>Return</button>
																	</div>
																	</div>
																</div>
																</div>
						 									</td>
														: <td></td>}
													</tr>
													)
												})
												:
												null
											} 
											</tbody>
											<tfoot>
												<tr>
													{this.state.orderData.cartQuantity > 0 ?
														<td colSpan="4">Items/Qty {this.state.orderData.cartQuantity}</td>
														:
														<td colSpan="4">Items/Qty 0</td>
													}
													<td colSpan="4">Total Amount: <span className="pull-right"><i className="fa fa-inr"></i> { parseFloat(this.state.orderData.total).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">Discount: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.discount).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">Subtotal: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.subTotal).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">GST TAX: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.gstTax).toFixed(2)}</span></td>
												</tr>
												<tr className="totalNetAmount" colSpan="4">
												   <td colSpan="4"></td>
												   <td className="totalNetAmount" colSpan="4">Amount Paid : <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.orderData.amountPayable).toFixed(2)}</span></td>
												</tr>
											</tfoot>
											</table>
										</div>
										{
										this.state.orderData ?
											this.state.orderData.paymentMethod ? 
											<div className="row" style={{"padding": "15px"}}>
													<span><b>Payment Method</b> : {this.state.orderData.paymentMethod}</span>
											</div>
											: null
										:null
									    }
										{
										this.state.orderData ? 
										this.state.orderData.returnedProduct.length > 0 ?
										<div>
										<div className="table-responsive billTable returnItemsTable">
											<h5><b>Returned Items</b></h5>
											<table className="table table-borderless commontable">
											<thead>
												<tr>
												<th scope="col">ITEM</th>
												<th scope="col">QTY <br/>CGST</th>
												<th scope="col">RATE<br/>SGST</th>
												<th scope="col">DISCOUNT</th>
												<th scope="col">PAYMENT</th>
												<th scope="col">RETURNED DATE</th>
												<th scope="col">AMOUNT</th>
												</tr>
											</thead>
											<tbody>
											{
                                                this.state.orderData.returnedProduct && this.state.orderData.returnedProduct.length > 0 ?
                                                    this.state.orderData.returnedProduct.map((data, index) => {
													data.subTotal = (data.originalPrice * data.quantity) - data.discountedPrice;
													return(
														<tr>
															<td>{data.productName}</td>
															<td> 
													              <small>{data.quantity} {data.unit}</small>
																  <br/>
													              <small>{data.CGST}<i className="fa fa-percent"></i> {parseFloat(data.CGSTAmt).toFixed(2)}</small>
															</td>
															<td>
																{data.originalPrice}
															    <br/>
													            <small>{data.SGST}<i className="fa fa-percent"></i> {parseFloat(data.SGSTAmt).toFixed(2)}</small>
															</td>
															<td>{data.discountPercent}<i class="fa fa-percent"></i>&nbsp;&nbsp;&nbsp;&nbsp;{data.discountedPrice}</td>
															<td>{data.paymentMethod}</td>
															<td>{moment(data.returnedDate).format("DD MMM YYYY")}</td>
															<td>{data.subTotal}</td>
													    </tr>
													)
												   
												})
												:
												null
											} 
											</tbody>
											<tfoot>
											    <tr>
													{this.state.orderData.returnedProduct.length > 0 ?
														<td colSpan="4">Items/Qty {this.state.orderData.returnedProduct.length}</td>
														:
														<td colSpan="4">Items/Qty 0</td>
													}
													<td colSpan="4">Total Amount: <span className="pull-right"><i className="fa fa-inr"></i> { parseFloat(this.state.returnTotal).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">Discount: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.returnDiscount).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">Subtotal: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.returnSubtotal).toFixed(2)}</span></td>
												</tr>
												<tr>
												   <td colSpan="4"></td>
												   <td className="" colSpan="4">GST TAX: <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.returnGstTax).toFixed(2)}</span></td>
												</tr>
												<tr className="totalNetAmount" colSpan="4">
												   <td colSpan="4"></td>
												   <td className="totalNetAmount" colSpan="4">Amount Paid : <span className="pull-right"><i className="fa fa-inr"></i> {parseFloat(this.state.returnAmountPayable).toFixed(2)}</span></td>
												</tr>
											</tfoot>
											</table>
										</div>
										</div>
										: null
										: null
									    }
									
										<div className="row Slogan" style={{"padding": "13px"}}>
											{/* <ul className="declaration"><b>Declaration</b>
												<li>  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
											</ul> */}
											<h5 style={{textAlign:'center',fontSize:"medium",fontWeight: 600}}>!!! Thank You !!! Visit Again !!!</h5>
										</div>
										
									</form>
								</div>
							</div> 
							</div>
							: 	
							<div className="col-lg-4 col-lg-offset-2 col-md-6 col-sm-6 col-xs-12">
							     <h3 style={{color:'darkgray'}}>Please search bill number to return products</h3>
						    </div> 
							}
							{/* return bill div end */}
							</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	//console.log("mapStateToProps",state);
	return {
	  recentCartData :  state.recentCartData
	}
  }
  const mapDispachToProps = (dispatch) => {
	return  bindActionCreators({ fetchCartData: getCartData }, dispatch)
  }
  export default connect(mapStateToProps, mapDispachToProps)(printBill);