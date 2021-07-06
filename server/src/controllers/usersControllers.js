const {users} = require('../databases/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");


class UsersControllers{
    async createUser(request, response){
        const {
            nickname,
            email,
            password
        } = request.body
        try{
            const checkExistsThisUser = await users.findOne({where: {email}})

            if(checkExistsThisUser){
                return response.status(401).send({error: 'Usuário já existe'})
            }

            const hashPassword = await bcrypt.hash(password, 6)
            const generateUser = await users.create({
                photo: `http://192.168.1.48:8080/uploads/${request.files[0].filename}`,
                nickname,
                email,
                password: hashPassword
            })
            const token = jwt.sign({id: generateUser.id},'@auth', {expiresIn: 86400})
            return response.status(200).send({
                token, 
                dataUser: generateUser
            })
        }
        catch(err){
            return response.status(400).send({error: 'Algo deu errado, tente novamente mais tarde!'})
        }
    }
    async authenticateUser(request, response){
        const {
            email,
            password
        } = request.body
        try{
            const checkExistsUser = await users.findOne({where: {email}})

            if(!checkExistsUser){
                return response.status(401).send({error: 'Usuário invalido'})
            }
            if(!(await bcrypt.compare(password, checkExistsUser.password))){
                return response.status(401).send('Senha invalida')
            }
    
            const token = jwt.sign({id: checkExistsUser.id}, '@auth', {expiresIn: 86400})
            return response.status(200).send({token, dataUser: checkExistsUser})    
        }
        catch(error){
            return response.status(400).send({error: 'Algo deu errado, tente novamente mais tarde!'})
        }
    }
}

module.exports = new UsersControllers()