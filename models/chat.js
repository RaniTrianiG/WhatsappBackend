const { sequelize, Sequelize } = require('../config/connection');

const chat = sequelize.define('chat', {
  'id': {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  'channel_id': Sequelize.INTEGER,
  'user_id': Sequelize.INTEGER,
  'message': Sequelize.TEXT,
  'image_url': Sequelize.TEXT,
  'createdAt': {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  'updatedAt': {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  //prevent sequelize transform table name into plural
  // freezeTableName: true,
})

module.exports = chat