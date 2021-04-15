import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import AddNewTableFeature from '../addNewTableFeature/addNewTableFeature.js';
import 'bootstrap/js/tab.js';
import "./AddNewProduct.css";
import CKEditor from "react-ckeditor-component";

class AddNewShopProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subcategoryArray: [],
      categoryArray: [],
      vendorArray: [],
      addrows: [1],
      productMode: '',
      productFeatured: false,
      productExclusive: false,
      catError: false,
      subCatError: false,
      subCatFormErrors: false,
      showDiscount: true,
      discountPercentError: "",
      placeholder: '<li>5.8-inch Super Retina display (OLED) with HDR</li><li>12MP dual cameras with dual OIS and 7MP TrueDepth front camera—Portrait mode and Portrait Lighting</li>',
      content: '',
      taxRateData : [],
      taxInclude: true,
      color: '',
      editId: this.props.match.params ? this.props.match.params.productID : ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    var editId = nextProps.match.params.id;
    if (nextProps.match.params.id) {
      this.setState({
        editId: editId,
        addrows: [1],
      })
      this.edit(editId);
    }
  }
  updateContent(newContent) {
    this.setState({
      content: newContent
    })
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  componentDidMount() {
    const user_ID = localStorage.getItem("user_ID");
    // console.log("User ID = ", user_ID);
    this.setState({
      user_ID : user_ID
    });

    if (this.state.editId) {
      this.edit(this.state.editId);
    }

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
      return arg !== value;
    }, "Please select the category");
    $.validator.addMethod("regxSubCat", function (value, element, arg) {
      return arg !== value;
    }, "Please select the sub category");
    $.validator.addMethod("regxsection", function (value, element, arg) {
      return arg !== value;
    }, "Please select the section");
    // $.validator.addMethod("regxbrand", function (value, element, regexpr) {
    //   return regexpr.test(value);
    // }, "Brand should only contain letters & number.");
    $.validator.addMethod("regxProductCode", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Product Code should only contain letters & number.");
    $.validator.addMethod("regxitemcode", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Item Code should only contain letters & number.");
    $.validator.addMethod("regxProductName", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Product Name should only contain letters & number.");
    $.validator.addMethod("regxUrl", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Product Url should only contain letters & number.");
    $.validator.addMethod("regxPrice", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Price should have positive decimal number followed by 1 or 2 digits");
    $.validator.addMethod("regxavailableQuantity", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Quantity should have positive decimal number followed by 1 or 2 digits");
    $.validator.addMethod("regxDiscountPercent", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Percent should have positive decimal number followed by 1 or 2 digits");
    
    $.validator.addMethod("regxDetails", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Product Details should only contain letters & number.");
    $.validator.addMethod("regxShortDesc", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Product Short Description should only contain letters & number.");
    $.validator.addMethod("noSpace", function(value, element) { 
      return value == '' || value.trim().length != 0;
    }, "No space please and don't leave it empty");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#addNewShopProduct").validate({
      rules: {

        section: {
          required: true,
          regxsection: "Select Section"
        },
        category: {
          required: true,
          valueNotEquals: "Select Category"
        },
        // brand: {
        //   // required: true,
        //   regxbrand: /^[A-Za-z][A-Za-z0-9\-\s]/,
        // },
        productCode: {
          required: true,
          regxProductCode: /^[a-zA-Z0-9@&()_+-]*$/i,
        },
        itemCode: {
          required: true,
          regxitemcode: /^[a-zA-Z0-9@&()_+-]*$/i,
        },
        productName: {
          required: true,
          regxProductName: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        productUrl: {
          required: true,
          regxUrl: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        originalPrice: {
          required: true,
          min :0,
         
          regxPrice: /^(?:[1-9]\d*|)?(?:\.\d{1,2})?$/,
        },
        // ^(10|\d)(\.\d{1,2})?$
        discountedPrice: {
          // required: true,
          regxPrice: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
        },
        discountPercent: {
          // required: true,
          regxDiscountPercent: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
        },
        availableQuantity: {
          required: true,
          regxavailableQuantity: /^\d+(,\d{1,2})?$/,
          // regxmobileNumber : /^([7-9][0-9]{9})$/,
        },
        currency: {
          required: true,
        },
        productDetails: {
          required: true,
        },
        shortDescription: {
          required: true,
          noSpace: true
          
        },
        status: {
          required: true,
          valueNotEquals: "-Select-"
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "category") {
          error.insertAfter("#category");
        }
        if (element.attr("name") === "subCategory") {
          error.insertAfter("#subCategory");
        }
        if (element.attr("name") === "section") {
          error.insertAfter("#section");
        }
        if (element.attr("name") === "brand") {
          error.insertAfter("#brand");
        }
        if (element.attr("name") === "productCode") {
          error.insertAfter("#productCode");
        }
        if (element.attr("name") === "itemCode") {
          error.insertAfter("#itemCode");
        }
        if (element.attr("name") === "productName") {
          error.insertAfter("#productName");
        }
        if (element.attr("name") === "productUrl") {
          error.insertAfter("#productUrl");
        }
        if (element.attr("name") === "discountedPrice") {
          error.insertAfter("#discountedPrice");
        }
        
        if (element.attr("name") === "discountPercent") {
          error.insertAfter("#discountPercent");
        }
        if (element.attr("name") === "originalPrice") {
          error.insertAfter("#originalPrice");
        }
        if (element.attr("name") === "availableQuantity") {
          error.insertAfter("#availableQuantity");
        }
        if (element.attr("name") === "currency") {
          error.insertAfter("#currency");
        }
        if (element.attr("name") === "productDetails") {
          error.insertAfter("#productDetails");
        }
        if (element.attr("name") === "shortDescription") {
          error.insertAfter("#shortDescription");
        }
        if (element.attr("name") === "status") {
          error.insertAfter("#status");
        }
      }
    });
    this.getSectionData();
    this.getVendorList();
    this.getTaxData();
  }
  getSectionData() {
    axios.get('/api/sections/get/list')
      .then((response) => {
        // console.log('getWebCategories', response.data);
        this.setState({
          sectionArray: response.data
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  showRelevantCategories(event) {
    var section = event.target.value;
    this.setState({
      section: event.target.value,
      section_ID: event.target.value.split('|')[1],
    })
    axios.get('/api/category/get/list/' + event.target.value.split('|')[1])
      .then((response) => {
        this.setState({
          categoryArray: response.data,
          category: "Select Category",
          subCategory: "Select Sub-Category",
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getCategories() {
    axios.get('/api/category/get/list')
      .then((response) => {
        this.setState({
          categoryArray: response.data
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  getSubCategories(categoryID) {
    axios.get('/api/category/get/one/' + categoryID)
      .then((response) => {
        this.setState({
          subcategoryArray: response.data.subCategory,
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  addNewRow(event) {
    event.preventDefault();
    var newArr = this.state.addrows;

    if (newArr) {
      newArr.push(newArr.length + 1);
      this.setState({
        "addrows": newArr,
      });
    }
  }
  showRelevantSubCategories(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
      subCategory: "Select Sub-Category",
    });
    var categoryID = event.target.value.split('|')[1];
    this.getSubCategories(categoryID);
  }
  edit(id) {
    axios.get('/api/products/get/one/' + id)
      .then((response) => {

        this.getCategories();
        this.getSubCategories(response.data.category_ID);
        console.log('attributes', response.data)
        this.setState({
          showDiscount: response.data.discountedPrice ? false : true,
          vendor: response.data.vendorName + '|' +response.data.user_ID +'|'+ response.data.vendor_ID,
          section: response.data.section + '|' + response.data.section_ID,
          category: response.data.category + '|' + response.data.category_ID,
          subCategory: response.data.subCategory + '|' + response.data.subCategory_ID,
          brand: response.data.brand,
          productCode: response.data.productCode,
          itemCode: response.data.itemCode,
          productName: response.data.productName,
          productUrl: response.data.productUrl,
          content: response.data.featureList,
          productDetails: response.data.productDetails,
          shortDescription: response.data.shortDescription,
          addrows: response.data.attributes.length > 0 ? response.data.attributes : [1],
          discountPercent: response.data.discountPercent,
          discountedPrice: response.data.discountedPrice === response.data.originalPrice ? "" : response.data.discountedPrice,
          originalPrice: response.data.originalPrice,
          taxInclude : response.data.taxInclude,
          taxRate : response.data.taxRate,
          size: response.data.size,
          color: response.data.color,
          unit: response.data.unit,
          availableQuantity: response.data.availableQuantity,
          currency: response.data.currency,
          status: response.data.status,
        }, () => {
          console.log('this', this.state.showDiscount);

        })

      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  submitProduct(event) {
    event.preventDefault();
    var addRowLength = (this.state.addrows).length;
    if (this.state.productFeatured) {
      var productFeatured = this.state.productFeatured;
    } else {
      var productFeatured = false;
    }
    if (this.state.productExclusive) {
      var productExclusive = this.state.productExclusive;
    } else {
      var productExclusive = false;
    }
    if (addRowLength && addRowLength > 0) {
      var productDimentionArray = [];
      var productArr = [];
      for (var i = 0; i < addRowLength; i++) {
        var obj = {
          "index": i,
          "attributeName": $(".attributeName" + i).val(),
          "attributeValue": $(".attributeValue" + i).val(),
        }
        if ($('.attributeNameRef').hasClass("attributeName" + i) && $('.attributeValueRef').hasClass("attributeValue" + i)) {
          productDimentionArray.push(obj);
        }
      }
    }
    console.log("Vendor = ", this.refs.vendor.value);
    var formValues = {
      "vendor_ID": this.refs.vendor.value.split('|')[2],
      "user_ID": this.refs.vendor.value.split('|')[1],
      "vendorName": this.refs.vendor.value.split('|')[0],
      "section": this.refs.section.value.split('|')[0],
      "section_ID": this.refs.section.value.split('|')[1],
      "category_ID": this.refs.category.value.split('|')[1],
      "category": this.refs.category.value.split('|')[0],
      "subCategory_ID": this.refs.subCategory.value.split('|')[1],
      "subCategory": this.refs.subCategory.value.split('|')[0],
      "brand": this.refs.brand.value,
      "productCode": this.refs.productCode.value,
      "itemCode": this.refs.itemCode.value,
      "productName": this.refs.productName.value,
      "productUrl": this.refs.productUrl.value,
      "productDetails": this.state.productDetails,
      "shortDescription": this.refs.shortDescription.value,
      "featureList": this.state.content,
      "attributes": productDimentionArray,
      "taxInclude" : this.state.taxInclude,
      "taxRate" : this.state.taxRate,
      "originalPrice": this.refs.originalPrice.value,
      "discountPercent": this.refs.discountPercent.value ? this.refs.discountPercent.value : "0",
      "discountedPrice": this.state.discountedPrice ? this.state.discountedPrice : this.state.originalPrice,
      "availableQuantity": this.refs.availableQuantity.value,
      "unit": this.refs.unit.value,
      "size": this.refs.size.value,
      "color": this.state.color,
      "currency": this.refs.currency.value,
      "status": this.refs.status.value,
      "featured": productFeatured,
      "exclusive": productExclusive,
      "fileName": "Manual",
    }
    if ($('#addNewShopProduct').valid()) {
       if (this.state.productDetails) {
        if (this.state.discountPercentError === "") {
          console.log("formValues",formValues);
          axios.post('/api/products/post', formValues)
            .then((response) => {
              console.log('response',response.data.message);
              if (response.data.message === "Item code for this product code already exists.") {
                swal({
                  title: "Item code already exist", 
                });
              } else {
                swal({
                  title: response.data.message,
                });
                this.setState({
                  vendor: "Select Vendor",
                  section: "Select Section",
                  category: "Select Category",
                  subCategory: "Select Sub-Category",
                  brand: "",
                  productCode: "",
                  itemCode: "",
                  productName: "",
                  productUrl: "",
                  productDetails: "",
                  shortDescription: "",
                  taxInclude : true,
                  taxRate : "",
                  originalPrice: "",
                  discountedPrice: "",
                  size: "",
                  color: "",
                  availableQuantity: "",
                  availableQuantity: "",
                  currency: "",
                  status: "",
                });
                this.props.history.push('/add-product/image/' + response.data.product_ID);
              }
            })
            .catch((error) => {
              console.log('error', error);
            })
         }
      }else{
      swal({
            title: "Please enter Product details",
          });
      }
    }
  }
  updateProduct(event) {
    event.preventDefault();
    var addRowLength = (this.state.addrows).length;

    if (this.state.productFeatured) {
      var productFeatured = this.state.productFeatured;
    } else {
      var productFeatured = false;
    }
    if (this.state.productExclusive) {
      var productExclusive = this.state.productExclusive;
    } else {
      var productExclusive = false;
    }
    if (addRowLength && addRowLength > 0) {
      var productDimentionArray = [];
      var productArr = [];
      for (var i = 0; i < addRowLength; i++) {
        var obj = {
          "index": i,
          "attributeName": $(".attributeName" + i).val(),
          "attributeValue": $(".attributeValue" + i).val(),
        }
        if ($('.attributeNameRef').hasClass("attributeName" + i) && $('.attributeValueRef').hasClass("attributeValue" + i)) {
          productDimentionArray.push(obj);
        }
      }
    }
    var formValues = {
      "vendor_ID": this.refs.vendor.value.split('|')[2],
      "user_ID": this.refs.vendor.value.split('|')[1],
      "vendorName": this.refs.vendor.value.split('|')[0],
      "section": this.refs.section.value.split('|')[0],
      "section_ID": this.refs.section.value.split('|')[1],
      "product_ID": this.state.editId,
      "category_ID": this.refs.category.value.split('|')[1],
      "category": this.refs.category.value.split('|')[0],
      "subCategory_ID": this.refs.subCategory.value.split('|')[1],
      "subCategory": this.refs.subCategory.value.split('|')[0],
      "brand": this.refs.brand.value,
      "productCode": this.refs.productCode.value,
      "itemCode": this.refs.itemCode.value,
      "productName": this.refs.productName.value,
      "productUrl": this.refs.productUrl.value,
      "productDetails": this.state.productDetails,
      "shortDescription": this.refs.shortDescription.value,
      "featureList": this.state.content,
      "attributes": productDimentionArray,
      "taxInclude" : this.state.taxInclude,
      "taxRate" : this.state.taxRate,
      "originalPrice": this.state.originalPrice,
      "discountPercent": this.state.discountPercent ? this.state.discountPercent : "0" ,
      "size": this.refs.size.value,
      "unit": this.refs.unit.value, 
      "color": this.state.color,
      "discountedPrice": this.state.discountedPrice ? this.state.discountedPrice : this.state.originalPrice,
      "availableQuantity": this.refs.availableQuantity.value,
      "currency": this.refs.currency.value,
      "status": this.refs.status.value,
      "featured": productFeatured,
      "exclusive": productExclusive,
    }

    if ($('#addNewShopProduct').valid()) {
      if (this.state.discountPercentError === "") {
        axios.patch('/api/products/patch', formValues)
          .then((response) => {
            swal({
              title: response.data.message,
            });
            this.setState({
              vendor: "Select Vendor",
              section: "Select Section",
              category: "Select Category",
              subCategory: "Select Sub-Category",
              brand: "",
              productCode: "",
              itemCode: "",
              productName: "",
              productUrl: "",
              productDetails: "",
              taxInclude : "",
              taxRate : "",
              shortDescription: "",
              size: "",
              color: "",
              discountedPrice: "",
              availableQuantity: "",
              currency: "",
              status: "",
            });
            this.props.history.push('/add-product/image/' + this.state.editId);
          })
          .catch((error) => {
            console.log('error', error);
          })
      }
    }
  }
  createProductUrl(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value,
    });
    var url = $(event.currentTarget).val();
    if (url) {
      url = url.replace(/\s+/g, '-').toLowerCase();
    }
    this.setState({
      productUrl:url
    })
  }
  discountedPrice(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })
    // console.log('discountPercent', event.target.value);
    if (event.target.value > 100) {
      this.setState({
        discountPercentError: "Discount Percent should be less than 100."
      })
    } else if (event.target.value < 0) {
      this.setState({
        discountPercentError: "Discount Percent should be greater than 0.",
        discountedPrice: 0
      })
    } else {
      this.setState({
        discountPercentError: ""
      })
    }
    var originalPrice = parseFloat(this.refs.originalPrice.value).toFixed(2);

    if (originalPrice !== "NaN") {
      var discountedPrice = parseFloat(originalPrice) - parseFloat((originalPrice * event.target.value) / 100).toFixed(2);
      this.setState({
        discountedPrice: discountedPrice < 0 ? 0 : parseFloat(discountedPrice).toFixed(2)
      })
    }
  }
  discountPercent(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })

    var originalPrice = parseFloat(this.refs.originalPrice.value).toFixed(2);
    if (originalPrice !== "NaN") {
      var discountPercent = parseFloat(((originalPrice - event.target.value) / originalPrice) * 100).toFixed(2);
      this.setState({
        discountPercent: parseFloat(discountPercent).toFixed(2)
      })
    }
  }
  percentAndPrice(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,

    });
    if (event.target.value !== 0) {
      this.setState({
        showDiscount: false
      })
    } else {
      this.setState({
        showDiscount: true,
        discountPercent: "",
        discountedPrice: "",
      })
    }
    var discountPercent = parseFloat(this.refs.discountPercent.value);
    var discountedPrice = parseFloat(this.refs.discountedPrice.value);

    if (discountPercent) {
      this.setState({
        discountedPrice: parseFloat(event.target.value) - parseFloat((event.target.value * discountPercent) / 100).toFixed(2)
      });
    }
    if (discountedPrice) {
      this.setState({
        discountPercent: parseFloat((event.target.value - discountedPrice / event.target.value) * 100).toFixed(2)
      });
    }
  }
  getVendorList() {
    // axios.get('/api/vendors/get/list')
    axios.get("/api/entitymaster/get/Vendor")
      .then((response) => {
        console.log('res getVendorList', response);
        this.setState({
          vendorArray: response.data
        })
      })
      .catch((error) => {

      })
  }
  onClickCkEditor(evt) {
    this.setState({
      placeholder: '',
    })
  }
  onChangeCkEditor(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    })
  }
  onChangeProductDetails(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      productDetails: newContent
    })
  }
  onBlurCkEditor() {
    if (!this.state.content) {
      this.setState({
        placeholder: '<li>5.8-inch Super Retina display (OLED) with HDR</li><li>12MP dual cameras with dual OIS and 7MP TrueDepth front camera—Portrait mode and Portrait Lighting</li>',
      })
    }
  }
  getTaxData(){
    axios.get('/api/preference/get/list')
    .then((response)=>{
        this.setState({
            taxName : response.data[0].taxName,
            taxRateData: response.data[0].taxDetails
        })
    })
    .catch((error)=>{
        console.log('error', error);
    });
  }
  changeTaxInclude(event){
    this.setState({
      [event.target.name] : event.target.checked
    })
  }
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <section className="content">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
            <div className="row">
              <div className="">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12">
                  <h4 className="NOpadding-right">Add Product</h4>
                </div>
                      <form className="newTemplateForm" id="addNewShopProduct">
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTopp">
                          <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                            <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-4 col-xs-offset-4 inputFields">
                              <label>Vendor <i className="redFont">*</i></label>
                              <select onChange={this.showRelevantSubCategories.bind(this)} value={this.state.vendor} name="vendor" className="form-control allProductCategories" aria-describedby="basic-addon1" id="vendor" ref="vendor">
                                <option disabled selected defaultValue="">Select Vendor</option>
                                {this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                  this.state.vendorArray.map((data, index) => {
                                    return (
                                      // <option key={index} value={data.companyName + '|' + data.user_ID + '|' + data._id}>{data.companyName} - ({data.vendorID})</option>
                                      <option key={index} value={data.companyName + '|' + this.state.user_ID + '|' + data._id}>{data.companyName} - ({"VendorID : "+data.companyID})</option>
                                    );
                                  })
                                  :
                                  <option disabled>{"No vendor added"}</option>
                                }
                              </select>
                              {this.state.vendor ? null : <span>Please select a vendor to add a product</span>}
                            </div>
                          </div>
                          {
                            this.state.vendor ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">

                                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields">
                                    <label>Section <i className="redFont">*</i></label>
                                    <select onChange={this.showRelevantCategories.bind(this)} value={this.state.section} name="section" className="form-control allProductCategories" aria-describedby="basic-addon1" id="section" ref="section">
                                      <option defaultValue="">Select Section</option>
                                      {this.state.sectionArray && this.state.sectionArray.length > 0 ?
                                        this.state.sectionArray.map((data, index) => {
                                          return (
                                            <option key={index} value={data.section + '|' + data._id}>{data.section}</option>
                                          );
                                        })
                                        :
                                        <option disabled>{"No section added"}</option>

                                      }
                                    </select>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields">
                                    <label>Category <i className="redFont">*</i></label>
                                    {/*<div className="input-group" id="category">*/}
                                    <select onChange={this.showRelevantSubCategories.bind(this)} value={this.state.category} name="category" className="form-control allProductCategories" aria-describedby="basic-addon1" id="category" ref="category">
                                      <option disabled selected defaultValue="">Select Category</option>
                                      {this.state.categoryArray && this.state.categoryArray.length > 0 ?
                                        this.state.categoryArray.map((data, index) => {
                                          return (
                                            <option key={index} value={data.category + '|' + data._id}>{data.category}</option>
                                          );
                                        })
                                        :
                                        <option disabled>{"No category added"}</option>
                                      }
                                    </select>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields">
                                    <label>Sub Category </label>
                                    {/*<div className="input-group" id="subCategory">*/}
                                    <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="subCategory" id="subCategory" ref="subCategory" value={this.state.subCategory} onChange={this.handleChange.bind(this)}>
                                      <option disabled selected defaultValue="">Select Sub-Category</option>
                                      {this.state.subcategoryArray && this.state.subcategoryArray.length > 0 ?
                                        this.state.subcategoryArray.map((data, index) => {

                                          return (
                                            <option value={data.subCategoryTitle + '|' + data._id} key={index}>{data.subCategoryTitle}</option>
                                          );
                                        })
                                        :
                                        <option disabled>{"No sub category added"}</option>
                                      }
                                    </select>
                                  </div>

                                </div>
                                <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">

                                  <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4 inputFields">
                                    <label>Product Code <i className="redFont">*</i></label>
                                    <input value={this.state.productCode} name="productCode" id="productCode" type="text" className="form-control link-category newProductCode" placeholder="Product Code" aria-label="Username" aria-describedby="basic-addon1" ref="productCode" onChange={this.handleChange.bind(this)} />
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-4 col-xs-4 inputFields">
                                    <label>Item Code <i className="redFont">*</i></label>
                                    <input value={this.state.itemCode} name="itemCode" id="itemCode" type="text" className="form-control link-category newProductCode" placeholder="Item Code" aria-label="Username" aria-describedby="basic-addon1" ref="itemCode" onChange={this.handleChange.bind(this)} />
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields">
                                    <label>Product Name <i className="redFont">*</i></label>
                                    <input value={this.state.productName} name="productName" id="productName" onChange={this.createProductUrl.bind(this)} type="text" className="form-control link-subcategory newProductName" placeholder="Product Name" aria-label="Username" aria-describedby="basic-addon1" ref="productName" />
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    <label>Product URL <i className="redFont">*</i></label>
                                    <input value={this.state.productUrl} onChange={this.handleChange.bind(this)} id="productUrl" name="productUrl" type="text" className="form-control link-subcategory newProductName productUrl" placeholder="Product URL" aria-describedby="basic-addon1" ref="productUrl" />
                                  </div>
                                </div>
                                <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 inputFields">
                                    <label>Brand Name</label>
                                    <input value={this.state.brand} name="brand" id="brand" type="text" className="form-control productBrandName" placeholder="Brand Name" aria-label="Brand" aria-describedby="basic-addon1" ref="brand" onChange={this.handleChange.bind(this)} />
                                  </div>

                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 paddingRightZeroo">
                                    <label>Quantity <i className="redFont">*</i></label>
                                    <input onChange={this.handleChange.bind(this)} value={this.state.availableQuantity} id="availableQuantity" name="availableQuantity" type="number" className="form-control availableQuantityNew" placeholder="Quantity" aria-describedby="basic-addon1" ref="availableQuantity" />
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 paddingLeftZeroo">
                                    <label>Unit <i className="redFont">*</i></label>
                                    <select className="form-control selectdropdown " ref="unit" id="unit" name="unit" value={this.state.unit} onChange={this.handleChange.bind(this)}>
                                      <option value="Single">Single</option>
                                      <option value="Dozen">Dozen</option>
                                      <option value="Kilograms">Kilograms</option>
                                      <option value="Miligrams">Miligrams</option>
                                      <option value="Liters">Liters</option>
                                      <option value="Mililiters">Mililiters</option>
                                    </select>
                                  </div>
                                  <div className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 paddingRightZeroo">
                                    <label>Original Price <i className="redFont">*</i></label>
                                    <input onChange={this.percentAndPrice.bind(this)} value={this.state.originalPrice} id="originalPrice" name="originalPrice" type="number" className="form-control availableQuantityNew" placeholder="Original Price" aria-describedby="basic-addon1" ref="originalPrice" />
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 paddingLeftZeroo">
                                    <label>Currency <i className="redFont">*</i></label>
                                    <select className="form-control selectdropdown" ref="currency" id="currency" name="currency" value={this.state.currency} onChange={this.handleChange.bind(this)}>
                                      <option value="inr">INR</option>
                                      <option value="usd">USD</option>
                                      <option value="eur">EUR</option>
                                      <option value="gbp">GBP</option>
                                    </select>
                                  </div>

                                </div>
                                <div className="addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">

                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
                                    <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 paddingRightZeroo">
                                      <label>Discount Percent (%)</label>
                                      <input max={100} disabled={this.state.showDiscount} value={this.state.discountPercent} onChange={this.discountedPrice.bind(this)} placeholder="Discount Percent" id="discountPercent" name="discountPercent" type="number" className="form-control  availableQuantityNew" aria-describedby="basic-addon1" ref="discountPercent" />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 paddingLeftZeroo">
                                      <label>Discount Price </label>
                                      <input max={this.state.originalPrice} disabled={this.state.showDiscount} onChange={this.discountPercent.bind(this)} value={this.state.discountedPrice} id="discountedPrice" name="discountedPrice" type="number" className="form-control  selectdropdown" placeholder="Discounted Price" aria-describedby="basic-addon1" ref="discountedPrice" />
                                    </div>
                                    <label id="discountPercent" className="error col-lg-12">{this.state.discountPercentError}</label>
                                  </div>

                                  <div className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 ">
                                    <label>Size</label>
                                    <input maxLength="10" onChange={this.handleChange.bind(this)} value={this.state.size} id="size" name="size" type="text" className="form-control " placeholder="Size" aria-describedby="basic-addon1" ref="size" />
                                  </div>
                                  <div className=" col-lg-2 col-md-2 col-sm-12 col-xs-12   ">
                                    <label>Color</label>
                                    <input onChange={this.handleChange.bind(this)} value={this.state.color} id="color" name="color" type="color" className="form-control" placeholder="Color" aria-describedby="basic-addon1" ref="color" />
                                  </div>

                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <label>{this.state.taxName ? this.state.taxName : 'Tax'} Rate (%) <i className="redFont">*</i></label>
                                    <select className="form-control selectdropdown" ref="taxRate" id="taxRate" name="taxRate" value={this.state.taxRate} onChange={this.handleChange.bind(this)}>
                                      <option value="0">0% </option>
                                      {this.state.taxRateData && this.state.taxRateData.length > 0?
                                        this.state.taxRateData.map((data, i)=>{
                                          return(
                                            <option key={i} value={data.taxRate}>{data.taxRate}% </option>
                                          );
                                        })
                                        :
                                        null
                                      }
                                    </select>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{this.state.taxName ? this.state.taxName : 'Tax'} Included <i className="redFont">*</i></label>
                                    <label class="taxswitch">
                                      <input type="checkbox" onChange={this.changeTaxInclude.bind(this)} checked={this.state.taxInclude} id="taxInclude" name="taxInclude" ref="taxInclude" className="NOpadding" />
                                      <span class="taxslider taxround"></span>
                                    </label>
                                  </div>
                                </div>
                                <div className="mt addNewProductWrap col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol">
                                  <div className=" col-lg-2 col-md-2 col-sm-12 col-xs-12   ">
                                    <label>Features</label>
                                    <a title="Please enter valid Email Id" data-toggle="modal" data-target="#instructions" > <i className="fa fa-question-circle"></i> </a>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <CKEditor activeClass="p15" id="editor" data-text="message"
                                      className="templateName"
                                      content={this.state.content}
                                      events={{ "change": this.onChangeCkEditor.bind(this) }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol mt">
                                  <label>Product Detail <i className="redFont">*</i></label>
                                  <CKEditor activeClass="p15" id="editor" data-text="message"
                                    className="templateName"
                                    content={this.state.productDetails}
                                    events={{ "change": this.onChangeProductDetails.bind(this) }}
                                  />
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol table-responsive tableCss">
                                  <table className="add-new-product-table table table-bordered">
                                    <thead>
                                      <tr>
                                        <th>Add Attributes Name</th>
                                        <th>Add Attributes Value</th>
                                        <th>Delete</th>
                                      </tr>
                                    </thead>

                                    <tbody className="tableBodyClass">
                                      {this.state.addrows ?
                                        this.state.addrows.map((data, index) => {
                                          return (
                                            <AddNewTableFeature index={index} attributeName={data.attributeName} attributeValue={data.attributeValue} key={index} />
                                          );
                                        })
                                        :
                                        null
                                      }
                                    </tbody>

                                  </table>
                                  <div className="marginTop17">
                                    <button className="submitBtn btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9 pull-right" onClick={this.addNewRow}>Add Row</button>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 add-new-productCol descriptionCss">
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <label>Short Description <i className="redFont">*</i></label>
                                      <input value={this.state.shortDescription} name="shortDescription" id="shortDescription" onChange={this.handleChange.bind(this)} type="text" className="form-control newProductShortDesc" placeholder="Short Description" aria-label="Username" aria-describedby="basic-addon1" ref="shortDescription" />
                                    </div>
                                    <div className="col-lg-6">
                                      <label>Status <i className="redFont">*</i></label>
                                      <select value={this.state.status} name="status" id="status" onChange={this.handleChange.bind(this)} className="form-control newProductStatus" aria-describedby="basic-addon1" ref="status" >
                                        <option>Draft</option>
                                        <option>Publish</option>
                                        <option>Unpublish</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                  <div className="">
                                    {
                                      this.state.editId ?
                                        <button onClick={this.updateProduct.bind(this)} className="submitBtn btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9 pull-right">Update</button>
                                        :
                                        <button onClick={this.submitProduct.bind(this)} className="submitBtn btn btnSubmit col-lg-2 col-lg-offset-10 col-md-2 col-md-offset-10 col-sm-3 col-sm-offset-9 col-xs-3 col-xs-offset-9 pull-right">Save & Next</button>
                                    }
                                  </div>
                                </div>
                              </div>
                              :
                              null
                          }
                        </div>
                      </form>
                  
              </div>


            </div>
          </div>

          <div className="modal" id="instructions" role="dialog">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h3 className="modalTitle">Instructions</h3>
                </div>
                <div className="modal-body">
                  <label>Please add features shown as below:</label>
                  <img width="100%" src="./images/featureInstruction.png" />
                  <br />
                </div>
                <div className="modal-footer">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
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

export default AddNewShopProduct;
