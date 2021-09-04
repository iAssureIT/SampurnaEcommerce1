import React from 'react';
import pptxgen from "pptxgenjs";
import swal from 'sweetalert';


import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import './ppt.css';
let pptx = new pptxgen();
// let slide = pptx.addSlide();

// var pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';


export default class DownPpt extends React.Component {

	constructor(props) {
		super(props);
		 this.state = {
		 		
				Description  : " BY",
				Image 		 : "/images/slide1.jpg",
				Image1 		 : "/images/slide2.jpg",
				Header 		 : "/images/header.png",
				Footer 		 : '/images/footer.png',

		 }
	}

	
DownPpt(event){
	event.preventDefault();
	// var Contents = document.getElementById('slide1Sample').innerHTML;
	// var printTableContents = document.getElementById('tableId').innerHTML;
	 this.setState({
	 	"Description" : "idfgdkf"
	 },()=>{
	 	console.log(this.state.Description)
	 })

	pptx.defineSlideMaster({
		  title : 'MASTER_SLIDE',
		  margin: [0.5, 0.25, 1.00, 0.25],
		  bkgd  : 'FFFFFF',
		  objects: [
		    {image: { x:0, y:0, w:'100%', h:0.75, path:this.state.Header}},/*data:starlabsLogoSml*/
		    
		    {text:  {
		        text:'iAssure IT',
		        options:{x:1, y:2, w:'100%',h:2, align:'center',fontSize:24, color:'FFFFFF',align:'center', fontSize:12}
		    }},
		    {image: { x:0, y:6.4, w:'100%', h:1, path:'/images/footer.png'}},/*data:starlabsLogoSml*/

		  ],
		 
		});
		let slide = pptx.addSlide('MASTER_SLIDE');
		let slide1 = pptx.addSlide();
		let slide2 = pptx.addSlide();
		let slide3 = pptx.addSlide();
		let slide4 = pptx.addSlide();



		var rows = [[	"1. Investment Charter"],
							["2. Portfolio Snapshot"],
							["3. Portfolio Insights – Equity"],
							["4. Portfolio Insights – Debt"],
							["5. Holdings & Performance – Cash"],
							["6. Holdings & Performance – Alternate"],
							["7. Plan of Action"],
							["8. Rebalanced Portfolio analytics"],
							["9. Annexures "]];
			var tabOpts = {
			  x: 8,
			  y: 1.8,
			  w: 4,
			  rowH: 0.45,
			  valign: "center",
			  fill: "F7F7F7",
			  fontSize: 14,
			  color: "363636", 
			  border: [{pt:4.5, color:'bfd4d7'}]
			};
			  let dataChartAreaLine = [
				  {
				    name  : 'Actual Sales',
				    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
				    values: [1500, 4600, 5156, 3167, 8510, 8009, 6006, 7855, 12102, 12789, 10123, 15121]
				  },
				  {
				    name  : 'Projected Sales',
				    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
				    values: [1000, 2600, 3456, 4567, 5010, 6009, 7006, 8855, 9102, 10789, 11123, 12121]
				  }
				];

				
			// };/*border: [{pt:4.5, color:'bfd4d7'}] */ border:{pt:'1'}

			var rows1 = [
						[  { text:'Particulars', options:{colspan:1, fill:'9999FF'} }, { text:'Details', options:{colspan:1, fill:'9999FF'} }], 
						["Client Name", "Abhishek Chamaria"],
						["Entities" ,"Abhishek Chamaria Poonam Chamaria"],
							   	["Taxation Status","Individual"],
								["Portfolio Size","5 Cr."],
							    ["Cash Flow Requirements","No cashflows required from portfolio"],
							    ["Risk Profile","Aggressive +"],
							   [ "Inception Date ","10th Aug 15"],
							    [ "Average Holding Period","3.5 Years"],
							    ["Remarks" ,"Test Remarks to be entered from front end!"]
					];
			var tabOpts1 ={ x:0.6, y:1.3, w:'90%', h:5.5, margin:1, fontSize:14, align:'center', valign:'middle', border:{pt:'1'} }; /*{
			  x: 1.5,
			  y: 1.2,
			  w: 9.9,
			  fill: "F7F7F7",
			  fontSize: 18,
			  color: "363636",
			  border: [{pt:1.5, color:'bfd4d7'}] 
			}*/;
			// EX A: Pass an array of text objects to `addText()`
		

			// slide.addText("Wel-Come", {x:1, y:2, fontSize:18 ,align:'center'});

			slide1.addImage({ path:this.state.Header, x:0, y:0, w:'100%', h:0.75});
			slide1.addImage({ path:this.state.Image, x:0, y:0.75, w:'100%', h:'93%'});
			slide1.addText("Investment Proposal", {x:0.5, y:1.5, fontSize: 32,align:'left'});
			slide1.addText("For ABHISHEK CHAMARIA", {x:0.5, y:2, fontSize: 32,align:'left',color:'ffffff'});
			slide1.addImage({ path:this.state.Footer, x:0, y:6.4, w:'100%', h:1, w:'100%'});


			slide2.addImage({ path:this.state.Header, x:0, y:0, w:'100%', h:0.75});
			slide2.addImage({ path:this.state.Image1, x:0, y:0.75, w:'100%', h:'90%'});
			slide2.addTable(rows, tabOpts);
			// slide2.addImage({ path:this.state.Footer, x:0, y:6.4, w:'100%', h:1, w:'100%'});



			slide3.addImage({ path:this.state.Header, x:0, y:0, w:'100%', h:0.75});
			slide3.addTable(rows1, tabOpts1);


			slide4.addImage({ path:this.state.Header, x:0, y:0, w:'100%', h:0.75});
			slide4.addChart(
				  pptx.ChartType.line,
				  dataChartAreaLine,
				  { x:1, y:1, w:8, h:4 }
				);
			slide4.addImage({ path:this.state.Footer, x:0, y:6.4, w:'100%', h:1, w:'100%'});

			// slide3.addTable(rows1, tabOpts1,{border: {pt:1, type:"solid", color:222}});
		
			// slide3.tableToSlides("iotableId", { master: "MASTER_SLIDE" });

			
			// slide2.addTable(rows, tabOpts);


			// slide.addText(printContents, { x:0.5, y:0.7, fontSize:18 ,align:'center'});
			// pptx.tableToSlides("tableId", { master: "MASTER_SLIDE" });

			/*slide1.addText(
			    'Text Outline',
			    {
			        x:0.5, y:6.0, fontSize:36, color:'0088CC',
			        outline: {size:1.5, color:'696969'}
			    }
			);

			slide2.addText(
			    [
			        { text:'word-level\nformatting', options:{ fontSize:36, fontFace:'Courier New', color:'99ABCC', align:'right', breakLine:true } },
			        { text:'...in the same textbox', options:{ fontSize:48, fontFace:'Arial', color:'FFFF00', align:'center' } }
			    ],
			    { x:0.5, y:4.1, w:8.5, h:2.0, margin:0.1, fill:'232323' }
			);*/
	
            	pptx.writeFile("Sample Presentation.pptx");
              
            
}

	render() {
		return (
			<div>
				<button type="button" class="btn btn-primary" onClick={this.DownPpt.bind(this)}>Click here to generate </button>
				
				<OwlCarousel className="owl-theme  owl-carousel homecarousel " loop nav={true}   animateIn={false} autoplaySpeed={900} items={1}  dots={false} >{/*autoplay={true}*/}

					<div id="slide1Sample item active">
							<img src={this.state.Header} alt="slide1" height="70" width="100%"/>

						<div className="textonimage">
							<h2>Investment Proposal</h2>
							<h2 style={{color:"#fff"}}>For ABHISHEK CHAMARIA</h2>
						</div>
						<div>
							<img src={this.state.Image} alt="slide1"/>
						</div>
					</div>


					<div id="slideSample2 item" style={{marginTop:"10px"}} >
							<img src={this.state.Header} alt="slide1" height="70" width="100%"/>

						<div className="textonimage1">

							{/*<h3>Index</h3>*/}
							{/*<ul>
								<li>1. Investment Charter</li>
								<li>2. Portfolio Snapshot</li>
								<li>3. Portfolio Insights – Equity</li>
								<li>4. Portfolio Insights – Debt</li>
								<li>5. Holdings & Performance – Cash</li>
								<li>6. Holdings & Performance – Alternate</li>
								<li>7. Plan of Action</li>
								<li>8. Rebalanced Portfolio analytics</li>
								<li>9. Annexures</li>

							</ul>*/}
							<table className="table" id="tableId" style={{backgroundColor:"F7F7F7"}}>
							  	<thead className="">
							    	<tr className="">
								      <th data-pptx-min-width={"6"} >1. Investment Charter</th>
								   
							    	</tr>
							  	</thead>
							    <tbody style={{backgroundColor:"F7F7F7"}}>
								    <tr>
								      <td>2. Portfolio Snapshot</td>
								    </tr>
								    <tr >
								      <td>3. Portfolio Insights – Equity</td>
								    </tr>
								    <tr >
								      <td>4. Portfolio Insights – Debt</td>
								    </tr>
								    <tr >
								      <td>5. Holdings & Performance – Cash</td>
								    </tr> 
								    <tr >
								      <td>6. Holdings & Performance – Alternate</td>
								    </tr>
								     <tr >
								      <td>7. Plan of Action</td>
								    </tr>
								    <tr >
								      <td>8. Rebalanced Portfolio analytics</td>
								    </tr>
								    <tr >
								      <td>9. Annexures</td>
								    </tr>
							    	
							    </tbody>
							</table>
						
							
						</div>
						<div>
							<img src={this.state.Image1} alt="slide1"/>
						</div>
					</div>

					<div className="item" style={{marginTop:'10px'}}>
							<img src={this.state.Header} alt="slide1" height="70" width="100%"/>

						<table className="table" id="iotableId">
						  	<thead className="">
						    	<tr className="">
							      <th data-pptx-min-width={"0.6"} >Particulars</th>
							      <th data-pptx-min-width={"0.8"} >Details </th>
							      
						    	</tr>
						  	</thead>
						    <tbody>
		   
							    <tr >
							      <td>Client Name </td>
							      <td >Abhishek Chamaria</td>
							     
							    </tr>
							    <tr >
							      <td> Investment Horizon</td>
							      <td >3 to 5 Years</td>
							     
							    
							    </tr>
							    <tr >
							      <td>Entities</td>
							      <td >Abhishek Chamaria
									Poonam Chamaria</td>
							  
							    </tr>
							    <tr >
							      <td>Taxation Status</td>
							      <td >Individual</td>
							    
							    </tr>
							    <tr >
							      <td>Portfolio Size</td>
							      <td >5 Cr.</td>
							    
							    </tr>
							    <tr >
							      <td>Cash Flow Requirements</td>
							      <td >No cashflows required from portfolio</td>
							    </tr>

							    <tr >
							      <td>Risk Profile </td>
							      <td >Aggressive +</td>
							    </tr>
							    <tr >
							      <td>Inception Date </td>
							      <td >10th Aug 15</td>
							    </tr>
							    <tr >
							      <td>Average Holding Period </td>
							      <td >3.5 Years</td>
							    </tr>
							    <tr >
							      <td>Remarks  </td>
							      <td >Test Remarks to be entered from front end!</td>
							    </tr>
						    	
						    </tbody>
						</table>

					</div>
				</OwlCarousel>

			</div>
		);
	}
}
