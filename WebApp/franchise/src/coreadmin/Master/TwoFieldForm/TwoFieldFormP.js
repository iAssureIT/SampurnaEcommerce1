import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import _                        from 'underscore';
import 'bootstrap/js/tab.js';
var apiLink = "";
var apiLink2 = "";
class TwoFieldForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "user_ID"              : "",
            "secondField"          : "",
            "secondFieldData"      : [], 
            "selectedIndex"        : "",
            "startRange"           : 0,
            "limitRange"           : 10,
             "editId"              :  ''
        };
    }
    componentDidMount() {
        apiLink =  this.props.tableObjects.apiLink;
        apiLink2 =  this.props.tableObjects.apiLink2;
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
            console.log("element",element);
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
            console.log("nextProps",nextProps)

        }
        else{
            this.setState({
                attributeName                              : "",
                [this.props.fields.secondAttributeName]    : "-- Select --"
            })
            console.log("nextProps",nextProps)


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
        });
    }
    submitType(event) {
        event.preventDefault();
        var formValues ={ 
            "dropdownID"       : this.state.selectedIndex,
            "fieldValue"       : this.state.attributeName,
            "createdBy"        : this.state.user_ID
        }
     if ($('#twoFieldFormValid').valid()) {

        axios.post(apiLink+'post', formValues)
            .then((response) => {
                if (response.data.created) {
                    swal(this.state.attributeName+" submitted Successfully");
                    this.getData(this.state.startRange, this.state.limitRange);
                    this.setState({
                       attributeName    : "",
                       [this.props.fields.secondAttributeName]            : "-- Select --"
                     })

                }else{
                    swal(this.state.attributeName+" already exist");
                }
            })
            .catch((error) => {
                
            })
     }
      
    }
    updateType(event) {
        event.preventDefault();
        var formValues ={
                "fieldID"       : this.state.fieldId,
                "dropdownID"    : this.state.selectedIndex,
                "fieldValue"    : this.state.attributeName,
            }
        if ($('#twoFieldFormValid').valid()) {
            axios.patch(apiLink+'/patch', formValues)
                .then((response) => {
                    this.setState({
                        attributeName: "",
                        editId: "",
                        [this.props.fields.secondAttributeName]            : "-- Select --"
                    },()=>{
                    console.log("Here")
                        if(!this.state.editId)
                        {
                            this.props.history.push(this.props.tableObjects.editUrl);
                            this.setState({
                                attributeName                              : "",
                                [this.props.fields.secondAttributeName]    : "-- Select --"
                             })
                        }
                        swal("Record updated Successfully");

                    })

                    this.getData(this.state.startRange, this.state.limitRange);
                    swal(response.data.message);
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
        axios.post(apiLink+'get/list', data)
            .then((response) => {
                this.setState({
                    tableData: response.data
                })
                console.log("tableData---",this.state.tableData);

            })
            .catch((error) => {
                
            });
    }
    getSecondFieldData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(apiLink2+'/get/list', data)
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

        axios.get(apiLink+'/get/one/' + id)
            .then((response) => {

                if (response.data) {
                    axios.get(apiLink2+'/get/one/' + response.data[secondAttributeId])
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
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.props.fields.secondtitle}</h4>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="twoFieldFormValid" >
                                                <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls" >
                                                    <div id="selectField" >
                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.title} <i className="astrick">*</i></label>
                                                        <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[this.props.fields.secondAttributeName]} data_name ="selectField" name={this.props.fields.secondAttributeName} onChange={this.handleSelect.bind(this)} required>
                                                            <option selected={true} disabled={true}>-- Select --</option>
                                                            {
                                                            this.state.secondFieldData && this.state.secondFieldData.length > 0 ?
                                                              this.state.secondFieldData.map((data, index)=>{
                                                                return(
                                                                    <option id={data._id}>{data[this.props.fields.secondAttributeName]}</option>
                                                                );
                                                              })
                                                            :
                                                            null
                                                            }
                                                           
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-margin col-lg-6  col-md-6 col-sm-12 col-xs-12 pdcls">
                                                    <div  id="textFieldOne">
                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.secondtitle} <i className="astrick">*</i></label>
                                                        <input type="text"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.attributeName} ref={this.props.fields.attributeName} name="attributeName" onChange={this.handleChange.bind(this)} placeholder={this.props.fields.placeholder} required />
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
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <IAssureTable
                                                tableHeading={this.props.tableHeading}
                                                twoLevelHeader={this.state.twoLevelHeader}
                                                dataCount={this.state.dataCount}
                                                tableData={this.state.tableData}
                                                getData={this.getData.bind(this)}
                                                tableObjects={this.props.tableObjects}
                                            />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

        );
    }
}
export default TwoFieldForm;

