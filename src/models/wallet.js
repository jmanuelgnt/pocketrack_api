const Sequelize = require('sequelize');
const db = require('../db/config');
const Currency = require('./currency');
const User = require('./user');

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

Wallet.belongsTo(Currency)
Wallet.belongsTo(User,{foreignKey:'userId'})
User.hasMany(Wallet)
Currency.hasMany(Wallet)

module.exports = Wallet