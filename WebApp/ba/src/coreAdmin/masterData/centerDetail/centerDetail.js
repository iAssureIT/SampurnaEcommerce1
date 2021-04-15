import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import "./centerDetail.css";
      
var centerDetailArray  = [];
class centerDetail extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "typeOfCenter"             :"",
      "nameOfCenter"             :"",
      "address"                  :"",
      "state"                    :"",
      "district"                 :"",
      "pincode"                  :"",
      "centerInchargeName"       :"",
      "centerInchargeContact"    :"",
      "centerInchargeEmail"      :"",
      "MISCoordinatorName"       :"",
      "MISCoordinatorContact"    :"",
      "MISCoordinatorEmail"      :"",
      "districtCovered"          :"",
      "blockCovered"             :"",
      "centerDetailArray"        :[],
      "array"                    :[],
      "shown"                    : true,
      "tabtype"                  : "location",
      "fields"                   : {},
      "errors"                   : {},
      "listofStates"             : [],
      "listofDistrict"           : [],
      "listofBlocks"             : [],
      "listofVillages"           : [],
      "selectedVillages"         : [],
      "twoLevelHeader"           : {
        apply                    : false,
        firstHeaderData          : [
                                      {
                                          heading : '',
                                          mergedColoums : 4
                                      },
                                      {
                                          heading : 'Center Incharge',
                                          mergedColoums : 3
                                      },
                                      {
                                          heading : 'MIS Coordinator',
                                          mergedColoums : 3
                                      },
                                    ]
      },
      "tableHeading"                : {
        type                      : "Type of Center",
        centerName                : "Name of Center",
        // address                   : "Address",
        centerInchargeDetail      : "Center Incharge Detail",
        misCoordinatorDetail      : "MIS Coordinator Detail",
        numberofVillage           : "No of Villages",
        actions                   : 'Action',
      },
      "tableObjects"              : {
        deleteMethod              : 'delete',
        apiLink                   : '/api/centers/',
        paginationApply           : true,
        searchApply               : true,
        editUrl                   : '/center-detail/'
      },
      "startRange"                : 0,
      "limitRange"                : 10,
      "editId"                    : this.props.match.params ? this.props.match.params.id : ''
    }
    this.changeTab = this.changeTab.bind(this); 
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
     "typeOfCenter"              : this.refs.typeOfCenter.value,
      "nameOfCenter"             : this.refs.nameOfCenter.value,
      "address"                  : this.refs.address.value,
      "state"                    : this.refs.state.value,
      "district"                 : this.refs.district.value,
      "pincode"                  : this.refs.pincode.value,
      "centerInchargeName"       : this.refs.centerInchargeName.value,
      "centerInchargeContact"    : this.refs.centerInchargeContact.value,
      "centerInchargeEmail"      : this.refs.centerInchargeEmail.value,
      "MISCoordinatorName"       : this.refs.MISCoordinatorName.value,
      "MISCoordinatorContact"    : this.refs.MISCoordinatorContact.value,
      "MISCoordinatorEmail"      : this.refs.MISCoordinatorEmail.value,
      "districtCovered"          : this.refs.districtCovered.value,
      "blockCovered"             : this.refs.blockCovered.value,
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
  componentWillReceiveProps(nextProps){
    var editId = nextProps.match.params.id;
    if(nextProps.match.params.id){
      this.setState({
        editId : editId
      })
      this.edit(editId);
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
  isTextKey(evt)  {
   var charCode = (evt.which) ? evt.which : evt.keyCode;
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  Submit(event){
    event.preventDefault();
    if (this.validateForm() && this.validateFormReq()) {
      var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');

      var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
      var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});

      var id2 = this.state.uID;
        /*    if (this.validateForm()) {*/    
      var centerDetail= 
      {
        "type"                      : this.refs.typeOfCenter.value,
        "centerName"                : this.refs.nameOfCenter.value,
        "address"                   : {
            "addressLine"           : this.refs.address.value,
            "state"                 : this.refs.state.value,
            "district"              : this.refs.district.value,
            "pincode"               : this.refs.pincode.value,
        },
        "districtsCovered"          : districtsCovered,
        "blocksCovered"             : blocksCovered,
        "villagesCovered"           : this.state.selectedVillages,
        "centerInchargeName"        : this.refs.centerInchargeName.value,
        "centerInchargeMobile"      : this.refs.centerInchargeContact.value,
        "centerInchargeEmail"       : this.refs.centerInchargeEmail.value,
        "misCoordinatorName"        : this.refs.MISCoordinatorName.value,
        "misCoordinatorMobile"      : this.refs.MISCoordinatorContact.value,
        "misCoordinatorEmail"       : this.refs.MISCoordinatorEmail.value,
      };
      
      // console.log("centerDetail",centerDetail);
      let fields = {};
      fields["typeOfCenter"] = "";
      fields["nameOfCenter"] = "";
      fields["address"] = "";
      fields["state"] = "";
      fields["district"] = "";
      fields["pincode"] = "";
      fields["centerInchargeName"] = "";
      fields["centerInchargeContact"] = "";
      fields["centerInchargeEmail"] = "";
      fields["MISCoordinatorName"] = "";
      fields["MISCoordinatorContact"] = "";
      fields["MISCoordinatorEmail"] = "";
      fields["districtCovered"] = "";
      fields["blockCovered"] = "";

      // console.log('centerDetail',centerDetail);
      axios.post('/api/centers',centerDetail)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        
      });

      this.setState({
        "typeOfCenter"              : "",
        "nameOfCenter"              : "",
        "address"                   : "",
        "state"                     : "",
        "district"                  : "",
        "pincode"                   : "",
        "centerInchargeName"        : "",
        "centerInchargeContact"     : "",
        "centerInchargeEmail"       : "",
        "MISCoordinatorName"        : "",
        "MISCoordinatorContact"     : "",
        "MISCoordinatorEmail"       : "",
        "districtCovered"           : "",
        "blockCovered"              : "",
        "selectedVillages"          : [],
        "listofDistrict"            : [],
        "listofBlocks"              : [],
        "listofVillages"            : [],
        "fields"                    : fields
      });
      $('input[type=checkbox]').attr('checked', false);
    }
  }
  Update(event){
  event.preventDefault();
  if(this.refs.address.value == "" || this.refs.typeOfCenter.value =="" || this.refs.nameOfCenter.value=="" 
    || this.refs.district.value=="" || this.refs.pincode.value=="" || this.refs.centerInchargeName.value=="" 
    || this.refs.centerInchargeContact.value=="" || this.refs.centerInchargeEmail.value=="" || this.refs.MISCoordinatorName.value=="" 
    || this.refs.MISCoordinatorContact.value=="" || this.refs.MISCoordinatorEmail.value=="")
   {
      console.log('state validation');
      if (this.validateForm() && this.validateFormReq()){
        console.log('abc');
      }
    }else{

        var districtsCovered  = _.pluck(_.uniq(this.state.selectedVillages, function(x){return x.state;}), 'district');
        var selectedBlocks    = _.uniq(this.state.selectedVillages, function(x){return x.block;});
        var blocksCovered   = selectedBlocks.map((a, index)=>{ return _.omit(a, 'village');});

        var centerDetail = {
          "center_ID"               : this.state.editId,
          "centerName"                : this.refs.nameOfCenter.value,
          "type"                      : this.refs.typeOfCenter.value,
          "address"                   : {
              "addressLine"           : this.refs.address.value,
              "state"                 : this.refs.state.value,
              "district"              : this.refs.district.value,
              "pincode"               : this.refs.pincode.value,
          },
          "districtsCovered"          : districtsCovered,
          "blocksCovered"             : blocksCovered,
          "villagesCovered"           : this.state.selectedVillages,
          "centerInchargeName"        : this.refs.centerInchargeName.value,
          "centerInchargeMobile"      : this.refs.centerInchargeContact.value,
          "centerInchargeEmail"       : this.refs.centerInchargeEmail.value,
          "misCoordinatorName"        : this.refs.MISCoordinatorName.value,
          "misCoordinatorMobile"      : this.refs.MISCoordinatorContact.value,
          "misCoordinatorEmail"       : this.refs.MISCoordinatorEmail.value,
        };
      
        let fields = {};
        fields["typeOfCenter"] = "";
        fields["nameOfCenter"] = "";
        fields["address"] = "";
        fields["state"] = "";
        fields["district"] = "";
        fields["pincode"] = "";
        fields["centerInchargeName"] = "";
        fields["centerInchargeContact"] = "";
        fields["centerInchargeEmail"] = "";
        fields["MISCoordinatorName"] = "";
        fields["MISCoordinatorContact"] = "";
        fields["MISCoordinatorEmail"] = "";
        fields["districtCovered"] = "";
        fields["blockCovered"] = "";
        // console.log('centerDetail', centerDetail);
        axios.patch('/api/centers',centerDetail)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
        })
        .catch(function(error){
          
        });

        this.setState({
          "typeOfCenter"              : "",
          "nameOfCenter"              : "",
          "address"                   : "",
          "state"                     : "",
          "district"                  : "",
          "pincode"                   : "",
          "centerInchargeName"        : "",
          "centerInchargeContact"     : "",
          "centerInchargeEmail"       : "",
          "MISCoordinatorName"        : "",
          "MISCoordinatorContact"     : "",
          "MISCoordinatorEmail"       : "",
          "districtCovered"           : "",
          "blockCovered"              : "",
          "selectedVillages"          : [],
          "listofDistrict"            : [],
          "listofBlocks"              : [],
          "listofVillages"            : [],
          "fields"                    : fields
        });
        $('input[type=checkbox]').attr('checked', false);
    }
   
      $('input[type=checkbox]').attr('checked', false);
      this.props.history.push('/center-detail');
      this.setState({
        "editId"              : "",
      });
      // window.location.reload(true);
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["typeOfCenter"]) {
        formIsValid = false;
        errors["typeOfCenter"] = "This field is required.";
      }     
      if (!fields["nameOfCenter"]) {
        formIsValid = false;
        errors["nameOfCenter"] = "This field is required.";
      }
      if (!fields["address"]) {
        formIsValid = false;
        errors["address"] = "This field is required.";
      }
      if (!fields["state"]) {
          formIsValid = false;
          errors["state"] = "This field is required.";
      }
      if (!fields["district"]) {
        formIsValid = false;
        errors["district"] = "This field is required.";
      }          
      if (!fields["pincode"]) {
        formIsValid = false;
        errors["pincode"] = "This field is required.";
      }          
      if (!fields["centerInchargeName"]) {
        formIsValid = false;
        errors["centerInchargeName"] = "This field is required.";
      }          
      if (!fields["centerInchargeContact"]) {
        formIsValid = false;
        errors["centerInchargeContact"] = "This field is required.";
      }          
      if (!fields["centerInchargeEmail"]) {
        formIsValid = false;
        errors["centerInchargeEmail"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorName"]) {
        formIsValid = false;
        errors["MISCoordinatorName"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorContact"]) {
        formIsValid = false;
        errors["MISCoordinatorContact"] = "This field is required.";
      }          
      if (!fields["MISCoordinatorEmail"]) {
        formIsValid = false;
        errors["MISCoordinatorEmail"] = "This field is required.";
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
      if (typeof fields["centerInchargeEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["centerInchargeEmail"])) {
          formIsValid = false;
          errors["centerInchargeEmail"] = "Please enter valid email-ID.";
        }
      }
      if (typeof fields["MISCoordinatorEmail"] !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(fields["MISCoordinatorEmail"])) {
          formIsValid = false;
          errors["MISCoordinatorEmail"] = "Please enter valid email-ID.";
        }
      }
      if (typeof fields["centerInchargeContact"] !== "undefined") {
        if (!fields["centerInchargeContact"].match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["centerInchargeContact"] = "Please enter valid mobile no.";
        }
      }
      if (typeof fields["MISCoordinatorContact"] !== "undefined") {
        if (!fields["MISCoordinatorContact"].match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["MISCoordinatorContact"] = "Please enter valid mobile no.";
        }
      }
         
      this.setState({
        errors: errors
      });
      return formIsValid;
  }
  componentDidMount() {
    if(this.state.editId){      
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);

    var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharashtra'];
    this.setState({
      listofStates : listofStates
    })
  }
  edit(id){
    // $('input:checkbox').attr('checked','unchecked');
    axios({
      method: 'get',
      url: '/api/centers/'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      editData.villagesCovered.map((data, i)=>{
        this.setState({
          [data.village] : true
        })
      })
      this.setState({
        "typeOfCenter"             : editData.type,
        "nameOfCenter"             : editData.centerName,
        "address"                  : editData.address.addressLine,
        "state"                    : editData.address.state,
        "district"                 : editData.address.district,
        "pincode"                  : editData.address.pincode,
        "centerInchargeName"       : editData.centerInchargeName,
        "centerInchargeContact"    : editData.centerInchargeMobile,
        "centerInchargeEmail"      : editData.centerInchargeEmail,
        "MISCoordinatorName"       : editData.misCoordinatorName,
        "MISCoordinatorContact"    : editData.misCoordinatorMobile,
        "MISCoordinatorEmail"      : editData.misCoordinatorEmail,
        "selectedVillages"         : editData.villagesCovered,
        "districtCovered"          : "",
        "blockCovered"             : "",
        "villagesCovered"          : editData.villagesCovered,
      },()=>{
        
        if(this.state.state == 'Maharashtra'){
          var listofDistrict = ['Pune', 'Mumbai'];
          this.setState({
            listofDistrict : listofDistrict
          });
        }
        if(this.state.district == 'Pune'){
          var listofBlocks = ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Mawal', 'Mulshi', 'Pune City', 'Purandhar', 'Shirur', 'Velhe'];
          this.setState({
            listofBlocks : listofBlocks
          });
        }
      });
    }).catch(function (error) {
    });
  }
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
       axios.post('/api/centers/list',data)
      .then((response)=>{
        console.log('response', response.data);
        this.setState({
          tableData : response.data
        })
      })
      .catch(function(error){
        
      });

      var listofStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh','Maharashtra'];
      this.setState({
        listofStates : listofStates
      })
  }
  componentWillMount(){

     }
  districtCoveredChange(event){
    event.preventDefault();
    var districtCovered = event.target.value;
    // console.log('districtCovered', districtCovered);
    this.setState({
      districtCovered: districtCovered
    },()=>{
      var listofBlocks = ['Ambegaon', 'Baramati', 'Bhor', 'Daund', 'Haveli', 'Indapur', 'Junnar', 'Khed', 'Mawal', 'Mulshi', 'Pune City', 'Purandhar', 'Shirur', 'Velhe'];
      if(this.state.districtCovered == 'Pune'){          
        this.setState({
          listofBlocks : listofBlocks
        });
      }else{
        this.setState({
          listofBlocks : [],
          listofVillages:[]
        });
      }
    });
  }
  selectState(event){
    event.preventDefault();
    var selectedState = event.target.value;
    this.setState({
      state : selectedState
    },()=>{
      if(this.state.state == 'Maharashtra'){
        var listofDistrict = ['Pune', 'Mumbai'];
        this.setState({
          listofDistrict : listofDistrict
        });
      }else{
        this.setState({
          listofDistrict:[],
          listofVillages:[]
        });
      }
    });
    this.handleChange(event);
  }
  blockCoveredChange(event){
    event.preventDefault();
    var blockCovered = event.target.value;
    this.setState({
      blockCovered : blockCovered
    },()=>{
      var listofVillages = ['Magarpatta', 'Kharadi', 'Wagholi', 'Manjari'];
      if(this.state.blockCovered == 'Haveli'){
        this.setState({
          listofVillages : listofVillages
        })
      }else{
        this.setState({
          listofVillages : []
        })
      }        
    });
  }
  selectVillage(event){
    var selectedVillages = this.state.selectedVillages;

    var value = event.target.checked;
    var id    = event.target.id;

    this.setState({
      [id] : value
    },()=>{
      // console.log('village', this.state[id], id);
      if(this.state[id] == true){
        selectedVillages.push({
          district  : this.refs.districtCovered.value,
          block     : this.refs.blockCovered.value,
          village   : id
        });
        this.setState({
          selectedVillages : selectedVillages
        });
        console.log('selectedVillages', selectedVillages);
      }else{
        var index = selectedVillages.findIndex(v => v.village === id);
        selectedVillages.splice(selectedVillages.findIndex(v => v.village === id), 1);
        this.setState({
          selectedVillages : selectedVillages
        },()=>{

        });
      }
    });      
  }
  editVillage(event){
    event.preventDefault();
    var id = event.target.id;
    console.log('id',id);

    var selectedVillages = this.state.selectedVillages[id];
    console.log('selectedVillages', selectedVillages);
  }
  deleteVillage(event){
    event.preventDefault();
    var id = event.target.id;
    console.log('id',id);
    var selectedVillages = this.state.selectedVillages;
    // console.log('index', index);
    selectedVillages.splice(id, 1);
    this.setState({
      selectedVillages : selectedVillages
    },()=>{
      // console.log('selectedVillages',this.state.selectedVillages);
    });
  }
  changeTab = (data)=>{
    this.setState({
      tabtype : data,
    })
  }
  render() {

    const dataM = [{
        srno: 1,
        FamilyID: "Maharashtra",
        NameofBeneficiary: "Pune",
        BeneficiaryID: "Pimpri",
      }
    ]
    const columnsM = [ 
      {
        Header: 'Sr No',
        accessor: 'srno',
      },
      {
        Header: 'District',
        accessor: 'FamilyID', 
      }, {
        Header: 'Block',
        accessor: 'NameofBeneficiary', 
      }, {
        Header: 'Village',
        accessor: 'BeneficiaryID', 
      },
    ]
    const data = [{
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
    const columns = [ 
        {
          Header: 'Sr No',
          accessor: 'srno',
          },
          {
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
        // console.log('dataCount', this.state.dataCount, 'tableData', this.state.tableData);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                  <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                            Master Data                                     
                         </div>
                        <hr className="hr-head container-fluid row"/>
                      </div>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="Academic_details">
                        <div className="col-lg-12 ">
                           <h4 className="pageSubHeader">Center Details</h4>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12 formLable boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Select Type of Center</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="typeOfCenter" >
                                <select className="custom-select form-control inputBox" value={this.state.typeOfCenter} ref="typeOfCenter" name="typeOfCenter" onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--Select Center--</option>
                                  <option  className="" >Development Center</option>
                                  <option  className="" >CSR Center</option>
                                  <option  className="" >ADP</option>
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.typeOfCenter}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Center</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="nameOfCenter" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.nameOfCenter}  name="nameOfCenter" placeholder="" ref="nameOfCenter"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.nameOfCenter}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                             <label className="formLable">Address</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="address" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.address}  name="address" placeholder="" ref="address" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.address}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">State</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="state" >
                                <select className="custom-select form-control inputBox" value={this.state.state}  ref="state" name="state"  onChange={this.selectState.bind(this)} >
                                  <option  className="hidden" value="">--Select--</option> 
                                  {
                                    this.state.listofStates ?
                                    this.state.listofStates.map((state, index)=>{
                                      return(
                                        <option key={index} value={state}>{state}</option> 
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.state}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                              <label className="formLable">District</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="district" >
                                <select className="custom-select form-control inputBox"  value={this.state.district}  ref="district" name="district"  onChange={this.handleChange.bind(this)} >
                                  <option  className="hidden" >--Select--</option>
                                  {
                                    this.state.listofDistrict ? 
                                    this.state.listofDistrict.map((district, index)=>{
                                      return(
                                        <option key={index} value={district}>{district}</option>
                                      );
                                    })
                                    :
                                    null
                                  }                                
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.district}</div>
                            </div>
                            <div className=" col-lg-3 col-md-3 col-sm-12 col-xs-12  ">
                             <label className="formLable">Pincode</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="pincode" >
                                <input type="text"   className="form-control inputBox "  value={this.state.pincode}  name="pincode" placeholder="" ref="pincode" maxLength="6"  onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.pincode}</div>
                            </div>
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of Center Incharge</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centerInchargeName" >
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.centerInchargeName} name="centerInchargeName" placeholder="" ref="centerInchargeName"  onKeyDown={this.isTextKey.bind(this)}   onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of Center Incharge</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="centerInchargeContact" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"   value={this.state.centerInchargeContact} name="centerInchargeContact" placeholder="" ref="centerInchargeContact" maxLength="10" onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of Center Incharge</label><span className="asterix">*</span>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="centerInchargeEmail" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox " name="centerInchargeEmail"  value={this.state.centerInchargeEmail} placeholder="" ref="centerInchargeEmail" onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.centerInchargeEmail}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            
                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Name of MIS Coordinator</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="MISCoordinatorName" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox nameParts"  value={this.state.MISCoordinatorName}  name="MISCoordinatorName" placeholder="" ref="MISCoordinatorName"  onKeyDown={this.isTextKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorName}</div>
                            </div>
                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                              <label className="formLable">Contact No. of MIS Coordinator</label><span className="asterix">*</span>
                              <div className="col-lg-12 col-sm-12 col-xs-12  input-group inputBox-main" id="MISCoordinatorContact" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-building fa iconSize14"></i>
                                </div>*/}
                                <input type="text"   className="form-control inputBox "  value={this.state.MISCoordinatorContact}  name="MISCoordinatorContact" placeholder="" ref="MISCoordinatorContact" maxLength="10" onKeyDown={this.isNumberKey.bind(this)}  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorContact}</div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className="formLable">Email of MIS Coordinator</label><span className="asterix">*</span>
                              <div className=" col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="MISCoordinatorEmail" >
                                {/*<div className="input-group-addon inputIcon">
                                 <i className="fa fa-university fa iconSize14"></i>
                                </div>*/}
                                <input type="text" className="form-control inputBox "  value={this.state.MISCoordinatorEmail}  name="MISCoordinatorEmail" placeholder=""ref="MISCoordinatorEmail"  onChange={this.handleChange.bind(this)}/>
                              </div>
                              <div className="errorMsg">{this.state.errors.MISCoordinatorEmail}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="col-lg-12 ">
                           <hr />
                        </div>
                        <div className="col-lg-12 ">
                           <h5 className="pageSubHeader">Villages Covered by this Center</h5>
                        </div>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight ">
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">District Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="districtCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.districtCovered}  ref="districtCovered" name="districtCovered"  onChange={this.districtCoveredChange.bind(this)} >
                                  <option  className="hidden" >--Select District--</option>
                                  {
                                    this.state.listofDistrict ? 
                                    this.state.listofDistrict.map((district, index)=>{
                                      return(
                                        <option key={index} value={district}>{district}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.districtCovered}</div>
                            </div>
                            <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12  ">
                              <label className="formLable">Block Covered</label>
                              <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="blockCovered" >
                                <select className="custom-select form-control inputBox"  value={this.state.blockCovered}  ref="blockCovered" name="blockCovered"  onChange={this.blockCoveredChange.bind(this)} >
                                  <option  className="hidden" >--Select Block--</option>
                                  {
                                    this.state.listofBlocks ? 
                                    this.state.listofBlocks.map((block, index)=>{
                                      return(
                                        <option key={index} value={block}>{block}</option>
                                      );
                                    })
                                    :
                                    null
                                  }
                                </select>
                              </div>
                              <div className="errorMsg">{this.state.errors.blockCovered}</div>
                            </div>
                          </div> 
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  boxHeight mt ">
                          <label className="formLable faintCoolor col-lg-12 col-sm-12 col-xs-12">Villages Covered</label>                           
                            {
                              this.state.listofVillages?
                              this.state.listofVillages.map((village, index)=>{
                            /*  this.setState({
                                array : village,
                              })*/
                                return(
                                  <div key={index} className="col-md-3  col-lg-3 col-sm-12 col-xs-12 mt">
                                    <div className="row"> 
                                      <div className="col-lg-12 noPadding">  
                                       <div className="actionDiv">
                                          <div className="centerDetailContainer col-lg-1">
                                            <input type="checkbox" id={village}  checked={this.state[village]?true:false} onChange={this.selectVillage.bind(this)}/>
                                            <span className="centerDetailCheck"></span>
                                          </div>
                                        </div>                            
                                        <label className="centerDetaillistItem"> {village}</label>
                                      </div>
                                    </div>  
                                  </div>
                                );
                              })
                              :
                              null
                            }
                          </div>
                        </div><br/>
                        <div className="row">
                          <div className=" col-lg-12 col-sm-12 col-xs-12  ">
                            
                          </div> 
                        </div><br/>             
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                           <hr />
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="">List of Villages</h5>                                     
                          <table className="table iAssureITtable-bordered table-striped table-hover">
                            <thead className="tempTableHeader">
                              <tr>
                                <th>District</th>
                                <th>Block</th>
                                <th>Villages</th>
                                {/*<th>Actions</th>*/}
                              </tr>
                            </thead>
                            <tbody>
                            {
                              this.state.selectedVillages && this.state.selectedVillages.length > 0 ? 
                              this.state.selectedVillages.map((data, index)=>{
                                return(
                                  <tr key={index}>
                                    <td>{data.district}</td>
                                    <td>{data.block}</td>
                                    <td>{data.village}</td>
                                    {/*<td>
                                      <i className="fa fa-pencil" id={index} onClick={this.editVillage.bind(this)}></i> &nbsp; &nbsp; 
                                      <i className="fa fa-trash redFont" id={index} onClick={this.deleteVillage.bind(this)}></i>
                                    </td>*/}
                                  </tr>
                                );
                              })
                              :
                              <tr><td className="textAlignCenter" colSpan="4">Nothing to Display</td></tr>
                            }
                            </tbody>
                          </table> 
                        </div>     
                        <div className="col-lg-12">
                        {
                          this.state.editId ? 
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                          :
                          <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
                        }
                        </div>                          
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                </section>
              </div>
            </div>
          </div>
        );
      }
}
export default centerDetail