import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "./ProductReviewTable/IAssureTable.jsx";
import _                      from 'underscore';
import moment                 from "moment";
import "./Productreview.css";

var fiveStar = [1, 1, 1, 1, 1];

class Productreview extends Component{
    constructor(props) { 
        super(props);
        this.state = {
            tableHeading    : {
                "orderNumber"       : "Order Number",
                "productName"       : "Product Name(Product Code)",
                "vendorName"        : 'Vendor Name',
                "section"        	: 'Section',
                "category"          : 'Category',
                "subCategory"       : 'SubCategory',
                "customerName"      : 'Customer Name',
                "customerReview"    : 'Customer Review',
                "reviewDate"        : 'Review Date',
                "adminComment"      : 'Admin Comment',
                // "publishOrReject"   : 'Publish/Reject',
                "status"            : 'Status',
                "rating"            : 'Rating',
            },
            tableObjects    : {
                paginationApply : true,
                searchApply     : false,
                deleteMethod    : 'delete',
                apiLink         : '/api/customerReview',
                editUrl         : '/add-product/'
            },
            startRange      : 0,
            limitRange      : 10
        };
        window.scrollTo(0, 0);
        this.changeReviewStatus     = this.changeReviewStatus.bind(this);
        window.changeReviewStatus   = this.changeReviewStatus;
    }

    /**=========== handleChange() ===========*/
    handleChange(event){
        const target = event.target;
        const name   = target.name;
        this.setState({
            [name]: event.target.value,
        });
    }

    /**=========== componentDidMount() ===========*/
    componentDidMount() {
        this.getCount();
        this.getData(this.state.startRange, this.state.limitRange);   
        this.getSectionData();
        this.getVendorList();     
    }

    /**=========== getCount() ===========*/
    getCount(){
        axios.get('/api/customerReview/get/count')
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
            startRange      : startRange,
            limitRange      : limitRange,
            vendor 			: this.state.vendor,
			section 		: this.state.section,
			category 		: this.state.category,
			status 	        : this.state.status
        }
        this.getCount();
        axios.post('/api/customerReview/get/list', formValues)
        .then((response)=>{
            console.log('res  p', response.data);
            var tableData = response.data.map((a, ind)=>{
                return{
                    "_id"               : a._id,
                    "orderNumber"       : a.orderDetails[0] && a.orderDetails[0].orderID ? a.orderDetails[0].orderID : "-",
                    "productName"       : a.productDetails[0] && a.productDetails[0].productName ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
                    "vendorName"        : a.vendorDetails[0] && a.vendorDetails[0].companyName ? a.vendorDetails[0].companyName : "",
                    "section"        	: a.sectionDetails[0] && a.sectionDetails[0].section ? a.sectionDetails[0].section : "",
                    "category"        	: a.categoryDetails[0] && a.categoryDetails[0].category ? a.categoryDetails[0].category : "",
                    "subCategory"       : a.productDetails[0] && a.productDetails[0].subCategory ? a.productDetails[0].subCategory : "-",
                    "productImages"     : a.productDetails[0] && a.productDetails[0].productImage ? a.productDetails[0].productImage : "",
                    "customerName"      : a.customerName,
                    "customerReview"    : a.customerReview, 
                    "reviewDate"        : moment(a.createdAt).format("DD MMMM YYYY, HH:mm a"),             
                    "adminComment"      : a.adminComment ? a.adminComment : "-",
                    "orderID"           : a.orderID,
                    "productID"         : a.productID,
                    // "publishOrReject"   : "<div class='publishOrReject'><i class='fa fa-times-circle reviewActionBtns padding-15-0 " + (a.status === 'Rejected' ? 'rejectedActive' : '') +  "'name='Rejected' id='Rejected' title='Reject Customer Review' onclick=window.changeReviewStatus('"+ a._id + "-" + "Rejected" +"')></i>"+
                    //                         "<i class='fa fa-check-circle reviewActionBtns padding-15-0 " + (a.status === 'Published' ? 'publishedActive' : '') + "'name='Published' id='Published' title='Publish Customer Review' onClick=window.changeReviewStatus('"+ a._id + "-" + "Published" +"')></i></div>",
                    "status"            : "<div class='reviewStatusSpan review-" + a.status.toLowerCase() + "'>" + a.status + "</div>",
                    "rating"            : a.rating,
                };
            })
            this.setState({
                tableData : tableData
            },()=>{
                console.log("tableData => ",this.state.tableData)
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }

    /*======= changeReviewStatus() =======*/
	changeReviewStatus(id){
		console.log("name = ",id);		
		if(id){
			var formValues = {
				review_id 		: id.split("-")[0],
				status 			: id.split("-")[1]
			}
			console.log('status formvalues', formValues);
			axios.patch('/api/customerReview/change/status', formValues)
			.then((response)=>{
				console.log("response.data => ",response.data )
				// swal(response.data.message);
				this.getData(this.state.startRange, this.state.limitRange);  
			})
			.catch((error)=>{
				console.log('error => ', error);
			})
		}
	}

    /**=========== getSearchText() ===========*/
    getSearchText(searchText, startRange, limitRange){
        console.log('searchText', searchText);
        var formValues = {
            searchText : searchText, 
            startRange : startRange, 
            limitRange : limitRange
        };
        axios.post('/api/customerReview/search/post', formValues)
        .then((response)=>{
            var tableData = response.data.map((a, i)=>{
              return{
                "_id"               : a._id,
                "product"           : a.productDetails[0] ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
                "customerReview"    : a.customerReview,
                "customerName"      : a.customerName,
                "orderID"           : a.orderID,
                "productID"         : a.productID,
                "rating"            : a.rating,
                "reviewlist"        : a.reviewlist
              };
            })
            this.setState({
                tableData : tableData
            })
        })
        .catch((error)=>{
            console.log('error', error);
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section className="content">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                                <div className="row">
                                    <div className="box">
                                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                            <h4 className="NOpadding-right"> Product Reviews & Ratings </h4>
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
                                                    <select className="form-control selectRole" ref="status" name="status" id="status"
                                                        onChange={this.handleChangeFilter.bind(this)}>
                                                        <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
                                                        <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="New">New</option>  									
                                                        <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Published">Published</option> 									
                                                        <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Rejected">Rejected</option>    
                                                    </select>
                                                </div>                                            
                                            </div>
                                        </div> 
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="searchProductFromList  col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
    {/*                                                <div className="publishAllProductsClient" aria-hidden="true" data-toggle="modal" data-target={"#publishProduct"}>
                                                        Publish All Products
                                                    </div>
    */}                                                <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={"publishProduct"} role="dialog">
                                                        <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11">Publish All Products</h4>
                                                                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                                                                        <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"publishProduct"}>&times;</button>
                                                                    </div>
                                                                </div>
                                                                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <h4 className="blackLightFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to publish all products?</h4>
                                                                </div>

                                                                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                                                                    </div>
                                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
    {/*                                                                    <button onClick={this.publishAllProducts.bind(this)} type="button" className="btn adminFinish-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">PUBLISH</button>
    */}                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                </div>
                            </div>
                        </section>
                        </div>
                    </div>
                </div>
            );
        }
    }
export default Productreview ;