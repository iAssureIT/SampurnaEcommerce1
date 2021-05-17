import React, { Component }     from 'react';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import _                        from 'underscore';
import { withRouter }           from 'react-router-dom';
import BulkUploadComponent      from '../product/productBulkUpload/component/BulkUploadComponent';
import Message                  from '../../storeAdmin/message/Message.js';

import  '../product/productBulkUpload/css/productBulkUpload.css'

class ProductBulkUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "currentProducts"   : [],
            "productData"       : [],
            "file"              : props && props.fileData && props.fileData[0] ? props.fileData[0].fileName : '',
            "vendor"            : "",
        }
    }

    /** ========== componentWillReceiveProps() ========== */
    componentWillReceiveProps(nextProps) {
        if (nextProps.productData) {
            this.setState({
                productData : nextProps.productData
            }, () => {
                // console.log('productData', this.state.productData);
            });
        }
        if (nextProps.fileData && nextProps.fileData.length > 0) {
            var file        = nextProps.fileData[0].fileName;
            var productData = nextProps.productData;

            function checkAdult(data) {
                return data.fileName === file;
            }
            var x = productData.filter(checkAdult);
            console.log('x',x);

            this.setState({
                productData: x
            });
        }
    }

    /** ========== componentDidMount() ========== */
    componentDidMount() {
        var userDetails = JSON.parse(localStorage.getItem("userDetails"));
        var token       = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

        const user_ID = localStorage.getItem("user_ID");
        // console.log("User ID = ", user_ID);
        this.setState({
            user_ID : user_ID
        });


        axios.get("/api/adminPreference/get")
        .then(preference =>{
            console.log("preference = ",preference.data);
            this.setState({
                websiteModel      : preference.data[0].websiteModel,
            },()=>{
                if(this.state.websiteModel === "MarketPlace"){
                    this.getVendorList();
                }
            });
        })
        .catch(error=>{
            console.log("Error in getting adminPreference = ", error);
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
        this.getSectionData();
    }

    /** ========== getSectionData() ========== */
    getSectionData() {
        axios.get('/api/sections/get/list')
        .then((response) => {
            // console.log('getWebCategories', response.data);
            this.setState({
                sectionArray: response.data
            })
        })
        .catch((error) => {
            console.log('error', error);
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
    }
    
    /** ========== showRelevantCategories() ========== */
    showRelevantCategories(event) {
        var section = event.target.value;
        this.setState({
            section       : event.target.value,
            section_ID    : event.target.value.split('|')[1],
            messageData   : {},
            fileurl       : null
        })

        axios.get('/api/category/get/list/' + event.target.value.split('|')[1])
            .then((response) => {
            this.setState({
                categoryArray: response.data,
                category: "Select Category",
                subCategory: "Select Sub-Category",
            })
        })
        .catch((error) => {
            console.log('error', error);
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
    }

    /** ========== selectOption() ========== */
    selectOption(event) {
        const target    = event.target;
        const name      = target.name;
        this.setState({
            [name]      : event.target.value,
            messageData : {}
        });
    }

    /** ========== getVendorList() ========== */
    getVendorList() {
        axios.get("/api/entitymaster/get/Vendor")
        .then((response) => {
            if(response){
                console.log("vendor response:",response);
                this.setState({
                    vendorArray: response.data,
                    vendor     : response.data._id
                })
                console.log("vendorArray:",this.state.vendorArray);
            }
            
        })
        .catch((error) => {
            console.log('error', error);
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
    }

    /** ========== handleChangeCategory() ========== */
    handleChangeCategory(event){
        event.preventDefault();
        this.setState({
            category      : event.target.value,
            category_ID   : event.target.value.split('|')[1],
        })
        axios.get('/api/bulkUploadTemplate/get/' + event.target.value.split('|')[1])
        .then((response) => {
            console.log("productBulkUpload :",response.data);
            if (response.data) {
                this.setState({fileurl:response.data.templateUrl, messageData : {}})    
            }else{
                this.setState({
                    fileurl:null,
                    messageData : {
                        "type"          : "outpage",
                        "icon"          : "fa fa-exclamation",
                        "message"       : "Selected category does not have any template. Please upload template.",
                        "class"         : "warning",
                        "autoDismiss"   : true
                    }
                })
            }        
        })
        .catch((error) => {
        console.log('error', error);
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
    }

    /** ========== render() ========== */
    render() {
        console.log("bulkupdate role:",(localStorage.getItem('roles') === 'admin'))
        console.log("this.state.websiteModel:",this.state.websiteModel)
        const SheetJSFT = [
            "xlsx",
            "xls"
        ]
        const requiredData = {vendor: this.state.vendor, showVendor : true};
        // console.log("required data:",requiredData);
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding NOpadding-right">
                <section className="content">
                    <Message messageData={this.state.messageData} />
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                        <div className="row">
                            <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                                <div className="">
                                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 pull-left" >
                                            <h4 className="weighttitle NOpadding-right">Product Bulk Update</h4>
                                        </div>                                        
                                    </div> 
                                    <br/>
                                    <BulkUploadComponent 
                                        url             = "api/products/post/bulkUploadProductUpdate" 
                                        fileurl         = "../BulkUploadTemplates/Product_Update_Template.xlsx"
                                        fileDetailUrl   = "/api/products/get/filedetails/"
                                        requiredData    = {requiredData}
                                    />                                      
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default withRouter(ProductBulkUpdate);