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
				"category" : "Fruits & Vegetables",
				"subCategory" : "Seasonal Fruits",
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
			saloonGroupSettings : {
				"blockApi" : "/api/sections/get/list_by_url",
				"showCarousel" : true,
				"displayItemInCarousel" : 6,
				"totalProducts" : 12,
				"showTitle" : true,
				"sectionUrl" : "beauty-saloon",
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
				"category"   : "Flowers by occasions",
				"subCategory": "Valentine",
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
					
					< Banner />

					< SectionBlock 
							groupSettings =	{this.state.SectionGroupSettings}
							blockTitle    = {"All Sections"}	
					/>

					< DealsBlock 
						dealSettings = { this.state.superMarketDealSettings}
						blockTitle = {""}
					/>
					
					<CategoryBlock 
							groupSettings =	{this.state.supermarketGroupSettings}
							blockTitle    = {"Supermarket"}
					/>
					
					<div className="col-xl-12">
						<ProductCarouselBlock 
							blockSettings   = {this.state.supermarketBlockSettings} 
							productSettings = {this.state.productSettings}
							blockTitle      = {"Your Supermarket"}
						/>
					</div>
					<div className={ Style.blockSixMargin } >
						< DealsBlock 
							dealSettings = { this.state.flowersDealSettings}
							blockTitle = {""}
						/>
					</div>

					<SubCategoryBlock 
							groupSettings =	{this.state.flowersGroupSettings}
							blockTitle    = {"Types Of Flowers"}
					/>
					<div className={"col-xl-12 " + Style.blockEightMargin } >
						<ProductCarouselBlock 
							blockSettings   = {this.state.flowersBlockSettings} 
							productSettings = {this.state.productSettings}
							blockTitle      = {"Surprise Your Love One"}
						/>
					</div>

					<CategoryBlock 
							groupSettings =	{this.state.saloonGroupSettings}
							blockTitle    = {"Beauty Saloon At Your Door Step"}
					/>

					< DealsBlock 
						dealSettings = { this.state.saloonDealSettings}
						blockTitle = {""}
					/>

					<SubCategoryBlock 
							groupSettings =	{this.state.subCategoryGroupSettings}
							blockTitle    = {"Baby Products"}
					/>
					<div className={"col-xl-12 " + Style.marginBottomLastBlock}>
						<ProductCarouselBlock 
							blockSettings   = {this.state.babyBlockSettings} 
							productSettings = {this.state.productSettings}
							blockTitle      = {"Baby Care Products"}
						/>
					</div>

					< Footer />
				</div>
			</div>
		)
	}
}
export default HomePage;