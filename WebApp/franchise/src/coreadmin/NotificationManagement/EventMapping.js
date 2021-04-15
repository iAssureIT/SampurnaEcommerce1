import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import swal                 from 'sweetalert';
import {connect}            from 'react-redux';
import { withRouter }       from 'react-router-dom';
import _                    from 'underscore';
import 'bootstrap/js/tab.js';
import IAssureTable         from './IAssureTable.jsx';

class EventMapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "tableHeading": {
                eventName : "Event Name",
                role  : "Role",
                mode      : "Mode",
                templateName     : 'Template Name',
                status   : 'status',
                map         : 'Action',
            },
            "tableObjects": {
                paginationApply: false,
                searchApply: false,
            },
            "startRange": 0,
            "limitRange": 1000000,
            "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            "event":"",
            role:"",
            mode:"Email",
            templateName:"",
            status:"",
            templateArray:[],
            roleArray:[],

        };
    }
    componentDidMount(){
        this.getTemplates();
        this.getRoles();
        this.getData(this.state.startRange, this.state.limitRange);

        window.scrollTo(0, 0);
        $.validator.addMethod("regxEvent", function (value, element, arg) {
            return  arg !== value;
        }, "Please select the Event.");
        $.validator.addMethod("regxRole", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Role.");
        $.validator.addMethod("regxMode", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Mode.");
        $.validator.addMethod("regxTemplate", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Template.");
        $.validator.addMethod("regxStatus", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Status.");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#EventMapping").validate({
            rules: {
                event: {
                    required: true,
                    regxEvent: ""
                },
                role: {
                    required: true,
                    regxRole: ""
                },
                mode: {
                    required: true,
                    regxMode: "--Select Mode--"
                },
                templateName: {
                    required: true,
                    regxTemplate: "--Select Template--"
                },
                status: {
                    required: true,
                    regxStatus: "--Select Status--"
                },
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "event") {
                    error.insertAfter("#event");
                }
                if (element.attr("name") == "role") {
                    error.insertAfter("#role");
                }
                if (element.attr("name") == "mode") {
                    error.insertAfter("#mode");
                }if (element.attr("name") == "templateName") {
                    error.insertAfter("#templateName");
                }if (element.attr("name") == "status") {
                    error.insertAfter("#status");
                }
            }
        });
        var editId = this.props.match.params.fieldID;
        if(editId){      
            this.edit(editId);
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps){
            var editId = nextProps.match.params.fieldID;
            if(nextProps.match.params.typeofCenterId){
                this.setState({
                    editId : editId
                },()=>{
                    this.edit(this.state.editId);
                })
            }
        }
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var value = event.target.value;
        this.setState({
            [name]: event.target.value
        },()=>{
            this.getTemplates();
        	this.getRoles();
        });
    }

    getData(startRange, limitRange){
        var data= {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post('/api/eventmapping/post/list', data)
        .then((response) => {
            var tableData = response.data.map((a, i)=>{
                return {
                    _id          :a._id,        
                    eventName  :a.event,         
                    role   :a.role, 
                    mode      :a.mode,
                    templateName       :a.templateName,  
                    status      :a.status,
            }
            });
            this.setState({
              tableData : tableData,
            },()=>{
            });
            
        })
        .catch((error) => {
        swal("error = ",error);
        })
    }
    getTemplates() {
        var formvalues = {
            event : this.state.event,
            mode : this.state.mode
        }
        axios.post("/api/masternotifications/get/listByMode",formvalues)
        .then((response) => {
            
            this.setState({
                templateArray   : response.data,
            })
        })
        .catch((error) => {
            console.log("error = ",error);
        })
    }
    getRoles() {
        var data = {
	      "startRange": this.state.startRange,
	      "limitRange": this.state.limitRange,
	    }
	    axios.post('/api/roles/get/list', data)
	      .then((response) => {
	        this.setState({
	          roleArray: response.data
	        }, () => {
	        })
	      }).catch(function (error) {
	      });
    }
    map(event){
        event.preventDefault();
        if($('#EventMapping').valid()) {
  
        var formvalues = {
            event:this.state.event,
            role:this.state.role,
            templateName:this.state.templateName,
            mode:this.state.mode,
            status:this.state.status
        }
        axios.post('/api/eventmapping/post', formvalues)
          .then((response) => {
            this.getData(this.state.startRange, this.state.limitRange);
            if(response.data.message === "Duplicate Entry"){
            	swal("Duplicate Entry")
            }else{
            	swal(" ","Data Inserted Sucessfully");
	              this.setState({
	                event       : "",
	                role        : "",
	                templateName : "",
	                mode        : "Email",
	                status      : "",
	            },()=>{
	                this.props.history.push("/EventMapping");
	                this.getTemplates();
	                this.getRoles();
	            })
            }
             
          })
          .catch((error) => {

          })
        }
    }
   
    goBack(event){
		event.preventDefault();
		this.props.history.push('/ViewTemplates')
	}

    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-8 col-md-8 col-xs-8 col-sm-8 NOpadding-right">Event Mapping</h4>
                                    <button className="pull-right btn btn-info btn-sm btn_oval col-lg-2 col-md-2" onClick={this.goBack.bind(this)}><i className="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Go Back</button>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <form className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12" id="EventMapping">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                                                <div className="form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Event <sup className="astrick">*</sup></label>
                                                    <select id="event" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.event} ref="event" name="event" onChange={this.handleChange.bind(this)}>
                                                        <option disabled value="">--Select Event--</option>
                                                        <option value="Sign Up">Sign Up</option>
                                                        <option value="Forgot Password">Forgot Password</option>
                                                        <option value="User Activated">User Activated</option>
                                                        <option value="User Blocked">User Blocked</option>
                                                        <option value="TripBooking">Trip Booking</option>
                                                        <option value="ManagerApproval">Manager Approval</option>
                                                        <option value="ManagerRejection">Manager Rejection</option>
                                                        <option value="Trip Allocated to Vendor">Trip Allocated to Vendor</option>
                                                        <option value="Vendor allocates (Car + Driver)">Vendor allocates (Car + Driver)</option>
                                                        <option value="Informs Corporate Employee">Informs Corporate Employee</option>
                                                        <option value="Trip Started">Trip Started</option>
                                                        <option value="Reached Pick up point">Reached Pick up point</option>
                                                        <option value="OTP Verified & Trip begins">OTP Verified & Trip begins</option>
                                                        <option value="Reached Destination">Reached Destination</option>
                                                        <option value="Returned back & Trip-End-OTP">Returned back & Trip-End-OTP</option>
                                                        <option value="Close Trip">Close Trip</option>
                                                        <option value="Generate Bill / Invoice">Generate Bill / Invoice</option>
                                                        <option value="Employee Cancels Trip">Employee Cancels Trip</option>
                                                        <option value="FB Admin Cancels Trip">FB Admin Cancels Trip</option>
                                                        <option value="Vendor Cancels Trip">Vendor Cancels Trip</option>
                                                        <option value="Vendor Accepts a Trip">Vendor Accepts a Trip</option>
                                                        <option value="Vendor Rejects a Trip">Vendor Rejects a Trip</option>
                                                        <option value="Driver Approved a Trip">Driver Approved a Trip</option>
                                                        <option value="Driver Rejected a Trip">Driver Rejected a Trip</option>
                                                        <option value="Vendor Changes Driver">Vendor Changes Driver</option>
                                                    </select>   
                                                </div>
                                                <div className="form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12 marbtm30" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Role<sup className="astrick">*</sup></label>
                                                    <select id="role" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.role} ref="role" name="role" onChange={this.handleChange.bind(this)}>
                                                        <option disabled value="">--Select Role--</option>
                                                        {
                                                            this.state.roleArray && this.state.roleArray.length > 0 ?
                                                                this.state.roleArray.map((data, i)=>{
                                                                    return(
                                                                        <option key={i} value={data.role}>{data.role} </option>
                                                                    );
                                                                })
                                                            :
                                                            null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12 marbtm30" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Mode<sup className="astrick">*</sup></label>
                                                    <select id="mode" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.mode} ref="mode" name="mode" onChange={this.handleChange.bind(this)}>
                                                        <option disabled value="">--Select Mode--</option>
                                                        <option> Email </option>
														<option> Notification </option>
														<option> SMS </option>
                                                    </select>
                                                </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                                                <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12 marbtm30" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Template<sup className="astrick">*</sup></label>
                                                    <select id="templateName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.templateName} ref="templateName" name="templateName" onChange={this.handleChange.bind(this)}>
                                                        <option disabled value="">--Select Template--</option>
                                                        {
                                                            this.state.templateArray && this.state.templateArray.length > 0 ?
                                                                this.state.templateArray.map((data, i)=>{
                                                                    return(
                                                                        <option key={i} value={data.templateName}>{data.templateName} </option>
                                                                    );
                                                                })
                                                            :
                                                            null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12 marbtm30" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Status<sup className="astrick">*</sup></label>
                                                    <select id="status" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.status} ref="status" name="status" onChange={this.handleChange.bind(this)}>
                                                        <option disabled value="">--Select Status--</option>
                                                        <option> active </option>
														<option> inactive </option>
                                                    </select>
                                                </div>
                                                </div>

                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                	<button className="col-lg-2 col-md-2 col-sm-4 pull-right btn button3" onClick={this.map.bind(this)}> Map </button>
                                                </div>
                                               
                                            </form>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                                                <IAssureTable
                                                    tableHeading={this.state.tableHeading}
                                                    twoLevelHeader={this.state.twoLevelHeader}
                                                    dataCount={this.state.dataCount}
                                                    tableData={this.state.tableData}
                                                    tableObjects={this.state.tableObjects}
                                                    getData={this.getData.bind(this)}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default EventMapping;

