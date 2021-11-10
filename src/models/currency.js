const Sequelize = require('sequelize');
const db = require('../db/config')

const Currency = db.define('currency',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    currency : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    currencyName : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    },
    symbol : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
            notEmpty:{
                msg : 'El valor no puede ser vacío'
            }
        }
    }
})

Currency.sync().then(()=>{
    Currency.create({ currency: "USD", currencyName: "Dólar de los Estados Unidos", symbol: "$" })
    Currency.create({ currency: "EUR", currencyName: "Euro", symbol: "€" })
    Currency.create({ currency: "JPY", currencyName: "Yen Japonés", symbol: "¥" })
    Currency.create({ currency: "GBP", currencyName: "Libra esterlina", symbol: "£" })
    Currency.create({ currency: "AUD", currencyName: "Dólar Australiano", symbol: "A$" })
    Currency.create({ currency: "CAD", currencyName: "Dólar Canadiense", symbol: "C$" })
    Currency.create({ currency: "MXN", currencyName: "Peso Mexicano", symbol: "$" })
})

module.exports = Currency