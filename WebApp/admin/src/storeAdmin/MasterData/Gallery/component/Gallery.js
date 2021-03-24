import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import jQuery                 from 'jquery';
import swal                   from 'sweetalert';
import S3FileUpload           from 'react-s3';
import IAssureTable           from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/Gallery.css';

class Gallery extends Component{
    constructor(props) {
        super(props);
        this.state = {            
            "galleryImage"                     : "",
            // "tableHeading"                      : {
            //   section                           : "Section",
            //   category                          : "Category Title",
            //   // subCategory                       : "Subcategory Title",
            //   categoryRank                       : "Category Rank",
            //   categoryDescription               : "Category Description",
            //   actions                           : 'Action',
            //   // categoryRank                      : 1,
            // },
            // "tableObjects"              : {
            //   deleteMethod              : 'delete',
            //   apiLink                   : '/api/category',
            //   paginationApply           : true,
            //   searchApply               : true,
            //   editUrl                   : '/project-master-data',
            //   deleteUrl                 : '/project-master-data'
            // },
            // "sectionsList"              : [],
            // "startRange"                : 0,
            // "limitRange"                : 10,
            "editId"                    : this.props.editId ? this.props.editId : ''
        };
    }
    // handleChange(event){ 
    //     const target = event.target;
    //     const name   = target.name;
    //     this.setState({
    //         [name]: event.target.value,
    //     });
    // }
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

    // componentWillReceiveProps(nextProps) {
    //   console.log("Inside componentWillRecive props",nextProps);
    //   // console.log("EditId:===",this.state.editId);
      
    //   if(nextProps){      
    //     this.setState({
    //        editId : nextProps.editId
    //     })
    //     this.edit(nextProps);
    //   }
    // }
  
    componentDidMount(){
      window.scrollTo(0, 0);
      this.getGalleryData();

       $.validator.setDefaults({
        debug: true,
        success: "valid"
      });

      $("#galleryManagement").validate({
        rules: {
          galleryImage: {
            required: true,
           
          },
       
        },
      });
    }
    
    getGalleryData(){
      axios.get('/api/gallery/get')
      .then((res)=>{
        console.log('res', res.data);
        this.setState({
          galleryList : res.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    
    submitImage(event){
      event.preventDefault();
      // console.log('bjgjbmbmb',$('#galleryManagement').valid());
      // if($('#galleryImage').valid()){      
            var formValues = {              
              "galleryImage"             : this.state.galleryImage,              
            }

            // console.log("formValues===",formValues);
            axios.post('/api/gallery/post', formValues)
            .then((response)=>{
              swal({
                text  : response.data.message,
              });
              window.location.reload();
              this.setState({
                "galleryImage"                 : "",                
              });
              $(':input').val('');
              // this.getData(this.state.startRange, this.state.limitRange);
            })
            .catch((error)=>{
              console.log('error', error);
            });          
     /* }else{
          $('#galleryImage').valid()
        }*/
    }
    Removefromgallery(event){
      event.preventDefault();
      var imageId = event.target.id;
      console.log("imageId:",imageId);
      axios.patch('/api/gallery/remove/'+imageId)
      .then((response)=>{
        swal({
          text  : response.data.message,
        });
        window.location.reload();        
       
      })
      .catch((error)=>{
        console.log('error', error);
      });

    }
    uploadImage(event){
      event.preventDefault();
      var galleryImage = "";
      if (event.currentTarget.files && event.currentTarget.files[0]) {
          // for(var i=0; i<event.currentTarget.files.length; i++){
              var file = event.currentTarget.files[0];
              if (file) {
                  var fileName  = file.name; 
                  var ext = fileName.split('.').pop();  
                  if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                      if (file) {
                          var objTitle = { fileInfo :file }
                          galleryImage = objTitle ;                          
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
                galleryImage : galleryImage
              });  
              main().then(formValues=>{
                  this.setState({
                    galleryImage : formValues.galleryImage
                  })
              });
              async function main(){
                  var config = await getConfig();                  
                  var s3url = await s3upload(galleryImage.fileInfo, config, this);

                  const formValues = {
                    "galleryImage"    : s3url,
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
        var id = event.target.id;
        // var productImageArray = this.state.productImageArray;
        // console.log('productImage', productImageArray, id);

        // productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
        this.setState({
            galleryImage : "",
            // productImageArray: productImageArray
        },()=>{
            // console.log('subcatgArr', this.state.subcatgArr);
        });
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
                                <h4 className="weighttitle NOpadding-right">Gallery Master </h4>
                            </div>                          

                              <div className="col-lg-12 col-md-12 marginTopp">
                                <form id="galleryManagement" className="">
                                  <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12  NOpadding">                                      
                                      
                                      {
                                        this.state.galleryImage ?
                                        null
                                        :                                        
                                        <div className="divideCatgRows categoryImgWrapper">
                                            <label>Gallery Image</label>                                                                    
                                            <input type="file" name="galleryImage" id="galleryImage" onChange={this.uploadImage.bind(this)} title="" multiple className="" accept=".jpg,.jpeg,.png" />
                                        </div>
                                      }
                                      {
                                        this.state.galleryImage ? 
                                        <div className="row">
                                          <div className="col-lg-4 productImgCol">
                                            <div className="prodImage">
                                              <div className="prodImageInner">
                                                  <span className="prodImageCross" title="Delete" data-imageUrl={this.state.galleryImage} onClick={this.deleteImage.bind(this)} >x</span>
                                              </div>
                                              <img title="view Image" alt="Please wait..." src={this.state.galleryImage ? this.state.galleryImage : "/images/notavailable.jpg"} className="img-responsive" />
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
                                              <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">                                                
                                                  <button onClick={this.submitImage.bind(this)} className="submitBtn btn categoryBtn button3 col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right">Submit</button>                                                
                                              </div>                                          
                                          </div>
                                      </div>                                      
                                  </div>
                              </form>
                              </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                                  
                                  <table className="table galleryTable table-bordered">
                                    <thead className="tempTableHeader fixedHeader">
                                        <tr>
                                            <th className="itemth umDynamicHeader">Sr. No</th>
                                            <th className="umDynamicHeader">Image</th>
                                            <th className="umDynamicHeader">Action</th>                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                      Array.isArray(this.state.galleryList) && this.state.galleryList.map((data, index)=>{                                                
                                          return(
                                              <tr key={index}>
                                                  <td>
                                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                                        {index+1}
                                                    </div>
                                                  </td>                                                    
                                                  <td>
                                                      <img className="col-lg-2 col-md-2 col-sm-2 col-xs-2 img-rounded" src={data.galleryImage}></img>
                                                  </td>
                                                  <td>
                                                      <span className="fa fa-trash trashIcon" id={data._id} onClick={this.Removefromgallery.bind(this)}><a href="/" style={{color:"#337ab7"}} > </a></span>
                                                  </td>
                                              </tr>
                                          )
                                      })
                                    }
                                    </tbody>
                                  </table>
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
export default Gallery;