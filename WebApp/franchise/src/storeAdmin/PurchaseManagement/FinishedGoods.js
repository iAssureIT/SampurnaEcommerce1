import React from 'react';
import './PurchaseManagement.css';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';

export default class FinishedGoods extends React.Component {

	constructor(props) {
		super(props);
		  this.state = {
			      	
			      	
			      	Date         : '',
			      	ItemCode       : '',
			      	productName  : '',
			      	PackageWeight: '',
			      	Quantity     : '',
			      	Unit         : '',
			      	"twoLevelHeader"    : {
						            apply  : false,
						           },
		             "tableHeading"     : {
		                Date            : "Date",
		        		productName     : "Product Code – Item Code-Product Name",
		        		ItemCode 	    : "ItemCode",
		        		PackageWeight  	: "Package Weight",
		        		Quantity        : "Quantity",
						actions        	: 'Action',
					},
					"tableObjects" 		: {
						deleteMethod              : 'delete',
		                apiLink                   : '/api/finishedGoodsEntry',
		                paginationApply           : false,
		                searchApply               : false,
		                editUrl                   : '/finished-goods'
					},
		            "startRange"        : 0,
		            "limitRange"        : 10, 
		            "editId"                    : this.props.match.params ? this.props.match.params.finishedGoodId : '',
      };
	}
    
	componentDidMount(){
		var editId = this.props.match.params.purchaseId;
        console.log('ven', editId);
		this.getData()

	}
	componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.finishedGoodId;
        if(nextProps.match.params.finishedGoodId){
          this.setState({
            editId : editId
          })
          this.edit(editId);
        }
    }
	edit(id){
        // $("#taxMaster").validate().resetForm();
        axios.get('/api/finishedGoodsEntry/get/one/'+id)
        .then((response)=>{
            console.log('res', response);
            this.setState({
                
	                "Date"         : response.data.Date ,
			      	"ItemCode"       : response.data.ItemCode,
			      	"productName"  : response.data.productName,
			      	"PackageWeight": response.data.PackageWeight,
			      	"Quantity"     : response.data.Quantity,
			      	"Unit"         : response.data.Unit,

                
            });
            
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
	getData(startRange, limitRange){ 
	 axios
      .get('/api/finishedGoodsEntry/get/list')
      .then((response)=>{
        console.log("list===>",response.data);
        /*this.setState({
          
          tableData : response.data,
        });*/
        var  tableData = response.data ;
        console.log("tableData",tableData);
 
		/*return{  tableData: {
						fullName        : 'Date',
		        		city       		: "Product Code",
		        		company 		: "Item Code",
		        		role 			: "Product Name",
						email        	: 'Opening Stock',
						
		                status        	: 'Stock Added Today',
		                TotalStock      : 'Total Stock', 
		                }  
			}*/
			var tableData = tableData.map((a, i) => {
					return {
 
						_id                  : a._id,
						Date   				 : a.Date ? moment(a.Date).format("DD-MMM-YYYY") : "",
						productName 	     : a.productName ? a.productName : "" ,
						ItemCode 		     : a.ItemCode ? a.ItemCode : "" ,
						PackageWeight 		 : a.PackageWeight,
						Quantity 		     : a.Quantity ? a.Quantity : "" ,
						Unit 	             : a.Unit,
						// TotalStock 			: "" ,
						
					/*	purchaseStaff		:
						purchaseLocation 	:
						Quantity 			:
						amount 				:
						Units 				:*/
					}
				})
			this.setState({
             
              tableData 		: tableData,          
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
	getRole(){
		
	}
	selectedRole(event){
		event.preventDefault();
					    
	}
	handleChange(event){
      event.preventDefault();

      // const datatype = event.target.getAttribute('data-text');
      const {name,value} = event.target;

      this.setState({ 
        [name]:value,
 
      } );
    }

    handleProduct(event){
    	var valproduct = event.currentTarget.value;
    	console.log("valproduct",valproduct);
		this.setState({product : valproduct});

    }

    handleItemCode(event){
    	var valproduct = event.currentTarget.value;
    	console.log("valproduct",valproduct);
		this.setState({ItemCode : valproduct});

    }
    Submit(event){
    event.preventDefault();

    const formValues1 = {
        // "amount"         	: this.state.amount ,
        "Date" 		        : this.state.Date,
      	"ItemCode" 	        : this.state.ItemCode,
      	"PackageWeight"     : this.state.PackageWeight,
      	"Quantity" 			: this.state.Quantity,
      	"productName" 	    : this.state.productName,
      	"Unit" 		     	: this.state.Unit,
       
      };
      console.log("formValues1",formValues1);
      axios
			.post('/api/finishedGoodsEntry/post',formValues1)
		  	.then(function (response) {
		    // handle success
		    	console.log("data in block========",response.data);
		    	swal("Thank you. Your Data addeed successfully.");
		    	 // window.location.reload();
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
	}
	update(event){
        event.preventDefault();
        var formValues = {
           "Date" 		        : this.state.Date,
      	   "ItemCode" 	        : this.state.ItemCode,
      	   "PackageWeight"      : this.state.PackageWeight,
      	   "Quantity" 			: this.state.Quantity,
      	   "productName" 	    : this.state.productName,
      	   "Unit" 		     	: this.state.Unit,
        }
        /*if($("#taxMaster").valid()){*/
            axios.patch('/api/finishedGoodsEntry/patch/'+this.state.editId,formValues)
            .then((response)=>{
                this.props.history.push('/finished-goods');
                swal(response.data.message);
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    "date" 		        : '',
	      	         "ItemCode" 	        : '',
	      			 "PackageWeight"        : '',
	      			 "Quantity" 			: '',
	      			 "productName" 	        : '',
	      			 "Unit" 		     	: '',
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
      /*  }*/
    }

	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="">Finished Goods Entry</h4>
                        </div>
						<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							<form className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtophr20">
								<div className="row">
									<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
										<label >Date</label>
										<input type="Date"  className="form-control"  value={ this.state.Date} name="Date" refs="Date" onChange={this.handleChange.bind(this)} id="Date"/>
									</div>
									
								</div>
								<div className="row">
									<div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12">
										<label >Select Product</label>
										{/*<input type="text" className="form-control" id="email"/>*/}
										<input list="productName" type="text" refs="productName" className="form-control"    placeholder="Enter Product Code or Name" value={this.state.productName}  onChange={this.handleChange.bind(this)}  onBlur={this.handleProduct.bind(this)} name="productName" />
	    								{/*<input type="text" list="societyList" className="form-control" ref="society" value={this.state.societyName} onChange={this.handleChange.bind(this)} onBlur={this.handleSociety.bind(this)} name="societyName" placeholder="Enter Society" />*/}
										
										  <datalist id="productName" name="productName" >
										    <option value="Broccoli"/>
										    <option value="cauliflower"/>
										    <option value="spinach"/>
										    <option value="onion"/>
										    <option value="garlic"/>
										  </datalist>
									</div>
									<div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12">
										<label >Select Item Code</label>
										{/*<input type="text" className="form-control" id="email"/>*/}
										<input list="ItemCode" type="text" refs="ItemCode" className="form-control"    placeholder="Enter Item Code" value={this.state.ItemCode}  onChange={this.handleChange.bind(this)}  onBlur={this.handleItemCode.bind(this)} name="ItemCode" />
	    								{/*<input type="text" list="societyList" className="form-control" ref="society" value={this.state.societyName} onChange={this.handleChange.bind(this)} onBlur={this.handleSociety.bind(this)} name="societyName" placeholder="Enter Society" />*/}
										
										  <datalist id="ItemCode" name="ItemCode" >
										    <option value="Product-01"/>
										    <option value="Product-02"/>
										    <option value="Product-03"/>
										    <option value="Product-04"/>
										    <option value="Product-05"/>
										  </datalist>
									</div>
									<div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12">
										<label >Package Weight</label>
										<div className="">
											<input type="number" placeholder="Enter Quantity " className="h34 col-lg-8 col-md-9 col-xs-8 col-sm-8" value={ this.state.PackageWeight} name="PackageWeight" refs="PackageWeight" onChange={this.handleChange.bind(this)} id="PackageWeight"/>
											<select id="Unit"  name="Unit" value={this.state.Unit} refs="Unit" onChange={this.handleChange.bind(this)}  className="col-lg-4 col-md-3 col-xs-4 col-sm-4 h34">
											  	<option selected={true} disabled={true}>-- Select --</option>
											  	<option value="Kg">Kg</option>
											  	<option value="Ltr">Ltr</option>
											  	<option value="gram">gram</option>
											  	<option value="Nos">Nos</option>
											</select>
										</div>
									</div>
									<div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12">
										<label >Quantity</label>
										<input type="number" placeholder="12345678" className="form-control" value={ this.state.Quantity} name="Quantity" refs="Quantity" onChange={this.handleChange.bind(this)} id="Quantity"/>
									</div>
								</div>
								<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtop20 Subbtnmtop20">
									{this.state.editId ?
                                    <button onClick={this.update.bind(this)} className="btn btn-primary col-lg-3 col-md-3 col-xs-4 col-sm-4 pull-right">Update</button>
                                    :
                                    <button className="btn btn-primary col-lg-3 col-md-3 col-xs-4 col-sm-4 pull-right" onClick={this.Submit.bind(this)}>Submit</button>
                                   }
								</div>
							</form>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop25">
								<IAssureTable
									tableHeading={this.state.tableHeading}
                                    twoLevelHeader={this.state.twoLevelHeader} 
                                    dataCount={this.state.dataCount}
                                    tableData={this.state.tableData}
                                    getData={this.getData.bind(this)}
                                    tableObjects={this.state.tableObjects}
								/>			
							</div>
					</div>
				</div>
			</div>
		);
	}
}
