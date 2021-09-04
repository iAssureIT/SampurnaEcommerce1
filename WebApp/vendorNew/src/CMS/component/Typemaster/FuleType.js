import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';

const format = "h:mm a";
class FuleType extends Component{
   constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          fuelType: "Fuel Type",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/fueltypemaster/',
          paginationApply: false,
          searchApply: false,
          editUrl: '/fuel-type'
      },
      "startRange": 0,
      "limitRange": 10,
      "fields" : {
        placeholder : "Add fuel type & press 'Enter' Key.",
        title       : "Fuel Type",
        api         : "/api/fuelType/",
        attributeName : "fuelType"
      }
    };
  }
  componentDidMount(){
  }
  componentDidMount() {
      var editId = this.props.match.params.fieldID;
      this.setState({
          editId: editId
      })
      var editId = this.props.match.params.fieldID;
      window.scrollTo(0, 0);
  }
   componentWillReceiveProps(nextProps) {
      var editId = nextProps.match.params.fieldID;
      if (nextProps.match.params.fieldID) {
          this.setState({
              editId: editId
          })
      }
  }
 
  render(){
    return(
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
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 active">
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
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
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
                        <div className="tab-pane active" id="FuleType">
                          <OneFieldForm fields={this.state.fields}
                            tableHeading={this.state.tableHeading}
                            tableObjects={this.state.tableObjects}
                            editId ={this.props.match.params.fieldID}
                            masterFieldForm = {true}
                            history={this.props.history} />
                        </div>                              
                        <div className="tab-pane" id="DocumentListMaster"></div>                              
                        <div className="tab-pane" id="ExpenseTypeMaster"></div>                              
                        <div className="tab-pane" id="Model"></div>                                
                        <div className="tab-pane" id="PackageMaster"></div>                              
                        <div className="tab-pane" id="PurposeOfTravel"></div>                     
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

 export default FuleType;