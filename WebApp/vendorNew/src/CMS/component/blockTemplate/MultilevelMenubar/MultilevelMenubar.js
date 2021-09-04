import React        from 'react';
import axios        from 'axios';
import $, { event }             from 'jquery';
import swal         from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import parse, { domToReact } from 'html-react-parser';
import './MultilevelMenubar.css';

class MultilevelMenubar extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
            multilevelMenuData : {},    
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
                        parentMenuItem: "Home",
                        childItems: []

                    },
                    {
                        menuItemName: "Home2", 
                        menulink: "/home2",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Home",
                        childItems: []
                    },
                    {
                        menuItemName: "Home3", 
                        menulink: "/home3",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Home",
                        childItems: []
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
                                menuLevel: 3, 
                                parentMenuItem: "Menu2",
                                childItems: []
                            },
                            {
                                menuItemName: "Submenu2", 
                                menulink: "/submenu2",
                                menuRank: 1, 
                                menuLevel: 3, 
                                parentMenuItem: "Menu2",
                                childItems:[
                                    {
                                        menuItemName: "a-Submenu1", 
                                        menulink: "/submenu1",
                                        menuRank: 1, 
                                        menuLevel: 4, 
                                        parentMenuItem: "a-Submenu1",
                                        childItems: []
                                    },
                                    {
                                        menuItemName: "a-Submenu2", 
                                        menulink: "/submenu2",
                                        menuRank: 1, 
                                        menuLevel: 4, 
                                        parentMenuItem: "Submenu1",
                                        childItems: []
                                    },
                                    {
                                        menuItemName: "a-Submenu3", 
                                        menulink: "/submenu3",
                                        menuRank: 1, 
                                        menuLevel: 4, 
                                        parentMenuItem: "Submenu1",
                                        childItems: []
                                    },
                                ]
                            },
                            {
                                menuItemName: "Submenu3", 
                                menulink: "/submenu3",
                                menuRank: 1, 
                                menuLevel: 2, 
                                parentMenuItem: "Menu2",
                                childItems: []
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
                                parentMenuItem: "SubMenu2",
                                childItems: []
                            },
                            {
                                menuItemName: "Submenu2", 
                                menulink: "/submenu2",
                                menuRank: 1, 
                                menuLevel: 2, 
                                parentMenuItem: "SubMenu2",
                                childItems: []
                            },
                            {
                                menuItemName: "Submenu3", 
                                menulink: "/submenu3",
                                menuRank: 1, 
                                menuLevel: 2, 
                                parentMenuItem: "SubMenu2",
                                childItems: []
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
                                parentMenuItem: "SubMenu2",
                                childItems: []
                            },
                            {
                                menuItemName: "Submenu2", 
                                menulink: "/submenu2",
                                menuRank: 1, 
                                menuLevel: 2, 
                                parentMenuItem: "SubMenu2",
                                childItems: []
                            },
                            {
                                menuItemName: "Submenu3", 
                                menulink: "/submenu3",
                                menuRank: 1, 
                                menuLevel: 2, 
                                parentMenuItem: "SubMenu2",
                                childItems: []
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
                        parentMenuItem: "Menu4",
                        childItems: []

                    },
                    {
                        menuItemName: "Submenu2", 
                        menulink: "/submenu2",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu3", 
                        menulink: "submenu3",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu4", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu5", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu6", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
                    },
                    {
                        menuItemName: "Submenu7", 
                        menulink: "submenu4",
                        menuRank: 1, 
                        menuLevel: 2, 
                        parentMenuItem: "Menu4",
                        childItems: []
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
            menubarName : "Multilevel2 Menu",
        }
        axios.post("/api/menubar/getsingle",formValues)
        .then( (response) => {    
            if(response){ 
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding MultilevelMenubarWrapper">
                <nav className="navbar navbar-inverse navbar">
                    <div className="container ">
                        <div className="col-lg-3 col-md-2 col-sm-2 col-xs-12">
                        <div className="navbar-header">                                
                            <a className="navbar-brand" href="/">
                                <img src="https://themes.webinane.com/wp/unload/wp-content/uploads/2017/08/wsi-imageoptim-wp-logo.png"></img>
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
                               {parse(getMenu(this.state.multilevelMenuData))}

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
                if(menudata.childItems){
                    if(menudata.childItems.length > 0 && menudata.childItems.length <10 && menudata.menuLevel===1){
                    console.log("menudata.childItems.length :",menudata.childItems.length);
                    htmlToReturn  += 
                        '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'&nbsp;'+'</a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +   '</ul>'
                        +'</li>';
                    }else if(menudata.childItems.length > 10 && menudata.menuLevel===1){
                        // console.log("menudata.childItems.length :",menudata.childItems.length);
                        htmlToReturn  += 
                        '<li class="dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'&nbsp;'+'<span class="caret"></span></a>'
                        +   '<div class=" mega-menu-warpper ">'
                        +     '<ul class="ulDropdown mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +     '</ul>'
                        +   '</div'
                        +'</li>';
                    }else if(menudata.childItems.length > 0 && menudata.menuLevel>1){
                        // console.log("menudata.childItems.length :",menudata.childItems.length);
                        htmlToReturn  += 
                        '<li class=" dropdown dropDownLevel'+ menudata.menuLevel+'' +'">'
                        +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"><i class="fa fa-bars faicon"></i> '+ menudata.menuItemName +'<i class="fa fa-angle-right pull-right"></i></a>'
                        +   '<ul class="mutilevelDropdown'+ menudata.menuLevel+'' +'">'
                        +        getMenu(menudata.childItems)                    
                        +   '</ul>'
                        +'</li>';

                    }else{
                        if(menudata.menuLevel>1){
                            htmlToReturn  += 
                            '<li class=" liDropdown dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                            +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"><i class="fa fa-bell faicon"></i> '+ menudata.menuItemName +'</a>'                   
                            +'</li>';
                        }else{
                            htmlToReturn  += 
                            '<li class=" liDropdown dropdown parentMenu dropDownLevel'+ menudata.menuLevel+'' +'">'
                            +   '<a class="active DropdownMenu"  href="'+ menudata.menulink +'"> '+ menudata.menuItemName +'</a>'                   
                            +'</li>';
                        }
                        
                    } 
                }  
            }
            
            );
        
            return htmlToReturn;
         
        }
    }
}
export default withRouter(MultilevelMenubar);