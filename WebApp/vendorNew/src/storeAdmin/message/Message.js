import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import "./Message.css";

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
        // window.scrollTo(0, 0);
    } 
      
    componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.messageData){
            this.setState({
                "alertType"   : nextProps.messageData.type,
                "class"       : nextProps.messageData.class,
                "icon"        : nextProps.messageData.icon,
                "message"     : nextProps.messageData.message,
                "autoDismiss" : nextProps.messageData.autoDismiss
            })
            if(nextProps.messageData.autoDismiss && nextProps.messageData.autoDismiss === true){
                setTimeout(() => {
                    this.setState({
                        alertType   : "",
                        class       : "",
                        icon        : "",
                        message     : ""
                    })
                }, 3000);
            }
        }
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
            <div className="">
            {
                this.state.alertType && this.state.alertType === 'inpage' ?
                <div className={"alert alert-"+this.state.class} role="alert">
                    <div className={this.state.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+this.state.message)}}></div>
                </div>
                :
                this.state.alertType && this.state.alertType === 'outpage' ?
                    <div className="row ml-auto pull-right outpageMessage">
                        <div className="alert-group">
                            <div className={"alert alert-"+this.state.class+" alert-dismissable alertMessage"}>
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