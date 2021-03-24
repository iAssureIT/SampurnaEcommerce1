import React 		from 'react';
import axios 		from 'axios';
import $ 			from 'jquery';
import swal 		from 'sweetalert';
import './MenuForm.css';

import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

class MenuForm extends React.Component {
	constructor(props) {
		super(props);
		 this.state = {
                 formTitle 	 : "",
                 users       : [
                     { "firstName":"Priya", "lastName":"Toke"},
                     { "firstName":"Yogesh", "lastName":"Toke"},
                     { "firstName":"Shivansh", "lastName":"Toke"},
                     { "firstName":"Nilesh", "lastName":"Toke"}
                 ],
				
         }
    }
    
	componentDidMount(){


    }
    // getItemStyle = (isDragging, draggableStyle) => ({
    //     // some basic styles to make the items look a bit nicer
    //     userSelect: 'none',
    //     padding: grid * 2,
    //     margin: `0 0 ${grid}px 0`,
    
    //     // change background colour if dragging
    //     background: isDragging ? 'lightgreen' : 'grey',
    
    //     // styles we need to apply on draggables
    //     ...draggableStyle
    // });

    onDragEnd=(result)=>{
        const{destination, source, reason}=result;

        if(!destination || reason === 'CANCEL'){
            return;
        }
        if(destination.droppableId===source.droppableId && destination.index===source.index){
            return;
        }
        const users = Object.assign([],this.state.users);
        const droppedUser = this.state.users[source.index];

        users.splice(source.index,1);
        users.splice(destination.index,0,droppedUser);

        this.setState({
            users
        })
    }
    render(){
        return(
            <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="container wrapper">                
            <Droppable droppableId="dp1">
                    {(provided) => (
                        <div ref={provided.innerRef}>
                            
                            { Array.isArray(this.state.users) && this.state.users.map((data, index)=>{                                                
                                return(
                                    <Draggable key={index} draggableId={index+''} index={index}>
                                        {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        // style={getItemStyle(                                                            
                                                        //     provided.draggableProps.style
                                                        // )}
                                                        >
                                                        {data.firstName} {data.lastName}
                                                        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 user">{data.firstName} {data.lastName}</div> */}
                                                    </div>
                                        )}
                                    
                                    </Draggable>
                                )                
                                })
                            }
                
                </div>
                )}
                {/* {provided.placeholder} */}
                </Droppable>
            </div>
            </DragDropContext>
        );
    }
}
export default MenuForm;