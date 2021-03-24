import React, { Component } from 'react';
import "../../../sites/currentSite/blocks/ShopByCategories.css";
import notavailable from '../../../sites/currentSite/images/notavailable.jpg';

export default class ShopByCategories extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	"veggiArray" :["Potato","Tomatoes","Pickles","Carrots","Cauliflowers"]
	    	
	    };
  	}  
  render() {
		return (
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 shopByCat">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 shopByHead mt40">
							<label>Shop By Categories</label>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 vegitables back">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 veggiHeading">
											Vegetables
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 veggiName">
											Potatoes
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 veggiName">
											Tomatoes
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Pickles
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Carrots
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Cauliflowers
										</div>	
									</div>
															
									{/*{	
										this.state.veggiArray.map((ele, index)=>{
											return(
												<div className=" col-lg-12" key={index} >
													<div className="veggiName col-lg-5" ><br/>{ele}
											    	</div>
										    	</div>
											);
										})
										

									}*/}
								
								</div>

							</div>
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 berries back">

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 veggiHeading">
											Fruits & Berries
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Apple
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Grapes
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Citruses
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Exotic Fruits
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 veggiName">
											Summer Berries
										</div>	
									</div>
						
								</div>
							</div>
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  meat back"> 

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 veggiHeading">
											Meat
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Veal
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Pork
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Chicken
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Turkey
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Rabbit
										</div>	
									</div>
								</div>
							
							</div>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cakes back">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-8 col-md-6 col-sm-6 col-xs-6 veggiHeading">
											Cakes & Diary
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-4 col-sm-4 col-xs-4 veggiName">
											Bread
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 veggiName">
											Cookies
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Ice-Cream
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 veggiName">
											Cakes
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 veggiName">
											Pastries
										</div>	
									</div>
															
									{/*{	
										this.state.veggiArray.map((ele, index)=>{
											return(
												<div className=" col-lg-12" key={index} >
													<div className="veggiName col-lg-5" ><br/>{ele}
											    	</div>
										    	</div>
											);
										})
										

									}*/}
								
								</div>

							</div>
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masala back">

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12 veggiHeading">
											Grains,Oil & Masala
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Rice & Atta
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Dals & Pluses
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 veggiName">
											Salt & Suger
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 veggiName">
											Masala & Spices
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 veggiName">
											Dry Fruits
										</div>	
									</div>
						
								</div>
							</div>
							<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  snacks back"> 

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 veggiHeading">
											Snacks & Other
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 veggiName">
											Noddles & Pasta
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 veggiName">
											Snacks & Namkeen
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 veggiName">
											Spreads 
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 veggiName">
											Chocolates & Candies
										</div>	
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 row ">
										<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 veggiName">
											Pickles & Chatney
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
