import React, { Component }     from 'react';
import jQuery                   from 'jquery';
import $                        from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import './PackageMaster.css'
import 'rc-time-picker/assets/index.css';
import IAssureTable             from '../IAssureTable/IAssureTable.jsx';
import OneFieldForm             from '../Master/OneFieldForm/OneFieldForm.js';
import PackageMasterForm        from './PackageMasterForm.js';

class PackageMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleValue       : "One Way",
      toggleClass       : "toggleoff",
      fromTime          : "",
      toTime            : "",
      packageName       : "",
      packageTypeArray  : [],
      cityClassArray    : [],
      carCategoryArray  : [],

      "oneTableHeading": {
          packageType   : "Package Type",
          actions       : 'Action',
      },
      "oneTableObjects": {
          deleteMethod    : 'delete',
          apiLink         : '/api/packagetypemaster/',
          paginationApply : false,
          searchApply     : false,
          editUrl         : '/package-master/package-type',
          editUrl1        : '/package-master'
      },
      "fields" : {
        placeholder   : "Add package type & press 'Enter' Key.",
        title         : "Package Type",
        attributeName : "packageType"
      },
      "oneeditId": this.props.match.params ? this.props.match.params.fieldID : '',


      tableHeading      : {
        packageType     : "Package Type",
        packageName     : "Package Name",
        fixCharges      : "Fixed Charges (₹)",
        maxHours        : "Max Hours",
        maxKm           : "Max Kms",
        actions         : 'Action',
      },
      tableObjects      : {
        deleteMethod    : 'delete',
        apiLink         : '/api/packagemaster/',
        paginationApply : false,
        searchApply     : false,
        editUrl         : '/package-master'
      },
      startRange        : 0,
      limitRange        : 10,
      dayArray          : [{ 'name': 'Sunday' }, { 'name': 'Monday' }, { 'name': 'Tuesday' }, { 'name': 'Wednesday' }, { 'name': 'Thursday' }, { 'name': 'Friday' }, { 'name': 'Saterday' }]
    };
  }
  componentDidMount() {
    this.edit(this.props.match.params.packageID);
    this.getData(this.state.startRange, this.state.limitRange);
    this.getPackageType();
    this.getCityType();
    this.getCarCategory();
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid package name");

    $.validator.addMethod("regxZ1", function (value, element, regexpr) {
      return regexpr !== value;
    }, "Please select Package type");

    $.validator.addMethod("regxZ2", function (value, element, regexpr) {
      return regexpr !== value;
    }, "Please select City Class");

    $.validator.addMethod("regxZ3", function (value, element, regexpr) {
      return regexpr !== value;
    }, "Please select Car Category");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#packageMaster").validate({
      rules: {
        packageType: {
          required: true,
          regxZ1   : "--Select Type--"
        },
        cityClass: {
          required: true,
          regxZ2   : "--Select Class--"
        },
        carCategory: {
          required: true,
          regxZ3   : "--Select Category--"
        },
        packageName: {
          required: true,
          regxA1: /^[A-za-z0-9'!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+( [A-Za-z'0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
        fixCharges: {
          required: true,
        },
        maxHours: {
          required: true,
        },
        maxKm: {
          required: true,
        },
        extraHr: {
          required: true,
        },
        extraKms: {
          required: true,
        },
        driverAllow: {
          required: true,
        },
        nightHalt: {
          required: true,
        },
        nightCharges: {
          required: true,
        },
        morningCharges: {
          required: true,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "packageType") {
          error.insertAfter("#packageType");
        }
        if (element.attr("name") === "cityClass") {
          error.insertAfter("#cityClass");
        }
        if (element.attr("name") === "carCategory") {
          error.insertAfter("#carCategory");
        }
        if (element.attr("name") === "packageName") {
          error.insertAfter("#packageName");
        }
        if (element.attr("name") === "fixCharges") {
          error.insertAfter("#fixCharges");
        }
        if (element.attr("name") === "maxHours") {
          error.insertAfter("#maxHours");
        }
        if (element.attr("name") === "maxKm") {
          error.insertAfter("#maxKm");
        }
        if (element.attr("name") === "extraHr") {
          error.insertAfter("#extraHr");
        }
        if (element.attr("name") === "extraKms") {
          error.insertAfter("#extraKms");
        }
        if (element.attr("name") === "driverAllow") {
          error.insertAfter("#driverAllow");
        }
        if (element.attr("name") === "nightHalt") {
          error.insertAfter("#nightHalt");
        }
        if (element.attr("name") === "nightCharges") {
          error.insertAfter("#nightCharges");
        }
        if (element.attr("name") === "morningCharges") {
          error.insertAfter("#morningCharges");
        }
      }
    });
  }
  componentWillReceiveProps(nextProps){
    this.edit(nextProps.match.params.packageID);
  }
  handleChange(event) {
    event.preventDefault();    
    const target = event.target;
    const name = target.name;

    // if(name == "way" && target.className == "off") {        
    //     this.setState({
    //       toggleClass : "on",
    //       toggleValue : "Two Way"
    //     })
    // }else if(name == "way" && target.className == "on"){       
    //     this.setState({          
    //       toggleClass : "off",
    //       toggleValue : "One Way"
    //     })
    // }

    this.setState({
      [name]: event.target.value
    });
  }
  submitPackageMaster(event) {
    event.preventDefault();
    if ($('#packageMaster').valid()) {
      var formValues = {
        packageID     : this.props.match.params.packageID,
        packageTypeId : this.state.packageType,
        packageName   : this.state.packageName,
        fixCharges    : this.state.fixCharges,
        maxHours      : this.state.maxHours,
        maxKm         : this.state.maxKm,
        way           : this.state.toggleValue,
        cityTypeId    : this.state.cityClass,
        categoryId    : this.state.carCategory,
        extraHr       : this.state.extraHr,
        extraKms      : this.state.extraKms,
        driverAllow   : this.state.driverAllow,
        nightHalt     : this.state.nightHalt,
        nightCharges  : this.state.nightCharges,
        morningCharges: this.state.morningCharges,
      }
      console.log("FormValues = ", formValues);
      if(this.props.match.params.packageID){
        axios.patch("/api/packagemaster/patch", formValues)
        .then((response) => {
          if(response.data.duplicate === true){
            swal("This package type and package name already exist");
          }else{
            document.getElementById("btnCheck").innerHTML = "Submit";
            swal("Package updated successfully.")
            this.props.history.push("/package-master");
            this.setState({
              packageType : "",
              packageName : "",
              fixCharges  : "",
              maxHours    : "",
              maxKm       : "",
              toggleValue   : "One Way",
              toggleClass   : "off",
              cityClass     : "",
              carCategory   : "",
              extraHr       : "",
              extraKms      : "",
              driverAllow   : "",
              nightHalt     : "",
              nightCharges  : "",
              morningCharges: "",
            })
            this.getData(this.state.startRange, this.state.limitRange);
          }
        })
        .catch(() => {

        })
      }else{
        axios.post("/api/packagemaster/post", formValues)
        .then((response) => {
          if(response.data.duplicate === true){
            swal("This package type and package name already exist");
          }else{
            swal("Package created successfully.")
            this.setState({
              packageType : "",
              packageName : "",
              fixCharges  : "",
              maxHours    : "",
              maxKm       : "",
              toggleValue   : "One Way",
              toggleClass   : "off",
              cityClass     : "",
              carCategory   : "",
              extraHr       : "",
              extraKms      : "",
              driverAllow   : "",
              nightHalt     : "",
              nightCharges  : "",
              morningCharges: "",
            })
            this.getData(this.state.startRange, this.state.limitRange);
          }
        })
        .catch(() => {

        })
      }
      this.getData(this.state.startRange, this.state.limitRange);
      
    }

  }
  fromTime(value) {
    this.setState({
      fromTime: value
    })
  }
  toTime(value) {
    this.setState({
      toTime: value
    })
  }
  earlyMorningChargesfromTime(value) {
    this.setState({
      earlyMorningChargesfromTime: value
    })
  }
  earlyMorningChargestoTime(value) {
    this.setState({
      earlyMorningChargestoTime: value
    })
  }
  edit(packageID) {
    if (packageID) {
      axios.get('/api/packagemaster/get/one/' + packageID)
      .then((response) => {
        document.getElementById("btnCheck").innerHTML = "Update";
        this.setState({
          packageType : response.data.packageTypeId,
          packageName : response.data.packageName,
          fixCharges  : response.data.fixCharges,
          maxHours    : response.data.maxHours,
          maxKm       : response.data.maxKm,
        })
      })
      .catch((error) => {
      })
    }else{
      document.getElementById("btnCheck").innerHTML = "Submit";
      this.setState({
        packageType : "--Select Type--",
        packageName : "",
        fixCharges  : "",
        maxHours    : "",
        maxKm       : "",
      })
    }
  }
  getMax(event) {
    var charCode = (event.which) ? event.which : event.keyCode
    if (event.target.value > 10000) {
      if (charCode !== 8) {
        event.preventDefault();
        return false;
      }
    }
    else {
      return true;
    }
  }
  getData(startRange, limitRange) {
    var formValue = {
      startRange: startRange,
      limitRange: limitRange
    }
    console.log("getdata values = ", formValue);
    axios.post("/api/packagemaster/get/list", formValue)
      .then((response) => {
        console.log("getdata response = ", response);
        var tableData = response.data.map((a, i)=>{
          return {
            _id             : a._id,
            packageType     : a.packageType,
            packageName     : a.packageName,
            fixCharges      : a.fixCharges,
            maxHours        : a.maxHours,
            maxKm           : a.maxKm,
          }
        })
        this.setState({
          tableData: tableData
        })
      })
      .catch((error) => {

      })
  }
  getPackageType(){
    axios.get("/api/packagetypemaster/get/list")
    .then((response)=>{
      this.setState({
        packageTypeArray : response.data
      })
    })
    .catch((error)=>{

    })
  }
  getCityType(){
    axios.get("/api/citytypemaster/get/list")
    .then((response)=>{
      console.log("City Class = ",response.data);
      this.setState({
        cityClassArray : response.data
      })
    })
    .catch((error)=>{

    })
  }
  getCarCategory(){
    axios.get("/api/categorymaster/get/list")
    .then((response)=>{
      console.log("Car Categorirs = ",response.data);
      this.setState({
        carCategoryArray : response.data
      })
    })
    .catch((error)=>{

    })
  }

  toggleWay(event){
    // event.preventDefault();
    console.log("Event id = ", event.target.id);
    console.log("Event id = ", event.target);
    if(event.target.className == "center-block toggleoff") {
        this.setState({
          toggleClass : "toggleon",          
          toggleValue : "Two Way"
        })
    }else {   
        this.setState({          
          toggleClass : "toggleoff",
          toggleValue : "One Way"
        })
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Master Data</h4>
                    </div>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab addMarginTop">
                    <div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12" >
                              <a className="tabLeft lettersp tablefthr" href="/category">Vehicle Category</a>
                            </li>                     
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/fuel-type">Fuel Type</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/purposeOfTravel">Purpose of Travel</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/documentlistmaster">Documents List Master</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/model">Vehicle Model</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 active">
                              <a className="tabLeft lettersp tablefthr" href="/package-master">Package Master</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/designation-mapping">Designation Mapping</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/expenseType">Expense Type Master</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/department" >Department</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/designation" >Designation</a>
                            </li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                              <a className="tabLeft lettersp tablefthr" href="/city-classification" >City Classification</a>
                            </li>
                          </ul>
                      </div>
                      <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">
                        <div className="tab-pane" id="Category"></div>
                        <div className="tab-pane" id="FuleType">
                        </div>                              
                        <div className="tab-pane" id="DocumentListMaster"></div>                              
                        <div className="tab-pane" id="ExpenseTypeMaster"></div>                              
                        <div className="tab-pane" id="Model"></div>                                
                        <div className="tab-pane active" id="PackageMaster">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                              <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Package Master</h4>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding addMarginTopPM">
                              <form id="packageMaster"  >
                                <div className="">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">City Class <span className="astrick">*</span></label>
                                      <div className="input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="cityClass" >
                                        <select id="" className="addonDiv form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.cityClass} ref="cityClass" name="cityClass" onChange={this.handleChange.bind(this)}>
                                            <option>--Select Class--</option>
                                            {
                                                this.state.cityClassArray && this.state.cityClassArray.length > 0 ?
                                                    this.state.cityClassArray.map((data, i)=>{
                                                        return(
                                                            <option key={i} value={data._id}>{data.cityType}</option>
                                                        );
                                                    })
                                                :
                                                null
                                            }
                                        </select>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Car Category <span className="astrick">*</span></label>
                                      <div className="input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="carCategory" >
                                        <select id="" className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.carCategory} ref="carCategory" name="carCategory" onChange={this.handleChange.bind(this)}>
                                            <option>--Select Category--</option>
                                            {
                                                this.state.carCategoryArray && this.state.carCategoryArray.length > 0 ?
                                                    this.state.carCategoryArray.map((data, i)=>{
                                                        return(
                                                            <option key={i} value={data._id}>{data.category}</option>
                                                        );
                                                    })
                                                :
                                                null
                                            }
                                        </select>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Package Type <span className="astrick">*</span></label>
                                      <div className="input-group" id="packageType" >
                                        <select id="" className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.packageType} ref="packageType" name="packageType" onChange={this.handleChange.bind(this)}>
                                            <option>--Select Type--</option>
                                            {
                                                this.state.packageTypeArray && this.state.packageTypeArray.length > 0 ?
                                                    this.state.packageTypeArray.map((data, i)=>{
                                                        return(
                                                            <option key={i} value={data._id}>{data.packageType}</option>
                                                        );
                                                    })
                                                :
                                                null
                                            }
                                        </select>
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"  data-target="#addOneField" title="Add Package Type" ><i className="fa fa-plus "></i>
                                        </div>
                                        <div className="modal" id="addOneField" role="dialog">
                                          <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                                    <button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
                                               </div>
                                              </div>
                                            <div className="modal-body adminModal-body OneFieldModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <OneFieldForm fields={this.state.fields}
                                                tableHeading={this.state.oneTableHeading}
                                                tableObjects={this.state.oneTableObjects}
                                                editId ={this.props.match.params.fieldID}
                                                masterFieldForm = {true}
                                                history={this.state.history}
                                               />
                                              
                                            </div>
                                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                  <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" >CANCEL</button>
                                              </div>
                                            </div>
                                            </div>
                                          </div>
                                        </div>

                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                      <div className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" id="packageName">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                          Package Name <span className="astrick">*</span>
                                        </label>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="text" name="packageName"
                                          data-text="city"
                                          ref="packageName"
                                          value={this.state.packageName}
                                          className="form-control" />
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <div className="" id="way">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                          Way <span className="astrick">*</span>
                                        </label>
                                          <input type="button" name="way" id="toggleWay" 
                                          className={"center-block " + this.state.toggleClass} 
                                          value={this.state.toggleValue} 
                                          onClick={this.toggleWay.bind(this)}
                                          />                                       
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Fixed Charges <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="fixCharges">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="fixCharges"
                                          value={this.state.fixCharges}
                                          className="form-control"
                                          onKeyDown={this.getMax.bind(this)}
                                          max="100000"
                                        />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <div className="input-group" id="maxHours">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                          Min Hours/Day <span className="astrick">*</span>
                                        </label>
                                        <input
                                          type="number" name="maxHours"
                                          value={this.state.maxHours}
                                          onChange={this.handleChange.bind(this)}
                                          onKeyDown={(event)=>(event.target.value > 24 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          className="form-control" 
                                          max="24"/>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <div className="input-group" id="maxKm">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                          Min Kms/Day <span className="astrick">*</span>
                                        </label>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="maxKm"
                                          value={this.state.maxKm}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Extra Hours <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="extraHr"> 
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>                                       
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="extraHr"
                                          value={this.state.extraHr}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Extra Kms <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="extraKms">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="extraKms"
                                          value={this.state.extraKms}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Driver Allowance <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="driverAllow">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="driverAllow"
                                          value={this.state.driverAllow}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Night Halt <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="nightHalt">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="nightHalt"
                                          value={this.state.nightHalt}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Night Charges <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="nightCharges">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="nightCharges"
                                          value={this.state.nightCharges}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                                        Early Morning Charges <span className="astrick">*</span>
                                      </label>
                                      <div className="input-group" id="morningCharges">
                                        <span className="input-group-addon leftInputIcon inputIcon"><i className="fa fa-rupee "></i></span>
                                        <input
                                          onChange={this.handleChange.bind(this)}
                                          type="number" name="morningCharges"
                                          value={this.state.morningCharges}
                                          className="form-control"
                                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                                          max="1000" />
                                        <span className="input-group-addon inputIcon">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitPackageMaster.bind(this)}>
                                    Submit
                                  </button>
                                </div>
                              </form>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <IAssureTable
                                tableHeading={this.state.tableHeading}
                                twoLevelHeader={this.state.twoLevelHeader}
                                dataCount={this.state.dataCount}
                                tableData={this.state.tableData}
                                tableObjects={this.state.tableObjects}
                                getData={this.getData.bind(this)}
                              />
                            </div>
                          </div>
                        </div>                              
                        <div className="tab-pane" id="DesignationMapping"></div>                     
                        <div className="tab-pane" id="Department"></div>                              
                        <div className="tab-pane" id="Designation">  </div>                         
                        <div className="tab-pane" id="cityName">  </div>                         
                      </div> 
                    </div>
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

export default PackageMaster;