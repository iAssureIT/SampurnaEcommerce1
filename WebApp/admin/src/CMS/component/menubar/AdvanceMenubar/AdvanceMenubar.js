import React 		from 'react';
import axios 		from 'axios';
import $, { event } from 'jquery';
import swal 		from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import parse, { domToReact } from 'html-react-parser';
import './AdvanceMenubar.css';

class AdvanceMenubar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
            multilevelMenuData : {},		
         }
    }
    
	componentDidMount(){
        console.log("Advance menubar");
        this.getMenuDetails();
    }

    getMenuDetails(){
        var menubarName = "Advance Menu";
        var formValues = {
            menubarName : "Advance Menubar",
        }
        axios.post("/api/menubar/getsingle",formValues)
        .then( (response) => {    
            if(response){ 
                // console.log("response data===",response.data);
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding AdvanceMenuWrapper">
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container ">
                        <div className="col-lg-3 col-md-2 col-sm-2 col-xs-12">
                        <div className="navbar-header">                                
                            <a className="navbar-brand" href="/">
                                <img src="/images/advanceMenu.webp"></img>
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
                            <ul className="nav navbar-nav navbar-center advanceNavbar">                                
                               {/* {parse(getMenu(this.state.multilevelMenuData))} */}
                               {
                                    Array.isArray(this.state.multilevelMenuData) && this.state.multilevelMenuData.map((menudata,index)=>{
                                        // console.log("menudata===",menudata);
                                        return(
                                                //level 1                                            
                                                menudata.childItems.length>0?
                                                    <li className={"dropdown a1 dropDownLevel"+menudata.menuLevel}>
                                                        <a class="dropdown-toggle DropdownMenu" data-toggle="dropdown" data-hover="dropdown" area-expanded="false" href={menudata.menuLink}>{menudata.menuLevel===1? menudata.menuItemName:null} <span class="caret"></span></a>
                                                        <ul class={"dropdown-menu mutilevelDropdown"+menudata.menuLevel}>
                                                        {
                                                        menudata.childItems.length>0 && menudata.childItems[0].childItems.length>0?
                                                        <div className=" megamenu-dropDown">
                                                            { menudata.childItems.map((subMenudata,index)=>{     
                                                                console.log("subMenudata.menuItemName====",subMenudata.menuItemName);                                                           
                                                                return(  
                                                                    //level 2                                                       
                                                                    subMenudata.childItems.length>0?    
                                                                    subMenudata.menuItemName === "ImageBlock"?
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 megamenuColumn">
                                                                        <li>
                                                                            <a href="/">
                                                                                <img src="/images/bags.jpg" className="ImgMenu"/>&nbsp;
                                                                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imgText"> Whats New</span>
                                                                            </a>
                                                                        </li>
                                                                    </div>
                                                                    :                                                                
                                                                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 megamenuColumn">
                                                                    <h4> {subMenudata.menuItemName}</h4>                                                               
                                                                        <ul class={"dropdown-menu mutilevelDropdown"+subMenudata.menuLevel}>
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
                                                                    :null                                                              
                                                                )
                                                                
                                                                })
                                                            } 
                                                            </div>  
                                                        :
                                                        menudata.childItems.map((menudata,index)=>{                                                                
                                                            return(
                                                                menudata.parentMenuItem === "Bags And Accessories"?
                                                                    menudata.menuItemName === "Bags"?
                                                                        <li className={"dropdown dropDownLevel"+menudata.menuLevel}>
                                                                            <a className="parentMenu" href={menudata.menuLink}>
                                                                                <img src="/images/bags.jpg" class="menuImg"/>&nbsp;
                                                                                {menudata.menuItemName}
                                                                            </a>
                                                                        </li>
                                                                    :
                                                                    menudata.menuItemName === "Jewelry and Watches"?
                                                                        <li className={"dropdown dropDownLevel"+menudata.menuLevel}>
                                                                            <a className="parentMenu" href={menudata.menuLink}>
                                                                                <img src="/images/jewelryWatches.jpg" class="menuImg"/>&nbsp;
                                                                                {menudata.menuItemName}
                                                                            </a>
                                                                        </li>
                                                                    :menudata.menuItemName === "Sunglasses"?
                                                                        <li className={"dropdown dropDownLevel"+menudata.menuLevel}>
                                                                            <a className="parentMenu" href={menudata.menuLink}>
                                                                                <img src="/images/sunglasses.jpg" class="menuImg"/>&nbsp;
                                                                                {menudata.menuItemName}
                                                                            </a>
                                                                        </li>
                                                                    :null
                                                                :   <li className="levelOneDropdown a2">
                                                                        <a className="submenu" href={menudata.menuLink} ><i className="fa fa-angle-right"></i>{menudata.menuItemName}</a>
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
                                        );
                                    })
                                } 

                            </ul>
                            <ul className="nav navbar-nav navbar-right rightNavbar">
                                <li><a href="#"> LOGIN &nbsp; /</a> </li> 
                                <li><a href="#"> REGISTER</a></li>  
                                <li>
                                    <a href="#"> 
                                        <i className="fa fa-search"></i>
                                    </a>
                                </li>                                
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
                if(menudata.menuItemName === "Clotihing")  {
                    if(menudata.menuLevel === 1){
                        htmlToReturn  +=                        
                        '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'<span class="caret"></span></a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getFullwidthMenu(menudata.childItems)                    
                        +   '</ul>'
                        + '</li>';   
                    
                    }else{
                    htmlToReturn  += 
                        '<div class="mega-menu-wrap">'
                        + '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'<span class="caret"></span></a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getFullwidthMenu(menudata.childItems)                    
                        +   '</ul>'
                        + '</li>'
                        +'</div>';   
                    }
                }else{            
                    htmlToReturn  += 
                        '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'<span class="caret"></span></a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +   '</ul>'
                        +'</li>';                
                    }
                }
                else if(menudata.childItems.length > 0 && menudata.menuLevel>1 && menudata.menuItemName==="Clothing" ){                    
                        htmlToReturn  += 
                        '<li class="dropdown otherMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'<img src="/images/jewelryWatches.jpg" class="menuImg"><img/></a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +   '</ul>'
                        +'</li>';
                    
                }
                else{
                    if(menudata.parentMenuItem === "Bags And Accessories" && menudata.menuLevel===2){
                        if(menudata.menuItemName ==="Bags"){
                            htmlToReturn  += 
                            '<li class="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                            +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+'<img src="/images/bags.jpg" class="menuImg"><img/>'+ menudata.menuItemName +'</a>'                   
                            +'</li>';
                        }else if(menudata.menuItemName ==="Jewelry and Watches"){
                            htmlToReturn  += 
                            '<li class="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                            +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+'<img src="/images/jewelryWatches.jpg" class="menuImg"><img/>'+ menudata.menuItemName +'</a>'                   
                            +'</li>';
                        }else if(menudata.menuItemName ==="Sunglasses"){
                            htmlToReturn  += 
                            '<li class="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                            +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+'<img src="/images/sunglasses.jpg" class="menuImg"><img/>'+ menudata.menuItemName +'</a>'                   
                            +'</li>';
                        }
                        
                    }else{
                        htmlToReturn  += 
                        '<li class="dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'                   
                        +'</li>';
                    }
                } 
            });
        
            return htmlToReturn;
         
        }
        function getFullwidthMenu(multilevelMenuData){
            var htmlToReturn = "";        
            Array.isArray(multilevelMenuData) && multilevelMenuData.map((menudata,index) => {
                 {
                    htmlToReturn  += 
                        '<div class="mega-menu-wrap">'
                        +  '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +    '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'<span class="caret"></span></a>'
                        +    '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +    '</ul>'
                        +  '</li>'
                        + '</div>'; 
                 }  
            
            });
        
            return htmlToReturn;
         
        }
    }
}
export default withRouter(AdvanceMenubar);