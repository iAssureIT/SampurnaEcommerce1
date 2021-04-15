import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import _                        from 'underscore';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import { withRouter }           from 'react-router-dom';
// import DocumentEntityMaster     from '../../../projectadmin/DocumentRequiredfor/DocumentEntityMaster.js';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';
import BulkUpload               from "../BulkUpload/BulkUpload.js";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import './TwoFieldForm.css'

class TwoFieldForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "user_ID"              : "",
            "secondField"          : "",
            "secondFieldData"      : [], 
            "selectedIndex"        : "",
            "startRange"           : 0,
            "limitRange"           : 10000,
             "editId"              :  ''
        };
    }
    componentDidMount() {
        console.log("props two field form = ", this.props);
        // console.log("this.props.oneTableObjects two form field oneeditId = ", this.props.oneeditId);
        const user_ID = localStorage.getItem("user_ID")
        this.setState({
            user_ID : user_ID,
        })
        this.getData(this.state.startRange, this.state.limitRange);
        this.getSecondFieldData(this.state.startRange, this.state.limitRange);
        
        $.validator.addMethod("regxonefield", function (value, element, regexpr) {
          return regexpr.test(value);
        }, "Please enter valid field value");
        
        jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });
        $("#twoFieldFormValid").validate({
        rules: {
            selectField: {
              required: true,
            },
            textFieldOne: {
              regxonefield  :/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/,
              required: true,
            },
        },
        errorPlacement: function (error, element) {
            // console.log("element",element);
            if (element.attr("data_name") === "selectField") {
              error.insertAfter("#selectField");
            }
            if (element.attr("name") === "attributeName") {
              error.insertAfter("#textFieldOne");
            }
          }
        });
    }
   
    componentWillReceiveProps(nextProps) {
        if(nextProps.editId)
        {
            this.edit(nextProps.editId);
            // console.log("nextProps",nextProps)
        }
        else{
            this.setState({
                attributeName                              : "",
                [this.props.fields.secondAttributeName]    : "-- Select --"
            })
            // console.log("nextProps",nextProps)
        }
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            attributeName : event.target.value
        });
    }
    handleSelect(event){
        event.preventDefault();
        const target = event.target;
        var index = event.target.selectedIndex
        const id = event.target.options[index].id;

        const name = target.name;
        this.setState({
            [name] : event.target.value,
            "selectedIndex" : id,
        },()=>{console.log("selectedIndex = ",this.state.selectedIndex);});
    }
    submitType(event) {
        event.preventDefault();

        var formValues ={ 
            "dropdownID"       : this.state.selectedIndex,
            "fieldValue"       : this.state.attributeName,
            "createdBy"        : this.state.user_ID
        }
     if ($('#twoFieldFormValid').valid()) {
        var postapiurl = this.props.tableObjects.apiLink+"post";
        // console.log("postapiurl = ", postapiurl);
        axios.post(postapiurl, formValues)
            .then((response) => {
                console.log("response = ", response.data);

                if (response.data.created) {
                    swal(" ",this.state.attributeName+" submitted Successfully");
                    this.getData(this.state.startRange, this.state.limitRange);
                    this.setState({
                       attributeName    : "",
                       [this.props.fields.secondAttributeName]            : "-- Select --"
                     })

                }else{
                    swal(" ",this.state.attributeName+" already exist");
                }
            })
            .catch((error) => {
                console.log("Error in Post API of Two field = ",error);
            })
     }      
    }
    updateType(event) {
        event.preventDefault();
        console.log("In Update two field this.props = ",this.props);
        var formValues ={
                "fieldID"       : this.state.fieldId,
                "dropdownID"    : this.state.selectedIndex,
                "fieldValue"    : this.state.attributeName,
            }
            console.log("In Update two field formValues = ",formValues);
        if ($('#twoFieldFormValid').valid()) {
            axios.patch(this.props.tableObjects.apiLink+'patch', formValues)
                .then((response) => {
                    this.setState({
                        attributeName: "",
                        editId: "",
                        [this.props.fields.secondAttributeName]            : "-- Select --"
                    },()=>{
                    // console.log("Here")
                        if(!this.state.editId)
                        {
                            // this.props.history.push(this.props.tableObjects.editUrl);
                            this.setState({
                                attributeName                              : "",
                                [this.props.fields.secondAttributeName]    : "-- Select --"
                             })
                        }
                        swal(" ","Record updated Successfully");

                    })

                    this.getData(this.state.startRange, this.state.limitRange);
                    swal(" ",response.data.message);
                })
                .catch((error) => {
                })
        }       
    }
    getDataCount() {
        axios.get('/api/vendorLocationType/get/count')
            .then((response) => {
                this.setState({
                    dataCount: response.data.dataCount
                })
            })
            .catch((error) => {
                
            });
    }
    getData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(this.props.tableObjects.apiLink+'get/list', data)
            .then((response) => {
                // console.log("response---",response);
                this.setState({
                    tableData: response.data
                })
            })
            .catch((error) => {          
            });
    }
    getSecondFieldData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(this.props.tableObjects.apiLink2+'get/list', data)
            .then((response) => {
                this.setState({
                    secondFieldData: response.data,
                    secondFieldId: response.data._id
                })
            })
            .catch((error) => {         
            });
    }
    edit(id) {
        var fieldName = this.props.fields.attributeName;
        var secondAttributeId = this.props.fields.secondAttributeId;
        var secondAttributeName = this.props.fields.secondAttributeName;

        axios.get(this.props.tableObjects.apiLink+'get/one/' + id)
            .then((response) => {
                if (response.data) {
                    axios.get(this.props.tableObjects.apiLink2+'get/one/' + response.data[secondAttributeId])
                        .then((response) => {
                           if (response.data) {
                                this.setState({
                                    [this.props.fields.secondAttributeName] : response.data[this.props.fields.secondAttributeName],
                                    "selectedIndex"     : response.data._id
                                });
                            }
                        })
                    .catch((error) => {
                    });
                    this.setState({
                        "attributeName"     : response.data[fieldName],
                        "fieldId"           : response.data._id
                    });
                }
            })
        .catch((error) => {
        });
    }
    handleChangePlaces = address => {
      var array = {
          attributeName    : address,
       }
    this.setState({ attributeName : address, tripArray : array });
    };
    handleSelectLocation = address => {
        console.log(address)
    geocodeByAddress(address)
     .then((results) =>{ 

      for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
              switch (results[0].address_components[i].types[b]) {
                  case 'sublocality_level_1':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'sublocality_level_2':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'locality':
                      var city = results[0].address_components[i].long_name;
                      break;
                  case 'administrative_area_level_1':
                      var state = results[0].address_components[i].long_name;
                      break;
                  case 'country':
                     var country = results[0].address_components[i].long_name;
                      break;
                  case 'postal_code':
                     var pincode = results[0].address_components[i].long_name;
                      break;
              }
          }
        }
    })
    .catch(error => console.error('Error', error));
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'fromLatLng': latLng}))
      .catch(error => console.error('Error', error));
      var array = {
          attributeName    : address,
        }
        console.log("address",address)
      this.setState({ attributeName : address ? address.split(",")[0] :"" , tripArray : array });
    };


    render() {
      const searchOptions = {
          types: ['(cities)'],
          componentRestrictions: {country: "in"}
        }
        var bulkReq = this.props.bulkRequired ? true : false 
        return (
            <div className="row">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                    <h4 className="weighttitle col-lg-9 col-md-9 col-xs-12 col-sm-12 NOpadding-right">{this.props.fields.title === "Location Type"? this.props.fields.title+"s" : this.props.fields.title } </h4>
                    {
                        this.props.twofieldBulkRequired ?
                            <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center">
                                    <a className="fieldTab" data-toggle="tab" href=".manual">Manual</a>
                                </li>
                                <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center">
                                    <a className="fieldTab" data-toggle="tab" href=".bulk">Bulk Upload</a>
                                </li>
                            </ul>
                        : null 
                    }
                </div>
                {   
                    this.props.oneFields ?  

                        <div className="modal" id="addOneField" role="dialog">
                          <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                    <button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
                               </div>
                              </div>
                            <div className="modal-body adminModal-body OneFieldModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <OneFieldForm fields={this.props.oneFields}
                                    tableHeading={this.props.oneTableHeading}
                                    tableObjects={this.props.oneTableObjects}
                                    editId ={this.props.oneeditId}
                                    getSecondFieldData={this.getSecondFieldData.bind(this)}
                                    bulkRequired = {bulkReq}
                                    masterFieldForm = {true}

                                    url ={this.props.onefieldurl}
                                    fileurl ={this.props.onefieldfileurl}
                                    data ={this.props.data}
                                    uploadedData ={this.props.oneFielduploadedData}
                                    getFileDetails ={this.props.getOneFieldFileDetails}
                                    fileDetails ={this.props.oneFieldfileDetails}
                                    goodRecordsHeading ={this.props.oneFieldgoodRecordsHeading}
                                    failedtableHeading ={this.props.oneFieldfailedtableHeading}
                                    failedRecordsTable ={this.props.oneFieldfailedRecordsTable}
                                    failedRecordsCount ={this.props.oneFieldfailedRecordsCount}
                                    goodRecordsTable ={this.props.oneFieldgoodRecordsTable}
                                    goodDataCount ={this.props.oneFieldgoodDataCount}
                                  // history={this.props.history}
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
                    :null
                }
                <section className="Content">
                    <div className="row tab-content">
                        <div id="manual" className="tab-pane fade in manual active mt">
                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="twoFieldFormValid" >
                                {
                                    this.props.oneFields ? 
                                        <div className="form-margin form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls" >
                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.secondtitle} <i className="astrick">*</i></label>
                                            <div className="input-group" id="selectField" >
                                                <select className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[this.props.fields.secondAttributeName]} data_name ="selectField" name={this.props.fields.secondAttributeName} onChange={this.handleSelect.bind(this)} required>
                                                    <option selected={true} disabled={true}>-- Select --</option>
                                                    {
                                                    this.state.secondFieldData && this.state.secondFieldData.length > 0 ?
                                                      this.state.secondFieldData.map((data, index)=>{
                                                        return(
                                                            <option key={index} id={data._id}>{data[this.props.fields.secondAttributeName]}</option>
                                                        );
                                                      })
                                                    :
                                                    null
                                                    }
                                                   
                                                </select>
                                                <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"  data-target="#addOneField" title={"Add "+this.props.fields.secondtitle} ><i className="fa fa-plus "></i>
                                                </div>
                                               
                                            </div>
                                        </div>
                                    :
                                    <div className="form-margin form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls" >
                                        <div className="" id="selectField" >
                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.secondtitle} <i className="astrick">*</i></label>
                                            <select className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[this.props.fields.secondAttributeName]} data_name ="selectField" name={this.props.fields.secondAttributeName} onChange={this.handleSelect.bind(this)} required>
                                                <option selected={true} disabled={true}>-- Select --</option>
                                                {
                                                this.state.secondFieldData && this.state.secondFieldData.length > 0 ?
                                                  this.state.secondFieldData.map((data, index)=>{
                                                    return(
                                                        <option  key={index} id={data._id}>{data[this.props.fields.secondAttributeName]}</option>
                                                    );
                                                  })
                                                :
                                                null
                                                }
                                               
                                            </select>
                                        </div>
                                    </div>
                                }

                                <div className="form-margin col-lg-6  col-md-6 col-sm-12 col-xs-12 pdcls">
                                    <div  id="textFieldOne">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.title} <i className="astrick">*</i></label>
                                         {this.props.fields.secondtitle == "City Name" ?
                                                        <PlacesAutocomplete
                                                            value={this.state.attributeName}
                                                            onChange={this.handleChangePlaces}
                                                            onSelect={this.handleSelectLocation}
                                                            searchOptions={searchOptions}

                                                          >
                                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                              <div>
                                                                <input
                                                                  {...getInputProps({
                                                                    placeholder: 'Search cities ...',
                                                                    className: 'location-search-input col-lg-12 form-control',
                                                                  })}
                                                                />
                                                                <div className="autocomplete-dropdown-container">
                                                                  {loading && <div>Loading...</div>}
                                                                  {suggestions.map(suggestion => {
                                                                    const className = suggestion.active
                                                                      ? 'suggestion-item--active'
                                                                      : 'suggestion-item';
                                                                    // inline style for demonstration purpose
                                                                    const style = suggestion.active
                                                                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                    return (
                                                                      <div
                                                                        {...getSuggestionItemProps(suggestion, {
                                                                          className,
                                                                          style,
                                                                        })}
                                                                      >
                                                                        {/*<span>{suggestion.description}</span>*/}
                                                                    <span>{(suggestion.description ? suggestion.description.split(",")[0]:"")}</span>

                                                                      </div>
                                                                    );
                                                                  })}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </PlacesAutocomplete>
                                                          :
                                                        <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.attributeName} ref={this.props.fields.attributeName} name="attributeName" onChange={this.handleChange.bind(this)} placeholder={this.props.fields.placeholder} required />
                                                      }
                                    </div>
                                </div>
                                <br />
                                <div className="form-margin col-lg-6 col-lg-offset-6 col-md-6 col-sm-12 col-xs-12">

                                    {this.props.editId ?
                                        <button onClick={this.updateType.bind(this)} className="btn button3 pull-right">Update</button>
                                        :
                                        <button onClick={this.submitType.bind(this)} className="btn button3 pull-right">Submit</button>
                                    }
                                </div>
                            </form> 
                            <div className="oneFieldTable col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable
                                    tableHeading={this.props.tableHeading}
                                    twoLevelHeader={this.state.twoLevelHeader}
                                    dataCount={this.state.dataCount}
                                    tableData={this.state.tableData}
                                    getData={this.getData.bind(this)}
                                    tableObjects={this.props.tableObjects}
                                    getSecondFieldData={this.getSecondFieldData.bind(this)}
                                />
                            </div>
                        </div>
                        <div id="bulk" className="tab-pane fade in bulk col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                            <div className="outerForm">
                                <BulkUpload 
                                    url ={this.props.url}
                                    data ={this.props.data}
                                    uploadedData ={this.props.uploadedData}
                                    fileurl ={this.props.twofieldfileurl}
                                    getFileDetails ={this.props.getTwoFieldFileDetails}
                                    getData={this.getData.bind(this)}
                                    fileDetails ={this.props.fileDetails}
                                    goodRecordsHeading ={this.props.goodRecordsHeading}
                                    failedtableHeading ={this.props.failedtableHeading}
                                    failedRecordsTable ={this.props.failedRecordsTable}
                                    failedRecordsCount ={this.props.failedRecordsCount}
                                    goodRecordsTable ={this.props.goodRecordsTable}
                                    goodDataCount ={this.props.goodDataCount}
                                    />

                            </div>
                        </div>
                    </div>
                </section>
            </div>


        
        );
    }
}
export default TwoFieldForm;

