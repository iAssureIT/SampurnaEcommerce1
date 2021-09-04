import React from 'react';
import IAssureTableUM from '../../coreadmin/IAssureTableUM/IAssureTable.jsx';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import '../FranchiseShoppingList/FranchiseShoppingList.css';


export default class AdminShoppingList extends React.Component {

	constructor(props) {
		super(props);
	  	this.state = {
          objects 					: [],
          units 						: "",
	    		productList 			: [],
          currentStock 			: [],	
         	prodStockOrder 		: [],	      
	        selectedSection 	: "",	
	        date 							: moment(new Date()).format("YYYY-MM-DD"),
	        editId 						: "",
	        allFrachiseList 	: "",
	        user_ID 					: ""
   	};
	}

	componentDidMount(){
		
		this.getAllfrachisePOData();



		var editid1 = window.location.pathname;
			// console.log("pageUrl = ",pageUrl);
		let editId = editid1 ? editid1.split('/')[2] : "";
	        // console.log("a==>",editId); 
	    const user_ID = localStorage.getItem("user_ID");
   			 // console.log("user_ID",user_ID);
		// var today = moment(new Date()).format("YYYY-MM-DD");
		// console.log("today",today);
		this.setState({
				// date : today,
				editId : editId,
				user_ID : user_ID,
			},()=>{
					console.log("editId = ",this.state.editId);
					// this.getEditData();
				});

	}

	handleChange(event){
		event.preventDefault();
		console.log("event.target.value = ",event.target.value);

		this.setState({
			[event.target.name] : event.target.value,			
			},()=>{
				this.getAllFrachiseData();
			});

	}

	getAllFrachisePOData(){
		var dateOfOrder = this.state.date;
		// console.log("dateOfOrder",dateOfOrder);
		axios.get('/api/franchisepo/get/all-frachise-po-data/'+dateOfOrder)
          .then((allFrachisePO) => {
						this.setState({
		             "allFrachiseList" : allFrachisePO.data,
						})
					})
					.catch(error=>{
						console.log("error in getCurrentStock = ", error);
					})

	}

	getCurrentStock(){
		axios.get('/api/products/get/list')
		    .then(prodlist => {
					var prodStockOrder = [];
					if(Array.isArray(prodlist.data) && prodlist.data.length > 0){						
						console.log("prodlist = ",prodlist.data);

						//Separate out the Unique values of Units 
						const units = [...new Set(prodlist.data.map(item => item.unit))];
						this.setState({
		             "units" : units,
						})

						if ( Array.isArray(this.state.allFrachiseList) && 
								 this.state.allFrachiseList.length > 0) {						
	
							console.log("this.state.allFrachiseList = ",this.state.allFrachiseList);
							var allFranchiseOrders = []; 
							for (var i = 0; i < prodlist.data.length; i++) {
								var totOrder = 0;
								var obj = {};
 								var index = -1;
								for (var j = 0; j < this.state.allFrachiseList.length; j++) {
									obj.franchise_id 		= 	this.state.allFrachiseList[j].franchise_id;
									obj.productCode 	  = 	prodlist.data[i].productCode;
									obj.itemCode 	  		= 	prodlist.data[i].itemCode;
									obj.productName 	  = 	prodlist.data[i].productName;
									obj.currentStock 	  = 	"- NA -";

 									this.state.allFrachiseList[j].orderItems.some((orderItem,n) => {
 											return 	orderItem.productCode === prodlist.data[i].productCode &&
 												 			orderItem.itemCode === prodlist.data[i].itemCode
 															?  
 																(
 																	index = n, 
								 									obj["orderQty"+j] 	= parseFloat(this.state.allFrachiseList[j].orderItems[n].orderQty),
																	obj["Units"+j]			= this.state.allFrachiseList[j].orderItems[n].unit,
								 									totOrder 						= totOrder +  parseFloat(this.state.allFrachiseList[j].orderItems[n].orderQty),
 																	true
 																)
 															:  
 																(
								 									obj["orderQty"+j] = 0,
																	obj["Units"+j]		= "",
 																	false 
 																) ;
 											});
 								}//for j									
								obj.totOrder = totOrder;
								obj.totUnit  = prodlist.data[i].unit;

								if(totOrder > 0){
									allFranchiseOrders.push(obj);	
								}								
							}//for i

							if(i == prodlist.data.length){
								console.log("allFranchiseOrders = ",allFranchiseOrders);
								this.setState({"allFranchiseOrders" : allFranchiseOrders});
							}

						}//if
					}else{
						swal("Franchise Orders Not Yet Submitted","error");
					}
				})
				.catch(error=>{
					console.log("error in getCurrentStock = ", error);
				})
	}

  Submit(event){
    	event.preventDefault();
    	var ProdArray = []
    	if (this.state.prodStockOrder) {
    		for (var i = 0; i < this.state.prodStockOrder.length; i++) {
    			if (this.state.prodStockOrder[i].orderQty > 0) {
    				var ProdArrayelement =this.state.prodStockOrder[i];
    				ProdArray.push(ProdArrayelement);
    				// console.log("ProdArray",ProdArray);
    			} 

    		}
    	}
    	// console.log("ProdArray2",ProdArray);

   	    const formValues = {
   	    	franchise_id              : "5ec686a8a35f526967255a23", 
	        companyID                 : "12345", 
	        // orderNo                   : "1000", 
	        orderDate                 : moment(new Date()).format("YYYY-MM-DD"), 
	        orderItems                : ProdArray,
	        createdBy                 : this.state.user_ID,
        };
        console.log("formValues1",formValues);
        axios
			.post('/api/adminpo/post',formValues)
		  	.then(function (response) {
		    // handle success
		    	console.log("data in block========",response.data);
		    	swal("Thank you. Your Product addeed successfully.");
		    	 // window.location.reload();
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
		  	this.setState({
					
      	 })		
	}

	setOrderQty(event){
		event.preventDefault();
		var orderQty = event.target.value;
		var index  	 = event.target.name.split("-")[1];
		var allFranchiseOrders = this.state.allFranchiseOrders; 

		allFranchiseOrders[index].orderQty = orderQty;
		this.setState({allFranchiseOrders : allFranchiseOrders});
	}

	setUnit(event){
		event.preventDefault();
		var unit 	= event.target.value;
		var index  	= event.target.name.split("-")[1];
		var prodStockOrder = this.state.prodStockOrder; 

		prodStockOrder[index].unit = unit;
		this.setState({prodStockOrder : prodStockOrder});		
	}

	handleSelectChange(event){
		var selectedValue = event.target.value;
		this.setState({selectedSection : selectedValue});
	}

	render() {
		// console.log("productList render = ",this.state.productList);

		return (
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
						<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
							<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20">
								<h1 className="text-center">Admin Shopping List</h1>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtopbotm15">
								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12 pull-right">
								    <label className=" ">Order Date :</label>
								    <div className="col-lg-8 col-md-9 col-sm-12 col-xs-12  pull-right nopadding">
								      <input className=" " id="date" type="date" name="date" refs="date" value={this.state.date} onChange={this.handleChange.bind(this)}/>

								      {/*<input className=" " id="theDate" type="date" value={this.state.date}/>*/}
								    </div>
								</div>

							</div>
							<hr/>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="table-responsive">          
							    	<table className="table table-bordered table-striped table-hover">
									    <thead className="thead-dark text-center">
									      	<tr>
										        <th>ProductID</th>
										        <th>Item Code</th>
										        <th>Product Name</th>
										        <th>Current Stock</th>
										        <th>Total Ordered </th>
										        <th>Shopping Quantity </th>
										        { Array.isArray(this.state.allFrachiseList) && 
										        	this.state.allFrachiseList.length > 0
										        	?
										        		this.state.allFrachiseList.map((franchisePO,index)=>{										        			
										        			return(
										        				<th>{"Franchise"+(index+1)+" Order"} </th>
										        			)
										        		})
										        	:
										        		null										        	
										        }
									      	</tr>
									    </thead>
									    <tbody>
									    {
									    	Array.isArray(this.state.allFranchiseOrders) && this.state.allFranchiseOrders.length > 0
									    	? 
									    		this.state.allFranchiseOrders.map((result, index)=>{
													// console.log('result', result);
													return( 
													
														
														<tr key={index}>
												        	<td>{result.productCode}</td>
												        	<td>{result.itemCode}</td>
												        	<td>{result.productName}</td>
												        	<td>{result.currentStock}</td>
												        	<td>{result.totOrder}</td>

												        	<td>
													        	<div className="form-group">
								                      <div className="input-group">
														        		<input type="number" className="form-control width90" 
														        				 name={"orderedItems-"+index} 
														        				 id={result.productCode+"-"+result.itemCode} 
														        				 value={result.totOrder} 
														        				 onChange={this.setOrderQty.bind(this)}
														        		/>
														        		<div className="input-group-addon">
																			  	<select id={"totUnit"+index} 
																			  					name={"totUnit"+index} 
																			  			  	value={result.totUnit} 
																			  			  	onChange={this.setUnit.bind(this)}  
																			  			  	className="input-group-addon width66h">
																							<option selected={true}> Units</option>
																							{ Array.isArray(this.state.units) && this.state.units.length > 0 
																								? this.state.units.map((unit,index)=>{
																										return (<option> {unit} </option>);
																									})
																								: null
																							}
																					</select>
																		  	</div>
																			</div>
																		</div>
													        </td>

																	 

																	 	<td> result[index] </td> : null 

													      	}													        
													    </tr>
													)
												})
												:
													null
									  		}
									    </tbody>
									</table>
							    </div>
								<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20 Subbtnmtop20">
									
										<button className="btn btn-primary col-lg-3 col-md-3 col-xs-4 col-sm-4 pull-right" onClick={this.Submit.bind(this)}>Submit</button>
									
								</div>		
							</div>
						</div>
					</div>
				</div>
		);
	}
}
