import React, { Component } from 'react';
import  Style from "./Message.module.css";

const Message = (props)=> {
  
    // close(event){
    //     event.preventDefault();
    //     setState({
    //         alertType   : "",
    //         class       : "",
    //         icon        : "",
    //         message     : ""
    //     })
    // }
        // console.log("message props==",props)
        return(
            <div className={Style.alertBox}>
            {
                props && props.messageData && props.messageData.alertType && props.messageData.alertType === 'inpage' ?
                <div className={"alert alert-"+props.messageData.class} role="alert">
                    <div className={props.messageData.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+props.messageData.message)}}></div>
                </div>
                :
                props && props.messageData && props.messageData.alertType && props.messageData.alertType === 'outpage' ?
                    <div className="row ml-auto pull-right outpageMessage">
                        <div className="alert-group">
                            <div className={"alert alert-"+props.messageData.class+" alert-dismissable " +Style.alertMessage}>
                                <button type="button" className="close" onClick={close.bind(this)}>×</button>
                                <div className={props.messageData.icon+" inpagemessage"} dangerouslySetInnerHTML={{__html : ("&nbsp;"+props.messageData.message)}} ></div>
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
{/* <div className="row ml-auto pull-right outpageMessage">
                        <div className="alert-group">
                            <div className={"alert alert-success alert-dismissable " +Style.alertMessage}>
                                <button type="button" className="close" onClick={close.bind(this)}>×</button>
                                <div className="fa fa-check-circle inpagemessage" dangerouslySetInnerHTML={{__html : ("&nbsp;"+"gdc bhdgjycdg  ")}} ></div>
                            </div>
                        </div>
                    </div>
            </div> */}

