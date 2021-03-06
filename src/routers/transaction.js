const express = require('express');
const { Op } = require('sequelize');
const router = new express.Router();
const firebaseAuth = require('../middlewares/auth');
const Category = require('../models/category');
const Currency = require('../models/currency');
const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');
const currencyUtils = require('../utils/currencyConverter')

router.post('/transactions', firebaseAuth, async (req,res) => {
    try {
        if(typeof req.body.ammount == "number"){
            if(req.body.ammount < 0){
                return res.status(400).send({valid:false,error:"Ammount must be a positive number!"})
            }
            const category = await Category.findByPk(req.body.categoryId)
            if(category.transactionType == "outcome"){
                req.body.ammount = parseFloat(req.body.ammount) * -1
            }
        }else{
            res.status(400).send({valid:false,error:"Ammount must be a positive number!"})
        }
        const newTransaction = Transaction.build(req.body)
        await newTransaction.save()
        res.status(200).send({valid:true,newTransaction})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.post('/transactions/transfer', firebaseAuth,async(req,res)=>{
    /*
    walletOrigin
    walletDestination
    ammount
    note
    date
    isTransfer
     */
    if(req.body.walletOrigin && req.body.walletDestination && req.body.ammount && req.body.note && req.body.date && req.body.isTransfer && typeof req.body.ammount == "number"){
        if(req.body.ammount < 0){
            return res.status(400).send({valid:false,error:"Ammount must be a positive number!"})
        }
        const origin = await Wallet.findOne({
            include : [{
                model : Currency,
                attributes : ["currency","symbol"]
            }],
            where : {
                id : req.body.walletOrigin,
                userId : req.user.id
            }
        })
        const destiny = await Wallet.findOne({
            include : [{
                model : Currency,
                attributes : ["currency","symbol"]
            }],
            where : {
                id : req.body.walletDestination,
                userId : req.user.id
            }
        })
        if(!destiny || !origin){
            return res.status(400).send({valid:false,error:"Invalid input data"})
        }
        const changeRate = await currencyUtils.convert(req.body.ammount,origin.currency.currency,destiny.currency.currency)
        //outcome
        const originTransaction = Transaction.build({
            note: `Transferencia: [${req.body.note}] Desde: [${origin.walletName}] Hacia: [${destiny.walletName}] Tasa de cambio: [${origin.currency.currency}->${destiny.currency.currency}:${changeRate}]`,
            ammount: parseFloat(req.body.ammount) * -1,
            istransfer:true,
            transactionDate: req.body.date,
            categoryId: 99,
            walletId : req.body.walletOrigin
        })
        //income
        const destinyTransaction = Transaction.build({
            note: `Transferencia: [${req.body.note}] Desde: [${origin.walletName}] Hacia: [${destiny.walletName}] Tasa de cambio: [${origin.currency.currency}->${destiny.currency.currency}:${changeRate}]`,
            ammount: Math.round((changeRate * parseFloat(req.body.ammount)) * 100) / 100,
            istransfer:true,
            transactionDate: req.body.date,
            categoryId: 66,
            walletId : req.body.walletDestination
        })
        try {
            await originTransaction.save()
            await destinyTransaction.save()
        } catch (error) {
            return res.status(400).send({valid:false,error})
        }
        res.status(200).send({valid:true,transaction:`Transferencia: [${req.body.note}] Desde: [${origin.walletName}] Hacia: [${destiny.walletName}] Tasa de cambio: [${origin.currency.currency}->${destiny.currency.currency}:${changeRate}]`})
    }else{
        res.status(400).send({valid:false,error:"Invalid input data"})
    }
})

//filtro por query, para buscar por ?note=searchString&category=1
router.get('/transactions', firebaseAuth, async(req,res) => {
    const whereStatement = {}
    const whereStatemenForWallet = {userId : req.user.id}
    if(req.query.wallet){
        whereStatement.walletId = req.query.wallet
    }
    if(req.query.note){
        whereStatement.note = {[Op.like] : `%${req.query.note}%`}
    }
    if(req.query.category){
        whereStatement.categoryId = req.query.category
    }
    const dateRange = []
    if(req.query.fromDate){
        let isValidDate = Date.parse(req.query.fromDate)
        if(isNaN(isValidDate)){
            return res.status(400).send({valid:false,error:"fromDate is not valid. Must be YYYY-MM-DD"})
        }
        dateRange.push(req.query.fromDate)
    }
    if(req.query.toDate){
        let isValidDate = Date.parse(req.query.toDate)
        if(isNaN(isValidDate)){
            return res.status(400).send({valid:false,error:"fromDate is not valid. Must be YYYY-MM-DD"})
        }
        dateRange.push(req.query.toDate)
    }
    if(dateRange.length == 2){
        whereStatement.transactionDate = {[Op.between] : dateRange}
    }
    try {
        const transactions = await Transaction.findAll({
            include : [{
                model : Category,
                attributes : ["category","transactionType"]
            },{
                model:Wallet,
                attributes : ["walletName"],
                include : [{
                    model : Currency,
                    attributes : ["currency","symbol"]
                }],
                where : whereStatemenForWallet
            }],
            where : whereStatement,
            order : [['transactionDate','DESC']]
        })
        res.status(200).send({valid:true,transactions})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.get("/transactions/:id",firebaseAuth,async(req,res) => {
    const transactionId = req.params.id
    try {
        const transaction = await Transaction.findByPk(transactionId,{
            include : [{
                model:Category,
                attributes : ["category","transactionType"]
            },{
                model:Wallet,
                attributes : ["walletName"],
                include : [{
                    model : Currency,
                    attributes : ["currency","symbol"]
                }]
            }]
        })
        if(transaction){
            return res.status(200).send({valid:true,transaction})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false})
    }
})

router.patch("/transactions/:id", firebaseAuth, async (req, res) => {
    //validation for valid updates
    const fieldsToUpdate = Object.keys(req.body)
    const allowedUpdates = ["note","ammount","categoryId","walletId","transactionDate"]
    const allowedToUpdate = fieldsToUpdate.every((field) => allowedUpdates.includes(field))
    if(!allowedToUpdate){
        return res.status(400).send({valid:false, error : "Invalid Updates"})
    }
    //validation of ammount
    if(typeof req.body.ammount == "number"){
        if(req.body.ammount < 0){
            return res.status(400).send({valid:false,error:"Ammount must be a positive number!"})
        }
        const category = await Category.findByPk(req.body.categoryId)
        if(category.transactionType == "outcome"){
            req.body.ammount = req.body.ammount * -1
        }
    }
    const transactionId = req.params.id
    try {
        const transaction = await Transaction.findByPk(transactionId)
        if(!transaction){
            return res.status(404).send({valid:false})
        }
        fieldsToUpdate.forEach((field) => {transaction[field] = req.body[field]})
        await transaction.save();
        res.status(200).send({valid:true,transaction})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.delete("/transactions/:id", firebaseAuth, async (req,res)=>{
    const transactionId = req.params.id
    try {
        const destroyedNumber = await Transaction.destroy({
            where : {id:transactionId}
        })
        if(destroyedNumber){
            return res.status(200).send({valid:true})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

/*
PENDIENTE

crear transacciones
editar transacciones

*agregar fecha de transacci??n, para que se ingrese manualmente

resumen de transacciones por periodo
??el total que se calcule en el frontend?
??enviar una variable adicional con el total ya calculado?
??endpoint diferente resumido por cada wallet? -> {waletid:1,transactions:{}}

*/

module.exports = router