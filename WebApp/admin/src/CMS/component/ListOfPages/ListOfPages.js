import React from 'react';
import {Route, withRouter,Redirect} from 'react-router-dom';
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
			"ListOfPages"		:"",
			"ListOfPageTypes"		:"",
			"pagetype"		:"",

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
        subActivityName: {
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
				// console.log("response",response.data);    
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
                       this.props.history.push("/cms/new-page-add-block/"+this.refs.pageUrl.value);
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
   		axios
			.post('/api/pages/post',AttachmentValues)
		  	.then((response)=>{
		  		if (response) {

		    	this.props.history.push("/cms/new-page-add-block/"+response.data.pageURL);/*+response.data.pageURL*/
		  		}
		    // handle success
		   		// console.log("response.data.pageURL",response.data.pageURL);
		   		// swal(" Your page Created successfully ");
		  	})
		  	.catch(function (error) {
		    
		    	console.log(error);
		  	});

   		// console.log("AttachmentValues =>",AttachmentValues);
   /*	}*/
}
urlPage(event){
	var id = event.target.id;
	this.props.history.push("/cms/masterpage/"+id);/*+response.data.pageURL*/
		    	/* window.location.reload();*/


}
	render() {
		// console.log("ListOfPageTypes",this.state.ListOfPageTypes);
		return (
			<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
				<div className=" txtCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
					<div className="  col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <h2 className="text-center"> Your Pages</h2>
                    </div>
                </div>
				<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxItem-LOPages">
						<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							<h2>List Of Pages</h2>
						</div>
						<hr/>
						<div className="">
					
							<table className="table fs14T">
							  	<thead className="thead-dark">
							    	<tr className="">
								      <th scope="col">No.</th>
								      <th scope="col">Page Title</th>
								    
								      <th scope="col">Actions</th>
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
												      {/*<td id={result.pageURL} className="onHoverClick" onClick={this.urlPage.bind(this)} data-placement="top" title="Click here to view Page">{result.pageURL}</td>*/}
												      <td><i className="fa fa-edit deletIcon" id={result.pageURL} data-toggle="collapse" data-toggle="modal" data-target="#createnewPageModal" onClick={this.editPage.bind(this)} data-placement="top" title="Edit Page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
												      		<i className="fa fa-trash deletIcon" id={result.pageURL} onClick={this.deletePage.bind(this)} data-placement="top" title="Delete page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
												      		<i className="fa fa-eye deletIcon"  id={result.pageURL} onClick={this.urlPage.bind(this)} title="View this Page"></i>
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
				<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 boxItem-LOPages2">
						
					    {/*<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Large Modal</button>*/}
					        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					        	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
									<h2>Create New Page here :</h2>
								</div>
					        	{/*<div className="lineHr"></div>*/}
	                        	<form className="newTemplateForm" id="newTemplateForm">
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all" id="pageType">
	                                       <div class="form-group">
											      <label className="label-category lb666 labelform">Select Page Type</label>
											      <select className="form-control hinput30" id="pagetype"  value={this.state.pagetype} ref="pagetype" name="pagetype"  onChange={this.selectpageType.bind(this)}>
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
											    
											    </div>
	                                    </div>
	                                </div>
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all" id="pageTitle">
	                                    	<label className="label-category lb666 labelform">Page Title<span className="astrick">* </span></label>
	                                        <input type="text" ref="pageTitle" value={this.state.pageTitle} id="basicPageName" name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
	                                    </div>
	                                </div>
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all">
	                                    	<label className="label-category lb666 labelform">Page URL<span className="astrick"></span></label>
	                                        <input type="text" ref="pageUrl" id="basicPageName" value={this.state.pageUrl} name="basicPageName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} disabled/>
	                                    </div>
	                                </div>
		                            
		                                
	                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                    <div className="form-group m3all">
	                                    	<label className="label-category lb666 labelform">Keywords<span className="astrick"></span></label>
	                                        <input type="text" ref="pageHeadKeyWords" value={this.state.pageHeadKeyWords} id="pageHeadKeyWords" name="pageHeadKeyWords"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
	                                    </div>
	                                </div>
		                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                                <div className="form-group m3all">
		                                    <label className="label-category lb666 labelform">Author<span className="astrick"></span></label>
		                                    <input type="text" ref="pageHeadAuther" id="pageHeadAuther" value={this.state.pageHeadAuther} name="pageHeadAuther"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
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
		                           				<button  type="button" className="CNPBtn btn pull-right sendtxtmsgbtn" onClick={this.updatePageData.bind(this)} >Update</button>
			                            	:
		                            			<button  type="button" className="CNPBtn btn pull-right sendtxtmsgbtn" onClick={this.submitData.bind(this)} >Submit</button>
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
export default withRouter(ListOfPages);