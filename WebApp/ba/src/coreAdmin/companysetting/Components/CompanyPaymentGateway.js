import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";

// import swal from 'sweetalert';

class CompanyPaymentGateway extends Component{
   constructor(props) {
    super(props);
    this.state = {
   
      submitVal      : true,
      subscription : {
        
      }

    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    
  }
  componentDidMount() {
  
    
  
  }

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  render(){
    
    return(
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
         {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header compyHeader">
          <h4 className="lettersp MasterBudgetTitle">Company Information</h4>
          </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Payment Information</h4>
            </div>
               <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyPaymentGatewayForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        
                        <input id="companyName"  type="checkbox" className="companyNamechkbx" name="companyNamechkbx"  />
                        <label className="control-label statelabel locationlabel" >Cash on Delivery</label><span className="astrick"></span>
                    </div>  
                  </div>

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        {/* <label className="control-label statelabel locationlabel" >Tax Rating</label><span className="astrick"></span> */}
                        {/* <input id="companyId" value={this.state.companyId} onChange={this.handleChange.bind(this)} type="checkbox" name="companyId" ref="companyId" className="form-control areaStaes" title="Company ID" autoComplete="off" disabled /> */}
                        <input id="companyName"  type="checkbox" className="companyNamechkbx" name="companyNamechkbx"  />
                        <label className="control-label statelabel locationlabel" >Paytm</label><span className="astrick"></span>
                    </div>  
                  </div>
               
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                       
                        {/* <input className="form-control areaStaes" title="Please enter valid mobile number only" id="companyContactNumber" type="checkbox" name="companyContactNumber" ref="companyContactNumber"required /> */}
                        <input id="companyName"  type="checkbox" className="companyNamechkbx" name="companyName"  />
                        <label className="control-label statelabel locationlabel" >UPI</label><span className="astrick"></span>
                    </div> 
                  </div>
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                       
                        {/* <input className="form-control areaStaes" title="Please enter valid mobile number only" id="companyContactNumber" type="checkbox" name="companyContactNumber" ref="companyContactNumber"required /> */}
                        <input id="companyName"  type="checkbox" className="companyNamechkbx" name="companyName"  />
                        <label className="control-label statelabel locationlabel" >Bank Transfer</label><span className="astrick"></span>
                    </div> 
                  </div>
                  
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck"  >
                  {this.state.submitVal
                    ?
                      "Submit"
                    : 
                      "Update"
                  }  
                </button>
              </div>
            </form>

            
          </div>
        </div>
      </div>

      );
  }

 }

 export default CompanyPaymentGateway;