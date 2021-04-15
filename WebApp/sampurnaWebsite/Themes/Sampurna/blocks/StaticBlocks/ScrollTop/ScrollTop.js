import React, { Component } from 'react';
import Style from './ScrollTop.module.css';
import $ from 'jquery';

class ScrollTop extends Component{
    constructor(props){
        super(props);
        this.state={}
    }

    componentDidMount(){
        var windowHeight  = window.pageYOffset
        // console.log("body===",window.pageYOffset);
        if(windowHeight > 1100){
            // console.log("windowHeight> 1100",windowHeight);
            $('.scrollTopWrapper').show(500);
        }else{
            // console.log("windowHeight< 1100",windowHeight);
            $('.scrollTopWrapper').hide(500);
        }
    }
    // onScroll = () => {
    //     event.preventDefault();
    //     var windowHeight  = window.pageYOffset
    //     // console.log("inside scroll body===",window.pageYOffset);
    //     if(windowHeight > 1100){
    //         console.log(" on windowHeight> 1100",windowHeight);
    //         $('.scrollTopWrapper').show(500);
    //     }else{
    //         console.log(" on windowHeight< 1100",windowHeight);
    //         $('.scrollTopWrapper').hide(500);
    //     }
    // }
    goToTop(event){
        event.preventDefault();
        // $(window).scrollTop(0);      
        $("html, body").animate({ scrollTop: 0 }, 800);
    }
    render(){
        return(
            // <div onScroll={this.onScroll}>
                <div className={Style.scrollTopWrapper} onClick={this.goToTop.bind(this)}>
                    
                    <i className="fa fa-angle-up" aria-hidden="true"></i>
                        
                </div>
            // </div>
        )
    }

}

export default ScrollTop;