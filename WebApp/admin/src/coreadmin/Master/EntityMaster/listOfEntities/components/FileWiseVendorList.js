import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";

import _                      from 'underscore';
// import '../css/fileproductList.css';

class FileWiseVendorList extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
		  fileNameNCountData : [],
		  tableHeading:{
			"fileName"     : "File Name",
			"vendorCount"  : "Vendor Count",
			"actions"      : "Action"
		  },
		  "tableObjects"              : {
			  deleteMethod              : 'delete',
			  apiLink                   : '/api/entitymasters/file',
			  paginationApply           : true,
			  searchApply               : true,
			},
		  startRange : 0,
		  limitRange : 10
	  };
	  window.scrollTo(0, 0);
	}
	componentWillReceiveProps(nextProps) {
	  this.getCount();
	  this.getData(this.state.startRange, this.state.limitRange);
	}
	componentDidMount() {
	  var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
	  var token       = userDetails.token;
	  axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;   

	  this.getCount();
	  this.getData(this.state.startRange, this.state.limitRange);
	  
	}
	deleteFileWiseProduct(event){

	}
	getSearchText(searchText){ 
	  var data = {
		filename : searchText,
	  }
	  axios.post('/api/entitymaster/get/searchfile', data)
	  .then((response)=>{
		console.log(response);
		var tableData = response.data.map((a, i)=>{
		  return {
			fileName        : a.fileName !== null ? a.fileName  : "-", 
			vendorCount     : a.vendorCount !== NaN ? "<p>"+a.vendorCount+"</p>" : "a", 
			_id             : a._id !== null ? a._id  : "-", 
		  }
		})
		// console.log('tableData', tableData)
		this.setState({
		  tableData : tableData
		})
	  })
	  .catch((error)=>{
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
	getData(startRange, limitRange){
	  var data = {
		startRange : startRange,
		limitRange : limitRange
	  }
	  axios.post('/api/entitymaster/get/files', data)
	  .then((response)=>{
		console.log(response);
		var tableData = response.data.map((a, i)=>{
		  return {
			fileName 		: a.fileName !== null ? a.fileName  : "-", 
			vendorCount 	: a.vendorCount !== NaN ? "<p>"+a.vendorCount+"</p>" : "a", 
			_id 			: a._id !== null && a._id !== "undefined" ? a._id  : "-", 
		  }
		})
		console.log('tableData', tableData)
		this.setState({
		  tableData : tableData
		})
	  })
	  .catch((error)=>{
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
	getCount(){
	  axios.get('/api/products/get/files/count')
	  .then((response)=>{
		// console.log(response.data)
		this.setState({
		  dataCount : response.data
		})
	  })
	  .catch((error)=>{
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
	render(){
		return(
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
			  <div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp">
				<div className="formWrapper">
				  <section className="content">
					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
					  <div className="row">
						<div className="">
						   <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
							  <h4 className="weighttitle NOpadding-right"> File Wise Product List</h4>
						  </div>
						
						  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp fileProductList">
							<IAssureTable 
							  tableHeading 		= {this.state.tableHeading}
							  twoLevelHeader 	= {this.state.twoLevelHeader} 
							  dataCount 		= {this.state.dataCount}
							  tableData 		= {this.state.tableData}
							  getData 			= {this.getData.bind(this)}
							  tableObjects 		= {this.state.tableObjects}
							  getSearchText 	= {this.getSearchText.bind(this)}
							/>
						  </div>
						</div>
					  </div>
					</div>
				  </section>
				</div>
				</div>
			  </div>
			</div>
		);
	}
}
export default FileWiseVendorList ;
