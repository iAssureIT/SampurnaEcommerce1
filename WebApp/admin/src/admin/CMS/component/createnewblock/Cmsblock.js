import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import swal from 'sweetalert';
import './cmsblock.css';

const queryString = require('query-string');
class CmsBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
           	uploadedImage         : [],
            imgbPath          	  : {},
            rbPath          	    : {},
            uploadedbackImage     : [],
            rBImage 			        : "",
            imgbackPath           : {},
      			blockTitle 	          : "",
      			blocksubTitle         : "",
      			blockBody		          : "",
      			componentName		      : "",
      			blockType			        : "",
      			buttonText		        : "Submit",
      			blockDescription   		: "",
      			repBlockContent   	  : "",
          /*  blockContent          : "",*/
      			typeOfBlock			      : "",
      			block_id			        : "",
      			bgImage 			        : "",
      			fgImage 			        : "",
      			bgVideo 			        : "",
      			fgVideo 			        : "",
      			config 				        : "",
      			foreGImage 			      : "",
      			backgroundImage  	    : "",
      			groupRepetedBlocks 	  : false,
      			repGBlockTitle 		    : "",
      			repGBlocksubTitle 	  : "",
      			repetedLink			      : "",
      			repetedGroup 		      : [],
            rep_idEdit            : "",
            parsed                : {
                                    blockTitle          : "",
                                    blocksubTitle       : "",
                                    componentName       : "",
                                    blockType           : "",
                                    fgImage             : "",
                                    bgImage             : "",
                                    bgVideo             : "",
                                    fgVideo             : "",
                                    blockDescription    : "",
                                    repGBlockTitle      : "",
                                    repGBlocksubTitle   : "",
                                    repetedLink         : "",
                                    RepetedBlock        : ""
            }
		    };

		 this.onEditorChange = this.onEditorChange.bind( this );
    }

  onEditorChange( evt ) {
      this.setState( {
          blockDescription: evt.editor.getData()
      } );
  }
  onEditorChangeINGroupBlock( evt ) {
      this.setState( {
          repBlockContent: evt.editor.getData()
      } );
  }
  handleChange(event){
		event.preventDefault();
      console.log("handleChange===>in Componant===>",this.state.parsed.componentName);

    	this.setState({
       		"blockTitle"       : this.state.parsed.blockTitle ? this.refs.blockTitle.value : "",
			    "blocksubTitle"    : this.state.parsed.blocksubTitle ? this.refs.blocksubTitle.value :"",
			    "blockType"		     : this.state.parsed.blockType ? this.refs.blockType.value :"",
			    "componentName"		 : this.state.parsed.componentName,

			// "blockBody"	 : this.refs.blockBody.value,
			/*"componentName"		 : this.props.blockDetailsID ? this.props.blockDetailsID.componentName : null, 
			"blockType"			 : this.props.blockDetailsID ? this.props.blockDetailsID.blockType : null,*/ 
			
    	});
	}



  handle1Change(event){
		event.preventDefault();
    	this.setState({

        [event.target.name]:event.target.value	
    	});
	}

	
	submitRepBlockInfo(event){
		event.preventDefault();
		var ArrayRepetedGroup = this.state.repetedGroup;
		var formValues = {
    		Title 			: this.state.repGBlockTitle,
    		SubTitle 		: this.state.repGBlocksubTitle,
    		Link 			  : this.state.repetedLink,
    		Description : this.state.repBlockContent,
    		Image 			: this.state.rbPath.path,		
		};
        swal("Thank you.Your Block is Created.");
        ArrayRepetedGroup.push(formValues);
                    this.setState({
			            repetedGroup : ArrayRepetedGroup,
			            groupRepetedBlocks : false
			          },()=>{
			          	console.log("formValues=blocks>",this.state.repetedGroup);
			          })
						this.setState({
							repGBlockTitle : "",
							repGBlocksubTitle: "",
							repetedLink : "",
							repBlockContent: "",
							rbPath : "",
						}) 
	}
  updtaeRepBlockInfo(event){
    event.preventDefault();
    if (this.state.rep_idEdit){
        // console.log('this.state.repetedGroup',this.state.repetedGroup)
        var array = this.state.repetedGroup
        var index = array.findIndex(x=>x._id===this.state.rep_idEdit)
        if(index>=0){
          array[index] = {
            _id : this.state.rep_idEdit,
            Title          : this.state.repGBlockTitle,
            SubTitle       : this.state.repGBlocksubTitle,
            Link           : this.state.repetedLink,
            Description    : this.state.repBlockContent,
            Image          : this.state.rbPath.path, 
          }
        }
        // console.log('array',array);
        this.setState({'repetedGroup':array})
            } 
  }

	submitcmsBlockInfo(event){
		event.preventDefault();		
		var formValues = {
  		blockTitle 			   : this.state.blockTitle,
  		blockSubTitle 		 : this.state.blocksubTitle,
  		blockDescription 	 : this.state.blockDescription,
  		blockComponentName : this.state.parsed.componentName,
  		blockType 			   : this.state.blockType,
  		fgImage 			     : this.state.imgbPath ? this.state.imgbPath.path: "",
  		bgImage 			     : this.state.imgbackPath ? this.state.imgbackPath.path: "" ,
  		repeatedBlocks 		 : this.state.repetedGroup,				
		};

		console.log("formValues=blocks>",formValues);
		axios
			.post('/api/blocks/post',formValues)
		  	.then(function (response) {
		    // handle success
		    	// console.log("data in block========",response.data);
		    	swal("Thank you. Your Block is Created.");
		    	 // window.location.reload();
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
   		console.log("formValues =>",formValues);	
	}

  componentDidMount(){	
    var block_id= this.props.block_id;
    // console.log("zzzzz  block_id  zzzzzzz",block_id);	  
    // console.log("location.search = ",this.props.location.search);
    const parsed = queryString.parse(this.props.location.search);
    // console.log("parsed = ",parsed);
    this.getBlockData(block_id);
    this.setState({ 
                    
        block_id              : block_id,
        parsed                : parsed
        
    });

    axios
          .get('http://iogapi.iassureit.com/api/projectsettings/get/S3')
          .then((response)=>{
            
            const config = {
                              bucketName      : response.data.bucket,
                              dirName         : "iOG",
                              region          : response.data.region,
                              accessKeyId     : response.data.key,
                              secretAccessKey : response.data.secret,
                           }
            this.setState({
              config : config
            })

          })
          .catch(function(error){
            console.log(error);
              if(error.message === "Request failed with status code 401")
                  {
                       swal("Your session is expired! Please login again.","", "error");
                       this.props.history.push("/");
                  }
          });
  }
  getBlockData(block_id){
    axios
      .get("/api/blocks/get/"+block_id)
      .then((response)=>{
        // console.log("componentDidMount  ReceiveProps===>",response.data);
        this.setState({
          parsed :{
                  blockTitle     : response.data.blockTitle,
                  blocksubTitle  : response.data.blockSubTitle,
                  // blockBody    : response.data.,
                  componentName  : response.data.blockComponentName,
                  blockType      : response.data.blockType,
                  fgImage        : response.data.fgImage,
                  bgImage        : response.data.bgImage,
                  bgVideo        : response.data.bgVideo,
                  fgVideo        : response.data.fgVideo,

                  blockDescription      : response.data.blockDescription,
                  block_id      : block_id
            }
          
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });

  }
componentWillReceiveProps(nextProps){
	  var block_id= nextProps.block_id;  
    axios
      .get("/api/blocks/get/"+block_id)
      .then((response)=>{
        // console.log("componentWillReceiveProps===>",response.data);
        this.setState({
            parsed :{
              			blockTitle 	     : response.data.blockTitle,
              			blocksubTitle    : response.data.blockSubTitle,
              			// blockBody		: response.data.,
              			componentName	   : response.data.blockComponentName,
              			blockType			   : response.data.blockType,
              			fgImage 			   : response.data.fgImage,
              			bgImage 			   : response.data.bgImage,
              			bgVideo 			   : response.data.bgVideo,
              			fgVideo				   : response.data.fgVideo,
                    repetedGroup     : response.data.repeatedBlocks,
              			blockDescription : response.data.blockDescription,
                    repGBlockTitle   : response.data.repeatedBlocks.Title,
                    repGBlocksubTitle: response.data.repeatedBlocks.SubTitle,
                    repetedLink      : response.data.repeatedBlocks.Link,
                  },
      			block_id			   : block_id,
            blockTitle       : response.data.blockTitle,
            blocksubTitle    : response.data.blockSubTitle,
            // blockBody    : response.data.,
            componentName    : response.data.blockComponentName,
            blockType        : response.data.blockType,
            fgImage          : response.data.fgImage,
            bgImage          : response.data.bgImage,
            bgVideo          : response.data.bgVideo,
            fgVideo          : response.data.fgVideo,
            repetedGroup     : response.data.repeatedBlocks,
            blockDescription : response.data.blockDescription,
            repGBlockTitle   : response.data.repeatedBlocks.Title,
            repGBlocksubTitle: response.data.repeatedBlocks.SubTitle,
            repetedLink      : response.data.repeatedBlocks.Link,
            imgbPath         : {
                                   "path"    : response.data.fgImage,
                                },
            imgbackPath      : {
                                  "path"    : response.data.bgImage,
                                },
          
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });
  }
  UpdateBlockInfo(event){
	    console.log("in up");
			event.preventDefault();
  		var formValues = {
  			blockTitle 			   :  this.state.blockTitle, 	
  			blockSubTitle		   :  this.state.blocksubTitle, 	
  			blockDescription   :  this.state.blockDescription, 
  			blockType			     :  this.state.blockType,
  			blockComponentName :  this.state.componentName,		
        fgImage            :  this.state.imgbPath.path,
        bgImage            :  this.state.bgImage,
        repeatedBlocks     :  this.state.repetedGroup,   	
  		};
		console.log("formValues=blocks>",formValues);
		axios
			.patch('/api/blocks/patch/'+this.state.block_id,formValues)
		  	.then(function (response) {
		    // handle success
		    	// console.log(response);
		    	window.location.reload();
		    	
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
   		/*console.log("formValues =>",formValues);*/
  } 
  uploadforeGImg(event){
    console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        this.setState({
          uploadedImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                console.log('Data.location', Data.location);
              this.setState({
                imgbPath : {
                  "path"    : Data.location,
                }
              })
          })
          .catch((error)=>{
            console.log(error);
          })
        })
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
              imgbPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  uploadforeGImg(event){
    console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        this.setState({
          uploadedbackImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                console.log('Data.location', Data.location);
              this.setState({
                imgbPath : {
                  "path"    : Data.location,
                }
              })
          })
          .catch((error)=>{
            console.log(error);
          })
        })
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
              imgbPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }

  uploadbackGImg(event){
    // console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        this.setState({
          uploadedImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                console.log('Data.location', Data.location);
              this.setState({
                imgbackPath : {
                  "path"    : Data.location,
                }
              })
          })
          .catch((error)=>{
            console.log(error);
          })
        })
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
              imgbackPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  uploadrepetGImg(event){
    console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        this.setState({
          uploadedImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                console.log('Data.location', Data.location);
              this.setState({
                rbPath : {
                  "path"    : Data.location,
                }
              })
          })
          .catch((error)=>{
            console.log(error);
          })
        })
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
              rbPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  uploadBlogImage(event){
   event.preventDefault();
   let self = this;
   if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var newFileName = JSON.parse(JSON.stringify(new Date()))+"_"+file.name;
      var newFile = new File([file],newFileName);
      // console.log("file",newFile);
      if (newFile) {
      // console.log("config--------------->",this.state.config);
        var ext = newFile.name.split('.').pop();
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
          if (newFile) {
            S3FileUpload
              .uploadFile(newFile,this.state.config)
              .then((Data)=>{
                
                  var obj1={
                    imgPath : Data.location,
                  }
                  var imgArrayWSaws = this.state.imgArrayWSaws;
                  imgArrayWSaws.push(obj1);
                  this.setState({
                    // workspaceImages : imgArrayWSaws
                    blog1Img : imgArrayWSaws
                  })
              })
              .catch((error)=>{
                console.log("formErrors");
                console.log(error);
              })

          }else{         
            swal("File not uploaded","Something went wrong","error"); 
          }
        }else{
          swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","warning");  
        }
      }
    }
  }

  deleteBlockimage(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this image?",
          text: "Once deleted, you will not be able to recover this image!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("Your image is deleted!");
              this.setState({
                imgbPath : ""
              })
            } else {
            swal("Your image is safe!");
          }
        });
  }
  deleteBlockimage(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this image?",
          text: "Once deleted, you will not be able to recover this image!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("Your image is deleted!");
              this.setState({
                imgbackPath : ""
              })
            } else {
            swal("Your image is safe!");
          }
        });
  }  
  deleteRGBlockimage(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this image?",
          text: "Once deleted, you will not be able to recover this image!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("Your image is deleted!");
              this.setState({
                rbPath : ""
              })
            } else {
            swal("Your image is safe!");
          }
        });
  }
  deleteimageWS(e){
    e.preventDefault();
    var index = e.target.getAttribute('id');
    var filePath = e.target.getAttribute('data-id');
    var data = filePath.split("/");
    var imageName = data[4];
    console.log("imageName==",imageName);

    if(index){
      swal({
            title: "Are you sure you want to delete this image?",
            text: "Once deleted, you will not be able to recover this image!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              var array = this.state.imgArrayWSaws; // make a separate copy of the array
              array.splice(index, 1);
              swal("Image deleted successfully");
              this.setState({
                imgArrayWSaws: array
              });
            }else {
              swal("Your image is safe!");
            }
          });
    }
  }
  onclickEvent(){
  	this.setState({
  	      			groupRepetedBlocks:true
  	      		});
  }
editReDBlock(event){
   var id = event.target.id;
    console.log("id od index------",id);
    for (var i = 0; i < this.state.repetedGroup.length; i++) {
      if (this.state.repetedGroup[i]._id === id) {
        console.log("=====>>>>>>",this.state.repetedGroup[i]);
        this.setState({
              repGBlockTitle      : this.state.repetedGroup[i].Title,
              repGBlocksubTitle   : this.state.repetedGroup[i].SubTitle,
              repetedLink         : this.state.repetedGroup[i].Link,
              repBlockContent     : this.state.repetedGroup[i].Description, 
              rep_idEdit          : id,           
              rbPath              : {
                                      "path"    : this.state.repetedGroup[i].Image,
                                    }

        });
      }
    }
}

    render() {
      console.log("in cmsblock");

        return (
        		<div className=" padd1520">
                    <div className="create-basic-block-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="modalBlockHeading">
                            <h1 className="ctext text-center">Create Block</h1>     
                        </div>
                        <form className="newTemplateForm">  
            							<div className="">
            							  { this.state.parsed.blockTitle === ""
        											? null
        											: 
              								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
              											<div className="form-group">
              												<label className="label-category">Block Title<span className="astrick"></span></label>
              												<input type="text" ref="blockTitle" id="basicBlockName" value={this.state.blockTitle} name="blockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)}/>
              											</div>
              								</div>
            								}
            								{ this.state.parsed.blocksubTitle === ""
        											? null
        											:
            								    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            										    <div className="form-group">
            										   		<label className="label-category">Sub Title<span className="astrick"></span></label>
            										        <input type="text" ref="blocksubTitle" id="blocksubTitle" value={this.state.blocksubTitle} name="blocksubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)}/>
            										    </div>
            								    </div>
            								}
            							</div>
            							{/*<div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">*/}
                           
  			                    	{ this.state.parsed.blockType === ""
            											? null
            											: 
                    								<div className="col-lg-6 NOpadding">
          			                    	<div className="">
                                          <div>
                                                <label htmlFor="email">Block Type<span className="redFont">*</span></label>
                    					                    	<div className="dropdown col-lg-12 nopadd">
                    					                    		  <select className="form-control" id="sel1" ref="blockType" value={this.state.blockType} onChange={this.handleChange.bind(this)} >
                            			  								        <option>HomePage</option>
                            			  								        <option>Blog</option>
                            			  								        <option>About Us</option>
                            			  								        <option>Services</option>
                            			  								        <option>Contact Us</option>
                            			  								    </select>
                            					              </div>
                                            </div>
              			                  </div>
              			                </div>
            					          }
            			          {/*</div>*/}
              							<div className="row ">
              								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              { this.state.parsed.blockDescription === ""
                                ? null
                                :
                                  <div>
              								      <label className="label-category">Block Description<span className="astrick"></span></label>
              								      {/*<textarea className="form-control" rows="5" id="comment"></textarea>*/}
              								      {/*<textarea  ref="blockBody" id="blockBody" name="blockBody" value={this.state.blockBody} className="subject bcolor col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="6" onChange={this.handleChange.bind(this)}/>*/}
              								      <div className="">
              		                      <CKEditor
              		                        data={this.state.blockDescription}
              		                        onChange={this.onEditorChange.bind(this)} 
                                        
                                          />
              		                      </div>
                                  </div>
                                }
              								</div>
              							</div>

{/*============================================================================================*/}
{/*====================================== Related Group Block==================================*/}							
{/*============================================================================================*/}
							
              							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m20">
                            {
                              this.state.parsed.RepetedBlock === ""
                                ? null
                                :
                      								<button type="button" className="btn  btn-lg mbottm20" onClick={this.onclickEvent.bind(this)}>
                      									Create Repeated Group <i className="fa fa-sort-desc" aria-hidden="true"></i>
                      								</button>
                            }
              								{ 
              									this.state.groupRepetedBlocks === true 
              										?
              										<div className="col-lg-12 col-md-12 repGBlock">
                                  
              											<div className="row ">
              														{ this.state.parsed.rBlocksTitle === ""
              															? null
              															:
                    												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    															<div className="form-group">
                    																<label className="label-category">Repeated Block Title<span className="astrick"></span></label>
                    																<input type="text" ref="repGBlockTitle" id="repGBlockTitle" value={this.state.repGBlockTitle} name="repGBlockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handle1Change.bind(this)} />
                    															</div>
                    												</div>
              														}
              												    { this.state.parsed.rBlocksSubTitle === ""
              															? null
              															:
                    												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    														    <div className="form-group">
                    														   		<label className="label-category">Repeated Sub Title<span className="astrick"></span></label>
                    														        <input type="text" ref="repGBlocksubTitle" id="repGBlocksubTitle" value={this.state.repGBlocksubTitle} name="repGBlocksubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handle1Change.bind(this)}/>
                    														    </div>
                    												</div>
              														}
              											</div>
              											<div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
              							              { this.state.parsed.rBlocksLink === ""
                                            ? null
                                            :
                                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadd">
                      												    <div className="form-group">
                      												   		<label className="label-category">Repeated Link<span className="astrick"></span></label>
                      										        		<input type="text" ref="repetedLink" id="repetedLink" value={this.state.repetedLink} name="repetedLink"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handle1Change.bind(this)}/>
                      												    </div>
                      												</div>
                                          }
                                          { this.state.parsed.rBlocksImage ===  ""
                                            ? null
                                            :
              												        <div className="col-lg-6">
              							                    	<label htmlFor="email">Repeated Block Image<span className="redFont">*</span></label>
              							                    	<div className="col-lg-12 nopadd">
              							                    	    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              							                                <div className="" id="fileuploadelem">
              							                                	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              								                                    
              									                                    <div className="form-group">
              										                                    {/*<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Block Image:</label>*/}
              										                                    <input type="file" ref="rBImage" id="rBImage" name="rBImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadrepetGImg.bind(this)} />
              									                                    </div>
              								                                	
              							                                	</div>
              							                                </div>
              							                            </div> 
              							                            <div className="col-lg-6 col-md-6 col-xs-12  col-sm-2 ">
                  										                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                  										                        { this.state.rbPath!=="" && this.state.rbPath.path 
                  										                        	? 
                  										                          	<div>
                  										                            	<label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteRGBlockimage.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                  										                            	<img src={this.state.rbPath.path} width="150" height="100"/>
                  										                          	</div>
                  										                          	: 
                  										                          	<div> </div>
                  										                        }
                  										                    </div>
              														              </div>
              							                      	</div>
              							                    </div>
                                              }
              							                </div>
                                            { this.state.parsed.rBlocksDescription === ""
                                             ? null
                                             :
                        											<div className="row  marginTop17">
                        												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                        												    <label className="label-category marginTop17">Block Content<span className="astrick"></span></label>
                        												    {/*<textarea className="form-control" rows="5" id="comment"></textarea>*/}
                        												    {/*<textarea  ref="blockBody" id="blockBody" name="blockBody" value={this.state.blockBody} className="subject bcolor col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="6" onChange={this.handleChange.bind(this)}/>*/}
                        												    <div className="">
                								                      <CKEditor
                								                        data={this.state.repBlockContent}
                								                        onChange={this.onEditorChangeINGroupBlock.bind(this)} />
                								                    </div>
                        												</div>
                        											</div>
                                            }
                                            {
                                              this.state.rep_idEdit
                                              ?
                                                <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updtaeRepBlockInfo.bind(this)}>Update</button>
                                              :
              	                                <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitRepBlockInfo.bind(this)}>Submit</button>
                                            }
              										       </div>
              										      : null
              								         }
              	                		<div className="col-lg-12">
              	                		  	{/*console.log("repetedGroup =>",this.state.repetedGroup)*/}
              	                		{
                    											this.state.repetedGroup && this.state.repetedGroup.length>0?
                    											this.state.repetedGroup.map((data, index)=>{
                    												// console.log("re===>",data);
              												return(
              						          				<div className="col-lg-4 Allblog" key={index}>
              						          					{
              				                					data ? 
              							          					<div className="All1block1">
                    															<img className="img-responsive AllblockImgB" src={data.Image ? data.Image:" "} alt="Bannerpng"/>
                    															<div className="middle">
                                                      <i className="fa fa-pencil rclr hoverbbk" onClick={this.editReDBlock.bind(this)} id={data._id}></i>    
                    															    <i className="fa fa-trash rclr hoverbbk" ></i>{/*id={this.state.repetedGroup.blogURL} onClick={this.deleteopReDBlock.bind(this)}*/}
                    															</div>
                    															<a href={"/block/"+data.Link}>
                    															{/*<p className="blogDate p10 mtop20 graycolor">{this.state.repetedGroup.createdAt}</p>*/}
                    															<h3 className="blockTitle p10"><b>{data.Title}</b></h3>
                    															<h4 className="blockTitle p10"><b>{data.SubTitle}</b></h4>
                    															<p className="blockPara p10 graycolor" dangerouslySetInnerHTML={ { __html: data.Description } }></p>
                    															</a>
                    														</div>
              													      :
              						          					null
              			            							}	
              						          				</div>
              						          				)
              											})
              										:
              										null
              									}
              			          			</div> 	
              							</div>

{/*=============================================================================================*/}
{/*====================================== /Related Group Block==================================*/}							
{/*=============================================================================================*/}							

                        	<div className="row  ">
	                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                <div className="" id="fileuploadelem">
	                                	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                  { this.state.parsed.fgImage === ""
                    											? null
                    											: 
			                                    <div className="form-group">
				                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Block foreground Image:</label>
				                                    <input type="file" ref="foreGImage" id="foreGImage" name="foreGImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadforeGImg.bind(this)} />
			                                    </div>
		                                	}
	                                	</div>
	                                </div>
  		                            <div className="col-lg-6 col-md-6 col-xs-12  col-sm-2 marginTop17">
  										
  					                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
  					                        { this.state.imgbPath!=="" && this.state.imgbPath.path ? 
  					                          <div>
  					                            <label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteBlockimage.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
  					                            <img src={this.state.imgbPath.path} width="150" height="100"/>
  					                          </div>
  					                          : <div> </div>
  					                        }
  					                        </div>
  					                      
  									              </div>
	                            </div>
	                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                <div className="row " id="fileupload">
		                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    <div className="form-group">
		                                    	{ this.state.parsed.bgImage === ""
                													? null
                													:
                													<div>
					                                   	<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Image:</label>{/**/}
					                                    <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadbackGImg.bind(this)}  />
			                                  		</div>
			                                  	}
		                                    </div>
		                                </div>
	                                </div>
	                              	<div className="col-lg-6">
										                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
  					                        { this.state.imgbackPath!=="" && this.state.imgbackPath.path ? 
  					                          <div>
  					                            <label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteBlockimage.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
  					                            <img src={this.state.imgbackPath.path} width="150" height="100"/>
  					                          </div>
  					                          : <div> </div>
  					                        }
					                         </div>
									                </div>
	                            </div>
                            </div>
                         
                          	<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                          	{ this.state.block_id 
	                          		?
	                            	<button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.UpdateBlockInfo.bind(this)}>Update</button>
	                          		:
	                            	<button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.submitcmsBlockInfo.bind(this)}>Submit</button>
	                          	}
                          	</div>
							
                        </form>
                      </div>
                	</div>
				
            
        );
    }
}

export default withRouter(CmsBlock);