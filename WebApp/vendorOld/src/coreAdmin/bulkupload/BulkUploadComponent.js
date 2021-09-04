import React, { Component } from 'react';
import XLSX from "xlsx";
import './BulkUpload.css';
import axios from 'axios';
import Loader  from './Loader.js';
import $ from 'jquery';
import Message from './Message.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class BulkUploadComponent extends Component{
constructor(props) {
    super(props);
    this.state = {
    "inputFileData" : [],
    }
    this.fileInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleFile   = this.handleFile.bind(this);
  }
  componentWillReceiveProps(nextProps) { 
       console.log('nextProps',nextProps.dbdata)
      
       if (nextProps.dbdata.length == 0) {
        this.setState({
            messageData : {
              "type" : "inpage",
              "icon" : "fa fa-check-circle",
              "message" : "No required schema found for bulk upload",
              "class": "danger",
              "autoDismiss" : true
            }
        })
       }
  }
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]){
      var fileName = files[0].name;
      var ext = fileName.split('.').pop();
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
         this.handleFile(files[0]);
      }else{
        this.fileInput.value = '';
        this.setState({
            messageData : {
              "type" : "outpage",
              "icon" : "fa fa-check-circle",
              "message" : "Invalid file format.",
              "class": "danger",
              "autoDismiss" : true
            }
        })
        
      }
    }
  }
  handleFile(file) {
    $('.fullpageloader').show();
    this.setState({fileName: file.name})
    // console.log("this.fileInput",this.fileInput.value);
   const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, { type: rABS ? "binary" : "array" });
      // console.log("wb",wb);
      const wsname = wb.SheetNames[0];
      // console.log("wsname",wsname);
      const ws = wb.Sheets[wsname];
      // console.log("ws",ws);
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      //console.log("data",data);
      
      //var inputFileData = this.state.inputFileData.concat(...data);
      this.setState({inputFileData:data},()=>{
        
        $('.fullpageloader').hide()
        //console.log("inputFileData",this.state.inputFileData);
        /*var formValues ={
        "data" : this.state.inputFileData,
        "reqdata" : this.props.data
        }
        axios
        .post(this.props.url,formValues)
        .then((response)=> {
        if (response) {
            console.log("response",response);
            if (response.data.uploadedData) {
              this.props.uploadedData(response.data.uploadedData);
            }
        // this.setState({
        // "inputFileData" : []
        // })
            //swal(response.data.message);
        }
         })
        .catch((error)=> { 
          this.setState({
            "inputFileData" : []
          })      
        })*/
      });
    };
    if (rABS) reader.readAsBinaryString(file);  
    else reader.readAsArrayBuffer(file);
  }
  // Returns if a value is a string
  isString (value) {
    return typeof value === 'string' || value instanceof String;
  }
  // Returns if a value is really a number
  isNumber (value) {
    return typeof value === 'number' && isFinite(value);
  }
  // Returns if value is a date object
  isDate (value) {
    return value instanceof Date;
  }
  // Returns if a value is a boolean
  isBoolean (value) {
    return typeof value === 'boolean';
  }
  // Returns if a value is null
  isNull (value) {
    return value === null;
  }
  // Returns if a value is undefined
  isUndefined (value) {
    return typeof value === 'undefined';
  }
  // Returns if a value is an object
  isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  // Returns if a value is an array
  isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  // ES5 actually has a method for this (ie9+)
  //Array.isArray(value);


  prepareData(){

    $('.fullpageloader').show();
    var finaldata = [];
    var invalidData = [];
    var excelData = [];
    var totalColumnsInRows = 0;
    $( "[id^='mappingToFile']" ).map((ind,data)=>{
      if (data.value != "Dont Map" ) {
        totalColumnsInRows++;
      }
    })
    this.state.inputFileData.map((filedata,index)=>{
      if (index>0) {
        var excelRowData = {};
        var rowData = {};
        var invalidRowData = {}
        var validColumnsInRow = 0;
        this.props.dbdata.map((data,ind)=>{
          
          if (data.name != '_id' && filedata[$('#mappingToFile'+ind+' option:selected').data('index')]) {
            //console.log($('#mappingToFile'+ind+' option:selected').val())
            if ($('#dbMappingRow'+ind).data('type').toLowerCase() == typeof filedata[$('#mappingToFile'+ind+' option:selected').data('index')]) {
              rowData[data.name] = filedata[$('#mappingToFile'+ind+' option:selected').data('index')]
              rowData["fileName"] = this.state.fileName;
              validColumnsInRow++;
              this.state.inputFileData[0].map((hdr, hdrind)=>{
                excelRowData[hdr] = filedata[hdrind];
              })
            }else{
              this.state.inputFileData[0].map((hdr, hdrind)=>{
                invalidRowData[hdr] = filedata[hdrind];
                //invalidRowData["fileName"] = this.state.fileName;
                invalidRowData["remark"] = $('#mappingToFile'+ind+' option:selected').val()+" should be "+$('#dbMappingRow'+ind).data('type').toLowerCase();
              })
            }
            
          }
        })
        if (totalColumnsInRows == validColumnsInRow) {
          finaldata.push(rowData);
          excelData.push(excelRowData);
        }else{
          invalidData.push(invalidRowData);
          //excelData.push(excelRowData);
        }
        
      }
      
    })
    console.log('finaldata',finaldata)
    console.log('invalidRowData',invalidData);
    console.log('excelData',excelData);

    var formValues ={
        "finaldata"     : finaldata,
        "invalidData"   : invalidData,
        "excelData"     : excelData,
        "totalRecords"  :this.state.inputFileData.length - 1
        }
        axios
        .post(this.props.url,formValues)
        .then((response)=> {
        if (response) {
            //console.log("response",response);
            $('.fullpageloader').hide();
            this.fileInput.value = '';
            this.setState({
            messageData : {
              "type" : "inpage",
              "icon" : "fa fa-check-circle",
              "message" : response.data.message,
              "class": "success",
              "autoDismiss" : true
            },
            "inputFileData" : []
          })
          
          $('.filedetailsDiv').show()
          axios
              .get(this.props.fileDetailUrl+this.state.fileName)
              .then((response)=> {
              if (response) {
                this.setState({fileDetails:response.data});
              }
              })
              .catch((error)=> { 
                    
              }) 
        }
        })
        .catch((error)=> { 
          this.fileInput.value = '';
          this.setState({
            "inputFileData" : []
          })      
        })
  }
  render() {
    if (this.state.fileDetails) {
      console.log(this.state.fileDetails.goodrecords)  
    }
    
    const SheetJSFT = [
        "xlsx",
        "xls",
        "csv"
      ]
    return (
    <div className=" container-fluid">
    <h4>Bulk Upload</h4> 
    <Loader type="fullpageloader" />
    <Message messageData={this.state.messageData} />
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
            <a href={this.props.fileurl} download>
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
            </a>
          </div>
          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <li>Please use attached file format to bulkupload file into this system.</li>
              <li>Please do not change the Heading of following file.</li>
              <li>File format must be .csv or .xlsx or .xls.</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 bulkuploadFileouter">
          <input
            ref={el => this.fileInput = el}
            type="file"
                    className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"
            accept={SheetJSFT}
            onChange={this.handleChange}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="mappingStructure">
        
        { this.props.dbdata.length > 0 &&
         this.state.inputFileData.length > 0 &&
        <div> 
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <table className="table" width="50%">
          <thead>
            <tr>
              <th scope="col">Required Field</th>
              <th scope="col">Columns in Excel</th>
              <th scope="col">Data Type</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.inputFileData.length > 0 ? 
            this.props.dbdata.map((data,index)=>{
              //console.log('data',data)
              if (data.name != '_id') {
                return(
                  <tr key={index}>
                    <td scope="row">{data.label}</td>
                    <td>
                    <select id={"mappingToFile"+index} >
                    <option>Dont Map</option>
                    {
                      this.state.inputFileData.length > 0 &&
                        this.state.inputFileData[0].map((headerdata, ind)=>{
                          return (<option value={headerdata} data-index={ind} key={ind}>{headerdata}</option>);
                        })
                    }
                    </select>
                    </td>
                    <td id={"dbMappingRow"+index} data-type={data.type}>{data.type}</td>
                  </tr>
                  );
              }
            })
            : null
            
          }
          </tbody>
        </table>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <button className="submitBtn btn btnSubmit col-lg-2 col-md-2 col-sm-3 col-xs-3"
          onClick={this.prepareData.bind(this)} >Submit</button>
        </div>
      </div>
      }
      </div>

      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 filedetailsDiv" style={{display:"none"}}>
        <br/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          {
            this.state.fileDetails ?
            <div className="">
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#failure">Failure</a></li>
                <li ><a data-toggle="tab" href="#success">Success</a></li>
              </ul>
              <div className="tab-content">
              <h5>Filename: <span>{this.state.fileName}</span></h5>
                <div id="failure" className="tab-pane fade in active">
                <h5>
                Out of {this.state.fileDetails.totalRecords} records,  &nbsp;
                {this.state.fileDetails.badrecords.length} bad records were found.
                </h5>
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
                <div id="success" className="tab-pane fade">
                  <h5>
                  Out of {this.state.fileDetails.totalRecords} records,  {this.state.fileDetails.goodrecords.length} records are added successfully. &nbsp;
                    {this.state.fileDetails.badrecords.length} bad records were found.
                  </h5>
                  <table className="table" width="50%" id="table-to-xls">
                    <thead>
                      <tr>
                      {
                        this.state.fileDetails.goodrecords[0] ?
                        Object.entries(this.state.fileDetails.goodrecords[0]).map(([key, value], i)=> {
                          return(<th scope="row">{key}</th>);
                        }) :  null
                      }
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.fileDetails.goodrecords ? 
                      this.state.fileDetails.goodrecords.map((data,index)=>{
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
export default BulkUploadComponent;