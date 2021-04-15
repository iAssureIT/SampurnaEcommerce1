import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import $                  from 'jquery';

import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/collapse.js';
import './ListOfPages.css';

class ListOfPages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			UrlId 				:  "",
			
			"pageUrl"			: "",
			"pageTitle"			: "",
			"pageType"			: "",
			"componentName"		: "",

			"designPattern"		: "",
			"pageHeadKeyWords"	: "",
			"pageHeadDescription":"",
			"pageHeadAuther"	:"",
			"ListOfPagest"		:"",

			"buttonText"		:"Submit",

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
componentDidMount(){
	axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
   /* $.validator.addMethod("regxtypeofCenter", function(value, element, regexpr) {        
      return regexpr.test(value);
    }, "Please enter valid Sub-Activity Name.");
*/

    $("#newTemplateForm").validate({
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
        subActivityName: {
          required: true,
          regxtypeofCenter: /^[A-za-z']+( [A-Za-z']+)*$/,
        },*/
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
        }*/
      }
    });
    
	this.getListOfPages();

}
getListOfPages(){
	/*/get/list*/
		axios
			.get('http://anashandicraftapi.iassureit.com/api/pages/get/list')
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
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
            if (success) {
            	axios
			    .delete("http://anashandicraftapi.iassureit.com/api/pages/delete/"+URL)
			    .then((response)=>{
			     	this.getListOfPages();
			       swal("Your Page is deleted!");
			       // window.location.reload();
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
      .get("http://anashandicraftapi.iassureit.com/api/pages/get/"+URL)
      .then((response)=>{
        console.log("=selected page data==>",response.data);
        this.setState({
        	"pageTitle"						: response.data.pageTitle,
			"pageUrl"						: response.data.pageURL,
			
			"pageHeadKeyWords"				: response.data.pageHead.pageAuthor,
			"pageHeadDescription"			: response.data.pageHead.pageDescription,
			"pageHeadAuther"				: response.data.pageHead.pageWords,
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
				"pageURL"				: this.refs.pageUrl.value,
				"pageWords"				: this.refs.pageHeadKeyWords.value,
				"pageDescription"		: this.refs.pageHeadDescription.value,
				"pageAuthor"			: this.refs.pageHeadAuther.value,
   };
   console.log("t=-=-=-=-",this.state.UrlId);
	console.log(".formValues",formValues);
    axios
          .patch('http://anashandicraftapi.iassureit.com/api/pages/patch/'+this.state.UrlId,formValues)
          .then((res)=>{
                      swal(" Your page update successfully ");
                       this.props.history.push("/viewpage2/"+this.state.UrlId);

                  })
                  .catch((error)=>{
                    console.log("error = ", error);
                  });

}
submitData(){
	if($('#newTemplateForm').valid()){
		var AttachmentValues = {    
					  	// "componentName"			: this.state.pageDesigns ? this.state.pageDesigns.componentName : null,
     					// "pagediscription" 		: this.refs.cmspageDescription.value,
						"pageTitle"				: this.refs.pageTitle.value,
						"pageURL"				: this.refs.pageUrl.value,
						"pageWords"				: this.refs.pageHeadKeyWords.value,
						"pageDescription"		: this.refs.pageHeadDescription.value,
						"pageAuthor"			: this.refs.pageHeadAuther.value,
						// "pageimage"				: this.state.imgPath ? this.state.imgPath : null,
      					// "pagebackgroundimage"			: this.state.backImgPath ? this.state.backImgPath : null,
      
   		}
   		console.log("AttachmentValues",AttachmentValues);
   		axios
			.post('http://anashandicraftapi.iassureit.com/api/pages/post',AttachmentValues)
		  	.then((response)=>{
		    // handle success
		   		console.log("response",response.data);
		    	this.props.history.push("/viewpage2/"+response.data.pageURL);/*+response.data.pageURL*/
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});

   		// console.log("AttachmentValues =>",AttachmentValues);
   	}
}
urlPage(event){
	var id = event.target.id;
	this.props.history.push("/masterpage/"+id);/*+response.data.pageURL*/
		    	 window.location.reload();


}
	render() {
		// console.log("ListOfPages",this.state.ListOfPages)
		return (
			<div className="box-body1">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 box-body2">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
						<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
							<h2>List Of Pages</h2>
						</div>
						<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
							
					        	<button type="button" className="btn btn-primary pull-right CNPBtn" data-toggle="modal" data-target="#createnewPageModal">Create New Page </button>
					       
						</div>
					</div>
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					    {/*<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Large Modal</button>*/}
						  {/*<!-- Modal -->*/}
						<div className="modal" id="createnewPageModal" role="dialog">
						    <div className="modal-dialog modal-lg mtop70">
						      <div className="modal-content">
						        <div className="modal-header bgBluemodalTitle">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          {<h4 className="modal-title text-center">Enter page details</h4>}
						        </div>
						        <div className="modal-body h315">
						        	<div className="headContent">
						        		<div className="borderBox">
										<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				                        	<form className="newTemplateForm" id="newTemplateForm">
						                        <div className="row inputrow">
					                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					                                    <div className="form-group" id="pageTitle">
					                                    	<label className="label-category lb666">Page Title<span className="astrick">* </span></label>
					                                        <input type="text" ref="pageTitle" value={this.state.pageTitle} id="basicPageName" name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
					                                    </div>
					                                </div>
					                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					                                    <div className="form-group">
					                                    	<label className="label-category lb666">Page URL<span className="astrick"></span></label>
					                                        <input type="text" ref="pageUrl" id="basicPageName" value={this.state.pageUrl} name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} disabled/>
					                                    </div>
					                                </div>
					                            </div>
				                        		
				                            	<div className="row inputrow">
					                                
					                                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					                                  <div className="form-group">
					                                   <label className="label-category lb666">KeyWords<span className="astrick"></span></label>
					                                        <input type="text" ref="pageHeadKeyWords" value={this.state.pageHeadKeyWords} id="pageHeadKeyWords" name="pageHeadKeyWords"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
					                                  </div>
					                                </div>
					                                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					                                  <div className="form-group">
					                                   <label className="label-category lb666">Author<span className="astrick"></span></label>
					                                        <input type="text" ref="pageHeadAuther" id="pageHeadAuther" value={this.state.pageHeadAuther} name="pageHeadAuther"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
					                                  </div>
					                                </div>
				                            	</div>
				                            	<div className="row inputrow">
					                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					                                  <div className="form-group">
					                                   <label className="label-category lb666">Description<span className="astrick"></span></label>
					                                        <textarea ref="pageHeadDescription" value={this.state.pageHeadDescription} id="pageHeadDescription" name="pageHeadDescription"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" rows="4" onChange={this.handleChange.bind(this)} />
					                                  </div>
					                                </div>
				                            	</div>
				                        
					                        	<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
						                            { this.state.UrlId
						                            	?
					                           				<button  type="submit" className="CNPBtn btn pull-right sendtxtmsgbtn" data-dismiss="modal" onClick={() => this.updatePageData()} >Update</button>
						                            	:
					                            			<button  type="submit" className="close" data-dismiss="modal" className="CNPBtn btn pull-right sendtxtmsgbtn" onClick={() => this.submitData()} >Submit</button>
						                            }
						                        </div>
					                        </form>
				                        </div>
				                        </div>
			                        </div>
		                        
						         
						        </div>
						        {/*<div className="modal-footer">
						          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						        </div>*/}
						      </div>
						    </div>
						</div>
					    <div id="NewPageBtn" className="panel-collapse collapse c350" aria-expanded="false">
							      	<div className="panel-body">
							      		{/*<div className="row inputrow">
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
			                            </div>*/}
				                       
							        </div>
					    </div>					
					</div>
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					{/*	<h2 className="text-center">List Of Pages</h2>*/}
						<table className="table">
						  	<thead className="thead-dark">
						    	<tr className="">
							      <th scope="col">No.</th>
							      <th scope="col">Page Title</th>
							      <th scope="col">Page Url</th>
							      <th scope="col">Action</th>
						    	</tr>
						  	</thead>
						    <tbody>
						    {
						    	this.state.ListOfPages 
									?
									this.state.ListOfPages && this.state.ListOfPages.length>0?
										this.state.ListOfPages.map((result, index)=>{
											// console.log('result', result);
											return(
											    <tr key={index}>
											      <td>{index+1}</td>
											      <td >{result.pageTitle}</td>
											      <td id={result.pageURL} className="onHoverClick" onClick={this.urlPage.bind(this)} data-placement="top" title="Click here to view Page">{result.pageURL}</td>
											      <td><i className="fa fa-edit deletIcon" id={result.pageURL} data-toggle="collapse" data-toggle="modal" data-target="#createnewPageModal" onClick={this.editPage.bind(this)} data-placement="top" title="Edit Page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
											      		<i className="fa fa-trash deletIcon" id={result.pageURL} onClick={this.deletePage.bind(this)} data-placement="top" title="Delete page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
											      		{/*<i className="fa fa-eye"></i>*/}
											      </td>
											    </tr>
										    	)
											})
										:
										null
							    	:
									null
							}   
						    </tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(ListOfPages);