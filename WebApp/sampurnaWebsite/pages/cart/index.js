import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import dynamic              from 'next/dynamic';
import getConfig            from 'next/config';
import {connect}            from 'react-redux';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import CartProducts         from './CartProducts.js';
import store                from '../../redux/store.js';
import Style                from'./CartProducts.module.css';

import {setBlockData ,setProductApiUrl,getCartData} from '../../redux/actions/index.js';

const { publicRuntimeConfig } = getConfig();
const SITE_NAME =  publicRuntimeConfig.SITE_NAME; 
class Cart extends Component{
    constructor(props) {
        super(props);
        this.state={
            products : [],
        }
    } 
    componentDidMount(){
        // this.getWishlistData();
    }
    getWishlistData() {
        var user_ID = localStorage.getItem('user_ID');  
        var productApi = "/api/wishlist/get/userwishlist/"+user_ID;
        store.dispatch(setProductApiUrl(productApi));
    }
    render(){
        return(
          <div>
            <Header/>
            <div className="col-12">
                <div className="row">                    
                    {/*<SmallBanner bannerData={this.state.bannerData}/>*/}
                    <div className={"col-lg-10 offset-lg-1 NoPadding " +Style.cartTitle}>Shopping Cart</div>
                    <CartProducts />
                    {/* { this.props.pageDatapop.pageBlocks && this.props.pageDatapop.pageBlocks.length > 0 ?
						          this.props.pageDatapop.pageBlocks.map((result, index)=>{                      
						          var component = result._id ? result.blockComponentName : "TitleDesc";
                      var blockFolderName = result._id ? result.blockFolderName : "1_StandardBlocks";
                      var block_id=result.block_id._id; 
                      const OtherComponent = dynamic(() => import('../../Themes/'+SITE_NAME+'/blocks/'+blockFolderName+'/'+component+'/'+component+'.js'),				
                      {
                        loading: () =>
                          <div className="col-2 offset-5 loading">
                            <img src="/images/eCommerce/loader.gif" className=""></img>
                          </div> 
                      }
                      ); 
                      console.log("component",component);
						          return(
                        <div className="col-12 NoPadding" key={index}>
                          <OtherComponent block_id={block_id} key={index}/>
                        </div>
						            )
				              })
					          : null
					          } */}
                </div>
              </div>
            <Footer/>
          </div>
        )
    }
}

export async function getServerSideProps({query}){
	const urlParam = 'wishlist-carousel'
	const res = await axios.get("api/pages/get/page_block/"+urlParam)
	const pageDatapop = await res.data;
  
	return {
	  props:{
		pageDatapop,
	  }
	}
  }
  
  const mapStateToProps = state => (
	// console.log("mapStateToProps in produt page",state.data),
	{data: state.data}
  );
  
  const mapDispatchToProps = {
    setBlockData: setBlockData,
    setProductApiUrl: setProductApiUrl
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(Cart);

