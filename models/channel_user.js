const { sequelize, Sequelize } = require('../config/connection');

const channel_user = sequelize.define('channel_user', {
  'id': {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  'channel_id': Sequelize.INTEGER,
  'user_id': Sequelize.INTEGER,
  //prevent sequelize transform table name into plural
  // freezeTableName: true,
})
module.exports = channel_user