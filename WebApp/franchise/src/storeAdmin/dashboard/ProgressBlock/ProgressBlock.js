import React,{Component} from 'react';
import { render } from 'react-dom';
import axios                    from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../dashboard.css';

export default class ProgressBlock extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      bgColor:props.bgColor,
      faIcon:props.faIcon,
      display:props.display,
      FieldName:"",
      Field:props.Field,
      dataCount : 0,
      compairFieldCount : 0,
      compairField: props.compairField,
    }
  }
   
  componentDidMount(){
      if(this.props.display){
        this.setState({
          Field: this.props.Field,
          FieldName: this.props.Field.FieldName,
          compairField: this.props.compairField ? this.props.compairField : '',
          bgColor: this.props.bgColor,
          faIcon: this.props.faIcon,
        },()=>{this.getData()})
      }
   
  }

  componentWillMount(){
      if(this.props.display){
        this.setState({
          Field: this.props.Field,
          FieldName: this.props.Field.FieldName,
          compairField: this.props.compairField ? this.props.compairField : '',
          bgColor: this.props.bgColor,
          faIcon: this.props.faIcon,
        },()=>{this.getData()})
      }
    
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.setState({
        Field: nextProps.Field,
        FieldName: nextProps.Field.FieldName,
        compairField: nextProps.compairField ? nextProps.compairField : '',
        bgColor: nextProps.bgColor,
        faIcon: nextProps.faIcon,
      },()=>{this.getData()})
    }
  }

  getData(){
    var Method = this.state.Field.method ;
    var Path = this.state.Field.path ;

    axios({
      method: Method,
      url: Path
    })
    .then((response)=>{
      if(response){
        this.setState({
          dataCount : response.data.dataCount
        })
      }
    })
    .catch((err)=>{console.log('ProgressBlock err: ',err)})

    if(this.state.compairField){
      var compairFieldMethod = this.state.compairField.method;
      var compairFieldPath = this.state.compairField.path;

      axios({
        method: compairFieldMethod,
        url: compairFieldPath
      })
      .then((response)=>{
        this.setState({
          compairFieldCount:response.data.dataCount
        })
      })
      .catch((err)=>{console.log('compair field err: ',err)})
    }
  }

    
  render(){
    //console.log("this.state.compairFieldCount",this.state.compairFieldCount);
    return(
      <div>
      {this.state.display ?
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className={"no-padding info-box "+this.state.bgColor}>
              <span className="info-box-icon"><i className={"fa "+this.state.faIcon} aria-hidden="true"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">{this.state.FieldName}</span>
                <span className="info-box-number">{this.state.dataCount} / {this.state.compairFieldCount}</span>
                <div className="progress">
                <div className="progress-bar" style={{ width: (this.state.dataCount/ this.state.compairFieldCount)*100+"%" }}></div>
                </div>
              </div>
            </div>
          </div> 
          :
        null
      }
      </div>
        );
  }
}
