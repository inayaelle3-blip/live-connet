const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    maxHttpBufferSize: 1e8 // 100 MB limit for file transfers
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Jab koi message bheje
    socket.on('chatMessage', (data) => {
        // Dusre logo ko message bhejo (Sender ko chhod ke)
        socket.broadcast.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
