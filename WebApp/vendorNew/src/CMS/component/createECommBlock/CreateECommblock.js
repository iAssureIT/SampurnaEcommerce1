import React from 'react';
import $, { post } from 'jquery';
import jQuery from 'jquery';
import './CreateECommblock.css';
import CreateECommblockForm from './CreateECommblockForm.js';
// import FullPageBlock from './FullPageBlock.js';


export default class CreateECommblock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			caraouselBlock : true,
			fullPageBlock  : false,
		}
	}
	showFullPageBlock(event){
		
		this.setState({
			carouselBlock : true,
			fullPageBlock : false,
		})
		// console.log('show caraousel',this.state.caraouselBlock);
		// console.log('show fullpage',this.state.fullPageBlock);
		$('.eCommFullPageWrapper').hide();
		$('.eCommFormWrapper').show();
		
	}
	showCaraouselBlock(event){
		this.setState({
			fullPageBlock : true,
			carouselBlock : false,
		});
		// console.log('fullpage show caraousel',this.state.caraouselBlock);
		// console.log('fullpage show fullpage',this.state.fullPageBlock);

		$('.eCommFullPageWrapper').show();
		$('.eCommFormWrapper').hide();
	}

	render() {
		return (
		<div className="createECommForm">
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
				<div className="row">

					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 eCommBlockTitle ">
						Create New eCommerce Block
					</div>

					{/* <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 typesOfBlock">	
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<label>Types of eCommerce Block</label>
							<div className="form-group">
								<input type="checkbox" name="carouselBlock" title="caraouselBlock" id="carouselCheckbox" checked={this.state.carouselBlock === true} onClick={this.showFullPageBlock.bind(this)} className="customeCheckBox carouselCheckbox" />
								<label className="label-category labelform">Product Carousel<span className="astrick"></span></label>						
							</div>							
							<div className="form-group">
								<input type="checkbox" name="carouselBlock" checked={this.state.fullPageBlock === true} className="customeCheckBox fullPageCarousel" onChange={this.showCaraouselBlock.bind(this)}/>
								<label className="label-category labelform">Full Page<span className="astrick"></span></label>						
							</div>
						</div>				
					</div> */}

					<div className="eCommFormWrapper">
						<CreateECommblockForm  urlParam={this.props.urlParam} Block_id={this.props.Block_id}/>	
					</div>
					{/* <div className="eCommFullPageWrapper">
						<FullPageBlock urlParam={this.props.urlParam} Block_id={this.props.Block_id} />
					</div>	 */}
				</div>
			</div>
		</div>
		);
	}
}
