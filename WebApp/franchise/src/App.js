import React from 'react';
import axios from 'axios';
import Layout from './Layout.js';
import './coreadmin/css/root.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// axios.defaults.baseURL = ;
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
//console.log("axios.defaults.baseURL = ",process.env.REACT_APP_BASE_URL);
function App() {
  return (
    <div> 
      <Layout />
    </div>    
 	);
}

export default App;