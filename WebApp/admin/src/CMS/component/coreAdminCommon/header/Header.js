import React,{Component}                              from 'react';
import { render }                                     from 'react-dom';
import $                                              from "jquery";
import axios from 'axios';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';
import Rightsidebar from '../rightSidebar/Rightsidebar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; 
import './Header.css';


export default class Header2 extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      showNotification: false,
      inAppNotifications:[],
      inAppNotificationsCount:0
    
    }
  }

  componentDidMount(){
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
    $("html,body").scrollTop(0);

    //======= User Details ==========
    var userDetails = JSON.parse(localStorage.getItem("userDetails")) ;
    const Token     = userDetails.token;
    axios.get('/api/users/get/' + userDetails.user_ID)
    .then((res) => {
      this.setState({
        userImage : res.data.image
      });
    })
    .catch((err) => {
    })


    if(Token){
      var comapanyname = parseInt(1)
    // console.log("comapanyname ====>>>>>>>>> ", comapanyname);

      axios.get('/api/entitymaster/get/companyName/'+comapanyname)
          .then(companyDetails=>{
              // console.log("companyDetails ====> ", companyDetails.data);
              this.setState({
                  user_ID       : userDetails.user_id,
                  email         : userDetails.email,
                  profileImage  : userDetails.image,
                  fullname      : userDetails.firstName+' '+userDetails.lastName,
                  companyID     : userDetails.companyID,
                  companyName   : companyDetails.data.companyName,
                },()=>{
                  // console.log("this.state.fullname = ",this.state.fullname);
                });

          //======= Notification Unread Count ==========
          // axios.get('/api/notifications/get/list/Unread/'+userDetails.user_id)
          //     .then(notifications => {

          //     this.setState({
          //         inAppNotifications: notifications.data ,
          //         inAppNotificationsCount    : notifications.data.length
          //       });

          //     })
          //     .catch(error => {
          //       console.log("Error in /api/notifications/get/list/Unread/ = ",error);
          //     })

          })
          .catch(error => {
            console.log("Error in /api/notifications/get/list/Unread/ = ",error);
          });

    }else{
      this.props.history.push("/login");
    }


  }
  componentWillReceiveProps(nextProps){
    const user_ID = localStorage.getItem("user_ID");
    axios.get('/api/notifications/get/list/Unread/'+user_ID)
      .then(notifications => {
        this.setState({ inAppNotifications: notifications.data,
          inAppNotificationsCount: notifications.data.length })
      })
      .catch(error => {
      })
  }
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }

   openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  toggleLeftNav(event) {
    event.preventDefault()
    $('#sidebar').toggleClass('active')
    $('#headerid').toggleClass('headereffect');
    $('#dashbordid').toggleClass('dashboardeffect')
    var sideBar = $("#sidebar").hasClass("active")
    localStorage.setItem('sideBar', sideBar);

  }

  toggleNav(event) {
    event.preventDefault()
    var currentWidth = document.getElementById("mySidenav").style.width;
    if (currentWidth == "230px") {
      document.getElementById("mySidenav").style.width = "0";
    } else {
      document.getElementById("mySidenav").style.width = "230px";
    }
  }

  logout() {
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
    var logintoken = localStorage.getItem("token");
    var user = localStorage.getItem("userDetails");
    var userDetails = JSON.parse(user);
    axios.get('/api/users/post/logout',{emailId:userDetails.email,user_ID: userDetails.user_ID,token:logintoken})
    .then(data => {
      var token = localStorage.removeItem("token");
      // console.log('notifications: ',notifications)
      if (token !== null) {
        this.setState({
          loggedIn: false
        }, () => {
          localStorage.removeItem("emailId")
          localStorage.removeItem("center_ID")
          localStorage.removeItem("centerName")
          localStorage.removeItem("fullName")
        }) 
      }
  
     })
    .catch(error => {
    })
  }
  LogoutSectionHover(event) {
    $(".colorboxbefore").toggleClass("colorbox");
    $('.showme').toggle();
  }

  bellNotification(event) {
    $('.bellnotification').toggle();
    const user_ID = localStorage.getItem("user_ID");
    axios.get('/api/notifications/get/list/Unread/'+user_ID)
      .then(notifications => {
        // console.log('notifications: ',notifications)
        this.setState({ inAppNotifications: notifications.data,inAppNotificationsCount: notifications.data.length })
      })
      .catch(error => {
      })
  }
  viewAll(id,event){
    $('.bellnotification').toggle();
    axios.put('/api/notifications/put/'+id)
    .then((res)=>{
      this.props.history.push("/ViewAllNotification");
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  showDropdown(event)
  {
    $("#showhide").addClass("showhim");
    $("#showhidearrow").addClass("showhim");
  }
   hideDropdown(event)
  {
    $("#showhide").removeClass("showhim");
    $("#showhidearrow").removeClass("showhim");
  }

  render(){
    return(
      <div className="">
        <header className="main-header cmsHeader">
          <a href="#!" className="logo logoOne">
            {/*<span className="logo-mini">
              <img src="/images/logof.jpeg" className="shortlogo strong"/>
            </span>*/}
            <span className="logo-lg">
                <a className="navbar-brand" href="/" name="Dashboard">iAssureIT CMS</a>
            </span>
          </a>
          <nav className="navbar navbar-static-top" role="navigation" id="cmsNavbar">
            <div className="col-lg-6 col-md-4 col-sm-4 col-xs-4 padd0">
              {/*<a href="javascript:void(0)" className="sidebar-toggle marginTop11 marginLeft12" data-toggle="push-menu" role="button">
                  <span className="sr-only">
                    Toggle navigation
                  </span>
              </a>*/}
              <ul className="nav navbar-nav">
                      <li><a href="/cms/select-new-block">Blocks</a></li>
                      {/*<li className=""><a href="/cms/create-new-page">Pages</a></li>*/}
                      <li className=""><a href="/cms/createnewpage">Pages</a></li>

                      {/*<li><a href="#" className="dropdown" id="blogbtnidA">
                      
                        <button className="dropbtn1 bgclrbtnheder" id="blogbtnid">Blogs 
                          <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                          <li className="dpdnBoxLi"><a href="/cms/blogs-form" className="whtclrHeaderBrand">Create new Blog</a></li>
                          <li className="dpdnBoxLi"><a href="/cms/AllBlogs" className="whtclrHeaderBrand">All Blogs</a></li>
                          
                          
                        </div>
                      </a></li>*/}
                      <li><a href="/cms/blogs-form">Blogs</a></li>
                      <li><a href="/cms/typemaster">Type Master</a></li>
                      <li><a href="/cms/listof-menu-design">Menubar</a></li>

                      <li><a href="/cms/list-of-pages">List Of Pages</a></li>

                      
                    </ul>
            </div>
            <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 padd0 pull-right">
              <div onClick={this.toggleNav.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right nopadding textAlignCenter onHoverEffect hover">
                <i className="fa fa-cogs headicon "></i>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 pull-right padd0">
                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 pull-right">
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 bell_Icon">
                    <i className="fa fa-bell btn " onClick={this.bellNotification.bind(this)} aria-hidden="true"></i>
                    <span className="label label-default badgeClass">{this.state.inAppNotificationsCount}</span>
                    <div className="col-lg-12 col-md-12  bellnotification">
                      {/* <p>You have {this.state.inAppNotificationsCount} notifications</p> */}
                      <div className="msgnotification col-lg-12 col-md-12 " >
                             <div className="user-notification col-lg-11 col-md-6" >
                              Notifications
                            </div>
                            <div className="user-closernoti col-lg-1 col-md-6" >
                              <p className="text-center" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)} title="Close">
                                X
                              </p>
                            </div>
                        </div>
                      <div className="profiledetails">
                        {this.state.inAppNotifications && this.state.inAppNotifications.length > 0 ?
                            this.state.inAppNotifications.map((data, index) => {
                              return (
                                <div className="msgborderbtm" key={index} id={data._id} onClick={this.viewAll.bind(this,data._id)}>
                                <div dangerouslySetInnerHTML={{ __html: data.notifBody }} />
                                </div>
                              )
                            })
                          :
                          <div >
                            <div>
                              <p>You have no notifications</p>
                            </div>

                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 pull-right bellicon hover" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)}>
                        <div className="notification">
                          { 
                            this.state.inAppNotificationsCount > 0 ?
                              this.state.inAppNotificationsCount < 9 ?
                                <span className="badge"> 
                                  {this.state.inAppNotificationsCount}
                                </span>
                              :
                                <span className="badge"> 
                                  9
                                <i className="fa fa-plus font-size: 3px font-weight:lighter"  aria-hidden="true"></i>
                                </span>
                              :
                              null  
                          }
                          <img src="../images/bell-2.png" className="img" />
                        </div>
                      </div> 
                       <div className="arrow-up bellnotification"></div>
                      <div className="col-lg-12 col-md-12  bellnotification">
                        <div className="msgnotification col-lg-12 col-md-12 " >
                             <div className="user-notification col-lg-11 col-md-6" >
                              Notifications
                            </div>
                            <div className="user-closernoti col-lg-1 col-md-6" >
                              <p className="text-center" style={{ "cursor": "pointer" }} onClick={this.bellNotification.bind(this)} title="Close">
                                X
                              </p>
                            </div>
                        </div>
                        <div className="profiledetails user-footer">
                        {/* {
                          this.state.inAppNotifications ?
                          this.state.inAppNotifications.length > 0 ?
                            this.state.inAppNotifications.map((data, index) => {
                              
                               return (
                                  <div className="msgborderbtm" key={index}>
                                      <div dangerouslySetInnerHTML={{__html: data.notifMessage}} />
                                  </div>
                               )
                            })
                            
                            :
                            <div >
                                <div>
                                    <p>You have no notifications</p>
                                </div>

                            </div>
                        :
                          null
                          }    
                        </div>
                      </div> */}
                  <div className="col-lg-9 col-md-7 col-sm-9 col-xs-12  hover logoutAct pull-right">
                    <div className="row hover" onClick={this.LogoutSectionHover.bind(this)}>
                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colorboxbefore hoverText onHoverEffect ">
                        <span className="col-lg-11 nopadding ">
                        {console.log("userImage 331",this.state.userImage)}
                          <img src={this.state.userImage ? this.state.userImage : "/images/person.png"} className="userIcon"/>
                          <label className="mailtext">&nbsp;&nbsp;&nbsp;{this.state.fullname ? this.state.fullname : "UniMandai Admin"}</label>
                          {/* <label className="mailtext">&nbsp;&nbsp;&nbsp;UniMandai Admin</label> */}
                        </span>
                        <span className="textAlignCenter" style={{"marginTop": "4px"}}>
                        </span>
                      </span>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 user-footer showme NOpadding">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding " >
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  headerImageContainer padd0 ">
                          <p className="pull-right fntC1" style={{"cursor":"pointer"}} title="Close"  onClick={this.LogoutSectionHover.bind(this)}>X</p><br/>
                            <div className=" marLeft "  style={{"backgroundImage":`url(`+ (this.state.profileImage ? this.state.profileImage : "/images/person.png")+`)`, "height": "40%", "backgroundSize":"41% 100%","backgroundRepeat": "no-repeat"}}></div>
                          <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 marTop pull-right  padd0 ">
                            <h5 className="nomargin dropmailtext">
                              {this.state.fullname ? this.state.fullname : ""}
                            </h5>
                            <h6 className=" dropmailtext"> {this.state.email ? this.state.email : ""}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="btnDiv col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <span className="">
                          <a className="profileTitle btnpadd" href={"/profile/"+this.state.user_ID}>
                            <button type="button" className="profilebtn">Profile</button>
                          </a>
                        </span> &nbsp;
                        <span className="pull-right">
                          <a className="profileTitle btnpadd" href="/login">
                            <button type="button" className="logoutbtn" onClick={this.logout.bind(this)}>Sign Out</button>
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div id="mySidenav" className="sidenav">
          <Rightsidebar />
        </div>
      </div>
    );
  }
}
/*
href={"/Profile/"+ Meteor.userId()}*/