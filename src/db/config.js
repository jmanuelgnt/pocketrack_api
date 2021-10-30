const {Sequelize} = require('sequelize')
require('dotenv').config()

module.exports = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS,
    {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect:'postgres',
    dialectOptions : {
        useUTC : false
    },
    timezone : '-06:00',
    pool: {
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
})