import React from 'react';
import './PurchaseManagement.css';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';

export default class FranchiseCurrentStock extends React.Component {
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
					
                        productName         : "Product Name",
                        franchiseName       : "Franchise Name",
                        totalStock          : 'Total Stock',	 
                      
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
                    franchiseList       : [],
                    selectedFranchise   : 'all',

			      	
      };
	}
	

	componentDidMount(){
		this.getproducts();
		var serchByDate = moment(new Date()).format("YYYY-MM-DD");
		// console.log("today",today);
        this.getCurrentStockReport();
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
	
	getCurrentStockReport(){
		var reportFilterData = this.state.reportFilterData;
		if(this.state.filterByProduct !== "Select Product"){
			reportFilterData.itemcode = this.state.filterByProduct;
		}else{
			delete reportFilterData["itemcode"];
        }

        if(this.state.selectedFranchise !== "all"){
			reportFilterData.franchiseId = this.state.selectedFranchise;
		}else{
			delete reportFilterData["franchiseId"];
        }
        
		console.log("reportFilterData",reportFilterData);

		axios
		.post('/api/finishedGoodsEntry/post/getProductCurrentStockReport/',reportFilterData)
		.then((response)=>{
			console.log("response",response);
			var tableData = response.data.map((a, i) => {
					return {
						_id                  : a._id,
                        productName 	     : a.productName  ? a.productName +' - '+ a.productCode +' - '+ a.itemCode: "" ,
                        franchiseName          : a.franchiseName ? a.franchiseName :'',
						totalStock           : a.totalStock    ? a.totalStock +' '+ a.StockUnit : 0,
						
                    }
                    
            });

            // var data =  [...new Map(tableData.map(item => [item['itemCode'], item])).values()]
            
			this.setState({
				tableData : tableData,          
			},()=>{
                console.log("tableData",tableData);
                this.getFranchiseList();
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
		  this.getCurrentStockReport(value);
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
		   this.getCurrentStockReport();
	   });
    }
    handleToChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
          [name] : event.target.value,
       },()=>{
		  this.getCurrentStockReport();
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
    
	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="">Franchise Current Stock</h4>
                        </div>
						
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mtop25">
							<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
									<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Product</label>
									<select className="form-control productFilter" aria-describedby="basic-addon1" name="filterByProduct" id="filterByProduct" ref="filterByProduct" value={this.state.filterByProduct} onChange={this.filterChange.bind(this)}>
									<option value="Select Product" disabled="">-- Select --</option>
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
                            <div className="col-lg-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
				 			<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left labelform">Select Franchise</label>
							<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="selectedFranchise" name="selectedFranchise" value={this.state.selectedFranchise} onChange={this.filterChange.bind(this)} >
								<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
								<option value="all" name="roleListDDOption">Show All</option>
								{
									this.state.franchiseList && this.state.franchiseList.length > 0 ?
										this.state.franchiseList.map((data, index) => {
											// console.log("companyDropdown==>",data);
											return (
												<option key={index} value={data._id}>{data.companyName}</option>
											);
										})
										:
										<option value='user'>User</option>
								}
							</select>
				</div> 
							<IAssureTable
								tableHeading={this.state.tableHeading}
								twoLevelHeader={this.state.twoLevelHeader} 
								dataCount={this.state.dataCount}
								tableData={this.state.tableData}
								getData={this.getCurrentStockReport.bind(this)}
								tableObjects={this.state.tableObjects}
							/>			
							</div>
					</div>
				</div>
			</div>
		);
	}
}
