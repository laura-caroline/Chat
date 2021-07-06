const express = require('express')
const route = express.Router()
const UsersControllers = require('./controllers/usersControllers')
const auth = require('./middlewares/auth')
const multer = require('multer')
const multerConfig = require('./config/multer')
const upload = multer({storage: multerConfig})
const MessageControllers = require('./controllers/messageControllers')

route.post('/user',upload.any(), UsersControllers.createUser)
route.post('/user/auth', UsersControllers.authenticateUser)
route.post('/auth', auth)
route.get('/messages',MessageControllers.readMessage)



module.exports = route