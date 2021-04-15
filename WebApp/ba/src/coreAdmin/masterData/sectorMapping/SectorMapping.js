import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';

import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import "./SectorMapping.css";

class SectorMapping extends Component{
  
  constructor(props){
    super(props);
   
    this.state = {
      "goalName"      :"",
      "goalType"      :"",
      "sector"        :"",
      "activity"      :"",
      "uID"           :"",
      fields          : {},
      errors          : {},
      "tableHeading"  : {
        type          : "Type of Goal/Project",
        goal          : "Goal /Project Name",
        sector        : "Sector",
        activity      : "Activity", //to be Changes
        actions       : 'Action',
      },
      "tableObjects"  : {
        apiLink       : '/api/sectorMappings/',
        editUrl       : '/sector-mapping/'
      },
     
      "startRange"    : 0,
      "limitRange"    : 10,
/*      "editId"              : this.props.match.params ? this.props.match.params.id : ''
*/    }
/*    console.log('params', this.props.match.params);*/ 
  }

 
  handleChange(event){
    event.preventDefault();
    this.setState({
      "goalName"   : this.refs.goalName.value,          
      "goalType"   : this.refs.goalType.value,          
    /*  "sector"     : this.refs.sector.value,          
      "activity"   : this.refs.activity.value,  */        
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
  Submit(event){
    event.preventDefault();
    var sectorMappingArray=[];
    var id2 = this.state.uID;
    if (this.validateFormReq() && this.validateForm()) {
    var mappingValues= 
    {     
      "goal"   : this.refs.goalName.value,          
      "type"   : this.refs.goalType.value,          
     /* "sector" : [{
            "sector_ID"            :this.refs.sector.value.split('|')[1],
            "sectorName"           :this.refs.sectorName.value.split('|')[0],
            "activity_ID"          :this.refs.activity.value.split('|')[1],
            "ActivityName"         :this.refs.ActivityName.value.split('|')[0],
          }],                   */
    };
    let fields = {};
    fields["goalName"]  = "";
    fields["goalType"]  = "";
    fields["sector"]    = "";
    fields["activity"]  = "";
    
    axios.post('/api/sectorMappings',mappingValues)
      .then(function(response){
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      this.setState({
        "goalName"  :"",
        "goalType"  :"",
        "sector"    :"",
        "activity"  :"",
        fields      :fields
      });
    }  
  }
  Update(event){
    event.preventDefault();
    if(this.refs.goalName.value == "" || this.refs.goalType.value =="")
   {
      if (this.validateFormReq() && this.validateForm()){
      }
    }else{
    var id2 = this.state.uID;
    var mappingValues= 
    {     
      "sectorMapping_ID"    :this.refs.editId.value,
      "goal"                :this.refs.goalName.value,
      "type"                : this.refs.goalType.value,          
      /*"sector" : [{
            "sector_ID"            :this.refs.sector.value.split('|')[1],
            "sectorName"           :this.refs.sectorName.value.split('|')[0],
            "activity_ID"          :this.refs.activity.value.split('|')[1],
            "ActivityName"         :this.refs.ActivityName.value.split('|')[0],
          }],                   */
    };
    let fields = {};
    fields["goalName"]  = "";
    fields["goalType"]  = "";
    fields["sector"]    = "";
    fields["activity"]  = "";
    
    axios.patch('/api/sectorMappings/update',mappingValues)
      .then(function(response){
        swal({
          title : response.data.message,
          text  : response.data.message
        });
        this.getData(this.state.startRange, this.state.limitRange);
      })
      .catch(function(error){
        console.log("error = ",error);
      });
      this.setState({
        "goalName"  :"",
        "goalType"  :"",
        "sector"    :"",
        "activity"  :"",
        fields      :fields
      });
    }  
  }
  validateFormReq() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
      if (!fields["goalName"]) {
        formIsValid = false;
        errors["goalName"] = "This field is required.";
      }     
      if (!fields["goalType"]) {
        formIsValid = false;
        errors["goalType"] = "This field is required.";
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
      url: '/api/sectorMappings/list',
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
      url: '/api/sectorMappings'+id,
    }).then((response)=> {
      var editData = response.data[0];
      console.log('editData',editData);
      
      this.setState({
        "goalName"    :editData.goal,        
        "goalType"    :editData.type,      
        "sector"      :editData.sector, 
        "activity"    :editData.activity,
      },()=>{
        
      });
    }).catch(function (error) {
    });
  }
  
  getData(startRange, limitRange){
    axios({
      method: 'get',
      url: '/api/sectorMappings/list',
    }).then((response)=> {
        this.setState({
        tableData : response.data,
      });
    }).catch(function (error) {
        console.log('error', error);
    });
  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  selectActivity(event){
    var selectedActivity = this.state.selectedActivity;

    var value = event.target.checked;
    var id    = event.target.id;

    this.setState({
      [id] : value
    },()=>{
      // console.log('village', this.state[id], id);
      if(this.state[id] == true){
        selectedActivity.push({
          district  : this.refs.districtCovered.value,
          block     : this.refs.blockCovered.value,
          village   : id
        });
        this.setState({
          selectedActivity : selectedActivity
        });
        console.log('selectedActivity', selectedActivity);
      }else{
        var index = selectedActivity.findIndex(v => v.village === id);
        // console.log('index', index);
        selectedActivity.splice(selectedActivity.findIndex(v => v.village === id), 1);
        this.setState({
          selectedActivity : selectedActivity
        },()=>{
          // console.log('selectedActivity',this.state.selectedActivity);
        });
      }
    });      
  }



  render() {
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Master Data                                        
                      </div>
                    <hr className="hr-head container-fluid row"/>
                  </div>
                  <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable" id="sectorMapping">                   
                    <div className="col-lg-12 ">
                       <h4 className="pageSubHeader">Sector Mapping</h4>
                    </div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                        <div className=" col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="formLable">Type of Goal/Project</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main" id="goalType" >
                            <select className="custom-select form-control inputBox" ref="goalType" name="goalType" value={this.state.goalType} onChange={this.handleChange.bind(this)}>
                              <option  className="hidden" >-- Select --</option>
                              <option>SDG Goal</option>
                              <option>ADP Goal</option>
                              <option>Empowerment Line Goal</option>
                              <option>Project Name</option>
                            </select>
                          </div>
                          <div className="errorMsg">{this.state.errors.goalType}</div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                          <label className="formLable">Enter Goal / Project Name</label><span className="asterix">*</span>
                          <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="goalName" >
                            {/*<div className="input-group-addon inputIcon">
                              <i className="fa fa-graduation-cap fa"></i>
                            </div>*/}
                            <input type="text" className="form-control inputBox" value={this.state.goalName} onChange={this.handleChange.bind(this)} onKeyDown={this.isTextKey.bind(this)}  placeholder="" name="goalName" ref="goalName" />
                          </div>
                          <div className="errorMsg">{this.state.errors.goalName}</div>
                        </div>
                        <div className=" col-md-12 col-sm-6 col-xs-12 ">
                         
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 "><label className="fbold">Please Select Activities to be mapped with above {this.state.goalType}</label></div>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv  mt">
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Natural Resource Management</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Agriculture Development</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            <div className="col-lg-12 noPadding">  
                              <div className="actionDiv">
                                <div className="SDGContainer col-lg-1">
                                  <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                </div>
                              </div>                            
                              <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                                <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                        <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Animal Husbandry</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                            <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="row">
                      <div className=" col-lg-12 col-sm-12 col-xs-12 formLable htDiv  ">
                        <div className=" col-md-4  col-lg-4 col-sm-6 col-xs-12 ">
                          <label className="formLable faintCoolor">Natural Resource Management</label>
                         <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                         <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Agriculture Development</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                         <div className=" col-md-4  col-lg-4 col-sm-12 col-xs-12 ">
                          <label className="formLable faintCoolor">Animal Husbandry</label>
                          <div className="col-lg-12 col-sm-12 col-xs-12 mt">
                             <div className="row"> 
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                             <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                              <div className="col-lg-12 noPadding">  
                               <div className="actionDiv">
                                  <div className="SDGContainer col-lg-1">
                                    <input type="checkbox" name="check1" id="sameCheck" />
                                  <span className="SDGCheck"></span>
                                  </div>
                                </div>                            
                                <label className="listItem"> Water Resource Development </label>
                              </div>
                            </div>  
                          </div>
                        </div>
                      </div> 
                    </div><br/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      {
                        this.state.editId ? 
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Update.bind(this)}> Update </button>
                        :
                        <button className=" col-lg-2 btn submit mt pull-right" onClick={this.Submit.bind(this)}> Submit </button>
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
export default SectorMapping