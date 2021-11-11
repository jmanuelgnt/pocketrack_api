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

Category.sync().then(async() => {
    await Category.create({ id:1,category: "Salario", transactionType: "income" })
    await Category.create({ id:2,category: "Negocios", transactionType: "income" })
    await Category.create({ id:3,category: "Ingresos extra", transactionType: "income" })
    await Category.create({ id:4,category: "Regalías", transactionType: "income" })
    await Category.create({ id:5,category: "Pago de seguro", transactionType: "income" })
    await Category.create({ id:6,category: "Dividendos", transactionType: "income" })
    await Category.create({ id:7,category: "Inversiones", transactionType: "income" })
    await Category.create({ id:8,category: "Otros", transactionType: "income" })
    await Category.create({ id:9,category: "Facturas", transactionType: "outcome" })
    await Category.create({ id:10,category: "Belleza", transactionType: "outcome" })
    await Category.create({ id:11,category: "Carro", transactionType: "outcome" })
    await Category.create({ id:12,category: "Educación", transactionType: "outcome" })
    await Category.create({ id:13,category: "Entretenimiento", transactionType: "outcome" })
    await Category.create({ id:14,category: "Familia", transactionType: "outcome" })
    await Category.create({ id:15,category: "Comida y bebida", transactionType: "outcome" })
    await Category.create({ id:16,category: "Regalos", transactionType: "outcome" })
    await Category.create({ id:17,category: "Snacks", transactionType: "outcome" })
    await Category.create({ id:18,category: "Salud", transactionType: "outcome" })
    await Category.create({ id:19,category: "Casa", transactionType: "outcome" })
    await Category.create({ id:20,category: "Compras", transactionType: "outcome" })
    await Category.create({ id:21,category: "Hobbies", transactionType: "outcome" })
    await Category.create({ id:22,category: "Transporte", transactionType: "outcome" })
    await Category.create({ id:23,category: "Viajes", transactionType: "outcome" })
    await Category.create({ id:24,category: "Trabajo", transactionType: "outcome" })
    await Category.create({ id:66,category: "Transferencia", transactionType: "income" })
    await Category.create({ id:99,category: "Transferencia", transactionType: "outcome" })
})

module.exports = Category