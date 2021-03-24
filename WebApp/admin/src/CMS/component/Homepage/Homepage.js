import React from 'react';/*


import HomepageBanner from '../blockTemplate/HomepageBanner/HomepageBanner.js';
import Homepagebuttononimage from '../blockTemplate/Homepagebuttononimage/Homepagebuttononimage.js';
import Homepagefeature from '../blockTemplate/Homepagefeature/Homepagefeature.js';
import Homepageintrovideo from '../blockTemplate/Homepageintrovideo/Homepageintrovideo.js';
import HomepageInvisalign from '../blockTemplate/HomepageInvisalign/HomepageInvisalign.js';
import Homepagepromotions from '../blockTemplate/Homepagepromotions/Homepagepromotions.js';
import Footer from '../blockTemplate/Footer/Footer.js';
import BannerContactUs from '../blockTemplate/BannerContactUs/BannerContactUs.js';
import CUform from '../blockTemplate/CUform/CUform.js';
import ContactShopList from '../blockTemplate/ContactShopList/ContactShopList.js';
import CUMap from '../blockTemplate/CUMap/CUMap.js';
import HeaderTrueU from '../blockTemplate/HeaderTrueU/HeaderTrueU.js';
import WhoWeAre from '../blockTemplate/WhoWeAre/WhoWeAre.js';
*/
// import CustomRepHiringModel from '../blockTemplate/CustomRepHiringModel/CustomRepHiringModel.js';
// import CustomGetStarted from '../blockTemplate/CustomGetStarted/CustomGetStarted.js';
import WantStartProject from '../blockTemplate/WantStartProject/WantStartProject.js';
import WhatWedo from '../blockTemplate/WhatWedo/WhatWedo.js';
import ReactNativeWebApp from '../blockTemplate/ReactNativeWebApp/ReactNativeWebApp.js';
import TechnologyStacksWebAppDev from '../blockTemplate/TechnologyStacksWebAppDev/TechnologyStacksWebAppDev.js';
// import StaffServiece from '../blockTemplate/StaffServiece/StaffServiece.js';
// import StaffBanner from '../blockTemplate/StaffBanner/StaffBanner.js';
// import CustNationalAwards from '../blockTemplate/CustNationalAwards/CustNationalAwards.js';
// import Strategy from '../blockTemplate/Strategy/Strategy.js';
import Portfolio from '../blockTemplate/Portfolio/Portfolio.js';
import KeyFeaturesWebApp from '../blockTemplate/KeyFeaturesWebApp/KeyFeaturesWebApp.js';

// import WebSiteNextLevel from '../blockTemplate/WebSiteNextLevel/WebSiteNextLevel.js';

// import AboutBanner from '../blockTemplate/AboutBanner/AboutBanner1.js';

export default class Homepage extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{/*<HeaderTrueU/>
				<HomepageBanner/>
				<WhoWeAre/>
				<Homepagebuttononimage/>
				<Homepagefeature/>
				<Homepageintrovideo/>
				<HomepageInvisalign/>
				<Homepagepromotions/>
				<Footer/>*/}
				{/*<BannerContactUs/>
				<CUform/>
				<ContactShopList/>
				<CUMap/>*/}
				{/* <StaffBanner/>
				<CustomRepHiringModel/>
				
				<StaffServiece/>
				<CustNationalAwards />
				<Strategy />
				
				<WebSiteNextLevel /> */}

				{/* <AboutBanner/> */}
				<Portfolio />
				{/* <CustomGetStarted/> */}
				<WantStartProject/>
				<WhatWedo/>
				<ReactNativeWebApp/>
				<TechnologyStacksWebAppDev/>
				<KeyFeaturesWebApp/>
				

			</div>
		);
	}
}
