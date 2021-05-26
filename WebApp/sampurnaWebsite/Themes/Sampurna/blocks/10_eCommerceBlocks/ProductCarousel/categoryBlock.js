import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import Image                  from 'next/image';
import Link                   from 'next/link';
import Message                from '../../StaticBlocks/Message/Message.js';
import Style                  from './ProductCarousel.module.css';
import { connect }            from 'react-redux';
import store                  from '../../../../../redux/store.js'; 
import {getCartData,getWishlistData}  from '../../../../../redux/actions/index.js'; 

class categoryBlock extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            categoryData : [],
            
        }
        // console.log("1. Inside constructor");
    }

    componentDidMount(){
        

    }

    static getDerivedStateFromProps(nextProps, prevState) {
      // console.log("1.Inside product getDerivedStateFromProps nextProps",nextProps);
      // console.log("2.Inside product getDerivedStateFromProps prevState",prevState);
      if (nextProps.newProducts) {
        return ({ 
          newProducts: nextProps.newProducts,
          blockSettings   : nextProps.blockSettings,
          productSettings : nextProps.productSettings
        }) // <- this is setState equivalent
      }
      return null
    }

    render(){
      return (
        <div>Category Block</div>
     ) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
