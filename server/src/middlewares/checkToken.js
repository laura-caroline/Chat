const jwt = require('jsonwebtoken')
const secretKey = '@auth'

const checkToken = (request, response)=>{
    const headers = request.headers.authorization
    const [, token] = headers.split(' ')
    return jwt.verify(token, secretKey, (err)=>{
        if(!err){
            return response.send({token: true})
        }
        
    })
}
module.exports = checkToken