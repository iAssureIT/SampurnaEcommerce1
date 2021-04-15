import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import moment                 from "moment";
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import DispatchModal          from './dispatchModal.js'
import '../css/AdminOrdersList.css';
import { CSVLink, CSVDownload } from "react-csv";

//npm i mui-datatables
//npm i @material-ui/core
import MUIDataTable from "mui-datatables";

class AdminOrdersList extends Component{ 
    constructor(props) {
        super(props);

        if(!this.props.loading){ 
            this.state = {
                "orderData":[],
                "orderId": '',
                // "notificationData" :Meteor.subscribe("notificationTemplate"),
                "fromDate"     :'',
                "toDate"       : '',
                "status"  : '',
                "showStatusFilter" : true,
                "csvData"    : []
            };
        } else{
            this.state = {
                "orderData":[],
                "orderId": '',
                "fromDate"     : '',
                "toDate"       : '',
                "status"  : '',
                "showStatusFilter" : true,
                "csvData"    : []
            };
        }
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this.getBA();
        this.getOrdersBetweenDates();
    }
    
    getBA(){
      axios.get("/api/businessassociates/get/list")
            .then((response)=>{
              this.setState({
                  baList : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })  
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
          var ProductList = [];
          nextProps.allProductsArray.filter(function(item,index){
              if(ProductList.length > 0){
                var i = ProductList.findIndex(x => x.product_ID == item.product_ID);
                if(i <= -1){
                  ProductList.push(item);
                }       
              }else{
                ProductList.push(item);
              }
                
            return null;
          });	

            this.setState({
                "data": nextProps.data,
                "allProductsArray" : nextProps.allProductsArray,
                "filteredProductArray" : ProductList,
                "currentViewStatus" : nextProps.status,
                "showStatusFilter" : nextProps.showStatusFilter
             },()=>{
             });
        }
    }
    componentWillUnmount() {
        $("body").find("script[src='/js/adminLte.js']").remove();
        if(this.basicPageTracker)
          this.basicPageTracker.stop();
    }

    changeOrderStatus(event){

        event.preventDefault();
        var status = $(event.currentTarget).attr('data-status');
        var id = $(event.currentTarget).attr('data-id');
        
        if(status !== "Dispatch"){
            if(status!="Done"){
                swal({
                    text: 'Do you want to change status to '+status+ "?",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                  }).then((obj)=> {
                    if(obj==true){
                        var formValues = {
                          "orderID" :  id,  
                          "status"  :  status,
                          "userid"  :  localStorage.getItem('admin_ID')
                        }
                        axios.patch('/api/orders/patch/updateDeliveryStatus', formValues)
                        .then((response)=>{
                          this.props.getOrdersFun();
                          //console.log('response', response);
                          swal({
                            title : response.data.message,
                          });
                        })
                        .catch((error)=>{
                          console.log('error', error);
                        })
                    }
                  })
                  .catch((error)=>{
                    console.log('error', error);
                  })
            }
          }
      }   
    

    changeToPreviousStatus(event){
        event.preventDefault();   
        var id = $(event.currentTarget).attr('data-id'); 
        
        swal({
            text: 'Are you sure, do you want to change status to previous status',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((obj)=> {
            if(obj==true){
                // Meteor.call("changeAdminOrdersToPreviousStatus",id, currentstatus, (error, result)=>{
                
                // });
                var formValues = {
                      "orderID" :  id, 
                      "userid"  :  localStorage.getItem('admin_ID')
                    }
                    axios.patch('/api/orders/patch/changeToPreviousStatus', formValues)
                    .then((response)=>{

                      this.props.getOrdersFun();
                      swal({
                        title : response.data.message,
                      });
                    })
                    .catch((error)=>{
                      console.log('error', error);
                    })
            }
          });          
    }

    
    openModal(event){
      event.preventDefault();
      $('#dispatchModal').show();
      var id = $(event.currentTarget).attr('data-id');
      this.setState({orderId : id})
    }

    handleFromChange(event){
      event.preventDefault();
      const target = event.target;
      const name = target.name;

      this.setState({
          [name] : event.target.value,
      },()=>{
       this.getOrdersBetweenDates();
    });
    }
    handleToChange(event){
        event.preventDefault();
      const target = event.target;
      const name = target.name;

      this.setState({
          [name] : event.target.value,
      },()=>{
       this.getOrdersBetweenDates();
    });
    }

    onStatusChange(event){
      event.preventDefault();
      const {name,value} = event.target;
      this.setState({ 
        [name]:value,
      },()=>{
        this.getOrdersBetweenDates();
      });

    }

    onProductChange(event){
      event.preventDefault();
      const {name,value} = event.target;
      var total = 0;
      let productQty = this.state.allProductsArray.reduce(function(prev, current) {
        if(new String(current.product_ID).valueOf() == new String(value).valueOf()){
          total = total + current.quantity
        }
      }, 0); 

      this.setState({ 
        [name]:value,
        "productQty" : total
      },()=>{

      });
      
    }

    getOrdersBetweenDates(){
      var orderFilterData= {};
      orderFilterData.startDate = this.state.fromDate;
      orderFilterData.endDate = this.state.toDate;
      if(this.state.currentViewStatus){
        orderFilterData.status = this.state.currentViewStatus
      }else{
        orderFilterData.status = this.state.status !== 'all' ? this.state.status : ''
      }
      var userDetails = (localStorage.getItem('userDetails'));
      var userData = JSON.parse(userDetails);
      axios.get("/api/entitymaster/get/companyName/"+userData.companyID)
      .then((resdata)=>{
        orderFilterData.franchiseID = resdata.data._id;;
        axios.post("/api/orders/get/get_orders",orderFilterData)
            .then((response)=>{
              var UsersArray = [];
              var CsvDataArray = [];
                for (let i = 0; i < response.data.length; i++) {
                  var _id = response.data[i]._id;
                  var orderID = response.data[i].orderID;
                  var userFullName = response.data[i].userFullName;
                  var totalQuantity = response.data[i].cartQuantity;
                  var currency = response.data[i].currency;
                  var totalAmount = response.data[i].total;
                  var createdAt = moment(response.data[i].createdAt).format("DD/MM/YYYY hh:mm a");
                  var status = response.data[i].status;
                  var deliveryStatus = response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status === "Dispatch" ? 'Out for Delivery' : response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status;
                  var viewOrder =  "/viewOrder/"+response.data[i]._id;
                  var deliveryStatus =  response.data[i].deliveryStatus[response.data[i].deliveryStatus.length-1].status;
                  var billNumber = response.data[i].billNumber ? response.data[i].billNumber :'';

                  var UserArray = [];
                  var CsvArray = [];
                  UserArray.push(orderID);
                  // UserArray.push(billNumber);
                  UserArray.push(userFullName);
                  UserArray.push(totalQuantity);
                  UserArray.push(<i className={"fa fa-"+currency}>&nbsp;{(parseInt(totalAmount)).toFixed(2)}</i>);
                  UserArray.push(createdAt);
                  UserArray.push({status : status, deliveryStatus : deliveryStatus});
                  UserArray.push({_id:_id, viewOrder:viewOrder, deliveryStatus:deliveryStatus});
                  UsersArray.push(UserArray);

                  //Array for csv download
                  CsvArray.push(orderID);
                  CsvArray.push(userFullName);
                  CsvArray.push(totalQuantity);
                  CsvArray.push((parseInt(totalAmount)).toFixed(2));
                  CsvArray.push(moment(response.data[i].createdAt).format("DD/MM/YYYY hh:mm a"));
                  CsvArray.push(deliveryStatus);
                  CsvArray.push(status);
                  CsvDataArray.push(CsvArray);
                }

                this.setState({
                  data: UsersArray,
                  csvData:CsvDataArray
                },()=>{
                 // console.log("csvData",CsvDataArray);
                });

                this.setState({
                  orderData: response.data
                });
            })
            .catch((error)=>{
                console.log('error', error);
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }

   
    render(){
      const data = this.state.data;
      const csvColumns = ["Order Id", "Customer Name","Total Items","Total Price","Order Date","deliveryStatus","Status"];
      const csvData = [
        csvColumns
      ];
     
      this.state.csvData.map((val,ind)=>{
          csvData.push(val);
      })
      const options = {
        print: true, 
        download: false,
        viewColumns: true,
        filter: false,
        responsive: "stacked",
        selectableRows: 'none',
        customToolbar: () => { return (<CSVLink className="downloadCsv"  filename={this.props.tableTitle ? this.props.tableTitle+'.csv' : 'Order List.csv'} data={csvData}>  <i class="fa fa-cloud-download" aria-hidden="true" style={{color:'gray'}}></i>
        </CSVLink>) },
      };
      const columns = [
          { name:"Order Id" },
          // { name:"Bill Number" },
          { name:"Customer Name" }, 
          { name:"Total Items" },
          { name:"Total Price" },
          { name:"Order Date" },
          { name:"Status",
            options: {
              filter: false,
              sort: false,
              selectableRows: false, 
              customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <div>
                    <div className="admin-orders-stat1">
                        {value.status}
                    </div>
                    {/* <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 NoPadding"> */}
                    <div className={ 
                      value.deliveryStatus === "New Order" ?
                       "admin-orders-stat-NewOrder" : ( value.deliveryStatus === "Packed" ? "admin-orders-stat-Packed" : 
                          value.deliveryStatus === "Verified"    ? "admin-orders-stat-Verified"   : 
                          value.deliveryStatus === "Inspection"  ? "admin-orders-stat-Inspection" :
                          value.deliveryStatus === "Dispatch Approved"  ? "admin-orders-stat-OrderVerified" :
                          value.deliveryStatus === "Dispatch"    ? "admin-orders-stat-Dispatched" :
                          value.deliveryStatus === "To Deliver"    ? "admin-orders-stat-Dispatched" :
                          value.deliveryStatus === "Delivery Initiated"    ? "admin-orders-stat-Delivered" :
                          value.deliveryStatus === "Delivered & Paid"   ? "admin-orders-stat-Deliveredpaid" : 
                          value.deliveryStatus === "Returned"   ? "admin-orders-stat-Dispatched" : 
                          value.deliveryStatus === "Cancelled"   ? "admin-orders-stat-Dispatched" : ""

                              )  +" col-lg-12 col-md-12 col-sm-6 col-xs-12"
                                                          
                        }>
                        {
                           value.deliveryStatus === "Dispatch" ? "Dispatched" : value.deliveryStatus
                        }
                    </div>
                    
                    </div>
                  );
                }
              }    
          },
          {
            name: "Action",
            options: {
              filter: true,
              print: false, 
              sort: false,
              selectableRows: false, 
              customBodyRender: (value, tableMeta, updateValue) => {
                console.log('dsfhds', value.deliveryStatus);
                  return (

                    <div>

                    {
                    value.deliveryStatus === "Cancelled" || value.deliveryStatus === "Returned" || 
                    value.deliveryStatus === "Dispatch" || value.deliveryStatus === "Delivery Initiated" 
                    ||  value.deliveryStatus === "Delivered & Paid" || value.deliveryStatus === "New Order"? 
                            ""
                          :
                      <div className="admin-order-view col-lg-2 col-md-2"  onClick={this.changeToPreviousStatus.bind(this)} data-id={value._id} 
                              title={  
                                  value.deliveryStatus === "Verified"           ? "New Order" :
                                  value.deliveryStatus === "Packed"             ? "Verify Order" :
                                  value.deliveryStatus === "Inspection"         ? "Order Packed" :
                                  value.deliveryStatus === "Dispatch Approved"  ? "Inspect The Order" : 
                                  value.deliveryStatus === "Delivered & Paid"   ? "Done" : "Done"
                              } 
                              
                              >
                          <i className="fa fa-undo" aria-hidden="true"></i>
                      </div>
                  }

                    <a href={value.viewOrder} target="_blank" title="View Invoice" className="admin-order-view col-lg-2 col-md-2">
                        <i className="fa fa-eye" aria-hidden="true"></i>
                    </a>
                    
                    {
                      value.deliveryStatus === "Delivered & Paid" ? 
                      ""
                      :
                      <div className={
                        value.deliveryStatus === "New Order" ?
                           "col-lg-2" : ( value.deliveryStatus === "Packed" ? " col-lg-2" : 
                            value.deliveryStatus === "Verified"    ? " col-lg-2"   : 
                            value.deliveryStatus === "Inspection"  ? " col-lg-2" :
                            value.deliveryStatus === "Dispatch Approved"  ? " col-lg-2" :
                            value.deliveryStatus === "Dispatch"    ? " col-lg-2" :
                            value.deliveryStatus === "To Deliver"    ? " col-lg-2" :
                            value.deliveryStatus === "Delivery Initiated"    ? " col-lg-2" :
                            value.deliveryStatus === "Delivered & Paid"   ? " col-lg-2" : 
                            value.deliveryStatus === "Returned"   ? " col-lg-2" : 
                            value.deliveryStatus === "Cancelled"   ? " col-lg-2" : ""
                                ) 
                                                                                      
                        } onClick={  value.deliveryStatus !== "Dispatch Approved" ? this.changeOrderStatus.bind(this) : this.openModal.bind(this) } 
                            data-id={value._id} data-status={
                            value.deliveryStatus === "New Order"         ? " Verified" :  
                            value.deliveryStatus === "Verified"          ? "Packed" :  
                            value.deliveryStatus === "Packed"            ? "Inspection" :  
                            value.deliveryStatus === "Inspection"        ? "Dispatch Approved" :  
                            value.deliveryStatus === "Dispatch Approved"    ? "Dispatch" :  
                            value.deliveryStatus === "Dispatch"          ? "Delivery Initiated" :  
                            value.deliveryStatus === "Delivery Initiated"         ? "Delivered & Paid" :
                            value.deliveryStatus === "Delivered & Paid"  ? "Done" : "Done"
                          } 
                            title={
                              value.deliveryStatus === "New Order"          ? "Verify The Order" :  
                              value.deliveryStatus === "Verified"           ? "Order Packing" :  
                              value.deliveryStatus === "Packed"             ? "Inspect The Order" :  
                              value.deliveryStatus === "Inspection"         ? "Verify For Dispatch" :  
                              value.deliveryStatus== "Dispatch Approved"     ? "Dispatch Order" :  
                              value.deliveryStatus== "Dispatch"           ? "Initiate Order Delivery" :  
                              value.deliveryStatus === "Delivery Initiated" ? "Delivered & Paid" :  
                              value.deliveryStatus === "Delivered & Paid"   ? "Done" : "Done"
                            }
                            
                            data-currentstatus={
                                value.deliveryStatus === "New Order"          ? value.deliveryStatus :  
                                value.deliveryStatus === "Verified"           ? value.deliveryStatus :  
                                value.deliveryStatus === "Packed"             ? value.deliveryStatus :  
                                value.deliveryStatus === "Inspection"         ? value.deliveryStatus :  
                                value.deliveryStatus === "Dispatch Approved"  ? value.deliveryStatus :  
                                value.deliveryStatus === "Dispatch"           ? value.deliveryStatus :  
                                value.deliveryStatus === "Delivery Initiated" ? value.deliveryStatus : 
                                value.deliveryStatus === "Delivered & Paid"   ? value.deliveryStatus : ""
                            }
                            >
                            <i className={  
                               value.deliveryStatus === "New Order"          ? "fa fa-product-hunt admin-orders-stat-NewOrdericon" :  
                               value.deliveryStatus === "Verified"           ? "fa fa-check-square admin-orders-stat-Verifiedicon" :  
                               value.deliveryStatus === "Packed"             ? "fa fa-archive admin-orders-stat-Packedicon" :  
                               value.deliveryStatus === "Inspection"         ? "fa fa-info-circle admin-orders-stat-Inspectionicon" :  
                               value.deliveryStatus === "Dispatch Approved"  ? "fa fa-angellist admin-orders-stat-OrderVerifiedicon" :  
                               value.deliveryStatus === "Dispatch"           ? "fa fa-truck admin-orders-stat-Dispatchedicon" :  
                               value.deliveryStatus === "Delivery Initiated" ? "fa fa-check-circle admin-orders-stat-Deliveredicon" :  
                               value.deliveryStatus === "Delivered & Paid"   ? "fa fa-check-circle" : ""
                            }
                               aria-hidden="true"></i>
                        </div>
                    }
                    
                    </div>                                               
                  );
                }
            }

          }
        ];
        return(    
        // <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				// <div className="row">
				// 	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
				// 		<section className="content">
				// 			<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
          


              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row"> 
                <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NoPadding">
                <div className="formWrapper">
                  <section className="content">
                    <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBottomCSS">
                    <br/>
                      <div className="row">
                          <div className="admin-orders-SubTitleRow  row">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                <div className="admin-orders-listofColors">
                                    <span className="">
                                        <span className="admin-orders-stat-NewOrder comm-status-of-order"></span>
                                        New Order
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Verified comm-status-of-order"></span>
                                        Verified
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Packed comm-status-of-order"></span>
                                        Packed
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Inspection comm-status-of-order"></span>
                                        Inspection
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-OrderVerified comm-status-of-order"></span>
                                        Dispatch Approved
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Dispatched comm-status-of-order"></span>
                                        Dispatched
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Delivered comm-status-of-order"></span>
                                        Delivery Initiated
                                    </span>
                                    <span className="">
                                        <span className="admin-orders-stat-Deliveredpaid comm-status-of-order"></span>
                                        Delivered & Paid
                                    </span>
                                   </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            {/* <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
											        <label>Date:</label>
											        <input type="Date" className="col-lg-6 col-md-6 form-control" value={this.state.filterByDate} name="filterByDate" refs="filterByDate" onChange={this.onChangeDate.bind(this)} id="filterByDate"/>
									        	</div> */}
                            <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
                              <label>From Date</label>
                              <div className="reports-select-date-from3">
                                <input onChange={this.handleFromChange.bind(this)} name="fromDate" ref="fromDateCustomised" value={this.state.fromDate} type="date" className="reportsDateRef form-control" placeholder=""  />
                              </div>
                            </div>
                            <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
                              <label>To Date</label>
                              <div className="reports-select-date-to3">
                                <input onChange={this.handleToChange.bind(this)} name="toDate" ref="toDateCustomised" value={this.state.toDate} type="date" className="reportsDateRef form-control" placeholder=""   />
                              </div>
                            </div>
                            {this.state.showStatusFilter === true ?
                            <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
                                  <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left">Select Status </label>
                                  <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="status" name="status" value={this.state.status} onChange={this.onStatusChange.bind(this)} >
                                    <option name="roleListDDOption" disabled="disabled" defaultValue="-- Select --">-- Select --</option>
                                    <option value="all" name="roleListDDOption">Show All</option>
                                    <option value="New Order">New Order</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Packed">Packed</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Dispatch Approved">Dispatch Approved</option>
                                    <option value="Dispatch">Dispatch</option>
                                    <option value="Delivery Initiated">Delivery Initiated</option>
                                    <option value="Delivered & Paid">Delivered & Paid</option>  
                                    <option value="Returned">Returned</option>  
                                    <option value="Cancelled">Cancelled</option>  
                                  </select>
                            </div>
                            : null }
                            <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12">
                            <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left text-left">Select Product</label>
                                <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="product" name="product" value={this.state.product} onChange={this.onProductChange.bind(this)} >
                                  <option name="roleListDDOption" disabled="disabled" defaultValue="-- Select --">-- Select --</option>
                                  {
                                    this.state.filteredProductArray && this.state.filteredProductArray.length > 0 ?
                                      this.state.filteredProductArray.map((data, i)=>{
                                        return(
                                        <option key={i} value={data.product_ID}>{data.productName}</option>
                                        );
                                      })
                                    :
                                    null
                                  }
                                </select>
                            </div>
                            {this.state.productQty ?
                            <div className="form-group col-lg-3 col-md-3 col-xs-12 col-sm-12" style={{"padding-top": "28px"}}>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                  Quantity : {this.state.productQty}
                                </div>
                            </div>
                            : null}
                        </div>
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive orderTableWrapper">
                          <MUIDataTable
                            title={this.props.tableTitle ? this.props.tableTitle : 'Order List'}
                            options={options}
                            data={data}
                            columns={columns}
                            />

                          
                            {
                              /*<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   
                                  <div className="admin-orders-SubTitleTable marginTop11">
                                      <table className="table iAssureITtable-bordered table-striped table-hover">
                                          <thead className="tempTableHeader">
                                              <tr>
                                                  <th className="col-lg-1 whiteSpace">Order ID</th>
                                                  <th className="col-lg-2">Customer</th>
                                                  <th className="col-lg-1">Total Items</th>
                                                  <th className="col-lg-1">Total Price</th>
                                                  <th className="col-lg-1 whiteSpace">Order Date</th>
                                                  <th className="col-lg-2">Status</th>
                                                  <th className="col-lg-2">Action</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {
                                                  this.state.orderData.map((listData, index)=>{
                                                      return(
                                                          <tr key={index}>
                                                              <td className="col-lg-1">
                                                                  {listData.orderID}
                                                              </td>
                                                              <td className="col-lg-2">
                                                                  {listData.userFullName }
                                                              </td>
                                                             
                                                              <td className="col-lg-1 textAlignRight">
                                                                  {listData.totalQuantity }
                                                              </td>
                                                              <td className="col-lg-1 textAlignRight">
                                                                 
                                                                 <i className={"fa fa-"+listData.currency}>&nbsp;{(parseInt(listData.total)).toFixed(2)}</i>                                                              </td>
                                                              <td className="col-lg-1 textAlignCenter">
                                                                  { moment(listData.createdAt).format("MMM Do YY") }
                                                                  
                                                              </td>
                                                              <td className="col-lg-2">
                                                                  <div className="admin-orders-stat1">
                                                                      {listData.status}
                                                                  </div>
                                                                  <div className={ 
                                                                        listData.deliveryStatus[0].status === "New Order" ?
                                                                         "admin-orders-stat-NewOrder" : ( listData.deliveryStatus[0].status === "Packed" ? "admin-orders-stat-Packed" : 
                                                                            listData.deliveryStatus[0].status === "Verified"    ? "admin-orders-stat-Verified"   : 
                                                                            listData.deliveryStatus[0].status === "Inspection"  ? "admin-orders-stat-Inspection" :
                                                                            listData.deliveryStatus[0].status === "Dispatch Approved"  ? "admin-orders-stat-OrderVerified" :
                                                                            listData.deliveryStatus[0].status === "Dispatch"    ? "admin-orders-stat-Dispatched" :
                                                                            listData.deliveryStatus[0].status === "To Deliver"    ? "admin-orders-stat-Dispatched" :
                                                                            listData.deliveryStatus[0].status === "Delivery Initiated"    ? "admin-orders-stat-Delivered" :
                                                                            listData.deliveryStatus[0].status === "Delivered & Paid"   ? "admin-orders-stat-Deliveredpaid" : 
                                                                             listData.deliveryStatus[0].status === "Returned"   ? "admin-orders-stat-Dispatched" : 
                                                                            listData.deliveryStatus[0].status === "Cancelled"   ? "admin-orders-stat-Dispatched" : ""
                                                                                ) 
                                                                                                                                    
                                                                      }>
                                                                      {
                                                                         listData.deliveryStatus[0].status === "Dispatch" ? "Dispatched" : listData.deliveryStatus[0].status 
                                                                      }
                                                                  </div>
                                                                  <div className="dispatchdetails col-lg-12">
                                                                                                                                                           
                                                                   <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={"dispatchDetails"+listData._id} role="dialog">
                                                                          <div className="modal-dialog adminModal addressModal-dialog">
                                                                          <div className="modal-content adminModal-content col-lg-12 col-md-12  col-sm-12 col-xs-12 noPadding">
                                                                              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">                                                                              
                                                                              <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11">DISPATCH ORDER</h4>
                                                                              <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                                                                                <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)} data-target={"openSubCatgModal"}>&times;</button>
                                                                              </div>
                                                                              </div>
                                                                              <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                              <form className="dispatchForm" onSubmit={this.addDispatchDetails.bind(this)} id={listData._id} data-id={listData._id}>
                                                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                                  
                                                                                  <div className="row inputrow">
                                                                                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                                                                                      <div className="form-group">
                                                                                          <br/>
                                                                                          <label>Business Associate</label><span className="astrick">*</span>
                                                                                          <div className="input-group">
                                                                                          <span className="input-group-addon" id="basic-addon1"><i className="fa fa-gg" aria-hidden="true"></i></span>
                                                                                            <select className="form-control" id="businessAssociate">
                                                                                            { this.state.baList && this.state.baList.length > 0 ?
                                                                                                this.state.baList.map( (data, index)=>{
                                                                                                    return (
                                                                                                      <option key={index} value={data.userID}>{data.companyName}{ data.locationDetails.length > 0 ?  ' ( '+ data.locationDetails[0].area +''+'-'+  data.locationDetails[0].pincode +' )' : ''}</option>
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
                                                                                  <div className="row inputrow">
                                                                                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                                                                                      <div className="form-group">
                                                                                          <label>Expected Delivery Date</label><span className="astrick">*</span>
                                                                                          <input name="expDeliveryDate" type="date" className="expDeliveryDate form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="expDeliveryDate"  />
                                                                                      </div>
                                                                                      </div>
                                                                                  </div>
                                                                                  </div>
                                                                                  <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" onClick={this.closeModal.bind(this)} data-dismiss="modal">CANCEL</button>
                                                                                      </div>
                                                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                                          <input  type="submit" className="btn adminFinish-btn col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" value="DISPATCH" />
                                                                                      </div>
                                                                                  </div>
                                                                              </form>
                                                                              </div>
                                                                          </div>
                                                                          
                                                                          </div>
                                                                      </div>
                                                                  
                                                                  </div>

                                                              </td>
                                                              <td className="col-lg-2 textAlignCenter">

                                                              {listData.deliveryStatus[0].status === "Cancelled" || listData.deliveryStatus[0].status === "Returned" || 
                                                              listData.deliveryStatus[0].status === "Dispatch" || listData.deliveryStatus[0].status === "Delivery Initiated" ||  listData.deliveryStatus[0].status === "Delivered & Paid" || listData.deliveryStatus[0].status === "New Order"? 
                                                                      ""
                                                                      :
                                                                  <div className="admin-order-view"  onClick={this.changeToPreviousStatus.bind(this)} data-id={listData._id} data-status={
                                                                              listData.deliveryStatus[0].status === "New Order"         ? "Nothing" :  
                                                                              listData.deliveryStatus[0].status === "Verified"          ? "New Order" :  
                                                                              listData.deliveryStatus[0].status === "Packed"            ? "Verified" :  
                                                                              listData.deliveryStatus[0].status === "Inspection"        ? "Packed" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"    ? "Inspection" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"          ? "Dispatch Approved" :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated"  ? "Dispatch" :
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"  ? "Delivery Initiated" : "Nothing"
                                                                          } 
                                                                          title={
                                                                              listData.deliveryStatus[0].status === "New Order"          ? "Verify The Order" :  
                                                                              listData.deliveryStatus[0].status === "Verified"           ? "Order Packing" :  
                                                                              listData.deliveryStatus[0].status === "Packed"             ? "Inspect The Order" :  
                                                                              listData.deliveryStatus[0].status === "Inspection"         ? "Verify For Dispatch" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"     ? "Dispatch Order" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"           ? "Initiate Order Delivery" :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated" ? "Delivered & Paid" :  
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"   ? "Done" : "Done"
                                                                          } 
                                                                          data-currentstatus={
                                                                              listData.deliveryStatus[0].status === "New Order"          ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Verified"           ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Packed"             ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Inspection"         ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"     ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"           ? listData.deliveryStatus[0].status :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated"          ? listData.deliveryStatus[0].status : 
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"   ? listData.deliveryStatus[0].status : ""
                                                                          }
                                                                          >
                                                                      <i className="fa fa-undo" aria-hidden="true"></i>
                                                                  </div>
                                                              }
                                                                {
                                                                  <a href={"/viewOrder/"+listData._id} target="_blank" title="View Invoice" className="admin-order-view">
                                                                      <i className="fa fa-eye" aria-hidden="true"></i>
                                                                  </a>  
                                                                }
                                                                  {listData.deliveryStatus[0].status === "Dispatch" || listData.deliveryStatus[0].status === "Delivery Initiated" || listData.deliveryStatus[0].status === "Delivered & Paid" ? 
                                                                      ""
                                                                      :
                                                                      <div className="admin-order-changeStatus " onClick={this.changeOrderStatus.bind(this)} data-id={listData._id} data-status={
                                                                              listData.deliveryStatus[0].status === "New Order"         ? "Verified" :  
                                                                              listData.deliveryStatus[0].status === "Verified"          ? "Packed" :  
                                                                              listData.deliveryStatus[0].status === "Packed"            ? "Inspection" :  
                                                                              listData.deliveryStatus[0].status === "Inspection"        ? "Dispatch Approved" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"    ? "Dispatch" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"          ? "Delivery Initiated" :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated"         ? "Delivered & Paid" :
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"  ? "Done" : "Done"
                                                                          } 
                                                                          title={
                                                                              listData.deliveryStatus[0].status === "New Order"          ? "Verify The Order" :  
                                                                              listData.deliveryStatus[0].status === "Verified"           ? "Order Packing" :  
                                                                              listData.deliveryStatus[0].status === "Packed"             ? "Inspect The Order" :  
                                                                              listData.deliveryStatus[0].status === "Inspection"         ? "Approve For Dispatch" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"     ? "Dispatch Order" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"           ? "Initiate Order Delivery" :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated" ? "Delivered & Paid" :  
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"   ? "Done" : "Done"
                                                                          }
                                                                          data-target={
                                                                              listData.deliveryStatus[0].status === "New Order"         ? "" :  
                                                                              listData.deliveryStatus[0].status === "Verified"          ? "" :  
                                                                              listData.deliveryStatus[0].status === "Packed"            ? "" :  
                                                                              listData.deliveryStatus[0].status === "Inspection"        ? "" :  
                                                                              listData.deliveryStatus[0].status === "Dispatch Approved"    ? "#dispatchDetails"+listData._id :  
                                                                              listData.deliveryStatus[0].status === "Dispatch"          ? "" :  
                                                                              listData.deliveryStatus[0].status === "Delivery Initiated"         ? "" :  
                                                                              listData.deliveryStatus[0].status === "Delivered & Paid"  ? "" : ""
                                                                          } 
                                                                          data-toggle="modal"
                                                                          >
                                                                          <i className={  
                                                                         listData.deliveryStatus[0].status === "New Order"          ? "fa fa-product-hunt admin-orders-stat-NewOrdericon" :  
                                                                         listData.deliveryStatus[0].status === "Verified"           ? "fa fa-check-square admin-orders-stat-Verifiedicon" :  
                                                                         listData.deliveryStatus[0].status === "Packed"             ? "fa fa-archive admin-orders-stat-Packedicon" :  
                                                                         listData.deliveryStatus[0].status === "Inspection"         ? "fa fa-info-circle admin-orders-stat-Inspectionicon" :  
                                                                         listData.deliveryStatus[0].status === "Dispatch Approved"     ? "fa fa-angellist admin-orders-stat-OrderVerifiedicon" :  
                                                                         listData.deliveryStatus[0].status === "Dispatch"           ? "fa fa-truck admin-orders-stat-Dispatchedicon" :  
                                                                         listData.deliveryStatus[0].status === "Delivery Initiated"          ? "fa fa-check-circle admin-orders-stat-Deliveredicon" :  
                                                                         listData.deliveryStatus[0].status === "Delivered & Paid"   ? "fa fa-check-circle" : ""
                                                                      }
                                                                         aria-hidden="true"></i>
                                                                      </div>
                                                                  }


                                                                  
                                                              </td>
                                                          </tr>
                                                      );
                                                  })
                                              }


                                          </tbody>
                                      </table>
                                  </div>
                              </div>*/
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div id="dispatchModal" className="modal ssmodal">
                    <button type="button" className="close dispatchModalClose">&times;</button>
                    <DispatchModal baList={this.state.baList} orderId={this.state.orderId}  />
                  </div>
                  </div>
                </div>
              </div>
            </div> 
        );
    }
}

export default AdminOrdersList
