const express = require('express');const express = require('express');
const app = express();
const http = require('http').createServer(app);
// Increase buffer limit to support large file chunks
const io = require('socket.io')(http, {
    maxHttpBufferSize: 1e9, // 1 GB limit per chunk (virtually unlimited)
    cors: { origin: "*" }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // 1. Text Message
    socket.on('chatMessage', (data) => {
        socket.broadcast.emit('receiveMessage', data);
    });

    // 2. File Transfer Logic (Chunked)
    // Start
    socket.on('file-start', (data) => {
        socket.broadcast.emit('file-start', data);
    });

    // Chunk
    socket.on('file-chunk', (data) => {
        socket.broadcast.emit('file-chunk', data);
    });

    // End
    socket.on('file-end', (data) => {
        socket.broadcast.emit('file-end', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

http.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
