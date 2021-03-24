import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import CKEditor from 'ckeditor4-react';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import swal from 'sweetalert';
import './cmsblock.css';

const queryString = require('query-string');
class CmsBlockOldV2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
           	uploadedImage         : [],
            imgbPath          	  : {},
            videobPath            : {},
            videoFGPath            : {},
            rvideobPath            : {},
            rbPath          	    : {},
            uploadedbackImage     : [],
            rBImage 			        : "",
            imgbackPath           : {},
      			ListOfPages 	          : "",
            ListOfBlockTypes            : "",
            blockTitle            : "",
      			blocksubTitle         : "",
      			blockBody		          : "",
      			componentName		      : "",
      			blockType			        : "",
            pageType             : "",
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
            repeteddemoimg        : "/images/Back_casting_or_retro_analysis.png",
            parsed                : {
                                    blockTitle          : "",
                                    blocksubTitle       : "",
                                    componentName       : "",
                                    blockType           : "",
                                    fgImage             : "",
                                    bgImage             : "",
                                    bgVideo             : "",
                                    fgVideo             : "",
                                    rBlocksVideo        : "",
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
      // console.log("handleChange===>in Componant===>",this.refs.blockType.value);
    	this.setState({
       		"blockTitle"       : this.state.parsed.blockTitle ? this.refs.blockTitle.value : "",
			    "blocksubTitle"    : this.state.parsed.blocksubTitle ? this.refs.blocksubTitle.value :"",
			    "blockType"		     : this.refs.blockType.value ,
          "pageType"         : this.refs.pageType.value ,
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
        Video       : this.state.rvideobPath.path, 

		};
        swal("Thank you.Your Block is Created.");
            ArrayRepetedGroup.push(formValues);
              this.setState({
			            repetedGroup : ArrayRepetedGroup,
			            groupRepetedBlocks : false
			        },()=>{
			          	// console.log("formValues=blocks>",this.state.repetedGroup);
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
            Video          : this.state.rvideobPath.path, 
          }
        swal("Thank you.Your Block is Updated.");

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
  		blockType 			   : this.state.parsed ? this.state.parsed.blockType : "",
      pageType           : this.state.pageType,
  		fgImage 			     : this.state.imgbPath ? this.state.imgbPath.path: "",
  		bgImage 			     : this.state.imgbackPath ? this.state.imgbackPath.path: "" ,
      bgVideo            : this.state.videobPath ? this.state.videobPath.path: "" ,
      fgVideo            : this.state.videoFGPath ? this.state.videoFGPath.path: "" ,
  		repeatedBlocks 		 : this.state.repetedGroup,				
		};

		console.log("formValues=blocks>",formValues);
		axios
			.post('/api/blocks/post',formValues)
		  	.then( (response)=> {
		  
		    	// console.log("data in block========",response.data);
          this.props.history.push("/cms/view-blocks");
		    	swal("Thank you. Your Block is Created.");
		    	 
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
   		// console.log("formValues =>",formValues);	
	}

  getListOfPageType(){
    axios
      // .get('/api/pages/get/list')
      .get('/api/typemaster/get/list')     
      .then((response)=>{    
        console.log("response",response.data);    
              this.setState({
                ListOfPages:response.data
              },()=>{
                // console.log("ListOfPageslll==ll",this.state.ListOfPages);
              });
        })
        .catch(function (error) {
        // handle error
          console.log(error);
        });

  }

  getListOfBlockType(){
    axios
      .get('/api/blocktypemaster/get/list')
      .then((response)=>{    
        console.log("ListOfBlockTypes",response.data);    
              this.setState({
                ListOfBlockTypes:response.data
              });
        })
        .catch(function (error) {
        // handle error
          console.log(error);
        });

  }
  selectpageType(event){
    event.preventDefault();
    this.setState({
          
      /*"cmspageDescription"      : this.refs.cmspageDescription.value,*/
      "pagetype"            : this.refs.pagetype.value,
      
      });
  }

  componentDidMount(){	
    var block_id= this.props.block_id;
    // console.log("zzzzz  block_id  zzzzzzz",block_id);	  
    // console.log("location.search = ",this.props.location.search);
    const parsed = queryString.parse(this.props.location.search);
    console.log("parsed = ",parsed);
    this.getBlockData(block_id);
    this.getListOfPageType();
    this.getListOfBlockType();
    this.setState({ 
                    
        block_id              : block_id,
        parsed                : parsed
        
    });

    axios
      .get('/api/projectsettings/get/S3')
      .then((response)=>{
        // console.log("response",response);
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : "truU",
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
                  pageType       : response.data.pageType,
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
                    pageType         : response.data.pageType,
              			fgImage 			   : response.data.fgImage,
              			bgImage 			   : response.data.bgImage,
              			bgVideo 			   : response.data.bgVideo,
              			fgVideo				   : response.data.fgVideo,
                    rBlocksVideo     : response.data.rBlocksVideo,
                    repetedGroup     : response.data.repeatedBlocks,
              			blockDescription : response.data.blockDescription,
                    repGBlockTitle   : response.data.repeatedBlocks.Title,
                    repGBlocksubTitle: response.data.repeatedBlocks.SubTitle,
                    repetedLink      : response.data.repeatedBlocks.Link,
                    RepetedBlock     : response.data.repeatedBlocks.Title === "" || response.data.repeatedBlocks.SubTitle === "" ? response.data.repeatedBlocks.Title : "",
                  },
      			block_id			   : block_id,
            blockTitle       : response.data.blockTitle,
            blocksubTitle    : response.data.blockSubTitle,
            // blockBody    : response.data.,
            componentName    : response.data.blockComponentName,
            blockType        : response.data.blockType,
            pageType         : response.data.pageType,
            fgImage          : response.data.fgImage,
            bgImage          : response.data.bgImage,
            bgVideo          : response.data.bgVideo,
            fgVideo          : response.data.fgVideo,
            rBlocksVideo     : response.data.rBlocksVideo,
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
        pageType           :  this.state.pageType,
  			blockComponentName :  this.state.componentName,		
        fgImage            :  this.state.imgbPath.path,
        bgImage            :  this.state.imgbackPath.path,
        repeatedBlocks     :  this.state.repetedGroup, 

  		};
		  // console.log("formValues=blocks>",formValues);
		  axios
			  .patch('/api/blocks/patch/'+this.state.block_id,formValues)
		  	.then(function (response) {
		    // handle success
		    	// console.log(response);
        swal("Thank you.Your Block is Updated.");

		    	window.location.reload();
		    	
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
   		   /*console.log("formValues =>",formValues);*/
  } 
  uploadforeGImg(event){
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
                // console.log('Data.location', Data.location);
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

  uploadFgVideo(event){
    console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="mp4" || ext=="3gp" || ext=="avi" || ext=="flv" ||  ext=="MP4" || ext=="3GP" || ext=="AVI" || ext=="FLV"){ 
        this.setState({
          uploadedbackImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                console.log('Data.location', Data.location);
              this.setState({
                videoFGPath : {
                  "path"    : Data.location,
                }
              },()=>{
                console.log("videoFGPath",this.state.videoFGPath);
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

  uploadbgVideo(event){
    // console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="mp4" || ext=="3gp" || ext=="avi" || ext=="flv" ||  ext=="MP4" || ext=="3GP" || ext=="AVI" || ext=="FLV"){ 
        this.setState({
          uploadedbackImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                // console.log('Data.location', Data.location);
              this.setState({
                videobPath : {
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

  uploadrbgVideo(event){
    // console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="mp4" || ext=="3gp" || ext=="avi" || ext=="flv" ||  ext=="MP4" || ext=="3GP" || ext=="AVI" || ext=="FLV"){ 
        this.setState({
          uploadedbackImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
           S3FileUpload
            .uploadFile(file,this.state.config)
            .then((Data)=>{
                // console.log('Data.location', Data.location);
              this.setState({
                rvideobPath : {
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
                // console.log('Data.location', Data.location);
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
    // console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    if(file){
      var ext = file.name.split('.').pop();
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        this.setState({
          uploadedImage: event.target.files[0]
          },()=>{
          console.log("uploadToS3 =",this.state.uploadedImage);
          console.log("this.state.config =",this.state.config);
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

  deleteBlockvideo(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this Video?",
          text: "Once deleted, you will not be able to recover this Video!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("Your Video is deleted!");
              this.setState({
                videobPath : ""
              })
            } else {
            swal("Your Video is safe!");
          }
        });
  }

  deleterBlockvideo(event){
    event.preventDefault();
    swal({
          title: "Are you sure you want to delete this Video?",
          text: "Once deleted, you will not be able to recover this Video!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
              swal("Your Video is deleted!");
              this.setState({
                videobPath : ""
              })
            } else {
            swal("Your Video is safe!");
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
    // console.log("imageName==",imageName);

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
    event.preventDefault();
      var id = event.target.id;
      console.log("id od index------",id);
      for (var i = 0; i < this.state.repetedGroup.length; i++) {
        if (this.state.repetedGroup[i]._id === id) {
          console.log("=====>>>>>>",this.state.repetedGroup[i]);
          console.log("=====>>>>>>",this.state.rBlocksSubTitle);
          this.setState({
                groupRepetedBlocks :  true,
                repGBlockTitle      : this.state.repetedGroup[i].Title,
                repGBlocksubTitle   : this.state.repetedGroup[i].SubTitle,
                repetedLink         : this.state.repetedGroup[i].Link,
                repBlockContent     : this.state.repetedGroup[i].Description, 
                rep_idEdit          : id,           
                rbPath              : {
                                        "path"    : this.state.repetedGroup[i].Image,
                                      },

                rvideobPath         : {
                                        "path"    : this.state.repetedGroup[i].Image,
                                      }

          });
        }
      }
  }

  render() {
    console.log("this.state.parsed",this.state);
        return (
        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <h2 className="text-center">Create Your Block</h2>
                </div>
              </div>
              <div className="boxItem1CBlock">
                <div className="create-basic-block-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="modalBlockHeading">
                        {/*<h1 className="ctext text-center">Create Block</h1>  */}   
                    </div>
                    <form className="newTemplateForm">  
                      <div className="row"> 
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group m3all" id="pageType">
                                <div class="form-group">
                                  <label className="label-category lb666 labelform">Select Page type in which you add this block</label>
                                  <select className="form-control hinput30" id="pageType"  value={this.state.pageType} ref="pageType" name="pageType"  onChange={this.handleChange.bind(this)} required>
                                      <option  selected={true} hidden>--Select Page type--</option>
                                        { this.state.ListOfPages  && this.state.ListOfPages.length 
                                          ?
                                            this.state.ListOfPages.map((result,index)=>{
                                             
                                            return(
                                                    <option value={result.facility}>{result.facility}</option>
                                                )
                                              })
                                          :
                                            ""
                                          }
                                   
                                  </select>
                                
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <div className="form-group m3all" id="pageType">
                                  <div class="form-group">
                                    <label className="label-category lb666 labelform">Select Block Type </label>
                                      {console.log("this.state.parsed.blockType",this.state.parsed.blockType)}
                                    {
                                      this.state.parsed.blockType ?
                                        <select className="form-control hinput30" id="blockType"   ref="blockType" name="blockType"  disabled>
                                          <option   >{this.state.parsed.blockType}</option>
                                         
                                     
                                        </select>
                                      :
                                       <select className="form-control hinput30" id="blockType"  value={this.state.blockType} ref="blockType" name="blockType"  onChange={this.handleChange.bind(this)}>
                                          <option hidden >--Select Block type--</option>
                                          { this.state.ListOfBlockTypes  && this.state.ListOfBlockTypes.length 
                                            ?
                                              this.state.ListOfBlockTypes.map((result,index)=>{
                                              return(
                                                      <option value={result.facility}>{result.facility}</option>
                                                  )
                                                })
                                            :
                                              ""
                                            }
                                     
                                     </select>

                                    }
                                   
                                  
                                  </div>
                              </div>
                          </div>
                        
                      </div>
          							{/**/}
                      
        							  { this.state.parsed.blockTitle === ""
    											? null
    											: 
            								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
        											<div className="form-group">
        												<label className="label-category labelform">Block Title<span className="astrick"></span></label>
        												<input type="text" ref="blockTitle" id="basicBlockName" value={this.state.blockTitle} name="blockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} required/>
        											</div>
            								</div>
        								}

        								{ this.state.parsed.blocksubTitle === ""
    											? null
    											:
        								    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      										    <div className="form-group">
      										   		<label className="label-category labelform">Sub Title<span className="astrick"></span></label>
      										      <input type="text" ref="blocksubTitle" id="blocksubTitle" value={this.state.blocksubTitle} name="blocksubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} required/>
      										    </div>
        								    </div>
        								}
        							
        							 {/*<div className="formcontent col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">*/}
                       
		                    	{ /*this.state.parsed.blockType === ""
        											? null
        											: 
                								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
      			                    	<div className="">
                                      <div>
                                            <label htmlFor="email" className="labelform">Block Type<span className="redFont">*</span></label>
                					                    	<div className="dropdown col-lg-12 nopadd">
                					                    		  <select className="form-control hinput30" id="sel1" ref="blockType" value={this.state.blockType} onChange={this.handleChange.bind(this)} >
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
        					          */}
        			           {/*</div>*/}
          							
                        { this.state.parsed.blockDescription === "" 
                            ? null
                            :
          								  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                              <div>
          								      <label className="label-category labelform">Block Description<span className="astrick"></span></label>
          								      {/*<textarea className="form-control" rows="5" id="comment"></textarea>*/}
          								      {/*<textarea  ref="blockBody" id="blockBody" name="blockBody" value={this.state.blockBody} className="subject bcolor col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="6" onChange={this.handleChange.bind(this)}/>*/}
          								      <div className="">
          		                      <CKEditor
          		                        data={this.state.blockDescription}
          		                        onChange={this.onEditorChange.bind(this)} 
                                    
                                      />
          		                      </div>
                              </div>
          								  </div>
                          }
          							

                        {/*============================================================================================*/}
                        {/*====================================== Related Group Block==================================*/}							
                        {/*============================================================================================*/}
					
          							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m20 NOpadding">
                            {/*console.log("this.state.parsed.RepetedBlock",this.state.parsed)*/}
                          {
                            this.state.parsed.RepetedBlock === "" 
                              ? null
                              :
                                  <div>
                    								<button type="button" className="btn  btn-lg mbottm20" onClick={this.onclickEvent.bind(this)}>
                    									Create Repeated Group <i className="fa fa-sort-desc" aria-hidden="true"></i>
                    								</button>
                                    <label className="label-category labelform">Click here for enter repeted block</label>
                                  </div>
                          }
          								{ 
          									this.state.groupRepetedBlocks === true 
          										?
          										<div className="col-lg-12 col-md-12 repGBlock">
                              
          											
      														{ this.state.rBlocksTitle === "" 
      															? null
      															:
            												<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        															<div className="form-group">
        																<label className="label-category labelform">Repeated Block Title<span className="astrick"></span></label>
        																<input type="text" ref="repGBlockTitle" id="repGBlockTitle" value={this.state.repGBlockTitle} name="repGBlockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)} />
        															</div>
            												</div>
      														}
      												    { this.state.rBlocksSubTitle === "" 
                                      ? null
                                      :
                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                          <div className="form-group ">
                                            <label className="label-category labelform">Repeated Sub Title<span className="astrick"></span></label>
                                            <input type="text" ref="repGBlocksubTitle" id="repGBlocksubTitle" value={this.state.repGBlocksubTitle} name="repGBlocksubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)}/>
                                          </div>
                                        </div>                                            
      														}
          											
      							              { 
                                    
                                    this.state.rBlocksLink === "" 
                                    ? null
                                    :
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadd">
              												    <div className="form-group">
              												   		<label className="label-category labelform">Repeated Link<span className="astrick"></span></label>
              										        		<input type="text" ref="repetedLink" id="repetedLink" value={this.state.repetedLink} name="repetedLink"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handle1Change.bind(this)}/>
              												    </div>
              												</div>
                                      
                                  }

                                      { 
                                      
                                        this.state.rbPath.path ===  "" 
                                        ? null
                                        :
          												        <div className="">
          							                    	{/*<label htmlFor="email" className="labelform">Repeated Block Image<span className="redFont">*</span></label>*/}
          							                    	<div className="">
          							                    	    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
          							                                <div className="" id="fileuploadelem">
          							                                	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">
          								                                    
          									                                    <div className="form-group">
                                                                  <label htmlFor="email" className="labelform">Repeated Block Image<span className="redFont">*</span></label>
          										                                    
          										                                    <input type="file" ref="rBImage" id="rBImage" name="rBImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadrepetGImg.bind(this)} />
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
          							               
                                        { 
                                          this.state.rvideobPath === ""
                                          ?
                                          this.state.rBlocksVideo === "" || this.state.parsed.rBlocksVideo === null
                                            ? null
                                            :
                                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <div className="row " id="fileupload">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">
                                                        
                                                        <div className="form-group">
                                                          <div>
                                                              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category labelform">Repeated Video:</label>{/**/}
                                                              <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadrbgVideo.bind(this)}  />
                                                            </div>
                                                         </div>
                                                        
                                                  </div>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                                  { this.state.rvideobPath!=="" && this.state.rvideobPath.path ? 
                                                    <div>
                                                      <label className="pull-right custFaTimes" title="Delete"  onClick={this.deleterBlockvideo.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                                      <video controls src={this.state.rvideobPath.path} width="150" height="100" type="video/mp4" alt="video"/>
                                                    </div>
                                                    : <div> </div>
                                                  }
                                                 </div>
                                                </div>
                                            </div>
                                            : ""
                                          }
                                        { this.state.parsed.blockDescription === "" 
                                         ? null
                                         :
                    											<div className="marginTop17">
                    												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                    												    <label className="label-category marginTop17 labelform">Block Content<span className="astrick"></span></label>
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
          	                		<div className="col-lg-12 repetedViewBlock">
          	                		  	{/*console.log("repetedGroup =>",this.state.repetedGroup)*/}
          	                		{
                											this.state.repetedGroup && this.state.repetedGroup.length>0?
                											this.state.repetedGroup.map((data, index)=>{
                												// console.log("re===>",data);
          												return(
          						          					
          				                					data ? 
          						          				    <div className="col-lg-4 Allblog" key={index}>
            							          					<div className="All1block1">
                  															<img className="img-responsive AllblockImgB" src={data.Image ? data.Image: this.state.repeteddemoimg } alt="Bannerpng"/>
                  															<div className="middle">
                                                    <i className="fa fa-pencil rclr hoverbbk pull-right" onClick={this.editReDBlock.bind(this)} id={data._id}></i>    
                  															    {/*<i className="fa fa-trash rclr hoverbbk" ></i>*/}{/*id={this.state.repetedGroup.blogURL} onClick={this.deleteopReDBlock.bind(this)}*/}
                  															</div>
                  															
                  															{/*<p className="blogDate p10 mtop20 graycolor">{this.state.repetedGroup.createdAt}</p>*/}
                  															<h3 className="blockTitle p10"><b>{data.Title}</b></h3>
                  															<h4 className="blockTitle p10"><b>{data.SubTitle}</b></h4>
                  															<p className="blockPara p10 graycolor" dangerouslySetInnerHTML={ { __html: data.Description } }></p>
                  															
                														  </div>
          						          				    </div>
          													      :
          						          					null
          			            							
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
                        { this.state.parsed.fgImage === "" || this.state.parsed.fgImage === null || this.state.parsed.fgImage === undefined
                            ? null
                            : 
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <div className="" id="fileuploadelem">
                                  
                              	      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    <div className="form-group">
			                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Foreground Image:</label>
			                                    <input type="file" ref="foreGImage" id="foreGImage" name="foreGImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadforeGImg.bind(this)} />
		                                    </div>
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
                          }
                          { this.state.parsed.bgImage === "" || this.state.parsed.bgImage === null || this.state.parsed.bgImage === undefined
                            ? null
                            :
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="row " id="fileupload">
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    	
	                                      <div className="form-group">
                													<div>
					                                   	<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Image:</label>{/**/}
					                                    <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadbackGImg.bind(this)}  />
			                                  		</div>
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
                          }
                          { this.state.parsed.fgVideo === "" || this.state.parsed.fgVideo === null || this.state.parsed.fgVideo === undefined

                            ? null
                            :
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="" id="fileupload">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        
                                        <div className="form-group">
                                          <div>
                                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Foreground Video:</label>{/**/}
                                              <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadFgVideo.bind(this)}  />
                                            </div>
                                         </div>
                                        
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                  { this.state.videoFGPath!=="" && this.state.videoFGPath.path ? 
                                    <div>
                                      <label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteBlockvideo.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                      <video controls src={this.state.videoFGPath.path} width="150" height="100" type="video/mp4" alt="video"/>
                                    </div>
                                    : <div> </div>
                                  }
                                 </div>
                                </div>
                            </div>
                          }
                          { this.state.parsed.bgVideo === "" || this.state.parsed.bgVideo === null || this.state.parsed.bgVideo === undefined

                            ? null
                            :
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="" id="fileupload">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        
                                        <div className="form-group">
                                          <div>
                                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Video:</label>{/**/}
                                              <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadbgVideo.bind(this)}  />
                                            </div>
                                         </div>
                                        
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                  { this.state.videobPath!=="" && this.state.videobPath.path ? 
                                    <div>
                                      <label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteBlockvideo.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                      <video controls src={this.state.videobPath.path} width="150" height="100" type="video/mp4" alt="video"/>
                                    </div>
                                    : <div> </div>
                                  }
                                 </div>
                                </div>
                            </div>
                          }


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
            </div>
				
            
        );
    }
}

export default withRouter(CmsBlockOldV2);