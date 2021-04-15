import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';

import axios from 'axios';

// import "../../../API";
const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const companycontact  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companylocation = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companybuilding = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
class CompanyLocation extends Component{
  constructor(props) {
    super(props);
    this.state = {
      companyLocation       : "",
      Emailid               : "",
      companycontact        : "", 
      companyaltcontact     : "",
      companybuildingblock  : "",
      companylandmark       : "",
      companyCountry        : "",
      companyState          : "",
      
      companyDist           : "",
      taluka                : "",
      companyCity           : "",
      companyPincode        : "",
      submitVal            : true,
      formerrors :{
        companylocation : "",
        companyMobile : " ",
        companyArea  : " ",

        country : " ",
        district : " ",
        state : " ",
        taluka : " ",

        city : " ",
        pincode : " ",
     

      },

    };
    this.handleChange = this.handleChange.bind(this);
    
  }
  // handleChange(event){
  //   const target = event.target;
  //   const name   = target.name;
  //   this.setState({
  //     [name]: event.target.value,
  //   });
  // }
  
  handleChange(event){
    // const target = event.target;
    // const {name , value}   = event.target;
    const datatype = event.target.getAttribute('data-text');
    const {name,value} = event.target;
    let formerrors = this.state.formerrors;
    
    console.log("datatype",datatype);
    switch (datatype){
     
      case 'companylocation' : 
       formerrors.companylocation = companylocation.test(value)  && value.length>0 ? '' : "Please Enter valid Input";
       break;

       case 'companyMobile' : 
       formerrors.companyMobile = companycontact.test(value)  && value.length>0 ? '' : "Please Enter Numbers only";
       break;

       case 'companyArea' : 
        formerrors.companyArea = companybuilding.test(value)   && value.length>0? '' : "Please Enter valid Input";
       break;
       
      case 'country' : 
      formerrors.country = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;
    
      case 'state' : 
        formerrors.state = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;
    
      case 'district' : 
        formerrors.district = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'taluka' : 
        formerrors.taluka = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'city' : 
        formerrors.city = companynameRegex.test(value)   && value.length>0? '' : "Invalid Field";
      break;

      case 'pincode' : 
        formerrors.pincode = companypincodeRegex.test(value)  && value.length>0 ? '' : "Invalid Pincode";
      break;


       default :
       break;

      //  case 'companyName' : 
      //  formerrors.companyName = value.length < 1 && value.lenght > 0 ? 'Minimum 1 Character required' : "";
      //  break;

    }
    // this.setState({formerrors,})
    this.setState({ formerrors,
      [name]:value
    } );
  }
   
  componentDidMount(){
   
  }
  submitCompanyLocation=(event)=>{
    event.preventDefault();
    // var sessionVar = Session.get('location');
   // var companyId : 5;

    var companyLocationFormValue ={
      Location                  : this.state.companyLocation,
      companyId                 : 2,
      // companyEmailid            : this.state.Emailid,
      contactnumber             : this.state.companycontact,
      // companyaltcontact         : this.state.companyaltcontact,
      blockname                 : this.state.companybuildingblock,
      landmark                  : this.state.companylandmark,
      companyCountry            : this.state.companyCountry,
      companyState              : this.state.companyState,
      companyDistrict           : this.state.companyDist,
      companytaluka             : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
  
    }//close array
    if(formValid(this.state.formerrors)){
    axios.patch('/api/companysettings/location/add',companyLocationFormValue)
    .then( (response)=> {
      // handle success
      console.log(response);
      swal("Location Added Successfully", "", "success");

      this.setState({
        companyLocation         :"",
        companycontact          :"",
        companybuildingblock    :"",
        companylandmark         :"",
        companyCountry          :"",
        companyState            :"",
        companyDist             :"",
        taluka                  :"",
        companyCity             :"",
        companyPincode          :"",

      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  }else{
    swal("Please enter mandatory fields", "", "warning");
    console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
  }
}

  render(){
    const {formerrors} = this.state;
    return(
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
             {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header">
                <h4 className="lettersp MasterBudgetTitle">Location Details</h4>
              </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Location Details</h4>
              </div>
               <hr className="compySettingHr" />
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Company Location</label><span className="astrick">*</span>
                            <input value={this.state.companyLocation} onChange={this.handleChange} data-text="companylocation" type="text" title="Please enter valid location" id="companyLocation" name="companyLocation" className="form-control CLcompanyLocation inputValid" required/>
                            {this.state.formerrors.companylocation &&(
                              <span className="text-danger">{formerrors.companylocation}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                 
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Contact Number</label><span className="astrick">*</span>
                            <input id="companycontact" value={this.state.companycontact} onChange={this.handleChange} data-text="companyMobile"  type="text" name="companycontact" title="Please enter valid number" className="form-control companyNo inputValid " required/>
                            {this.state.formerrors.companyMobile &&(
                              <span className="text-danger">{formerrors.companyMobile}</span> 
                            )}
                        </div>
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                
                  
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Block Name/Building</label><span className="astrick">*</span>
                            <input value={this.state.companybuildingblock} onChange={this.handleChange} data-text="companyArea" type="text" id="companybuildingblock" title="Please enter valid address" name="companybuildingblock" className="form-control CLcompanyAddress inputValid " required/>
                            {this.state.formerrors.companyArea &&(
                              <span className="text-danger">{formerrors.companyArea}</span> 
                            )}
                        </div>
                    </div> 
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="form-group margin15">
                            <label className="control-label statelabel locationlabel" >Near by Landmark</label>
                             <input value={this.state.companylandmark} onChange={this.handleChange} type="text" id="companylandmark"  name="companylandmark" className="form-control CLcompanylandmark inputValid" />
                        </div>
                    </div> 
                  </div>
                  

                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  {/* <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                  <div className="form-group">
                      <label className="control-label statelabel locationlabel" >Country<span className="astrick">*</span></label>
                      <select className="stateselection countrySelect form-control" title="Please select country" id="companyCountry" value={this.state.companyCountry}  ref="companyCountry" name="companyCountry" onChange={this.handleChange} required>
                      <option value="">-Select-</option>
                    
                      </select>
                  </div>
                  </div>
                  <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                      <label className="control-label statelabel locationlabel" >State<span className="astrick">*</span></label>
                      <select className="stateselection stateSelect form-control" title="Please select state" id="companyState" value={this.state.companyState}  ref="companyState" name="companyState" onChange={this.handleChange} required>
                        <option value="">-Select-</option>
                      
                        </select> 
                    </div> 
                  </div>
                  <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                          <label className="control-label statelabel locationlabel" >District<span className="astrick">*</span></label>
                         <select className="stateselection districtSelect form-control" title="Please select district" id="companyDist" value={this.state.companyDist}  ref="companyDist" name="companyDist" onChange={this.handleChange} required>
                         <option value="">-Select-</option>
                       
                        </select> 
                    </div>
                  </div> */}

                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            Country
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyCountry" 
                            data-text="country"
                            className="form-control areaStaes"
                            value={this.state.companyCountry}
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.country &&(
                            <span className="text-danger">{formerrors.country}</span> 
                          )}

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            State
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyState" 
                            data-text="state"
                            className="form-control areaStaes"
                            value={this.state.companyState}

                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.state &&(
                            <span className="text-danger">{formerrors.state}</span> 
                          )}

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            District
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyDist" 
                            data-text="district"
                            className="form-control areaStaes"
                            value={this.state.companyDist}

                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.district &&(
                            <span className="text-danger">{formerrors.district}</span> 
                          )}

                      </div>  
                    </div>

                  </div>
                  <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                    {/* <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Taluka<span className="astrick">*</span></label>
                           <select className="stateselection talukaSelect form-control" title="Please select taluka" id="taluka" value={this.state.taluka}  ref="taluka" name="taluka" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                         
                          </select>  
                      </div>
                    </div>
                    <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >City<span className="astrick">*</span></label>
                           <select className="stateselection villageSelect form-control" title="Please select city" id="companyCity" value={this.state.companyCity}  ref="companyCity" name="companyCity" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                          
                          </select> 
                      </div>
                    </div>
                    <div className="formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Pin Code<span className="astrick">*</span></label>
                          <select className="stateselection  form-control" title="Please select pincode" id="companyPincode" value={this.state.companyPincode} ref="companyPincode" name="companyPincode" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                        
                          </select>
                      </div>
                    </div> */}
                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            Taluka
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="taluka" 
                            data-text="taluka"
                            value={this.state.taluka}
                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.taluka &&(
                            <span className="text-danger">{formerrors.taluka}</span> 
                          )}

                      </div>  
                    </div>


                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            City
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyCity" 
                            data-text="city"
                            value={this.state.companyCity}

                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.city &&(
                            <span className="text-danger">{formerrors.city}</span> 
                          )}

                      </div>  
                    </div>


                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                            Pincode
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyPincode" 
                            data-text="pincode"
                            value={this.state.companyPincode}
                            className="form-control areaStaes"
                            title="Please enter alphanumeric only" />
                          
                          {this.state.formerrors.pincode &&(
                            <span className="text-danger">{formerrors.pincode}</span> 
                          )}

                      </div>  
                    </div>
                  

                  </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  {/* <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)}>Submit</button> */}

                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)} >
                    {this.state.submitVal
                      ?
                        "Submit"
                      : 
                        "Update"
                    }  
                  </button>
                </div>
                </div>
              </form>
              
            </div>
        </div>
      </div>


      );
  }

 }

export default CompanyLocation;
