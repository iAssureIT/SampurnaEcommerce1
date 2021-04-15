import React from 'react';
import './Distribution.css';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import swal from 'sweetalert';
import axios from 'axios';
import jQuery from 'jquery';
import $ from 'jquery';
import moment from 'moment';

export default class DistributionManagement extends React.Component {

	constructor(props) {
		super(props);
		  this.state = {
			      	amount : '',
                    purchaseDate : '',
                    currentDate:'',
			      	purchaseStaff : '',
			      	purchaseLocation : '',
			      	quantity : '',
			      	unitRate : '',
			      	Details:'',
			      	purchaseNumber:'',
			      	product : '',
			      	Units : 'Kg',
			      	serchByDate:moment(new Date()).format("YYYY-MM-DD"),
			      	"twoLevelHeader"    : {
						            apply  : false,
						           },
		             "tableHeading"     : {
						date            : 'Purchase Date',
						PurchaseNumber  : 'Purchase Number',
						Details         : 'Details',
						Supplier        : 'Supplier',
						PurchasedBy     : 'Purchased By',
						productName     : "Product Name",
						UnitRate        : 'Unit Rate',
						Quantity        : 'Quantity',
						TotalAmount     : 'Total Amount',
						actions        	: 'Action',
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
		            checkedUser  : [],
		            activeswal : false,
		            blockswal : false,
		            confirmDel : false,
					tableData : "",
					PoNumbersArray:[],
					selectedPurchaseNum :'Select Purchase Number',
					selectedProductName : 'Select Product',
					filterData : {},
					PurchaseNumberArray:[],
					totalPoAmount : 0,
					ItemCode   : ''
			      	
      };
	}
	

	componentDidMount(){
		var serchByDate = moment(new Date()).format("YYYY-MM-DD");
		var editId = this.props.match.params.purchaseId;
        this.getData();
        this.getAllfrachiseData();
		
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

    getAllfrachiseData(){
		var dateOfOrder = moment(new Date(this.state.serchByDate)).format("YYYY-MM-DD");
		 axios.get('/api/franchisepo/get/purchaseorderList/'+dateOfOrder)
          .then((franchisePurOrders) => {
					var FranchiseData = [];
					var DistributionData = [];
					var FranchiseOrderedData = []; 
					franchisePurOrders.data.filter(function(item,index){
						var i = FranchiseData.findIndex(x => x.name == item.franchiseData[0].companyName);
						if(i <= -1){
							FranchiseData.push({franchiseId: item.franchise_id, franchiseName: item.franchiseData[0].companyName});
						}
						return null;
					});

                    var franchisePurOrdersdata = franchisePurOrders.data;
                    console.log("franchisePurOrders.data",franchisePurOrders.data);

					for (var i = 0; i < franchisePurOrdersdata.length; i++) {
                        var orderDate = moment(franchisePurOrdersdata[i].orderDate).format("YYYY-MM-DD");
                        franchisePurOrdersdata[i].orderDate = orderDate;
						for (var j = 0; j < franchisePurOrdersdata[i].orderItems.length; j++) {
							franchisePurOrdersdata[i].orderItems[j].franchiseId = franchisePurOrdersdata[i].franchise_id;
							franchisePurOrdersdata[i].orderItems[j].supply = 0;
							DistributionData.push(franchisePurOrders.data[i].orderItems[j]);
						}
					}

					this.setState({
						"DistributionData" : franchisePurOrders.data,
						"FranchiseData" : FranchiseData
					},()=>{
						
					 });
			})
			.catch(error=>{
				console.log("error in getCurrentStock = ", error);
			})
	}



	
	getData(startRange, limitRange){ 
		var dateToSearch=this.state.serchByDate;
		var filterData = this.state.filterData;
		if(this.state.selectedPurchaseNum != "Select Purchase Number"){
			filterData.purchaseNumber = this.state.selectedPurchaseNum;
		}

		if(this.state.selectedProductName != "Select Product"){
			filterData.productName = this.state.selectedProductName;
		}

		filterData.purchaseDate = moment(dateToSearch).format("YYYY-MM-DD");
		axios
		.post('/api/purchaseentry/post/datewisepurchase/',filterData)
		.then((response)=>{
			var  tableData = response.data ;
				var tableData = tableData.map((a, i) => {
						return {
							_id                  :a._id,
							date   				: a.purchaseDate ? moment(a.purchaseDate).format("DD-MMM-YYYY") : "",
							PurchaseNumber 		: a.purchaseNumber ? a.purchaseNumber : "" ,
							Details 			: a.Details ,
							Supplier            : a.purchaseLocation,
							PurchasedBy 		: a.purchaseStaff ? a.purchaseStaff : "" ,
							productName 		: a.productName,
							UnitRate 	        : a.unitRate ,
							Quantity 			: a.quantity +' '+ a.unit,
							TotalAmount         : a.amount,
						}
				});
				var PoNumbersArray = [];
				console.log("list===>",tableData);
				tableData.filter(function(item,index){
					var i = PoNumbersArray.findIndex(x => x.PurchaseNumber == item.PurchaseNumber);
					if(i <= -1){
						PoNumbersArray.push(item.PurchaseNumber);
					}
					return null;
				});

				let totalAmount = tableData.reduce(function(prev, current) {
						return prev + +current.TotalAmount
				}, 0);

				this.setState({ 
				   tableData 		: tableData,  
				   PoNumbersArray   : PoNumbersArray,
				   totalPoAmount      : totalAmount        
				},()=>{
					
				});
			})
		.catch((error)=>{
			console.log("error = ", error);              
		}); 
		
    }
  
	handleChangeDate(event){
      event.preventDefault();
      var dateVal = event.target.id;
	  const {name,value} = event.target;
      this.setState({ 
        [name]:value,
 
      },()=>{
		this.getData();
        this.getAllfrachiseData();
      });
    }

    edit(event){
		event.preventDefault();
		var id = event.target.id;
		this.props.history.push("/franchise_distribution/"+id);
	}

    deletePO(){

    }

    getViewData(event){
        event.preventDefault();
        var id = event.target.id;
        this.props.history.push("/franchise_delivery_challan/"+id);
    }



	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="">Distribution Management</h4>
                        </div>
						<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">

						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop25">
						  <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12">
							<label>Ordered Date:</label>
							{/* <div className="form-group"> */}
							 <input type="Date" placeholder="1234" className="col-lg-6 col-md-6 form-control" value={this.state.serchByDate} name="serchByDate" refs="serchByDate" onChange={this.handleChangeDate.bind(this)} id="serchByDate"/>
                            {/* </div> */}
						  </div>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="table-responsive">          
								<table className="table table-bordered table-striped table-hover">
									<thead className="thead-light text-center bg-primary">
                                        <tr>
                                            <th>Sr No.</th>
                                            <th>Ordered Date</th>
                                            <th>Franchise Name</th>
                                            <th>Ordered Items </th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                       
									</thead>
								    <tbody>
                                    {
                                        Array.isArray(this.state.DistributionData) && this.state.DistributionData.length > 0
                                        ? 
                                            this.state.DistributionData.map((result, index)=>{
                                                 console.log("result",result.orderItems.length);
                                                return(
                                                    <tr key={index}>
														<td>{index + 1}</td>
                                                        <td>{result.orderDate}</td>
                                                        <td>{result.franchiseData[0].companyName}</td>
                                                        <td style={{fontWeight:'bold'}}>{result.orderItems.length} </td>
                                                        <td>status</td>
                                                        <td>
                                                            <span>
																<i className="fa fa-pencil" title="Distribute" id={result._id} onClick={this.edit.bind(this)}></i>&nbsp; &nbsp;
													    		{/* <i className="fa fa-trash redFont " id={result._id} onClick={this.deletePO.bind(this)}></i>&nbsp; &nbsp; */}
													    		{/* <i className="fa fa-eye" id={result._id} onClick={this.getViewData.bind(this)}></i> */}
															</span>
                                                        </td>
													</tr>
                                                )
                                            })
                                        : null
                                    }
                                    </tbody>
                            </table>
                            </div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
