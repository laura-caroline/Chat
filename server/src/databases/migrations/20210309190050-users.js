'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      photo: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      nickname: {
          allowNull: false,
          type: Sequelize.STRING,
      },
      email: {
          allowNull: false,
          type: Sequelize.STRING,
      },
      password: {
          allowNull: false,
          type: Sequelize.STRING,

      }
    },
    {
      timestamps: false
    })
    return users
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('users')
  }
};
