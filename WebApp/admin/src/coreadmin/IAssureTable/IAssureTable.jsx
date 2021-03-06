import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
// import swal from 'sweetalert';
import Swal from 'sweetalert2'
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';
import './IAssureTable.css';
import './print.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
var sum = 0;

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

class IAssureTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			 "date" 	 : moment(new Date()).format("YYYY-MM-DD_h:mm:ss"),
			"currentView" : props.currentView,
			"dataCount": props && props.dataCount ? props.dataCount : [],
			"tableData": props && props.tableData ? props.tableData : [],
			"tableName": props && props.tableName ? props.tableName : [],
			"tableHeading": props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader": props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"tableObjects": props && props.tableObjects ? props.tableObjects : {},
			"deleteMethod": props && props.deleteMethod ? props.deleteMethod : {},
			"redirectToURL": props && props.tableObjects ? props.tableObjects.redirectToURL : true,
			isLoading               : props.isLoading,
			"id": props && props.id ? props.id : {},
			"reA": /[^a-zA-Z]/g,
			"reN": /[^0-9]/g,
			"sort": true,
			"examMasterData2": '',
			"activeClass": 'activeCircle',
			"paginationArray": [],
			"startRange": 0,
			"limitRange": 10,
			// "activeClass": 'activeCircle',
			"normalData": true,
			"printhideArray": [],
		}

		this.delete = this.delete.bind(this);
		this.printTable = this.printTable.bind(this);
		if (props.tableHeading) {
			var tableHeading = Object.keys(props.tableHeading);
			var index = 0;
			if (props.twoLevelHeader) {
				if (props.twoLevelHeader.firstHeaderData && props.twoLevelHeader.firstHeaderData.length > 0) {
					for (let j = 0; j < props.twoLevelHeader.firstHeaderData.length; j++) {
						var mergCol = props.twoLevelHeader.firstHeaderData[j].mergedColoums;
						if (j === 1) {
							mergCol--;
						}

						for (let k = 0; k < mergCol; k++) {
							if (props.twoLevelHeader.firstHeaderData[j].hide) {
								var phElem = { col: tableHeading[index], printhide: "printhide" };
							} else {
								var phElem = { col: tableHeading[index], printhide: "" };
							}

							this.state.printhideArray.push(phElem);
							index++;
						}
					}

					if (index === tableHeading.length) {
					}

				}
			}
		}
	}
	componentDidMount() {
		// console.log("props => ",this.props)
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
		$("html,body").scrollTop(0);
		// console.log("this.state.date",this.state.date)
		const center_ID = localStorage.getItem("center_ID");
		const centerName = localStorage.getItem("centerName");
		this.setState({
			center_ID: center_ID,
			centerName: centerName,
		}, () => {
			this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
		});

		this.setState({
			tableHeading: this.props.tableHeading,
			tableData: this.props.tableData,
			tableName: this.props.tableName,
			dataCount: this.props.dataCount,
			id: this.props.id,
			isLoading 		: this.props.isLoading,
		},()=>{
			// console.log("dataCount did mount => ",this.state.dataCount)
		});
		$("#table-to-xls").attr('title', 'Download Table');
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.id,
			tableData: nextProps.tableData,
			tableName: nextProps.tableName,
			dataCount: nextProps.dataCount,
			isLoading 		: nextProps.isLoading,
		}, () => {
			this.paginationFunction();
			// console.log("dataCount => ",this.state.dataCount)
		})
		$("#table-to-xls").attr('title', 'Download Table');
	}
	componentWillUnmount() {
		$("script[src='/js/adminSide.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}
	edit(event) {
		event.preventDefault();
		$("html,body").scrollTop(0);
		var tableObjects = this.props.tableObjects;
		var id = event.target.id;
		this.props.history.push(tableObjects.editUrl + "/" + id);
	}
	// delete(e) {
	// 	e.preventDefault();
	// 	var tableObjects = this.props.tableObjects;
	// 	let id = (e.target.id).replace(".", "/");
	// 	id = (e.target.id).replace(" ", "S");
	// 	console.log("delete id => ",id)
	// 	axios({
	// 		method: tableObjects.deleteMethod,
	// 		url: tableObjects.apiLink + '/delete/'+id,
	// 		data : {"id":e.target.id}
	// 	}).then((response) => {
	// 		console.log("delete response => ",response.data)
	// 		this.props.getData(this.state.startRange, this.state.limitRange);
	// 		if(!this.state.redirectToURL){
	// 		}else{				
	// 			this.props.history.push(tableObjects.editUrl);
	// 		}
	// 		swal({
	// 			title : " ",
	// 			text  : response.data.message ? response.data.message : "Record deleted successfully!",
	// 		});
	// 		// window.location.reload();

	// 		// this.props.getData(this.state.startRange, this.state.limitRange);
	// 	}).catch((error) => {
	// 	});
	// }
	delete(event) {
		event.preventDefault();
		var tableObjects = this.props.tableObjects;
		console.log("event.target.id = ",event.target)
		let id = event.target.id;

		console.log("id = ",id)
		swalWithBootstrapButtons.fire({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Yes, delete it!',
		  cancelButtonText: 'No, cancel!',
		  reverseButtons: true
		}).then((result) => {
		  if (result.isConfirmed) {
		  	axios({
				method: tableObjects.deleteMethod,
				url: tableObjects.apiLink + '/delete/'+id,
				data : {"id":id}
			}).then((response) => {
				console.log("delete response => ",response.data)
				this.props.getData(this.state.startRange, this.state.limitRange);
				if(!this.state.redirectToURL){
				}else{				
					this.props.history.push(tableObjects.editUrl);
				}
				swalWithBootstrapButtons.fire(
			      'Deleted!',
			      'Your record has been deleted.',
			      'success'
		    )
				// window.location.reload();

				// this.props.getData(this.state.startRange, this.state.limitRange);
			}).catch((error) => {
				console.log("error => ",error);
				Swal.fire({
				  icon: 'error',
				  title: 'Oops...',
				  text: 'Something went wrong!'
				})
			});
		    
		  } else if (
		    /* Read more about handling dismissals below */
		    result.dismiss === Swal.DismissReason.cancel
		  ) {
		    swalWithBootstrapButtons.fire(
		      'Cancelled',
		      'Your record is safe :)',
		      'error'
		    )
		  }
		})
		
	}
	sortNumber(key, tableData) {
		var nameA = '';
		var nameB = '';
		var reA = /[^a-zA-Z]/g;
		var reN = /[^0-9]/g;
		var aN = 0;
		var bN = 0;
		var sortedData = tableData.sort((a, b) => {
			Object.entries(a).map(
				([key1, value1], i) => {
					if (key === key1) {
						nameA = value1.replace(reA, "");
					}
				}
			);
			Object.entries(b).map(
				([key2, value2], i) => {
					if (key === key2) {
						nameB = value2.replace(reA, "");
					}
				}
			);
			if (this.state.sort === true) {
				this.setState({
					sort: false
				})
				if (nameA === nameB) {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								aN = parseInt(value1.replace(reN, ""), 10);
							}
						}
					);

					Object.entries(b).map(
						([key1, value1], i) => {
							if (key === key1) {
								bN = parseInt(value1.replace(reN, ""), 10);
							}
						}
					);

					if (aN < bN) {
						return -1;
					}
					if (aN > bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				}
			} else if (this.state.sort === false) {
				this.setState({
					sort: true
				})
				if (nameA === nameB) {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								aN = parseInt(value1.replace(reN, ""), 10);
							}
						}
					);

					Object.entries(b).map(
						([key1, value1], i) => {
							if (key === key1) {
								bN = parseInt(value1.replace(reN, ""), 10);
							}
						}
					);

					if (aN > bN) {
						return -1;
					}
					if (aN < bN) {
						return 1;
					}
					return 0;

				} else {

					if (nameA > nameB) {
						return -1;
					}
					if (nameA < nameB) {
						return 1;
					}
					return 0;
				}
			}
		});
		this.setState({
			tableData: sortedData,
		});
	}
	sortString(key, tableData) {
		var nameA = '';
		var nameB = '';
		var sortedData = tableData.sort((a, b) => {
			Object.entries(a).map(
				([key1, value1], i) => {
					if (key === key1) {
						if (jQuery.type(value1) === 'string') {
							nameA = value1.toUpperCase();
						} else {
							nameA = value1;
						}
					}
				}
			);
			Object.entries(b).map(
				([key2, value2], i) => {
					if (key === key2) {
						if (jQuery.type(value2) === 'string') {
							nameB = value2.toUpperCase();
						} else {
							nameB = value2;
						}
					}
				}
			);
			if (this.state.sort === true) {
				this.setState({
					sort: false
				})
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			} else if (this.state.sort === false) {
				this.setState({
					sort: true
				})
				if (nameA > nameB) {
					return -1;
				}
				if (nameA < nameB) {
					return 1;
				}
				return 0;
			}
		});
		this.setState({
			tableData: sortedData,
		});
	}
	sort(event) {
		event.preventDefault();
		var key = event.target.getAttribute('id');
		var tableData = this.state.tableData;
		if (key === 'number') {
			this.sortNumber(key, tableData);
		} else {
			this.sortString(key, tableData);
		}
	}
	paginationFunction(event) {
		// var dataLen = this.state.dataCount > 20 || this.state.dataCount === 20 ? 20 : this.state.dataCount;
		var dataLength = this.state.dataCount;
		this.setState({
			dataLength : dataLength,
		}, () => {
			// $('li').removeClass('activeCircle');
			// $(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage 	= this.state.limitRange;
			var paginationNum 		= dataLength / maxRowsPerPage;
			var pageCount 			= Math.ceil(paginationNum)  > 20 ? 20 : Math.ceil(paginationNum);

			var paginationArray = [];
			for (var i = 1; i <= pageCount; i++) {
				var countNum 	= maxRowsPerPage * i;
				var startRange 	= countNum - maxRowsPerPage;
				if (i === 1) {
					var activeClass = 'activeCircle';
				} else {
					var activeClass = '';
				}
				paginationArray.push(
					<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={maxRowsPerPage + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
				);
			}
			if (pageCount >= 1) {
				this.setState({
					paginationArray : paginationArray,
				}, () => {});
			}
			return paginationArray;
		});
	}
	getStartEndNum(event) {
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2 = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		this.props.getData(startRange, limitRange);
		this.setState({
			startRange: startRange,
		});
		$('li').removeClass('activeCircle');
		$(event.target).addClass('activeCircle');
		var counter = $(event.target).text();
	}
	setLimit(event) {
		event.preventDefault();
		var limitRange = parseInt(this.refs.limitRange.value);
		var startRange = 0;
		this.setState({
			"limitRange": limitRange,
			"startRange": 0

		}, () => {
			this.paginationFunction();
			if (this.state.normalData === true) {
				this.props.getData(startRange, this.state.limitRange);
			}
			if (this.state.searchData === true) {
				// this.tableSearch();
			}
		});
	}
	tableSearch(event) {
		var searchText = this.refs.tableSearch.value;
		console.log("searchText",searchText)
		// if (searchText && searchText.length !== 0) {
		// 	console.log("in if",searchText && searchText.length !== 0)

		// 	this.setState({
		// 		"normalData": false,
		// 		"searchData": true,
		// 	}, () => {
				this.props.getSearchText(searchText);
		// 	});
		// } else {
		// 	this.props.getData(this.state.startRange, this.state.limitRange);
		// }
	}
	showNextPaginationButtons() {
		var beforeDataLength = this.state.dataLength > 0 ? this.state.dataLength : 20;
		if (beforeDataLength !== this.state.dataCount) {
			this.setState({
				dataLength: (beforeDataLength + 20) > this.state.dataCount ? this.state.dataCount : (beforeDataLength + 20),
			}, () => {
				$('li').removeClass('activeCircle');
				$(".queDataCircle:first").addClass('activeCircle');
				const maxRowsPerPage = this.state.limitRange;
				var dataLength = this.state.dataLength;
				var paginationNum = parseInt(dataLength) / maxRowsPerPage;
				var pageCount = Math.ceil(paginationNum);

				var paginationArray = [];

				for (var i = beforeDataLength + 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === beforeDataLength + 1) {
						var activeClass = 'activeCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			});
		}
	}
	showPreviousPaginationButtons() {
		var beforeDataLength = this.state.dataLength;

		this.setState({
			dataLength: beforeDataLength > 20 ? beforeDataLength - this.state.paginationArray.length : 0,
		}, () => {
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];
				var forLoop = (beforeDataLength - this.state.paginationArray.length) < 0 ? 1 : beforeDataLength - this.state.paginationArray.length;
				for (var i = forLoop - 19; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === beforeDataLength - 39 || i === 1) {
						var activeClass = 'activeCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			}
		});
	}
	showFirstTweentyButtons() {
		var beforeDataLength = this.state.dataCount;

		this.setState({
			dataLength: 20,
		}, () => {
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i = 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === 1) {
						var activeClass = 'activeCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			}
		});
	}
	showLastTweentyButtons() {
		var beforeDataLength = this.state.dataLength;

		this.setState({
			dataLength: this.state.dataCount,
		}, () => {
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i = (this.state.dataCount - 20) + 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === 1 || i === (this.state.dataCount - 20) + 1) {
						var activeClass = 'activeCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			}
		});
	}
	printTable(event) {
		event.preventDefault();
		 $('.marginTopp').hide();
		 $('.box-header').hide();
		 $('.sideways').hide();
		 $('.downloadBtns').hide();
		 $('.pagignationDiv').hide();
		  // $('.table-responsive').show();
		 var printContents = document.getElementById('pdfWrap').innerHTML;
		 window.print(printContents);
		  $('.marginTopp').show();
		  $('.box-header').show();
		  $('.sideways').show();
		  $('.downloadBtns').show();
		  $('.pagignationDiv').show();
		  // $('.table-responsive').show(); 


	}

	
	render() {
		const ref = React.createRef();
		// console.log("currentView",this.state.currentView)
		return (
			<div id="tableComponent" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				{
					this.state.tableObjects.searchApply === true ?
						<div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 marginTop8 NOpadding-right pull-right">

							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform">Search</label>
							<div className="input-group">
								<input type="text" className="NOpadding-right form-control" ref="tableSearch" id="tableSearch" name="tableSearch" />
								<span className="input-group-addon " onClick={this.tableSearch.bind(this)}><i className="fa fa-search"></i></span>
							</div>
						</div>
						:
						null
				} 
				{/* {console.log("T",this.state.tableName)} */}
				{/* {this.state.tableObjects.downloadApply === true ? */}
					{/* this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length !== 0 ? */}
					{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"> */}

						{/* <React.Fragment>
							<div className="col-lg-1 col-lg-offset-9 col-md-1 col-xs-12 col-sm-12  NoPadding downloadBtns pull-right "id="pdfWrap" iref={ref}>
								<button type="button" className=" pull-left tableprintincon" title="Print Table" onClick={this.printTable}><i className="fa fa-print" aria-hidden="true"></i></button>
								<ReactHTMLTableToExcel
									id={this.state.currentView && this.state.currentView !== "undefined"  ? this.state.currentView  : "table-to-xls"}
									className={this.state.currentView +" download-table-xls-button fa tableicons pull-right"}
									// className="download-table-xls-button fa tableicons pull-right"
									table={"Download-"+this.state.currentView}
									sheet="tablexls"
									filename={this.state.tableName ? this.state.tableName+'-'+this.state.date : 'table-'+this.state.date}
									buttonText={<i class="fa fa-download" aria-hidden="true"></i>}
								/>
							</div>
						</React.Fragment> */}
						{/* : null

					: null
				} */}
				{
					this.state.tableObjects.paginationApply === true ?
						<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding pagignationDiv">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop8 NOpadding formLable">Data Per Page</label>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding  input-group">
									<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12 noPadding  form-control">
										<option value="Not Selected" disabled>Select Limit</option>
										<option value={10}>10</option>
										<option value={25}>25</option>
										<option value={50}>50</option>
										<option value={100}>100</option>
										<option value={500}>500</option>
									</select>
								</div>
							</div>
						</div>
						:
						null
				}
			    {/* </div> */}
				<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop8">
					<div className={"table-responsive "+this.state.currentView} id={this.state.currentView ? this.state.currentView :"section-to-print"}>
						<table className={"table iAssureITtable-bordered table-striped table-hover fixedTable "+this.props.tableDndClass} id={this.state.id} >
							<thead className="tempTableHeader fixedHeader">
								<tr className="tempTableHeader">
									{this.state.twoLevelHeader.apply === true ?
										this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
											return (
												<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>
											);
										})
										:
										null
									}
								</tr>
								<tr className="">
									<th className="umDynamicHeader srpadd text-center">Sr. No.</th>
									{this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map(
											([key, value], i) => {
												if (key === 'actions') {
													return (
														<th key={i} className="umDynamicHeader  srpadd text-center" id="ActionContent">{value}</th>
													);
												} else {
													return (
														<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} 
															{/* <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span> */}
														</th>
													);
												}

											}
										)
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
								</tr>
							</thead>
							<tbody className="scrollContent">
								{this.state.isLoading
	                  	?
	                  		<tr className="trAdmin">
	                     		<td colSpan={Object.keys(this.state.tableHeading).length+1} className="noTempData textAlignCenter">
	                     			<div className="container">
    											<div className="row">
								               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center dataLoaderWrapper">
								                	<p>Loading</p>
								                	<span>Data is Loading. Just a moment please...</span><br/>
								                	<div className="dataLoader">
														   <span></span>
														   <span></span>
														   <span></span>
														   <span></span>
														   <span></span>
														</div>
													</div>
												</div>
											</div>
	                     		</td>
	                  		</tr>
	                  	:
									this.state.tableData && this.state.tableData.length > 0 ?
									this.state.tableData.map(
										(value, i) => {
											return (
												<tr key={i} className="">
													<td className="textAlignCenter">{this.state.startRange + 1 + i}</td>
													{
														Object.entries(value).map(
															([key, value1], i) => {

																if ($.type(value1) === 'string') {
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex, '') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if (aN && $.type(aN) === 'string') {
																		var textAlign = 'textAlignLeft noWrapText'
																	} else {
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		// console.log("bn",bN)
																		if (bN) {
																			{/*console.log("1. textAlignRight => ",value1)*/}
																			var textAlign = 'textAlignRight';
																		} else if(bN === 0) {
																			{/*console.log("2. textAlignRight => ",value1)*/}
																			var textAlign = 'textAlignRight';
																		}else{

																			var textAlign = 'textAlignLeft noWrapText';

																		}
																	}
																}else if($.type(value1) === 'array') {
																	var textAlign = 'textAlignLeft';
																}else {
																	{/*console.log("Type => ",($.type(value1)))
																	console.log("3. textAlignRight => ",value1)*/}
																	var textAlign = 'textAlignRight';
																}
																var found = Object.keys(this.state.tableHeading).filter((k) => {
																	return k === key;
																});
																if (found.length > 0) {
																	if (key !== 'id') {
																		return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																	}
																}

															}
														)
													}
													{this.state.tableHeading && this.state.tableHeading.actions ?
														<td className="textAlignCenter" id="ActionContent">
															<span>
																{this.props.tableObjects.editUrl ?
																	<i className="fa fa-pencil" title="Edit" id={value._id.split("-").join("/")} onClick={this.edit.bind(this)}></i> : null}&nbsp; &nbsp;
																	{/*{this.props.editId && this.props.editId === value._id ? null : <i className={"fa fa-trash redFont " + value._id} id={value._id + '-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-" + (value._id).replace(/[^a-zA-Z]/g, "")}></i>}*/}
																	{this.props.editId && this.props.editId === value._id ? null : <i className={"fa fa-trash redFont " + value._id} id={value._id} onClick={this.delete.bind(this)}></i>}
															</span>
															<div className="modal" id={"showDeleteModal-" + (value._id).replace(/[^a-zA-Z]/g, "")} role="dialog">
																<div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
																		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
																				<button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-" + (value._id).replace(/[^a-zA-Z]/g, "")}>&times;</button>
																			</div>

																		</div>
																		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to delete?</h4>
																		</div>

																		{/* <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="col-lg-6  col-md-6 col-sm-6 col-xs-12">
																				<button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
																			</div>
																			<div className="col-lg-6   col-md-6 col-sm-6 col-xs-12">
																				<button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-1 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
																			</div>
																		</div> */}
																		<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal"style={{width: "70%"}}>CANCEL</button>
	                                                              </div>
	                                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                                                <button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1 floatRight" data-dismiss="modal"style={{width: "70%"}}>DELETE</button>
	                                                              </div>
	                                                            </div>
																	</div>
																</div>
															</div>
														</td>
														:
														null
													}
												</tr>
											);
										}
									)
									:
									<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length + 1 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>
								}
							</tbody>
						</table>
						{
							this.state.tableObjects.paginationApply === true ?
								this.state.tableData && this.state.tableData.length > 0 ?
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{
												this.state.paginationArray.length < 20 ?
													null
													:
													<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
											}
										</div>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{
												this.state.paginationArray.length < 20 ? 
													null
													:
													<div className="btn btn-primary" onClick={this.showPreviousPaginationButtons.bind(this)} title="Previous"><i className="fa fa-caret-left"></i></div>
											}
										</div>
										<ol className="questionNumDiv paginationAdminOES col-lg-8 col-md-8 col-sm-8 col-xs-8 mainExamMinDeviceNoPad">
											{this.state.paginationArray}
										</ol>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{
												this.state.paginationArray.length < 20 ?
													null
													:
													<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
											}
										</div>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
											{
												this.state.paginationArray.length < 20 ?
													null
													:
													<div className="btn btn-primary" onClick={this.showLastTweentyButtons.bind(this)} title="Fast Forward"><i className="fa fa-fast-forward"></i></div>
											}
										</div>
									</div>
									:
									null
								:
								null
						}

					</div>

				{/*Export To Excel*/}
					<div className="table-responsive" id="HideTable">
						<table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id={"Download-"+this.state.currentView}>
						{/*{	console.log("this.state.id",this.state.id)}*/}
							<thead className="tempTableHeader fixedHeader">
								<tr className="tempTableHeader">
									{this.state.twoLevelHeader.apply === true ?
										this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
											return (
												<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>
											);
										})
										:
										null
									}
								</tr>
								<tr className="">
									<th className="umDynamicHeader srpadd text-center">Sr. No.</th>
									{this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map(
											([key, value], i) => {
												if (key === 'actions') {
													return (
														null
													);
												} else {
													return (
														<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
													);
												}

											}
										)
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
								</tr>
							</thead>
							<tbody className="scrollContent">
								{this.state.tableData && this.state.tableData.length > 0 ?
									this.state.tableData.map(
										(value, i) => {
											return (
												<tr key={i} className="">
													<td className="textAlignCenter">{this.state.startRange + 1 + i}</td>
													{
														Object.entries(value).map(
															([key, value1], i) => {
																if ($.type(value1) === 'string') {
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex, '') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if (aN && $.type(aN) === 'string') {
																		var textAlign = 'textAlignLeft noWrapText'
																	} else {
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		if (bN) {
																			var textAlign = 'textAlignRight';
																		} else {
																			var textAlign = 'textAlignLeft noWrapText';
																		}
																	}
																} else {
																	var textAlign = 'textAlignRight';
																}
																var found = Object.keys(this.state.tableHeading).filter((k) => {
																	return k === key;
																});
																if (found.length > 0) {
																	if (key !== 'id') {
																		return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																	}
																}

															}
														)
													}
													
												</tr>
											);
										}
									)
									:
									<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length + 1 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>
								}
							</tbody>
						</table>
						</div>
				</div>
			</div>
		);

	}

}

export default withRouter(IAssureTable);