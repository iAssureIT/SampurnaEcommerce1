import React, { Component } from 'react';
import axios                from 'axios';
import $                    from 'jquery';
import dynamic              from 'next/dynamic';
import getConfig            from 'next/config';
import {connect}            from 'react-redux';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/Header/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import SmallBanner          from '../../Themes/Sampurna/blocks/StaticBlocks/SmallBanner/SmallBanner.js';
import CartProducts         from './CartProducts.js';
import {setBlockData ,setProductApiUrl,getCartData} from '../../redux/actions/index.js';
import store                from '../../redux/store.js';

const { publicRuntimeConfig } = getConfig();
//get site name from next.config.js
const SITE_NAME =  publicRuntimeConfig.SITE_NAME; 

// import GiftOption           from '../../blocks/GiftOption/GiftOption.js';
// import Discount             from '../../blocks/Discount/Discount.js';
// import EstimateShipping     from '../../blocks/EstimateShipping/EstimateShipping.js';

class Cart extends Component{
    constructor(props) {
        super(props);
        this.state={
            bannerData : {
                title : "MY SHOPPING CART",
                breadcrumb : 'My Shopping Cart',
                backgroungImage : '/images/eCommerce/cartBanner.png',
            },
            wishlistProductsloading: true,
            products : [],
        }
    } 
    componentDidMount(){
        this.getWishlistData();

    }
    getWishlistData() {
        // $('.fullpageloader').show();
        var user_ID = localStorage.getItem('user_ID');  
        var productApi = "/api/wishlist/get/userwishlist/"+user_ID;
        // var productApi = "/api/wishlist/get/wishlistdata/"+user_ID;
        // console.log("productApi on cart page",productApi);
        store.dispatch(setProductApiUrl(productApi));
       }

    render(){
      // console.log("cart pageData",this.props.pageDatapop.pageBlocks.length);
        // console.log("this.state.wishlistedProducts---",this.state.wishlistedProducts);
        return(
          <div>
            <Header/>
            <div className="col-12">
                <div className="row">                    
                    <SmallBanner bannerData={this.state.bannerData}/>
                    <CartProducts />
                    {/* { console.log("this.props.pageData.pageBlocks length===",this.props.pageData)} */}
                    { this.props.pageDatapop.pageBlocks && this.props.pageDatapop.pageBlocks.length > 0 ?
						          this.props.pageDatapop.pageBlocks.map((result, index)=>{                      
						          var component = result._id ? result.blockComponentName : "TitleDesc";
                      var blockFolderName = result._id ? result.blockFolderName : "1_StandardBlocks";
                      var block_id=result.block_id._id; 
                      // const OtherComponent = dynamic(() => import('../../Sampurna/blocks/'+component+'/'+component+'.js'),	
                      const OtherComponent = dynamic(() => import('../../Themes/'+SITE_NAME+'/blocks/'+blockFolderName+'/'+component+'/'+component+'.js'),				
                      {
                        loading: () =>
                          <div className="col-2 offset-5 loading">
                            <img src="/images/eCommerce/loader.gif" className=""></img>
                            {/* loading.... */}
                          </div> 
                      }
                      ); 
                      
                      // console.log("component",component);
						          return(
                        <div className="col-12 NoPadding" key={index}>
                          <OtherComponent block_id={block_id} key={index}/>
                          {/* <h1>Wishlist</h1> */}
                        </div>
						            )
				              })
					          : null
					          }
                    
                    
                </div>
              </div>
            <Footer/>
          </div>
        )
    }
}

export async function getServerSideProps({query}){
  // console.log("query===",query);
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

