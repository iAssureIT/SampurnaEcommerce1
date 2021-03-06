import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './coreAdmin/Layout/Layout.js';
import './App.css';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

//axios.defaults.baseURL = 'http://localhost:5006';

axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
    
    );
}

export default App;