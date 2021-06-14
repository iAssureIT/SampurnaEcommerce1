import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';

class ProductsView extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData": {}
      }
  }

  componentDidMount() {
   
  }

  render() {
    console.log("this.state.orderData.vendorOrders===",this.props.orderData);
    return (
        <div className="col-12">
            {/* feedbackProductModal */}

            <div className="modal" id="feedbackProductModal" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header feedbackModalHeader">
                            <img src="/favicon.ico" alt="" />
                            <h4 className="modal-title modalheadingcont">PRODUCT REVIEW</h4>
                            <button type="button" className="close modalclosebut" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
                          </div>
                          <div className="modal-body">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12">
                              <table className="data table table-order-items history" id="my-orders-table">
                                <thead>
                                  <tr>
                                    <th scope="col" className="col id">Product Image</th>
                                    <th scope="col" className="col id">Product Name</th>
                                    <th scope="col" className="col date textAlignRight">Price</th>
                                  </tr>
                                </thead>
                                <tbody>{
                                  this.state.oneproductdetails ?
                                    <tr>
                                      <td data-th="Order #" className="col id orderimgsize"><img src={this.state.oneproductdetails.productImage[0] ? this.state.oneproductdetails.productImage[0] : "/images/eCommerce/notavailable.jpg" } alt="" /></td>
                                      {this.state.oneproductdetails.productNameRlang?                                      
                                        <td data-th="Order #" className="col id RegionalFont">{this.state.oneproductdetails.productNameRlang}</td>
                                      :
                                        <td data-th="Order #" className="col id">{this.state.oneproductdetails.productName}</td>
                                      }
                                      
                                      <td data-th="Order Total" className="col total textAlignRight"><span><i className={"fa fa-" + this.state.oneproductdetails.currency}> {this.state.oneproductdetails.discountedPrice}</i></span></td>
                                    </tr>
                                    :
                                    null
                                }
                                </tbody>
                              </table>
                              <form className="feedbackForm col-12" id="">
                                <div className="col-12 row">
                                  <fieldset className="ratingReview stars givefeedback ">
                                    <input type="radio" id="star1" name="ratingReview" checked={this.state.ratingReview === 1 ? true : false} onChange={this.ratingReview.bind(this)} value="1" /><label htmlFor="star1"></label>
                                    <input type="radio" id="star2" name="ratingReview" checked={this.state.ratingReview === 2 ? true : false} onChange={this.ratingReview.bind(this)} value="2" /><label htmlFor="star2"></label>
                                    <input type="radio" id="star3" name="ratingReview" checked={this.state.ratingReview === 3 ? true : false} onChange={this.ratingReview.bind(this)} value="3" /><label htmlFor="star3"></label>
                                    <input type="radio" id="star4" name="ratingReview" checked={this.state.ratingReview === 4 ? true : false} onChange={this.ratingReview.bind(this)} value="4" /><label htmlFor="star4"></label>
                                    <input type="radio" id="star5" name="ratingReview" checked={this.state.ratingReview === 5 ? true : false} onChange={this.ratingReview.bind(this)} value="5" /><label htmlFor="star5"></label>
                                  </fieldset>
                                  <div className="clearfix "></div>
                                </div>
                                <label className="error">{this.state.reviewStarError}</label>
                                <div className="row inputrow">
                                  <label className="col-12 mt15">Write review</label>
                                  <div className="col-12 ">
                                    <textarea rows="5" className="col-12 " onChange={this.handleChangeReview.bind(this)} value={ this.state.customerReview} name="customerReview"></textarea>
                                    <label className="error">{this.state.reviewTextError}</label>
                                  </div>
                                </div>
                                <div className="row inputrow">
                                </div>
                              </form>
                            </div>

                          </div>
                          <div className="modal-footer modalfooterborder ">
                            <div className="col-12 actionbtn ">
                              <button className="btn mt15" onClick={this.submitReview.bind(this)} data-productid={this.state.oneproductdetails && this.state.oneproductdetails._id}
                              >{this.state.rating_ID ? 'Update' :'Submit'}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
        </div>
    );
  }
}

export default ProductsView;