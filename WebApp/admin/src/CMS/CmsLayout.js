import React from 'react';
import { BrowserRouter as Router, Route, Switch, History } from 'react-router-dom';
import { createBrowserHistory } from "history";


import CircleMenuBars           from './component/circlemenubars.js';
import Cmspage                  from './component/cmspage.js';
import Createnewpage            from './component/createnewpage/Createnewpage.js';
import ListOfPages            from './component/createnewpage/ListOfPages.js';

import Addnewblockonpage        from './component/createnewpage/Addnewblockonpage.js';
import ViewPage_1               from './component/createnewpage/ViewPage1.js';
import ViewPage_2               from './component/createnewpage/Viewpage.js';
import ViewBlock_1              from './component/createnewblock/viewblock1.js';
import ViewBlock_2              from './component/createnewblock/ViewBlock_2.js';
import ViewBlock_3              from './component/createnewblock/ViewBlock_3.js';
import MasterPage               from './component/MasterPage/MasterPage.js';
import Header                   from './component/coreAdminCommon/header/Header.js'; 
import CmsDashBoard             from './CmsDashBoard/CmsDashBoard.js'; 
import Typemaster               from '../CMS/component/Typemaster/Typemaster.js';


/*blogs*/

import SingleBlogPage           from './component/Blogs/SingleBlogPage/SingleBlogPage.js';
// import AllBlog                          from './component/AllBlog/AllBlog.js';
// import Blogcomponents                   from './component/Blogcomponents/Blogcomponents.js';
// import AllBlogsList                     from '../allBlocks/AllBlogsList/AllBlogsList.js';

/*============================ /Blog==============================================*/

/*import Rightsidebar           from '../common/rightSidebar/Rightsidebar.js';*/
import BlogsFormPage            from "./component/Blogs/BlogsForm/BlogsFormPage.js";
import AllBlogs                 from "./component/Blogs/AllBlogs/AllBlogs.js";
import JobForm                  from "./component/JobApplication/JobApplication.js";


import Selectpagedesign              from "./component/selectpagedesign/selectpagedesign.js";
import Homepage              from "./component/Homepage/Homepage.js";
// import Faq                   from "./component/Homepage/Faq.js";
// import Contactus             from "./component/Homepage/Contactus.js";
// import HowItWork             from './component/Homepage/HowItWork.js'; 

/*================ eCommBlocks==================*/
import CreateECommblock from './component/createECommBlock/CreateECommblock.js'
import DynamicHeader    from './component/dynamicMenubar/DynamicMenubar.js';
import DynamicMenubar   from './component/dynamicMenubar/DynamicMenubar.js';
import ListOfMenus      from './component/dynamicMenubar/CreateMenubar/ListOfMenus.js';
import SimpleMenubar    from './component/menubar/SimpleMenu/SimpleMenubar.js';
import Menubar          from './component/menubar/Menubar.js';
import MultilevelType1Menubar from './component/menubar/MultilevelType1Menubar/MultilevelTypeMenubar.js';
import MultilevelType2Menubar from './component/menubar/MultilevelType2Menubar/MultilevelType2Menubar.js';
import AdvanceMenubar         from './component/menubar/AdvanceMenubar/AdvanceMenubar.js';
// import Banner from './component/blockTemplate/BannerView/Banner.js';

import Testing from './component/Testing/Testing.js';
import TestingDiv from './component/TestingDiv/TestingDiv.js';

const history = createBrowserHistory();
export default class CmsLayout extends React.Component {


	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router history={history}>
			<div className="App container-fluid" >
                <div className="row" >
                	<Header />
                	
                	 <Switch >
						<Route path="/cms/list-of-pages"                  exact strict component={ListOfPages}  />
						<Route path="/cms/createnewpage"                  exact strict component={Createnewpage}  />
						<Route path="/cms/createnewpage/:id"              exact strict component={Createnewpage}  />
						<Route path="/cms/addnewblockonpage"              exact strict component={Addnewblockonpage}  />

						<Route path="/cms/addnewblockonpage/:id"          exact strict component={Addnewblockonpage}  />                                                
       
						<Route path="/cms/createnewpage"                  exact strict component={Createnewpage}  />
						<Route path="/cms/addnewblockonpage"              exact strict component={Addnewblockonpage}  />
						<Route path="/cms/addnewblockonpage/:id"          exact strict component={Addnewblockonpage}  />                                                

                        <Route path="/cms/dashboard"                      exact strict component={CmsDashBoard}  />
                        <Route path="/cms/create-new-page"                         exact strict component={ViewPage_1}  />
                        <Route path="/cms/new-page-add-block"                         exact strict component={ViewPage_2}  />
                        <Route path="/cms/new-page-add-block/:id"                     exact strict component={ViewPage_2}  />
                        <Route path="/cms/select-new-block"                        exact strict component={ViewBlock_1}  />
                        <Route path="/cms/create-new-block"                        exact strict component={ViewBlock_2}  />
                        <Route path="/cms/view-blocks"                        exact strict component={ViewBlock_3}  />
                        
    					<Route path="/cms/masterpage/:pageurl"       		component={ MasterPage } /> 
     					
     					<Route path="/cms/singleblog" 					component={ SingleBlogPage }  />   
     					<Route path="/cms/blogs-form" 					component={ BlogsFormPage }  />   
     					<Route path="/cms/blogs-form/:blogURL" 					component={ BlogsFormPage }  />   
     					<Route path="/cms/AllBlogs" 					component={ AllBlogs }  />   
     					<Route path="/cms/singleblog/:selectedUrl" 					component={ SingleBlogPage }  />   
                        <Route path="/cms/typemaster"                 exact strict component={Typemaster}  />
                        <Route path="/cms/typemaster/:editId"                  strict component={Typemaster}  />
    
     					<Route path="/cms/singleblog" 					exact strict component={ SingleBlogPage }  />   
     					<Route path="/cms/blogs-form" 					exact strict component={ BlogsFormPage }  />   
     					<Route path="/cms/blogs-form/:blogURL" 			exact strict component={ BlogsFormPage }  />   
     					<Route path="/cms/AllBlogs" 					exact strict component={ AllBlogs }  />   
     					<Route path="/cms/singleblog/:selectedUrl" 		exact strict component={ SingleBlogPage }  />   
     					{/*<Route path="/cms/contact-us" 					component={ SingleBlogPage }  />   */}
     					{/*<Route path="/cms/job-application" 					component={ JobForm }  /> */}  
     					 <Route path="/cms/homepage" 					exact strict component={ Homepage }  /> 
						  <Route path="/cms/lifeCycletesting/:id"               exact strict component={ Selectpagedesign }  />  
						
						{/* route for eCommCMS */}
						<Route path="/cms/create-new-eCommblock"              exact strict component={ CreateECommblock }  /> 
						<Route path="/cms/build-your-menubar"                 exact strict component={ DynamicMenubar }  /> 
						<Route path="/cms/build-your-menubar/:menuId"         exact strict component={ DynamicMenubar }  />
						<Route path="/cms/list-of-menubar"                    exact strict component={ ListOfMenus }  /> 	

						<Route path="/cms/listof-menu-design"                 exact strict component={ Menubar }  /> 	
						<Route path="/cms/simple-typeof-menubar-designs"      exact strict component={ SimpleMenubar }  /> 	
						<Route path="/cms/multilevel-typeof-menubar-designs"  exact strict component={ MultilevelType1Menubar }  /> 	
						<Route path="/cms/multilevel-typeof2-menubar-designs" exact strict component={ MultilevelType2Menubar }  /> 	
						<Route path="/cms/multilevel-advance-menubar-designs" exact strict component={ AdvanceMenubar }  />

						{/* <Route path="/cms/create-banner"                      exact strict component={ Banner }  /> */}
						<Route path="/cms/testing"							  exact strict component={Testing} />
						<Route path="/cms/TestingDiv"							  exact strict component={TestingDiv} />
                		</Switch>                	
                	</div>	

				</div>
			</Router>
		);
	}
}
