import React     from 'react';
import { event } from 'jquery';
import swal      from 'sweetalert';
import axios     from 'axios';
import Switch    from "react-switch";
import $         from 'jquery';
import S3FileUpload           from 'react-s3';
import moment from 'moment';
import IAssureTable           from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';

import  './DealsManagement.css';
const textSwitch={  
    display        : "flex",
    justifyContent : "center",
    alignItem      : "center",
    height         : "100%",
    fontSize       : 12,
    color          : "#fff",
    paddingRight   : 2,
    paddingLeft    : 2,
    paddingTop     : 2, 
}
class DealsManagement extends React.Component {
	constructor(props) {
        super(props);
        this.state={
            section               : "all",
            category              : "all", 
            subCategory           : "all",
            sectionID             : "all",
            categoryID            : "all", 
            subCategoryID         : "all",
            dealInPercentage      : 0,
            updateAllProductPrice : 'true',
            dealImg               : "",
            startdate             : "Start Date",
            enddate               : "End Date",
            errors                : {},
            fields                : {},

            "tableHeading": { 
                section: "Section",
                category: "Category",
                subCategory: "SubCategory",
                dealInPercentage: "Discount Value",
                dealImg      : "Deal Image",
                startdate: "Start Date",
                enddate: "End Date",
                actions: 'Action',
              },
              "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/deals/',
                paginationApply: true,
                searchApply: false,
                editUrl: '/add-deals'
              },
              "startRange": 0,
              "limitRange": 10,
              // "editId": this.props.editId ? this.props.editId : ''
              "minstartdate" : '',
              "tableName" : "DealsMgmt"

        };
    }

    componentDidMount(){
        this.getSectionData();
        this.getData(this.state.startRange, this.state.limitRange);

        $.validator.addMethod("regxsection", function (value, element, arg) {
            return arg !== value;
        }, "Please select section.");
        $.validator.addMethod("regxcategory", function (value, element, arg) {
            return arg !== value;
        }, "Please select category.");
        $.validator.addMethod("regxsubCategory", function (value, element, arg) {
            return arg !== value;
        }, "Please select subCategory.");
        $.validator.addMethod("regxdealInPercentage", function (value, element, arg) {
            return arg !== value;
        }, "Please add discount percentage.");
        $.validator.addMethod("regxupdateAllProductPrice", function (value, element, arg) {
            return arg !== value;
        }, "Please select one option.");

  
      $("#addDealsForm").validate({
        rules: {
          section:{
            required: true,
            regxsection: "-- Select Section Type --"
          },
          category: {
            required: true,
            regxcategory: "-- Select Category  --"
          },
          subCategory: {
            required: true,
            regxsubCategory: "-- Select Sub-Category --"
          },
          dealImg:{
            required:true,
          },
          dealInPercentage:{
            required:true,
            min : 1,
            max: 100,
            regxdealInPercentage : "Please enter discount percentage"
          },
          updateAllProductPrice:{
            required:true,
            regxupdateAllProductPrice : "Please enter updateAllProductPrice"
          },
          startdate:{
            required:true
          },
          enddate:{
            required:true
          }
        },
        errorPlacement: function (error, element) {
          if (element.attr("name") === "section") {
            error.insertAfter("#section");
          }
          if (element.attr("name") === "category") {
            error.insertAfter("#category");
          }
          if (element.attr("name") === "subCategory") {
            error.insertAfter("#subCategory");
          }
          if (element.attr("name") === "dealInPercentage") {
            error.insertAfter("#dealInPercentage");
          }
          if (element.attr("name") === "updateAllProductPrice") {
            error.insertAfter("#updateAllProductPrice");
          }
          if (element.attr("name") === "startdate") {
            error.insertAfter("#startdate");
          }
          if (element.attr("name") === "enddate") {
            error.insertAfter("#enddate");
          }
        }
      });

      
    }
    getSectionData() {
        axios.get('/api/sections/get/list')
           .then((response) => {
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
     validateForm() {

		let fields = this.state.fields;
		let errors = {};
        let formIsValid = true;	
        	
        if (!fields["section"]) {
            formIsValid = false;
            errors["section"] = "This field is required.";
        }

		if (!fields["category"]) {
            formIsValid = false;
            errors["category"] = "This field is required.";
        }

        if (!fields["subCategory"]) {
            formIsValid = false;
            errors["subCategory"] = "This field is required.";
        }        
		if (!fields["dealInPercentage"]) {
			formIsValid = false;
			errors["dealInPercentage"] = "This field is required.";
		}
		
        if (!fields["updateAllProductPrice"]) {
            formIsValid = false;
            errors["updateAllProductPrice"] = "Please select one method.";
        }
        this.setState({
            errors: errors
          });
          return formIsValid;
    }

     getCategories() {
        axios.get('/api/category/get/list')
           .then((response) => {
             this.setState({
                categoryArray: response.data
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
     getSubCategories(categoryID) {
        axios.get('/api/category/get/one/' + categoryID)
           .then((response) => {
             this.setState({
                subcategoryArray: response.data.subCategory,
             },()=>{
               console.log("subcategory Array--",this.state.subcategoryArray);
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
    handle1Change(event){
		event.preventDefault();
    	this.setState({
            [event.target.name]:event.target.value	
    	});
    }
    // handleChange(checked,e) {
    //     this.setState({ checked });
    // }
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
          [name]: event.target.value,
        });
    
        if(name === 'startdate'){
          this.setState({
            enddate : ''
          })
        }
      }
    handleChangeSubcategory(event) {
        const target 	= event.target;
        const name 		= target.name;
        var value = event.target.value.split("_")[1];
        console.log("value==",value);
        console.log("value==",name);
        this.setState({
           [name]: event.target.value,
        });
     }


    submitDealsInfo(event){
        event.preventDefault();
        var formValues = {
                section               : this.state.section && this.state.section === "all" ? this.state.section : this.state.section.split("_")[1],
                category              : this.state.category && this.state.category === "all" ? this.state.category : this.state.category.split("_")[1],
                subCategory           : this.state.subCategory && this.state.subCategory ==="all" ? this.state.subCategory : this.state.subCategory.split("_")[1],
                sectionID             : this.state.section && this.state.section === "all" ? this.state.section : this.state.section.split("_")[0],
                categoryID            : this.state.category && this.state.category === "all" ? this.state.category : this.state.category.split("_")[0],
                subCategoryID         : this.state.subCategory && this.state.subCategory ==="all" ? this.state.subCategory : this.state.subCategory.split("_")[0],
                dealInPercentage      : this.state.dealInPercentage,
                dealImg               : this.state.dealImg,
                updateAllProductPrice : this.state.updateAllProductPrice,
                startdate             : this.state.startdate,
                enddate               : this.state.enddate,
            }
    
      console.log("formValues====",formValues);
        if ($('#addDealsForm').valid()) {
        axios.post('/api/deals/post',formValues)
            .then( (response)=> {
                if (response.data) {
                    swal("Thank you. Your deals added successfully.");
                    this.setState({
                        section 		      : 'all',
                        category 		      : 'all',
                        subCategory 		  : 'all',
                        dealInPercentage  : "",
                        updateAllProductPrice : "" ,  
                        dealImg               : "",   
                        startdate             : "",
                        enddate               : "", 
                        
                    });	 
                    this.getData(this.state.startRange, this.state.limitRange);
                }   	 
            })
            .catch(function (error) {        
                console.log(error);
            });
        }
    }
    
    updateDealsInfo(event){
        event.preventDefault();
        var urlParam = this.state.urlParam;
        var formValues = {
            section               : this.state.section,
            category              : this.state.category, 
            subCategory           : this.state.subCategory,
            dealInPercentage  : this.state.dealInPercentage
        }
        axios.patch('/api/deals/patch/'+formValues)
		  .then( (response)=> {

		  	})
		  	.catch(function (error) {
		    	console.log(error);
		  	});
    }
    updateDealsInfo(event) {
      event.preventDefault();
      if ($('#addDealsForm').valid()) {
        var formValues = {
          section               : this.state.section && this.state.section === "all" ? this.state.section : this.state.section.split("_")[1],
          category              : this.state.category && this.state.category === "all" ? this.state.category : this.state.category.split("_")[1],
          subCategory           : this.state.subCategory && this.state.subCategory ==="all" ? this.state.subCategory : this.state.subCategory.split("_")[1],
          sectionID             : this.state.section && this.state.section === "all" ? this.state.section : this.state.section.split("_")[0],
          categoryID            : this.state.category && this.state.category === "all" ? this.state.category : this.state.category.split("_")[0],
          subCategoryID         : this.state.subCategory && this.state.subCategory ==="all" ? this.state.subCategory : this.state.subCategory.split("_")[0],
          dealInPercentage      : this.state.dealInPercentage,
          dealImg               : this.state.dealImg,
          updateAllProductPrice : this.state.updateAllProductPrice,
          startdate             : this.state.startdate,
          enddate               : this.state.enddate,
      }
      axios.patch('/api/deals/patch/'+formValues)
          .then((response) => {
            swal({
              text: response.data.message,
            });
            this.getData(this.state.startRange, this.state.limitRange);
            this.setState({
              section 		      : 'all',
              category 		      : 'all',
              subCategory 		  : 'all',
              dealInPercentage  : "",
              updateAllProductPrice : "" ,  
              dealImg               : "",   
              startdate             : "",
              enddate               : "", 
              
          });	
            this.props.history.push('/add-deals');
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
          });
      }
  
    }
    getData(startRange, limitRange) {
        axios.get('/api/deals/get/list/'+ startRange + '/' + limitRange)
          .then((response) => {
            // console.log('tableData = ', response.data);
            var tableData = response.data.map((a, i) => {
                  return {
                  _id                   : a._id,
                  "section"             : a.section,
                  "category"            : a.category,
                  "subCategory"         : a.subCategory,
                  "dealInPercentage"    : a.dealInPercentage,
                  "updateAllProductPrice" : a.updateAllProductPrice,
                  "dealImg"             : "<img class="+" img-thumbnail " +"src="+a.dealImg +" />" ,
                  "startdate"           : moment(a.startdate).format("DD/MM/YYYY"),
                  "enddate"             : moment(a.enddate).format("DD/MM/YYYY"),                            
                }
                })
            this.setState({
              tableData: tableData
            },()=>{
              // console.log("tableData after setstate====",this.state.tableData);
            })
          })
          .catch((error) => {
            // console.log('error in deals getData', error);
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
    showRelevantCategories(event) {
        var section = event.target.value;
        // console.log("section===",section);
        var value = event.target.value.split("_");
        // console.log("value===",value[0]);

        this.setState({
           section: event.target.value,
           sectionID: value[0],
        },()=>{
            axios.get('/api/category/get/list/' +this.state.sectionID)
            .then((response) => {
              this.setState({
                 categoryArray: response.data,
                 category: "all",
                 subCategory: "all",
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
        })
     }

     showRelevantSubCategories(event) {
        event.preventDefault();       
        // var categoryNameRlang = event.target.value.split('|')[2];
        var value = event.target.value.split("_");
        this.setState({
           category: event.target.value,
           categoryID : value[0],
        },()=>{
            console.log("this.state.categoryID===",this.state.categoryID);
            this.getSubCategories(this.state.categoryID);
        });
     } 

     uploadImage(event){
        event.preventDefault();
        var dealImg = "";
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            // for(var i=0; i<event.currentTarget.files.length; i++){
                var file = event.currentTarget.files[0];
                if (file) {
                    var fileName  = file.name; 
                    var ext = fileName.split('.').pop();  
                    if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG" || ext==="gif"){
                        if (file) {
                            var objTitle = { fileInfo :file }
                            dealImg = objTitle ;                          
                        }else{          
                            swal("Images not uploaded");  
                        }//file
                    }else{ 
                        swal("Allowed images formats are (jpg,png,jpeg)");   
                    }//file types
                }//file
            // }//for 
    
            if(event.currentTarget.files){
                this.setState({
                  dealImg : dealImg
                });  
                main().then(formValues=>{
                    this.setState({
                      dealImg : formValues.dealImg
                    })
                });
                async function main(){
                    var config = await getConfig();                  
                    var s3url = await s3upload(dealImg.fileInfo, config, this);
  
                    const formValues = {
                      "dealImg"    : s3url,
                      "status"           : "New"
                    };
      
                    return Promise.resolve(formValues);
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
                function getConfig(){
                    return new Promise(function(resolve,reject){
                        axios
                            .get('/api/projectSettings/get/S3')
                            .then((response)=>{
                              // console.log("s3 response :",response.data);
                                const config = {
                                    bucketName      : response.data.bucket,
                                    dirName         : process.env.ENVIRONMENT,
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
        }
      }
     radioBoxClick(event){
         console.log("name => ",event.target.name);
         var name = event.target.name;
            this.setState({
                [name] : event.target.value,
            },()=>{
                // console.log("radiobox ===",this.state.updateAllProductPrice);
            })
     }
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pageContent">
                <div className="row">
                    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                        <div class="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                            <h4 class="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Price Discount Management</h4>
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxMinHeight boxMinHeighttab addMarginTop">
                        <form id="addDealsForm">                         
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding blockSettingsBlock">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 inputFields sectionDiv">
                                        <label>Section <i className="redFont">*</i></label> 
                                        <select onChange={this.showRelevantCategories.bind(this)} value={this.state.section} name="section" className="form-control allProductCategories inputValid" aria-describedby="basic-addon1" id="section" ref="section">
                                            <option defaultValue="all" >All Section</option>
                                            {this.state.sectionArray && this.state.sectionArray.length > 0 ? 
                                                this.state.sectionArray.map((data, index) => {
                                                return (
                                                    <option key={index} name={data.section} value={data._id+"_"+data.section}>{data.section}</option>
                                                );
                                                })
                                                :
                                                <option disabled>{"No section added"}</option>

                                            }
                                        </select>
                                        <div className="errorMsg">{this.state.errors.section}</div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Category<span className="astrick"></span></label>
                                            <select onChange={this.showRelevantSubCategories.bind(this)} value={this.state.category} name="category"  className="form-control allProductCategories inputValid" aria-describedby="basic-addon1" id="category" ref="category">
                                                <option selected defaultValue="all">All Category</option>
                                                {this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                                    this.state.categoryArray.map((data, index) => {
                                                    return (
                                                        <option key={index} value={data._id+"_"+data.category}>{data.category}</option>
                                                    );
                                                    })
                                                    :
                                                    <option disabled>{"No category added"}</option>
                                                }
                                            </select>
                                            <div className="errorMsg">{this.state.errors.category}</div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                            <label className="label-category labelform">Sub Category<span className="astrick"></span></label>
                                            <select className="form-control allProductSubCategories inputValid" aria-describedby="basic-addon1" name="subCategory" id="subCategory" ref="subCategory" value={this.state.subCategory} onChange={this.handleChangeSubcategory.bind(this)}>
                                                <option selected defaultValue="all">All Sub-Category</option>
                                                {this.state.subcategoryArray && this.state.subcategoryArray.length > 0 ?
                                                    this.state.subcategoryArray.map((data, index) => {
                                                    return (
                                                        <option value={data._id+"_"+data.subCategoryTitle} key={index}>{data.subCategoryTitle}</option>
                                                    );
                                                    })
                                                :
                                                    <option disabled>{"No sub category added"}</option>
                                                }
                                            </select>
                                            <div className="errorMsg">{this.state.errors.subCategory}</div>
                                        </div>
                                    </div> 
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                        <div className="col-lg-6 col-md-5 col-sm-6 col-xs-12 NOpadding ">
                                            <div className="form-group">
                                                <label className="label-category labelform">Discount Percentage<span className="astrick"></span></label>
                                                <input type="text" ref="dealInPercentage" id="dealInPercentage" value={this.state.dealInPercentage} name="dealInPercentage"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
                                                <div className="errorMsg">{this.state.errors.dealInPercentage}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-xs-12 col-sm-6 ">                                      
                                      
                                      {
                                        this.state.dealimages ?
                                        null
                                        :                                        
                                        <div className="form-group divideCatgRows categoryImgWrapper dealImg">
                                            <label>Upload Image for Deal</label>                                                                    
                                            <input type="file" id="dealimages" name="dealimages" onChange={this.uploadImage.bind(this)} title="" multiple className="" accept=".jpg,.jpeg,.png" required/>
                                        </div>
                                      }
                                      {
                                        this.state.dealimages ? 
                                        <div className="row">
                                          <div className="col-lg-4 productImgCol">
                                            <div className="prodImage">
                                              <div className="prodImageInner">
                                                  <span className="prodImageCross" title="Delete" data-imageUrl={this.state.dealimages} onClick={this.deleteImage.bind(this)} >x</span>
                                              </div>
                                              <img title="view Image" alt="Please wait..." src={this.state.dealimages ? this.state.dealimages : "/images/notavailable.jpg"} className="img-responsive" />
                                            </div>    
                                          </div>
                                        </div>
                                        :
                                        null
                                      }
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 checkboxWrapper">
                                        <input type="radio" id="updateAllProductPrice" onClick={this.radioBoxClick.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1" name="updateAllProductPrice" value="true" checked={this.state.updateAllProductPrice === "true"}/>
                                        <label for="updatelimittedProductPrice" className="col-lg-11 col-md-11 col-sm-11 col-xs-11 radioLable">Update All product price</label><br />
                                        <input type="radio" id="updateAllProductPrice" onClick={this.radioBoxClick.bind(this)} className="col-1 col-md-1 col-sm-1 col-xs-1" name="updateAllProductPrice" value="false" checked={this.state.updateAllProductPrice === "false"}/>
                                        <label for="updatelimittedProductPrice" className="col-lg-11 col-md-11 col-sm-11 col-xs-11 radioLable">Update only price whose current discount percentage is less than this discount</label><br />
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ">
                                        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 checkboxWrapper NOpadding">
                                            <div className="col-lg-12 NOpadding ">
                                            <label>Start Date</label>
                                            {/* <input type="date" onChange={this.handleChange.bind(this)} value={moment(this.state.startdate).format("DD-MM-YYYY")}  className="form-control edit-catg-new" name="startdate" id="startdate" ref="startdate" /> */}
                                            <input type="date" id="startdate"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.startdate} ref="startdate" name="startdate" onChange={this.handleChange.bind(this)} min={this.state.minstartdate} required/>
                                            <div className="errorMsg">{this.state.errors.startdate}</div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 fieldWrapper inputHeight60 noPadding">
                                            <div className="col-lg-12">
                                            <label>End Date</label>
                                            <input type="date" id="enddate" min={this.state.startdate} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.enddate} ref="enddate" name="enddate" onChange={this.handleChange.bind(this)} required/>
                                            <div className="errorMsg">{this.state.errors.enddate}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtnWrapper">
                                        {
                                            this.state.EditBlock
                                            ?
                                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updateDealsInfo.bind(this)}>Update</button>
                                            :
                                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitDealsInfo.bind(this)}>Submit</button>
                                        }
                                    </div> 
                                    
                                </div>
                            </div>                     
                        </form> 
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 discountManagementTable">
                            <IAssureTable
                            tableHeading={this.state.tableHeading}
                            twoLevelHeader={this.state.twoLevelHeader}
                            dataCount={this.state.dataCount}
                            tableData={this.state.tableData}
                            getData={this.getData.bind(this)}
                            tableObjects={this.state.tableObjects}
                            tableName ={this.state.tableName}
                            />
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}

export default DealsManagement;
