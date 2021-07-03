const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
const DriverTracking = require('./Model.js')
var request = require('request-promise');

//Write By Rushikesh
exports.addActivity = (req, res, next) => {
    console.log("moment(req.body.currentDate).format",moment(req.body.currentDate).format("YYYY-MM-DD"));
    console.log("req.body",req.body);
	DriverTracking.findOne({_id:req.body.user_id, currentDateStr:moment(req.body.currentDate).format("YYYY-MM-DD")})
    .exec()
    .then(tracking => {
        console.log("tracking",tracking);
        if(tracking){
            DriverTracking.updateOne(
                {_id: req.body.user_id},
                {
                    $push:{
                        onlineActivities : req.body.onlineActivities,
                    }
                }
            )
            .then(data=>{
                res.status(200).json({
                    "message"   : "You are" + req.body.onlineActivities.activity,
                });
            })
            .catch(err =>{
                console.log('err',err);
                res.status(500).json({
                    error: err
                });
            });
        }else{
            const tracking = new DriverTracking({
                _id                 :   new mongoose.Types.ObjectId(),  
                "user_Id"           :   req.body.user_Id,
                "currentDate"       :   new Date(),
                "currentDateStr"    :   moment().format("YYYY-MM-DD"),
                "onlineActivities"  :   req.body.onlineActivities
            });
            tracking.save()
            .then(data=>{
                res.status(200).json({
                    "message"   : "You are" + req.body.onlineActivities.activity,
                });
            })
            .catch(err =>{
                console.log('err',err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};


exports.startTracking = (req, res, next) => {
    console.log("req.body",req.body);
    DriverTracking.updateOne(
        {_id: req.body.user_id, currentDateStr:moment(req.body.currentDate).format("YYYY-MM-DD")},
        {
            $push:{
                currentLocations : req.body.currentLocations,
            }
        }
    )
    .then(data=>{
        res.status(200).json({
            "message"   : "Tracking Started",
        });
    })
    .catch(err =>{
        // console.log('4',err);
        res.status(500).json({
            error: err
        });
    });
}
