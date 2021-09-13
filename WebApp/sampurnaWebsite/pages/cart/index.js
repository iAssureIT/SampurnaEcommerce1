import React, { Component } from 'react';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import CartProducts         from '../../Themes/Sampurna/blocks/StaticBlocks/CartProducts/CartProducts.js';
import Style                from '../../Themes/Sampurna/blocks/StaticBlocks/CartProducts/CartProducts.module.css';

class Cart extends Component{
    constructor(props) {
        super(props);
        this.state={
            products : [],
        }
    } 
    
    render(){
        return(
          <div>
            <Header/>
            <div className={"col-12 "+Style.cartWrapper}>
                <div className="row">                    
                    <div className={"col-12  " +Style.cartTitle}>Shopping Cart</div>
                    <CartProducts />                    
                </div>
              </div>
            <Footer/>
          </div>
        )
    }
}

export default Cart