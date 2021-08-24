import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "./ProductReviewTable/IAssureTable.jsx";
import _                      from 'underscore';
import moment                 from "moment";
import swal                   from 'sweetalert';
import CKEditor 	          from "react-ckeditor-component";
import "./Productreview.css";


class Productreview extends Component{
	constructor(props) { 
		super(props);
		this.state = {
			submitType  			: "submit",
			"error-adminComment" : ""
		};
		window.scrollTo(0, 0);
		this.onChangeComment  = this.onChangeComment.bind(this);
	}
	 
	/** =========== componentDidMount() =========== */
	componentDidMount() {
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var roles         = userDetails.roles;
		// this.getData(this.state.startRange, this.state.limitRange);
		
		this.setState({
			review_id   : this.props.match.params.review_id,
			roles       : roles
		},()=>{
			this.getReview(this.state.review_id);
		})
	}

	/** =========== componentWillReceiveProps() =========== */
	componentWillReceiveProps(nextProps) {
		  
	}

	/** =========== handleChange() =========== */
	handleChange(event){
		const target = event.target;
		const name   = target.name;

		this.setState({
			[name]: event.target.value,
		});
	}

	/** =========== getReview() =========== */
	getReview(review_id){
		console.log(" ===> ",review_id)
		axios.get('/api/customerReview/get/review/'+review_id)
		.then((response)=>{
			console.log('response => ', response.data);
			this.setState({
				"orderID"           		: response.data.orderID ? response.data.orderID : <span className="noDataAvail"> -- NA -- </span>,
				"productName"           : response.data.productName ? response.data.productName : <span className="noDataAvail"> -- NA -- </span>,
				"productCode"           : response.data.productCode ? response.data.productCode : <span className="noDataAvail"> -- NA -- </span>,
				"itemCode"           	: response.data.itemCode ? response.data.itemCode : <span className="noDataAvail"> -- NA -- </span>,
				"section"           		: response.data.section ? response.data.section : <span className="noDataAvail"> -- NA -- </span>,
				"category"           	: response.data.category ? response.data.category : <span className="noDataAvail"> -- NA -- </span>,
				"subCategory"           : response.data.subCategory ? response.data.subCategory : <span className="noDataAvail"> -- NA -- </span>,
				"size"           			: response.data.size ? response.data.size : <span className="noDataAvail"> -- NA -- </span>,
				"color"           		: response.data.color ? response.data.color : <span className="noDataAvail"> -- NA -- </span>,
				"unit"           			: response.data.unit ? response.data.unit : <span className="noDataAvail"> -- NA -- </span>,
				"vendorName"            : response.data.vendorName ? response.data.vendorName : <span className="noDataAvail"> -- NA -- </span>,
				"reviewProductImages"   : response.data.reviewProductImages && response.data.reviewProductImages !== "undefined" &&  response.data.reviewProductImages.length > 0 ? response.data.reviewProductImages : [],
				"customerName"          : response.data.customerName ? response.data.customerName : <span className="noDataAvail"> -- NA -- </span>,
				"customerEmail" 	    	: response.data.customerEmail ? response.data.customerEmail : <span className="noDataAvail"> -- NA -- </span>,
				"customerMobile" 	    	: response.data.customerMobile ? response.data.customerMobile : <span className="noDataAvail"> -- NA -- </span>,
				"customerReview"    		: response.data.customerReview ? response.data.customerReview : "-", 	
				"dateOfPurchase"        : response.data.dateOfPurchase ? moment(response.data.dateOfPurchase).format("DD MMMM YYYY, HH:mm a") : <span className="noDataAvail"> -- NA -- </span>, 
				"reviewDate"        		: response.data.reviewDate ? moment(response.data.reviewDate).format("DD MMMM YYYY, HH:mm a") : "-",             
            "adminComments"         : response.data.adminComments && response.data.adminComments.length > 0 ? response.data.adminComments : [],
				"vendorComment"         : response.data.vendorComment ? response.data.vendorComment : "",
				"vendorContact" 	    	: response.data.vendorContact && response.data.vendorContact !== "undefined" ? response.data.vendorContact.phone : <span className="noDataAvail"> Contact is not available </span>,
				"vendorLocation" 	    	: response.data.vendorLocation && response.data.vendorLocation !== "undefined" ? response.data.vendorLocation.addressLine2 + " " + response.data.vendorLocation.addressLine1 : <span className="noDataAvail"> Address is not available </span>,
				"order_id"              : response.data.order_id,
				"product_id"            : response.data.product_id,
				"status"            		: response.data.status,
				"rating"            		: response.data.rating
			},()=>{
				if(this.state.adminComment && this.state.adminComment !== "undefined"){
					this.setState({
						submitType  : "update"
					})
				}
			})
		})
		.catch((error)=>{
			console.log('error', error);
		})
	}

	/** =========== submitComment() =========== */
	submitComment(event){
		var formValues = {
			review_id 	: event.target.id,
			comment 		: this.state.adminComment,
			commentBy 	: "Admin"
		}
		// console.log('adminComment', formValues);
		if (this.state.adminComment !== "" && this.state["error-adminComment"] === "") {
			axios.patch('/api/customerReview/add/comment', formValues)
			.then((response)=>{
				swal(response.data.message);
				this.getReview(this.state.review_id);
				this.setState({
					adminComment : ""
				})
			})
			.catch((error)=>{
				console.log('error => ', error);
			})
		}else{
			this.setState({
				"error-adminComment" : "Please add comment..."
			})
		}
	}

	/*======= onChangeComment() =======*/
	onChangeComment(evt){
		// console.log("name = ",evt);
		var newContent = evt.editor.getData();
		this.setState({
			adminComment: newContent
		},()=>{
			if (this.state.adminComment !== "") {
				this.setState({
					"error-adminComment" : ""
				})
			}
		});
	}



	/*======= changeReviewStatus() =======*/
	changeReviewStatus(event){
		console.log("name = ",event.target.id);		
		if(event.target.id){
			var formValues = {
				review_id 		: this.state.review_id,
				status 			: event.target.id
			}
			console.log('status formvalues', formValues);
			axios.patch('/api/customerReview/change/status', formValues)
			.then((response)=>{
				console.log("response.data => ",response.data )
				swal(response.data.message);
				this.getReview(this.state.review_id);
			})
			.catch((error)=>{
				console.log('error => ', error);
			})
		}
	}

	/** =========== render() =========== */
	render(){
		var fiveStar = [1, 1, 1, 1, 1];
		return(
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<section className="content">
						<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
							<div className="row">
								<div className="box">
									<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<h4 className="NOpadding-right"> Product Review </h4>
									</div>
									{/*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 reviewPageWrapper">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewActionBtnsWrapper">
												{console.log(" => ",this.state.status)}
												<span className={"reviewStatus review-"+ (this.state.status ? this.state.status.toLowerCase() : "")}>{this.state.status}</span>
												<button className={"actionBtns pull-right " + (this.state.status === "Rejected" ? "activeAction" : "")} name="Rejected" id="Rejected" title="Reject Customer Review" onClick={this.changeReviewStatus.bind(this)}>Reject</button>
												<button className={"actionBtns pull-right " + (this.state.status === "Published" ? "activeAction" : "")} name="Published" id="Published" title="Publish Customer Review" onClick={this.changeReviewStatus.bind(this)}>Publish</button>
											</div>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewBox">
												<div className="reviewText col-lg-8 col-md-8 col-sm-12 col-xs-12">
														<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<h4 className="NOpadding-right reviewText-heading"> Review </h4>
														</div> 
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right reviewText-content">
															{this.state.customerReview}
														</div> 
														{console.log("reviewProductImages => ",this.setState.reviewProductImages)}
														{this.state.reviewProductImages && this.state.reviewProductImages.length > 0
														?
															this.state.reviewProductImages.map((a, i)=>{
																return(
																	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 productImgDiv">
																		<img src={a} class='img-responsive' /> 
																	</div>  
																);
															})
														:
															null
														}
														                                                  
												</div>
												<div className="reviewStars col-lg-4 col-md-4 col-sm-12 col-xs-12">
														{
															fiveStar.map((a, i)=>{
																console.log("review ===> ",a)
																if(i < this.state.rating){
																		var star = 'activestar';                                                        
																}else{
																		var star = 'deactivestar'
																}
																return(
																		<i key={i} className={"fa fa-star ratingStars " + star}></i>
																);
															})
														}
														<h4 className="NOpadding-right rating-text"> 
														{
															this.state.rating === 1
															?
																"Poor"
															:
																this.state.rating === 2
															?
																"Average"
															:
															this.state.rating === 3
															?
																"Good"
															:
															this.state.rating === 4
															?
																"Very Good"
															:
																"Excellent"
														}
														</h4>
												</div>
											</div>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 customerDetails">
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12"> 
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Product Name</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.productName} </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Review On</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text">{this.state.reviewDate} </h4>
													</div>
												</div>
												<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Customer Name </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.customerName} </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Customer Email</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.customerEmail} </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Customer Contact</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.customerMobile} </h4>
													</div>
												</div>
												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12"> 
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Vendor Name</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.vendorName} </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Vendor's Branch Address</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.vendorAddress} </h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-heading"> Vendor's Branch Contact</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="NOpadding-right customerDetails-text"> {this.state.vendorContact} </h4>
													</div>
												</div>
											</div> 
											{this.state.roles && this.state.roles.lenth > 0 && this.state.roles.contains("vendor")
											?                                             
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<h4 className="NOpadding-right reviewText-heading"> Vendor Comment </h4>
														</div>                                                                                                        
														<textarea rows="5" id="vendorComment" name="vendorComment" ref="vendorComment" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commentTextArea"
															value       = {this.state.vendorComment} 
															onChange    = {this.handleChange.bind(this)} >                                                    
														</textarea>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitCommentBtnDiv">
														<button onClick={this.submitComment.bind(this)} id={this.state.review_id} type="button" className="btn submitComment-btn pull-right">SUBMIT</button>
													</div>
												</div>
											:
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
																<h4 className="NOpadding-right reviewText-heading"> Vendor Comment </h4>
															</div>                                                                                                        
															<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 vendorCommentDiv">
																{this.state.vendorComment
																?
																<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																	<li dangerouslySetInnerHTML={{'__html' : this.state.vendorComment}}></li>
																</ul>
																:
																	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 vendorCommentContent"> "Vendor has not yet commented on Customer Review."</div>
																}
															</div> 
														</div>                                                
												</div>
											}
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<h4 className="NOpadding-right reviewText-heading"> Admin Comment </h4>
														</div> 
														{console.log("this.state.adminComment => ",(this.state.adminComment ? this.state.adminComment : ""))}
														
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commentTextArea">
															<CKEditor activeClass="p15" id="adminComment"  className="" content={this.state.adminComment} name="adminComment" events={{"change": this.onChangeComment}}/>
														</div>
												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitCommentBtnDiv">
														<button onClick={this.submitComment.bind(this)} id={this.state.review_id} type="button" className="btn submitComment-btn pull-right">{this.state.submitType === "update" ? "UPDATE" : "SUBMIT"}</button>
												</div>
											</div>
										</div>
									</div>*/}
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 reviewPageWrapper">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewActionBtnsWrapper">
													<span className={"reviewStatus "+ (this.state.status ? this.state.status.replace(/\s+/g, '_').toLowerCase() : "")}>{this.state.status}</span>													
												</div>
											</div>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBottom10">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrderDetails NOPadding">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10">
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Order Number : </label>
															<span className="customerDetails-text"> {this.state.orderID} </span>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Order Date : </label>
															<span className="customerDetails-text"> {this.state.dateOfPurchase} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Product Name : </label>
															<span className="customerDetails-text"> {this.state.productName} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Section : </label>
															<span className="customerDetails-text"> {this.state.section} </span>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Category : </label>
															<span className="customerDetails-text"> {this.state.category} </span>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> SubCategory : </label>
															<span className="customerDetails-text"> {this.state.subCategory} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Product ID : </label>
															<span className="customerDetails-text"> {this.state.productCode} </span>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Item ID : </label>
															<span className="customerDetails-text"> {this.state.itemCode} </span>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Size : </label>
															<span className="customerDetails-text"> {this.state.size} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
														<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Colour : </label>
															<span className="customerDetails-text"> {this.state.color} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10">
														<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Vendor Name : </label>
															<span className="customerDetails-text"> {this.state.vendorName} </span>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Vendor Location : </label>
															<span className="customerDetails-text"> {this.state.vendorLocation} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10 marginBottom10">
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Customer Name : </label>
															<span className="customerDetails-text"> {this.state.customerName} </span>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Email : </label>
															<span className="customerDetails-text"> {this.state.customerEmail} </span>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12"> 
															<label className="NOpadding-right customerDetails-heading"> Contact : </label>
															<span className="customerDetails-text"> {this.state.customerMobile} </span>
														</div>
													</div>
												</div> 
											</div> 
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  marginTop10 marginBottom10">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ProductReturnedReason">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop10 dashedBorder NOPadding">
														<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 NOpadding-left"> 
															<label className="NOpadding-right reviewText-heading"> Customer Review </label>
														</div>
														<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOPadding pull-right"> 
															<label className="NOpadding-right customerDetails-heading"> Review Date : </label>
															<span className="customerDetails-text"> {this.state.reviewDate} </span>
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10">
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop10 marginBottom10 NOPadding">
															{this.state.customerReview}
														</div>
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop10 marginBottom10 NOPadding">
															{
																fiveStar.map((a, i)=>{
																	if(i < this.state.rating){
																			var star = 'activestar';                                                        
																	}else{
																			var star = 'deactivestar'
																	}
																	return(
																			<i key={i} className={"fa fa-star ratingStars " + star}></i>
																	);
																})
															}
															<h4 className="NOpadding-right rating-text"> 
															{
																this.state.rating === 1
																?
																	"Poor"
																:
																	this.state.rating === 2
																?
																	"Average"
																:
																this.state.rating === 3
																?
																	"Good"
																:
																this.state.rating === 4
																?
																	"Very Good"
																:
																this.state.rating === 4
																?
																	"Excellent"
																:
																	""
															}
															</h4>
														</div>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding"> 
															<label className="NOpadding-right customerDetails-heading"> Images / Videos Shared by Customer </label>
														</div>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding"> 
															{this.state.reviewProductImages && this.state.reviewProductImages.length > 0
																?
																	this.state.reviewProductImages.map((a, i)=>{																
																		return(
																			<div key={i} className='productImgDiv'> 
																				<img src={a ? a : "/images/notavailable.jpg"} class='img-responsive' /> 
																			</div>
																				// <i  className={"fa fa-star ratingStars " + star}></i>
																		);
																	})
																:
																	<div class = 'noDataAvail marginBottom10'> No Images / Videos Shared by Customer </div>
															}
														</div>
													</div>
												</div> 
											</div> 

											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop10">
												{this.state.adminComments && this.state.adminComments.length > 0 
												?             
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox">
														{this.state.adminComments.map((comment, i)=>{ 

															return(                            
																<div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding marginTop10 dashedBorder">
																		<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 NOPadding"> 
																			<h4 className="NOpadding-right reviewText-heading"> {comment.commentBy} Comment </h4>
																		</div>
																		<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 pull-right"> 
																			<label className="NOpadding-right customerDetails-heading"> Commented On : </label>
																			<span className="customerDetails-text"> {comment.commentedOn} </span>
																		</div>
																	</div>
																	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 commentBackground marginTop10 marginBottom10">
																		<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																			<li dangerouslySetInnerHTML={{'__html' : comment.comment}}></li>
																		</ul>
																	</div> 
																</div>
															)
														}) } 
													</div>
												:
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox marginBottom10">
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 vendorCommentDiv">
															<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 vendorCommentContent"> "Admin / Vendor has not yet commented on Customer Review."</div>				                                            
														</div>
													</div>
												}
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 adminCommentBox marginTop10">
													<form id="CommentForm">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
															<div className="box-header dashedBorder col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
																<h4 className="NOpadding-right reviewText-heading"> Admin Comment </h4>
															</div> 															
															<label className="errorMessage" id={'error-adminComment'} value={this.state['error-adminComment']}>{this.state['error-adminComment']}</label>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commentTextArea">
																<CKEditor activeClass="p15" id="adminComment"  className="" content={this.state.adminComment} name="adminComment" events={{"change": this.onChangeComment}}/>
															</div>															
														</div>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitCommentBtnDiv">
															<button onClick={this. submitComment.bind(this)} id={this.state.return_id} type="button" className="btn submitComment-btn pull-right">{this.state.submitType === "update" ? "Update" : "Submit"}</button>
															<button className={"btn submitAndReject-btn pull-right  "} name="Rejected" id="Rejected" title="Reject Customer Review" onClick={this.changeReviewStatus.bind(this)}>Reject</button>
															<button className={"btn submitAndApprove-btn pull-right  "} name="Published" id="Published" title="Publish Customer Review" onClick={this.changeReviewStatus.bind(this)}>Publish</button>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}
export default Productreview ;

