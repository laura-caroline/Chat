
module.exports = (sequelize, DataTypes)=>{
    const users = sequelize.define('users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        }

    },
    {
        tableName: 'users',
        timestamps: false
    })

    users.associate = (models)=>{
        users.hasMany(models.message, {foreignKey: 'from_user'})
        users.hasMany(models.message, {foreignKey: 'to_user'})

    }
    return users;
}