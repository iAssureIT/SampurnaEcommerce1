import React, { Component }     from 'react';
import {Route, withRouter} from 'react-router-dom';
import axios                  from 'axios';
// import "../../../sites/currentSite/blocks/ProductViewEcommerceDetailsReviewFAQ.css";
import _                      from 'underscore';
import moment                 from "moment";


export default class ProducthomeDetailsReviewFAQ extends Component {
	constructor(props){
    super(props);
      this.state = {
      "reviewuserData":""
      };
    } 
  	componentDidMount(){  
      
    } 

    componentWillReceiveProps(nextProps){
      
      if (nextProps.productInfo) {
         // console.log('nextProps===============================>',nextProps.productInfo);
        if (nextProps.productInfo.productID) {
          this.getMyReview(nextProps.productInfo.productID);
        }
        
      }
    }

    getMyReview(productID){
      axios.get("/api/customerReview/get/list/"+productID)
            .then((response)=>{
              this.setState({ 
                  reviewData : response.data
              },()=>{
                  // console.log("reviewData",this.state.reviewData);
              })
          })
            .catch((error)=>{
                console.log('error', error);
            })
    }

  	  	
  	render() {
		return (
				<div id="gotoreview" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop180 topspace">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 faq">
          { 
            this.state.reviewData && this.state.reviewData.length >0 ?
            <ul>
              <li className="rvw"><a>REVIEWS</a></li>
            </ul> 
              :
              null                      
          }
            <div className="topspace15"></div>
          { 
            this.state.reviewData && this.state.reviewData.length >0 ?
            this.state.reviewData.map((data,index)=>{
              return (
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reviewborder">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 topspace15">
                  <div className="row">
                    <div className="col-lg-4 col-md-3 col-sm-3 col-xs-3 reviewuserimg text-center">
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-center">
                        {
                                  data.rating ?
                                    _.times(5, (i) => {
                                      console.log(i,'i');
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
                                }                        </div>    
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <img src="/images/userImage.png"/>
                            <p>by {data.customerName}</p>
                            <p>{moment(data.createdAt).format('DD-MM-YYYY')}</p>
                        </div>    
                      </div>    
                    </div>    
                    <div className="col-lg-8 col-md-9 col-sm-9 col-xs-9 reviewuserimg">
                      <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                          <div className="row">
                            <h5>Review :</h5>
                          </div>    
                        </div>    
                        <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 topspace8">
                          <div className="row">
                            <p>{data.customerReview}</p>
                          </div>    
                        </div>    
                      </div>    
                    </div>    
                  </div>    
                </div>    
            </div>
                );
              }) 
              :
              null                      
          }
          </div>
        </div>
		);
	}
}