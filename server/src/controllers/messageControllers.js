const MessageServices = require("../services/messageServices");


class MessageControllers{
    static async readMessage(req, res){
        const {from_user, to_user, offset} = req.query
        try{
            const response = await MessageServices.readMessage({from_user, to_user, offset})
            return res.status(200).send(response)
        }
        catch(err){
            return res.status(400).send({error: 'Algo deu errado, tente novamente mais tarde'})
        }


    }
}

module.exports = MessageControllers