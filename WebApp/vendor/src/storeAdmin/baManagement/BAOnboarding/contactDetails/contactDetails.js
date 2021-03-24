import React, { Component } from 'react';
import ReactTooltip     from 'react-tooltip';
import { render }       from 'react-dom';
import swal         from 'sweetalert';
import $            from 'jquery';
import style        from '../css/BAOnboardingForm.css';
import axios                from 'axios';
import {Route, withRouter} from 'react-router-dom';

class ContactDetails extends Component {
  constructor(props) {
      super(props);
    
      this.state = {
        'MobileNo'             : '',
        'Email'                : '',
        'Name'                 : '',
        'altMobileNo'          : '',
        'Landing'              : '',
        'contactValue'         : '',
        'contactIndex'         : '',
        'levelIndex'           : '',
        'contactId'            : ''
      };
      this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps){
      
      this.handleChange = this.handleChange.bind(this);  
    }
    componentDidMount() {
      window.scrollTo(0, 0);
      console.log('contactEdit',this.props.contactEdit);
      if(this.props.updateBasic || this.props.contactEdit){
        this.levelOneContact();
      }
      if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
          //$("body").append(adminLte);
      }
      $.validator.addMethod("regxA1", function(value, element, regexpr) {          
      return regexpr.test(value);
      }, "Please enter valid phone number.");
      $.validator.addMethod("regxA2", function(value, element, regexpr) {          
        return regexpr.test(value);
      }, "Please enter valid email id.");
      $.validator.addMethod("notEqual", function(value, element, param) {
          return this.optional(element) || value != param;
        }, "Please specify a different value");
        
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#ContactDetail").validate({
      rules: {
        Name: {
          required: true,
        },
        MobileNo: {
          required: true,
          regxA1:/^([7-9][0-9]{9})$/
        },
        Email: {
          required: true,
        }
      },
      errorPlacement: function(error, element) {
          
          if (element.attr("name") == "MobileNo"){
            error.insertAfter("#MobileNo");
          }
          if (element.attr("name") == "Email"){
            error.insertAfter("#Email");
          }
          if (element.attr("name") == "Name"){
            error.insertAfter("#Name");
          }
          // if (element.attr("name") == "Reportinmanager"){
          //   error.insertAfter("#Reportinmanagers");
          // }
          // if (element.attr("name") == "altMobileNo"){
          //   error.insertAfter("#altMobileNo");
          // }
          // if (element.attr("name") == "Landing"){
          //   error.insertAfter("#Landings");
          // }
        }
    });
    $(document).ready(function(){
      var $contenta = $(".addContactForm").hide();
      $(".button4").on("click", function(e){
        $contenta.slideToggle();
      });
    });

    // -----------------new code ----------------- //
    /*if (!this.props.loading6) { 
      if(this.props.post2.contactDetails && this.props.post2.contactDetails.length > 0){ 
          $('.addContactForm').show();
          var routerIdSupplier  = FlowRouter.getParam("id");
        var route = routerIdSupplier.split('-');
        if (route[1] && route[2]) {
          $('.button2').attr('disabled',true);
            $('.button1').attr('disabled',true);
          var routerId      = route[0];
          var contactDetailIndex  = route[1];
          var locationLevelIndex  = route[2];
              this.setState({ 
                'Location'        : this.props.post2.contactDetails[contactDetailIndex].Location,
                  'Designation'       : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Designation,
                  'ContactLevel'      : parseInt(this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].ContactLevel),
                  'Phone'             : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Phone,
                  'Email'           : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Email,
                  'Name'              : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Name,
                  'Reportinmanager'   : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Reportinmanager,
                  'AltPhone'          : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].AltPhone,
                  'Landing'           : this.props.post2.contactDetails[contactDetailIndex].LocationLevel[locationLevelIndex].Landing,
            'contactIndex'      : contactDetailIndex,
            'levelIndex'        : locationLevelIndex,
            'updateButton'    : true,       
              });   
        }

      }
        this.handleChange = this.handleChange.bind(this);
    }*/
    }

    componentWillUnmount()
    {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    keyPress = (e) => {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
           // Allow: Ctrl+A, Command+A
          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
          (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
          (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
           // Allow: home, end, left, right, down, up
          (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
               // let it happen, don't do anything
               return;
      }
      // Ensure that it is a number and stop the keypress
      if (((e.keyCode < 65 || e.keyCode > 91)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46)) {
          e.preventDefault();
      }
  }
    /* ========== only number ========*/
    keyPressNumber = (e) => {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
           // Allow: Ctrl+A, Command+A
          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
          (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
          (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
           // Allow: home, end, left, right, down, up
          (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
               // let it happen, don't do anything
               return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46)) {
          e.preventDefault();
      }
  }
    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        }); 

        if(name == 'altMobileNo' || name == 'MobileNo'){
          var currentVal = event.currentTarget.value;
          if(name == 'altMobileNo'){
            var phoneVal = $(event.currentTarget).parent().parent().find('input[name="MobileNo"]').val();
          }else{
            var phoneVal = $(event.currentTarget).parent().parent().find('input[name="altMobileNo"]').val();
          }
          if(currentVal == phoneVal){
          this.setState({
                [name]: ''
            });           
          }else{
          this.setState({
                [name]: event.target.value
            });
          }
        }  
    }
  locationdetailBack(event){
    event.preventDefault();
    /*var routerId   = FlowRouter.getParam("id");
    if(location.pathname == '/ContactDetails/'+routerId){
      FlowRouter.go("/LocationDetails/"+routerId);
    }else if(location.pathname == '/ContactDetailsSTL/'+routerId){
      FlowRouter.go("/LocationDetailsSTL/"+routerId);
    }else{
      FlowRouter.go("/LocationDetailsSTM/"+routerId);
    }*/
  }   
    contactdetailBtn(event){
        event.preventDefault();
        if(this.state.Location != "--Select Location Type--" || this.state.Designation != '' || this.state.Phone != '' || this.state.Email != '' || this.state.Name != '' || this.state.Reportinmanager != '' || this.state.AltPhone != '' || this.state.Landing != ''){
      swal({
        text: "It seem that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page.But you may lose values allready entered in the location form",
        // type: "warning",
        buttons: {
              cancel: {
              text: "Cancel",
              value: false,
              visible: true,
              className: "CancelButtonSwal"
              },
              confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "OkButtonSwal",
              closeModal: true
              }
            },
      })
        .then((value) => {
          /*var router   = FlowRouter.getParam("id");
          var routeIdSplit = router.split('-');
          if (routeIdSplit[1]) {
            var routerId = router;
          }else{
            var routerId = router;
          }
        if (routerId && value === true) {
          if(location.pathname == '/ContactDetails/'+routerId){
                  FlowRouter.go("/Product_Services/"+routerId);
                }else if(location.pathname == '/ContactDetailsSTL/'+routerId){
                  FlowRouter.go("/Product_ServicesSTL/"+routerId);
                }else{
                  FlowRouter.go("/Product_ServicesSTM/"+routerId);
                }
        }else{
                FlowRouter.go("/ContactDetails/"+routerId);
        }*/
      })
      $(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
      $(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

    }else{
      /*var routerId   = FlowRouter.getParam("id");
      if (routerId) {
          if(location.pathname == '/ContactDetails/'+routerId){
              FlowRouter.go("/Product_Services/"+routerId);
          }else if(location.pathname == '/ContactDetailsSTL/'+routerId){
            FlowRouter.go("/Product_ServicesSTL/"+routerId);
          }else{
            FlowRouter.go("/Product_ServicesSTM/"+routerId);
          }
      }else{

              // FlowRouter.go("/Product_Services/");
              if(location.pathname == '/ContactDetails/'+routerId){
                  FlowRouter.go("/Product_Services/"+routerId);
              }else if(location.pathname == '/ContactDetailsSTL/'+routerId){
                FlowRouter.go("/Product_ServicesSTL/"+routerId);
              }else{
                FlowRouter.go("/Product_ServicesSTM/"+routerId);
              }
      }*/
    }
  
    }  
    contactdetailAddBtn(event){
      event.preventDefault();
      console.log('valid',$('#ContactDetail').valid())
      if($('#ContactDetail').valid()){
        $('.fullpageloader').show();
        var baId = this.props.baId;
        console.log('contact',baId);
          var formValues = {
            'baID'                : baId,
            contactDetails        : [{
              'name'              : this.refs.Name.value,
              'mobileNo'          : this.refs.MobileNo.value,
              'email'             : this.refs.Email.value,
              'altMobileno'       : this.refs.altMobileNo.value,
              'officeLandlineNo'  : this.refs.Landing.value,
            }]
          }
          //console.log(formValues);
          axios.patch("/api/businessassociates/patch/updateBaContact",formValues)
            .then((response)=>{
              $('.fullpageloader').hide();      
              swal({
                    title : 'Contact details are added successfully'
                  });
              this.setState({
                'MobileNo'             : '',
                'Email'                : '',
                'Name'                 : '',
                'altMobileNo'          : '',
                'Landing'              : ''
              });
              
              //$("#LocationsDetail").resetForm();
             this.levelOneContact();

             this.props.history.push('/ba-list');
            })
            .catch((error)=>{
                console.log('error', error);
          })
      }
      /*var contact_id = Random.id();
      var id   = FlowRouter.getParam("id");
      if(/[-]/.test(id)){
        var routerId = id.split('-')[0];
      }else{
          var routerId = id;
      }
      var userId     = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
      var supplierId = userId._id;
      var locationOffice = this.refs.Location.value;
      if($('#ContactDetail').valid()){
          var formValues = {
              'Location'        : this.refs.Location.value,
              'Designation'       : this.refs.Designation.value,
              'ContactLevel'      : parseInt(this.refs.ContactLevel.value),
              'Phone'             : this.refs.Phone.value,
              'Email'           : this.refs.Email.value,
              'Name'              : this.refs.Name.value,
              'Reportinmanager'   : this.refs.Reportinmanager.value,
              'AltPhone'          : this.refs.AltPhone.value,
              'Landing'           : this.refs.Landing.value,
          }
          Meteor.call('updatesuppliers',formValues,supplierId,locationOffice,contact_id,
              (error,result)=>{
              if(error){
                // console.log(error.reason);
              }else{
                $('.inputText').val('');
                swal({
                  title:"abc",
                  text:'Contact Details added successfully.'
                });
                $("#ContactDetail").validate().resetForm();
                this.setState({
                  'Location'        : '--Select Location Type--',
              'Designation'       : '',
              'ContactLevel'      : '--Select Contact Level--',
              'Phone'             : '',
              'Email'           : '',
              'Name'              : '',
              'Reportinmanager'   : '',
              'AltPhone'          : '',
              'Landing'           : '',
              'updateButton'    : false,
                })
              }
          });

        }else{
          $(event.target).parent().parent().find('.inputText.error:first').focus();
        }*/
    }

    updatecontactdetailAddBtn(event){
      event.preventDefault();
      $('.fullpageloader').show();
      var baId = this.props.baId;
      var contactId = $(event.currentTarget).attr('data-id');
      var formValues = {
      'baID'            : baId,
      'contactID'      : contactId,
      contactDetails   : [
                          {
                            'name'              : this.refs.Name.value,
                            'mobileNo'          : this.refs.MobileNo.value,
                            'email'             : this.refs.Email.value,
                            'altMobileno'       : this.refs.altMobileNo.value,
                            'officeLandlineNo'  : this.refs.Landing.value
                          }
                          ]
                      }
                    
      axios.patch("/api/businessassociates/patch/updateOneBaContact",formValues)
            .then((response)=>{
              $('.fullpageloader').hide();        
              swal({
                    title : 'Contact details are updated successfully'
                  });
              this.locationDetails();
              $(".addContactForm").hide();
              //$("#LocationsDetail").trigger('reset');
              this.setState({
                'Name'                  : '',
                'MobileNo'              : '',
                'altMobileNo'           : '',
                'Landing'               : ''
                
              });
             
             this.props.history.push('/ba-list');
            })
            .catch((error)=>{
                console.log('error', error);
          })
    }

    levelOneContact(){
      axios.get("/api/businessassociates/get/one/"+this.props.baId)
            .then((response)=>{
              console.log(response);
              this.setState({'contactarray':response.data[0].contactDetails});
            })
            .catch((error)=>{
                console.log('error', error);
          })
      /*var routerIdSupplier  = FlowRouter.getParam("id");
      var route = routerIdSupplier.split('-');
      if (route[1] && route[2]) {
        var routerId = route[0];
      }else{
        var routerId = route[0];
      }
      var contactOne   = Suppliers.findOne({'createdBy':Meteor.userId(),'_id':routerId});
      var contactarray = [];
      var locationarr  = [];
      var uniqLocationarr  = [];
      if (contactOne) {
        for (var i = 0; i < contactOne.contactDetails.length; i++) {
          var Location = contactOne.contactDetails[i].Location;
          if (contactOne.contactDetails[i].LocationLevel.length > 0) {

          var a = <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 tithead">

                <h4><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;{contactOne.contactDetails[i].Location}</h4>
              </div>;
          }
        contactarray.push({
            'a'       : a,
          });
          if (Location) {
            
            let levelsArr = contactOne.contactDetails[i].LocationLevel;
            // // console.log('levelsArr==>',levelsArr.length);
            levelsArr = _.sortBy(levelsArr, 'ContactLevel');
            var arrow =   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 downarr">
                    <i className="fa fa-arrow-down" aria-hidden="true"></i>
                  </div>;
            for (var j = 0; j <  levelsArr.length; j++) {
              if (levelsArr[j].ContactLevel == 1) {
                var bgColor = 'bglevel';

              }else if (levelsArr[j].ContactLevel == 2) {
                var bgColor = 'bglevel1';

              }else if(levelsArr[j].ContactLevel == 3){
                var bgColor = 'bglevel2';
              }
              var locationLevel =levelsArr[j].ContactLevel;
              var branchLevel = <div data={locationLevel} id={levelsArr[j].contact_id}>
                    { (j >=1) ? ((locationLevel > levelsArr[j-1].ContactLevel) ? arrow :  '') : ''}
                    <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12 boxul pdcls">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls levelOneBox">
                    <div className="col-lg-1 col-md-12 col-sm-12 col-xs-12 usericn pdcls">
                  </div>
                    <ul className="col-lg-4 col-md-10 col-sm-10 col-xs-10 pdcls">
                        <li className="liheader"><i className="fa fa-user-o iconpd" aria-hidden="true"></i>{levelsArr[j].Name}</li>
                        <li><i className="fa fa-address-card-o iconpd" aria-hidden="true"></i>{levelsArr[j].Designation}</li>
                    </ul>
                    <ul className="col-lg-4 col-md-10 col-sm-10 col-xs-10 pdcls">
                        <li className="whitesp lisubheader"><i className="fa fa-envelope-o iconpd" aria-hidden="true"></i>{levelsArr[j].Email}</li>
                        <li><i className="fa fa-mobile iconpd" aria-hidden="true"></i>+91 {levelsArr[j].Phone}</li>
                    </ul>
                    <div className={"col-lg-3 col-md-12 col-sm-12 col-xs-12 pdcls "+ bgColor}>
                      <div className="dots dropdown1">
                      <i className="fa fa-ellipsis-h dropbtn1" aria-hidden="true"></i>
                      <div className="dropdown-content1">
                      
                        <ul className="pdcls ulbtm">
                          <li id={levelsArr[j].contact_id} className="styleContactActbtn" data-index={i +"-"+ j} data-id={contactOne._id} data-locationtype={contactOne.contactDetails[i].Location} onClick={this.contactEditUpdate.bind(this)}>  
                              <a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
                            </li>
                            <li id={levelsArr[j].contact_id} className="styleContactActbtn" data-id={contactOne._id} data-index={i +"-"+ j} onClick={this.removeLevel.bind(this)}>
                              <a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
                            </li>
                          </ul>
                      </div>
                      </div>
                      <div className="level1">
                      {
                        levelsArr[j].ContactLevel == 1 ? 'First level of contact' 
                          : 
                          levelsArr[j].ContactLevel == 2? 
                            'Second level of contact' 
                              : 'Third level of contact'}
                      </div>
                    </div>
                    </div>
                  </div>
                  
                </div>;
                contactarray.push({
                    'headOfficce' : branchLevel
                  });
            }//EOF loop
              
          }//EOF haedoffice
        }
      }else{
        

      }
      return contactarray;*/
   
    }

    contactEditUpdate(event){
      event.preventDefault();
      $(".addContactForm").show();
      var contactId     = $(event.currentTarget).attr('data-id');
      this.setState({
        "contactId":contactId,
        "updateButton"    : true,
        });
      var baId = this.props.baId;
      
      var parameter = {
        "baID" : baId,
        "contactID" : contactId
      }

      axios.post("/api/businessassociates/post/singleContact", parameter)
            .then((response)=>{
              console.log(response.data[0].contactDetails[0]);
              
              this.setState({
                    'Name'                 : response.data[0].contactDetails[0].name,
                    'MobileNo'             : response.data[0].contactDetails[0].mobileNo,
                    'Email'                : response.data[0].contactDetails[0].email,
                    'altMobileNo'          : response.data[0].contactDetails[0].altMobileno,
                    'Landing'              : response.data[0].contactDetails[0].officeLandlineNo,
                    'contactValue'         : response.data[0].contactDetails[0]._id
              })
            })
      /*var levelId     = $(event.currentTarget).attr('id');
      
      
      var dataIndex     = $(event.currentTarget).attr('data-index');
      var splitIndex    = dataIndex.split('-');
      var contactIndex  = splitIndex[0];
      var levelIndex    = splitIndex[1];
 
      var suppliers  = Suppliers.findOne({'_id':contactId});
      var suppContact = suppliers.contactDetails.length;
      for (var i = 0; i < suppContact; i++) {
        if (suppliers.contactDetails[i].Location == locationtypes) {
          for (var j = 0; j < suppliers.contactDetails[i].LocationLevel.length; j++) {
            if (suppliers.contactDetails[i].LocationLevel[j].contact_id == levelId) {
              this.setState({
                'Location'        : suppliers.contactDetails[i].Location,
                  'Designation'       : suppliers.contactDetails[i].LocationLevel[j].Designation,
                  'ContactLevel'      : suppliers.contactDetails[i].LocationLevel[j].ContactLevel,
                  'Phone'             : suppliers.contactDetails[i].LocationLevel[j].Phone,
                  'Email'           : suppliers.contactDetails[i].LocationLevel[j].Email,
                  'Name'              : suppliers.contactDetails[i].LocationLevel[j].Name,
                  'Reportinmanager'   : suppliers.contactDetails[i].LocationLevel[j].Reportinmanager,
                  'AltPhone'          : suppliers.contactDetails[i].LocationLevel[j].AltPhone,
                  'Landing'           : suppliers.contactDetails[i].LocationLevel[j].Landing,
                  'contactValue'    : suppliers.contactDetails[i].LocationLevel[j].contact_id,
                  'contactIndex'      : contactIndex,
                  'levelIndex'        : levelIndex
              });
              window.scrollTo(0, 0);
              if(suppliers.contactDetails[i].LocationLevel[j].contact_id == levelId){     
                this.setState({
                  'updateButton'    : true,
                });
              }else{ 
                this.setState({
                  'updateButton'    : false,
                });     
              }
            }
            
          }

        }
      }*/
    }

  removeLevel(event){
      event.preventDefault();
      var id = $(event.currentTarget).attr('data-id');
      var idlevele = $(event.currentTarget).attr('id');
      var dataIndex     = $(event.currentTarget).attr('data-index');
      var splitIndex    = dataIndex.split('-');
      var contactIndex  = splitIndex[0];
      var levelIndex    = splitIndex[1];

      /*Meteor.call('removelevel',id,contactIndex,levelIndex,idlevele,
          function(error,result){
            if(error){
              // console.log(error.reason);
            }else{
              swal({
                title:'abc',
                text:'Contact Details deleted successfully!'
            });
            }
        });*/
  }
  
  contactDelete(event){
      event.preventDefault();
      var contactid = $(event.currentTarget).attr('id');
      var baId = this.props.baId;
      console.log(baId);
      
      axios.patch("/api/businessassociates/deleteContact/"+baId+"/"+contactid)
            .then((response)=>{
              console.log(response);         
              swal({
                    title : 'Contact is removed successfully'
                  });
              //$("#LocationsDetail").reset();
              this.levelOneContact();
            })
            .catch((error)=>{
                console.log('error', error);
          })
    }
  render() {
    /*var router   = FlowRouter.getParam("id");
    var routerId   = router.split("-");
    var locationTypeArry = [];
    var locationTypeSelect   =  Suppliers.findOne({"_id" : routerId[0]});

    if (locationTypeSelect) {
      for (var i = 0; i < locationTypeSelect.locationDetails.length; i++) {
        locationTypeArry.push({value:locationTypeSelect.locationDetails[i].locationType});
      }
    }

    var locationtypeArry  = _.pluck(locationTypeArry,"value");
    var uniquelocationtypeArry = _.uniq(locationtypeArry)
    var uniquelocationtype     = [];
    
    for(var k=0;k<uniquelocationtypeArry.length;k++){
      var uniqueloca = uniquelocationtypeArry[k];
      if (uniqueloca) {
        uniquelocationtype.push({value:uniqueloca});
      }else{
        uniquelocationtype.push({value:"No Data Found"});
      }
    }*/
    return (
        <div>
          <div className="">
          <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
            <section className="content viewContent">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Onboarding Form</h4>
                                  <div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right"></div>
                                </div>
                              </div>
                      <div id="parkingreport" className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills ">
                      <li className=" col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
                        <a href="" className="basic-info-pillss pillsHover">
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                        Basic Info 
                        </a>
                        <div className="triangleone" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                        <div className="triangletwo" id="triangle-right1"></div>
                        <a href="" className="basic-info-pillss pillsHover">
                        <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i>
                        Location
                        </a>
                        <div className="trianglethree" id="triangle-right"></div>
                      </li>
                      <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn3">
                        <div className="trianglefour" id="triangle-right2"></div>
                        <a href="" className="basic-info-pillss pillsHover">
                        <i className="fa fa-phone phoneIcon" aria-hidden="true"></i>
                        Contact
                        </a>
                        <div className="trianglefive triangle5" id="triangle-right"></div>
                      </li>
                    </ul>
                  </div>
                  <section className="Content">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
                            <div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
                               <h4 className="MasterBudgetTitle"><i className="fa fa-phone" aria-hidden="true"></i> Contact Details</h4>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 ">
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
                              <div className="button4  pull-right">
                                <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Contact
                              </div>
                            </div>  
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>   
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addContactForm">
                            <form id="ContactDetail">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactForm">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 inputFields" > 
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Name <sup className="astrick">*</sup> 
                                </label>
                                <input id="Name" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Name} ref="Name" name="Name" onChange={this.handleChange} />
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 inputFields"> 
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Mobile Number <sup className="astrick">*</sup> 
                                </label>
                                <input id="MobileNo" name="MobileNo" type="text" maxLength="10" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.MobileNo} ref="MobileNo" onChange={this.handleChange} pattern="[0-9]+" required/>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 inputFields" > 
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Email <sup className="astrick">*</sup> 
                                </label>
                                <input id="Email" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.Email} ref="Email" name="Email" onChange={this.handleChange} />
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 inputFields" > 
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Alt. Mobile Number 
                                </label>
                                <input id="altMobileNo" name="altMobileNo" type="text" className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" value={this.state.altMobileNo} ref="altMobileNo" onChange={this.handleChange} pattern="[0-9]+" />
                      
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" > 
                                <label className="labelform whitesp col-lg-12 col-md-12 col-sm-12 col-xs-12">Office Landline No. 
                                </label>
                                <input id="Landings" name="Landings" type="text" onKeyDown={this.keyPressNumber} className="form-control examDate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextTwo" minLength="6" maxLength="13" value={this.state.Landing} ref="Landing" name="Landing" onChange={this.handleChange} />
                              </div>
                              </div>
                              
                              <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 contactSubmit">
                                { 
                                  this.state.updateButton ?
                                    <button className="button3 btn-primary pull-right" onClick={this.updatecontactdetailAddBtn.bind(this)} data-id={this.state.contactValue}>Update Contact</button>
                                      :
                                    <button className="button3 btn-primary pull-right" onClick={this.contactdetailAddBtn.bind(this)}>Submit</button>
                                }
                              </div>
                            </form>
                          </div>
                          
                        </div> 
                      </div>
                      
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bxht pdcls">
                            {this.state.contactarray && this.state.contactarray.length?
                              this.state.contactarray.map((contactArr,index)=>{
                                return(
                                  <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1" key={index}>
                                    <div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    </div>
                                    <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
                                      <li>{contactArr.name} - {contactArr.mobileNo}</li>
                                      <li>Email: {contactArr.email}</li>
                                      <li>Alt Mobile No.: {contactArr.altMobileno}</li>
                                      <li>Office Landline No.: {contactArr.officeLandlineNo}</li>
                                    
                                    </ul>
                                    <div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                      <i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
                                      <div className="dropdown-content dropdown-contentLocation">
                                        <ul className="pdcls ulbtm">
                                          <li id={contactArr._id} name={index} data-id={contactArr._id} onClick={this.contactEditUpdate.bind(this)}>  
                                              <a href="#"><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
                                            </li>
                                            <li onClick={this.contactDelete.bind(this)} id={contactArr._id} name={index}>
                                              <a href="#"><i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</a>
                                            </li>
                                          </ul>
                                      </div>
                                    </div>
                                  </div>

                                  );
                              })
                              :
                              <div className="textAlign">Contact Details will be shown here.</div>  
                            }
                          </div>

                        </div>
                      </div>
                    </div>
                  </section>
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

export default withRouter(ContactDetails);