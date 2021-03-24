import React, { Component } from 'react';
import { render }           from 'react-dom';
// import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
// import 'rc-time-picker/assets/index.css';

import './Typemaster.css';

const format = "h:mm a";
class Typemaster extends Component{
  constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          pageType: "Page Type",
          actions: 'Action',
      },
      "tableHeading1": {
          blockType: "Block Type",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/typemaster/',
          paginationApply: false,
          searchApply: false,
          editUrl: '/cms/Typemaster'
      },
      "tableObjects1": {
          deleteMethod: 'delete',
          apiLink: '/api/blocktypemaster/',
          paginationApply: false,
          searchApply: false,
          editUrl: '/cms/Typemaster'
      },
      "startRange": 0,
      "limitRange": 10,
      "fields" : {
        placeholder : "Enter page type..",
        title       : "Page Type",
        api         : "/api/fuelType/",
        attributeName : "pageType"
      },
      "fields1" : {
        placeholder : "Enter block type..",
        title       : "Block Type",
        api         : "/api/fuelType/",
        attributeName : "blockType"
      }
    };
  }
  
  render(){
    return(
          <div className="container-fluid">
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 TypemasterDisplayForm">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
              
                  <OneFieldForm fields={this.state.fields}
                              tableHeading={this.state.tableHeading}
                              tableObjects={this.state.tableObjects}
                              editId ={this.props.editId}
                              masterFieldForm = {true}
                              history={this.props.history} />

                </div>
                <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">

                  <OneFieldForm fields={this.state.fields1}
                              tableHeading={this.state.tableHeading1}
                              tableObjects={this.state.tableObjects1}
                              editId ={this.props.editId}
                              masterFieldForm = {true}
                              history={this.props.history} />
              </div>
              </div>
            </div> 
          </div>     
    );
  }
 }

 export default Typemaster;