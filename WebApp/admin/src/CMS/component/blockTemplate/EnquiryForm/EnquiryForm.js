import React from 'react';
import axios from 'axios';
import './EnquiryForm.css';


export default class EnquiryForm extends React.Component {
	
	render(){
		return(

			<section>
				<div className="MainWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="row">
						<img src="/images/EnquiryImg.jpg"/>
						<div className="EnqFormWrapper col-lg-6 col-md-4 col-sm-12 col-xs-12">
							<div className="row">
								<div className="formHeader col-lg-12">
									<div className="row">
										<div className="col-lg-12"><i className="fa fa-steam"></i>Please Fill All Inquiry To Get Your Total Price.</div>
										<h3>CALCULATE SHIPPING</h3>
									</div>
								</div>
								<form className="col-lg-12 col-md-12">
								<div className="form-group col-lg-12">
									<div className="col-lg-6">
										<select className="form-control col-lg-12" name="Categories" placeholder="Select Services">
										      <option  value="default">Select Services</option>
										      <option value="category1">Container Shipping</option>
										      <option value="category2">Package Solutions</option>
										      <option value="category3">Truck Shipping</option>
										      <option value="category3">Road Shipping</option>
										      <option value="category3">Ocean Shipping</option>
										      <option value="category3">Home Shipping</option>
										</select>
									</div>
									<div className="col-lg-3">
										<input type="select" className="form-control col-lg-12" placeholder="Length (cm)"/>
									</div>
									<div className="col-lg-3">
										<input type="select" className="form-control col-lg-12" placeholder="Height (cm)"/>
									</div>
								</div>
									
								<div className="form-group col-lg-12">
									<div className="col-lg-6">
										<select className="form-control col-lg-12" name="Categories" placeholder="From Country">
										      <option  value="default">From Country</option>
										      <option value="category1">India</option>
										      <option value="category3">Italy</option>
										       <option value="category3">South Africa</option>
										      <option value="category2">United Kingdom</option>
										      <option value="category3">United Arab Emirates</option>
										     
										      
										</select>
									</div>
									<div className="col-lg-6">
										<select className="form-control col-lg-12" name="Categories" placeholder="To Country">
										      <option  value="default">To Country</option>
										      <option value="category1">India</option>
										      <option value="category3">Italy</option>
										       <option value="category3">South Africa</option>
										      <option value="category2">United Kingdom</option>
										      <option value="category3">United Arab Emirates</option>
										</select>
									</div>
								</div>	
								<div className="form-group col-lg-12">
									<div className="col-lg-6">
										<select className="form-control col-lg-12" name="Categories" placeholder="from state">
										      <option  value="default">From State</option>
										      <option value="category1">Gujrat</option>
										      <option value="category1">Maharastra</option>
										      <option value="category2">Kerela</option>
										      <option value="category3">Punjab</option>
										</select>
									</div>
									<div className="col-lg-6">
										<select className="form-control col-lg-12" name="Categories" placeholder="To state">
										      <option value="default">To State</option>
										      <option value="category1">Gujrat</option>
										      <option value="category1">Maharastra</option>
										      <option value="category2">Kerela</option>
										      <option value="category3">Punjab</option>
										</select>
									</div>
								</div>
								<div className="form-group col-lg-12">
									<div className="col-lg-6">
										<input type="select" className="form-control col-lg-12" placeholder="Weight(Kg)"/>
									</div>
									<div className="col-lg-6">
										<input type="select" className="form-control col-lg-12" placeholder="Email"/>
									</div>
								</div>
								<div className="form-group col-lg-12">
									<div className=" col-lg-12">
										<input type="input" className="formDes form-control col-lg-12"  placeholder="Receiver Full Address"/>
									</div>
								</div>	
									
								</form>
								<div className=" extraServ col-lg-12">
									<div className="row">
										<div className="extser"><i className="fa fa-paper-plane"></i>EXTRA SERVICES</div>
										<div className="checkbox1 col-lg-6">
											<input type="checkbox"></input>
											<label>Express Delivery : [$50]</label>
										</div>
										<div className="checkboxes col-lg-6">
											<input type="checkbox"></input>
											<label>Add Insurance : [$100]</label>
										</div>
										<div className="checkbox1 col-lg-6">
											<input type="checkbox"></input>
											<label>Packaging : [$150]</label>
										</div>
									</div>
								</div>
								<div className="col-lg-12">
									<button className="btn btn-primary checkBtn col-lg-3">
			                            <i className="fa fa-paper-plane"></i>
			                            CHECK NOW
                            		</button>
								</div>
								
							</div>
						</div>
					</div>
				</div>
			</section>


			)
	}
}