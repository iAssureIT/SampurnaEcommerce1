const globalVariable    = require("../../nodemon.js");
const axios             = require('axios');
const { indexOf }       = require('underscore');

exports.create_notification = (req,res,next)=>{
    console.log("send Notification req.body => ", req.body);
    var notificationValues = {
        event             : "Signup",
        toUser_id         : result.data._id,
        toUserRole        : roles,
        // company_id        : vendor_id,
        // otherAdminRole    :'vendoradmin',
        variables         : {
            loginID         : username, 
            signupDate      : moment(new Date()).format('DD/MM/YYYY'),
            firstName       : firstname, 
            lastName        : lastname, 
            fullName        : fullName, 
            emailAddress    : email, 
            mobileNum       : mobile
        }
    };    

    axios.post('http://localhost:'+globalVariable.port+'/api/masternotifications/post/sendNotification', notificationValues)
    .then((res) => {
        console.log("res => ",res)
    })
    .catch((error) => { console.log('notification error: ',error)})
};
