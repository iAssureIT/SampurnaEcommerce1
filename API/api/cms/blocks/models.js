const mongoose = require('mongoose');

const blocksSchema = mongoose.Schema({
	_id					: mongoose.Schema.Types.ObjectId,
	blockTitle 			: String,
	blockSubTitle		: String,
	blockDescription	: String,
	blockComponentName	: String,
	blockFolderName		: String,
	blockType 			: String,
	pageType 			: String,
	bgImage				: String,
	bgVideo				: String,
	fgImage1			: String,
	fgImage2			: String,
	fgVideo				: String,
	blockGroup 			: String,
	displayOnPage       : String,
	blockAppearOnPage	: { type: mongoose.Schema.Types.ObjectId, ref: 'pages' },
	animationSettings : {
		showDots          : Boolean,
		swipeable         : Boolean,
		draggable         : Boolean,
		infinite          : Boolean,
		autoPlaySpeed     : Number,
		showNextPrevArrow : String,
		effect            : String,
	  },
	repeatedBlocks		: [
								{
									Title 		    : String,
								    SubTitle        : String,
								    Description	    : String,
								    Image			: String,
									Link			: String,
									BgImage         : String,
									FGImage1     	: String,
									FGImage2     	: String,
									BgVideo     	: String,
									FgVideo     	: String,
									

								}
						  ],
    blockSettings       : {
		// blockTitle 			: String,
		blockApi 		    : String,
		totalProducts 	    : Number,
		showCarousel        : Boolean,	
		showTitle           : Boolean,
		leftSideFilters     : Boolean,
		noOfProductPerLGRow : Number,
		noOfProductPerMDRow : Number,
		noOfProductPerSMRow : Number,
		noOfProductPerXSRow : Number,
	},
	productSettings     :{
		displayBrand        : Boolean,
		displayWishlist     : Boolean,
		displayRating       : Boolean,
		displayFeature      : String,
		displayAssurenceIcon: Boolean,
		displayCategory     : Boolean,
		displaySubCategory  : Boolean,
		displaySection      : Boolean,
	},
	filterSettings      :[
		{
			filterLabel : String,
			dbFeildName : String,
		}
	],
							
    createdBy   		: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt   		: Date,
});

module.exports = mongoose.model('blocks',blocksSchema);
