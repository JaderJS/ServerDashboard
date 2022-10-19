const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
})

const { addUser, removeUser, getUser, getUsersInRoom, getUsers } = require('./users')

//Chamada da API
const { api } = require('./api')
api()

io.on("connection", (socket) => {

    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id, name, room
        })
        if (error) return callback(error)

        socket.emit('info', { text: `${user.name}, welcome to room ${user.name}.` })

        socket.broadcast.to(user.room).emit('info', { text: `${user.name}, has joined` }) //Envia para todos menos ele mesmo

        socket.join(user.room)

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })


    socket.on('sendData', async (chunk) => {

        const user = await getUser(socket.id)

        io.emit('data', { blob: chunk.blob, text: chunk.text })

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

    })

    socket.on('audio', (data) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('audio', data)
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('info', { user: 'admin', text: `${user.name} se desconectou` })
        }
    })

    socket.on("ping", (callback) => {
        callback()
    })

    //socket.emit('checkClient')

})


httpServer.listen(4000, () => {
    console.log('[SOCKET]: Running in port 4000')
})