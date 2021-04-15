import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import $ from 'jquery';
import swal from 'sweetalert';

import ModuleRegistration from './ModuleRegistration.js';
import  './AccessManagement.css';

class AddModuleFacility extends Component {
  // static propTypes = {
  //   name: React.PropTypes.string,
  // };
	constructor(props) {
	    super(props);
		this.state={
			moduleFacilityName : '',
			moduleName         : '',
			facilityPermission : 'true',
			accessManagementData :[],
		}
		// this.handleChange = this.handleChange.bind(this);
		
	}
	componentDidMount(){
 		/*if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}*/

    axios.get('https://jsonplaceholder.typicode.com/todos/1',)
            .then((response)=> {
                console.log("-------datamaster------>>",response.data);
                this.setState({
          	accessManagementData : response.data
        });
                // localStorage.setItem("token",response.data.token);
                // direct.setState({loggedIn:response.data.token})
            })
            .catch(function (error) {
                console.log(error);
            });
    }
	componentWillMount(){
  // 		 Meteor.call("isAuthenticated","AccessManagement","AddModuleFacility",(err,res)=>{
		// 	if(err){
		// 		console.log(err);
		// 	}else{
		// 		if(res==true){
		//           this.setState({
		//              facilityPermission : res,
		//           });
		//         }else if(res==false){
		//           this.setState({
		//              facilityPermission : res,
		//           });
		//         }
		// 	}
		// });
  	}

	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

	handleChange(event){
		var moduleName = this.refs.moduleName.value;
		if(moduleName){
			// var id =  $(event.target).find('option:selected').attr('id');
			// FlowRouter.go('/admin/addFacilities/'+id);
		}
		const target = event.target;
		const name   = target.name;
		
		this.setState({
		  [name]: event.target.value,
		  moduleName : moduleName,
		});

		if(moduleName === '+ Add New Module'){
   			$('#accessModal').modal('show');
		}
		
  	}

  	openModuleInModal(event){
   		// var id = $(event.target).attr('id');
   		// FlowRouter.go('/admin/addFacilities/'+id);
   		$('#accessModal').modal('show');
   		
   	}
   	addModule(){
   		// FlowRouter.go('/admin/addFacilities/');
   		$('#accessModal').modal('show');
   		$('#moduleName').val();
   	}

  	addModuleFacilityName(e){
  		e.preventDefault();
  		var moduleFacilityName = this.refs.moduleFacilityName.value.trim();
  		if(moduleFacilityName){
	  	/*	Meteor.call("addModuleFacilityName",moduleFacilityName,FlowRouter.getParam('id'),(err,res)=>{
	  			if(err){
	  				swal("Somthing went wrong","","warning");
	  			}else{
	  				this.refs.moduleFacilityName.value = '';

	  				swal("Facility Added successfully","","success");

	  			}
	  		});*/
  		}
  	}

  	removeModule(event){
  		event.preventDefault();
/*  		var removeModuleId = $(event.target).attr('id');
*/  		swal({
			  title              : 'Are you sure?',
			  text               : 'You will not be able to recover this Record!',
			  type               : 'warning',
			  showCancelButton   : true,
			  confirmButtonColor : '#dd6b55',
			  cancelButtonColor  : '#d44',
			  confirmButtonText  : 'Yes, Delete it!',
			  cancelButtonText   : 'No, Keep it',
			  closeOnConfirm     : false
			}, function() {/*
				Meteor.call("removeModule",removeModuleId,(error,result)=>{
					if(error){

					}else{
						swal(
					    'Module has been Deleted',
					    '',
					    'success'
					  );
					
					}
			});
  			
  		*/});
   	}

   	removeModuleFacility(event){
   		event.preventDefault();
  		// var removeFacilityId = $(event.target).attr('id');
/*  		var removeFacilityIndex = $(event.target).attr('name');
*/  		swal({
					  title              : 'Are you sure?',
					  text               : 'You will not be able to recover this Record!',
					  type               : 'warning',
					  showCancelButton   : true,
					  confirmButtonColor : '#dd6b55',
					  cancelButtonColor  : '#d44',
					  confirmButtonText  : 'Yes, Delete it!',
					  cancelButtonText   : 'No, Keep it',
					  closeOnConfirm     : false
					}, function() {/*
						Meteor.call("removeModuleFacility",removeFacilityId,removeFacilityIndex,(error,result)=>{
							if(error){

							}else{
								swal(
							    'Module Facility has been Deleted',
							    '',
							    'success'
							  );
							
							}
					});
  			
  		*/});
   	}


render(){
		/*if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});*/
		return(
			<div className = "container-fluid ">
          		<div className = "row ">
            		<div className= "formWrapper fontF">      
               			<div className= "content">  
							<div className="col-lg-12 pageContent">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<div className="col-lg-6 col-md-7 col-sm-12 col-xs-12">
							    			<h3 className="pageHeader"> Access Management </h3> 
							    		</div>
										<hr className="container-fluid row hr-head"/>
										<div className="col-lg-6 col-md-7 col-sm-12 col-xs-12">
						            		<h3 className="pageSubHeader">Add Module Facility</h3>
							    		</div>
						                <div className="">
											<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AMbox mt15">
												<div className ="pageSubHeader row">Module Name : </div> 
												<span className="moduleNameAM">
													{/* {this.props.accessManagementCurData.moduleName}*/} 
												</span>
											</div>
											<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AMWrap">
												
												<form className = "boxAM" /*onSubmit={this.addModuleFacilityName.bind(this)}*/ >
													<div className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-5 col-sm-offset-1 col-xs-9">
														<i className="fa fa-plus-circle addModuleIcon" title="Click to add more modules" /* onClick={this.addModule.bind(this)}*/ aria-hidden="true"></i>
														<span className="blocking-span col-lg-12"> 
															<select type="text" name="moduleName" ref="moduleName"  id="moduleName" onChange={this.handleChange.bind(this)} className="form-control inputText selectAMDropDown inputBox-main"  title="Select Module" required>
																<option disabled value="">-- Select Module --</option>
																
																{/*{this.state.accessManagementData.map((AMData,index)=>{
																	return <option key={index} id={AMData._id}>{AMData.moduleName}</option>
																  })}*/}
															</select>
															<span className="floating-label floating-label-Date">Select Module</span>					   								   			
														</span>
														</div>
													<div id="accessModal" className="modal fade" role="dialog">
													  <div className="modal-dialog">

													   
													    <div className="modal-content">
													      <div className="modal-header">
													        <button type="button" className="close" data-dismiss="modal">&times;</button>
													        <h4 className="modal-title pageSubHeader">Add Module</h4>
													      </div>
													      <div className="modal-body AM-modal-body">
													        <ModuleRegistration /* id={FlowRouter.getParam('id')}*//>
													      </div>
													    </div>

													  </div>
													</div>
													<div className="col-lg-5  col-md-5 col-sm-5 col-xs-9 valid_box">
														<span className="blocking-span col-lg-12"> 
															<input type="text" name="moduleFacilityName" ref="moduleFacilityName"/* value={this.state.handleChange} onChange={this.handleChangeFacilityZ}*/ placeholder="Module Facility Name" className="form-control inputBox-main" pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" title="Enter Module" required/>
															{/*<span className="floating-label">Module Facility Name</span>					   			*/}
														</span>
														
													</div>
													
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<button className=" col-lg-2 btn submit pull-right"> Submit </button>
													</div>
												</form>
											</div>
											<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AMFTable">
											<div className="">
							              		<table className="table table-striped tab-Table table-bordered">
												    <thead>
												        <tr>
												            <th className="col-lg-1 text-center">Sr.No</th>
												            <th className="col-lg-4 text-center">Module Name </th>
												            <th className="col-lg-4 text-center">Facility Name </th>
												            <th className="col-lg-3 text-center"> Action </th>
												        </tr>
												    </thead>
													    {this.state.accessManagementData.length > 0 ?
														    <tbody>

														     	{this.state.accessManagementData.map((facility,index)=>{
														     	return <tr key={index}>
														     			<td className="moduleName-AMF">{index + 1}</td>
														     			<td className="moduleName-AMF">{facility.moduleName}</td>
													     				
													     					 <td className="AMFTableTD">
													     			{/*		 {facility.facilities.map((facilityArrayVal,indexxx)=>{
													     								return */}
													     								<table className="nestedTable"/* key={indexxx}*/>
														     								<tr>
														     						   			<td className="facilityInnerTD col-lg-10 col-md-10 col-sm-10">
														     						   			{	/*{facilityArrayVal.facilityName} */}
														     						   			</td>
														     						   			<td className="F-DeleteBtn"> 
														     						   				<i className="fa fa-trash deleteIcon" title="Delete Facility" /*id={facility._id} name={indexxx} onClick={this.removeModuleFacility.bind(this)}*/></i>
														     						   			</td>
														     						   		</tr>
													     						   		</table>
													     						   		{/*})}*/}
													     					       </td>
													     				
														     			{/*<td>{moment(facility.createdAt).format("DD/MM/YYYY")}</td>*/}
														     			<td className="moduleName-AMF">
														     				
														     				<i className="fa fa-edit editIcon" title="Edit Module Name" /*id={facility._id} onClick={this.openModuleInModal.bind(this)}*/></i>
														     				
														     				<i className="fa fa-trash deleteIcon" title="Delete Module" /*id={facility._id} onClick={this.removeModule.bind(this)}*/></i>
														
														     			</td>
														     		</tr>
														     		})
														     }
														    </tbody>
													    :
													    	<tbody className="OESDataNotAvailable">
												    			<tr className="text-center ">
												    				<td colSpan="4" className="formLable">"Facilities not yet added"</td>
												    			</tr>
												    		</tbody>
											    		}
													</table>
												</div>
											</div>
										</div>
									</div>
							    </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
		/*}else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access.</h3>
		  		 </div>
		  	);
		}
*/	}
}

export default AddModuleFacility ;