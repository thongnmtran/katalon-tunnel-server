
const SocketIO = require('socket.io');
const express = require('express');
const http = require('http');
const { Server: IOServer } = require("socket.io");
// var p2p = require('socket.io-p2p-server');


class Server {
  start() {
    const app = express();
    const server = http.createServer(app);
    let agentSocket;

    const io = new IOServer(server);
    // io.use(p2p.Server);

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('log', (log) => {
        console.log(log);
        io.emit('log', log)
      })
      socket.on('send-to', ({ target, event, args }) => {
        io.to(target).emit(event, ...args);
      })
      socket.on('list-sessions', () => {
        const sessions = [...io.sockets.sockets].map(([id]) => id);
        console.log(sessions);
        socket.emit('sessions', sessions);
      })
      socket.on('get-agent', (callback) => {
        if (agentSocket?.connected) {
          callback?.(agentSocket.id);
        } else {
          callback?.(null);
        }
      })
      socket.on('register-agent', () => {
        agentSocket = socket;
        console.log('Agent registered: ' + agentSocket.id);
        io.emit('agent', agentSocket.id);
      })
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log('listening on *:3000');
    });
  }
}

new Server().start();