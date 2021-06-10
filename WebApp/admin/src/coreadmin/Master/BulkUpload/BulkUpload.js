import React, { Component } 	from 'react';
import XLSX 					from "xlsx";
import axios 					from 'axios';
import swal  					from 'sweetalert';
import $ 						from 'jquery';
import IAssureTable          	from "./IAssureTable.js";
import ReactHTMLTableToExcel 	from 'react-html-table-to-excel';
import Loader  					from '../../common/Loader/Loader.js'; 
import './BulkUpload.css';

class BulkUpload extends Component{
	constructor(props) {
		super(props);
		this.state = {
			"inputFileData" 		: [],
			fileDetailUrl 			: "/api/entitymaster/get/filedetails/",
			tableData 				: [],
			failedRecordsTable 		: [],
			tableObjects  			: {
										paginationApply : false,
										searchApply     : false
			},
			goodRecordsHeading: {
										entityType 		: "Entity Type",
										companyName 	: "Company Name",
										groupName 		: "Group Name",
										website 		: "Website",
										companyPhone 	: "Contact No",
										companyEmail 	: "Company Email",
										CIN 			: "CIN",
										COI 			: "COI",
										TAN 			: "TAN",
										// role: "Role",
			},
			failedtableHeading 	: {			 
										entityType 		: "Entity Type",
										companyName 	: "Company Name",
										groupName 		: "Group Name",
										website 		: "Website",
										companyPhone 	: "Contact No",
										companyEmail 	: "Company Email",
										CIN 			: "CIN",
										COI 			: "COI",
										TAN 			: "TAN",
										failedRemark    : "Failed Data Remark"
										// role: "Role",
			},
			"startRange"   		: 0,
			"limitRange"   		: 10000,
		}
		this.fileInput  	= React.createRef();
		this.handleChange 	= this.handleChange.bind(this);
		this.handleFile   	= this.handleFile.bind(this);
	} 

	/**============ componentDidMount() ===========*/
	componentDidMount(){
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token         = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		var user_ID       = userDetails.user_id;
		this.setState({
			user_ID : user_ID
		},()=>{
			console.log("user_ID => ",this.state.user_ID);
		})		
	}    

	/**============ handleChange() ===========*/
	handleChange(e) {
		const files = e.target.files;
		if (files && files[0]){
			var fileName 	= files[0].name;
			var ext 		= fileName.split('.').pop();
			if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
				this.setState({
					fileName : fileName
				})
				this.handleFile(files[0]);
			}else{
				this.fileInput.value = '';
				swal({
					title : " ",
					text  : "Invalid file format."
				})
			}
		}
	}
	
	/**============ handleFile() ===========*/
	handleFile(file) {
		$('.fullpageloader').show();
		this.setState({fileName : file.name})
		// console.log("this.fileInput",this.fileInput.value);
		const reader 	= new FileReader();
		const rABS 		= !!reader.readAsBinaryString;

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
			let count 		= 0;

			for (var j = 1; j <= data.length; j++) {
				var record 			= data[j];
				var attributeArray 	= [];
				let header 			= data[0];
				//console.log('record',record)

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
							//documentObj[count]['vendor_ID'] = this.state.requiredData.vendor;
						}
					}
					count++;
				}
			}
			this.setState({
				inputFileData : documentObj 
			},()=>{
				console.log("input file => ",this.state.inputFileData);
				$('.fullpageloader').hide()
			});
		};
		if (rABS) reader.readAsBinaryString(file);  
		else reader.readAsArrayBuffer(file);
	}

	/**============ getFileDetails() ===========*/
	getFileDetails(fileName){
		axios.get(this.state.fileDetailUrl+fileName)
		.then((response)=> {
		 	$('.fullpageloader').hide();  
		 	if (response) {
				//  console.log("response data => ",response.data)
			 	this.setState({
					fileDetails         : response.data,
					failedRecordsCount  : response.data.failedRecords.length,
					goodDataCount       : response.data.goodrecords.length
			 	});
				var tableData = response.data.goodrecords.map((a, i)=>{
					return{							
						"entityType"	: a.entityType ? a.entityType : '-',
						"companyName"	: a.companyName ? a.companyName : '-',
						"groupName"		: a.groupName ? a.groupName : '-',
						"website"		: a.website ? a.website : '-',
						"companyPhone"	: a.companyPhone ? a.companyPhone : '-',
						"companyEmail"	: a.companyEmail ? a.companyEmail : '-',
						"CIN"			: a.CIN ? a.CIN : '-',
						"COI"			: a.COI ? a.COI : '-',
						"TAN"			: a.TAN ? a.TAN : "-",
						// "role": a.contactPersons[i].role ? a.contactPersons[i].role : "-",
					}
				})

				var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
					return{
								
						"entityType" 		: a.entityType ? a.entityType : '-',
						"companyName"		: a.companyName ? a.companyName : '-',
						"groupName"			: a.groupName ? a.groupName : '-',
						"website"			: a.website ? a.website : '-',
						"companyPhone"		: a.companyPhone ? a.companyPhone : '-',
						"companyEmail"		: a.companyEmail ? a.companyEmail : '-',
						"CIN"				: a.CIN ? a.CIN : '-',
						"COI"				: a.COI ? a.COI : '-',
						"TAN"				: a.TAN ? a.TAN : "-",
						"failedRemark"  	: a.failedRemark     ? a.failedRemark : '-' 
						// "role": a.contactPersons[i].role ? a.contactPersons[i].role : "-",
					}
				})
				 
				this.setState({
					goodRecordsTable    : tableData,
					failedRecordsTable  : failedRecordsTable
				},()=>{
					// console.log("goodRecordsTable => ", this.state.goodRecordsTable);
					// console.log("failedRecordsTable => ", this.state.failedRecordsTable);
				})
		 	}
		})
		.catch((error)=> { 
			console.log('error', error);
		}) 
 	} 

	/**============ bulkUpload() ===========*/
	bulkUpload() {
		$('.fullpageloader').show();
		var initialLmt  	= 0;
		var factor      	= 200;
		var endLmt      	= initialLmt+factor;
		var totalrows   	= this.state.inputFileData.length;
		var chunkData   	= [];
		var excelChunkData 	= [];

	 
		const startProcess = async (data)=>{
			for (var i = initialLmt; i < endLmt; i++) {
				if (this.state.inputFileData[i]) {
					chunkData.push(this.state.inputFileData[i]);
					//excelChunkData.push(excelData[i])   
				}
				//console.log('i',i)
				//console.log('endLmt',endLmt)
				if (i === endLmt-1 && i !== totalrows && chunkData.length>0) {
					var formValues = {
						data      		: chunkData,
						reqdata   		: {createdBy : this.state.user_ID},
						fileName  		: this.state.fileName,
						totalRecords 	: totalrows,
						updateBadData 	: i > factor ? false : true
						// reqdata   	: this.state.data,
					}; 
					console.log('formValue',formValues)
					// var formValues ={
					// "finaldata"     : chunkData,
					// "invalidData"   : invalidData,
					// "reqData"       : data,
					// "excelData"     : excelChunkData,
					// "totalRecords"  : totalRecords
					// }
					// console.log('this.state.url',this.state.url);
					await axios({
						method : 'post',
						url    : "/api/entitymaster/bulkUploadEntity",
						data   : formValues
					})
					.then((response)=> {
						console.log('responsebulk',response)
						if (response.data.completed) {							
							var percentage = Math.round((endLmt*100/totalrows))
							if (percentage > 99 ) {
								percentage = 100;
								
								$('.fullpageloader').hide();
								$('.filedetailsDiv').show();

								this.getFileDetails(this.state.fileName); 
								// this.state.getData(this.state.startRange, this.state.limitRange) 
							}
							this.setState({percentage : percentage},()=>{})
							chunkData   = [];
							initialLmt  += factor;  
							endLmt      = initialLmt+factor; 
						}
						this.setState({
							fileName : "",
						})
					})
				}
			}
		}
		startProcess(this.state.data);		
		// axios.post(this.state.url, formValues)
		//     .then((response) => {
						
		//         this.fileInput.value = '';
		//         this.setState({inputFileData:[]});
		//         swal({
		//           title : response.data.message,
		//           text  : response.data.message,
		//         })
												
		//         $('.filedetailsDiv').show()
		//         this.state.getFileDetails(this.state.fileName) 
		//     })
		//     .catch((error) => {
		//         console.log('error', error);
		//     })
	}
	/**============ getData() ===========*/
	getData(){}

	/**============ render() ===========*/
	render() {
		const SheetJSFT = [
			"xlsx",
			"xls",
			"csv"
		]
		return (
			//  <div className=" container-fluid">
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding NOpadding-right">
				<section className="content">
					{/* <Message messageData={this.state.messageData} /> */}
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
						<div className="row">
							<div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
								<div className="">
									<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 pull-left" >
											<h4 className="weighttitle NOpadding-right">Vendor Bulk Upload</h4>
										</div>														
									</div> 
			 						<Loader type="fullpageloader" percentage={this.state.percentage}/>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
										<h4 className="weighttitle col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">Bulk Upload</h4>
										<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
											<a title="click here to download sample file" href={this.state.fileurl} download>
												<img src="/images/Excel-download-icon.png" />
											</a>
										</div>
										<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
											<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<li>Please use attached file format for bulkupload into this system.</li>
												<li>Please do not change the Heading of following file.</li>
												<li>File format must be .xlsx or .xls.</li>
											</ul>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 bulkuploadFileouter">
										<input
											ref={el => this.fileInput = el}
											type="file"
											className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"
											accept={SheetJSFT}
											onChange={this.handleChange}
										/>
									</div>
									{this.state.inputFileData.length > 0 
									?
										<div className="col-lg-2 col-md-2 col-sm-4 col-xs-4" style={{marginTop:'1.6%'}}>
											<button className="submitBtnGo btn addBtn vendorBulkUploadBtn bulksubmitbtn"
											onClick={this.bulkUpload.bind(this)} >Submit</button>
										</div>           
									:
										<div className="col-lg-2 col-md-2 col-sm-4 col-xs-4" style={{marginTop:'1.6%'}}>
											<button className="submitBtn btn addBtn bulksubmitbtn"
														disabled>Submit</button>
										</div>        
									}
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 filedetailsDiv" style={{display:"none"}}>
									<br/>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent NoPadding">
										{this.state.fileDetails 
										?
											<div className="">
												<ul className="nav nav-tabs">
													<li className={this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length == 0 ? "active" : ""}><a data-toggle="tab" href={"#success"+this.state.goodDataCount}>Success</a></li>
													<li className={this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length > 0 ? "active" : ""}><a data-toggle="tab" href={"#failure"+this.state.failedRecordsCount}>Failure</a></li>
												</ul>
												<div className="tab-content">
													<h5>File Name: <span>{this.state.fileName}</span></h5>
													<div id={"failure"+this.state.failedRecordsCount} className={this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length> 0 ? "tab-pane fade in active" : "tab-pane fade"}>
														<h5>
															Out of {this.state.fileDetails ? this.state.fileDetails.totalRecords : null } {this.state.fileDetails && this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  &nbsp;
															{this.state.fileDetails.failedRecords 
															? 
																this.state.fileDetails.failedRecords.length 
															: 
																null
															} bad 
															{this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length > 1 ? " records were " : " record was " }found.
														</h5>
														<div className="text-right">
															<br/>
															<ReactHTMLTableToExcel
																id 			= "test-table-xls-button"
																className 	= "download-table-xls-button"
																table 		= {"failedtable"+this.state.failedRecordsCount}
																filename 	= "tablexls"
																sheet 		= "tablexls"
																buttonText 	= "Download as XLS"
															/>
															<br/>
														</div>  
														<div style={{overflowX: "auto"}}>
															<IAssureTable 
																tableHeading 	= {this.state.failedtableHeading}
																twoLevelHeader 	= {this.state.twoLevelHeader} 
																dataCount 		= {this.state.failedRecordsCount}
																tableData 		= {this.state.failedRecordsTable}
																tableObjects 	= {this.state.tableObjects}
															/>
															<table className="table" width="50%" id={"failedtable"+this.state.failedRecordsCount} style={{display:"none"}}>
																<thead>
																	<tr>
																	{
																		this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length > 0 && this.state.fileDetails.failedRecords[0] 
																		? 
																			Object.entries(this.state.fileDetails.failedRecords[0]).map( ([key, value], i)=> {
																				return(<th>{key}</th>);
																			}) 
																		: null
																	}
																	</tr>
																</thead>
																<tbody>
																{
																	this.state.fileDetails.failedRecords 
																	? 
																		this.state.fileDetails.failedRecords.map((data,index)=>{													
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
													<div id = {"success"+this.state.goodDataCount} className={this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length == 0 ? "tab-pane fade in active" : "tab-pane fade"}>
														<h5>
															{
																/*Out of {this.state.fileDetails.totalRecords} {this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  {this.state.fileDetails.goodrecords.length} {this.state.fileDetails.goodrecords.length > 1 ? "records are" : "record is" } added successfully. &nbsp;
															*/}
															Out of {this.state.fileDetails ? this.state.fileDetails.totalRecords : null } {this.state.fileDetails && this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  &nbsp;
															{this.state.fileDetails.goodrecords 
															? 
																this.state.fileDetails.goodrecords.length 
															: 
																0
															} { this.state.fileDetails && this.state.fileDetails.totalRecords > 1 ? " records" : " record"} Added Successfully.
														</h5>
														<div className="text-right">
															<br/>
															{console.log(this.state.goodRecordsHeading)}
															<ReactHTMLTableToExcel
																id 			= "test-table-xls-button1"
																className 	= "download-table-xls-button"
																table 		= {"gooddata"+this.state.goodDataCount}
																filename 	= "tablexls"
																sheet 		= "tablexls"
																buttonText 	= "Download as XLS"
															/>
															<br/>
														</div>  
														<div style={{overflowX: "auto"}}>  
															<IAssureTable 
																tableHeading 	= {this.state.goodRecordsHeading}
																twoLevelHeader 	= {this.state.twoLevelHeader} 
																dataCount 		= {this.state.goodDataCount}
																tableData 		= {this.state.goodRecordsTable}
																//getData={this.getData.bind(this)}
																tableObjects 	= {this.state.tableObjects}
															/>

															<table className="table" width="50%" id={"gooddata"+this.state.goodDataCount} style={{display:"none"}}>
																<thead>
																	<tr>
																	{
																		this.state.fileDetails.failedRecords && this.state.fileDetails.failedRecords.length > 0 && this.state.fileDetails.failedRecords[0] ? 
																		Object.entries(this.state.fileDetails.failedRecords[0]).map( ([key, value], i)=> {
																			return(<th>{key}</th>);
																		}) : null
																	}
																	</tr>
																</thead>
																<tbody>
																{
																	this.state.fileDetails.goodrecords ? 
																	this.state.fileDetails.goodrecords.map((data,index)=>{
																			{console.log("data",data)}
																		
																		return(
																			<tr key={index}>
																			{/*{ Object.entries(data).map( ([key, value], i)=> {
																					return(<td>{data[key]}</td>);
																				})
																			}*/}
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
											</div>  
										: 
											null
										}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}
export default BulkUpload;