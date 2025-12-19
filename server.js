const express = require('express');
const app = express();
const http = require('http').createServer(app);

// 100MB Limit for Large Files
const io = require('socket.io')(http, {
    maxHttpBufferSize: 100 * 1024 * 1024 
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // 1. Chat Message Handle karna
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  // 2. NEW: "Seen/Read" Event Handle karna
  socket.on('message read', (msgId) => {
    // Sabko batao ki ye wala message padh liya gaya hai
    socket.broadcast.emit('message read', msgId);
  });
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});