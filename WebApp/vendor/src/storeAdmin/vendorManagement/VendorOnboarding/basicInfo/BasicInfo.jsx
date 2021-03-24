import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import _                    from 'underscore';
import 'bootstrap/js/tab.js';
import '../css/SupplierOnboardingForm.css'

class BasicInfo extends Component {

  componentDidMount() {
    this.setState({
      vendor_ID: this.props.match.params.vendor_ID
    }, () => {
      this.edit();
    })
    this.getCategoryList();
    window.scrollTo(0, 0);
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Name should only contain letters & number.");
    $.validator.addMethod("regxmobileNumber", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid mobile number.");
    $.validator.addMethod("regxA2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid PAN Number.");
    $.validator.addMethod("regxA3", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid TIN Number.");
    $.validator.addMethod("regxA4", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "It should be www.abcd.com");
    $.validator.addMethod("regxA5", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter the valid GST number.");

    $.validator.addMethod("regxcategory", function (value, element, arg) {
      return arg !== value;
    }, "Please select category.");
    $.validator.addMethod("regxexistingVendor", function (value, element, arg) {
      return arg !== value;
    }, "Please select vendor.");
    $.validator.addMethod("regxA7", function (value, element, regexpr) {
      // // console.log('value: ',value + element);          
      return regexpr.test(value);
    }, "Please enter the valid COI No.");
    $.validator.addMethod("regxA8", function(value, element, regexpr) {          
      // // console.log('value: ',value + element);          
      return regexpr.test(value);
    }, "Please enter the valid MFG Pro.");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#BasicInfo").validate({
      rules: {
        companyName: {
          required: true,
          // regxA1: /^[A-Za-z_0-9 ][A-Za-z\d_ ]*$/,
        },
        pan: {
          required: true,
          regxA2: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
        },
        website: {
          required: true,
          regxA4: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/,
        },
        emailId: {
          required: true
        },
        mobileNumber: {
          required: true,
          regxmobileNumber: /^([7-9][0-9]{9})$/,
        },
        gstno: {
          required: true,
          regxA5: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        },
        existingVendor:{
          required: true,
          regxexistingVendor: "Select Vendor"
        },
        category: {
          required: true,
          regxcategory: "Select Category"
        },
        coino: {
          required: false,
          // regxA6: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
        },
        vendorRadio: {
          required: true
        },
        mfg: {
          required: false,
          regxA8: /^[0-9]{2}[A-Za-z]{2}[0-9]{7}$/,

          // regxA7: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
        },
        // LogoImageUp:{
        //   required: true,

        // }

      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "vendorRadio") {
          error.insertAfter("#vendorRadio");
        }
        if (element.attr("name") == "companyName") {
          error.insertAfter("#companyName");
        }
        if (element.attr("name") == "emailId") {
          error.insertAfter("#emailId");
        }
        if (element.attr("name") == "mobileNumber") {
          error.insertAfter("#mobileNumber");
        }
        if (element.attr("name") == "pan"){
          error.insertAfter("#basicInfo2");
        }
        if (element.attr("name") == "tin") {
          error.insertAfter("#basicInfo3");
        }
        if (element.attr("name") == "website") {
          error.insertAfter("#basicInfo4");
        }
        if (element.attr("name") == "gstno"){
          error.insertAfter("#basicInfo5");
        }
        if (element.attr("name") == "category") {
          error.insertAfter("#category");
        }
        if (element.attr("name") == "existingVendor") {
          error.insertAfter("#existingVendor");
        }
        if (element.attr("name") == "coino") {
          error.insertAfter("#basicInfo6");
        }
        if (element.attr("name") == "mfg") {
          error.insertAfter("#basicInfo7");
        }

      }
    });
    this.getVendorList();
    this.getVendors();
    // console.log(new Date().getTime(), Math.round(new Date().getTime()/1000));
  }
  componentWillUnmount() {
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  constructor(props) {
    super(props);
    this.state = {
      'vendorId'        : '',
      'typeOptions'     : 'Local',
      'companyName'     : '',
      "emailId"         : '',
      "mobileNumber"    : '',
      'pan'             : '',
      'tin'             : '',
      'website'         : '',
      'gstno'           : '',
      'category'        : '-- Select --',
      'coino'           : '',
      'mfg'             : '',
      'Evaluation'      : '',
      'score'           : '',
      'attachedDocuments': '',
      'logo'            : '',
      'vendorID'        : 0,
      "logo"            : "",
      'edit'            : props.routerId ? true : false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.supplier = this.supplier.bind(this);
  }
  getVendorList(){
    axios.get('/api/users/vendorlist')
    .then((response)=>{
      this.setState({
        existingVendorList : response.data,
      })
    })
    .catch((error)=>{
      console.log('error', error);
    })
  }
  changeVendor(event){
    this.setState({
      [event.target.name] : event.target.value,
    })
    console.log(event.target.value.split('|')[1]);
    axios.get('/api/users/' + event.target.value.split('|')[1])
        .then((response) => {
          console.log('eme', response.data)
          this.setState({
            "emailId": response.data.username,
            "emailDisabled" : true
          })
        })
        .catch((error) => {
          console.log('error', error);
        })
  }
  getVendors(){
    axios.get('/api/vendors/get/greatestid')
    .then((response)=>{
      console.log('res getVendors', response.data, parseInt(response.data.vendorID) + 1);
      if(response.data && response.data.vendorID){
        this.setState({
          vendorID : parseInt(response.data.vendorID) + 1
        })
      }else{
        this.setState({
          vendorID : 1
        })
      }
    })
    .catch((error)=>{
      console.log('error', error);
    })
  }
  getUploadFileAttachPercentage() {
    var uploadProgressPercent = localStorage.getItem("uploadUserImageProgressPercent");
    if (uploadProgressPercent) {
      var percentVal = parseInt(uploadProgressPercent);
      if (percentVal) {
        var styleC = {
          width: percentVal + "%",
          display: "block",
          height: "8px",
        }
        var styleCBar = {
          display: "block",
          marginTop: 10,
          height: "8px",
        }
      }
      if (!percentVal) {
        var percentVal = 0;

        var styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        var styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
        }

      }
      if (percentVal == 100) {
        var percentVal = 0;

        var styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        var styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
        }

      }
      return (
        <div>
          <div className="progress col-lg-12" style={styleCBar}>
            <div className="progress-bar progress-bar-striped active" role="progressbar"
              aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
            </div>
          </div>
        </div>
      );
    }
  }
  getUploadLogoPercentage() {
    var uploadProgressPercent = localStorage.getItem("imageprogress");
    if (uploadProgressPercent) {
      var percentVal = parseInt(uploadProgressPercent);
      if (percentVal) {
        var styleC = {
          width: percentVal + "%",
          display: "block",
          height: "8px",
        }
        var styleCBar = {
          display: "block",
          marginTop: 10,
          height: "8px",
          padding: "0px",
        }
      }
      if (!percentVal) {
        var percentVal = 0;

        var styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        var styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
          padding: "0px",
        }

      }
      if (percentVal == 100) {
        var percentVal = 0;

        var styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        var styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
          padding: "0px",
        }

      }
      return (
        <div>
          <div className="progress col-lg-12" style={styleCBar}>
            <div className="progress-bar progress-bar-striped active" role="progressbar"
              aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
            </div>
          </div>
        </div>
      );
    }
  }
  removeImageTempRender(event) {
    var suppliersID = this.props.match.params.id;
    //   if (suppliersID) {
    //     // // console.log('in if');

    //   }else{
    //     // // console.log('in else');
    //     Meteor.call('removeImageTempRender',
    //             (error,result)=>{
    //               if(error){
    //                 // console.log(error.reason);
    //               }else{
    //                 // console.log("success");
    //               }
    //           });
    //     }
  }
  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }

  handleOptionChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }
  supplier(event) {
    event.preventDefault();
    if ($('#BasicInfo').valid()) {
      console.log(true);
      var userDetails = {
        "firstName": this.state.companyName,
        "lastName": this.state.companyName,
        "emailId": this.state.emailId,
        "pwd": "gangaexpress123",
        "mobileNumber": this.state.mobileNumber,
        "status": "Active",
        "roles": "vendor"
      }
      if(this.props.match.params.vendor_ID){
        console.log(this.props.match.params.vendor_ID);
        if(this.state.vendorRadio == 'new'){
          axios.post('/api/users/vendor', userDetails)
          .then((res) => {
            var formValues = {
              'edit_ID'     : this.props.match.params.vendor_ID,
              'typeOptions'   : this.state.typeOptions,
              'companyName'   : this.state.companyName,
              "emailId"       : this.state.emailId,
              "mobileNumber"  : this.state.mobileNumber,
              'pan'           : this.state.pan,
              'tin'           : this.state.tin,
              'website'       : this.state.website,
              'gstno'         : this.state.gstno,
              'category'      : this.state.category,
              'coino'         : this.state.coino,
              'mfg'           : this.state.mfg,
              'Evaluation'    : this.state.Evaluation,
              'score'         : this.state.score,
              'vendorID'      : this.state.vendorID,
              'owner_ID'      : localStorage.getItem('vendor_ID'),
              'user_ID'       : res.data.user_id,
              "logo"          : this.state.logo,
            }
            
            axios.patch('/api/vendors/patch', formValues)
            .then((response) => {
              console.log('response', response.data);
              swal(response.data.message);
              if(response.data.vendor_ID){
                this.props.history.push('/location-details/' + response.data.vendor_ID);
              }
              
            })
            .catch((error) => {
              console.log('error', error);
            })
            
          })
          .catch((error) => {
            console.log('error', error);
          })
        }else{
          var formValues = {
            'edit_ID'         : this.props.match.params.vendor_ID,
            'typeOptions'     : this.state.typeOptions,
            'companyName'     : this.state.companyName,
            "emailId"         : this.state.emailId,
            "mobileNumber"    : this.state.mobileNumber,
            'pan'             : this.state.pan,
            'tin'             : this.state.tin,
            'website'         : this.state.website,
            'gstno'           : this.state.gstno,
            'category'        : this.state.category,
            'coino'           : this.state.coino,
            'mfg'             : this.state.mfg,
            'Evaluation'      : this.state.Evaluation,
            'score'           : this.state.score,
            'vendorID'        : this.state.vendorID,
            'owner_ID'        : localStorage.getItem('vendor_ID'),
            'user_ID'         : this.state.existingVendor.split('|')[1],
            "logo"            : ""
          }
          axios.patch('/api/vendors/patch', formValues)
          .then((response) => {
            console.log('response', response.data);
            swal(response.data.message);
            if(response.data.vendor_ID){
              this.props.history.push('/location-details/' + response.data.vendor_ID);
            }
          })
          .catch((error) => {
            console.log('error', error);
          })
          
        }
      }else{
        if(this.state.vendorRadio == 'new'){
          axios.post('/api/users/vendor', userDetails)
          .then((res) => {
            var formValues = {
              'typeOptions'   : this.state.typeOptions,
              'companyName'   : this.state.companyName,
              "emailId"       : this.state.emailId,
              "mobileNumber"  : this.state.mobileNumber,
              'pan'           : this.state.pan,
              'tin'           : this.state.tin,
              'website'       : this.state.website,
              'gstno'         : this.state.gstno,
              'category'      : this.state.category,
              'coino'         : this.state.coino,
              'mfg'           : this.state.mfg,
              'Evaluation'    : this.state.Evaluation,
              'score'         : this.state.score,
              'vendorID'      : this.state.vendorID,
              'owner_ID'      : localStorage.getItem('vendor_ID'),
              'user_ID'       : res.data.user_id,
              "logo"          : this.state.logo,
            }
            
            axios.post('/api/vendors/post', formValues)
            .then((response) => {
              console.log('response', response.data);
              swal(response.data.message);
              if(response.data.vendor_ID){
                this.props.history.push('/location-details/' + response.data.vendor_ID);
              }
              
            })
            .catch((error) => {
              console.log('error', error);
            })
            
          })
          .catch((error) => {
            console.log('error', error);
          })
        }else{
          var formValues = {
            'typeOptions'     : this.state.typeOptions,
            'companyName'     : this.state.companyName,
            "emailId"         : this.state.emailId,
            "mobileNumber"    : this.state.mobileNumber,
            'pan'             : this.state.pan,
            'tin'             : this.state.tin,
            'website'         : this.state.website,
            'gstno'           : this.state.gstno,
            'category'        : this.state.category,
            'coino'           : this.state.coino,
            'mfg'             : this.state.mfg,
            'Evaluation'      : this.state.Evaluation,
            'score'           : this.state.score,
            'vendorID'        : this.state.vendorID,
            'owner_ID'        : localStorage.getItem('vendor_ID'),
            'user_ID'         : this.state.existingVendor.split('|')[1],
            "logo"            : ""
          }
          axios.post('/api/vendors/post', formValues)
          .then((response) => {
            console.log('response', response.data);
            swal(response.data.message);
            if(response.data.vendor_ID){
              this.props.history.push('/location-details/' + response.data.vendor_ID);
            }
          })
          .catch((error) => {
            console.log('error', error);
          })
          
        }
      }
    } else {
      $(event.target).parent().parent().find('.inputText.error:first').focus();
    }
  }

  imgBrowse(event) {
    event.preventDefault();
    var logo = "";
    if (event.currentTarget.files && event.currentTarget.files[0]) {
        // for(var i=0; i<event.currentTarget.files.length; i++){
            var file = event.currentTarget.files[0];
            if (file) {
                var fileName  = file.name; 
                var ext = fileName.split('.').pop();  
                if(ext==="jpg" || ext==="png" || ext==="jpeg" || ext==="JPG" || ext==="PNG" || ext==="JPEG"){
                    if (file) {
                        var objTitle = { fileInfo :file }
                        logo = objTitle ;
                        
                    }else{          
                        swal("Images not uploaded");  
                    }//file
                }else{ 
                    swal("Allowed images formats are (jpg,png,jpeg)");   
                }//file types
            }//file
        // }//for 

        if(event.currentTarget.files){
            this.setState({
              logo : logo
            });  
            main().then(formValues=>{
                this.setState({
                  logo : formValues.logo
                })
            });
            async function main(){
                var config = await getConfig();
                
                var s3url = await s3upload(logo.fileInfo, config, this);


                const formValues = {
                    "logo"      : s3url,
                    "status"            : "New"
                };
  
                return Promise.resolve(formValues);
            }
            function s3upload(image,configuration){
    
                return new Promise(function(resolve,reject){
                    S3FileUpload
                        .uploadFile(image,configuration)
                        .then((Data)=>{
                            resolve(Data.location);
                        })
                        .catch((error)=>{
                            console.log(error);
                        })
                })
            }   
            function getConfig(){
                return new Promise(function(resolve,reject){
                    axios
                        .get('/api/projectSettings/get/S3')
                        .then((response)=>{
                            const config = {
                                bucketName      : response.data.bucket,
                                dirName         : 'propertiesImages',
                                region          : response.data.region,
                                accessKeyId     : response.data.key,
                                secretAccessKey : response.data.secret,
                            }
                            resolve(config);                           
                        })
                        .catch(function(error){
                            console.log(error);
                        })
    
                })
            }        
        }
    }
  }
  docBrowse(e) {
    e.preventDefault();
    // let self=this;      
    //   for (var i = 0; i < e.currentTarget.files.length; i++) {
    //     if(e.currentTarget.files){
    //     var file=e.currentTarget.files[i];
    //     // // console.log('file=: ',file);
    //     if(file){
    //     var fileExt=e.currentTarget.files[i].name.split('.').pop();
    //     // // console.log('file=: ',fileExt);
    //     var allowedExtensions = /(\.jpg)$/i;
    //       if (fileExt == 'flv' || fileExt == 'avi' || fileExt == 'mov' || fileExt == 'mp4' || fileExt == 'mpg' ||  fileExt == 'wmv' || fileExt == '3gp' || fileExt == 'asf' || fileExt == 'rm' || fileExt == 'swf' ) {

    //          swal({
    //           title:'abc',
    //           text:'Video file are not allowed.'});
    //          // // console.log('hi')
    //       }else{
    //         attachSupplierFileToS3Function(file,self);

    //       }
    //     }
    //   }           
    // }
  }

  keyPressWeb = (e) => {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 190 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 110 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
  /*======== alphanumeric  =========*/
  keyPress = (e) => {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (((e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
      e.preventDefault();
      // // console.log(e.keyCode);
    }
  }

  keyPressNumber = (e) => {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
      e.preventDefault();
      // // console.log(e.keyCode);
    }
  }
  clicktoattach(event) {
    event.preventDefault();
    $("#upload-file").click();
  }
  imgBrowseOne(event) {
    event.preventDefault();
    $("#LogoImageUp").click();
  }
  imgBrowseTwo(event) {
    event.preventDefault();
    $("#LogoImageUp").click();
  }
  attachfile(event, props) {
    // event.preventDefault();

    var suppliers = this.props.post4;
    // // console.log('suppliers :',suppliers);
    var attcharr = [];
    if (suppliers) {
      for (var i = 0; i < suppliers.length; i++) {
        var path = suppliers[i].logo
        attcharr.push({
          'location': suppliers[i],
          'id': suppliers[i]._id,
          'name': suppliers[i].name,
          'extension': suppliers[i].extension,
          'path': suppliers[i].logo,

        });

      }
      // // console.log('hello ',attcharr);
    }
    return attcharr;
  }
  removeAttachment(event) {
    event.preventDefault();
    // var id = $(event.currentTarget).attr('id')
    // // // console.log(id);
    // Meteor.call('removeAttachment',id,
    //     function(error,result){
    //       if(error){
    //         // console.log(error.reason);
    //       }else{
    //         swal({
    //           title:'abc',
    //           text:'Attached file removed successfully.'
    //         });
    //       }
    //   });
  }
  componentWillReceiveProps(nextProps) {
    this.edit();
    this.handleChange = this.handleChange.bind(this);
  }
  admin(event) {
    event.preventDefault();
    this.props.history.push('/adminDashboard');
  }
  getCategoryList() {
    axios.get('/api/vendorCategory/get/list')
      .then((response) => {
        console.log('res', response.data)
        this.setState({
          categoryList: response.data
        }, () => {
          console.log('categoryList', this.state.categoryList);
        })
      })
      .catch((error) => {
        console.log('error', error);
      })
  }
  edit() {
    var vendor_ID = this.state.vendor_ID;

    if (vendor_ID != '') {
      axios.get('/api/vendors/get/one/' + vendor_ID)
        .then((response) => {
          this.setState({
            'typeOptions': response.data.typeOptions,
            'companyName': response.data.companyName,
            "emailId": response.data.emailId,
            "mobileNumber": response.data.mobileNumber,
            'pan': response.data.pan,
            'tin': response.data.tin,
            'website': response.data.website,
            'gstno': response.data.gstno,
            'category': response.data.category,
            'coino': response.data.coino,
            'mfg': response.data.mfg,
            'Evaluation': response.data.Evaluation,
            'score': response.data.score,
            'vendorID': response.data.vendorID,
            'owner_ID': response.data.owner_ID,
            "logo" : response.data.logo
          })
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
  }
  vendorRadio(event){
    console.log(event.target.name, event.target.value);
    this.setState({
      [event.target.name] : event.target.value,
      "emailDisabled"     : event.target.value == 'new'? false : true
    });
  }
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section className="content">
            <div className="pageContent">

              <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Vendor Management</h4>
                <div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
                  {this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
                </div>
              </div>
              <div id="parkingreport" className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ul className="nav nav-pills ">
                  <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1">
                    <a href="" className="basic-info-pillss pills">
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                      Basic Info
                    </a>
                    <div className="triangleone triangleones" id="triangle-right"></div>
                  </li>
                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                    <div className="triangletwo" id="triangle-right1"></div>
                    <a href="" className="basic-info-pillss backcolor">
                      <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i>
                      Location
                    </a>
                    <div className="trianglethree forActive" id="triangle-right"></div>
                  </li>
                  {/* <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn3 disabled">

                  <div className="trianglefour" id="triangle-right2"></div>

                  <a  href="" className="basic-info-pillss backcolor">
                  <i className="fa fa-phone phoneIcon" aria-hidden="true"></i>
                  Contact
                  </a>
                  <div className="trianglefive forActive" id="triangle-right"></div>

                  </li> */}
                  <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls btn4 disabled">
                    <div className="trianglesix" id="triangle-right2"></div>

                    <a href="" className="basic-info-pillss backcolor">
                      <i className="fa fa-phone phoneIcon" aria-hidden="true"></i>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <section className="Content">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <form id="BasicInfo">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">

                        {/*<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">*/}
                        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h4 className="MasterBudgetTitle"><i className="fa fa-info-circle " aria-hidden="true"></i> Basic Info</h4>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
                        </div> */}

                        <div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
                          <div className="col-lg-12 col-md-12 col-sm-12">
                            {/* <div className="switchFieldType">
                            <input type="radio" id="switchLeft" name="typeOptions" value="Local" checked={this.state.typeOptions === 'Local'} onChange={this.handleOptionChange.bind(this)} />
                            <label htmlFor="switchLeft">Local</label>
                            <input type="radio" id="switchRight" name="typeOptions" value="Import" checked={this.state.typeOptions === 'Import'} onChange={this.handleOptionChange.bind(this)} />
                            <label htmlFor="switchRight">Import</label>
                            </div> */}
                            <br />
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                            {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <label className="switch">
                                <input type="checkbox" checked={this.state.vendorToggle} name="vendorToggle" onChange={this.vendorToggle.bind(this)} />
                                <span className="slider round"></span>
                              </label>
                            </div> */}
                            
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pdcls">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <input type="radio" ref="vendorRadio" name="vendorRadio"  value="new" onChange={this.vendorRadio.bind(this)}/> <label> &nbsp; New Vendor</label> <br/>
                                  <input type="radio" ref="vendorRadio" name="vendorRadio"  value="existing" onChange={this.vendorRadio.bind(this)}/> <label> &nbsp; Add to Existing Vendor</label>
                                  <div id="vendorRadio"></div>
                                </div>
                                {
                                  this.state.vendorRadio == 'existing'?
                                  <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Existing Vendors<i className="astrick">*</i></label>
                                    <select id="existingVendor" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.existingVendor} ref="existingVendor" name="existingVendor" onChange={this.changeVendor.bind(this)}>
                                      {/* <option disabled>-- Select --</option> */}
                                      <option value="Select Vendor">Select Vendor  </option>
                                      {this.state.existingVendorList && this.state.existingVendorList.length > 0 ?
                                        this.state.existingVendorList.map((data, index) => {

                                          return (
                                            <option key={index} value={data.profile.firstName+'|'+data._id}>{data.profile.firstName}</option>
                                          );
                                        }
                                        )
                                        :
                                        <option>No Data Found</option>
                                      }
                                    </select>
                                  </div>
                                  :
                                  null
                                }
                              </div>
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Company Name <i className="astrick">*</i></label>
                                  <input type="text" id="companyName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.companyName} ref="companyName" name="companyName" onChange={this.handleChange} placeholder="Enter company name.." required />
                                </div>
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 Websiteerror NOpadding-left NOpadding-right">
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Email <i className="astrick">*</i></label>
                                  <input disabled={this.state.emailDisabled}  type="email" id="emailId" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.emailId} ref="emailId" name="emailId" onChange={this.handleChange} placeholder="Enter email id" required />
                                </div>
                              </div>
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Mobile Number <i className="astrick">*</i></label>
                                  <input type="text" maxLength="10" id="mobileNumber" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.mobileNumber} ref="mobileNumber" name="mobileNumber" onChange={this.handleChange} placeholder="Enter mobile no." required />
                                </div>
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 Websiteerror NOpadding-left NOpadding-right" >
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Website <i className="astrick">*</i>
                                    <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Please enter valid Website(www.abc.xyz)." className="fa fa-question-circle"></i> </a>
                                    {/*<ReactTooltip id='basicInfo4Tooltip' type='error'>
                                      <span>Please enter valid Website(www.abc.xyz).</span>
                                      </ReactTooltip>*/}
                                  </label>
                                  <input type="text" id="basicInfo4" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onKeyDown={this.keyPressWeb} value={this.state.website} ref="website" name="website" onChange={this.handleChange} required />
                                </div>
                              </div>
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12" >
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Category of Vendor<i className="astrick">*</i></label>
                                  <select id="category" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.category} ref="category" name="category" onChange={this.handleChange}>
                                    {/* <option disabled>-- Select --</option> */}
                                    <option value="Select Category">Select Category</option>
                                    {this.state.categoryList && this.state.categoryList.length > 0 ?
                                      this.state.categoryList.map((Countrydata, index) => {

                                        return (
                                          <option key={index}>{Countrydata.categoryName}</option>
                                        );
                                      }
                                      )
                                      :
                                      <option>No Data Found</option>
                                    }
                                  </select>
                                </div>
                                <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding" >
                                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">MFG Pro-ERP No <i className="astrick">*</i>
                                    <a data-tip data-for='basicInfo7Tooltip' className="pull-right"> <i title="Eg. MFG PRO Supplier Code" className="fa fa-question-circle"></i> </a>
                                    
                                  </label>
                                  <input type="text" id="basicInfo7" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" placeholder="12AB3456789" value={this.state.mfg} ref="mfg" name="mfg" onChange={this.handleChange} />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addpicmr marginsBottom" id="hide">
                                <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZeroo">Add Logo</label>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                  
                                  {
                                  this.state.logo ?
                                  <img src={this.state.logo} className="img-responsive logoStyle" />
                                  :
                                  <img src={""} className="img-responsive logoStyle" />

                                  } 

                                  
                                  {/*<img src="/images/addPhptoBtn.png" className="img-responsive addlogoImg" />*/}
                                  <input onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="LogoImageUp" />
                                  {this.getUploadLogoPercentage()}
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.typeOptions == 'Local' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                              <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 panerror" >
                                <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">PAN <i className="astrick">*</i>
                                  <a data-tip data-for='basicInfo2Tooltip' className="pull-right"> <i title="Please enter valid PAN number (like this ABCDE1234Z)." className="fa fa-question-circle"></i> </a>
                                  {/* <ReactTooltip id='basicInfo2Tooltip' type='error'>
                                  <span>Please enter valid PAN number (like this ABCDE1234Z).</span>
                                  </ReactTooltip> */}
                                </label>
                                <input type="text" id="basicInfo2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.pan} ref="pan" name="pan" onChange={this.handleChange} placeholder="ABCDE1234Z" />
                              </div>
                              <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 tinerror" >
                                <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">TIN
                                </label>
                                <input type="text" id="basicInfo3" onKeyDown={this.keyPressNumber} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.tin} ref="tin" name="tin" onChange={this.handleChange} />
                              </div>
                            </div>
                            :
                            null
                          }
                          {this.state.typeOptions == 'Local' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                              <div className="col-lg-6 col-md-6 col-sm-12 col-sm-12 ">
                                <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">GST No <i className="astrick">*</i>
                                  <a data-tip data-for='basicInfo5Tooltip' className="pull-right"> <i title="Please enter valid GST number(like this 29ABCDE1234F1Z5)" className="fa fa-question-circle"></i> </a>
                                  {/* <ReactTooltip id='basicInfo5Tooltip' type='error'>
                                    <span>Please enter valid GST number(like this 29ABCDE1234F1Z5)</span>
                                    </ReactTooltip> */}
                                </label>
                                <input type="text" id="basicInfo5" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.gstno} ref="gstno" name="gstno" onChange={this.handleChange} placeholder="29ABCDE1234F2Z5" />
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12 col-sm-12 " >
                                <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">COI No/Shop Act Lic No </label>
                                <input type="text" id="basicInfo6" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.coino} ref="coino" name="coino" onChange={this.handleChange} />
                              </div>
                            </div>
                            :
                            null
                          }

                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                              <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Date of Evaluation</label>
                              <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.Evaluation} onChange={this.handleChange} id="Evaluation" ref="Evaluation" name="Evaluation" title="Please select date" />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 " >
                              <label className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Evaluation Score Rating
                              </label>
                              <input type="text" id="basicInfo10" onKeyDown={this.keyPressNumber} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.score} ref="score" name="score" onChange={this.handleChange} placeholder="Please enter evaluation score rating." />
                            </div>
                          </div>

                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxhr"></div> */}
                          {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachDocuments">
                            Attach Documents
                            </div> */}

                          {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="hidedoc">
                            <div className="attachDoc">
                            <input onChange={this.docBrowse.bind(this)} type="file" multiple className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 docAttach" id="upload-file" name="upload-file"/>
                            <i className="fa fa-upload uploadlogo uploadlogoTwo col-lg-1 col-md-1 col-sm-1 col-xs-1 clickHere" aria-hidden="true" onClick={this.clicktoattach.bind(this)}></i>
                            <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 drag ">

                            Drag and drop your Documents or  <a onClick={this.clicktoattach.bind(this)} className="clickHere">click here</a> to select files.Attach Document such as Technical Specification , Drawings,Designs,Images,Additional information, etc.
                            </div>

                            </div>
                            {this.getUploadFileAttachPercentage()}
                            </div> */}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                            {

                              this.attachfile().map((data, index) => {
                                return (
                                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-4" key={index} id={data.id}>
                                    <i className="fa fa-times pull-right crossbtn" aria-hidden="true" id={data.id} onClick={this.removeAttachment.bind(this)}></i>
                                    {data.extension == "xlsx" || data.extension == "xls" ?
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                        <img src="/images/exel.png" className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                      </div>
                                      :
                                      data.extension == "pptx" || data.extension == "ppt" ?
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                          <img src="/images/ppt.png" className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                        </div>
                                        :
                                        data.extension == "docx" || data.extension == "doc" ?
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                            <img src="/images/doc.png" className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                          </div>
                                          :
                                          data.extension == "pdfx" || data.extension == "pdf" ?
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                              <img src="/images/pdf.png" className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                            </div>
                                            :
                                            data.extension == "gif" || data.extension == "ico" || data.extension == "jpeg" || data.extension == "jpg" || data.extension == "png" || data.extension == "ps" || data.extension == "psd" || data.extension == "svg" || data.extension == "tif" || data.extension == "tiff" ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                                <img src={data.location.logo} className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                              </div>
                                              :
                                              data.extension != "pdfx" || data.extension != "pdf" || data.extension != "docx" || data.extension != "doc" || data.extension != "pptx" || data.extension != "ppt" || data.extension != "xlsx" || data.extension != "xls" ?

                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 attachfiles">
                                                  <img src="/images/imgNotFound.jpg" className="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingZero" download />
                                                </div>
                                                :
                                                null

                                    }
                                    <a href={data.path} download={'file.' + data.extension} className="" title={"Click to download " + data.name}>
                                      <i className="fa fa-download"></i>
                                    </a>
                                  </div>
                                );
                              })
                            }

                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">

                        <button className="btn button3 btn-primary pull-right" onClick={this.supplier.bind(this)} >Save & Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>

                      </div>
                    </form>
                  </div>
                </div>
              </section>

            </div>
          </section>
          </div>
        </div>
      </div>
    );
  }
}
export default BasicInfo;

