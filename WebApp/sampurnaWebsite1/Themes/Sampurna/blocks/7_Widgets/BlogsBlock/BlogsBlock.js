import React from 'react';
import axios from 'axios';


// import Team1       from '../images/Team1.jpg';
// import Team2       from '../images/Team2.jpg';
// import Team3       from '../images/Team3.jpg';



import S from './BlogsBlock.module.css';

export default class BlogsBlock extends React.Component {
constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle"        : "",
			"blockSubTitle"     : "",
			"blockDescription"  : '',
			"blockComponentName": "BlogsBlock",
			"blockType"         : "4_CustomisedBlocks",
			"bgImage"           : "",
			"fgImage1"          : "",
			"fgImage2"          : "",

			"repeatedBlocks"    : [
								{ 
									Title      : "2020-12-07TO5:31:41:814Z", 
									SubTitle   : "Blog Second", 
									Link       : "by: Bookstore", 
									FGImage1   : "/images/CMSBlockType/7_Widgets/Blog1.jpg",
									FGImage2   : "",
									BGImage    : "",
								},
								{ 
									Title      : "2020-12-07TO5:29:56:232Z", 
									SubTitle   : "Blog First", 
									Link       : "by: Bookstore", 
									FGImage1   : "/images/CMSBlockType/7_Widgets/Blog4.jpg",
									FGImage2   : "",
									BGImage    : "",
								},
								{ 
									Title      : "2020-12-07TO4:57:35:335Z", 	
									SubTitle   : "Blog Third", 
									Link       : "by: Bookstore", 
									FGImage1   : "/images/CMSBlockType/7_Widgets/Blog3.jpg",
									FGImage2   : "",
									BGImage    : "",
								},
								{ 
									Title      : "2020-12-07TO5:54:58:776Z", 	
									SubTitle   : "Blog Fourth", 
									Link       : "by: Bookstore", 
									FGImage1   : "/images/CMSBlockType/7_Widgets/Blog4.jpg",
									FGImage2   : "",
									BGImage    : "",
								},
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
	componentDidMount(){
			 if (this.props.block_id) {
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
						if(error.message === "Request failed with status code 401")
						  {
						  }
				  })
				}
		  this.setState({
					block_id:this.props.block_id
				  });
	}
	

	render() {

		

		return (	
		<section className={"col-12 row mx-auto "+S.BlockWrapper}>

				{
				this.state.blocks.repeatedBlocks && this.state.blocks.repeatedBlocks.length > 0 ?
				this.state.blocks.repeatedBlocks.map((data, index)=>{
				return(

				  

						<div className={"col-12 col-sm-6 col-lg-3 "+S.box}>
							<div className="row">
								<img src={data.FGImage1} alt="enteprice" className="col-12" />
								<div className={"col-12 "+S.dateTime}     dangerouslySetInnerHTML={{ __html: data.Title } }></div>
								<hr></hr>
							    <div className={"col-12 "+S.teamName}     dangerouslySetInnerHTML={{ __html: data.SubTitle } }></div>
							    <div className={"col-12 "+S.teamProfile}  dangerouslySetInnerHTML={{ __html: data.Link } }></div>
						   </div>
						</div>
				

				);
				})
				:
				null
				}	

	    </section>   

				    
			 
		 ) ;
		}
	}
 

			
 