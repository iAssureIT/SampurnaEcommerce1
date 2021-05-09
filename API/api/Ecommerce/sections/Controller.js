const mongoose  = require("mongoose");
var ObjectId    = require('mongodb').ObjectID;
const Sections  = require('../sections/Model');
const Category  = require('../categories/Model');
const Products  = require('../products/Model');

exports.insert_section = (req,res,next)=>{
	var sectionUrl = req.body.section.replace(/\s+/g, '-').toLowerCase();
    Sections.find({"section"    :  { "$regex": req.body.section, $options: "i"}  })
        .exec()
        .then(data =>{
            if (data.length == 0) {
        	const SectionObj = new Sections({
                        _id                       : new mongoose.Types.ObjectId(),                    
                        section                   : req.body.section,
                        sectionUrl                : sectionUrl,
                        sectionRank               : req.body.sectionRank,
                        createdBy 				  : req.body.createdBy, 	
                        createdAt                 : new Date(),
                        sectionImage              : req.body.sectionImage
                    });

                    SectionObj
                    .save()
                    .then(data=>{
                        res.status(200).json({
                    		"message": "Section is submitted successfully!"
                		});
                    })
                    .catch(err =>{
                    	res.status(500).json({
		                    error: err
		                });
                    });
            }else{
                res.status(200).json({
                            "message": "Section already exists!"
                        });
            }
        })
};        

exports.get_sections = (req,res,next)=>{
    Sections.find()       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.get_single_section = (req,res,next)=>{
    Sections.findOne({_id : req.params.sectionID})       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.update_section = (req,res,next)=>{
    // console.log("Update Body = ", req.body);
    var sectionUrl = req.body.section.replace(/\s+/g, '-').toLowerCase();
    Sections.updateOne(
            { _id:req.body.sectionID},  
            {
                $set:{
                section                   : req.body.section,
                sectionRank               : req.body.sectionRank,
                sectionUrl                : sectionUrl,
                sectionImage              : req.body.sectionImage
                }
            }
        )
        .exec()
        .then(data=>{
            Category.updateOne(
                {section_ID : req.body.sectionID},
                { $set:{ section : req.body.section}
                })
                .exec()
                .then(data=>{
                    // console.log(data);
                }) 
                .catch(err =>{console.log(err);})
       
            // if(data.nModified == 1){
                res.status(200).json({
                    "message": "Section Updated Successfully!"
                });
            // }else{
            //     res.status(401).json({
            //         "message": "Section Not Found"
            //     });
            // }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_section = (req,res,next)=>{

    Products.findOne({section_ID:req.params.sectionID})
        .exec()
        .then(pdata=>{
            if (pdata) {
                res.status(200).json({
                    "message": "You cannot delete this section as products are related to this section.!"
                });
            }else{
                Sections.deleteOne({_id:req.params.sectionID})
                        .exec()
                        .then(data=>{
                            res.status(200).json({
                                "message": "Section Deleted Successfully!"
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });

            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        }); 


    /*Sections.deleteOne({_id:req.params.sectionID})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message": "Section Deleted Successfully."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });*/
};
exports.count_section = (req,res,next)=>{
    Sections.find({})
    .exec()
    .then(data=>{
        res.status(200).json({"dataCount":data.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.get_sections_with_limits = (req,res,next)=>{
    Sections.find()  
        .skip(parseInt(req.params.startRange))
        .limit(parseInt(req.params.limitRange))     
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            });
        });
};

exports.get_megamenu_list = (req,res,next)=>{
   
    Sections.aggregate([
    { $lookup:
        {
         from: 'categories',
         localField: '_id',
         foreignField: 'section_ID',
         as: 'categorylist'
        }
    },
    {
        // $sort: {
        //   "categorylist.createdAt": -1
        // }
        $sort: {
            "sectionRank": 1
          }
    }
    ])
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};

exports.deleteAllSections = (req, res, next) => {
	Sections.remove({})
	  .exec()
	  .then(data => {
		res.status(200).json({
		  "message": "All Users Deleted Successfully!"
		});
	  })
	  .catch(err => {
		console.log(err);
		res.status(500).json({
		  error: err
		});
	  });
  };


/**=========== get_list_for_section_category_block() =========== */
exports.get_list_for_section_category_block = (req,res,next)=>{
    console.log("req.body => ",req.body);
    var startRange = 0;
   
    var selector        = {}; 
    selector['$and']    = [];

    if(req.body.section && req.body.section != "All"){
        selector["$and"].push({"_id": ObjectId(req.body.section) })
    }else{
        selector["$and"].push({"_id": {$ne: ""} })
    }
    if(req.body.carousel){
        var limitRange = req.body.displayItemsInCarousel * 2;
    }else if(req.body.numberOfRows && req.body.numberOfItemsPerRow){
        var limitRange = req.body.numberOfRows * req.body.numberOfItemsPerRow;
    }

    Sections.aggregate([
        {$match : selector},
        { $lookup:
            {
                from            : 'categories',
                localField      : '_id',
                foreignField    : 'section_ID',
                as              : 'categorylist'
            }
        },
    ])
    .exec()
    .then(sectiondata=>{
        // console.log("section data => ", sectiondata);
        var returnData = [];
        if (sectiondata && sectiondata.length > 0) {  
            processData();
            async function processData(){
                if (req.body.showOnlySections && req.body.section && req.body.section === "All") {
                    // console.log("In Show only Sections => ", sectiondata);
                    for (var i = 0; i < sectiondata.length; i++) {
                        // console.log("sectiondata[i] => ", i, sectiondata[i]);
                        returnData.push({
                            _id         : sectiondata[i]._id,
                            itemName    : sectiondata[i].section,
                            itemUrl     : sectiondata[i].sectionUrl,
                            itemImagUrl : sectiondata[i].sectionImage
                        })                    
                    }
                    if(i >= sectiondata.length){
                        console.log("returnData => ", returnData);
                        res.status(200).json(returnData.slice(startRange, limitRange));
                    }
                } else if (req.body.showOnlyCategories && req.body.section && req.body.section !== "All" && req.body.category && req.body.category === "All"){
                    // console.log("In Show only Categories => ", sectiondata[0].categorylist);

                    if (sectiondata[0].categorylist && sectiondata[0].categorylist.length > 0) {
                        for (var j = 0; j < sectiondata[0].categorylist.length; j++) {
                            // console.log("sectiondata[0].categorylist[j] => ", j, sectiondata[0].categorylist[j]);
                            returnData.push({
                                _id         : sectiondata[0].categorylist[j]._id,
                                itemName    : sectiondata[0].categorylist[j].category,
                                itemUrl     : sectiondata[0].categorylist[j].categoryUrl,
                                itemImagUrl : sectiondata[0].categorylist[j].categoryImage
                            })    
                        }
                        if(j >= sectiondata[0].categorylist.length){
                            console.log("returnData => ", returnData);
                            res.status(200).json(returnData.slice(startRange, limitRange));
                        }                
                    }
                } else if (req.body.showOnlySubCategories && req.body.section && req.body.section !== "All" && req.body.category && req.body.category !== "All" && req.body.subCategory && req.body.subCategory === "All"){
                    // console.log("In Show only SubCategories => ", sectiondata[0].categorylist);
                    if (sectiondata[0].categorylist && sectiondata[0].categorylist.length > 0) {
                        var filteredCategory = sectiondata[0].categorylist.filter((filteredcategory)=> String(filteredcategory._id) === String(req.body.category));
                        // console.log("filteredCategory => ",filteredCategory);
                        if(filteredCategory && filteredCategory.length > 0 && filteredCategory[0].subCategory  && filteredCategory[0].subCategory.length > 0){
                            for (var k = 0; k < filteredCategory[0].subCategory.length; k++) {
                                // console.log("filteredCategory[0].subCategory[j] => ", k, filteredCategory[0].subCategory[k]);
                                returnData.push({
                                    _id         : filteredCategory[0].subCategory[k]._id,
                                    itemName    : filteredCategory[0].subCategory[k].subCategoryTitle,
                                    itemUrl     : filteredCategory[0].subCategory[k].subCategoryUrl,
                                    itemImagUrl : filteredCategory[0].subCategory[k].subCategoryImage
                                })    
                            }
                            if(k >= filteredCategory[0].subCategory.length){
                                console.log("returnData => ", returnData);
                                res.status(200).json(returnData.slice(startRange, limitRange));
                            }   
                        }             
                    }
                }else if (req.body.showOnlyBrands && req.body.section && req.body.section !== "All" && req.body.category && req.body.category !== "All"){
                    // console.log("In Show only Brands => ", sectiondata[0].categorylist);
                    if (sectiondata[0].categorylist && sectiondata[0].categorylist.length > 0) {
                        var filteredCategory = sectiondata[0].categorylist.filter((filteredcategory)=> String(filteredcategory._id) === String(req.body.category));
                            
                        if(req.body.subCategory && req.body.subCategory !== "All"){
                            if(filteredCategory && filteredCategory.length > 0){
                                var subcategoryBrands = await getCategoryBrands(req.body.section, req.body.category, req.body.subCategory);
                                // console.log("subcategoryBrands=> ",subcategoryBrands);
                                if(subcategoryBrands && subcategoryBrands.length > 0){   
                                    var uniqueBrands = [...new Set(subcategoryBrands.map(item => item.brand.trim()))]; 
                                    res.status(200).json(uniqueBrands.slice(startRange, limitRange));
                                }
                            } 
                        }else{
                            if(filteredCategory && filteredCategory.length > 0){
                                var categoryBrands = await getCategoryBrands(req.body.section, req.body.category);
                                if(categoryBrands && categoryBrands.length > 0){   
                                    var uniqueBrands = [...new Set(categoryBrands.map(item => item.brand.trim()))]; 
                                    res.status(200).json(uniqueBrands.slice(startRange, limitRange));
                                }
                            }  
                        }                               
                    }
                }
            }
        }else{
            res.status(200).json(returnData);
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};


var getCategoryBrands = async(section_id, category_id, subCategory_id) =>{
    var selector = {};
    if(section_id && section_id !== undefined){
        selector.section_ID =  ObjectId(section_id);
    }
    if(subCategory_id && subCategory_id !== undefined){
        selector.subCategory_ID = ObjectId(subCategory_id);
    }
    // console.log("selector => ", selector);
    return new Promise(function (resolve, reject) {
        Products.find(selector, {brand : 1})
        .exec()
        .then(data=>{
            // console.log("ProductData ===> ",data);
            resolve(data);
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        });
    });    
} 