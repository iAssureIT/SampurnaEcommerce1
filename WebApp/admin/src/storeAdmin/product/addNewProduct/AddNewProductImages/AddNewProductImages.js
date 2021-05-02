
import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import S3FileUpload           from 'react-s3';
import 'bootstrap/js/tab.js';

class AddNewProductImages extends Component{
    constructor(props) {
        super(props);
        this.state = {
            allProductImages      : [],
            productImage          : [],
            productImageArray     : [],
            productTitle          : '',
            product_ID            : this.props.match.params
        }
    }
    componentDidMount() {
        var userDetails     = JSON.parse(localStorage.getItem("userDetails"));
        var token           = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

        this.getData(this.props.match.params.productID);
    }
    componentWillReceiveProps(nextProps){             
        this.getData(this.props.match.params.productID);
    }
    getData(id){
        // console.log('id',id);
        axios.get('/api/products/get/one/'+id)
        .then((response)=>{
            // console.log('reas', response.data);
            this.setState({
                productImage : response.data.productImage && response.data.productImage.length>0 ? response.data.productImage : [],
                productImageArray : response.data.productImage && response.data.productImage.length>0 ? response.data.productImage : [],
                productTitle : response.data.productName
            },()=>{
                // console.log('productImage', this.state.productImage);
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
    uploadProductImage(event){
        event.preventDefault();
        var productImage = [];
        console.log("event.currentTarget.files---",event.currentTarget.files);
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for(var i=0; i<event.currentTarget.files.length; i++){
                var file = event.currentTarget.files[i];
                if (file) {
                    var fileName  = file.name; 
                    var ext = fileName.split('.').pop();  
                    if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                        if (file) {
                            var objTitle = { fileInfo :file }
                            productImage.push(objTitle);
                            
                        }else{          
                            swal("Images not uploaded");  
                        }//file
                    }else{ 
                        swal("Allowed images formats are (jpg,png,jpeg)");   
                    }//file types
                }//file
            }//for 

            if(i >= event.currentTarget.files.length){
                this.setState({
                    productImage : productImage
                },()=>{
                    // console.log('productImage', this.state.productImage)
                });  
                main().then(formValues=>{
                    // console.log('formValues.productImage', formValues.productImage);
                    var newImages = this.state.productImageArray;
                    newImages.push(formValues.productImage);
                    this.setState({
                        productImageArray : _.flatten(newImages)
                    },()=>{
                        // console.log('form', this.state.productImageArray);
                    })
                });
                async function main(){
                    var config = await getConfig();
                    
                    var s3urlArray = [];
                    for (var i = 0; i<productImage.length; i++) {
                        var s3url = await s3upload(productImage[i].fileInfo, config, this);
                        s3urlArray.push(s3url);
                    }
                    // console.log('s3urlArray',s3urlArray);
                    
                    
                    const formValues = {
                        "product_ID"        : "fhfgf",
                        "productImage"      : s3urlArray,
                        "status"            : "New"
                    };
        
                    // console.log("1 formValues = ",formValues);
                    return Promise.resolve(formValues);
                }
                function s3upload(image,configuration){
                    console.log("image in s3upload",image);
                    console.log("configuration in configuration",configuration);
                    return new Promise(function(resolve,reject){
                        S3FileUpload
                           .uploadFile(image,configuration)
                           .then((Data)=>{
                                // console.log("Data = ",Data);
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
        }
    }
    saveProductImages(event){
        event.preventDefault();
        var productImage    = this.state.productImage;
        var video           = this.state.video
        var formValues = {
            "product_ID"        : this.props.match.params.productID,
            "productImage"      : this.state.productImageArray,
            "status"            : "New"
        };
        console.log('saveProductImages formValues', formValues);
        axios.patch('/api/products/patch/gallery',formValues)
            .then( (res) =>{
                console.log('res images', res);
                this.props.history.push('/product-list')
            })
            .catch((error) =>{
                console.log("error = ", error);
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
        
        function getConfig(){
            return new Promise(function(resolve,reject){
                axios
                   .get('/api/projectSettings/get/S3')
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
    deleteProductImage(event){
        // console.log('delete');
        
        var id = event.target.id;
        var productImageArray = this.state.productImageArray;
        // console.log('productImage', productImageArray, id);

        productImageArray.splice(productImageArray.findIndex(v => v === id), 1);
        this.setState({
            productImageArray: productImageArray
        },()=>{
            // console.log('subcatgArr', this.state.subcatgArr);
        });
    }
    
    render(){
        // console.log('this', this.state.s3urlArray);
        return(
            <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
              <div className="row">
                <div className="formWrapper col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                    <section className="content">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                                  Add Product Image                            
                               </div>
                              <hr className="hr-head container-fluid row"/>
                            </div>
                            <div className="box-body">
                                <div className="">
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 addProdImgVidTitle">
                                            Product Name : {this.state.productTitle}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Product Image<span className="imageUploadInstructions">(Upload Maximum 408px X 366px Image)</span></label>

                                        
                                        <div className="input-group">
                                            <span className="input-group-addon" id="basic-addon1"><i className="fa fa-file-image-o" aria-hidden="true"></i></span>
                                            <div aria-describedby="basic-addon1">
                                                <input type="file" className="form-control commonFilesUpld" accept=".jpg,.jpeg,.png" multiple onChange={this.uploadProductImage.bind(this)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="row productImgWrapper">
                                        {this.state.productImageArray && this.state.productImageArray.length > 0?
                                            this.state.productImageArray.map((imageData, index)=>{
                                                return(
                                                    <div className="col-lg-2 productImgCol" key={index}>
                                                        <div className="prodImage">
                                                            <div className="prodImageInner">
                                                                <span className="prodImageCross" title="Delete" data-imageUrl={imageData} id={imageData} onClick={this.deleteProductImage.bind(this)}>x</span>
                                                            </div>
                                                            <img aria-hidden="true" data-toggle="modal" data-target={"#openImageModal"+index} title="view Image" src={imageData} alt="Product Image" className="img-responsive" />
                                                        </div>
                                                        <div className="modal fade" id={"openImageModal"+index} role="dialog">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <a href="#" data-dismiss="modal" aria-hidden="true" className="close pull-right"><i className="fa fa-times-circle-o fa-lg venClosePadd" aria-hidden="true"></i></a>
                                                                        </div>
                                                                    <div className="modal-body">
                                                                        <div className="row">
                                                                            <div className="col-lg-12 text-left productImageModallMarginBtm">
                                                                                <img src={imageData} alt="Product Image" className="img-responsive" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                            :
                                            null
                                        }
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <button className="submitBtn btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9 marginTop17 pull-right" onClick={this.saveProductImages.bind(this)} >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
        );
    }
}
export default AddNewProductImages;