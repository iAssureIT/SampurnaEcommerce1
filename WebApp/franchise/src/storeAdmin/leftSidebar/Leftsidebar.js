import React,{Component}                              from 'react';
import { render }                                     from 'react-dom';
import $                                              from "jquery";
import { BrowserRouter, Route, Switch,Link  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css'; 
import './Leftsidebar.css';
import './dashboard.css';


export default class AdminDashboard extends Component{

  constructor(props){ 
    super(props);
    this.state = {
      menuValues : {
        ordermanagement : false,
        inventoryData   : false,
        billingDaReportsta     : false,
        reportData      : false,   
        myOrder         : false,     
      }
     
    };
    this.closeIcon   = 'fa-angle-left';
    this.openIcon    = 'fa-angle-down';
    this.activeMenu = this.activeMenu.bind(this)
  }

  componentDidMount(){
    var preferencedata = (localStorage.getItem('preferencedata'));
      const websiteModel = localStorage.getItem("websiteModel");      
      const showLoginAs = localStorage.getItem("showLoginAs");      
    // console.log("preferencedata==>",preferencedata)
    // console.log("websiteModel==>",websiteModel)
    // console.log("showLoginAs==>",showLoginAs)
    this.setState({
      websiteModel: websiteModel
    },()=>{
    //  console.log("websiteModel==>",this.state.websiteModel)
    })
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
   // console.log('event.currentTarget',event.currentTarget);
    event.preventDefault();
    var a =event.currentTarget
  //  console.log("a===",a);
    var pathname = event.currentTarget.getAttribute("data-id"); 
    // console.log('pathname',pathname);
    window.location = pathname
    $(".sidebar-menu .treeview-menu li a").removeClass("active-submenu");
    $(event.currentTarget).addClass("active-submenu");
    // event.currentTarget.href = pathname;
    // var currentEvent =  event.currentTarget
    // var getCurrentUrl = window.location.pathname;
    // localStorage.setItem("getCurrentUrl", pathname);
    // localStorage.setItem("currentEvent",currentEvent);
    // console.log("getCurrentUrl",getCurrentUrl);
    // console.log("currentURL",localStorage.getItem("currentURL"));
  }

  openSubmenu(e){
    // console.log("e===",e.currentTarget.getAttribute('data-key'));
    var key = e.currentTarget.getAttribute('data-key');
    let {menuValues} = this.state;
    Object.keys(menuValues).map((data) => {
      menuValues[data] = (data===key) ? !menuValues[key] :false;
      if($(e.currentTarget).next('ul').is(':visible')){
        $(e.currentTarget).parent(".treeview").removeClass('menu-open');
        $(e.currentTarget).next('ul').css("display","none");
      }else{
        $(".treeview").removeClass('menu-open');
        $(e.currentTarget).parent(".treeview").addClass('menu-open');
        $('.treeview-menu').css("display","none");
        $(e.currentTarget).next('ul').css("display","block");
      }
      // console.log("menuvalues====",this.state.menuValues);
    });
    this.setState({menuValues});
    $('.singleTreeview').removeClass('active')
  }
  openMenu = (key) => {    
    let {menuValues} = this.state;
    Object.keys(menuValues).map((data) => {
      menuValues[data] = (data===key) ? !menuValues[key] :false;
      $(this).parent().addClass('menu-open');
      $(this).find('.treeview-menu').css("display","block");
     // console.log("menuvalues====",this.state.menuValues);
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
    /*
    var x = document.getElementById(targetId);
    var targetId = $(event.currentTarget).children('.activeClass').attr("id");
    var getValue = x.getAttribute('aria-expanded');
    $('.activeClass').removeClass('in');
    $(event.currentTarget).children('.activeClass').addClass('in')
    */
  } 

  clickDashboard(event){
    $('.treeview').not(event.currentTarget).removeClass('menu-open')
    $('.treeview-menu').css({'display':'none'})
    $(event.currentTarget).addClass('active')

  }

  render(){
    let {dashboard,ordermanagement,inventoryData,myOrder,billingData,reportData} = this.state.menuValues;
    return(
      <aside className="main-sidebar control-sidebar sidebarWrapper scrollBox">
        <section className="sidebar noPadLR sidebar-menu-wrapper">
          <ul className="sidebar-menu" data-widget="tree">
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/dashboard"  title="Dashboard" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-dashboard" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Dashboard</span>
              </a>
            </li>

            <li className="treeview" >
              {/* <a href="JavaScript:void(0);" onClick={(e)=>this.openMenu("ordermanagement")} title="Order Management"> */}
              <a href="JavaScript:void(0);" data-key="ordermanagement" onClick={this.openSubmenu.bind(this)} title="Order Management">
                <i className="fa fa-file" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Order Management</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(ordermanagement?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/allorders" data-id="/allorders" onClick={this.activeMenu.bind(this)} title="All Orders">
                    <i className="fa fa-circle-o dashr" />All Orders
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/new-orders-list" data-id="/new-orders-list" title="New Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />New Order List
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/verified-orders-list" data-id="/verified-orders-list" title="Verified Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Verified Order List
                  </a> 
                </li>        
                <li className="noPadLR"> 
                  <a href="/packed-orders-list" data-id="/packed-orders-list" title="Packed Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Packed Order List
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/inspected-orders-list" data-id="/inspected-orders-list" title="Inspected Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Inspected Order List
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/approved-orders-list" data-id="/approved-orders-list" title="Approved Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Approved Order List
                  </a> 
                </li>  

                <li className="noPadLR"> 
                  <a href="/dispatched-orders-list" data-id="/dispatched-orders-list" title="Dispatched Order List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Dispatched Order List
                  </a> 
                </li>  

              </ul>
            </li>

            <li className="treeview" >
              <a href="JavaScript:void(0);" data-key="inventoryData" onClick={this.openSubmenu.bind(this)} title="Inventory Management ">
                <i className="fa fa-file" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Inventory Management </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(inventoryData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >    
                <li className="noPadLR">
                  <a href="/franchise-product-stock" data-id="/franchise-product-stock" title="Franchise Product Stock" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                    <span className="sidebarMenuTitle">Products Current Stock</span>
                  </a>
                </li>
                <li className="noPadLR"> 
                  <a href="/franchise-allowable-pincode" data-id="/franchise-allowable-pincode" title="Franchise Allowable Pincode" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Allowable Pincode
                  </a> 
                </li>  
              </ul>
            </li>       

            <li className="treeview" >
              <a href="JavaScript:void(0);" data-key="myOrder" onClick={this.openSubmenu.bind(this)} title="My Order">
                <i className="fa fa-file" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">My Orders </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(myOrder?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >    
                <li className="noPadLR">
                  <a href="/franchise-shopping-list" data-id="/franchise-shopping-list" title="Franchise Shopping List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                    <span className="sidebarMenuTitle">Add Order</span>
                  </a>
                </li>
                <li className="noPadLR"> 
                  <a href="/franchise-order-summary" data-id="/franchise-order-summary" title="Finished Goods Inward" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Order Summary
                  </a> 
                </li>  
              </ul>
            </li>   
            <li className="treeview" >
              <a href="JavaScript:void(0);" data-key="myOrder" data-key="billingData" onClick={this.openSubmenu.bind(this)} title="Billing">
                <i className="fa fa-money" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Billing Management </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(billingData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >    
                <li className="noPadLR">
                  <a href="/franchise-billing" data-id="/franchise-billing" title="New Bill" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                    <span className="sidebarMenuTitle">New Bill</span>
                  </a>
                </li>
                <li className="noPadLR"> 
                  <a href="/return-bill" data-id="/return-bill" title="Return Products" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Return Products
                  </a> 
                </li>  
              </ul>
            </li>           

            <li className="treeview" >
              <a href="JavaScript:void(0);" data-key="reportData" onClick={this.openSubmenu.bind(this)} title="Reports">
                <i className="fa fa-book" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Reports </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(reportData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >    
                <li className="noPadLR">
                  <a href="/report" data-id="/report" title="Sales Report" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                    <span className="sidebarMenuTitle">Sales Report</span>
                  </a>
                </li>
                <li className="noPadLR"> 
                  <a href="/category-wise-reports" data-id="/category-wise-reports" title="Category Wise Sales Report" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Category Wise Sales Report
                  </a> 
                </li>  
              </ul>
            </li>
            
          </ul>
        </section>
      </aside>
    );
  }
}
