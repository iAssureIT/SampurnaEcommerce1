import React, { Component }  from 'react';
// import $                     from 'jquery';
// import { Route, withRouter } from 'react-router-dom';
import axios                 from 'axios';
import _                     from 'underscore';
import moment                from "moment";
// import "../../../sites/currentSite/blocks/ProductViewEcommerceDetailsReviewFAQ.css";




export default class ProductViewEcommerceDetailsReviewFAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "product_id": this.props.productID,
      "reviewuserData": "",
      "allReviewCount": 3
    };
    this.getMyReview()
  }
  componentDidMount() {
    if (this.state.product_id) {
      this.getMyReview()
    }
  }
  getMyReview() {
    axios.get("/api/customerReview/get/list/" + this.state.product_id)
    .then((response) => {
      this.setState({
        reviewData: response.data,
      })
    })
    .catch((error) => {
      console.log('error', error);
    })
  }
  addReview(event) {
    event.preventDefault();
    this.setState({
      allReviewCount: this.state.allReviewCount + 10
    })
  }

  render(){
    return(
      <div id="gotoreview" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding topspace">
        {
          this.state.reviewData && this.state.reviewData.length > 0 ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding reviewborder">
              {
                this.state.reviewData && this.state.reviewData.length > 0 ?
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailtitle">RATINGS & REVIEWS ({this.state.reviewData.length})</div>
                  :
                  null
              }
              <div className="topspace15"></div>
              {
                this.state.reviewData && this.state.reviewData.length > 0 ?
                  this.state.reviewData.map((data, index) => {
                    if (index < this.state.allReviewCount) {
                      return (
                        <div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 topspace15 boxBor">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewuserimg">
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                {
                                  data.rating ?
                                    _.times(5, (i) => {
                                      
                                      if(i < data.rating){
                                        return <label className="reviewStarIcon activeStar"></label>;
                                      }else{
                                        return <label className="reviewStarIcon"></label>;
                                      }
                                    })
                                  :
                                  _.times(5, (i) => {
                                    return <label className="reviewStarIcon"></label>;
                                  })
                                }
                                
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignLeft NOpadding">
                                {/* <img src="/images/userImage.png"/> */}
                                By<b><span> {data.customerName} </span></b>
                                
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewuserimg">
                            <div className="row">
                              {/* <div className="col-lg-1 col-md-1 col-sm-2 col-xs-2">
                              <div className="row">
                              <h5>Review :</h5>
                              </div>    
                              </div>     */}
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 topspace8">
                                <div className="row">
                                  <p>{data.customerReview}</p>
                                  <p className="reviewDate"> ({moment(data.createdAt).format('DD-MM-YYYY')})</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })
                  :
                  null
              }
              {this.state.reviewData && this.state.reviewData.length > this.state.allReviewCount ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxBor allReview">
                  <label>All REVIEWS</label>
                  <label className="pull-right allReviewplusSign" onClick={this.addReview.bind(this)}>+</label>
                </div>
                :
                null
              }

            </div>
            :
            null
        }
      </div>
    );
  }
}