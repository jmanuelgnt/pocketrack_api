const Sequelize = require('sequelize');
const db = require('../db/config')

const Category = db.define('categories',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    category : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    transactionType : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
})

module.exports = Category