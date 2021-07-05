const http           = require('http');
const app            = require('./app'); // app file include
const globalVariable = require('./nodemon');
const port           = globalVariable.port;
const axios = require('axios');
const server = http.createServer(app);
const io = require('socket.io')(server);

var adminOrtderListValues = {};
io.on('connection', (client) => { 
    console.log("connection established",client.id);
    client.on('adminOrtderListValues', (payload) => {
        adminOrtderListValues = payload;
        getAdminOrderList(payload);
    });

    function getAdminOrderList(payload){
        axios.post('http://localhost:'+globalVariable.port+'/api/orders/get/list_orders_by_status',payload)
        .then(response=>{
            io.sockets.emit('adminBookingList', response.data);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    client.on('postOrder', (payload) => {
        console.log("payload======>",payload);
        axios.post('http://localhost:'+globalVariable.port+'/api/orders/post',payload)
        .then(response=>{
            console.log("response",response);
            io.sockets.emit('order', response.data);
            getAdminOrderList(adminOrtderListValues);
        })
        .catch(err=>{
            console.log(err)
        })
    });

    client.on('room',(room)=> {
        client.join(room);
    });
 
    //Get User OrderList and Change Status
    client.on('userOrderList', (user_id) => {getUserOrderList(user_id)});
    function getUserOrderList(user_id){
        console.log("getUserOrderList",user_id);
        axios.get('http://localhost:'+globalVariable.port+'/api/orders/get/list/'+user_id)
        .then(response=>{
            io.sockets.in(user_id).emit('getUserOrderList', response.data);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // client.on('changevendororderstatus', (payload) => {
    //     axios.patch('http://localhost:'+globalVariable.port+'/api/orders/changevendororderstatus',payload)
    //     .then(response=>{
    //         io.sockets.emit('changeStatus', response.data);
    //         getUserOrderList(payload.order_user_id);
    //         getAdminOrderList(adminOrtderListValues);
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // });

    client.on('changevendororderstatus', (payload) => {
        axios.patch('http://localhost:'+globalVariable.port+'/api/orders/changevendororderstatus',payload)
        .then(response=>{
            io.sockets.emit('changeStatus', response.data);
            getUserOrderList(payload.order_user_id);
            getSingleOrder(payload.order_id);
            getAdminOrderList(adminOrtderListValues);
        })
        .catch(err=>{
            console.log(err)
        })
    })


    client.on('signle_order', (order_id) => {getSingleOrder(order_id)});
    function getSingleOrder(order_id){
        console.log("signle_order order_id",order_id)
        axios.get('http://localhost:'+globalVariable.port+'/api/orders/get/one/'+order_id)
        .then(response=>{
            io.sockets.in(order_id).emit('getSingleOrder', response.data);
        })
        .catch(err=>{
            console.log(err)
        })
    }


 })   


console.log("");
console.log("****************************************");
console.log("");
console.log("    API is running on port --> ",port   );
console.log("");
console.log("****************************************");
console.log("");

server.listen(port);