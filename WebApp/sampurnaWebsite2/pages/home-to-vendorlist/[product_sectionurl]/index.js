import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import {connect} from 'react-redux';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

axios.defaults.baseURL = publicRuntimeConfig.API_BASE_URL;
import { useRouter } from "next/router";

function Home({pageData}) {
  return (
    //   <HomeToVendorList pageData = {pageData} />
      <ul>
      {sectionData.map((sectionData) => {
        return (
          <li key={sectionData.id}>
            <h3>
              <Link href="/home-to-vendorlist/[product_sectionurl]/[productid]" as={"/posts/" + sectionData.sectionUrl+"/"+"id"}>
                <a>{sectionData.section}</a>
              </Link>
            </h3>
          </li>
        );
      })}
    </ul>
  )
}

// export async function getServerSideProps({query}){
//   console.log("product_SectionUrl query",query);
// //   const urlParam = query.productId ? query.categoryUrl : 'product-list'
//   const res = await axios.get("api/pages/get/page_block/product-list")
//   const pageData = await res.data;
//   return {
//     props:{
//       pageData,
//     }
//   }
// }

// export async function getStaticProps() {
//     const res = await fetch("/api/sections/get/get_megamenu_list");
//     const sectionData = await res.json();
//     console.log("sectionData==",sectionData);
//     return {
//       props: {
//         sectionData,
//       },
//     };
// }

export default Home;
