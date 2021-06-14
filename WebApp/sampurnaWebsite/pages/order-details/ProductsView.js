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
            <table className="table table-borderless orderTable">
                <thead>
                    <tr>
                        <th>Products Image</th>
                        <th>Products Name</th>
                        {/* <th className="textAlignRight">Price</th> */}
                        <th className="textAlignRight">Quantity</th>
                        <th className="textAlignRight">SubTotal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.props.orderData && this.props.orderData.map((productdata, index) => {
                        // console.log("vendorWiseData=>",vendorWiseData);
                            return (
                                <tr key={index}>
                                <td><img className="img orderImg" src={productdata.productImage[0] ? productdata.productImage[0] : "/images/eCommerce/notavailable.jpg"} /></td>
                                <td>
                                    <a href={"/productdetails/" + productdata}>
                                    {productdata.productNameRlang?
                                        <h5 className="RegionalFont">{productdata.productNameRlang}</h5>
                                    :
                                        <h5 className="productName">{productdata.productName}</h5>
                                    }
                                    </a>

                                    {productdata.discountPercent ?
                                        <div className="col-12 NoPadding">
                                            <span className="cartOldprice">{this.state.currency} &nbsp;{productdata.originalPrice}</span>&nbsp;
                                        <span className="cartPrice">{this.state.currency}&nbsp;{productdata.discountedPrice}</span> &nbsp; &nbsp;
                                        <span className="cartDiscountPercent">( {Math.floor(productdata.discountPercent)}% Off ) </span>
                                        </div>
                                        :
                                        <span className="price">{this.state.currency}&nbsp;{productdata.originalPrice}</span>
                                    }
                                    <div>
                                        {productdata.color ? <span className="cartColor">Color : <span style={{ backgroundColor: productdata.color, padding: '0px 5px' }}>&nbsp;</span> {ntc.name(productdata.color)[1]}, </span> : null}
                                        {productdata.size ? <span className="cartColor">Size : {productdata.size} &nbsp; {productdata.unit}</span> : null}
                                    </div>
                                </td>
                                <td className="textAlignLeft">
                                    {
                                        
                                      // <span className="productPrize textAlignRight"><i className={"fa fa-" + productdata.currency}></i> &nbsp;{parseInt(productdata.discountedPrice).toFixed(2)}</span>
                                      <span className="productPrize textAlignRight">{this.state.currency}&nbsp;{productdata.discountedPrice}</span>
                                            
                                    }
                                </td>
                                <td className="textAlignCenter">
                                    {
                                      <span className=" textAlignRight">{productdata.quantity}</span>
                                            
                                    }
                                </td>
                                <td className="textAlignRight">
                                    {
                                      <span className="productPrize textAlignRight">
                                          {this.state.currency}
                                          &nbsp;{productdata.discountedPrice}
                                      </span>
                                    }
                                </td>
                            </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
  }
}

export default ProductsView;