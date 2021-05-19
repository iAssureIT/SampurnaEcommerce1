import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import jQuery                 from 'jquery';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import IAssureTable           from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/CategoryManagement.css';
import { result } from 'underscore';
// import { set } from 'mongoose';

class CategoryManagement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            "subcatgArr"                        : [],
            "addEditModeCategory"               : "",
            "addEditModeSubCategory"            : [],
            "addEditMode"                       : "",
            "categoryImage"                     : "",
            "tableHeading"                      : {
              section                           : "Section",
              category                          : "Category Title",
              categoryNameRlang                 : "Category Name RL",
              // subCategory                    : "Subcategory Title",
              categoryRank                      : "Category Rank",
              categoryDescription               : "Category Description",
              actions                           : 'Action',
              // categoryRank                      : 1,
            },
            "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : '/api/category',
              paginationApply           : true,
              searchApply               : true,
              editUrl                   : '/project-master-data',
              deleteUrl                 : '/project-master-data'
            },
            "sectionsList"              : [],
            "startRange"                : 0,
            "limitRange"                : 10,
            "editId"                    : this.props.editId ? this.props.editId : '',
            "section"                   : 'Select Section',
            "tableName"                 : 'Category-management'
        };
    }
    handleChange(event){ 
        const target = event.target;
        const name   = target.name;
        this.setState({
            [name]: event.target.value,
        });
    }
    sectionChange(event){
      const target = event.target;
      const name   = target.name;
      this.setState({
          section     : event.target.value.split('|')[0],
          section_ID  : event.target.value.split('|')[1],
      },()=>{
        // console.log('sectionChange', this.state.section, this.state.section_ID);
      });
    }

    componentWillReceiveProps(nextProps) {
      console.log("Inside componentWillRecive props",nextProps);
      // console.log("EditId:===",this.state.editId);
      
      if(nextProps && nextProps.editId && nextProps.editId !== undefined &&  nextProps.history.location.pathname !== "/project-master-data"){      
        this.setState({
           editId : nextProps.editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
    }
  
    componentDidMount(){
      var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
      var token       = userDetails.token;
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
      
      window.scrollTo(0, 0);
      // console.log("editId:",this.props.editId);
      var inputBox = document.getElementById("categoryRank");
      var invalidChars = ["-","+","e"];
  
      inputBox.addEventListener("keydown", function(e) {
        if (invalidChars.includes(e.key)) {
          e.preventDefault();
        }
      });
  
      if(this.state.editId && this.state.editId !== "undefined"){      
        this.edit(this.state.editId);
      }
      $.validator.addMethod("regxsection", function (value, element, arg) {
        return arg !== value;
      }, "Please select the section");
      $.validator.addMethod("valueNotEquals", function(value, element, arg){
        return arg !== value;
      }, "Please select the section");

      $.validator.addMethod("letterswithspace", function(value, element) {
        return this.optional(element) || /^[a-z][a-z\s][&]*$/i.test(value);
      }, "Please enter letters only");

      $.validator.addMethod("charactersLength", function(value, element) {
        return this.optional(element) || value.length <= 128;
      }, "Please enter less than 128 characters");

      $.validator.addMethod("digitsLength", function(value, element) {
        return this.optional(element) || value.length <= 5;
      }, "Please enter max 5 digits only.");
  

  
  

      // $.validator.addMethod("regxA1", function(value, element, regexpr) {          
      //   return regexpr.test(value);
      // }, "Name should only contain letters & number.");
  
      $.validator.setDefaults({
        debug: true,
        success: "valid"
      });

      $("#categoryManagement").validate({
        rules: {
          section: {
            required: true,
            valueNotEquals: "Select Section"
          },
          category: {
            // required: true,
            letterswithspace : true,
            charactersLength:true
          },
          categoryRank:{
            required:true,
            digitsLength:true

          }
          // categoryDescription: {
          //   required: true,
          //   // regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/, 
          // },
        },
        errorPlacement: function(error, element) {
          if (element.attr("name") === "section"){
            error.insertAfter("#section");
          }
          if (element.attr("name") === "category"){
            error.insertAfter("#category");
          }
          if (element.attr("name") === "categoryRank"){
            error.insertAfter("#categoryRank");
          }
         
          // if (element.attr("name") === "categoryDescription"){
          //   error.insertAfter("#categoryDescription");
          // }         
        }
      });
      this.getSectionData();
      this.getDataCount();
      this.getData(this.state.startRange,this.state.limitRange);
    }
    getDataCount(){
      axios.get('/api/category/get/count')
      .then((response)=>{
        // console.log('dataCount', response.data);
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
      var data={
        startRange : startRange,
        limitRange : limitRange
      }

      axios.post('/api/category/get/list', data)
      .then((response)=>{
        console.log('category tableData', response.data);
        this.setState({
          tableData : response.data.reverse()
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
    addNewSubCatArray(event){
      let arrLength = this.state.subcatgArr ? this.state.subcatgArr : null;
      arrLength.push({
          subCategoryCode: "a"+arrLength.length,
          subCategoryTitle: "",
      });
      this.setState({
          subcatgArr : arrLength,
      },()=>{
          // console.log('subcatgArr',this.state.subcatgArr);
      }); 
    }
    addNewRow(index){
        return(
            <div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
                <div className="col-lg-11 col-md-11 NOpadding">             
                    <input type="text" id={index} value={this.state['subCategoryTitle'+index]} name={"subCategoryTitle"+index} onChange={this.handleChange.bind(this)} className={"form-control newSubCatg"+index} placeholder="Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
                </div>
                <div className="col-lg-1 col-md-1 deleteSubCategory fa fa-trash" id={index} onClick={this.deleteSubCategory.bind(this)}>
                    
                </div>
            </div>
        );
    }
    getSectionData(){
      axios.get('/api/sections/get/list')
      .then((res)=>{
        // console.log('res', res.data);
        this.setState({
          sectionsList : res.data
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
      })
    }
    deleteSubCategory(event){
        event.preventDefault();
        var id = event.target.id;
        // console.log('subCategory Id',id);

        let arrLength = this.state.subcatgArr ? this.state.subcatgArr : null;
        // console.log('arrLength',arrLength);
        var index = arrLength.indexOf(id);
        // console.log('index',index);
        // someArray3.splice(someArray3.findIndex(v => v.name === "Kristian"), 1);
        arrLength.splice(arrLength.findIndex(v => v.subCategoryCode === id), 1);
        this.setState({
            subcatgArr: arrLength
        },()=>{
            // console.log('subcatgArr', this.state.subcatgArr);
        });
    }
    submitCategory(event){
      event.preventDefault();
      // console.log('bjgjbmbmb',$('#categoryManagement').valid());
      if($('#categoryManagement').valid()){
        var addRowLength = this.state.subcatgArr ? this.state.subcatgArr.length : null;
        console.log("addRowLength----------",this.state.subcatgArr);
        var categoryDimentionArray = [];
        

        axios.get('/api/category/get/count')
        .then((response)=>{
          var catCodeLength = response.data.dataCount;
          // console.log("catCodeLength",catCodeLength);
          // console.log("addRowLength",addRowLength);
          if(addRowLength){
            for(var i=0;i<addRowLength;i++){
              console.log("1 => ",($(".attributeName" + i).val()));
              console.log("2 => ",($(".attributeValue" + i).val()));
              if(($(".attributeName" + i).val()) !== "" && ($(".attributeValue" + i).val()) !== ""){
                var obj = {
                    "index"             : i,
                    "subCategoryCode"   : catCodeLength+'|'+i,
                    "subCategoryTitle"  : $(".newSubCatg"+i).val(),
                    "subCategoryUrl"    : $(".subcategoryUrl"+i).val(),
                }
                if($(".newSubCatg"+i).val()){
                  console.log("subcategory obj===",obj);
                  axios.post('/api/category/get/list')
                    .then((response)=>{
                      console.log("response in submitCategory",response);

                    })
                    .catch((error)=>{
                      console.log('error', error);
                    });
                  categoryDimentionArray.push(obj);
                  // var finalCategoryArray = Array.from(new Set(categoryDimentionArray.map(c => c.subCategoryTitle.toLowerCase()))).map(subCategoryTitle => {
                  //   console.log("c => ",c);
                  //   console.log("id => ",subCategoryTitle);
                  //   return{
                  //     subCategoryTitle : subCategoryTitle,
                  //   }
                  // })
                  categoryDimentionArray.push(obj);
                  var result = [];
                  if(categoryDimentionArray.length > 0){                    
                    const map    = new Map();
                    for (const item of categoryDimentionArray) {
                        if(!map.has(item.subCategoryTitle)){
                            map.set(item.subCategoryTitle, true);    // set any value to Map
                            result.push({
                              index             : item.index,
                              subCategoryTitle  : item.subCategoryTitle,
                              subCategoryCode   : item.subCategoryCode,
                              subCategoryUrl    : item.subCategoryUrl,
                              status            : "Published",
                            });
                        }
                    }
                    // console.log("result => ", result);
                  }
                  this.setState({
                    allowToSubmit: true
                  })

                }else{
                  // console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
                  this.setState({
                    ["subCategoryTitleErrora"+i] : "This field is required.",
                    allowToSubmit: false
                  })
                }
              }
            }
          }
          // console.log("categoryDimentionArray",categoryDimentionArray);

          
            var formValues = {
              "section"                   : this.state.section,
              "section_ID"                : this.state.section_ID,
              "category"                  : this.refs.category.value,
              "categoryNameRlang"         : this.refs.categoryNameRlang.value,
              "categoryUrl"               : this.refs.categoryUrl.value,
              // "subCategory"               : categoryDimentionArray ? categoryDimentionArray : [],
              "subCategory"               : result,
              "categoryDescription"       : this.refs.categoryDescription.value,
              "categoryImage"             : this.state.categoryImage,
              "categoryRank"              : this.state.categoryRank,
            }

            console.log("Formvalues = ", formValues);

            axios.post('/api/category/post', formValues)
            .then((response)=>{
              /*swal({text  : response.data.message,});*/
              swal(" ",(response.data.message ));
            
              this.setState({
                "section"                   : 'Select',
                "category"                      : '',
                "categoryUrl"                   : '',
                "addEditModeCategory"           : '',
                "addEditModeSubCategory"        : '',
                "categoryDescription"           : '',
                "subcatgArr"                    : [],
                "categoryImage"                 : "",
                "categoryRank"                  : "",
                "categoryNameRlang"             : '',
                "status"                        : ''

              });
              $(':input').val('');
              this.getData(this.state.startRange, this.state.limitRange);
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
    }
    updateCategory(event){
      event.preventDefault();
      // console.log('bjgjbmbmb',$('#categoryManagement').valid());
      if($('#categoryManagement').valid()){
        var addRowLength            = this.state.subcatgArr ? this.state.subcatgArr.length : null;
        var categoryDimentionArray  = [];
        var newresult               = [];
        
        var formValues = {
          "category_ID"               : this.state.editId,
          "section"                   : this.state.section,
          "section_ID"                : this.state.section_ID,
          "category"                  : this.refs.category.value,
          "categoryUrl"               : this.refs.categoryUrl.value,
          // "subCategory"               : categoryDimentionArray,
          "subCategory"               : newresult,
          "categoryDescription"       : this.refs.categoryDescription.value,
          "categoryImage"             : this.state.categoryImage,
          "categoryRank"              : this.state.categoryRank,
          "categoryNameRlang"         : this.refs.categoryNameRlang.value,

        }

        console.log("formValues = ", formValues);
        axios.get('/api/category/get/count')
        .then((response)=>{
          var catCodeLength = response.data.dataCount;
          if(addRowLength){
            console.log("addRowLength => ",addRowLength);  
            for(var i=0;i<addRowLength;i++){
              var obj = {
                   "index"             : i,
                   "subCategoryCode"   : catCodeLength+'|'+i,
                   "subCategoryTitle"  : $(".newSubCatg"+i).val(),
                   "subCategoryUrl"    : $(".subcategoryUrl"+i).val(),
              }
              if($(".newSubCatg"+i).val()){
                categoryDimentionArray.push(obj);            
                  
                this.setState({
                  allowToUpdate: true
                })
              }else{
                // console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
                this.setState({
                  ["subCategoryTitleErrora"+i] : "This field is required.",
                  allowToUpdate: false
                })
              }
            }
            if(i >= addRowLength){
              if(categoryDimentionArray.length > 0){    
                console.log("categoryDimentionArray => ",categoryDimentionArray);                
                const map    = new Map();
                for (const item1 of categoryDimentionArray) {
                  console.log("item => ", item1)
                    if(!map.has(item1.subCategoryTitle)){
                        map.set(item1.subCategoryTitle, true);    // set any value to Map
                        newresult.push({
                          index             : item1.index,
                          subCategoryTitle  : item1.subCategoryTitle,
                          subCategoryCode   : item1.subCategoryCode,
                          subCategoryUrl    : item1.subCategoryUrl,
                        });
                    }
                }
              }
                console.log("newresult => ", newresult);
            }
          }

          // if(this.state.allowToUpdate === true){
            // console.log("In update");
            axios.patch('/api/category/patch', formValues)
            .then((response)=>{
              swal({
                text  : response.data.message,
              });
              this.getData(this.state.startRange, this.state.limitRange);
              this.setState({
                "section"                       : 'Select',
                "category"                      : '',
                "categoryUrl"                   : '',
                "categoryRank"                  : '',
                "addEditModeCategory"           : '',
                "addEditModeSubCategory"        : '',
                "categoryDescription"           : '',
                "editId"                        : '',
                "subcatgArr"                    : [],
                "categoryNameRlang"             : '',
                "categoryImage"                 : "",
              },()=>{
                this.props.history.push('/project-master-data');
                // this.props.editId = '';
              });
              console.log("props => ",this.props);
              // this.props.history.push('/category-management');
              
              // window.location.href ='/project-master-data';
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
          // }
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
    }
    edit(editId){
      // var editId = id.editId; 
      // console.log("edit Id send to axios:",editId);
      // console.log("Id send to axios:",id);
      axios.get('/api/category/get/one/'+editId)
      .then((response)=>{
        console.log('record to be edit', response.data);
        if(response.data){
            this.setState({
              "section"                   : response.data.section,
              "section_ID"                : response.data.section_ID,
              "category"                  : response.data.category,
              "categoryNameRlang"         : response.data.categoryNameRlang,
              "categoryUrl"               : response.data.categoryUrl,
              "categoryRank"              : response.data.categoryRank,
              "addEditModeCategory"       : response.data.category,
              "addEditModeSubCategory"    : response.data.subCategory,
              "subcatgArr"                : response.data.subCategory,
              "categoryDescription"       : response.data.categoryDescription,
              "categoryImage"             : response.data.categoryImage,
            },()=>{
                console.log("this.state.subcatgArr----",this.state.subcatgArr);
                var addRowLength = this.state.subcatgArr ? this.state.subcatgArr.length : null;
                if(addRowLength){
                    for(var i=0;i<addRowLength;i++){
                        this.setState ({
                          ['subCategoryTitle'+response.data.subCategory[i].subCategoryCode] : response.data.subCategory[i].subCategoryTitle,
                          ['subcategoryUrl'+response.data.subCategory[i].subCategoryCode] : response.data.subCategory[i].subCategoryUrl

                        },()=>{
                          
                        });
                    }
                }
            });
        } else{
            this.setState ({

            });
        }
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
    uploadImage(event){
      event.preventDefault();
      var categoryImage = "";
      if (event.currentTarget.files && event.currentTarget.files[0]) {
          // for(var i=0; i<event.currentTarget.files.length; i++){
              var file = event.currentTarget.files[0];
              if (file) {
                  var fileName  = file.name; 
                  var ext = fileName.split('.').pop();  
                  if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                      if (file) {
                          var objTitle = { fileInfo :file }
                          categoryImage = objTitle ;
                          
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
                categoryImage : categoryImage
              });  
              main().then(formValues=>{
                  this.setState({
                    categoryImage : formValues.categoryImage
                  })
              });
              async function main(){
                  var config = await getConfig();
                  // console.log("line 429 config = ",config);
                  var s3url = await s3upload(categoryImage.fileInfo, config, this);

                  const formValues = {
                    "categoryImage"    : s3url,
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
                          // .get('/api/projectSettings/get/S3')
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
    deleteImage(event){
        // console.log('delete');
        
        var id = event.target.id;
        var productImageArray = this.state.productImageArray;
        // console.log('productImage', productImageArray, id);

        productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
        this.setState({
            categoryImage : "",
            productImageArray: productImageArray
        },()=>{
            // console.log('subcatgArr', this.state.subcatgArr);
        });
    }
    createCategoryUrl(event){
        const target = event.target;
        const name   = target.name;
        this.setState({
            [name]: event.target.value,
        });
        var url = event.target.value;
        // console.log('url',url);
        if(url){
            url = url.replace(/\s+/g, '-').toLowerCase();
            // $(".productUrl").val(url);
            this.setState({
                categoryUrl : url
            })
        }
    }
    deleteImage(event){
      event.preventDefault();
      this.setState({
        categoryImage : ""
      })
    }
    getSearchText(searchText, startRange, limitRange){
      this.getSearchCount(searchText);
      var formValues={ 
        "searchText"    : searchText,
        "startRange"        : startRange,
        "limitRange"        : limitRange
      };
      axios.post("/api/category/searchCategory",formValues)
        .then((response)=>{ 
            console.log('tableData', response.data);
       
            this.setState({
                tableData : response.data,
                //dataCount : response.data.length
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
        })
    }
    getSearchCount(searchText){

      var formValues={ 
        "searchText"    : searchText
      };
      axios.post("/api/category/searchCategoryCount",formValues)
        .then((response)=>{ 
            this.setState({
                dataCount : response.data.dataCount
            },()=>{
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
        })
    }
    handleSubCatChange(event){
      this.setState({
        [event.target.name] : event.target.value,
        ["subCategoryTitleError"+event.target.id] : event.target.value ? "" : "This field is required."
      })
    }

    createSubCategoryUrl(event){
      const target = event.target;
      const name   = target.name;
      this.setState({
          [name]: event.target.value,
          ["subCategoryTitleError"+event.target.id] : event.target.value ? "" : "This field is required."

      });
      var url = event.target.value;
      // console.log('url',url);
      if(url){
          url = url.replace(/\s+/g, '-').toLowerCase();
          // $(".productUrl").val(url);
          this.setState({
              ["subcategoryUrl"+event.target.id] : url
          })
      }
    }


    render(){
      
        return(
            <div className="container-fluid col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
                <div className="formWrapper">
                    <section className="content">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                        <div className="row">
                         <div className="">
                            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                <h4 className="weighttitle NOpadding-right">Category Master </h4>
                            </div>                          

                              <div className="col-lg-12 col-md-12 marginTopp">
                                <form id="categoryManagement" className="">
                                  <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12  NOpadding">
                                      <div className="col-lg-12 fieldWrapper">
                                          <label>Section <i className="redFont">*</i></label>
                                          <select onChange={this.sectionChange.bind(this)} value={this.state.section+'|'+this.state.section_ID}  name="section" className="form-control allProductCategories" aria-describedby="basic-addon1" id="section" ref="section" required>
                                          <option selected value="Select Section">Select Section</option>
                                            {
                                              this.state.sectionsList && this.state.sectionsList.length>0 ?
                                              this.state.sectionsList.map((data, index)=>{
                                                return(
                                                  <option value={data.section+'|'+data._id}>{data.section}</option>
                                                );
                                              })
                                              :
                                              null
                                            }                                       
                                            
                                          </select>
                                      </div>

                                      <div className="col-lg-12 fieldWrapper">
                                          <label>Category Title <i className="redFont">*</i></label>
                                          <input value={this.state.category} name="category" id="category" onChange={this.createCategoryUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Category Title" ref="category" />
                                      </div>
                                      <div className="col-lg-6 fieldWrapper">
                                          <label>Category URL <i className="redFont">*</i></label>                                                                    
                                          <input disabled value={this.state.categoryUrl} onChange={this.handleChange.bind(this)} id="categoryUrl" name="categoryUrl" type="text" className="form-control categoryUrl" placeholder="Category URL" ref="categoryUrl"  />
                                      </div>
                                      <div className="col-lg-6 fieldWrapper">
                                          <label>Category Rank <i className="redFont">*</i></label>                                                                    
                                          <input value={this.state.categoryRank} onChange={this.handleChange.bind(this)} onkeydown="return event.keyCode !== 69" id="categoryRank" name="categoryRank" type="number" className="form-control categoryRank" placeholder="Category Rank" ref="categoryRank"  min="1"/>
                                      </div>
                                      {/* <div className="col-lg-12 subCatAddLabel">
                                          <label>Subcategories </label>
                                          {
                                              this.state.subcatgArr.map((dataRowArray, index)=>{
                                                  // console.log(dataRowArray, 'subCategoryTitle'+dataRowArray.subCategoryCode);
                                                  return(
                                                      <div className="col-lg-12 col-md-12 NOpadding" key={index}>                                                                                  
                                                          <div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">             
                                                                  <input type="text" id={dataRowArray.subCategoryCode} value={this.state['subCategoryTitle'+dataRowArray.subCategoryCode]} name={"subCategoryTitle"+dataRowArray.subCategoryCode} onChange={this.handleSubCatChange.bind(this)} className={"form-control newSubCatg"+index} placeholder="Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
                                                              </div>
                                                              <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                                  <input disabled value={this.state.categoryUrl} onChange={this.handleChange.bind(this)} id="categoryUrl" name="categoryUrl" type="text" className="form-control categoryUrl" placeholder="Category URL" ref="categoryUrl"  />
                                                              </div>
                                                              <div className="deleteSubCategory fa fa-trash" id={dataRowArray.subCategoryCode} onClick={this.deleteSubCategory.bind(this)}>
                                                              </div>
                                                          </div>
                                                          <div className="error" name={"subCategoryTitleError"+dataRowArray.subCategoryCode} id={"subCategoryTitle"+dataRowArray.subCategoryCode}>{this.state["subCategoryTitleError"+dataRowArray.subCategoryCode]}</div>
                                                      </div>
                                                  );
                                              })
                                          }
                                      </div>
                                      
                                      <div className="col-lg-12 col-md-12">
                                          <div onClick={this.addNewSubCatArray.bind(this)}  className="submitBtn btn categoryBtn col-lg-12">Add New Subcategory</div>
                                      </div> */}

                                  </div>
                                  <div className="col-lg-6">
                                      <div className="divideCatgRows fieldWrapper ">
                                          <label>Category Short Description </label>                                                                    
                                          <input type="text" value={this.state.categoryDescription} onChange={this.handleChange.bind(this)} name="categoryDescription" id="categoryDescription" className="form-control categoryShortDesc" placeholder="Category Short Description" ref="categoryDescription" />
                                      </div>
                                      {/* <div className="divideCatgRows">
                                        <label>Category Image</label>
                                          <div className="col-lg-12 col-md-12 col-xs-6 col-sm-6">
                                          <div className="col-lg-12 col-md-12 col-xs-6 col-sm-6 categoryImage" style={{"backgroundImage":`url(`+(this.state.categoryImage && this.state.categoryImage !== "" ? this.state.categoryImage : "/images/notavailable.jpg")+`)`}}>
                                            <div className="row">
                                              <input type="file" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="imgUp col-lg-12 col-sm-12 col-xs-12 col-md-12" accept=".jpg,.jpeg,.png" />
                                            </div>
                                          </div>
                                          </div>
                                      </div> */}
                                      <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                          <label>Category Name in RL <i className="redFont"></i></label>
                                          <input value={this.state.categoryNameRlang} name="categoryNameRlang" id="categoryNameRlang" onChange={this.handleChange.bind(this)} type="text" className="form-control categoryNameRlang RegionalFont" placeholder="कॅटेगरी नेम इन रिजनल लँग्वेज" aria-label="categoryNameRlang" aria-describedby="basic-addon1" ref="categoryNameRlang" />
                                        </div>
                                      </div>

                                      {
                                        this.state.categoryImage ?
                                        null
                                        :
                                        
                                        <div className="divideCatgRows categoryImgWrapper">
                                            <label>Category Image</label>                                                                    
                                            <input type="file" name="file" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="" accept=".jpg,.jpeg,.png" />
                                        </div>
                                      }
                                      {
                                        this.state.categoryImage ? 
                                        <div className="row">
                                          <div className="col-lg-4 productImgCol">
                                            <div className="prodImage">
                                              <div className="prodImageInner">
                                                  <span className="prodImageCross" title="Delete" data-imageUrl={this.state.categoryImage} onClick={this.deleteImage.bind(this)} >x</span>
                                              </div>
                                              <img title="view Image" alt="Please wait..." src={this.state.categoryImage ? this.state.categoryImage : "/images/notavailable.jpg"} className="img-responsive" />
                                            </div>    
                                          </div>
                                        </div>
                                        :
                                        null
                                      }
                                  </div>
                                  <div className="col-lg-12 subCatAddLabel">
                                          <label>Subcategories </label>
                                          {
                                            this.state.subcatgArr ?
                                              this.state.subcatgArr.map((dataRowArray, index)=>{
                                                  // console.log(dataRowArray, 'subCategoryTitle'+dataRowArray.subCategoryCode);
                                                  return(
                                                      <div className="col-lg-12 col-md-12 NOpadding" key={index}>                                                                                  
                                                          <div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 NOpadding">             
                                                                  <input type="text" id={dataRowArray.subCategoryCode} value={this.state['subCategoryTitle'+dataRowArray.subCategoryCode]} name={"subCategoryTitle"+dataRowArray.subCategoryCode} onChange={this.createSubCategoryUrl.bind(this)} className={"form-control newSubCatg"+index} placeholder="Sub Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
                                                              </div>
                                                              <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                                  <input disabled value={this.state['subcategoryUrl'+dataRowArray.subCategoryCode]} onChange={this.createSubCategoryUrl.bind(this)} id="subcategoryUrl" name={"subcategoryUrl"+dataRowArray.subCategoryCode} type="text" className={"form-control subcategoryUrl"+index} placeholder="Sub Category URL" ref="subcategoryUrl"  />
                                                              </div>
                                                              <div className="deleteSubCategory fa fa-trash" id={dataRowArray.subCategoryCode} onClick={this.deleteSubCategory.bind(this)}>
                                                              </div>
                                                          </div>
                                                          <div className="error" name={"subCategoryTitleError"+dataRowArray.subCategoryCode} id={"subCategoryTitle"+dataRowArray.subCategoryCode}>{this.state["subCategoryTitleError"+dataRowArray.subCategoryCode]}</div>
                                                      </div>
                                                  );
                                              })

                                            : null
                                          }
                                      </div>
                                      
                                      <div className="col-lg-6 col-md-6">
                                          <div onClick={this.addNewSubCatArray.bind(this)}  className="submitBtn btn categoryBtn button3 col-lg-12">Add New Subcategory</div>
                                      </div>

                                  <div className="col-lg-12 NOpadding-right">
                                      <div className="addCategoryNewBtn col-lg-12 NOpadding-right">
                                          <div className="pull-right col-lg-6 NOpadding-right">
                                              {/*<div className=" col-lg-6">
                                                  <div onClick={this.cancelCategoryUpdate.bind(this)} className="edit-cancel-catg btn col-lg-12 col-md-12 col-sm-12 col-xs-12">Cancel</div>
                                              </div>*/}
                                              <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                                {
                                                  this.state.editId ? 
                                                  <button onClick={this.updateCategory.bind(this)} className="btn button3 pull-right">Update</button>
                                                  :
                                                  <button onClick={this.submitCategory.bind(this)} className="btn button3 pull-right">Submit</button>
                                                }
                                              </div>
                                          
                                          </div>
                                      </div>
                                      
                                  </div>
                              </form>
                              </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                  <IAssureTable 
                                    tableHeading={this.state.tableHeading}
                                    twoLevelHeader={this.state.twoLevelHeader} 
                                    dataCount={this.state.dataCount}
                                    tableData={this.state.tableData}
                                    getData={this.getData.bind(this)}
                                    tableObjects={this.state.tableObjects}
                                    getSearchText={this.getSearchText.bind(this)} 
                                     tableName = {this.state.tableName}
                                    currentView = {"Category-Management-table"}
                                  />
                                </div>
                              </div>
                          </div>
                        </div>
                      </section>
                      </div>
                    </div>
                  </div>
            </div>
          );
        }
    }
export default CategoryManagement;