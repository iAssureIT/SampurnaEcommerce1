import React, { Component } from 'react';
// import $                    from 'jquery';
// import axios                from 'axios';
import  Style from "./Message.module.css";

class Message extends Component{
    constructor(props) {
        super(props);
        this.state={
            messageData : {},
            alertType   : "",
            class       : "",
            icon        : "",
            message     : "",

        }
    } 
    componentDidMount(){
    }
    static getDerivedStateFromProps(nextProps, state) {
        // console.log("messagedata nextProps============",nextProps,state);
        if(nextProps && nextProps.messageData !== undefined){
            
                return{
                "alertType"   : nextProps.messageData.type?nextProps.messageData.type:'',
                "class"       : nextProps.messageData.class?nextProps.messageData.class:'',
                "icon"        : nextProps.messageData.icon?nextProps.messageData.icon:'',
                "message"     : nextProps.messageData.message?nextProps.messageData.message:'',
                "autoDismiss" : nextProps.messageData.autoDismiss?nextProps.messageData.autoDismiss:'',
                
                }
            
            if(nextProps.messageData.autoDismiss && nextProps.messageData.autoDismiss === true){
                setTimeout(() => {
                    this.setState({
                        alertType   : "",
                        class       : "",
                        icon        : "",
                        message     : ""
                    })
                }, 36000);
            }
        }
        return null;
    }
    close(event){
        event.preventDefault();
        this.setState({
            alertType   : "",
            class       : "",
            icon        : "",
            message     : ""
        })
    }
    render(){
        return(
            <div className={Style.alertBox}>
            {
                this.state.alertType && this.state.alertType === 'inpage' ?
                <div className={"alert alert-"+this.state.class} role="alert">
                    <div className={this.state.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+this.state.message)}}></div>
                </div>
                :
                this.state.alertType && this.state.alertType === 'outpage' ?
                    <div className="row ml-auto pull-right outpageMessage">
                        <div className="alert-group">
                            <div className={"alert alert-"+this.state.class+" alert-dismissable " +Style.alertMessage}>
                                <button type="button" className="close" onClick={this.close.bind(this)}>×</button>
                                <div className={this.state.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+this.state.message)}} ></div>
                            </div>
                        </div>
                    </div>
                :
                null
            }
            </div>
        )
    }
}

export default Message;