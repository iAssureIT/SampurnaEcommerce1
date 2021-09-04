import React, { Component } 	from 'react'; import XLSX from "xlsx";
import axios 					from 'axios';
import swal 						from 'sweetalert';
import $ 							from 'jquery';
import Loader 						from '../../../../coreadmin/common/Loader/Loader.js';
import Message 					from '../../../../storeAdmin/message/Message.js';
import IAssureTable           from "../../../../coreadmin/IAssureTable/IAssureTable.jsx";
//import './BulkUpload.css';

class BulkUploadComponent extends Component{
	constructor(props) {
		super(props);
		this.state = {
			"inputFileData" 			: [],
			"finalData"					: [],
			"fileWarningError"		: false,
			tableData					: [],
			failedRecordsTable 		: [],
			tableHeading 				: {
													"section"         : 'Section',
													"category"        : 'Category',
													"categoryNameRlang" : "Category Name Reg Langauge",
													"brand"           : 'Brand',
													"brandNameRlang"  : "Brand Name Reg Langauge",
													"productName"     : 'Product Name',
													"productNameRlang": 'Product Name Reg Langauge',
													"productCode"     : 'Product Code',
													"itemCode"        : 'Item Code',
													"originalPrice"   : 'Original Price', 
													"discountedPrice" : 'Discounted Price', 
													"size"            : 'Size', 
													// "color"           : 'Color',  
			},
			failedtableHeading 		: {
													"remark"          : 'Remark',
													"section"         : 'Section',
													"category"        : 'Category',
													"categoryNameRlang" : "Category Name Reg Langauge",
													"brand"           : 'Brand',
													"brandNameRlang"  : "Brand Name Reg Langauge",
													"productName"     : 'Product Name',
													"productNameRlang": 'Product Name Reg Langauge',
													"productCode"     : 'Product Code',
													"itemCode"        : 'Item Code',
													"originalPrice"   : 'Original Price', 
													"discountedPrice" : 'Discounted Price', 
													"size"            : 'Size', 
													// "color"           : 'Color',  
			},
			tableObjects 				: {
													paginationApply : false,
													searchApply     : false,
													deleteMethod    : 'delete',
													apiLink         : '/api/products',
													editUrl         : '/add-product/'
			},
			startRange 					: 0,
			limitRange 					: 10
		}
		this.fileInput 	= React.createRef();
		this.handleChange = this.handleChange.bind(this);
		this.handleFile   = this.handleFile.bind(this);
	}

	/**=========== componentDidMount() =========== */
	componentDidMount() {
		var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
		var token         = userDetails.token;
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
		
		this.getVendorList();
		const user_ID = userDetails.user_id;
		this.setState({
			user_ID : user_ID
		});


		axios.get("/api/adminPreference/get")
		.then(preference =>{
			console.log("preference = ",preference.data);
			this.setState({
				websiteModel      : preference.data[0].websiteModel,
			},()=>{
				if(this.state.websiteModel === "MarketPlace"){
				}
			});
		})
		.catch(error=>{
			console.log("Error in getting adminPreference = ", error);
			if(error.message === "Request failed with status code 401"){
				localStorage.removeItem("userDetails");
				localStorage.clear();
				swal({  
					title : "Your Session is Expired.",                
					text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
				})
				.then(okay => {
					if (okay) {
						window.location.href = "/login";
					}
				});
			}
		})  
	}

	/**=========== componentWillReceiveProps() =========== */
  	componentWillReceiveProps(nextProps) {
  	/*axios
		  .get(this.props.fileDetailUrl+"products.xlsx")
		  .then((response)=> {
		  if (response) {
			 this.setState({
									 fileDetails:response.data,
									 failedRecordsCount : response.data.failedRecords.length,
									 goodDataCount : response.data.goodrecords.length
								});

								  var tableData = response.data.goodrecords.map((a, i)=>{
								  return{
										"remark"        : a.remark        ? a.remark    : '-',
										"section"       : a.section        ? a.section    : '-',
										"category"      : a.category     ? a.category : '-',
										"brand"         : a.brand     ? a.brand : '-',
										"productName"   : a.productName     ? a.productName : '-',
										"productCode"   : a.productCode     ? a.productCode : '-',
										"itemCode"      : a.itemCode     ? a.itemCode : '-',
										"productName"   : a.productName     ? a.productName : '-',
										"originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
										"discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-', 
										"size"   : a.size     ? a.size : '-', 
										"color"   : a.color     ? a.color : '-'
								  }
								})

								var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
								return{ 
									 "remark"        : a.remark        ? a.remark    : '-',
									 "section"       : a.section        ? a.section    : '-',
									 "category"      : a.category     ? a.category : '-',
									 "brand"         : a.brand     ? a.brand : '-',
									 "productName"   : a.productName     ? a.productName : '-',
									 "productCode"   : a.productCode     ? a.productCode : '-',
									 "itemCode"      : a.itemCode     ? a.itemCode : '-',
									 "productName"   : a.productName     ? a.productName : '-',
									 "originalPrice" : a.originalPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.originalPrice.toString() : '-',
									 "discountedPrice" : a.discountedPrice ? "<i class='fa fa-"+a.currency.toLowerCase()+"'></i> "+a.discountedPrice.toString() : '-',
									 "size"          : a.size     ? a.size : '-', 
									 "color"         : a.color     ? a.color : '-',
								}
								})
								this.setState({
									 tableData : tableData,
									 failedRecordsTable : failedRecordsTable
								})
		  }
		  })
		  .catch((error)=> { 
				  
		  })   
		 */
  	}
  	/**=========== handleChange() =========== */
	handleChange(e) {
		const files = e.target.files;
		if (files && files[0]){
			var fileName 	= files[0].name;
			var ext 			= fileName.split('.').pop();

			if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
				this.handleFile(files[0]);
				this.setState({ messageData : {} })
			}else{
				this.fileInput.value = '';

				this.setState({
					finalData 	: [],
					messageData : {
											"type" 			: "outpage",
											"icon" 			: "fa fa-exclamation",
											"message" 		: "Invalid file format.",
											"class" 			: "warning",
											"autoDismiss" 	: true
					}
				})			
			}
		}
	}
  
	/**=========== getData() =========== */
	getData(){
		return true;
	}

	/**=========== handleFile() =========== */
  	handleFile(file) {				
		// var format = /[!@#$%^&*()_+\-=[\]{};':"\\|,<>/?]/;
		var format = /^\s*$/;

		if (format.test(file.name)) {
			this.setState({ 
				fileWarningError 	: true, 
				finalData 			: [] 
			});
		} else {
			$('.fullpageLoader').show();
			this.setState({ 
				fileWarningError 	: false, 
				finalData 			: [],  
				fileName 			: file.name
			});
			const reader 	= new FileReader();
			const rABS 		= !!reader.readAsBinaryString;

			reader.onload 	= ({ target: { result } }) => {
				const wb 		= XLSX.read(result, { type: rABS ? "binary" : "array" });
				const wsname 	= wb.SheetNames[0];

				const ws 	= wb.Sheets[wsname];
				const data 	= XLSX.utils.sheet_to_json(ws, { header: 1 });

				var documentObj 	= [];
				let count 			= 0;
				this.setState({ inputFileData: data }, () => {
					/*var productCodeArray = [];
					for (var j=1; j <= this.state.inputFileData.length; j++){
					var record = this.state.inputFileData[j];
					let header = this.state.inputFileData[0];
					if (record !== undefined) {
					productCodeArray.push(record[header.indexOf('productCode')]);
					}
					} 
					productCodeArray = productCodeArray.filter((item, i, ar) => ar.indexOf(item) === i);
					console.log('productCodeArray',productCodeArray)*/

					var productCode = '';

					productCode = this.state.inputFileData[1][this.state.inputFileData[0].indexOf('productCode')];
					// loop on all the records in sheet
					for (var j = 1; j <= this.state.inputFileData.length; j++) {
						var record 				= this.state.inputFileData[j];
						var attributeArray 	= [];
						
						if (j === 1) {
							var previousRecord = this.state.inputFileData[j];
						} else {
							var previousRecord = this.state.inputFileData[j - 1];
						}

						let header = this.state.inputFileData[0];

						if (record !== undefined) {
							var k;
							// loop on header columns
							for (k in header) {
								if (!documentObj.hasOwnProperty(count)) {
									documentObj.push({ [header[k]]: record[k] });
								} else {
									if (header[k].startsWith("feature list")) {
										// console.log("record["+k+"]:",record[k]);
										if (typeof record[k] !== 'undefined' && record[k].trim() !== '') {

											var featuresArray 	= record[k].split("\n")
											var featuresString 	= "";

											featuresArray.map((data,ind)=>{
													
												featuresString += "<li>"+data+"</li>"
											})											
											documentObj[count]['featureList'] = featuresString;
										}
									}
									else if (header[k].startsWith("attribute")) {
										// console.log("record["+k+"]:",record[k]);
										// if (typeof record[k] !== 'undefined' && record[k].trim() !== '') {
											if (typeof record[k] !== 'undefined') {
											attributeArray.push({attributeName: header[k].replace(/^attribute +/i, ''), attributeValue: record[k]})
											documentObj[count]['attributes'] = attributeArray;
										}											
									}
									else if (header[k] === 'tags') {
										if (record[k] !== undefined) {
											documentObj[count]['tags'] = record[k].split(',');
										}
									}
									else if (header[k] === 'featured' || header[k] === 'exclusive'
										|| header[k] === 'newProduct' || header[k] === 'bestSeller'
										|| header[k] === 'taxInclude') {
										var tempflag = record[k] === 'yes' ? true : false
										documentObj[count][header[k]] = tempflag;
									}
									else {
										documentObj[count][header[k]] = record[k];
									}
									// console.log(" requireddata vendor props:",this.props.requiredData);
									// console.log("localStorage.getItem('admin_ID'):",localStorage.getItem('admin_ID'));
									// documentObj[count]['vendor'] = this.props.requiredData.vendor;
									documentObj[count]['filename'] 		= file.name;
									documentObj[count]['createdBy'] 	= this.state.user_ID;
									documentObj[count]['websiteModel'] 	= this.state.websiteModel;
									documentObj[count]['vendor_id'] 	= this.state.vendor;
								}
							}
							//attributeArray = [];
							count++;
						}
					}

					this.setState({ finalData: documentObj }, () => {
						console.log("final data------------:",this.state.finalData);
						$('.fullpageLoader').hide()
					});
				});
			};
			if (rABS) reader.readAsBinaryString(file);
			else reader.readAsArrayBuffer(file);
			//$('.submitBtn').prop('disabled',false);
		}
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

	/**=========== bulkUpload() =========== */
  	bulkUpload() {
		var formValues = this.state.finalData;
		// formValues.push(this.state.websiteModel);
		console.log("formValues in bulk",formValues);
		console.log("this.props.url",this.props.url);

		$('.fullpageLoader').show();
		if (!this.state.fileWarningError) {
			axios.post(this.props.url, formValues)
			.then((response) => {
				this.fileInput.value = '';
				this.setState({
					finalData 	: [],
					messageData : {
						"type" 			: "outpage",
						"icon" 			: "fa fa-exclamation",
						"message" 		: response.data.message,
						"class" 			: response.data.warning ? 'warning' : 'success',
						"autoDismiss" 	: false
					}
				})
				
				$('.filedetailsDiv').show()
				axios.post(this.props.fileDetailUrl,{"fileName":this.state.fileName})
				.then((response)=> {
					console.log("bulk response",response)
					$('.fullpageLoader').hide();  
					if (response) {
						this.setState({
							fileDetails 			: response.data,
							failedRecordsCount 		: response.data.failedRecords.length,
							goodDataCount 			: response.data.goodrecords.length
						});

						var tableData = response.data.goodrecords.map((a, i)=>{
							// console.log("goods record",a);
							return{
								"remark"        		: a.remark        		? a.remark    : '-',
								"section"       		: a.section        		? a.section    : '-',
								"category"      		: a.category     		? a.category : '-',
								"categoryNameRlang" 	: a.categoryNameRlang 	? "<span class='RegionalFont'>"+a.categoryNameRlang+"</span>" : '-',
								"brand"          		: a.brand     			? a.brand : '-',
								"brandNameRlang"		: a.brandNameRlang 		? "<span class='RegionalFont'>"+a.brandNameRlang+"</span>" : '-',
								"productName"   		: a.productName     	? a.productName : '-',
								"productNameRlang"		: a.productNameRlang 	? "<span class='RegionalFont'>"+a.productNameRlang+"</span>" : '-',
								"productCode"   		: a.productCode     	? a.productCode : '-',
								"itemCode"      		: a.itemCode     		? a.itemCode : '-',
								"originalPrice" 		: a.originalPrice 		? "<i class='fa fa-"+a.currency+"'></i> "+a.originalPrice.toString() : '-',
								"discountedPrice" 		: a.discountedPrice 	? "<i class='fa fa-"+a.currency+"'></i> "+a.discountedPrice.toString() : '-', 
								"size"   				: a.size     			? a.size : '-', 
								// "color"   : a.color     ? a.color : '-'
							}
						})

						var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
							return{
								"remark"        		: a.remark        		? a.remark    : '-',
								"section"       		: a.section        		? a.section    : '-',
								"category"      		: a.category     		? a.category : '-',
								"categoryNameRlang"		: a.categoryNameRlang 	? "<span class='RegionalFont'>"+a.categoryNameRlang+"</span>" : '-',
								"brand"         		: a.brand     			? a.brand : '-',
								"brandNameRlang"		: a.brandNameRlang 		? "<span class='RegionalFont'>"+a.brandNameRlang+"</span>" : '-',
								"productName"   		: a.productName     	? a.productName : '-',
								"productNameRlang"		: a.productNameRlang 	? "<span class='RegionalFont'>"+a.productNameRlang+"</span>" : '-',
								"productCode"   		: a.productCode     	? a.productCode : '-',
								"itemCode"      		: a.itemCode     		? a.itemCode : '-',
								"originalPrice" 		: a.originalPrice 		? "<i class='fa fa-"+a.currency+"'></i> "+a.originalPrice.toString() : '-',
								"discountedPrice" 		: a.discountedPrice 	? "<i class='fa fa-"+a.currency+"'></i> "+a.discountedPrice.toString() : '-',
								"size"          		: a.size     			? a.size : '-', 
								// "color"         : a.color     ? a.color : '-',
							}
						})
						this.setState({
							tableData : tableData,
							failedRecordsTable : failedRecordsTable
						})
					}
				})
				.catch((error)=> { 
					console.log("Error => ",error);
					if(error.message === "Request failed with status code 401"){
						localStorage.removeItem("userDetails");
						localStorage.clear();
						swal({  
							title : "Your Session is Expired.",                
							text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
						})
						.then(okay => {
							if (okay) {
								window.location.href = "/login";
							}
						});
					}
				})    
			})
			.catch((error) => {
				console.log("Error => ",error);
				if(error.message === "Request failed with status code 401"){
					localStorage.removeItem("userDetails");
					localStorage.clear();
					swal({  
						title : "Your Session is Expired.",                
						text  : "You Need to Login Again. Click 'OK' to Go to Login Page"
					})
					.then(okay => {
						if (okay) {
							window.location.href = "/login";
						}
					});
				}
			})
		}
	}

	/**=========== selectOption() =========== */
  	selectOption(event) {
		const target 	= event.target;
		const name 		= target.name;
		this.setState({
		 	[name]		: event.target.value.split("|")[2],
		 	messageData : {}
		});
	}

	/**=========== getVendorList() =========== */
	getVendorList() {
		axios.get("/api/entitymaster/get/vendor")
		.then((response) => {
			if(response){
				console.log("vendor bulk up response:",response);
				this.setState({
					vendorArray: response.data,
					vendor     : response.data._id
				})
				console.log("vendorArray:",this.state.vendorArray);
			}			
		})
		.catch((error) => {
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

	/**=========== render() =========== */
	render() {
		const SheetJSFT = [
			"xlsx",
			"xls",
			"csv"
		]
		console.log("required Data  => ", this.props.requiredData);
		console.log("vendorShow => ",this.props.requiredData.showVendor);
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<Loader type="fullpageloader" percentage={this.state.percentage}/>
				<Message messageData={this.state.messageData} />
				<div className="mt">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent montserrat">
						<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
							<a href={this.props.fileurl} download>
								<img src="/images/Excel-download-icon.png" alt="excel-icon" title="Download a Sample File" />
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
					{localStorage.getItem('roles') === 'admin' && this.props.requiredData && this.props.requiredData.showVendor
					?
						<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields marginTopp">
							<label>Vendor <i className="redFont">*</i></label>
							<select name="vendor" className="form-control allProductCategories vendorSelect" aria-describedby="basic-addon1" id="vendor" ref="vendor"
								onChange = {this.selectOption.bind(this)} 
								value 	= {this.state.vendor} 
							>
								<option disabled selected defaultValue="">Select Vendor</option>
								{this.state.vendorArray && this.state.vendorArray.length > 0 
								?
									this.state.vendorArray.map((data, index) => {
										return (
											// <option key={index} value={data.companyName + '|' + data.user_ID + '|' + data._id}>{data.companyName} - ({"VendorID : "+data.companyID})</option>
											<option key={index} value={data.companyName + '|' + this.state.user_ID + '|' + data._id}>{data.companyName} - ({"VendorID : "+data.companyID})</option>
										);
									})
								:
									<option disabled>{"No vendor added"}</option>
								}
							</select>
						</div>
					:
						null
					}
					<div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 bulkuploadFileouter">
						<input
							ref 				= {el => this.fileInput = el}
							type 				= "file"
							className 		= "col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"
							accept 			= {SheetJSFT}
							data-max-size 	= "2048"
							onChange 		= {this.handleChange}
						/>
						<div className="upldProdFileInstPre">
						<br />
							{this.state.fileWarningError 
							?
								<p className="fileWarningError" style={{ color: "red" }}>Filename should be proper. It should not contain any special character and spaces</p>
							: 
								null
							}
						</div>
					</div>
					{this.state.finalData.length > 0 
					?
						<div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 btnDiv">
							<button className="submitBtn btn btnSubmit button3 btnstyle"
								onClick={this.bulkUpload.bind(this)} >Submit
							</button>
						</div>
					:
						<div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 btnDiv">
							<button className="submitBtn btn btnSubmit btnstyle"
								disabled>Submit
							</button>
						</div>
					}
					</div>  
				

					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 filedetailsDiv">
					<br/>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent NoPadding">
						{/*{this.state.fileDetails ?*/}
							<div className="">
								<ul className="nav nav-tabs">
									<li className="active"><a data-toggle="tab" href="#success">Success</a></li>
									<li><a data-toggle="tab" href="#failure">Failure</a></li>
								</ul>
								<div className="tab-content">
									{this.state.fileDetails ? <h5>Filename: <span>{this.state.fileName}</span></h5> : null }
									<div id="failure" className="tab-pane fade in active">
									{this.state.fileDetails
										?
									<h5>
										Out of {this.state.fileDetails.totalRecords } {this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  &nbsp;
										{this.state.fileDetails.failedRecords.length} bad {this.state.fileDetails.failedRecords.length > 1 ? "records were " : "record was " }found.
									</h5>
									:
										null
									}
									{/* <div className="text-right">
									<br/>
									<ReactHTMLTableToExcel
										id="test-table-xls-button"
										className="download-table-xls-button"
										table="table-to-xls"
										filename="tablexls"
										sheet="tablexls"
										buttonText="Download as XLS"/>
										<br/>
									</div>   */}
									<div style={{overflowX: "auto"}}>

									<IAssureTable 
										tableHeading 	= {this.state.failedtableHeading}
										twoLevelHeader = {this.state.twoLevelHeader} 
										dataCount 		= {this.state.failedRecordsCount}
										tableData 		= {this.state.failedRecordsTable}
										getData 			= {this.getData.bind(this)}
										tableObjects 	= {this.state.tableObjects}
										/>
										
									</div>
									</div>
									<div id="success" className="tab-pane fade">
									{this.state.fileDetails
									?	
										<h5>
											Out of {this.state.fileDetails.totalRecords} {this.state.fileDetails.totalRecords > 1 ? "records" : "record"},  {this.state.fileDetails.goodrecords.length} {this.state.fileDetails.goodrecords.length > 1 ? "records are" : "record is" } added successfully. &nbsp;								
										</h5>
									:
										null
									}
										<IAssureTable 
											tableHeading 	= {this.state.tableHeading}
											twoLevelHeader = {this.state.twoLevelHeader} 
											dataCount 		= {this.state.goodDataCount}
											tableData 		= {this.state.tableData}
											getData 			= {this.getData.bind(this)}
											tableObjects 	= {this.state.tableObjects}
										/>
										{/*<table className="table" width="50%" id="table-to-xls">
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
										</table>*/}
									</div>							
								</div>
							</div>  
						{/*: 
							null
						}*/}
					</div>
				</div>
			</div>
		)
	}
}
export default BulkUploadComponent;