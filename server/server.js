var express = require('express');
var server = require('http').createServer(app);
var app = express();
var io = require('socket.io')(server);
var moment = require('moment')

var port = 3696;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

io.on('connection', function (socket) {

  console.log('user connected...');
  socket.events = {};

  socket.on('event.message', function (payload) {
    var response = {
      room: payload.room,
      time: moment().toObject(),
      type: payload.message.type,
      sender: payload.message.sender,
      text: payload.message.text
    }

    socket.to(payload.room).emit('event.response', response);
  });

  socket.on('event.subscribe', function (room) {
    console.log('subscribing to', room);
    socket.join(room);
  });

  socket.on('event.unsubscribe', function (room) {
    console.log('unsubscribing to ', room);
    socket.leave(room);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected...');
  });

});
