import React, { Component }   from 'react';
import axios                  from 'axios';
import IAssureTable           from "../../../../coreadmin/IAssureTable/IAssureTable.jsx";
import _                      from 'underscore';
class FileWiseProductList extends Component{
    constructor(props) {
      super(props);
      this.state = {
          fileNameNCountData : [],
          tableHeading:{
            "fileName"     : "File Name",
            "productCount" : "Product Count",
            "actions"      : "Action"
          },
          "tableObjects"              : {
              deleteMethod              : 'delete',
              apiLink                   : '/api/products/file',
              paginationApply           : true,
              searchApply               : true,
            },
          startRange : 0,
          limitRange : 10
      };
      window.scrollTo(0, 0);
    }
    componentWillReceiveProps(nextProps) {
      this.getCount();
      this.getData(this.state.startRange, this.state.limitRange);
    }
    componentDidMount() {
      this.getCount();
      this.getData(this.state.startRange, this.state.limitRange);
      
    }
    deleteFileWiseProduct(event){

    }
    getSearchText(event){

    }
    getData(startRange, limitRange){
      var data = {
        startRange : startRange,
        limitRange : limitRange
      }
      axios.post('/api/products/get/files', data)
      .then((response)=>{
        console.log(response.data);
        var tableData = response.data.map((a, i)=>{
          return {
            fileName: a.fileName !== null ? a.fileName.replace(/\s+/, "")  : "-", 
            productCount: a.productCount !== NaN ? "<p>"+a.productCount+"</p>" : "a", 
            _id: a._id !== null ? a._id.replace(/\s+/, "")  : "-", 
          }
        })
        console.log('tableData', tableData)
        this.setState({
          tableData : tableData
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    getCount(){
      axios.get('/api/products/get/files/count')
      .then((response)=>{
        console.log(response.data)
        this.setState({
          dataCount : response.data
        })
      })
      .catch((error)=>{
        console.log('error', error);
      })
    }
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp">
                <div className="formWrapper">
                  <section className="content">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                      <div className="row">
                        <div className="">
                           <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                <h4 className="NOpadding-right"> File Wise Product List</h4>
                          </div>
                        
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTopp">
                            <IAssureTable 
                              tableHeading={this.state.tableHeading}
                              twoLevelHeader={this.state.twoLevelHeader} 
                              dataCount={this.state.dataCount}
                              tableData={this.state.tableData}
                              getData={this.getData.bind(this)}
                              tableObjects={this.state.tableObjects}
                              getSearchText={this.getSearchText.bind(this)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                </div>
              </div>
            </div>
        );
    }
}
export default FileWiseProductList ;
