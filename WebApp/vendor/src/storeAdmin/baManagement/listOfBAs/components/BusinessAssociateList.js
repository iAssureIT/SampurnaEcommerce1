import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from 'jquery';
import axios                from 'axios';
import style                from '../css/ListOfSupplier.css';
import 'bootstrap';
import ListOfAllba    from './ListOfAllSupplier.js'; 
import _ from 'lodash';


export default class BusinessAssociateList extends Component {
  
  constructor(props) {
      super(props);
      this.state= {
                    'searchByName'    : '',
                    'BaId'            : '',
                    'country'         : 'IN',
                    'states'          : '-',
                    'districts'       : '-',
                    'city'            : '-',
                    'category'        : '-',
                    'initial'         : '',
                    'lenghtCount'     : '',
                    'baList'          : [],
                    'masterBA'        : [],
                    'statesArray'     : [],
                    'districtArray'   : [],
                    'blocksArray'     : []
                  }
      this.camelCase = this.camelCase.bind(this);
    }
  componentDidMount(){
    this.getBA();
    this.getStates('IN');
  }
  camelCase(str){
      return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    }
  getBA(){
      axios.get("/api/businessassociates/get/list")
            .then((response)=>{
              console.log(response.data);
              this.setState({
                  baList : response.data,
                  masterBA : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })  
  }
  searchBA(event){
    console.log(event.target.value);
    this.setState({'searchByName' : event.target.value});
    //var pattern = '/^'+event.target.value+'/i';
    var pattern = new RegExp('^' + event.target.value, 'i');
    var searchedData = this.state.masterBA.filter((ba) => {
      
        return pattern.test(ba.companyName);
    });

    this.setState({
                  baList : searchedData
                });
  }
  arrayColumn(array, columnName) {
    return array.map(function(value,index) {
        return value[columnName];
    })
  }
  shortByAlpha(event){
    event.preventDefault();

    var baList = this.state.baList;
    

    for(var key in document.querySelectorAll('.alphab')){
      //console.log($($('.alphab')[key]))
      $($('.alphab')[key]).css('background','#ddd');
      $($('.alphab')[key]).css('color','#fff');
      //$($('.alphab')[key]).style.background = '#ddd';
      //$($('.alphab')[key]).style.color = '#fff';
    }

    event.target.style.background = '#000';
    event.target.style.color = '#fff';
    
    if ($(event.target).attr('value') == 'All') {

      this.setState({baList: this.state.masterBA});
      if(this.state.states != '-'){
        this.showAllList(this.state.masterBA, "locationDetails", "stateCode",this.state.states);
      }
      if(this.state.districts != '-'){
        this.showAllList(this.state.masterBA, "locationDetails", "district",this.state.districts);
      }
      if(this.state.city != '-'){
        this.showAllList(this.state.masterBA, "locationDetails", "city",this.state.city);
      }
    }else{
      var letterUpper = $(event.target).attr('value');
      var letterLower = $(event.target).attr('value').toLowerCase() ;
      
      var sorted = this.state.masterBA.filter((ba) => {
        return ba.companyName.startsWith(letterUpper) || ba.companyName.startsWith(letterLower)
      });

      this.setState({baList : sorted});
    }
    
    $('.commonSup').hide();
  }

  resetFilter(event){
    event.preventDefault();
    $('.Statesdata').prop('selectedIndex', 0);
    $('.districtsdata').prop('selectedIndex', 0);
    $('.blocksdata').prop('selectedIndex', 0);
    this.setState({
      'country'         : 'IN',
      'states'          : '-',
      'districts'       : '-',
      'city'            : '-',
      'category'        : '-',
      'initial'         : '',
    })
    this.setState({
        baList: this.state.masterBA
    });
  }
  showAllList(array, findAt, prop,value){
      
    var formValues = {
      country : this.state.country,
      state   : this.state.states,
      city  : this.state.city,
      catgory : this.state.category,
      initial : this.state.initial,
    }

    var searchByName = this.state.searchByName;
    var currentState = this.state.states;
    if(searchByName != ''){

    }else{

      var filteredData = this.filterByProperty(array, findAt, prop,value);
       
      this.setState({
        baList: filteredData
      });
    }

  }

  filterByProperty(array, findAt, prop, value){
    console.log('ba',array);
    
    var filtered = [];
    var filteredfinal = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof obj[key]  === 'object'){
                if( key == findAt ){ 
                  var item = obj[key];                  
                  for(var k in item){
                     var filtered=item.filter(function(i){
                        for(var l in i){
                        //console.log(i[prop]);
                        //console.log(value);
                        return i[prop].toLowerCase()==value.toLowerCase();
                        }             
                    });
                    
                    if(filtered.length > 0){
                       filteredfinal.push(obj._id);
                    }    
                  }   
                }
              }       
        }
    }
    console.log('filteredfinal',filteredfinal); 

    var finalArray = [];   
    var filtered=array.filter(function(n,i){
    
      for(var k in filteredfinal){
        console.log('[k]',k); 
        console.log('filteredfinal[k]',filteredfinal[k]); 
          //return n._id==filteredfinal[k]; 
          if(n._id==filteredfinal[k]){
            finalArray.push(n);
          }
          
      }
    });
    console.log('finalArray',finalArray);   
    return finalArray;
    }
  ShowForm(event){
    //event.preventDefault();
    
    var data = $(event.currentTarget).attr('data-child');
    var BaId = event.currentTarget.id;


      this.setState({
          index:data.split('-')[1],
          BaId : BaId,
      }); 
      console.log('inside',this.state.BaId);
      $('.commonSup').show()
      $('.selected').removeClass('selectedba');
      $(event.currentTarget).addClass('selectedba');
  }
  getStates(StateCode){
      axios.get("http://locationapi.iassureit.com/api/states/get/list/"+StateCode)
            .then((response)=>{
          
              this.setState({
                  statesArray : response.data
              })
              
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    handleChangeState(event){
      event.preventDefault();
      const target = event.target;
      const stateCode = $(target).val();
      
      this.getDistrict(stateCode,'IN');
      this.setState({
        'states' : event.target.value,
      },()=>{this.showAllList(this.state.masterBA, "locationDetails", "stateCode",stateCode)});
       
    }
    getDistrict(stateCode,countryCode){
      axios.get("http://locationapi.iassureit.com/api/districts/get/list/"+countryCode+"/"+stateCode)
            .then((response)=>{
              this.setState({
                  districtArray : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    handleChangeDistrict(event){
      const target = event.target;
      const districtName = $(target).val();
      const stateCode = $('.Statesdata').val();
      const countryCode = 'IN';
      this.getBlocks(districtName,stateCode,countryCode);

      this.setState({
        'districts' : event.target.value,
      },()=>{

        this.showAllList(this.state.masterBA, "locationDetails", "district",districtName)
      });

    }
    getBlocks(districtName,stateCode,countryCode){
      axios.get("http://locationapi.iassureit.com/api/blocks/get/list/"+countryCode+"/"+stateCode+'/'+districtName)
            .then((response)=>{
              var flags = [], output = [], l = response.data.length, i;
              for( i=0; i<l; i++) {
                  if( flags[response.data[i].blockName]) continue;
                  flags[response.data[i].blockName] = true;
                  output.push(response.data[i]);
              }
              
              this.setState({
                blocksArray : output
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }

    handleChangeBlock(event){
      const target = event.target;
      const blockName = $(target).val();
      const districtName = $('#Citydata').val();
      const stateCode = $('#Statedata').val();
      const countryCode = $("#datacountry").val();

      this.getAreas(blockName,districtName,stateCode,countryCode);
       this.setState({
        'blocks' : event.target.value,
      },()=>{

        this.showAllList(this.state.masterBA, "locationDetails", "city",blockName)
      });
    }
    getAreas(blockName,districtName,stateCode,countryCode){
      axios.get("http://locationapi.iassureit.com/api/areas/get/list/"+countryCode+'/'+stateCode+"/"+districtName+'/'+'haveli'+'/'+blockName)
            .then((response)=>{
              this.setState({
                areasArray : response.data
              })
              $('#Areasdata').val(this.state.area);
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <div className="content-wrapper">
        <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
        <section className="content">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 box">
                          <div className="box-header with-border">
                        <h4 className="weighttitle">Business Associate List</h4>
                    </div>
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <h5 className="box-title2 col-lg-3 col-md-11 col-sm-11 col-xs-12">Total Business Associate :&nbsp;&nbsp;<b>{this.state.masterBA.length}</b></h5>
                        <h5 className="box-title2 col-lg-6 col-md-11 col-sm-11 col-xs-12">Filtered :&nbsp;&nbsp;<b>{this.state.baList.length}</b></h5>

                      <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 box-title2" >
                              <span className="blocking-span">
                                <input type="text" name="search"  className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers Searchfind inputTextSearch outlinebox pull-right texttrans"  
                                placeholder="Search..." onInput={this.searchBA.bind(this)} />
                              </span>
                      </div>              
                    </div>
                    <br/>
                    <div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls" style={{marginBottom:'10px'}}>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{marginTop:'10px',marginBottom:'10px'}}>
                        <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                          <button type="button" className="reset" onClick={this.resetFilter.bind(this)}>RESET FILTER</button>
                        </div>
                        
                        <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
                            <select className="form-control resetinp selheight Statesdata" ref="states" name="states" onChange={this.handleChangeState.bind(this)}>
                            <option selected="true" value="-" disabled>Select State</option>
                            { this.state.statesArray && 
                              this.state.statesArray.map((Statedata, index)=>{
                                return(      
                                    <option  key={index} value={Statedata.stateCode}>{this.camelCase(Statedata.stateName)}</option>
                                  );
                                }
                              )
                            }
                            </select>
                        </div>
                        <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
                            <select className="form-control resetinp districtsdata"  ref="district" name="district" onChange={this.handleChangeDistrict.bind(this)}>
                              <option selected="true" value="-" disabled>Select District</option>
                              { this.state.districtArray && this.state.districtArray.length>0 &&
                              this.state.districtArray.map((districtdata, index)=>{
                                return(      
                                    <option  key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
                                  );
                                }
                              )
                          }
                            </select>
                        </div>
                        <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
                            <select className="form-control resetinp blocksdata"  ref="block" name="block" onChange={this.handleChangeBlock.bind(this)}>
                              <option selected="true" value="-" disabled>Select Block</option>
                              { this.state.blocksArray && this.state.blocksArray.length>0 &&
                              this.state.blocksArray.map((blockdata, index)=>{
                                return(      
                                    <option  key={index} value={blockdata.blockName}>{this.camelCase(blockdata.blockName)}</option>
                                  );
                                }
                              )
                          }
                            </select>
                        </div>
                      </div>
                      <br/>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{marginTop:'10px',marginBottom:'10px'}}>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 alphabate">
                        <button type="button" className="btn alphab filterallalphab" name="initial" value="All" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>All</button>
                        <button type="button" className="btn alphab" value="A" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>A</button>
                        <button type="button" className="btn alphab" value="B" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>B</button>
                        <button type="button" className="btn alphab" value="C" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>C</button>
                        <button type="button" className="btn alphab" value="D" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>D</button>
                        <button type="button" className="btn alphab" value="E" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>E</button>
                        <button type="button" className="btn alphab" value="F" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>F</button>
                        <button type="button" className="btn alphab" value="G" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>G</button>
                        <button type="button" className="btn alphab" value="H" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>H</button>
                        <button type="button" className="btn alphab" value="I" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>I</button>
                        <button type="button" className="btn alphab" value="J" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>J</button>
                        <button type="button" className="btn alphab" value="K" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>K</button>
                        <button type="button" className="btn alphab" value="L" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>L</button>
                        <button type="button" className="btn alphab" value="M" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>M</button>
                        <button type="button" className="btn alphab" value="N" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>N</button>
                        <button type="button" className="btn alphab" value="O" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>O</button>
                        <button type="button" className="btn alphab" value="P" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>P</button>
                        <button type="button" className="btn alphab" value="Q" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Q</button>
                        <button type="button" className="btn alphab" value="R" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>R</button>
                        <button type="button" className="btn alphab" value="S" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>S</button>
                        <button type="button" className="btn alphab" value="T" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>T</button>
                        <button type="button" className="btn alphab" value="U" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>U</button>
                        <button type="button" className="btn alphab" value="V" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>V</button>
                        <button type="button" className="btn alphab" value="W" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>W</button>
                        <button type="button" className="btn alphab" value="X" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>X</button>
                        <button type="button" className="btn alphab" value="Y" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Y</button>
                        <button type="button" className="btn alphab" value="Z" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Z</button>
                      </div>
                      <br/>
                      </div>
                      <br/>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">

                    {

                      this.state.baList && this.state.baList.length >0 ?
                      this.state.baList.map((data,index)=>{
                     
                              return(
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} 
                                   onClick={this.ShowForm.bind(this)} name={index}  data-child={data._id+'-'+index} id={data._id}>
                                   { data.logo=="" ?
                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 baLogoDiv">
                                      <img src="images/noimage.png" className="supplierLogoImage"></img>
                                    </div>
                                    :
                                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 baLogoDiv">
                                     <img src={data.logo} className="supplierLogoImage"></img>
                                    </div> 
                                  }
                                    <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 listprofile">
                                      <h5 className="titleprofile">{data.companyName}</h5>
                                      <ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
                                      <li><i className="fa fa-arrows col-lg-1 noPadding" aria-hidden="true"></i>Website: {data.website}</li>
                                      <li>&nbsp;PAN: {data.pan}</li>
                                      <li>&nbsp;GST No: {data.gstno}</li>
                
                                      </ul>                     
                                    </div>
                                  </div>    
                              );

                      })
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
                        <h5>No Data Found</h5>
                      </div>
                    }
                    </div>
                    {this.state.index && this.state.BaId ? 
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pdcls baOneProfile commonSup"  id={this.state.BaId}>
                          <div id={this.state.BaId} className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                            <ListOfAllba name={this.state.index}  BaId={this.state.BaId}  /> 
                          </div>
                        </div>
                    : 
                      null
                    }
                    </div>
                  </div>
                  
              </div>
          </section>
      </div>
  </div>
    )
  }
}