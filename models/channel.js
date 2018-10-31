const { sequelize, Sequelize } = require('../config/connection');

const channel = sequelize.define('channel', {
  'id': {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  'name': Sequelize.STRING,
  'type': Sequelize.ENUM('ONE_ON_ONE','GROUP'),
  //prevent sequelize transform table name into plural
  // freezeTableName: true,
})
module.exports = channel