import React, { Component } from 'react';
import axios from 'axios';
import IAssureTable from "../../ProductTable/IAssureTable.jsx";
import swal from 'sweetalert';
import _ from 'underscore';
import '../css/productList.css';
import Message from '../../../../storeAdmin/message/Message.js';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHeading: {
                "productName": 'Product Details',
                "section": 'Section',
                "category": 'Category',
                "originalPrice": 'Original Price',
                "discountPercent": 'Discount Percent',
                "discountedPrice": 'Discounted Price',
                "availableQuantity": 'Available Quantity',
            },
            tableObjects: {
                paginationApply: true,
                searchApply: true,
                deleteMethod: 'delete',
                apiLink: '/api/products',
                editUrl: '/add-product/'
            },
            startRange: 0,
            limitRange: 100,
            selector: {},
            unCheckedProducts: false
        };
        window.scrollTo(0, 0);
    }


    componentWillReceiveProps(nextProps) {

    }


    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value,
        });
    }

    componentDidMount() {
        this.getCount();
        this.getData(this.state.startRange, this.state.limitRange);
        this.getVendorList();
        this.getSectionData();
        this.getCategoryData();
        this.productCountByStatus();
        
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
        axios.get("/api/entitymaster/get/Vendor")
            .then((response) => {

                var vendorArray = [];

                response.data.map((data, ind) => {
                    // vendorArray.push({ id: data.vendor_ID, vendor: data.companyName })
                    vendorArray.push({ id: data._id, vendor: data.companyName })
                });
                this.setState({
                    vendorArray: vendorArray,
                    messageData: {}
                })
                // console.log("vendorArray",this.state.vendorArray);

            })
            .catch((error) => {
                console.log('error', error);
            })
    }
    getSectionData() {
        axios.get('/api/sections/get/list')
            .then((response) => {

                var sectionArray = [];
                response.data.map((data, ind) => {
                    sectionArray.push({ id: data._id, section: data.section })
                });
                this.setState({
                    sectionArray: sectionArray,
                    messageData: {}
                })

            })
            .catch((error) => {
                console.log('error', error);
            })
    }
    getCategoryData() {
        axios.get('/api/category/get/list')
            .then((response) => {

                var categoryArray = [];
                response.data.map((data, ind) => {
                    categoryArray.push({ id: data._id, category: data.category })
                });
                this.setState({
                    categoryArray: categoryArray,
                    messageData: {}
                })

            })
            .catch((error) => {
                console.log('error', error);
            })
    }
    getCount() {
        axios.get('/api/products/get/count')
            .then((response) => {
                // console.log('dataCount', response.data.dataCount);
                this.setState({
                    dataCount: response.data.dataCount
                })
            })
            .catch((error) => {
                console.log('error', error);
            })
    }
    getData(startRange, limitRange) {
        this.setState({ messageData: {} })
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        this.getCount();
        axios.post('/api/products/get/list', data)
            .then((response) => {

                this.setState({
                    tableData: response.data
                })
            })
            .catch((error) => {
                console.log('error', error);
            })
    }

    publishAllProducts(event) {
        event.preventDefault();

        var data = {
            publishData: _.pluck(this.state.tableData, '_id')
        };

        axios.put('/api/products/multiple', data)
            .then((response) => {
                swal({
                    text: 'Product published successfully',
                });
            })
            .catch((error) => {
                swal({
                    title: 'All products are published.',
                });
            });
        this.getData(this.state.startRange, this.state.limitRange);
    }
    getSearchText(searchText) {

        axios.get("/api/products/get/adminsearch/" + searchText)
            .then((response) => {
                this.setState({
                    tableData: response.data,
                    dataCount: response.data.length
                });
            })
            .catch((error) => {
                console.log('error', error);
            })
    }

    filterProductCount(formValues) {
        axios.post('/api/products/post/adminFilterProductsCount', formValues)
            .then((response) => {
                this.setState({
                    dataCount: response.data.dataCount
                }, () => {
                })
            })
            .catch((error) => {
                console.log("error = ", error);
            })
    }

    handleChangeFilter(event){
        this.setState({ messageData:{} })
        if (event.target) {
            var currentSelection = event.target.getAttribute("id");
        }else{
            var currentSelection = event.element.getAttribute("id");
        }
        // var currentSelection = event.element.getAttribute("id");
        var selector = this.state.selector;

        if (currentSelection === 'vendorChange') {
            selector.vendorIds = event.target.value;
        }
        if (currentSelection === 'sectionChange') {
            selector.sectionIds = event.value;
        }
        if (currentSelection === 'categoryChange') {
            selector.categoryIds = event.value;
        }
        if (currentSelection === 'statusChange') {
            selector.statusArray = event.value;
        }
        selector.startRange = this.state.startRange
        selector.limitRange = this.state.limitRange


        this.setState({ selector: selector })
        this.filterProductCount(selector);

        console.log("Selector Value = ",this.state.selector);
        axios.post('/api/products/post/list/adminFilterProducts', selector)
            .then((response) => {
                this.setState({
                    tableData: response.data,

                })
                //this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch((error) => {
                console.log("error = ", error);
            })
    }
    selectedProducts(checkedProductsList) {
        // console.log('checkedUsersList', checkedUsersList);
        this.setState({
            checkedProducts: checkedProductsList,
            messageData: {}
        })

        // console.log("this.state.checkedUser",this.state.checkedUser);
    }
    setunCheckedProducts(value) {
        this.setState({
            unCheckedProducts: value,
            messageData: {}
        })
    }
    productBulkAction(event) {

        var formValues = {
            selectedProducts: this.state.checkedProducts,
            selectedAction: this.state.selectedAction
        }
        axios.patch('/api/products/patch/productBulkAction', formValues)
            .then((response) => {
                $('#bulkActionModal').hide();
                this.setState({
                    messageData: {
                        "type": "outpage",
                        "icon": "fa fa-correct",
                        "message": "Selected products are " + this.state.selectedAction.toLowerCase() + " successfully.",
                        "class": "success",
                        "autoDismiss": true
                    }
                })

                axios.post('/api/products/post/list/adminFilterProducts', this.state.selector)
                    .then((response) => {
                        this.setState({
                            tableData: response.data
                        })
                        //this.getData(this.state.startRange, this.state.limitRange);
                    })
                    .catch((error) => {
                        console.log("error = ", error);
                    })
                //this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch((error) => {
                this.setState({
                    messageData: {
                        "type": "outpage",
                        "icon": "fa fa-exclamation",
                        "message": "Failed to perform action! ",
                        "class": "danger",
                        "autoDismiss": true
                    }
                });
            })
    }
    bulkActionChange(event) {
        // console.log(event.target.value);
        if (event.target.value) {
            this.setState({ unCheckedProducts: false, selectedAction: event.target.value, messageData: {} })
            $('#bulkActionModal').show();
            $('.confirmmsg label').html('');
            $('.confirmmsg label').append("Do you want to " + event.target.value.toLowerCase() + " selected products ?")
            if (this.state.checkedProducts && this.state.checkedProducts.length > 0) {
                $('.confirmmsg, #bulkActionModalbtn').show();
                $('.selectmsg').hide();
            } else {
                $('.selectmsg').show();
                $('#bulkActionModalbtn, .confirmmsg').hide();
            }
        }
        else{
            $('#bulkActionModal').hide();
        } 
    }
    closeModal(event){
        $('#bulkActionModal').hide();
    }
    saveProductImages(productImage, productID, productImageArray) {
        // var productImage = productImage;
        var formValues = {
            "product_ID": productID,
            "productImage": productImageArray,
            "status": "New"
        };
        // console.log('formValues', formValues);
        axios.patch('/api/products/patch/gallery', formValues)
            .then((res) => {
                this.setState({
                    messageData: {
                        "type": "outpage",
                        "icon": "fa fa-correct",
                        "message": "Product images are updated successfully",
                        "class": "success",
                        "autoDismiss": true
                    }
                })
                //this.props.history.push('/product-list')
            })
            .catch((error) => {
                this.setState({
                    messageData: {
                        "type": "outpage",
                        "icon": "fa fa-exclamation",
                        "message": "Failed to uppdate product images!",
                        "class": "success",
                        "autoDismiss": true
                    }
                })
                console.log("error = ", error);
            });

    }
    render() {

        // maps the appropriate column to fields property
        // const fields: object = { text: 'vendor', value: 'id' };
        const sectionfields: object = { text: 'section', value: 'id' };
        const categoryfields: object = { text: 'category', value: 'id' };

        const statusArray = [];
        statusArray.push({ status: "Publish" })
        statusArray.push({ status: "Draft" })
        statusArray.push({ status: "Unpublish" })

        const statusfields: object = { text: 'status', value: 'status' };

        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section className="content">
                            <Message messageData={this.state.messageData} />
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                                <div className="row">
                                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                        <h4 className="NOpadding-right"> Product List</h4>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                                        <div className="col-lg-3">
                                            <div className="publishedBox" >
                                                <span className="publishedBoxIcon bg-aqua"><i className="fa fa-shopping-cart"></i></span>
                                                <div className="publishedBoxContent">
                                                    <span className="publishedBoxtext">Total Products</span><br />
                                                    <span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].total : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="publishedBox" >
                                                <span className="publishedBoxIcon bg-green"><i className="fa fa-shopping-cart"></i></span>
                                                <div className="publishedBoxContent">
                                                    <span className="publishedBoxtext">Published Products</span><br />
                                                    <span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalPublish : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="publishedBox" >
                                                <span className="publishedBoxIcon bg-redcolor"><i className="fa fa-shopping-cart"></i></span>
                                                <div className="publishedBoxContent">
                                                    <span className="publishedBoxtext">Unpublished Products</span><br />
                                                    <span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalUnpublish : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="publishedBox" >
                                                <span className="publishedBoxIcon bg-yellow"><i className="fa fa-shopping-cart"></i></span>
                                                <div className="publishedBoxContent">
                                                    <span className="publishedBoxtext">Draft Products</span><br />
                                                    <span className="publishedBoxNumber">{Array.isArray(this.state.productCountByStatus)&&this.state.productCountByStatus.length>0 ? this.state.productCountByStatus[0].totalDraft : 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="searchProductFromList col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp NoPadding">
                                            <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
                                                <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Bulk Action</label>
                                                <select className="form-control selectRole" ref="filterDropdown" name="filterDropdown"  onChange={this.bulkActionChange.bind(this)} style={{width:'200px'}} >
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>   
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Publish">Publish selected products</option>
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Draft">Draft selected products</option>
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Unpublish">Unpublish selected products</option>
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value="Delete">Delete selected products</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
                                                <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Vendor</label>
                                                {/*<MultiSelectComponent id="vendorChange" dataSource={this.state.vendorArray}
                                                    change={this.handleChangeFilter.bind(this)}
                                                    fields={fields} placeholder="Select Vendor" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
                                                    <Inject services={[CheckBoxSelection]} />
                                                </MultiSelectComponent>*/}
                                                {/*<select className="form-control selectRole" ref="filterDropdown" name="filterDropdown" id="vendorChange" onChange={this.getVendorList.bind(this)} style={{width:'200px'}} > */}
                                                <select className="form-control selectRole" ref="filterDropdown" name="filterDropdown" id="vendorChange" style={{width:'200px'}} 
                                                    onChange={this.handleChangeFilter.bind(this)}>
                                                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled selected>-- Select --</option>  
                                                    {
                                                        this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                                            this.state.vendorArray.map((data, i)=>{
                                                                return(                                                                    
                                                                    <option key={i} comp_Id={data.id} value={data.id}>{data.vendor}</option>
                                                                    // <option key={i} id={data.entityCode}>{data.entityCode}</option>
                                                                );
                                                            })
                                                        :
                                                        null
                                                    }
                                                   
                                                </select>
                                            </div>
                                            <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
                                                <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Section</label>
                                                <MultiSelectComponent id="sectionChange" dataSource={this.state.sectionArray}
                                                    change={this.handleChangeFilter.bind(this)}
                                                    fields={sectionfields} placeholder="Select Section" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
                                                    <Inject services={[CheckBoxSelection]} />
                                                </MultiSelectComponent>
                                            </div>
                                            <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
                                                <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Category</label>
                                                <MultiSelectComponent id="categoryChange" dataSource={this.state.categoryArray}
                                                    change={this.handleChangeFilter.bind(this)}
                                                    fields={categoryfields} placeholder="Select Category" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
                                                    <Inject services={[CheckBoxSelection]} />
                                                </MultiSelectComponent>
                                            </div>
                                            <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-6 mt">
                                                <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Status</label>
                                                <MultiSelectComponent id="statusChange" dataSource={statusArray}
                                                    change={this.handleChangeFilter.bind(this)}
                                                    fields={statusfields} placeholder="Select Status" mode="CheckBox" selectAllText="Select All" unSelectAllText="Unselect All" showSelectAll={true}>
                                                    <Inject services={[CheckBoxSelection]} />
                                                </MultiSelectComponent>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable
                                            tableHeading={this.state.tableHeading}
                                            twoLevelHeader={this.state.twoLevelHeader}
                                            dataCount={this.state.dataCount}
                                            tableData={this.state.tableData}
                                            getData={this.getData.bind(this)}
                                            tableObjects={this.state.tableObjects}
                                            selectedProducts={this.selectedProducts.bind(this)}
                                            getSearchText={this.getSearchText.bind(this)}
                                            setunCheckedProducts={this.setunCheckedProducts.bind(this)}
                                            unCheckedProducts={this.state.unCheckedProducts}
                                            saveProductImages={this.saveProductImages.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                            </div>
                            <div className="modal" id="bulkActionModal" role="dialog">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <button type="button" className="close" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
                                    <h3 className="modalTitle">Bulk Action</h3>
                                </div>
                                <div className="modal-body">
                                    <div className="confirmmsg" style={{ display: "none" }}>
                                        <label>Do you want to ?</label>
                                    </div>
                                    <div className="selectmsg" style={{ display: "none" }}>
                                        <label>Please select products to perform bulk action</label>
                                    </div>
                                    <br />
                                </div>
                                <div className="modal-footer"> 
                                      <a href="#" className="btn btn-warning" id="bulkActionModalbtn" data-dismiss="modal" onClick={this.productBulkAction.bind(this)} style={{"margin-bottom": 0,"margin-left": "5px"}}>Yes</a>
                                      <button type="button" className="btn btn-default" onClick={this.closeModal.bind(this)} data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProductList;