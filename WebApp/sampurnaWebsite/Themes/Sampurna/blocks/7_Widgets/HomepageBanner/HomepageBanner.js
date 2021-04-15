import React, {Component} from 'react';
import $ 		          from 'jquery';
import axios              from 'axios';
// import Image              from 'next/image';


import Style from './HomepageBanner.module.css';


export default class HomepageBanner extends Component{

    constructor(props){
        super(props);
        this.state = {
        blocks : {
            "blockTitle"         : "",
            "blockSubTitle"      : "We are passionate about our work",
            "blockDescription"   : " ",
            "blockComponentName" : "TemplateOverview",
            "blockType"          : "",
            "bgImage"            : "https://unimandai.s3.amazonaws.com/CMS/b1background_20201016144728.png",
            "fgImage"            : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
            "repeatedBlocks": [
                { 
                    Title        : "APPLICATION",
                    SubTitle     : "DEVELOPMENT &MAINTENANCE",
                    Image        : "/images/00002.png",
                    Link         : "",
                    Description  : "Highly Professional,Reliable & Affordable Cost."
                },
                {
                    Title        : " MOBILE",
                    SubTitle     : "SOLUTIONS",
                    Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    Link         : "",
                    Description  : "We Build Robust & Scalable Mobile Applications."
                },
                {
                    Title        : "STAFF",
                    SubTitle     : "AUGMENTATAION",
                    Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    Link         : "",
                    Description  : ""
                },
                {
                    Title        : "CUSTOMISED ECOMMERCE",
                    SubTitle     : "SOLUTIONS",
                    Image        : "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
                    Link         : "",
                    Description  : ""
                }
            ],
            "bgVideo"			 : "",
            "fgVideo"			 : "",
            "blockGroup"		 : "",
            "blockAppearOnPage"	 : ""
        },
            blockID  : "",
            block_id : ""
        };
    }


    componentDidMount(){
        // console.log("==>",this.props.block_id);
        $(document).ready(function(){
            $("#cItemHBpage div:nth-child(1)").addClass("active",{passive: true});
        });
        {
            axios
                .get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
                        // console.log("ListofServices =",response.data);
                        this.setState({
                            blocks:response.data
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
        [].forEach.call(document.querySelectorAll('div[data-src]'), function(div){
            div.setAttribute("style","background-image: url(" + div.getAttribute('data-src') + ");");
            div.onload = function(){
                div.removeAttribute('data-src');
            };
        });
                
    }

	render(){
		return(

            <section className="row">
    			<div className={"carouselBannerwrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 "+Style.carouselBannerwrapper+" "+Style.nopadding}>
    				<div className={"b1banerheight "+Style.b1banerheight} style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
    					<div id="myCarousel" className="carousel " data-ride="carousel"  data-interval="false" data-pause="hover">
                            <div className="carousel-inner" id="cItemHBpage">
                                {
                                    this.state.blocks.repeatedBlocks.map((result, index)=>{
                                        return(
                                            <div className="item " key={index}>
                                                <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 homepagecontentwrapp "+Style.homepagecontentwrapp}>
                                                    <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 slide1 "+Style.slide1}>
                                                        <div className={"mtop100 "+Style.mtop100}>
                                                            <div className={"b1h1Title globalbanner2ndsubtitlefontsize "+Style.b1h1Title}  dangerouslySetInnerHTML={ { __html:result.Title}}></div><br/>
                                                            <div className={"b1h2Title globalbanner1sttitlefontsize "+Style.b1h2Title}  dangerouslySetInnerHTML={ { __html:result.SubTitle}}></div><br/>
                                                            <div className={"b1h3Title globalbanner3rddescriptionfontsize "+Style.b1h3Title}  dangerouslySetInnerHTML={ { __html:result.Description}}></div>
                                                        </div>
                                                    </div>
                                                    <div className={"col-lg-6 col-md-6 col-sm-12 col-xs-12 appIMGwrapp "+Style.appIMGwrapp}>
                                                        <img loading="lazy" className={"lazyload b1bannerImg img-responsive "+Style.b1bannerImg} width= "auto" height= "100" src={result.Image} alt="Bannerpng"/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <a className={" carousel-control carousel-control-prev "+Style.carousel_control_prev} aria-label="previous" href="#myCarousel" data-slide="prev">
                                <div className={"arrow_left "+Style.arrow_left}></div>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className={" carousel-control carousel-control-next "+Style.carousel_control_next} aria-label="next" href="#myCarousel" data-slide="next">
                                <div className={"arrow_right "+Style.arrow_right}></div>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
    			</div>
        </section>
		);
	}
}