import React, { useState } from 'react';
import ProductViewEcommerce from "./ProductViewEcommerce.js";
import {useRouter}          from 'next/router'
import Header               from '../../../../../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../../../../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style                from './product_detail.module.css';

const ProductDetailsEcommerce = (props)=>{

	const router = useRouter();
  	const [vendor_id, setVendor_id] = useState(router.query.vendor_id);
  	const [vendorlocation_id, setVendorlocation_id] = useState(router.query.vendorlocation_id);
  	const [categoryurl, setCategoryurl] = useState(router.query.categoryurl);
  	const [subCategoryurl, setSubCategoryurl] = useState(router.query.subcategoryurl);
  	const [productId, setProductId] = useState(router.query.productId);
	console.log("vendorlocation_id===",vendorlocation_id);
	return(
         <div className={"col-12 NoPadding "}>
			<Header/>
			<div className="container-flex backColorGray">
				<ProductViewEcommerce 
						vendor_id         ={vendor_id} 
						vendorlocation_id ={vendorlocation_id} 
						categoryurl       ={categoryurl} 
						subCategoryurl    ={subCategoryurl} 
						productID         ={productId} 
				/>
			</div>
			<Footer/>
         </div>
	);

}

export default ProductDetailsEcommerce;