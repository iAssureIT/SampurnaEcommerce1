const mongoose	= require("mongoose");
const Masternotifications = require('./ModelMasterNotification.js');
const Notifications         = require('./ModelNotification.js');
const User 				    = require('../userManagement/ModelUsers.js');
const PersonMaster          = require('../personMaster/ModelPersonMaster.js');
const EntityMaster          = require('../entityMaster/ModelEntityMaster.js');
const nodeMailer            = require('nodemailer');
const GlobalMaster        = require('../projectSettings/ModelProjectSettings.js');
// const plivo             = require('plivo');
const MSG91 = require('msg91');
const axios             = require('axios');



exports.create_masternotification = (req,res,next)=>{
	Masternotifications.findOne({templateType:req.body.templateType,event:req.body.event,role:req.body.role,status:req.body.status,company:req.body.company})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Notification Details already exists'
				});
			}else{
				const masternotifications = new Masternotifications({
                    _id             : new mongoose.Types.ObjectId(),
                    templateType    : req.body.templateType,	
                    event           : req.body.event,    
                    templateName    : req.body.templateName,    
                    role            : req.body.role,
                    company         : req.body.company,
                    subject         : req.body.subject,
                    content         : req.body.content,	
                    status          : req.body.status, 
                    createdAt       : new Date(),
                    createdBy       : req.body.createdBy,
                });
                masternotifications.save()
                    .then(data=>{
                        res.status(200).json({message: "Notification Details Added",ID:data._id});
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
exports.list_masternotification = (req,res,next)=>{
    Masternotifications.find({})
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

exports.list_mode_masternotification = (req,res,next)=>{
    Masternotifications.find({"templateType":req.body.mode,"event":req.body.event})
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
exports.detail_masternotification = (req,res,next)=>{
    Masternotifications.findOne({_id:req.params.notificationmaster_ID})
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
exports.update_masternotification = (req,res,next)=>{
    Masternotifications.updateOne(
        { _id:req.params.ID},  
        {
            $set:{
                status          : req.body.status,
                subject         : req.body.subject,
                content         : req.body.content
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({ message:"Master notifications Updated"});
        }else{
            res.status(401).json({ message:"Master notifications Found"});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.update_status = (req,res,next)=>{
    Masternotifications.updateOne(
        { _id:req.body.notifId},  
        {
            $set:{
                status          : req.body.status,
            }
        }
    )
    .exec()
    .then(data=>{
        if(data.nModified == 1){
            res.status(200).json({ updated : true });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
exports.delete_masternotification = (req,res,next)=>{
    Masternotifications.deleteOne({_id:req.params.ID})
        .exec()
        .then(data=>{
            if(data.deletedCount == 1){
                res.status(200).json("Master notification deleted");
            }else{
                res.status(401).json("Master notification not found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.deleteall_masternotification = (req,res,next)=>{
    Masternotifications.deleteMany({})
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.deletedCount > 0){
                res.status(200).json("All Master notification deleted");
            }else{
                res.status(401).json("Master notification not found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.filterTemplate = (req,res,next)=>{
    var selector = {}; 
    selector['$and']=[];

    if (req.body.filterEvent) {
        selector["$and"].push({ event : { $regex : req.body.filterEvent, $options: "i"}  })
    }
    if (req.body.filterRole) {
        selector["$and"].push({ role : { $regex : req.body.filterRole, $options: "i"}  })
    }
    if (req.body.filterStatus) {
        selector["$and"].push({ status : { $regex : req.body.filterStatus, $options: "i"}  })
    }
    if (req.body.filterCompany) {
        selector["$and"].push({ company : req.body.filterCompany })
    }
    
    Masternotifications.find(selector)
    .sort({createdAt : -1})
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


exports.send_notifications = (req, res, next) => {
    console.log('req.body.event====<>>>>>',req.body.event);
    // console.log('status:'active'====<>>>>>',req.body.event);
    Masternotifications.find({event: req.body.event,status:'active'})
    .sort({createdAt:1})
    .exec()
    .then(data=>{
        main();
        async function main(){
            console.log('========================================================')
            var returnData = data
            console.log('returnData=>',returnData)
            if(returnData && returnData.length > 0){
                for(var i=0 ; i< returnData.length ; i++){
                    console.log("Entering for loop for returnData at : ",i)
                    var role = returnData[i].role;
                    var company = req.body.company_id;
                    var templateName = returnData[i].event;
                    var mode = returnData[i].templateType;
                    // console.log('========================================================')

                    console.log(role,templateName,mode)
                    if(role == 'admin'){
                        console.log('admin==>',mode,templateName,company)
                        var userData = await getAdminUserData();
                        if(userData && userData.length > 0){
                           for(var j=0 ; j<userData.length ; j++){
                            var userRole = userData[j].role
                            var checkRole = userRole.includes(role);
                            if(checkRole){
                                await callTemplates(mode,userData[j],role,templateName,company,req.body.variables,req.body.attachment)
                            }
                           }//j 
                        }
                        
                    }else if(role === req.body.toUserRole){
                         console.log('self==>',mode,templateName,company)
                        var userData = await getSelfUserData(req.body.toUser_id);
                        var userRole = userData.role
                        var checkRole = userRole.includes(role);
                        if(checkRole){
                            await callTemplates(mode,userData,role,templateName,company,req.body.variables,req.body.attachment)
                        }
                    }else if(role === req.body.intendedUserRole){
                         console.log('manager==>',mode,templateName,company)
                        var userData = await getIntendedUserData(req.body.intendedUser_id);
                        var userRole = userData.role
                        var checkRole = userRole.includes(role);
                        if(checkRole){
                            await callTemplates(mode,userData,role,templateName,company,req.body.variables,req.body.attachment)
                        }
                    }else if(role === req.body.otherAdminRole && req.body.company_id){
                         console.log('corporate==>',mode,templateName,company)
                        var userData = await getOtherAdminData(req.body.otherAdminRole,req.body.company_id);
                        if(userData && userData.length > 0){
                           for(var j=0 ; j<userData.length ; j++){
                            var userRole = userData[j].role
                            var checkRole = userRole.includes(role);
                            if(checkRole){
                                await callTemplates(mode,userData[j],role,templateName,company,req.body.variables,req.body.attachment)
                            }
                           }//j 
                        }
                    }else{
                        console.log('No data found')
                    }

                    console.log('***************************************************')

                }//i
            }//returnData
        }
    })
    .catch(err =>{
        res.status(500).json({ error: err });
    });
    
}

function callTemplates(mode,userData,role,templateName,company,variables,attachment){
    sub();
        async function sub(){
             // //==============  SEND EMAIL ================
            if(mode === 'Email'){
                var toEmail = userData.email;
                const emailDetails = await getTemplateDetailsEmail(company,templateName,userData.role,variables);
                const sendMail = await sendEmail(toEmail,emailDetails.subject,emailDetails.content,attachment)
                
            }else if(mode === 'Notification'){
                var toUserId = userData.id;
                const notificationDetails = await getTemplateDetailsInApp(company,templateName,userData.role,variables); 
                const sendNotification = await sendInAppNotification(toUserId,userData.email,templateName,notificationDetails)
               
            }else if(mode === 'SMS'){
                var toMobile = userData.mobile;
                const SMSDetails = await getTemplateDetailsSMS(company,templateName,userData.role,variables);
                var text = SMSDetails.content.replace(/<[^>]+>/g, '');
                const SMS = await sendSMS(toMobile,text); 
                
            }// mode == 'SMS'
        }
}

function getAdminUserData() {
    return new Promise(function (resolve, reject) {
        User.find({"roles":"admin"})
        .exec()
        .then(data => {
            if(data && data.length>0){
                var userData = []
                for(var i=0 ; i<data.length ; i++){
                    if(data[i].profile){
                        userData.push({email:data[i].profile.email,
                                id: data[i]._id,
                                mobile: data[i].profile.mobile,
                                role:"admin"
                        });
                    }
                }//i
                resolve(userData)
            }
        })
        .catch(err => {
            console.log(err);
            reject({
                error: err
            });
        });

    });
}

function getSelfUserData(toUserId) {
    return new Promise(function (resolve, reject) {
        User
            .findOne({ "_id": toUserId })
            .exec()
            .then(data => {
                resolve({email:data.profile.email,
                        id: data._id,
                        mobile: data.profile.mobile,
                        role:data.roles
                });
            })
            .catch(err => {
                console.log(err);
                reject({
                    error: err
                });
            });

    });
}

function getIntendedUserData(toUserId) {
    return new Promise(function (resolve, reject) {
        PersonMaster.findOne({'_id':toUserId})
        .exec()
        .then(result=>{
         User
            .findOne({ "_id": result.userId })
            .exec()
            .then(data => {
                if(data && data.profile){
                resolve({email:data.profile.email,
                        id: data._id,
                        mobile: data.profile.mobile,
                        role:data.roles
                });
                }
            })
            .catch(err => {
                console.log(err);
                reject({
                    error: err
                });
            });
        })
        .catch(err =>{
            console.log('personMaster error: ',err)
        })

    });
}


function getOtherAdminData(role,company_id){
    return new Promise(function (resolve, reject) {
        EntityMaster.findOne({'_id':company_id})
        .exec()
        .then(result => {
        
            if(result.companyID){
                User
                .find({ "profile.companyID": result.companyID, "roles":role})
                .exec()
                .then(data => {
                    if(data && data.length>0){
                        var userData = []
                        for(var i=0 ; i<data.length ; i++){
                            if(data[i].profile){
                                userData.push({email:data[i].profile.email,
                                        id: data[i]._id,
                                        mobile: data[i].profile.mobile,
                                        role:data[i].roles
                                });
                            }
                        }//i
                        resolve(userData)
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject({
                        error: err
                    });
                });
            }
            
        })
        .catch(err =>{
            console.log('entityMaster error: ',err)
        })

    });
}


function sendSMS(MobileNumber,text){
    console.log('=====INSIDE SMS======',MobileNumber,text)
        GlobalMaster.findOne({type:'SMS'})
        .exec() 
        .then(data=>{
            console.log('data.authID,data.authToken,data.sourceMobile: ',data.authToken,data.sourceMobile)
            var msg91 = require("msg91")(data.authToken, "UniMan", "4" );
            var mobileNo = "91"+MobileNumber;
            // console.log("mobileNo IN SMS=====>",mobileNo);
            // console.log("mobileNo IN text.toString()=====>",text);
            msg91.send(mobileNo, text.toString(), function(err, response){
                console.log(err);
                console.log("response=====>",response);
            });
        })
        .catch(err =>{
            console.log('sms error: ',err)
        });
      
        
    // })
}

function sendInAppNotification(toUserId,email,event,notificationDetails){
    console.log('=====INSIDE InApp======',notificationDetails,event)
    return new Promise(function (resolve, reject) {
        const InAppNotification = new Notifications({
            _id             : new mongoose.Types.ObjectId(),
            masternotificationId : notificationDetails.id,
            toMailId        : email,
            event           : event,
            toUserId         : toUserId,
            status          : 'Unread',
            notifBody       : notificationDetails.content,
            createdAt       : new Date()
        });
        InAppNotification.save()
        .then(data=>{
            resolve(data);
        })
        .catch(err =>{
            reject(err);
        });
    })
}

function sendEmail(toEmail,subject,content,attachment){
    console.log('====**INSIDE EMAIL**=====',toEmail,subject,content,attachment)
    if(attachment == null || attachment == undefined || attachment == ""){
        var attachment = []
    }else{
        var attachment = [attachment]
    }
    // async function main() { 
      GlobalMaster.findOne({type:'EMAIL'})
        .exec() 
        .then(data=>{
            const senderEmail = data.user;
            const senderEmailPwd = data.password;
            // create reusable transporter object using the default SMTP transport
              let transporter = nodeMailer.createTransport({
                host: data.emailHost,
                port: data.port,
                // secure: false, // true for 465, false for other ports
                auth: {
                  user: senderEmail, 
                  pass: senderEmailPwd 
                }
              });

              // send mail with defined transport object
              var mailOptions = {
                    from: data.projectName+'" Admin" <' + senderEmail + '>', // sender address
                    to: toEmail, // list of receiver
                    subject: subject, // Subject line
                    html: "<pre>" + content + "</pre>", // html body
                    attachments: attachment,
                };
               let info =  transporter.sendMail(mailOptions, (error, info) => {
                    console.log("Message sent: %s", error,info);
                });
             
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // console.log("Message sent: %s", info.messageId);
              // Preview only available when sending through an Ethereal account
              // console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              
            

        })
        .catch(err =>{
            console.log('mail error=>',err)
        });
         // main().catch(err=>{console.log('mail error=>',err)});
      
   // }
   
}


function getTemplateDetailsEmail(company,templateName,role,variables) {
    console.log("getTemplateDetailsEmail===>",company,templateName, variables)
    
    return new Promise(function (resolve, reject) {
        Masternotifications
            .findOne({ "event": templateName, "templateType": 'Email', "company":company, "role":role, status:'active' })
            .exec()
            .then(NotificationData => {
                if (NotificationData) {
                    var content = NotificationData.content;
                    var wordsplit = [];
                    if (content.indexOf('[') > -1) {
                        wordsplit = content.split('[');
                    }
                    var tokens = [];
                    var n = 0;
                    for (i = 0; i < wordsplit.length; i++) {
                        if (wordsplit[i].indexOf(']') > -1) {
                            tokensArr = wordsplit[i].split(']');
                            tokens[n] = tokensArr[0];
                            n++;
                        }
                    }
                    var numOfVar = Object.keys(variables).length;
                    for (i = 0; i < numOfVar; i++) {
                        content = content.replace(tokens[i], variables[tokens[i]]);
                    }
                    if(i >= numOfVar){
                        content = content.split("[").join(" ");
                        content = content.split("]").join(" ");
                        var tData = {
                            content: content,
                            subject: NotificationData.subject
                        }
                        resolve({
                            content: content,
                            subject: NotificationData.subject
                        });
                    }
                }else{
                    Masternotifications
                    .findOne({ "event": templateName, "templateType": 'Email', "company":null, "role":role, status:'active' })
                    .exec()
                    .then(NotificationData => {
                            var content = NotificationData.content;
                            var wordsplit = [];
                            if (content.indexOf('[') > -1) {
                                wordsplit = content.split('[');
                            }
                            var tokens = [];
                            var n = 0;
                            for (i = 0; i < wordsplit.length; i++) {
                                if (wordsplit[i].indexOf(']') > -1) {
                                    tokensArr = wordsplit[i].split(']');
                                    tokens[n] = tokensArr[0];
                                    n++;
                                }
                            }
                            var numOfVar = Object.keys(variables).length;
                            for (i = 0; i < numOfVar; i++) {
                                content = content.replace(tokens[i], variables[tokens[i]]);
                            }
                            if(i >= numOfVar){
                                content = content.split("[").join(" ");
                                content = content.split("]").join(" ");
                                var tData = {
                                    content: content,
                                    subject: NotificationData.subject
                                }
                                resolve({
                                    content: content,
                                    subject: NotificationData.subject
                                });
                            }
                        
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
        
   
}
function getTemplateDetailsSMS(company, templateName,role,variables) {
    console.log('|||||||||||||INSIDE SMS TEMPLATE||||||||||||',company, templateName,role,variables)
    return new Promise(function (resolve, reject) {
        Masternotifications
            .findOne({ "event": templateName, "templateType": 'SMS', "company": company, "role":role, status:'active' })
            .exec()
            .then(NotificationData => {
                if (NotificationData) {
                    var content = NotificationData.content;
                    var wordsplit = [];
                    if (content.indexOf('[') > -1) {
                        wordsplit = content.split('[');
                    }
                    var tokens = [];
                    var n = 0;
                    for (i = 0; i < wordsplit.length; i++) {
                        if (wordsplit[i].indexOf(']') > -1) {
                            tokensArr = wordsplit[i].split(']');
                            tokens[n] = tokensArr[0];
                            n++;
                        }
                    }
                    var numOfVar = Object.keys(variables).length;
                    for (i = 0; i < numOfVar; i++) {
                        content = content.replace(tokens[i], variables[tokens[i]]);
                    }
                    content = content.split("[").join(" ");
                    content = content.split("]").join(" ");
                    var tData = {
                        content: content,
                        subject: NotificationData.subject
                    }
                    resolve(tData);
                }else{
                     Masternotifications
                    .findOne({ "event": templateName, "templateType": 'SMS', "company": null, "role":role, status:'active' })
                    .exec()
                    .then(NotificationData => {
                        if (NotificationData) {
                            var content = NotificationData.content;
                            var wordsplit = [];
                            if (content.indexOf('[') > -1) {
                                wordsplit = content.split('[');
                            }
                            var tokens = [];
                            var n = 0;
                            for (i = 0; i < wordsplit.length; i++) {
                                if (wordsplit[i].indexOf(']') > -1) {
                                    tokensArr = wordsplit[i].split(']');
                                    tokens[n] = tokensArr[0];
                                    n++;
                                }
                            }
                            var numOfVar = Object.keys(variables).length;
                            for (i = 0; i < numOfVar; i++) {
                                content = content.replace(tokens[i], variables[tokens[i]]);
                            }
                            content = content.split("[").join(" ");
                            content = content.split("]").join(" ");
                            var tData = {
                                content: content,
                                subject: NotificationData.subject
                            }
                            resolve(tData);
                        }//NotificationData
                    })
                    .catch(err => {
                        console.log(err);
                        err.status(500).json({
                            error: err
                        });
                    });
                }
            })
            .catch(err => {
                console.log(err);
                err.status(500).json({
                    error: err
                });
            });
    });
}

function getTemplateDetailsInApp(company, templateName,role,variables) {
    console.log('in app: ',company,templateName, variables)
    return new Promise(function (resolve, reject) {
        Masternotifications
            .findOne({ "event": templateName, "templateType": 'Notification', "company": company, "role":role, status:'active' })
            .exec()
            .then(NotificationData => {
                if (NotificationData) {
                    var content = NotificationData.content;
                    var wordsplit = [];
                    if (content.indexOf('[') > -1) {
                        wordsplit = content.split('[');
                    }
                    var tokens = [];
                    var n = 0;
                    for (i = 0; i < wordsplit.length; i++) {
                        if (wordsplit[i].indexOf(']') > -1) {
                            tokensArr = wordsplit[i].split(']');
                            tokens[n] = tokensArr[0];
                            n++;
                        }
                    }
                    var numOfVar = Object.keys(variables).length;
                    for (i = 0; i < numOfVar; i++) {
                        content = content.replace(tokens[i], variables[tokens[i]]);
                    }
                    content = content.split("[").join(" ");
                    content = content.split("]").join(" ");
                    var tData = {  
                        id:NotificationData._id,  
                        content: content,
                    }
                    resolve(tData);
                }else{
                     Masternotifications
                    .findOne({ "event": templateName, "templateType": 'Notification', "company": null, "role":role, status:'active' })
                    .exec()
                    .then(NotificationData => {
                        if (NotificationData) {
                            var content = NotificationData.content;
                            var wordsplit = [];
                            if (content.indexOf('[') > -1) {
                                wordsplit = content.split('[');
                            }
                            var tokens = [];
                            var n = 0;
                            for (i = 0; i < wordsplit.length; i++) {
                                if (wordsplit[i].indexOf(']') > -1) {
                                    tokensArr = wordsplit[i].split(']');
                                    tokens[n] = tokensArr[0];
                                    n++;
                                }
                            }
                            var numOfVar = Object.keys(variables).length;
                            for (i = 0; i < numOfVar; i++) {
                                content = content.replace(tokens[i], variables[tokens[i]]);
                            }
                            content = content.split("[").join(" ");
                            content = content.split("]").join(" ");
                            var tData = {  
                                id:NotificationData._id,  
                                content: content,
                            }
                            resolve(tData);
                        }//NotificationData
                    })
                    .catch(err => {
                        console.log(err);
                        reject({
                            error: err
                        });
                    });
                }
            })
            .catch(err => {
                console.log(err);
                reject({
                    error: err
                });
            });
    });
}



