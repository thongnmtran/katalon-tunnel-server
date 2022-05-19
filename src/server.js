const express = require('express');
const http = require('http');
const { Server: IOServer } = require('socket.io');
const axios = require('axios');


function getId(socket) {
  return socket?.id;
}

const EventName = {
  connection: 'connection',
  disconnect: 'disconnect',
  log: 'log',
  sendTo: 'sendTo',
  getInstances: 'getInstances',
  setInstances: 'setInstances',
  registerInstance: 'registerInstance',
  startNewInstance: 'startNewInstance',
  stop: 'stop'
};

class Server {
  instances = {};

  startingInstances = [];

  get rawInstances() {
    return [
      ...this.startingInstances,
      ...Object.values(this.instances)
    ]
      .map((instanceI) => ({
        id: getId(instanceI),
        startedTime: instanceI.startedTime
      }));
  }

  registerInstance(instance) {
    const id = getId(instance);
    if (!(id in this.instances)) {
      const existedInstance = this.startingInstances.pop();
      instance.startedTime = existedInstance?.startedTime || Date.now();
    }
    this.instances[id] = instance;
  }

  removeInstance(instance) {
    delete this.instances[getId(instance)];
  }

  startNewInstance() {
    return axios.post('https://cloudbuild.googleapis.com/v1/projects/tidal-mode-347602/triggers/cloud-agent-autorun:webhook?key=AIzaSyAr76dUVOK2Nx2Nuhpy8aFui5LXJILc2yc&secret=ebeb0e7a-4adf-49da-86a2-edad7bfe03e8', {})
      .then(() => {
        this.startingInstances.unshift({ startedTime: Date.now() });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  start() {
    const app = express();
    const server = http.createServer(app);
    const io = new IOServer(server);

    app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/index.html`);
    });

    io.on(EventName.connection, (socket) => {
      console.log(`> New client connected "${getId(socket)}"`);

      socket.on(EventName.log, (log) => {
        io.emit(EventName.log, log);
      });

      socket.on(EventName.sendTo, ({ target, event, args }) => {
        if (target) {
          io.to(target).emit(event, ...args);
        } else if (event === EventName.stop) {
          this.startingInstances.pop();
          io.emit(EventName.setInstances, this.rawInstances);
        }
      });

      socket.on(EventName.getInstances, (callback) => {
        callback?.(this.rawInstances);
      });

      socket.on(EventName.startNewInstance, async () => {
        await this.startNewInstance();
        io.emit(EventName.setInstances, this.rawInstances);
      });

      socket.on(EventName.registerInstance, () => {
        this.registerInstance(socket);

        io.emit(EventName.setInstances, this.rawInstances);

        socket.on(EventName.disconnect, () => {
          this.removeInstance(socket);
          io.emit(EventName.setInstances, this.rawInstances);
        });
      });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log('\r\n'.padEnd(80, '-'));
      console.log(`\r\n>>> Server has been started on port ${port}`);
      console.log('\r\n'.padEnd(80, '-'));
    });
  }
}

new Server().start();
