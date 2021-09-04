import React from 'react';
import './PurchaseManagement.css';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import swal from 'sweetalert';
import axios from 'axios';
import jQuery, { isNumeric } from 'jquery';
import $ from 'jquery';
import moment from 'moment';
import Loader from '../loader/Loader.js'; 
import BulkUpload   from "../bulkupload/BulkUpload.js";
import { isNumber } from 'underscore';
export default class PurchaseManagement extends React.Component {

	constructor(props) {
		super(props);
		  this.state = {
			      	amount 				: '',
			      	purchaseDate 		: '',
			      	purchaseStaff 		: '',
			      	purchaseLocation	: '',
			      	quantity			: '',
			      	unitRate 			: '',
			      	Details				:'',
			      	purchaseNumber		:'',
			      	product 			: '',
			      	Units 				: 'Kg',
			      	serchByDate         : '',
			      	"twoLevelHeader"    : {
						            apply  : false,
						           },
		             "tableHeading"     : {
						date            : 'Pur Date',
						PurchaseNumber  : 'PR Number',
						Details         : 'Details',
						Supplier        : 'Supplier',
						PurchasedBy     : 'Purchased By',
						productName     : "Product",
						UnitRate        : 'Unit Rate',
						UnitOfMeasurement : 'UOM',
						Quantity        : 'Quantity',
						TotalAmount     : 'Total Amount',
						actions        	: 'Action',
					},
					"tableObjects" 		: {
						deleteMethod    : 'delete',
		                apiLink         : '/api/purchaseentry',
		                paginationApply : false,
		                searchApply     : false,
		                editUrl         : '/purchase-management'
					},
		            "startRange"        : 0,
		            "limitRange"        : 10, 
					"editId"            : this.props.match.params ? this.props.match.params.purchaseId : '',
					fileDetailUrl           : "/api/purchaseentry/get/filedetails/",
					goodRecordsTable      : [],
					failedRecordsTable    : [],
					goodRecordsHeading :{
					  purchaseDate          : "Purchase Date",
					  purchaseNumber        : "Purchase Number",
					  detail                : "Details",
					  supplier              : "Supplier",
					  purchasedBy           : "Purchased By",        
					  productName           : "Product Name",  
					  itemCode              : "Item Code",      
					  unit                  : "Unit",        
					  quantity              : "Quantity",
					  amount                : "Total Amount ",
					  //action                : "Action"
				    },
					failedtableHeading :{
					  purchaseDate          : "Purchase Date",
					  purchaseNumber        : "Purchase Number",
					  detail                : "Details",
					  supplier              : "Supplier",
					  purchasedBy           : "Purchased By",        
					  productName           : "Product Name", 
					  itemCode              : "Item Code",      
					  unit                  : "Unit",        
					  quantity              : "Quantity",
					  amount                : "Total Amount ",
					  failedRemark          :  "Failed Data Remark",
					//  action                : "Action",
					},
					
		            blockActive			    : "all",
		            listofRoles	            : "",
		            adminRolesListData      : [],
		            checkedUser             : [],
		            activeswal              : false,
		            blockswal               : false,
		            confirmDel              : false,
					tableData               : "",
					PoNumbersArray			:[],
					selectedPurchaseNum 	:'All',
					selectedProductName 	: 'All',
					filterData 				: {},
					PurchaseNumberArray		:[],
					totalPoAmount 			: 0,
					ItemCode   				: '',
					ProductCode             : '',
					unitOfMeasurement       :'Kg',
					unitOfMeasurementArray  : [],
					completeProductName     : ''     	
	  };
	  this.uploadedData = this.uploadedData.bind(this);
	  this.getFileDetails = this.getFileDetails.bind(this);
	}
	

	componentDidMount(){
		var userDetails = JSON.parse(localStorage.getItem("userDetails"));
      	var token       = userDetails.token;
      	axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

		this.getproducts();
		var serchByDate = moment(new Date()).format("YYYY-MM-DD");
		var editId = this.props.match.params.purchaseId;
		this.getData();
		this.GeneratePurchaseNumber();
		this.getUom();
		this.setState({
			purchaseDate   : serchByDate
        });

		$.validator.addMethod("noSpace", function(value, element) { 
			return value == '' || value.trim().length != 0;
		  }, "No space please and don't leave it empty");

		$.validator.addMethod("validDate", function(value, element) {
			return !isNaN((new Date(value)).getTime());
			//return this.optional(element) || moment(value,"MM/DD/YYYY").isValid();
		}, "Please enter a valid date in the format MM/DD/YYYY");

		$.validator.addMethod("validPoNum", function(value, element) {
			return (/^-{0,1}\d+$/.test(value.replace(/[PR+]/g, '')));
		}, "Please enter a valid Purchase order Number");

		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
	  
		  $("#addNewPurchaseOrder").validate({
			rules: {
			  purchaseDate: {
				required: true,
				validDate:true
			  },
			  purchaseLocation: {
				required: true,
				noSpace: true
			  },
			  purchaseNumber: {
				required: true,	
				noSpace: true,
				validPoNum : true
			  },
			  purchaseStaff:{
				required: true,
				noSpace: true
			  },
			  product:{
				  required:true,
				  noSpace: true
			  },
			  unitRate:{
				  required:true,
				  noSpace: true,
				  maxlength: 6,
				//   digits: true
			  },
			  quantity:{
				  required:true,
				  noSpace: true
			  },
			  amount:{
				  required:true,
				  noSpace: true
			  }

			},
			errorPlacement: function (error, element) {
			  if (element.attr("name") === "purchaseDate") {
				error.insertAfter("#purchaseDate");
			  }
			  if (element.attr("name") === "purchaseLocation") {
				error.insertAfter("#purchaseLocation");
			  }
			  if (element.attr("name") === "purchaseNumber") {
				error.insertAfter("#purchaseNumber");
			  }
			  
			  if (element.attr("name") === "purchaseStaff") {
				error.insertAfter("#purchaseStaff");
			  }
			  if (element.attr("name") === "product") {
				error.insertAfter("#product");
			  }
			  if (element.attr("name") === "unitRate") {
				error.insertAfter(".unitRateDiv");
			  }
			  if (element.attr("name") === "quantity") {
				error.insertAfter(".quantityDiv");
			  }
			  if (element.attr("name") === "amount") {
				error.insertAfter(".amountDiv");
			  }
			}
		  });

	}
	componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.purchaseId;
        if(nextProps.match.params.purchaseId){
          this.setState({
			editId : editId,
          })
          this.edit(editId);
        }
	}
	/*bulk upload start*/
	uploadedData(data){
		this.getData(this.state.startRange,this.state.limitRange)
	}

	getFileDetails(fileName){
		// console.log("fileName",fileName);
		axios
		.get(this.state.fileDetailUrl+fileName)
		.then((response)=> {
		// console.log("response.data in material==>",response.data);
		// $('.fullpageloader').hide();  
		if (response) {
		  this.setState({
			  fileDetails:response.data,
			  failedRecordsCount : response.data.failedRecords.length,
			  goodDataCount : response.data.goodrecords.length
			},()=>{
				console.log("this.state.fileDetails==>",this.state.fileDetails);
			});
			
			var tableData = response.data.goodrecords.map((a, i)=>{

			return{
				"purchaseDate"        : a.purchaseDate      ? moment(a.purchaseDate).format("YYYY-MM-DD")  : '-',
				"purchaseNumber"      : a.purchaseNumber    ? a.purchaseNumber    : '-',
				"detail"              : a.details  ? a.details : '-',
				"supplier"            : a.purchaseLocation  ? a.purchaseLocation : '-',
				"purchasedBy"         : a.purchaseStaff     ? a.purchaseStaff : '-',
				"productName"         : a.productName     ? a.productName : '-',
				"itemCode"            : a.itemCode   ? a.itemCode : '-',
				"unit"                : a.unit     ? a.unit : '-',
				"quantity"            : a.quantity     ? a.quantity : '-',
				"amount"              : a.amount ? a.amount : '-',
			}
		  })
  
		  var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
		  return{
			  "purchaseDate"        : a.purchaseDate      ? moment(a.purchaseDate).format("YYYY-MM-DD") : '-',
			  "purchaseNumber"      : a.purchaseNumber    ? a.purchaseNumber    : '-',
			  "detail"              : a.details  ? a.details : '-',
			  "supplier"            : a.purchaseLocation  ? a.purchaseLocation : '-',
			  "purchasedBy"         : a.purchaseStaff     ? a.purchaseStaff : '-',
			  "productName"         : a.product     ? a.product : '-',
			  "itemCode"            : a.itemCode   ? a.itemCode : '-',
			  "unit"                : a.Units     ? a.Units : '-',
			  "quantity"            : a.quantity     ? a.quantity : '-',
			  "amount"              : a.amount ? a.amount : '-',
			  "failedRemark"        : a.remark     ? a.remark : '-'
		  }
		  })
		  this.setState({
			  goodRecordsTable : tableData,
			  failedRecordsTable : failedRecordsTable
		  })
		}
		})
		.catch((error)=> { 
			console.log("error => ",error);
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

	/* Bulk upload end*/
	edit(id){
         $("#addNewPurchaseOrder").validate().resetForm();
        axios.get('/api/purchaseentry/get/one/'+id)
        .then((response)=>{
			var itemCode    = response.data.itemCode;
			var productCode = response.data.productCode;
			var	productName = response.data.productName;
			var completeProductName = productName + " - " +productCode+" - "+itemCode;
            this.setState({
                "amount"         	: response.data.amount ,
		        "purchaseDate" 		: moment(response.data.purchaseDate).format("YYYY-MM-DD"),
				"purchaseStaff" 	: response.data.purchaseStaff,
				"ItemCode"          : response.data.itemCode,
				"ProductCode"       : response.data.productCode,
		      	"purchaseLocation"  : response.data.purchaseLocation,
		      	"quantity" 			: response.data.quantity,
		      	"unitRate" 	        : response.data.unitRate,
		      	"purchaseNumber"    : response.data.purchaseNumber,
		      	"Details" 			: response.data.Details,
		      	"product" 		    : response.data.productName,
				"Units" 			: response.data.unit,
				"UnitOfMeasurement" : response.data.unitOfMeasurement ? response.data.unitOfMeasurement : 'Kg',
				"completeProductName" : completeProductName
			});
            
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
        });
    }
	getData(startRange, limitRange){ 
		var dateToSearch=this.state.serchByDate;
		var filterData = this.state.filterData;
		if(this.state.selectedPurchaseNum != "All"){
			filterData.purchaseNumber = this.state.selectedPurchaseNum;
		}else{
			delete filterData["purchaseNumber"];
		}

		if(this.state.selectedProductName != "All"){
			filterData.productName = this.state.selectedProductName;
		}else{
			delete filterData["productName"];
		}
		if(dateToSearch){
			filterData.purchaseDate = moment(dateToSearch).format("YYYY-MM-DD");
		}
		axios
		.post('/api/purchaseentry/post/datewisepurchase/',filterData)
		.then((response)=>{
			//console.log("response",response);
			var  tableData = response.data ;
				var tableData = tableData.map((a, i) => {
					console.log("response.data.goodrecords==>",tableData);
			
						return {
							_id                 : a._id,
							date   				: a.purchaseDate ? moment(a.purchaseDate).format("DD-MMM-YYYY") : "",
							PurchaseNumber 		: a.purchaseNumber ? a.purchaseNumber : "" ,
							Details 			: a.Details ,
							Supplier            : a.purchaseLocation,
							PurchasedBy 		: a.purchaseStaff ? a.purchaseStaff : "" ,
							productName 		: a.productName ? a.productName + '-' + a.productCode + '-' +a.productCode : "",
							UnitRate 	        : a.unitRate ,
							UnitOfMeasurement   : a.unitOfMeasurement,
							Quantity 			: a.quantity +' '+ a.unit,
							TotalAmount         : a.amount,
						}
				});
				var PoNumbersArray = [];
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
					this.getPurNumberList();
				});
			})
		.catch((error)=>{
			console.log("error = ", error);      
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
		}); 
		
    }
    getSearchText(searchText, startRange, limitRange){

	}

	GeneratePurchaseNumber(){
		axios.get("/api/purchaseentry/get/GeneratePurchaseNumber")
		.then((response) => {
			console.log("GeneratePurchaseNumber",response.data);
			this.setState({
				purchaseNumber : response.data
			},()=>{
				// console.log("GeneratePurchaseNumber",this.state.purchseNumber);
			});
		})
		.catch((error) => {
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
				 console.log("unitOfMeasurementArray",unitOfMeasurementArray);
			});
		})
		.catch((error) => {
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

	getPurNumberList(){
		axios.get("/api/purchaseentry/get/PurchaseNumbers")
            .then((response) => {
				var PurchaseNumberArray = [];
                response.data.map((data, ind) => {
                    PurchaseNumberArray.push(data)
                });
                this.setState({
                    PurchaseNumberArray: PurchaseNumberArray,
                    messageData: {}
                })
            })
            .catch((error) => {
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
    setunCheckedUser(value){
		this.setState({
			unCheckedUser : value,
		})
	}
	selectedUser(checkedUsersList){
		this.setState({
			checkedUser : checkedUsersList,
		})
	}
	getRole(){
		
	}
	selectedRole(event){
		event.preventDefault();
					    
	}
	handleChangeDate(event){
      event.preventDefault();
      var dateVal = event.target.id;
	  const {name,value} = event.target;
      this.setState({ 
        [name]:value,
 
      },()=>{
		this.getData();
      });
    }

	handleChange(event){
      event.preventDefault();
	  const {name,value} = event.target;
	  this.setState({ 
		[name]:value,
      },()=>{

	  });
	}

	onChangeProduct(event){
		event.preventDefault();
		const {name,value} = event.target;
		var itemCode = '';
		var unit = '';
		var productCode = '';
		var productName = '';
		var completeProductName = '';
  
		var productDatalist = $(".productDatalist").find("option[value='" + name + "']");
		$(".productDatalist option").filter(function(index,item){
			if(item.value == event.target.value){
				itemCode    = $(item).data('itemcode');
				productCode = $(item).data('productcode');
				unit        = $(item).data('unit');
				productName = $(item).data('productname');
				completeProductName = productName + " - " +productCode+" - "+itemCode;
			}
		});
		console.log("productName",productName);
		if(productName){
			this.setState({ 
				"ItemCode"         : itemCode,
				"ProductCode"      : productCode,
				"Units"            : unit,
				"unitOfMeasurement": unit,
				"product"          : productName,
				"completeProductName" : completeProductName,
			 },()=>{
				 console.log(this.state.completeProductName);
			 });
		}else{
			this.setState({ 
				[name]:value,
			  },()=>{
			   });
		}
	}

	onChangePoNum(event){
		event.preventDefault();
		var val = event.target.value.replace(/[PR+]/g, '');
		if(/^-{0,1}\d+$/.test(val)){
			event.target.value = event.target.value.replace(/[PR+]/g, ''); //replace all $ with empty string
		    event.target.value = 'PR' + event.target.value; //prepend $ to the input value
		}else{
			event.target.value = 'PR'; //replace all $ with empty string
		}

		var {name,value} = event.target;
		this.setState({ 
			[name]:value,
		},()=>{
		});
	}

	onChangeUnitRate(event){
		event.preventDefault();
		var {name,value} = event.target;
		var invalidChars = /[^0-9.]/gi;
		if(invalidChars.test(value)) {
			value = value.replace(invalidChars,"");
		}
		this.setState({ 
			[name]:value,
		},()=>{
		});
	}

	onChangeUnit(event){
		event.preventDefault();
		var {name,value} = event.target;
		this.setState({ 
			[name]:value,
			Units : value,
			unitOfMeasurement : value
		},()=>{

		});
	}
	filterChange(event){
	  event.preventDefault();
      const {name,value} = event.target;

      this.setState({ 
        [name]:value,
	  },()=>{
		 this.getData();
	   });
	}
    handleProduct(event){
    	var valproduct = event.currentTarget.value;
		this.setState({product : valproduct});

    }
    handleProduct1(event){
		var valpurchaseLocation = event.currentTarget.value;
		this.setState({purchaseLocation : valpurchaseLocation});

	}
	
	calculateAmount(event){
		var Amount;
		const {name,value} = event.target;
		this.setState({ 
			[name]:value,
			amount: this.state.unitRate * this.state.quantity
		  },()=>{
		  });
	};
	
	getproducts(){
        axios.get('/api/products/get/list')
		.then((response) => {
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
			console.log("error => ", error);
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
    Submit(event){
	  event.preventDefault();
	//   $(event.target).addClass()
	  var productDatalist = $(".productDatalist").find("option[value='" + this.state.product + "']");
      const formValues1 = {
        "amount"         	: this.state.amount ,
        "purchaseDate" 		: this.state.purchaseDate,
      	"purchaseStaff" 	: this.state.purchaseStaff,
      	"purchaseLocation"  : this.state.purchaseLocation,
      	"quantity" 			: this.state.quantity,
		"productName" 		: this.state.product,
		"itemCode"          : this.state.ItemCode,
		"productCode"       : this.state.ProductCode,
      	"unit" 				: this.state.Units,
		"unitRate" 	        : this.state.unitRate,
		"unitOfMeasurement" : this.state.unitOfMeasurement,
		"purchaseNumber"    : this.state.purchaseNumber,
		"Details" 			: this.state.Details,
	  };
	  console.log("productDatalist",productDatalist,this.state.product);
	  if(this.state.unitOfMeasurement  === this.state.Units){
		if ($('#addNewPurchaseOrder').valid()) {
			if((productDatalist != null && productDatalist.length > 0)) {
				 axios
				.post('/api/purchaseentry/post',formValues1)
				.then((response) => {
				// handle success
					swal("Thank you. Raw Material added successfully.");
				})
				.catch(function (error) {
				// handle error
					console.log("error => ",console.error());
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
				});
				this.setState({
					amount            : "",     
					product           : "",    	
					quantity          : "", 			
					product           : "", 
					ItemCode          : "",		
					Units             : "Kg",
					unitRate          : "",
					unitOfMeasurement : "Kg",
					completeProductName : ""
				},()=>{
					this.getData();
				});  
			}else{
				swal("Please select product from list.");
				this.setState({
					product:''
				})
			}
		  }
	  }else{
		swal("You have to select same unit of measurement for unit rate and quantity.");
	  }

	
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
			"itemCode"          : this.state.ItemCode,
			"productCode"       : this.state.ProductCode,
	      	"unit" 				: this.state.Units,
			"unitRate" 	        : this.state.unitRate,
			"unitOfMeasurement" : this.state.unitOfMeasurement,
			"purchaseNumber"    : this.state.purchaseNumber,
			"Details" 			: this.state.Details,
        }
		if($("#addNewPurchaseOrder").valid()){
            axios.patch('/api/purchaseentry/patch/'+this.state.editId,formValues)
            .then((response)=>{
                this.props.history.push('/purchase-management');
                swal("Purchase Entry updated successfully.");
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    "amount"         	: "" ,
			        "purchaseDate" 		: "",
			      	"purchaseStaff" 	: "",
			      	"purchaseLocation"  : "",
			      	"quantity" 			: "",
					"product" 		    : "",
					"ItemCode"          : "",
				    "unit"              : "Kg",
					"unitOfMeasurement" : "Kg",
                    "unitRate"          : "",
				    "purchaseNumber"    : "",
					"Details" 		    :"",	
					"editId"            : "",
					"completeProductName" : ""
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
	}



	render() {
		return (
			<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pmcontentWrap">
					<div className='col-lg-12 col-md-12 col-xs-12 col-sm-12 pmpageContent'>
						<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                            <h4 className="col-lg-3 col-md-3 col-sm-12 col-xs-12" style={{"display":"inline","float":"left"}}>Purchase Entry</h4>
							<ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12" style={{"display":"inline","float":"right"}}>
                    		  <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manual">Manual</a></li>
                    		  <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulk">Bulk Upload</a></li>
                  		   </ul>
                        </div>
						<div className="tab-content ">
							<div id="manual" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 tab-pane fade in active">
								<form className="mtophr20" id="addNewPurchaseOrder">
									<div className="row">
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
											<label >Purchase Date <i className="redFont">*</i></label>
											<input type="Date"  className="form-control"  value={ this.state.purchaseDate} name="purchaseDate" refs="purchaseDate" onChange={this.handleChange.bind(this)} id="purchaseDate"/>
										</div>
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
											<label >Supplier <i className="redFont">*</i></label>
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
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
											<label >Purchased By(Staff Name) <i className="redFont">*</i></label>
											<input type="text" placeholder="Enter Purchase Staff"  className="form-control"  value={ this.state.purchaseStaff} name="purchaseStaff" refs="purchaseStaff" onChange={this.handleChange.bind(this)} id="purchaseStaff"/>
										</div>
									</div>
									<div  className="row NOpadding mtop20"> 
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
											<label >Purchase Receipt Number <i className="redFont">*</i></label>
											<input type="text" placeholder="Enter Purchase Receipt Number"  className="form-control"  value={this.state.purchaseNumber} name="purchaseNumber" refs="purchaseNumber" onChange={this.onChangePoNum.bind(this)} id="purchaseNumber"/>
										</div>
										<div className="form-group col-lg-8 col-md-8 col-xs-12 col-sm-12 mbt25">
											<label >Details</label>
											<input type="text" placeholder="Enter Purchase Details"  className="form-control"  value={ this.state.Details} name="Details" refs="Details" onChange={this.handleChange.bind(this)} id="Details"/>
										</div>
										
									</div>
									
									<div  className="row  NOpadding">
											<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25 ">
												<label >Select Product <i className="redFont">*</i></label>
												<input list="product" type="search" refs="product" className="form-control" placeholder="Select Product" value={this.state.completeProductName}  onChange={this.onChangeProduct.bind(this)} name="completeProductName" autoComplete="off"/> 
												<datalist id="product" name="product" className="productDatalist">
													{
														this.state.productArray && this.state.productArray.length > 0 ?
															this.state.productArray.map((data, i)=>{
																return(
																	<option key={i} value={data.productName} data-itemcode={data.itemCode} data-productcode={data.productCode} data-unit={data.unit} data-productname={data.productName}>{data.productName} - {data.productCode} - {data.itemCode}</option>
																);
															})
														:
														<option>No products available</option>
													}
												</datalist>
											</div>
											<div className="formht col-lg-3 col-md-3 col-sm-12 col-xs-12">
											<div className="">
												<label className="control-label statelabel locationlabel" >Rate Per Unit<i className="redFont">*</i></label>
												<div className="input-group inputBox-main  new_inputbx unitRateDiv" >
													<div className="input-group-addon inputAddon inputAddon inputAddon inputIcon">
													   <i className="fa fa-rupee"></i>
													   {/* pattern="\d{5}" */}
													</div> 
													<input type="text" placeholder="" className="form-control new_inputbx1"  value={ this.state.unitRate} name="unitRate"   pattern="\d{6}" maxlength="5" refs="unitRate" onChange={this.onChangeUnitRate.bind(this)} id="unitRate" min="0.001"  onBlur={this.calculateAmount.bind(this)}  style={{borderRight: "1px solid gray"}}/>
													<div className="input-group-addon inputAddon inputAddon inputAddon inputIcon prependSelect" style={{"borderLeft": "1px solid gray !important"}}>
														<select id="unitOfMeasurement"  name="unitOfMeasurement" value={this.state.unitOfMeasurement} onChange={this.onChangeUnit.bind(this)}  className="input-group" style={{"border":0,"width": "65px","fontSize":"small"}}> 
															<option selected={true} disabled={true}>-- Select --</option>
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
													</div> 
												</div>     
											</div>  
											</div>
										
										<div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12 mbt25">
											<label >Quantity <i className="redFont">*</i></label>
											<div className="quantityDiv">
												<input type="number" placeholder="Enter quantity " className="h34 col-lg-7 col-md-7 col-xs-8 col-sm-8 quantityinput" value={ this.state.quantity} name="quantity" refs="quantity" onChange={this.handleChange.bind(this)} id="quantity" min="1" onBlur={this.calculateAmount.bind(this)}/>
												<select id="Units" className="col-lg-5 col-md-5 col-xs-4 col-sm-4 h34 quantityinput" name="Units" value={this.state.Units} refs="Units" onChange={this.onChangeUnit.bind(this)}  >
												    <option selected={true} disabled={true}>-- Select --</option>
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
											</div>
										</div>
										<div className="formht col-lg-3 col-md-3 col-sm-12 col-xs-12">
										<div className="">
											<label className="control-label statelabel locationlabel" >Amount <i className="redFont">*</i></label>
											<div className="input-group inputBox-main  new_inputbx amountDiv" >
												<div className="input-group-addon inputAddon inputAddon inputAddon inputIcon">
												<i className="fa fa-rupee"></i>
												</div> 
												<input type="number" placeholder="" className="form-control new_inputbx1" value={ this.state.amount} name="amount" refs="amount" onChange={this.handleChange.bind(this)} id="amount" min="1"/>
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
								<div className="row mtop25">
								   <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								       <h4>Raw Material</h4>
								   </div>
								</div>
								<div className="row">
									<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12">
										<label>Purchase Date:</label>
										{/* <div className="form-group"> */}
										<input type="Date" placeholder="1234" className="col-lg-6 col-md-6 form-control" value={this.state.serchByDate} name="serchByDate" refs="serchByDate" onChange={this.handleChangeDate.bind(this)} id="serchByDate"/>
										{/* </div> */}
									</div>
									<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
										<label>Purchase Number:</label>
										<select className="form-control allPoNumbers" aria-describedby="basic-addon1" name="selectedPurchaseNum" id="selectedPoNum" ref="selectedPoNum" value={this.state.selectedPurchaseNum} onChange={this.filterChange.bind(this)}>
										<option>All</option>
											{
												this.state.PurchaseNumberArray && this.state.PurchaseNumberArray.length > 0 ?
													this.state.PurchaseNumberArray.map((data, i)=>{
														return(
															<option key={i}>{data}</option>
														);
													})
												:
												null
											}
										</select>
									</div>
									<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 mbt25">
										<label>Product Name:</label>
										<select className="form-control allProducts" aria-describedby="basic-addon1" name="selectedProductName" id="SelectProduct" ref="SelectProduct" value={this.state.selectedProductName} onChange={this.filterChange.bind(this)}>
										<option>All</option>
										{
											this.state.productArray && this.state.productArray.length > 0 ?
												this.state.productArray.map((data, i)=>{
													return(
														<option key={i}>{data.productName}</option>
													);
												})
											:
											null
										}
										</select>
									</div>
								</div>
								<div className="row">
									<IAssureTable
										tableHeading={this.state.tableHeading}
										twoLevelHeader={this.state.twoLevelHeader} 
										dataCount={this.state.dataCount}
										tableData={this.state.tableData}
										getData={this.getData.bind(this)}
										tableObjects={this.state.tableObjects}
									/>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mtop25" style={{textAlignLast: "end"}}>
									<div className="form-group col-lg-8 col-md-8 col-xs-12 col-sm-12">
										<label>Total</label>
									</div>
									<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12">
										<label><i className="fa fa-rupee"></i> {this.state.totalPoAmount}</label>
									</div>
								</div>
							</div>
							<div id="bulk" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 tab-pane fade in">
								<div className="row outerForm">
									<BulkUpload 
										url="/api/purchaseentry/raw_material_bulk_upload" 
										data={{"purchaseNumber" : this.state.purchaseNumber}} 
										uploadedData={this.uploadedData} 
										fileurl="../BulkUploadTemplates/Raw material Inward Template.xlsx"
										fileDetailUrl={this.state.fileDetailUrl}
										getFileDetails={this.getFileDetails}
										getData={this.getData.bind(this)}
										fileDetails={this.state.fileDetails}
										goodRecordsHeading ={this.state.goodRecordsHeading}
										failedtableHeading={this.state.failedtableHeading}
										failedRecordsTable ={this.state.failedRecordsTable}
										failedRecordsCount={this.state.failedRecordsCount}
										goodRecordsTable={this.state.goodRecordsTable}
										goodDataCount={this.state.goodDataCount}
									/>
								</div>
							</div>
						</div>		
					</div>
				</div>
			</div>
		);
	}
}
