import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import TwoFieldForm             from '../TwoFieldForm/TwoFieldForm.js';

import _ from 'underscore';
import 'bootstrap/js/tab.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
class CityClassification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oneFields : {
                placeholder : "Add Your City Type & press 'Enter' Key",
                title       : "City Type",
                attributeName : "cityType"
            },
            "oneTableHeading": {
                cityType: "City Type",
                actions: 'Action',
            },
            "oneTableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/citytypemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/city-classification/city-type',
                editUrl1: '/city-classification'
            },

            "fields" : {
                placeholder          : "Enter city name..",
                title                : "City Name",
                secondtitle          : "City Type",
                attributeName        : "cityName",
                secondAttributeId    : "cityTypeId",
                secondAttributeName  : "cityType"
            },
            "tableHeading": {
                cityType    : "City Type",
                cityName    : "City Name",
                actions     : 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink  :'/api/citynamemaster/',
                apiLink2 :'/api/citytypemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/city-classification'
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            "oneeditId": this.props.match.params ? this.props.match.params.fieldID1 : ''

        };
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
                                                    <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 active">
                                                        <a className="tabLeft lettersp tablefthr" href="/city-classification" >City Classification</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">
                                                <div className="tab-pane" id="Category">
                                                </div>
                                                <div className="tab-pane" id="FuleType"></div>                              
                                                <div className="tab-pane" id="PurposeOfTravel"></div>                              
                                                <div className="tab-pane" id="DocumentListMaster"></div>                              
                                                <div className="tab-pane" id="Model"></div>                              
                                                <div className="tab-pane" id="PurposeOfTravel"></div>                     
                                                <div className="tab-pane" id="ExpenseTypeMaster"></div>                              
                                                <div className="tab-pane" id="Department"></div>                              
                                                <div className="tab-pane" id="Designation">  </div>                         
                                                <div className="tab-pane active" id="cityName">
                                                    <TwoFieldForm    
                                                        fields={this.state.fields}
                                                        tableHeading={this.state.tableHeading}
                                                        tableObjects={this.state.tableObjects}
                                                        editId ={this.props.match.params.fieldID}
                                                        history={this.props.history} 
                                                        oneFields={this.state.oneFields}
                                                        oneTableHeading={this.state.oneTableHeading}
                                                        oneTableObjects={this.state.oneTableObjects}
                                                        oneeditId ={this.props.match.params.fieldID1}
                                                     />
                                                </div>                                
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            /*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <TwoFieldForm fields={this.state.fields}
                          tableHeading={this.state.tableHeading}
                          tableObjects={this.state.tableObjects}
                          editId ={this.props.match.params.fieldID}
                          history={this.props.history} />

            </div>*/
        );
    }
}
export default CityClassification;

