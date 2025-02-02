const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config()

const app = express();
const server = http.createServer(app);

//Use dot env
frontEndConnectionString = process.env.frontEndConnectionString

let onlineUsers = [];  // Track connected users
console.log(frontEndConnectionString)
// Socket.io CORS options
const io = new Server(server, {
  cors: {
    origin: frontEndConnectionString,  // Allow Angular frontend to communicate with this backend
    credentials: true,
  },
  transports: ["polling", "websocket"]
});

// CORS middleware for HTTP requests
app.use(cors({
  origin: frontEndConnectionString,  
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));


// Socket.io event listener
io.on('connection', (client) => {

  
  client.on('username',(username)=>{
    onlineUsers.push(username)
    io.emit('allUsersOnline', onlineUsers); 
  })

  client.on('user-clicked',(userClicked)=>{
    io.emit('user-clicked', userClicked); 
  })

});

server.listen(9000, () => {
  console.log("Server listening at port 9000");
});
