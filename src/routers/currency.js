const express = require('express')
const router = new express.Router();
const firebaseAuth = require('../middlewares/auth');
const Currency = require('../models/currency');

router.post("/currencies", firebaseAuth, async (req, res) => {
    try {
        const newCurrency = await Currency.build(req.body)
        await newCurrency.save()
        res.status(201).send({valid:true,newCurrency})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

//falta implementar paginacion
router.get("/currencies",firebaseAuth,async (req,res)=>{
    try {
        const currencies = await Currency.findAll()
        res.status(200).send({valid:true,currencies})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.get("/currencies/:id", firebaseAuth, async (req, res) => {
    const currencyId = req.params.id
    try {
        const currency = await Currency.findByPk(currencyId)
        if(currency){
            return res.status(200).send({valid:true,currency})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.patch("/currencies/:id", firebaseAuth,async (req,res) => {
    const fieldsToUpdate = Object.keys(req.body)
    const allowedUpdates = ["currency","currencyName"]
    const allowedToUpdate = fieldsToUpdate.every((field) => allowedUpdates.includes(field))
    if(!allowedToUpdate){
        return res.status(400).send({valid:false, error : "Invalid Updates"})
    }
    const currencyId = req.params.id
    try {
        const currency = await Currency.findByPk(currencyId)
        if(!currency){
            return res.status(404).send({valid:false})
        }
        fieldsToUpdate.forEach((field) => {currency[field] = req.body[field]})
        await currency.save()
        res.status(200).send({valid:true, currency})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.delete("/currencies/:id", firebaseAuth, async (req,res)=>{
    const currencyId = req.params.id
    try {
        const destroyedNumber = await Currency.destroy({
            where : {id:currencyId}
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