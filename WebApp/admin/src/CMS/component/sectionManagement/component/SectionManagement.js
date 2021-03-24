import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import ReactTable           from "react-table";
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import IAssureTable         from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/SectionManagement.css';


class SectionManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "addEditMode": "",

      "tableHeading": {
        section: "Section",
        section: "Section Title",
        sectionRank: "Section Rank",
        actions: 'Action',
      },
      "tableObjects": {
        deleteMethod: 'delete',
        apiLink: '/api/sections/',
        paginationApply: true,
        searchApply: false,
        editUrl: '/project-master-data'
      },
      "startRange": 0,
      "limitRange": 10,
      "editId": this.props.editId ? this.props.editId : ''
    };
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    var editId = nextProps.editId;
    if (editId) {
      this.setState({
        editId: editId
      })
      this.edit(editId);
    }
  }

  componentDidMount() {
    this.setState({
      editId : this.props.editId,
    },()=>{
      console.log("this.state.editId = ",this.state.editId);
    })

    window.scrollTo(0, 0);
    if (this.props.editId) {
      this.edit(this.props.editId);
    }
    
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid section title");

    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#sectionManagement").validate({
      rules: {
        
        section: {
          required: true,
          regxA1: /^[a-zA-Z0-9@&()_+-\s]*$/i,
        },
        // /^[^-\s][a-zA-Z0-9_\s-]+$/
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "section") {
          error.insertAfter("#section");
        }

        if (element.attr("name") === "section") {
          error.insertAfter("#section");
        }
      }
    });
    this.getDataCount();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  getDataCount() {
    axios.get('/api/sections/get/count')
      .then((response) => {
        // console.log('dataCount', response.data);
        this.setState({
          dataCount: response.data.dataCount
        })
      })
      .catch((error) => {
        console.log('error', error);
      });

  }
  getData(startRange, limitRange) {
    axios.get('/api/sections/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        console.log('tableData = ', response.data);
        this.setState({
          tableData: response.data
        })
      })
      .catch((error) => {
        console.log('error', error);
      });
    }
    
    // submitsection(event){
    //   event.preventDefault();
    //   if($('#sectionManagement').valid()){
    //     var formValues = {
    //         "section"                  : this.state.section,
    //         "createdBy"                : localStorage.getItem("admin_ID")
    //     }
    //     axios.post('/api/sections/post', formValues)
    //       .then((response)=>{
    //         swal({
    //           text  : response.data.message,
    //           title : response.data.message,
    //         });
    //         this.setState({
    //           "section"                      : 'Select',
    //           "sectionUrl"                   : '',
    //           "addEditModeSubsection"        : '',
    //         });
    //         this.getData(this.state.startRange, this.state.limitRange);
    //       })
    //       .catch((error)=>{
    //         console.log('error', error);
    //       });
    //   }
    // }

  submitsection(event) {
    event.preventDefault();
    if ($('#sectionManagement').valid()) {
      var formValues = {
        "section"     : this.state.section,
        "sectionRank" : this.state.sectionRank,
        "createdBy"   : localStorage.getItem("admin_ID")
      }
      console.log("formValues",formValues);
      axios.post('/api/sections/post', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.setState({
            "section": '',
            "sectionUrl": '',
            "addEditModeSubsection": '',
            "sectionRank" : '',
          });
          this.getData(this.state.startRange, this.state.limitRange);
        })
        .catch((error) => {
          console.log('error', error);
        });

    }
  }
  updatesection(event) {
    event.preventDefault();
    if ($('#sectionManagement').valid()) {
      var formValues = {
        "sectionID"   : this.state.editId,
        "section"     : this.state.section,
        "sectionRank" : this.state.sectionRank,
      }
      // console.log('form', formValues);
      axios.patch('/api/sections/patch', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.getData(this.state.startRange, this.state.limitRange);
          this.setState({
            "section": '',
            "sectionUrl": '',
            "editId" : '',
            "sectionRank": '',
          });
          this.props.history.push('/section-management');
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }
  edit(id) {
    axios.get('/api/sections/get/one/' + id)
      .then((response) => {
        console.log('edit = ', response.data);
        if (response.data) {
          this.setState({
            "section"     : response.data.section,
            "sectionRank" : response.data.sectionRank,
            "sectionUrl"  : response.data.sectionUrl
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  createsectionUrl(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
    });
    var url = event.target.value;
    // console.log('url',url);
    if (url) {
      url = url.replace(/\s+/g, '-').toLowerCase();
      // $(".productUrl").val(url);
      this.setState({
        sectionUrl: url
      })
    }
  }

  render() {
    return (
     
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <div className="formWrapper ctntwrpr">
              <section className=" ">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent  ctntwrprclor">
                  <div className="row">
                    <div className="box ">
                      <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 marbtm10padd20px">
                        <h3 className="text-center">Section Master </h3>
                      </div>
                    
                        <div className="col-lg-12 col-md-12 marginTopp ">
                        <form id="sectionManagement" className="">
                            <div className="col-lg-4 fieldWrapper">
                              <div className="col-lg-12">
                                <label>Section Title <i className="redFont">*</i></label>
                                <input value={this.state.section} name="section" id="section" onChange={this.createsectionUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Section Title" ref="section" />
                              </div>
                            </div>
                            <div className="col-lg-4 fieldWrapper">
                              <div className="col-lg-12">
                                <label>Section URL <i className="redFont">*</i></label>
                                <input disabled value={this.state.sectionUrl} onChange={this.handleChange.bind(this)} id="sectionUrl" name="sectionUrl" type="text" className="form-control sectionUrl" placeholder="Section URL" ref="sectionUrl" />
                              </div>                            
                            </div>
                            <div className="col-lg-4 fieldWrapper">
                              <div className="col-lg-12">
                                    <label>Section Rank <i className="redFont">*</i></label>                                                                    
                                    <input value={this.state.sectionRank} onChange={this.handleChange.bind(this)} id="sectionRank" name="sectionRank" type="number" className="form-control sectionRank" placeholder="Section Rank" ref="sectionRank"  />
                              </div>
                            </div>
                          
                            <div className="col-lg-12">
                              <div className="col-lg-2  pull-right">
                              <label>&nbsp;</label>
                                {
                                  this.state.editId ?
                                    <button onClick={this.updatesection.bind(this)} className="col-lg-12 btn-primary btn ">Update</button>
                                    :
                                    <button onClick={this.submitsection.bind(this)} className=" col-lg-12 btn-primary btn ">Submit</button>
                                }
                                </div>
                            </div>
                          
                        </form>
                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
              </section>
            </div>
          </div>
       
    );
  }
}
export default SectionManagement;