import React, { Component } from 'react';
import  Style from "./Message.module.css";

const Message = ()=> {
  
    // close(event){
    //     event.preventDefault();
    //     this.setState({
    //         alertType   : "",
    //         class       : "",
    //         icon        : "",
    //         message     : ""
    //     })
    // }
        return(
            <div className={Style.alertBox}>
            {
                this.props.messageData.alertType && this.props.messageData.alertType === 'inpage' ?
                <div className={"alert alert-"+this.props.messageData.class} role="alert">
                    <div className={this.props.messageData.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+this.props.messageData.message)}}></div>
                </div>
                :
                this.props.messageData.alertType && this.props.messageData.alertType === 'outpage' ?
                    <div className="row ml-auto pull-right outpageMessage">
                        <div className="alert-group">
                            <div className={"alert alert-"+this.props.messageData.class+" alert-dismissable " +Style.alertMessage}>
                                <button type="button" className="close" onClick={this.close.bind(this)}>×</button>
                                <div className={this.props.messageData.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+this.props.messageData.message)}} ></div>
                            </div>
                        </div>
                    </div>
                :
                null
            }
            </div>
        )
    
}

export default Message
