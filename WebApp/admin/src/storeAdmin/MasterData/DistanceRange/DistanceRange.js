import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import OneFieldForm             from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import _                        from 'underscore';
import 'bootstrap/js/tab.js';

class DistanceRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyInfo         : [],
            profileCreated      : false,
            "locationType"      : "",
            "fields"            : {
                                    placeholder     : "Enter Distance Ran..",
                                    title           : "Distance Range",
                                    attributeName   : "distance"
            },
            "tableHeading"      : {
                                    distance        : "Distance Range",
                                    actions         : 'Action',
            },
            "tableObjects"      : {
                                    deleteMethod    : 'delete',
                                    apiLink         : '/api/distancerange/',
                                    paginationApply : true,
                                    searchApply     : false,
                                    showfieldName   : false,
                                    editUrl         : '/project-master-data'
            },
            "startRange"        : 0,
            "limitRange"        : 10,
            "tableName"         : 'distanceRangeTable',
            // "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            // fileDetailUrl       : "/api/unitofmeasurmentmaster/get/filedetails/",
            // goodRecordsHeading  : {
            //                         unit : "Unit Of Measurment",
            // },
            // failedtableHeading  : {
            //                         unit            : "Unit Of Measurment",
            //                         failedRemark    :  "Failed Data Remark"
            // }
        };
    }
    componentDidMount() {
        var userDetails = JSON.parse(localStorage.getItem("userDetails"));
        var token       = userDetails.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

        var editId = this.props.match 
                    ? this.props.match.params.editId
                    : this.props.editId 
                        ? this.props.editId 
                        : "" ;
        if(editId && editId !== 'undefined'){
            this.setState({
                editId : editId
            }, ()=>{
                // console.log("this.state.editId = ",this.state.editId);
            });
        }

        window.scrollTo(0, 0);
        axios.get('/api/companysettings/')
        .then( (res)=>{   
            this.setState({profileCreated:true, companyInfo: res.data}) 
        })
        .catch((error)=>{
            console.log("Error => ",error)
            if(error.message === "Request failed with status code 401"){
                var userDetails =  localStorage.removeItem("userDetails");
                localStorage.clear();
                swal({  
                    title : "Your Session is Expired.",                
                    text  : "You Need to Login Again. Click OK to Go to Login Page"
                })
                .then(okay => {
                    if (okay) {
                        window.location.href = "/login";
                    }
                });
            }
        });
    }

    componentDidUpdate(prevProps) {
        if(this.props.editId !== this.state.editId){
            this.setState({
                editId : this.props.editId
            },()=>{
                //console.log("global componentDidUpdate editId = ",this.state.editId);
            });
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <OneFieldForm 
                            fields          = {this.state.fields}
                            tableHeading    = {this.state.tableHeading}
                            tableObjects    = {this.state.tableObjects}
                            editId          = {this.state.editId}
                            history         = {this.props.history}
                            tableDnd        = {true}
                            masterFieldForm = {true}
                            bulkRequired    = {true}
                            tableName       = {this.state.tableName}
                        />
                    </div>
                </div>
            </div>            
        );
    }
}
export default DistanceRange;

