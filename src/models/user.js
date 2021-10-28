const Sequelize = require('sequelize');
const db = require('../db/config');

const User = db.define('user',{
    id : {
        type: Sequelize.STRING,
        primaryKey:true,
        allowNull : false,
        validate : {
            notEmpty : {
                msg:"User ID must not be empty!"
            }
        }

    },
    mail : {
        type: Sequelize.STRING,
        validate : {
            isEmail : {
                msg : 'Must be a valid email!'
            }
        }
    },
    firstName : {
        type: Sequelize.STRING
    },
    lastName : {
        type: Sequelize.STRING
    }

})

module.exports = User