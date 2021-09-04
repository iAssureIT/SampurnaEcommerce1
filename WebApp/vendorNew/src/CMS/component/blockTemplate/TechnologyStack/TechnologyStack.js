import React, {Component} from 'react';
import axios              from 'axios';


import './TechnologyStack.css';


export default class TechnologyStack extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "<b>TECHNOLOGY STACKS</b>",
                "blockSubTitle"      : "",
                "blockDescription"   : "With the in-depth expertise gained from several successful applications deployments, iAssureIT works directly with customers to overcome todays challenges, combining the right technologies and skill sets.",
                "blockComponentName" : "TechnologyStack",
                "blockType"          : "TechnologyStack",
                "bgImage"            : "",
                "fgImage"            : "/images/TechnologyStackFG.png",
                "repeatedBlocks"     : [
                    {
                        Title        : "iOS Mobile App", 
                        SubTitle     : "", 
                        Description  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincident ut laoreet dolore magna",
                        Image        : "/images/Apple.png",
                        Link         : "" 
                    },
                    {
                        Title        : "Android Mobile App", 
                        SubTitle     : "", 
                        Description  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincident ut laoreet dolore magna",
                        Image        : "/images/Android.png",
                        Link         : "" 
                    },
                    {
                        Title        : "React Native Mobile App", 
                        SubTitle     : "", 
                        Description  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincident ut laoreet dolore magna",
                        Image        : "/images/React.png",
                        Link         : "" 
                    }
                ],
                "bgVideo"			 : "",
                "fgVideo"			 : "",
                "blockGroup"		 : "",
                "blockAppearOnPage"  : ""
            },
            blockID  : "",
            block_id : ""
        }
    }

    componentDidMount(){
        // console.log("==>",this.props.block_id);
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
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 technologyStackWrapper">
                <div className="col-lg-12 technologyStackDashWrapper">
                    <ul className="col-lg-2 col-lg-offset-5">
                        <li className="dash1"></li>
                        <li className="dash2"></li>
                        <li className="dash3"></li>
                    </ul>
                </div>
                <div className="col-lg-12 technologyStackTextWrapper">
                    <p className="technologyStackTitle" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockTitle}}></p>
                    <p className="technologyStackDescription" dangerouslySetInnerHTML={ { __html:this.state.blocks.blockDescription}}></p>
                </div>
                <div className="col-lg-12 technologyStackImageNTextWrapper">
                    <div className="col-lg-6 technologyStackImageWrapper">
                        <img className="technologyStackImage" src={this.state.blocks.fgImage} alt="Technology Stack Image" />
                    </div>
                    <div className="col-lg-6 technologyStackRepeatedBlockWrapper">
                        {
                            this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
                                this.state.blocks.repeatedBlocks.map((data, index)=>{
                                    return(
                                        <div className="col-lg-8 col-lg-offset-2 technologyStackRepeatedBlock" key={index}>
                                            <div className="col-lg-3 technologyStackIconWrapper">
                                                <div className="technologyStackIconBorder">
                                                    <img className="technologyStackIcon" src={data.Image} alt="Technology Stack Icon" />
                                                </div>
                                            </div>
                                            <div className="col-lg-9 technologyStackRepeatedBlockTextWrapper">
                                                <p className="technologyStackRepeatedBlockTitle" dangerouslySetInnerHTML={{ __html: data.Title } }></p>
                                                <p className="technologyStackRepeatedBlockDescription" dangerouslySetInnerHTML={{ __html: data.Description } }></p>
                                            </div>
                                        </div>
                                    );
                                })
                            :
                                null
                        }
                    </div>
                </div>
            </div>
		);
	}
}