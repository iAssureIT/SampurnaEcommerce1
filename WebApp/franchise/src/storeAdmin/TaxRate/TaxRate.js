import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
// import _                      from 'underscore';
import moment from 'moment';
import 'bootstrap/js/tab.js';
var newDate = new Date();
class TaxRate extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            taxName                        : "",
            "tableHeading"                 : {
                taxName                    : "Tax Name",
                taxRate                    : "Tax Rate",
                effectiveFrom              : "Effective From",
                effectiveTo                : "Effective To",
                actions                    : 'Action',
              },
              "tableObjects"              : {
                deleteMethod              : 'delete',
                apiLink                   : '/api/preference/deleterate',
                paginationApply           : false,
                searchApply               : false,
                editUrl                   : '/taxrate'
              },
              "startRange"                : 0,
              "limitRange"                : 10,
              "effectiveFrom"             : moment(newDate).format('YYYY-MM-DD'),
              "editId"                    : this.props.match.params ? this.props.match.params.id : ''
        };
        
    }
    componentDidMount() {
        // this.getTaxData();
        var editId = this.props.match.params.id;
        // console.log("split = ",editId.split(".")[1]);
        this.getData(this.state.startRange, this.state.limitRange);
        this.getTaxData();
        if(this.props.match.params.id){
            this.edit(editId.split(".")[1]);
        }
        window.scrollTo(0, 0);
        $.validator.addMethod("regxA1", function(value, element, regexpr) {          
        return regexpr.test(value);
        }, "Tax rate should only contain positive number.");
        
        jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
        });
        $("#taxRateMaster").validate({
        rules: {
            taxRate: {
                required: true,
                regxA1: /^[0-9 ][0-9]*$/,
            },
            effectiveFrom: {
                required: true,
            },
            effectiveTo: {
                required: true,
            },
        },
            errorPlacement: function(error, element) {
                if (element.attr("name") === "taxRate"){
                    error.insertAfter("#taxRate");
                }
                if (element.attr("name") === "effectiveFrom"){
                    error.insertAfter("#effectiveFrom");
                }
                if (element.attr("name") === "effectiveTo"){
                    error.insertAfter("#effectiveTo");
                }
            }
        });
    }  
    
    componentWillReceiveProps(nextProps) {
        this.getTaxData();
        var editId = nextProps.match.params.id;
        if(nextProps.match.params.id){
          this.setState({
            editId : editId
          })
          this.edit(editId.split(".")[1]);
        }
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });   
    }
    submit(event){
        event.preventDefault();
        var formValues = {
            "preferenceID" : this.state.taxData && this.state.taxData.length>0? this.state.taxData[0]._id : 'Tax',
            "taxDetails"   : {
                "taxRate"         : this.state.taxRate,
                "effectiveFrom"   : this.state.effectiveFrom,
                "effectiveTo"     : this.state.effectiveTo,
            }
        }
        // console.log('formValues', formValues);
        if($("#taxRateMaster").valid()){
            axios.patch('/api/preference/postrate', formValues)
            .then((response)=>{
                this.getData(this.state.startRange, this.state.limitRange);
                swal(response.data.message);
                this.setState({
                    taxName         : "",
                    taxRate         : "",
                    effectiveFrom   : moment(newDate).format('YYYY-MM-DD'),
                    effectiveTo     : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    update(event){
        event.preventDefault();
        var formValues = {
            "preferenceID"  : this.state.editId.split(".")[0],
            "taxRateID"     : this.state.editId.split(".")[1],
            "taxRate"       : this.state.taxRate,
            "effectiveFrom" : this.state.effectiveFrom,
            "effectiveTo"   : this.state.effectiveTo,
        }
        console.log("Update Formvalues = ", formValues);
        if($("#taxRateMaster").valid()){
            axios.patch('/api/preference/patchrate', formValues)
            .then((response)=>{
                this.props.history.push('/taxrate');
                swal(response.data.message);
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    editId          : "",
                    taxName         : "",
                    taxRate         : "",
                    effectiveFrom   : moment(newDate).format('YYYY-MM-DD'),
                    effectiveTo     : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    getDataCount(){
        axios.get('/api/preference/get/list')
        .then((response)=>{
          this.setState({
            dataCount : response.data[0].taxDetails.length
          })
        })
        .catch((error)=>{
          console.log('error', error);
        });
    }
    getData(startRange, limitRange){
        var data={
            startRange : startRange,
            limitRange : limitRange
        }
        axios.patch('/api/preference/get/list', data)
        .then((response)=>{
            this.getDataCount();
            var taxName = response.data[0].taxName;
            var id = response.data[0]._id;
            var tableData = response.data[0].taxDetails.map((a, i)=>{
                return {
                    _id             : id+"."+a._id,
                    taxName         : taxName,
                    taxRate         : (a.taxRate).toString(),
                    effectiveFrom   : a.effectiveFrom ? moment( a.effectiveFrom).format('DD-MMM-YYYY') : "-",
                    effectiveTo     : a.effectiveTo ? moment( a.effectiveTo).format('DD-MMM-YYYY') : "-"
                }
            })
            // console.log('table', tableData);
            this.setState({
                tableData : tableData
            });
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
    getTaxData(){
        axios.get('/api/preference/get/list')
        .then((response)=>{
            this.setState({
                taxData : response.data
            })
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
    edit(id){
        $("#taxRateMaster").validate().resetForm();
        axios.get('/api/preference/get/onerate/'+id)
        .then((response)=>{
            console.log('edit response = ', response.data);
            var editData =  response.data.taxDetails.filter(a=>a._id === this.props.match.params.id.split(".")[1])
            console.log("editData = ",editData);
            this.setState({
                "taxName"                  : response.data.taxName,
                "taxRate"                  : editData[0].taxRate,
                "effectiveFrom"            : moment(editData[0].effectiveFrom).format("YYYY-MM-DD"),
                "effectiveTo"              : moment(editData[0].effectiveTo).format("YYYY-MM-DD")
            });
            // moment(selectedDate1).subtract(1, "days").format("YYYY-MM-DD")
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
    render() {
        var minEffectiveTo = moment(this.state.effectiveFrom).add(1, "days").format('YYYY-MM-DD');
        // console.log(minEffectiveTo);
        return (
            <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section className="content">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                            <div className="row">
                                <div className="">
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 paddingZeroo">
                                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                            <h4 className="">Tax Rate Master</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" id="taxRateMaster">
                                                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12"> 
                                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Tax Name <i className="astrick">*</i></label>
                                                    <div className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 textAlignLeft">
                                                        <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.state.taxData && this.state.taxData.length>0? this.state.taxData[0].taxName : 'Tax'}</label>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12"> 
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Tax Rate (%) <i className="astrick">*</i></label>
                                                    <input type="number" min="1" max="99" id="taxRate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.taxRate}  ref="taxRate" name="taxRate" onChange={this.handleChange.bind(this)} placeholder="Enter tax rate.." required/>
                                                </div>
                                                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12"> 
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Effective From<i className="astrick">*</i></label>
                                                    <input type="date" id="effectiveFrom" min={moment().format('YYYY-MM-DD')} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.effectiveFrom}  ref="effectiveFrom" name="effectiveFrom" onChange={this.handleChange.bind(this)} placeholder="Select date.." required/>
                                                </div>
                                                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12"> 
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Effective To <i className="astrick">*</i></label>
                                                    <input type="date" id="effectiveTo" min={minEffectiveTo} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.effectiveTo}  ref="effectiveTo" name="effectiveTo" onChange={this.handleChange.bind(this)} placeholder="Select date.." required/>
                                                </div>
                                                <br/>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    {this.state.editId ?
                                                        <button onClick={this.update.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
                                                        :
                                                        <button onClick={this.submit.bind(this)} className="btn button3 btn-primary pull-right">Submit</button>
                                                    }
                                                </div> 
                                            </form>
                                            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
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
                                        <div>
                                         
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
export default TaxRate;

