const { message } = require('../databases/models')
const { Op } = require('sequelize')


class MessageServices {
    static async readMessage({ from_user, to_user, offset = 0 }) {
        
        const response = await message.findAll({
            where: {
                from_user: {
                    [Op.or]: [from_user, to_user]
                },
                to_user: {
                    [Op.or]: [to_user, from_user]
                }
            },
            order: [['date', 'DESC']],
            limit: 20,
            offset: parseInt(offset)

        })
        
        const identifyMessagesSendedByMe = response.reduce((arr, currentValue, currentIndex) => {
            if (currentValue.from_user == from_user) {
                arr[currentIndex] = {
                    text: currentValue.send_message,
                    createdAt: currentValue.date,
                    sended_for_me: true
                }
            }
            else {
                arr[currentIndex] = {
                    createdAt: currentValue.date,
                    text: currentValue.send_message
                }
            }
            return arr
        }, [])

        return identifyMessagesSendedByMe

    }

    static async saveMessage({ text, from_user, to_user }) {
        const savingMessage = await message.create({
            send_message: text,
            from_user,
            to_user,
            date: new Date(),
        })
    }
}

module.exports = MessageServices