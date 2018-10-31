
const Sequelize = require('sequelize');
const sequelize = new Sequelize('whatsapp', 'root', 'mahardika', {
  host: '172.20.0.1',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define:{
    freezeTableName:true,
    timestamps: false,
  }
});

module.exports = { sequelize, Sequelize };