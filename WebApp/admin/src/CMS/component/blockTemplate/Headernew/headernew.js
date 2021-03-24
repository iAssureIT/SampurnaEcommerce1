import React from 'react';
import "./headernew.css";
import $ from "jquery";
import gsap from 'gsap';

export default class Headernew extends React.Component {


	constructor(props) {
		super(props);
	}
		handleContent(event){
		$(document).ready(function(){
		  $(".customSpan").click(function(){
		  $(".openMenu").addClass("openMenu1");
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
	componentDidMount(){	


		
		const open = document.querySelector('.container');
		const close = document.querySelector('.close');
		var tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'expo.inOut' } });
		open.addEventListener('click', () => {
			if (tl.reversed()) {
				tl.play();
			} else {
				tl.to('nav', { right: 0 })
					.to('nav', { height: '100vh' }, '-=.1')
					.to('nav ul li a', { opacity: 1, pointerEvents: 'all', stagger: .2 }, '-=.3')
					.to('.close', { opacity: 1, pointerEvents: 'all' }, "-=.1")
					.to('nav h2', { opacity: 1 }, '-=1');
			}
		});

		close.addEventListener('click', () => {
			tl.reverse();
		});
		
	}
	

	render() {
		return (
			<div className="HeadernewWrapper">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoBox headernewlogobox">
					    <a href="/" ><img className="logoab img-responsive" src="/images/Logo.png" alt="iAssureIT"/></a>
					</div>
				{/* <div id="myNav" className="openMenu">
					<a href="#!" className="closebtn1">&times;</a>
					<div className="topm text-center">
				  		<a href="/iAssureIT/home-page">
							<h1 className="home">Home</h1>
						</a>
					  	
					  	<a href="/iAssureIT/about-us">
							<h1 className="aboutus">About Us </h1>
						</a>
						<a href="/iAssureIT/services">						
							<h1 className="Services">Services</h1>
						</a>
						<a href="/iAssureIT/ecommerce">						
							<h1 className="Services">eCommerce</h1>
						</a>
						<a href="/blogs">						
							<h1 className="Services">Blogs</h1>
						</a>
						
						<a href="/iAssureIT/contact-us">
							<h1 className="aboutus">Contact Us </h1>
						</a>
					</div>
				</div> */}
		<div class="container">
			<div class="bars"></div>
		</div>

		<div className="NavBarnewWrapper">
			<nav>
				
				<div class="close">
					<div></div>
				</div>

				<ul >
					<li><a className="home"href="/iAssureIT/home-page">HOME</a></li>
					<li><a className="Services"href="/iAssureIT/services">SERVICES</a></li>
					<li><a className="aboutus"href="/iAssureIT/about-us">ABOUT-US</a></li>
					<li><a className="aboutus"href="/iAssureIT/contact-us">CONTACT-US</a></li>
					<li><a className="Services"href="/iAssureIT/ecommerce">eCOMMERCE</a></li>
					<li><a className="aboutus"href="/iAssureIT/">WEB-DEVLOPMENT</a></li>
					<li><a className="aboutus"href="/iAssureIT/">STAFF-AUGUMENTATION</a></li>
					
					

				</ul>
			</nav>
		</div>
	
		
	
				{/* <span className="customSpan pull-right" onClick={this.handleContent.bind(this)} >&#9776;</span> */}
				
			</div>
		);
	}
}
