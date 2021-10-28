const User = require('../models/user')
const firebase = require('../services/firebase')

const firebaseAuth = async (req, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
        return res.status(401).send({valid: false, msg:'The request did not include an authentication token or the authentication token was expired.'})
    }
    let idToken = req.headers.authorization.split('Bearer ')[1]
    try {
        const decodedToken = await firebase.auth().verifyIdToken(idToken)
        const existingUser = await User.findByPk(decodedToken.user_id)
        req.user = existingUser
        next(); 
    } catch (error) {
        console.log(error)
        return res.status(401).send({valid: false, msg:'The request did not include an authentication token or the authentication token was expired.'})
    }
}

module.exports = firebaseAuth