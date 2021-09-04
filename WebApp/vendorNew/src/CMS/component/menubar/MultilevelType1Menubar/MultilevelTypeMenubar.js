import React 		from 'react';
import axios 		from 'axios';
import $, { event } 			from 'jquery';
import swal 		from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import parse, { domToReact } from 'html-react-parser';
import './MultilevelTypeMenubar.css';

class MultilevelTypeMenubar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {            
            multilevelMenuData : [
                {   menuItemName: "Home",
                    menuLevel: 1,
                    menuRank: 1,
                    menulink: "/",
                    parentMenuItem: "-",
                    childItems:[
                        {
                            menuItemName: "Home1", 
                            menulink: "/home1",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Home"

                        },
                        {
                            menuItemName: "Home2", 
                            menulink: "/home2",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Home"
                        },
                        {
                            menuItemName: "Home3", 
                            menulink: "/home3",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Home"
                        },
                    ]
                },
                {   menuItemName: "Menu2",
                    menuLevel: 1,
                    menuRank: 1,
                    menulink: "/",
                    parentMenuItem: "-",
                    childItems:[
                        {
                            menuItemName: "SubMenu1", 
                            menulink: "/home1",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu2",
                            childItems:[
                                {
                                    menuItemName: "Submenu1", 
                                    menulink: "/submenu1",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "Menu2"
                                },
                                {
                                    menuItemName: "Submenu2", 
                                    menulink: "/submenu2",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "Menu2"
                                },
                                {
                                    menuItemName: "Submenu3", 
                                    menulink: "/submenu3",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "Menu2"
                                },
                            ]
                        },
                        {
                            menuItemName: "SubMenu2", 
                            menulink: "/home2",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu2",
                            childItems:[
                                {
                                    menuItemName: "Submenu1", 
                                    menulink: "/submenu1",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                                {
                                    menuItemName: "Submenu2", 
                                    menulink: "/submenu2",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                                {
                                    menuItemName: "Submenu3", 
                                    menulink: "/submenu3",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                            ]
                        },
                        {
                            menuItemName: "Submenu3", 
                            menulink: "/Submenu3",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Home",
                            childItems:[
                                {
                                    menuItemName: "Submenu1", 
                                    menulink: "/submenu1",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                                {
                                    menuItemName: "Submenu2", 
                                    menulink: "/submenu2",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                                {
                                    menuItemName: "Submenu3", 
                                    menulink: "/submenu3",
                                    menuRank: 1, 
                                    menuLevel: 2, 
                                    parentMenuItem: "SubMenu2"
                                },
                            ]
                        },
                    ]
                },
                {   menuItemName: "Menu3",
                    menuLevel: 1,
                    menuRank: 3,
                    menulink: "/",
                    parentMenuItem: "-",
                    childItems:[]
                },
                {   menuItemName: "Menu4",
                    menuLevel: 1,
                    menuRank: 3,
                    menulink: "/",
                    parentMenuItem: "-",
                    childItems:[
                        {
                            menuItemName: "Submenu1", 
                            menulink: "/submenu1",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu4"

                        },
                        {
                            menuItemName: "Submenu2", 
                            menulink: "/submenu2",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu4"
                        },
                        {
                            menuItemName: "Submenu3", 
                            menulink: "submenu3",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu4"
                        },
                        {
                            menuItemName: "Submenu4", 
                            menulink: "submenu4",
                            menuRank: 1, 
                            menuLevel: 2, 
                            parentMenuItem: "Menu4"
                        },
                    ]
                },
            ]	
            	
         }
    }
    
	componentDidMount(){
        this.getMenuDetails();
    }

    getMenuDetails(){
        var formValues = {
            menubarName : "Multilevel Menu",
        }
        console.log("formValues===",formValues);
        axios.post("/api/menubar/getsingle",formValues)
        .then( (response) => {    
            if(response){ 
                console.log("response data===",response.data);
                        this.setState({
                            multilevelMenuData   : response.data,                                       
                        },()=>{
                            console.log("multilevelMenuData data====",this.state.multilevelMenuData);
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding multilevelMenuWrapper">
                <nav className="navbar navbar-inverse navbar-static-top">
                    <div className="container-fluid ">
                        <div className="col-lg-3 col-md-2 col-sm-2 col-xs-12">
                        <div className="navbar-header">                                
                            <a className="navbar-brand" href="/">
                                <img src="/images/multilevelHeaderLogo.png"></img>
                            </a>
                            <button className="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>                                
                        </div>
                        </div>
                        <div className="col-lg-9 col-md-10 col-sm-10 col-xs-12">
                        <div className="collapse navbar-collapse navHeaderCollapse">
                            <ul className="nav navbar-nav navbar-center">  
                            {/* {parse(getMenu(this.state.multilevelMenuData))}                               */}
                                {
                                    Array.isArray(this.state.multilevelMenuData) && this.state.multilevelMenuData.map((menudata,index)=>{
                                        console.log("menudata===",menudata);
                                        return(
                                                //level 1                                            
                                                menudata.childItems?menudata.childItems.length>0?
                                                    <li className={"dropdown dropDownLevel"+menudata.menuLevel}>
                                                        <a className="dropdown-toggle DropdownMenu" data-toggle="dropdown" data-hover="dropdown" area-expanded="false" href={menudata.menuLink}>{menudata.menuLevel===1? menudata.menuItemName:null} <span className="caret"></span></a>
                                                        <ul className={"dropdown-menu mutilevelDropdown"+menudata.menuLevel}>
                                                        {
                                                        menudata.childItems[0].childItems && menudata.childItems[0].childItems.length>0?
                                                        <div className=" megamenu-dropDown">
                                                            { menudata.childItems.map((subMenudata,index)=>{                                                                
                                                                return(  
                                                                    //level 2                                                       
                                                                    subMenudata.childItems?subMenudata.childItems.length>0?                                                                    
                                                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 megamenuColumn">
                                                                    <h4> {subMenudata.menuItemName}</h4>                                                               
                                                                        <ul className={"dropdown-menu mutilevelDropdown"+subMenudata.menuLevel}>
                                                                            { subMenudata.childItems.map((subMenudataChild,index)=>{                                        
                                                                                return(
                                                                                    <li className ={"dropdown dropDownLevel"+subMenudataChild.menuLevel}>
                                                                                        <a className="dropdown-toggle DropdownMenu" href={subMenudataChild.menuLink} > <i className="fa fa-angle-right"></i> {subMenudataChild.menuItemName}</a>
                                                                                    </li> 
                                                                                )
                                                                                })
                                                                            }                                           
                                                                        </ul>
                                                                    </div>
                                                                    :
                                                                     null
                                                                    :null
                                                                )
                                                                
                                                                })
                                                            } 
                                                            </div>  
                                                        :
                                                        menudata.childItems.map((subMenudata,index)=>{                                                                
                                                            return( 
                                                                <li className="levelOneDropdown">
                                                                    <a className="submenu" href={subMenudata.menuLink} ><i className="fa fa-angle-right"></i>{subMenudata.menuItemName}</a>
                                                                </li> 
                                                            )
                                                        })
                                                         
                                                        } 
                                                                              
                                                        </ul>
                                                    </li>
                                                :
                                                    <li className={"dropdown dropDownLevel"+menudata.menuLevel}>
                                                        <a className="parentMenu" href={menudata.menuLink}>{menudata.menuLevel===1? menudata.menuItemName:null}</a>
                                                    </li>
                                                :null  

                                        );
                                    })
                                } 
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#"> LOGIN &nbsp; /</a> </li> 
                                <li><a href="#"> REGISTER</a></li>
                                
                            </ul>
                        </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>         
        );

        function getMenu(multilevelMenuData){
            var htmlToReturn = "";        
            Array.isArray(multilevelMenuData) && multilevelMenuData.map((menudata,index) => {
                if(menudata.childItems.length > 0 && menudata.menuLevel===1){
                console.log("menudata.childItems.length :",menudata.childItems.length);
                htmlToReturn  += 
                     '<li className="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                    +   '<a className="active dropdown-toggle DropdownMenu" data-toggle="dropdown" data-hover="dropdown" href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'&nbsp;'+'<span className="caret"></span></a>'
                    +   '<ul className="dropdown-menu mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getMenu(menudata.childItems)                    
                    +   '</ul>'
                    +'</li>';
                }else if(menudata.childItems.length > 0 && menudata.menuLevel>1){
                    console.log("menudata.childItems.length :",menudata.childItems.length);
                    htmlToReturn  += 
                     '<li className="dropdown dropDownLevel '+ menudata.menuLevel+'' +'">'
                    +   '<a className="dropdown-toggle active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'
                    +   '<div className="dropdown-menu>'
                    +   '<h2>'+ menudata.menuItemName +'</h2>'
                    +   '<div className="">'
                    +   '<ul className="dropdown-menu mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getSubMenu(menudata.childItems)                    
                    +   '</ul>'
                    +   '</div>'
                    +   '</div>'
                    +'</li>';

                }
                else if(menudata.childItems.length > 0 && menudata.menuLevel>1){
                    htmlToReturn  += 
                     '<li className="dropdown dropDownLevel '+ menudata.menuLevel+'' +'">'
                    +   '<a className="dropdown-toggle active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'
                    +   '<ul className="dropdown-menu mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getMenu(menudata.childItems)                    
                    +   '</ul>'
                    +'</li>';

                }else{
                    htmlToReturn  += 
                     '<li className="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                    +   '<a className="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'                   
                    +'</li>';
                } 
            });
        
            return htmlToReturn;
         
        }
        function getSubMenu(multilevelMenuData){
            var htmlToReturn = "";    
            Array.isArray(multilevelMenuData) && multilevelMenuData.map((menudata,index) => {
            htmlToReturn  += 
                     '<li className="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                    +   '<a className="active DropdownMenu" href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'&nbsp;'+'<span className="caret"></span></a>'
                    +   '<ul className="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getSubMenu(menudata.childItems)                    
                    +   '</ul>'
                    +'</li>';
            });
        }
    }
}
export default withRouter(MultilevelTypeMenubar);