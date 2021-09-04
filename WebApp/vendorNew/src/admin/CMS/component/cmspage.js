import React, { Component } from 'react';
/*import { render } 						from 'react-dom';*/
import S3FileUpload from 'react-s3';
import "./css/cmspage.css";
import axios from 'axios';
const config = {
        
      }
/*import { withTracker } 					from 'meteor/react-meteor-data';
import swal 							from 'sweetalert';*/

/*import Header 							from "/imports/CMS/common/Header/Header.jsx";
import Footer 							from "/imports/CMS/common/Footer/Footer.jsx";
import Sidebar 							from "/imports/CMS/common/Sidebar/Sidebar.jsx";*/

/*import CKEditor from "react-ckeditor-component";*/

class Cmspage extends Component{
	constructor(props){
		super(props);
		var id = this.props.id;
			
		
		this.state = {
			UrlId 				:  "",
			"uploadedImage" 		: [],
      		"imgPath"				: "",
      		"backImgPath"			: "",
      		"videoPath"			: "",
      		"backVideoPath"		: "",
      		"pagedesignmastersID" : id,
			"cmspageDescription": "",
			"pageUrl"			: "",
			"pageTitle"			: "",
			"pageType"			: "",
			"componentName"		: "",

			"designPattern"		: "",
			"pageHeadKeyWords"	: "",
			"pageHeadDescription":"",
			"pageHeadAuther"	:"",

			"buttonText"		:"Submit",

		};
			
		
			/*var urlParam1 = window.location.pathname;
			console.log("urlParam",urlParam1);
			let a1 = urlParam1.split('/');
        	console.log("a   =   =>",a1[2]);*/
	}
	componentDidMount(){

		const inputData = axios
        .get('/api/pagedesignmasters/'+this.state.pagedesignmastersID)
		  	.then(response=> {

		  	   let data = response.data;
		  	 
		  	   
		  	   console.log("this.state.UrlId   ===>",this.state.UrlId);
		  	   this.setState({
        			"pageDesigns" : data,
       			});

		    // handle success
		    	console.log("here data",this.state.pageDesigns);
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	
	this.setState({
		"UrlId" : "",

	});	
	
	}

	handleChange(event){
		event.preventDefault();
		this.setState({
			/*
				  componentName               : reqData.componentName,
                    pageurl                     : reqData.pageurl ,
                    designpattern               : reqData.designpattern,
                    pageimage                   : reqData.pageimage,
                    pagebackgroundimage         : reqData.pagebackgroundimage,
                    pagevideo                   : reqData.pagevideo,
                    pagebackgroundvideo         : reqData.pagebackgroundvideo,
                    
                 

			*/
       		
			"cmspageDescription" 			: this.refs.cmspageDescription.value,
			"pageTitle"						: this.refs.pageTitle.value,
			"pageUrl"						: this.refs.pageTitle.value.toLowerCase().split(" ").join("-"),
			
			"pageHeadKeyWords"				: this.refs.pageHeadKeyWords.value,
			"pageHeadDescription"			: this.refs.pageHeadDescription.value,
			"pageHeadAuther"				: this.refs.pageHeadAuther.value,
			});
	}
    	
submitData(){
	var AttachmentValues = {    
					  	"componentName"			: this.state.pageDesigns ? this.state.pageDesigns.componentName : null,
     					"pagediscription" 		: this.refs.cmspageDescription.value,
						"pagetitle"				: this.refs.pageTitle.value,
						"pageurl"				: this.refs.pageUrl.value,
						"pagekeyword"			: this.refs.pageHeadKeyWords.value,
						"pagediscription"		: this.refs.pageHeadDescription.value,
						"pageauthor"			: this.refs.pageHeadAuther.value,
						"pageimage"				: this.state.imgPath ? this.state.imgPath : null,
      					"pagebackgroundimage"			: this.state.backImgPath ? this.state.backImgPath : null,
      
   		}
   		axios
			.post('/api/cmspages',AttachmentValues)
		  	.then(function (response) {
		    // handle success
		    	console.log(response);
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

   		console.log("AttachmentValues =>",AttachmentValues);

}
uploadpageImage(event){
    console.log("upload =",event.target.files[0]);
    this.setState({
      uploadedImage: event.target.files[0]
    },()=>{
    	console.log("uploadToS3 =",this.state.uploadedImage);
    	 S3FileUpload
      .uploadFile(this.state.uploadedImage, config)
      .then((Data)=>{
        console.log(Data);
        console.log("===>",Data.location);
        this.setState({
        	imgPath:Data.location
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    })
  }
  uploadpageBackImage(event){
    console.log("upload =",event.target.files[0]);
    this.setState({
      uploadedImage: event.target.files[0]
    },()=>{
    	console.log("uploadToS3 backgroundImage =",this.state.uploadedImage);
    	 S3FileUpload
      .uploadFile(this.state.uploadedImage, config)
      .then((Data)=>{
        console.log(Data);
        console.log("backgroundImage ===>",Data.location);
        this.setState({
        	backImgPath:Data.location
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    })
  }
uploadpageVideo(event){
    console.log("upload =",event.target.files[0]);
    this.setState({
      uploadedImage: event.target.files[0]
    },()=>{
    	console.log("uploadToS3 =",this.state.uploadedImage);
    	 S3FileUpload
      .uploadFile(this.state.uploadedImage, config)
      .then((Data)=>{
        console.log(Data);
        console.log("===>",Data.location);
        this.setState({
        	videoPath:Data.location
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    })
  }
  uploadpageBackVideo(event){
    console.log("upload =",event.target.files[0]);
    this.setState({
      uploadedImage: event.target.files[0]
    },()=>{
    	console.log("uploadToS3 backgroundImage =",this.state.uploadedImage);
    	 S3FileUpload
      .uploadFile(this.state.uploadedImage, config)
      .then((Data)=>{
        console.log(Data);
        console.log("backgroundImage ===>",Data.location);
        this.setState({
        	backVideoPath:Data.location
        })
      })
      .catch((error)=>{
        console.log(error);
      })
    })
  }
render(){
/*		var actionOnForm = FlowRouter.current();
		console.log("actionOnForm",actionOnForm);
		if(actionOnForm.path.startsWith("/admin/createPage/editPage/")){
			var pageIdurl = FlowRouter.getParam('id');
			
			this.state.buttonText = "Update";	
		}
		*/

		return( 	
				<div className="box-body1">
                    <div className="create-basic-block-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                     	<form className="newTemplateForm"> 
                         	<div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                  <div className="ctext">
                                   <label ><h2 >Enter Page Data</h2></label>
                                  </div>
                                </div>
                            </div> 
                            <div className="row inputrow">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <div className="form-group mtop22">
                                   <label className="label-category ">Selected Page Design &nbsp;:&nbsp;
                                   	{this.state.pageDesigns ? this.state.pageDesigns.componentName : null}
	                                   
                                   
                                   </label>
                                  </div>
                                </div>
                                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                  <img src={this.state.pageDesigns ? this.state.pageDesigns.designImage : null} className="img-responsive" width="300" height="100" />
                                  </div>
                                </div>
                            </div> 
                        </form>
                        <label className="label-category ltitlle"><h3>Page Head</h3></label>
                        <div className="headContent">
                        	<form className="newTemplateForm">
                        		<div className="row inputrow">
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                  <div className="form-group">
	                                   <label className="label-category">KeyWords<span className="astrick"></span></label>
	                                        <input type="text" ref="pageHeadKeyWords" value={this.state.pageHeadKeyWords} id="pageHeadKeyWords" name="pageHeadKeyWords"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
	                                  </div>
	                                </div>
                            	</div>
                            	<div className="row inputrow">
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                  <div className="form-group">
	                                   <label className="label-category">Description<span className="astrick"></span></label>
	                                        <textarea ref="pageHeadDescription" value={this.state.pageHeadDescription} id="pageHeadDescription" name="pageHeadDescription"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" rows="2" onChange={this.handleChange.bind(this)} />
	                                  </div>
	                                </div>
	                                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                  <div className="form-group">
	                                   <label className="label-category">Author<span className="astrick"></span></label>
	                                        <input type="text" ref="pageHeadAuther" id="pageHeadAuther" value={this.state.pageHeadAuther} name="pageHeadAuther"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
	                                  </div>
	                                </div>
                            	</div>
                        	</form>
                        </div>
                        <label className="label-category ltitlle"><h3>Page Body</h3></label>
                        <div className="bodyContent">{/*Body Content*/}
                            <form className="newTemplateForm"> 
	                            <div className="row inputrow">
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group">
	                                    	<label className="label-category">Page Title<span className="astrick"> </span></label>
	                                        <input type="text" ref="pageTitle" value={this.state.pageTitle} id="basicPageName" name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
	                                    </div>
	                                </div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group">
	                                    	<label className="label-category">Page URL<span className="astrick"></span></label>
	                                        <input type="text" ref="pageUrl" id="basicPageName" value={this.state.pageUrl} name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} disabled/>
	                                    </div>
	                                </div>
	                            </div>
	                            <div className="row inputrow">
	                                
	                            </div>
	                            <div className="row inputrow">
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                <label className="label-category">Page Content<span className="astrick"> </span></label>
		                                {/*<textarea class="form-control" rows="5" id="comment"></textarea>*/}
		                                <textarea  ref="cmspageDescription" id="basicPageBody" name="basicPageBody" value={this.state.cmspageDescription} className="subject bcolor col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="6" onChange={this.handleChange.bind(this)}/>
	                                </div>
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                </div>
	                            </div>
	                            <div className="row inputrow ">
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="" id="fileuploadelem">
		                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    	<div className="row">
			                                      	<div className="form-group col-lg-6">
			                                       		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Page Image</label>
			                                        	<input type="file" ref="basicPageImage" id="basicPageImage" name="basicPageImage"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadpageImage.bind(this)}/>
			                                        </div>
			                                        <div className="col-lg-6">
			                                        {/*<img alt="selected design" src={this.state.imgPath ? this.state.imgPath : null} width="150" height="100"/>*/}
			                                        	{ this.state.imgPath!=="" ? 
							                                			<img alt="Selected design" src={this.state.imgPath} width="150" height="100"/>
							                                			: <div> </div>
							                            }
				                                        {/*{
				                                        	this.props.pageDetailsfromID ?
				                                        	this.props.pageDetailsfromID.pageimage ?
				                                        	<img src={this.props.pageDetailsfromID.pageimage}className="img-responsive" width="150" height="100"/>:null
				                                        	:null
				                                        }*/}

									               		 
									                </div>
								                </div> 
		                                    </div>
	                                    </div>
		                                <div className="row inputrow imgId">
		                                    <div className="col-lg-6 col-md-6 outerImgDiv">
		                                        {/*<i  id={this.state.ImgId} className="fa fa-times pull-right" aria-hidden="true"></i>*/}
		                                        {/*<img src={this.state.value} className="imgData" />*/}
		                                    </div>
		                                </div>
		                            </div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                	<div className="" id="fileuploadelem">
	                                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    	<div className="row">
			                                      	<div className="form-group col-lg-6">
			                                       		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Image</label>
			                                        	<input type="file" ref="backgroundImage" id="backgroundImage" name="backgroundImage"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadpageBackImage.bind(this)}/>
			                                        </div>
			                                        <div className="col-lg-6">
			                                        	{/*<img alt="selected design" src={this.state.backImgPath ? this.state.backImgPath : null} width="150" height="100"/>*/}
			                                        	{ this.state.backImgPath!=="" ? 
							                                			<img alt="Selected design" src={this.state.backImgPath} width="150" height="100"/>
							                                			: <div> </div>
							                            }
			                                        	{/*{
				                                        	this.props.pageDetailsfromID ?
				                                        	this.props.pageDetailsfromID.backimage ?
				                                        	<img src={this.props.pageDetailsfromID.backimage}className="img-responsive" width="150" height="100"/>:null
				                                        	:null
			                                        	}*/}
									               		 
									                </div>
								                </div> 
	                                    	</div>
	                                  	</div>
		                                <div className="row inputrow imgId">
		                                    <div className="col-lg-6 col-md-6 outerImgDiv">
		                                      {/*<i  id={this.state.ImgId} className="fa fa-times pull-right" aria-hidden="true"></i>*/}
		                                      {/*<img src={this.state.value} className="imgData" />*/}
		                                    </div>
		                                </div>
	                                </div>
	                            </div>
	                            <div className="row inputrow ">
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="" id="fileuploadelem">
	                                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    		<div className="row">
			                                      	<div className="form-group col-lg-6">
			                                       		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Page Video</label>
			                                        	<input type="file" ref="video" id="video" name="video"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadpageVideo.bind(this)}/>
			                                        </div>
			                                        <div className="col-lg-6">
									               		 
									                </div>
							                	</div> 
	                                    	</div>
	                                  	</div>
	                                  	<div className="row inputrow imgId">
	                                    	<div className="col-lg-6 col-md-6 outerImgDiv">
	                                      		{/*<i  id={this.state.ImgId} className="fa fa-times pull-right" aria-hidden="true"></i>*/}
	                                      		{/*<img src={this.state.value} className="imgData" />*/}
	                                    	</div>
	                                  	</div>
	                                </div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                  	<div className="" id="fileuploadelem">
		                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                    	<div className="row">
			                                      	<div className="form-group col-lg-6">
			                                       		<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Background Video</label>
			                                        	<input type="file" ref="bgvideo" id="bgvideo" name="bgvideo"   className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12" onChange={this.uploadpageBackVideo.bind(this)}/>
			                                        </div>
			                                        <div className="col-lg-6">
									               		 
									                </div>
								                </div> 
		                                    </div>
	                                  	</div>
		                                <div className="row inputrow imgId">
		                                    <div className="col-lg-6 col-md-6 outerImgDiv">
		                                      	{/*<i  id={this.state.ImgId} className="fa fa-times pull-right" aria-hidden="true"></i>*/}
		                                      	{/*<img src={this.state.value} className="imgData" />*/}
		                                    </div>
		                                </div>
	                                </div>
	                            </div>
                        	</form>
                        </div>
                        <div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={() => this.submitData()} >{this.state.buttonText}</button>
                        </div>
                    </div> 
	            </div>
					
			);

	}
}

export default Cmspage;