import React,{useState,useEffect}      from 'react';
import axios                           from 'axios';
import Header                          from '../5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer                          from '../6_FooterBlocks/Footer/Footer.js';
import Banner                          from '../3_BannerManagement/Banner/Banner.js';
import SectionBlock                    from '../11_SectionCatgBlock/SectionCatg/SectionBlock.js';
import CategoryBlock                   from '../11_SectionCatgBlock/SectionCatg/CategoryBlock.js';
import SubCategoryBlock                from '../11_SectionCatgBlock/SectionCatg/SubCategoryBlock.js';
import DealsBlock                      from '../12_DealsBlock/DealsBlock/DealsBlock.js';
import ProductCarouselBlock            from '../10_eCommerceBlocks/ProductCarousel/ProductCarouselBlock.js';
import Style                           from './HomePage.module.css';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			SectionGroupSettings : {
				"blockApi" : "/api/sections/get/list_by_url",
				"showCarousel" : true,
				"displayItemInCarousel" : 6,
				"totalProducts" : 12,
				"showTitle" : false,
				"sectionUrl" : "all",
				"categoryUrl" : "all",
				"subCategoryUrl" : "all",
				"showOnlySection" : true,
				"showOnlyCategory" : false,
				"showOnlyBrand" : false,
				"showOnlySubCategory" : false,
				"numOfRows" : 2,
				"numOfItemPerRow" : 6,
				"noOfItemPerLGRow" : 4,
				"noOfItemPerMDRow" : 4,
				"noOfItemPerSMRow" : 4,
				"noOfItemPerXSRow" : 2
			},
			superMarketDealSettings : { 
				"blockTitle" : "Lorem Ipsum",
				"blockApi" : "/api/deals/get/list",
				"section" : "Supermarket",
				"category" : "all",
				"subCategory" : "all",
				"showOnlySection" : true,
				"showOnlyCategory" : false,
				"showOnlyBrand" : false,
				"showOnlySubCategory" : false
			},
		
			supermarketGroupSettings : {
				"blockApi" : "/api/sections/get/list_by_url",
				"showCarousel" : true,
				"displayItemInCarousel" : 6,
				"totalProducts" : 12,
				"showTitle" : true,
				"sectionUrl" : "supermarket",
				"categoryUrl" : "all",
				"subCategoryUrl" : "all",
				"showOnlySection" : false,
				"showOnlyCategory" : true,
				"showOnlyBrand" : false,
				"showOnlySubCategory" : false,
				"numOfRows" : 2,
				"numOfItemPerRow" : 6,
				"noOfItemPerLGRow" : 4,
				"noOfItemPerMDRow" : 4,
				"noOfItemPerSMRow" : 4,
				"noOfItemPerXSRow" : 2
			},
			pharmacyGroupSettings : {
				"blockApi" : "/api/sections/get/list_by_url",
				"showCarousel" : true,
				"displayItemInCarousel" : 6,
				"totalProducts" : 12,
				"showTitle" : true,
				"sectionUrl" : "pharmacy",
				"categoryUrl" : "all",
				"subCategoryUrl" : "all",
				"showOnlySection" : false,
				"showOnlyCategory" : true,
				"showOnlyBrand" : false,
				"showOnlySubCategory" : false,
				"numOfRows" : 2,
				"numOfItemPerRow" : 6,
				"noOfItemPerLGRow" : 4,
				"noOfItemPerMDRow" : 4,
				"noOfItemPerSMRow" : 4,
				"noOfItemPerXSRow" : 2
			},
			subCategoryGroupSettings : {
				"blockApi"        : "/api/sections/get/list_by_url",
				"showCarousel"    : true,
				"displayItemInCarousel" : 6,
				"totalProducts"    : 12,
				"showTitle"        : true,
				"sectionUrl"       : "pharmacy",
				"categoryUrl"      : "baby-&-maternity",
				"subCategoryUrl"   : "all",
				"showOnlySection"  : false,
				"showOnlyCategory" : false,
				"showOnlyBrand"    : false,
				"showOnlySubCategory" : true,
				"numOfRows"        : 2,
				"numOfItemPerRow"  : 6,
				"noOfItemPerLGRow" : 4,
				"noOfItemPerMDRow" : 4,
				"noOfItemPerSMRow" : 4,
				"noOfItemPerXSRow" : 2
			},
			flowersGroupSettings : {
				"blockApi"        : "/api/sections/get/list_by_url",
				"showCarousel"    : true,
				"displayItemInCarousel" : 6,
				"totalProducts"    : 12,
				"showTitle"        : true,
				"sectionUrl"       : "flowers-&-plants",
				"categoryUrl"      : "flowers-by-occasion",
				"subCategoryUrl"   : "all",
				"showOnlySection"  : false,
				"showOnlyCategory" : false,
				"showOnlyBrand"    : false,
				"showOnlySubCategory" : true,
				"numOfRows"        : 2,
				"numOfItemPerRow"  : 6,
				"noOfItemPerLGRow" : 4,
				"noOfItemPerMDRow" : 4,
				"noOfItemPerSMRow" : 4,
				"noOfItemPerXSRow" : 2
			},
			flowersDealSettings : {
				"blockTitle" : "Flowers For you",
				"blockApi"   : "/api/deals/get/list",
				"section"    : "Flowers & Plants",
				"category"   : "all",
				"subCategory": "all",
				"showOnlySection"  : false,
				"showOnlyCategory" : false,
				"showOnlyBrand"    : false,
				"showOnlySubCategory" : true
			},
			saloonDealSettings: {
				"blockTitle"       : "Deals On Beauty Saloon",
				"blockApi"         : "/api/deals/get/list",
				"section"          : "Beauty Saloon",
				"category"         : "Make Up",
				"subCategory"      : "all",
				"showOnlySection"  : false,
				"showOnlyCategory" : false,
				"showOnlyBrand"    : false,
				"showOnlySubCategory" : true
			},
			pharmacyDealSettings: {
				"blockTitle"       : "Deals On Beauty Saloon",
				"blockApi"         : "/api/deals/get/list",
				"section"          : "Pharmacy",
				"category"         : "all",
				"subCategory"      : "all",
				"showOnlySection"  : false,
				"showOnlyCategory" : false,
				"showOnlyBrand"    : false,
				"showOnlySubCategory" : true
			},
			supermarketBlockSettings : {
				"blockApi"            : "/api/products/get/list/lowestprice",
				"section"             : "Supermarket",
				"category"            : "Grocery",
				"subCategory"         : "all",
				"totalProducts"       : 6,
				"showTitle"           : true,
				"showCarousel"        : true,
				"leftSideFilters"     : false,
				"noOfProductPerLGRow" : 2,
				"noOfProductPerMDRow" : 4,
				"noOfProductPerSMRow" : 4,
				"noOfProductPerXSRow" : 2
			},
			flowersBlockSettings : {
				"blockApi"            : "/api/products/get/list/lowestprice",
				"section"             : "Flowers & Plants",
				"category"            : "Flowers By Occasion",
				"subCategory"         : "Valentine",
				"totalProducts"       : 6,
				"showTitle"           : true,
				"showCarousel"        : true,
				"leftSideFilters"     : false,
				"noOfProductPerLGRow" : 2,
				"noOfProductPerMDRow" : 4,
				"noOfProductPerSMRow" : 4,
				"noOfProductPerXSRow" : 2
			},
			pharmacyBlockSettings:{
				"blockApi"            : "/api/products/get/list/lowestprice",
				"section"             : "Pharmacy",
				"category"            : "all",
				"subCategory"         : "all",
				"totalProducts"       : 6,
				"showTitle"           : true,
				"showCarousel"        : true,
				"leftSideFilters"     : false,
				"noOfProductPerLGRow" : 2,
				"noOfProductPerMDRow" : 4,
				"noOfProductPerSMRow" : 4,
				"noOfProductPerXSRow" : 2
			},
			babyBlockSettings : {
				"blockApi"            : "/api/products/get/list/lowestprice",
				"section"             : "Pharmacy",
				"category"            : "Baby & Maternity",
				"subCategory"         : "Baby Oils",
				"totalProducts"       : 6,
				"showTitle"           : true,
				"showCarousel"        : true,
				"leftSideFilters"     : false,
				"noOfProductPerLGRow" : 2,
				"noOfProductPerMDRow" : 4,
				"noOfProductPerSMRow" : 4,
				"noOfProductPerXSRow" : 2
			},
			
			"productSettings" : {
				"displayBrand" : true,
				"displayWishlist" : true,
				"displayRating" : false,
				"displayFeature" : "",
				"displayAssurenceIcon" : false,
				"displayCategory" : false,
				"displaySubCategory" : false,
				"displaySection" : false
			},
				
						 
		}
	}

	render(){
		return(
			<div className="col-12">
				<div className="row">
					< Header />
					<div className={"col-12 firstBlockHome"}>
						<div className="row">
							< Banner />
						</div>
					</div>

					<div className={"col-12 " + Style.secondBlockHome}>
						<div className="">
							< SectionBlock 
									groupSettings =	{this.state.SectionGroupSettings}
									blockTitle    = {"All Sections"}	
							/>
						</div>
					</div>
					<div className={"col-12 " + Style.thirdBlockHome}>
						<div className="">
							< DealsBlock 
								dealSettings = { this.state.superMarketDealSettings}
								blockTitle = {""}
							/>
						</div>
					</div>
					<div className={"col-12 " + Style.fourthBlockHome}>
						<div className="row">
							<CategoryBlock 
									groupSettings =	{this.state.supermarketGroupSettings}
									blockTitle    = {"Supermarket"}
							/>
						</div>
					</div>
					
					<div className={"col-12 " + Style.fifthBlockHome}>
						<div className="">
							<ProductCarouselBlock 
								blockSettings   = {this.state.supermarketBlockSettings} 
								productSettings = {this.state.productSettings}
								blockTitle      = {"Your Supermarket"}
							/>
						</div>
					</div>
					{/* <div className={"col-12 " + Style.sixthBlockHome } >
						<div className="row">
							< DealsBlock 
								dealSettings = { this.state.flowersDealSettings}
								blockTitle = {""}
							/>
						</div>
					</div> */}
					{/* <div className={"col-12 seventhBlockHome" } >
						<div className="row">
							<SubCategoryBlock 
									groupSettings =	{this.state.flowersGroupSettings}
									blockTitle    = {"Types Of Flowers"}
							/>
						</div>
					</div>
					<div className={"col-xl-12 " + Style.eightBlockHome } >
						<div className="">
							<ProductCarouselBlock 
								blockSettings   = {this.state.flowersBlockSettings} 
								productSettings = {this.state.productSettings}
								blockTitle      = {"Surprise Your Love One"}
							/>
						</div>
					</div> */}
					<div className={"col-xl-12 " + Style.tenBlockHome } >
						<div className="">
							< DealsBlock 
								dealSettings = { this.state.pharmacyDealSettings}
								blockTitle = {""}
							/>
						</div>
					</div>
					<div className={"col-xl-12 " + Style.nineBlockHome } >
						<div className="row">
							<CategoryBlock 
									groupSettings =	{this.state.pharmacyGroupSettings}
									blockTitle    = {"Pharmacy AT Your Door Step"}
							/>
						</div>
					</div>
					<div className={"col-xl-12 " + Style.tewlveBlockHome}>
						<div className="">
							<ProductCarouselBlock 
								blockSettings   = {this.state.pharmacyBlockSettings} 
								productSettings = {this.state.productSettings}
								blockTitle      = {"Pharmacy Products"}
							/>
						</div>
					</div>
					{/* <div className={"col-xl-12 " + Style.tenBlockHome } >
						<div className="row">
							< DealsBlock 
								dealSettings = { this.state.saloonDealSettings}
								blockTitle = {""}
							/>
						</div>
					</div> */}
					<div className={"col-xl-12 " + Style.elevenBlockHome } >
						<div className="row">
							<SubCategoryBlock 
									groupSettings =	{this.state.subCategoryGroupSettings}
									blockTitle    = {"Baby Products"}
							/>
						</div>
					</div>
					<div className={"col-xl-12 " + Style.tewlveBlockHome}>
						<div className="">
							<ProductCarouselBlock 
								blockSettings   = {this.state.babyBlockSettings} 
								productSettings = {this.state.productSettings}
								blockTitle      = {"Baby Care Products"}
							/>
						</div>
					</div>

					< Footer />
				</div>
			</div>
		)
	}
}
export default HomePage;