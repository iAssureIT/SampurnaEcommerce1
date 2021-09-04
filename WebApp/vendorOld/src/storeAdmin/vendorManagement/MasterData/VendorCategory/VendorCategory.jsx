import React, { Component }   from 'react';
import $                      from 'jquery';
import jQuery                 from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import IAssureTable           from '../../../../coreAdmin/IAssureTable/IAssureTable.jsx';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';

class VendorCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryName                        : "",
            "tableHeading"                      : {
                categoryName                    : "Category Name",
                actions                         : 'Action',
              },
              "tableObjects"              : {
                deleteMethod              : 'delete',
                apiLink                   : '/api/vendorCategory/',
                paginationApply           : false,
                searchApply               : false,
                editUrl                   : '/vendor-category/'
              },
              "startRange"                : 0,
              "limitRange"                : 10,
              "editId"                    : this.props.match.params ? this.props.match.params.vendorID : ''
        };
    }
    componentDidMount() {
        var editId = this.props.match.params.vendorID;
        console.log('ven', editId);
        this.getData(this.state.startRange, this.state.limitRange);

        this.edit(editId);
        window.scrollTo(0, 0);
        $.validator.addMethod("regxA1", function(value, element, regexpr) {          
        return regexpr.test(value);
        }, "Category Name should only contain letters & number.");
        
        jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
        });
        $("#vendorCategory").validate({
        rules: {
            categoryName: {
            required: true,
            regxA1: /^[A-Za-z_0-9 ][A-Za-z\d_ ]*$/,
            },
        },
            errorPlacement: function(error, element) {
                if (element.attr("name") == "categoryName"){
                    error.insertAfter("#categoryName");
                }
            }
        });
    }  
    
    componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.vendorID;
        if(nextProps.match.params.vendorID){
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
    submitCategory(event){
        event.preventDefault();
        var formValues = {
            "categoryName" : this.refs.categoryName.value
        }
        if($("#vendorCategory").valid()){
            axios.post('/api/vendorCategory/post', formValues)
            .then((response)=>{
                this.getData(this.state.startRange, this.state.limitRange);
                swal(response.data.message);
                this.setState({
                    categoryName : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    updateCategory(event){
        event.preventDefault();
        var formValues = {
            "vendorCategoryID" : this.state.editId,
            "categoryName" : this.refs.categoryName.value
        }
        if($("#vendorCategory").valid()){
            axios.patch('/api/vendorCategory/patch', formValues)
            .then((response)=>{
                this.props.history.push('/vendor-category');
                swal(response.data.message);
                this.getData(this.state.startRange, this.state.limitRange);
                this.setState({
                    categoryName : "",
                    editId : ""
                })
            })
            .catch((error)=>{
                console.log('error', error);
            })
        }
    }
    getDataCount(){
        axios.get('/api/vendorCategory/get/count')
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

    axios.get('/api/vendorCategory/get/list', data)
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
        axios.get('/api/vendorCategory/get/one/'+id)
        .then((response)=>{
            console.log('res', response);
            this.setState({
                "categoryName"                  : response.data.categoryName,
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
                                            <h4 className="">Vendor Category</h4>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <br/>
                                            <br/>
                                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="vendorCategory">
                                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls"> 
                                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Category Name <i className="astrick">*</i></label>
                                                    <input type="text" id="categoryName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.categoryName}  ref="categoryName" name="categoryName" onChange={this.handleChange.bind(this)} placeholder="Enter category name.." required/>
                                                </div>
                                                <br/>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    {this.state.editId ?
                                                        <button onClick={this.updateCategory.bind(this)} className="btn button3 btn-primary pull-right">Update</button>
                                                        :
                                                        <button onClick={this.submitCategory.bind(this)} className="btn button3 btn-primary pull-right">Submit</button>
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
                </div> 
            </div> 
        );
    } 
}
export default VendorCategory;

