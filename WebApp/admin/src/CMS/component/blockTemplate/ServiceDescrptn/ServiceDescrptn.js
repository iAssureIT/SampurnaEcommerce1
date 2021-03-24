import React from 'react';
import axios from 'axios';
import './ServiceDescrptn.css';

export default class ServiceDescrptn extends React.Component {
 
	constructor(props) {
		super(props);
		this.state = {
		  blocks: {
			"blockTitle": "Truck Shipping",
			"blockSubTitle": "Description",
			"blockDescription": 'OMMENTS CHART Yorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo enean massa. Cumsociis nato magnis dis parturient monte, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit ametum penatibus. Nunc rhoncus rutrum leo id venenatis. Etiam commodo ante sed nunc porta commodo. Integer non euismod in, placerat vulputate tellus. Cum sociis natoque penatibus et magnis dis parturient montes, mus. Suspendisse tristique neque tortor, et rhoncus ex ullamcorper vitae. Suspendisse convallis nisl a gra Cras eleifend ex sed mi gravida, sit amet vulputate est convallis. Class aptent taciti sociosqu ad litora torq nostra, per inceptos himenaeos. Sed at purus rhoncus, convallis purus congue, bibendum lacus. Nullam a sed accumsan. Sed orci dolor, pulvinar nec luctus a, malesuada ac nisl. Aliquam eleifend et dui et suscipit. Nam semper adapibus urna dapibus et. Aenean lobortis viverra nibh in porttitor. Aenean vel eros posuere, laoreet ligulas Morbi quis nunc in risus ornare egestas et ac libero. Donec egestas nunc massa, aceuismod odio posuereum nisi lectus, eget aliquet quam sagittis et. Nam volutpat convallis sem vel lobortis. Nullam consectetur cies enim eleifend sit amet..',
			"blockComponentName": "",
			"blockType": "",
			"bgImage": "/images/1.png",
			"fgImage": "/images/About_us_Banner.png",
			
	
		  
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
	/*console.log("==>",this.props.block_id);*/
			 if (this.props.block_id) {
				 axios
					.get('/api/blocks/get/'+this.props.block_id)
					.then((response)=>{
						if(response.data){
							console.log("ListofServices =",response.data);
						  this.setState({
							  blocks:response.data
						  });
						}                  
					  })           
					.catch(function(error){
					  console.log(error);
						if(error.message === "Request failed with status code 401")
						  {
							  // swal("Your session is expired! Please login again.","", "error");
						  }
				  })
				}
		  this.setState({
					block_id:this.props.block_id
				  });

		  
			}

	

	render() {

		

		return (

			<section>

				<div className="DescrpWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="imgContainer col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
						<div className="row	">
							<img src={this.state.blocks.fgImage}/>
						</div>
						<div className="imgHeading col-lg-12  col-md-12  col-sm-12 col-xs-12">
							<h2 >{this.state.blocks.blockTitle}</h2>
						</div>
						<div className="text-center descrptionBox col-lg-2">{this.state.blocks.blockSubTitle}</div>
						<div className="contBox col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<p>
								{this.state.blocks.blockDescription}
							</p>
						</div>
					</div>
					
				</div>
				

			</section>

			)
	}
}