import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import S3FileUpload           from 'react-s3';
import IAssureTable           from '../../../../coreAdmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/CategoryManagement.css';

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
              subCategory                       : "Subcategory Title",
              categoryDescription               : "Category Description",
              // categoryImage                     : "Category Image",
              actions                           : 'Action',
            },
            "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : '/api/category/',
              paginationApply           : true,
              searchApply               : true,
              editUrl                   : '/category-management/'
            },
            "sectionsList"              : [],
            "startRange"                : 0,
            "limitRange"                : 10,
            "editId"                    : this.props.match.params ? this.props.match.params.categoryID : ''
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
        console.log('sectionChange', this.state.section, this.state.section_ID);
      });
    }
    componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.categoryID;
        if(nextProps.match.params.categoryID){
          this.setState({
            editId : editId
          })
          this.edit(editId);
        }
    }
    componentDidMount(){
      window.scrollTo(0, 0);
      if(this.state.editId){      
        this.edit(this.state.editId);
      }
      $.validator.addMethod("regxsection", function (value, element, arg) {
        return arg !== value;
      }, "Please select the section");
      $.validator.addMethod("valueNotEquals", function(value, element, arg){
        return arg !== value;
      }, "Please select the category");

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
            regxsection: "Select Section"
          },
          category: {
            required: true,
            // regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/, 
          },
          // categoryDescription: {
          //   required: true,
          //   // regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/, 
          // },
        },
        errorPlacement: function(error, element) {
          if (element.attr("name") == "section"){
            error.insertAfter("#section");
          }
          if (element.attr("name") == "category"){
            error.insertAfter("#category");
          }
          // if (element.attr("name") == "categoryDescription"){
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
        console.log('dataCount', response.data);
        this.setState({
          dataCount : response.data.dataCount
        })
      })
      .catch((error)=>{
        console.log('error', error);
      });
    }
    getData(startRange, limitRange){
      var data={
        startRange : startRange,
        limitRange : limitRange
      }

      axios.post('/api/category/get/list', data)
      .then((response)=>{
        console.log('tableData', response.data);
        this.setState({
          tableData : response.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      });
    }
    addNewSubCatArray(event){
      let arrLength = this.state.subcatgArr;
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
        console.log('res', res.data);
        this.setState({
          sectionsList : res.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    deleteSubCategory(event){
        event.preventDefault();
        var id = event.target.id;
        // console.log('subCategory Id',id);

        let arrLength = this.state.subcatgArr;
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
      console.log('bjgjbmbmb',$('#categoryManagement').valid());
      if($('#categoryManagement').valid()){
        var addRowLength = this.state.subcatgArr.length;
        var categoryDimentionArray = [];
        

        axios.get('/api/category/get/count')
        .then((response)=>{
          var catCodeLength = response.data.dataCount;
          if(addRowLength){
            for(var i=0;i<addRowLength;i++){
              var obj = {
                   "index"             : i,
                   "subCategoryCode"   : catCodeLength+'|'+i,
                   "subCategoryTitle"  : $(".newSubCatg"+i).val(),
              }
              if($(".newSubCatg"+i).val()){
                categoryDimentionArray.push(obj);
                this.setState({
                  allowToSubmit: true
                })
              }else{
                console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
                this.setState({
                  ["subCategoryTitleErrora"+i] : "This field is required.",
                  allowToSubmit: false
                })
              }
            }
          }
          // console.log(categoryDimentionArray);
          if(this.state.allowToSubmit == true){
            var formValues = {
              "section"                   : this.state.section,
              "section_ID"                : this.state.section_ID,
              "category"                  : this.refs.category.value,
              "categoryUrl"               : this.refs.categoryUrl.value,
              "subCategory"               : categoryDimentionArray,
              "categoryDescription"       : this.refs.categoryDescription.value,
              "categoryImage"             : this.state.categoryImage,
            }

            axios.post('/api/category/post', formValues)
            .then((response)=>{

              swal({
                text  : response.data.message,
              });

              this.setState({
                "section"                   : 'Select',
                "category"                      : '',
                "categoryUrl"                   : '',
                "addEditModeCategory"           : '',
                "addEditModeSubCategory"        : '',
                "categoryDescription"           : '',
                "subcatgArr"                    : [],
                "categoryImage"             : ""
              });
              $(':input').val('');
              this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch((error)=>{
              console.log('error', error);
            });
          }
        })
        .catch((error)=>{
          console.log('error', error);
        });
      }
    }
    updateCategory(event){
      event.preventDefault();
      console.log('bjgjbmbmb',$('#categoryManagement').valid());
      if($('#categoryManagement').valid()){
        var addRowLength = this.state.subcatgArr.length;
        var categoryDimentionArray = [];
        
        var formValues = {
          "category_ID"               : this.state.editId,
          "section"                   : this.state.section,
          "section_ID"                : this.state.section_ID,
          "category"                  : this.refs.category.value,
          "categoryUrl"               : this.refs.categoryUrl.value,
          "subCategory"               : categoryDimentionArray,
          "categoryDescription"       : this.refs.categoryDescription.value,
          "categoryImage"             : this.state.categoryImage,
        }

        axios.get('/api/category/get/count')
        .then((response)=>{
          var catCodeLength = response.data.dataCount;
          if(addRowLength){
            for(var i=0;i<addRowLength;i++){
              var obj = {
                   "index"             : i,
                   "subCategoryCode"   : catCodeLength+'|'+i,
                   "subCategoryTitle"  : $(".newSubCatg"+i).val(),
              }
              if($(".newSubCatg"+i).val()){
                categoryDimentionArray.push(obj);
                this.setState({
                  allowToUpdate: true
                })
              }else{
                console.log("subCategoryTitleErrora"+i, " subCategoryTitlea0Error");
                this.setState({
                  ["subCategoryTitleErrora"+i] : "This field is required.",
                  allowToUpdate: false
                })
              }
            }
          }
          if(this.state.allowToUpdate == true){
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
                "addEditModeCategory"           : '',
                "addEditModeSubCategory"        : '',
                "categoryDescription"           : '',
                "editId"                        : '',
                "subcatgArr"                    : [],
                categoryImage : "",
              });
              this.props.history.push('/category-management');
            })
            .catch((error)=>{
              console.log('error', error);
            });
          }
        })
        .catch((error)=>{
          console.log('error', error);
        });
      }
    }
    edit(id){
      axios.get('/api/category/get/one/'+id)
      .then((response)=>{
        console.log('edit', response.data);
        if(response.data){
            this.setState({
              "section"                   : response.data.section,
              "section_ID"                : response.data.section_ID,
              "category"                  : response.data.category,
              "categoryUrl"               : response.data.categoryUrl,
              "addEditModeCategory"       : response.data.category,
              "addEditModeSubCategory"    : response.data.subCategory,
              "subcatgArr"                : response.data.subCategory,
              "categoryDescription"       : response.data.categoryDescription,
              "categoryImage"       : response.data.categoryImage,
            },()=>{
                var addRowLength = this.state.subcatgArr.length;

                if(addRowLength){
                    for(var i=0;i<addRowLength;i++){
                        this.setState ({
                          ['subCategoryTitle'+response.data.subCategory[i].subCategoryCode] : response.data.subCategory[i].subCategoryTitle
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
                  
                  var s3url = await s3upload(categoryImage.fileInfo, config, this);


                  const formValues = {
                      "categoryImage"      : s3url,
                      "status"            : "New"
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
                          })
                  })
              }   
              function getConfig(){
                  return new Promise(function(resolve,reject){
                      axios
                          .get('/api/projectSettings/get/S3')
                          .then((response)=>{
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
            //console.log('tableData', response.data);
       
            this.setState({
                tableData : response.data,
                //dataCount : response.data.length
            });
        })
        .catch((error)=>{
              console.log('error', error);
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
        })
    }
    handleSubCatChange(event){
      this.setState({
        [event.target.name] : event.target.value,
        ["subCategoryTitleError"+event.target.id] : event.target.value ? "" : "This field is required."
      })
    }
    render(){
        return(
            <div className="container-fluid col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="formWrapper">
                    <section className="content">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                        <div className="row">
                         <div className="box">
                           <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                <h4 className="NOpadding-right">Category Management </h4>
                          </div>
                          </div>
                          <div className="col-lg-12 col-md-12 marginTopp">
                            <form id="categoryManagement" className="">
                              <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12  NOpadding">
                                  <div className="col-lg-12">
                                      <label>Section <i className="redFont">*</i></label>
                                      <select onChange={this.sectionChange.bind(this)} value={this.state.section+'|'+this.state.section_ID}  name="section" className="form-control allProductCategories" aria-describedby="basic-addon1" id="section" ref="section">
                                      <option value="Select Section">Select Section</option>
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

                                  <div className="col-lg-12">
                                      <label>Category Title <i className="redFont">*</i></label>
                                      <input value={this.state.category} name="category" id="category" onChange={this.createCategoryUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Category Title" ref="category" />
                                  </div>
                                  <div className="col-lg-12">
                                      <label>Category URL <i className="redFont">*</i></label>                                                                    
                                      <input disabled value={this.state.categoryUrl} onChange={this.handleChange.bind(this)} id="categoryUrl" name="categoryUrl" type="text" className="form-control categoryUrl" placeholder="Category URL" ref="categoryUrl"  />
                                  </div>
                                  <div className="col-lg-12 subCatAddLabel">
                                      <label>Subcategories </label>
                                      {
                                          this.state.subcatgArr.map((dataRowArray, index)=>{
                                              // console.log(dataRowArray, 'subCategoryTitle'+dataRowArray.subCategoryCode);
                                              return(
                                                  <div className="col-lg-12 col-md-12 NOpadding" key={index}>                                                                                  
                                                      <div className="col-lg-12 col-md-12 NOpadding newSubCatgArr">   
                                                          <div className="col-lg-11 col-md-11 NOpadding">             
                                                              <input type="text" id={dataRowArray.subCategoryCode} value={this.state['subCategoryTitle'+dataRowArray.subCategoryCode]} name={"subCategoryTitle"+dataRowArray.subCategoryCode} onChange={this.handleSubCatChange.bind(this)} className={"form-control newSubCatg"+index} placeholder="Category Title" aria-label="Brand" aria-describedby="basic-addon1" ref={"newSubCatg"+index} />
                                                          </div>
                                                          <div className="col-lg-1 col-md-1 deleteSubCategory fa fa-trash" id={dataRowArray.subCategoryCode} onClick={this.deleteSubCategory.bind(this)}>
                                                          </div>
                                                      </div>
                                                      <div className="error" name={"subCategoryTitleError"+dataRowArray.subCategoryCode} id={"subCategoryTitle"+dataRowArray.subCategoryCode}>{this.state["subCategoryTitleError"+dataRowArray.subCategoryCode]}</div>
                                                  </div>
                                              );
                                          })
                                      }
                                  </div>
                                  
                                  <div className="col-lg-12 col-md-12">
                                      <div onClick={this.addNewSubCatArray.bind(this)}  className="submitBtn btn btnSubmit col-lg-12">Add New Subcategory</div>
                                  </div>

                              </div>
                              <div className="col-lg-6">
                                  <div className="divideCatgRows">
                                      <label>Category Short Description </label>                                                                    
                                      <input type="text" value={this.state.categoryDescription} onChange={this.handleChange.bind(this)} name="categoryDescription" id="categoryDescription" className="form-control categoryShortDesc" placeholder="Category Short Description" ref="categoryDescription" />
                                  </div>
                                  {/* <div className="divideCatgRows">
                                    <label>Category Image</label>
                                      <div className="col-lg-12 col-md-12 col-xs-6 col-sm-6">
                                      <div className="col-lg-12 col-md-12 col-xs-6 col-sm-6 categoryImage" style={{"backgroundImage":`url(`+(this.state.categoryImage && this.state.categoryImage != "" ? this.state.categoryImage : "/images/notavailable.jpg")+`)`}}>
                                        <div className="row">
                                          <input type="file" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="imgUp col-lg-12 col-sm-12 col-xs-12 col-md-12" accept=".jpg,.jpeg,.png" />
                                        </div>
                                      </div>
                                      </div>
                                  </div> */}
                                  {
                                    this.state.categoryImage ?
                                    null
                                    :
                                    
                                    <div className="divideCatgRows">
                                        <label>Category Image</label>                                                                    
                                        <input type="file" onChange={this.uploadImage.bind(this)} title="Click to Edit Photo" className="" accept=".jpg,.jpeg,.png" />
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
                              <div className="col-lg-12 NOpadding-right">
                                  <div className="addCategoryNewBtn col-lg-12 NOpadding-right">
                                      <div className="pull-right col-lg-6 NOpadding-right">
                                          {/*<div className=" col-lg-6">
                                              <div onClick={this.cancelCategoryUpdate.bind(this)} className="edit-cancel-catg btn col-lg-12 col-md-12 col-sm-12 col-xs-12">Cancel</div>
                                          </div>*/}
                                          <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                            {
                                              this.state.editId ? 
                                              <button onClick={this.updateCategory.bind(this)} className="submitBtn btn btnSubmit col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right ">Update</button>
                                              :
                                              <button onClick={this.submitCategory.bind(this)} className="submitBtn btn btnSubmit col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">Submit</button>
                                            }
                                          </div>
                                      
                                      </div>
                                  </div>
                                  
                              </div>
                          </form>
                          </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <IAssureTable 
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader} 
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                getData={this.getData.bind(this)}
                                tableObjects={this.state.tableObjects}
                                getSearchText={this.getSearchText.bind(this)} 
                              />
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