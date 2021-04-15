import React,{Component} from 'react';
import { render } from 'react-dom';
import axios             from 'axios';
import moment                   from 'moment';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../dashboard.css';

class Report extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      boxColor:props.boxColor,
      title:props.title,
      redirectlink:props.redirectlink,
      display:props.display,
      tableHeading:props.tableHeading,
      data:[],
      address:{}
    }
  }
   
  componentDidMount(){
    //console.log("componentDidMount display",this.props);
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        tableHeading: this.props.tableHeading,
        redirectlink: this.props.redirectlink,
        apiData : this.props.api,
        address  : this.props.api.address
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
        address  : nextProps.api.address
      },()=>{this.getData()})
    }
  }

  getData(){
    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
      var postdata =  this.state.apiData.PostData ? this.state.apiData.PostData : null ;
        axios({
          method: Method,
          url: Path,
          data : postdata
        })
        .then((response)=>{ 
          const result = response.data.filter(function(data,index){
            return index <= 6
          });
          this.setState({data:result})
        })
        .catch((err)=>{})
    }
  }

  findDistance(lat1, lon1, lat2, lon2, unit) {
    //console.log("distance========",lat1, lon1, lat2, lon2, unit);
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
     // console.log("distance========",dist);
      return dist;
    }
  }

  viewAll(){
    this.props.history.push(this.state.redirectlink)
  }
    
  render(){
    //console.log("deliveryAddress",this.state.address)
    return(
      <div>
      {this.state.display ?
        <div className="col-md-8">
          <div className={"box "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body">
              <div className="table-responsive">
                <table className="table no-margin dashboard-ordertable">
                  <thead>
                  <tr>
                  {this.state.tableHeading && this.state.tableHeading.length > 0 ?
                    this.state.tableHeading.map((heading,index)=>{
                      return(
                        <th key={index}>
                          {heading}
                        </th>
                        )
                    })
                    :
                    null
                  }
                  </tr>
                  </thead>
                  <tbody className="fontSmall dashboard-tbody">
                  {this.state.data && this.state.data.length > 0 ?
                    this.state.data.map((data,index)=>{
                      let products = [];
                      let distance = 0;
                      if(data.deliveryAddress){
                        let Clatitude = data.deliveryAddress.latitude ? data.deliveryAddress.latitude : null;
                        let Clongitude = data.deliveryAddress.longitude ? data.deliveryAddress.longitude : null;
                        let Flatitude = this.state.address ? this.state.address.latitude : null;
                        let Flongitude = this.state.address ? this.state.address.longitude : null;
                        
                        if(this.state.address  && Object.keys(this.state.address).length){
                          distance = this.findDistance(Clatitude, Clongitude, Flatitude, Flongitude,"K");
                        //  console.log("distance = ", distance);
                        }
                      }
                      data.products.map((product,index)=>{
                        products.push(product.productName);
                      })
                      let currentStatus  = data.deliveryStatus.length - 1;
                      let deliveryStatus = data.deliveryStatus[currentStatus].status;
                      let statusClass = '';
                      statusClass = deliveryStatus === "New Order"    ? "label label-warning"   : 
                      statusClass = deliveryStatus === "Verified"    ? "label label-info"   : 
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
                          <td><a className="href-link" href={"/viewOrder/"+products._id}>{data.orderID}</a></td>
                          <td>{products.toString()}</td>
                          <td>{distance.toFixed(2) +" Km"} </td>
                          <td>{data.total}</td>
                          <td><div className={statusClass}>
                             {deliveryStatus}
                             </div>
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
      }
      </div>
        );
  }
}
export default withRouter(Report);
