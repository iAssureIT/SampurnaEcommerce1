import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';

import swal from 'sweetalert';

const formValid = formerrors=>{
  console.log("formerrors",formerrors);
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const taxtypeRegex  = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const taxrateRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
// const effectiveRegex = RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);


class CompanyTaxDetails extends Component{
   constructor(props) {
    super(props);
    this.state = {
      taxrating   : '',
      taxtype     : '',
      Effective   : '',
      submitVal      : true,
      formerrors :{
        companytaxtype   : "" ,
        companytaxrate   : "",
        // effective : " ",
      },
      subscription : {
        
      }

    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    
  }
  componentDidMount() {
  
    
  
  }
  submitCompanyInformation(event){
    event.preventDefault();
   
    var companytaxinfo = {
      companyId             : 2,
      taxRating             : this.refs.taxrating.value,
      taxType               : this.refs.taxtype.value,
      effectiveFrom         : this.state.Effective,
     
    }//close array

    console.log("companytaxinfo",companytaxinfo);
    if(formValid(this.state.formerrors)){
      
  
      axios.patch('/api/companysettings/tax/add',companytaxinfo)
      .then(function (response) {
        // handle success

        // this.setState({
        //         taxrating :"",
        //         taxtype   :"",
        //         Effective :"",
        //       });
        if(response.status == 200)
        {
        console.log("this is response===>>>",response);
        swal("Good job!", "Tax Information Added Successfully!", "success")

        // this.refs.taxrating.value = "";
        // this.refs.taxtype.value   = "";
        
         }   
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        swal("", "Tax Information Added Successfully!!", "Danger")
  
      })
      .finally(function () {
        // always executed
      });
  
    }else{
      swal("Please enter mandatory fields", "", "warning");
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
    // axios.post('https://jsonplaceholder.typicode.com/posts',{companytaxinfo})
    // .then(function (response) {
    //   // handle success
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   // handle error
    //   console.log(error);
    // })
    // .finally(function () {
    //   // always executed
    // });
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
   
    case 'companytaxtype' : 
     formerrors.companytaxtype = taxtypeRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
    break;

    case 'companytaxrate' : 
     formerrors.companytaxrate = taxrateRegex.test(value)  && value.length>0 ? '' : "Please Enter Valid Name";
    break;

    // case 'effective' : 
    //  formerrors.effective = effectiveRegex.test(value)   && value.length>0? '' : "Please Enter Date";
    // break;

  
    
     default :
     break;

  
  }
  
  this.setState({ formerrors,
    [name]:value
  } );
}


  render(){
    
    return(
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
         {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 Box-Bottom-Header compyHeader">
          <h4 className="lettersp MasterBudgetTitle">Company Information</h4>
          </div>*/}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Tax Information</h4>
            </div>
               <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyTaxDetailsForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Tax Type</label><span className="astrick">*</span>
                        <input id="taxtype" value={this.state.taxtype} data-text="companytaxtype" onChange={this.handleChange.bind(this)} type="text" name="taxtype" ref="taxtype" className="form-control areaStaes" title="Please enter alphanumeric only" />
                        {this.state.formerrors.companytaxtype &&(
                          <span className="text-danger">{this.state.formerrors.companytaxtype}</span> 
                        )}
                    </div>  
                  </div>

                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Tax Rating</label><span className="astrick">*</span>
                        <input id="taxrating" value={this.state.taxrating} data-text="companytaxrate" onChange={this.handleChange.bind(this)} type="text" name="taxrating" ref="taxrating" className="form-control areaStaes" title="taxrating" autoComplete="off"  />
                        {this.state.formerrors.companytaxrate &&(
                          <span className="text-danger">{this.state.formerrors.companytaxrate}</span> 
                        )}
                    </div>  
                  </div>
               
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="control-label statelabel locationlabel" >Effective From</label><span className="astrick">*</span>
                        <input className="form-control areaStaes" data-text="effective" title="Please enter valid mobile number only" id="Effective" type="date" name="Effective" ref="Effective"required />
                      {/*  {this.state.formerrors.effective &&(
                          <span className="text-danger">{this.state.formerrors.effective}</span> 
                        )}*/}
                    </div> 
                  </div>
                  
                </div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit pull-right" id="btnCheck" onClick={this.submitCompanyInformation.bind(this)} >
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

 export default CompanyTaxDetails;