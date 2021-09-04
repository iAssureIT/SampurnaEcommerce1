import React, {Component} from 'react';
import axios              from 'axios';


import './GetInTouch.css';


export default class GetInTouch extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "GET IN TOUCH",
                "blockSubTitle"      : "Give us a call or drop by anything,we endeavour to answer all enquiries within 24 hours on business day.We will happy to answer your questuions",
                "blockDescription"   : "<span style='font-size:30px'><b>Lorem Ipsum </b> </span> is simply dummy text of the printing and typesetting industry.  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Ipsum passages, <p style='margin-top:20px'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution Ipsum passages, and more recently with desktop publishing software</p>",
                "blockComponentName" : "TemplateOverview",
                "blockType"          : "",
                "bgImage"            : "/images/002.png",
                "fgImage"            : "/images/001.png",
                "repeatedBlocks":[
                    {
                        Title        : "<b>HEAD OFFICE</b>",
                        SubTitle     : "Pune(INDIA)",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/ctlocation_2020101611220.png",
                        Link         : "",
                        Description  : "#323, Amanora Chambers Magarpatta Pune, Maharastra 411228"
                    },
                    {
                        Title        : "<b>PHONE</b>",
                        SubTitle     : "+91 99233 93733",
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/Receiver_20201016112551.png",
                        Link         : "",
                        Description  : ""
                    },
                    { 
                        Title        : "<b>EMAIL</b>",
                        SubTitle     : "info@iassureit.com", 
                        Image        : "https://unimandai.s3.amazonaws.com/CMS/email_20201016112450.png",
                        Link         : "",
                        Description  : ""
                    },
                ],
                "bgVideo"		     : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"	 : ""
            },
            blockID  : "",
            block_id : ""
        };
    }

    componentDidMount(){
        console.log("==>",this.props.block_id);
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
    }

    render(){
        return(
            <div className="container-fluid gettouchwrapp">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 getInTouchDashWrapper">
                        <ul className="col-lg-2 col-lg-offset-5">
                            <li className="dash1"></li>
                            <li className="dash2"></li>
                            <li className="dash3"></li>
                        </ul>
                    </div>
                <div className="col-lg-12 col-sm-12 col-sm-12 col-xs-12 gettitlttextWrapper">
                    <h1 className="gettitlttext" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></h1>
                </div>
                <div className="col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 getintouchwrapp1">
                    <p className="paragraphtext" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockSubTitle}}></p>
                </div>
                <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 getintouchwrapp2">
                    {
                        this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0
                        ?
                            this.state.blocks.repeatedBlocks.map((data, index)=>{
                                return(
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 Getwrapp1" key={index}>
                                        <div className="col-lg-12 wrapper333">
                                            <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 col-xs-12 contact-img-block Getwrapp01">
                                                <img src={data.Image} alt="c02" className="img-responsive"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 colsm-12 col-xs-12 Getwrapp02">
                                            <div className="GTh1title" dangerouslySetInnerHTML={{ __html: data.Title } }></div>
                                            <div className="GTh1title2" dangerouslySetInnerHTML={{ __html: data.SubTitle } }></div>
                                            <div className="GTh1title3" dangerouslySetInnerHTML={{ __html: data.Description } }></div>
                                        </div>
                                    </div>
                                );
                            })
                        :
                            null
                    }
                </div>
            </div>
        )
    }
}