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

Category.sync().then(() => {
    Category.create({ category: "Salario", transactionType: "income" })
    Category.create({ category: "Negocios", transactionType: "income" })
    Category.create({ category: "Ingresos extra", transactionType: "income" })
    Category.create({ category: "Regalías", transactionType: "income" })
    Category.create({ category: "Pago de seguro", transactionType: "income" })
    Category.create({ category: "Dividendos", transactionType: "income" })
    Category.create({ category: "Inversiones", transactionType: "income" })
    Category.create({ category: "Otros", transactionType: "income" })
    Category.create({ category: "Facturas", transactionType: "outcome" })
    Category.create({ category: "Belleza", transactionType: "outcome" })
    Category.create({ category: "Carro", transactionType: "outcome" })
    Category.create({ category: "Educación", transactionType: "outcome" })
    Category.create({ category: "Entretenimiento", transactionType: "outcome" })
    Category.create({ category: "Familia", transactionType: "outcome" })
    Category.create({ category: "Comida y bebida", transactionType: "outcome" })
    Category.create({ category: "Regalos", transactionType: "outcome" })
    Category.create({ category: "Snacks", transactionType: "outcome" })
    Category.create({ category: "Salud", transactionType: "outcome" })
    Category.create({ category: "Casa", transactionType: "outcome" })
    Category.create({ category: "Compras", transactionType: "outcome" })
    Category.create({ category: "Hobbies", transactionType: "outcome" })
    Category.create({ category: "Transporte", transactionType: "outcome" })
    Category.create({ category: "Viajes", transactionType: "outcome" })
    Category.create({ category: "Trabajo", transactionType: "outcome" })
})

module.exports = Category