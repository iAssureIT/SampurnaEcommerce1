import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import IAssureTable           from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import './VendorLocationType.css'

class VendorLocationType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationType : "",
            "tableHeading"                      : {
                locationType                    : "Location Type",
                actions                         : 'Action',
              },
              "tableObjects"              : {
                deleteMethod              : 'delete',
                apiLink                   : '/api/vendorLocationType/',
                paginationApply           : false,
                searchApply               : false,
                editUrl                   : '/vendor-location-type'
              },
              "startRange"                : 0,
              "limitRange"                : 10,
              "editId"                    : this.props.match.params ? this.props.match.params.locationTypeID : ''

        };
    }
    componentDidMount() {
        var editId = this.props.match.params.locationTypeID;
        this.getData(this.state.startRange, this.state.limitRange);
        this.getDataCount();
        this.edit(editId);
        window.scrollTo(0, 0);
        $.validator.addMethod("regxA1", function(value, element, regexpr) {          
            return regexpr.test(value);
        }, "Location Type should only contain letters & number.");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#vendorLocationType").validate({
            rules: {
                locationType: {
                required: true,
                regxA1: /^[A-Za-z_0-9][A-Za-z\d_ ]*$/,
                },
            },
            errorPlacement: function(error, element) {
                if (element.attr("name") === "locationType"){
                    error.insertAfter("#locationType");
                }
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.locationTypeID;
        if(nextProps.match.params.locationTypeID){
          this.setState({
            editId : editId
          })
          this.edit(editId);
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
    submitType(event){
        event.preventDefault();
        var formValues = {
            "locationType" : this.refs.locationType.value
        }
        if($('#vendorLocationType').valid()) {
            axios.post('/api/vendorLocationType/post', formValues)
            .then((response)=>{
                console.log('response', response);
                this.getData(this.state.startRange, this.state.limitRange);
                swal(response.data.message);
                this.setState({
                    locationType : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    updateType(event){
        event.preventDefault();
        var formValues = {
            "vendorCategoryID" : this.state.editId,
            "locationType" : this.refs.locationType.value
        }
        if($('#vendorLocationType').valid()) {
            axios.patch('/api/vendorLocationType/patch', formValues)
            .then((response)=>{
                this.props.history.push('/vendor-location-type');
                this.getData(this.state.startRange, this.state.limitRange);
                swal(response.data.message);
                this.setState({
                    locationType : "",
                    editId : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    getDataCount(){
        axios.get('/api/vendorLocationType/get/count')
        .then((response)=>{
            console.log('getDataCount', response.data.dataCount);
          this.setState({
            dataCount : response.data.dataCount
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

    axios.post('/api/vendorLocationType/get/list', data)
    .then((response)=>{
        this.getDataCount();
        this.setState({
        tableData : response.data
        })
    })
    .catch((error)=>{
        console.log('error', error);
    });
    }
    edit(id){
        axios.get('/api/vendorLocationType/get/one/'+id)
        .then((response)=>{
            console.log('res', response.data);
            if(response.data){
                this.setState({
                    "locationType"                  : response.data.locationType,
                });
            }
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }

    render() {
        return (
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
              <section className="content col-lg-12 col-sm-12 col-md-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                  <div className="row">
                    <div className=" col-lg-12 col-sm-12 col-md-12 col-xs-12">
                        <div className="box">
                          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="NOpadding-right">Vendor Location Type</h4>
                          </div>
                        
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <br/>
                            <br/>
                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="vendorLocationType">
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls"> 
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Location Type<i className="astrick">*</i></label>
                                    <input type="text" id="locationType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.locationType}  ref="locationType" name="locationType" onChange={this.handleChange.bind(this)} placeholder="Enter location type.." required/>
                                </div>
                                <br/>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    {this.state.editId ?
                                        <button onClick={this.updateType.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
                                        :
                                        <button onClick={this.submitType.bind(this)} className="btn button3 btn-primary pull-right">Submit</button>
                                    }
                                </div> 
                            </form>
                            </div>
                            <div>
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
                    </div>                 
                </div>
            </section>
            </div>
            );
    } 
}
export default VendorLocationType;

