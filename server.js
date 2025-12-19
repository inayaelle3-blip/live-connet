const express = require('express');
const app = express();
const http = require('http').createServer(app);

// 100MB Limit for Large Files
const io = require('socket.io')(http, {
    maxHttpBufferSize: 100 * 1024 * 1024 
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// --- YAHAN CHANGE KIYA HAI ---
// Messages store karne ke liye ek list
let chatHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // 1. Jaise hi koi naya banda aaye, use purani history bhejo
  chatHistory.forEach((msg) => {
    socket.emit('chat message', msg);
  });

  // 2. Jab naya message aaye
  socket.on('chat message', (data) => {
    // Pehle message ko history mein save karo
    chatHistory.push(data);
    
    // Agar history bahut lambi ho jaye (e.g. 500 messages), to purane delete kar do
    if (chatHistory.length > 500) {
        chatHistory.shift();
    }

    // Phir sabko bhejo
    io.emit('chat message', data);
  });

  // 3. Read Receipts (Blue Ticks)
  socket.on('message read', (msgId) => {
    io.emit('message read', msgId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
