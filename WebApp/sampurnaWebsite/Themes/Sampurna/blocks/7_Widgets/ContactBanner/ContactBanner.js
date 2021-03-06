import React, {Component} from 'react';
import axios              from 'axios';




import S from './ContactBanner.module.css';


export default class ContactBanner extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "CONTACT US",
                "blockSubTitle"      : "HOME / ",
                "blockDescription"   : "CONTACT US",
                "blockComponentName" : "ContactBanner",
                "blockType"          : "7_Widgets",
                "bgImage"            : "/images/CMSBlockType/7_Widgets/ContactBanner.jpg",
                "fgImage1"           : "",
                "fgImage2"           : "",
                "repeatedBlocks"     : [
                    {
                        Title        : "", 
                        subTitle     : "", 
                        Description  : "",
                        FGImage1     : "",
                        FGImage2     : "",
                        BGImage      : "",
                        Link         : "" 
                    },
                    

                ],
                "bgVideo"            : "",
                "fgVideo"            : "",
                "blockGroup"         : "",
                "blockAppearOnPage"  : ""
            },
            blockID  : "",
            block_id : ""
        }
    }

    componentDidMount(){
        {
            axios
                .get('/api/blocks/get/'+this.props.block_id)
                .then((response)=>{
                    if(response.data){
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
            // <div className="row">
                <section className={"col-12 "+S.blockWrapper}  style={{backgroundImage:"url("+this.state.blocks.bgImage+")"}}>
                    <div className={"col-12 col-md-10 offset-md-1 "+S.textWrapper}> 
                        <div className={"col-12 "+S.pageAboutText} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></div>
                        <span className={" "+S.pageAboutText1} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockDescription} }></span>
                        <div className={"col-12 "+S.subTitle} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockSubTitle} }></div>
                    </div>    
                </section>
            // </div>
             
        );
    }
}