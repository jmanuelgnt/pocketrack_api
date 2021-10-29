const {Sequelize, DataTypes} = require('sequelize');
const db = require('../db/config');
const Category = require('./category');
const Wallet = require('./wallet');

const Transaction = db.define('transactions',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    note : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    ammount : {
        type : Sequelize.DECIMAL,
        allowNull : false,
        validate : {
            isDecimal : {
                msg : "Ingrese un monto válido"
            },
            isPositiveNumber(value){
                if(value < 0){
                    throw new Error("El monto no puede ser negativo")
                }
            }
        }
    },
    istransfer : {
        type : DataTypes.ENUM({
            values : ["0","1"]
        })
    },
})

Transaction.belongsTo(Category)
Transaction.belongsTo(Wallet)
Category.hasMany(Transaction)
Wallet.hasMany(Transaction)

module.exports = Transaction