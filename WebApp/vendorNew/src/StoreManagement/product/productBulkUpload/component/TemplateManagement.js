import React, { Component } from 'react';
import $            from 'jquery';
import axios        from 'axios';
import swal         from 'sweetalert';
import _            from 'underscore';
import {withRouter} from 'react-router-dom';
import XLSX         from "xlsx";
import S3FileUpload from 'react-s3';

import Loader       from '../../../../coreadmin/common/Loader/Loader.js';
import Message      from '../../../../storeAdmin/message/Message.js';
import IAssureTable from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import ProductList  from '../../productList/component/ProductList.js';

class TemplateManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileObj:[],
            "tableHeading"                 : {
                section                    : "Section",
                category                   : "Category",
                templateUrl                : "Template URL",
                actions                    : 'Action',
            },
            "tableObjects"                 : {
                deleteMethod               : 'delete',
                apiLink                    : '/api/bulkUploadTemplate',
                paginationApply            : true,
                searchApply                : false
            },
              "startRange"                 : 0,
              "limitRange"                 : 10
        }
        //this.fileInput = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        
    }

    componentDidMount() {
      var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
      var token       = userDetails.token;
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

        this.getSectionData();
        $("#addTemplate").validate({
        rules: {
            section: {
              required: true
            },
            category: {
              required: true
            },
            templatefile: {
              required: true,
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") === "section") {
              error.insertAfter("#section");
            }
            if (element.attr("name") === "category") {
              error.insertAfter("#category");
            }
            if (element.attr("name") === "templatefile") {
              error.insertAfter("#templateError");
            }
        }
        })
        this.getData(this.state.startRange, this.state.limitRange);
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
    showRelevantCategories(event) {
    var section = event.target.value;
    this.setState({
      section: event.target.value,
      section_ID: event.target.value.split('|')[1],
      messageData : {}
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
    handleChangeCategory(event){
        event.preventDefault();
        this.setState({
          category: event.target.value,
          category_ID: event.target.value.split('|')[1],
          messageData : {}
        })
    }
    docBrowse(e){
    e.preventDefault();

        var fileObj = e.currentTarget.files[0];
        
        if (fileObj) {
            var fileName  = fileObj.name; 
            var ext = fileName.split('.').pop();  
            console.log('ext',ext)
            if(ext=="xlsx" || ext=="xls"){
                this.setState({ fileObj: fileObj, validFormat: true, messageData : {} },()=>{});
            }else{
                this.setState({
                    finalData: [],
                    validFormat: false,
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
    clicktoattach(event){
        event.preventDefault();
        $("#upload-file").click();
    }
    addTemplate(event){
        event.preventDefault();
        console.log('validFormat',this.fileInput);
        if($('#addTemplate').valid() && this.state.validFormat){
            var fileObj = this.state.fileObj;
            main().then(templateUrl=>{
              
              this.setState({templateUrl : templateUrl})
                var formValues = {
                    section_ID                : $('#section').val().split('|')[1], 
                    section                   : $('#section').val().split('|')[0], 
                    category_ID               : $('#category').val().split('|')[1], 
                    category                  : $('#category').val().split('|')[0], 
                    templateUrl               : templateUrl,
                }
                console.log('formValues', formValues);
                axios.post("/api/bulkUploadTemplate/post/addBulkUploadTemplate",formValues)
                      .then((response)=>{
                        //this.fileInput.value = '';
                       // this.fileInput.value = "";
                       console.log("response",response);
                       swal({
                        title:response.data.message, 
                      });
                        this.setState({
                            finalData: [],
                            section : "Select Section",
                            category : "Select Category",
                            messageData : {
                              "type" : "outpage",
                              "icon" : "fa fa-correct",
                              "message" : "Template is added successfully.",
                              "class": "success",
                              "autoDismiss" : true
                            }
                        })
                        this.getData(this.state.startRange, this.state.limitRange);
                      })
                      .catch((error)=>{
                        console.log(error.message)
                          this.setState({
                            finalData: [],
                            messageData : {
                              "type" : "outpage",
                              "icon" : "fa fa-exclamation",
                              "message" : "Failed to save",
                              "class": "warning",
                              "autoDismiss" : true
                            }
                        })
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
            });

            async function main(){
                var config = await getConfig();
                var s3url = await s3upload(fileObj, config, this);
                //console.log('s3url',s3url);
                return Promise.resolve(s3url);
            }
          function s3upload(image,configuration){
            return new Promise(function(resolve,reject){
                S3FileUpload
                   .uploadFile(image,configuration)
                   .then((Data)=>{
                        resolve(Data.location);
                   })
                   .catch((error)=>{
                        console.log(error);
                   })
            })
          }   
          function getConfig(){
            return new Promise(function(resolve,reject){
                axios
                   .get('api/projectSettings/get/S3')
                   .then((response)=>{
                        console.log("proj set res = ",response.data);
                        const config = {
                            bucketName      : response.data.bucket,
                            dirName         : 'propertiesImages',
                            region          : response.data.region,
                            accessKeyId     : response.data.key,
                            secretAccessKey : response.data.secret,
                        }
                        resolve(config);                           
                    })
                   .catch(function(error){
                        console.log(error);
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
            })
          }
        }
        if ($('#addTemplate').valid()) {
          if(!this.state.validFormat){
            this.setState({
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
    getDataCount(){
        axios.get('/api/bulkUploadTemplate/get/count')
        .then((response)=>{
          this.setState({
            dataCount : response.data.dataCount
          })
        })
        .catch((error)=>{
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
        });
    }
    getData(startRange, limitRange){
      this.setState({ messageData : {} })
        this.getDataCount();
        var data={
            startRange : startRange,
            limitRange : limitRange
        }
        axios.get('/api/bulkUploadTemplate/get/list', data)
        .then((response)=>{

            console.log(response.data)
            
            var tableData = response.data.map((a, i)=>{
                return {
                    _id             : a._id,
                    section         : a.section,
                    category        : a.category,
                    templateUrl     : "<a href='"+a.templateUrl+"' download><img src='/images/Excel-download-icon.png' style='width:35px' /></a>"
                }
            })
            // console.log('table', tableData);
            this.setState({
                tableData : tableData
            });
        })
        .catch((error)=>{
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
        });
    }
    goBack(event){
      window.history.go(-1); return false;
    }
    
    render() {
        
        return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-right">
            <section className="content">
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
            <Loader type="fullpageLoader" />
            <Message messageData={this.state.messageData} />
                <div className="row">
                    <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                      <div className="">
                          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <h4 className="weighttitle NOpadding-right" style={{display: "inline-block"}}>Product Bulk Upload Template</h4>
                              <button class=" btn pull-right backButton" onClick={this.goBack.bind(this)} style={{margin: "1px"}}>Back</button>
                          </div>

                          <form className="newTemplateForm" id="addTemplate">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                          <div className="col-lg-4 col-lg-offset-2  col-md-4 col-md-offset-2 col-sm-4 col-sm-offset-2  col-xs-6 inputFields marginTopp">
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
                              <select onChange={this.handleChangeCategory .bind(this)} value={this.state.section} name="category" value={this.state.category}  className="form-control" aria-describedby="basic-addon1" id="category" ref="category">
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
                          <div className="col-lg-4 col-lg-offset-2 col-md-4 col-md-offset-2  col-sm-4 col-xs-6  inputFields">
                              <label>Select File <i className="redFont">*</i></label>
                              <div className="input-group">
                                  <span className="adminBlkUpldIcon input-group-addon" id="basic-addon1"><i className="fa fa-cloud-upload" aria-hidden="true"></i></span>
                                  <input className="form-control adminBlkUploadBtn" name="templatefile" id="templatefile"
                                      ref={this.fileInput}
                                      type="file"
                                      accept=".xlsx, .xls"
                                      onChange={this.docBrowse.bind(this)}
                                  />
                              </div>
                              <div id="templateError"></div>
                              <div className="upldProdFileHere"> Upload Your Template File Here:</div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 mt">
                              <button onClick={this.addTemplate.bind(this)} className="submitBtn btn btnSubmit col-lg-4 col-md-4 col-sm-3 col-xs-3 pull-left">Save</button>
                          </div>    
                          <br/>
                          </form>

                          <IAssureTable 
                              tableHeading={this.state.tableHeading}
                              twoLevelHeader={this.state.twoLevelHeader} 
                              dataCount={this.state.dataCount}
                              tableData={this.state.tableData}
                              getData={this.getData.bind(this)}
                              tableObjects={this.state.tableObjects}
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
export default withRouter(TemplateManagement);
