const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected')
    socket.on('message', (message) => {
        io.to(message.roomId).emit('receivedMsg', message.msg);
    });

    socket.on('makeRoom', (roomId) => {
        socket.join(roomId)
        const clientsInRoom = io.sockets.adapter.rooms.get(roomId).size;
        io.to(roomId).emit('updateClients', clientsInRoom)
    })

    socket.on('drawing', (draw) => {
        socket.broadcast.to(draw.roomId).emit('drawing', draw);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/getid', (req, res) => {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    res.send({ roomName: result });
})

PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
