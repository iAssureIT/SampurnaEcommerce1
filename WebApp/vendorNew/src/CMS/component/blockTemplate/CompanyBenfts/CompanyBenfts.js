import React from 'react';
import axios from 'axios';
import './CompanyBenfts.css';
import jQuery from 'jquery';

export default class CompanyBenfts extends React.Component {
	componentDidMount(){
			jQuery(document).ready(function ($) {
		'use strict';

		$('#toggle0 .content').hide();
		$('#toggle0 h3:first').addClass('active').next().slideDown(500).parent().addClass("activate");
		$('#toggle0 h3').on("click", function () {
		if ($(this).next().is(':hidden')) {
		$('#toggle0 h3').removeClass('active').next().slideUp(500).removeClass('animated zoomIn').parent().removeClass("activate");
		$(this).toggleClass('active').next().slideDown(500).addClass('animated zoomIn').parent().toggleClass("activate");
		return false;
		}
		});
		});
	}

	render(){
		return(

			<div class="col-lg-10 col-lg-offset-1 col-md-12 mycolumn column ">
				<div class="text-center title2 col-lg-12">
					<strong>What People Says About Us</strong>
					<h2>COMPANY BENIFITS</h2>
				</div>
				<div class="toggle" id="toggle0">
					<div class="toggle-item active activate">
						<h3 class="active">
							<i class="fa fa-reddit-alien"></i>
							Using This Dedicated Purpose Theme?
							<span><i class="fa fa-angle-up"></i></span>
						</h3>
						<div class="mycontent animated zoomIn" style={{display:'block'}}>
							<div class="simple-text">
								<p>Suspendisse potenti. Maecenas dapibus ac tellus sed pulvinar estibulum bib volutpat. Sociis, eget mollis, exercitationem fames.</p>
							</div>
						</div>
					</div>
					<div class="toggle-item ">
						<h3 class="">
							<i class="fa fa-bell"></i>
							Business Niche Or Creative Style?
							<span><i class="fa fa-angle-up"></i></span>
						</h3>
						<div class="mycontent" style={{display:'none'}} >
							<div class="simple-text">
								<p>Suspendisse potenti. Maecenas dapibus ac tellus sed pulvinar estibulum bib volutpat. Sociis, eget mollis, exercitationem fames.</p>
							</div>
						</div>
					</div>
					<div class="toggle-item ">
						<h3 class="">
							<i class="fa fa-modx"></i>
							Creative And Corporate Industries?
							<span><i class="fa fa-angle-up"></i></span>
						</h3>
						<div class="mycontent" style={{display:'none'}}>
							<div class="simple-text">
								<p>Suspendisse potenti. Maecenas dapibus ac tellus sed pulvinar estibulum bib volutpat. Sociis, eget mollis, exercitationem fames.</p>
							</div>
						</div>
					</div>
				</div>
		</div>

			)
	}
}