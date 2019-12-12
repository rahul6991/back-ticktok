const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const detailRoutes = require('./routes/userDetailRoutes');

//socket dependency
const http = require('http');
const socketIO = require('socket.io');
const  server = http.createServer(app);
const io = socketIO(server);

// initiating connection
const mongoose = require('./db/connection');
//every request body will get parsed by this
app.use(bodyParser.json());
//routes
// app.use(express.static(__dirname));
app.use('/user', userRoutes);
app.use('/details', detailRoutes);


const liveUsers = () => {
    let clients = io.sockets.clients().connected;
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.user);
    users = users.filter(user => { return user !== undefined })
    return users;
}

const emitVisitors = () => {
    io.emit("visitors", liveUsers())
}

const requestToUser = (user) => {
    console.log(user);
    io.emit(user.to.email, user);
}

const requestAccepted = (user) => {
    io.emit(user.to.email, user);
}
const nextTurn = (user)=>{
    io.emit(user.to.email, user);
}
const restartTurn = (user)=>{
    io.emit(user.to.email, user);
}

io.on("connection", function (socket) {
    console.log("connected client");

    socket.on("new_visitor", user => {
        socket.user = user;
        emitVisitors();
    });

    socket.on("request_visitor", user => {
        requestToUser(user);
    });

    socket.on("request_accepted", user => {
        requestAccepted(user);
    });
    socket.on("request_declined", user => {
        requestAccepted(user);
    });
    socket.on("nextTurn", user=>{
        nextTurn(user);
    });
    socket.on("end_tournament", user=>{
        console.log(user);
        nextTurn(user);
    })

    socket.on("restart", user=>{
        restartTurn(user);
    });
    socket.on("disconnect", () => { console.log("disconnected") });
})


server.listen(3000, ()=>{
    console.log("Server is running...")
})