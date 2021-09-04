import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { getProductData, getProductCount, getFile, getProductImage,getAllOrders, getAllOrderCount, getOrdersStatus, getOrdersStatusCount, getReview, getReviewCount, getVendor, getVendorProductCount } from '../../../actions/index';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './VendorSelector.css';
class VendorSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
        vendorArray : []
    }
  }
  componentDidMount() {
      this.getVendorList();
  }
  getVendorList() {
    axios.get('/api/vendors/get/listbyuserid/'+localStorage.getItem('user_ID'))
    .then((response) => {
      if(localStorage.getItem("vendor_ID")){
      }else{
        localStorage.setItem("vendor_ID", response.data[0]._id);
      }
      this.setState({
        vendorArray: response.data,
        vendor_ID : localStorage.getItem("vendor_ID")
      })
    })
    .catch((error) => {

    })
  }
  selectVendor(event){
    var id = event.target.id;
    console.log(window.location.href.split('/')[0]);
    var status = '';
    var currentUrl = window.location.href.split('/')[0];
    switch(currentUrl) {
      case 'new-orders-list':
        status = 'New Order';
        break;
      case 'verified-orders-list':
        status = 'Verified'
        break;
      case 'packed-orders-list':
        status = 'Packed'
        break;
      case 'inspected-orders-list':
        status = 'Inspection'
        break;
      case 'approved-orders-list':
        status = 'Dispatch Approved'
        break;
      case 'dispatched-orders-list':
        status = 'Dispatch'
        break;
      case 'delivery-initiated-orders':
        status = 'Delivery Initiated'
        break;
      case 'delivered-orders-list':
        status = 'Delivered & Paid'
        break;
      default:
        status = 'New Order';
    }

    localStorage.setItem("vendor_ID", id);
    var data = {
      startRange : 0,
      limitRange : 100,
      // vendorID  : localStorage.getItem("vendor_ID"),
      vendor_ID  : localStorage.getItem("vendor_ID"),
      status     : status
    }
    this.props.fetchproducts(data);
    this.props.fetchfile(data);
    this.props.fetchproductcount();
    this.props.fetchproductsimage();
    this.props.fetchallorders(data);
    this.props.fetchordercount();
    this.props.fetchorderstatus(data);
    this.props.fetchorderstatuscount();
    this.props.fetchreview(data);
    this.props.fetchreviewcount();
    this.props.fetchvendor();
    this.props.fetchvendorproductcount();
    this.setState({
      vendor_ID : localStorage.getItem("vendor_ID")
    })
  }
  render() {
    return (
      <div>
        <header className=" VendorSelector">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            {this.state.vendorArray && this.state.vendorArray.length>0?
              this.state.vendorArray.map((a, i)=>{
                return(
                  <span>
                    <label className="collageSize ">
                    <input onChange={this.selectVendor.bind(this)} checked={this.state.vendor_ID == a._id ? true : false} name="size" type="radio" id={a._id} value={a._id} />
                    <span title={a.companyName} className="collageCheck ">{a.companyName}</span>
                    </label> &nbsp; &nbsp;
                  </span>
                );
              })
              :
              null
            }
          </div>
        </header>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
      recentProductData: state.recentProductData,
      productCount : state.productCount
  }
}
const mapDispachToProps = (dispatch) => {
  return bindActionCreators({ fetchproducts: getProductData , fetchproductcount:getProductCount, fetchfile: getFile, fetchproductsimage: getProductImage, fetchallorders: getAllOrders, fetchordercount:getAllOrderCount, fetchorderstatus: getOrdersStatus, fetchorderstatuscount:getOrdersStatusCount, fetchreview: getReview, fetchreviewcount:getReviewCount, fetchvendor:getVendor, fetchvendorproductcount:getVendorProductCount }, dispatch)
}
export default connect(mapStateToProps, mapDispachToProps)(VendorSelector);