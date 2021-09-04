import React, { Component } from 'react';
import "./Aboutusmultistore.css";

export default class Aboutusmultistore extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	
	    };
	  }  
	  
  render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
				<div className="row">
					<div className="col-lg-12">
						<h2 className="col-lg-12 mt50">Get to know Multistore</h2>
						<p className="col-lg-12 mt20">Multistore vision is to create India's most reliable and frictionless commerce ecosystem that <br/>creates life-changing experiences for buyers and sellers.</p>
					</div>
					<div className="col-lg-10 col-lg-offset-1 mt50">
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-inbox multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>35 Million+</b></h3>
						  <h4>Products</h4>
						  </div>
						</div>
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-shopping-cart multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>250,000</b></h3>
						  <h4>Sellers</h4>
						  </div>
						</div>
						<div className="col-lg-4">
						  <div className="col-lg-12">
						  	<i className="fa fa-globe multiicon" aria-hidden="true"></i>
						  </div>
						  <div className="col-lg-12">
						  <h3><b>6000+</b></h3>
						  <h4>Cities</h4>
						  </div>
						</div>
					</div>
					<div className="col-lg-12 mt50">
						<p className="mt50 textparaabout">In February 2010, Kunal Bahl along with Rohit Bansal, started Multistore.com - India's largest online marketplace, with the widest assortment of 30 million  plus products across 800 plus diverse categories from over 125,000 regional, national, and international brands and retailers. With millions of &nbsp; users and more than 300,000 sellers, Multistore is the shopping destination for Internet users across the country, delivering to 6000+ cities and towns in India. In its journey till now, Multistore has partnered with several global marquee investors and individuals such as SoftBank, BlackRock, Temasek, Foxconn, Alibaba, eBay Inc., Premji Invest, Intel Capital, Bessemer Venture Partners, Mr. Ratan Tata, among others.</p>
					</div>
					<div className="col-lg-10 col-lg-offset-1 mt50">
						<div className="">
							<div className="col-lg-6">
								<div className="col-lg-12 multistorebgimg">
									<div className="col-lg-12 text-left multistorebgimgtext">
										<h3>Who We Are</h3>
										<p className="mt50 textparaabout1">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-6">
								<div className="col-lg-12 multistorebgimg2">
									<div className="col-lg-12 text-left multistorebgimgtext">
										<h3>Connected Commerce</h3>
										<p className="mt50 textparaabout1">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}