import React from 'react';
import {Route, withRouter,Redirect} from 'react-router-dom';
import $                  from 'jquery';

import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/collapse.js';
import './Createnewpage.css';

export default class Createnewpage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			"UrlId" 				:  "",			
			"pageUrl"				: "",
			"pageTitle"				: "",
			"pageType"				: "",
			"componentName"			: "",
			"URL"					: "",
			"designPattern"			: "",
			"pageHeadKeyWords"		: "",
			"pageHeadDescription"	:"",
			"pageHeadAuther"		:"",
			"ListOfPages"			:"",
			"ListOfPageTypes"		:"",
			"pagetype"				:"",

			"buttonText"			:"Submit",

		};
	}
handleChange(event){
		event.preventDefault();
		this.setState({
       		
			/*"cmspageDescription" 			: this.refs.cmspageDescription.value,*/
			"pageTitle"						: this.refs.pageTitle.value,
			"pageUrl"						: this.refs.pageTitle.value.toLowerCase().split(" ").join("-"),
			
			"pageHeadKeyWords"				: this.refs.pageHeadKeyWords.value,
			"pageHeadDescription"			: this.refs.pageHeadDescription.value,
			"pageHeadAuther"				: this.refs.pageHeadAuther.value,
			});
}
selectpageType(event){
		event.preventDefault();
		this.setState({
       		
			/*"cmspageDescription" 			: this.refs.cmspageDescription.value,*/
			"pagetype"						: this.refs.pagetype.value,
			
			});
}


componentDidMount(){
	axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
   /* $.validator.addMethod("regxtypeofCenter", function(value, element, regexpr) {        
      return regexpr.test(value);
    }, "Please enter valid Sub-Activity Name.");
	*/
		var pageUrl = window.location.pathname;
		// console.log("pageUrl = ",pageUrl);
		let a = pageUrl ? pageUrl.split('/') : "";
        console.log("a==>",a); 
        const URL =a[3];
        this.setState({
		      			URL:URL
		});
		axios
      .get("/api/pages/get/"+URL)
      .then((response)=>{
        console.log("=selected page data==>",response.data);
        this.setState({
        	"pageTitle"						: response.data.pageTitle,
			"pageUrl"						: response.data.pageURL,
			"pagetype"						: response.data.pageType,
			"pageHeadKeyWords"				: response.data.pageHead.pageWords,
			"pageHeadDescription"			: response.data.pageHead.pageDescription,
			"pageHeadAuther"				: response.data.pageHead.pageAuthor,
			"UrlId"							: URL,
         
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });

	{/*    $("#newTemplateForm").validate({
      rules: {
        basicPageName: {
          required: true,
        }, 
       /* unit: {
          required: true,
        },
        activityName: {
          required: true,
        },
        subActivityName: {axios
      .get("/api/pages/get/"+URL)
      .then((response)=>{
        console.log("=selected page data==>",response.data);
        this.setState({
        	"pageTitle"						: response.data.pageTitle,
			"pageUrl"						: response.data.pageURL,
			"pagetype"						: response.data.pageType,
			"pageHeadKeyWords"				: response.data.pageHead.pageWords,
			"pageHeadDescription"			: response.data.pageHead.pageDescription,
			"pageHeadAuther"				: response.data.pageHead.pageAuthor,
			"UrlId"							: URL,
         
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });
          required: true,
          regxtypeofCenter: /^[A-za-z']+( [A-Za-z']+)*$/,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") === "basicPageName"){
          error.insertAfter("#pageTitle");
        }
       /* if (element.attr("name") === "activityName"){
          error.insertAfter("#activityNameError");
        }
        if (element.attr("name") === "unit"){
          error.insertAfter("#unitError");
        }
        if (element.attr("name") === "subActivityName"){
          error.insertAfter("#subActivityNameError");
        }
      }
    });*/}
    
	this.getListOfPages();
	this.getListOfPageType();

}

	getListOfPageType(){
		axios
			.get('/api/typemaster/get/list')
			.then((response)=>{    
				console.log("response",response.data);    
			      	this.setState({
		      			ListOfPageTypes:response.data
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

	}
	getListOfPages(){
	/*/get/list*/
		axios
			.get('/api/pages/get/list')
			.then((response)=>{    
				console.log("response",response.data);    
			      	this.setState({
		      			ListOfPages:response.data
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
}
    
deletePage(event){
	event.preventDefault();
	var URL= event.target.id;
	// console.log("id delet", URL);
	 swal({
  
          title: "Are you sure you want to delete this Page ?",
          text: "Once deleted, you will not be able to recover this Page!",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
            	axios
			    .delete("/api/pages/delete/"+URL)
			    .then((response)=>{
			     	this.getListOfPages();
			       swal("Your Page is deleted!");
			       // window.location.reload();
			       this.setState({
						pageTitle : "",
						pageURL: "",
						pageWords : "",
						pageDescription: "",
						pageAuthor : "",
					}) 
			    })
			    .catch((error)=>{
			       console.log("error = ", error);              
			    });
            
              
            } else {
            swal("Your page is safe!");
          }
        }); 
}	
editPage(event){
	event.preventDefault();
	var URL= event.target.id;
    axios
      .get("/api/pages/get/"+URL)
      .then((response)=>{
        console.log("=selected page data==>",response.data);
        this.setState({
        	"pageTitle"						: response.data.pageTitle,
			"pageUrl"						: response.data.pageURL,
			"pagetype"						: response.data.pageType,
			"pageHeadKeyWords"				: response.data.pageHead.pageWords,
			"pageHeadDescription"			: response.data.pageHead.pageDescription,
			"pageHeadAuther"				: response.data.pageHead.pageAuthor,
			"UrlId"							: URL,
         
        });
      })
      .catch((error)=>{
         console.log("error = ", error);              
      });

}
updatePageData(){
	

 const formValues = {
   
				"pageTitle"				: this.refs.pageTitle.value,
				"pageType"				: this.refs.pagetype.value,
				"pageURL"				: this.refs.pageUrl.value,
				"pageWords"				: this.refs.pageHeadKeyWords.value,
				"pageDescription"		: this.refs.pageHeadDescription.value,
				"pageAuthor"			: this.refs.pageHeadAuther.value,
   };
   // console.log("t=-=-=-=-",this.state.UrlId);
	// console.log(".formValues",formValues);
    axios
          .patch('/api/pages/patch/'+this.state.UrlId,formValues)
          .then((res)=>{
                      // swal(" Your page update successfully ");
                       this.props.history.push("/cms/addnewblockonpage/"+this.state.UrlId);
                      // return <Redirect to={"/cms-pages/cms-page-2/"+this.state.UrlId} />

                  })
                  .catch((error)=>{
                    console.log("error = ", error);
                  });

      	this.setState({
				pageTitle : "",
				pageURL: "",
				pageWords : "",
				pageDescription: "",
				pageAuthor : "",
			}) 


}
submitData(){
/*	if($('#newTemplateForm').valid()){*/
		var AttachmentValues = {    
					  	// "componentName"			: this.state.pageDesigns ? this.state.pageDesigns.componentName : null,
     					// "pagediscription" 		: this.refs.cmspageDescription.value,
						"pageTitle"				: this.refs.pageTitle.value,
						"pageURL"				: this.refs.pageUrl.value,
						"pageWords"				: this.refs.pageHeadKeyWords.value,
						"pageDescription"		: this.refs.pageHeadDescription.value,
						"pageAuthor"			: this.refs.pageHeadAuther.value,
						"pageType"				: this.refs.pagetype.value,
						// "pageimage"				: this.state.imgPath ? this.state.imgPath : null,
      					// "pagebackgroundimage"			: this.state.backImgPath ? this.state.backImgPath : null,
      
   		}
   		// console.log("AttachmentValues",AttachmentValues);
   		if (
   			( this.refs.pageTitle.value != "") &&
   			( this.refs.pageUrl.value != "" ) &&
   			( this.refs.pageHeadKeyWords.value != "" ) &&
   			( this.refs.pageHeadDescription.value != "" ) &&
   			( this.refs.pageHeadAuther.value != "" ) &&
   			( this.refs.pagetype.value != "--Select Page type--" )

   		 ) {
				axios
				.post('/api/pages/post',AttachmentValues)
			  	.then((response)=>{
			  		if (response.data) {
			  			// console.log("response.data",response.data.message);
			  			if (response.data.message == "Page Title already exists") {
			   				swal(" Page Title already exists, Please change the Page Title ");
			  			}else{
			    			this.props.history.push("/cms/addnewblockonpage/"+response.data.pageURL);/*+response.data.pageURL*/
			  			}

			  		}
			    // handle success
			   		// console.log("response.data.pageURL",response.data.pageURL);
			   		// swal(" Your page Created successfully ");
			  	})
			  	.catch(function (error) {
			    
			    	console.log(error);
			  	});
		 }else{
			   		swal(" please fill all fields correctly ");

		 }

   		// console.log("AttachmentValues =>",AttachmentValues);
   /*	}*/
}
urlPage(event){
	var id = event.target.id;
	this.props.history.push("/cms/masterpage/"+id);/*+response.data.pageURL*/
		    	/* window.location.reload();*/


}
	render() {
		return (
			<div className="CreatenewpageWraper">
				
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 newpage1stpart nopadding">
						<div className="logopageleftImg">
                          	<img src="/images/Logo.png" alt="" className="intro_img"  width="100" />
                    	</div>
						<div className="pageleftImg1">
                          	<img src="/images/Selected_Pages.png" alt="" className="intro_img"  width="350" />
                    	</div>
                    	<h2 className="text-center whtclr"><b>LETS START BUILDING <br/>YOUR PAGE</b></h2>

					</div>
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
						<div className="cnpTitle ">
							<div className="col-lg-11 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12">
								<h2>{ this.state.URL ? "Update Your "+this.state.URL+" Page"   :"Create New Page"}</h2>
							</div>
						</div>
						
						<div className="col-lg-offset-1 col-lg-10 col-md-12 col-xs-12 col-sm-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<h3>Header Information</h3>
							</div>
					        	{/*<div className="lineHr"></div>*/}
                        	<form className="newTemplateForm" id="newTemplateForm">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group m3all" id="pageType">
                                       <div className="form-group">
										      	<label className="label-category lb666 labelform">Select Page Type</label>
										      	<div className="input-group ipspanht form-group">
											      	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-list-alt"></i></div>
											      	<select className="form-control fromcontrolheight" id="pagetype"  value={this.state.pagetype} ref="pagetype" name="pagetype"  onChange={this.selectpageType.bind(this)}>
	                                                <option  selected>--Select Page type--</option>
	                                                { this.state.ListOfPageTypes  && this.state.ListOfPageTypes.length ?
	                                                	this.state.ListOfPageTypes.map((result,index)=>{
	                                                		return(

											        			<option value={result.facility}>{result.facility}</option>
	                                                			)
	                                                	})
	                                                	:
	                                                	""
	                                                }
											       
											      	</select>
											      	{/*<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-user"></i></div>*/}

										    
										    	</div>
										    </div>
                                    </div>
                                </div>
                                <div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all" id="pageTitle">
	                                    	<label className="label-category lb666 labelform">Page Title<span className="astrick"> </span></label>
	                                   		<div className="input-group ipspanht form-group">
									      		<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-credit-card"></i></div>
	                                	        <input type="text" ref="pageTitle" value={this.state.pageTitle} id="basicPageName" name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} />
	                                    	
	                                    	</div>
	                                    </div>
	                                </div>
	                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all">
	                                    	<label className="label-category lb666 labelform">Page URL<span className="astrick"></span></label>
	                                    	<div className="input-group ipspanht form-group">
											<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-globe"></i></div>
	                                        	<input type="text" ref="pageUrl" id="basicPageName" value={this.state.pageUrl} name="basicPageName" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} disabled/>
	                                    	</div>
	                                    </div>
	                                </div>
	                            </div>
	                            
	                                
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group m3all">
                                    	<label className="label-category lb666 labelform">Keywords<span className="astrick"></span></label>
                                        <div className="input-group ipspanht form-group">
									 	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-text-background"></i></div>
                                        	<input type="text" ref="pageHeadKeyWords" value={this.state.pageHeadKeyWords} id="pageHeadKeyWords" name="pageHeadKeyWords"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} />
                                    	</div>
                                    </div>
                                </div>
	                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                <div className="form-group m3all">
	                                    <label className="label-category lb666 labelform">Author<span className="astrick"></span></label>
										<div className="input-group ipspanht form-group">
									      	<div className="input-group-addon ipdivht"><i className="glyphicon glyphicon-user"></i></div>	                                    
	                            	        <input type="text" ref="pageHeadAuther" id="pageHeadAuther" value={this.state.pageHeadAuther} name="pageHeadAuther"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid fromcontrolheight form-control" onChange={this.handleChange.bind(this)} />
	                                	</div>
	                                </div>
	                            </div>
                            	
                            	<div className="row inputrow">
	                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                  <div className="form-group m3all">
	                                   <label className="label-category lb666 labelform">Description<span className="astrick"></span></label>
	                                        <textarea ref="pageHeadDescription" value={this.state.pageHeadDescription} id="pageHeadDescription" name="pageHeadDescription"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12   form-control" rows="4" onChange={this.handleChange.bind(this)} />
	                                  </div>
	                                </div>
                            	</div>
                        
	                        	<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                            { this.state.UrlId
		                            	?
	                           				<button  type="button" className="CNPBtnnewPage btn pull-right sendtxtmsgbtn" onClick={this.updatePageData.bind(this)} >Update</button>
		                            	:
	                            			<button  type="button" className="CNPBtnnewPage btn pull-right sendtxtmsgbtn" onClick={this.submitData.bind(this)} >CREATE PAGE -></button>
		                            }
		                        </div>
	                        </form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
