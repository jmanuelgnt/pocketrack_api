const express = require('express');
const firebaseAuth = require('../middlewares/auth');
const Currency = require('../models/currency');
const User = require('../models/user');
const router = new express.Router();
const Wallet = require('../models/wallet')


router.post('/wallets', firebaseAuth,async (req,res) => {
    try {
        const newWallet = Wallet.build({...req.body,userId:req.user.id})
        await newWallet.save()
        res.status(201).send({valid:true,newWallet})
    } catch (error) {
        res.status(400).send(error)
    }
    
})

router.get('/wallets',firebaseAuth, async(req,res) => {
    try {
        const wallets = await Wallet.findAll({
            where : {
                userId : req.user.id
            },
            include : [User,Currency]
        })
        res.status(200).send({valid:true,wallets})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.get('/wallets/:id',firebaseAuth, async(req,res) => {
    const currencyId = req.params.id
    try {
        const wallet = await Wallet.findByPk(currencyId,{
            where : {
                userId : req.user.id
            },
            include : [User,Currency]
        })
        if(wallet){
            return res.status(200).send({valid:true,wallet})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.patch('/wallets/:id',firebaseAuth,async(req,res) => {
    const fieldsToUpdate = Object.keys(req.body)
    const allowedUpdates = ["walletName","description","bank","bankAccountNumber","currencyId"]
    const allowedToUpdate = fieldsToUpdate.every((field) => allowedUpdates.includes(field))
    if(!allowedToUpdate){
        return res.status(400).send({valid:false, error : "Invalid Updates"})
    }

    const walletId = req.params.id
    try {
        const wallet = await Wallet.findByPk(walletId, {where : {userId : req.user.id}})
        if(!wallet){
            return res.status(404).send({valid:false})
        }
        fieldsToUpdate.forEach((field) => {wallet[field] = req.body[field]})
        await wallet.save()
        res.status(200).send({valid:true, wallet})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.delete('/wallets/:id', firebaseAuth, async (req,res) => {
    const walletId = req.params.id
    try {
        const destroyedNumber = await Wallet.destroy({
            where : {id:walletId,userId:req.user.id}
        })
        if(destroyedNumber){
            return res.status(200).send({valid:true})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

module.exports = router