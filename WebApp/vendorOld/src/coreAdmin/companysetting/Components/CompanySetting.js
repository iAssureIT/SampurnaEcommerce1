import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import $ from "jquery";
import CompanyInformation           from  '../Components/CompanyInformation.js';
import CompanyLocation              from  '../Components/CompanyLocationList.js';
import '../css/CompanySetting.css';
import CompanyBankDetails           from  '../Components/CompanyBankDetails.js';
import CompanyTaxDetails            from  '../Components/CompanyTaxDetails.js';
import CompanyPaymentGateway        from  '../Components/CompanyPaymentGateway.js';
// import AddPropertyType           from  '/imports/admin/companySetting/Add_Property_subproperty/AddPropertyType.jsx';

 class CompanySetting extends Component{
    constructor(props) {
    super(props)

    this.state = { 

      companyinformation        : "Company Information",
      

    }
    // this.handleChange = this.handleChange.bind(this);
    // this.onChange    = this.onChange.bind(this);

  }
  componentDidMount() {
   

  }

  
  componentWillUnmount(){
    
  }
  clickLi(event){
    event.preventDefault();
    // $("#companyLocationForm").validate().resetForm();
    // $("#companyInformationForm").validate().resetForm();
    $('.error').css({'display':'none'})
  }


  render() {

    return (
       <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
          <section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginBottomCSS ">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                 <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent marginTopp">
                    <div className="box">
                      <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                        <h4 className="col-lg-12 col-md-12 col-xs-12 col-sm-12">Store Management System</h4>
                      </div>
                      <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companySettingMarginTop NOpadding-left">
                        <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                              <li className="active  col-lg-12 col-md-12 col-xs-12 col-sm-12" onClick={this.clickLi.bind(this)}><a className="tabLeft tablefthr lettersp" href="#companyInformation" data-toggle="tab">Store Information</a></li>
                              <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"         onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyLocation" data-toggle="tab">Location Details</a></li>
                              {/*<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyBankDetails" data-toggle="tab">Bank Details</a></li>
                            
                              <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyTaxDetails" data-toggle="tab">Tax Information</a></li>
                              <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"        onClick={this.clickLi.bind(this)}><a className="tabLeft lettersp tablefthr" href="#CompanyPaymentGateway" data-toggle="tab">Payment Gateway</a></li>
                           */}
                          </ul>
                        </div>

                        <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">
                          <div className="tab-pane active" id="companyInformation"> <CompanyInformation/> </div>
                          <div className="tab-pane" id="CompanyLocation"> <CompanyLocation/> </div>
                           <div className="tab-pane" id="CompanyBankDetails"> <CompanyBankDetails/> </div>
                         
                          <div className="tab-pane" id="CompanyTaxDetails"> <CompanyTaxDetails/> </div>
                          <div className="tab-pane" id="CompanyPaymentGateway"> <CompanyPaymentGateway/> </div>
                          
                        </div> 
                     
                    </div>
                  </div>
              </div>
            </div>
          </div>
          </section>
        </div>
      );

  }

}
export default CompanySetting;