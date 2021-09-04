import React 		from 'react';
import axios 		from 'axios';
import $, { event } 			from 'jquery';
import swal 		from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import './MenuForm.css';

class MenuForm extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
                 formTitle 	 : "",
                 menubarName : "",
                 menubarData : {},
                 menubarId   : "",
                 menuId      : "",
                 EditForm    : false,			
         }
    }
    
	componentDidMount(){
        var menuId = this.props.match.params.menuId;
        if(menuId){
            this.getMenuDetails(menuId);
            $('.menusTable').show(500);
        }
    }
    listOfMenu(event){
        event.preventDefault();
        this.props.history.push('/cms/list-of-menubar');
    }
    submitMenuName(event){
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value	
        });
        
        var formValues = {
            menubarName : event.target.value,
        }        
        if(formValues.menubarName!=""){
        axios.post("/api/menubar/post",formValues)
        .then( (response) => {
            // swal("Thank you. Menubar name added successfuly.+");	
            this.setState({
                menubarId   : response.data.ID,
                // menubarName : "",
            },()=>{                
                this.props.history.push('/cms/build-your-menubar/'+this.state.menubarId);
                this.getMenuDetails(response.data.ID);
                $('.menubarTable').show(500);
            })
        })
        .catch( function(error){
            console.log("error while inserting menubar ===",error);
        })  
        }  
    }
    getMenuDetails(menuId){
        axios.get("/api/menubar/getone/"+menuId)
        .then( (response) => {
            // swal("Thank you. Menubar name added successfuly.");	
            this.setState({
                menubarData   : response.data,
                menubarName   : response.data.menubarName,                
            },()=>{
                $('.menubarWrapper').show(500);
                $('.menubarTable').show(500);
            })
            // console.log("Menubar data===",this.state.menubarData);
        })
        .catch( function(error){
            console.log("error while getting menubar ===",error);
        })  
    }

    RemovefromMenuList(event){
        event.preventDefault();
        var ID = event.target.id;
        axios.delete("/api/menubar/deletemenubar/"+ID)
        .then((response) =>{
            this.getMenuDetails(ID);
            $('.menubarTable').hide(500);
            $('.menusTable').hide(500);
            $('.menubarWrapper').hide(500);
            swal("Menubar deleted successfuly");       
            
            this.setState({
                menubarName    : "",
                menuRank       : "",
                menuLevel      : "",
                parentMenuItem : "",
                menuItemName   : "",
                menuLink       : "",            

            },()=>{
                this.props.history.push('/cms/build-your-menubar');
            })
        })
        .catch( function(error){
            console.log("error while deleting menubar ===",error);
        })
    }
    handleChange(event){
        this.setState({
            [event.target.name]:event.target.value	
        });
    }
    updateFormInfo(event){
        event.preventDefault();
        var menuId = event.target.id;
        console.log("inside update",menuId);
         var formValues = {
            menuId         : menuId,
            menubarName    : this.state.menubarName,
            menuRank       : this.state.menuRank,
            menuLevel      : this.state.menuLevel,
            parentMenuItem : this.state.parentMenuItem,
            menuItemName   : this.state.menuItemName,
            menuLink       : this.state.menuLink,            
        }      
        var menubarId = this.props.match.params.menuId;
        // console.log("formvalues:===",formValues);  
        
        axios.patch("/api/menubar/update/"+menubarId ,formValues)
        .then( (response) => {
            swal("Thank you. Menu updates Successfuly.");
            this.setState({
                menubarName    : "",
                menuRank       : "",
                menuLevel      : "",
                parentMenuItem : "",
                menuItemName   : "",
                menuLink       : "",
                EditForm    : false,


            },()=>{
                this.getMenuDetails(this.props.match.params.menuId);
            })
            
        })
        .catch( function(error){
            console.log("error while updating menubar ===",error);
        })
    }
    submitFormInfo(event){
        event.preventDefault();
        var formValues = {
            menubarName    : this.state.menubarName,
            menuRank       : this.state.menuRank,
            menuLevel      : this.state.menuLevel,
            parentMenuItem : this.state.parentMenuItem,
            menuItemName   : this.state.menuItemName,
            menuLink       : this.state.menuLink,            
        }      
        // console.log("formvalues:===",formValues);  
        
        axios.post("/api/menubar/post",formValues)
        .then( (response) => {
            this.setState({
                menuRank       : "",
                menuLevel      : "",
                parentMenuItem : "",
                menuItemName   : "",
                menuLink       : "",
                EditForm    : false,
                menubarId   : response.data.ID,
            },()=>{
                this.getMenuDetails(this.props.match.params.menuId);
                $('.menusTable').show(500);
            }) 
            swal("Thank you. Menu Added Successfuly.");
        })
        .catch( function(error){
            console.log("error while updating menubar ===",error);
        })
    }
    deleteMenu(event){
        event.preventDefault();
        var menubarId = this.props.match.params.menuId;
        var menuId    = event.target.id;
        menuId = menuId.split("_");
        menuId = menuId[1];
        var formValues ={
            menubarId : menubarId,
            menuId    : menuId,
        }
        axios.patch("/api/menubar/deletemenu", formValues)
        .then((response) =>{
            swal("Menu deleted successfuly");
            this.getMenuDetails(this.props.match.params.menuId);
        })
        .catch( function(error){
            console.log("error while deleting menu ===",error);
        })

    }
    updateMenu(event){
        event.preventDefault();
        // console.log("inside update");

        $("body,html").animate(
        {
            scrollTop : 210                       // Scroll 500px from top of body
        }, 600);

        var menubarId = this.props.match.params.menuId;
        var menuId    = event.target.id;
        menuId        = menuId.split("_");
        menuId        = menuId[1];
        // console.log("inside update menuId==",menuId);
        axios.get("/api/menubar/getone/"+menubarId)
        .then( (response) => {            
            for(let i=0;i<response.data.menu.length;i++){	
                if(response.data.menu[i]._id === menuId){
                    this.setState({                
                        menubarName    : response.data.menubarName,  
                        menuRank       : response.data.menu[i].menuRank,
                        menuLevel      : response.data.menu[i].menuLevel,
                        parentMenuItem : response.data.menu[i].parentMenuItem,
                        menuItemName   : response.data.menu[i].menuItemName,
                        menuLink       : response.data.menu[i].menuLink, 
                        EditForm       : true, 
                        menuId         : menuId,       
                    });
                    break;
                }
            }
        })
        .catch( function(error){
            console.log("error while getting menubar ===",error);
        })
    }
    render(){
        var menuId = this.props.match.params.menuId;
        return(            
            <div className="container">                
                <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 eCommWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding titleWrapper">               
                    <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 eCommTitle">Create New Menu</div>
                    <div className="col-lg-3 col-md-3 col-sm-2 col-xs-2">
                    <button className="col-lg-9 col-md-10 col-sm-12 col-xs-12 btn btn-primary pull-right eCommBtn"
                     onClick = {this.listOfMenu.bind(this)}>
                        <i class="fa fa-list" aria-hidden="true"></i>&nbsp;
                        List Of Menu                                
                    </button>
                    </div>                    
                </div>
                <form className="menubarForm col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="label-category labelform">Menubar Name<span className="astrick"></span></label>
                        <input type="text" ref="menubarName" id="menubarName" defaultValue={this.state.menubarName} name="menubarName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onBlur={this.submitMenuName.bind(this)} />
                    </div>
                </div>

                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 menubarTable">                                  
                    <table className="table galleryTable table-bordered">
                    <thead>
                        <tr>
                            <th className="itemth">Sr. No</th>
                            <th>Menubar Name</th>                                            
                            <th>Action</th>                                            
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.menubarData?
                            <tr key={1}>
                                <td>
                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                    {1}
                                </div>
                                </td>                                                    
                                <td>
                                    <div>{this.state.menubarData.menubarName}</div>
                                </td>
                                <td>
                                    <span className="fa fa-trash trashIcon" id={this.state.menubarData._id} onClick={this.RemovefromMenuList.bind(this)}></span>
                                </td>
                            </tr>
                            :null                            
                    }
                    </tbody>
                    </table>
                </div>
                <div className="col-lg-12 col-md-8 col-sm-12 col-xs-12 NoPadding menubarWrapper">
                    <div className="col-lg-2 col-md-4 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <label className="label-category labelform">Menu Level<span className="astrick"></span></label>
                            <input type="number" ref="menuLevel" id="menuLevel" defaultValue={this.state.menuLevel} 
                             name="menuLevel" onChange={this.handleChange.bind(this)}
                             className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <label className="label-category labelform">Menu Rank<span className="astrick"></span></label>
                            <input type="number" ref="menuRank" id="menuRank" defaultValue={this.state.menuRank} 
                             name="menuRank"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" 
                             onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <label className="label-category labelform">Parent Menu<span className="astrick"></span></label>
                            <input type="text" ref="parentMenuItem" id="parentMenuItem" defaultValue={this.state.parentMenuItem} name="parentMenuItem"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <label className="label-category labelform">Menu Item Name<span className="astrick"></span></label>
                            <input type="text" ref="menuItemName" id="menuItemName" defaultValue={this.state.menuItemName} name="menuItemName"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <label className="label-category labelform">Link<span className="astrick"></span></label>
                            <input type="text" ref="menuLink" id="menuLink" defaultValue={this.state.menuLink} name="menuLink"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid hinput30 form-control" onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <div className ="col-lg-3 col-md-4 col-sm-12 col-xs-12 pull-right">
                        {
                            this.state.EditForm?
                            <button type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-primary pull-right submitBtn" 
                                onClick={this.updateFormInfo.bind(this)} id={this.state.menuId}>
                                Update &nbsp;&nbsp;
                                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                            </button>
                            :
                            <button type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-primary pull-right submitBtn" 
                                onClick={this.submitFormInfo.bind(this)}>
                                Submit &nbsp;&nbsp;
                                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                            </button>
                        }
                    </div>
                </div>
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 menusTable">                
                   <table className="table galleryTable table-bordered">
                    <thead>
                        <tr>
                            <th className="itemth">Menu Level</th>
                            <th>Rank</th>
                            <th>Parent Menu Item</th>
                            <th>Menu Item Name</th>
                            <th>Link</th>                                            
                            <th>Action</th>                                            
                        </tr>
                    </thead>
                    <tbody>
                    {
                        Array.isArray(this.state.menubarData.menu) && this.state.menubarData.menu.map((data, index)=>{                                                
                            return(     

                                <tr key={data._id+"_"+data.index}>
                                    <td>
                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                        {data.menuLevel}
                                    </div>
                                    </td>                                                    
                                    <td>
                                        <div>{data.menuRank}</div>
                                    </td>
                                    <td>
                                        <div>{data.parentMenuItem}</div>
                                    </td>
                                    <td>
                                        <div>{data.menuItemName}</div>
                                    </td>
                                    <td>
                                        <div>{data.menuLink}</div>
                                    </td>
                                    <td>
                                        <span className="fa fa-trash trashIcon" id={"d_"+data._id}
                                         onClick={this.deleteMenu.bind(this)}></span>
                                        <span className="fa fa-edit editIcon" name={data._id} id={"e_"+data._id}
                                         onClick={this.updateMenu.bind(this)}></span>
                                        
                                    </td>
                                </tr>                                
                            )
                        })
                    }
                    </tbody>
                    </table>
                </div>
                </form>
                </div>
            </div>            
        );
    }
}
export default withRouter(MenuForm);