
const SocketIO = require('socket.io');
const express = require('express');
const http = require('http');
const { Server: IOServer } = require("socket.io");


class Server {
  start() {
    const app = express();
    const server = http.createServer(app);

    const io = new IOServer(server);

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('log', (log) => {
        console.log(log);
        io.emit('log', log)
      })
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log('listening on *:3000');
    });
  }
}

new Server().start();