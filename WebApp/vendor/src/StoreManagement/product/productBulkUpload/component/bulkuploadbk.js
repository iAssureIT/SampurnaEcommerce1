import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import XLSX from "xlsx";
import _ from 'underscore';
import Loader from '../../../../coreAdmin/common/loader/Loader.js';
import { withRouter } from 'react-router-dom';

class AddNewBulkProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "currentProducts": [],
            "productData": [],
            "file": props && props.fileData && props.fileData[0] ? props.fileData[0].fileName : '',
            "finalData": [],
            "fileWarningError": false
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
                return data.fileName == file;
            }
            var x = productData.filter(checkAdult);
            // console.log('x',x);

            this.setState({
                productData: x
            });
        }
    }

    componentDidMount() {
        this.getVendorList();

    }

    componentWillUnmount() {

    }



    showProgressBar() {
        // var getPercernt = UserSession.get("progressbarSession",Meteor.userId());
        // var allPercernt = UserSession.get("allProgressbarSession",Meteor.userId());

        // if(getPercernt && allPercernt){
        //     var total = getPercernt/allPercernt*100;
        //     total = parseInt(total);
        //     var styleC = {
        //         width:total + "%",
        //         display:"block",
        //     }
        //     var styleCBar = {
        //         display:"block",
        //     }
        // }
        // if(!getPercernt){
        //     var total = 0;

        //     var styleC = {
        //         width:0 + "%",
        //         display:"none",
        //     }
        //     var styleCBar = {
        //         display:"none",
        //     }
        // }
        // // console.log('total',total);
        // if(total == 100){
        //     return (
        //         <div></div>
        //     );
        // }else{
        //     return (
        //         <div>
        //             <div className="progress"  style= {styleCBar}>
        //                 <div className="progress-bar progress-bar-striped active" role="progressbar"
        //                 aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
        //                     {total} %
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // }
    }

    uploadBulkProduct(event) {
        event.preventDefault();
        //   UserSession.delete("progressbarSession", Meteor.userId());
        //   UserSession.delete("allProgressbarSession", Meteor.userId());

        //   var file = event.target.files[0];
        //   console.log('file',file.name);

        //   Papa.parse( event.target.files[0], {
        // header: true,
        // complete( results) {
        //           console.log('results',results);
        //  Meteor.call( 'BulkShopProductCSVUpload', results.data, file.name, ( error, result ) => {
        //            if ( error ){
        //                   console.log('error',error);
        //                   swal({
        //                       type: 'warning',
        //                       title: 'Please check csv file format ',
        //                       text: 'Please check csv file format',
        //                       showConfirmButton: true,
        //                       // timer: 5000
        //                   });
        //          } else {
        //                   // // console.log("result = " + result);
        //                   if(result.indexOf("101")>=0){
        //                       let errcode = result.split("-");
        //                       if(errcode[0] == "101"){
        //                           swal({
        //                               position: 'top-right',
        //                               type: 'warning',
        //                               title: 'Please remove "-" from ProductCode of Product Serial Number ' + errcode[1].trim(),
        //                               text: 'Please remove "-" from ProductCode of Product Serial Number ' + errcode[1].trim(),
        //                               showConfirmButton: true,
        //                               // timer: 5000
        //                           });
        //                           $(".adminBlkUpldBkg").val('');
        //                           // setTimeout(()=>{ 
        //                           //     UserSession.delete("progressbarSession", Meteor.userId());
        //                           //     UserSession.delete("allProgressbarSession", Meteor.userId());
        //                           // }, 8000);
        //                       }                            
        //                   }else{
        //                       swal({
        //                           position: 'top-right',
        //                           type: 'success',
        //                           title: 'Products Added Successfully',
        //                           text: 'Products Added Successfully',
        //                           showConfirmButton: false,
        //                           timer: 1500
        //                       });

        //                       $(".adminBlkUpldBkg").val('');
        //                       setTimeout(()=>{ 
        //                           UserSession.delete("progressbarSession", Meteor.userId());
        //                           UserSession.delete("allProgressbarSession", Meteor.userId());
        //                       }, 8000);
        //                   }

        //          }
        //      });

        // }
        //   });


    }
    publishAllProducts(event) {
        event.preventDefault();
        // Meteor.call("publishAllShopProducts", (error, result)=>{
        //     if(result){
        //         swal({
        //             position: 'top-right',
        //             type: 'success',
        //             title: 'All Products published successfully',
        //             text: 'All Products published successfully',
        //             showConfirmButton: false,
        //             timer: 1500
        //         });
        //     }
        // });
    }
    changeProductList(event) {
        var inputText = $(event.currentTarget).val();

        // if(inputText){
        //     Session.set("inputProductSearch",inputText);
        // } else {
        //     Session.set("inputProductSearch","");
        // }
    }

    deleteProduct(event) {
        event.preventDefault();
        // var id = $(event.currentTarget).attr("data-productId");
        // if(id){
        //     Meteor.call("deleteListShopProduct",id, (error, result)=> {
        //         if(error){

        //         } else {
        //             swal({
        //                 position: 'top-right',
        //                 type: 'success',
        //                 text: 'Product Deleted Successfully',
        //                 title: 'Product Deleted Successfully',
        //                 showConfirmButton: false,
        //                 timer: 1500
        //             });
        //             $('.modal-backdrop').hide();

        //         }
        //     });
        // }
    }

    editUniqueProduct(event) {
        // var prodId = $(event.currentTarget).attr('data-prodId');
        // FlowRouter.go('/admin/products/AddNewShopProduct/' + prodId);
        // browserHistory.replace(path);
    }

    changeFeatured(event) {
        event.preventDefault();
        // var statusVal = $(event.currentTarget).attr('data-status');
        // var prodVal  = $(event.currentTarget).attr('data-prodVal');


        // if(prodVal){
        //     if(statusVal=="true"){
        //         statusVal = false;
        //         Meteor.call('updateShopProductFeatured', prodVal, statusVal);
        //     } else {
        //         statusVal = true;
        //         Meteor.call('updateShopProductFeatured', prodVal,statusVal);
        //     }
        // }
    }

    changeExclusive(event) {
        event.preventDefault();
        // var statusVal = $(event.currentTarget).attr('data-status');
        // var prodVal  = $(event.currentTarget).attr('data-prodVal');
        // if(prodVal){
        //     if(statusVal=="true"){
        //         statusVal = false;
        //         Meteor.call('updateShopProductExclusive', prodVal, statusVal);
        //     } else {
        //         statusVal = true;
        //         Meteor.call('updateShopProductExclusive', prodVal, statusVal);
        //     }
        // }
    }

    selectFile(event) {
        event.preventDefault();
        // const target = event.target;
        // const name   = target.name;
        // this.setState({
        //     [name]: event.target.value,
        // });


        // var selectedFile = this.refs.file.value;
        // // console.log('selectedFile',selectedFile);

        // var productData = this.props.productData;
        // var ages = [3, 10, 18, 20];

        // function checkAdult(data) {
        //   return data.fileName == selectedFile;
        // }
        // var x = productData.filter(checkAdult);
        // // console.log('x',x);

        // this.setState({
        //     productData : x
        // });

    }
    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.handleFile(files[0]);
    }
    handleFile(file) {
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
        console.log(file.name);
        if (format.test(file.name)) {
            this.setState({ fileWarningError: true, finalData: [] });

        } else {
            this.setState({ fileWarningError: false, finalData: [] });
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = ({ target: { result } }) => {

                const wb = XLSX.read(result, { type: rABS ? "binary" : "array" });
                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                var documentObj = [];
                let count = 0;
                this.setState({ inputFileData: data }, () => {
                    /*var productCodeArray = [];
                    for (var j=1; j <= this.state.inputFileData.length; j++){
                    var record = this.state.inputFileData[j];
                    let header = this.state.inputFileData[0];
                    if (record !== undefined) {
                    productCodeArray.push(record[header.indexOf('productCode')]);
                    }
                    } 
                    productCodeArray = productCodeArray.filter((item, i, ar) => ar.indexOf(item) === i);
                    console.log('productCodeArray',productCodeArray)*/

                    var productCode = '';

                    productCode = this.state.inputFileData[1][this.state.inputFileData[0].indexOf('productCode')];
                    // loop on all the records in sheet
                    for (var j = 1; j <= this.state.inputFileData.length; j++) {
                        var record = this.state.inputFileData[j];
                        var attributeArray = [];
                        if (j == 1) {
                            var previousRecord = this.state.inputFileData[j];
                        } else {
                            var previousRecord = this.state.inputFileData[j - 1];
                        }

                        let header = this.state.inputFileData[0];

                        if (record !== undefined) {
                            var k;
                            // loop on header columns
                            for (k in header) {
                                if (!documentObj.hasOwnProperty(count)) {
                                     documentObj.push({ [header[k]]: record[k] });
                                } else {
                                    if (header[k].startsWith("feature list")) {
                                        if (typeof record[k] !== 'undefined' && record[k].trim() != '') {
                                            var featuresArray = record[k].split("\n")
                                            var featuresString = "";

                                            featuresArray.map((data,ind)=>{
                                                 
                                                featuresString += "<li>"+data+"</li>"
                                            })
                                            
                                            documentObj[count]['featureList'] = featuresString;
                                        }
                                    }
                                    else if (header[k].startsWith("attribute")) {
                                        
                                        if (typeof record[k] !== 'undefined' && record[k].trim() != '') {
                                            attributeArray.push({attributeName: header[k].replace(/^attribute +/i, '').trim(), attributeValue: record[k].trim()})
                                            documentObj[count]['attributes'] = attributeArray;
                                        }
                                        
                                    }
                                    else if (header[k] == 'tags') {
                                        if (record[k] != undefined) {
                                            documentObj[count]['tags'] = record[k].split(',');
                                        }
                                    }
                                    else if (header[k] == 'featured' || header[k] == 'exclusive'
                                            || header[k] == 'newProduct' || header[k] == 'bestSeller'
                                            || header[k] == 'taxInclude') {
                                            var tempflag = record[k] == 'yes' ? true : false
                                            documentObj[count][header[k]] = tempflag;
                                    }
                                    else {
                                        documentObj[count][header[k]] = record[k];
                                    }
                                    documentObj[count]['filename'] = file.name;
                                    documentObj[count]['user_ID'] = this.state.vendor;
                                    documentObj[count]['createdBy'] = localStorage.getItem('user_ID');
                                }
                            }
                            //attributeArray = [];
                            count++;
                        }
                    }

                    this.setState({ finalData: documentObj }, () => {
                        console.log(this.state.finalData);
                    });
                });
            };
            if (rABS) reader.readAsBinaryString(file);
            else reader.readAsArrayBuffer(file);
            //$('.submitBtn').prop('disabled',false);

        }


    }

    bulkUpload() {

        var formValues = this.state.finalData;
        console.log('formValues', formValues);
        $('.fullpageloader').show();
        if (!this.state.fileWarningError) {
            axios.post('/api/products/post/bulkUploadProduct', formValues)
                .then((response) => {
                    $('.fullpageloader').hide();

                    swal({
                        title: response.data.message,
                    })
                        .then((isConfirm) => {
                            //console.log(isConfirm);
                            if (isConfirm) {
                                //window.location.reload();
                                this.props.history.push("/product-list");
                            }
                        });
                })
                .catch((error) => {
                    console.log('error', error);
                })

        }
    }
    selectVendor(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });
    }
    getVendorList() {
        axios.get('/api/vendors/get/one/'+localStorage.getItem('vendor_ID'))
        .then((response) => {
            console.log('getVendorList', response.data);
            this.setState({
                vendorArray: response.data,
                vendor: response.data.vendorName + '|' +response.data.user_ID +'|'+ response.data.vendor_ID,
            })
        })
        .catch((error) => {

        })
    }
    render() {

        const SheetJSFT = [
            "xlsx",
            "xls"
        ]

        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <section className="content">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
            <div className="row">
                                <Loader type="fullpageloader" />
                                <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                                    <div className="box">
                                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                            <h4 className="NOpadding-right">Product Bulk Upload</h4>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields marginTopp">
                                        <label>Vendor <i className="redFont">*</i></label>
                                        <select onChange={this.selectVendor.bind(this)} value={this.state.vendor} name="vendor" className="form-control allProductCategories" aria-describedby="basic-addon1" id="vendor" ref="vendor">
                                            <option disabled selected defaultValue="">Select Vendor</option>
                                            <option value={localStorage.getItem("user_ID")} >Admin</option>
                                            {this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                                this.state.vendorArray.map((data, index) => {
                                                    return (
                                                        <option key={index} value={data._id}>{data.companyName} - ({data.vendorID})</option>
                                                    );
                                                })
                                                :
                                                <option disabled>{"No vendor added"}</option>
                                            }
                                        </select>
                                        {this.state.vendor ? null : <span>Please select a vendor to add a product</span>}
                                    </div>
                                </div>

                                {this.state.vendor  ?
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">

                                            <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12">

                                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">

                                                    <p>Please download required format for bulk upload from below.</p>
                                                    <div className="col-lg-3 col-md-3 col-xs-3 col-sm-3 NOpadding">

                                                        <a className="videocard" href="/products.xlsx" title="Click to Download" download><div className="publishAllProductsClient">
                                                            SAMPLE DATA FORMAT <i className="fa fa-download"></i>
                                                        </div></a>
                                                    </div>

                                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
                                                        <br />
                                                        <div className="upldProdFileHere"> Upload Your Product File Here:</div>

                                                        <div className="input-group">
                                                            <span className="adminBlkUpldIcon input-group-addon" id="basic-addon1"><i className="fa fa-cloud-upload" aria-hidden="true"></i></span>
                                                            <input className="adminBlkUpldBkg form-control adminBlkUploadBtn"
                                                                ref={this.fileInput}
                                                                type="file"
                                                                accept=".xlsx, .xls, .csv"
                                                                onChange={this.handleChange.bind(this)}
                                                            />

                                                        </div>

                                                        <div className="upldProdFileInstPre">
                                                            <br />
                                                            {this.state.fileWarningError ?
                                                                <p className="fileWarningError" style={{ color: "red" }}>Filename should be proper. It should not contain any special character and spaces</p>
                                                                : null}

                                                            <strong className="upldProdFileInst">Instructions</strong>
                                                            <ul>
                                                                <li> File Type must be CSV and xlsx file - Comma Separated Values. CSV file can be edited in Excelsheets. </li>
                                                                <li> Please make sure that Product Code should not have hyphen "-" in it. </li>
                                                            </ul>
                                                        </div>
                                                        {
                                                            this.state.finalData.length > 0 ?
                                                                <button className="submitBtnGo btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9"
                                                                    onClick={this.bulkUpload.bind(this)} >Submit</button>
                                                                :
                                                                <button className="submitBtn btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9"
                                                                    disabled>Submit</button>

                                                        }

                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    {this.showProgressBar(this)}
                                                </div>

                                            </div>
                                            {/*<ProductList />*/}
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
          </div>
        </section>
      </div>
        );
    }
}
export default withRouter(AddNewBulkProduct);

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