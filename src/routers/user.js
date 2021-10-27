const express = require('express')
const router = new express.Router();
const firebaseAuth = require('../middlewares/auth');
const User = require('../models/user');

router.post('/users', async(req, res) => {
    try {
        const newUser = await User.build(req.body)
        await newUser.save()
        res.status(201).send({valid:true,newUser})
    } catch (error) {
        res.status(400).send({valid:false, error})
    }
})

router.get('/users/me',firebaseAuth,(req, res) => {
    res.send(req.user)
})

module.exports = router