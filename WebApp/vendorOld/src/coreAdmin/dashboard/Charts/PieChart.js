import React,{Component} from 'react';
import { render } from 'react-dom';
import {Pie} from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import axios             from 'axios';
import moment                   from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../Dashboard.css';

export default class PieChart extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      boxColor:props.boxColor,
      title:props.title,
      display:props.display,
      "data" : {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [] ,
        hoverBackgroundColor: []
        }]
      }
    }
  }
   
  componentDidMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillMount(){
    if(this.props.display){
      this.setState({
        boxColor: this.props.boxColor,
        title: this.props.title,
        apiData : this.props.api,
      },()=>{this.getData()})
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        boxColor: nextProps.boxColor,
        title: nextProps.title,
        apiData : nextProps.api,
      },()=>{this.getData()})
    }
  }

  getData(){
    var data = {...this.state.data};

    if(this.state.apiData){
      var Method = this.state.apiData.method;
      var Path = this.state.apiData.path;
        axios({
          method: Method,
          url: Path
        })
        .then((response)=>{ 
          var catLables = [];
          var piechartcolor =[];
          var totalEstimate = [];
         if(response.data && response.data.length >0){
            response.data.map((data,index)=>{ 
              catLables.push(data._id);
              totalEstimate.push(data.revenue);
              piechartcolor.push(this.getRandomColor());
            })
          if (totalEstimate.length > 0) {
            data.datasets[0].data = totalEstimate;
            data.labels = catLables;
            data.datasets[0].backgroundColor = piechartcolor;
            data.datasets[0].hoverBackgroundColor = piechartcolor;
            this.setState({
              "data" : data
            })
            
          }
        }  
      })
      .catch((error)=>{  
        console.log('error=>',error)      
      });
    }
  }

  getRandomColor(){
    var letters = '01234ABCDEF56789';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
    
  render(){
    return(
     this.state.display ?
        <div className="col-md-4">
          <div className={"dashbox "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
              
              {this.state.data && this.state.data.datasets[0].data.length > 0 ?
              <Pie height={200} data={this.state.data}options={{legend: {display: true, position: 'bottom',align:'start',
                labels: {
                  boxWidth: 15
                }},
                plugins: {
                   labels: [{
                     
                    // render: 'label',
                    // position: 'outside',
                    // fontColor: '#000',
                    // textMargin: 8
                  },
                  {
                    render: 'percentage',
                    fontColor: '#fff',
                  }
                   ]} }} />
                   :
                   <div className="text-center">
                   <img className="chartStyle" src="/images/pie-gif.gif"/>
                   <p className="noChartData">No Data Found</p>
                   </div>
                 }
            </div>
          </div>
        </div> 
        :
        null
        );
  }
}



