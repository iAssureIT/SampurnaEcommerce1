import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';
// import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import InputMask  from 'react-input-mask';

// import "../../../API";

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const companymobileRegex  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companyAddressRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
const companywebsiteRegex = RegExp(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
class CompanyInformation extends Component{
   constructor(props) {
    super(props);
    this.state = {
      companyId               : "",
      companyName             : "",
      companyContactNumber    : "",
      companyAltContactNumber : "",
      companyEmail            : "",
      companyAddressLine1     : "",
      companyDist             : "",
      companyPincode          : "",
      companyCity             : "",
      companyState            : "",
      companyCountry          : "",
      companyLogo             : "",
      logoFilename            : "",
      taluka                  : "",
      companywebsite          : "",
      data                    : [],
      submitVal               : true,
      formerrors :{
        firstcompanyname : "",
        companyMobile : " ",
        companyEmailID  : " ",
        companyAddress : " ",
        companywebsitename : " ",

        country : " ",
        district : " ",
        state : " ",
        taluka : " ",

        city : " ",
        pincode : " ",
      },
      subscription : {
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
  var companyId = 2;
    /*axios.get('/api/companysettings/'+ companyId)
    .then( (res)=>{      
      console.log("here company data",res.data);
      this.setState({
        companyName : res.data.companyName,
        companyId   : 2,
        companyContactNumber : res.data.companyContactNumber,
        companyAltContactNumber : res.data.companyMobileNumber,
        companyEmail            : res.data.companyEmail, 
        companywebsite          : res.data.companywebsite, 
        companyAddressLine1     : res.data.companyaddress,
        companyDist             : res.data.district,
        companyPincode          : res.data.pincode,
        companyCity             : res.data.city,
        companyState            : res.data.state,
        companyCountry          : res.data.country,
        taluka                  : res.data.taluka,
        submitVal               : false,
      });
      console.log("this.this.state.companyName",this.state.companyName)
    })
    .catch((error)=>{
      console.log("error = ",error);
      // alert("Something went wrong! Please check Get URL.");
    });*/
  
  }
 
  removeCompanyImage(event){
    event.preventDefault();
    // var link = $(event.target).attr('data-link');
  }

  CompanyImage(){
    // var TempIamge = this.props.tempLogoData;
    // if(TempIamge){
    //   // this.setState({
    //   //   commonLogo : TempIamge.logo
    //   // })
    //   return TempIamge.logo;
    // }else{
    //   var companyData = CompanySettings.findOne({});
    //   if(companyData){
    //     if(companyData.companyLogo){
    //       // this.setState({
    //       //   commonLogo : companyData.companyLogo
    //       // })
    //       return companyData.companyLogo;
    //     }else{
    //       return '/images/CSLogo.png';
    //     }
    //   } else{
    //     return '/images/CSLogo.png';
    //   }
    // }
  }
  imgBrowse(e){
   
    e.preventDefault();
    // let self=this;      
    //   if(e.currentTarget.files){
    //   var file=e.currentTarget.files[0];
    //   if(file){
    //     var fileExt=e.currentTarget.files[0].name.split('.').pop();
    //     if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'svg' || fileExt == 'png' ) {
    //        attachLogoToS3Function(file,self);
    //     }else{
    //     swal({
    //       title:"abc",
    //       text:'Please upload only .jpg/.jpeg/.svg/.png files'});
    //     }
    //   }
    // }           
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.get && nextProps.get.length != 0){

     this.setState({
                companyName             : this.state.companyName,
                companyContactNumber    : this.state.companyContactNumber,
                companyAltContactNumber : this.state.companyAltContactNumber,
                companyEmail            : this.state.companyEmail,
                companywebsite          : this.state.companywebsite,
                companyaddress          : this.state.companyAddressLine1,
                country                 : this.state.companyCountry,
                state                   : this.state.companyState,
                district                : this.state.companyDist,
                city                    : this.state.companyCity,
                pincode                 : this.state.companyPincode,
                taluka                  : this.state.taluka,
                logoFilename            : this.state.logoFilename,
                companyLogo             : this.state.companyLogo,

     });
    }

    this.handleChange = this.handleChange.bind(this);
  }

  submitCompanyInformation=(event)=>{
    event.preventDefault();
   
    var companyInfoFormValue = {
      companyName             : this.state.companyName,
      companyContactNumber    : this.state.companyContactNumber,
      companyMobileNumber     : this.state.companyAltContactNumber,
      companyEmail            : this.state.companyEmail,
      companyAltEmail         : "",

      companywebsite          : this.state.companywebsite,
      companyaddress          : this.state.companyAddressLine1,
      logoFilename            : this.state.logoFilename,
      companyLogo             : this.state.companyLogo,
     
      

      country                 : this.state.companyCountry,
      state                   : this.state.companyState,
      district                : this.state.companyDist,
      city                    : this.state.companyCity,
      pincode                 : this.state.companyPincode,
      taluka                  : this.state.taluka,

 

    }//close array
  
    console.log("companyInfoFormValue",companyInfoFormValue);
  if(formValid(this.state.formerrors)){
    console.log('companyName    : this.state.companyName');

    axios.post('/api/companysettings',companyInfoFormValue)
    .then( (response)=> {
      // handle success
      console.log("this is response===>>>",response);
      swal("Good job!", "Company Information Submited!", "success");
      this.setState({
    
      companyName             : "",
      companyContactNumber    : "",
      companyAltContactNumber : "",
      companyEmail            : "",
      companyAddressLine1     : "",
      companyDist             : "",
      companyPincode          : "",
      companyCity             : "",
      companyState            : "",
      companyCountry          : "",
      companyLogo             : "",
      logoFilename            : "",
      taluka                  : "",
      companywebsite          : "",
      });

      

    })
    .catch(function (error) {
      // handle error
      console.log(error);
      swal("", "Company Information submition failed!", "Danger")

    })
    .finally(function () {
      // always executed
    });

  }else{
    swal("Please enter mandatory fields", "", "warning");
    console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
  }
    // if($('#companyInformationForm').valid()){
      
    // }
  
  }
  handleChange(event){
    // const target = event.target;
    // const {name , value}   = event.target;
    const datatype = event.target.getAttribute('data-text');
    const {name,value} = event.target;
    let formerrors = this.state.formerrors;
    
    console.log("datatype",datatype);
    switch (datatype){
     
      case 'firstcompanyname' : 
       formerrors.firstcompanyname = companynameRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
       break;

       case 'companyMobile' : 
       formerrors.companyMobile = companymobileRegex.test(value) && value.length>0 ? '' : "Please Enter Numbers only";
       break;

       case 'companyEmailID' : 
        formerrors.companyEmailID = emailRegex.test(value)  && value.length>0? "":"Invalid EmailID";
       break;
      //  case "email" : 
      //  formErrors.email = emailRegex.test(value)? "":"Please enter valid mail address";
      //  break;
      case 'companywebsitename' : 
         formerrors.companywebsitename = companywebsiteRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;

       case 'companyAddress' : 
       formerrors.companyAddress = companyAddressRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;
    
      case 'country' : 
        formerrors.country = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;
    
      case 'state' : 
        formerrors.state = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;
    
      case 'district' : 
        formerrors.district = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;

      case 'taluka' : 
        formerrors.taluka = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;

      case 'city' : 
        formerrors.city = companynameRegex.test(value)  && value.length>0 ? '' : "Invalid Field";
      break;

      case 'pincode' : 
        formerrors.pincode = companypincodeRegex.test(value)   && value.length>0? '' : "Invalid Field";
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

  render(){
    const {formerrors} = this.state;
    return(
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
         {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header compyHeader">
          <h4 className="lettersp MasterBudgetTitle">Company Information</h4>
          </div>*/}
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className=""> Company Information</h4>
              </div>
               <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="companyInformationForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                 

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12 noPadding">
                    <h4 className="basicinfotxt"><i className="fa fa-info-circle fonticons" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Basic Info</h4>
                  </div>
                  {/*<div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                   
                    <div className="col-lg-6 col-lg-offset-6 col-md-6 col-sm-12 col-xs-12 csImageWrapper">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerPhotoWrapper">
                          {this.CompanyImage() === '../images/CSLogo.png'? <i className="fa fa-camera fonticons" aria-hidden="true" title="First Add Photo."/>
                          :
                          <i className="fa fa-times fonticons removeprofPhoto" aria-hidden="true" title="Remove Photo." onClick={this.removeCompanyImage.bind(this)} data-link={this.state.companyLogo} id={this.state.companyLogo} data-id={this.state.companyId}></i>
                          }
                          <div className="col-lg-12 col-md-12 col-sm-12ClientImgWrap1 displayBlockOne">
                            {
                            this.CompanyImage() ==='../images/CSLogo.png' ?  <i className="fa fa-camera fonticons paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Photo.">
                            <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="image/*" onChange={this.imgBrowse.bind(this)}/> </i>
                              :
                              <i className="fa fa-camera fonticons paddingNoImageUpload col-lg-2  styleUpload" title="Change Photo.">
                                <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="image/*" onChange={this.imgBrowse.bind(this)}/>
                              </i>
                            }
                          </div>

                            {<img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.CompanyImage()?this.CompanyImage() :"/images/preloader.gif"}/>}
                            
                        
                      </div>
                    </div>
                  </div>*/}
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >
                          Company Name
                        </label>
                        <span className="astrick">*</span>
                        
                        <input
                          onChange={this.handleChange} 
                          type="text" name="companyName" 
                          data-text="firstcompanyname"
                          className="form-control areaStaes"
                          title="Please enter alphanumeric only"
                          value={this.state.companyName} />
                        
                        {this.state.formerrors.firstcompanyname &&(
                          <span className="text-danger">{formerrors.firstcompanyname}</span> 
                        )}
 
                    </div>  
                  </div>

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Company ID</label><span className="astrick"></span>
                        <input id="companyId" value={this.state.companyId} onChange={this.handleChange.bind(this)} type="text" name="companyId" ref="companyId" className="form-control areaStaes" title="Company ID" autoComplete="off" disabled />
                    </div>  
                  </div>
               
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Contact Number</label><span className="astrick">*</span>
                        {/* <input className="form-control areaStaes" data-text="companyMobile" title="Please enter valid mobile number only" id="companyContactNumber" type="text" name="companyContactNumber" ref="companyContactNumber" value={this.state.companyContactNumber} aria-required="true" onChange={this.handleChange.bind(this)} required /> */}
                        <InputMask  mask="9999999999"  data-text="companyMobile" name="companyContactNumber" id="companyContactNumber" value={this.state.companyContactNumber}  ref="companyContactNumber" onChange={this.handleChange}  className="form-control areaStaes" required />
                        {this.state.formerrors.companyMobile &&(
                          <span className="text-danger">{formerrors.companyMobile}</span> 
                        )}
                    </div> 
                  </div>
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Alternate Contact Number</label>
                        <InputMask  mask="9999999999" className="form-control areaStaes" title="Please enter valid mobile number only" id="companyAltContactNumber" type="text" name="companyAltContactNumber" ref="companyAltContactNumber" value={this.state.companyAltContactNumber} aria-required="true" onChange={this.handleChange.bind(this)} />
                    </div> 
                  </div>
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Company EmailID</label><span className="astrick">*</span>
                        <input className="form-control areaStaes" 
                          title="Please enter valid email address" 
                          id="companyEmail" type="text"
                          data-text="companyEmailID" 
                          name="companyEmail" ref="companyEmail" 
                          value={this.state.companyEmail} aria-required="true"
                          onChange={this.handleChange.bind(this)} required/>

                        {this.state.formerrors.companyEmailID &&  (
                          <span className="text-danger">{formerrors.companyEmailID}</span> 
                        )}
                   </div> 
                  </div>

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Company Website</label><span className="astrick">*</span>
                        <input className="form-control areaStaes" title="Please enter valid webside address"   data-text="companywebsitename"  id="companywebsite" type="text" name="companywebsite" ref="companywebsite" value={this.state.companywebsite} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                        {this.state.formerrors.companywebsitename &&(
                            <span className="text-danger">{formerrors.companywebsitename}</span> 
                        )}
                    </div> 
                  </div>
                </div>
              </div>

              <div className="basicinfocmpset"> 
              <h4 className="basicinfotxt"><i className="fa fa-map-marker fonticons" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Address</h4>
                 
                <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 compForm">
                  {/* <div className="form-group formht col-lg-12 col-md-4 col-sm-12 col-xs-12">
                      <label className="control-label statelabel locationlabel" >Company Address</label><span className="astrick">*</span>
                      <input className="form-control areaStaes" title="Please enter valid address" id="companyAddressLine1" type="text" name="companyAddressLine1" ref="companyAddressLine1" value={this.state.companyAddressLine1} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                      {this.state.formerrors.country &&(
                            <span className="text-danger">{formerrors.country}</span> 
                          )}
                  </div>  */}

                  <div className="form-group formht col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="control-label statelabel locationlabel" >
                          Company Address
                          </label>
                          <span className="astrick">*</span>
                          
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyAddressLine1" 
                            data-text="companyAddress"
                            className="form-control areaStaes"
                            title="Please enter alphanumeric only"
                            value={this.state.companyAddressLine1} />
                          
                          {this.state.formerrors.companyAddress &&(
                            <span className="text-danger">{formerrors.companyAddress}</span> 
                          )}

                      </div>  
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  {/* <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                  <div className="form-group">
                      <label className="control-label statelabel locationlabel" >Country<span className="astrick">*</span></label>
                      <select className="stateselection countrySelect form-control" title="Please select country" id="companyCountry" value={this.state.companyCountry}  ref="companyCountry" name="companyCountry" onChange={this.handleChange} required>
                      <option value="">-Select-</option>
                  
                      </select>
                  </div>
                  </div>
                  <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                    <div className="form-group">
                      <label className="control-label statelabel locationlabel" >State<span className="astrick">*</span></label>
                      <select className="stateselection stateSelect form-control" title="Please select state" id="companyState" value={this.state.companyState}  ref="companyState" name="companyState" onChange={this.handleChange} required>
                        <option value="">-Select-</option>
                      
                        </select> 
                    </div> 
                  </div>
                  <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
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
                  <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12 compForm">
                    {/* <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >Taluka<span className="astrick">*</span></label>
                           <select className="stateselection talukaSelect form-control" title="Please select taluka" id="taluka" value={this.state.taluka}  ref="taluka" name="taluka" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                      
                          </select>  
                      </div>
                    </div>
                    <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
                        <div className="form-group">
                            <label className="control-label statelabel locationlabel" >City<span className="astrick">*</span></label>
                           <select className="stateselection villageSelect form-control" title="Please select city" id="companyCity" value={this.state.companyCity}  ref="companyCity" name="companyCity" onChange={this.handleChange} required>
                          <option value="">-Select-</option>
                         
                          </select> 
                      </div>
                    </div>
                    <div className="form-group formht col-lg-4 col-md-4 col-xs-12 col-sm-12">
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
                  
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck"  onClick={this.submitCompanyInformation.bind(this)}>
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

 export default CompanyInformation;