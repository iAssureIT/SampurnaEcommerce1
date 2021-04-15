import React from 'react';
import './PurchaseManagement.css';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';
import jQuery, { isNumeric } from 'jquery';
import $ from 'jquery';
export default class PurchaseManagement extends React.Component {

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
		                date            : 'Date',
		        		ProductCode     : "Product Code",
		        		ItemCode 		: "Item Code",
		        		productName     : "Product Name",
						OpeningStock    : 'Opening Stock',
		                StockAddedToday : 'Stock Added Today',
		                TotalStock      : 'Total Stock',
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
		            tableData : ""
			      	
      };
	}
	

	componentDidMount(){
		this.getproducts();
		var serchByDate = moment(new Date()).format("YYYY-MM-DD");
		// console.log("today",today);

		var editId = this.props.match.params.purchaseId;
        console.log('ven', editId);
		this.getData();
	

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
	edit(id){
        // $("#taxMaster").validate().resetForm();
        axios.get('/api/purchaseentry/get/one/'+id)
        .then((response)=>{
            console.log('res', response);
            this.setState({
                "amount"         	: response.data.amount ,
		        "purchaseDate" 		: response.data.purchaseDate,
		      	"purchaseStaff" 	: response.data.purchaseStaff,
		      	"purchaseLocation"  : response.data.purchaseLocation,
		      	"quantity" 			: response.data.quantity,
		      	"unitRate" 	        : response.data.unitRate,
		      	"purchaseNumber"    : response.data.purchaseNumber,
		      	"Details" 			: response.data.Details,
		      	"productName" 		: response.data.product,
		      	"unit" 				: response.data.Units,
            });
            
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
	getData(startRange, limitRange){ 
		var dateToSearch=this.state.serchByDate;
		console.log("dateToSearch", moment(dateToSearch).format("YYYY-MM-DD"));
	 axios
      .get('/api/purchaseentry/get/datewisepurchase/'+this.state.serchByDate)
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
						_id                  :a._id,
						date   				: a.purchaseDate ? moment(a.purchaseDate).format("DD-MMM-YYYY") : "",
						ProductCode 		: a.ProductCode ? a.ProductCode : "" ,
						ItemCode 			: a.ItemCode ? a.ItemCode : "" ,
						productName 		: a.productName,
						OpeningStock 		: a.OpeningStock ? a.OpeningStock : "" ,
						StockAddedToday 	: "",
						TotalStock 			: "" ,
						
					/*	purchaseStaff		:
						purchaseLocation 	:
						quantity 			:
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
	handleChangeDate(event){
      event.preventDefault();
      var dateVal = event.target.id;
      // console.log("datVal",dateVal);
      // const datatype = event.target.getAttribute('data-text');
      const {name,value} = event.target;

      this.setState({ 
        [name]:value,
 
      },()=>{
      	console.log("date",this.state.serchByDate);
		this.getData();

      } );
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
    handleProduct1(event){
    	var valpurchaseLocation = event.currentTarget.value;
    	console.log("valpurchaseLocation",valpurchaseLocation);
		this.setState({purchaseLocation : valpurchaseLocation});

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
    Submit(event){
    event.preventDefault();

    const formValues1 = {
        "amount"         	: this.state.amount ,
        "purchaseDate" 		: this.state.purchaseDate,
      	"purchaseStaff" 	: this.state.purchaseStaff,
      	"purchaseLocation"  : this.state.purchaseLocation,
      	"quantity" 			: this.state.quantity,
      	"productName" 		: this.state.product,
      	"unit" 				: this.state.Units,
      	"unitRate" 	    : this.state.unitRate,
		"purchaseNumber"    : this.state.purchaseNumber,
		"Details" 			: this.state.Details,
       
      };
      console.log("formValues1",formValues1);
      axios
			.post('/api/purchaseentry/post',formValues1)
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
				 amount          : "",         	
		         purchaseDate    : "", 		
		      	 purchaseStaff   : "", 	
		      	 purchaseLocation: "",  
		      	 quantity        : "", 			
		      	 product         : "", 		
		      	 Units           : "",
		      	 unitRate    : "",
			     purchaseNumber  : "",
				 Details 		 :"",	
      	 })		
	}
	update(event){
        event.preventDefault();
        var formValues = {
            
             "amount"         	: this.state.amount ,
	        "purchaseDate" 		: this.state.purchaseDate,
	      	"purchaseStaff" 	: this.state.purchaseStaff,
	      	"purchaseLocation"  : this.state.purchaseLocation,
	      	"quantity" 			: this.state.quantity,
	      	"productName" 		: this.state.product,
	      	"unit" 				: this.state.Units,
	      	"unitRate" 	        : this.state.unitRate,
			"purchaseNumber"    : this.state.purchaseNumber,
			"Details" 			: this.state.Details,
        }
        /*if($("#taxMaster").valid()){*/
            axios.patch('/api/purchaseentry/patch/'+this.state.editId,formValues)
            .then((response)=>{
                this.props.history.push('/purchase-management');
                swal(response.data.message);
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    "amount"         	: "" ,
			        "purchaseDate" 		: "",
			      	"purchaseStaff" 	: "",
			      	"purchaseLocation"  : "",
			      	"quantity" 			: "",
			      	"productName" 		: "",
			      	"unit" 				: "",
                    "unitRate"      : "",
				     "purchaseNumber"   : "",
					 "Details" 		    :"",	
                     editId             : ""
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
                            <h4 className="">Purchase Entry</h4>
                        </div>
						<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
							<form className="col-lg-12 col-md-12 col-xs-12 col-sm-12 mtophr20">
							 <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<div className="row">
									<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
										<label >Purchase Date</label>
										<input type="Date"  className="form-control"  value={ this.state.purchaseDate} name="purchaseDate" refs="purchaseDate" onChange={this.handleChange.bind(this)} id="purchaseDate"/>
									</div>
									<div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 mbt25">
										<label >Supplier</label>
										<input list="purchaseLocation" type="text" refs="purchaseLocation" className="form-control"    placeholder="Select Supplier" value={this.state.purchaseLocation}  onChange={this.handleChange.bind(this)}  onBlur={this.handleProduct1.bind(this)} name="purchaseLocation" />
	    								{/*<input type="text" list="societyList" className="form-control" ref="society" value={this.state.societyName} onChange={this.handleChange.bind(this)} onBlur={this.handleSociety.bind(this)} name="societyName" placeholder="Enter Society" />*/}
										
										  <datalist id="purchaseLocation" name="purchaseLocation" >
										    <option value="Open Market"/>
										    {/*<option value="cauliflower"/>
										    <option value="spinach"/>
										    <option value="onion"/>
										    <option value="garlic"/>*/}
										  </datalist>
									</div>
								  </div>
								 </div>	
								      <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding"> 
									    <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
											<label >Purchase No</label>
											<input type="text" placeholder="Enter Purchase No"  className="form-control"  value={ this.state.purchaseNumber} name="purchaseNumber" refs="purchaseNumber" onChange={this.handleChange.bind(this)} id="purchaseNumber"/>
										</div>
										<div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 mbt25">
											<label >Details</label>
											<input type="text" placeholder="Enter Purchase Details"  className="form-control"  value={ this.state.Details} name="Details" refs="Details" onChange={this.handleChange.bind(this)} id="Details"/>
										</div>
										<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
											<label >Purchased By(Staff Name)</label>
											<input type="text" placeholder="Enter Purchase Staff"  className="form-control"  value={ this.state.purchaseStaff} name="purchaseStaff" refs="purchaseStaff" onChange={this.handleChange.bind(this)} id="purchaseStaff"/>
										</div>
									</div>
						         <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
{/*
                                       <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor <sup className="astrick">*</sup></label>
                                                    <select id="vendor" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vendor} ref="vendor" name="vendor" onChange={this.handleChange.bind(this)}>
                                                        <option>--Select Vendor--</option>
                                                        {
                                                            this.state.productArray && this.state.productArray.length > 0 ?
                                                                this.state.productArray.map((data, i)=>{
                                                                    return(
                                                                        <option key={i} value={data._id}>{data.productName}</option>
                                                                    );
                                                                })
                                                            :
                                                            null
                                                        }
                                                    </select>
                                                </div>
*/}

										<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
											<label >Select Product</label>
											{/*<input type="text" className="form-control" id="email"/>*/}
											<input list="product" type="text" refs="product" className="form-control"    placeholder="Select Product" value={this.state.product}  onChange={this.handleChange.bind(this)}  onBlur={this.handleProduct.bind(this)} name="product" />
		    								{/*<input type="text" list="societyList" className="form-control" ref="society" value={this.state.societyName} onChange={this.handleChange.bind(this)} onBlur={this.handleSociety.bind(this)} name="societyName" placeholder="Enter Society" />*/}
											
											  <datalist id="product" name="product" >
											    {/* <option value="Broccoli"/> */}
											    {
                                                    this.state.productArray && this.state.productArray.length > 0 ?
                                                        this.state.productArray.map((data, i)=>{
                                                            return(
                                                                <option>{data.productName}</option>
                                                            );
                                                        })
                                                    :
                                                    null
                                                }
											  </datalist>
										</div>
										 <div className="formht col-lg-3 col-md-3 col-sm-12 col-xs-12">
					                       <div className="">
					                        <label className="control-label statelabel locationlabel" >Unit Rate</label>
					                          <div className="input-group inputBox-main  new_inputbx " >
						                           <div className="input-group-addon inputIcon">
						                           <i class="fa fa-rupee"></i>
						                         </div> 
						                         <input type="number" placeholder="1234" className="form-control new_inputbx1" value={ this.state.unitRate} name="unitRate" refs="unitRate" onChange={this.handleChange.bind(this)} id="unitRate"/>
					                         </div>     
					                      </div>  
                   					     </div>
									{/*<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
										<label >Unit Rate</label>
										<input type="number" placeholder="1234" className="form-control" value={ this.state.unitRate} name="unitRate" refs="unitRate" onChange={this.handleChange.bind(this)} id="unitRate"/>
									</div>*/}
									<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
										<label >Quantity</label>
										<div className="">
											<input type="number" placeholder="Enter quantity " className="h34 col-lg-8 col-md-8 col-xs-8 col-sm-8" value={ this.state.quantity} name="quantity" refs="quantity" onChange={this.handleChange.bind(this)} id="quantity"/>
											<select id="Units"  name="Units" value={this.state.Units} refs="Units" onChange={this.handleChange.bind(this)}  className="col-lg-4 col-md-4 col-xs-4 col-sm-4 h34">
												<option selected={true} disabled={true}>-- Select --</option>
											  	<option value="Kg">Kg</option>
											  	<option value="Ltr">Ltr</option>
											  	<option value="gram">gram</option>
											  	<option value="Nos">Nos</option>
											</select>
										</div>
									</div>
									 <div className="formht col-lg-3 col-md-3 col-sm-12 col-xs-12">
				                       <div className="">
				                        <label className="control-label statelabel locationlabel" >Amount</label>
				                          <div className="input-group inputBox-main  new_inputbx " >
					                           <div className="input-group-addon inputIcon">
					                           <i class="fa fa-rupee"></i>
					                         </div> 
					                         <input type="number" placeholder="12345678" className="form-control new_inputbx1" value={ this.state.amount} name="amount" refs="amount" onChange={this.handleChange.bind(this)} id="amount"/>
				                         </div>     
				                       </div>  
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
						  <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 mbt25">
							<div className="col-lg-4 col-md-4"><label>Search By Date:</label></div>
							<div className="col-lg- col-md-6">
							 <input type="Date" placeholder="1234" className="col-lg-6 col-md-6 form-control" value={this.state.serchByDate} name="serchByDate" refs="serchByDate" onChange={this.handleChangeDate.bind(this)} id="serchByDate"/>
                            </div>
						</div>
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
