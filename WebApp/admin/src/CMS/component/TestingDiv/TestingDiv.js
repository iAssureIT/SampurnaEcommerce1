import React from 'react';
import CustServices from '../blockTemplate/CustServices/CustServices.js';
import CargoShipment from '../blockTemplate/CargoShipment/CargoShipment.js';
import ModeOfPaymt from '../blockTemplate/ModeOfPaymt/ModeOfPaymt.js';
import EnquiryForm from '../blockTemplate/EnquiryForm/EnquiryForm.js';
import CompanyEmp from '../blockTemplate/CompanyEmp/CompanyEmp.js';
import CargoFooter from '../blockTemplate/CargoFooter/CargoFooter.js';
import CompanyBenfts from '../blockTemplate/CompanyBenfts/CompanyBenfts.js';
import MultilevelMenubar from '../blockTemplate/MultilevelMenubar/MultilevelMenubar.js';
import CustReviews from '../blockTemplate/CustReviews/CustReviews.js';
import CustGallery from '../blockTemplate/CustGallery/CustGallery.js';
import ServiceDescrptn from '../blockTemplate/ServiceDescrptn/ServiceDescrptn.js';
import CompanyProjects from '../blockTemplate/CompanyProjects/CompanyProjects.js';
// import MultilevelType2Menubar from '../blockTemplate/MultilevelType2Menubar/MultilevelType2Menubar.js';



export default class TestingDiv extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				
				
				
				<MultilevelMenubar/>
				<ServiceDescrptn/>
				<CustGallery/>
				<CustReviews/>
				<CompanyEmp/>
				<CustServices/>
				<CargoShipment/>
				<ModeOfPaymt/>
				<EnquiryForm/>
				<CargoFooter/>
				<CompanyBenfts/>
				<CompanyProjects/>
				
				
				
				

			</div>
		);
	}
}
