import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
import {Route, withRouter} from 'react-router-dom';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import swal from 'sweetalert';
import Switch from "react-switch";
import './cmsblock.css';
import {imageCompressor} from '../imageCompression/imageCompression.js'

import Select from 'react-select';

import Compressor from 'compressorjs';
const Compress = require('compress.js');
const queryString = require('query-string');

const options = [
  { value: 'fade', label: 'Fade' },
  { value: 'flip', label: 'Flip' },
  { value: 'cube', label: 'Cube' },
  { value: 'coverflow', label:'Coverflow'},
  { value: 'keyboard control', label:'Keyboard Control'},
  { value: 'autoplay', label: 'Autoplay' },
]; 

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

class CmsBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
           	tempRepBlock_id         : "",
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
            Block_id              : "",
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

            rep_fgImage 			    : "",
            rep_bgImage 			    : "",
            rep_bgVideo 			    : "",
            rep_fgVideo 			    : "",
            rbBgImgPath           : "",
            rbFgImgPath           : "",
            rFgvideobPath         : "",
            rBgvideobPath         : "",
            animationSettings     : false,
            showDots              : false,
            showNextPrevArrow     : false,
            swipeable             : true,
            draggable             : false,
            infinite              : true,
            autoPlaySpeed         : 1000,
            block_on_page         : "",
            pageURL               : "",
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
            },            
        };
        

		    this.onEditorChange = this.onEditorChange.bind( this );
    }
    
  selectHandleChange = effect => {
    this.setState({ effect });
    // console.log(`Option selected:`, effect);
  };

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
        [event.target.name]:event.target.value  

       // 		"blockTitle"       :  this.refs.blockTitle.value ,
			    // "blocksubTitle"    :  this.refs.blocksubTitle.value ,
			    // "blockType"		     : this.refs.blockType.value ,
       //    "pageType"         : this.refs.pageType.value ,
			    // "componentName"		 : this.state.parsed.componentName,
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

/*	
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
	}  */
  submitRepBlockInfo(event){
    event.preventDefault();
    var ArrayRepetedGroup = this.state.repetedGroup;
    var formValues = {
         
        "repeatedBlocks": [     
                            {
                              Title       : this.state.repGBlockTitle,
                              SubTitle    : this.state.repGBlocksubTitle,
                              Link        : this.state.repetedLink,
                              Description : this.state.repBlockContent,
                              Image       : this.state.rbPath.path,   
                              Video       : this.state.rvideobPath.path,
                              BgImage     : this.state.rbBgImgPath.path,
                              FgImage     : this.state.rbFgImgPath.path?this.state.rbFgImgPath.path:null,
                              BgVideo     : this.state.rBgvideobPath.path,
                              FgVideo     : this.state.rFgvideobPath.path,                                                          
                            }
                          ],
        "block_id": this.state.tempRepBlock_id ? this.state.tempRepBlock_id : null

    };
                      console.log("formValues in page=",formValues);

              axios
                .post('/api/repetedblock/post', formValues)

                .then((response)=>{
                      // console.log("data in page=",response.data);
                      if (response) {
                        this.listOfRepBlock(response.data.ID)
                        this.setState({
                              tempRepBlock_id:response.data.ID,
                              groupRepetedBlocks : false
                          },()=>{
                              console.log("tempRepBlock_id=blocks>",this.state.tempRepBlock_id);
                             
                          })
                              this.state.repGBlockTitle = "";
                              this.state.repGBlocksubTitle = "";
                              this.state.repetedLink = "";
                              this.state.repBlockContent = "";
                              this.state.rbPath.path = "";
                              this.state.rvideobPath.path = "";

                              this.state.rbBgImgPath.path="";
                              this.state.rbFgImgPath.path="";
                              this.state.rBgvideobPath.path="";
                              this.state.rFgvideobPath.path="";
                              this.state.animationSettings="";
                              this.state.BgImage="";
                              this.state.FgImage="";
                              this.state.BgVideo="";
                              this.state.FgVideo="";
                      }
                     
                })
                .catch(function(error){
                      console.log(error);
                        
                })
  }

  listOfRepBlock(tempRepBlock_id){
    // event.preventDefault();
    console.log("tempRepBlock_id",tempRepBlock_id);
        // .get('/api/pages/get/list')
     axios
        .get('/api/repetedblock/get/'+tempRepBlock_id)     
        .then((response)=>{    
          console.log("response",response.data);    
                this.setState({
                  repetedGroup:response.data.repeatedBlocks,
                },()=>{
                  console.log("repetedGroup==ll",this.state.repetedGroup);
                });
          })
          .catch(function (error) {
          // handle error
            console.log(error);
          });

  }

  updtaeRepBlockInfo(event){
    event.preventDefault();
        console.log('this.state.repetedGroup',this.state.rep_idEdit)
    if (this.state.block_id){       
          var formValues= {
            _id : this.state.rep_idEdit,
            Title          : this.state.repGBlockTitle,
            SubTitle       : this.state.repGBlocksubTitle,
            Link           : this.state.repetedLink,
            Description    : this.state.repBlockContent,
            Image          : this.state.rbPath.path, 
            Video          : this.state.rvideobPath.path, 

            BgImage     : this.state.rbBgImgPath.path,
            FgImage     : this.state.rbFgImgPath.path,
            BgVideo     : this.state.rBgvideobPath.path,
            FgVideo     : this.state.rFgvideobPath.path,
            animationSettings : this.state.animationSettings,
          }
          console.log("Update repelated block===",formValues);
        axios
        .patch('/api/blocks/patch/repblock/'+this.state.block_id,formValues)     
        .then((response)=>{    
          console.log("response",response.data);   
           
           this.getBlockData(this.state.block_id)

                this.setState({
                              groupRepetedBlocks : false
                  
                });
                this.state.repGBlockTitle = "";
                this.state.repGBlocksubTitle = "";
                this.state.repetedLink = "";
                this.state.repBlockContent = "";
                this.state.rbPath.path = "";
                this.state.rvideobPath.path = "";

                this.state.rbBgImgPath.path="";
                this.state.rbFgImgPath.path="";
                this.state.rBgvideobPath.path="";
                this.state.rFgvideobPath.path="";
                this.state.animationSettings="";
                this.state.BgImage="";
                this.state.FgImage="";
                this.state.BgVideo="";
                this.state.FgVideo="";
                swal("Block updated successfuly");

          })
          .catch(function (error) {
          // handle error
            console.log(error);
          });
        }
        
        else{
          var formValues= {
            _id : this.state.rep_idEdit,
            Title          : this.state.repGBlockTitle,
            SubTitle       : this.state.repGBlocksubTitle,
            Link           : this.state.repetedLink,
            Description    : this.state.repBlockContent,
            Image          : this.state.rbPath.path, 
            Video          : this.state.rvideobPath.path, 

            BgImage        : this.state.rbBgImgPath.path,
            FgImage        : this.state.rbFgImgPath.path,
            BgVideo        : this.state.rBgvideobPath.path,
            FgVideo        : this.state.rFgvideobPath.path,
            animationSettings : this.state.animationSettings,
          }
        axios
        .patch('/api/repetedblock/patch/'+this.state.tempRepBlock_id,formValues)     
        .then((response)=>{    
          console.log("response",response.data);   
           this.listOfRepBlock(this.state.tempRepBlock_id)

                this.setState({
                              groupRepetedBlocks : false
                  
                },()=>{
                 
                });
          })
          .catch(function (error) {
          // handle error
            console.log(error);
          });
        }
        // console.log('array',array);
       // this.listOfRepBlock(response.data.ID)
        
  }
/*
  updtaeRepBlockInfo(event){
    event.preventDefault();
        console.log('this.state.repetedGroup',this.state.rep_idEdit)
    if (this.state.rep_idEdit){
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
*/
	submitcmsBlockInfo(event){
		event.preventDefault();		
    var urlParam = this.state.urlParam;

		var formValues = {
  		blockTitle 			   : this.state.blockTitle,
  		blockSubTitle 		 : this.state.blocksubTitle,
  		blockDescription 	 : this.state.blockDescription,
  		blockComponentName : this.state.componentName,
  		blockType 			   : this.state.blockType,
      pageType           : this.state.pageType,
  		fgImage 			     : this.state.imgbPath ? this.state.imgbPath.path: "",
  		bgImage 			     : this.state.imgbackPath ? this.state.imgbackPath.path: "" ,
      bgVideo            : this.state.videobPath ? this.state.videobPath.path: "" ,
      fgVideo            : this.state.videoFGPath ? this.state.videoFGPath.path: "" ,
      repeatedBlocks 		 : this.state.repetedGroup,	
      
		};

    if(this.state.componentName === 'Banner'){
      formValues.animationSettings = {
        showDots          : this.state.showDots,
        swipeable         : this.state.swipeable,
        draggable         : this.state.draggable,
        infinite          : this.state.infinite,
        autoPlaySpeed     : this.state.autoPlaySpeed,
        showNextPrevArrow : this.state.showNextPrevArrow,
        effect            : this.state.effect ? this.state.effect.value : '',
      }			
    }
  
		 console.log("formValues=blocks>",formValues);
      			
	


    // console.log("formValues=urlParam>",urlParam);
		axios
			.post('/api/blocks/post',formValues)
		  	.then( (response)=> {
		      if (response.data) {
            var pageformValues = {
              "block_id"        : response.data.ID,                   
              "_id"        : this.state.Block_id,                   

            }
                axios
                .patch('/api/pages/patch/pageaddblocks/'+this.props.urlParam, pageformValues)

                    .then((response)=>{
                      console.log("data in this.props page=",this.props);
                      // this.props.pageAddBlock(urlParam);
                      if (response) {
                        this.props.pageAddBlock(urlParam);                      
                      // this.props.pageAddBlock(urlParam);
                      
                         var modal = document.getElementById("editBlockFormM");
                        modal.style.display = "none";
                        $('.modal-backdrop').remove();
                        $("#editBlockFormM .close").click();
                        // window.location.reload();
                        // this.props.history.push("/cms/view-blocks");
                        swal("Thank you. Your Block is Created.");

                      } 
                        // this.props.pageAddBlock(urlParam);
                        window.location.reload();

                                      /*this.state.blockTitle       = "" ;
                                      this.state.blocksubTitle    = "" ;
                                      this.state.blockDescription = "" ;
                                      this.state.componentName    = "" ;
                                      this.state.blockType        = "" ;
                                      this.state.pageType         = "" ;
                                      this.state.imgbPath.path    = "" ;
                                      this.state.imgbackPath.path = "" ;
                                      this.state.videobPath.path  = "" ;
                                      this.state.videoFGPath.path = "" ;
                                      this.state.repetedGroup     = "" ;
                                      this.state.showDots         = "" ;
                                      this.state.swipeable        = "" ;
                                      this.state.draggable        = "" ;
                                      this.state.infinite         = "" ;
                                      this.state.autoPlaySpeed    = "" ;
                                      this.state.showNextPrevArrow= "" ;*/
                      })                 
                  
                  .catch(function(error){
                      console.log(error);
                        
                  })
  

                  
          }
		    	// console.log("data in block========",response.data);
          

        /*  this.props.pageAddBlock(urlParam);
          var modal = document.getElementById("editBlockFormM");
          modal.style.display = "none";
          $('.modal-backdrop').remove();
          $("#editBlockFormM .close").click();
          window.location.reload();*/
		    	
		    	 
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
        // console.log("response",response.data);    
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
        // console.log("ListOfBlockTypes",response.data);    
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
    var Block_id= this.props.Block_id;
    var block_on_page= this.props.block_on_page;
        // console.log("block_on_page==>",block_on_page); 

    var urlParam= this.props.urlParam;
    /*var pageUrl = window.location.pathname;
    console.log("Block_id = ",Block_id);
    let a = pageUrl ? pageUrl.split('/') : "";
        // console.log("a==>",a[1]); 
        const urlParam =a[3];*/
        this.setState({
                urlParam:urlParam,
                Block_id:Block_id,
                block_on_page:block_on_page
    });
    // console.log("zzzzz  Block_id  zzzzzzz",Block_id);	  
    // console.log("location.search = ",this.props.location.search);
    const parsed = queryString.parse(this.props.location.search);
    console.log("parsed = ",parsed);
    this.getBlockData(block_on_page);
    this.getListOfPageType();
    this.getListOfBlockType();
    this.setState({ 
                    
        Block_id              : Block_id,
        parsed                : parsed,
        componentName         : parsed.componentName,
        
    });

    axios
      .get('/api/projectsettings/get/S3')
      .then((response)=>{
        // console.log("response S################2333",response);
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : "CMS",
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

  getBlockData(block_on_page){
    if (block_on_page) {
    axios
      .get("/api/blocks/get/"+block_on_page)
      .then((response)=>{
        // console.log("componentDidMount  ReceiveProps===>",response.data);
        this.setState({
        
                  blockTitle     : response.data.blockTitle,
                  blocksubTitle  : response.data.blockSubTitle,
                  blockDescription : response.data.blockDescription,

                  // blockBody    : response.data.,
                  componentName  : response.data.blockComponentName,
                  blockType      : response.data.blockType,
                  pageType       : response.data.pageType,
                  fgImage        : response.data.fgImage,
                  bgImage        : response.data.bgImage,
                  bgVideo        : response.data.bgVideo,
                  fgVideo        : response.data.fgVideo,
                  repetedGroup          : response.data.repeatedBlocks,

                  imgbPath         : {
                                   "path"    : response.data.fgImage,
                                },
                  imgbackPath      : {
                                  "path"    : response.data.bgImage,
                                },

                  block_id      : block_on_page
          
          
        },()=>{
          // console.log("blockDescription cmsblock363",this.state.blockDescription)
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });
    }
  }

  componentWillReceiveProps(nextProps){
	  var Edit_blockType= nextProps.Edit_blockType;
    var blockcomponent= nextProps.blockcomponent;
    var parsed= nextProps.parsed;
    var Block_id= nextProps.Block_id;
    var urlParam= nextProps.urlParam;
    var block_on_page= nextProps.block_on_page;
        // console.log("block_on_page==>",parsed,blockcomponent); 
        // console.log("block_on_page==>",block_on_page); 

    // var pageUrl = window.location.pathname;
    // console.log("Block_id = ",Block_id);
    // let a = pageUrl ? pageUrl.split('/') : "";
    //     // console.log("a==>",a[1]); 
    //     const urlParam =a[3];
        this.setState({
                blockType:Edit_blockType,
                componentName:blockcomponent,
                urlParam:urlParam,
                Block_id:Block_id,
                parsed:parsed,
                block_on_page:block_on_page

    },()=>{
      console.log("Im in cms form 386 ",this.state.componentName,this.state.blockType);
    });
    // console.log("zzzzz  Block_id  zzzzzzz",Block_id);   
    // console.log("zzzzz  Block_id  zzzzzzz",this.props.Block_id);   
    axios
      .get('/api/projectsettings/get/S3')
      .then((response)=>{
        // console.log("response S################33333",response);
        const config = {
                          bucketName      : response.data.bucket,
                          dirName         : "CMS",
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
            // this.props.history.push("/");
          }
      });
    this.getBlockData(block_on_page);

  }
  // =============================================
  UpdateBlockInfo(event){
	    // console.log("in up");
			event.preventDefault();
      var urlParam = this.state.urlParam;
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
      
      if(this.state.componentName === 'Banner'){
        formValues.animationSettings = {
          showDots          : this.state.showDots,
          swipeable         : this.state.swipeable,
          draggable         : this.state.draggable,
          infinite          : this.state.infinite,
          autoPlaySpeed     : this.state.autoPlaySpeed,
          showNextPrevArrow : this.state.showNextPrevArrow,
          effect            : this.state.effect ? this.state.effect.value : '',
        }
      }
		  // console.log("formValues=blocks>",formValues);
		  axios
			  .patch('/api/blocks/patch/'+this.state.block_id,formValues)
		  	.then( (response)=> {
		    // handle success
		    	// console.log(response);
		    	// window.location.reload();
          // swal("Thank you.Your Block is Updated.");
          var modal = document.getElementById("editBlockFormM");
          modal.style.display = "none";
          $('.modal-backdrop').remove();
          $("#editBlockFormM .close").click();
          console.log("this.props",this.props);

          this.props.pageAddBlock(urlParam);
          window.location.reload();

          /*this.state.blockTitle       = "" ;
          this.state.blocksubTitle    = "" ;
          this.state.blockDescription = "" ;
          this.state.blockType        = "" ;
          this.state.pageType         = "" ;
          this.state.componentName    = "" ;
          this.state.imgbPath.path    = "" ;
          this.state.imgbackPath.path = "" ;
          this.state.repetedGroup     = "" ;*/


		    	
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
   		   /*console.log("formValues =>",formValues);*/
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
          videobPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  async uploadforeGImg(event){
    var file = event.target.files[0];
    const files = [...event.target.files];
    var width =  600;
    var height = 400;

    if(file){
      var data =  await imageCompressor(files,this.state.config,width,height)
          this.setState({
            imgbPath : {
              "path"    : data.location,
            }
          })
    }  
  }
  
  uploadrbgVideo(event){
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
                rBgvideobPath : {
                  "path"    : Data.location,
                }
              },()=>{
                  console.log("rBgvideobPath====",this.state.rBgvideobPath);
              })
          })
          .catch((error)=>{
            console.log(error);
          })
        })
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
          rBgvideobPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  uploadrFGVideo(event){
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
                rFgvideobPath : {
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
          rFgvideobPath : {
                "path"    : "",
              }
          }) 
        }
      }else{         
            swal("","Something went wrong","error"); 
          } 
  }
  async uploadbackGImg(event){
    // console.log("upload =",event.target.files[0]);
    var file = event.target.files[0];
    const files = [...event.target.files];
    if(file){
      var data =  await imageCompressor(files,this.state.config)
      console.log("data",data);
          this.setState({
            imgbackPath : {
              "path"    : data.location,
            }
          })
    }else{         
       swal("","Something went wrong","error"); 
    } 
  }

  async uploadrepetBGImg(event){
    const file = event.target.files[0];
    const ext = file.name.split('.').pop();

    const files = [...event.target.files];

    if(file){
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        var data =  await imageCompressor(files,this.state.config)
        console.log("uploadrepetGImg data",data);
        this.setState({
          rbBgImgPath : {
            "path"    : data.location,
          }
        })   
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
          rbBgImgPath : {
                "path"    : "",
              }
          }) 
      }
    }else{         
       swal("","Something went wrong","error"); 
    }
  }
  async uploadrepetFGImg(event){
    const file = event.target.files[0];
    const ext = file.name.split('.').pop();

    const files = [...event.target.files];

    if(file){
      if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){ 
        var data =  await imageCompressor(files,this.state.config)
        console.log("uploadrepetGImg data",data);
        this.setState({
          rbPath : {
            "path"    : data.location,
          }
        })   
      }else{
        swal("Format is incorrect","Only Upload images format (jpg,png,jpeg)","warning"); 
         this.setState({
          rbFgImgPath : {
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
      console.log("id od index------",this.state.repetedGroup);
      console.log("id od index------",id);
      for (var i = 0; i < this.state.repetedGroup.length; i++) {
        if (this.state.repetedGroup[i]._id === id) {
          // console.log("=====>>>>>>",this.state.repetedGroup[i]);
          // console.log("=====>>>>>>",this.state.rBlocksSubTitle);
          this.setState({
                groupRepetedBlocks :  true,
                repGBlockTitle      : this.state.repetedGroup[i].Title,
                repGBlocksubTitle   : this.state.repetedGroup[i].SubTitle,
                repetedLink         : this.state.repetedGroup[i].Link,
                repBlockContent     : this.state.repetedGroup[i].Description, 
                rep_idEdit          : id,    
                BgImage             : this.state.repetedGroup[i].rbBgImgPath,
                FgImage             : this.state.repetedGroup[i].rbFgImgPath,
                BgVideo             : this.state.repetedGroup[i].rBgvideobPath,
                FgVideo             : this.state.repetedGroup[i].rFgvideobPath,       
                rbPath              : {
                                        "path"    : this.state.repetedGroup[i].Image,
                                      },

                rvideobPath         : {
                                        "path"    : this.state.repetedGroup[i].Image,
                                      },


          });
        }
      }
  }

  render() {
    console.log("rep block",this.state)
    const { effect } = this.state;
        return (
        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      {/*<h2 className="text-center">Create Your Block</h2>*/}
                </div>
              </div>
              <div className="boxItem1CBlock">
                <div className="create-basic-block-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="modalBlockHeading">
                        {/*<h1 className="ctext text-center">Create Block</h1>  */}   
                    </div>
                    <form className="newTemplateForm">  
                      <div className="row"> 
                        {/*<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group m3all" id="pageType">
                                <div class="form-group">
                                  <label className="label-category lb666 labelform">Select Page type in which you add this block</label>
                                  <select className="form-control hinput30" id="pageType"  value={this.state.pageType} ref="pageType" name="pageType"  onChange={this.handleChange.bind(this)} required>
                                      <option  selected={true} hidden>--Select Page type--</option>
                                       blockTitle { this.state.ListOfPages  && this.state.ListOfPages.length 
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
                        */}
                      </div>
          							{/**/}
                      
        							  { 
                          /*this.state.parsed ? (this.state.parsed.blockTitle == "blockTitle") : this.state.blockTitle
    											?*/ 
            								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
        											<div className="form-group">
        												<label className="label-category labelform">Block Title<span className="astrick"></span></label>
        												<input type="text" ref="blockTitle" id="blockTitle" value={this.state.blockTitle} name="blockTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} required/>
        											</div>
            								</div>
                            /*: ""*/
        								}

        								{ /*this.state.parsed ? (this.state.parsed.blocksubTitle === "blocksubTitle") : this.state.blocksubTitle
    											
    											?*/
        								    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      										    <div className="form-group">
      										   		<label className="label-category labelform">Sub Title<span className="astrick"></span></label>
      										      <input type="text" ref="blocksubTitle" id="blocksubTitle" value={this.state.blocksubTitle} name="blocksubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} required/>
      										    </div>
        								    </div>
                          /*: ""*/
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
          							
                        {/* this.state.parsed ? (this.state.parsed.blockDescription === "blockDescription") : this.state.blockDescription
                          
                          ?*/
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
                           /*: ""*/
                        }
          							

                        {/*============================================================================================*/}
                        {/*====================================== Repeted Group Block==================================*/}							
                        {/*============================================================================================*/}
					
          							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m20 NOpadding">
                            {/*console.log("this.state.parsed.RepetedBlock",this.state.parsed)*/}
                          { /*this.state.parsed ?
                            this.state.parsed.RepetedBlock === "RepetedBlock" : this.state.RepetedBlock
                              ?*/ 
                                  <div>
                    								<button type="button" className="btn  btn-lg mbottm20" onClick={this.onclickEvent.bind(this)}>
                    									Create Repeated Group <i className="fa fa-sort-desc" aria-hidden="true"></i>
                    								</button>
                                    <label className="label-category labelform">Click here for enter repeted block</label>
                                  </div>
                              /*: ""*/
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
                                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                            <div className="" id="fileuploadelem">
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">                                                            
                                                    <div className="form-group">
                                                      <label htmlFor="email" className="labelform">Repeated Block Background Image<span className="redFont">*</span></label>
                                                      <input type="file" ref="rBImage" id="rBImage" name="rBImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" 
                                                      onChange={this.uploadrepetBGImg.bind(this)} />
                                                    </div>                                                          
                                              </div>
                                            </div>
                                        </div> 
                                        <div className="col-lg-6 col-md-6 col-xs-12  col-sm-2 ">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                              { this.state.rbBgImgPath!=="" && this.state.rbBgImgPath.path 
                                                ? 
                                                  <div>
                                                    <label className="pull-right custFaTimes" title="Delete image"  onClick={this.deleteRGBlockimage.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                                    {/* <picture>
                                                        <source srcset={this.state.rbBgImgPath.path} type="image/webp" width="150" height="100"/>
                                                    </picture> */}

                                                    <img src={this.state.rbBgImgPath.path} width="150" height="100"/>
                                                  </div>
                                                  : 
                                                  <div> </div>
                                              }
                                          </div>
                                        </div>
                                    </div>
                            
                                  }

                                  {
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                                <div className="" id="fileuploadelem">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">
                                                      
                                                        <div className="form-group">
                                                          <label htmlFor="email" className="labelform">Repeated Block Forground Image<span className="redFont">*</span></label>
                                                          
                                                          <input type="file" ref="rFgImage" id="rFgImage" name="rFgImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" 
                                                          onChange={this.uploadrepetFGImg.bind(this)} />
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

                                                        {/* <picture>
                                                            <source srcset={this.state.rbBgImgPath.path} type="image/webp" width="150" height="100"/>
                                                        </picture> */}

                                                        <img src={this.state.rbPath.path} width="150" height="100"/>
                                                      </div>
                                                      : 
                                                      <div> </div>
                                                  }
                                              </div>
                                            </div>
                                        </div>
            
                                  }
                                  { 

                                    // this.state.rvideobPath === ""
                                    // ?
                                    // this.state.rBlocksVideo === "" || this.state.parsed.rBlocksVideo === null
                                    //   ? null
                                    //   :
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                          <div className="row " id="fileupload">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">                                                        
                                                  <div className="form-group">
                                                      <div>
                                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category labelform">Repeated foreground video :</label>{/**/}
                                                        <input type="file" ref="foregroundVideo" id="foregroundImage" name="foregroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" 
                                                        onChange={this.uploadrFGVideo.bind(this)}  />
                                                      </div>
                                                    </div>                                                        
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                            { this.state.rFgvideobPath!=="" && this.state.rFgvideobPath.path ? 
                                              <div>
                                                <label className="pull-right custFaTimes" title="Delete"  onClick={this.deleterBlockvideo.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                                <video controls src={this.state.rFgvideobPath.path} width="150" height="100" type="video/mp4" alt="video"/>
                                              </div>
                                              : <div> </div>
                                            }
                                            </div>
                                          </div>
                                      </div>
                                      </div>
                                      // : ""
                                    }
                                    {
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
                                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                      <div className="row " id="fileupload">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="fileuploadelemrBImage">
                                              
                                              <div className="form-group">
                                                  <div>
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category labelform">Baground Video :</label>{/**/}
                                                    <input type="file" ref="backgroundVideo" id="backgroundVideo" name="backgroundVideo"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" 
                                                    onChange={this.uploadrbgVideo.bind(this)}  />
                                                  </div>
                                                </div>
                                              
                                        </div>
                                      </div>
                                      <div className="col-lg-6">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row">
                                        { this.state.rBgvideobPath!=="" && this.state.rBgvideobPath.path ? 
                                          <div>
                                            <label className="pull-right custFaTimes" title="Delete"  onClick={this.deleterBlockvideo.bind(this)}>X</label>{/*data-id={this.state.imgbPath}*/}
                                            <video controls src={this.state.rBgvideobPath.path} width="150" height="100" type="video/mp4" alt="video"/>
                                          </div>
                                          : <div></div>
                                        }
                                        </div>
                                      </div>
                                  </div>
                                  </div>
                                }
                              
                                     {/* this.state.parsed.blockDescription  */}
                                 
                                        { this.state.Description === "" 
                                         ? null
                                         :
                    											<div className="marginTop17">
                    												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
                    												    <label className="label-category marginTop17 labelform">Block Description<span className="astrick"></span></label>
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
                												console.log("repeated Group===>",data);
          												        return(
          				                					data ? 
          						          				    <div className="col-lg-4 Allblog" key={index}>
            							          					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding All1block1">
                                                {data.Image?
                  															  <img className="img-responsive AllblockImgB" src={data.Image ? data.Image: this.state.repeteddemoimg } alt="Bannerpng"/>
                                                :null}
                                                {data.BgVideo?
                                                <video controls src={data.BgVideo} width="150" height="200" type="video/mp4" alt="video"/>
                                                :null}
                  															<div className="middle">
                                                    <i className="fa fa-pencil rclr hoverbbk pull-right" onClick={this.editReDBlock.bind(this)} id={data._id}></i>    
                  															    {/*<i className="fa fa-trash rclr hoverbbk" ></i>*/}{/*id={this.state.repetedGroup.blogURL} onClick={this.deleteopReDBlock.bind(this)}*/}
                  															</div>
                  															
                  															{/*<p className="blogDate p10 mtop20 graycolor">{this.state.repetedGroup.createdAt}</p>*/}
                  															<h3 className="blockTitle mainblockTitle p10"><b>{data.Title}</b></h3>
                  															<h4 className="subblockTitle p10"><b>{data.SubTitle}</b></h4>
                  															<p className="blockPara p10 graycolor blockDes" dangerouslySetInnerHTML={ { __html: data.Description } }></p>
                  															
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
                        
                    	  <div className="row">
                        {this.state.componentName === 'Banner' ?  

                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 toggleWrapper">                                      
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Banner Settings<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.animationSettings}                                   
                                      onChange={(event) => { this.setState({"animationSettings": this.state.animationSettings===true?false:true}
                                      ,() => {
                                          console.log("animationSettings:",this.state.animationSettings);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"><hr className="hrLine"></hr></div>

                              {this.state.animationSettings === true?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 animationSettings">
                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Show dots<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.showDots}                                   
                                      onChange={(event) => { this.setState({"showDots": this.state.showDots===true?false:true}
                                      ,() => {
                                          console.log("ShowDots:=====",this.state.showDots);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 animationSettings">
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Show Next and Prev Arrows<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.showNextPrevArrow}                                   
                                      onChange={(event) => { this.setState({"showNextPrevArrow": this.state.showNextPrevArrow===true?false:true}
                                      ,() => {
                                          console.log("showNextPrevArrow:",this.state.showNextPrevArrow);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                              </div>

                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Swipeable Effect<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.swipeable}                                   
                                      onChange={(event) => { this.setState({"swipeable": this.state.swipeable===true?false:true}
                                      ,() => {
                                          console.log("swipeable:",this.state.swipeable);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Draggable Effect<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.draggable} 
                                      onChange={(event) => { this.setState({"draggable": this.state.draggable===true?false:true}
                                      ,() => {
                                          console.log("draggable:",this.state.draggable);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                              </div>

                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <div className="form-group ">
                                  <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">Infinite<span className="astrick"></span></label>
                                  <Switch                                                
                                      checked={this.state.infinite}                                   
                                      onChange={(event) => { this.setState({"infinite": this.state.infinite===true?false:true}
                                      ,() => {
                                          console.log("infinite:",this.state.infinite);
                                          })
                                      }}
                                      onColor={'#5CB85C'}
                                      offColor={'#D9534F'}
                                      height={25}
                                      width={60}
                                  />
                              </div>
                              </div>    

                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                  <div className="form-group ">
                                      <label className="label-category labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">Sliding Effect<span className="astrick"></span></label>
                                      <Select
                                        value={effect}
                                        onChange={this.selectHandleChange}
                                        options={options}
                                      />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                  <div className="form-group ">
                                      <label className="label-category labelform col-lg-9 col-md-5 col-sm-5 col-xs-5 NoPadding">AutoPlay Speed<span className="astrick"></span></label>
                                      <input type="text" ref="autoPlaySpeed" id="autoPlaySpeed" defaultValue={this.state.autoPlaySpeed} name="autoPlaySpeed"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" 
                                      onChange={this.handleChange.bind(this)} required/>                                  
                                  </div>
                                </div>
                              </div>
                              </div>:null
                            }
                                      
                        </div>  : null }


                        {/* this.state.parsed ? this.state.parsed.fgImage === "fgImage" : this.state.fgImage 
                            ? */
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <div className="" id="fileuploadelem">
                                  
                              	      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    <div className="form-group">
			                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Foreground Image:</label>
			                                    <input type="file" ref="foreGImage" id="foreGImage" name="foreGImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control" onChange={this.uploadforeGImg.bind(this)} />
		                                    </div>
                                	    </div>
                                	
                              </div>
	                            <div className="col-lg-6 col-md-6 col-xs-12  col-sm-2 ">
									
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
                           /* :""*/
                          }
                          { /*this.state.parsed ? this.state.parsed.bgImage === "bgImage" : this.state.bgImage
                            ? */
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
                            /*:""*/
                          }
                          { this.state.parsed ? this.state.parsed.fgVideo === "fgVideo" : this.state.fgVideo

                            ? 
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
                            :""
                          }
                          { this.state.parsed ?  this.state.parsed.bgVideo === "bgVideo" : this.state.bgVideo

                            ? 
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="" id="fileupload">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        
                                        <div className="form-group">
                                          <div>
                                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Video:</label>{/**/}
                                              <input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 hinput30 form-control"
                                               onChange={this.uploadbgVideo.bind(this)}  />
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
                            :""
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

export default withRouter(CmsBlock);