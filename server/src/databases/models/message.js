
module.exports = (sequelize, DataTypes)=>{
    const message = sequelize.define('message', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        send_message: {
            allowNull: false,
            type: DataTypes.STRING
        },
        from_user: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {model: 'users', key: 'id'},
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        to_user: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {model: 'users', key: 'id'},
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        date: {
            type: DataTypes.DATE,
        }
    },
    {
        tableName: 'message',
        timestamps: false
    })
    message.associate = (models)=>{
        message.belongsTo(models.users, {foreignKey: 'from_user'})
        message.belongsTo(models.users, {foreignKey: 'to_user'})

    }

    return message
}