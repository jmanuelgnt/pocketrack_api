const express = require('express')
const router = new express.Router();
const Wallet = require('../models/wallet')

router.post('/wallet', async (req,res) => {
    const objWallet = req.body
    try {
        await Wallet.create(objWallet)
        res.status(201).send('Wallet created succesfully')
    } catch (error) {
        res.status(400).send(error)
    }
    
})
//create wallet

module.exports = router