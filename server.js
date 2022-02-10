require("dotenv").config();
const http = require("http")
const { Server } = require('socket.io')
var mongoose = require('mongoose');
const express = require('express')
const app = express();

const server =  http.createServer(app)

const io =  new Server(server)

// require("./config/database").connect()

const { API_PORT } = process.env  
const port  = process.env.port || API_PORT

app.use(express.json());

app.use(express.static(__dirname))

app.get("/", (req,res)=>{
    res.sendFile(__dirname + '/indexed.html');
})

// io.on("connection",(socket)=>{  
//     console.log(`a user is connected.... `)
//     socket.on('chat message',(msg) => {
//         console.log('message :' + msg);
//     })
// })

io.on('connection', (socket) => {
    console.log(` We have a new connection: ${socket.id}`)

    // Broadcasting the emmited message
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    // Implemented disconnect
    socket.on('disconnect', function () {
        console.log(`${socket.id} disconnected`);
    })
});

/**io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
*/

/**
 * socket.emit - single client connection
 * socket.broadcast.emit - other client connection except the one connecting
 * io.emit - all client in general
 */

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
 // This will emit the event to all connected sockets

server.listen(port,()=>{
    console.log(`Server running on port ${port}`)
}) 