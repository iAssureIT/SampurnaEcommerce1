import React 		from 'react';
import CKEditor 	from 'ckeditor4-react';
import axios 		from 'axios';
import $ 			from 'jquery';
import swal 		from 'sweetalert';

import TimePicker   from 'rc-time-picker';
import DownPpt      from '../downPpt/downPpt.js';

const format = "h:mm a";
var answersarray =[];
export default class Jobform extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
		 		jobTitle 	    : "",
				jobDescription  : "",
				CityofWork 	    : "",

				validfrom 		: "",
				arrayValues 	: [],
				skills 			: "",
				validTill 		: "",
				ListOfjobs 		: "",
		 }
	}
/*	handleChange(){

	}*/
	componentDidMount(){
		this.getListOfJobs();


	}

	handleChange(event){
		event.preventDefault();
    	this.setState({

        [event.target.name]:event.target.value
     
	
    	});
	}
	Submit(){
		var formValues = {
    		jobTitle 			: this.state.jobTitle,
    		jobDescription 		: this.state.jobDescription,
    		city 				: this.state.CityofWork,
    		validfrom 			: this.state.validfrom,
    		validTill 			: this.state.validTill,		
    		skills 				: this.state.arrayValues,		
		};
		console.log("formValues ==>",formValues);
		axios
				.post('/api/jobform/post',formValues)
			  	.then((response)=>{
			    // handle success
			   		console.log("response",response.data);
			   		window.location.reload();
			    	
			  	})
			  	.catch(function (error) {
			    // handle error
			    	console.log(error);
			  	});


	}
	getListOfJobs(){
	/*/get/list*/
	axios
			.get('/api/jobform/get/list')
			.then((response)=>{       
				console.log("response  ==",response); 
			      	this.setState({
		      			ListOfjobs:response.data
		      		});
				})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
	}
	    
	deleteJob(event){
		event.preventDefault();
		var URL= event.target.id;
		console.log("id delet", URL);
		 swal({
	          title: "Are you sure you want to delete this Job ?",
	          text: "Once deleted, you will not be able to recover this Job!",
	          icon: "warning",
	          buttons: true,
	          dangerMode: true,
	        })
	        .then((success) => {
	            if (success) {
	            	axios
				    .delete("/api/jobform/delete/"+URL)
				    .then((response)=>{
				     	// this.getListOfPages();
				       swal("Your Job is deleted!");
				       window.location.reload();
				    })
				    .catch((error)=>{
				       console.log("error = ", error);              
				    }); 
	            } else {
	            swal("Your Job is safe!");
	          }
	        }); 
	}	
	editPage(event){
		event.preventDefault();
		var URL= event.target.id;
		console.log("URL===",URL);
	    axios
	      .get("api/jobform/get/one/"+URL)
	      .then((response)=>{
	        console.log("=selected page data==>",response.data);
	       	var allCB = document.querySelectorAll("[id='checkboxID']");
	    		for(var i=0; i< allCB.length; i++){
	    			allCB[i].checked = false;
	    		}
	        response.data.skills.map((data,ind)=>{
	        	console.log(data)
	        	console.log($('[value="'+data+'"]'))
	        	$('[value="'+data+'"]').prop('checked',true)
	        });
	        this.setState({
	        //	"pageTitle"						: response.data.pageTitle, 
	        	jobTitle 	    : response.data.jobTitle,
				jobDescription  : response.data.jobDescription,
				CityofWork 	    : response.data.city,

				validfrom 		: response.data.fromDate,
				arrayValues 	: response.data.skills,
				skills 			: response.data.skills,
				validTill 		: response.data.toDate,
	        });
	      })
	      .catch((error)=>{
	         console.log("error = ", error);              
	      });

	}
	updatePageData(){
	 const formValues = {
	   
					"pageTitle"				: this.refs.pageTitle.value,
				
	   };
	    axios
	          .patch('/api/pages/patch/'+this.state.UrlId,formValues)
	          .then((res)=>{
	                      swal(" Your Job update successfully ");
	                       // this.props.history.push("/viewpage2/"+this.state.UrlId);

	                  })
	                  .catch((error)=>{
	                    console.log("error = ", error);
	                  });

	}

	uploadrepetGImg(){

	}
	deleteRGBlockimage(){

	}
	fromTime(){
		
	}
	getCheckValue(event){
	    var id = event.target.id;
	    var checked = event.target.checked;
	    var name = event.target.name;
	    var value = event.target.value;
	    var array = [];
	    // console.log(document.querySelectorAll("[id='checkboxID']"));
	    var allCB = document.querySelectorAll("[id='checkboxID']");
	    for(var i=0; i< allCB.length; i++){
	    	if (allCB[i].checked) {
	    		 array.push(allCB[i].value);
	    	}
		}
		    console.log("arrayarray",array);

		  this.setState({
						arrayValues : array,
						})
	   /* if (checked === true) {
		    let filteredCheckBox = array.filter( function (user) {
		    
					return user
					})
		    console.log("filteredCheckBox",filteredCheckBox);
		    if (filteredCheckBox) {
		    	 array.push(value);
		    console.log("array push",array);
		    }
		  
	    }
	     else {
		    let filteredCheckBox = array.filter( function (user) {
				return user==value
				}).length !== 0
			if (filteredCheckBox) {
	    		 array.pop(value);
	    		 console.log("after pop array",array);
			}
	    }*/  
	}
	render() {
		console.log("arrayValues",this.state.arrayValues);
		return (
			<div>
			<DownPpt />
				{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m20">
					<h1 className="text-center"> Job Form</h1>
              		<div className="col-lg-12 col-md-12">
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Job Title<span className="astrick"></span></label>
									<input type="text" ref="jobTitle" id="jobTitle" value={this.state.jobTitle} name="jobTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							    <div className="form-group">
							   		<label className="label-category">Job Description<span className="astrick"></span></label>
							        <input type="text" ref="jobDescription" id="jobDescription" value={this.state.jobDescription} name="jobDescription"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)}/>
							    </div>
							</div>	
						</div>
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Valid from<span className="astrick"></span></label>
									<input type="date" ref="validfrom" id="validfrom" value={this.state.validfrom} name="validfrom"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							 //<TimePicker
                              showSecond={false}
                              className="col-lg-6 noLeftPadding"
                              value={this.state.validfrom}
                              onChange={this.fromTime.bind(this)}
                              format={format}
                              placeholder="From"
                              use12Hours
                              inputReadOnly
                            />//
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							    <div className="form-group">
							   		<label className="label-category">Valid Till<span className="astrick"></span></label>
							        <input type="date" ref="validTill" id="validTill" value={this.state.validTill} name="validTill"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)}/>
							    </div>
							</div>	
						</div>
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">City of Work<span className="astrick"></span></label>
									<input type="text" ref="CityofWork" id="CityofWork" value={this.state.CityofWork} name="CityofWork"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
								
						</div>
              			<div className="row mt20">
              				<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							    <div className="form-group">
                                    <label className="label-category">Skills required<span className="astrick"></span></label>
									<div class="checkbox">
								      	<label>
								      		<input type="checkbox"  name="Communication" id="checkboxID" value="Communication" onClick={this.getCheckValue.bind(this)} required />Communication.
								      	</label>
								    </div>
								    <div class="checkbox">
								      	<label>
								      		<input type="checkbox"  name="Computer Skills" id="checkboxID" value="Computer Skills" onClick={this.getCheckValue.bind(this)} required />Computer Skills.
								      	</label>
								    </div>
								    <div class="checkbox">
								        <label>
								        	<input type="checkbox"  name="Customer Service" id="checkboxID" value="Customer Service" onClick={this.getCheckValue.bind(this)} required  />Customer Service.
								        </label>
								    </div>
								    <div class="checkbox">
								      	<label>
								      		<input type="checkbox"  name="Interpersonal" id="checkboxID" value="Interpersonal" onClick={this.getCheckValue.bind(this)} required />Interpersonal Skills.
								      	</label>
								    </div>
								    <div class="checkbox">
								      	<label>
								      		<input type="checkbox"  name="Leadership" id="checkboxID" value="Leadership" onClick={this.getCheckValue.bind(this)} required />Leadership.
								      	</label>
								    </div>
								    <div class="checkbox">
								      	<label>
								      		<input type="checkbox"  name="Management Skills" id="checkboxID" value="Management Skills" onClick={this.getCheckValue.bind(this)} required />Management Skills.
								      	</label>
								    </div>
								    <div class="checkbox">
								        <label>
								        	<input type="checkbox"  name="Problem-Solving." id="checkboxID" value="Problem-Solving." onClick={this.getCheckValue.bind(this)} required />Problem-Solving.
								        </label>
								    </div>
							    </div>
							</div>
                        
                                     
            			</div>
                                          
						//<div className="row  marginTop17">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
							    <label className="label-category marginTop17">Block Content<span className="astrick"></span></label>
							    <div className="">
			                      	<CKEditor
				                        data={this.state.repBlockContent}
				                        onChange={this.onEditorChangeINGroupBlock.bind(this)} />
			                    </div>
							</div>
						</div>//
                                          
                        <button  type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.Submit.bind(this)}>Submit</button>           		
	              	</div>
	              	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
						//	<h2 className="text-center">List Of Pages</h2>//
							<table className="table">
							  	<thead className="thead-dark">
							    	<tr className="clrwht">
								      <th scope="col">No.</th>
								      <th scope="col">Job Title</th>
								      <th scope="col">City</th>
								      //<th scope="col">Page Url</th>//
								      <th scope="col">Action</th>
							    	</tr>
							  	</thead>
							    <tbody>
							    {
							    	this.state.ListOfjobs 
										?
										this.state.ListOfjobs && this.state.ListOfjobs.length>0?
											this.state.ListOfjobs.map((result, index)=>{
												// console.log('result', result);
												return(
												    <tr key={index}>
												      <td>{index+1}</td>
												      <td >{result.jobTitle}</td>
												      <td >{result.city}</td>
												      //<td id={result.pageURL} className="onHoverClick" onClick={this.urlPage.bind(this)} data-placement="top" title="Click here to view Page">{result.pageURL}</td>
												      <td><i className="fa fa-edit deletIcon" id={result._id}  onClick={this.editPage.bind(this)} data-placement="top" title="Edit Page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
												      		<i className="fa fa-trash deletIcon" id={result._id} onClick={this.deleteJob.bind(this)} data-placement="top" title="Delete page"></i>&nbsp;&nbsp;&nbsp;&nbsp;
												      		//<i className="fa fa-eye"></i>
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
				</div>*/}
			</div>
		);
	}
}
