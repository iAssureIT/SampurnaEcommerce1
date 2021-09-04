import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch,Link,location } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from "jquery";

// import Header from '../header/Header.js'
import './Leftsidebar.css';
import './Dashboard.css';

export default class Leftsidebar extends Component{
  
  constructor(props) {
   super(props);
   this.state = {
      menuValues : {
        productData       : false,
        orderData         : false,
        reportData        : false,
        shipingData     : false,
       
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
    // console.log('event.currentTarget',event.currentTarget);
    event.preventDefault();
    var a =event.currentTarget
    var pathname = event.currentTarget.getAttribute("data-id"); 
    // console.log('pathname',pathname);
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
    let {dashboard,productData,orderData,reportData,shipingData} = this.state.menuValues;
   
    return(
      <div>
        <aside className="main-sidebar control-sidebar sidebarWrapper scrollBox">
          <section className="sidebar noPadLR sidebar-menu-wrapper">
            <ul className="sidebar-menu" data-widget="tree" >
              <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/dashboard"  title="Dashboard" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-dashboard" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Dash board</span>
              </a>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("productData")} title="Product Management">
                <i className="fa fa-file" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Product Management</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(productData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >   
                <li className="noPadLR"> 
                  <a href="/add-product" data-id="/add-product" title="Products" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Add Products
                  </a> 
                </li> 
                <li className="noPadLR"> 
                  <a href="/product-list" data-id="/product-list" onClick={this.activeMenu.bind(this)} title="productlist">
                    <i className="fa fa-circle-o dashr" />Product List
                  </a> 
                </li>
                <li className="noPadLR"> 
                  <a href="/product-upload" data-id="/product-upload" onClick={this.activeMenu.bind(this)} title="productUpload">
                    <i className="fa fa-circle-o dashr" />Product Bulk Upload
                  </a> 
                </li>   
                <li className="noPadLR"> 
                  <a href="/update_product-upload" data-id="/update_product-upload" onClick={this.activeMenu.bind(this)} title="update product">
                    <i className="fa fa-circle-o dashr" />Bulk Update
                  </a> 
                </li>   
                 <li className="noPadLR"> 
                  <a href="/file-wise-product-list" data-id="/file-wise-product-list" onClick={this.activeMenu.bind(this)} title="update product">
                    <i className="fa fa-circle-o dashr" />File Wise Product List
                  </a> 
                </li>   
              </ul>
            </li>

            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("orderData")} title="order Management">
                <i className="fa fa-book" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle"> Order Management</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(orderData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >   
                <li className="noPadLR"> 
                  <a href="/allorders" data-id="/allorders" title="/Allorders" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />All Orders
                  </a> 
                </li> 
                <li className="noPadLR"> 
                  <a href="/new-orders-list" data-id="/new-orders-list" onClick={this.activeMenu.bind(this)} title="neworderslist">
                    <i className="fa fa-circle-o dashr" />New Order List
                  </a> 
                </li>
                <li className="noPadLR"> 
                  <a href="/verified-orders-list" data-id="/verified-orders-list" onClick={this.activeMenu.bind(this)} title="verifiedorderslist">
                    <i className="fa fa-circle-o dashr" />Verified Order List
                  </a> 
                </li>   
                <li className="noPadLR"> 
                  <a href="/packed-orders-list" data-id="/packed-orders-list" onClick={this.activeMenu.bind(this)} title="packed orders list">
                    <i className="fa fa-circle-o dashr" />Packed Order List
                  </a> 
                </li>   
                 <li className="noPadLR"> 
                  <a href="/inspected-orders-list" data-id="/inspected-orders-list" onClick={this.activeMenu.bind(this)} title="inspectedorderslist">
                    <i className="fa fa-circle-o dashr" />Inspected Order List
                  </a> 
                </li>   
                <li className="noPadLR"> 
                  <a href="/approved-orders-list" data-id="/new-orders-list" onClick={this.activeMenu.bind(this)} title="approvedorderslist">
                    <i className="fa fa-circle-o dashr" />Approved Order List
                  </a> 
                </li>
                <li className="noPadLR"> 
                  <a href="/dispatched-orders-list" data-id="/verified-orders-list" onClick={this.activeMenu.bind(this)} title="dispatchedorderslist">
                    <i className="fa fa-circle-o dashr" />Dispatched Order List
                  </a> 
                </li>   
                <li className="noPadLR"> 
                  <a href="/delivered-orders-list" data-id="/delivered-orders-list" onClick={this.activeMenu.bind(this)} title="Delivery Initiated Orders">
                    <i className="fa fa-circle-o dashr" />Delivery Initiated Orders
                  </a> 
                </li>   
                 <li className="noPadLR"> 
                  <a href="/delivered-orders-list" data-id="/delivered-orders-list" onClick={this.activeMenu.bind(this)} title="Delivered Order List">
                    <i className="fa fa-circle-o dashr" />Delivered Order List
                  </a> 
                </li>   
              </ul>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("reportData")} title="Reports">
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Reports</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(reportData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/productreview" data-id="productreview" onClick={this.activeMenu.bind(this)} title="Product Review">
                    <i className="fa fa-circle-o dashr" />Product Review
                  </a> 
                </li>  
               
              </ul>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("shipingData")} title="shiping">
                <i className="fa fa-users" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Shipping Management</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(shipingData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/productreview" data-id="productreview" onClick={this.activeMenu.bind(this)} title="Product Review">
                    <i className="fa fa-circle-o dashr" />Product Review
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
