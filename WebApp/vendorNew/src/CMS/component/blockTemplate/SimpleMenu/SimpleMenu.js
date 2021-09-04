import React 		from 'react';
import axios 		from 'axios';
import $, { event } from 'jquery';
import swal 		from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import './SimpleMenubar.css';

class SimpleMenubar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
                menubarData   : {},
                simpleMenuData:[ 
                {
                    childItems: [],
                    menuItemName: "Home",
                    menuLevel: 1,
                    menuRank: 1,
                    menulink: "/",
                    parentMenuItem: "-"
                },
                {
                    childItems: [],
                    menuItemName: "About Us",
                    menuLevel: 1,
                    menuRank: 2,
                    menulink: "/aboutus",
                    parentMenuItem: "-"
                },
                {
                    childItems: [],
                    menuItemName: "Contact Us",
                    menuLevel: 1,
                    menuRank: 3,
                    menulink: "/contactus",
                    parentMenuItem: "-"
                },
                {
                    childItems: [],
                    menuItemName: "Blogs",
                    menuLevel: 1,
                    menuRank: 4,
                    menulink: "/blogs",
                    parentMenuItem: "-"
                },
            ]
                 		
         }
    }
    
	componentDidMount(){
        this.getMenuDetails();
    }
    getMenuDetails(){
        var formValues ={
            menubarName : "Simple Menu",
        }
        // console.log("formValues===",formValues);
        axios.post("/api/menubar/getsingle",formValues)
        // axios.get("/api/menubar/getall")
        .then( (response) => {    
            if(response){ 
                // console.log("response data===",response.data);
                this.setState({
                    simpleMenuData   : response.data,                                       
                },()=>{
                    console.log("menubar data====",this.state.simpleMenuData);
                })     	
            }
            
        })
        .catch( function(error){
            console.log("error while getting menubar details ===",error);
        })  
    }

   render(){
        return(                           
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">              
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding simpleNavbarWrapper">
                    <nav class="navbar navbar-inverse">
                        <div class="container">
                            <div className="col-lg-3 col-md-2 col-sm-2 col-xs-12">
                            <div class="navbar-header">                                
                                <a class="navbar-brand" href="/">
                                    <img src="/images/simpleMenu.png"></img>
                                </a>
                                <button className="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>                                
                            </div>
                            </div>
                            <div className="col-lg-9 col-md-10 col-sm-10 col-xs-12 NoPadding" style={{backgroundColor:"#fff"}}>
                            <div className="collapse navbar-collapse navHeaderCollapse">
                                <ul class="nav navbar-nav navbar-center">                                
                                    {
                                        Array.isArray(this.state.simpleMenuData) && this.state.simpleMenuData.map((data,index)=>{
                                            return(   
                                                <li><a href={data.menuLink}>{data.menuItemName}</a></li>
                                            )
                                        })
                                    }                                                                   
                                </ul>
                                <ul class="nav navbar-nav navbar-right">
                                    <li><a href="/"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
                                    <li><a href="/"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>                     
        );
    }
}
export default withRouter(SimpleMenubar);