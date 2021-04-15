import React, { Component }     from 'react';
import EditNotificationModal    from '../EditNotificationModal.jsx';
import axios 					from 'axios';
import swal                     	from 'sweetalert';
import $ from 'jquery';


export default class AllSMSTemplateRow extends Component{

	constructor(props) {
		super(props);
		this.state = {
			templateType    : '',
			templateName    : '',
			content         : '',
		};
      	this.editSMSModal = this.editSMSModal.bind(this);
      	this.smsGetData    = this.smsGetData.bind(this);
    }

    componentWillReceiveProps(nextProps){
    	
    	if(this.props.smstemplateValues.status == 'active'){
			$('#notifTogBtn').attr("checked", true);
        }else {
            $('#notifTogBtn').attr("checked", false);
        }

    }

    editSMSModal(event){
		event.preventDefault();
		var id = event.target.id;
		axios.get('/api/masternotifications/get/'+id)
		.then((response)=> {
	    	
	    	this.setState({
				'templateType' 		: response.data.templateType,
				'templateName'		: response.data.templateName,
				'content'			: response.data.content,
			});
		}).catch((error)=> {
		    // handle error
		});
	}

	deleteTemplate(event){
		event.preventDefault();
		var id = event.target.id;
		axios.delete('/api/masternotifications/delete/'+id)
		.then((response)=> {
			
			swal({
				title: "Template deleted successfully",
				text: "Template deleted successfully",
			});
	    	this.props.deleteData("SMS",id);
	    	window.location.reload();
		}).catch((error)=> {
		    // handle error
		});
	}

	smsGetData =(id)=>{
    this.props.getSmsData(id);
	}

	changeStatus(event){
		if(this.props.smstemplateValues.status == 'active'){
			var value = 'inactive';
		}else{
			var value = 'active';
		}
		var formValues = {
			notifId : this.props.smstemplateValues._id,
			status : value
		}
		axios.patch('/api/masternotifications/patch/status',formValues)
		.then((response)=>{
			swal("Status changed successfully!")
			window.location.reload();
		})
		.catch((error)=>{
			console.log('error: ',error);
		})
		if(this.props.smstemplateValues.status == 'active'){
			$('#notifTogBtn').attr("checked", true);
        }else {
            $('#notifTogBtn').attr("checked", false);
        }
	}


	render() {
		var text= this.props.smstemplateValues.content ? this.props.smstemplateValues.content : 'abc';
		var regex = new RegExp(/(<([^>]+)>)/ig);
		text = text.replace(regex, '');
		if(this.props.smstemplateValues.content){
	        return (
	       		<div className="contentBox col-lg-12">
		       		<div className="pull-right actionBtn">
		       			<div className="dropdown ">
		       				<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
							<div className="dropdown_content">
			      				<ul className="pdcls ulbtm">
			      					 <li>  
	                                <a href="#" data-toggle="modal" onClick={this.editSMSModal.bind(this)} data-target={"#editNotifyModal-"+this.props.smstemplateValues._id} id={this.props.smstemplateValues._id} title="Edit"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
	                              </li>
	                              <li>
	                                <a data-toggle="modal" data-target={`#${this.props.smstemplateValues._id}-rm`} id={this.props.smstemplateValues._id} title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</a>
	                              </li>
			      				</ul>
			      			</div>
						</div>

					</div>
					<EditNotificationModal emailNot={this.props.smstemplateValues._id} smsGetData={this.smsGetData.bind(this)} data={this.props.smstemplateValues}/>
					<div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${this.props.smstemplateValues._id}-rm`}  role="dialog">
	                    <div className=" modal-dialog adminModal adminModal-dialog">
	                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
	                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
						        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
									        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
									          <span aria-hidden="true">&times;</span>
									        </button>
								        </div>
						      		</div>
	                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

	                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this template?</h4>
	                              </div>
	                              
	                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
	                                   </div>
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button id={this.props.smstemplateValues._id} onClick={this.deleteTemplate.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
	                                   </div>
	                              </div>
	                         </div>
	                    </div>
	               </div>
	               <div className="col-md-12 NOpadding divStyle">
						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Role</label>
							<p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{this.props.smstemplateValues.role}</p>
						</div>
						
						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Company</label>
							<p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{this.props.company}</p>
						</div>

						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Status</label>
							<p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<label className="switch toggleSwitch" value={this.props.smstemplateValues.status} onClick={this.changeStatus.bind(this)}><input type="checkbox" id="notifTogBtn"/><div className="slider toggleSlider round"></div></label>
							</p>
						</div>
					</div>

					<div className="inputrow col-md-12">
						<div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message:</label>     						
								 <p  dangerouslySetInnerHTML={{ __html:text}} className="textAreaBox"></p>
							</div>	
						</div>
					</div>
				</div>
		    );
		}else{
			return(<div></div>);
		}
	} 
}