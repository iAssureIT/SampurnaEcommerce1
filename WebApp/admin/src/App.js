import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';


import Layout from './Layout.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './coreadmin/css/root.css';
import './App.css';
import $ from 'jquery';
import openSocket from 'socket.io-client';
const  socket = openSocket(process.env.REACT_APP_BASE_URL,{ transports : ['websocket'] });
console.log('check 1', socket.connected);
socket.on('connect', function() {
  console.log('check 2', socket.connected);
});
// axios.defaults.baseURL = ;
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// axios.defaults.baseURL = "http://qaunimandaiapi.iassureit.com/";
// axios.defaults.baseURL = "http://qawebsiteapi1.iassureit.in/";

axios.defaults.headers.post['Content-Type'] = 'application/json';

// console.log("baseURL",axios.defaults.baseURL)

function App(){
  return(
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
 	);
}

export default App;