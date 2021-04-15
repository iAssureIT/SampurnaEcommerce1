import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from '../../coreadmin/IAssureTable/IAssureTable.jsx';
// import _                      from 'underscore';
import 'bootstrap/js/tab.js';

class TaxName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taxName                        : "",
            "tableHeading"                 : {
                taxName                    : "Tax Name",
                actions                    : 'Action',
              },
              "tableObjects"              : {
                deleteMethod              : 'delete',
                apiLink                   : '/api/preference',
                paginationApply           : false,
                searchApply               : false,
                editUrl                   : '/taxname'
              },
              "startRange"                : 0,
              "limitRange"                : 10,
              "editId"                    : this.props.match.params ? this.props.match.params.id : ''
        };
    }
    componentDidMount() {
        var editId = this.state.editId;
        // console.log('Id = ', editId);
        this.getData(this.state.startRange, this.state.limitRange);
        this.edit(editId);
        window.scrollTo(0, 0);
        $.validator.addMethod("regxA1", function(value, element, regexpr) {          
        return regexpr.test(value);
        }, "Tax Name should only contain letters & number.");
        
        jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
        });
        $("#taxMaster").validate({
        rules: {
            taxName: {
            required: true,
            regxA1: /^[A-Za-z_0-9 ][A-Za-z\d_ ]*$/,
            },
        },
            errorPlacement: function(error, element) {
                if (element.attr("name") === "taxName"){
                    error.insertAfter("#taxName");
                }
            }
        });
    }  
    
    componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.id;
        if(nextProps.match.params.id){
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
    submit(event){
        event.preventDefault();
        var formValues = {
            "taxName" : this.refs.taxName.value
        }
        if($("#taxMaster").valid()){
            axios.post('/api/preference/post', formValues)
            .then((response)=>{
                this.getData(this.state.startRange, this.state.limitRange);
                swal(response.data.message);
                this.setState({
                    taxName : ""
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
            "preferenceID" : this.state.editId,
            "taxName" : this.refs.taxName.value
        }
        if($("#taxMaster").valid()){
            axios.patch('/api/preference/patch', formValues)
            .then((response)=>{
                this.props.history.push('/taxname');
                swal(response.data.message);
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    taxName : "",
                    editId : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    getDataCount(){
        axios.get('/api/preference/get/count')
        .then((response)=>{
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

        axios.patch('/api/preference/get/list', data)
        .then((response)=>{
            this.getDataCount();
            var tableData = response.data.map((a, i)=>{
                return {
                    _id : a._id,
                    taxName : a.taxName,
                }
            })
            // console.log('table', tableData);
            this.setState({
                tableData : tableData
            })
            // console.log(response.data);
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
    edit(id){
        $("#taxMaster").validate().resetForm();
        axios.get('/api/preference/get/one/'+id)
        .then((response)=>{
            console.log('edit response = ', response.data);
            this.setState({
                "taxName" : response.data.taxName,
            });
            
        })
        .catch((error)=>{
            console.log('error', error);
        });
    }
    render() {
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
                                            <h4 className="">Tax Master</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" id="taxMaster">
                                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls"> 
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Tax Name <i className="astrick">*</i></label>
                                                    <input type="text" id="taxName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.taxName}  ref="taxName" name="taxName" onChange={this.handleChange.bind(this)} placeholder="Enter tax name.." required/>
                                                </div>
                                                <br/>
                                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                    {this.state.editId ?
                                                        <button onClick={this.update.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
                                                        :
                                                        <button onClick={this.submit.bind(this)} className="btn button3 btn-primary pull-right">Submit</button>
                                                    }
                                                </div> 
                                            </form>
                                            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 pdcls">
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
                        </div>
                    </section>
                    </div>
                </div> 
            </div> 
        );
    } 
}
export default TaxName;

