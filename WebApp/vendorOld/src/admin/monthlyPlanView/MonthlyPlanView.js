import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import MonthlyForm            from "./component/MonthlyForm.js";

import 'react-table/react-table.css';
import "./MonthlyPlanView.css";

class MonthlyPlanView extends Component{
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
      "Months"              :["January","February","March","April","May","June","July","August","September","October","November","December"],
      "Year"                :[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
      shown                 : true,
            tabtype : "location",

      fields: {},
      errors: {}
    }
    this.changeTab = this.changeTab.bind(this); 
  }
 
  handleChange(event){
    event.preventDefault();
   /* this.setState({
      "QualificationLevel"   : this.refs.QualificationLevel.value,          
      "Qualification"        : this.refs.Qualification.value,          
      "Specialization"       : this.refs.Specialization.value,
      "Mode"                 : this.refs.Mode.value, 
      "Grade"                : this.refs.Grade.value,
      "PassoutYear"          : this.refs.PassoutYear.value,
      "UniversityName"       : this.refs.UniversityName.value,
      "City"                 : this.refs.City.value,
      "CollegeName"          : this.refs.CollegeName.value,
      "State"                : this.refs.State.value,
      "Country"              : this.refs.Country.value,
    });*/
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
    "QualificationLevel"   : this.refs.QualificationLevel.value,          
    "Qualification"        : this.refs.Qualification.value,          
    "Specialization"       : this.refs.Specialization.value,
    "Mode"                 : this.refs.Mode.value, 
    "Grade"                : this.refs.Grade.value,
    "PassoutYear"          : this.refs.PassoutYear.value,
    "UniversityName"       : this.refs.UniversityName.value,
    "City"                 : this.refs.City.value,
    "CollegeName"          : this.refs.CollegeName.value,
    "State"                : this.refs.State.value,
    "Country"              : this.refs.Country.value,
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
      .post('https://jsonplaceholder.typicode.com/posts',{academicValues})
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
    const modalData = [{
      srno: 1,
      FamilyID: "L000001",
      NameofBeneficiary: "Priyanka Lewade",
      BeneficiaryID: "PL0001",
      },{
      srno: 2,
      FamilyID: "B000001",
      NameofBeneficiary: "Priyanka Bhanvase",
      BeneficiaryID: "PB0001",
      }
      ]
      const modalColumns = [ 
      {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'SDG Goal',
        accessor: 'FamilyID', 
        }, {
        Header: 'Sector',
        accessor: 'NameofBeneficiary', 
        }, {
        Header: 'Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Sub-Activity',
        accessor: 'noMAp', 
        },{
        Header: 'Quantity',
        accessor: 'noMAp', 
        },{
        Header: 'Amount',
        accessor: 'noMAp', 
        },{
        Header: 'Beneficiary',
        accessor: 'noMAp', 
        },{
        Header: "Financial Sharing",
        columns: [
        {
          Header: "LHWRF",
          accessor: "LHWRF"
        },
        {
          Header: "NABARD",
          accessor: "NABARD"
        },{
          Header: "Bank Loan",
          accessor: "BankLoan"
        },{
          Header: "Govt",
          accessor: "BankLoan"
        },{
          Header: "Direct Beneficiary",
          accessor: "BankLoan"
        },{
          Header: "Indirect Beneficiary",
          accessor: "BankLoan"
        },
        ]
        },
      
        {
        Header: 'Action',
        accessor: 'Action',
        Cell: row => 
          (
          <div className="actionDiv col-lg-offset-3">
              <div className="col-lg-6" onClick={() => this.deleteData(row.original)}>
            <i className="fa fa-trash"> </i>
              </div>
             
            </div>
            )     
          }
        ]
      const data = [{
      srno: 1,
      monthYear: "January-2019",
      totalBudget: "21,000,00",
      },{
      srno: 2,
      monthYear: "February-2019",
      totalBudget: "10,000,00",
      }
      ]
      const columns = [ 
      {
        Header: 'Sr No',
        accessor: 'srno',
        },
        {
        Header: 'Month-Year',
        accessor: 'monthYear', 
        Cell: e =><div>
        <a  class="yearDetail" id="link" data-toggle="modal" value={e.value} onClick={this.getValue.bind(this)} data-target="#myModal"> {e.value}  </a></div>
        }, {
        Header: 'Total Budget',
        accessor: 'totalBudget', 

        }, 
        ]

    return (
      <div className="container-fluid">
       <div className="row">
        <div className="formWrapper">
          <section className="content">
            <div className="">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                    Monthly Plan View                                      
                  </div>
                  <hr className="hr-head container-fluid row"/>
                </div>
                <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                  <div className="row">
                    <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                      <div className=" col-lg-4 col-lg-offset-4 col-md-4 col-sm-6 col-xs-12 ">
                        <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="QualificationLevel" >
                          <select className="custom-select form-control inputBox" ref="QualificationLevel" name="QualificationLevel"  onChange={this.handleChange.bind(this)} >
                            <option className="hidden" >-- Select Year --</option>
                           {this.state.Year.map((data,index) =>
                            <option key={index}  className="" >{data}</option>
                            )}
                          </select>
                        </div>
                        <div className="errorMsg">{this.state.errors.QualificationLevel}</div>
                      </div>
                      <div className="modal fade in " id="myModal" role="dialog">
                        <div className="modal-dialog modal-lg " >
                          <div class="modal-content ">
                            <div class=" ">
                              <div className="col-lg-12  col-md-10 pageContent margTop">
                                <button type="button" id="actButton" class="close" data-dismiss="modal"> <i class="fa fa-times"></i></button>
                                <form id="form">
                                  <div className="col-lg-12 ">
                                    <h4 className="">Monthly Plan for {this.state.mon}</h4>
                                  </div>
                                  <div className="row"> 
                                    <div className="col-lg-12 col-sm-12 col-xs-12 slowmotion">
                                      <MonthlyForm />
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> 
                  </div><br/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt formLable boxHeightother " >  
                    <ReactTable 
                      data      = {data}
                        columns     = {columns}
                        sortable    = {true}
                        defaultPageSiz  = {5}
                        minRows     = {3} 
                        className       = {"-striped -highlight"}
                      showPagination  = {true}
                    />
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
export default MonthlyPlanView