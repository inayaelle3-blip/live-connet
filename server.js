const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    maxHttpBufferSize: 100 * 1024 * 1024, // 100MB Limit (For Big Videos/Images)
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Temporary Memory (RAM) - Refresh karne par chat rahegi
let chatHistory = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 1. Send History to new user
    chatHistory.forEach((msg) => {
        socket.emit('chat message', msg);
    });

    // 2. Handle New Messages
    socket.on('chat message', (data) => {
        // Save to RAM
        chatHistory.push(data);
        if (chatHistory.length > 100) chatHistory.shift(); // Keep last 100 messages

        // Broadcast to EVERYONE (including sender, to confirm receipt)
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
