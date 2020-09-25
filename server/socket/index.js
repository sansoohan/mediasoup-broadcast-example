'use strict';

const fs = require('fs');
const express = require('express');
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  noServer: true,
  keepalive: true,
  keepaliveInterval : 60000
});

const pinger = setInterval(function ping() {
  // Ping all the clients to see if they're dead.
  wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
          // Dead for a whole cycle, so close.
          return ws.terminate();
      }
      // Mark as dead until we know otherwise.
      ws.isAlive = false;
      ws.ping(noop);
  })
}, 30000);



const app = express();
app.get('/', function (req, res) {
  res.send('Server is running!');
});
let server;
if (process.env.HTTPS_HOST) {
    // HTTPS server.
    const base = process.env.HTTPS_HOST;
    const PORT = Number(process.env.PORT) || 4040;
    server = require('https').createServer({
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
    }, app);
    console.log(`Listening for HTTPS on ${process.env.HTTPS_HOST || '0.0.0.0'}:${PORT}`);
    server.listen(PORT, process.env.HTTPS_HOST);
}
else {
    // HTTP server.
    const PORT = Number(process.env.PORT) || 8080;
    server = require('http').createServer(app);
    console.log(`Listening for HTTP on ${process.env.HOST || '0.0.0.0'}:${PORT}`);
    server.listen(PORT, process.env.HOST);
}



server.on('connection', ws => {
  ws.on('message', message => {
      console.log(message);
      server.clients.forEach(client => {
          client.send(message);
      });
  });

  

  ws.on('close', () => {
      console.log('close');
  });
});