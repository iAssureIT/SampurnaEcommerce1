import React, {Component} from 'react';
import axios              from 'axios';




import S from './ReturnPolicy.module.css';


export default class ReturnPolicy extends Component{

    constructor(props){
        super(props);
        this.state = {
            blocks:{
                "blockTitle"         : "Return Policy",
                "blockSubTitle"      : "",
                "blockDescription"   : "Returns is a scheme provided by respective sellers directly under this policy in terms of which the option of exchange, replacement and/ or refund is offered by the respective sellers to you. All products listed under a particular category may not have the same returns policy. For all products, the policy on the product page shall prevail over the general returns policy. Do refer the respective item's applicable return policy on the product page for any exceptions to the table below. The return policy is divided into three parts; Do read all sections carefully to understand the conditions and cases under which returns will be accepted.You can cancel your order anytime up to next day 9 am before delivery by calling our customer care executives on 8686342020 or 8686642020. We will issue a credit note in favour of you. Your payment will be credited to your account wallet at unimandai.You can use this credit for your next purchase. There is no expiry time to use this credit. We have no cash refund or online return policy.Ensure proper and full address at the time of registering on website. It will help us to deliver you our products on time. Unimandai reserves the right to confirm and validate the information and other details provided by you at any point of time. If upon confirmation your details are found not to be true (wholly or partly), it has the right in its sole discretion to reject the registration and debar you from using the Services and / or other affiliated websites without prior intimation whatsoever.On registering on site, you authorize our staff to contact you on phone regarding delivery, transportation, promotion and feedback.",
                "blockComponentName" : "ReturnPolicy",
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