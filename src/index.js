const path = require('path')
const Filter = require('bad-words')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {createMessages} = require('./utils/messages.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New socket connection')

    socket.emit('message',createMessages("Welcome"))

    socket.broadcast.emit('message',createMessages("A new user has joined"))

    socket.on('sendmessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity not allowed')
        }
        io.emit('message',createMessages(message))
        callback()
    })

    socket.on('location',(coords,callback)=>{
        io.emit('locationMessage',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback('Location shared!')
    })

    socket.on('disconnect',()=>{
        io.emit('message',createMessages("A user has left"))
    })
})

server.listen(port,()=>{
    console.log('Server is up on port',port)
})