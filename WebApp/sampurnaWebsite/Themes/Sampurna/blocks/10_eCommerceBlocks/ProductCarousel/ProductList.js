import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import Header                          from '../../5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer                          from '../../6_FooterBlocks/Footer/Footer.js';
import ProductListView                 from './ProductListView.js';

class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blockSettings : {
				"blockApi"            : "/api/products/get/list/lowestprice",
				"section"             : "all",
				"category"            : "all",
				"subCategory"         : "all",
				"totalProducts"       : 6,
				"showTitle"           : true,
				"showCarousel"        : false,
				"leftSideFilters"     : true,
				"noOfProductPerLGRow" : 2,
				"noOfProductPerMDRow" : 4,
				"noOfProductPerSMRow" : 4,
				"noOfProductPerXSRow" : 2
			},
			
			"productSettings" : {
				"displayBrand" : true,
				"displayWishlist" : true,
				"displayRating" : false,
				"displayFeature" : "",
				"displayAssurenceIcon" : false,
				"displayCategory" : false,
				"displaySubCategory" : false,
				"displaySection" : false
			},			 
		}
	}

	render(){
		return(
			<div className="col-12">
				<div className="row">
					< Header />
					
					<ProductListView 
						blockSettings   = {this.state.blockSettings} 
						productSettings = {this.state.productSettings}
						blockTitle      = {"Product list"}
					/>

					< Footer />
				</div>
			</div>
		)
	}
}
export default ProductList;