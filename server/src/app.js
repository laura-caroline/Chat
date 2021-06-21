const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const bodyParser = require('body-parser')
const routes = require('./routes')
const path = require('path')

const MessageServices = require('./services/messageServices')


// Configurações

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Acessar routes a cada requisição
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))


io.on("connection", socket => {
    console.log('socket: ' + socket.id)
    let users_connected = []
    let current_nickname_user = socket.handshake.auth.nickname

    // Add in users_connected all users conected in socket 
    // with id from bd, socketId, nickname and photo user
    for (let [id, socket] of io.of("/").sockets) {
        const { id_bd, nickname, photo } = socket.handshake.auth
        users_connected.push({
            id: id_bd,
            socketId: id,
            nickname,
            photo,
            amountMessagesUnreads: 0
        })
    }
    console.log(users_connected)

    // send to the client_side the users connected in socket
    io.emit('users_connected', users_connected)
    // send to the client_side except me, the notification that i'm online
    socket.broadcast.emit('show_notification_user_connected', current_nickname_user)

    // if myself disconnect, update what users are connected 
    // in both: server_side and client_side
    socket.on('disconnect', () => {
        const filterUsersConnected = users_connected.filter((user) => user.socketId !== socket.id)
        users_connected = filterUsersConnected
        socket.broadcast.emit('user_disconnected', filterUsersConnected)
    })

    

    socket.on('private_message', async data =>{
        // Save message sended in database
        const user = users_connected.find(user => user.socketId === socket.id)
        await MessageServices.saveMessage(data)
        console.log('message')
        console.log(data.userSelected)
        socket.emit('user_sended_message', {
            userSelected: data.userSelected,
            content: data.text
        })
        
        // send to the client_side for all users connected a message sended 
        //for an user, with his socket.id for identify who send the message
        io.to(data.userSelected).emit('private_message', {
            content: data.text,
            from: socket.id,
            nickname: user.nickname
        })  
    })


})

server.listen(8080, () => console.log('running'))
