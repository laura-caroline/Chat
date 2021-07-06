const MessageServices = require("../services/messageServices");

class MessageControllers{
    static async readMessage(request, response){
        const {from_user, to_user, offset} = request.query
        try{
            const messages = await MessageServices.readMessage({from_user, to_user, offset})
            return response.status(200).send(messages)
        }
        catch(err){
            return response.status(400).send({error: 'Algo deu errado, tente novamente mais tarde'})
        }
    }
}

module.exports = MessageControllers