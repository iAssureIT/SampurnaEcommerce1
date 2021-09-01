import React, { Component } from 'react';
import  Style from "./Message.module.css";

class Message extends Component{
    constructor(props) {
        super(props);
        this.props.messageData={
            messageData : {},
            alertType   : "outpage",
            class       : "",
            icon        : "",
            message     : "",

        }
    } 
    componentDidMount(){
        
    }

    // static getDerivedStateFromProps(nextProps, state) {
    //     // console.log("messagedata nextProps============",nextProps,state);
    //     if(nextProps && nextProps.messageData !== undefined){
    //             this.setState({
    //             "alertType"   : nextProps.messageData.type?nextProps.messageData.type:'',
    //             "class"       : nextProps.messageData.class?nextProps.messageData.class:'',
    //             "icon"        : nextProps.messageData.icon?nextProps.messageData.icon:'',
    //             "message"     : nextProps.messageData.message?nextProps.messageData.message:'',
    //             "autoDismiss" : nextProps.messageData.autoDismiss?nextProps.messageData.autoDismiss:'',
                
    //             })
            
    //         if(nextProps.messageData.autoDismiss && nextProps.messageData.autoDismiss === true){
    //             setTimeout(() => {
    //                 this.setState({
    //                     alertType   : "",
    //                     class       : "",
    //                     icon        : "",
    //                     message     : ""
    //                 })
    //             }, 36000);
    //         }
    //     }
    //     return null;
    // }
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
        console.log("messageData--",this.props.messageData);
        return(
            <div className={Style.alertBox}>
            
            {/*
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
            */}
            </div>
        )
    }
}

export default Message;