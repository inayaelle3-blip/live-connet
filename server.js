const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    maxHttpBufferSize: 100 * 1024 * 1024, // 100MB Limit for Videos
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Temporary Chat History
let chatHistory = [];

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Send History to new user
    chatHistory.forEach((msg) => {
        socket.emit('chat message', msg);
    });

    // 2. Handle New Messages
    socket.on('chat message', (data) => {
        chatHistory.push(data);
        if (chatHistory.length > 200) chatHistory.shift(); // Keep last 200 messages
        io.emit('chat message', data);
    });

    // 3. Handle Delete for Everyone
    socket.on('delete message', (msgId) => {
        // Remove from server history
        chatHistory = chatHistory.filter(msg => msg.id !== msgId);
        // Tell everyone to remove this message
        io.emit('message deleted', msgId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
