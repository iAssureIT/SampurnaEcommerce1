import React, { Component } from 'react'; import XLSX from "xlsx";
//import './BulkUpload.css';
import axios from 'axios';
import Loader from '../../../../coreadmin/common/Loader/Loader.js';
import $ from 'jquery';
import Message from '../../../../storeAdmin/message/Message.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import IAssureTable           from "../../../../coreadmin/IAssureTable/IAssureTable.jsx";

class BulkUploadComponent extends Component{
constructor(props) {
    super(props);
    this.state = {
    "inputFileData" : [],
    "finalData": [],
    "fileWarningError": false,
    tableData:[],
    failedRecordsTable:[],
    tableHeading :{
        "section"         : 'Section',
        "category"        : 'Category',
        "brand"           : 'Brand',
        "productName"     : 'Product Name',
        "productCode"     : 'Product Code',
        "itemCode"        : 'Item Code',
        "originalPrice"   : 'Original Price', 
        "discountedPrice" : 'Discounted Price', 
        "size"            : 'Size', 
        "color"           : 'Color',  
    },
    failedtableHeading :{
        "remark"          : 'Remark',
        "section"         : 'Section',
        "category"        : 'Category',
        "brand"           : 'Brand',
        "productName"     : 'Product Name',
        "productCode"     : 'Product Code',
        "itemCode"        : 'Item Code',
        "originalPrice"   : 'Original Price', 
        "discountedPrice" : 'Discounted Price', 
        "size"            : 'Size', 
        "color"           : 'Color',  
    },
    tableObjects : {
        paginationApply : false,
        searchApply     : false,
        deleteMethod    : 'delete',
        apiLink         : '/api/products',
        editUrl         : '/add-product/'
    },
    startRange : 0,
    limitRange : 10
    }
    this.fileInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleFile   = this.handleFile.bind(this);
  }
  componentWillReceiveProps(nextProps) {
  /*axios
        .get(this.props.fileDetailUrl+"products.xlsx")
        .then((response)=> {
        if (response) {
          this.setState({
                            fileDetails:response.data,
                            failedRecordsCount : response.data.failedRecords.length,
                            goodDataCount : response.data.goodrecords.length
                        });

                          var tableData = response.data.goodrecords.map((a, i)=>{
                          return{
                              "remark"        : a.remark        ? a.remark    : '-',
                              "section"       : a.section        ? a.section    : '-',
                              "category"      : a.category     ? a.category : '-',
                              "brand"         : a.brand     ? a.brand : '-',
                              "productName"   : a.productName     ? a.productName : '-',
                              "productCode"   : a.productCode     ? a.productCode : '-',
                              "itemCode"      : a.itemCode     ? a.itemCode : '-',
                              "productName"   : a.productName     ? a.productName : '-',
                              "originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
                              "discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-', 
                              "size"   : a.size     ? a.size : '-', 
                              "color"   : a.color     ? a.color : '-'
                          }
                        })

                        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
                        return{ 
                            "remark"        : a.remark        ? a.remark    : '-',
                            "section"       : a.section        ? a.section    : '-',
                            "category"      : a.category     ? a.category : '-',
                            "brand"         : a.brand     ? a.brand : '-',
                            "productName"   : a.productName     ? a.productName : '-',
                            "productCode"   : a.productCode     ? a.productCode : '-',
                            "itemCode"      : a.itemCode     ? a.itemCode : '-',
                            "productName"   : a.productName     ? a.productName : '-',
                            "originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
                            "discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-',
                            "size"          : a.size     ? a.size : '-', 
                            "color"         : a.color     ? a.color : '-',
                        }
                        })
                        this.setState({
                            tableData : tableData,
                            failedRecordsTable : failedRecordsTable
                        })
        }
        })
        .catch((error)=> { 
              
        })   
       */
  }
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]){
      var fileName = files[0].name;
      var ext = fileName.split('.').pop();
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
         this.handleFile(files[0]);
         this.setState({ messageData : {} })
      }else{
        this.fileInput.value = '';

        this.setState({
            finalData: [],
            messageData : {
              "type" : "outpage",
              "icon" : "fa fa-exclamation",
              "message" : "Invalid file format.",
              "class": "warning",
              "autoDismiss" : true
            }
        })
        
      }
    }
  }
  

  handleFile(file) {
            
        // var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,<>/?]/;
        var format = /^\s*$/;

        if (format.test(file.name)) {
            this.setState({ fileWarningError: true, finalData: [] });

        } else {
          $('.fullpageLoader').show();
            this.setState({ fileWarningError: false, finalData: [],  fileName: file.name});
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
                        if (j === 1) {
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
                                      console.log("record["+k+"]:",record[k]);
                                        if (typeof record[k] !== 'undefined' && record[k].trim() !== '') {

                                            var featuresArray = record[k].split("\n")
                                            var featuresString = "";

                                            featuresArray.map((data,ind)=>{
                                                 
                                                featuresString += "<li>"+data+"</li>"
                                            })
                                            
                                            documentObj[count]['featureList'] = featuresString;
                                        }
                                    }
                                    else if (header[k].startsWith("attribute")) {
                                        console.log("record["+k+"]:",record[k]);
                                        // if (typeof record[k] !== 'undefined' && record[k].trim() !== '') {
                                            if (typeof record[k] !== 'undefined') {
                                            attributeArray.push({attributeName: header[k].replace(/^attribute +/i, ''), attributeValue: record[k]})
                                            documentObj[count]['attributes'] = attributeArray;
                                        }
                                        
                                    }
                                    else if (header[k] === 'tags') {
                                        if (record[k] !== undefined) {
                                            documentObj[count]['tags'] = record[k].split(',');
                                        }
                                    }
                                    else if (header[k] === 'featured' || header[k] === 'exclusive'
                                            || header[k] === 'newProduct' || header[k] === 'bestSeller'
                                            || header[k] === 'taxInclude') {
                                            var tempflag = record[k] === 'yes' ? true : false
                                            documentObj[count][header[k]] = tempflag;
                                    }
                                    else {
                                        documentObj[count][header[k]] = record[k];
                                    }
                                    // console.log(" requireddata vendor props:",this.props.requiredData.vendor);
                                    // console.log("localStorage.getItem('admin_ID'):",localStorage.getItem('admin_ID'));
                                    documentObj[count]['filename'] = file.name;
                                    documentObj[count]['vendor'] = this.props.requiredData.vendor;
                                    documentObj[count]['createdBy'] = localStorage.getItem('admin_ID');
                                }
                            }
                            //attributeArray = [];
                            count++;
                        }
                    }

                    this.setState({ finalData: documentObj }, () => {
                        // console.log("final data:",this.state.finalData);
                        $('.fullpageLoader').hide()
                    });
                });
            };
            if (rABS) reader.readAsBinaryString(file);
            else reader.readAsArrayBuffer(file);
            //$('.submitBtn').prop('disabled',false);

        }
    }
  // Returns if a value is a string
  isString (value) {
    return typeof value === 'string' || value instanceof String;
  }
  // Returns if a value is really a number
  isNumber (value) {
    return typeof value === 'number' && isFinite(value);
  }
  // Returns if value is a date object
  isDate (value) {
    return value instanceof Date;
  }
  // Returns if a value is a boolean
  isBoolean (value) {
    return typeof value === 'boolean';
  }
  // Returns if a value is null
  isNull (value) {
    return value === null;
  }
  // Returns if a value is undefined
  isUndefined (value) {
    return typeof value === 'undefined';
  }
  // Returns if a value is an object
  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  // Returns if a value is an array
  isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  // ES5 actually has a method for this (ie9+)
  //Array.isArray(value);

  bulkUpload() {
        var formValues = this.state.finalData;
        $('.fullpageLoader').show();
        if (!this.state.fileWarningError) {
            axios.post('/api/products/post/bulkUploadProduct', formValues)
                .then((response) => {
                    
                    // console.log("response.data.message",response.data.message);
                    this.fileInput.value = '';
                    this.setState({
                          finalData: [],
                          messageData : {
                            "type" : "outpage",
                            "icon" : "fa fa-exclamation",
                            "message" : response.data.message,
                            "class": "warning",
                            "autoDismiss" : false
                          }
                    })
                    
                    $('.filedetailsDiv').show()
                    axios
                        .post(this.props.fileDetailUrl,{"fileName":this.state.fileName})
                        .then((response)=> {
                        $('.fullpageLoader').hide();  
                        if (response) {
                          this.setState({
                              fileDetails:response.data,
                              failedRecordsCount : response.data.failedRecords.length,
                              goodDataCount : response.data.goodrecords.length
                          });

                            var tableData = response.data.goodrecords.map((a, i)=>{
                            return{
                                "remark"        : a.remark        ? a.remark    : '-',
                                "section"       : a.section        ? a.section    : '-',
                                "category"      : a.category     ? a.category : '-',
                                "brand"         : a.brand     ? a.brand : '-',
                                "productName"   : a.productName     ? a.productName : '-',
                                "productCode"   : a.productCode     ? a.productCode : '-',
                                "itemCode"      : a.itemCode     ? a.itemCode : '-',
                                "productName"   : a.productName     ? a.productName : '-',
                                "originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
                                "discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-', 
                                "size"   : a.size     ? a.size : '-', 
                                "color"   : a.color     ? a.color : '-'
                            }
                          })

                          var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
                          return{
                              "remark"        : a.remark        ? a.remark    : '-',
                              "section"       : a.section        ? a.section    : '-',
                              "category"      : a.category     ? a.category : '-',
                              "brand"         : a.brand     ? a.brand : '-',
                              "productName"   : a.productName     ? a.productName : '-',
                              "productCode"   : a.productCode     ? a.productCode : '-',
                              "itemCode"      : a.itemCode     ? a.itemCode : '-',
                              "productName"   : a.productName     ? a.productName : '-',
                              "originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
                              "discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-',
                              "size"          : a.size     ? a.size : '-', 
                              "color"         : a.color     ? a.color : '-',
                          }
                          })
                          this.setState({
                              tableData : tableData,
                              failedRecordsTable : failedRecordsTable
                          })
                        }
                        })
                        .catch((error)=> { 
                              
                        })    
                })
                .catch((error) => {
                    console.log('error', error);
                })
        }
  }


  render() {
    //console.log('tableData',this.state.tableData)  
     // console.log("===->",this.state.finalData)
    const SheetJSFT = [
        "xlsx",
        "xls",
        "csv"
      ]
    return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <Loader type="fullpageLoader" />
    <Message messageData={this.state.messageData} />
      <div className="mt">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
            <a href={this.props.fileurl} download>
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
            </a>
          </div>
          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <li>Please use attached file format for bulkupload into this system.</li>
              <li>Please do not change the column header of following file.</li>
              <li>File format must be .csv or .xlsx or .xls.</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 bulkuploadFileouter">
          <input
            ref={el => this.fileInput = el}
            type="file"
            className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"
            accept={SheetJSFT}
            onChange={this.handleChange}
          />
          <div className="upldProdFileInstPre">
            <br />
            {this.state.fileWarningError ?
                <p className="fileWarningError" style={{ color: "red" }}>Filename should be proper. It should not contain any special character and spaces</p>
                : null}
        </div>
        
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
        

      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 filedetailsDiv" style={{display:"none"}}>
        <br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent NoPadding">
          {
            this.state.fileDetails ?
            <div className="">
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#failure">Failure</a></li>
                <li ><a data-toggle="tab" href="#success">Success</a></li>
              </ul>
              <div className="tab-content">
              <h5>Filename: <span>{this.state.fileName}</span></h5>
                <div id="failure" className="tab-pane fade in active">
                <h5>
                Out of {this.state.fileDetails.totalRecords } {this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  &nbsp;

                {this.state.fileDetails.failedRecords.length} bad {this.state.fileDetails.failedRecords.length > 1 ? "records were " : "record was " }found.
                </h5>
                  <div className="text-right">
                  <br/>
                   <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button"
                      table="table-to-xls"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Download as XLS"/>
                      <br/>
                    </div>  
                    <div style={{overflowX: "auto"}}>

                    <IAssureTable 
                      tableHeading={this.state.failedtableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.failedRecordsCount}
                      tableData={this.state.failedRecordsTable}
                      //getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      />


                    <table className="table" width="50%" id="table-to-xls" style={{display:"none"}}>
                      <thead>
                        <tr>
                        <th>Remark</th>
                        <th>section</th>
                        <th>category</th>
                        <th>subCategory</th>
                        <th>brand</th>
                        <th>productCode</th>
                        <th>itemCode</th>
                        <th>productName</th>
                        <th>productDetails</th>
                        <th>shortDescription</th>
                        <th>currency</th>
                        <th>originalPrice</th>
                        <th>discountPercent</th>
                        <th>discountedPrice</th>
                        <th>availableQuantity</th>
                        <th>unit</th>
                        <th>feature list</th>
                        <th>size</th>
                        <th>color</th>
                        <th>tags</th>
                        <th>taxInclude</th>
                        <th>taxRate</th>
                        <th>featured</th>
                        <th>exclusive</th>
                        {
                          this.state.fileDetails.failedRecords.map((data,index)=>{
                            if (data.attributes) {
                            return (
                              Object.entries(data.attributes).map(([key, value], i)=> {
                                return(<th>{"attribute "+ value.attributeName}</th>);
                              })
                              );
                            }
                          })
                        }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.fileDetails.failedRecords ? 
                        this.state.fileDetails.failedRecords.map((data,index)=>{
                          //console.log(data.featureList);
                          var featuresString = "";  

                          if (data.featureList) {
                            var featuresArray = data.featureList.split("</li>")
                            featuresArray.map((data,ind)=>{
                                featuresString += data
                            })
                          }
                          featuresString = featuresString.replace('<li>', '\n');
                          return(
                            <tr key={index}>
                            <td>{data.remark ? data.remark : null}</td>
                            <td>{data.section ? data.section : null}</td>
                            <td>{data.category ? data.category : null}</td>
                            <td>{data.subCategory ? data.subCategory : null}</td>
                            <td>{data.brand ? data.brand : null}</td>
                            <td>{data.productCode ? data.productCode : null}</td>
                            <td>{data.itemCode ? data.itemCode : null}</td>
                            <td>{data.productName ? data.productName : null}</td>
                            <td>{data.productDetails ? data.productDetails : null}</td>
                            <td>{data.shortDescription ? data.shortDescription : null}</td>
                            <td>{data.currency ? data.currency : null}</td>
                            <td>{data.originalPrice ? data.originalPrice : null}</td>
                            <td>{data.discountPercent ? data.discountPercent : null}</td>
                            <td>{data.discountedPrice ? data.discountedPrice : null}</td>
                            <td>{data.availableQuantity ? data.availableQuantity : null}</td>
                            <td>{data.unit ? data.unit : null}</td>
                            <td>{data.featureList ? featuresString : null}</td>
                            <td>{data.size ? data.size : null}</td>
                            <td>{data.color ? data.color : null}</td>
                            <td>{data.tags ? data.tags.join(",#") : null}</td>
                            <td>{data.taxInclude ? "yes" : "no"}</td>
                            <td>{data.taxRate ? data.taxRate : 0}</td>
                            <td>{data.featured ? "yes" : "no"}</td>
                            <td>{data.exclusive ? "yes" : "no"}</td>
                            {
                              data.attributes ?
                              data.attributes.map((attr,aind)=>{
                                 return(<td>{attr.attributeValue}</td>)
                              }) : null
                            }
                          </tr>
                          );
                        }) 
                        : null
                      }
                      </tbody>
                    </table>
                    </div>

                  </div>
                <div id="success" className="tab-pane fade">
                  <h5>
                  Out of {this.state.fileDetails.totalRecords} {this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  {this.state.fileDetails.goodrecords.length} {this.state.fileDetails.goodrecords.length > 1 ? "records are" : "record is" } added successfully. &nbsp;
                    
                  </h5>
                      <IAssureTable 
                      tableHeading={this.state.tableHeading}
                      twoLevelHeader={this.state.twoLevelHeader} 
                      dataCount={this.state.goodDataCount}
                      tableData={this.state.tableData}
                      // getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      />
                  {
                  /*<table className="table" width="50%" id="table-to-xls">
                    <thead>
                      <tr>
                      {
                        this.state.fileDetails.goodrecords[0] ?
                        Object.entries(this.state.fileDetails.goodrecords[0]).map(([key, value], i)=> {
                          return(<th scope="row">{key}</th>);
                        }) :  null
                      }
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.fileDetails.goodrecords ? 
                      this.state.fileDetails.goodrecords.map((data,index)=>{
                        return(
                          <tr key={index}>
                          {
                              Object.entries(data).map(([key, value], i)=> {
                                return(<td scope="row">{value}</td>);
                              })
                          }
                        </tr>
                        );
                      }) 
                      : null
                    }
                    </tbody>
                  </table>*/
                }
                </div>
                
              </div>
            </div>  
            : null
          }
        </div>
      </div>

    </div>
    )
  }
}
export default BulkUploadComponent;