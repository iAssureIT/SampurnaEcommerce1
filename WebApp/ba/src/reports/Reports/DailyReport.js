import React, { Component }   from 'react';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from "../../coreAdmin/IAssureTable/IAssureTable.jsx";

class AnnualPlan extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      
      shown                 : true,
       "twoLevelHeader"     : {
        apply               : false,
        firstHeaderData     : [
          {
              heading : '',
              mergedColoums : 10
          },
          {
              heading : 'Source of Fund',
              mergedColoums : 7
          },
        ]
      },
      "tableHeading"        : {
        date                : "Date",
        orderNo             : "Order No.",
        transactionType     : "Transaction Type",
        productCount        : "Product Count",
        quantity            : "Quantity",
        amount              : "Amount"
      },
      " tableObjects"       : {
        apiLink             : '/api/annualPlans/',
        editUrl             : '/Plan/',
      },
      "startRange"          : 0,
      "limitRange"          : 10,
      // "editId"              : this.props.match.params ? this.props.match.params.id : '',
      fields                : {},
      errors                : {},
    }
  }
 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "month"               : this.refs.month.value,          
      "sectorName"          : this.refs.sectorName.value,
      "year"                : this.refs.year.value,          
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
    /*  "center"              : this.refs.center.value,
      "sector_id"           : this.refs.sector_id.value,*/
    });
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({
      fields
    });
    if (this.validateForm()) {
      let errors = {};
      errors[event.target.name] = "";
      this.setState({
        errors: errors
      });
    }
  }
   
  SubmitAnnualPlan(event){
    event.preventDefault();
    var id2 = this.state.uID;
    if (this.validateFormReq() &&this.validateForm()) {
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
   
    
    console.log("annualPlanValues",annualPlanValues);

    axios.post('/api/annualPlans/',annualPlanValues)
    .then(function(response){
      swal({
        title : response.data,
        text  : response.data
      });
      console.log("response"+response.data);
      this.getData(this.state.startRange, this.state.limitRange);
    })
    .catch(function(error){
      console.log("error"+error);
      });
      this.setState({
        "year"                :"",
        "month"               :"",
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
    if(this.refs.year.value == "" || this.refs.month.value =="" || this.refs.sectorName.value=="" || this.refs.activity.value=="" 
      || this.refs.physicalUnit.value=="" || this.refs.unitCost.value=="" || this.refs.totalBudget.value=="" || this.refs.noOfBeneficiaries.value=="" 
      || this.refs.LHWRF.value=="" || this.refs.NABARD.value=="" || this.refs.bankLoan.value=="" || this.refs.govtscheme.value=="" 
      || this.refs.directCC.value=="" || this.refs.indirectCC.value=="" || this.refs.other.value=="" || this.refs.remark.value=="")
      {
        if (this.validateFormReq() && this.validateForm()){
        }
      }else{
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
      axios.patch('/api/annualPlans/',annualPlanValues)
      .then(function(response){
        swal({
          title : response.data,
          text  : response.data
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error"+error);
        });
      this.setState({
        "year"                :"",
        "month"               :"",
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
        "fields"              :fields
      });
    }
  }
  
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["sectorName"]) {
        formIsValid = false;
        errors["sectorName"] = "This field is required.";
      }     
      if (!fields["activity"]) {
        formIsValid = false;
        errors["activity"] = "This field is required.";
      }     
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
    }
  }

  componentDidMount() {
    console.log('editId componentDidMount', this.state.editId);
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    var data = {
      limitRange : 0,
      startRange : 1,
    }
    axios({
      method: 'get',
      url: '/api/annualPlans/list',
      }).then((response)=> {
      var tableData = response.data.map((a, index)=>{return});
      this.setState({
        tableData : response.data,
        editUrl   : this.props.match.params
      },()=>{
        
      });
    }).catch(function (error) {
      console.log('error', error);
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/annualPlans/'+id,
      }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      this.setState({
        "year"                : editData.year,
        "month"               : editData.month,
        "center"              : editData.center,
        "sectorName"          : editData.sectorName,
        "activity"            : editData.activity,
        "physicalUnit"        : editData.physicalUnit,
        "unitCost"            : editData.unitCost,
        "totalBudget"         : editData.totalBudget,
        "noOfBeneficiaries"   : editData.noOfBeneficiaries,
        "LHWRF"               : editData.LHWRF,
        "NABARD"              : editData.NABARD,
        "bankLoan"            : editData.bankLoan,
        "govtscheme"          : editData.govtscheme,
        "directCC"            : editData.directCC,
        "indirectCC"          : editData.indirectCC,
        "other"               : editData.other,
        "remark"              : editData.remark,
      });
    }).catch(function (error) {
    });
  }

  toglehidden(){
    this.setState({
       shown: !this.state.shown
      });
  }
  previousDate(event){
    // event.preventDefault();
    // var selectedDate1 = $(".reportsDayRef").val();
    // var selectedDate = selectedDate1.replace(/-/g, '\/');

    // var newDate1 = new Date(selectedDate);
    // var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
    // Session.set('newDate', newDate2);

  }
  nextDate(event){
    // event.preventDefault();
    // var selectedDate1 = $(".reportsDayRef").val();
    // var selectedDate = selectedDate1.replace(/-/g, '\/');

    // var newDate1 = new Date(selectedDate);
    // var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
    // Session.set('newDate', newDate2);

  }
  handleChange(event){
      // event.preventDefault();
      // var target = event.target;
      // var name = target.name;

      // var dateVal = event.target.value;
      // var dateUpdate = new Date(dateVal);
      // Session.set('newDate',dateUpdate);
      

      // this.setState({
      //     [name] : event.target.value,
      // });
  }

  currentDate(){
   //       var setDate = Session.get('newDate');

    // if(setDate){
    //  var today = new Date(setDate);
    // }else{
    //  var today = new Date();
    // }
    // var dd = today.getDate();
    // var mm = today.getMonth()+1; //January is 0!
    // var yyyy = today.getFullYear();
    // if(dd<10){
    //     dd='0'+dd;
    // }
    // if(mm<10){
    //     mm='0'+mm;
    // }
  //       var today = yyyy+'-'+mm+'-'+dd;

    // return today;

  }

  render() {
    var shown = {
      display: this.state.shown ? "block" : "none"
    };
    
    var hidden = {
      display: this.state.shown ? "none" : "block"
    }

    return (
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
        <div className="sales-report-main-class">
          <div className="reports-select-date-boxmain">
            <div className="reports-select-date-boxsec">
              <div className="reports-select-date-Title">Daily Reports</div>
              <div className="input-group">
                <span onClick={this.previousDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                <input onChange={this.handleChange} value={this.currentDate()} name="reportsDayRef" type="date" className="reportsDateRef reportsDayRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="reportsDayRef"  />
                <span onClick={this.nextDate.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
              </div>
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
        </div>
      </div>
    );
  }
}
export default AnnualPlan
