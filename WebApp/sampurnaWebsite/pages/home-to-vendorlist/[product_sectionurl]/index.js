import Head             from 'next/head';
import axios            from 'axios';
import getConfig        from 'next/config';
import HomeToVendorList from './[productId].js';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function HomeVendorList({pageData}) {
  return (
      <div className="col-12">
          This is Home to vendor list page
            {/* <HomeToVendorList /> */}
      </div>
  )
}

// export async function getServerSideProps({query}){
//   console.log("product_SectionUrl query",query);
//   const urlParam = query.product_sectionurl ? query.product_sectionurl : 'home-to-vendorlist'
//   const res = await axios.get("api/vendorlist/post/productwise/vendor/list")
//   const pageData = await res.data;
//   return {
//     props:{
//       pageData,
//     }
//   }
// }
export default HomeVendorList;

