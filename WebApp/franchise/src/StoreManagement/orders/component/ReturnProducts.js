import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import axios                  from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";
import moment from "moment";
import AdminOrdersList from './AdminOrdersList.js';
import swal         from 'sweetalert';

export default class ReturnProducts extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      "returnedProducts" : [] 
    }
    this.getOrders = this.getOrders.bind(this);
  }
   
  componentDidMount(){
    this.getOrders();
    $('.showmore').click(function () {
      console.log('this',$(this));

    });
    
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#pickupform").validate({
      rules: {
      pickupby: {
        required: true,
      }
    },
    errorPlacement: function(error, element) {
      if (element.attr("name") === "pickupby"){
        error.insertAfter("#pickupby");
      }
    }
    });
  }    
  getOrders(){
      axios.get("/api/returnedProducts/get/list")
            .then((response)=>{
                this.setState({
                  returnedProducts: response.data
                });
            })
            .catch((error)=>{
                console.log('error', error);
            })
  }
  returnApproveModal(event){
    $('#returnApprove').show();
    $('#returnApprovebtn').attr('data-id',$(event.target).attr('id'));
  }
  returnApprove(event){
    event.preventDefault();
    var formValues = {
      "id" : $(event.target).data('id'),
      "status" : "Return Approved"
    }
    axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
          .then((response)=>{
            console.log('response', response);
            this.getOrders();
            swal({
                  title : response.data.message,
                });

            
            $('#returnApprove').hide();
            $('.modal-backdrop').remove();
          })
          .catch((error)=>{
            console.log('error', error);
          })   
  }
  addpickupdetails(event){
    event.preventDefault();
    $('#pickupdetailsModal').show();
    $('#addpickupbtn').attr('data-id',$(event.target).attr('id'));
  }
  addpickup(event){
    event.preventDefault();
    var formValues = {
      "id" : $(event.target).data('id'),
      "pickupby" : $('#pickupby').val()
    }
    if ($('#pickupby').valid()) {
      axios.patch('/api/returnedProducts/returnPickeupInitiated',formValues)
          .then((response)=>{
            console.log('response', response);
            this.getOrders();
            swal({
                  title : response.data.message,
                });
            $('#pickupdetailsModal').hide();
            $('.modal-backdrop').remove();
          })
          .catch((error)=>{
            console.log('error', error);
          })
    }
    
  }
  openpickupproduct(event){
    event.preventDefault();
    $('#pickupproductModal').show();
    $('#pickupproductbtn').attr('data-id',$(event.target).attr('id'));
  }
  pickupcollected(event){
    event.preventDefault();
    var formValues = {
      "id" : $(event.target).data('id'),
      "status" : "Return Pickedup"
    }
    axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
          .then((response)=>{
            console.log('response', response);
            this.getOrders();
            swal({
                  title : response.data.message,
                });
            $('#pickupproductModal').hide();
            $('.modal-backdrop').remove();
          })
          .catch((error)=>{
            console.log('error', error);
          })
  }

  openproductApproval(event){
    event.preventDefault();
    $('#approveProductModal').show();
    $('#approveProductbtn').attr('data-id',$(event.target).attr('id'));
  }
  approveProduct(event){
    event.preventDefault();
    var formValues = {
      "id" : $(event.target).data('id'),
      "status" : "Return Accepted"
    }
    axios.patch('/api/returnedProducts/returnStatusUpdate',formValues)
          .then((response)=>{
            console.log('response', response);
            this.getOrders();
            swal({
                  title : response.data.message,
                });
            $('#approveProductModal').hide();
            $('.modal-backdrop').remove();
          })
          .catch((error)=>{
            console.log('error', error);
          })
  }
  render(){
    
    return(
      <div className="container-fluid">
        {
          this.state.returnedProducts.length > 0 ? 
          this.state.returnedProducts.map((data,index)=>{
            var returnApprovalPending = 0, returnApproved = 0, returnApprovedOn, pickupInitiated = 0, pickupInitiatedOn,
            productPickedUp = 0,productPickedUpOn, productArrived, productAccepted, productAcceptedOn;

            return (
              <div>
                {
                  data.productsArray.length > 0 ?
                  <div className="row" key={index}>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  parentDiv">
                      <div className="col-lg-12 bgwhite">
                        <div className="col-lg-12 orderpagebox">
                          <div className="row">
                            <div className="col-lg-8">
                              <div className="orderButton">Order-ID : <b>{data._id}</b></div>
                            </div>
                            <div className="col-lg-4 pull-right">
                                <p><span style={{marginTop:"15px"}}>Ordered On { moment(data.createdAt).format("DD/MM/YYYY hh:mm a") }</span>&nbsp;</p>
                            </div>
                            <div className="col-lg-12">
                              <div className="col-lg-2 mtop10">
                                <img className="itemImg" src={data.productsArray[0].productImage[0]} />
                              </div>
                              <div className="col-lg-6 mtop10">
                                <h4>{data.productsArray[0]['productName']}</h4>
                              </div>

                              <div className="col-lg-2 mtop10">
                              <label>Original Price:</label>
                              <p className={"fa fa-" + data.productsArray[0].currency}> {data.productsArray[0].originalPrice.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>
                              </div>
                              <div className="col-lg-2 mtop10">
                              <label>Discounted Price:</label>
                              <p className={"fa fa-" + data.productsArray[0].currency}> {data.productsArray[0].discountedPrice.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>
                              </div>
                              <div className="col-lg-6">
                                <h4>Reason For Return: </h4>
                                <p>{data.reasonForReturn}</p>
                              </div>

                              <div className="col-lg-4 mtop10">
                              {
                                data.returnStatus.filter(function (status) { 
                                
                                if(status.status === "Return Approved"){
                                  returnApproved = 1;
                                  returnApprovedOn = moment(status.date).format("DD/MM/YYYY hh:mm a");
                                }
                                else if(status.status === "Return Pickup Initiated"){
                                  pickupInitiated = 1;
                                  pickupInitiatedOn = moment(status.date).format("DD/MM/YYYY hh:mm a");;
                                }
                                else if(status.status === "Return Pickedup"){
                                  productPickedUp = 1;
                                  productPickedUpOn = moment(status.date).format("DD/MM/YYYY hh:mm a");;
                                }
                                else if(status.status === "Return Accepted"){
                                  productAccepted = 1;
                                  productAcceptedOn = moment(status.date).format("DD/MM/YYYY hh:mm a");;
                                }
                                
                                
                                })  
                              }
                                &nbsp;
                                { returnApproved !== 1 ? <button className="btn btn-warning" data-toggle="modal" onClick={this.returnApproveModal.bind(this)} data-target="#returnApprove" id={data._id} >Approve</button> : "" }
                                { returnApproved ==1 && pickupInitiated !== 1 ? <button className="btn btn-warning" data-toggle="modal" onClick={this.addpickupdetails.bind(this)} data-target="#pickupdetailsModal" id={data._id} >Add Pickup Details</button> : "" }
                                { returnApproved ==1 && pickupInitiated ==1 && productPickedUp !== 1 ? <button className="btn btn-warning" data-toggle="modal" onClick={this.openpickupproduct.bind(this)} data-target="#pickupproductModal" id={data._id} >Pickup Product </button> : ""}
                                { returnApproved ==1 && pickupInitiated ==1 && productPickedUp && productAccepted !== 1 ? <button className="btn btn-warning" data-toggle="modal" onClick={this.openproductApproval.bind(this)} data-target="#approveProductModal" id={data._id} >Accept Product </button> : ""}
                                
                              </div>
                              {
                                returnApproved ==1 && 
                                <div className="col-lg-4 mtop10">
                                  <a className="btn btn-warning showmore" data-toggle="collapse" href={"#multiCollapseExample"+index} role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Show More</a>
                                </div>
                              }
                              
                              <div className="collapse multi-collapse" id={"multiCollapseExample"+index}>
                                
                                {
                                  returnApproved ==1 && 
                                  <div className="col-lg-12">
                                  <hr className="hrline" />
                                    <h4>Return Product Approved: </h4>
                                    <p><label>Pickup Approved on:</label>{returnApprovedOn}</p>
                                  </div>
                                }
                                {
                                  pickupInitiated ==1 && 
                                  <div className="col-lg-12">
                                  <hr className="hrline" />
                                    <h4>Return Product PickUp Initiated: </h4>
                                    <p><label>Pickup Initiated on:</label>{pickupInitiatedOn}</p>
                                  </div>
                                }  
                                
                                {
                                  productPickedUp ==1 && 
                                  <div className="col-lg-12">
                                    <hr className="hrline" />
                                      <h4>Return Product Picked Up: </h4>
                                      <p><label>Picked up by:</label>{data.pickedupBy}</p>
                                      <p><label>Picked up On:</label>{productPickedUpOn}</p>
                                  </div>
                                }
                                {
                                  productArrived === 1 && 
                                  <div className="col-lg-12">
                                  <hr className="hrline" />
                                    <h4>Return Product Arrived: </h4>
                                    <p><label>Arrived On:</label></p>
                                  </div>
                                }
                                { productAccepted === 1 && 
                                  <div>
                                  <div className="col-lg-12">
                                  <hr className="hrline" />
                                    <h4>Return Product Verification: </h4>
                                    <p><label>Accepted On:</label>{productAcceptedOn}</p>
                                  </div>
                                  <div className="col-lg-12 mtop10">
                                    <hr className="hrline" />
                                    <h4>Account Details: </h4>
                                    <p><label>Bank Name: </label>&nbsp;{data.refund[0].bankName}</p>
                                    <p><label>Bank Account No.: </label>&nbsp;{data.refund[0].bankAccountNo}</p>
                                    <p><label>Bank IFSC Code: </label>&nbsp;{data.refund[0].IFSCCode}</p>
                                    <p><label>Amount: </label>&nbsp;<i className={"fa fa-" + data.productsArray[0].currency}></i>{data.refund[0].amount}</p>
                                  </div>
                                  </div>
                                } 
                                
                                  
                              </div>
                           
                              
                            </div>
                            
                          </div>
                        </div>
                      </div>
                  </div>
                </div>

                  : null
                }
                
                
              </div>
              );
          }) 
          : 
          <section className="content">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pageContent">
              <div className="row">
                <div className="box">
                  <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <h4 className="NOpadding-right">Returned Products</h4>
                  </div>
                </div>
              </div>
              <div className="text-center"><img src="/images/noproducts.jpeg" style={{marginTop:"5%"}}/></div>
            </div>
          </section>
        }  
        
        <br />
        <div className="modal" id="returnApprove" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                <h3 className="modalTitle">Return Approval</h3>
              </div>
              <div className="modal-body">
                <label>Do you want to approve this product for return?</label>
                <br/>
              </div>
              <div className="modal-footer">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <a href="#" className="btn btn-warning" id="returnApprovebtn" onClick={this.returnApprove.bind(this)}>Approve</a>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        <div className="modal" id="pickupdetailsModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close modalclosebut" data-dismiss="modal" data-target={"#pickupdetailsModal"}>&times;</button>
                <h3 className="modalTitle">Add Pickup Deatils</h3>
              </div>
              <div className="modal-body">
              <form id="pickupform">
                <div className="inputrow">
                  <div className="col-lg-8 col-md-8 col-sm-4 col-xs-12">
                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Pick up person name  :</label>
                    <input type="text" ref="pickupby" name="pickupby" id="pickupby" className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control" required/>
                  </div>
                </div>
                <br/>
                <br/>
                <br/>
              </form>
              </div>
              <div className="modal-footer">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <a href="#" className="btn btn-warning" id="addpickupbtn" onClick={this.addpickup.bind(this)}>Save</a>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal" id="pickupproductModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h3 className="modalTitle">Pickup Product</h3>
              </div>
              <div className="modal-body">
                <label>Does this product picked up?</label>
                <br/>
              </div>
              <div className="modal-footer">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <a href="#" className="btn btn-warning" id="pickupproductbtn" onClick={this.pickupcollected.bind(this)}>Yes</a>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal" id="approveProductModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h3 className="modalTitle">Accept Product</h3>
              </div>
              <div className="modal-body">
                <label>Does this product accepted for return?</label>
                <br/>
              </div>
              <div className="modal-footer">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <a href="#" className="btn btn-warning" id="approveProductbtn" onClick={this.approveProduct.bind(this)}>Yes</a>
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>
      );
    
  }
}
