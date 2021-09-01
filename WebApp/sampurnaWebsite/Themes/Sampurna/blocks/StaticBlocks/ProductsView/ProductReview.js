import React, { Component } from 'react';
import axios                from 'axios';
import moment               from 'moment';
import Link                 from 'next/link';

class ProductReview extends Component {
  constructor(props) {
    super(props);
      this.state = {
        "orderData": {}
      }
}

render() {
    // console.log(" productView this.state.orderData.vendorOrders===",this.props.productData);
    return (
      <div className="modal col-6 offset-3 NOpadding mt-4 feedBackModal" id={"reviewModal_"+productdata.product_ID} role="dialog">
            Product Review
      </div>
    );
  }
}

export default ProductReview;