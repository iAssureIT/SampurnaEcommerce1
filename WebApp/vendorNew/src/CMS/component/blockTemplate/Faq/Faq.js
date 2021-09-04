import React, {Component} from 'react';
import "./Faq.css";
import $ 		from 'jquery';
import jQuery 	from 'jquery';
import axios from 'axios';   

export default class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: {
        "blockTitle": "FAQS",
        "bgImage": "https://unimandai.s3.amazonaws.com/CMS/ecom4_20201015191246.png",
        "fgImage": "https://unimandai.s3.amazonaws.com/CMS/Photos-new-icon_2020101519113.png",
        "repeatedBlocks": [
                            { 
                              Title: "WHAT IS LOREM IPSUM 1?", 
                              Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                            },
                            { 
                              Title: "WHAT IS LOREM IPSUM 2?", 
                              Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                            },
                            { 
                              Title: "WHAT IS LOREM IPSUM 3?", 
                              Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                            },
                            { 
                              Title: "WHAT IS LOREM IPSUM 4?",
                              Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                            }
        ],
        "bgVideo"				: "",
        "fgVideo"				: "",
        "blockGroup"			: "",
        "blockAppearOnPage"		: ""
      },
      blockID:"",
      block_id:""
    };   
  }

    componentDidMount() {
        $('.panel-title > a').click(function() {
           $(this).find('i').toggleClass('fa-caret-down fa-caret-up')
           .closest('panel').siblings('panel')
           .find('i')
           .removeClass('fa-caret-up').addClass('fa-caret-down');
        });

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
    render() {
        return (
            <section>
                <div class="panel-group col-lg-10 col-lg-offset-1" id="accordion" role="tablist" aria-multiselectable="true">
                {Array.isArray(this.state.blocks.repeatedBlocks) && this.state.blocks.repeatedBlocks.map((repeatedBlock, index) => {
                  var i = index+1;
                  return(
                   <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                      <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href={"#collapse"+i} aria-expanded="true" aria-controls={"collapse"+i}>
                          {repeatedBlock.Title}<i class="accordion_icon fa fa-caret-down"></i>
                        </a>
                      </h4>
                    </div>
                    <div id={"collapse"+i} class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                      <div class="panel-body"  dangerouslySetInnerHTML={ { __html: repeatedBlock.Description }}>
                     
                        {/* {repeatedBlock.Description} */}
                      </div>
                    </div>
                   </div>
                  )
                 })
                }
                 </div>
            </section>
        )
    }
	}