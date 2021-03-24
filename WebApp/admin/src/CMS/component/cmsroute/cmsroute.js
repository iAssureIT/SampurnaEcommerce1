import React, {Component} from 'react';


import Footer from './component/common/Footer/Footer';
import Header from './component/common/Header/Header';
import Sidebar from './component/common/Sidebar/Sidebar';

export const CmsLayouts = ({main})=>(
	<div className="container-fluid">
		<div className="col-lg-2 col-md-2 col-sm-2 col-xs-12"> 
			<Sidebar />
		</div>

		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-12"> 
			<Header />
		</div>
		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-12"> 
			<div className="contentWrapper">
				{main}
			</div>
		</div>

		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-12"> 
			<Footer />
		</div>
	</div>
);