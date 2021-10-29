const {Sequelize, DataTypes} = require('sequelize');
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
        type: DataTypes.ENUM(['income','outcome']),
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    owner : {
        type : DataTypes.STRING,
        allowNull:true
    }
})

module.exports = Category