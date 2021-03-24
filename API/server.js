const http           = require('http');
const app            = require('./app'); // app file include
const globalVariable = require('./nodemon');
const port           = globalVariable.port;


console.log("");
console.log("****************************************");
console.log("");
console.log("    API is running on port --> ",port   );
console.log("");
console.log("****************************************");
console.log("");


const server = http.createServer(app);
server.listen(port);