import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Loader       from "../../component/loader/Loader.js";
import SmallBanner            from '../../component/CustomizeBlocks/SmallBanner/SmallBanner.js';
// import CartProducts           from '../../component/CustomizeBlocks/CartProducts/CartProducts.js';
import CartProducts           from './CartProducts.js';
import dynamic from 'next/dynamic';
// import loadable from '@loadable/component';

import {connect} from 'react-redux';
import {setBlockData ,setProductApiUrl,getCartData} from '../../redux/actions/index.js';
import store from '../../redux/store.js';
import ProductCarousel from '../../component/blockTemplate/ProductCarousel/ProductCarousel.js';

import Header from '../../component/blockTemplate/Header/Header.js';
import Footer from '../../component/blockTemplate/Footer/Footer.js';

// import topBannerImg         from '../../static/bookstore/images/cartBanner.png';

// import Ecommercenewproductcaro from '../../blocks/ProductCarouselEcommerce/Ecommercenewproductcaro.js';
// import "../../../sites/currentSite/pages/Cart.css";


// import $                    from 'jquery'; 
// import axios                from 'axios';
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

        // axios.get('/api/wishlist/get/userwishlist/'+user_ID)
        //   .then((response) => {
        //     // $('.fullpageloader').hide();
        //     console.log("wislist response:---",response.data);           
        //     response.data.map((a, i) => {
        //       axios.get('/api/products/get/one/' + a.product_ID)
        //         .then((res) => {
        //           var products = this.state.products;
        //           products.push({
        //             "_id"              : res.data._id,
        //             "productName"      : res.data.productName,
        //             "productUrl"       : res.data.productUrl,
        //             "originalPrice"    : res.data.originalPrice,
        //             "availableQuantity": res.data.availableQuantity,
        //             "size"             : res.data.size,
        //             "shortDescription" : res.data.shortDescription,
        //             "unit"             : res.data.unit, 
        //             "bestSeller"       : res.data.bestSeller,
        //             "brand"            : res.data.brand,
        //             "category"         : res.data.category,
        //             "currency"         : res.data.currency,
        //             "discountPercent": res.data.discountPercent,
        //             "discountedPrice": res.data.discountedPrice,
        //             "productCode": res.data.productCode,
        //             "productImage": res.data.productImage,
        //             "product_ID": res.data._id,
        //             "wishlist_ID": a._id
        //           });
        //           this.setState({
        //             wishlistProductsloading:false,
        //             wishlistedProducts : products,
        //           })
                  
        //         })
        //         .catch((error) => {
        //           console.log('error', error);
        //         })
        //     })
        //   })
        //   .catch((error) => {
        //     console.log('error', error);
        //   })
    
       }

    render(){
      // console.log("cart pageData",this.props.pageDatapop.pageBlocks.length);
        // console.log("this.state.wishlistedProducts---",this.state.wishlistedProducts);
        return(
          <div>
            <Header/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">                    
                    <SmallBanner bannerData={this.state.bannerData}/>
                    <CartProducts />
                    {/* { console.log("this.props.pageData.pageBlocks length===",this.props.pageData.pageBlocks.length)} */}
                    { this.props.pageDatapop.pageBlocks && this.props.pageDatapop.pageBlocks.length > 0 ?
						          this.props.pageDatapop.pageBlocks.map((result, index)=>{                      
						          var component = result._id ? result.blockComponentName : "TitleDesc";
						          // const OtherComponent = loadable(() => import('../../component/blockTemplate/'+component+'/'+component+'.js'))
                      const OtherComponent = dynamic(() => import('../../component/blockTemplate/'+component+'/'+component+'.js'),					
                      {
                        loading: () =>
                          <div className="col-lg-6 col-lg-offset-3 col-md-4 col-md-offset-4  col-sm-4 col-sm-offset-4 col-xs-12 loading abc">
                            <img src="/images/loader.gif" className=""></img>
                            {/* loading.... */}
                          </div> 
                      }
                      );
                      var block_id=result.block_id._id; 
                      // console.log("component",component);
						          return(
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding" key={index}>
                          <OtherComponent block_id={block_id} key={index}/>
                          {/* <h1>Wishlist</h1> */}
                        </div>
						            )
				              })
					          : null
					          }
                    
                    {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 homeRow">
                        {
                        this.state.wishlistProductsloading ?  
                        
                        <Loader type="carouselloader" productLoaderNo = {4}/>      
                        :
                        Array.isArray(this.state.wishlistedProducts) && this.state.wishlistedProducts.length > 0 ?                        
                            <ProductCarousel  
                                title={'Wishlist'} 
                                newProducts={this.state.wishlistedProducts} 
                                type={'wishlist'} 
                                getWishData={this.getWishlistData.bind(this)}                       
                            />
                            : null
                        
                        }
                    </div> */}



                    {/* <GiftOption /> */}
                    {/* <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                            <Discount />
                            <EstimateShipping />
                        </div>
                    </div> */}
                    
                </div>
            </div>
            <Footer/>
          </div>
        )
    }
}

export async function getServerSideProps({query}){
  // console.log("user_ID",query);
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

