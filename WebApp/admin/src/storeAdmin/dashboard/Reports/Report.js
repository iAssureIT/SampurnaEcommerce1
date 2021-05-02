import React,{Component} from 'react';
import { render } from 'react-dom';
import axios             from 'axios';
import moment                   from 'moment';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../Dashboard.css';

class Report extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      boxColor:props.boxColor,
      title:props.title,
      redirectlink:props.redirectlink,
      display:props.display,
      tableHeading:props.tableHeading,
      websiteModel: props.websiteModel,
      data:[]
    }
  }
   
  componentDidMount(){
    var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
    var token       = userDetails.token;
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        tableHeading: this.props.tableHeading,
        redirectlink: this.props.redirectlink,
        apiData : this.props.api,
        websiteModel: this.props.websiteModel,
      },()=>{this.getData()})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        boxColor: nextProps.boxColor,
        title: nextProps.title,
        tableHeading: nextProps.tableHeading,
        redirectlink: nextProps.redirectlink,
        apiData : nextProps.api,
      },()=>{this.getData()})
    }
  }

  getData(){
    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
        axios({
          method: Method,
          url: Path
        })
        .then((response)=>{ 
          const result = response.data.filter(function(data,index){
            return index <= 6
          });

          this.setState({data:result})
        })
        .catch((error)=>{
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
  }

  viewAll(){
    this.props.history.push(this.state.redirectlink)
  }
    
  render(){
    return(
      this.state.display ?
        <div className="col-md-8">
          <div className={"dashbox "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
              <div className="table-responsive">
                <table className="table no-margin dashboard-table">
                  <thead>
                  <tr>
                  {this.state.tableHeading && this.state.tableHeading.length > 0 ?
                    this.state.tableHeading.map((heading,index)=>{
                      return(
                        <th className="dashboardTableTh" key={index}>
                          {heading}
                        </th>
                        )
                    })
                    :
                    null
                  }
                  </tr>
                  </thead>
                  <tbody className="fontSmall">
                  {this.state.data && this.state.data.length > 0 ?
                    this.state.data.map((data,index)=>{
                      var franchiseName = data.allocatedToFranchise ? data.allocatedToFranchise.companyName : '';
                      console.log("data reports",data.total);
                      let products = [];
                      data.products.map((product,index)=>{
                        products.push(product.productName);
                      })
                      let currentStatus  = data.deliveryStatus.length - 1;
                      let deliveryStatus = data.deliveryStatus[currentStatus].status;
                      let statusClass = '';
                      statusClass = deliveryStatus === "New Order"    ? "label label-warning"   : 
                      statusClass = deliveryStatus === "Verified"    ? " label label-warning"   : 
                      statusClass = deliveryStatus === "Inspection"  ? "label label-default" :
                      statusClass = deliveryStatus === "Dispatch Approved"  ? "label label-success" :
                      statusClass = deliveryStatus === "Dispatch"    ? "label label-success" :
                      statusClass = deliveryStatus === "To Deliver"    ? "label label-info" :
                      statusClass = deliveryStatus === "Delivery Initiated"    ? "label label-primary" :
                      statusClass = deliveryStatus === "Delivered & Paid"   ? "label label-success" : 
                      statusClass = deliveryStatus === "Returned"   ? "label label-default" : 
                      statusClass = deliveryStatus === "Cancelled"   ? "label label-danger" : ""
                      return(
                        <tr key={index}>
                          <td><a className="href-link" href={"/viewOrder/"+data._id}>{data.orderID}</a></td>
                          <td className="itemtd">{products.toString()}</td>
                          {this.state.websiteModel === 'FranchiseModel' ?
                          <td>{franchiseName}</td>
                          : null }
                          <td><i className="fa fa-inr"></i>{data.total}</td>
                          {/* {console.log("statusClass",statusClass)} */}
                          <td><span className={statusClass}>{deliveryStatus}</span>
                          </td>
                        </tr>
                      )
                    })
                    :
                    <tr><td colSpan="5" className="textAlignCenter">No Data Found</td></tr>
                  }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box-footer clearfix">
              <button className="btn btn-sm btn-default btn-flat pull-right" onClick={this.viewAll.bind(this)}>View All</button>
            </div>
          </div>
        </div> 
        :
        null
      );
  }
}
export default withRouter(Report);
