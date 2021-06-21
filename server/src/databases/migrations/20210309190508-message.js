'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const message = queryInterface.createTable('message', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      send_message: {
        allowNull: false,
        type: Sequelize.STRING
      },
      from_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      to_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATE,
      }
    },
    {
      timestamps: false
    })
    return message
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('message')
  }
};
