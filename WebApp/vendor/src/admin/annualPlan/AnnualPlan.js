import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";
import _                      from 'underscore';
import swal                   from 'sweetalert';

import 'react-table/react-table.css';
import "./AnnualPlan.css";

class AnnualPlan extends Component{
  constructor(props){
    super(props); 
   
    this.state = {
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      academicData          :[],
      "uID"                 :"",
      "shown"               : true,
      "hide"                : true,
      "month"               :"Annually",
      "year"                :"",
      "Months"              :["April","May","June","--Quarter 1--","July","August","September","--Quarter 2--","October","November","December","--Quarter 3--","January","February","March","--Quarter 4--",],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      "YearPair"            :["FY 2019 - 2020","FY 2020 - 2021","FY 2021 - 2022"],
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {},
         "twoLevelHeader"              : {
        apply                     : true,
        firstHeaderData           : [
                                      {
                                          heading : '',
                                          mergedColoums : 10
                                      },
                                      {
                                          heading : 'Source of Fund',
                                          mergedColoums : 7
                                      },
                                   /*   {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },*/
                                    ]
      },
      "tableHeading"                : {
        month                      : "Month",
        sectorName                 : "Sector",
        activity                   : "Activity",
        subActivity                : "Sub-Activity",
        unit                       : "Unit",
        physicalUnit               : "Physical Unit",
        unitCost                   : "Unit Cost",
        totalBudget                : "Total Cost",
        noOfBeneficiaries          : "No. Of Beneficiaries",
        LHWRF                      : "LHWRF",
        NABARD                     : "NABARD",
        bankLoan                   : "Bank Loan",
        govtscheme                 : "Govt. Scheme",
        directCC                   : "Direct Community Contribution",
        indirectCC                 : "Indirect Community Contribution",
        other                      : "Other",
        actions                     : 'Action',
      },
      " tableObjects"        : {
        apiLink             : '/api/annualPlans/',
        editUrl             : '/annualPlans/',
      },
      "startRange"                  : 0,
      "limitRange"                  : 10,
      "editId"                      : this.props.match.params ? this.props.match.params.id : ''
    }
    
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      
      "month"   : this.refs.month.value,
      "year"    : this.refs.year.value,          


    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
  /*  if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }*/
  }

  componentWillReceiveProps(nextProps){
    console.log('nextProps',nextProps);
    if(nextProps.BasicInfoId){
       if(nextProps.BasicInfoId.academicsInfo&&nextProps.BasicInfoId.academicsInfo.length>0){
        this.setState({
         academicData:nextProps.BasicInfoId.academicsInfo
        })
      }
    }
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
    {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  isTextKey(evt)
  {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }

  SubmitAcademics(event){
    event.preventDefault();
    var academicArray=[];
    var id2 = this.state.uID;
    if (this.validateForm()) {
    var academicValues= 
    {
      "month"                : this.refs.month.value, 
      "year"                : this.refs.year.value,          
    };

    let fields = {};
    fields["QualificationLevel"] = "";
    fields["Qualification"] = "";
    fields["Specialization"] = "";
    fields["Mode"] = "";
    fields["Grade"] = "";
    fields["PassoutYear"] = "";
    fields["CollegeName"] = "";
    fields["UniversityName"] = "";
    fields["City"] = "";
    fields["State"] = "";
    fields["Country"] = "";
    this.setState({
      "QualificationLevel"  :"",
      "Qualification"       :"",
      "Specialization"      :"",
      "Mode"                :"",
      "Grade"               :"",
      "PassoutYear"         :"",
      "CollegeName"         :"",
      "UniversityName"      :"",
      "City"                :"",
      "State"               :"",
      "Country"             :"",
      fields:fields
    });
      axios
      .post('/api/annualPlans/',{academicValues})
      .then(function(response){
        console.log(response);
      })
      .catch(function(error){
        console.log(error);
      });
      console.log("academicValues =>",academicValues);
      academicArray.push(academicValues);
      console.log("add value",academicValues);      
      alert("Data inserted Successfully!")
      }
    }
  getData(startRange, limitRange){
   axios({
      method: 'get',
      url: '/api/annualPlans/list',
    }).then(function(response){
      console.log('response======================', response.data);
      this.setState({
        tableData : response.data
      });
     
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  Update(event){
    event.preventDefault();
    if (this.validateForm() && this.validateFormReq()) {
     /* var academicArray=[];
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});*/

      var id2 = this.state.uID;
        /*    if (this.validateForm()) {*/    
       var annualPlanValues= 
    {
      "year"                : this.refs.year.value,          
      "month"               : this.refs.month.value,          
      // "center"              : this.refs.center.value,
      // "sector_id"           : this.refs.sector_id.value,
      "sectorName"          : this.refs.sectorName.value,
      "activity"            : this.refs.activity.value,
      "physicalUnit"        : this.refs.physicalUnit.value,
      "unitCost"            : this.refs.unitCost.value,
      "totalBudget"         : this.refs.totalBudget.value,
      "noOfBeneficiaries"   : this.refs.noOfBeneficiaries.value,
      "LHWRF"               : this.refs.LHWRF.value,
      "NABARD"              : this.refs.NABARD.value,
      "bankLoan"            : this.refs.bankLoan.value,
      "govtscheme"          : this.refs.govtscheme.value,
      "directCC"            : this.refs.directCC.value,
      "indirectCC"          : this.refs.indirectCC.value,
      "other"               : this.refs.other.value,
      "remark"              : this.refs.remark.value,
    };

    let fields = {};
    fields["year"]              = "";
    fields["month"]             = "";
    fields["sectorName"]        = "";
    fields["activity"]          = "";
    fields["physicalUnit"]      = "";
    fields["unitCost"]          = "";
    fields["totalBudget"]       = "";
    fields["noOfBeneficiaries"] = "";
    fields["LHWRF"]             = "";
    fields["NABARD"]            = "";
    fields["bankLoan"]          = "";
    fields["govtscheme"]        = "";
    fields["directCC"]          = "";
    fields["indirectCC"]        = "";
    fields["other"]             = "";
    fields["remark"]            = "";
   
  
      // console.log('centreDetail',centreDetail);
      axios.post('/api/annualPlans',annualPlanValues)
      .then(function(response){
        swal({
          title : response.data.message,
          // text  : response.data.message
        });
        this.getData(this.state.startRange, this.state.limitRange);
        
      })
      .catch(function(error){
        
      });
     this.setState({
        "year"                :"",
        "month"                :"",
        "center"              :"",
        "sector_id"           :"",
        "sectorName"          :"",
        "activity"            :"",
        "physicalUnit"        :"",
        "unitCost"            :"",
        "totalBudget"         :"",
        "noOfBeneficiaries"   :"",
        "LHWRF"               :"",
        "NABARD"              :"",
        "bankLoan"            :"",
        "govtscheme"          :"",
        "directCC"            :"",
        "indirectCC"          :"",
        "other"               :"",
        "remark"              :"",
        "fields":fields
      });
    }
  }

    getValue(event){
       const datatype = event.target.getAttribute('value');
       console.log("datatype",datatype);
       this.setState({
        mon : datatype,
       })

    }
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    toglehidden()
    {
     this.setState({
         shown: !this.state.shown
        });
    }
    

    changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
    console.log("tabtype",this.state.tabtype);
    }

    render() {
      
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }
    
    
    return (
      <div className="container-fluid">
       <div className="row">
        <div className="formWrapper">
          <section className="content">
            <div className="">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                    Plan Details                                      
                  </div>
                  <hr className="hr-head container-fluid row"/>
                </div>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                    <div className="row">
                        <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                           <div className=" col-lg-3 col-lg-offset-2  col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="center" >
                              <select className="custom-select form-control inputBox" ref="center" name="center" value={this.state.center}  onChange={this.handleChange.bind(this)} >
                                <option className="" >Center</option>
                            
                                    
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                           <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="month" >
                              <select className="custom-select form-control inputBox" ref="month" name="month" value={this.state.month}  onChange={this.handleChange.bind(this)} >
                                <option className="" >Annually</option>
                               {this.state.Months.map((data,index) =>
                                <option key={index}  className="" >{data}</option>
                                )}
                                
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.month}</div>
                          </div>
                          <div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="year" >
                               <select className="custom-select form-control inputBox" ref="year" name="year" value={this.state.year }  onChange={this.handleChange.bind(this)} >
                                <option className="hidden" >-- Select Year --</option>
                               {this.state.month  ? (this.state.month !== "Annually" ?
                                  this.state.Year.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  ):
                                  this.state.YearPair.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  ) ) : 
                                  this.state.YearPair.map((data,index) =>
                                  <option key={index}  className="" >{data}</option>
                                  )
                                }
                              </select>
                            </div>
                            <div className="errorMsg">{this.state.errors.year}</div>
                          </div>
                       
                        </div> 
                      </div><br/>     
                     <div className="AnnualHeadCont">
                      <div className="annualHead">
                      {
                        this.state.month=="--Quarter 1--"
                          ?
                            <h5>Quarterly Plan for April May & June{this.state.year !=="-- Select Year --" ? " - "+this.state.year : null}</h5> 
                          :
                            <h5>{this.state.month !== "Annually" ? "Monthly Plan "+  this.state.month : "Annual Plan " }{ this.state.year !=="-- Select Year --" ? " - "+(this.state.year ? this.state.year :"" ) : null}</h5> 
                        }
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >
                      <div className="row">  
                       <IAssureTable 
                          tableHeading={this.state.tableHeading}
                          twoLevelHeader={this.state.twoLevelHeader} 
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}

                        />
                      </div>
                    </div> 
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default AnnualPlan