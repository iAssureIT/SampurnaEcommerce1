import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// import Header from '../header/Header.js'
import './Leftsidebar.css';
import './dashboard.css';

export default class Leftsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      menuValues : {
       
        Shipment             : false,
        ReportsData             : false,
      }
    };
    this.closeIcon   = 'fa-angle-left';
    this.openIcon    = 'fa-angle-down';
    this.activeMenu = this.activeMenu.bind(this)
  }
   
  componentDidMount(){
     
    if (!$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
      $("html,body").scrollTop(0);
      var getCurrentUrl = window.location.pathname;
      // console.log("getCurrentUrl",getCurrentUrl);

    $(".sidebar-menu .singleTreeview a").filter(function(a, b){
      if($(this).attr('href') === getCurrentUrl){
        // console.log("b",b);
        // console.log($(this).attr('href') === getCurrentUrl);
        $(b).addClass('active');
        // console.log(b);
      }
    })
     $(".sidebar-menu .treeview li a").filter(function(a, b){
      if($(this).attr('href') === getCurrentUrl){
        $(b).addClass('active');
        $($($(b).parent()).parent()).parent().addClass('menu-open');
        ($($(b).parent()).parent()).css("display", "block");
        // $($($($($($($(b).parent()).parent()).children('menu-open')).children("pull-right-container")).children("i"))).addClass("fa-angle-down");
      }
    })
  }  
  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }
  activeMenu(event){
    console.log('event.currentTarget',event.currentTarget);
    event.preventDefault();
    var a =event.currentTarget
    var pathname = event.currentTarget.getAttribute("data-id"); 
    console.log('pathname',pathname);
    window.location = pathname
    $(".sidebar-menu .treeview-menu li a").removeClass("active-submenu");
    $(event.currentTarget).addClass("active-submenu");
   
  }  
   openMenu = (key) => {
    let {menuValues} = this.state;
    Object.keys(menuValues).map((data) => {
      menuValues[data] = (data==key) ? !menuValues[key] :false;
    });
    this.setState({menuValues});
    $('.singleTreeview').removeClass('active')
  }
  eventclk1(event){
    $(event.currentTarget).children(".menuContent").children(".rotate").toggleClass("down");
    var currentEvent =  event.currentTarget
    var getCurrentUrl = window.location.pathname;
    // console.log("getCurrentUrl",getCurrentUrl);
    localStorage.setItem("currentURL",getCurrentUrl)
    localStorage.setItem("currentEvent",currentEvent)
  
  } 
clickDashboard(event){
    $('.treeview').not(event.currentTarget).removeClass('menu-open')
    $('.treeview-menu').css({'display':'none'})
    $(event.currentTarget).addClass('active')

  }

  render(){
     let {dashboard,Shipment,ReportsData} = this.state.menuValues;

    return(
      <div>
         <aside className="main-sidebar control-sidebar sidebarWrapper scrollBox">
          <section className="sidebar noPadLR sidebar-menu-wrapper">
            <ul className="sidebar-menu" data-widget="tree">

             {/* <div className="sidebar-header">
                <h4 className="text-center"><b><img className="slidlogo1" src="/images/anasLogo.png"/></b></h4>
                <strong><img className="slidlogo" src="images/furniture-logo1.png"/></strong>
              </div>*/}
              
              <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
                <a href="/dashboard"  title="Dashboard" onClick={()=>this.openMenu("dashboard")}>
                  <i className="fa fa-dashboard" aria-hidden="true"></i>
                  <span className="sidebarMenuTitle">Dash board</span>
                </a>
              </li>
              <li className="treeview" >
                <a href="JavaScript:void(0);" onClick={()=>this.openMenu("Shipment")} title=" Shipment Tracking">
                  <i className="fa fa-file" aria-hidden="true"></i>
                  <span className="smsidenames sidebarMenuTitle"> Shipment Tracking</span>
                  <span className="pull-right-container">
                    <i className={"fa pull-right menu-icon-toggle "+(Shipment?this.openIcon:this.closeIcon)} />
                  </span>
                </a>
                <ul className="treeview-menu" >                    
                  <li className="noPadLR"> 
                    <a href="/ba-order-list" data-id="/ba-order-list" onClick={this.activeMenu.bind(this)} title="ba order list">
                      <i className="fa fa-circle-o dashr" />ba order list
                    </a> 
                  </li>  
                </ul>
              </li>
              <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
                <a href="/"  title="Agreement Management" onClick={()=>this.openMenu("dashboard")}>
                  <i className="fa fa-ticket" aria-hidden="true"></i>
                  <span className="sidebarMenuTitle">Agreement Management</span>
                </a>
              </li>

              <li className="treeview" >
                <a href="JavaScript:void(0);" onClick={()=>this.openMenu("ReportsData")} title=" Reports">
                  <i className="fa fa-line-chart" aria-hidden="true"></i>
                  <span className="smsidenames sidebarMenuTitle"> Reports</span>
                  <span className="pull-right-container">
                    <i className={"fa pull-right menu-icon-toggle "+(ReportsData?this.openIcon:this.closeIcon)} />
                  </span>
                </a>
                <ul className="treeview-menu" >                    
                  <li className="noPadLR"> 
                    <a href="/report" data-id="/report" onClick={this.activeMenu.bind(this)} title="ba order list">
                      <i className="fa fa-circle-o dashr" />Sales Report
                    </a> 
                  </li>  
                   <li className="noPadLR"> 
                    <a href="/report" data-id="/report" onClick={this.activeMenu.bind(this)} title="ba order list">
                      <i className="fa fa-circle-o dashr" />Category Wise Sales Report
                    </a> 
                  </li>  
                </ul>
              </li> 
            </ul>
          </section>
        </aside>
      </div>
    );
  }
}
