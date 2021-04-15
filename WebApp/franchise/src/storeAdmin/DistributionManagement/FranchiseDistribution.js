import React, { version } from 'react';
import './Distribution.css';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import $ from 'jquery';

export default class FranchiseDistribution extends React.Component {
	constructor(props) {
		super(props);
		  this.state = {
					currentDate           : '',
					selectedFranchise     : 'Select Franchise',
					DistributionData      : [],
					FranchiseData         : [],
					totalDemand           : 0,
					totalSupply           : 0,
					user_id               : '',
					orderId               : '',
					franchise_name        : '',
					franchise_id          : '',
					unitOfMeasurementArray: [],
					error                 : ''

      };
	}
    
	componentDidMount(){
		var orderId = this.props.match.params.orderId;
		// console.log("purchaseId",orderId);
		var currentDate = moment().startOf('day').format("YYYY-MM-DD");
		document.getElementsByClassName('date').value = moment().startOf('day').format("YYYY-MM-DD") ;
		const userDetails = JSON.parse(localStorage.getItem("userDetails"));
		this.setState({
			currentDate:currentDate,
			user_id : userDetails.user_id,
			orderId : orderId
		},()=>{
			this.getAllfrachiseData();
			this.getUom();
			// console.log("currentDate",this.state.currentDate);
		 });
	}

	getAllfrachiseData(){
		var dateOfOrder = moment(new Date(this.state.currentDate)).format("YYYY-MM-DD");
		axios.get('/api/franchisepo/get/one/purchaseorder/'+this.state.orderId)
          .then((franchisePurOrders) => {
			  console.log("franchisePurOrders",franchisePurOrders);
					var FranchiseData = [];
					var DistributionData = [];
					var FranchiseOrderedData = []; 
					var franchisePurOrdersdata = franchisePurOrders.data;
					var franchise_id;
					// if(franchisePurOrders.data.distributionData[j].supply[j].itemCode == franchisePurOrders.data.orderItems[j].itemCode){
					// 	if(franchisePurOrders.data.orderItems[j].orderQty === franchisePurOrders.data.distributionData[j].supply[j].suppliedQty){
					// 		franchisePurOrders.data.orderItems[j].alreadySupplied = 0;
					// 	}else{
					// 		franchisePurOrders.data.orderItems[j].alreadySupplied = 0;
					// 	}
					// }else{
					// 	franchisePurOrders.data.orderItems[j].alreadySupplied = 0;
					// }
					for (var j = 0; j < franchisePurOrders.data.orderItems.length; j++) {
						
						var total = [];
						franchisePurOrders.data.DistributionData.forEach(item => {
							if(franchisePurOrders.data.orderItems[j].itemCode == item.itemCode){
								total.push({"itemCode":item.itemCode,"suppliedQty":item.suppliedQty})
							}else{

							}
						});
						franchisePurOrders.data.orderItems[j].alreadySupplied = total.reduce((a, b) => +a + +b.suppliedQty, 0);
					
						if(franchisePurOrders.data.DistributionData[j]){
								if(franchisePurOrders.data.DistributionData[j].itemCode == franchisePurOrders.data.orderItems[j].itemCode){
									if(franchisePurOrders.data.orderItems[j].orderQty === franchisePurOrders.data.DistributionData[j].suppliedQty){
										franchisePurOrders.data.orderItems[j].alreadySuppliedUnit = franchisePurOrders.data.DistributionData[j].suppliedUnit;
									}else{
										franchisePurOrders.data.orderItems[j].alreadySuppliedUnit = franchisePurOrders.data.DistributionData[j].suppliedUnit;
									}
								}else{
									 franchisePurOrders.data.orderItems[j].alreadySuppliedUnit = franchisePurOrders.data.DistributionData[j].suppliedUnit;

								}
						}
						
						franchisePurOrders.data.orderItems[j].franchiseId = franchisePurOrders.data.franchise_id;
						franchisePurOrders.data.orderItems[j].supply = 0;
						franchisePurOrders.data.orderItems[j].supplyUnit = franchisePurOrders.data.orderItems[j].unit;
						
						DistributionData.push(franchisePurOrders.data.orderItems[j]);
					}
					var franchise_name = franchisePurOrders.data.franchiseName.map(function(value,index) {
						 franchise_id = value._id;
						 return value.companyName;
					});

					for (var i = 0; i < DistributionData.length; i++){
					   console.log(DistributionData[i].alreadySupplied,DistributionData[i].orderQty);
					   if (DistributionData[i].alreadySupplied === DistributionData[i].orderQty) { 
						DistributionData.splice(i, 1);
						   break;
					   }
					}

					this.setState({
						"DistributionData"  : DistributionData,
						"franchise_name"     : franchise_name[0],
						"orderDate"         : moment(franchisePurOrders.data.orderDate).format("YYYY-MM-DD"),
						"selectedFranchise" : franchise_id
					},()=>{
						this.getFooterTotal();
					 });
			})
			.catch(error=>{
				console.log("error in getAllfrachiseData = ", error);
			})
	}

	getFooterTotal(){
		var franchise = this.state.selectedFranchise;
		let demand = this.state.DistributionData.reduce((prev, current) => {
			  return prev + +current.orderQty;
		  }, 0); 

	    let supply = this.state.DistributionData.reduce(function(prev, current) {
				return prev + +current.supply
		}, 0); 
		
		this.setState({
			"totalDemand":demand,
			"totalSupply":supply
		});

	}

	getUom(){
		axios.get("/api/unitofmeasurmentmaster/get/list")
		.then((response) => {
			var unitOfMeasurementArray = [];
			response.data.filter(function(item,index){
				var i = unitOfMeasurementArray.findIndex(x => x.department == item.department);
				if(i <= -1){
					unitOfMeasurementArray.push(item.department);
				}
				return null;
			});
			this.setState({
				 unitOfMeasurementArray : unitOfMeasurementArray
			},()=>{
			});
		})
		.catch((error) => {
			console.log('error', error);
		})
	}
   

	handleChange(event){
	  event.preventDefault();
	  var franchise = this.state.selectedFranchise;
	  var date = this.state.currentDate;
	  var supplyValue = event.target.value;
	  var index  	 = event.target.name.split("-")[1];
	  var DistributionData = this.state.DistributionData; 
	  if(event.target.name == "unitOfMeasurement"+"-"+index){
		    DistributionData[index].supplyUnit = event.target.value;
	  }else{
		    if(DistributionData[index].currentStock < supplyValue){
			  DistributionData[index].supply = DistributionData[index].currentStock;
			}else{
			  DistributionData[index].supply = supplyValue;
			}
			let supply = DistributionData.reduce(function(prev, current) {
				if (current.franchiseId === franchise) {
					return prev + +current.supply
				}
				return prev;
			  }, 0); 
			
			  this.setState({
				"totalSupply":supply
			  },()=>{
				this.getFooterTotal();
			 });
			  
	
	  }
	
	
	  this.setState({"DistributionData" : DistributionData});
	  
    }

  
    Submit(event){
        event.preventDefault();
        var orderArray = [];
    	for (var i = 0; i < this.state.DistributionData.length; i++) {
			console.log("ddddd",this.state.DistributionData[i]);
			var obj = {};
			if(this.state.DistributionData[i].supply > 0){
				var remain = this.state.DistributionData[i].orderQty - this.state.DistributionData[i].supply;
				obj.productId	    = this.state.DistributionData[i].productId;
				obj.productCode 	= this.state.DistributionData[i].productCode;
				obj.itemCode 		= this.state.DistributionData[i].itemCode;
				obj.productName 	= this.state.DistributionData[i].productName;
				obj.currentStock 	= this.state.DistributionData[i].currentStock;
				obj.orderedQty 		= this.state.DistributionData[i].orderQty;
				obj.orderedUnit     = this.state.DistributionData[i].unit;
				obj.suppliedQty 	= this.state.DistributionData[i].supply;
				obj.suppliedUnit    = this.state.DistributionData[i].supplyUnit;
				obj.status          = "deliverySent";
				obj.statusBy        = this.state.user_id; 
			    // obj.remainQty       = remain;
				orderArray.push(obj);

				if(this.state.DistributionData[i].supplyUnit == 'Unit'){
					this.setState({
						error : "Please select unit of measurement."
					})
				}else{
					this.setState({
						error : ""
					})
				}
			}
    		
    	}
    	var formValues = {
			franchise_id         : this.state.selectedFranchise,
			franchisePO_id       : this.state.orderId,
			deliveryDate 	     : this.state.currentDate,
			orderedDate          : this.state.orderDate,
			deliveredBy          :this.state.user_id,
			supply               : orderArray,
			createdBy 	         : this.state.user_id,
			totalDemand          : this.state.totalDemand,
			totalSupply          : this.state.totalSupply,
			orderItems	         : orderArray,
		};

		
		if(this.state.totalSupply > 0 && this.state.error != "Please select unit of measurement."){
			axios
			.post('/api/franchiseDelivery/post',formValues)
		  	.then(function (response) {
			// handle success
			
				var franchiseDeliveryId = response.data.franchiseDeliveryId;
				window.location.href = "/franchise_delivery_challan/"+response.data.franchiseDeliveryId; 
		    	swal("Thank you. Your Data addeed successfully.");
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
		  	this.setState({
				 "date" 		        : '',
      	         "ItemCode" 	        : '',
      			 "PackageWeight"        : '',
      			 "Quantity" 			: '',
      			 "productName" 	        : '',
      			 "Unit" 		     	: '',
      	 })	
		}else{
			swal("Please add quantity in supply now and select unit of measurement for that.")
		}
        
	}

    previousDate(event){
        event.preventDefault();
		var selectedDate1 = $(".date").val();
        this.setState({currentDate: moment(selectedDate1).subtract(1, "days").format("YYYY-MM-DD")}, () => {
            this.getFooterTotal();
		});
		this.getAllfrachiseData();
      }
    nextDate(event){
        event.preventDefault();
        var selectedDate1 = $(".date").val();
        this.setState({currentDate: moment(selectedDate1).add(1, "days").format("YYYY-MM-DD")}, () => {
            this.getFooterTotal();
		});
		this.getAllfrachiseData();
	}
	  
	handleSelectChange(event){
		var selectedValue = event.target.value;
		this.setState(
			{"selectedFranchise" : event.target.value},
		()=>{
			this.getFooterTotal();
		});
		
	}
	 
	 onReset(event){
		event.preventDefault();
		var DistributionData = this.state.DistributionData; 
		DistributionData.map((result, index)=>{
			DistributionData[index].supply = '0';
		});
		
		this.setState({"DistributionData" : DistributionData});
		let supply = this.state.DistributionData.reduce(function(prev, current) {
			return 0;
		  }, 0); 
		
		this.setState({
			"totalSupply":supply
		},()=>{
		 });
	 }

	 autoDistribute(event){
		event.preventDefault();
		var DistributionData = this.state.DistributionData; 
		var franchise = this.state.selectedFranchise;
		var date = this.state.currentDate;

		DistributionData.map((result, index)=>{
			if(result.currentStock >= result.orderQty){
				DistributionData[index].supply = result.orderQty;
			}else{
				DistributionData[index].supply = result.currentStock;
			}
			
		});

		let supply = DistributionData.reduce(function(prev, current) {
			if (current.franchiseId === franchise) {
				return prev + +current.supply
			}
			return prev;
		}, 0); 
		this.setState({
			"totalSupply":supply,
			"DistributionData" : DistributionData
		},()=>{
			this.getFooterTotal();
		 });

	 }

	 onChageDate(e){
		this.setState({
			currentDate : e.target.value
		},()=>{
			this.getAllfrachiseData();
		 });
	 }


	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="text-center" style={{"display": "inline-block","float": "left"}}>{this.state.franchise_name} Distribution</h4>
                            <a href="/distribution" className="backtoMyOrders" style={{"display": "inline-block","float": "right"}}><i class="fa fa-chevron-circle-left"></i> Back to Distribution</a>
                        </div>
                        <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							<form className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtophr20">
								<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								        <h5 className="col-lg-8 col-md-8 col-xs-12 col-sm-12 mglft15">Ordered Date : {this.state.orderDate}</h5>
										<div  className="col-lg-4 col-md-4 col-xs-12 col-sm-12 mglft15">
										    <button className="btn btn-success col-lg-6 col-md-6 col-xs-4 col-sm-4 mglft15 autoDistributebtn" onClick={this.autoDistribute.bind(this)}>Auto Distribute</button>
										   <input type="reset" value="Reset" className="btn btn-default col-lg-3 col-md-3 col-xs-4 col-sm-4 mglft15" onClick={this.onReset.bind(this)}/>
										</div>
								</div>
								<div className="row">
									{/* <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                        <button className="btn btn-primary autoDistributebtn mt" onClick={this.autoDistribute.bind(this)}>Auto Distribute</button>
									</div> */}
									{/* <div className="form-group col-lg-4 col-md-3 col-xs-12 col-sm-12">
                                        <label >Ordered Date</label>
                                        <div class="input-group">
                                            <span onClick={this.previousDate.bind(this)} class="commonReportArrowPoiner input-group-addon" id="basic-addon1">
                                                <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
                                            </span>
                                            <input name="date" type="date" class="date form-control" defaultValue={this.state.currentDate}  onChange={this.onChageDate.bind(this)}/>
                                            <span onClick={this.nextDate.bind(this)} class="commonReportArrowPoiner input-group-addon" id="basic-addon1">
                                                   <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                                            </span>
                                        </div>
									</div> */}
									{/* <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12"> 
										<label>Select Franchise : </label>
										<select value={this.state.selectedFranchise} className="col-lg-12 col-md-9 col-sm-12 col-xs-12 pull-right form-control" onChange={this.handleSelectChange.bind(this)}>
										    <option defaultValue="">Select Franchise</option>
											{
											Array.isArray(this.state.FranchiseData) && this.state.FranchiseData.length > 0
									    	? 
									    		this.state.FranchiseData.map((result, index)=>{
													return(  <option value={result.franchiseId}> {result.franchiseName} </option> );
												})
											: <option disabled>{"No franchise"}</option>
											}
										</select>
								    </div> */}
									{/* <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
										<input type="reset" value="Reset" className="btn btn-default mt pull-right" onClick={this.onReset.bind(this)}/>
									</div> */}
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
									<div className="table-responsive">          
										<table className="table table-bordered table-striped table-hover">
											<thead className="thead-light text-center bg-primary">
												<tr>
													<th rowspan="2">Product Name </th>
													<th rowspan="2">Current Stock</th>
													{/* <th>{this.state.selectedFranchise}</th> */}
													<th>Ordered Quantity </th>
													<th>Already Supplied Quantity</th>
													<th>Supply Now</th>
												</tr>
											</thead>
											<tbody>
											{
									    	Array.isArray(this.state.DistributionData) && this.state.DistributionData.length > 0
									    	? 
									    		this.state.DistributionData.map((result, index)=>{
													// console.log("render map",result); // style={{fontWeight:'bold'}}
													return( 
																<tr key={index}>
																	<td>{result.productName} <br/><small>{result.productCode} - {result.itemCode}</small></td>
													                <td>{result.currentStock} {result.currentStockUnit}</td>
													                <td>{result.orderQty} {result.unit}</td>
													                <td>{result.alreadySupplied} {result.alreadySuppliedUnit}</td>
																	<td>
																	<input type="number"  name={"supply"+"-"+index} id={result.productCode+"-"+result.itemCode} className="form-control width90" value={result.supply} onChange={this.handleChange.bind(this)} min="0" style={{"display":"inline"}}/>
																	<select id="unitOfMeasurement"  name={"unitOfMeasurement"+"-"+index} value={result.supplyUnit} onChange={this.handleChange.bind(this)}  className="input-group form-control" disabled style={{"border": "1px solid #a9a9a969","width": "88px","fontSize":"small","display":"inline"}}> 
																		<option selected={true} disabled={true}>Unit</option>
																		{
																			this.state.unitOfMeasurementArray && this.state.unitOfMeasurementArray.length > 0 ?
																				this.state.unitOfMeasurementArray.map((data, i)=>{
																					return(
																						<option key={i} value={data}>{data}</option>
																					);
																				})
																			:
																			null
																		}
																	</select>
																	</td>															
																</tr>
														)
												})
											:
												null
											  
	                                        }
											</tbody>
											<tfoot style={{fontWeight:'bold',display:'none'}}>
												<tr>
													<td colspan="2">Total</td>
													<td>
                                                      {this.state.totalDemand}
													</td>
													<td>0</td>
													<td>{this.state.totalSupply}</td>
												</tr>
											</tfoot>
										</table>
									</div>
									<div className="col-lg-12col-md-12 col-sm-12 cool-xs-12">
                                       <button className="btn btn-primary col-lg-4 col-md-4 col-xs-4 col-sm-4 pull-right" onClick={this.Submit.bind(this)}>Submit</button>
                           </div> 
								</div>
                            </form>
                        </div>
			
                       
					</div>
				</div>
			</div>
		);
	}
}
