import React,{Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import IAssureTable from '../../../coreAdmin/IAssureTable/IAssureTable.jsx';
import { bindActionCreators } from 'redux';
import { getOrdersStatus, getOrdersStatusCount} from '../../../actions/index';
import { connect } from 'react-redux';

class DeliveredOrders extends Component{
  constructor(props) {
   super(props);
    this.state = {
      "data" : [],
      "tableHeading"                      : {
        orderID                           : "Order Id",
        userFullName                      : "Customer Name",
        products                          : "Products",
        cartQuantity                      : "Total Items",
        status                            : "Status",
      },
      "tableObjects"              : {
        deleteMethod              : 'delete',
        apiLink                   : '/api/category/',
        paginationApply           : true,
        searchApply               : true,
        editUrl                   : '/category-management/'
      },
      "sectionsList"              : [],
      "startRange"                : 0,
      "limitRange"                : 10,
      "editId"                    : this.props.match.params ? this.props.match.params.categoryID : ''
    }
    this.getOrders = this.getOrders.bind(this);
  }
   
  async componentDidMount(){
    this.getOrders(this.state.startRange, this.state.limitRange);
    this.props.fetchorderstatuscount();
  } 
  async getOrders(startRange, limitRange){
    var data = {
      startRange: startRange,
      limitRange: limitRange,
      status : 'Delivered & Paid',
      vendor_ID : localStorage.getItem("vendor_ID")
    }
    await this.props.fetchorderstatus(data);
    this.setState({
      tableData : this.props.allOrders
    })
  }

  render(){
    return(
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row"> 
                <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="formWrapper">

                  <section className="content">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent marginBottomCSS">
                    
                      <div className="row">
                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                          <h4 className="NOpadding-right"> Delivered Order List</h4>
                        </div>
                          <div className="admin-orders-SubTitleRow  row">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <br/>
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
                        <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.props.orderStatusCount && this.props.orderStatusCount.length>0 ? this.props.orderStatusCount[0].dataCount : 0}
                          tableData={this.props.orderStatus}
                          getData={this.getOrders.bind(this)}
                          tableObjects={this.state.tableObjects}
                          // getSearchText={this.getSearchText.bind(this)} 
                        />
                        </div>
                      </div>
                    </div>
                  </section>
                  </div>
                </div>
              </div>
            </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    orderStatusCount: state.orderStatusCount,
    orderStatus : state.orderStatus
  }
}
const mapDispachToProps = (dispatch) => {
  return bindActionCreators({ fetchorderstatus: getOrdersStatus, fetchorderstatuscount:getOrdersStatusCount }, dispatch)
}
export default connect(mapStateToProps, mapDispachToProps)(DeliveredOrders);