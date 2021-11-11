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

Currency.sync().then(async ()=>{
    await Currency.create({ id:1,currency: "USD", currencyName: "Dólar de los Estados Unidos", symbol: "$" })
    await Currency.create({ id:2,currency: "EUR", currencyName: "Euro", symbol: "€" })
    await Currency.create({ id:3,currency: "JPY", currencyName: "Yen Japonés", symbol: "¥" })
    await Currency.create({ id:4,currency: "GBP", currencyName: "Libra esterlina", symbol: "£" })
    await Currency.create({ id:5,currency: "AUD", currencyName: "Dólar Australiano", symbol: "A$" })
    await Currency.create({ id:6,currency: "CAD", currencyName: "Dólar Canadiense", symbol: "C$" })
    await Currency.create({ id:7,currency: "MXN", currencyName: "Peso Mexicano", symbol: "$" })
})

module.exports = Currency