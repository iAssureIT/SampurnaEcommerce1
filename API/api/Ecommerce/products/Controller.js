const mongoose             = require("mongoose");
const _                    = require("underscore");
const Products             = require('./Model');
const Category             = require('../categories/Model');
const Sections             = require('../sections/Model');
const FailedRecords        = require('../failedRecords/Model');
const Orders               = require('../orders/Model');
const Carts                = require('../cart/Model');
const Wishlists            = require('../wishlist/Model');
const ExpenseTypeMaster    = require('../../coreAdmin/expenseTypeMaster/ModelExpenseTypeMaster');
var ObjectId               = require('mongodb').ObjectID;
var UnitOfMeasurmentMaster = require('../departmentMaster/ModelUnitofmeasurment');
const franchisegoods       = require('../distributionManagement/Model');
const EntityMaster         = require('../../coreAdmin/entityMaster/ModelEntityMaster');
var subcategoryArray=[];
exports.insert_product = (req,res,next)=>{
    // console.log("response ===========>",res);
    console.log("req =>=>=>=>=>=>=>=>=>=> ",req.body);
    Products.find({"itemCode" : req.body.itemCode,"vendor_ID":req.body.vendor_ID})
        .exec()
        .then(data =>{
        if(data && data.length > 0){
            res.status(200).json({
                "message": "Item code for this product code already exists.",
            });
        }else{
            const products = new Products({
                _id                       : new mongoose.Types.ObjectId(), 
                user_ID                   : req.body.user_ID,
                vendor_ID                 : req.body.vendor_ID, 
                vendorName                : req.body.vendorName, 
                section                   : req.body.section, 
                section_ID                : req.body.section_ID,                
                category                  : req.body.category,
                categoryNameRlang         : req.body.categoryNameRlang,
                category_ID               : req.body.category_ID,
                subCategory               : req.body.subCategory,
                subCategory_ID            : req.body.subCategory_ID,
                brand                     : req.body.brand,
                brandNameRlang            : req.body.brandNameRlang,
                productCode               : req.body.productCode,
                itemCode                  : req.body.itemCode,
                productName               : req.body.productName,
                productNameRlang          : req.body.productNameRlang,
                productUrl                : req.body.productUrl,
                productDetails            : req.body.productDetails,
                shortDescription          : req.body.shortDescription,
                featureList               : req.body.featureList,
                currency                  : req.body.currency,
                discountPercent           : req.body.discountPercent,
                actualPrice               : req.body.actualPrice,
                offeredPrice              : req.body.offeredPrice,
                originalPrice             : req.body.originalPrice,
                discountedPrice           : req.body.discountedPrice,
                availableQuantity         : req.body.availableQuantity,
                status                    : req.body.status,
                tags                      : req.body.tags,
                offered                   : req.body.offered,
                unit                      : req.body.unit,
                size                      : req.body.size,
                universalProductCode      : req.body.universalProductCode,
                color                     : req.body.color,
                attributes                : req.body.attributes,
                taxName                   : req.body.taxName,
                taxInclude                : req.body.taxInclude,
                taxRate                   : req.body.taxRate, 
                type                      : req.body.type,
                fileName                  : req.body.fileName,
                createdAt                 : new Date()
            });
            products.save()
            .then(data=>{
                res.status(200).json({
                    "message": "Product Submitted Successfully.",
                    "product_ID" : data._id
                });
            })
            .catch(err =>{
                console.log("err0",err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch(err =>{
        console.log("err1",err);
        res.status(500).json({
            error: err
        });
    });
};

exports.bulkUploadProduct = (req,res,next)=>{
    console.log("req.body => ",req.body);
    var record = []; 
    var i = 0;
    var found = 0;
    var catid;
    var subcatid;
    var failedRecords = [];
    getData();

    async function getData(){
        var productData = req.body;
        console.log("productData---",productData);
        var TotalCount  = 0;
        var Count  = 0;
        var DuplicateCount  = 0;
        var invalidData = [];
        var invalidObjects = [];
        var remark = ''; 

        for(k = 0 ; k < productData.length ; k++){
             if(productData[k].subCategory != undefined ) {
                 var subcatNew= productData[k].subCategory;
                }
            var allEntityData = await fetchAllEntities("vendor");
            if(productData[k].websiteModel === "MarketPlace"){
              var EntityData = allEntityData.filter((data)=>{
                console.log("productData[k].CompanyName------------",productData[k].CompanyName);
                  if (data.companyName == productData[k].CompanyName) {
                    return data;
                    }
                  }) 
                 var EntityDataArray = EntityData.map((entityArr, i)=>{
                    return entityArr.companyName;
                  })
              }else{
                var EntityData = allEntityData.filter((data)=>{
                    // console.log("data.companyName == productData[k].CompanyName",data.companyName == productData[k].CompanyName);
                      if (data.companyName == allEntityData[0].companyName) {
                        return data;
                        }
                }) 
                var EntityDataArray = allEntityData[0].companyName;
              }
              console.log("productData[k].itemCode--",productData[k].itemCode);
               if(productData[k].section != undefined && productData[k].itemCode != undefined){
                if (productData[k].section.trim() != '') {
                    var sectionObject = await sectionInsert(productData[k].section)
                    // console.log('category',productData[k].category.toString())
                    if (productData[k].category.toString() != undefined){
                        var categoryObject = await categoryInsert(productData[k].category,subcatNew,productData[k].section,sectionObject.section_ID,productData[k].categoryNameRlang);
                        var taxObject = []
                        if(productData[k].taxName){
                          taxObject = await taxInsert(productData[k].taxName,productData[k].taxRate);
                        }
                        // console.log('taxObject',taxObject)

                        if (productData[k].itemCode != undefined) {
                            if(typeof(productData[k].discountPercent) === 'number' && productData[k].discountPercent >= 0){
                                 if(typeof(productData[k].discountedPrice) === 'number' && productData[k].discountedPrice >= 0){
                                    if(typeof(productData[k].originalPrice) === 'number' && productData[k].originalPrice >= 0 ){
                                       if(productData[k].websiteModel === "MarketPlace"){
                                        if(EntityDataArray  != "" && EntityDataArray != undefined ){
                                            console.log("EntityData--->>>>>>",EntityData);
                                            var insertProductObject = await insertProduct(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0],EntityData);
                                           }else{
                                            remark+= "Company Name not found"

                                           }
                                       }else{
                                        //  var insertProductObject = await insertProduct(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0]);
                                        if(EntityDataArray  != "" && EntityDataArray != undefined ){
                                            var insertProductObject = await insertProduct(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0],EntityData);
                                           }else{
                                            remark+= "Vendor not found"

                                           }

                                       } 
                                        // console.log('insertProductObject',insertProductObject)
                                        if (insertProductObject != 0) {
                                            Count++;
                                        }else{
                                            // console.log("in else");
                                            DuplicateCount++;
                                            remark += "Item code should not be duplicate, ";
                                        }
                                    }else{
                                       remark += "Original Price should be number,"; 
                                    }
                                 }else{
                                    remark += "Discount Price should be number,";
                                 }  
                            }else{
                               remark += "Discount Percent should be number,";
                            }  
                           
                        }  
                    }
                }
            }
            
        if (productData[k].itemCode != undefined) {
            TotalCount++;
            if(productData[k].section == undefined){
                 remark += "section not found";
            }
            if (productData[k].category == undefined) {
                remark += ", category not found, ";
            }
            if (productData[k].productCode == undefined) {
                remark += "Product code not found, ";
            }
            if (productData[k].productName == undefined) {
                remark += "Product name not found, ";
            }
            // if (productData[k].brand == undefined) {
            //     remark += "brand not found, ";
            // }
            // if (productData[k].availableQuantity == undefined) {
            //     remark += "product quantity not found, ";
            // }
            if (productData[k].originalPrice == undefined) {
                remark += "product price not found, ";
            }

        }
            

            if (remark != '') {
                invalidObjects = productData[k];
                invalidObjects.remark = remark;
                invalidData.push(invalidObjects);
            } 
            remark = '';
        }
        
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = productData[0].filename;
        failedRecords.totalRecords = TotalCount;

        await insertFailedRecords(failedRecords); 
        
        var msgstr = "";
        var warning = false;
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" products are added successfully and "+"\n"+DuplicateCount+" products are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" product is added successfully and "+"\n"+DuplicateCount+" product is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" product is added successfully and "+"\n"+DuplicateCount+" products are duplicate";

            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" products are added successfully and "+"\n"+DuplicateCount+" product is duplicate";
            }
            
        }
        else if(DuplicateCount > 0 && Count == 0)
        {
            if (DuplicateCount > 1) {
                msgstr = "Failed to add products as "+DuplicateCount+" products are duplicate";
                warning = true;
            }else{
                msgstr = "Failed to add products as "+DuplicateCount+" product is duplicate";
                warning = true;
            }
            
        }
        else if(DuplicateCount == 0 && Count > 0)
        { 
            if (Count > 1) {
                msgstr = " " + Count+" products are added successfully";
            }else{
                msgstr = " " + Count+" product is added successfully";
            }            
        }else{
            msgstr = "Failed to add products";
            warning = true;
        }
        res.status(200).json({
            "message": msgstr,
            "warning" : warning
        });
    }
};

var insertFailedRecords = async (invalidData) => {
     //console.log('invalidData',invalidData);
    return new Promise(function(resolve,reject){ 
    FailedRecords.find({fileName:invalidData.fileName})  
            .exec()
            .then(data=>{
            if(data.length>0){
                // console.log('data',data)   
                if (data[0].failedRecords.length>0) {
                    FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   { 'failedRecords': [] } })
                        .then(data=>{
                        if(data.nModified == 1){
                            FailedRecords.updateOne({ fileName:invalidData.fileName},  
                                {   $set:   {'totalRecords': invalidData.totalRecords},
                                    $push:  { 'failedRecords' : invalidData.FailedRecords } 
                                })
                            .then(data=>{
                                if(data.nModified == 1){
                                    resolve(data);
                                }else{
                                    resolve(data);
                                }
                            })
                            .catch(err =>{ reject(err); });
                        }else{
                            resolve(0);
                        }
                        })
                        .catch(err =>{ reject(err); });

                }else{
                    FailedRecords.updateOne({ fileName:invalidData.fileName},  
                        {   $set:   {'totalRecords': invalidData.totalRecords},
                            $push:  { 'failedRecords' : invalidData.FailedRecords } 
                        })
                    .then(data=>{
                        if(data.nModified == 1){
                            resolve(data);
                        }else{
                            resolve(data);
                        }
                    })
                    .catch(err =>{ reject(err); });
                }
            }else{
                    const failedRecords = new FailedRecords({
                    _id                     : new mongoose.Types.ObjectId(),                    
                    failedRecords           : invalidData.FailedRecords,
                    fileName                : invalidData.fileName,
                    totalRecords            : invalidData.totalRecords,
                    createdAt               : new Date()
                    });
                    
                    failedRecords
                    .save()
                    .then(data=>{
                        resolve(data._id);
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }
            })  
    
    })            
}

function sectionInsert(sectionName) {
    return new Promise(function(resolve,reject){    
        sectionDuplicateControl();
        async function sectionDuplicateControl(){
            var sectionPresent = await findSection(sectionName);
            //console.log('sectionPresent',sectionPresent)

            var sectionUrl = sectionName.replace(/\s+/g, '-').toLowerCase();
            if(sectionPresent === 0){
                  Sections.find().sort({sectionRank:-1}).limit(1)
                 .exec()
                 .then(data=>{
                    var sectionrank = 1;
                    if(data.length > 0){
                        // console.log("section dta",data[0]);
                        sectionrank = data[0].sectionRank + 1;
                    }   
                    // console.log("sectionrank",sectionrank);
                     const sectionObj = new Sections({
                        _id                       : new mongoose.Types.ObjectId(),
                        section                   : sectionName,
                        sectionUrl                : sectionUrl, 
                        sectionRank               : sectionrank,
                        createdAt                 : new Date()
                    });

                    sectionObj
                    .save()
                    .then(data=>{
                        // console.log('insertdection',data);
                        resolve({ section_ID : data._id, section: sectionName });
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
                 })
                   
            }else{
                Sections.findOne({ section : { "$regex": sectionName, $options: "i"} })
                .exec()
                .then(sectionObject=>{
                    if(sectionObject){
                        //console.log('section',sectionObject);
                        resolve({section_ID : sectionObject._id, section : sectionObject.section});
                    }else{
                        resolve(0);
                    }
                })
            }
        }

        
    })                   
}

function categoryInsert(catgName,subcatgName,sectionname,section,categoryNameRlang) {
      if(subcatgName != undefined){
        var subcat = subcatgName;
        var subcarUrl= subcat.replace(/\s+/g, '-').toLowerCase();
      }
      if(subcatgName != undefined){
        subcategoryArray.push(subcatgName);
      }
       var addRowLength = subcategoryArray.length;
          if(addRowLength){
                    for(var i=0;i<addRowLength;i++){

                      var obj = {
                           "index"             : i,
                           "subCategoryCode"   : 1+'|'+i,
                           "subCategoryTitle"  : subcat,
                           "subCategoryUrl"    : subcarUrl,
                      }
                    }
                  }  
    return new Promise(function(resolve,reject){    
        categoryDuplicateControl();
        async function categoryDuplicateControl(){
            var categoryPresent = await findCat(catgName);
           
             var subcategory=[];
            
            if(categoryPresent === 0){

                // subcategory.push({"subCategoryUrl":subcarUrl,"subCategoryTitle":subcat,"index": addRowLength})

                const categoryObj = new Category({
                        _id                       : new mongoose.Types.ObjectId(),                    
                        category                  : catgName,
                        categoryNameRlang         : categoryNameRlang,
                        categoryUrl               : catgName.replace(/\s+/g, '-').toLowerCase(),
                        subCategory               : obj,
                        categoryDescription       : '',
                        categoryImage             : '',
                        categoryIcon              : '',
                        section                   : sectionname,
                        section_ID                : section,
                        createdAt                 : new Date()
                    });
                    // console.log('categoryObj-------------',categoryObj);
                    categoryObj
                    .save()
                    .then(data=>{
                    //    console.log('insertCategory',data.subCategory);
                        resolve({category_ID : data._id, category : catgName,categoryNameRlang:categoryNameRlang,subCategory_ID : (data.subCategory && data.subCategory.length>0 ? data.subCategory[0]._id : null) });

                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });
            }else{
                if (categoryPresent.subCategory) {

                var subcatg = categoryPresent.subCategory.find(subcatgObj => subcatgObj.subCategoryTitle === subcatgName);
                
                if(subcatg){
                    resolve({category_ID : categoryPresent._id, category: categoryPresent.category,categoryNameRlang:categoryPresent.categoryNameRlang, subCategory_ID : subcatg._id});
                }else{
                    //update Category collection for a new subCategory;
                    Category.updateOne(
                        { _id:categoryPresent._id},  
                        {
                            $push:  { 'subCategory' : {subCategoryTitle : subcatgName, subCategoryUrl:subcarUrl,"index":addRowLength, "subCategoryCode"   : 1+'|'+addRowLength}}
                        }
                    )
                    .exec()
                    .then(addedsubcat=>{
                        console.log("addedsubcat-----",addedsubcat);
                        if (addedsubcat.nModified == 1 ) {
                            Category.findOne({ category : catgName})
                                    .exec()
                                    .then(categoryObject=>{
                                        // console.log("categoryObject------",categoryObject);
                                        if(categoryObject){
                                           // console.log('subcategoryPresent',categoryObject.subCategory[categoryObject.subCategory.length-1]._id)

                                            //resolve(categoryObject);
                                            resolve({category_ID : categoryPresent._id, category: categoryPresent.category,categoryNameRlang:categoryPresent.categoryNameRlang, subCategory_ID : categoryObject.subCategory[categoryObject.subCategory.length-1]._id});
                                        }else{
                                            resolve(0);
                                        }
                                    })
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        reject(err);
                    });

                }
                }
                else{
                    resolve({category_ID : categoryPresent._id, category: categoryPresent.category,categoryNameRlang:categoryPresent.categoryNameRlang});
                }
                
            }
        }

        
    })                   
} 

function findSection(sectionName) {
    return new Promise(function(resolve,reject){  
    Sections.findOne({ section : { "$regex": sectionName, $options: "i"} })
                .exec()
                .then(sectionObject=>{
                    if(sectionObject){
                        resolve(sectionObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}

function findCat(catgName) {
    return new Promise(function(resolve,reject){  
    Category.findOne({ category : { "$regex": catgName, $options: "i"} })
                .exec()
                .then(categoryObject=>{
                    if(categoryObject){
                        resolve(categoryObject);
                    }else{
                        resolve(0);
                    }
                })
    })
    .catch(err =>{
        console.log(err);
        reject(err);
    });
}

var fetchAllData = async ()=>{
    return new Promise(function(resolve,reject){ 
    ExpenseTypeMaster.find({type : 'NO TAX'})
        .exec()
        .then(data=>{
            // console.log("taxdata")
            resolve( data );
        })
        .catch(err =>{
            reject(err);
        }); 
    });
};
var fetchAllEntities = async (type) => {
    return new Promise(function (resolve, reject) {
        EntityMaster.find({entityType:type})
            .sort({ createdAt: -1 })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

function findTax(taxname) {
    return new Promise(function(resolve,reject){  
        ExpenseTypeMaster.findOne({ type : { "$regex": taxname.toUpperCase(), $options: "i"} })
                .exec()
                .then(taxObject=>{
                    if(taxObject){
                        resolve(taxObject);
                    }else{
                        resolve(0);
                    }
                })
    })
    .catch(err =>{
        console.log(err);
        reject(err);
    });
}


function taxInsert(taxName,taxRate) {
    // console.log("taxName,taxRate",taxName,taxRate)
    return new Promise(function(resolve,reject){  
        maindata()
        async function maindata(){
            var taxPresent = await findTax(taxName);
            // console.log("taxPresent",taxPresent)
                if (taxPresent === 0) {
                    const expenseTypeMaster = new ExpenseTypeMaster({
                        _id           : new mongoose.Types.ObjectId(),
                        type          : taxName ? taxName.toUpperCase() : 'No Tax',
                        GSTRate       : taxRate,
                        CGSTRate      : taxRate > 0 ? taxRate/2 : 0,
                        SGSTRate      : taxRate > 0 ? taxRate/2 : 0,
                        IGSTRate      : taxRate,
                        createdAt     : new Date(),
                    })
                    expenseTypeMaster.save()
                    .then(data=>{
                        // console.log(" insertExpenseType data",data)
                        resolve(data);
                    })
                    .catch(err =>{
                        reject(err);
                    });

                }else{
                    resolve(0);
                }
    
        }        
     })
}


var insertProduct = async (section_ID, section, categoryObject, data,taxObject,EntityData = []) => {
    console.log('insertProduct data>>>>>>',data);
    return new Promise(function(resolve,reject){ 
        productDuplicateControl();
        async function productDuplicateControl(){
            var productPresent = await findProduct(data.productCode, data.itemCode,data.productName);
            var vendorData = EntityData.map((vendorarr, i)=>{
                   return vendorarr.companyName;
                })
            var productEntity  = await findVendor(vendorData);
            var vendor = '';
                // console.log('vendorData',data.vendor);
                // console.log("productEntity",productEntity)
            if(data.unit){
               var insertUOM = await insertUnitOfMeasurment(data.unit);
            }

            if(data.vendor != undefined && data.vendor != ''){
                vendor = data.vendor ? data.vendor.split('|')[1] : null;
            }else{
                vendor =  null;
            }
            if (productPresent==0) {
                var finalAttrArr = [];
                if(data.attributes){
                var attributeArr = data.attributes.map((arr, i)=>{
                    var obj = {};
                    obj.index = i;
                    obj.attributeName = arr.attributeName,
                    obj.attributeValue = arr.attributeValue
                    finalAttrArr.push(obj)
                });}
                
                    const products = new Products({
                        _id                       : new mongoose.Types.ObjectId(),   
                        user_ID                   : vendor,  
                        vendor_ID                 : productEntity._id, 
                        vendorName                : productEntity.companyName,  
                        section_ID                : section_ID,           
                        section                   : section,      
                        category                  : categoryObject.category,
                        categoryNameRlang         : categoryObject.categoryNameRlang,
                        category_ID               : categoryObject.category_ID,
                        subCategory               : data.subCategory,
                        subCategory_ID            : categoryObject.subCategory_ID ? categoryObject.subCategory_ID : null,
                        brand                     : data.brand ? data.brand : "",
                        brandNameRlang            : data.brandNameRlang ? data.brandNameRlang : "",
                        productCode               : data.productCode ? data.productCode : "",
                        itemCode                  : data.itemCode ? data.itemCode : "",
                        productName               : data.productName,
                        productNameRlang          : data.productNameRlang ? data.productNameRlang : "",
                        productUrl                : data.productName ? (data.productName).replace(/\s+/g, '-').toLowerCase() : '',
                        productDetails            : data.productDetails ? data.productDetails : "",
                        shortDescription          : data.shortDescription ? data.shortDescription : "",
                        featureList               : data.featureList ? data.featureList : "",
                        attributes                : data.attributes ? finalAttrArr : [],
                        currency                  : data.currency ? data.currency.toLowerCase() : "inr",
                        originalPrice             : data.originalPrice ? data.originalPrice : 0,
                        discountPercent           : data.discountPercent ? data.discountPercent : 0,  
                        discountedPrice           : data.discountPercent == 0 ? (data.originalPrice ? data.originalPrice : 0) : data.discountedPrice,
                        offeredPrice              : data.offeredPrice ? data.offeredPrice : "",
                        actualPrice               : data.actualPrice ? data.actualPrice : "",
                        availableQuantity         : data.availableQuantity ? data.availableQuantity : "",
                        status                    : "Draft",
                        offered                   : data.offered,
                        unit                      : data.unit ? data.unit : "",
                        size                      : data.size ? data.size : "",
                        universalProductCode      : data.universalProductCode ? data.universalProductCode : "",
                        color                     : data.color ? data.color : "",
                        exclusive                 : data.exclusive,
                        featured                  : data.featured,
                        newProduct                : data.newProduct,
                        bestSeller                : data.bestSeller,  
                        tags                      : data.tags,
                        taxInclude                : data.taxInclude,
                        taxName                   : taxObject ? taxObject.taxName : 'No Tax',
                        taxRate                   : taxObject ? (taxObject.GSTRate == undefined && taxObject.GSTRate != ''  ? 0 : taxObject.GSTRate ) : 0,
                        fileName                  : data.filename,
                        createdBy                 : data.createdBy,
                        createdAt                 : new Date()
                    });
             
                products
                .save()
                .then(data=>{
                    resolve(data._id);
                })
                .catch(err =>{
                    console.log("error---------",err);
                    reject(err);
                });
            }else{
                resolve(0);
            }
        }
    })
}

function findProduct(productCode, itemCode, productName) {
    return new Promise(function(resolve,reject){  
    Products.findOne({
                        "productCode"    : productCode ,
                        "itemCode"       : itemCode ,                        
                    })
                .exec()
                .then(productObject=>{
                    if(productObject){
                        resolve(productObject);
                    }else{
                        resolve(0);
                    }
                })
    })           
}
function findVendor(company_Name) {
    return new Promise(function(resolve,reject){  
    EntityMaster.findOne({"companyName"    : company_Name})
        .exec()
        .then(companyName=>{
            // console.log("companyName data in findVendor",companyName);
            if(companyName){
                resolve(companyName);
            }else{
                resolve(0);
            }
        })
    })           
}
exports.filedetails = (req,res,next)=>{
    var finaldata = {};
    Products.find({fileName:req.body.fileName})
    .exec()
    .then(data=>{
        //finaldata.push({goodrecords: data})
        finaldata.goodrecords = data;
        FailedRecords.find({fileName:req.body.fileName})  
            .exec()
            .then(badData=>{
                finaldata.failedRecords = badData[0].failedRecords
                finaldata.totalRecords = badData[0].totalRecords
                res.status(200).json(finaldata);
            })
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.update_product = (req,res,next)=>{
    Products.find({"itemCode" : req.body.itemCode, _id: { $ne: req.body.product_ID }})
    .exec()
    .then(data =>{
    if(data && data.length > 0){
        res.status(200).json({
            "message": "Item code for this product code already exists.",
        });
    }else{
        Products.updateOne(
            { _id:req.body.product_ID},  
            {
                $set:{
                user_ID                   : req.body.user_ID,
                vendor_ID                 : req.body.vendor_ID,  
                vendorName                : req.body.vendorName, 
                section                   : req.body.section,
                section_ID                : req.body.section_ID,          
                category                  : req.body.category,
                categoryNameRlang         : req.body.categoryNameRlang,
                category_ID               : req.body.category_ID,
                subCategory               : req.body.subCategory,
                subCategory_ID            : req.body.subCategory_ID,
                brand                     : req.body.brand,
                brandNameRlang            : req.body.brandNameRlang,
                productCode               : req.body.productCode,
                itemCode                  : req.body.itemCode,
                productNameRlang          : req.body.productNameRlang,
                productName               : req.body.productName,
                productUrl                : req.body.productUrl,
                productDetails            : req.body.productDetails,
                shortDescription          : req.body.shortDescription,
                featureList               : req.body.featureList,
                attributes                : req.body.attributes,
                currency                  : req.body.currency,
                availableQuantity         : req.body.availableQuantity,
                discountPercent           : req.body.discountPercent,
                discountedPrice           : req.body.discountedPrice,
                originalPrice             : req.body.originalPrice,
                offeredPrice              : req.body.offeredPrice,
                actualPrice               : req.body.actualPrice,
                taxId                     : req.body.taxId,
                taxName                   : req.body.taxName,
                taxInclude                : req.body.taxInclude,
                taxRate                   : req.body.taxRate, 
                status                    : req.body.status,
                tags                      : req.body.tags,
                offered                   : req.body.offered,
                unit                      : req.body.unit,
                size                      : req.body.size,
                universalProductCode      : req.body.universalProductCode,
                color                     : req.body.color,
                createdAt                 : new Date()
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Product Updated Successfully.",
                    "product_ID" : data._id
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
                });
            }
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
        console.log("err1",err);
        res.status(500).json({
            error: err
        });
    });
};
exports.update_product_attribute = (req,res,next)=>{
    // console.log("update_product_attribute",req.body);
    Products.updateOne(
            // { _id: req.body.product_ID}, 
            {_id: ObjectId(req.body.product_ID)},
            {
                $set:{
                    [req.body.attribute] : req.body.attributeValue,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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

exports.update_product_status = (req,res,next)=>{
    Products.updateOne(
            { _id:req.body.product_ID},  
            {
                $set:{
                    "status" : req.body.status,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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
exports.update_product_multiple = (req,res,next)=>{
    Products.updateMany(
            { _id:{$in : req.body.publishData}},  
            {
                $set:{
                    "status" : "Publish",
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Success",
                });
            }else{
                res.status(401).json({
                    "message": "Product Not Found"
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

exports.list_product = (req,res,next)=>{
    // Products.find({"status": "Publish"}).sort({'productName': 1})       
    Products.find({"status": "Publish"}).sort({'itemCode': 1})       
    .exec()
    .then(data=>{
        // console.log("data",data);
        // if(data.length > 0){
             res.status(200).json(data);
        // }else{
        //      res.status(200).json("It seems that you don't have any product added or you have added products but not yet published.");
        // }
       
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_productimage_with_vendor = (req,res,next)=>{
    Products.find({"vendor_ID": req.params.vendorID })       
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
exports.list_product_code = (req,res,next)=>{
    Products.find({"productCode": req.params.productCode})       
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
exports.wishlist_product = (req,res,next)=>{
    // console.log('req.body.productIDs', req.body);
    Products.find({ "_id": { $in: req.body } })       
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


exports.list_productby_type_mobile = (req,res,next)=>{
    
    var productType = req.params.productType;

    selector={};
    if(productType == 'featured'){
        selector={'featured':true,  "status": "Publish"};
        Products.find(selector) 
        .limit(6)      
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
    }
    else if(productType == 'exclusive'){
        selector={'exclusive':true,  "status": "Publish"};
        Products.find(selector)     
        .limit(6)        
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
    }
    else if(productType == 'discounted'){
        selector={'discountPercent': { $gt:0 } ,  "status": "Publish"};
        Products.find(selector)      
        .limit(10)       
        .exec()
        .then(data=>{
            // console.log('discounted ===>>>', data);
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    else if(productType == 'bestSeller'){
        selector={'bestSeller':true,  "status": "Publish"};
        Products.find(selector)       
        .limit(10)      
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
    }
    else{
        res.status(200).json([]);
    }
    
};
exports.list_product_bySection = (req,res,next)=>{
    var section = req.params.section;
    // console.log("section: +++++++++++++++++++++++",section);
    selector={'section':section,  "status": "Publish"}   
    // Products.find({"status": "Publish"}).sort({'itemCode': 1})       
    Products.find({'section':section,  "status": "Publish"}).sort({'itemCode': 1}) 
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
exports.list_product_bySection_mobile = (req,res,next)=>{
    var section = req.params.section;
    selector={'section':section,  "status": "Publish"}    
    Products.find({'section':section,  "status": "Publish"}).sort({'itemCode': 1}) 
    .limit(6)
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

exports.list_productby_type = (req,res,next)=>{
    var productType = req.params.productType;
    selector={};
    if(productType == 'featured'){
        selector={'featured':true,  "status": "Publish"};
        Products.find(selector)       
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
    }
    else if(productType == 'exclusive'){
        selector={'exclusive':true,  "status": "Publish"};
        Products.find(selector)       
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
    }
    else if(productType == 'discounted'){
        selector={'discountPercent': { $gt:0 } ,  "status": "Publish"};
        Products.find(selector)       
        .exec()
        .then(data=>{
            // console.log('discounted ===>>>', data);
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    else if(productType == 'bestSeller'){
        selector={'bestSeller':true,  "status": "Publish"};
        Products.find(selector)       
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
    }
    else{
        res.status(200).json([]);
    }
    
};
exports.list_productby_type_category = (req,res,next)=>{
    var productType = req.params.productType;
    var categoryID = req.params.categoryID;
    var selector={};
    if(productType == 'featured'){
        selector={'featured':true, 'category_ID':categoryID, "status": "Publish"};
    } else if(productType == 'exclusive'){
        selector={'exclusive':true,  'category_ID':categoryID,"status": "Publish"}; 
    } else if(productType == 'newProduct'){
        selector={'newProduct':true,  'category_ID':categoryID,"status": "Publish"};
    } else if(productType == 'bestSeller'){
        selector={'bestSeller':true,  'category_ID':categoryID,"status": "Publish"};
    }
    Products.find(selector)       
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
exports.list_product_with_limits = (req,res,next)=>{
    // console.log('req', req.body);
    Products.find()
    .sort({ "createdAt": -1 })
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            // console.log("allData x",x)
            var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
            var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '';
            return {
                "_id"                   : x._id,
                "vendorName"            : x.vendorName,
                "productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "productNameRlang"      : x.productNameRlang,
                "productName"           : "<span>"+(x.productName +productNameRlang)+"<br></span>"+"Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "section"               : x.section,
                "category"              : x.category +categoryNameRlang,
                "originalPrice"         : "<span class='textAlignRight'>"+"<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice+"</span>",
                "discountPercent"       : "<span class='textAlignRight'>"+x.discountPercent+"%"+"</span>",
                "discountedPrice"       : "<span class='textAlignRight'>"+"<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice+"</span>",
                "availableQuantity"     : x.availableQuantity,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "status"                : x.status
            }
        })
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_product_with_vendor = (req,res,next)=>{
    // console.log('req', req.body);
    Products.find({"vendor_ID" : req.body.vendor_ID})
    .sort({ "createdAt": -1 })
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
            var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '';

            return {
                "_id"                   : x._id,
                "vendorName"            : x.vendorName,
                "productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "productNameRlang"      : x.productNameRlang,
                "productName"           : x.productName +productNameRlang+"<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "section"               : x.section,
                "category"              : x.category +categoryNameRlang,
                "originalPrice"         : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice,
                "discountPercent"       : x.discountPercent+"%",
                "discountedPrice"       : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice,
                "availableQuantity"     : x.availableQuantity,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "status"                : x.status
            }
        })
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.count_product = (req,res,next)=>{
    Products.find({})
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{

            return {
                "_id"                   : x._id,
                "productCode"           : x.productCode,
                "itemCode"              : x.itemCode,
                "productName"           : x.productName,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "newProduct"            : x.newProduct,
                "bestSeller"            : x.bestSeller,
                "status"                : x.status
            }
        })
        res.status(200).json({"dataCount":allData.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.count_published_product = (req,res,next)=>{
    Products.find({'status' : 'Publish'})
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            return {
                "_id"                   : x._id,
                "productCode"           : x.productCode,
                "itemCode"              : x.itemCode,
                "productName"           : x.productName,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "newProduct"            : x.newProduct,
                "bestSeller"            : x.bestSeller,
                "status"                : x.status
            }
        })
        res.status(200).json({"dataCount":allData.length});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}; 

exports.count_vendor_product = (req,res,next)=>{
    Products.find({"vendor_ID": req.params.vendorID}).count()
    .exec()
    .then(data=>{
        // console.log(data)
        res.status(200).json({"dataCount":data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.fetch_product = (req,res,next)=>{
    Products.findOne({_id : req.params.productID})
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
exports.fetch_hot_product = (req,res,next)=>{
    Products.find({ "offered": true})
    .sort({ "createdAt": 1 })
    .limit(4)
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
exports.fetch_file = (req,res,next)=>{
    Products.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.search_file = (req,res,next)=>{
    console.log("search_file ",req.body);
    Products.find(
        {
            "$and" : [
            { "$or": 
                [{"fileName"                : {'$regex' : req.body.filename , $options: "i"} }]
            }]
        })

    // Products.find()
    .exec()
    .then(data=>{
        // res.status(200).json(data);
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};

exports.fetch_vendor_file = (req,res,next)=>{
    Products.find({"vendor_ID" : req.body.vendor_ID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": (x[i] ? x[i].replace(/\s+/, "") : "-").split('.')[0],
                'productCount': y.length != NaN ? "<p>"+y.length+"</p>" : "a",
                "_id" : x[i] != null ? x[i].replace(/\s+/, "")  : "-"
            })
            
        }
        res.status(200).json(z.slice(req.body.startRange, req.body.limitRange));
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};

exports.fetch_file_count = (req,res,next)=>{
    Products.find()
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.fetch_vendorfile_count = (req,res,next)=>{
    // console.log('req.params.vendorID', req.params.vendorID);
    Products.find({"vendor_ID" : req.params.vendorID})
    .exec()
    .then(data=>{
        var x = _.unique(_.pluck(data, "fileName"));
        var z = [];
        for(var i=0; i<x.length; i++){
            var y = data.filter((a)=> a.fileName == x[i]);
            z.push({
                "fileName": x[i],
                'productCount': y.length,
                "_id" : x[i]
            })
        }
        res.status(200).json(z.length);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
// changed by madhuri
exports.delete_file = (req,res,next)=>{
    // console.log("inside delete function",req.body.id);
    let filename = (req.params.fileName).toString();
    filename     = filename.replace('/',".");
    filename    = filename.replace('S'," ");
    filename    = filename.replace('%'," ");
    let file = req.body.id ? req.body.id : filename;
    console.log(filename);

    Products.deleteMany({"fileName" : filename})
    .exec()
    .then(data=>{
        res.status(200).json({
            "message" : "Products of file "+file+" deleted successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
};
exports.delete_product = (req,res,next)=>{
    Orders.find({"products.product_ID" : req.params.productID })
        .exec()
        .then(odata=>{
            // console.log('odata',odata);
            if (odata.length > 0) {
                res.status(200).json({
                    "message": "You cannot delete this product as orders are related to this product."
                });
            }else{
                Products.deleteOne({_id:req.params.productID})
                        .exec()
                        .then(data=>{
                            res.status(200).json({
                                "message": "Product Deleted Successfully."
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
exports.upload_photo = (req,res,next)=>{
    // console.log("input = ",req.body);
    
    Products.findOne({"_id":req.body.product_ID})
    .exec()
    .then( targetProperty =>{
        Products.updateOne(
            { "_id" : req.body.product_ID},
            {   
                $set:{                            
                    "productImage" : req.body.productImage,       
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);        
                res.status(200).json({
                    "message": "Images and Video Updated"
                });
            
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    })
    .catch(err =>{
    console.log(err);
    res.status(500).json({
        error: err
    });
    });
};
exports.upload_photo_product_code = (req,res,next)=>{
    Products.find({"itemCode" : req.body.itemCode, "productImage": req.body.productImage})
    .exec()
    .then(data=>{    
        if(data.length>0){
            res.status(200).json({
                "message": "Some images are already exist."
            });
        }else{
            Products.updateOne(
                { "itemCode" : req.body.itemCode},
                {   
                    $push:{                            
                        "productImage" : req.body.productImage,       
                    }
                }
            )
            .exec()
            .then(data=>{    
                res.status(200).json({
                    "message": "Images uploaded successfully"
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

exports.remove_photo = (req,res,next)=>{
    Products.updateOne(
        {"_id": req.body.product_ID},
        {
            $pull: {"productImage": req.body.imageLik} 
        }
    )
    .exec()
    .then(data=>{    
        res.status(200).json({
            "message": "Images deleted successfully"
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
};
exports.list_productby_section = (req,res,next)=>{
    // console.log("inside list product by section===",req.params.sectionID);
    Products.find({section_ID : req.params.sectionID, "status": "Publish"})
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
exports.list_productby_category = (req,res,next)=>{
    // console.log("categoryID==============",req.params.categoryID);
    Products.find({category_ID : req.params.categoryID, "status": "Publish"})
    .exec()
    .then(data=>{
        // console.log("category data ===:", data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.list_productby_categoryUrl = (req,res,next)=>{
    // console.log("categoryID==============",req.params.categoryUrl);
    Category.find({categoryUrl : req.params.categoryUrl})
    .exec()
    .then(data=>{
        // console.log("category data ===:", data);
        // res.status(200).json(data);
        Products.find({category_ID : data[0]._id, "status": "Publish"})
        .exec()
        .then(productData=>{
            // console.log("product category data ===:", productData);
            res.status(200).json(productData);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
};
exports.list_productby_subcategoryUrl = (req,res,next)=>{
    // var subcategory = req.params.subcategoryUrl;
    var subcategoryStr = req.params.subcategoryUrl;
    const subcategory = subcategoryStr.split("-");
    for (let i = 0; i < subcategory.length; i++) {
        subcategory[i] = subcategory[i][0].toUpperCase() + subcategory[i].substr(1);
    }
    subcategory.join(" ");
    if(subcategory){
        // console.log("subcategory",subcategory);
        Products.find({subCategory : subcategory, "status": "Publish"})
        .exec()
        .then(productData=>{
            // console.log("product subcategory data ===:", productData);
            res.status(200).json(productData);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

};
exports.list_productby_sectionUrl = (req,res,next)=>{
    // console.log("sectionurl==============",req.params.sectionUrl);
    Sections.find({sectionUrl : req.params.sectionUrl})
    .exec()
    .then(data=>{
        // console.log("section data ===:", data);
        // res.status(200).json(data);
        Products.find({section_ID : data[0]._id, "status": "Publish"})
        .exec()
        .then(productData=>{
            // console.log("product section data ===:", productData);
            res.status(200).json(productData);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
};
exports.list_productby_subcategory = (req,res,next)=>{
    // console.log(req.params.categoryID);
    // console.log(req.params.subcategoryID);
    Products.find({category_ID : req.params.categoryID, subCategory_ID:req.params.subcategoryID, "status": "Publish"})
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


exports.search_product = (req,res,next)=>{
    // console.log("req body in se// localStorage.setItem("pincode", response.data.pincode);arch ==>",req.body);
    // console.log("req params in search ==>",req.params);
    Products.find(
            {
                "$and" : [
                { "$or": 
                    [
                    {"productName"                : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"brand"                      : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"section"                    : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"category"                   : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"subCategory"                : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"productDetails"             : {'$regex' : req.params.searchstr , $options: "i"} }, 
                    {"shortDescription"           : {'$regex' : req.params.searchstr , $options: "i"} }, 
                    {"featureList.feature"  : {'$regex' : req.params.searchstr , $options: "i"} }, 
                    {"attributes.attributeName" : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"attributes.attributeValue" : {'$regex' : req.params.searchstr , $options: "i"} } 
                    ] 
                },
                { "$or": [{"status":"Publish"}] }
                ]
            }
        )
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
exports.search_product_mobileapp = (req,res,next)=>{
    // console.log("req params in search ==>",req.params);
    var selector = {};
    selector["$and"] = [];
    selector['$or'] = [];
    selector["$and"].push({ "status":"Publish" })
    selector["$or"].push({ "productName" : {'$regex' : req.params.searchstr , $options: "i" } })
    // console.log("selector in search ==>",selector);
    Products.find(selector)
    // Products.find(
    //         {
    //             "$and" : [
    //             { "$or": 
    //                 [
    //                 {"productName"                : {'$regex' : req.params.searchstr , $options: "i"} },
    //                 // {"category"                   : {'$regex' : req.params.searchstr , $options: "i"} },
    //                 ] 
    //             },
    //             { "$or": [{"status":"Publish"}] }
    //             ]
    //         }
    //     )
    .exec()
    .then(data=>{
        console.log("selector in search ==>",data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.admin_search_product = (req,res,next)=>{
    Products.find(
            {
                "$and" : [
                { "$or": 
                    [
                    {"productName"    : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"itemCode"       : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"brand"          : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"section"        : {'$regex' : req.params.searchstr , $options: "i"} },
                    {"category"       : {'$regex' : req.params.searchstr , $options: "i"} },
                    ] 
                }
                ]
            }
        )
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
            var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '';

            return {
                "_id"                   : x._id,
                "vendorName"            : x.vendorName,
                "productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "productNameRlang"      : x.productNameRlang,
                "productName"           : x.productName +productNameRlang+"<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "section"               : x.section,
                "category"              : x.category +categoryNameRlang,
                "originalPrice"         : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice,
                "discountPercent"       : x.discountPercent+"%",
                "discountedPrice"       : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice,
                "availableQuantity"     : x.availableQuantity,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "status"                : x.status
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
exports.vendor_search_product = (req,res,next)=>{
    Products.find(
        {"vendor_ID" : req.params.vendorID,
            "$and" : [
            { "$or": 
                [
                {"productName"    : {'$regex' : req.params.searchstr , $options: "i"} },
                {"itemCode"       : {'$regex' : req.params.searchstr , $options: "i"} },
                {"brand"          : {'$regex' : req.params.searchstr , $options: "i"} },
                {"section"        : {'$regex' : req.params.searchstr , $options: "i"} },
                {"category"       : {'$regex' : req.params.searchstr , $options: "i"} },
                ] 
            }
            ]
        }
    )
    .exec()
    .then(data=>{
        var allData = data.map((x, i)=>{
            var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
            var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>": '';

            return {
                "_id"                   : x._id,
                "vendorName"            : x.vendorName,
                "productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "productNameRlang"      : x.productNameRlang,
                "productName"           : x.productName +productNameRlang+ "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "section"               : x.section,
                "category"              : x.category +categoryNameRlang,
                "originalPrice"         : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice,
                "discountPercent"       : x.discountPercent+"%",
                "discountedPrice"       : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice,
                "availableQuantity"     : x.availableQuantity,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
                "status"                : x.status
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
exports.vendor_search_count_product = (req,res,next)=>{
    Products.find(
        {"vendor_ID" : req.params.vendorID,
            "$and" : [
            { "$or": 
                [
                {"productName"    : {'$regex' : req.params.searchstr , $options: "i"} },
                {"itemCode"       : {'$regex' : req.params.searchstr , $options: "i"} },
                {"brand"          : {'$regex' : req.params.searchstr , $options: "i"} },
                {"section"        : {'$regex' : req.params.searchstr , $options: "i"} },
                {"category"       : {'$regex' : req.params.searchstr , $options: "i"} },
                ] 
            }
            ]
        }
    )
    .count()
    .exec()
    .then(data=>{
        //console.log(data);
        res.status(200).json({"dataCount" :data});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.searchINCategory = (req,res,next)=>{
    
    var catArray = []
    req.body.catArray.map((data,index)=>{
        catArray.push(data.category)
    })
    var selector = {};
    if (req.body.searchstr) {
        selector = {
        "category" : {$in : catArray},
        "$and" : [
        {   "$or": [ 
                {"productName"    : {'$regex' : req.body.searchstr , $options: "i"} },
                {"brand"          : {'$regex' : req.body.searchstr , $options: "i"} },
                {"section"        : {'$regex' : req.body.searchstr , $options: "i"} },
                {"category"       : {'$regex' : req.body.searchstr , $options: "i"} },
                {"subCategory"    : {'$regex' : req.body.searchstr , $options: "i"} },
                {"productDetails" : {'$regex' : req.body.searchstr , $options: "i"} }, 
                {"shortDescription" : {'$regex' : req.body.searchstr , $options: "i"} }, 
                {"featureList.feature" : {'$regex' : req.body.searchstr , $options: "i"} },
                {"attributes.attributeName" : {'$regex' : req.params.searchstr , $options: "i"} },
                {"attributes.attributeValue" : {'$regex' : req.params.searchstr , $options: "i"} }  
            ]
        }, 
        { "$or": [{"status":"Publish"}] }
        ]}
        ;
    }else{
        selector = { "category" : {$in : catArray}, "status":"Publish" };
    }
    
    Products.find(selector)
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

exports.list_brand = (req,res,next)=>{
    console.log("req.params.sectionUrl===",req.params.sectionUrl);
    Products.distinct("brand", { "sectionUrl": req.params.sectionUrl })
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
exports.listBrandByCategories = (req,res,next)=>{
    console.log("listBrandByCategories req=====",req.body.filterUrlArray[0]);
    Category.find({"categoryUrl":req.body.filterUrlArray[0]})
    .exec()
    .then(data=>{ 
        // console.log("category brand data========",data);
        var catArray= [];
        catArray.push(data._id);
        Products.distinct("brand", {"category_ID": { $in : data._id } })
        // Products.distinct("brand", {"categoryUrl": { $in : req.body.filterUrlArray } })
        // Products.distinct("brand", { "categoryUrl": req.body.categoryUrl })
        .exec()
        .then(data=>{ 
            // console.log("brand data========",data);
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })
        
};

exports.listBrandBySubcategories = (req,res,next)=>{
    // console.log("listBrandBySubcategories req=====",req.body);
    
    Products.distinct("brand", {"subCategoryUrl": { $in : req.body.subCategoryUrl } })
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
exports.list_size = (req,res,next)=>{
    
    Products.distinct("size", {"section_ID": req.params.sectionID})
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
exports.listSizeByCategory = (req,res,next)=>{
    
    Products.distinct("size", {"category_ID": req.params.categoryID})
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
exports.listSizeBySubcategory = (req,res,next)=>{
    
    Products.distinct("size", {"subCategory_ID": req.params.subcategoryID})
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

exports.list_color = (req,res,next)=>{
    Products.distinct("color", {"section_ID": req.params.sectionID})
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

exports.listColorByCategory = (req,res,next)=>{
    Products.distinct("color", {"category_ID": req.params.categoryID})
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
exports.listColorBySubcategory = (req,res,next)=>{
    Products.distinct("color", {"subCategory_ID": req.params.subcategoryID})
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

exports.list_grocerybrand = (req,res,next)=>{
    
    Products.distinct("brand", {"section":"Grocery"})
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


exports.admin_filter_products = (req,res,next)=>{
    var selector = {};
    //console.log(req.body)
    for (var key in req.body) {
        if (key=='vendorIds' && req.body.vendorIds.length > 0 ) {
            //let objectIdArray = req.body.vendorIds.map(s => mongoose.Types.ObjectId(s));
            selector.vendor_ID =  { $in: req.body.vendorIds } 
        }
        if (key=='sectionIds' && req.body.sectionIds.length > 0) {
            //let objectIdArray = req.body.vendorIds.map(s => mongoose.Types.ObjectId(s));
            selector.section_ID =  { $in: req.body.sectionIds } 
        }
        if (key=='categoryIds' && req.body.categoryIds.length > 0) {
            selector.category_ID =  { $in: req.body.categoryIds } 
        }
        if (key=='statusArray' && req.body.statusArray.length > 0) {
            selector.status =  { $in: req.body.statusArray } 
        }
    }
    
    Products.find(selector)
    .exec()
    .then(data=>{
        //console.log(data);
        var allData = data.map((x, i)=>{
            var productNameRlang = x.productNameRlang ? "<br><span class='RegionalFont'>"+x.productNameRlang+"</span>" : '';
            var categoryNameRlang = x.categoryNameRlang ? "<br><span class='RegionalFont'>"+x.categoryNameRlang+"</span>" : '';

            return {
                "_id"                   : x._id,
                "productName"           : x.productName +productNameRlang+"<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                "section"               : x.section,
                "category"              : x.category +categoryNameRlang,
                "vendorName"            : x.vendorName,
                // "productNameBasic"      : x.productName + "<br>Product Code: "+x.productCode+ "<br>Item Code: "+x.itemCode,
                // "productNameRlang"      : x.productNameRlang,
                
                "originalPrice"         : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.originalPrice,
                "discountPercent"       : x.discountPercent+"%",
                "discountedPrice"       : "<i class='fa fa-"+x.currency+"'></i>&nbsp;"+x.discountedPrice,
                // "availableQuantity"     : x.availableQuantity,
                "status"                : x.status,
                "featured"              : x.featured,
                "exclusive"             : x.exclusive,
              
            }

              
        })
        res.status(200).json(allData.slice(req.body.startRange, req.body.limitRange));
        //res.status(200).json(allData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.admin_filter_productsCount = (req,res,next)=>{
    var selector = {};
    for (var key in req.body) {
        if (key=='vendorIds' && req.body.vendorIds.length > 0 ) {
            //let objectIdArray = req.body.vendorIds.map(s => mongoose.Types.ObjectId(s));
            selector.vendor_ID =  { $in: req.body.vendorIds } 
        }
        if (key=='sectionIds' && req.body.sectionIds.length > 0) {
            //let objectIdArray = req.body.vendorIds.map(s => mongoose.Types.ObjectId(s));
            selector.section_ID =  { $in: req.body.sectionIds } 
        }
        if (key=='categoryIds' && req.body.categoryIds.length > 0) {
            selector.category_ID =  { $in: req.body.categoryIds } 
        }
        if (key=='statusArray' && req.body.statusArray.length > 0) {
            selector.status =  { $in: req.body.statusArray } 
        }
    }
    //console.log(selector)
    Products.find(selector)
    .exec()
    .then(data=>{
        //console.log(data);
        return res.status(200).json({ "dataCount": data.length });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.filter_products_ByCategory = (req,res,next)=>{
    var selector = {};
    var attributeSelector = [];
    var finalselector = {};
    // console.log(req.body)
    // main();
    // async function main(){
    if(req.body.categoryUrl){
        Category.find({"categoryUrl":req.body.categoryUrl})
        .exec()
        .then(categorydata=>{
            // console.log("1.categorydata---",categorydata);
            finalselector.category = categorydata[0].category;
            main();
            async function main(){
            // console.log("2.inside category async");
            await getProducts(finalselector);
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }else{
        Sections.find({"sectionUrl":req.body.sectionUrl})
        .exec()
        .then(sectiondata=>{
            // console.log("sectiondata====",sectiondata);
            finalselector.section = sectiondata[0].section;
            main();
            async function main(){
            await getProducts(finalselector);
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }

    var getProducts = async(finalselector) =>{
        // console.log('3 .finalselector-----------',finalselector)
        Products.find(finalselector).limit(Number(req.body.limit))
        // Products.find(finalselector)
        .exec()
        .then(data=>{
            // console.log("4. ProductData===",data);
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    // if(req.body.category){
    //     finalselector.category = req.body.category.split('-').join(' ');
    //     finalselector.category = finalselector.category.charAt(0).toUpperCase() + finalselector.category.slice(1);
    // }   
};

exports.filter_products = (req,res,next)=>{
    var selector = {};
    var attributeSelector = [];
    var finalselector = {};

    //console.log(req.body)
    for (var key in req.body) {
        if (key != 'limit') {
            if (key == 'price') {
            selector.discountedPrice  = { $gte : req.body.price.min, $lte : req.body.price.max }
            }
            if (key == 'brands') {
                if (req.body.brands.length>0) {
                    selector.brand = { $in: req.body.brands } 
                }
            }
            if (key != 'price' && key != 'brands' && key != 'attributes') {
                selector[key] = req.body[key];
            }
            if (key == 'attributes') {
                req.body.attributes
                for (var attrkey in req.body.attributes) {
                    // console.log('dsmf',req.body.attributes[attrkey])
                    var elemMatch = {};
                    elemMatch.attributeName = { $eq: req.body.attributes[attrkey].attributeName };
                    elemMatch.attributeValue = { $eq: req.body.attributes[attrkey].attributeValue };
                    //console.log('elemMatch',elemMatch);
                    attributeSelector.push({ 
                        attributes: { $elemMatch: elemMatch }
                    })
                }
            }
        }
    }
    // console.log('selector',selector)
    // console.log('attributeSelector',JSON.stringify(attributeSelector))
    // console.log('len',attributeSelector.length)
    if (attributeSelector.length > 0) {
        finalselector.$and = [{ "$or" : [selector] }, { "$or" : attributeSelector }] 
    }else{
        finalselector.$and = [{ "$or" : [selector] }] 
    }
    //console.log(finalselector,'finalselector')
    Products.find(finalselector).limit(Number(req.body.limit))
    .exec()
    .then(data=>{
        //console.log(data);
        res.status(200).json(data);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.get_menu_list = (req,res,next)=>{
   
    Category.aggregate([
    { $lookup:
       {
         from: 'products',
         localField: '_id',
         foreignField: 'category_ID',
         as: 'orderdetails'
       }
     },
     {
        $match: {
          "orderdetails.featured": true
        }
     },
     {
        $sort: {
          "orderdetails.createdAt": -1
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

exports.get_minmaxprice = (req,res,next)=>{
    var priceArray = {}
    Products.find({"section_ID": req.params.sectionID},{discountedPrice:1}).sort({discountedPrice:1}).limit(1)
    .exec()
    .then(data=>{
        priceArray.min =  data[0].discountedPrice ;
        
            Products.find({"section_ID": req.params.sectionID},{discountedPrice:1}).sort({discountedPrice:-1}).limit(1)
            .exec()
            .then(data1=>{
                priceArray.max =  data1[0].discountedPrice ;
                res.status(200).json(priceArray);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.update_availablequantity = (req,res,next)=>{
    Products.updateOne(
        {"_id": req.body.product_ID},
        { $inc: {
            "availableQuantity" : -(req.body.quantity),
        }
    })
    .then()
    .catch();
}
exports.outofstockproducts = (req,res,next)=>{
    Products.find({ "availableQuantity" : 0 }).count()
    .exec()
    .then(data=>{
        res.status(200).json({ "dataCount": data });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.productCountByStatus = (req,res,next)=>{

    Products.aggregate([
    { '$group': {
        '_id': null,
        'total':  { $sum : 1},
        'totalDraft': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Draft']}, 
                   1,
                   0
                ]
            }
        },
        'totalPublish': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Publish']}, 
                    1, 
                    0
                ]
            }
        },
        'totalUnpublish': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Unpublish']}, 
                   1,
                   0
                ]
            }
        },
        }
    }
    ])
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
exports.vendorProductCount = (req,res,next)=>{

    Products.aggregate([
    {"$match" : {"vendor_ID": ObjectId(req.params.vendorID)}},
    { '$group': {
        '_id': null,
        'total':  { $sum : 1},
        'totalDraft': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Draft']}, 
                   1,
                   0
                ]
            }
        },
        'totalPublish': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Publish']}, 
                    1, 
                    0
                ]
            }
        },
        'totalUnpublish': { 
            '$sum': {
                '$cond': [
                    { '$eq': ['$status', 'Unpublish']}, 
                   1,
                   0
                ]
            }
        },
        }
    }
    ])
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

exports.productBulkAction = (req, res, next) => {
    var field = req.body.selectedAction;
    // console.log('field', field);
    switch (field) {
        case 'Draft':
            Products.updateMany(
                {"_id": { "$in": req.body.selectedProducts}},
                {$set:{"status":"Draft"}}
                )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected products are set as draft.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        break;
        case 'Publish':
            Products.updateMany(
                {"_id": { "$in": req.body.selectedProducts}},
                {$set:{"status":"Publish"}}
            )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected products are published.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        break ;
        case 'Unpublish':
            Products.updateMany(
                {"_id": { "$in": req.body.selectedProducts}},
                {$set:{"status":"Unpublish"}}
            )
            .exec()
            .then(data => {
                main();
                async function main() {
                    for(let i=0;i<=req.body.selectedProducts.length;i++){
                        // console.log("req.body.selectedProducts===",req.body.selectedProducts[i]);
                        await remove_product_from_cart(req.body.selectedProducts[i]);
                        await remove_product_from_wishlist(req.body.selectedProducts[i]);
                    }
                }

                return res.status(200).json({
                    "msg": 'Selected products are unpublished.',
                });

            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        break ;
        case 'Delete':
            Products.deleteMany(
                {"_id": { "$in": req.body.selectedProducts}}
                )
            .exec()
            .then(data => {
                return res.status(200).json({
                    "msg": 'Selected products are deleted.',
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
};
 
//if product is unpublish by admin and that product is available in cart collection then it should be removed from cart collection 
var remove_product_from_cart = async(productId) =>{
    // console.log("selected products=",productId);
    Carts.update(        
        {},
        {
            '$pull':{ 'cartItems':{'product_ID': productId }},            
			
        },
        {new:true,multi:true},
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            resolve(data);
        }
    })
    .catch(err =>{
        resolve(0);
    });
}
//if product is unpublish by admin and that product is available in wishlist collection then it should be removed from wishlist collection 
var remove_product_from_wishlist = async(productId) =>{
    // console.log("selected products to remove=",productId);      
    Wishlists.deleteMany({ 'product_ID': productId})
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            resolve(data);
        }
    })
    .catch(err =>{
        resolve(0);
    });
}

exports.getattributes = (req,res,next)=>{
    Products.distinct("attributes",{ "section_ID": req.params.sectionID })
    .exec()
    .then(data=>{ 
        console.log(data);
        var Results = [];
        Results = _.groupBy(data, 'attributeName')
        res.status(200).json(Results);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.getattributesbycategory = (req,res,next)=>{
    Products.distinct("attributes",{ "category_ID": req.params.categoryID })
    .exec()
    .then(data=>{ 
        console.log(data);
        var Results = [];
        Results = _.groupBy(data, 'attributeName')
        res.status(200).json(Results);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.getattributesbycategory = (req,res,next)=>{
    Products.distinct("attributes",{ "subCategory_ID": req.params.subCategoryID })
    .exec()
    .then(data=>{ 
        console.log(data);
        var Results = [];
        Results = _.groupBy(data, 'attributeName')
        res.status(200).json(Results);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.getattributesbysubcategory = (req,res,next)=>{
    Products.distinct("attributes",{ "subCategory_ID": req.params.subCategoryID })
    .exec()
    .then(data=>{ 
        console.log(data);
        var Results = [];
        Results = _.groupBy(data, 'attributeName')
        res.status(200).json(Results);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


var insertUnitOfMeasurment = async(unit,created) =>{
    // console.log("insertUnitOfMeasurment",unit);
    return new Promise(function(resolve,reject){ 
        UnitOfMeasurmentMaster.find({})
            .exec()
            .then(data=>{
                // console.log("departmentExists",data);
                var departmentExists = data.filter((data)=>{
                    if (data.unit == unit) {
                        return data;
                    }
                })

                // console.log("department Exists",departmentExists);
                if (departmentExists.length>0) {
                    // console.log("departmentExists length > 0")
                    departmentId = departmentExists[0]._id;
                    resolve( data._id );
                }else{
                     unitOfMeasurmentMaster = new UnitOfMeasurmentMaster({
                        _id                   : new mongoose.Types.ObjectId(),
                        // companyID                   : req.body.companyID,
                        unit            : unit,
                        createdBy                   : created,
                        createdAt                   : new Date()
                    })
                    unitOfMeasurmentMaster.save()
                    .then(data=>{
                        // console.log("saved");
                        resolve( data._id );
                    })
                    .catch(err =>{
                        reject(err); 
                    });
                }
            })
            .catch(err =>{
                reject(err);
            }); 
        
          
    });
}

// bulk update 
exports.bulkUploadProductUpdate = (req,res,next)=>{
    var record = []; 
    var i = 0;
    var found = 0;
    var catid;
    var subcatid;
    var failedRecords = [];
    getData();

    async function getData(){
        var productData = req.body;
        var TotalCount  = 0;
        var Count  = 0;
        var DuplicateCount  = 0;
        var invalidData = [];
        var invalidObjects = [];
        var remark = ''; 

        for(k = 0 ; k < productData.length ; k++){
            var allEntityData = await fetchAllEntities("vendor");
            if(productData[k].websiteModel === "MarketPlace"){
              var EntityData = allEntityData.filter((data)=>{
                // console.log("data.companyName == productData[k].CompanyName",data.companyName == productData[k].CompanyName);
                  if (data.companyName == productData[k].CompanyName) {
                    return data;
                    }
                  }) 
                 var EntityDataArray = EntityData.map((entityArr, i)=>{
                    return entityArr.companyName;
                  })
              }else{
                var EntityData = allEntityData.filter((data)=>{
                    // console.log("data.companyName == productData[k].CompanyName",data.companyName == productData[k].CompanyName);
                      if (data.companyName == allEntityData[0].companyName) {
                        return data;
                        }
                }) 
    
                var EntityDataArray = allEntityData[0].companyName;
              }
            if(productData[k].section !== undefined && productData[k].itemCode !== undefined && productData[k].productName !== undefined){
                if (productData[k].section.trim() != '') {
                    var sectionObject = await sectionInsert(productData[k].section)
                   
                    if (productData[k].category != undefined) {
                        var categoryObject = await categoryInsert(productData[k].category,productData[k].subCategory,productData[k].section,sectionObject.section_ID,productData[k].categoryNameRlang);
                        var taxObject = []
                        if(productData[k].taxName){
                            taxObject = await taxInsert(productData[k].taxName,productData[k].taxRate);
                            console.log("taxObject in main---",taxObject)
                        }
                        if (productData[k].itemCode != undefined) {
                            if(typeof(productData[k].discountPercent) === 'number' && productData[k].discountPercent >= 0){
                                 if(typeof(productData[k].discountedPrice) === 'number' && productData[k].discountedPrice >= 0){
                                    if(typeof(productData[k].originalPrice) === 'number' && productData[k].originalPrice >= 0 ){

                                    //     if(productData[k].websiteModel === "MarketPlace"){
                                    //        if(EntityDataArray  != "" && EntityDataArray != undefined ){
                                    //         var updateProductObject = await updateProductBulk(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0],EntityData);
                                    //        }else{
                                    //         remark+= "Company Name not found"
                                    //        }
                                    //    }else{
                                    //     var updateProductObject = await updateProductBulk(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0]);
                                    //    } 
                                       if(productData[k].websiteModel === "MarketPlace"){
                                        if(EntityDataArray  != "" && EntityDataArray != undefined ){
                                            var updateProductObject = await updateProductBulk(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0],EntityData);
                                           }else{
                                            remark+= "Company Name not found"

                                           }
                                       }else{
                                        //  var insertProductObject = await insertProduct(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0]);
                                        if(EntityDataArray  != "" && EntityDataArray != undefined ){
                                            var updateProductObject = await updateProductBulk(sectionObject.section_ID, sectionObject.section, categoryObject,productData[k],taxObject[0],EntityData);
                                           }else{
                                            remark+= "Vendor not found"

                                           }

                                       } 

                                        //  console.log('updateProductBulk',updateProductObject)

                                        if (updateProductObject != 0) {
                                            if(updateProductObject.nModified !== 0){
                                                Count++;
                                            }
                                        }else{
                                            console.log('else updateProductBulk',updateProductObject)

                                            DuplicateCount++;
                                            remark += "Item code should not be duplicate, ";
                                        }
                                    }else{
                                       remark += "Original Price should be number"; 
                                    }
                                 }else{
                                    remark += "Discount Price should be number";
                                 }  
                            }else{
                               remark += "Discount Percent should be number";
                            } 
                            
                        }  
                    }
                }
            }
            
        if (productData[k].itemCode != undefined) {
            TotalCount++;
            if(productData[k].section == undefined){
                 remark += "section not found";
            }
            if (productData[k].category == undefined) {
                remark += ", category not found, ";
            }
            if (productData[k].productCode == undefined) {
                remark += "Product code not found, ";
            }
            if (productData[k].productName == undefined) {
                remark += "Product name not found, ";
            }
            // if (productData[k].brand == undefined) {
            //     remark += "brand not found, ";
            // }
            if (productData[k].availableQuantity == undefined) {
                remark += "product quantity not found, ";
            }
            if (productData[k].originalPrice == undefined) {
                remark += "product price not found, ";
            }

        }
            

            if (remark != '') {
                invalidObjects = productData[k];
                invalidObjects.remark = remark;
                invalidData.push(invalidObjects);
            } 
            remark = '';
        }
        
        failedRecords.FailedRecords = invalidData
        failedRecords.fileName = productData[0].filename;
        failedRecords.totalRecords = TotalCount;

        await insertFailedRecords(failedRecords); 
        
        var msgstr = "";
        var warning = false;
        if (DuplicateCount > 0 && Count > 0) {
            if (DuplicateCount > 1 && Count > 1) {
               msgstr =  " " + Count+" products are updated successfully and "+"\n"+DuplicateCount+" products are duplicate";
            }
            else if(DuplicateCount ==1 && Count == 1 ){
                msgstr =  " " + Count+" product is updated successfully and "+"\n"+DuplicateCount+" product is duplicate";
            }
            else if(DuplicateCount > 1 && Count == 1)
            {
                msgstr =  " " + Count+" product is updated successfully and "+"\n"+DuplicateCount+" products are duplicate";
            }else if(DuplicateCount == 1 && Count > 1){
                msgstr =  " " + Count+" products are updated successfully and "+"\n"+DuplicateCount+" product is duplicate";
            }
            
        }
        else if(DuplicateCount > 0 && Count == 0)
        {
            if (DuplicateCount > 1) {
                msgstr = "Failed to update products as "+DuplicateCount+" products are duplicate";
                warning = true;
            }else{
                msgstr = "Failed to update products as "+DuplicateCount+" product is duplicate";
                warning = true;
            }
            
        }
        else if(DuplicateCount == 0 && Count > 0)
        { 
            if (Count > 1) {
                msgstr = " " + Count+" products are updated successfully";
            }else{
                msgstr = " " + Count+" product is updated successfully";
            }            
        }else{
            msgstr = "Failed to update products";
            warning = true;
        }

        // console.log("msgstr",msgstr);
        res.status(200).json({
            "message": msgstr,
            "warning": warning
        });
    }
};

var updateProductBulk = async (section_ID, section, categoryObject,data,taxObject=[],EntityData=[]) => {
    // console.log("taxObject--",taxObject);
        var vendorData = EntityData.map((vendorarr, i)=>{
            return vendorarr.companyName;
        })
        var productEntity  = await findVendor(vendorData);
        var vendor = '';
        return new Promise(function(resolve,reject){ 
            if(data.vendor != undefined && data.vendor != ''){
                vendor = data.vendor ? data.vendor.split('|')[1] : null;
            }else{
                vendor =  null;
            }
           
            Products.updateOne(
                { itemCode:data.itemCode},  
                {
                    $set:{
                        user_ID                   : vendor,  
                        vendor_ID                : productEntity._id, 
                        vendorName                : productEntity.companyName, 
                        section_ID                : section_ID,           
                        section                   : section,      
                        category                  : categoryObject.category,
                        category_ID               : categoryObject.category_ID,
                        subCategory               : data.subCategory,
                        subCategory_ID            : categoryObject.subCategory_ID ? categoryObject.subCategory_ID : null,
                        brand                     : data.brand ? data.brand : "",
                        brandNameRlang            : data.brandNameRlang ? data.brandNameRlang : "",
                        // productCode               : data.productCode ? data.productCode : "",
                        // itemCode                  : data.itemCode ? data.itemCode : "",
                        productName               : data.productName,
                        productNameRlang          : data.productNameRlang ? data.productNameRlang : "",
                        productUrl                : !isNaN(data.productName) ? data.productName.replace(/\s+/g, '-').toLowerCase() : null,
                        productDetails            : data.productDetails ? data.productDetails : "",
                        shortDescription          : data.shortDescription ? data.shortDescription : "",
                        featureList               : data.featureList ? data.featureList : "",
                        attributes                : data.attributes ? data.attributes : [],
                        currency                  : data.currency ? data.currency.toLowerCase() : "inr",
                        originalPrice             : data.originalPrice ? data.originalPrice : 0,
                        discountPercent           : data.discountPercent ? data.discountPercent : 0,  
                        discountedPrice           : data.discountPercent == 0 ? (data.originalPrice ? data.originalPrice : 0) : data.discountedPrice,
                        offeredPrice              : data.offeredPrice ? data.offeredPrice : "",
                        actualPrice               : data.actualPrice ? data.actualPrice : "",
                        availableQuantity         : data.availableQuantity ? data.availableQuantity : "",
                        status                    : "Draft",
                        offered                   : data.offered,
                        unit                      : data.unit ? data.unit : "",
                        size                      : data.size ? data.size : "",
                        color                     : data.color ? data.color : "",
                        exclusive                 : data.exclusive,
                        featured                  : data.featured,
                        newProduct                : data.newProduct,
                        bestSeller                : data.bestSeller,  
                        tags                      : data.tags,
                        taxInclude                : data.taxInclude,
                        taxName                   : taxObject ? taxObject.taxName : 'No Tax',
                        taxRate                   : taxObject ? (taxObject.GSTRate == undefined && taxObject.GSTRate != ''  ? 0 : taxObject.GSTRate ) : 0,
                        fileName                  : data.filename,
                        updatedBy                 : data.createdBy,
                        updatedAt                 : new Date()
                    }
                }
            )
            .exec()
            .then(data=>{
                 resolve(data);
            })
            .catch(err =>{
                reject(err);
            });
       
    });
}

exports.checkItemCodeExists = (req,res,next)=>{
    Products.find({"itemCode" : req.params.itemcode})
    .then(data =>{
        if(data && data.length > 0){
            res.status(200).json({
            "message": "Item code already exists.",
            "exists" : true
            });
        }else{
            res.status(200).json({
                "message": "Item code not exists.",
                "exists" : false

            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({  
            error: err
        });
    });

}
