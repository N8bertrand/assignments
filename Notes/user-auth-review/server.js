const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const PORT = process.env.PORT || 7000


// Middleware fire on every request
app.use(morgan('dev'))
app.use(express.json())


// DB connect
mongoose.connect("mongodb://localhost:27017/auth-practice", 
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, 
() => console.log("Connected to the DB"))


// Routes
app.use("/api", expressJwt({secret: process.env.SECRET})) // creates req.user
app.use("/auth", require("./routes/authRouter.js"))


// Error Handler
app.use((err, req, res, next) => {
    console.error(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

// Listen
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))