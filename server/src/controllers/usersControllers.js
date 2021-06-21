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
        console.log(request.body)
        try{
            const checkExistsThisUser = await users.findOne({
                where: {
                    email
                }
            })

            if(!checkExistsThisUser){
                const cryptoPassword = await bcrypt.hash(password, 6)
                const generateUser = await users.create({
                    photo: `http://192.168.1.48:8080/uploads/${request.files[0].filename}`,
                    nickname,
                    email,
                    password: cryptoPassword
                })
                const token = jwt.sign({id: generateUser.id},'@auth', {expiresIn: 86400})
                return response.status(200).send({token, dataUser: generateUser})
            }
            return response.status(400).send({error: 'Este email já está sendo utilizado!'})
        }
        catch(err){
            return response.status(400).send({error: 'Algo deu errado, tente novamente mais tarde!'})
        }
    }
    async readUsers(request, response){
        const {id_user} = request.params
        try{
            const getUsers = await users.findAll({
                where:{
                    id: {
                        [Op.not]: id_user
                    }
                }
            })
            return response.status(200).send(getUsers)
        }
        catch(err){
            return response.status(400).send({error: 'Não conseguimos listar todos os usuários'})
        }
    }
}

module.exports = new UsersControllers()