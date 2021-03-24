import React, { Component } from 'react';
import "../../../sites/currentSite/blocks/ProductDivider.css";

export default class SaleProductDivider extends Component {
	// constructor(props){
 //        super(props);	    
 //  	}  
    
  render() {
		return (
		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 abc NOpadding">
            <div className="block">
                <a className="image" href="#" target="_blank"> 
                    <img src="/images/sofa.jpg" alt="home banner" className="divImage"/>
                </a>
            	<a href="/"><div className="btn  shopnowbtn" title="Shop Now">Shop Now</div></a>
            	<div className="figcaption2"> </div>
            </div>
            <div className="flatSaleBlockWrapper">
                <div className="flatSaleBlock">Flat Sale <span className="OffBlock">70% OFF</span> </div>
                <div className="offerText">Offers available on all categories of AnasHandicraft</div>
            </div>
            
    	</div> 	
		);
	}
}
