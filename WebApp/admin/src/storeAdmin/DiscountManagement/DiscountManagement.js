import React, { Component } from 'react';
import $ from 'jquery';
import IAssureTable from '../../coreadmin/IAssureTable/IAssureTable.jsx';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import moment from 'moment';
import './DiscountManagement.css';
class DiscountManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "addEditMode": "",

      discountamount: "",
      discountquantity: "",
      discountparameters: "",
      discounttype: "",
      discountin: "",
      discountvalue: "",

      "tableHeading": { 
        discounttype: "Discount Type",
        discountin: "Discount In",
        discountparameters: "Discount Parameters",
        discountquantity: "Discount Quantity",
        discountamount: "Discount Amount",


        discountvalue: "Discount Value",
        startdate: "Start Date",
        enddate: "End Date",
        actions: 'Action',
      },
      "tableObjects": {
        deleteMethod: 'delete',
        apiLink: '/api/discount/',
        paginationApply: true,
        searchApply: false,
        editUrl: '/discount-management'
      },
      "startRange": 0,
      "limitRange": 10,
      // "editId": this.props.editId ? this.props.editId : ''
      "minstartdate" : '',
      "tableName" : "DiscountMgmt"
    };
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
    });

    if(name === 'startdate'){
      this.setState({
        enddate : ''
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    var editId = nextProps.match.params.editId;
    console.log("editId = ", editId);
    if (editId) {
      this.setState({
        editId: editId
      })
      this.edit(editId);
    }
  }
  // componentDidUpdate(prevProps) {
  //   // if(this.props.match.params.editId !== this.state.editId){
  //   console.log("editId componentDidUpdate= ", this.props.match.params.editId);

  //     this.setState({editId : this.props.match.params.editId});
  //   }
  componentDidMount() {
    var userDetails   = JSON.parse(localStorage.getItem("userDetails"));
    var token       = userDetails.token;
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;

    this.setState({
      editId: this.props.match.params.editId,
      minstartdate:today
    }, () => {
      console.log("this.state.editId = ", this.props.match.params.editId);
    })

    window.scrollTo(0, 0);
    if (this.props.match.params.editId) {
      this.edit(this.props.match.params.editId);
    }

    
    $.validator.addMethod("regxdiscounttype", function (value, element, arg) {
      return arg !== value;
    }, "Please select Discount Type.");
    $.validator.addMethod("regxdiscountin", function (value, element, arg) {
      return arg !== value;
    }, "Please select Discount In.");
    $.validator.addMethod("regxdiscountparameters", function (value, element, arg) {
      return arg !== value;
    }, "Please select Discount Parameters.");

    $("#OrderLevelDiscount").validate({
      rules: {
        discounttype:{
          required: true,
          regxdiscounttype: "-- Select Discount Type --"
        },
        discountin: {
          required: true,
          regxdiscountin: "-- Select Discount In --"
        },
        discountparameters: {
          required: true,
          regxdiscountparameters: "-- Select Discount Parameters --"
        },
        discountvalue:{
          required:true,
          min : this.state.discountin  === 'Percent' ? 100 : 1
        },
        discountquantity:{
          required:true
        },
        discountamount:{
          required:true
        },
        startdate:{
          required:true
        },
        enddate:{
          required:true
        }
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "discounttype") {
          error.insertAfter("#discounttype");
        }
        if (element.attr("name") === "discountin") {
          error.insertAfter("#discountin");
        }

        if (element.attr("name") === "discountamount") {
          error.insertAfter("#discountamount");
        }

        if (element.attr("name") === "discountquantity") {
          error.insertAfter("#discountquantity");
        }
        if (element.attr("name") === "discountparameters") {
          error.insertAfter("#discountparameters");
        }

        if (element.attr("name") === "discountvalue") {
          error.insertAfter("#discountvalue");
        }
        if (element.attr("name") === "startdate") {
          error.insertAfter("#startdate");
        }
        if (element.attr("name") === "enddate") {
          error.insertAfter("#enddate");
        }


      }
    });
    this.getDataCount();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  getDataCount() {
    axios.get('/api/discount/get/count')
      .then((response) => {
        // console.log('dataCount', response.data);
        this.setState({
          dataCount: response.data.dataCount
        })
      })
      .catch((error) => {
        console.log('error', error);
        if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
      });

  }
  getData(startRange, limitRange) {
    axios.get('/api/discount/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        console.log('tableData = ', response.data);
        var tableData = response.data.map((a, i) => {
					return {
						_id: a._id,
						"discounttype"  : a.discounttype,
            "discountin"    : a.discountin,
            "discountparameters"  : a.discountparameters,
            "discountquantity"  : a.discountquantity,
            "discountamount"  : a.discountamount,
            "discountvalue" : a.discountvalue,
            "startdate"     : moment(a.startdate).format("DD/MM/YYYY"),
            "enddate"       : moment(a.enddate).format("DD/MM/YYYY"),
						
					}
				})
        this.setState({
          tableData: tableData
        })
      })
      .catch((error) => {
        console.log('error', error);
        if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
      });
  }
  setLimit(event){
		event.preventDefault();
		var discounttype = this.refs.discounttype.value;
		this.setState({
			"discounttype":discounttype,
		});	
	}
  submitDiscount(event) {
    event.preventDefault();
    if ($('#OrderLevelDiscount').valid()) {
      var formValues = {
        "discountamount": this.state.discountamount,
        "discountquantity": this.state.discountquantity,
        "discountparameters": this.state.discountparameters,
        "discounttype": this.state.discounttype,
        "discountin": this.state.discountin,
        "discountvalue": this.state.discountvalue,
        "startdate"     : this.state.startdate,
        "enddate"       : this.state.enddate,
        "createdBy": localStorage.getItem("admin_ID")
      }
      console.log('formValues===>', formValues);
      axios.post('/api/discount/post', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.setState({
            "discountamount": '',
            "discountquantity": '',
            "discountparameters": '',
            "discounttype": '',
            "discountin": '',
            "discountvalue": '',
            "startdate": '',
            "enddate": '',
          });
          this.getData(this.state.startRange, this.state.limitRange);
        })
        .catch((error) => {
          console.log('error', error);
          if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
        });
    }else{
      // swal({
      //   text: "Please Select Discount type or Discount In."
      // });
    }
  }
  updateDiscount(event) {
    event.preventDefault();
    if ($('#OrderLevelDiscount').valid()) {
      var formValues = {
        "discountID":this.props.match.params.editId,
        "discountamount": this.state.discountamount,
        "discountparameters": this.state.discountparameters,
        "discountquantity": this.state.discountquantity,
        "discounttype": this.state.discounttype,
        "discountin": this.state.discountin,
        "discountvalue": this.state.discountvalue,
        "startdate" : this.state.startdate,
        "enddate"   : this.state.enddate,
      }
      axios.patch('/api/discount/patch', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.getData(this.state.startRange, this.state.limitRange);
          this.setState({
            "discountamount"  : '',
            "discountquantity"  : '',
            "discountparameters"  : '',
            "discounttype"  : '',
            "discountin"    : '',
            "discountvalue" : '',
            "startdate"     : '',
            "enddate"       : ''
          });
          this.props.history.push('/discount-management');
        })
        .catch((error) => {
          console.log('error', error);
          if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
        });
    }

  }
  edit(id) {
    axios.get('/api/discount/get/one/' + id)
      .then((response) => {
        console.log('edit = ', response.data);
        if (response.data) {
          this.setState({
            "discountamount"  : response.data.discountamount,
            "discountquantity"  : response.data.discountquantity,
            "discountparameters"  : response.data.discountparameters,
            "discounttype"  : response.data.discounttype,
            "discountin"    : response.data.discountin,
            "discountvalue" : response.data.discountvalue,
            "startdate"     : moment(response.data.startdate).format("YYYY-MM-DD"),
            "enddate"       : moment(response.data.enddate).format("YYYY-MM-DD"),
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
        if(error.message === "Request failed with status code 401"){
              var userDetails =  localStorage.removeItem("userDetails");
              localStorage.clear();
              swal({  
                  title : "Your Session is expired.",                
                  text  : "You need to login again. Click OK to go to Login Page"
              })
              .then(okay => {
              if (okay) {
                  window.location.href = "/login";
              }
              });
            }
      });
  }
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
            <div className="row">
              <div className="">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                  <h4 className="weighttitle NOpadding-right">Discount Management</h4>
                </div>
                <form id="OrderLevelDiscount" className="">
                  <div className="col-lg-6 fieldWrapper inputHeight60">
                    <label>Discount Type<i className="redFont">*</i></label>
                    <select onChange={this.setLimit.bind(this)} value={this.state.discounttype} id="discounttype" ref="discounttype" name="discounttype" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding  form-control">
                      <option  name="No Select" >-- Select Discount Type --</option>
                      <option value="Order Base">Order Base</option>
                      {/* <option value="Product Base">Product Base</option>                       */}
                    </select>
                  </div>
                  <div className="col-lg-6 fieldWrapper inputHeight60">
                    <label>Discount In<i className="redFont">*</i></label>
                    <select onChange={this.handleChange.bind(this)} value={this.state.discountin} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="discountin" name="discountin" id="discountin" >
                      <option  name="No Select"  >-- Select Discount In --</option>
                      <option name="percent" value ="Percent" >Percent</option>
                      <option name="amount"  value ="Amount"  >Amount</option>
                      <option name="amount"  value ="Product"  >Product</option>
                    </select>
                  </div>
                  <div className="col-lg-6 fieldWrapper inputHeight60">
                    <label>Discount Parameters<i className="redFont">*</i></label>
                    <select onChange={this.handleChange.bind(this)} value={this.state.discountparameters} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="discountparameters" name="discountparameters" id="discountparameters" >
                      <option  name="No Select"  >-- Select Discount Parameters --</option>
                      { this.state.discountin == "Product" ? <option name="Buy X Get Y FREE" value ="Buy X Get Y FREE" >Buy X Get Y FREE</option> : null}
                      {this.state.discountin == "Percent" ? 
                        <option name="Buy X Get Y % FREE"  value ="Buy X Get Y % FREE"  >Buy X Get Y % FREE</option>
                         : null
                      }
                      {this.state.discountin == "Amount" ? 
                        <option name="Buy X Get Y Amount FREE"  value ="Buy X Get Y Amount FREE"  >Buy X Get Y Amount FREE</option>
                        : null
                      }
                      {this.state.discountin == "Amount" ? 
                      <option name="Buy X amount Get Y amount FREE"  value ="Buy X amount Get Y amount FREE"  >Buy X amount Get Y amount FREE</option>
                      : null
                      }
                      {this.state.discountin == "Percent" ? 
                      <option name="Buy X amount Get Y % FREE"  value ="Buy X amount Get Y % FREE"  >Buy X amount Get Y % FREE</option>
                      : null
                      }
                    </select>
                  </div>
                  {this.state.discountparameters == "Buy X Get Y % FREE" || this.state.discountparameters == "Buy X Get Y Amount FREE" || this.state.discountparameters == "Buy X Get Y FREE" ? 
                  <div className="col-lg-6 fieldWrapper inputHeight60 noPadding">
                    <div className="col-lg-12">
                      <label>Discount Quantity (Buy X)<i className="redFont">*</i></label>
                      <input value={this.state.discountquantity} name="discountquantity" id="discountquantity" maxlength="5" max={this.state.discountquantity === "Precent" ? "100" : "99999"} onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Discount Quantity" ref="discountquantity" required/>
                    </div>
                  </div>
                  : null
                      }
                  {
                    this.state.discountparameters == "Buy X amount Get Y amount FREE" || this.state.discountparameters == "Buy X amount Get Y % FREE"   ?
                    <div className="col-lg-6 fieldWrapper inputHeight60 noPadding">
                      <div className="col-lg-12">
                        <label>Discount Amount (Buy X)<i className="redFont">*</i></label>
                        <input value={this.state.discountamount} name="discountamount" id="discountamount" maxlength="5" max={this.state.discountamount === "Precent" ? "100" : "99999"} onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Discount Amount" ref="discountamount" required/>
                      </div>
                    </div>
                  : null
                      }
                  
                  <div className="col-lg-6 fieldWrapper inputHeight60 noPadding">
                    <div className="col-lg-12">
                      <label>Discount Value<i className="redFont">*</i></label>
                      <input value={this.state.discountvalue} name="discountvalue" id="discountvalue" maxlength="5" max={this.state.discountin === "Precent" ? "100" : "99999"} onChange={this.handleChange.bind(this)} type="number" className="form-control edit-catg-new" placeholder="Discount Value Title" ref="discountvalue" required/>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 fieldWrapper inputHeight60 noPadding">
                    <div className="col-lg-12">
                      <label>Start Date</label>
                      {/* <input type="date" onChange={this.handleChange.bind(this)} value={moment(this.state.startdate).format("DD-MM-YYYY")}  className="form-control edit-catg-new" name="startdate" id="startdate" ref="startdate" /> */}
                      <input type="date" id="startdate"  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.startdate} ref="startdate" name="startdate" onChange={this.handleChange.bind(this)} min={this.state.minstartdate} required/>
                      
                    </div>
                  </div>

                  <div className="col-lg-6 fieldWrapper inputHeight60 noPadding">
                    <div className="col-lg-12">
                      <label>End Date</label>
                      <input type="date" id="enddate" min={this.state.startdate} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.enddate} ref="enddate" name="enddate" onChange={this.handleChange.bind(this)} required/>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="col-lg-3  pull-right">
                      <label>&nbsp;</label>
                      {
                        this.props.match.params.editId ?
                          <button onClick={this.updateDiscount.bind(this)} className="col-lg-12 btn-primary btn ">Update</button>
                          :
                          <button onClick={this.submitDiscount.bind(this)} className=" col-lg-12 btn-primary btn ">Submit</button>
                      }
                    </div>
                  </div>
                </form>
              </div> 
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 discountManagementTable">
                <IAssureTable
                  tableHeading={this.state.tableHeading}
                  twoLevelHeader={this.state.twoLevelHeader}
                  dataCount={this.state.dataCount}
                  tableData={this.state.tableData}
                  getData={this.getData.bind(this)}
                  tableObjects={this.state.tableObjects}
                  tableName ={this.state.tableName}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default DiscountManagement;
