import React, { Component } from 'react';
import axios from 'axios';
import moment from "moment";
import StarRatingComponent from 'react-star-rating-component';

class ProductreviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewData: "",
      productID: '',
    }
  }
  componentDidMount() {
    this.getProductReview();
    var sampurnaWebsiteDetails = JSON.parse(localStorage.getItem('sampurnaWebsiteDetails'));
    var userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      if (userDetails.user_id) {
        this.setState({
          user_ID: userDetails.user_id,
          userLongitude: userDetails.userLatitude,
          userLongitude: userDetails.userLongitude,
        }, () => {

        })
      }
    }
  }

  getProductReview() {
    axios.get("/api/customerReview/get/list/" + this.props.productID)
      .then((response) => {
        if (response) {
          this.setState({
            reviewData: response.data,
          }, () => {
            // console.log("reviewData=========================>",this.state.reviewData);
          })
        }
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  render() {
    return (
      <div className="col-12 mb-4 mt-4">
        <div className="col-12   ">
          <div className=" container">
            <div className="row">
              {
                this.state.reviewData && this.state.reviewData.reviewlist.length > 0 ?
                  this.state.reviewData.reviewlist.map((data, index) => {
                    // console.log("data==",this.state.reviewData);
                    var customerName = data.customerName.split(" ");
                    return (
                      <div key={index} className="col-12 mb-2">
                        <div className="row h-100 ">
                          <div className="col-12 reviewBox h-100 text-center">
                            <div className="row h-100">
                              <div className="col-2 h-75 ">
                                {/* <img className="customerPic mt-4" src="/images/eCommerce/notavailable.png" alt="Customer-Pic" /> */}
                                <span className="customerPic mt-4"> {customerName[0] ? customerName[0].substring(0, 1):null} {customerName[1] ? customerName[1].substring(0, 1):null}</span>
                                {/* {data.customerName?data.customerName.substring(0, 1):null} */}
                                <div className="col-12 mt-2"> {data.customerName}</div>
                              </div>
                              <div className="col-6 bg-default text-left mt-4 pb-4 h-100">
                                <div className="col-12 starRatingBlock mb-2">
                                  <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={data.rating}
                                  />
                                  <span className="col-1 ratingCount mt-2 ">{data.rating}</span>
                                </div>
                                <div className="col-12 reviewData "> {moment(data.createdAt).format('MM/DD/YYYY')}</div>
                                <div className="col-12 customerReview text-justify " >{data.customerReview}</div>
                              </div>
                              <div className="col-4">
                                {data.reviewProductImages.map((imgPath, index) => {
                                  return(
                                    <div className="col-12 ">
                                      <div className="row">
                                        <div className="col-2">
                                          <img className=" ProductPic " src={imgPath ? imgPath : "/images/eCommerce/notavailable.png"} height={'50px'} data-toggle="modal" data-target={"#reviewImg_"+data._id+"_" +index} alt="ProductImg" />
                                        </div>
                                      </div>
                                      <div className="modal fade feedBackModal" id={"reviewImg_"+data._id+"_" +index} role="dialog" data-backdrop="static" data-keyboard="false">
                                      <div class="modal-dialog modal-dialog-centered ">
                                        <div className="modal-content modalContent " style={{ 'background': '#fff' }}>
                                        <div className="modal-header checkoutAddressModalHeader globalBgColor1 col-12 NoPadding">
                                          <div className="col-12">
                                            <div className="row mt-2">
                                              <div className="col-4 text-left NoPadding mt-2">
                                                    <img src="/images/eCommerce/TrollyLogo.png" height ={40} />
                                              </div>
                                              <div className="col-7 text-center">
                                              </div>
                                              <div className="col-1 text-center">
                                                <button type="button" className="close pt-0 closeModal pull-right" data-dismiss="modal">&times;</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="modal-body addressModalBody">
                                          <div className="col-12 mt-3 ">
                                            <div className="row">
                                              <div className="col-10 mx-auto">
                                                <img className="productZoomImg " src={imgPath ? imgPath : "/images/eCommerce/notavailable.png"} alt="ProductImg" height ={300} width={300} />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      </div>
                                    </div>
                                    </div>
                                  )
                                })
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductreviewList;