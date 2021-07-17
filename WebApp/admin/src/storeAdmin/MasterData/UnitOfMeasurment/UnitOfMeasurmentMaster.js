import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import OneFieldForm             from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import _                        from 'underscore';
import 'bootstrap/js/tab.js';

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo              : [],
      profileCreated            : false,
      "locationType": "",
      "fields" : {
          placeholder     : "Enter Unit Of Measurment..",
          title           : "Unit Of Measurment Master",
          attributeName   : "unit",
          name            :"vvv"
      },
      "tableHeading": {
          unit: "Unit Of Measurment",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/unitofmeasurmentmaster/',
          paginationApply: true,
          searchApply: false,
          editUrl: '/project-master-data'
      },
      "startRange": 0,
      "limitRange": 10,
      "tableName" : 'UnitOfMeasurment',
      // "editId": this.props.match.params ? this.props.match.params.fieldID : '',
      fileDetailUrl      : "/api/unitofmeasurmentmaster/get/filedetails/",
      goodRecordsHeading :{
        unit       : "Unit Of Measurment",
      },
      failedtableHeading   :{
        unit            : "Unit Of Measurment",
        failedRemark          :  "Failed Data Remark"
      }
    };
  }
  componentDidMount() {
    var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
    var token       = userDetails.token;
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

    var editId = this.props.match 
                 ? this.props.match.params.editId
                 : this.props.editId 
                      ? this.props.editId 
                      : "" ;
    if(editId && editId !== 'undefined'){
      this.setState({
          editId: editId
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
            title : "Your Session is expired.",                
            text  : "You need to login again. Click OK to go to Login Page"
        })
        .then(okay => {
        if (okay) {
            window.location.href = "/login";
        }
        });
      }
    });
  }
  // componentWillReceiveProps(nextProps) {
  //   var editId = nextProps.match.params.fieldID;
  //   if (nextProps.match.params.fieldID) {
  //       this.setState({
  //           editId: editId
  //       })
  //   }
  // }
  componentDidUpdate(prevProps) {
    if(this.props.editId !== this.state.editId){
      this.setState({editId : this.props.editId},
                    ()=>{
                      //console.log("global componentDidUpdate editId = ",this.state.editId);
                    });
    }
  }



  handler(){
    axios.get('/api/companysettings/')
    .then( (res)=>{   
      this.setState({profileCreated:true, companyInfo: res.data}) 
    })
    .catch((error)=>{
      console.log("Error => ",error);
      if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
    });
  }
  getFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+fileName)
    .then((response)=> {
      console.log('getFileDetailsresponse',response);
    $('.fullpageloader').hide();  
    if (response) {
      this.setState({
          fileDetails         : response.data,
          failedRecordsCount  : response.data.failedRecords.length,
          goodDataCount       : response.data.goodrecords.length
      });
        var tableData = response.data.goodrecords.map((a, i)=>{
          console.log("aaaa",a.unit);
          return{
              "unit"    : a.unit            ? a.unit           : '-', 
                
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
             
              "unit"    : a.unit            ? a.unit           : '-', 
              "failedRemark"  : a.failedRemark     ? a.failedRemark : '-' 
        }
        })

      this.setState({
          goodRecordsTable    : tableData,
          failedRecordsTable  : failedRecordsTable
      })
      console.log("goodRecordsTable",this.state.goodRecordsTable);
    }
    })
    .catch((error)=> { 
      console.log('error', error);
      if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
    }) 
  }

    render() {
      return (
      <div className="container-fluid">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <OneFieldForm fields={this.state.fields}
              tableHeading={this.state.tableHeading}
              tableObjects={this.state.tableObjects}
              editId = {this.state.editId}
              history={this.props.history}
              tableDnd = {true}
              masterFieldForm = {true}
              // bulkRequired={true}
              url="/api/unitofmeasurmentmaster/bulkUploadDepartment" 
              data={{ "createdBy" : localStorage.getItem("user_ID"),  }} 
              // uploadedData={this.uploadedData} 
              // fileurl="/BulkUploadTemplates/UnitOfMeasurement.xlsx"
              // getFileDetails={this.getFileDetails.bind(this)}
              // fileDetails={this.state.fileDetails}
              // goodRecordsHeading ={this.state.goodRecordsHeading}
              // failedtableHeading={this.state.failedtableHeading}
              // failedRecordsTable ={this.state.failedRecordsTable}
              // failedRecordsCount={this.state.failedRecordsCount}
              // goodRecordsTable={this.state.goodRecordsTable}
              // goodDataCount={this.state.goodDataCount}
              tableName = {this.state.tableName}
              fields    ={this.state.fields}
              />
          </div>
        </div>
      </div>
         
    );
    }
}
export default Department;

