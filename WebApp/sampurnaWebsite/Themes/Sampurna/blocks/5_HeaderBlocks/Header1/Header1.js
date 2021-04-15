import React, {Component} 	from 'react';
import $     				from 'jquery';
import gsap  				from 'gsap';


import S from './Header1.module.css';


export default class Header1 extends Component{

	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		const open 	= document.querySelector('.barWrapper .bars');
		const close = document.querySelector('.close');
		var tl 		= gsap.timeline({ defaults: { duration: 0.08, ease: 'expo.inOut' } });

		open.addEventListener('click', () => {
			if(tl.reversed()){
				tl.play();
			}else{
				tl.to('.navBarMain', { right: 0 })
					.to('navBarMain', { height: '100vh' }, '-=.1')
					.to('.navBarMain .navBarContentWrapper .navBarInner .navBarInnerContent', { opacity: 1, pointerEvents: 'all', stagger: .2 }, '-=.3')
					.to('.close', { opacity: 1, pointerEvents: 'all' }, "-=.1")
					.to('.navBarMain h2', { opacity: 1 }, '-=1');
			}
		});
		close.addEventListener('click', () => {
			tl.reverse();
		});
	}

	render(){
		return(
			<section className={"col-12 headerWrapper "+S.headerWrapper} id="navbar">
				<img className={"headerLogo lazyload img-responsive "+S.headerLogo} src="/images/iAssureIT.svg" loading="lazy" alt="iAssureIT Logo"/>
				<div className={"barWrapper "+S.barWrapper}>
					<div className={"bars "+S.bars}></div>
				</div>
				<div className={"navBarNewWrapper "+S.navBarNewWrapper}>
					<nav className={"navBarMain "+S.navBarMain}>
						<div className={"close "+S.close}>
							<div className={"innerClose "+S.innerClose}></div>
						</div>
						<ul className={"navBarContentWrapper "+S.navBarContentWrapper}>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/home-page" 			  aria-label="home-page">HOME</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/about-us" 			  aria-label="about-us">ABOUT US</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/services" 			  aria-label="services">SERVICES</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/web-app-development" 	  aria-label="web-app-development">WEB APPLICATION</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/mobile-app-development" aria-label="mobile-app-development">MOBILE APP</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/ecommerce"			  aria-label="ecommerce">eCOMMERCE PORTAL</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/website-development"	  aria-label="website-development">WEBSITE DEVELOPMENT</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/staff-augmentation"	  aria-label="staff-augmentation">STAFF AUGMENTATION</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/ui-ux-design"			  aria-label="ui-ux-design">UI/UX DESIGN</a></li>
							<li className={"navBarInner "+S.navBarInner}><a className={"navBarInnerContent "+S.navBarInnerContent} href="/contact-us"			  aria-label="contact-us">CONTACT US</a></li>
						</ul>
					</nav>
				</div>
			</section>
		);
	}
}