import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import BreadCrumbs          from '../../Themes/Sampurna/blocks/StaticBlocks/BreadCrumbs/BreadCrumbs.js';
import {ntc}                from '../../Themes/Sampurna/blocks/StaticBlocks/ntc/ntc.js';

class Payment extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData": {}
      }
  }

  componentDidMount() {
   
  }

  returnProductAction(event) {
    event.preventDefault();

    var id = $(event.target).data('id');
    var productid = $(event.target).data('productid');
    var altorderid = $(event.target).data('altorderid');
    var reasonForReturn = $('.reasonForReturn').val();

    var formValues = {
      "orderID": id,
      "altorderid": altorderid,
      "productID": productid,
      "reasonForReturn": reasonForReturn,
      "bankname": $('#bankname').val(),
      "bankacctno": $('#bankacctno').val(),
      "ifsccode": $('#ifsccode').val()
    }
    

    if ($('#returnForm').valid()) {
      // $('.fullpageloader').show();
      axios.patch('/api/orders/get/returnOrder', formValues)
        .then((response) => {
          $('.fullpageloader').hide();
          this.getMyOrders();
          this.setState({
            messageData: {
              "type": "outpage",
              "icon": "fa fa-exclamation-circle",
              "message": response.data.message,
              "class": "warning",
              "autoDismiss": true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData: {},
            })
          }, 3000);
          var modal = document.getElementById('returnProductModal');
          modal.style.display = "none";

          $('.modal-backdrop').remove();
        })

        .catch((error) => {
          console.log('error', error);
        })
    }
  }
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
          <div className="col-12">
             {/* returnProductModal */}
             <div className="modal" id="returnProductModal" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <img src="" alt="" />
                            <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title modalheadingcont">RETURN PRODUCT</h4>
                          </div>
                          <h4 className="modaltext"></h4>
                          <div className="col-xl-12 col-md-12 col-sm-12 col-xs-12">
                            <table className="data table table-order-items history" id="my-orders-table">
                              <thead>
                                <tr>
                                  <th scope="col" className="col id">Product Image</th>
                                  <th scope="col" className="col id">Product Name</th>
                                  <th scope="col" className="col date">Price</th>
                                </tr>
                              </thead>
                              <tbody>{
                                this.state.oneproductdetails ?
                                  <tr>
                                    <td data-th="Order #" className="col id orderimgsize"><img src={this.state.oneproductdetails.productImage[0] ? this.state.oneproductdetails.productImage[0] : "/images/eCommerce/notavailable.jpg"} alt="" /></td>
                                    {this.state.oneproductdetails.productNameRlang?
                                      <td data-th="Order #" className="col id RegionalFont">{this.state.oneproductdetails.productName}</td>
                                    :
                                      <td data-th="Order #" className="col id">{this.state.oneproductdetails.productName}</td>
                                    }
                                    <td data-th="Order Total" className="col total"><span><i className={"fa fa-" + this.state.oneproductdetails.currency}> {this.state.oneproductdetails.discountedPrice}</i></span></td>
                                  </tr>
                                  :
                                  null
                              }
                              </tbody>
                            </table>
                            <div className="inputrow">
                              <h4>Back Details</h4>
                            </div>

                            <form id="returnForm">
                              <div className="inputrow">
                                <span>
                                  <label className="col-12 NOpadding ">Reason for Return <label className="astricsign">*</label></label>

                                </span>
                                <textarea rows="5" cols="55" className="reasonForReturn" name="reasonForReturn" required></textarea>
                              </div>
                              <div className="inputrow">
                                <label className="col-12 NOpadding  ">Bank Name<label className="astricsign">*</label></label>
                                <input type="text" ref="bankname" name="bankname" id="bankname" value={this.state.bankname} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                              </div>
                              <div className="inputrow">
                                <label className="col-12 NOpadding ">Bank Account No<label className="astricsign">*</label></label>
                                <input type="text" ref="bankacctno" name="bankacctno" id="bankacctno" value={this.state.bankacctno} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                              </div>
                              <div className="inputrow">
                                <label className="col-12 NOpadding">IFSC Code<label className="astricsign">*</label></label>
                                <input type="text" ref="ifsccode" name="ifsccode" id="ifsccode" value={this.state.ifsccode} onChange={this.handleChange.bind(this)} className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-control returninputbox" required />
                              </div>
                            </form>

                          </div>
                          <div className="canreturn modal-footer">
                            <div className="col-12">
                              <br />

                              <button className="btn btn-danger" onClick={this.returnProductAction.bind(this)} id="returnProductBtn" >Save</button>
                              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
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