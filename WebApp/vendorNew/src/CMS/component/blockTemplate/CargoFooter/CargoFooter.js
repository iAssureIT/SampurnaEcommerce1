import React from 'react';
import axios from 'axios';
import './CargoFooter.css';
import jQuery from 'jquery';

export default class CargoFooter extends React.Component {

	render(){
		return(
			<section class="mainBlock col-lg-12 col-md-12">
				<div class=" dark col-lg-12 col-md-12"></div>
				<div class="containerWrapper col-lg-12">
					<div class="row">
						<div class="col-md-12">
							<div class="row">
								<div id="unload-about-2" class="col-md-4 widget_unload-about"><div class="widget">        <div class="about-widget">
            						<div class="logo">
                                    <a itemprop="url" href="https://themes.webinane.com/wp/unload/" title="">
                        <img itemprop="image" src="https://themes.webinane.com/wp/unload/wp-content/uploads/2017/08/wsi-imageoptim-logo.png" alt=""/>
                    </a>
                            </div>
                            <p itemprop="description">Vestibulum id ligula porta felis euismod sem per. Aenean eu leo quam. Pellen tesque orn are sem lacinia quam venenatis. Fusce dap ibus, tellus ac cursus commodo ut fermentu massa. mentum sit amet risus.</p>
                                <ul class="social-btn">
                                    <li>
                                        <a  itemprop="url" href="https://www.facebook.com/people/@/webinane">
                                            <i class="fa fa-facebook"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a itemprop="url" href="https://plus.google.com/+Webinane">
                                            <i class="fa fa-google-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a itemprop="url" href="https://www.instagram.com/webinane/">
                                            <i class="fa fa-instagram"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a itemprop="url" href="https://www.linkedin.com/company/webinane-web-arcade">
                                            <i class="fa fa-linkedin"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a itemprop="url" href="https://twitter.com/webinane">
                                            <i class="fa fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a itemprop="url" href="https://www.youtube.com/channel/UCoTCmNYVO7l35bP3fNDHj5A">
                                            <i class="fa fa-youtube-play"></i>
                                        </a>
                                    </li>
                                </ul>
                        </div>
        </div></div><div id="nav_menu-2" class="col-md-2 widget_nav_menu"><div class="widget"><div class="heading2"><span>Fast And Safe</span><h3>USEFUL LINKS</h3></div><div class="menu-custom2-container"><ul id="menu-custom2" class="menu"><li id="menu-item-416" class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-346 current_page_item menu-item-416"><a href="https://themes.webinane.com/wp/unload/about-us/" aria-current="page">About Us</a></li>
<li id="menu-item-424" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-424"><a href="https://themes.webinane.com/wp/unload/blog-3grid/">Company News</a></li>
<li id="menu-item-417" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-417"><a href="https://themes.webinane.com/wp/unload/service/air-cargo/">Air Cargo</a></li>
<li id="menu-item-415" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-415"><a href="https://themes.webinane.com/wp/unload/event-listing/">Company Events</a></li>
<li id="menu-item-414" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-414"><a href="https://themes.webinane.com/wp/unload/service/door-to-door/">Door To Door</a></li>
</ul></div></div></div><div id="nav_menu-3" class="col-md-2 widget_nav_menu"><div class="widget"><div class="heading2"><span>Fast And Safe</span><h3>SERVICES</h3></div><div class="menu-custom1-container"><ul id="menu-custom1" class="menu"><li id="menu-item-418" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-418"><a href="https://themes.webinane.com/wp/unload/service/cargo-storage/">Door To Door</a></li>
<li id="menu-item-419" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-419"><a href="https://themes.webinane.com/wp/unload/service/ground-2/">Ground</a></li>
<li id="menu-item-420" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-420"><a href="https://themes.webinane.com/wp/unload/service/cargo-air/">Cargo Air</a></li>
<li id="menu-item-421" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-421"><a href="https://themes.webinane.com/wp/unload/service/courier-services/">Courier Services</a></li>
<li id="menu-item-422" class="menu-item menu-item-type-post_type menu-item-object-service menu-item-422"><a href="https://themes.webinane.com/wp/unload/service/fly-anywhere/">Fly Anywhere</a></li>
</ul></div></div></div>
<div id="unload-newsletter-2" class="col-md-4 widget_unload-newsletter">
<div class="widget">        
<div class="widget blue1">
            <div class="text-center heading2">
            	<span>FAST AND SAFE</span>
            	<h3>NEWSLETTER SUBSCRIBE</h3>
            </div>                
            <div class="text-center subscription-form">
                <p itemprop="text-center description">Vestibulum id ligula porta felis euismod sem per. Aenean eu leo quam.</p>
                <div class="widget-notify"></div>
                <form id="widget-newsletter">
                    <input className="col-lg-8 col-lg-offset-2 col-md-8"id="widget-newsletter_mail" type="text" placeholder="Enter Your Email Address"/>
                    <input type="hidden" id="newsletter_key" value="94417044c9"/>
                    	<a title="" href="javascript:void(0)" class="theme-btn footer-newsletter0">
                            <i class="fa fa-paper-plane"></i>SUBMIT NOW</a>
                </form>
            </div>
        </div>
        </div>
        </div>
        </div>
		</div>
					</div>
				</div>
			</section>

			)
	}
}