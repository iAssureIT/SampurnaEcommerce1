webpackHotUpdate("main",{

/***/ "./src/storeAdmin/vendorManagement/MasterData/VendorLocationType/VendorLocationType.jsx":
/*!**********************************************************************************************!*\
  !*** ./src/storeAdmin/vendorManagement/MasterData/VendorLocationType/VendorLocationType.jsx ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _coreadmin_IAssureTable_IAssureTable_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../coreadmin/IAssureTable/IAssureTable.jsx */ "./src/coreadmin/IAssureTable/IAssureTable.jsx");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var sweetalert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sweetalert */ "./node_modules/sweetalert/dist/sweetalert.min.js");
/* harmony import */ var sweetalert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(sweetalert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! underscore */ "./node_modules/underscore/underscore.js");
/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var bootstrap_js_tab_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bootstrap/js/tab.js */ "./node_modules/bootstrap/js/tab.js");
/* harmony import */ var bootstrap_js_tab_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(bootstrap_js_tab_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _VendorLocationType_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./VendorLocationType.css */ "./src/storeAdmin/vendorManagement/MasterData/VendorLocationType/VendorLocationType.css");
/* harmony import */ var _VendorLocationType_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_VendorLocationType_css__WEBPACK_IMPORTED_MODULE_7__);
var _jsxFileName = "/home/iassureit/PriyaiAssureITWork/newAnasHandicraft/eCommAnasHandicrafts/admin/src/storeAdmin/vendorManagement/MasterData/VendorLocationType/VendorLocationType.jsx";










class VendorLocationType extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      locationType: "",
      "tableHeading": {
        locationType: "Location Type",
        actions: 'Action'
      },
      "tableObjects": {
        deleteMethod: 'delete',
        apiLink: '/api/vendorLocationType/',
        paginationApply: false,
        searchApply: false,
        editUrl: '/vendor-location-type'
      },
      "startRange": 0,
      "limitRange": 10,
      "editId": this.props.match.params ? this.props.match.params.locationTypeID : ''
    };
  }

  componentDidMount() {
    var editId = this.props.match.params.locationTypeID;
    this.getData(this.state.startRange, this.state.limitRange);
    this.getDataCount();
    this.edit(editId);
    window.scrollTo(0, 0);
    jquery__WEBPACK_IMPORTED_MODULE_1___default.a.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Location Type should only contain letters & number.");
    jquery__WEBPACK_IMPORTED_MODULE_1___default.a.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    jquery__WEBPACK_IMPORTED_MODULE_1___default()("#vendorLocationType").validate({
      rules: {
        locationType: {
          required: true,
          regxA1: /^[A-Za-z_0-9][A-Za-z\d_ ]*$/
        }
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "locationType") {
          error.insertAfter("#locationType");
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    var editId = nextProps.match.params.locationTypeID;

    if (nextProps.match.params.locationTypeID) {
      this.setState({
        editId: editId
      });
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

  submitType(event) {
    event.preventDefault();
    var formValues = {
      "locationType": this.refs.locationType.value
    };

    if (jquery__WEBPACK_IMPORTED_MODULE_1___default()('#vendorLocationType').valid()) {
      axios__WEBPACK_IMPORTED_MODULE_3___default.a.post('/api/vendorLocationType/post', formValues).then(response => {
        console.log('response', response);
        this.getData(this.state.startRange, this.state.limitRange);
        sweetalert__WEBPACK_IMPORTED_MODULE_4___default()(response.data.message);
        this.setState({
          locationType: ""
        });
      }).catch(error => {
        console.log('error', error);
      });
    }
  }

  updateType(event) {
    event.preventDefault();
    var formValues = {
      "vendorCategoryID": this.state.editId,
      "locationType": this.refs.locationType.value
    };

    if (jquery__WEBPACK_IMPORTED_MODULE_1___default()('#vendorLocationType').valid()) {
      axios__WEBPACK_IMPORTED_MODULE_3___default.a.patch('/api/vendorLocationType/patch', formValues).then(response => {
        this.props.history.push('/vendor-location-type');
        this.getData(this.state.startRange, this.state.limitRange);
        sweetalert__WEBPACK_IMPORTED_MODULE_4___default()(response.data.message);
        this.setState({
          locationType: "",
          editId: ""
        });
      }).catch(error => {
        console.log('error', error);
      });
    }
  }

  getDataCount() {
    axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/api/vendorLocationType/get/count').then(response => {
      console.log('getDataCount', response.data.dataCount);
      this.setState({
        dataCount: response.data.dataCount
      });
    }).catch(error => {
      console.log('error', error);
    });
  }

  getData(startRange, limitRange) {
    var data = {
      startRange: startRange,
      limitRange: limitRange
    };
    axios__WEBPACK_IMPORTED_MODULE_3___default.a.post('/api/vendorLocationType/get/list', data).then(response => {
      this.getDataCount();
      this.setState({
        tableData: response.data
      });
    }).catch(error => {
      console.log('error', error);
    });
  }

  edit(id) {
    axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/api/vendorLocationType/get/one/' + id).then(response => {
      console.log('res', response.data);

      if (response.data) {
        this.setState({
          "locationType": response.data.locationType
        });
      }
    }).catch(error => {
      console.log('error', error);
    });
  }

  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-lg-12 col-md-12 col-xs-12 col-sm-12",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 166,
        columnNumber: 13
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
      className: "content col-lg-12 col-sm-12 col-md-12 col-xs-12",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 167,
        columnNumber: 15
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 168,
        columnNumber: 17
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 169,
        columnNumber: 19
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: " col-lg-12 col-sm-12 col-md-12 col-xs-12",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170,
        columnNumber: 21
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "box",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 171,
        columnNumber: 25
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 172,
        columnNumber: 27
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", {
      className: "NOpadding-right",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 173,
        columnNumber: 29
      }
    }, "Vendor Location Type")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-lg-12 col-md-12 col-sm-12 col-xs-12 ",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 176,
        columnNumber: 29
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 177,
        columnNumber: 29
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 178,
        columnNumber: 29
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
      className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
      id: "vendorLocationType",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 179,
        columnNumber: 29
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 180,
        columnNumber: 33
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 181,
        columnNumber: 37
      }
    }, "Location Type", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "astrick",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 181,
        columnNumber: 124
      }
    }, "*")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "text",
      id: "locationType",
      className: "form-control col-lg-12 col-md-12 col-sm-12 col-xs-12",
      value: this.state.locationType,
      ref: "locationType",
      name: "locationType",
      onChange: this.handleChange.bind(this),
      placeholder: "Enter location type..",
      required: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 182,
        columnNumber: 37
      }
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 184,
        columnNumber: 33
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-lg-12 col-md-12 col-sm-12 col-xs-12",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 185,
        columnNumber: 33
      }
    }, this.state.editId ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: this.updateType.bind(this),
      className: "btn button3 btn-primary pull-right",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 187,
        columnNumber: 41
      }
    }, "Update") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: this.submitType.bind(this),
      className: "btn button3 btn-primary pull-right",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 189,
        columnNumber: 41
      }
    }, "Submit")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 194,
        columnNumber: 29
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_coreadmin_IAssureTable_IAssureTable_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      tableHeading: this.state.tableHeading,
      twoLevelHeader: this.state.twoLevelHeader,
      dataCount: this.state.dataCount,
      tableData: this.state.tableData,
      getData: this.getData.bind(this),
      tableObjects: this.state.tableObjects,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 195,
        columnNumber: 33
      }
    }))))))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (VendorLocationType);

/***/ })

})
//# sourceMappingURL=main.c86d78dd11d216d2dd4c.hot-update.js.map