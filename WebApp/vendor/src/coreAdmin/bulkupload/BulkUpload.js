import React, { Component } from 'react';
import BulkUploadComponent from './BulkUploadComponent';
import axios from 'axios';

class BulkUpload extends Component{
constructor(props) {
    super(props);
    this.state = {
    "inputFileData" : [],
    dbdata          : []
    }
    this.fileInput = React.createRef();
  }
  componentDidMount(){
    /*axios
        .get("http://localhost:5006/api/states/get/schema/states")
        .then((response)=> {
        if (response) {
          this.setState({dbdata:response.data.fields});
        }
        })
        .catch((error)=> { 
          this.setState({
            "inputFileData" : []
          })      
        })*/
    var dbdata = [];
    dbdata.push({name: "countryCode", type: "string", label:"Country Code"})
    dbdata.push({name: "countryName", type: "string", label:"Country Name"})
    dbdata.push({name: "stateCode", type: "string", label:"State Code" })
    dbdata.push({name: "stateName", type: "string", label:"State Name"})
    this.setState({
      dbdata: dbdata
    })
    console.log('dbdata',this.state.dbdata);    
  }
  uploadedData(){

  }
  render() {
    

    const SheetJSFT = [
      "xlsx",
      "xls",
      "csv"
    ]
    return (
    <div className="container-fluid">
        <BulkUploadComponent url="http://localhost:5006/api/states/post/bulkinsert" 
        uploadedData={this.uploadedData} 
        fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Activity+Submission.xlsx"
        dbdata={this.state.dbdata}
        fileDetailUrl="http://localhost:5006/api/states/get/filedetails/"
        />
    </div>
    )
  }
}
export default BulkUpload;