import React 		from 'react';
import axios 		from 'axios';
import $, { event } 			from 'jquery';
import swal 		from 'sweetalert';
import {withRouter} from 'react-router-dom'; 
import './Menubar.css';

class Menubar extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
                menubarData     : {},  
                menubarListData : [],              
                 		
         }
    }
    
	componentDidMount(){
        this.getMenuDetails();
    }
    getMenuDetails(){
        var menubarName = "Simple Menu";
        var formValues ={
            menubarName : "Simple Menu",
        }
        console.log("formValues===",formValues);
        // axios.get("/api/menubar/getsingle",formValues)
        axios.get("/api/menubar/getall")
        .then( (response) => {    
            if(response){                 
                this.setState({
                    menubarListData   : response.data,                                       
                },()=>{
                    console.log("menubar data====",this.state.menubarListData);
                })
                       	
            }
            
        })
        .catch( function(error){
            console.log("error while getting menubar details ===",error);
        })  
    }
    createNewMenu(event){
        event.preventDefault();
        this.props.history.push('/cms/build-your-menubar');
    }

   render(){
        return(                           
            <div className="container"> 
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 eCommWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding titleWrapper">               
                    <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 eCommTitle">List of Menu Designs</div>
                    <div className="col-lg-3 col-md-3 col-sm-2 col-xs-2">
                    <button className="col-lg-9 col-md-10 col-sm-12 col-xs-12 btn btn-primary pull-right eCommBtn"
                    onClick = {this.createNewMenu.bind(this)}>
                        <i class="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;
                        Create New Menu                                
                    </button>
                    </div>                    
                </div>
                <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-2 col-sm-12 col-xs-12 listOfMenuDesigns">
                    {/* {
                        Array.isArray(this.state.menubarListData) && this.state.menubarListData.map((data, index)=>{                                                
                            return(                            
                                <div key={index} className="col-lg-10 col-lg-offset-1 menulist"><a href="/cms/multilevel-typeof-menubar-designs">{data.menubarName}</a></div>                                
                            )
                        })
                    } */}
                    <div  className="col-lg-10 col-lg-offset-1 menulist"><a href="/cms/simple-typeof-menubar-designs">Simple Menubar</a></div>
                    <div  className="col-lg-10 col-lg-offset-1 menulist"><a href="/cms/multilevel-typeof-menubar-designs">Multilevel Type1 Menubar</a></div>
                    <div  className="col-lg-10 col-lg-offset-1 menulist"><a href="/cms/multilevel-typeof2-menubar-designs">Multilevel Type2 Menubar</a></div>
                    <div  className="col-lg-10 col-lg-offset-1 menulist"><a href="/cms/multilevel-advance-menubar-designs">Advance Menubar</a></div>
                </div>
            </div>
        </div>         
        );
    }
}
export default withRouter(Menubar);