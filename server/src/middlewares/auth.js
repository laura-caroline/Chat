const jwt = require('jsonwebtoken')
const APP_SECRET = '@auth'
const {promisify} = require('util')

module.exports = async (request, response)=>{

    const authHeader = request.headers.authorization
    console.log(authHeader)

    if(!authHeader){
        return response.status(401).send({error: 'Token não fornecido'})
    }
    const [, token] = authHeader.split(' ')

    try{
        const decoded = await promisify(jwt.verify)(token, APP_SECRET)
        return response.status(200).send({token: true})    
    }
    catch(error){
        return response.status(401).send({error: 'Token invalido'})
    }
    
}

