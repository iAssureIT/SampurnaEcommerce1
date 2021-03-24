import React, { Component } from 'react';
import axios from 'axios';
import _ from 'underscore';
import { withRouter } from 'react-router-dom';
import BulkUploadComponent from './BulkUploadComponent';
import  '../css/productBulkUpload.css'
import Message from '../../../../storeAdmin/message/Message.js';

class UpdateProductBulkUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "currentProducts"   : [],
            "productData"       : [],
            "file"              : props && props.fileData && props.fileData[0] ? props.fileData[0].fileName : '',
            "vendor"            : "",
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.productData) {
            this.setState({
                productData: nextProps.productData
            }, () => {
                // console.log('productData', this.state.productData);
            });
        }
        if (nextProps.fileData && nextProps.fileData.length > 0) {
            var file = nextProps.fileData[0].fileName;
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

    componentDidMount() {
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
          }) 

        this.getSectionData();
    }


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
          })
    }
    showRelevantCategories(event) {
        var section = event.target.value;
        this.setState({
          section: event.target.value,
          section_ID: event.target.value.split('|')[1],
          messageData : {},
          fileurl:null
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
          })
    }
    showProgressBar() {
      
    }
    
    
    selectOption(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value,
            messageData : {}
        });
    }
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
            })
    }
    handleChangeCategory(event){
        event.preventDefault();
        this.setState({
          category: event.target.value,
          category_ID: event.target.value.split('|')[1],
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
                            "type" : "outpage",
                            "icon" : "fa fa-exclamation",
                            "message" : "Selected category does not have any template. Please upload template.",
                            "class": "warning",
                            "autoDismiss" : true
                        }
                    })
            }
            
          })
          .catch((error) => {
            console.log('error', error);
          })
    }


    render() {
        // console.log("role:",localStorage.getItem('roles'))
        const SheetJSFT = [
            "xlsx",
            "xls"
        ]
        const requiredData = {vendor: this.state.vendor};
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
                                            <h4 className="weighttitle NOpadding-right">Product Update Bulk Upload</h4>
                                        </div>
                                        
                                    </div> 
                                
                                    {
                                        this.state.preference === "MarketPlace" 
                                        ?
                                            <div>
                                                localStorage.getItem('roles') === 'admin' 
                                                ? 
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addTemplateWrapper pull-right" >
                                                        <a href="/template-management">
                                                            <button type="button" className="btn col-lg-2 col-md-2 col-sm-12 col-xs-12 addexamform clickforhideshow pull-right" >Add Template</button>
                                                        </a>
                                                    </div>
                                                : null

                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields marginTopp">
                                                    <label>Vendor <i className="redFont">*</i></label>
                                                    <select onChange={this.selectOption.bind(this)} value={this.state.vendor} name="vendor" className="form-control allProductCategories" aria-describedby="basic-addon1" id="vendor" ref="vendor">
                                                        <option disabled selected defaultValue="">Select Vendor</option>
                                                        {this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                                            this.state.vendorArray.map((data, index) => {
                                                                return (
                                                                // <option key={index} value={data.companyName + '|' + data.user_ID + '|' + data._id}>{data.companyName} - ({"VendorID : "+data.companyID})</option>
                                                                <option key={index} value={data.companyName + '|' + this.state.user_ID + '|' + data._id}>{data.companyName} - ({"VendorID : "+data.companyID})</option>
                                                                );
                                                            })
                                                            :
                                                            <option disabled>{"No vendor added"}</option>
                                                        }
                                                    </select>
                                                </div>

                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 inputFields marginTopp">
                                                    <label>Section <i className="redFont">*</i></label>
                                                    <select onChange={this.showRelevantCategories.bind(this)} value={this.state.section} name="section" className="form-control" aria-describedby="basic-addon1" id="section" ref="section">
                                                        <option disabled selected defaultValue="">Select Section</option>
                                                        {this.state.sectionArray && this.state.sectionArray.length > 0 ?
                                                            this.state.sectionArray.map((data, index) => {
                                                                return (
                                                                    <option key={index} value={data.section + '|' + data._id} >{data.section}</option>
                                                                );
                                                            })
                                                            :
                                                            <option disabled>{"Section not available"}</option>
                                                        }
                                                    </select>
                                                </div>

                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-6 inputFields marginTopp">
                                                    <label>Category <i className="redFont">*</i></label>
                                                    <select onChange={this.handleChangeCategory.bind(this)} value={this.state.section} name="category" value={this.state.category}  className="form-control" aria-describedby="basic-addon1" id="category" ref="category">
                                                        <option disabled selected defaultValue="">Select Category</option>
                                                        {this.state.categoryArray && this.state.sectionArray.length > 0 ?
                                                            this.state.categoryArray.map((data, index) => {
                                                                return (
                                                                    <option key={index} value={data.category + '|' + data._id} >{data.category}</option>
                                                                );
                                                            })
                                                            :
                                                            <option disabled>{"Category not available"}</option>
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        :
                                            null
                                    }

                                    <br/>
                                
                                {
                                   // (this.state.preferences==="MarketPlace" && this.state.vendor &&  this.state.fileurl) || 
                                   // ?
                                       <BulkUploadComponent 
                                            url="api/products/post/bulkUploadProductUpdate" 
                                            fileurl="../BulkUploadTemplates/Product_Update_Template.xlsx"
                                            fileDetailUrl="/api/products/get/filedetails/"
                                            requiredData={requiredData}
                                        />   
                                    // : 
                                    //     null                                        
                                }
                                </div>
                        </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default withRouter(UpdateProductBulkUpload);

// AddNewBulkProduct = withTracker(props => {
//     var vendorData          = [];
//     const productHandle     = Meteor.subscribe("productShopPublish");
//     const productData       = ProductShop.find({},{sort: {dateAdded: -1}}).fetch();
//     const fileDatas         = ProductShop.find({},{sort: {dateAdded: -1}},{fields:{"fileName" : 1}}).fetch();
//     const loading1          = !productHandle.ready();

//     var fileData = Array.from(new Set(fileDatas.map(x => x.fileName))).map(
//     fileName =>{
//         return{
//             fileName: fileName,
//             _id     : fileDatas.find(s => s.fileName === fileName)._id
//         };
//     });
//     console.log('fileData',fileData);
//     const vendorHandle      = Meteor.subscribe("allSupplierList");
//     if(Roles.userIsInRole(Meteor.userId(), ['Vendor'])){
//         vendorData        = Suppliers.find({"OwnerId":Meteor.userId()}).fetch();
//     }else{
//         vendorData        = Suppliers.find({}).fetch();
//     }
//     const loading2          = !vendorHandle.ready();
//     return {
//         productData,
//         vendorData,
//         fileData
//     };    
// })(AddNewBulkProduct);