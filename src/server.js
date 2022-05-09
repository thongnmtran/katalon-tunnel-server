
const SocketIO = require('socket.io');
const express = require('express');
const http = require('http');
const { Server: IOServer } = require("socket.io");
var p2p = require('socket.io-p2p-server');


class Server {
  start() {
    const app = express();
    const server = http.createServer(app);

    const io = new IOServer(server);
    io.use(p2p.Server);

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('log', (log) => {
        console.log(log);
        io.emit('log', log)
      })
      socket.on('send-to', ({ target, event, data }) => {
        io.to(target).emit(event, data);
      })
      socket.on('list-sessions', () => {
        const sessions = Object.values(io.sockets.sockets).map(socketI => socketI.id);
        socket.emit('sessions', sessions);
      })
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log('listening on *:3000');
    });
  }
}

new Server().start();