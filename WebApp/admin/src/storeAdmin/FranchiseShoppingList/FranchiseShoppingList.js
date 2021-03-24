import React from 'react';
import IAssureTableUM from '../../coreadmin/IAssureTableUM/IAssureTable.jsx';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import './FranchiseShoppingList.css';
import jQuery from 'jquery';
import $ from 'jquery';
export default class FranchiseShoppingList extends React.Component {

	constructor(props) {
		super(props);
	  	this.state = {
          objects 				: [],
          units 					: "",
		    	productList 		: [],
          currentStock 		: [],	
         	prodStockOrder 	: [],
	        selectedSection : "All Sections",
	        date 						: "" ,
	        editId 					: "" ,
	        user_ID 				: ""
   	};
	}

	componentDidMount(){
		/*this.getProductList();*/
		this.getProductStock();

		this.getFranchiseList();

		var editid1 	= window.location.pathname;
		let editId 		= editid1 ? editid1.split('/')[2] : "";
	    const user_ID = localStorage.getItem("user_ID");
		var today 		= moment(new Date()).format("YYYY-MM-DD");



		this.setState({
				date 		: today,
				editId 	: editId,
				user_ID : user_ID,
			},()=>{
					// console.log("editId = ",this.state.editId);
					if(typeof this.state.editId !== 'undefined'){
						this.getEditData();
					}
				});

	}

	getFranchiseList(){
		axios.get('/api/entitymaster/get/franchise/')
        .then((response) => {
          this.setState({
            "franchiseList": response.data,
          },()=>{
						// console.log("franchiseList = ",this.state.franchiseList);
					})
	      })
	      .catch((error) => {
					console.log("Error in franchiseList = ", error);
	      })
	}

	getEditData(){
		axios.get('/api/franchisepo/get/one/purchaseorder/'+this.state.editId)
        .then((editdatalist) => {
            this.setState({
                "prodStockOrder": editdatalist.data.orderItems,
            },()=>{
						})
	      })
	      .catch((error) => {
					// console.log("error in getEditData = ", error);        
	      })
	}
/*
	getProductList(){
		var data = {
            startRange: 0,
            limitRange: 100
        }
        this.getCount();
        axios.post('/api/products/get/list', data)
            .then(prodlist => {
				console.log("prodlist prodlist",prodlist.data);

                this.setState({
                    "productList": prodlist.data,
                },()=>{
					console.log("productList = ",this.state.productList);
				})

            })
            .catch((error) => {
				console.log("error in getProductList = ", error);
              
            })
	}*/

	getProductStock(){

      axios.get('/api/products/get/franchisestock')
          .then(franchisestock => {
          	  console.log("franchisestock =====> ",franchisestock.data);
							var prodStockOrder = [];
							if(franchisestock.data.length > 0){
									for (var i = 0; i<franchisestock.data.length; i++) {
										var obj = {};
										var productCode = franchisestock.data[i].productCode;
										var itemCode 		= franchisestock.data[i].itemCode;
										var productId   = franchisestock.data[i].productId;
										obj.productCode 	= productCode;
										obj.fgUnitQty 		= franchisestock.data[i].fgUnitQty;
										obj.itemCode 			= itemCode;
										obj.productId 			= productId;
										obj.productName 	= franchisestock.data[i].productName;
										obj.currentStock 	= franchisestock.data[i].currentStock;
										obj.section 			= franchisestock.data[i].section;	
										obj.orderQty 			= 0;
										obj.unit 					= franchisestock.data[i].unit;

										prodStockOrder[i] = obj;
									}
									if(i >= franchisestock.data.length){
										this.setState({
											prodStockOrder : prodStockOrder,
										},()=>{
											// console.log("prodStockOrder ===> ",this.state.prodStockOrder);
										});										
									}
								}
					})
					.catch(error=>{
						console.log("error in getCurrentStock = ", error);
					})
	}

	getCurrentStock(productCode,itemCode){
		//CurrentStock = TotalFinishedGoodsStock - DistributedFinishedGoods
		// axios.get('/api/finishedgoodsentries/get/'+)
		return new Promise((resolve,reject)=>{
			resolve(1);
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

	  const formValues1 = {
	    franchise_id            	: this.state.selectedFranchise, 
      companyID                 : this.state.companyID, 
      orderDate                 : moment(new Date()).format("YYYY-MM-DD"), 
      orderItems                : ProdArray,
      createdBy                 : this.state.user_ID,
    };
    console.log("formValues1",formValues1);
    axios.post('/api/franchisepo/post',formValues1)
	  	.then(function (response) {
				var id = response.data.order_id;
				// console.log("data in franchise_id========",id);
				
				swal("Thank You!","Your Order has been placed successfully!!")
				this.props.history.push("/franchise-order-view/"+id);
				// .then((success) => {
				// })
	  	})
	  	.catch(function (error) {
	    	console.log(error);
	  	});
	}
	Update(event){
		event.preventDefault();
   	    const formValues1 = {
	        purchaseorder_id    	  	: this.state.editId, 
	        orderItems                : this.state.prodStockOrder,
	        orderDate				  				: moment(new Date()).format("YYYY-MM-DD"),
	        user_id                   : this.state.user_ID,
	       
        };
        console.log("formValues1",formValues1);
        axios
			.patch('/api/franchisepo/patch/purchaseorder',formValues1)
		  	.then(function (response) {
		    // handle success
		    	// console.log("Order Updated========",response.data);
		    	swal("Thank you. Your Product Order Updated successfully.");
		    	 // window.location.reload();
		  	})
		  	.catch(function (error) {
		    // handle error
		    	console.log(error);
		  	});
		  	

	}
	setOrderQty(event){
		event.preventDefault();
		var orderQty = event.target.value;
		var index  	 = event.target.name.split("-")[1];
		var prodStockOrder = this.state.prodStockOrder; 

		prodStockOrder[index].orderQty = orderQty;
		this.setState({prodStockOrder : prodStockOrder});
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

	selectFranchise(event){
		var selectedValue = event.target.value;
		this.setState({selectedFranchise : selectedValue});
	}

	onChageOrderDate(event){
		var date = event.target.value;
		this.setState({
			date : date,
		},()=>{
				console.log("date = ",this.state.date);
			});

	}

	onSearch(event){
		event.preventDefault();
		this.setState({
			search:event.target.value
		})
		var value = event.target.value.toLowerCase();
    $(".franchise-shopping-table  tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
	}

	render() {
		// console.log("productList render = ",this.state.productList);

		return (
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
						<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
							<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20">
								<h3 className="text-center">Franchise Shopping List</h3>
							</div>
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 mtopbotm15">
								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12">
								    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Date :</label>
								    {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> */}
								      <input id="theDate" type="date" className=" form-control"
								      		onChange={this.onChageOrderDate.bind(this)} 
								      		value={this.state.date} min={moment(new Date()).format("YYYY-MM-DD")}/>
								    {/* </div> */}
								</div>
							
								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12"> 
									<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">Select Franchise </label>
									<select defaultValue="-- Select --" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control" 
													onChange={this.selectFranchise.bind(this)}>
										<option>-- Select --</option>
										{
											Array.isArray(this.state.franchiseList) && this.state.franchiseList.length > 0
											? 
												this.state.franchiseList.map((franchise,index)=>{
													// console.log("franchise==>",franchise.companyName);
													return(
														// <option key={index} value={franchise._id}>{franchise.groupName}</option>
														<option key={index} value={franchise._id}>{franchise.companyName}</option>
													);
												})
											:
												null
										}
									</select>
								</div>

								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12"> 
									<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">Search </label>
									<input type="search" className="form-control" placeholder="Search" name="serach" value={this.state.search} onChange={this.onSearch.bind(this)} />
								</div>

{/*								<div className="col-lg-4 col-md-8 col-sm-12 col-xs-12"> 
									<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Select Section </label>
									<select defaultValue="All Sections" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" 
													onChange={this.handleSelectChange.bind(this)}>
										<option> All Sections </option>
										<option> Fruits </option>
										<option> Vegetables </option>
										<option> Frozen Items </option>
									</select>
								</div>
*/}								
							</div>
							{/* <hr/> */}
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
								<div className="table-responsive">          
							    	<table className="franchise-shopping-table table table-bordered table-striped table-hover">
									    <thead className="thead-dark text-center">
									      	<tr>
										        <th>ProductID</th>
										        <th>Item Code</th>
										        <th>Product Name</th>
										        <th>Current Stock</th>
										        <th>Order Quantity</th>
												<th>Unit Per Pack</th>
									      	</tr>
									    </thead>
									    <tbody>
									    {
									    	Array.isArray(this.state.prodStockOrder) && this.state.prodStockOrder.length > 0
									    	? 
									    		this.state.prodStockOrder.map((result, index)=>{
														console.log("Result of prodstock==>",result);
													return( 
													this.state.selectedSection ?
														result.section === this.state.selectedSection ? 
													      <tr key={index}>
													        	<td>{result.productCode}</td>
													        	<td>{result.itemCode}</td>
													        	<td>{result.productName}</td>
													        	<td>{result.currentStock}</td>
													        	<td>
													        	<div class="form-group">
								                                   <div className="input-group width60p">
														        		<input type="number" className="form-control" 
														        				 name={"orderedItems"+"-"+index} 
														        				 id={result.productCode+"-"+result.itemCode} 
														        				 value={result.orderQty} 
														        				 onChange={this.setOrderQty.bind(this)}
														        		/>
														        		{/* <div className="input-group-addon">
																			  	<select id={"Units"+"-"+index} name={"Units"+"-"+index} 
																			  			  value={result.unit} refs="Units" 
																			  			  onChange={this.setUnit.bind(this)}  
																			  			  className="input-group-addon width66h">
																							<option selected={true}> Units</option>
																					  	<option value="Kg"> Kg 		</option>
																					  	<option value="Gm"> Gm 		</option>
																					  	<option value="Ltr">Ltr 	</option>
																					  	<option value="Num">Number </option>
																					</select>
																		  	</div> */}
																			</div>
																		</div>
													        </td>	
													        <td>{result.fgUnitQty+' '+result.unit}</td>												       
													      </tr>
														:
														this.state.selectedSection === "All Sections" ?
														<tr key={index}>
													        	<td>{result.productCode}</td>
													        	<td>{result.itemCode}</td>
													        	<td>{result.productName}</td>
													        	<td>{result.currentStock}</td>
													        	<td>
													        	<div class="form-group">
								                                    <div className="input-group width60p">
														        		<input type="number" className="form-control" 
														        				 name={"orderedItems"+"-"+index} 
														        				 id={result.productCode+"-"+result.itemCode} 
														        				 value={result.orderQty} 
														        				 onChange={this.setOrderQty.bind(this)}
														        		/>
														        		{/* <div className="input-group-addon unitbox">
																				<td  className=" width66h">{result.fgUnitQty}</td>
																				<td  className=" width66h">{result.unit}</td>
																				 */}
																		  	{/* <select id={"Units"+"-"+index} name={"Units"+"-"+index} 
																		  			  value={result.unit} refs="Units" 
																		  			  onChange={this.setUnit.bind(this)}  
																		  			  className="input-group-addon width66h">
																					<option selected={true}> Units</option>
																			  	<option value="Kg"> Kg 		</option>
																			  	<option value="Gm"> Gm 		</option>
																			  	<option value="Ltr">Ltr 	</option>
																			  	<option value="Num">Number </option>
																			</select> */}
																	  	{/* </div> */}
																	</div>
																</div>
													        </td>
													        <td>{result.fgUnitQty+' '+result.unit}</td>												       
													      </tr>
														:null
													:
													<tr key={index}>
													        	<td>{result.productCode}</td>
													        	<td>{result.itemCode}</td>
													        	<td>{result.productName}</td>
													        	<td>{result.currentStock}</td>
													        	<td>
													        	<div class="form-group">
								                      <div className="input-group">
														        		<input type="number" className="form-control width90" 
														        				 name={"orderedItems"+"-"+index} 
														        				 id={result.productCode+"-"+result.itemCode} 
														        				 value={result.orderQty} 
														        				 onChange={this.setOrderQty.bind(this)}
														        		/>
														        		{/* <div className="input-group-addon">
																		  	<select id={"Units"+"-"+index} name={"Units"+"-"+index} 
																		  			  value={result.unit} refs="Units" 
																		  			  onChange={this.setUnit.bind(this)}  
																		  			  className="input-group-addon width66h">
																				<option selected={true}> Units</option>
																			  	<option value="Kg"> Kg 		</option>
																			  	<option value="Gm"> Gm 		</option>
																			  	<option value="Ltr">Ltr 	</option>
																			  	<option value="Num">Number </option>
																			</select>
																	  	</div> */}
																	</div>
																</div>
													        </td>
													        <td>{result.fgUnitQty+' '+result.unit} </td>												       
													      </tr>

													)
												})
											:
												null
									  		}
									    </tbody>
									</table>
							    </div>
								<div>
									{this.state.editId ?
										<button className="btn btn-primary col-lg-3 col-md-3 col-xs-4 col-sm-4 mg0 pull-right" onClick={this.Update.bind(this)}>Update</button>
									:
										<button className="btn btn-primary col-lg-3 col-md-3 col-xs-4 col-sm-4 mg0 pull-right" onClick={this.Submit.bind(this)}>Submit</button>
									}
								</div>		
							</div>
						</div>
					</div>
				</div>
		);
	}
}
