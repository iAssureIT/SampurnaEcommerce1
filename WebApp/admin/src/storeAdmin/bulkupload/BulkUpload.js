import React, { Component } from 'react';
import XLSX from "xlsx";
import './BulkUpload.css';
import axios from 'axios';
import swal  from 'sweetalert';
import $ from 'jquery';
import IAssureTable           from "./IAssureTable.js";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Loader from '../loader/Loader.js'; 

class BulkUpload extends Component{
	constructor(props) {
    super(props);
    this.state = {
    	"inputFileData" : [],
      tableData:[],
      failedRecordsTable:[],
    
      tableObjects : {
        paginationApply : false,
        searchApply     : false
    }
    }
    this.fileInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleFile   = this.handleFile.bind(this);
  } 
  componentWillReceiveProps(){
    
  }  
  componentDidMount() {
    // const center_ID = localStorage.getItem("center_ID");
    // const centerName = localStorage.getItem("centerName");
    // // console.log("localStorage =",localStorage.getItem('centerName'));
    // this.setState({
    //   center_ID    : center_ID,
    //   centerName   : centerName,
    // },()=>{
      this.props.getData(this.state.startRange, this.state.limitRange);
    // });
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
        swal({
          title : "Invalid file format.",
          text: "Invalid file format."
        })
      }
    }
  }
  /*handleFile(file) {
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
      const data = XLSX.utils.sheet_to_json(ws, { header: 0 }); 
      // console.log("data",data);
      var inputFileData = this.state.inputFileData.concat(...data);
      this.setState({inputFileData:inputFileData},()=>{
        this.fileInput.value = '';
        console.log("inputFileData",this.state.inputFileData);
        var formValues ={
        	"data" : this.state.inputFileData,
          "reqdata" : this.props.data
        }
         axios
        .post(this.props.url,formValues)
        .then((response)=> {
        	if (response) {
            console.log("response",response);
            if(this.props.data.month==='Annual'){
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              var email = localStorage.getItem('email')
              var msgvariable = {
                '[User]'    : localStorage.getItem('fullName'),
                '[FY]'    : this.props.data.year,
              }
              // console.log("msgvariable :"+JSON.stringify(msgvariable));
              var inputObj = {  
                to           : email,
                templateName : 'User - Annual Plan Submitted',
                variables    : msgvariable,
              }
              // axios
              // .post('/api/masternotification/send-mail',inputObj)
              // .then((response)=> {
              //   // console.log("-------mail------>>",response);
              //   swal({
              //     title : response.data.message,
              //     text  : response.data.message
              //   });
              //   this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              // })
              // .catch(function (error) {
              //     console.log(error);
              // })
            }else{
              swal({
                title : response.data.message,
                text  : response.data.message
              });
              this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              var email = localStorage.getItem('email')
              var msgvariable = {
                '[User]'    : localStorage.getItem('fullName'),
                '[FY]'    : this.props.data.year,
                '[monthName]' : this.props.data.month
              }
              // console.log("msgvariable :"+JSON.stringify(msgvariable));
              var inputObj = {  
                to           : email,
                templateName : 'User - Monthly Plan Submitted',
                variables    : msgvariable,
              }
              // axios
              // .post('/api/masternotification/send-mail',inputObj)
              // .then((response)=> {
              //   // console.log("-------mail------>>",response);
              //   swal({
              //     title : response.data.message,
              //     text  : response.data.message
              //   });
              //   this.getData(this.state.center_ID, this.state.month, this.state.year, this.state.startRange, this.state.limitRange);
              // })
              // .catch(function (error) {
              //     console.log(error);
              // })
            }
            if (response.data.uploadedData) {
              this.props.uploadedData(response.data.uploadedData);
            }
        		this.setState({
        			"inputFileData" : []
        		})
            swal(response.data.message);
        	}
         })
        .catch((error)=> {  
           this.setState({
    			"inputFileData" : []
    		})       
        })
      });
    };
    if (rABS) reader.readAsBinaryString(file);   
    else reader.readAsArrayBuffer(file);
  }*/
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
      var documentObj = [];
      let count = 0;
      for (var j = 1; j <= data.length; j++) {
        var record = data[j];
        var attributeArray = [];
        let header = data[0];
        // console.log('record',record)
        if (record !== undefined && record.length > 0) {
            var k;
            // loop on header columns
            for (k in header) {
                if (!documentObj.hasOwnProperty(count)) {
                  if (record[k] === undefined) {  
                    documentObj.push({ [header[k]]: '-' });
                  }else{
                    documentObj.push({ [header[k]]: record[k] });
                  }
                } 
                else {
                  if (record[k] === undefined) {
                   documentObj[count][header[k]] = '-';   
                  }else{
                    documentObj[count][header[k]] = record[k];
                  }
                  // documentObj[count]['filename'] = file.name;
                  //documentObj[count]['vendor_ID'] = this.props.requiredData.vendor;
                }
            }
            count++;
        }
    }
      this.setState({inputFileData:documentObj},()=>{
        $('.fullpageloader').hide()
      });
    };
    if (rABS) reader.readAsBinaryString(file);  
    else reader.readAsArrayBuffer(file);
  }
  bulkUpload() {
    $('.fullpageloader').show();
    var initialLmt = 0;
    var factor = 100;
    var endLmt = initialLmt+factor;
    var totalrows = this.state.inputFileData.length;
    var chunkData = [];
    var excelChunkData = [];

    
    const startProcess = async (data)=>{
      for (var i = initialLmt; i < endLmt; i++) {
        if (this.state.inputFileData[i]) {
          chunkData.push(this.state.inputFileData[i]);
          //excelChunkData.push(excelData[i])   
        }
        //console.log('i',i)
        //console.log('endLmt',endLmt)
        if (i == endLmt-1 && i != totalrows && chunkData.length>0) {
          var formValues = {
            data      : chunkData,
            reqdata   : this.props.data,
            fileName  : this.state.fileName,
            totalRecords : totalrows,
            updateBadData : i > factor ? false : true
          };
          console.log('formValue',formValues)
          // var formValues ={
          // "finaldata"     : chunkData,
          // "invalidData"   : invalidData,
          // "reqData"       : data,
          // "excelData"     : excelChunkData,
          // "totalRecords"  : totalRecords
          // }
          //console.log('formValues',formValues);
          await axios({
            method: 'post',
            url: this.props.url,
            data: formValues
          })
          .then((response)=> {
            console.log('response',response.data)
              console.log('response.data.completed',response.data.completed)
            if (response.data.completed) {

              console.log('endLmt',endLmt)
              
              var percentage = Math.round((endLmt*100/totalrows))
              if (percentage > 99 ) {
                percentage = 100;
                
                $('.fullpageloader').hide();
                $('.filedetailsDiv').show();
                this.props.getFileDetails(this.state.fileName) 
                this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID) 
              }
              this.setState({percentage:percentage},()=>{})
              chunkData = [];
              initialLmt += factor;  
              endLmt = initialLmt+factor; 
            }
          })
        }
      }
    }
    startProcess(this.props.data);

    
    // axios.post(this.props.url, formValues)
    //     .then((response) => {
            
    //         this.fileInput.value = '';
    //         this.setState({inputFileData:[]});
    //         swal({
    //           title : response.data.message,
    //           text  : response.data.message,
    //         })
                        
    //         $('.filedetailsDiv').show()
    //         this.props.getFileDetails(this.state.fileName) 
    //     })
    //     .catch((error) => {
    //         console.log('error', error);
    //     })
  }
  getData(){

  }
  render() {
    // console.log("goodrecords",this.props.fileDetails)
  	 const SheetJSFT = [
      "xlsx",
      "xls",
      "csv"
    ]
    return (
    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
          <Loader type="fullpageloader" percentage={this.state.percentage}/>
	        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent montserrat">
	          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
	            <a href={this.props.fileurl} download>
		            <img src="/images/Excel-download-icon.png" title="Download a Sample File" />
	            </a>
	          </div>
	          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif ">
              <h5 className="montserrat">Instructions:</h5>
	            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              <li>Please use attached file format for bulkupload into this system.</li>
	              <li>Please do not change the Heading of following file.</li>
	              <li>File format must be .xlsx or .xls.</li>
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
          {
            this.state.inputFileData.length > 0 ?
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4" style={{marginTop:'2%'}}>
              <button className="submitBtn btn btnSubmit"
              onClick={this.bulkUpload.bind(this)} >Submit</button>
            </div>           
            :
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4" style={{marginTop:'2%'}}>
              <button className="submitBtn btn btnSubmit"
                    disabled>Submit</button>
            </div>        
          }
          <div className="filedetailsDiv" id={this.props.bulkTableID} style={{display:"none"}}>
            <br/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent NoPadding">
              {
                this.props.fileDetails ?
                <div className="">
                  <ul className="nav nav-tabs">
                    <li className="active"><a data-toggle="tab" href={"#failure"+this.props.failedRecordsCount}>Failure</a></li>
                    <li ><a data-toggle="tab" href={"#success"+this.props.goodDataCount}>Success</a></li>
                  </ul>
                  <div className="tab-content">
                  <h5>Filename: <span>{this.state.fileName}</span></h5>
                    <div id={"failure"+this.props.failedRecordsCount} className="tab-pane fade in active">
                    <h5>
                    Out of {this.props.fileDetails.totalRecords } {this.props.fileDetails.totalRecords > 1 ? "records" : "record"},  &nbsp;

                    {this.props.fileDetails.failedRecords.length} bad {this.props.fileDetails.failedRecords.length > 1 ? "records were " : "record was " }found.
                    </h5>
                      <div className="text-right">
                      <br/>
                       <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table={"failedtable"+this.props.failedRecordsCount}
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="Download as XLS"/>
                          <br/>
                        </div>  
                        <div style={{overflowX: "auto"}}>

                        <IAssureTable 
                          tableHeading={this.props.failedtableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.props.failedRecordsCount}
                          tableData={this.props.failedRecordsTable}
                          tableObjects={this.state.tableObjects}
                          />


                        <table className="table" width="50%" id={"failedtable"+this.props.failedRecordsCount} style={{display:"none"}}>
                          <thead>
                            <tr>
                            {
                              this.props.fileDetails.failedRecords[0] ? 
                              Object.entries(this.props.fileDetails.failedRecords[0]).map( ([key, value], i)=> {
                                return(
                                  <th key={i}>{key}</th>
                                );
                              }) : null
                            }
                            </tr>
                          </thead>
                          <tbody>
                          {
                            this.props.fileDetails.failedRecords ? 
                            this.props.fileDetails.failedRecords.map((data,index)=>{
                             
                              return(
                                <tr key={index}>
                                { Object.entries(data).map( ([key, value], i)=> {
                                    return(<td>{data[key]}</td>);
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
                    <div id={"success"+this.props.goodDataCount} className="tab-pane fade">
                      <h5>
                      {
                        /*Out of {this.props.fileDetails.totalRecords} {this.props.fileDetails.totalRecords > 1 ? "records" : "record"},  {this.props.fileDetails.goodrecords.length} {this.props.fileDetails.goodrecords.length > 1 ? "records are" : "record is" } added successfully. &nbsp;
                      */}
                      Total {this.props.fileDetails.goodrecords.length} { this.props.fileDetails.totalRecords > 1 ? "records" : "record"} found from this file.
                      </h5>
                          <IAssureTable 
                          tableHeading={this.props.goodRecordsHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.props.goodDataCount}
                          tableData={this.props.goodRecordsTable}
                          //getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                          />
                      {
                      
                    }
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
export default BulkUpload;