const express = require('express');
const { Op } = require('sequelize');
const router = new express.Router();
const firebaseAuth = require('../middlewares/auth');
const Category = require('../models/category');
const Currency = require('../models/currency');
const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');

router.post('/transactions', firebaseAuth, async (req,res) => {
    try {
        if(typeof req.body.ammount == "number"){
            const category = await Category.findByPk(req.body.categoryId)
            if(category.transactionType == "outcome"){
                req.body.ammount = req.body.ammount * -1
            }
        }
        const newTransaction = Transaction.build(req.body)
        await newTransaction.save()
        res.status(200).send({valid:true,newTransaction})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

//filtro por query, para buscar por ?note=searchString&category=1
router.get('/transactions', firebaseAuth, async(req,res) => {
    const whereStatement = {}
    if(req.query.note){
        whereStatement.note = {[Op.like] : `%${req.query.note}%`}
    }
    if(req.query.category){
        whereStatement.categoryId = req.query.category
    }
    try {
        const transactions = await Transaction.findAndCountAll({
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
                where : {
                    userId : req.user.id
                }
            }],
            where : whereStatement
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

module.exports = router