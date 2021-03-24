import React from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import AddFilePublic from "./AddFile.js";

export default class JobApplication extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			candidateName: "",
			dob: "",
			expectedCTC: "",
			noticePeriod: "",
			currentCTC: "",
			uploadResume: "",
			applyingforjob: "",
			currentCity: "",
			phoneNo: "",
			email: "",

			"config": "",
			"author": "",
			"ListOfjobs": "",
			"caseStudy_Image": "",
			"CheckFile": false,
			"caseStudy_File": "",
			"configData": "",
			"fileArray": [],
			"imageArray": "",
			"fileType": "",
			"action": "",
			"filenames": []

		}
	}
	/*	handleChange(){
	
		}*/
	handleChange(event) {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	Submit() {
		var formValues = {
			candidateName: this.state.candidateName,
			DOB: this.state.dob,
			expectedCTC: this.state.expectedCTC,
			noticePeriod: this.state.noticePeriod,
			currentCTC: this.state.currentCTC,
			uploadResume: this.state.fileArray[0].filePath,
			phoneNo: this.state.phoneNo,
			email: this.state.email,
			applyingforjob: this.state.arrayValues,
			currentCity: this.state.currentCity,

		};
		// console.log("formValues ==>",formValues);
		console.log("formValues Job Application==>", formValues);
		axios
			.post('/api/jobapplicationform/post', formValues)
			.then((response) => {
				// handle success
				console.log("response", response.data);
				swal(" Your Application is submitted.");


			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});


	}
	getListOfJobs() {
		/*/get/list*/
		axios
			.get('/api/jobform/get/list')
			.then((response) => {
				console.log("response job List ==", response.data);
				this.setState({
					ListOfjobs: response.data
				});
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}
	componentDidMount() {
		var configData = this.props.configData;
		var fileType = this.props.fileType;
		this.getListOfJobs();

		this.setState({
			fileType: fileType
		}, () => { console.log("fileType", this.state.fileType) })
		axios
			// .get('http://cofficapi.iassureit.com/api/projectSettings/single/S3')
			.get('/api/projectsettings/get/S3')
			.then((response) => {
				// console.log("response",response);

				const config = {
					bucketName: response.data.bucket,
					dirName: "iOG",
					region: response.data.region,
					accessKeyId: response.data.key,
					secretAccessKey: response.data.secret,
				}
				this.setState({
					config: config
				}, () => {
					// console.log("config",this.state.config)
				})
			})
			.catch(function (error) {
				console.log(error);
				if (error.message === "Request failed with status code 401") {
					swal("Your session is expired! Please login again.", "", "error");
					this.props.history.push("/");
				}
			})
	}


	uploadFiles(event) {
		event.preventDefault();
		let self = this;
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			var file = event.currentTarget.files[0];
			var newFileName = JSON.parse(JSON.stringify(new Date())) + "_" + file.name;
			var newFile = new File([file], newFileName);
			this.setState({
				newFile: newFile,
			})
			if (newFile) {
				// console.log("config--------------->",this.state.config);
				var ext = newFile.name.split('.').pop();

				if (ext === "DOC" || ext === "DOCX" || ext === "PDF" || ext === "XLS" || ext === "XLSX" || ext === "PPT" || ext === "PPTX" || ext === "TXT" ||
					ext === "doc" || ext === "docx" || ext === "pdf" || ext === "xls" || ext === "xlsx" || ext === "ppt" || ext === "pptx" || ext === "txt") {
					if (newFile) {
						S3FileUpload
							.uploadFile(newFile, this.state.config)
							.then((Data) => {
								// console.log("Data = ",Data);
								// console.log("newFile = ",newFile.name);
								var fileName = file.name;
								var obj2 = {
									fileName: fileName
								}
								var obj1 = {
									filePath: Data.location,
									fileName: fileName

								}
								var filenames = this.state.filenames;
								var fileArray = this.state.fileArray;
								filenames.push(obj2);
								fileArray.push(obj1);
								this.setState({
									ext: ext,
									CheckFile: true,
									filenames: filenames,
									fileArray: fileArray
								}, () => {
									console.log("filenames", this.state.fileArray);
									this.props.getFile(this.state.fileArray, this.state.filenames, this.state.imageArray)
									console.log("fileArray", this.state.fileArray)
									var fileLocation = JSON.stringify(this.state.fileArray);
									localStorage.setItem("fileLocation", fileLocation);
								})
							})
							.catch((error) => {
								console.log("formErrors");
								console.log(error);
							})
					} else {
						swal("File not uploaded", "Something went wrong");
					}
				} else {
					swal("Please upload file", "Only Upload  File format (jpg,png,jpeg)");
				}
			}
		}
	}
	getFile(fileArray, filenames, imageArray) {
		console.log("fileArray", fileArray, "filenames", filenames, "imageArray", imageArray)
		this.setState({
			"fileArray": fileArray,
			"filenames": filenames,
			"imageArray": imageArray,
		}, () => {

		})
	}

	deleteFile(e) {
		e.preventDefault();
		var index = e.target.getAttribute('id');
		var filePath = e.target.getAttribute('data-id');
		console.log("this.state.fileArray", this.state.fileArray, "index", index, "filePath", filePath);
		var index = e.currentTarget.getAttribute('id');
		var filePath = e.currentTarget.getAttribute('data-id');
		var data = filePath.split("/");
		var imageName = data[4];
		if (index) {
			swal({
				title: "Are you sure you want to delete this image?",
				text: "Once deleted, you will not be able to recover this image!",
				/* icon: "warning",*/
				buttons: true,
				dangerMode: true,
			})
				.then((willDelete) => {
					if (willDelete) {
						var fileArray = this.state.fileArray; // make a separate copy of the array
						fileArray.splice(index, 1);
						swal("abc", "File deleted successfully");
						this.setState({
							fileArray: fileArray
						}, () => {
						});
					} else {
						swal("Are you sure you want to deletimageArraye this image?", "Your image is safe!");
					}
				});
		}
	}


	uploadrepetGImg() {

	}
	deleteRGBlockimage() {

	}
	getCheckValue(event) {
		var id = event.target.id;
		var checked = event.target.checked;
		var name = event.target.name;
		var value = event.target.value;
		var array = [];
		console.log(document.querySelectorAll("[id='checkboxID']"));
		var allCB = document.querySelectorAll("[id='checkboxID']");
		for (var i = 0; i < allCB.length; i++) {
			if (allCB[i].checked) {
				array.push(allCB[i].value);
			}
		}
		this.setState({
			arrayValues: array,
		})
		/* if (checked === true) {
			 let filteredCheckBox = array.filter( function (user) {
			 
				 return user
				 })
			 console.log("filteredCheckBox",filteredCheckBox);
			 if (filteredCheckBox) {
					array.push(value);
			 console.log("array push",array);
			 }
		 
		 }
			else {
			 let filteredCheckBox = array.filter( function (user) {
			 return user==value
			 }).length !== 0
		 if (filteredCheckBox) {
					array.pop(value);
					console.log("after pop array",array);
		 }
		 }*/
	}
	render() {
		return (
			<div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m20">
					<h1 className="text-center"> Job Application Form</h1>
					<div className="col-lg-12 col-md-12">
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Candidate full name<span className="astrick"></span></label>
									<input type="text" ref="candidateName" id="candidateName" value={this.state.candidateName} name="candidateName" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">DOB<span className="astrick"></span></label>
									<input type="date" ref="dob" id="dob" value={this.state.dob} name="dob" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
						</div>
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Email<span className="astrick"></span></label>
									<input type="text" ref="email" id="email" value={this.state.email} name="email" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Phone No<span className="astrick"></span></label>
									<input type="text" ref="phoneNo" id="phoneNo" value={this.state.phoneNo} name="phoneNo" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
						</div>
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Current City<span className="astrick"></span></label>
									<input type="text" ref="currentCity" id="currentCity" value={this.state.currentCity} name="currentCity" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Notice Period<span className="astrick"></span></label>
									<input type="text" ref="noticePeriod" id="noticePeriod" value={this.state.noticePeriod} name="noticePeriod" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>

						</div>
						<div className="row mtop20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Current CTC<span className="astrick"></span></label>
									<input type="text" ref="currentCTC" id="currentCTC" value={this.state.currentCTC} name="currentCTC" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Expected CTC<span className="astrick"></span></label>
									<input type="text" ref="expectedCTC" id="expectedCTC" value={this.state.expectedCTC} name="expectedCTC" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.handleChange.bind(this)} />
								</div>
							</div>
						</div>
						<div className="row mt20">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Applying for job<span className="astrick"></span></label>
									{
										this.state.ListOfjobs
											?
											this.state.ListOfjobs && this.state.ListOfjobs.length > 0 ?
												this.state.ListOfjobs.map((result, index) => {
													// console.log('result', result);
													return (
														<div class="checkbox" key={index}>
															<label>
																<input type="checkbox" name={result.jobTitle} id="checkboxID" value={result.jobTitle} onClick={this.getCheckValue.bind(this)} required />{result.jobTitle + "(" + result.jobDescription + ")"}
															</label>
														</div>
													)
												})
												:
												null
											:
											null
									}

								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<div className="form-group">
									<label className="label-category">Upload Resume<span className="astrick"></span></label>
									{/*									<input type="file" ref="uploadResume" id="uploadResume" value={this.state.uploadResume} name="uploadResume"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30" onChange={this.uploadFiles.bind(this)} />
	*/}								 <AddFilePublic
										getFile={this.getFile.bind(this)}
										configData={this.state.configData}
										fileArray={this.state.fileArray}
										imageArray={this.state.imageArray}
										fileType="File"
									/>
								</div>
							</div>




						</div>

						{/*<div className="row  marginTop17">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17">
							    <label className="label-category marginTop17">Block Content<span className="astrick"></span></label>
							    <div className="">
			                      	<CKEditor
				                        data={this.state.repBlockContent}
				                        onChange={this.onEditorChangeINGroupBlock.bind(this)} />
			                    </div>
							</div>
						</div>*/}

						<button type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.Submit.bind(this)}>Submit</button>
					</div>
				</div>
			</div>
		);
	}
}
