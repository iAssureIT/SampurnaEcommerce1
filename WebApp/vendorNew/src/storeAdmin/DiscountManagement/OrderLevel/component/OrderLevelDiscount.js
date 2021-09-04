import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import IAssureTable         from '../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import 'jquery-validation';
import 'bootstrap/js/tab.js';
import '../css/SectionManagement.css';


class OrderLevelDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "addEditMode": "",

      "tableHeading": {
        discounttype: "Discount Type",
        discountin: "Discount In",
        discountvalue: "Discount Value",
        startdate: "Start Date",
        enddate: "End Date",
        actions: 'Action',
      },
      "tableObjects": {
        deleteMethod: 'delete',
        apiLink: '/api/orderdiscount/',
        paginationApply: true,
        searchApply: false,
        editUrl: '/discount-management'
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

    $("#OrderLevelDiscount").validate({
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
    axios.get('/api/orderdiscount/get/count')
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
    axios.get('/api/orderdiscount/get/list-with-limits/' + startRange + '/' + limitRange)
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
  submitsection(event) {
    event.preventDefault();
    if ($('#OrderLevelDiscount').valid()) {
      var formValues = {
        "discounttype"    : this.state.discounttype,
        "discountin"    : this.state.discountin,
        "discountvalue" : this.state.discountvalue,
        "startdate"     : this.state.startdate,
        "enddate"       : this.state.enddate,
        "createdBy"     : localStorage.getItem("admin_ID")
      }
      axios.post('/api/orderdiscount/post', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.setState({
            "discounttype": '',
            "discountin": '',
            "discountvalue": '',
            "startdate" : '',
            "enddate" : '',
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
    if ($('#OrderLevelDiscount').valid()) {
      var formValues = {
        "discounttype"   : this.state.discounttype,
        "discountin"     : this.state.discountin,
        "discountvalue" : this.state.discountvalue,
        "startdate" : this.state.startdate,
        "enddate" : this.state.enddate,
      }
      // console.log('form', formValues);
      axios.patch('/api/orderdiscount/patch', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.getData(this.state.startRange, this.state.limitRange);
          this.setState({
            "discounttype": '',
            "discountin": '',
            "discountvalue": '',
            "startdate" : '',
            "enddate" : '',
          });
          this.props.history.push('/discount-management');
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }
  edit(id) {
    axios.get('/api/orderdiscount/get/one/' + id)
      .then((response) => {
        console.log('edit = ', response.data);
        if (response.data) {
          this.setState({
            "discounttype"  : response.data.discounttype,
            "discountin"    : response.data.discountin,
            "discountvalue" : response.data.discountvalue,
            "startdate"     : response.data.startdate,
            "enddate"       : response.data.enddate,
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  }



  render() {
    return (
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="box">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      <h4 className="weighttitle NOpadding-right">Order Level Discount </h4>
                    </div>
                      <div className="col-lg-12 col-md-12 marginTopp NOpadding">
                      <form id="OrderLevelDiscount" className="">
                          <div className="col-lg-5 fieldWrapper">
                             <label>Discount Type<i className="redFont">*</i></label>
                               <select onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="discounttype" name="discounttype" >
                                <option name="shippingtime" disabled="disabled" selected="true">-- Select --</option>
                                <option name="productBase" selected="true">Product Base</option>
                                <option name="orderbase" selected="true">Order Base</option>
                            </select>
                          </div>
                          <div className="col-lg-5 fieldWrapper">
                             <label>Discount In<i className="redFont">*</i></label>
                               <select onChange={this.handleChange.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="discountin" name="discountin" >
                                <option name="shippingtime" disabled="disabled" selected="true">-- Select --</option>
                                <option name="precent" selected="true">Precent</option>
                                <option name="amount" selected="true">Amount</option>
                            </select>
                          </div>
                          <div className="col-lg-5 fieldWrapper noPadding">
                            <div className="col-lg-12">
                              <label>Discount Value<i className="redFont">*</i></label>
                              <input value={this.state.discountvalue} name="discountvalue" id="discountvalue" onChange={this.handleChange.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Discount Value Title" ref="discountvalue" />
                            </div>
                          </div>
                          <div className="col-lg-5 fieldWrapper noPadding">
                            <div className="col-lg-12">
                              <label>Start Date<i className="redFont">*</i></label>
                              <input value={this.state.startdate} name="startdate" id="startdate" onChange={this.handleChange.bind(this)} type="text" className="form-control edit-catg-new" placeholder="Start Date Title" ref="startdate" />
                            </div>
                          </div>

                          <div className="col-lg-5 fieldWrapper noPadding">
                            <div className="col-lg-12">
                              <label>End Date<i className="redFont">*</i></label>
                              <input value={this.state.enddate} name="enddate" id="enddate" onChange={this.handleChange.bind(this)} type="text" className="form-control edit-catg-new" placeholder="End Date Title" ref="enddate" />
                            </div>
                          </div>
                        
                          <div className="col-lg-12">
                            <div className="col-lg-4 btnWrapper pull-right">
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
        </div>
      </div>
    );
  }
}
export default OrderLevelDiscount;