const express = require('express')
const router = new express.Router();
const firebaseAuth = require('../middlewares/auth');
const Category = require('../models/category');

router.post("/categories", firebaseAuth, async (req, res) => {
    try {
        const newCategory = Category.build(req.body)
        await newCategory.save()
        res.status(201).send({valid:true,newCategory})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

//falta implementar paginacion
router.get("/categories",firebaseAuth,async (req,res)=>{
    try {
        const categories = await Category.findAll()
        res.status(200).send({valid:true,categories})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.get("/categories/:id", firebaseAuth, async (req, res) => {
    const categoryId = req.params.id
    try {
        const category = await Category.findByPk(categoryId)
        if(category){
            return res.status(200).send({valid:true,category})
        }
        res.status(404).send({valid:false})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.patch("/categories/:id", firebaseAuth,async (req,res) => {
    const fieldsToUpdate = Object.keys(req.body)
    const allowedUpdates = ["category","transactionType"]
    const allowedToUpdate = fieldsToUpdate.every((field) => allowedUpdates.includes(field))
    if(!allowedToUpdate){
        return res.status(400).send({valid:false, error : "Invalid Updates"})
    }
    const categoryId = req.params.id
    try {
        const category = await Category.findByPk(categoryId)
        if(!category){
            return res.status(404).send({valid:false})
        }
        fieldsToUpdate.forEach((field) => {category[field] = req.body[field]})
        await category.save()
        res.status(200).send({valid:true, category})
    } catch (error) {
        res.status(400).send({valid:false,error})
    }
})

router.delete("/categories/:id", firebaseAuth, async (req,res)=>{
    const categoryId = req.params.id
    try {
        const destroyedNumber = await Category.destroy({
            where : {id:categoryId}
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