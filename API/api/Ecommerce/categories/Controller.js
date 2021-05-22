const mongoose	= require("mongoose");

var ObjectId    = require('mongodb').ObjectID;
const Category = require('./Model');
const Section = require('../sections/Model');
const { json } = require("body-parser");

exports.insert_category = (req,res,next)=>{
    console.log("req.body => ",req.body);
	Category.find({"category":req.body.category, "section":req.body.section})
		.exec()
		.then(data =>{
            // console.log("insert category body",req.body)
            if(data && data.length > 0){
                res.status(200).json({
                    "message": "Category already exists.!"
                });
            }else{
                const category = new Category({
                    _id                       : new mongoose.Types.ObjectId(),                    
                    category                  : req.body.category,
                    categoryNameRlang         : req.body.categoryNameRlang,
                    categoryUrl               : req.body.categoryUrl,
                    categoryRank              : req.body.categoryRank,
                    subCategory               : req.body.subCategory,
                    categoryDescription       : req.body.categoryDescription,
                    categoryImage             : req.body.categoryImage,
                    categoryIcon              : req.body.categoryIcon,
                    section                   : req.body.section,
                    section_ID                : req.body.section_ID,
                    status                    : "Published",
                    createdAt                 : new Date()
                });
                console.log("Category:",category);
                category.save()
                .then(data=>{
                    console.log("data => ",data);
                    res.status(200).json({
                        "message": "Category Submitted Successfully!"
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
};
exports.update_category = (req,res,next)=>{
    
    // console.log("subCategory:" ,req.body.subCategory);
    // console.log("Data:" ,req.body);
    Category.updateOne(
            { _id:req.body.category_ID},  
            {
                $set:{
                category                  : req.body.category,
                categoryUrl               : req.body.categoryUrl,
                categoryRank              : req.body.categoryRank,
                categoryNameRlang         : req.body.categoryNameRlang,
                subCategory               : req.body.subCategory,
                categoryDescription       : req.body.categoryDescription,
                categoryImage             : req.body.categoryImage,
                categoryIcon              : req.body.categoryIcon,
                section                   : req.body.section,
                section_ID                : req.body.section_ID,
                createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified === 1){
                res.status(200).json({
                    "message": "Category Updated Successfully!"
                });
            }else{
                res.status(401).json({
                    "message": "Category Not Found"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.list_section = (req,res,next)=>{
    Category.find().sort({"categoryRank": 1})       
        .exec()
        .then(data=>{
            // console.log("data:===",data);
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.list_category = (req,res,next)=>{
    Category.find({"section_ID" : req.params.section_ID})
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.list_category_with_limits = (req,res,next)=>{
    // console.log(req.body.startRange, req.body.limitRange);
    Category.find()
    .skip(parseInt(req.body.startRange))
    .limit(parseInt(req.body.limitRange))
    .exec()
    .then(data=>{
        // console.log('data', data);
        // var allData = data.map((x, i)=>{
        //     return {
        //         "_id"                   : x._id,
        //         "section"               : x.section,
        //         "category"              : x.category,
        //         "categoryNameRlang"     : x.categoryNameRlang ? "<span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '-',
        //         "categoryRank"          : x.categoryRank ? x.categoryRank : '',
        //         "subCategory"           : x.subCategory ? ((x.subCategory.map((a, i)=>{return '<p>'+a.subCategoryTitle+'</p>'})).toString()).replace(/,/g, " ") : [],
        //         "categoryDescription"   : x.categoryDescription ? x.categoryDescription : '',
        //         "categoryImage"         : x.categoryImage,
        //         "categoryIcon"          : x.categoryIcon,
        //         "status"                : x.status,
        //     }
        // })
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "section"               : x.section,
                "category"              : x.category,
                "categoryNameRlang"     : x.categoryNameRlang ? "<span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '-',
                "categoryRank"          : x.categoryRank ? x.categoryRank : '',
                "subCategory"           : x.subCategory 
                                            ? 
                                                (x.subCategory.map((a, i)=>{
                                                    // console.log("a.subCategoryTitle=> ",a.subCategoryTitle)
                                                    if(a.subCategoryTitle && a.subCategoryTitle !== undefined){
                                                        return {
                                                            _id                 : a._id+"-"+x._id,
                                                            subCategoryTitle    : a.subCategoryTitle,
                                                            subCategoryCode     : a.subCategoryCode,
                                                            subCategoryImage    : a.subCategoryImage,
                                                            subCategoryUrl      : a.subCategoryUrl,
                                                            status              : a.status,
                                                        }
                                                    }  
                                                                                                  
                                                }))
                                            :
                                                [],
                "categoryDescription"   : x.categoryDescription ? x.categoryDescription : '',
                "categoryImage"         : x.categoryImage,
                "categoryIcon"          : x.categoryIcon,
                "status"                : x.status,
            }
        })
        // console.log("allData => ",allData)
        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.searchCategory = (req,res,next)=>{
    // console.log(req.body.startRange, req.body.limitRange);
    Category.find({
        $or: [
                { "section": { "$regex": req.body.searchText, $options: "i" } },
                { "category": { "$regex": req.body.searchText, $options: "i" } },
                { "categoryDescription": { "$regex": req.body.searchText, $options: "i" } },
            ]
    })
    .skip(parseInt(req.body.startRange))
    .limit(parseInt(req.body.limitRange))
    .exec()
    .then(data=>{
        // console.log('data', data);

        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "section"               : x.section,
                "category"              : x.category,
                "categoryNameRlang"     : x.categoryNameRlang ? "<span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '-',
                "subCategory"           : x.subCategory ? ((x.subCategory.map((a, i)=>{return '<p>'+a.subCategoryTitle+'</p>'})).toString()).replace(/,/g, " ") : [],
                "categoryRank"          : x.categoryRank ? x.categoryRank : '',
                "categoryDescription"   : x.categoryDescription ? x.categoryDescription : '',
                "categoryImage"         : x.categoryImage,
                "categoryIcon"          : x.categoryIcon,
            }
        })

        res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.searchCategoryCount = (req,res,next)=>{
    // console.log(req.body.startRange, req.body.limitRange);
    Category.find({
        $or: [
                { "section": { "$regex": req.body.searchText, $options: "i" } },
                { "category": { "$regex": req.body.searchText, $options: "i" } },
                { "categoryDescription": { "$regex": req.body.searchText, $options: "i" } },
            ]
    })
    
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

exports.count_category = (req,res,next)=>{
    Category.find({})
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
exports.fetch_category = (req,res,next)=>{
    // console.log("insode fetch category");
    Category.findOne({_id : req.params.categoryID})
    .exec()
    .then(data=>{
        console.log("data =>" ,data)
        res.status(200).json({
            "_id"                   : data._id,
            "section_ID"            : data.section_ID,
            "section"               : data.section,
            "category"              : data.category,
            "categoryUrl"           : data.categoryUrl,
            "categoryNameRlang"     : data.categoryNameRlang ? "<span class='RegionalFont'>"+data.categoryNameRlang+"</span>" : '-',
            "categoryRank"          : data.categoryRank ? data.categoryRank : '',
            "subCategory"           : data.subCategory 
                                        ? 
                                            (data.subCategory.map((a, i)=>{
                                                // console.log("a.subCategoryTitle=> ",a.subCategoryTitle)
                                                if(a.subCategoryTitle && a.subCategoryTitle !== undefined){
                                                    return {
                                                        _id                 : a._id+"-"+data._id,
                                                        subCategoryTitle    : a.subCategoryTitle,
                                                        subCategoryCode     : a.subCategoryCode,
                                                        subCategoryImage    : a.subCategoryImage,
                                                        subCategoryUrl      : a.subCategoryUrl,
                                                        status              : a.status,
                                                    }
                                                }  
                                                                                                
                                            }))
                                        :
                                            [],
            "categoryDescription"   : data.categoryDescription ? data.categoryDescription : '',
            "categoryImage"         : data.categoryImage,
            "categoryIcon"          : data.categoryIcon,
            "status"                : data.status
        })
        // res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.fetch_categories_by_section = (req,res,next)=>{
    Category.find({ section_ID: req.params.sectionID})
    .exec()
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.fetch_categories_by_sectionUrl = (req,res,next)=>{
    console.log("params => ",req.params.sectionUrl)
    Section.findOne({sectionUrl: req.params.sectionUrl})
    .then(sectiondata=>{
        console.log("sectiondata => ",sectiondata)
        if(sectiondata && sectiondata !== null && sectiondata !== undefined){
            Category.find({section_ID: sectiondata._id})
            .exec()
            .then(data=>{
                console.log("data => ",data)
                res.status(200).json(data);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }else{
            res.status(200).json({
                message : "No Section found"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.delete_category = (req,res,next)=>{
    // console.log("In Delete Categories => ", req.paramas.categoryID);

    Category.deleteOne({_id:req.params.categoryID})
    .exec()
    .then(data=>{
        // console.log("Data After Deleteing Category => ",data)
        res.status(200).json({
            "message": "Category Deleted Successfully!"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.deleteAllCategories = (req, res, next) => {
	Category.remove({})
	  .exec()
	  .then(data => {
		res.status(200).json({
		  "message": "All categories Deleted Successfully!"
		});
	  })
	  .catch(err => {
		console.log(err);
		res.status(500).json({
		  error: err
		});
	  });
  };

  exports.get_Category_with_limits = (req,res,next)=>{
    Shipping.find()  
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

exports.update_category_status = (req,res,next)=>{
    console.log("update_category_status Body = ", req.body);
    console.log(" req.body.item_id ====" ,req.body.item_id);
    console.log(" req.body.status ====" ,req.body.status);
    Category.updateOne(
        { _id : ObjectId(req.body.item_id)},  
        { $set : 
            {
                status                      : req.body.status,
                'subCategory.$[].status' 	: req.body.status,	
            }
        }
    )
    .exec()
    .then(data=>{
        console.log("data => ", data);
        
    
        // if(data.nModified == 1){
            res.status(200).json({
                "message": "Category Updated Successfully!"
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

exports.update_subcategory_status = (req,res,next)=>{
    console.log("update_subcategory_status Body = ", req.body);
    console.log(" req.body.item_id ====" ,req.body.item_id);
    console.log(" req.body.status ====" ,req.body.status);

    Category.updateOne(
        { _id : ObjectId(req.body.item_id.split("-")[1]), 'subCategory._id' : ObjectId(req.body.item_id.split("-")[0])},  
        { $set : 
            {
                // status                      : req.body.status,
                'subCategory.$.status' 	: req.body.status,	
            }
        }
    )
    .exec()
    .then(data=>{
        console.log("SubCategory Updated data => ", data);       
    
        // if(data.nModified == 1){
            res.status(200).json({
                "message": "SubCategory Updated Successfully!"
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