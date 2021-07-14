import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import moment               from "moment";
import swal                 from 'sweetalert';
import StarRatingComponent  from 'react-star-rating-component';
class ProductreviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: "",
      productID : '',
    }
  }
  componentDidMount() {
      this.getProductReview();
      var sampurnaWebsiteDetails =  JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));      
      var userDetails            =  JSON.parse(localStorage.getItem('userDetails'));
      if(userDetails){
          if(userDetails.user_id){
            this.setState({
              user_ID :  userDetails.user_id,
              userLongitude : userDetails.userLatitude,
              userLongitude : userDetails.userLongitude,
            },()=>{
              
            })
          }
      }
  }

  getProductReview() {
    // console.log("this.props.productID====",this.props.productID);
    axios.get("/api/customerReview/get/list/" + this.props.productID)
      .then((response) => {
        if(response){
          this.setState({
            reviewData: response.data,
          }, () => {
            // console.log("reviewData=========================>",this.state.reviewData);
            // console.log("reviewuserid",this.state.reviewuserid);
          })
      }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getoneproductdetails(event) {
    var productID = event.target.id;
    var customerID = localStorage.getItem('user_ID');
    var orderID = event.target.getAttribute('orderID');
    this.setState({ orderID: orderID });
    // console.log(',n,',customerID, orderID, productID)
    axios.get("/api/products/get/one/" + productID)
    .then((response) => {
      this.setState({
        oneproductdetails: response.data
      }, () => {
        // console.log('oneproductdetails', this.state.oneproductdetails);
      })
    })
    .catch((error) => {
      console.log('error', error);
    })
    
    axios.get("/api/customerreview/get/order/list/"+customerID+"/"+orderID+"/"+productID )
    .then((response) => {
      this.setState({
        rating_ID       : response.data._id,
        customerID      : response.data.customerID,
        customerName    : response.data.customerName,
        customerReview  : response.data.customerReview,
        orderID         : response.data.orderID,
        productID       : response.data.productID,
        rating          : response.data.rating,
        ratingReview    : response.data.rating
      })
    })
    .catch((error) => {
      console.log('error', error);
    })
  }
  render() {
    return (
    <div>
      <div className="col-12 ">
        {/* <Message messageData={this.state.messageData} /> */}
        <div className=" container">
          <br />
          <div className="row"> 
              {
                this.state.reviewData && this.state.reviewData.length > 0 ?
                  this.state.reviewData.map((data, index) => {
                    // console.log("data==",data);
                    return (
                      <div key={index} className="col-12 reviewBox">
                        <div className="row">
                            <div className="col-4">
                                <div className="col-4 offset-4">
                                  <div className="customerPic" > {data.customerName?data.customerName.substring(0, 1):null}</div>
                                </div>
                                <div className="col-12 text-center">{data.customerName}</div>
                            </div>
                            <div className="col-8">
                                <div className="col-12 starRatingBlock mb-4">
                                  <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={data.rating}
                                        // onStarClick={this.onStarClick.bind(this)}
                                  /> 
                                  <span className="col-1 ratingCount mt-2">{data.rating}</span>
                                </div>
                                <div className="col-12 customerReview" >{data.customerReview}</div>
                                
                            </div>
                            
                        </div>
                        
                      </div>
                    );
                  })
                  :null
                  // <div className="col-12 mt15 alert alert-warning textAlignCenter"><i className="fa fa-exclamation-circle"> </i>  No Reviews Yet</div>
              }
         </div> 
        </div>
      </div>
      </div>
    );
  }
}

export default ProductreviewList;