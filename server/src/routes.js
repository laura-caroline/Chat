const express = require('express')
const route = express.Router()
const UsersControllers = require('./controllers/usersControllers')
const checkToken = require('./middlewares/checkToken')
const Authenticate = require('./middlewares/auth')
const multer = require('multer')
const multerConfig = require('./config/multer')
const upload = multer({storage: multerConfig})
const MessageControllers = require('./controllers/messageControllers')

route.get('/users/:id_user', UsersControllers.readUsers)
route.post('/users',upload.any(), UsersControllers.createUser)
route.post('/auth', Authenticate)
route.get('/check-token', checkToken)
route.get('/messages',MessageControllers.readMessage)


module.exports = route