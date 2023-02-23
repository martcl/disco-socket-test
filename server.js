import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.resolve(path.dirname(''));

io.on('connection', (socket) => {
  console.log('user connected');

  // listen for color change event from the client
  socket.on('color:update', (color) => {
    // send the color change event to all connected clients
    io.emit('color:update', color);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// evry second send a random color to all connected clients
setInterval(() => {
    io.emit('color:update', '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'));
}, 1000);


// serve static files
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
