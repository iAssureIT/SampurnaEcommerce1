import React,{Component} from 'react';
import { render } from 'react-dom';
import {HorizontalBar} from 'react-chartjs-2';
import axios             from 'axios';

const options = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
          }],
    },
    responsive: true,
    maintainAspectRatio: false     
};


export default class HorizontalBarChart extends Component{
    constructor(props) {
        super(props);
        this.state = {
          boxColor:props.boxColor,
          title:props.title,
          display:props.display,
          "data" : {
          labels: [],
          datasets: [{
                label: 'Total Orders',
                backgroundColor:'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 0.5)',
                borderWidth: 1,
                hoverBackgroundColor:'rgba(255, 206, 86, 0.5)',
                hoverBorderColor:'rgba(255, 206, 86, 0.5)',
                stack: '1',
                data: []
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
              var totalEstimate = [];
             if(response.data && response.data.length >0){
                response.data.map((data,index)=>{ 
                    catLables.push(data.productName);
                    totalEstimate.push(data.saleCount);
                })
              if (totalEstimate.length > 0) {
                data.datasets[0].data = totalEstimate;
                data.labels = catLables;
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
    
  render() {
    return (
      <div className="col-md-8">
          <div className={"box "+this.state.boxColor}>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
            {this.state.data && this.state.data.datasets[0].data.length > 0 ?
                <HorizontalBar data={this.state.data} />
             :
            <div className="display-flex">
              <img className="chartStyle" src="/images/loading-gif.gif"/>
              <p className="noChartData">No Data Found</p>
            </div>
            }
            </div>
          </div>
      </div>
    );
  }
}
