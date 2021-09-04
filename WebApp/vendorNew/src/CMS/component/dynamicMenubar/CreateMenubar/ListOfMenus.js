import React 		from 'react';
import axios 		from 'axios';
import $ 			from 'jquery';
import swal 		from 'sweetalert';
import './MenuForm.css';

import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

class ListOfMenus extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
                 formTitle 	 : "",
                 menubarData : {},
                 
				
         }
    }
    
	componentDidMount(){
        this.getListOfMenus();
    }

    createNewMenu(event){
        event.preventDefault();
        this.props.history.push('/cms/build-your-menubar');
    }
    getListOfMenus(){
        axios.get("/api/menubar/getall")
        .then( (response) => {
            // swal("Thank you. Menubar name added successfuly.");	
            if(response){
                this.setState({
                    menubarData   : response.data,
                    menubarName   : response.data.menubarName,                
                },()=>{
                    // console.log("menus===",response.data);
                })
            }
            
        })
        .catch( function(error){
            console.log("error while getting menubar list ===",error);
        })    
    }

    removefromMenuList(event){
        event.preventDefault();
        var ID = event.target.id;
        axios.delete("/api/menubar/deletemenubar/"+ID)
        .then((response) =>{
            swal("Menubar deleted successfuly");
            this.getListOfMenus();
            // window.location.reload();
        })
        .catch( function(error){
            console.log("error while deleting menubar ===",error);
        })
    }

    render(){
        return(           
            <div className="container"> 
                <div className="col-lg-10 col-lg-offset-1 eCommWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding titleWrapper">               
                    <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 eCommTitle">List of Menus</div>
                    <div className="col-lg-3 col-md-3 col-sm-2 col-xs-2">
                    <button className="col-lg-9 col-md-10 col-sm-12 col-xs-12 btn btn-primary pull-right eCommBtn"
                     onClick = {this.createNewMenu.bind(this)}>
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;
                        Create New Menu                                
                    </button>
                    </div>                    
                </div>
                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-12 col-xs-12 listOfMenuTable">                                  
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
                        Array.isArray(this.state.menubarData) && this.state.menubarData.map((data, index)=>{                                                
                            return(                            
                                <tr key={index+1}>
                                    <td>
                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                        {index+1}
                                    </div>
                                    </td>                                                    
                                    <td>
                                        <div>{data.menubarName}</div>
                                    </td>
                                    <td>
                                        <span className="fa fa-trash trashIcon" id={data._id} onClick={this.removefromMenuList.bind(this)}></span>
                                        {/* <span className="fa fa-edit editIcon" id={data._id}><a href={"/cms/build-your-menubar/"+data._id} > </a></span> */}
                                        <a href={"/cms/build-your-menubar/"+data._id} > <i className="fa fa-edit editIcon"></i></a>
                                    </td>
                                </tr>
                                
                            )
                        })
                    }
                    </tbody>
                    </table>
                </div>
                </div>
            </div>           
        );
    }
}
export default ListOfMenus;