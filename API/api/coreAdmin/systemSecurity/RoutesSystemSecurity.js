const express 			= require("express");
const router 			= express.Router();
const checkAuth       	= require('../middlerware/check-auth.js');
const UserController  	= require('./ControllerSystemSecurity.js');
const UserController1 	= require('./newController.js');

router.post('/post/signup/user', UserController.user_signup_user); //Working
router.post('/post/signup/user/otp', UserController.user_signup_user_otp); //Working
router.get('/get/checkemailotp/usingID/:ID/:emailotp',UserController.check_userID_EmailOTP);
router.get('/get/checkemailotp/usingUsername/:username/:emailotp',UserController.check_username_EmailOTP);
router.post('/post/login',UserController.user_login_using_email); //Working
router.post('/post/logout',UserController.logouthistory); //Working
router.post('/post/loginwithcompanyid',UserController.user_login_with_companyID); //Working
router.patch('/patch/change_password_withoutotp/id/:ID',UserController.user_update_password_withoutotp_ID);
router.patch('/patch/change_password_withoutotp/username/:username',UserController.user_update_password_withoutotp_username);
router.patch('/patch/setsendemailotpusingID/:ID',UserController.set_send_emailotp_usingID);
router.patch('/patch/setsendemailotpusingEmail/:emailId',UserController.set_send_emailotp_usingEmail);


//API for Mobile app
router.post('/post/login/mobile',UserController.user_login_using_mobile); //Working
router.post('/post/signup_user', UserController1.user_signup_user); //Working
router.get('/get/checkmobileotp/usingID/:ID/:mobileotp',UserController.check_userID_MobileOTP);//Working
router.patch('/patch/setsendmobileotpusingID/:ID',UserController.set_send_mobileotp_usingID);//working
router.patch('/patch/setsendmobileotpusingMobile/:mobileNo',UserController.set_send_mobileotp_usingMobile);//working


//new api for systemsecurity
router.post('/post/login/mob_email',UserController.user_login_mob_email); 
router.post('/post/signup/user/otp/new',UserController.user_signup_user_otp_new); 
router.post('/post/signup/user/guest_login',UserController.user_signup_guest_login); 
router.patch('/patch/set_send_otp/:username',UserController.set_send_otp); 


module.exports = router;
