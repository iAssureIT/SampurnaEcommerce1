import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import {Route, withRouter}    from 'react-router-dom';
import IAssureTable           from "../../../../IAssureTable/IAssureTable.jsx";
import "./SubActivity.css";

class SubActivity extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "sector"              :"",
      "activityName"        :"",
      "subActivityName"     :"",
      "unit"                :"",
      "familyUpgradation"   :"No",
      "user_ID"             :"",
      "shown"               : true,
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        sector              : "Name of Sector",
        activityName        : "Name of Activity",
        subActivityName     : "Name of Sub-Activity",
        unit                : "Unit",
        familyUpgradation   : "Family Upgradation",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'patch',
        apiLink             : '/api/sectors/subactivity/delete/',
        editUrl             : '/sector-and-activity/'
      },
      "startRange"          : 0,
      "limitRange"          : 10,
      "editId"              : props.match.params ? props.match.params.subactivityId : '',
      "editSectorId"        : props.match.params ? props.match.params.sectorId : '',
    }
  }

  handleChange(event){
    event.preventDefault();
    this.setState({
      "sector"               :this.refs.sector.value,
      "activityName"         :this.refs.activityName.value,
      "subActivityName"      :this.refs.subActivityName.value,
      "unit"                 :this.refs.unit.value,
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
  isTextKey(evt){
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
  submitSubActivity(event){
    event.preventDefault();
    if (this.validateFormReq() && this.validateForm()) {
    var subActivityValues = {
      "sector_ID"            :this.refs.sector.value.split('|')[1],
      "sector"               :this.refs.sector.value.split('|')[0],
      "activity_ID"          :this.refs.activityName.value.split('|')[1],
      "activityName"         :this.refs.activityName.value.split('|')[0],
      "subActivityName"      :this.refs.subActivityName.value,
      "unit"                 :this.state.unit,
      "familyUpgradation"    :this.state.familyUpgradation,
      "user_ID"              :this.state.user_ID,
    };
    let fields                = {};
    fields["sector"]          = "";
    fields["activityName"]    = "";
    fields["subActivityName"] = "";
    fields["unit"]            = "";
    this.setState({
      "sector"                :"",
      "activityName"          :"",
      "subActivityName"       :"",      
      "unit"                  :"",
      fields                  :fields
    });
    axios.patch('/api/sectors/subactivity',subActivityValues)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    }   
  }
  updateSubActivity(event){
    event.preventDefault();
    if(this.refs.sector.value =="" || this.refs.activityName.value=="" || this.refs.subActivityName.value =="" || this.state.unit =="")
    {
      console.log('state validation');
      if (this.validateFormReq() && this.validateForm()) {
      }
    }else{
    var subActivityValues = {
      "sector_ID"            : this.refs.sector.value.split('|')[1],
      "sector"               : this.refs.sector.value.split('|')[0],
      "activity_ID"          : this.refs.activityName.value.split('|')[1],
      "activityName"         : this.refs.activityName.value.split('|')[0],
      "subactivity_ID"       : this.state.editId,
      "subActivityName"      : this.refs.subActivityName.value.split('|')[0],
      "unit"                 : this.state.unit,
      "familyUpgradation"    : this.state.familyUpgradation,
      "user_ID"              : this.state.user_ID,
    };

    let fields                = {};
    fields["sector"]          = "";
    fields["activityName"]    = "";
    fields["subActivityName"] = "";
    fields["unit"]            = "";
    this.setState({
      "sector"                :"",
      "activityName"          :"",
      "subActivityName"       :"",      
      "unit"                  :"",
      fields                  :fields
    });
    console.log('subActivityValues', subActivityValues);
    axios.patch('/api/sectors/subactivity/update',subActivityValues)
        .then((response)=>{
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            editId : ''
          })
          this.props.history.push('/sector-and-activity');
        })
        .catch(function(error){
          console.log("error = ",error);
        });
    }     
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["sector"]) {
        formIsValid = false;
        errors["sector"] = "This field is required.";
      }     
      if (!fields["activityName"]) {
        formIsValid = false;
        errors["activityName"] = "This field is required.";
      }
      if (!fields["subActivityName"]) {
        formIsValid = false;
        errors["subActivityName"] = "This field is required.";
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
    this.getAvailableSectors();
    var editId = nextProps.match.params.subactivityId;
    // console.log('editId',editId);
    if(nextProps.match.params.subactivityId){
      this.setState({
        editId : editId,
        editSectorId : nextProps.match.params.sectorId
      },()=>{
        this.getAvailableActivity(this.state.editSectorId);
        this.edit(this.state.editSectorId);
      })    
    }
  }

  componentDidMount() {
    this.getAvailableSectors();
    if(this.state.editId){      
      this.getAvailableActivity(this.state.editSectorId);
      this.edit(this.state.editId);
    }
    this.getData(this.state.startRange, this.state.limitRange);
  }
  getAvailableSectors(){
    axios({
      method: 'get',
      url: '/api/sectors/list',
    }).then((response)=> {
        
        this.setState({
          availableSectors : response.data
        })
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  selectSector(event){
    event.preventDefault();
    this.setState({[event.target.name]:event.target.value});
    var sector_id = event.target.value.split('|')[1];
    this.handleChange(event);
    this.getAvailableActivity(sector_id);
  }
  getAvailableActivity(sector_id){
    axios({
      method: 'get',
      url: '/api/sectors/'+sector_id,
    }).then((response)=> {
      console.log('response', response.data[0].activity)
        this.setState({
          availableActivity : response.data[0].activity
        },()=>{console.log("availableActivity",this.state.availableActivity)})
    }).catch(function (error) {
      console.log('error', error);
    });
  }
  edit(id){
    console.log('id', id);
    var activity_id = this.props.match.params.activityId;
    var subactivity_id = this.props.match.params.subactivityId;
    console.log('activity_id', activity_id, subactivity_id);
      axios({
        method: 'get',
        url: '/api/sectors/'+id,
      }).then((response)=> {
        var editData = response.data[0];
        console.log('editData', editData);
        // console.log('subActivityName', _.first(editData.activityName.map((a, i)=>{return a._id == activity_id ? (a.subActivityName).map((b, j)=>{return b.subActivityName ? b.subActivityName : "a"}) : ''})));
        this.setState({
          "sector"                : editData.sector+'|'+editData._id,
          "activityName"          : _.first(editData.activity.map((a, i)=>{return a._id == activity_id ? a.activityName : ''}))+'|'+activity_id,
          "subActivityName"       : (_.flatten(editData.activity.map((a, i)=>{return a._id == activity_id ? (a.subActivity).map((b, j)=>{return b._id == subactivity_id ? b.subActivityName : ""}) : ''})))[0],
          "unit"                  : (_.flatten(editData.activity.map((a, i)=>{return a._id == activity_id ? (a.subActivity).map((b, j)=>{return b._id == subactivity_id ? b.unit : ""}) : ''})))[0],
          "familyUpgradation"     : (_.flatten(editData.activity.map((a, i)=>{return a._id == activity_id ? (a.subActivity).map((b, j)=>{return b._id == subactivity_id ? b.familyUpgradation : ""}) : ''})))[0],
        },()=>{
          console.log('this.state', this.state);
        });
      }).catch(function (error) {
    });
  }
  
  getData(startRange, limitRange){
      var data = {
      startRange : startRange,
      limitRange : limitRange
    }
    axios.post('/api/sectors/subactivity/list', data)
    .then((response)=>{
      console.log("response",response.data);
      this.setState({
        tableData : response.data
      });
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  
  getSearchText(searchText, startRange, limitRange){
      this.setState({
          tableData : []
      });
  }
  getToggleValue(event){
    if(this.state.familyUpgradation === "No"){
      this.setState({
        familyUpgradation : "Yes",
      })
    }else if(this.state.familyUpgradation === "Yes"){
      this.setState({
        familyUpgradation : "No",
      })
    }

  }
  componentWillUnmount(){
    this.setState({
      "sector"              :"",
      "activityName"        :"",
      "subActivityName"     :"",
      "unit"                : 0, 
      "familyUpgradation"   :"No",
      "editId" : ""
    })
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
              <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable mt" id="subActivityb">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc ">
                  <span className="perinfotitle mgtpprsnalinfo"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Sub-Activity</span>
                </div>
                <div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Select Sector Name</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="sector" >
                        <select className="custom-select form-control inputBox" ref="sector" name="sector" value={this.state.sector} onChange={this.selectSector.bind(this)}>
                          <option  className="hidden" >--Select Sector--</option>
                          {
                          this.state.availableSectors && this.state.availableSectors.length >0 ?
                          this.state.availableSectors.map((data, index)=>{
                            return(
                              <option key={data._id} value={data.sector+'|'+data._id}>{data.sector}</option>
                            );
                          })
                          :
                          null
                        }
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.sector}</div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Select Activity Name</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="activityName" >
                        <select className="custom-select form-control inputBox"ref="activityName" name="activityName" value={this.state.activityName} onChange={this.handleChange.bind(this)} >
                          <option  className="hidden" >-- Select Activity--</option>
                          {
                          this.state.availableActivity && this.state.availableActivity.length >0 ?
                          this.state.availableActivity.map((data, index)=>{
                            if(data.activityName ){
                              return(
                                <option key={data._id} value={data.activityName+'|'+data._id}>{data.activityName}</option>
                              );
                            }
                          })
                          :
                          null
                        }
                        </select>
                      </div>
                      <div className="errorMsg">{this.state.errors.activityName}</div>
                    </div>

                    <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Name of Sub-Activity</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="subActivityName" >
                        {/*<div className="input-group-addon inputIcon">
                          <i className="fa fa-graduation-cap fa"></i>
                        </div>*/}
                        <input type="text" className="form-control inputBox nameParts" ref="subActivityName" name="subActivityName" value={this.state.subActivityName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                      </div>
                      <div className="errorMsg">{this.state.errors.subActivityName}</div>
                    </div>
                    <div className=" col-md-12 col-sm-6 col-xs-12 ">
                     
                    </div>
                  </div> 
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                     <div className=" col-md-4 col-sm-6 col-xs-12 ">
                      <label className="formLable">Unit</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="unit" >
                        <input type="text" className="form-control inputBox nameParts" ref="unit" name="unit" value={this.state.unit} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                      </div>
                      <div className="errorMsg">{this.state.errors.unit}</div>
                    </div>
                    <div className=" col-lg-4 col-md-4 col-sm-6 col-xs-12 " >
                      <label className="formLable">Family Upgradation</label><span className="asterix">*</span>
                       <div className="can-toggle genderbtn demo-rebrand-2 " onChange={this.getToggleValue.bind(this)}>
                          <input id="d" type="checkbox"/>
                          <label className="formLable" htmlFor="d">
                          <div className="can-toggle__switch" data-checked="Yes"  data-unchecked="No" ></div>
                            <div className="can-toggle__label-text"></div>
                          </label>
                        </div>
                    </div>
                  </div> 
                </div><br/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                  {
                    this.state.editId ? 
                    <button className=" col-lg-2 btn submit pull-right" onClick={this.updateSubActivity.bind(this)}> Update </button>
                    :
                    <button className=" col-lg-2 btn submit pull-right" onClick={this.submitSubActivity.bind(this)}> Submit </button>
                  }
                </div> 
              </form>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                <IAssureTable 
                  tableHeading={this.state.tableHeading}
                  twoLevelHeader={this.state.twoLevelHeader} 
                  dataCount={this.state.dataCount}
                  tableData={this.state.tableData}
                  getData={this.getData.bind(this)}
                  tableObjects={this.state.tableObjects}
                  getSearchText={this.getSearchText.bind(this)}
                />
              </div>              
            </div>
          </div>
      </div>
    );

  }

}
export default withRouter(SubActivity);