import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import OneFieldForm             from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import _                        from 'underscore';
import 'bootstrap/js/tab.js';
class orderStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo              : [],
      profileCreated            : false,
      "locationType": "",
      "fields" : {
          placeholder     : "Enter Order Status..",
          title           : "Order Status ",
          attributeName   : "orderStatus"
      },
      "tableHeading": {
          orderStatus: "Order Status",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/orderstatus/',
          paginationApply: false,
          searchApply: false,
          editUrl: '/project-master-data'
      },
      "startRange": 0,
      "limitRange": 10,
      // "editId": this.props.match.params ? this.props.match.params.fieldID : '',
      fileDetailUrl      : "/api/orderstatus/get/filedetails/",
      goodRecordsHeading :{
        orderStatus       : "order Status",
      },
      failedtableHeading   :{
        orderStatus            : " order Status",
        failedRemark          :  "Failed Data Remark"
      }
    };
  }
  componentDidMount() {


    
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
    });
  }
  getFileDetails(fileName){
    axios
    .get(this.state.fileDetailUrl+fileName)
    .then((response)=> {
      console.log('getFileDetailsresponse',response);
      console.log('fileName',fileName);
    $('.fullpageloader').hide();  
    if (response) {
      this.setState({
          fileDetails         : response.data,
          failedRecordsCount  : response.data.failedRecords.length,
          goodDataCount       : response.data.goodrecords.length
      });
        var tableData = response.data.goodrecords.map((a, i)=>{
          console.log("aaaa",a.orderStatus);
          return{
              "orderStatus"    : a.orderStatus            ? a.orderStatus           : '-', 
                
          }
        })

        var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
        return{
             
              "orderStatus"    : a.orderStatus            ? a.orderStatus           : '-', 
              "failedRemark"  : a.failedRemark     ? a.failedRemark : '-' 
        }
        })

      this.setState({
          goodRecordsTable    : tableData,
          failedRecordsTable  : failedRecordsTable
      })
    }
    })
    .catch((error)=> { 
      console.log('error', error);
    }) 
  }

    render() {
      console.log("this.state",this.state)
      return (
      <div className="container-fluid">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <OneFieldForm fields={this.state.fields}
              tableHeading={this.state.tableHeading}
              tableObjects={this.state.tableObjects}
              editId = {this.state.editId}
              history={this.props.history}
              tableDnd ={true} 
              masterFieldForm = {true}
              bulkRequired={true}
              url="/api/orderstatus/bulkuploadorderstatus" 
              data={{ "createdBy" : localStorage.getItem("user_ID"),  }} 
              uploadedData={this.uploadedData} 
              fileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/Department.xlsx"
              getFileDetails={this.getFileDetails.bind(this)}
              fileDetails={this.state.fileDetails}
              goodRecordsHeading ={this.state.goodRecordsHeading}
              failedtableHeading={this.state.failedtableHeading}
              failedRecordsTable ={this.state.failedRecordsTable}
              failedRecordsCount={this.state.failedRecordsCount}
              goodRecordsTable={this.state.goodRecordsTable}
              goodDataCount={this.state.goodDataCount}
              />
          </div>
        </div>
      </div>
         
    );
    }
}
export default orderStatus;

