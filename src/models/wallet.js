const Sequelize = require('sequelize');
const db = require('../db/config')

const Wallet = db.define('wallet',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    walletName : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    currency : {
        type: Sequelize.STRING,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    description : {
        type: Sequelize.STRING
    },
    bank : {
        type: Sequelize.STRING
    },
    bankAccountNumber : {
        type: Sequelize.STRING
    }

})

module.exports = Wallet