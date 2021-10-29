const express = require('express');
const cors = require('cors')({origin:true})
const userRouter = require('./routers/user')
const walletRouter = require('./routers/wallet')
const currencyRouter = require('./routers/currency')
const categoryRouter = require('./routers/category')
const Transaction = require('./models/transaction')
const db = require('./db/config')

//Init express
const app = express();

//CORS Cross Origin Resource Sharing
app.use(cors)

//parser
app.use(express.json());

//init database
db.authenticate().then( () => {
    console.log('Conection to database successfull')
}).catch((err) => {
    console.log('Error connecting to database', err)
})

db.sync().then(() => console.log('DB Sync')).catch((error) => console.log('Not Sync',error))
//db.sync().then(() => console.log('DB Sync Force')).catch(() => console.log('Not Sync'))

//controllers
app.use(userRouter)
app.use(walletRouter)
app.use(currencyRouter)
app.use(categoryRouter)

module.exports = app