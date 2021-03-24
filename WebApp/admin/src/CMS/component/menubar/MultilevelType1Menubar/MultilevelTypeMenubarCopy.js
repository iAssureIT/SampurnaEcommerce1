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
            multilevelMenuData : {},		
         }
    }
    
	componentDidMount(){
        this.getMenuDetails();
    }

    getMenuDetails(){
        var menubarName = "Multilevel Menu";
        var formValues = {
            menubarName : "Multilevel Menu",
        }
        axios.post("/api/menubar/getsingle",formValues)
        // axios.get("/api/menubar/getallfiltermenu")   
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
                <nav class="navbar navbar-inverse navbar-static-top">
                    <div class="container-fluid ">
                        <div className="col-lg-3 col-md-2 col-sm-2 col-xs-12">
                        <div class="navbar-header">                                
                            <a class="navbar-brand" href="/">
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
                            <ul class="nav navbar-nav navbar-center">  
                            {parse(getMenu(this.state.multilevelMenuData))}                              
                                {/* {
                                    Array.isArray(this.state.multilevelMenuData) && this.state.multilevelMenuData.map((menudata,index)=>{
                                        console.log("menudata===",menudata);
                                        return(    
                                                //level 1                                            
                                                menudata.childItems.length>0?
                                                    <li className="dropdown">
                                                        <a class="dropdown-toggle DropdownMenu parentMenu" data-toggle="dropdown" data-hover="dropdown" area-expanded="false" href={menudata.menuLink}>{menudata.menuLevel===1? menudata.menuItemName:null} <span class="caret"></span></a>
                                                        <ul class="dropdown-menu multiLevel1-DropdownMenu">
                                                            { menudata.childItems.map((subMenudata,index)=>{
                                                                console.log("submenudata===",subMenudata);
                                                                var colWidth = 12/subMenudata.childItems.length;
                                                                console.log("colWidth===",colWidth);
                                                                return(  
                                                                    //level 2          
                                                                    // <div className="submenuWrapper col-lg-12">                                               
                                                                    subMenudata.childItems.length>0?
                                                                    <li className="nav-link">
                                                                        <a class="dropdown-toggle DropdownMenu submenu level2Subenu" data-toggle="dropdown" data-hover="dropdown" area-expanded="false" href={subMenudata.menuLink}>{subMenudata.menuLevel===2? subMenudata.menuItemName:null} <span class="caret"></span></a>
                                                                        <ul class="dropdown-menu multiLevel3-DropdownMenu">
                                                                            { subMenudata.childItems.map((subMenudataChild,index)=>{
                                                                                console.log("submenudata2===",subMenudataChild);
                                                                                return(
                                                                                    <li className =""><a className="submenu dropdown-item" href={subMenudataChild.menuLink} > <span class="fa-caret-left"></span> {subMenudataChild.menuItemName}</a></li> 
                                                                                )
                                                                                })
                                                                            }                                           
                                                                        </ul>
                                                                    </li>
                                                                    :
                                                                    <li>
                                                                        <a className="submenu" href={subMenudata.menuLink} > <span class="fa-caret-left"></span> {subMenudata.menuItemName}</a>
                                                                    </li> 
                                                                    //}
                                                                    // </div>  
                                                                )
                                                                })
                                                            }                                           
                                                        </ul>
                                                    </li>
                                                :
                                                    <li>
                                                        <a className="parentMenu" href={menudata.menuLink}>{menudata.menuLevel===1? menudata.menuItemName:null}</a>
                                                    </li>

                                        );
                                    })
                                }  */}
                            </ul>
                            <ul class="nav navbar-nav navbar-right">
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
                console.log("menulevel :",menudata.menuLevel);
                htmlToReturn  += 
                     '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                    +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'
                    +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getMenu(menudata.childItems)                    
                    +   '</ul>'
                    +'</li>';
                }else if(menudata.childItems.length > 0 && menudata.menuLevel>1){
                    htmlToReturn  += 
                     '<li class="dropdown dropDownLevel '+ menudata.menuLevel+'' +'">'
                    +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'
                    +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                    +        getMenu(menudata.childItems)                    
                    +   '</ul>'
                    +'</li>';

                }else{
                    htmlToReturn  += 
                     '<li class="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                    +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'                   
                    +'</li>';
                } 
            });
        
            return htmlToReturn;
         
        }
    }
}
export default withRouter(MultilevelTypeMenubar);