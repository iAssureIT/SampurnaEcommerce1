import React  from 'react';
import Router from 'next/router';
import Link   from 'next/link';
import Image  from 'next/image';
//import "./eCommerceBanner.css";
import Style from "./eCommerceBanner.module.css";

import axios from 'axios';

export default class eCommerceBanner extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
          blocks: {
		      	"blockTitle": "",
		      	"blockSubTitle": "",
            "blockDescription": "",
            "blockComponentName": "",
            "blockType": "",
            "bgImage": "",
            "fgImage": "",
            "repeatedBlocks": [
                                
                                { 
                                    Title: "", 
                                    SubTitle: "", 
                                    Image: "",
                                    Link: "", 
                                    Description: ""
                                }
            ],
            "bgVideo"				: "",
            "fgVideo"				: "",
            "blockGroup"			: "",
            "blockAppearOnPage"		: ""
          },
          blockID:"",
          block_id:"",
          loading :true,
        };   
      }
    componentDidMount(){
    /*console.log("==>",this.props.block_id);*/
              {
                 axios
                    .get('/api/blocks/get/'+this.props.block_id)
                    .then((response)=>{
                        if(response.data){
                            // console.log("eComm ListofServices =",response.data);
                          this.setState({
                              blocks:response.data,
                              loading :false,
                          });
                        }                  
                      })           
                    .catch(function(error){
                      console.log(error);
                  })
                }
          this.setState({
                    block_id:this.props.block_id
                  });
    }
    gotoDisscount(event){
      Router.push('/dealsoftheday')
    }
	render() {
				return (
          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding "}>
          {!this.state.loading?			
						<div  className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding " +Style.ecbwrapper}>
							<div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 " +Style.ecombgimg} style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
								 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
						              <div className={"col-lg-8 col-md-8 col-sm-12 col-xs-12 " +Style.eocmbgwrapp}>
							            <div className={Style.h1Titlecom0}  dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></div>
								          <div className={"globalTitle "+Style.h2Titlecom00} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></div>
										      <div className={Style.h3Titlecom0000} dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></div>
                          {/* <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 "}>                         
                              <button className={"BannerBtn "+Style.eCommBtn } onClick={this.gotoDisscount.bind(this)}>Shop Now</button>  
                          </div>  */}
                          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 "+Style.goToDiiscountBtn}>                         
                              <div className="middle  ">
                                <Link href="/dealsoftheday">
                                  <a className={"btn annimatedBtn btn1 "}>Shop Now</a>
                                </Link>
                              </div>   
                          </div>    
							         </div> 
                       {this.state.blocks.fgImage?
							          <div className=" col-lg-6 col-md-6 col-sm-12 col-xs-12 Imgwrapp">
							              {/* <img loading="lazy" className={"lazyload "+Style.bannerImgecom +" img-responsive"} src={this.state.blocks.fgImage} alt="Bannerpng"/> */}
                            <Image
                                src={this.state.blocks.fgImage} 
                                alt="Banner Fg Image"
                                className={"lazyload "+Style.bannerImgecom +" img-responsive"}
                                height = "200"
                                width = "200"
                            />
                       </div>  
                       :null
                       }
							    </div> 
							</div>	 
						</div>	
             :
             <div className="col-lg-6 col-lg-offset-3 col-md-4 col-md-offset-4  col-sm-4 col-sm-offset-4 col-xs-12 loading abc">
                 <img src="/images/loader.gif" className=""></img>
             </div> 
             }
            </div>	
      );
}
}