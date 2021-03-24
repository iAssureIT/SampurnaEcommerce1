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

//npm i mui-datatables
//npm i @material-ui/core
import MUIDataTable from "mui-datatables";

class AdminOrdersList extends Component{ 
    constructor(props) {
        super(props);

        if(!this.props.loading){ 
            this.state = {
                "orderData":[],
                "orderId": ''
            };
        } else{
            this.state = {
                "orderData":[],
                "orderId": ''
            };
        }
        window.scrollTo(0, 0);
    }

    componentDidMount() {

    }
    
    
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                "data": nextProps.data,
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
        
        if(status != "Dispatch"){
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
                          "userid"  :  localStorage.getItem('user_ID')
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
                      "userid"  :  localStorage.getItem('user_ID')
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
    
    render(){
      const data = this.state.data;
      console.log('data', data);
      const options = {
       
        print: false, 
        download: false,
        viewColumns: false,
        filter: false,
        responsive: "stacked",
        selectableRows: 'none'
      };
      const columns = [
          { name:"Order Id" },
          { name:"Customer Name" }, 
          { name:"Products" },
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
                      value.deliveryStatus == "New Order" ?
                       "admin-orders-stat-NewOrder" : ( value.deliveryStatus == "Packed" ? "admin-orders-stat-Packed" : 
                          value.deliveryStatus == "Verified"    ? "admin-orders-stat-Verified"   : 
                          value.deliveryStatus == "Inspection"  ? "admin-orders-stat-Inspection" :
                          value.deliveryStatus == "Dispatch Approved"  ? "admin-orders-stat-OrderVerified" :
                          value.deliveryStatus == "Dispatch"    ? "admin-orders-stat-Dispatched" :
                          value.deliveryStatus == "To Deliver"    ? "admin-orders-stat-Dispatched" :
                          value.deliveryStatus == "Delivery Initiated"    ? "admin-orders-stat-Delivered" :
                          value.deliveryStatus == "Delivered & Paid"   ? "admin-orders-stat-Deliveredpaid" : 
                          value.deliveryStatus == "Returned"   ? "admin-orders-stat-Dispatched" : 
                          value.deliveryStatus == "Cancelled"   ? "admin-orders-stat-Dispatched" : ""
                              ) 
                                                                                      
                        }>
                        {
                           value.deliveryStatus == "Dispatch" ? "Dispatched" : value.deliveryStatus
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
                    <a href={value.viewOrder} target="_blank" title="View Invoice" className="admin-order-view col-lg-2 col-md-2">
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </a>
                  </div>                                               
                );
              }
            }
          }
        ];
        return(         
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row"> 
                <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="formWrapper">

                  <section className="content">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent marginBottomCSS">
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
                        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <MUIDataTable
                            title={this.props.tableTitle ? this.props.tableTitle : 'Order List'}
                            options={options}
                            data={data}
                            columns={columns}
                            />
                          </div> */}
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
