import React, { Component } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import $ from 'jquery';
class UploadStatus extends Component{
constructor(props) {
    super(props);
    this.state = {
      fileData : []
    }
  }
  componentDidMount(){
      axios
        .get("http://localhost:5006/api/states/get/files")
        .then((response)=> {
        if (response) {
          console.log(response.data);
          this.setState({fileData:response.data});
        }
        })
        .catch((error)=> { 
          this.setState({
            "inputFileData" : []
          })      
        })

       

  }
  uploadedData(){

  }
  viewStatus(event){
    event.preventDefault();
    console.log($(event.currentTarget).data('file'));
    
    $('.filedetailsDiv').show()
    var filename = $(event.currentTarget).data('file');
    axios
        .get("http://localhost:5006/api/states/get/filedetails/"+filename)
        .then((response)=> {
        if (response) {
          this.setState({fileDetails:response.data});
        }
        })
        .catch((error)=> { 
              
        })  
  }
  deleteFileRecords(event){
    event.preventDefault();
  }
  render() {
    
  const SheetJSFT = [
      "xlsx",
      "xls",
      "csv"
    ]
    return (
    <div className="container-fluid">
    <h4>Bulk Upload Status</h4>
      <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 bulkEmployeeContent">
        <table className="table" width="50%">
          <thead>
            <tr>
              <th scope="col">File</th>
              <th scope="col">Total Records</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.fileData ? 
            this.state.fileData.map((data,index)=>{
              return(
                <tr key={index}>
                    <td scope="row">{data.fileName}</td>
                    <td scope="row">{data.count}</td>
                    <td scope="row">
                    <a href="#" onClick={this.viewStatus.bind(this)} data-file={data.fileName}><i className="fa fa-eye" ></i> </a>&nbsp; &nbsp;
                    <a href="#" onClick={this.deleteFileRecords.bind(this)} data-file={data.fileName}><i className="fa fa-trash" ></i></a>
                    </td>
                </tr>    
                );
            })
            : null
          }
          </tbody>
        </table>
      </div>
      <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 filedetailsDiv" style={{display:"none"}}>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          {
            this.state.fileDetails ?
            <div className="">
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#success">Success</a></li>
                <li ><a data-toggle="tab" href="#failure">Failure</a></li>
              </ul>
              <div className="tab-content">
              <h5>Filename: <span>States</span></h5>
                <div id="success" className="tab-pane fade in active">
                  <h5>
                  Out of {this.state.fileDetails.totalRecords} records,  {this.state.fileDetails.goodrecords.length} records are added successfully. &nbsp;
                    {this.state.fileDetails.badrecords.length} bad records were found.
                  </h5>
                </div>
                <div id="failure" className="tab-pane fade">
                <div className="text-right">
                <br/>
                 <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
                    <br/>
                  </div>  
                    <table className="table" width="50%" id="table-to-xls">
                    <thead>
                      <tr>
                      {
                        this.state.fileDetails.badrecords[0] ?
                        Object.entries(this.state.fileDetails.badrecords[0]).map(([key, value], i)=> {
                          return(<th scope="row">{key}</th>);
                        }) :  null
                      }
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.fileDetails.badrecords ? 
                      this.state.fileDetails.badrecords.map((data,index)=>{
                        return(
                          <tr key={index}>
                          {
                              Object.entries(data).map(([key, value], i)=> {
                                return(<td scope="row">{value}</td>);
                              })
                          }
                        </tr>
                        );
                      }) 
                      : null
                    }
                    </tbody>
                  </table>
                  
                </div>
              </div>
            </div>  
            : null
          }
        </div>

      </div>
    </div>
    )
  }
}
export default UploadStatus;