import React     from 'react';
import axios     from 'axios';
import {connect} from 'react-redux';
import dynamic   from 'next/dynamic'
import getConfig from 'next/config';
import Head      from 'next/head';
import Router    from 'next/router';
import Link      from 'next/link';
import swal      from 'sweetalert';
import Login     from '../../systemSecurity/Login.js';
import SignUp    from '../../systemSecurity/SignUp.js';
import ForgotPassword from '../../systemSecurity/ForgotPassword';
import ConfirmOtp     from '../../systemSecurity/ConfirmOtp.js';
import ResetPassword  from '../../systemSecurity/ResetPassword.js'
import {getBlockData} from '../../../redux/actions/counterActions';
import {getForm,updateForm} from '../../../redux/actions';

const { publicRuntimeConfig } = getConfig();

class header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageData:{},
			Blocks:[],
			blocks:"",
			ListOfBlocks : "",
			pageHead : {
				pageAuthor		: "",
				pageDescription	: "",
				pageWords		: [""],
            },
            userDetails : [],
            preferencedata : [],
            loggedIn: false,
            userId: '',
		}; 
    }
    componentDidMount(){        
        const userDetails = localStorage.getItem('userDetails');
        const userDetailsParse = JSON.parse(userDetails);
        const websiteModel = localStorage.getItem("websiteModel");
        const showLoginAs  = localStorage.getItem("showLoginAs");
        const preferencedata = localStorage.getItem("preferencedata");
        if(localStorage.getItem('user_ID')){
            
            this.setState({
                loggedIn    : true,
                userDetails : userDetailsParse,
                userId      : localStorage.getItem('user_ID'),
                preferencedata : {'websiteModel':websiteModel,'showLoginAs':showLoginAs,'preferencedata':preferencedata}
            },()=>{
                this.getUserData();
            })
        }
        
    }
    getUserData() {
        const userid = localStorage.getItem('user_ID');
        // console.log("getUserData  userId===",userid);
        if(this.state.userId){
        axios.get('/api/users/' +this.state.userId)
          .then((res) => {
            if(res.data){
            //   console.log("response===",res.data);  
              this.setState({
                userData : res.data.profile,
                firstname: res.data.profile.firstname.substring(0, 1),
                lastname : res.data.profile.lastname.substring(0, 1)
              },()=>{
                // console.log("userData==============",this.state.userData);
              })
            }else{
              this.setState({
                userData  : "",
                firstname : "",
                lastname  : ""
              },()=>{
    
              })
            }         
            
          })
          .catch((error) => {
            console.log("error fetch user data = ", error);
          });
        }
      }
    
	CloseModal() {
        // $('#loginFormModal').hide(1000);
        this.props.updateFormValue("login");
    }
    async signOut(event) {
        event.preventDefault();
        // localStorage.setItem("user_ID", "");
        // localStorage.setItem("userDetails", "");
        // this.props.fetchCartData(); 
        var token = localStorage.removeItem("user_ID");
        swal("Thank You.","You have been logged out Successfully!");
        if (token !== null) {
          this.setState({
            loggedIn: false
          })
        }
        Router.push('/');
    
    }
   render() {
    return (
		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding loginViewWrapper ">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ">
              {this.state.loggedIn ? 
                <li className="dropdown myaccDropdown col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding ">
                        <div className="faIcon faLoginIcon col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">     
                            <span style={{float: "right"}} className="faIcon col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding"><span className="loginView col-lg-12 col-md-12 col-sm-12 col-xs-12">My Account</span></span> 
                        </div>
                    </span>
                    <ul className="col-lg-3 col-md-3 col-sm-3 col-xs-3 dropdown-menu list-DropDownMenu">                                        
                        <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">                            
                            <div className="row">
                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                <div className="shortnamebk">
                                    <div className="">                                                    
                                        <div className="userinfo">{this.state.firstname}{this.state.lastname}</div>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="userinfotext"><span >{this.state.userData ? this.state.userData.fullName : null}</span></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="useremail"><span>{this.state.userData ? this.state.userData.email : null}</span></div>
                                </div>
                                </div>
                            </div>                            
                        </li>                                  
                        <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding myAccMenu"><Link href="/account"><a>My Profile</a></Link></li>
                        <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding myAccMenu"><Link href="/my-orders"><a>My Orders</a></Link></li>
                        <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding myAccMenu"><Link href="/wishlist"><a>My Wishlist</a></Link></li>
                        <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding myAccMenu globalSignoutBtn signoutBtn"  onClick={this.signOut.bind(this)}><Link href="/"><a style={{color:"#fff"}}>Sign Out</a></Link></li>
                    </ul>
                </li>
                : <span className="beforeLogin col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                    <a href="" className="faIcon faLoginIcon col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding pull-right" data-toggle="modal" data-target="#loginFormModal" data-backdrop="true" id="loginModal" area-hidden ="true"> 
                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 loginView">Login</span> 
                    </a>          
                  </span> 
            }
            </div>
			<div id="loginFormModal" className="modal in"  data-keyboard="false" >
				<div className="modal-dialog" >                                        
					<div className="modal-content loginModalContent col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 loginBackImageHeight" style={{'background': '#fff'}}>                            
                        <div className="modal-body">  
                        <button type="button" className="close"  data-dismiss="modal" onClick={this.CloseModal.bind(this)}>&times;</button>                                                           
                                {this.props.formToShow === "login" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 loginForm mobileViewNoPadding">
                                        <Login />
                                    </div>  
                                : null
                                }  
                                {this.props.formToShow === "signUp" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signupForm mobileViewNoPadding">
                                        <SignUp />
                                    </div>  
                                : null
                                } 
                                {this.props.formToShow === "forgotPassword" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 loginForm mobileViewNoPadding">
                                        <ForgotPassword />
                                    </div>  
                                : null
                                }  
                                {this.props.formToShow === "confirmOtp" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 loginForm mobileViewNoPadding">
                                        <ConfirmOtp />
                                    </div>  
                                : null
                                } 
                                {this.props.formToShow === "resetPassword" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 loginForm mobileViewNoPadding">
                                        <ResetPassword />
                                    </div>  
                                : null
                                }                                                                
                        </div>
					</div>
                </div>
            </div>            
        </div>
    );
  }
}
  
const mapStateToProps = state => (
    //console.log("mapStateToProps master page",state),
    {formToShow: state.data.formToShow}
);

const mapDispatchToProps = {
    getBlockData: getBlockData,
    updateFormValue: updateForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(header);
