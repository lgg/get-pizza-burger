//System vars
var http = require('http'); //http module from node.js
var io;


// var port = 3003; //process.env.PORT; //port on which we will serve the app
// var port_socket = 3003; //process.env.PORT; //port on which socket server will start
var port = process.env.PORT; //port on which we will serve the app
var port_socket = process.env.PORT; //port on which socket server will start

var orders = [];
var queue = 0;

var app = require('express')();
var sserver = require('http').Server(app);
startSocket(sserver);
sserver.listen(port_socket);

//serve static files
app.use('/', require('express').static(__dirname + '/client'));

function startSocket(server) {
    //Start socket.io server
    var options = {
        pingTimeout: 3000,
        pingInterval: 3000,
        transports: ['websocket'],
        allowUpgrades: false,
        upgrade: false,
        cookie: false
    };
    io = require('socket.io')(server, options);

    //Turn off limit of connections
    server.setMaxListeners(0);

    //handle sockets connections
    io.on('connection', function (socket) {

        socket.on('register', function () {
            socket.emit('info', {queue: queue});
        });

        socket.on('claim', function () {
            var num = queue++;
            socket.emit('you are', {num: num});
            socket.broadcast.emit('newclaim', {queue: queue});
        });

        socket.on('got', function () {
            queue--;
            socket.broadcast.emit('got', {queue: queue});
        });
    });
}