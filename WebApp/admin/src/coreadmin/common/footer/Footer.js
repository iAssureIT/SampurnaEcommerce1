import React,{Component}  from 'react';
import { render }         from 'react-dom';
import $                  from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Footer.css';

export default class Header2 extends Component{
  componentDidMount(){
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
      // if($('body').hasClass('sidebar-collapse')){
      //   $('.Copyright').removeClass('paddingLeft145');
      //   $('.Copyright').addClass('paddingLeft145oooo')

      // }else{
      //   $('.Copyright').addClass('paddingLeft145')
      // }
  }
    
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();

  }
  render(){
    return(
        <footer className="main-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="pull-right hidden-xs hidden-sm marginRight40">
              <strong className="WebsiteName"> Designed & Developed By <a href="http://iassureit.com/" className="comnm" target="_blank">iAssure International Technologies Pvt.Ltd.</a></strong>
                
            </div>
            <div className="pull-left hidden-xs hidden-sm Copyright marginLeft145">
              <strong className="footerTwoMargin ">Copyright &copy; 2021 <a href="http://iassureit.com">iAssureIT</a>.</strong>  All rights
              reserved.
            </div>
        </footer>
    );
  }
}