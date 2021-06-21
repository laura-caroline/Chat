const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {users} = require('../databases/models')


const Authenticate = async (request, response)=>{
    const {
        email,
        password
    } = request.body
    try{
        const checkExistsUser = await users.findOne({where: {email}})
        if(checkExistsUser){
            const checkPassword = await bcrypt.compare(password, checkExistsUser.password)

            if(checkPassword){
                const token = jwt.sign({id: checkExistsUser.id}, '@auth', {expiresIn: 86400})
                return response.status(200).send({token, dataUser: checkExistsUser})
            }
            return response.status(400).send({error: 'Senha incorreta'})

        }
        return response.status(400).send({error: 'Usuário/senha invalidos'})
        
    }
    catch(error){
        return response.status(400).send({error: 'Algo deu errado, tente novamente mais tarde!'})
    }
}
module.exports =  Authenticate