import React, {Component} from 'react';
import axios              from 'axios';




import S from './LegalNotice.module.css';


export default class LegalNotice extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "Legal Notice",
                "blockSubTitle"      : "",
                "blockDescription"   : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br><br>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.<br><br>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
                "blockComponentName" : "LegalNotice",
                "blockType"          : "7_Widgets",
                "bgImage"            : "",
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
                <section classNam={"col-12 "+S.blockWrapper}>
                    <div className={"col-12 col-md-10 offset-md-1 "+S.textWrapper}> 
                        <div className={"col-12 "+S.legalNoticeTitle} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockTitle} }></div>
                        <div className={"col-12 "+S.legalDescription} dangerouslySetInnerHTML={{ __html: this.state.blocks.blockDescription} }></div>
                    </div>    
                </section>
             
        );
    }
}