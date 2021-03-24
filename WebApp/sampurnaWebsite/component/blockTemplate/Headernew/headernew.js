import React from 'react';
import css from "./headernew.module.css";
import $ from "jquery"; //for next.js

export default class Headernew extends React.Component {


	constructor(props) {
		super(props);
	}
	handleContent(event){
		console.log("handleContent",event);
		$(document).ready(function(){
		  $(".customSpan").click(function(){
		  $(".openMenu").addClass("openMenu1 "+css.openMenu1);
		});
		$(".closebtn1").click(function(){ 
		  $(".openMenu").fadeOut().removeClass("openMenu1");
		  	/*window.location.reload(true);*/
		});
		  
		  /*$("#home").hover(function(){
		  $(".openMenu").addClass("homehover");
		  
		  });
		  $("#Services").hover(function(){
		  $(".openMenu").addClass("Serviceshover");
		  
		  });
		   $("#aboutus").hover(function(){
		  $(".openMenu").addClass("aboutushover");
		  
		  });
		   $("#portfolio").hover(function(){
		  $(".openMenu").addClass("portfoliohover");
		  
		  }); $("#contactus").hover(function(){
		  $(".openMenu").addClass("contactushover");
		  
		  });*/
		});


	}

	render() {
		return (
			<div>
				<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 logoBox headernewlogobox "+css.headernewlogobox}>
					    <a href="/" aria-label="link"><img loading="lazy" className={"lazyload logoab img-responsive "+css.logoab} src="/images/iAssureIT.svg" alt="iAssureIT"/></a>
					</div>
				<div id="myNav" className={"openMenu "+css.openMenu}>
					<a href="#!" aria-label="closebtn1" className={"closebtn1 "+css.closebtn1}>&times;</a>
					<div className={"topm text-center "+css.topm}>
				  		<a href="/home-page" aria-label="home-page">
							<h1 className="home">Home</h1>
						</a>
					  	
					  	<a href="/about-us" aria-label="about-us">
							<h1 className="aboutus">About Us </h1>
						</a>
						<a href="/services" aria-label="services">						
							<h1 className="Services">Services</h1>
						</a>
						<a href="/ecommerce" aria-label="eCommerce">						
							<h1 className="Services">eCommerce</h1>
						</a>{/*
						<a href="/blogs">						
							<h1 className="Services">Blogs</h1>
						</a>*/}
						
						<a href="/contact-us" aria-label="contact-us">
							<h1 className="aboutus">Contact Us </h1>
						</a>
					</div>
				</div>
				<span className={"customSpan pull-right "+css.customSpan} onClick={this.handleContent.bind(this)} >&#9776;</span>
				
			</div>
		);
	}
}
