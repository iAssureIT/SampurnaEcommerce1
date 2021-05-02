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

class BannerImages extends Component{
    constructor(props) {
        super(props);
        this.state = {            
            "bannerimages"              : "",
            "editId"                    : this.props.editId ? this.props.editId : ''
        };
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

    componentDidMount(){
      var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
      var token       = userDetails.token;
      axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
      window.scrollTo(0, 0);
      this.getBannerImages();

      $.validator.setDefaults({
        debug: true,
        success: "valid"
      });

      $("#galleryManagement").validate({
        rules: {
          bannerimages: {
            required: true,
           
          },
       
        },
      });
    }
    
    getBannerImages(){
      axios.get('/api/bannerimgs/get')
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
      if($('#bannerimages').valid()){      
            var formValues = {              
              "bannerimages"             : this.state.bannerimages,              
            }

            // console.log("formValues===",formValues);
            axios.post('/api/bannerimgs/post', formValues)
            .then((response)=>{
              swal({
                text  : response.data.message,
              });
              this.getBannerImages();
              this.setState({
                "bannerimages"                 : "",                
              });
              $(':input').val('');
              // this.getData(this.state.startRange, this.state.limitRange);
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
      }else{
          $('#bannerimages').valid()
        }
    }
    Removefromgallery(event){
      event.preventDefault();
      var imageId = event.target.id;
      console.log("imageId:",imageId);
      axios.patch('/api/bannerimgs/remove/'+imageId)
      .then((response)=>{
        this.getBannerImages();
        swal({
          text  : response.data.message,
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
    uploadImage(event){
      event.preventDefault();
      var bannerimages = "";
      if (event.currentTarget.files && event.currentTarget.files[0]) {
          // for(var i=0; i<event.currentTarget.files.length; i++){
              var file = event.currentTarget.files[0];
              if (file) {
                  var fileName  = file.name; 
                  var ext = fileName.split('.').pop();  
                  if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                      if (file) {
                          var objTitle = { fileInfo :file }
                          bannerimages = objTitle ;                          
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
                bannerimages : bannerimages
              });  
              main().then(formValues=>{
                  this.setState({
                    bannerimages : formValues.bannerimages
                  })
              });
              async function main(){
                  var config = await getConfig();                  
                  var s3url = await s3upload(bannerimages.fileInfo, config, this);

                  const formValues = {
                    "bannerimages"    : s3url,
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
                          // .get('/api/projectSettings/get/one/s3')
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
        var id = event.target.id;
        // var productImageArray = this.state.productImageArray;
        // console.log('productImage', productImageArray, id);

        // productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
        this.setState({
            bannerimages : "",
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
                                <h4 className="NOpadding-right">Mobile App Banner Images Management </h4>
                            </div>                          

                              <div className="col-lg-12 col-md-12 marginTopp">
                                <form id="galleryManagement" className="">
                                  <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12  NOpadding">                                      
                                      
                                      {
                                        this.state.bannerimages ?
                                        null
                                        :                                        
                                        <div className="divideCatgRows categoryImgWrapper">
                                            <label>Banner Image</label>                                                                    
                                            <input type="file" id="bannerimages" name="bannerimages" onChange={this.uploadImage.bind(this)} title="" multiple className="" accept=".jpg,.jpeg,.png" required/>
                                        </div>
                                      }
                                      {
                                        this.state.bannerimages ? 
                                        <div className="row">
                                          <div className="col-lg-4 productImgCol">
                                            <div className="prodImage">
                                              <div className="prodImageInner">
                                                  <span className="prodImageCross" title="Delete" data-imageUrl={this.state.bannerimages} onClick={this.deleteImage.bind(this)} >x</span>
                                              </div>
                                              <img title="view Image" alt="Please wait..." src={this.state.bannerimages ? this.state.bannerimages : "/images/notavailable.jpg"} className="img-responsive" />
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
                                                  <button onClick={this.submitImage.bind(this)} className="submitBtn btn categoryBtn col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right">Submit</button>                                                
                                              </div>                                          
                                          </div>
                                      </div>                                      
                                  </div>
                              </form>
                              </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                                  
                                  <table className="table galleryTable table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="itemth">Sr. No</th>
                                            <th>Image</th>
                                            <th>Action</th>                                            
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
                                                      <img className="col-lg-2 col-md-2 col-sm-2 col-xs-2 img-rounded" src={data.bannerimages}></img>
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
export default BannerImages;