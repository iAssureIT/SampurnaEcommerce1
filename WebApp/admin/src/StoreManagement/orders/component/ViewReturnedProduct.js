import React, { Component }   from 'react';
import axios                  from 'axios';
// import IAssureTable           from "./ProductReviewTable/IAssureTable.jsx";
import _                      from 'underscore';
import moment                 from "moment";
import swal                   from 'sweetalert';
import CKEditor 	          from "react-ckeditor-component";
// import "./Productreview.css";


class ReturnedProductView extends Component{
	constructor(props) { 
		super(props);
		this.state = {
			submitType  : "submit"
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
			return_id   : this.props.match.params.return_id,
			roles       : roles,
            user_id     : userDetails.user_id
		},()=>{
			this.getReturnedProduct(this.state.return_id);
		})
	}

	/** =========== handleChange() =========== */
	handleChange(event){
		const target = event.target;
		const name   = target.name;

		this.setState({
			[name]: event.target.value,
		});
	}

	/** =========== getReturnedProduct() =========== */
	getReturnedProduct(return_id){
		console.log(" ===> ",return_id)
		axios.get('/api/returnedproducts/get/product/'+return_id)
		.then((response)=>{
			console.log('response => ', response.data);
			this.setState({
					"productName"           : response.data.productName ? (response.data.productName + " " + "(" + response.data.productCode) + ")" : "-",
					"vendorName"            : response.data.vendorName ? response.data.vendorName : "-",
					"reviewProductImages" 	: response.data.reviewProductImages ? response.data.reviewProductImages : ["/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg", "/images/notavailable.jpg"],
					"customerName"          : response.data.customerName ? response.data.customerName : "-",
					"customerEmail" 	    : response.data.customerEmail ? response.data.customerEmail : "-",
					"customerMobile" 	    : response.data.customerMobile ? response.data.customerMobile : "-",
					"customerComment"       : response.data.customerComment ? response.data.customerComment : "-", 
					"reasonForReturn"       : response.data.reasonForReturn ? response.data.reasonForReturn : "-", 
					"dateOfPurchase"        : response.data.dateOfPurchase ? moment(response.data.dateOfPurchase).format("DD MMMM YYYY, HH:mm a") : "-", 
                    "dateOfReturnRequested" : response.data.dateOfReturnRequested ? moment(response.data.dateOfReturnRequested).format("DD MMMM YYYY, HH:mm a") : "-",                         
					"adminComment"          : response.data.adminComment ? response.data.adminComment : "",
					"vendorComment"         : response.data.vendorComment ? response.data.vendorComment : "",
					"vendorContact" 	    : response.data.vendorContact && response.data.vendorContact !== "undefined" ? response.data.vendorContact.phone : <span className="noDataAvail"> Contact is not available </span>,
					"vendorAddress" 	    : response.data.vendorLocation && response.data.vendorLocation !== "undefined" ? response.data.vendorLocation.addressLine2 + " " + response.data.vendorLocation.addressLine1 : <span className="noDataAvail"> Address is not available </span>,
					"order_id"              : response.data.order_id,
					"product_id"            : response.data.product_id,
					"returnStatus"          : response.data.returnStatus
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
			return_id 		: event.target.id,
			adminComment 	: this.state.adminComment
		}
		// console.log('adminComment', formValues);
		axios.patch('/api/returnedproducts/add/comment', formValues)
		.then((response)=>{
			swal(response.data.message);
			this.getReturnedProduct(this.state.return_id);
			this.setState({
				adminComment : ""
			})
		})
		.catch((error)=>{
			console.log('error => ', error);
		})
	}

	/*======= onChangeComment() =======*/
	onChangeComment(evt){
		// console.log("name = ",evt);
		var newContent = evt.editor.getData();
		this.setState({
			adminComment: newContent
		},()=>{});
	}



	/*======= changeReturnStatus() =======*/
	changeReturnStatus(event){
		console.log("name = ",event.target.id);		
		if(event.target.id){
			var formValues = {
				return_id 		: this.state.return_id,
				returnStatus    : event.target.id,
                user_id         : this.state.user_id
			}
			console.log('status formvalues', formValues);
			axios.patch('/api/returnedproducts/change/status', formValues)
			.then((response)=>{
				console.log("response.data => ",response.data )
				swal(response.data.message);
				this.getReturnedProduct(this.state.return_id);
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
										<h4 className="NOpadding-right"> Returned Product </h4>
									</div>
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 reviewPageWrapper">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewActionBtnsWrapper">
												<span className={"reviewStatus "+ (this.state.returnStatus ? this.state.returnStatus.replace(/\s+/g, '_').toLowerCase() : "")}>{this.state.returnStatus}</span>
												<button className={"actionBtns pull-right " + (this.state.returnStatus === "Return Request Rejected" ? "activeAction" : "")} name="Rejected" id="Return Request Rejected" title="Reject Customer's Return Request" onClick={this.changeReturnStatus.bind(this)}>Reject</button>
												<button className={"actionBtns pull-right " + (this.state.returnStatus === "Return Request Approved" ? "activeAction" : "")} name="Approved" id="Return Request Approved" title="Approve Customer's Return Request" onClick={this.changeReturnStatus.bind(this)}>Approve</button>
											</div>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewBox">
												<div className="reviewText col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<h4 className="NOpadding-right reviewText-heading"> {this.state.reasonForReturn} </h4>
														</div> 
														<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right reviewText-content">
															{this.state.customerComment}
														</div>                                                    
												</div>
												<div className="reviewStars col-lg-12 col-md-12 col-sm-12 col-xs-12">
														{this.state.reviewProductImages && this.state.reviewProductImages.length > 0
														?
															this.state.reviewProductImages.map((a, i)=>{																
																return(
																	<div key={i} className='productImgDiv'> 
																		<img src={a} class='img-responsive' /> 
																	</div>
																		// <i  className={"fa fa-star ratingStars " + star}></i>
																);
															})
														:
															null
														}
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
														<button onClick={this.submitComment.bind(this)} id={this.state.return_id} type="button" className="btn submitComment-btn pull-right">SUBMIT</button>
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
														{/* <textarea rows="5" id="adminComment" name="adminComment" ref="adminComment" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commentTextArea"
															value       = {this.state.adminComment} 
															onChange    = {this.handleChange.bind(this)} >
														</textarea> */}
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commentTextArea">
															<CKEditor activeClass="p15" id="adminComment"  className="" content={this.state.adminComment} name="adminComment" events={{"change": this.onChangeComment}}/>
														</div>
												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitCommentBtnDiv">
														<button onClick={this.submitComment.bind(this)} id={this.state.return_id} type="button" className="btn submitComment-btn pull-right">{this.state.submitType === "update" ? "UPDATE" : "SUBMIT"}</button>
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
export default ReturnedProductView ;

