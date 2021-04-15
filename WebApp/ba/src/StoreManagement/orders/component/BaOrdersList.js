import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import moment                 from "moment";
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import '../css/AdminOrdersList.css';
import MUIDataTable from "mui-datatables";


class BaOrdersList extends Component{
    constructor(props) {
        super(props);

        if(!this.props.loading){
            this.state = {
                "orderData":[]
                
            };
            
        } else{
            this.state = {
                "orderData":[]
            };
        }
        
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this.getOrders();   
    }
    getOrders(){
      var ba_ID = localStorage.getItem('admin_ID')
      axios.get("/api/orders/get/listbyba/"+ba_ID)
            .then((response)=>{

              var finaldata = $(response.data).filter(function (i,n){
                  return (n.deliveryStatus[n.deliveryStatus.length-1].status == 'Dispatch'
                     || n.deliveryStatus[n.deliveryStatus.length-1].status == 'Delivery Initiated' 
                     || n.deliveryStatus[n.deliveryStatus.length-1].status == 'Delivered & Paid' || n.deliveryStatus[n.deliveryStatus.length-1].status == 'Returned' 
                     || n.deliveryStatus[n.deliveryStatus.length-1].status == 'Cancelled' ); 
              });
              

              var UsersArray = [];
                for (let i = 0; i < finaldata.length; i++) {
                  console.log('finaldata',finaldata[i].deliveryStatus);
                  var _id = finaldata[i]._id;
                  var orderID = finaldata[i].orderID;
                  var userFullName = finaldata[i].userFullName;
                  var totalQuantity = finaldata[i].totalQuantity;
                  var currency = finaldata[i].currency;
                  var totalAmount = finaldata[i].total;
                  var createdAt = moment(finaldata[i].createdAt).format("DD/MM/YYYY hh:mm a");
                  var status = finaldata[i].status;
                  var deliveryStatus = finaldata[i].deliveryStatus[finaldata[i].deliveryStatus.length-1].status == "Dispatch" ? 'Out for Delivery' : response.data[i].deliveryStatus[finaldata[i].deliveryStatus.length-1].status;
                  var viewOrder =  "/viewOrder/"+finaldata[i]._id;
                  var deliveryStatus =  finaldata[i].deliveryStatus[finaldata[i].deliveryStatus.length-1].status;

                  var UserArray = [];
                  UserArray.push(orderID);
                  UserArray.push(userFullName);
                  UserArray.push(totalQuantity);
                  UserArray.push(<i className={"fa fa-"+currency}>&nbsp;{(parseInt(totalAmount)).toFixed(2)}</i>);
                   
                  UserArray.push(createdAt);
                  UserArray.push({status : status, deliveryStatus : deliveryStatus});
                  UserArray.push({_id:_id, viewOrder:viewOrder, deliveryStatus:deliveryStatus});
                  
                  UsersArray.push(UserArray);
                }
                this.setState({
                  data: UsersArray
                });

                this.setState({
                    orderData : finaldata
                })
            })
            .catch((error)=>{   
                console.log('error', error);
            })
    }
    
    
    componentWillReceiveProps(nextProps){
      console.log(nextProps);
        
        
    }
    componentWillUnmount() {
      //this.getOrders();
        $("body").find("script[src='/js/adminLte.js']").remove();
        if(this.basicPageTracker)
          this.basicPageTracker.stop();
    }

    changeOrderStatus(event){
        event.preventDefault();
        var status = $(event.currentTarget).attr('data-status');
        var id = $(event.currentTarget).attr('data-id');
        
        if(status != "Dispatch"){
            if(status!="Done"){
                swal({
                    title: 'Do you want to change status to '+status+ "?",
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
                          "userid"  :  1
                        }
                        axios.patch('/api/orders/patch/updateDeliveryStatus', formValues)
                        .then((response)=>{
                          this.getOrders();
                          
                          swal({
                            title : response.data.message,
                            text  : response.data.message,
                          });
                        })
                        .catch((error)=>{
                          console.log('error', error);
                        })
                    }
                  });
            }
        }   
    }

    closeModal(event){
        // console.log('event',event);
        event.preventDefault();
        $('.dispatchCompanyName').val('');
        $('.deliveryPersonName').val('');
        $('.deliveryPersonContact').val('');
    }
    render(){
      const data = this.state.data;
      const options = {
        print: false,
        viewColumns: false,
        filter: false,
        responsive: "stacked",
        selectableRows: 'none',
        download:false
      };
      const columns = [
          { name:"Order Id" },
          { name:"Customer Name" }, 
          { name:"Total Items" },
          { name:"Total Price" },
          { name:"Order Date" },
          { name:"Status",
            options: {
              filter: true,
              sort: false,
              selectableRows: false, 
              customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <div>
                    <div className="admin-orders-stat1">
                        {value.status}
                    </div>
                    <div className={ 
                          value.deliveryStatus == "Dispatch" ?
                          "admin-orders-stat-Dispatched" : ( 
                              value.deliveryStatus == "Delivery Initiated"    ? "admin-orders-stat-Delivered" :
                              value.deliveryStatus == "Delivered & Paid"   ? "admin-orders-stat-Deliveredpaid" : ""
                          ) 
                        }>
                        {
                           value.deliveryStatus == "Dispatch" ? 'To Deliver': value.deliveryStatus
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
              sort: false,
              selectableRows: false, 
              customBodyRender: (value, tableMeta, updateValue) => {
                
                  return (

                    <div>

                    {
                    value.deliveryStatus == "Cancelled" || value.deliveryStatus == "Returned" || 
                    value.deliveryStatus == "Dispatch" || value.deliveryStatus == "Delivery Initiated" 
                    ||  value.deliveryStatus == "Delivered & Paid" || value.deliveryStatus == "New Order"? 
                            ""
                          :
                      <div className="admin-order-view"  onClick={this.changeToPreviousStatus.bind(this)} data-id={value._id} data-status={
                                  value.deliveryStatus == "New Order"         ? "Nothing" :  
                                  value.deliveryStatus == "Verified"          ? "New Order" :  
                                  value.deliveryStatus == "Packed"            ? "Verified" :  
                                  value.deliveryStatus == "Inspection"        ? "Packed" :  
                                  value.deliveryStatus == "Dispatch Approved" ? "Inspection" :  
                                  value.deliveryStatus == "Dispatch"          ? "Dispatch Approved" :  
                                  value.deliveryStatus == "Delivery Initiated" ? "Dispatch" :
                                  value.deliveryStatus == "Delivered & Paid"  ? "Delivery Initiated" : "Nothing"
                              } 
                              title={
                                  value.deliveryStatus == "New Order"          ? "Verify The Order" :  
                                  value.deliveryStatus == "Verified"           ? "Order Packing" :  
                                  value.deliveryStatus == "Packed"             ? "Inspect The Order" :  
                                  value.deliveryStatus == "Inspection"         ? "Verify For Dispatch" :  
                                  value.deliveryStatus == "Dispatch Approved"     ? "Dispatch Order" :  
                                  value.deliveryStatus == "Dispatch"           ? "Initiate Order Delivery" :  
                                  value.deliveryStatus == "Delivery Initiated" ? "Delivered & Paid" :  
                                  value.deliveryStatus == "Delivered & Paid"   ? "Done" : "Done"
                              } 
                              data-currentstatus={
                                  value.deliveryStatus == "New Order"          ? value.deliveryStatus :  
                                  value.deliveryStatus == "Verified"           ? value.deliveryStatus :  
                                  value.deliveryStatus == "Packed"             ? value.deliveryStatus :  
                                  value.deliveryStatus == "Inspection"         ? value.deliveryStatus :  
                                  value.deliveryStatus == "Dispatch Approved"  ? value.deliveryStatus :  
                                  value.deliveryStatus == "Dispatch"           ? value.deliveryStatus :  
                                  value.deliveryStatus == "Delivery Initiated" ? value.deliveryStatus : 
                                  value.deliveryStatus == "Delivered & Paid"   ? value.deliveryStatus : ""
                              }
                              >
                          <i className="fa fa-undo" aria-hidden="true"></i>
                      </div>
                  }

                    <a href={value.viewOrder} target="_blank" title="View Invoice" className="admin-order-view">
                        <i className="fa fa-eye" aria-hidden="true"></i>
                    </a>
                    {
                      value.deliveryStatus == "Delivered & Paid" ? 
                      ""
                      :
                      <div className="admin-order-changeStatus" onClick={this.changeOrderStatus.bind(this)} data-id={value._id} data-status={
                          value.deliveryStatus == "Dispatch"          ? "Delivery Initiated" :  
                          value.deliveryStatus == "Delivery Initiated" ? "Delivered & Paid" :
                          value.deliveryStatus == "Delivered & Paid"  ? "Done" : "Done"
                      } 
                      title={
                          value.deliveryStatus == "Dispatch"           ? "Initiate Delivery" : 
                          value.deliveryStatus == "Delivery Initiated" ? "Deliver and Recieve Payment " :  
                          value.deliveryStatus == "Delivered & Paid"   ? "Done" : "Done"
                      }
                      data-target={
                          value.deliveryStatus == "Dispatch"          ? "" :  
                          value.deliveryStatus == "Delivery Initiated"         ? "" :  
                          value.deliveryStatus == "Delivered & Paid"  ? "" : ""
                      } 
                      data-toggle="modal"
                      >
                      <i className={                                                                    
                        value.deliveryStatus == "Dispatch"           ? "fa fa-truck admin-orders-stat-Dispatchedicon" :  
                        value.deliveryStatus == "Delivery Initiated" ? "fa fa-check-circle admin-orders-stat-Deliveredicon" :  
                        value.deliveryStatus == "Delivered & Paid"   ? "fa fa-check-circle" : ""
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
            <div className="container-fluid">
              <div className="row">
                <div className="formWrapper">
                  <section className="content">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                            Shipment Tracking                     
                          </div>
                          <hr className="hr-head container-fluid row"/>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                              <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop">
                                   <div className="admin-orders-SubTitleRow  row">
                                      <div className="col-lg-12">
                                          <div className="admin-orders-listofColors">
                                              <span className="">
                                                  <span className="admin-orders-stat-Dispatched comm-status-of-order"></span>
                                                  To Deliver
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
                                  <br/>
                                  <div className="col-md-12">
                                    <MUIDataTable
                                      title=""
                                      options={options}
                                      data={data}
                                      columns={columns}
                                      />
                                  </div>
                                  {
                                  /*<div className="admin-orders-SubTitleTable marginTop11">
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
                                                  this.state.orderData.map((index, listData)=>{
                                            
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
                                                                 <i className={"fa fa-"+listData.currency}>&nbsp;{(parseInt(listData.totalAmount)).toFixed(2)}</i>  
                                                              </td>
                                                              <td className="col-lg-1 textAlignCenter">
                                                                  { moment(listData.createdAt).format("MMM Do YY") }
                                                                  
                                                              </td>
                                                              <td className="col-lg-2">
                                                                  <div className="admin-orders-stat1">
                                                                      {listData.status}
                                                                  </div>
                                                                  <div className={ 
                                                                        listData.deliveryStatus[0].status == "Dispatch" ?
                                                                         "admin-orders-stat-Dispatched" : ( 
                                                                            
                                                                            listData.deliveryStatus[0].status == "Delivery Initiated"    ? "admin-orders-stat-Delivered" :
                                                                            listData.deliveryStatus[0].status == "Delivered & Paid"   ? "admin-orders-stat-Deliveredpaid" : ""
                                                                                ) 
                                                                                                                                    
                                                                      }>
                                                                      {
                                                                         listData.deliveryStatus[0].status == "Dispatch" ? 'To Deliver': listData.deliveryStatus[0].status
                                                                      }
                                                                  </div>
                                                                  

                                                              </td>
                                                              <td className="col-lg-2 textAlignCenter">
                                                                  {
                                                                  <a href={"/viewOrder/"+listData._id} target="_blank" title="View Invoice" className="admin-order-view">
                                                                      <i className="fa fa-eye" aria-hidden="true"></i>
                                                                  </a>
                                                                  }
                                                                  {listData.deliveryStatus[0].status == "Delivered & Paid" ? 
                                                                      ""
                                                                      :
                                                                      <div className="admin-order-changeStatus" onClick={this.changeOrderStatus.bind(this)} data-id={listData._id} data-status={
                                                                              
                                                                              listData.deliveryStatus[0].status == "Dispatch"          ? "Delivery Initiated" :  
                                                                              listData.deliveryStatus[0].status == "Delivery Initiated"  ? "Delivered & Paid" :
                                                                              listData.deliveryStatus[0].status == "Delivered & Paid"  ? "Done" : "Done"
                                                                          } 
                                                                          title={
                                                                              
                                                                              listData.deliveryStatus[0].status == "Dispatch"           ? "Initiate Delivery" : 
                                                                              listData.deliveryStatus[0].status == "Delivery Initiated"          ? "Deliver and Recieve Payment " :  
                                                                              listData.deliveryStatus[0].status == "Delivered & Paid"   ? "Done" : "Done"
                                                                          }
                                                                          data-target={
                                                                              listData.deliveryStatus[0].status == "Dispatch"          ? "" :  
                                                                              listData.deliveryStatus[0].status == "Delivery Initiated"         ? "" :  
                                                                              listData.deliveryStatus[0].status == "Delivered & Paid"  ? "" : ""
                                                                          } 
                                                                          data-toggle="modal"
                                                                          >
                                                                          <i className={                                                                    
                                                                            listData.deliveryStatus[0].status == "Dispatch"           ? "fa fa-truck admin-orders-stat-Dispatchedicon" :  
                                                                            listData.deliveryStatus[0].status == "Delivery Initiated"          ? "fa fa-check-circle admin-orders-stat-Deliveredicon" :  
                                                                            listData.deliveryStatus[0].status == "Delivered & Paid"   ? "fa fa-check-circle" : ""
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
                                  </div>*/
                                }

                              </div>
                          </div>
                      </div>

                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div> 
        );
    }
}

export default BaOrdersList