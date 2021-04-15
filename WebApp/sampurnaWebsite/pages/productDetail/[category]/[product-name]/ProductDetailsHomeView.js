import React, { Component } 		from 'react';
import ProductModalViewEcommerce     from "../../../../Themes/Sampurna/blocks/StaticBlocks/ProductViewEcommerce/ProductModalViewEcommerce.js";
// import ProducthomeDetailsReviewFAQ 		from "../../../..//Themes/Sampurna/blocks/StaticBlocks/ProductViewEcommerceDetailsReviewFAQ/ProducthomeDetailsReviewFAQ.js";
import axios                  		from 'axios';

export default class ProductDetailsHomeView extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	 bestSellerProducts:[]
	    };
  	} 
  	componentDidMount(){
  		var productType4 = 'bestSeller';
  		var webCategory = 'Main-Site'
  		axios.get("/api/products/get/listbytype/"+webCategory+"/"+productType4)
            .then((response)=>{

              this.setState({
                  bestSellerProducts : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            }) 
  	}  
    
  	render() {
      
		return (
		  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop180  backColorGray">
          <ProductModalViewEcommerce productInfo = { this.props.productInfo } />
          {/* <ProducthomeDetailsReviewFAQ productInfo = { this.props.productInfo } /> */}
        </div>
		);
	}
}
