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
        <div className="col-12">
            
        </div>
    );
  }
}

export default ProductReview;