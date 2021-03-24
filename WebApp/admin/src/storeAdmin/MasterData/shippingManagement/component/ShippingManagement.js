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
import '../css/ShippingManagement.css';


class ShippingManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "addEditMode": "",
      

      "tableHeading": {
        shippingcosting: "Shipping Amount",
        // fromamount: "From Amount",
        // toamount: "To Amount",
        // shippingcost: "Shipping Cost",
        // shippingallow: "Shipping Allow",
        actions: 'Actions',
      },
      "tableObjects": {
        deleteMethod: 'delete',
        apiLink: '/api/shipping/',
        paginationApply: true,
        searchApply: false,
        editUrl: '/project-master-data'
      },
      "startRange": 0,
      "limitRange": 10,
      "editId": this.props.editId ? this.props.editId : '',
      "shippingcosting":'',
      "tableName" : "Shipping-Management"
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
    

    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#ShippingManagement").validate({
      rules: {
        shippingcosting: {
          required: true,
          digits: true,
          maxLength:5
        },
        // /^[^-\s][a-zA-Z0-9_\s-]+$/
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "shippingcosting") {
          error.insertAfter("#shippingcosting");
        }

        if (element.attr("name") === "toamount") {
          error.insertAfter("#toamount");
        }
        if (element.attr("name") === "shippingcost") {
          error.insertAfter("#shippingcost");
        }
      }
    });
    this.getDataCount();
    this.getData(this.state.startRange, this.state.limitRange);
  }

  getDataCount() {
    axios.get('/api/shipping/get/count')
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
    axios.get('/api/shipping/get/list-with-limits/' + startRange + '/' + limitRange)
      .then((response) => {
        console.log('tableData = ', response.data);
        this.setState({
          tableData: response.data ? response.data.reverse() : []
        })
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  shippingallows(allow) {
    console.log('shippingallows :===> ', allow);
        this.setState({
          shippingallow: allow
        })
  }


  submitsection(event) {
    event.preventDefault();
    // if (this.state.shippingcosting.length > 0) {
      if($('#shippingcosting').valid()){
      var formValues = {
        "shippingcosting"   : this.state.shippingcosting,
        // "fromamount"   : this.state.fromamount,
        // "toamount"     : this.state.toamount,
        // "shippingcost" : this.state.shippingcost,
        // 'shippingallow'   : this.state.shippingallow,
        "createdBy"    : localStorage.getItem("admin_ID")
      }
      console.log("response formValues==>",formValues);
      axios.post('/api/shipping/post', formValues)
        .then((response) => {
          console.log("response submitshipping==>",response.data);
          /*swal({text: response.data.message,});*/
            swal(" ",(response.data.message ));
          this.setState({
            "shippingcosting"   : '',
            // "fromamount"   : '',
            // "toamount"     : '',
            // "shippingcost" : '',
            // "shippingallow" : '',
          });
          this.getData(this.state.startRange, this.state.limitRange);
        })
        .catch((error) => {
          console.log('error', error);
        });

    }else{
      $('#shippingcosting').valid()
    }
  }
  updatesection(event) {
    event.preventDefault();
    // if (this.state.shippingcosting.length > 0) {  
      if($('#shippingcosting').valid()){
      var formValues = {
        "shippingcosting"     : this.state.shippingcosting,
        // "fromamount"     : this.state.fromamount,
        // "toamount"     : this.state.toamount,
        // "shippingcost" : this.state.shippingcost,
        // "shippingallow" : this.state.shippingallow,
        "shippingID" : this.state.editId,
      }
      axios.patch('/api/shipping/patch', formValues)
        .then((response) => {
          swal({
            text: response.data.message,
          });
          this.setState({
            "fromamount": '',
            "toamount": '',
            "editId" : '',
            "shippingcost": '',
          });
          //this.props.history.push('/project-master-data');
          // window.location.href ='/project-master-data';

          this.getData(this.state.startRange, this.state.limitRange);
        })
        .catch((error) => {
          console.log('error', error);
        });
      }else{
        $('#shippingcosting').valid()
      }
  }
  edit(id) {
    axios.get('/api/shipping/get/one/' + id)
      .then((response) => {
        console.log('edit = ', response.data);
        if (response.data) {
          this.setState({
            "shippingcosting"     : response.data.shippingcosting,
            // "fromamount"     : response.data.fromamount,
            // "toamount"       : response.data.toamount,
            // "shippingcost"   : response.data.shippingcost,
            // "shippingallow"   : response.data.shippingallow
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
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                <div className="row">
                  <div className="">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      <h4 className="weighttitle NOpadding-right">Shipping Master </h4>
                    </div>
                      <div className="col-lg-12 col-md-12 marginTopp NOpadding">
                      <form id="ShippingManagement" className="">
                          <div className="form-margin col-lg-8 col-lg-offset-2 col-md-6 col-sm-12 col-xs-12 pdcls">
                          <div className="col-lg-12">
                              <label>Shipping Amount <i className="redFont">*</i></label>
                              <input value={this.state.shippingcosting} name="shippingcosting" id="shippingcosting" onChange={(event) => this.setState({shippingcosting : event.target.value})} type="number" maxLength="5" min="1" className="form-control edit-catg-new" placeholder="From amount" ref="shippingcosting" required/>
                            </div>
                          </div>
                            {/* <div className="col-lg-12">
                              <label>Shipping From Amount <i className="redFont">*</i></label>
                              <input value={this.state.fromamount} name="fromamount" id="fromamount" onChange={this.createsectionUrl.bind(this)} type="text" className="form-control edit-catg-new" placeholder="From amount" ref="fromamount" />
                            </div>
                          </div> */}
                          {/* <div className="col-lg-5 fieldWrapper">
                            <div className="col-lg-12">
                              <label>Shipping To Amount <i className="redFont">*</i></label>
                              <input value={this.state.toamount} onChange={this.handleChange.bind(this)} id="toamount" name="toamount" type="text" className="form-control toamount" placeholder="To amount" ref="toamount" />
                            </div>                            
                          </div> */}
                          {/* <div className="col-lg-12 fieldWrapper">
                            <div className="col-lg-5 fieldWrapper">
                                  <label>Shipping Cost <i className="redFont">*</i></label>                                                                    
                                  <input value={this.state.shippingcost} onChange={this.handleChange.bind(this)} id="shippingcost" name="shippingcost" type="number" className="form-control shippingcost" placeholder="Shipping cost" ref="shippingcost"  />
                            </div>
                            <div className="col-lg-5 fieldWrapper">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Shipping Allow :</label>
                                <div className="btn-group btn-group-toggle" value={this.state.shippingallow} data-toggle="buttons">
                                  <label className={this.state.shippingallow === true ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} onClick={this.shippingallows.bind(this,true)} value={true} >
                                  <input type="radio"/>Yes
                                  </label>
                                  <label className={this.state.shippingallow === false ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} onClick={this.shippingallows.bind(this,false)} value={false} >
                                  <input type="radio" name="options" id="no" />No
                                  </label>
                                </div>
                            </div>
                          </div> */}
                          <div className="col-lg-12 fieldWrapper">
                            <div className="col-lg-4 btnWrapper pull-right">
                            <label>&nbsp;</label>
                              {
                                this.state.editId ?
                                  <button onClick={this.updatesection.bind(this)} className="col-lg-6 col-lg-offset-6 btn-primary button3 btn  pull-right pad-left">Update</button>
                                  :
                                  <button onClick={this.submitsection.bind(this)} className="col-lg-6 col-lg-offset-6 btn-primary button3 btn  pull-right pad-left">Submit</button>
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
                          tableName = {this.state.tableName}
                          currentView = {"Shipping-Management-table"}
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
export default ShippingManagement;