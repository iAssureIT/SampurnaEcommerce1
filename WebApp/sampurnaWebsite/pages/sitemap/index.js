import React, { Component } from 'react';
import Link                 from 'next/link';
import firebase from 'firebase/app';
import 'firebase/database';
import axios   from 'axios';
import Header               from '../../Themes/Sampurna/blocks/5_HeaderBlocks/SampurnaHeader/Header.js';
import Footer               from '../../Themes/Sampurna/blocks/6_FooterBlocks/Footer/Footer.js';
import Style from './site-map.module.css';
class SiteMap extends Component{
    constructor(props) {
        super(props);
        this.state={
            sections    : [],
            categories  : []
        }
        this.getSections();
        this.getCategories();
    } 
    getSections(){
        axios.get('/api/sections/get/list')
        .then((response)=>{
            // console.log('sect',response.data)
            this.setState({
                sections : response.data
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    getCategories(){
        axios.get('/api/category/get/list')
        .then((response)=>{
            this.setState({
                categories : response.data
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    render(){
        return(
            <div className="col-12 NoPadding">
            <Header/>
            <div className="container">
            <div className={"col-12 pageTitle "+Style.pageTitle}><h2>Sitemap</h2></div>

            <div className={"col-12 sitemappWrapper "+Style.sitemappWrapper}>
                <h4 className={"subTitles "+Style.subTitles}>Sections</h4>
                <p>
                    {this.state.sections && this.state.sections.length>0?
                        this.state.sections.map((data, index)=>{
                            if(this.state.sections.length === index + 1){
                                return(
                                    <Link href={'/vendor-list/'+data.sectionUrl} prefetch={false} key={index}>
                                        <a className={"siteSec "+Style.siteSec} >{data.section} </a>
                                    </Link>
                                );
                            }else{
                                return(
                                    <Link href={'/vendor-list/'+data.sectionUrl} prefetch={false} key={index}>
                                        <a className={"siteSec "+Style.siteSec} >{data.section} |</a>
                                    </Link>
                                    // <a className={"siteSec "+Style.siteSec} key={index} href={'/section/'+data.sectionUrl+'/'+data._id}>{data.section} | </a>
                                );
                            }
                        })
                        :
                        null
                    }
                </p>

                <h4 className={"subTitles "+Style.subTitles}>Categories</h4>
                <div>
                    {this.state.categories && this.state.categories.length>0?
                        this.state.categories.map((data, index)=>{
                            return(
                                <div key={index}>
                                    <h4 className={"siteCat "+Style.siteCat}><a key={index} href={'/category/'+data.categoryUrl}>{data.category} </a></h4>
                                    <p>
                                    {data.subCategory && data.subCategory.length>0?
                                        data.subCategory.map((datas, i)=>{
                                            if(data.subCategory.length === i + 1){
                                                return(
                                                    <Link href={'/vendor-list/'+data.sectionUrl} prefetch={false} key={i}>
                                                        <a className={"siteSubCat "+Style.siteSubCat} key={i} href={'/subcategory/'+data.section_ID+'/'+data._id+'/'+datas._id}>{datas.subCategoryTitle}</a>
                                                    </Link>
                                                    // <a className={"siteSubCat "+Style.siteSubCat} key={i} href={'/subcategory/'+data.section_ID+'/'+data._id+'/'+datas._id}>{datas.subCategoryTitle}</a>
                                                );
                                            }else{
                                                return(
                                                    <Link href={'/subcategory/'+data.section_ID+'/'+data._id+'/'+datas._id} prefetch={false} key={i}>
                                                        <a className={"siteSubCat "+Style.siteSubCat} key={i} href={'/subcategory/'+data.section_ID+'/'+data._id+'/'+datas._id}>{datas.subCategoryTitle} | </a>
                                                    </Link>
                                                    // <a className={"siteSubCat "+Style.siteSubCat} key={i} href={'/subcategory/'+data.section_ID+'/'+data._id+'/'+datas._id}>{datas.subCategoryTitle} | </a>
                                                );
                                            }
                                        })
                                        :
                                        null
                                    }
                                    </p>
                                </div>
                            );
                        })
                        :
                        null
                    }
                </div>
            </div>
            </div>
            <Footer/>
        </div>
        )
    }
}
export default SiteMap;