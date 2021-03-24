import React from 'react';
import './PurchaseManagement.css';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';

export default class RawMaterialStockReport extends React.Component {

	constructor(props) {
		super(props);
		  this.state = {
			      	amount : '',
			      	purchaseDate : '',
			      	purchaseStaff : '',
			      	purchaseLocation : '',
			      	quantity : '',
			      	unitRate : '',
			      	Details:'',
			      	purchaseNumber:'',
			      	product : '',
			      	Units : '',
			      	serchByDate:moment(new Date()).format("YYYY-MM-DD"),
			      	"twoLevelHeader"    : {
						            apply  : false,
						           },
		             "tableHeading"     : {
						Date            : 'Date',
						productName     : "Product Name",
						UnitRate        : "Rate Per Unit",
						OpeningStock    : 'Opening Stock',
		                StockAddedToday : 'Stock Added Today',
		                totalStock      : 'Total Stock',	 
					},
					"tableObjects" 		: {
						deleteMethod              : 'delete',
		                apiLink                   : '/api/purchaseentry',
		                paginationApply           : false,
		                searchApply               : false,
		                editUrl                   : '/purchase-management'
					},
		            "startRange"        : 0,
		            "limitRange"        : 10, 
		            "editId"                    : this.props.match.params ? this.props.match.params.purchaseId : '',
		            blockActive			: "all",
		            "listofRoles"	    : "",
		            adminRolesListData  : [],
		            checkedUser         : [],
		            activeswal          : false,
		            blockswal           : false,
		            confirmDel          : false,
					tableData           : "",
					reportFilterData    : {},
					filterByProduct     : 'Select Product',
					fromDate            : moment(new Date()).format("YYYY-MM-DD"),
					toDate              : moment(new Date()).format("YYYY-MM-DD"),
			      	
      };
	}
	

	componentDidMount(){
		this.getproducts();
		var serchByDate = moment(new Date()).format("YYYY-MM-DD");
		// console.log("today",today);
		this.getReportBetweenDates();
		var editId = this.props.match.params.purchaseId;

	}
	componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.purchaseId;
        if(nextProps.match.params.purchaseId){
          this.setState({
            editId : editId
          })
          this.edit(editId);
        }
	}
	
	getTotalSTock(itemCode){
		axios.get('/api/purchaseEntry/get/RawMaterialCurrentStock/'+itemCode)
				.then(stockdata => {
					// console.log("stockdata",stockdata.data);
					 return stockdata.data;
				})
				.catch(error=>{
					console.log("error in getTotalOutward = ", error);
				});
	}
	
	getReportBetweenDates(){
		var reportFilterData = this.state.reportFilterData;
		if(this.state.filterByProduct !== "Select Product"){
			reportFilterData.itemcode = this.state.filterByProduct;
		}else{
			delete reportFilterData["itemcode"];
		}
		reportFilterData.fromDate = this.state.fromDate;
		reportFilterData.toDate = this.state.toDate;

		console.log("reportFilterData",reportFilterData);

		axios
		.post('/api/purchaseentry/post/getReportOfPurchaseEntry/',reportFilterData)
		.then((response)=>{
			var tableData = response.data.map((a, i) => {

					return {
						_id                  : a._id,
						Date   				 : a.purchaseDate ? moment(a.purchaseDate).format("DD-MMM-YYYY") : "",
						// itemCode             : a.itemCode     ? a.itemCode     : "",
						// productCode          : a.productCode  ? a.productCode  : "",
						productName 	     : a.productName  ? a.productName +' - '+ a.productCode +' - '+ a.itemCode: "" ,
						UnitRate             : a.unitRate     ? a.unitRate +' <i class="fa fa-rupee" style="font-size": "small"></i> / '+a.unitOfMeasurement     : 0,
						OpeningStock         : a.openingStock  ? a.openingStock : 0,
						StockAddedToday      : a.quantity     ? a.quantity +' '+a.unit     : 0,
						totalStock           : a.totalStock    ? a.totalStock +' '+ a.StockUnit : 0,
						
					}

			})

				this.setState({
				  tableData 		: tableData,          
				},()=>{
					console.log("tableData",tableData);
				})
				})
		.catch((error)=>{
			console.log("error = ", error);              
		}); 
		
	}
    getSearchText(searchText, startRange, limitRange){

    }
    setunCheckedUser(value){
		this.setState({
			unCheckedUser : value,
		})
	}
	selectedUser(checkedUsersList){
		this.setState({
			checkedUser : checkedUsersList,
		})
		console.log("checkedUser",this.state.checkedUser)
	}
	
	selectedRole(event){
		event.preventDefault();
					    
	}

    
     getproducts(){
        axios.get('/api/products/get/list')
		.then((response) => {
            console.log('productArray---', response.data)
            /*for(var i=0; i<response.data.length; i++){
            	var proname=response.data[i].productName;
            	// console.log("proname---",proname);
            	var ProductsNames=proname.Split('<')[0];
            	console.log("ProductsNames",ProductsNames);
            }*/
			this.setState({
				productArray: response.data
			})
		})
		.catch((error) => {
			
		})
	}
	

	/* Filters start*/
	filterChange(event){
		event.preventDefault();
		const {name,value} = event.target;
  
		this.setState({ 
		  [name]:value,
		},()=>{
		  this.getReportBetweenDates();
		 });
	  }
   /* Filters end*/
	
	handleFromChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       },()=>{
		   this.getReportBetweenDates();
	   });
    }
    handleToChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
          [name] : event.target.value,
       },()=>{
		  this.getReportBetweenDates();
	   });
    }


	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="">Raw Material Stock Report</h4>
                        </div>
						
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 reports-select-date-fromto">
								<div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 reports-select-date-from1">
									<label>From Date</label>
									<div className="reports-select-date-from3">
										<input onChange={this.handleFromChange.bind(this)} name="fromDate" ref="fromDateCustomised" value={this.state.fromDate} type="date" className="reportsDateRef form-control" placeholder=""  />
									</div>
								</div>
								<div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 reports-select-date-to1">
									<label>To Date</label>
									<div className="reports-select-date-to3">
										<input onChange={this.handleToChange.bind(this)} name="toDate" ref="toDateCustomised" value={this.state.toDate} type="date" className="reportsDateRef form-control" placeholder=""   />
									</div>
								</div>
							</div>
							<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
									<label>Product Name:</label>
									<select className="form-control productFilter" aria-describedby="basic-addon1" name="filterByProduct" id="filterByProduct" ref="filterByProduct" value={this.state.filterByProduct} onChange={this.filterChange.bind(this)}>
									<option value="Select Product" disabled="">Select Product</option>
									{
										this.state.productArray && this.state.productArray.length > 0 ?
											this.state.productArray.map((data, i)=>{
												return(
												<option key={i} value={data.itemCode}>{data.productName} - {data.productCode} - {data.itemCode}</option>
												);
											})
										:
										null
									}
									</select>
							</div>
							<IAssureTable
								tableHeading={this.state.tableHeading}
								twoLevelHeader={this.state.twoLevelHeader} 
								dataCount={this.state.dataCount}
								tableData={this.state.tableData}
								getData={this.getReportBetweenDates.bind(this)}
								tableObjects={this.state.tableObjects}
							/>			
							</div>
					</div>
				</div>
			</div>
		);
	}
}
